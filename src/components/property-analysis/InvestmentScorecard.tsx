import { TrendingUp, TrendingDown, Minus, Shield, Target, Percent, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface InvestmentScorecardProps {
  investmentScore: number; // 0-100
  rentalYield: number; // percentage
  appreciationForecast: number; // percentage per year
  riskLevel: 'low' | 'medium' | 'high';
  confidenceScore: number; // 0-100
  className?: string;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low': return 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400';
    case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400';
    case 'high': return 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreGradient = (score: number) => {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-yellow-500 to-orange-500';
  return 'from-red-500 to-rose-500';
};

const InvestmentScorecard = ({
  investmentScore,
  rentalYield,
  appreciationForecast,
  riskLevel,
  confidenceScore,
  className,
}: InvestmentScorecardProps) => {
  const TrendIcon = appreciationForecast > 0 ? TrendingUp : appreciationForecast < 0 ? TrendingDown : Minus;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Investment Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Score */}
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
          <p className="text-sm text-muted-foreground mb-1">PropertyX AI Score</p>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(investmentScore / 100) * 251.2} 251.2`}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`${getScoreGradient(investmentScore).split(' ')[0].replace('from-', 'stop-')}`} />
                  <stop offset="100%" className={`${getScoreGradient(investmentScore).split(' ')[1].replace('to-', 'stop-')}`} />
                </linearGradient>
              </defs>
            </svg>
            <span className={cn('absolute text-3xl font-bold', getScoreColor(investmentScore))}>
              {investmentScore}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">out of 100</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rental Yield */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Percent className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Rental Yield</span>
            </div>
            <p className="text-xl font-bold text-foreground">{rentalYield.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Annual</p>
          </div>

          {/* Appreciation Forecast */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <TrendIcon className={cn('h-3.5 w-3.5', appreciationForecast >= 0 ? 'text-green-600' : 'text-red-600')} />
              <span className="text-xs font-medium">Appreciation</span>
            </div>
            <p className={cn('text-xl font-bold', appreciationForecast >= 0 ? 'text-green-600' : 'text-red-600')}>
              {appreciationForecast > 0 ? '+' : ''}{appreciationForecast.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">5-Year Forecast</p>
          </div>

          {/* Risk Level */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Risk Level</span>
            </div>
            <span className={cn('inline-block px-2 py-0.5 rounded-full text-sm font-semibold capitalize', getRiskColor(riskLevel))}>
              {riskLevel}
            </span>
          </div>

          {/* Confidence Score */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Confidence</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={confidenceScore} className="h-2 flex-1" />
              <span className="text-sm font-semibold">{confidenceScore}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentScorecard;
