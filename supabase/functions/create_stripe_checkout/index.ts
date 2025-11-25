import { createClient } from "jsr:@supabase/supabase-js@2";
import Stripe from "npm:stripe@19.1.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

const successUrlPath = '/payment-success?session_id={CHECKOUT_SESSION_ID}';
const cancelUrlPath = '/cart';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CheckoutRequest {
  items: OrderItem[];
  customerName: string;
  customerMobile: string;
  tableNumber?: string;
  currency?: string;
  payment_method_types?: string[];
}

function ok(data: unknown): Response {
  return new Response(
    JSON.stringify({ code: "SUCCESS", message: "Success", data }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function fail(msg: string, code = 400): Response {
  return new Response(
    JSON.stringify({ code: "FAIL", message: msg }),
    {
      status: code,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    }
  );
}

function validateCheckoutRequest(request: CheckoutRequest): void {
  if (!request.items?.length) {
    throw new Error("Items cannot be empty");
  }
  if (!request.customerName?.trim()) {
    throw new Error("Customer name is required");
  }
  if (!request.customerMobile?.trim()) {
    throw new Error("Customer mobile is required");
  }
  for (const item of request.items) {
    if (!item.name || item.price <= 0 || item.quantity <= 0) {
      throw new Error("Invalid item information");
    }
  }
}

async function calculateDiscount(userId: string | null, subtotal: number) {
  if (!userId) return { discountAmount: 0, discountPercentage: 0 };

  const { data: profile } = await supabase
    .from('profiles')
    .select('total_spent')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) return { discountAmount: 0, discountPercentage: 0 };

  const { data: discounts } = await supabase
    .from('discounts')
    .select('*')
    .eq('active', true)
    .order('min_spending', { ascending: false });

  if (!discounts || discounts.length === 0) {
    return { discountAmount: 0, discountPercentage: 0 };
  }

  const applicableDiscount = discounts.find(d => profile.total_spent >= d.min_spending);

  if (!applicableDiscount) {
    return { discountAmount: 0, discountPercentage: 0 };
  }

  const discountAmount = Math.round((subtotal * applicableDiscount.discount_percentage) / 100);
  return { discountAmount, discountPercentage: applicableDiscount.discount_percentage };
}

async function createCheckoutSession(
  stripe: Stripe,
  userId: string | null,
  request: CheckoutRequest,
  origin: string
) {
  const subtotal = request.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { discountAmount, discountPercentage } = await calculateDiscount(userId, subtotal);
  const totalAmount = subtotal - discountAmount;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      customer_name: request.customerName,
      customer_mobile: request.customerMobile,
      table_number: request.tableNumber || null,
      items: request.items,
      subtotal: subtotal,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      currency: (request.currency || 'usd').toLowerCase(),
      status: "pending",
    })
    .select()
    .maybeSingle();

  if (error) throw new Error(`Failed to create order: ${error.message}`);

  const session = await stripe.checkout.sessions.create({
    line_items: request.items.map(item => ({
      price_data: {
        currency: (request.currency || 'usd').toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${origin}${successUrlPath}`,
    cancel_url: `${origin}${cancelUrlPath}`,
    payment_method_types: request.payment_method_types || ['card'],
    discounts: discountAmount > 0 ? [{
      coupon: await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',
        name: `${discountPercentage}% Loyalty Discount`,
      }).then(c => c.id)
    }] : [],
    metadata: {
      order_id: order.id,
      user_id: userId || "",
    },
  });

  await supabase
    .from("orders")
    .update({
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
    })
    .eq("id", order.id);

  return { order, session };
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    const request = await req.json();
    validateCheckoutRequest(request);

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user } } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null } };

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "";
    const { order, session } = await createCheckoutSession(
      stripe,
      user?.id || null,
      request,
      origin
    );

    return ok({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Payment processing failed", 500);
  }
});
