/**
 * Onboarding Page
 * Multi-step wizard for role selection and preference collection
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, TrendingUp, Building2, Users, Check, ArrowRight, ArrowLeft,
  User, Phone, MapPin, Globe, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Role = 'buyer' | 'investor' | 'developer' | 'broker';

interface ProfileData {
  fullName: string;
  phone: string;
  city: string;
  language: string;
  whatsappOptIn: boolean;
}

interface BuyerPreferences {
  purpose: 'live' | 'commercial' | 'mixed';
  budgetMin: number;
  budgetMax: number;
  locations: string;
  financing: 'cash' | 'mortgage';
  downPayment?: number;
  monthlyBudget?: number;
}

interface InvestorPreferences {
  strategy: 'yield' | 'appreciation' | 'balanced';
  budgetMin: number;
  budgetMax: number;
  holdingPeriod: number;
  riskAppetite: 'low' | 'medium' | 'high';
  offPlanOk: boolean;
  jointInvestor: boolean;
  targetYieldMin: number;
}

interface DeveloperData {
  companyName: string;
  licenseNo: string;
  areasServed: string;
}

interface AgentData {
  agencyName: string;
  licenseNo: string;
  areasServed: string;
  specialties: string[];
  languages: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Role
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Step 2: Profile
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    phone: '',
    city: '',
    language: 'English',
    whatsappOptIn: false,
  });
  
  // Step 3: Role-specific data
  const [buyerPrefs, setBuyerPrefs] = useState<BuyerPreferences>({
    purpose: 'live',
    budgetMin: 100000,
    budgetMax: 500000,
    locations: '',
    financing: 'cash',
    downPayment: 20,
    monthlyBudget: 2000,
  });
  
  const [investorPrefs, setInvestorPrefs] = useState<InvestorPreferences>({
    strategy: 'balanced',
    budgetMin: 200000,
    budgetMax: 1000000,
    holdingPeriod: 36,
    riskAppetite: 'medium',
    offPlanOk: false,
    jointInvestor: false,
    targetYieldMin: 5,
  });
  
  const [developerData, setDeveloperData] = useState<DeveloperData>({
    companyName: '',
    licenseNo: '',
    areasServed: '',
  });
  
  const [agentData, setAgentData] = useState<AgentData>({
    agencyName: '',
    licenseNo: '',
    areasServed: '',
    specialties: [],
    languages: '',
  });

  const roles = [
    { id: 'buyer' as Role, icon: Home, title: 'Buyer', description: 'Looking to buy a home to live in' },
    { id: 'investor' as Role, icon: TrendingUp, title: 'Investor', description: 'Seeking investment opportunities' },
    { id: 'developer' as Role, icon: Building2, title: 'Developer', description: 'List and sell properties' },
    { id: 'broker' as Role, icon: Users, title: 'Agent/Broker', description: 'Represent clients in transactions' },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }
    if (currentStep === 2 && !profile.fullName) {
      toast.error('Please enter your name');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    
    try {
      // If user is authenticated, save to database
      if (isAuthenticated && user) {
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: profile.fullName,
            phone: profile.phone,
          })
          .eq('user_id', user.id);

        if (profileError) throw profileError;

        // Save role-specific preferences
        if (selectedRole === 'buyer') {
          const { error } = await supabase
            .from('buyer_preferences')
            .upsert({
              user_id: user.id,
              budget_min: buyerPrefs.budgetMin,
              budget_max: buyerPrefs.budgetMax,
              preferred_cities: buyerPrefs.locations.split(',').map(s => s.trim()).filter(Boolean),
              property_types: [buyerPrefs.purpose],
              financing_status: buyerPrefs.financing,
              notes: buyerPrefs.financing === 'mortgage' 
                ? `Down payment: ${buyerPrefs.downPayment}%, Monthly budget: $${buyerPrefs.monthlyBudget}`
                : null,
            });
          if (error) throw error;
        } else if (selectedRole === 'investor') {
          const { error } = await supabase
            .from('investor_preferences')
            .upsert({
              user_id: user.id,
              investment_budget_min: investorPrefs.budgetMin,
              investment_budget_max: investorPrefs.budgetMax,
              target_rental_yield_min: investorPrefs.targetYieldMin,
              risk_tolerance: investorPrefs.riskAppetite,
              investment_horizon: `${investorPrefs.holdingPeriod} months`,
              interested_in_off_plan: investorPrefs.offPlanOk,
              notes: `Strategy: ${investorPrefs.strategy}, Joint investor: ${investorPrefs.jointInvestor}`,
            });
          if (error) throw error;
        } else if (selectedRole === 'developer') {
          const { error } = await supabase
            .from('developers')
            .upsert({
              user_id: user.id,
              company_name: developerData.companyName,
              registration_number: developerData.licenseNo || null,
              operating_cities: developerData.areasServed.split(',').map(s => s.trim()).filter(Boolean),
            });
          if (error) throw error;
        } else if (selectedRole === 'broker') {
          const { error } = await supabase
            .from('agents')
            .upsert({
              user_id: user.id,
              agency_name: agentData.agencyName,
              license_number: agentData.licenseNo,
              areas_served: agentData.areasServed.split(',').map(s => s.trim()).filter(Boolean),
              specialization: agentData.specialties,
            });
          if (error) throw error;
        }

        toast.success('Profile saved successfully!');
      } else {
        // Store in localStorage for unauthenticated users and redirect to auth
        localStorage.setItem('onboarding_data', JSON.stringify({
          role: selectedRole,
          profile,
          preferences: selectedRole === 'buyer' ? buyerPrefs 
            : selectedRole === 'investor' ? investorPrefs
            : selectedRole === 'developer' ? developerData
            : agentData,
        }));
        toast.success('Preferences saved! Please sign up to continue.');
        navigate('/auth');
        return;
      }

      // Redirect based on role
      if (selectedRole === 'buyer' || selectedRole === 'investor') {
        navigate('/properties');
      } else {
        navigate('/submit-listing');
      }
    } catch (error: any) {
      console.error('Error saving onboarding data:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step < currentStep
                      ? 'bg-secondary text-white'
                      : step === currentStep
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 rounded ${
                    step < currentStep ? 'bg-secondary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-2xl shadow-card p-6 md:p-10 border border-border">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-2">
                  Welcome to PropertyX
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  Tell us about yourself so we can personalize your experience.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        selectedRole === role.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <role.icon className={`w-10 h-10 mb-4 ${
                        selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <h3 className="text-lg font-bold text-foreground mb-1">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Profile Form */}
            {currentStep === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-2">
                  Your Profile
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  Basic information to help us serve you better.
                </p>
                
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="w-4 h-4" /> Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> City
                      </Label>
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))}
                        placeholder="Singapore"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Preferred Language
                      </Label>
                      <Input
                        id="language"
                        value={profile.language}
                        onChange={(e) => setProfile(p => ({ ...p, language: e.target.value }))}
                        placeholder="English"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Checkbox
                      id="whatsapp"
                      checked={profile.whatsappOptIn}
                      onCheckedChange={(checked) => setProfile(p => ({ ...p, whatsappOptIn: !!checked }))}
                    />
                    <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      I agree to receive updates via WhatsApp
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Role-specific Preferences */}
            {currentStep === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-2">
                  {selectedRole === 'buyer' && 'Buying Preferences'}
                  {selectedRole === 'investor' && 'Investment Preferences'}
                  {selectedRole === 'developer' && 'Developer Profile'}
                  {selectedRole === 'broker' && 'Agent Profile'}
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  Help PropertyX find the best matches for you.
                </p>

                {/* Buyer Form */}
                {selectedRole === 'buyer' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Purpose of Purchase</Label>
                      <RadioGroup
                        value={buyerPrefs.purpose}
                        onValueChange={(v) => setBuyerPrefs(p => ({ ...p, purpose: v as any }))}
                        className="flex flex-wrap gap-4"
                      >
                        {['live', 'commercial', 'mixed'].map((purpose) => (
                          <div key={purpose} className="flex items-center space-x-2">
                            <RadioGroupItem value={purpose} id={purpose} />
                            <Label htmlFor={purpose} className="capitalize cursor-pointer">{purpose}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>Budget Range: {formatCurrency(buyerPrefs.budgetMin)} - {formatCurrency(buyerPrefs.budgetMax)}</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          value={buyerPrefs.budgetMin}
                          onChange={(e) => setBuyerPrefs(p => ({ ...p, budgetMin: Number(e.target.value) }))}
                          placeholder="Min Budget"
                        />
                        <Input
                          type="number"
                          value={buyerPrefs.budgetMax}
                          onChange={(e) => setBuyerPrefs(p => ({ ...p, budgetMax: Number(e.target.value) }))}
                          placeholder="Max Budget"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locations">Preferred Locations (comma-separated)</Label>
                      <Input
                        id="locations"
                        value={buyerPrefs.locations}
                        onChange={(e) => setBuyerPrefs(p => ({ ...p, locations: e.target.value }))}
                        placeholder="Downtown, Marina Bay, Orchard..."
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Financing Method</Label>
                      <RadioGroup
                        value={buyerPrefs.financing}
                        onValueChange={(v) => setBuyerPrefs(p => ({ ...p, financing: v as any }))}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mortgage" id="mortgage" />
                          <Label htmlFor="mortgage" className="cursor-pointer">Mortgage</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {buyerPrefs.financing === 'mortgage' && (
                      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                          <Label>Down Payment: {buyerPrefs.downPayment}%</Label>
                          <Slider
                            value={[buyerPrefs.downPayment || 20]}
                            onValueChange={([v]) => setBuyerPrefs(p => ({ ...p, downPayment: v }))}
                            min={5}
                            max={50}
                            step={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthlyBudget">Monthly Comfort Budget</Label>
                          <Input
                            id="monthlyBudget"
                            type="number"
                            value={buyerPrefs.monthlyBudget}
                            onChange={(e) => setBuyerPrefs(p => ({ ...p, monthlyBudget: Number(e.target.value) }))}
                            placeholder="$2,000"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Investor Form */}
                {selectedRole === 'investor' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Investment Strategy</Label>
                      <RadioGroup
                        value={investorPrefs.strategy}
                        onValueChange={(v) => setInvestorPrefs(p => ({ ...p, strategy: v as any }))}
                        className="flex flex-wrap gap-4"
                      >
                        {['yield', 'appreciation', 'balanced'].map((strategy) => (
                          <div key={strategy} className="flex items-center space-x-2">
                            <RadioGroupItem value={strategy} id={strategy} />
                            <Label htmlFor={strategy} className="capitalize cursor-pointer">{strategy}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>Investment Budget: {formatCurrency(investorPrefs.budgetMin)} - {formatCurrency(investorPrefs.budgetMax)}</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          value={investorPrefs.budgetMin}
                          onChange={(e) => setInvestorPrefs(p => ({ ...p, budgetMin: Number(e.target.value) }))}
                          placeholder="Min Budget"
                        />
                        <Input
                          type="number"
                          value={investorPrefs.budgetMax}
                          onChange={(e) => setInvestorPrefs(p => ({ ...p, budgetMax: Number(e.target.value) }))}
                          placeholder="Max Budget"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Holding Period: {investorPrefs.holdingPeriod} months</Label>
                      <Slider
                        value={[investorPrefs.holdingPeriod]}
                        onValueChange={([v]) => setInvestorPrefs(p => ({ ...p, holdingPeriod: v }))}
                        min={6}
                        max={120}
                        step={6}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Risk Appetite</Label>
                      <RadioGroup
                        value={investorPrefs.riskAppetite}
                        onValueChange={(v) => setInvestorPrefs(p => ({ ...p, riskAppetite: v as any }))}
                        className="flex gap-6"
                      >
                        {['low', 'medium', 'high'].map((risk) => (
                          <div key={risk} className="flex items-center space-x-2">
                            <RadioGroupItem value={risk} id={`risk-${risk}`} />
                            <Label htmlFor={`risk-${risk}`} className="capitalize cursor-pointer">{risk}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Minimum Yield: {investorPrefs.targetYieldMin}%</Label>
                      <Slider
                        value={[investorPrefs.targetYieldMin]}
                        onValueChange={([v]) => setInvestorPrefs(p => ({ ...p, targetYieldMin: v }))}
                        min={1}
                        max={15}
                        step={0.5}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="offPlan"
                          checked={investorPrefs.offPlanOk}
                          onCheckedChange={(checked) => setInvestorPrefs(p => ({ ...p, offPlanOk: checked }))}
                        />
                        <Label htmlFor="offPlan" className="cursor-pointer">Open to off-plan properties</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="jointInvestor"
                          checked={investorPrefs.jointInvestor}
                          onCheckedChange={(checked) => setInvestorPrefs(p => ({ ...p, jointInvestor: checked }))}
                        />
                        <Label htmlFor="jointInvestor" className="cursor-pointer">Open to joint investments</Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Developer Form */}
                {selectedRole === 'developer' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={developerData.companyName}
                        onChange={(e) => setDeveloperData(p => ({ ...p, companyName: e.target.value }))}
                        placeholder="ABC Developments Pte Ltd"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devLicense">License/Registration Number (optional)</Label>
                      <Input
                        id="devLicense"
                        value={developerData.licenseNo}
                        onChange={(e) => setDeveloperData(p => ({ ...p, licenseNo: e.target.value }))}
                        placeholder="REG-12345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="devAreas">Areas Served (comma-separated)</Label>
                      <Input
                        id="devAreas"
                        value={developerData.areasServed}
                        onChange={(e) => setDeveloperData(p => ({ ...p, areasServed: e.target.value }))}
                        placeholder="Singapore, Johor Bahru, Kuala Lumpur..."
                      />
                    </div>
                  </div>
                )}

                {/* Agent Form */}
                {selectedRole === 'broker' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="agencyName">Agency Name *</Label>
                      <Input
                        id="agencyName"
                        value={agentData.agencyName}
                        onChange={(e) => setAgentData(p => ({ ...p, agencyName: e.target.value }))}
                        placeholder="Prime Realty Agency"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentLicense">License Number *</Label>
                      <Input
                        id="agentLicense"
                        value={agentData.licenseNo}
                        onChange={(e) => setAgentData(p => ({ ...p, licenseNo: e.target.value }))}
                        placeholder="REA-12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentAreas">Areas Served (comma-separated)</Label>
                      <Input
                        id="agentAreas"
                        value={agentData.areasServed}
                        onChange={(e) => setAgentData(p => ({ ...p, areasServed: e.target.value }))}
                        placeholder="Central, East Coast, Sentosa..."
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Specialties</Label>
                      <div className="flex flex-wrap gap-3">
                        {['residential', 'commercial', 'off-plan', 'luxury'].map((specialty) => (
                          <div key={specialty} className="flex items-center space-x-2">
                            <Checkbox
                              id={specialty}
                              checked={agentData.specialties.includes(specialty)}
                              onCheckedChange={(checked) => {
                                setAgentData(p => ({
                                  ...p,
                                  specialties: checked
                                    ? [...p.specialties, specialty]
                                    : p.specialties.filter(s => s !== specialty),
                                }));
                              }}
                            />
                            <Label htmlFor={specialty} className="capitalize cursor-pointer">{specialty}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentLanguages">Languages Spoken</Label>
                      <Input
                        id="agentLanguages"
                        value={agentData.languages}
                        onChange={(e) => setAgentData(p => ({ ...p, languages: e.target.value }))}
                        placeholder="English, Mandarin, Malay..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? 'Saving...' : 'Complete Setup'}
                  <Check className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Onboarding;