import { useNavigate } from 'react-router-dom';
import { Scale, MessageCircle, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DecisionBrief, { DecisionBriefData } from './DecisionBrief';
import { cn } from '@/lib/utils';

interface AnalysisResultsProps {
  data: DecisionBriefData;
  propertyId: string;
  onClose: () => void;
  className?: string;
}

const AnalysisResults = ({ data, propertyId, onClose, className }: AnalysisResultsProps) => {
  const navigate = useNavigate();

  const handleCompare = () => {
    // Add property to compare and navigate to properties
    const compareList = JSON.parse(localStorage.getItem('compareProperties') || '[]');
    if (!compareList.includes(propertyId)) {
      compareList.push(propertyId);
      localStorage.setItem('compareProperties', JSON.stringify(compareList));
    }
    navigate('/properties');
  };

  const handleRequestReview = () => {
    navigate(`/schedule?propertyId=${propertyId}&type=review`);
  };

  const handleOpenChat = () => {
    navigate(`/chat?propertyId=${propertyId}`);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Close Button */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4 mr-1" />
          Close Analysis
        </Button>
      </div>

      {/* Decision Brief */}
      <DecisionBrief data={data} />

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">What would you like to do next?</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleCompare}
            >
              <Scale className="w-4 h-4" />
              Compare Properties
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleRequestReview}
            >
              <Users className="w-4 h-4" />
              Request Human Review
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleOpenChat}
            >
              <MessageCircle className="w-4 h-4" />
              Chat with PropertyX
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;
