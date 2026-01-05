import { TrendingUp, TrendingDown, Minus, Home, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type TrendDirection = 'up' | 'down' | 'stable';

interface AreaTrendsProps {
  areaName: string;
  priceTrend: TrendDirection;
  priceChangePercent: number;
  medianPrice: string;
  rentalDemand: 'low' | 'moderate' | 'high' | 'very_high';
  rentalDemandScore: number; // 0-100
  avgDaysOnMarket?: number;
  priceGrowth1Y?: number;
  priceGrowth5Y?: number;
  className?: string;
}

const getTrendIcon = (direction: TrendDirection) => {
  switch (direction) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
};

const getTrendColor = (direction: TrendDirection) => {
  switch (direction) {
    case 'up': return 'text-green-600';
    case 'down': return 'text-red-600';
    default: return 'text-muted-foreground';
  }
};

const getDemandColor = (demand: string) => {
  switch (demand) {
    case 'very_high': return 'text-green-600 bg-green-100 dark:bg-green-950';
    case 'high': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950';
    case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-950';
    case 'low': return 'text-red-600 bg-red-100 dark:bg-red-950';
    default: return 'text-muted-foreground bg-muted';
  }
};

const getDemandLabel = (demand: string) => {
  switch (demand) {
    case 'very_high': return 'Very High';
    case 'high': return 'High';
    case 'moderate': return 'Moderate';
    case 'low': return 'Low';
    default: return demand;
  }
};

const AreaTrends = ({
  areaName,
  priceTrend,
  priceChangePercent,
  medianPrice,
  rentalDemand,
  rentalDemandScore,
  avgDaysOnMarket,
  priceGrowth1Y,
  priceGrowth5Y,
  className,
}: AreaTrendsProps) => {
  const TrendIcon = getTrendIcon(priceTrend);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Area Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">{areaName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Trend */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Median Price</span>
          </div>
          <div className="text-right">
            <p className="font-bold text-foreground">{medianPrice}</p>
            <p className={cn('text-xs flex items-center gap-1 justify-end', getTrendColor(priceTrend))}>
              <TrendIcon className="h-3 w-3" />
              {priceChangePercent > 0 ? '+' : ''}{priceChangePercent}% YoY
            </p>
          </div>
        </div>

        {/* Rental Demand */}
        <div className="p-3 rounded-lg bg-muted/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Rental Demand</span>
            </div>
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', getDemandColor(rentalDemand))}>
              {getDemandLabel(rentalDemand)}
            </span>
          </div>
          <Progress value={rentalDemandScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {rentalDemandScore >= 75 
              ? 'Strong tenant interest in this area' 
              : rentalDemandScore >= 50 
                ? 'Moderate rental activity' 
                : 'Limited rental demand currently'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          {avgDaysOnMarket !== undefined && (
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className="text-lg font-bold text-foreground">{avgDaysOnMarket}</p>
              <p className="text-xs text-muted-foreground">Avg. Days on Market</p>
            </div>
          )}
          {priceGrowth1Y !== undefined && (
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className={cn('text-lg font-bold', priceGrowth1Y >= 0 ? 'text-green-600' : 'text-red-600')}>
                {priceGrowth1Y > 0 ? '+' : ''}{priceGrowth1Y}%
              </p>
              <p className="text-xs text-muted-foreground">1Y Growth</p>
            </div>
          )}
          {priceGrowth5Y !== undefined && (
            <div className="p-2 rounded-lg bg-muted/30 text-center col-span-2">
              <p className={cn('text-lg font-bold', priceGrowth5Y >= 0 ? 'text-green-600' : 'text-red-600')}>
                {priceGrowth5Y > 0 ? '+' : ''}{priceGrowth5Y}%
              </p>
              <p className="text-xs text-muted-foreground">5Y Cumulative Growth</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaTrends;
