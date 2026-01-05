/**
 * Investment Tools Section Component
 * ROI Calculator, Affordability, Property Comparison tools
 */

import { useState } from 'react';
import { Calculator, Home, Scale, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const InvestmentToolsSection = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [roiResults, setRoiResults] = useState<any>(null);
  const [affordabilityResult, setAffordabilityResult] = useState<number | null>(null);

  const tools = [
    {
      id: 'roi',
      icon: Calculator,
      title: 'ROI Calculator',
      description: 'Calculate potential returns on your property investments with our advanced ROI calculator.',
      cta: 'Open Calculator',
    },
    {
      id: 'affordability',
      icon: Home,
      title: 'Affordability Assessment',
      description: 'Determine how much property you can afford based on your income, expenses, and financial goals.',
      cta: 'Check Affordability',
    },
    {
      id: 'comparison',
      icon: Scale,
      title: 'Property Comparison Tool',
      description: 'Compare multiple properties side by side to make the best investment decision.',
      cta: 'Compare Properties',
    },
  ];

  const calculateROI = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const propertyPrice = Number(formData.get('propertyPrice')) || 0;
    const downPayment = Number(formData.get('downPayment')) || 0;
    const interestRate = Number(formData.get('interestRate')) || 4.5;
    const loanTerm = Number(formData.get('loanTerm')) || 30;
    const rentalIncome = Number(formData.get('rentalIncome')) || 0;
    const propertyTax = Number(formData.get('propertyTax')) || 0;
    const insurance = Number(formData.get('insurance')) || 0;
    const maintenance = Number(formData.get('maintenance')) || 0;

    const loanAmount = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyMortgage = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const monthlyExpenses = (propertyTax + insurance + maintenance) / 12;
    const totalMonthlyExpenses = monthlyMortgage + monthlyExpenses;
    const monthlyCashFlow = rentalIncome - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashROI = (annualCashFlow / downPayment) * 100;

    setRoiResults({
      monthlyMortgage: monthlyMortgage.toFixed(2),
      monthlyExpenses: totalMonthlyExpenses.toFixed(2),
      monthlyCashFlow: monthlyCashFlow.toFixed(2),
      annualCashFlow: annualCashFlow.toFixed(2),
      cashOnCashROI: cashOnCashROI.toFixed(2),
    });
  };

  const calculateAffordability = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const annualIncome = Number(formData.get('annualIncome')) || 0;
    const monthlyDebts = Number(formData.get('monthlyDebts')) || 0;
    const downPaymentPercent = Number(formData.get('downPaymentPercent')) || 20;
    const interestRate = Number(formData.get('interestRate')) || 4.5;

    const monthlyIncome = annualIncome / 12;
    const maxMonthlyPayment = monthlyIncome * 0.28 - monthlyDebts;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = 30 * 12;
    
    const loanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    const affordablePrice = loanAmount / (1 - downPaymentPercent / 100);

    setAffordabilityResult(Math.max(0, affordablePrice));
  };

  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="section-title">
          <h2>Investment Tools</h2>
          <p>
            Powerful calculators and analysis tools to help you make informed real estate decisions
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-2xl p-8 shadow-card text-center hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <tool.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{tool.title}</h3>
              <p className="text-muted-foreground mb-6">{tool.description}</p>
              <button
                onClick={() => setActiveModal(tool.id)}
                className="btn-primary justify-center w-full"
              >
                {tool.cta}
              </button>
            </div>
          ))}
        </div>

        {/* ROI Calculator Modal */}
        <Dialog open={activeModal === 'roi'} onOpenChange={() => { setActiveModal(null); setRoiResults(null); }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" /> ROI Calculator
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={calculateROI} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Property Price ($)</label>
                  <input name="propertyPrice" type="number" placeholder="500,000" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Down Payment ($)</label>
                  <input name="downPayment" type="number" placeholder="100,000" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Interest Rate (%)</label>
                  <input name="interestRate" type="number" step="0.01" placeholder="4.5" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Loan Term (Years)</label>
                  <select name="loanTerm" className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                    <option value="30">30 Years</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Monthly Rental ($)</label>
                  <input name="rentalIncome" type="number" placeholder="2,500" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Property Tax ($)</label>
                  <input name="propertyTax" type="number" placeholder="6,000" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Insurance ($)</label>
                  <input name="insurance" type="number" placeholder="1,200" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Annual Maintenance ($)</label>
                  <input name="maintenance" type="number" placeholder="2,000" className="w-full mt-1 px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center">Calculate ROI</button>
              
              {roiResults && (
                <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-bold text-primary">Results</h4>
                  <div className="flex justify-between"><span>Monthly Mortgage:</span><span className="font-semibold">${roiResults.monthlyMortgage}</span></div>
                  <div className="flex justify-between"><span>Monthly Expenses:</span><span className="font-semibold">${roiResults.monthlyExpenses}</span></div>
                  <div className="flex justify-between"><span>Monthly Cash Flow:</span><span className="font-semibold text-secondary">${roiResults.monthlyCashFlow}</span></div>
                  <div className="flex justify-between"><span>Annual Cash Flow:</span><span className="font-semibold text-secondary">${roiResults.annualCashFlow}</span></div>
                  <div className="flex justify-between"><span>Cash on Cash ROI:</span><span className="font-bold text-lg text-primary">{roiResults.cashOnCashROI}%</span></div>
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>

        {/* Affordability Modal */}
        <Dialog open={activeModal === 'affordability'} onOpenChange={() => { setActiveModal(null); setAffordabilityResult(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" /> Affordability Assessment
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={calculateAffordability} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Annual Income ($)</label>
                <input name="annualIncome" type="number" placeholder="100,000" className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Monthly Debts ($)</label>
                <input name="monthlyDebts" type="number" placeholder="500" className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Down Payment (%)</label>
                <input name="downPaymentPercent" type="number" placeholder="20" className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium">Interest Rate (%)</label>
                <input name="interestRate" type="number" step="0.01" placeholder="4.5" className="w-full mt-1 px-3 py-2 border rounded-lg" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">Calculate</button>
              
              {affordabilityResult !== null && (
                <div className="mt-4 p-6 bg-secondary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">You can afford up to</p>
                  <p className="text-3xl font-bold text-primary">${affordabilityResult.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <p className="text-sm text-muted-foreground mt-2">Based on 28% front-end ratio</p>
                </div>
              )}
            </form>
          </DialogContent>
        </Dialog>

        {/* Comparison Modal */}
        <Dialog open={activeModal === 'comparison'} onOpenChange={() => setActiveModal(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" /> Property Comparison Tool
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground mb-4">Compare up to 3 properties to make the best investment decision.</p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary cursor-pointer transition-colors">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl text-muted-foreground">+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Add Property {num}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">Click to add properties from the Verified Projects section</p>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default InvestmentToolsSection;
