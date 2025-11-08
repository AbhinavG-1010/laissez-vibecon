import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    url: '',
    botToken: '',
    price: 0.001
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0.001) {
      setFormData(prev => ({ ...prev, price: value }));
    }
  };

  const incrementPrice = () => {
    setFormData(prev => ({
      ...prev,
      price: parseFloat((prev.price + 0.001).toFixed(3))
    }));
  };

  const decrementPrice = () => {
    setFormData(prev => ({
      ...prev,
      price: Math.max(0.001, parseFloat((prev.price - 0.001).toFixed(3)))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use relative URL - Kubernetes ingress routes /api/* to backend
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.url,
          bot_token: formData.botToken,
          price: formData.price
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Agent configuration saved successfully!', {
          description: data.webhook_info?.webhook_url 
            ? 'Telegram webhook has been set up.' 
            : 'Configuration saved to database.'
        });
        // Reset form
        setFormData({
          url: '',
          botToken: '',
          price: 0.001
        });
      } else {
        toast.error('Failed to save configuration', {
          description: data.detail || 'Please try again.'
        });
      }
    } catch (error) {
      toast.error('Network error', {
        description: 'Unable to connect to the server. Please try again.'
      });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Laissez</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Agent URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url">Agent URL</Label>
                <Input
                  type="url"
                  id="url"
                  name="url"
                  data-testid="agent-url-input"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://your-agent-url.com"
                />
              </div>

              {/* Telegram Bot Token Input */}
              <div className="space-y-2">
                <Label htmlFor="botToken">Telegram Bot Token</Label>
                <Input
                  type="text"
                  id="botToken"
                  name="botToken"
                  data-testid="bot-token-input"
                  value={formData.botToken}
                  onChange={handleInputChange}
                  required
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                />
              </div>

              {/* Price Stepper */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrementPrice}
                    data-testid="price-decrement-button"
                    disabled={formData.price <= 0.001}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    data-testid="price-input"
                    value={formData.price}
                    onChange={handlePriceChange}
                    step="0.001"
                    min="0.001"
                    required
                    className="text-center font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={incrementPrice}
                    data-testid="price-increment-button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum: $0.001 | Increment: $0.001
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                data-testid="submit-button"
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Saving...' : 'Save Configuration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
