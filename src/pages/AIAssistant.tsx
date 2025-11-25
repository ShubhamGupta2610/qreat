import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  'Show me popular starters',
  'What are your main courses?',
  'Recommend a dessert',
  'Tell me about discounts',
  'How do I track my order?',
];

const responses: Record<string, string> = {
  'show me popular starters': 'Our most popular starters include Caesar Salad, Bruschetta, and Chicken Wings. All are freshly prepared and highly rated by our customers!',
  'what are your main courses': 'We offer delicious main courses including Grilled Steak, Salmon Fillet, and Pasta Carbonara. Each dish is prepared with premium ingredients.',
  'recommend a dessert': 'I highly recommend our Chocolate Cake or Tiramisu! Both are customer favorites and perfect for ending your meal on a sweet note.',
  'tell me about discounts': 'We have a loyalty rewards program! Spend $50+ for 5% off, $100+ for 10% off, $200+ for 15% off, and $500+ for 20% off on all future orders.',
  'how do i track my order': 'You can track your order status in the "My Orders" section. Your order will go through: Received → Preparing → Delivered → Completed.',
  'default': 'Thank you for your message! I can help you with menu recommendations, order assistance, and information about our loyalty program. Feel free to ask me anything!',
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! 👋 I\'m your RQEAT AI assistant. I can help you with menu recommendations, answer questions about our dishes, and assist with your orders. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const responseKey = messageText.toLowerCase();
      const responseText = responses[responseKey] || responses['default'];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">AI Assistant</h1>
        <p className="text-muted-foreground">Get help with menu recommendations and order assistance</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[500px] overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickActions.map(action => (
                  <Badge
                    key={action}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => handleSend(action)}
                  >
                    {action}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={() => handleSend()} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
