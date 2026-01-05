import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your PropertyX AI assistant. How can I help you today with your real estate needs?",
      type: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (input: string): string => {
    const text = input.toLowerCase();

    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return 'Hello! 👋 How can I assist you today with your property search?';
    }

    if (text.includes('property') || text.includes('apartment') || text.includes('villa') || text.includes('house')) {
      return 'We have premium verified properties across India. Would you like me to help you find properties based on your budget, location, or property type preferences?';
    }

    if (text.includes('partner') || text.includes('builder') || text.includes('developer')) {
      return 'We collaborate with 50+ trusted developers who pass our rigorous due diligence process. You can explore them in the Partners section below.';
    }

    if (text.includes('meeting') || text.includes('schedule') || text.includes('book') || text.includes('appointment')) {
      return 'I can help you schedule a meeting with our property experts! Please visit the Schedule Meeting section or click the "Schedule Meeting" button in the navigation.';
    }

    if (text.includes('contact') || text.includes('phone') || text.includes('email')) {
      return 'You can reach us at info@propertyx.com or call +91 (555) 123-4567. Our team is available Monday to Saturday, 9 AM to 7 PM.';
    }

    if (text.includes('invest') || text.includes('roi') || text.includes('return')) {
      return 'Our Investment Tools section offers ROI Calculator, Affordability Assessment, and Property Comparison features. Would you like me to guide you through any of these?';
    }

    if (text.includes('price') || text.includes('cost') || text.includes('budget')) {
      return 'Our verified properties range from ₹25 Lakhs to ₹10+ Crores. What budget range are you considering?';
    }

    if (text.includes('location') || text.includes('area') || text.includes('city')) {
      return 'We have properties in major Indian cities including Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, and Pune. Which location interests you?';
    }

    if (text.includes('thanks') || text.includes('thank you')) {
      return "You're most welcome! 😊 Let me know if you need anything else. I'm here to help!";
    }

    const defaultResponses = [
      'Could you please elaborate a bit more on what you\'re looking for?',
      'I\'m here to help with properties, investment tools, or scheduling meetings. What interests you?',
      'Let me help you find the perfect property. Tell me about your requirements!',
      'I can assist you with property search, investment calculations, or connecting with our experts.',
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(userMessage.text),
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          // For demo, we'll show a message that voice was recorded
          // In production, this would send to a speech-to-text API
          stream.getTracks().forEach((track) => track.stop());
          
          const processingMessage: Message = {
            id: Date.now().toString(),
            text: '🎤 Voice message received! (Voice processing coming soon)',
            type: 'user',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, processingMessage]);

          setTimeout(() => {
            const botResponse: Message = {
              id: (Date.now() + 1).toString(),
              text: 'I received your voice message! Voice-to-text processing will be available soon. For now, please type your query.',
              type: 'bot',
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
          }, 1000);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Microphone error:', error);
        alert('Please allow microphone access to use voice input.');
      }
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Container */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[500px] bg-background rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">PropertyX AI</h3>
                <p className="text-white/80 text-xs">Online • Ready to help</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 transition-transform hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300',
                    message.type === 'user' ? 'ml-auto' : 'mr-auto'
                  )}
                >
                  <div
                    className={cn(
                      'p-3 rounded-2xl',
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-md'
                        : 'bg-gradient-to-r from-primary to-secondary text-white rounded-bl-md'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  {message.type === 'bot' && (
                    <button
                      onClick={() => speakMessage(message.text)}
                      className="mt-1 p-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-white transition-all hover:scale-110"
                      title="Listen to message"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="mr-auto">
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-full border-muted"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={cn(
                'rounded-full transition-colors',
                isRecording
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'hover:bg-secondary hover:text-secondary-foreground'
              )}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={sendMessage}
              size="icon"
              className="rounded-full bg-secondary hover:bg-secondary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg transition-all hover:scale-110',
          'animate-pulse hover:animate-none'
        )}
        style={{
          boxShadow: '0 8px 25px rgba(15, 118, 110, 0.4)',
        }}
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
