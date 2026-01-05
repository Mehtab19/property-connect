import { useState } from 'react';
import { User, Phone, MessageSquare, Send, CheckCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface RequestHumanReviewProps {
  propertyId?: string;
  propertyTitle?: string;
  aiSummary?: string;
  className?: string;
  onSuccess?: () => void;
}

type RequestType = 'viewing' | 'callback' | 'inquiry';

const RequestHumanReview = ({
  propertyId,
  propertyTitle,
  aiSummary,
  className,
  onSuccess,
}: RequestHumanReviewProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>('callback');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        variant: 'destructive',
        title: 'Required Fields',
        description: 'Please fill in your name and phone number.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData: any = {
        lead_type: requestType,
        ai_summary: aiSummary || `User requested ${requestType} for property analysis review`,
        notes: `Name: ${formData.name}\nPhone: ${formData.phone}\n${formData.message ? `Message: ${formData.message}` : ''}`,
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
      };

      if (propertyId) {
        leadData.property_id = propertyId;
      }

      const { error } = await supabase.from('leads').insert(leadData);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Request Submitted!',
        description: 'A property expert will contact you within 24 hours.',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Unable to submit your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={cn('border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20', className)}>
        <CardContent className="py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Request Submitted!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your interest. A property expert will contact you within 24 hours.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', phone: '', message: '' });
            }}
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-primary" />
          Request Human Review
        </CardTitle>
        <CardDescription>
          Connect with a property expert for personalized guidance
          {propertyTitle && <span className="block mt-1 font-medium text-foreground">Re: {propertyTitle}</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Request Type */}
          <div className="space-y-2">
            <Label>How can we help?</Label>
            <RadioGroup
              value={requestType}
              onValueChange={(value) => setRequestType(value as RequestType)}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="callback" id="callback" className="sr-only peer" />
                <Label
                  htmlFor="callback"
                  className="flex flex-col items-center justify-center w-full p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors"
                >
                  <Phone className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Callback</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="viewing" id="viewing" className="sr-only peer" />
                <Label
                  htmlFor="viewing"
                  className="flex flex-col items-center justify-center w-full p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors"
                >
                  <Calendar className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Viewing</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inquiry" id="inquiry" className="sr-only peer" />
                <Label
                  htmlFor="inquiry"
                  className="flex flex-col items-center justify-center w-full p-3 rounded-lg border-2 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-colors"
                >
                  <MessageSquare className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">Inquiry</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Notes (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any specific questions or requirements?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
            />
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Request Expert Review
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Our experts typically respond within 24 hours
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestHumanReview;
