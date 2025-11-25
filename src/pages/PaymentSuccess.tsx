import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setMessage('Invalid payment session');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
        body: JSON.stringify({ sessionId }),
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        throw new Error(errorMsg || 'Failed to verify payment');
      }

      if (data?.verified) {
        setStatus('success');
        setMessage('Your payment has been processed successfully!');
      } else {
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to verify payment');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center shadow-warm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'error' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-accent" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>

          <p className="text-muted-foreground">{message}</p>

          {status === 'success' && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate('/orders')}
              >
                View My Orders
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => navigate('/cart')}
              >
                Return to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
