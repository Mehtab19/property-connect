/**
 * Favorite Button Component
 * Reusable heart button for saving/unsaving properties
 */

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  propertyId: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const FavoriteButton = ({ 
  propertyId, 
  variant = 'icon', 
  size = 'default',
  className 
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isSaved = isFavorite(propertyId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(propertyId);
  };

  if (variant === 'button') {
    return (
      <Button
        variant={isSaved ? 'default' : 'outline'}
        size={size}
        onClick={handleClick}
        className={cn('gap-2', className)}
      >
        <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        'rounded-full transition-all',
        isSaved 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-muted-foreground hover:text-red-500 hover:bg-red-50',
        className
      )}
    >
      <Heart className={cn(
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5',
        isSaved && 'fill-current'
      )} />
    </Button>
  );
};

export default FavoriteButton;
