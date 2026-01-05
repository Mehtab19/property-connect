import { useState } from 'react';
import { User, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useHandoff, HandoffContext, HandoffFormData } from '@/hooks/useHandoff';
import { cn } from '@/lib/utils';

interface HandoffFormProps {
  context: HandoffContext;
  triggerReason: string;
  onSuccess?: (leadId: string) => void;
  onCancel?: () => void;
  className?: string;
}

const preferredTimeOptions = [
  { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 8 PM)' },
  { value: 'anytime', label: 'Any time' },
];

const HandoffForm = ({
  context,
  triggerReason,
  onSuccess,
  onCancel,
  className,
}: HandoffFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const { initiateHandoff, isProcessing } = useHandoff();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<HandoffFormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    preferredTime: 'anytime',
    preferredChannel: 'phone',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await initiateHandoff(formData, context, triggerReason);
    
    if (result.success) {
      setIsSubmitted(true);
      if (result.leadId) {
        onSuccess?.(result.leadId);
      }
    }
  };

  const getTriggerMessage = () => {
    switch (triggerReason) {
      case 'siteVisit':
        return 'Schedule a property visit with an expert';
      case 'negotiation':
        return 'Connect with an agent for negotiation';
      case 'legal':
        return 'Get legal assistance for your property';
      case 'financing':
        return 'Speak with a mortgage specialist';
      case 'lowConfidence':
        return 'Get personalized assistance from an expert';
      case 'userRequested':
        return 'Connect with a property expert';
      default:
        return 'Request human assistance';
    }
  };

  if (isSubmitted) {
    return (
      <Card className={cn('border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20', className)}>
        <CardContent className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Request Submitted!</h3>
          <p className="text-muted-foreground mb-4">
            An agent has been assigned to your request and will contact you shortly via your preferred channel.
          </p>
          <Button variant="outline" onClick={onCancel}>
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCheck className="h-5 w-5 text-primary" />
          Talk to an Agent
        </CardTitle>
        <CardDescription>{getTriggerMessage()}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="handoff-name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Full Name *
            </Label>
            <Input
              id="handoff-name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email & Phone in row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="handoff-email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email *
              </Label>
              <Input
                id="handoff-email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handoff-phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Phone *
              </Label>
              <Input
                id="handoff-phone"
                type="tel"
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="handoff-time" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Preferred Contact Time
            </Label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
            >
              <SelectTrigger id="handoff-time">
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                {preferredTimeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Communication Channel */}
          <div className="space-y-2">
            <Label>Preferred Communication Channel</Label>
            <RadioGroup
              value={formData.preferredChannel}
              onValueChange={(value) => setFormData({ ...formData, preferredChannel: value as HandoffFormData['preferredChannel'] })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="channel-phone" />
                <Label htmlFor="channel-phone" className="cursor-pointer font-normal">
                  Phone Call
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="channel-whatsapp" />
                <Label htmlFor="channel-whatsapp" className="cursor-pointer font-normal">
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="channel-email" />
                <Label htmlFor="channel-email" className="cursor-pointer font-normal">
                  Email
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="handoff-message" className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="handoff-message"
              placeholder="Any specific questions or requirements?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isProcessing}>
              {isProcessing ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Connect with Agent
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            An agent will be assigned based on property location and availability
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default HandoffForm;
