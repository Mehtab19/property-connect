import { DollarSign, Calculator, Building, Wrench, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface CostBreakdownProps {
  propertyPrice: number;
  stampDuty?: number;
  registrationFee?: number;
  legalFees?: number;
  agentCommission?: number;
  monthlyMortgage?: number;
  monthlyMaintenance?: number;
  propertyTax?: number;
  currency?: string;
  className?: string;
}

const formatCurrency = (value: number, currency = '₹') => {
  if (value >= 10000000) {
    return `${currency}${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${currency}${(value / 100000).toFixed(2)} L`;
  }
  return `${currency}${value.toLocaleString('en-IN')}`;
};

const CostBreakdown = ({
  propertyPrice,
  stampDuty = 0,
  registrationFee = 0,
  legalFees = 0,
  agentCommission = 0,
  monthlyMortgage,
  monthlyMaintenance = 0,
  propertyTax = 0,
  currency = '₹',
  className,
}: CostBreakdownProps) => {
  const totalUpfront = propertyPrice + stampDuty + registrationFee + legalFees + agentCommission;
  const monthlyTotal = (monthlyMortgage || 0) + monthlyMaintenance + (propertyTax / 12);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Price */}
        <div className="p-4 rounded-xl bg-primary/10 text-center">
          <p className="text-sm text-muted-foreground mb-1">Property Price</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(propertyPrice, currency)}</p>
        </div>

        {/* Upfront Costs */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            One-Time Costs
          </h4>
          <div className="space-y-2 pl-6">
            {stampDuty > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stamp Duty</span>
                <span className="font-medium">{formatCurrency(stampDuty, currency)}</span>
              </div>
            )}
            {registrationFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="font-medium">{formatCurrency(registrationFee, currency)}</span>
              </div>
            )}
            {legalFees > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Legal Fees</span>
                <span className="font-medium">{formatCurrency(legalFees, currency)}</span>
              </div>
            )}
            {agentCommission > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Agent Commission</span>
                <span className="font-medium">{formatCurrency(agentCommission, currency)}</span>
              </div>
            )}
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-sm font-semibold pl-6">
            <span>Total Upfront</span>
            <span className="text-primary">{formatCurrency(totalUpfront, currency)}</span>
          </div>
        </div>

        {/* Monthly Costs */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            Monthly Costs
          </h4>
          <div className="space-y-2 pl-6">
            {monthlyMortgage && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mortgage EMI</span>
                <span className="font-medium">{formatCurrency(monthlyMortgage, currency)}</span>
              </div>
            )}
            {monthlyMaintenance > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Maintenance</span>
                <span className="font-medium">{formatCurrency(monthlyMaintenance, currency)}</span>
              </div>
            )}
            {propertyTax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Property Tax (monthly)</span>
                <span className="font-medium">{formatCurrency(propertyTax / 12, currency)}</span>
              </div>
            )}
          </div>
          {monthlyTotal > 0 && (
            <>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-semibold pl-6">
                <span>Total Monthly</span>
                <span className="text-secondary">{formatCurrency(monthlyTotal, currency)}/mo</span>
              </div>
            </>
          )}
        </div>

        {/* Tip */}
        <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <Wrench className="h-3.5 w-3.5 inline mr-1.5" />
          Estimates based on typical rates. Actual costs may vary based on location and negotiations.
        </div>
      </CardContent>
    </Card>
  );
};

export default CostBreakdown;
