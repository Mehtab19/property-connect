/**
 * Buyer Dashboard
 * Dashboard for individual buyers to manage saved properties and meeting requests
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { buyerNavItems } from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Calendar, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPropertyById, Property } from '@/data/propertyData';

interface SavedProperty {
  id: string;
  property_id: string;
  created_at: string;
}

interface MeetingRequest {
  id: string;
  property_id: string;
  property_title: string;
  preferred_date: string;
  preferred_time: string;
  meeting_type: string;
  status: string;
  created_at: string;
}

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch saved properties
      const { data: saved, error: savedError } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (savedError) throw savedError;
      setSavedProperties(saved || []);

      // Fetch meeting requests
      const { data: meetings, error: meetingsError } = await supabase
        .from('meeting_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (meetingsError) throw meetingsError;
      setMeetingRequests(meetings || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSavedProperties(savedProperties.filter((p) => p.id !== id));
      toast.success('Property removed from favorites');
    } catch (error) {
      toast.error('Failed to remove property');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" navItems={buyerNavItems}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Buyer Dashboard" navItems={buyerNavItems}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{savedProperties.length}</p>
              <p className="text-sm text-muted-foreground">Saved Properties</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{meetingRequests.length}</p>
              <p className="text-sm text-muted-foreground">Meeting Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {meetingRequests.filter((m) => m.status === 'confirmed').length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmed Visits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Properties */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Saved Properties</h2>
          </div>
          <div className="p-6">
            {savedProperties.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved properties yet</p>
                <Link to="/#properties" className="text-primary font-semibold mt-2 inline-block">
                  Browse Properties →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedProperties.slice(0, 5).map((saved) => {
                  const property = getPropertyById(saved.property_id);
                  return (
                    <div
                      key={saved.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {property?.title || `Property #${saved.property_id}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {property?.location || 'Location unavailable'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/property/${saved.property_id}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Eye className="w-4 h-4 text-primary" />
                        </Link>
                        <button
                          onClick={() => removeSavedProperty(saved.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Meeting Requests */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Meeting Requests</h2>
          </div>
          <div className="p-6">
            {meetingRequests.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No meeting requests yet</p>
                <Link to="/schedule" className="text-primary font-semibold mt-2 inline-block">
                  Schedule a Meeting →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {meetingRequests.slice(0, 5).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{meeting.property_title}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{new Date(meeting.preferred_date).toLocaleDateString()}</span>
                      <span>{meeting.preferred_time}</span>
                      <span className="capitalize">{meeting.meeting_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
