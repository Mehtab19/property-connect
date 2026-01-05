import { Brain, ChevronDown, Lightbulb, AlertCircle, Database, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Signal {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // 0-100 importance
  description: string;
}

interface Assumption {
  category: string;
  assumption: string;
  basis: string;
}

interface AIExplainabilityProps {
  signals: Signal[];
  assumptions: Assumption[];
  modelVersion?: string;
  analysisDate?: string;
  dataSources?: string[];
  limitations?: string[];
  className?: string;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'positive': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
    case 'negative': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'positive': return '↑';
    case 'negative': return '↓';
    default: return '→';
  }
};

const AIExplainability = ({
  signals,
  assumptions,
  modelVersion = 'PropertyX AI v2.1',
  analysisDate,
  dataSources = [],
  limitations = [],
  className,
}: AIExplainabilityProps) => {
  const sortedSignals = [...signals].sort((a, b) => b.weight - a.weight);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis Explained
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {modelVersion}
          </Badge>
        </div>
        {analysisDate && (
          <p className="text-xs text-muted-foreground">Analysis as of {analysisDate}</p>
        )}
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {/* Signals Used */}
          <AccordionItem value="signals">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Key Signals ({signals.length})
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {sortedSignals.map((signal, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/30"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <span className={cn('inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold', getImpactColor(signal.impact))}>
                        {getImpactIcon(signal.impact)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground">{signal.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {signal.weight}% weight
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{signal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Assumptions */}
          <AccordionItem value="assumptions">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Assumptions ({assumptions.length})
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {assumptions.map((item, index) => (
                  <div key={index} className="p-2 rounded-lg bg-muted/30">
                    <Badge variant="secondary" className="text-xs mb-1">
                      {item.category}
                    </Badge>
                    <p className="text-sm text-foreground">{item.assumption}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on: {item.basis}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Data Sources */}
          {dataSources.length > 0 && (
            <AccordionItem value="sources">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Data Sources ({dataSources.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 pt-2">
                  {dataSources.map((source, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{source}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Limitations */}
          {limitations.length > 0 && (
            <AccordionItem value="limitations">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Limitations
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 mt-2">
                  <ul className="list-disc list-inside space-y-1">
                    {limitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-yellow-800 dark:text-yellow-200">{limitation}</li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default AIExplainability;
