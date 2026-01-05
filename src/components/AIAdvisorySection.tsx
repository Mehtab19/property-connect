/**
 * AI Advisory Section Component
 * Fully Automated AI Advisory section
 */

import { useState } from 'react';
import { Bot, Check, Rocket, Send } from 'lucide-react';

const AIAdvisorySection = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your PropertyX AI Advisor. How can I help you with your real estate needs today?" },
    { type: 'user', text: "I'm looking for investment properties with good ROI potential." },
    { type: 'bot', text: "Great! Based on current market data, I recommend considering these areas with high growth potential. Would you like me to show you specific properties?" },
  ]);
  const [inputValue, setInputValue] = useState('');

  const features = [
    { title: '24/7 Availability', description: 'Get advice anytime, anywhere' },
    { title: 'Data-Driven Insights', description: 'Based on real-time market analysis' },
    { title: 'Personalized Recommendations', description: 'Tailored to your specific needs' },
    { title: 'Zero Bias', description: 'No sales pressure or commission-driven advice' },
    { title: 'Instant Responses', description: 'No waiting for human availability' },
    { title: 'Advanced Analytics', description: 'ROI projections and risk assessment' },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { type: 'user', text: inputValue }]);
    setInputValue('');
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "Thank you for your question! Our AI is analyzing the best options for you. A property advisor will follow up with personalized recommendations." 
      }]);
    }, 1000);
  };

  return (
    <section id="ai-advisory" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Fully Automated AI Advisory</h2>
          <p>
            Our advanced PropertyX Intelligence engine provides personalized real estate guidance 24/7 without human involvement
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div>
            <h3 className="text-3xl font-bold text-primary mb-6">Human-Free Real Estate Advisory</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Our AI-powered advisory system analyzes your preferences, financial situation, and market data to provide personalized property recommendations and investment strategies.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-primary">{feature.title}:</strong>{' '}
                    <span className="text-muted-foreground">{feature.description}</span>
                  </span>
                </li>
              ))}
            </ul>

            <a href="#" className="btn-primary">
              <Rocket className="w-5 h-5" />
              Start AI Consultation
            </a>
          </div>

          {/* Demo Chat Side */}
          <div className="bg-muted rounded-2xl p-6 shadow-card border border-border">
            {/* Demo Header */}
            <div className="flex items-center gap-3 mb-6">
              <Bot className="w-8 h-8 text-secondary" />
              <h4 className="text-xl font-bold text-primary">PropertyX AI Advisor</h4>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto bg-white rounded-xl border border-border p-4 mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl max-w-[85%] animate-fade-in ${
                    message.type === 'bot'
                      ? 'bg-muted rounded-bl-sm'
                      : 'bg-primary text-white rounded-br-sm ml-auto'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about properties, investments, or market trends..."
                className="flex-1 px-4 py-3 rounded-full border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvisorySection;
