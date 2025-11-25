import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, ShoppingCart, Award, Bot, Clock } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Diverse Menu',
      description: 'Explore our wide selection of starters, main courses, desserts, and fast food',
    },
    {
      icon: ShoppingCart,
      title: 'Easy Ordering',
      description: 'Simple and intuitive ordering process with real-time cart management',
    },
    {
      icon: Award,
      title: 'Loyalty Rewards',
      description: 'Earn automatic discounts based on your spending history',
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Get personalized recommendations and instant help with our AI agent',
    },
    {
      icon: Clock,
      title: 'Order Tracking',
      description: 'Track your order status from preparation to delivery',
    },
  ];

  return (
    <div>
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://miaoda-site-img.s3cdn.medo.dev/images/36b1a247-838b-4fe1-a81d-90720d56e19b.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 gradient-text">
            Welcome to RQEAT
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience delicious dining with our easy online ordering system. 
            Browse our menu, place orders, and enjoy exclusive loyalty rewards.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate('/menu')} className="shadow-glow">
              <UtensilsCrossed className="mr-2 h-5 w-5" />
              Browse Menu
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/ai-assistant')}>
              <Bot className="mr-2 h-5 w-5" />
              AI Assistant
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose RQEAT?</h2>
          <p className="text-muted-foreground text-lg">
            Enjoy a seamless dining experience with our modern features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-warm hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Loyalty Rewards Program</h2>
              <p className="text-muted-foreground text-lg mb-6">
                The more you order, the more you save! Our automatic discount system rewards 
                loyal customers with increasing discounts based on total spending.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">5%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Bronze Tier</p>
                    <p className="text-sm text-muted-foreground">Spend ₹50+ to unlock</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">10%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Silver Tier</p>
                    <p className="text-sm text-muted-foreground">Spend ₹100+ to unlock</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">15%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Gold Tier</p>
                    <p className="text-sm text-muted-foreground">Spend ₹200+ to unlock</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">20%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Platinum Tier</p>
                    <p className="text-sm text-muted-foreground">Spend ₹500+ to unlock</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-warm">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/6da6c918-2a90-4fa3-9504-bc9ee56d5159.jpg"
                alt="Restaurant interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Order?</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Start exploring our delicious menu and enjoy the convenience of online ordering
        </p>
        <Button size="lg" onClick={() => navigate('/menu')} className="shadow-glow">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Start Ordering Now
        </Button>
      </section>
    </div>
  );
}
