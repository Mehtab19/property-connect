import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  DollarSign,
  BarChart3,
  Shield,
  Scale,
  ArrowRight,
  Home,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type UserGoal = 'buy_to_live' | 'buy_to_invest' | 'mixed';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Verdict = 'Strong' | 'Consider' | 'Avoid';

export interface DecisionBriefData {
  // User Context
  userGoal: UserGoal;
  propertyContext: {
    name: string;
    location: string;
    type: string;
    price: string;
  };
  
  // 1) Snapshot
  snapshot: {
    investmentScore: number; // 0-10
    riskLevel: RiskLevel;
    confidence: number; // 0-1
  };
  
  // 2) Financial View
  financialView: {
    estimatedRent?: string;
    rentalYield?: string;
    appreciationOutlook: string;
    totalCostNotes: string;
  };
  
  // 3) Risk Flags
  riskFlags: string[];
  
  // 4) Comparable Check
  comparableCheck: {
    range: string;
    implication: string;
  };
  
  // 5) Recommendation
  recommendation: {
    verdict: Verdict;
    nextSteps: string[];
  };
  
  // 6) Assumptions & What I Need
  assumptions: string[];
  missingInfo?: string[];
}

const getGoalLabel = (goal: UserGoal) => {
  switch (goal) {
    case 'buy_to_live': return 'Buy to Live';
    case 'buy_to_invest': return 'Buy to Invest';
    case 'mixed': return 'Mixed (Live + Invest)';
  }
};

const getGoalIcon = (goal: UserGoal) => {
  switch (goal) {
    case 'buy_to_live': return Home;
    case 'buy_to_invest': return TrendingUp;
    case 'mixed': return Building2;
  }
};

const getRiskBadgeVariant = (risk: RiskLevel) => {
  switch (risk) {
    case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400';
    case 'High': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
  }
};

const getVerdictStyle = (verdict: Verdict) => {
  switch (verdict) {
    case 'Strong': return {
      bg: 'bg-green-50 dark:bg-green-950/50',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-400',
      icon: CheckCircle2
    };
    case 'Consider': return {
      bg: 'bg-yellow-50 dark:bg-yellow-950/50',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-400',
      icon: Scale
    };
    case 'Avoid': return {
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-400',
      icon: AlertTriangle
    };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 7) return 'text-green-600 dark:text-green-400';
  if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.75) return 'bg-green-500';
  if (confidence >= 0.5) return 'bg-yellow-500';
  return 'bg-red-500';
};

interface DecisionBriefProps {
  data: DecisionBriefData;
  className?: string;
}

const DecisionBrief = ({ data, className }: DecisionBriefProps) => {
  const GoalIcon = getGoalIcon(data.userGoal);
  const verdictStyle = getVerdictStyle(data.recommendation.verdict);
  const VerdictIcon = verdictStyle.icon;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-6 w-6 text-primary" />
            PropertyX Decision Brief
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1.5">
            <GoalIcon className="h-3.5 w-3.5" />
            {getGoalLabel(data.userGoal)}
          </Badge>
        </div>
        
        {/* Property Context */}
        <div className="mt-3 p-3 rounded-lg bg-background/80 backdrop-blur">
          <p className="font-semibold text-foreground">{data.propertyContext.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.propertyContext.location} • {data.propertyContext.type} • {data.propertyContext.price}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* 1) Snapshot */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            1. Snapshot
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {/* Investment Score */}
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Investment Score</p>
              <p className={cn('text-3xl font-bold', getScoreColor(data.snapshot.investmentScore))}>
                {data.snapshot.investmentScore}<span className="text-lg text-muted-foreground">/10</span>
              </p>
            </div>
            
            {/* Risk Level */}
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
              <Badge className={cn('mt-1', getRiskBadgeVariant(data.snapshot.riskLevel))}>
                {data.snapshot.riskLevel}
              </Badge>
            </div>
            
            {/* Confidence */}
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-xs text-muted-foreground mb-1">Confidence</p>
              <p className="text-xl font-bold text-foreground">{(data.snapshot.confidence * 100).toFixed(0)}%</p>
              <Progress 
                value={data.snapshot.confidence * 100} 
                className={cn('h-1.5 mt-1', getConfidenceColor(data.snapshot.confidence))}
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* 2) Financial View */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            2. Financial View
          </h3>
          <div className="space-y-2">
            {data.financialView.estimatedRent && (
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30">
                <span className="text-sm text-muted-foreground">Estimated Rent (if investment)</span>
                <span className="font-medium text-foreground">{data.financialView.estimatedRent}</span>
              </div>
            )}
            {data.financialView.rentalYield && (
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30">
                <span className="text-sm text-muted-foreground">Estimated Rental Yield</span>
                <span className="font-medium text-foreground">{data.financialView.rentalYield}</span>
              </div>
            )}
            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/30">
              <span className="text-sm text-muted-foreground">Appreciation Outlook</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                {data.financialView.appreciationOutlook.includes('+') ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : data.financialView.appreciationOutlook.includes('-') ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : null}
                {data.financialView.appreciationOutlook}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 mt-2">
              <p className="text-xs text-muted-foreground font-medium mb-1">Total Cost Notes</p>
              <p className="text-sm text-foreground">{data.financialView.totalCostNotes}</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* 3) Risk Flags */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            3. Risk Flags
          </h3>
          {data.riskFlags.length > 0 ? (
            <ul className="space-y-2">
              {data.riskFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-foreground">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">No significant risk flags identified.</p>
          )}
        </section>

        <Separator />

        {/* 4) Comparable Check */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            4. Comparable Check
          </h3>
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Comparable Range</span>
              <span className="font-semibold text-foreground">{data.comparableCheck.range}</span>
            </div>
            <p className="text-sm text-foreground">{data.comparableCheck.implication}</p>
          </div>
        </section>

        <Separator />

        {/* 5) Recommendation */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            5. Recommendation
          </h3>
          <div className={cn('p-4 rounded-xl border-2', verdictStyle.bg, verdictStyle.border)}>
            <div className="flex items-center gap-2 mb-3">
              <VerdictIcon className={cn('h-5 w-5', verdictStyle.text)} />
              <span className={cn('text-lg font-bold', verdictStyle.text)}>
                {data.recommendation.verdict === 'Strong' && 'Strong Buy'}
                {data.recommendation.verdict === 'Consider' && 'Consider with Caution'}
                {data.recommendation.verdict === 'Avoid' && 'Avoid / Not Recommended'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-2">Next Steps:</p>
            <ul className="space-y-1.5">
              {data.recommendation.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Separator />

        {/* 6) Assumptions & What I Need */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            6. Assumptions & What I Need
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-2">Key Assumptions:</p>
              <ul className="space-y-1">
                {data.assumptions.map((assumption, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-foreground">{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {data.missingInfo && data.missingInfo.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
                  Information needed for better analysis:
                </p>
                <ul className="space-y-1">
                  {data.missingInfo.map((info, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <HelpCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-amber-800 dark:text-amber-300">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-dashed">
          <p className="text-xs text-muted-foreground italic text-center">
            This analysis is for informational purposes only. Actual property performance depends on market conditions, 
            financing terms, and other factors. Consult licensed professionals for legal, tax, and financial advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionBrief;
