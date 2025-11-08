import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    url: '',
    botToken: '',
    price: 0.001
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setMessage({ type: '', text: '' });

    try {
      // Use relative URL for deployment compatibility
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
        setMessage({ type: 'success', text: 'Agent configuration saved successfully!' });
        // Reset form
        setFormData({
          url: '',
          botToken: '',
          price: 0.001
        });
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to save configuration' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">Laissez</h1>
        
        <div className="bg-card border border-border rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agent URL Input */}
            <div className="space-y-2">
              <label htmlFor="url" className="block text-sm font-medium text-foreground">
                Agent URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                data-testid="agent-url-input"
                value={formData.url}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="https://your-agent-url.com"
              />
            </div>

            {/* Telegram Bot Token Input */}
            <div className="space-y-2">
              <label htmlFor="botToken" className="block text-sm font-medium text-foreground">
                Telegram Bot Token
              </label>
              <input
                type="text"
                id="botToken"
                name="botToken"
                data-testid="bot-token-input"
                value={formData.botToken}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              />
            </div>

            {/* Price Stepper */}
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-foreground">
                Price (USD)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={decrementPrice}
                  data-testid="price-decrement-button"
                  disabled={formData.price <= 0.001}
                  className="px-4 py-2 bg-secondary hover:bg-accent text-foreground rounded-md font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  −
                </button>
                <input
                  type="number"
                  id="price"
                  name="price"
                  data-testid="price-input"
                  value={formData.price}
                  onChange={handlePriceChange}
                  step="0.001"
                  min="0.001"
                  required
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-foreground text-center font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={incrementPrice}
                  data-testid="price-increment-button"
                  className="px-4 py-2 bg-secondary hover:bg-accent text-foreground rounded-md font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum: $0.001 | Increment: $0.001
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              data-testid="submit-button"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </button>

            {/* Message Display */}
            {message.text && (
              <div
                data-testid="message-display"
                className={`p-3 rounded-md text-sm ${
                  message.type === 'success'
                    ? 'bg-accent text-accent-foreground border border-border'
                    : 'bg-destructive/10 text-destructive border border-destructive/20'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;