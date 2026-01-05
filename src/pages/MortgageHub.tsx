import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Percent, Calculator, Phone, Globe, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Sample mortgage partners (would come from database in production)
const samplePartners = [
  {
    id: '1',
    bank_name: 'HDFC Bank',
    interest_rate_min: 8.5,
    interest_rate_max: 9.75,
    max_loan_amount: 50000000,
    max_tenure_years: 30,
    processing_fee_percent: 0.5,
    features: ['Quick Approval', 'No Hidden Charges', 'Flexible EMI Options', 'Top-up Loans'],
    logo_url: '/placeholder.svg',
    verified: true,
  },
  {
    id: '2',
    bank_name: 'SBI Home Loans',
    interest_rate_min: 8.25,
    interest_rate_max: 9.5,
    max_loan_amount: 100000000,
    max_tenure_years: 30,
    processing_fee_percent: 0.35,
    features: ['Lowest Interest Rates', 'Government Backed', 'No Prepayment Penalty', 'Balance Transfer'],
    logo_url: '/placeholder.svg',
    verified: true,
  },
  {
    id: '3',
    bank_name: 'ICICI Bank',
    interest_rate_min: 8.6,
    interest_rate_max: 9.85,
    max_loan_amount: 75000000,
    max_tenure_years: 25,
    processing_fee_percent: 0.5,
    features: ['Instant Approval', 'Digital Process', 'Doorstep Service', 'Insurance Benefits'],
    logo_url: '/placeholder.svg',
    verified: true,
  },
  {
    id: '4',
    bank_name: 'Axis Bank',
    interest_rate_min: 8.55,
    interest_rate_max: 10.05,
    max_loan_amount: 50000000,
    max_tenure_years: 30,
    processing_fee_percent: 1.0,
    features: ['Fast Processing', 'Flexible Tenure', 'Online Tracking', 'Low Documentation'],
    logo_url: '/placeholder.svg',
    verified: true,
  },
];

const MortgageHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Lead Form State
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate EMI
  useEffect(() => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfPayments = tenure * 12;
    
    if (ratePerMonth > 0) {
      const emiValue = principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfPayments) / 
        (Math.pow(1 + ratePerMonth, numberOfPayments) - 1);
      
      setEmi(Math.round(emiValue));
      setTotalPayment(Math.round(emiValue * numberOfPayments));
      setTotalInterest(Math.round(emiValue * numberOfPayments - principal));
    }
  }, [loanAmount, interestRate, tenure]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const handleLeadSubmit = async (partnerId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to request a callback from mortgage partners.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    setSelectedPartner(partnerId);

    try {
      const { error } = await supabase.from('leads').insert({
        user_id: user!.id,
        mortgage_partner_id: partnerId,
        lead_type: 'mortgage',
        ai_summary: `User interested in mortgage. Loan amount: ${formatCurrency(loanAmount)}, Tenure: ${tenure} years`,
        notes: `Calculated EMI: ${formatCurrency(emi)}/month`,
      });

      if (error) throw error;

      toast({
        title: 'Request Submitted!',
        description: 'A mortgage advisor will contact you within 24 hours.',
      });
    } catch (error) {
      console.error('Lead submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Unable to submit your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setSelectedPartner(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Mortgage & Financing Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare mortgage rates, calculate EMIs, and connect with trusted lending partners
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* EMI Calculator */}
          <Card className="lg:col-span-1 h-fit sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                EMI Calculator
              </CardTitle>
              <CardDescription>Calculate your monthly mortgage payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Loan Amount</Label>
                  <span className="text-sm font-medium text-primary">{formatCurrency(loanAmount)}</span>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={([value]) => setLoanAmount(value)}
                  min={500000}
                  max={100000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹5L</span>
                  <span>₹10Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Interest Rate</Label>
                  <span className="text-sm font-medium text-primary">{interestRate}%</span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={([value]) => setInterestRate(value)}
                  min={6}
                  max={15}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Loan Tenure</Label>
                  <span className="text-sm font-medium text-primary">{tenure} years</span>
                </div>
                <Slider
                  value={[tenure]}
                  onValueChange={([value]) => setTenure(value)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 yr</span>
                  <span>30 yrs</span>
                </div>
              </div>

              <Separator />

              {/* Results */}
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Monthly EMI</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(emi)}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Interest</p>
                    <p className="font-semibold text-foreground">{formatCurrency(totalInterest)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Payment</p>
                    <p className="font-semibold text-foreground">{formatCurrency(totalPayment)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mortgage Partners */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              Trusted Mortgage Partners
            </h2>
            
            {samplePartners.map(partner => (
              <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Bank Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {partner.bank_name}
                            {partner.verified && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Up to {formatCurrency(partner.max_loan_amount)} • {partner.max_tenure_years} years
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {partner.features.map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Rates & CTA */}
                    <div className="flex flex-col items-end justify-between min-w-[200px]">
                      <div className="text-right mb-4">
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="text-2xl font-bold text-primary">
                          {partner.interest_rate_min}% - {partner.interest_rate_max}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Processing: {partner.processing_fee_percent}%
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => handleLeadSubmit(partner.id)}
                        disabled={isSubmitting && selectedPartner === partner.id}
                        className="w-full md:w-auto"
                      >
                        {isSubmitting && selectedPartner === partner.id ? (
                          'Submitting...'
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-2" />
                            Request Callback
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Info Card */}
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Are you a Mortgage Partner?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our network of trusted lending partners and connect with qualified property buyers.
                </p>
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Partner with Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MortgageHub;
