import { useState } from 'react';
import { Bot, Loader2, Home, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AnalysisFormData) => void;
  isLoading: boolean;
}

export interface AnalysisFormData {
  role: 'buyer' | 'investor';
  financingType?: 'cash' | 'mortgage';
  downPayment?: number;
  monthlyBudget?: number;
  expectedRent?: number;
}

const AnalysisModal = ({ open, onOpenChange, onSubmit, isLoading }: AnalysisModalProps) => {
  const { role: userRole } = useAuth();
  
  // Default to user's role if buyer or investor, otherwise ask
  const defaultRole = userRole === 'buyer' ? 'buyer' : userRole === 'investor' ? 'investor' : undefined;
  
  const [step, setStep] = useState<1 | 2>(defaultRole ? 2 : 1);
  const [formData, setFormData] = useState<AnalysisFormData>({
    role: defaultRole || 'buyer',
    financingType: 'mortgage',
    downPayment: 20,
    monthlyBudget: 2000,
    expectedRent: 1500,
  });

  const handleRoleSelect = (role: 'buyer' | 'investor') => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      // Reset form when closed
      setTimeout(() => {
        setStep(defaultRole ? 2 : 1);
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            PropertyX Analysis
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Tell us your goal to get personalized analysis" 
              : formData.role === 'buyer' 
                ? "Confirm your financing details for accurate analysis"
                : "Provide investment assumptions for better insights"
            }
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Generating your personalized analysis...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
          </div>
        ) : step === 1 ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              What's your primary goal for this property?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('buyer')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Buy to Live</p>
                  <p className="text-xs text-muted-foreground">Personal residence</p>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('investor')}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Buy to Invest</p>
                  <p className="text-xs text-muted-foreground">Rental income / appreciation</p>
                </div>
              </button>
            </div>
          </div>
        ) : formData.role === 'buyer' ? (
          <div className="space-y-6 py-4">
            {/* Financing Type */}
            <div className="space-y-3">
              <Label>Financing Type</Label>
              <RadioGroup
                value={formData.financingType}
                onValueChange={(value) => setFormData({ ...formData, financingType: value as 'cash' | 'mortgage' })}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem value="cash" id="cash" className="sr-only peer" />
                  <Label
                    htmlFor="cash"
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all",
                      "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    )}
                  >
                    Cash Purchase
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="mortgage" id="mortgage" className="sr-only peer" />
                  <Label
                    htmlFor="mortgage"
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all",
                      "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    )}
                  >
                    Mortgage
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.financingType === 'mortgage' && (
              <>
                {/* Down Payment */}
                <div className="space-y-2">
                  <Label htmlFor="downPayment">Down Payment (%)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.downPayment}
                    onChange={(e) => setFormData({ ...formData, downPayment: Number(e.target.value) })}
                    placeholder="20"
                  />
                </div>

                {/* Monthly Budget */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyBudget">Monthly Budget for EMI ($)</Label>
                  <Input
                    id="monthlyBudget"
                    type="number"
                    min={0}
                    value={formData.monthlyBudget}
                    onChange={(e) => setFormData({ ...formData, monthlyBudget: Number(e.target.value) })}
                    placeholder="2000"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {!defaultRole && (
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
              )}
              <Button onClick={handleSubmit} className="flex-1">
                <Bot className="w-4 h-4 mr-2" />
                Run Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Expected Rent */}
            <div className="space-y-2">
              <Label htmlFor="expectedRent">Expected Monthly Rent ($)</Label>
              <Input
                id="expectedRent"
                type="number"
                min={0}
                value={formData.expectedRent}
                onChange={(e) => setFormData({ ...formData, expectedRent: Number(e.target.value) })}
                placeholder="1500"
              />
              <p className="text-xs text-muted-foreground">
                Leave as estimate or enter known market rent for this area
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              {!defaultRole && (
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
              )}
              <Button onClick={handleSubmit} className="flex-1">
                <Bot className="w-4 h-4 mr-2" />
                Run Analysis
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;
