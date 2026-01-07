/**
 * Favorites Hook
 * Manages saved/favorite properties for authenticated users
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SavedProperty {
  id: string;
  property_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Fetch user's favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
      setFavoriteIds(new Set((data || []).map(f => f.property_id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if a property is favorited
  const isFavorite = useCallback((propertyId: string) => {
    return favoriteIds.has(propertyId);
  }, [favoriteIds]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (propertyId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to save properties');
      return false;
    }

    const isCurrentlyFavorite = favoriteIds.has(propertyId);

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;

        setFavorites(prev => prev.filter(f => f.property_id !== propertyId));
        setFavoriteIds(prev => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId,
          })
          .select()
          .single();

        if (error) throw error;

        setFavorites(prev => [data, ...prev]);
        setFavoriteIds(prev => new Set(prev).add(propertyId));
        toast.success('Added to favorites');
      }
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
      return false;
    }
  }, [user, isAuthenticated, favoriteIds]);

  // Remove from favorites
  const removeFavorite = useCallback(async (favoriteId: string) => {
    if (!isAuthenticated || !user) return false;

    try {
      const favorite = favorites.find(f => f.id === favoriteId);
      if (!favorite) return false;

      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(favorite.property_id);
        return next;
      });
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
      return false;
    }
  }, [user, isAuthenticated, favorites]);

  return {
    favorites,
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    refetch: fetchFavorites,
  };
};
