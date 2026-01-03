/**
 * Developer Dashboard
 * Dashboard for developers to manage their property listings and inquiries
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { developerNavItems } from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, MessageSquare, Eye, TrendingUp, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { SAMPLE_PROPERTIES } from '@/data/propertyData';

interface MeetingRequest {
  id: string;
  property_id: string;
  property_title: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  meeting_type: string;
  status: string;
  message: string;
  created_at: string;
}

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // For demo purposes, we'll use sample properties as "developer's listings"
  const myListings = SAMPLE_PROPERTIES.slice(0, 4);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch meeting requests (as inquiries for developer)
      const { data: meetings, error: meetingsError } = await supabase
        .from('meeting_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (meetingsError) throw meetingsError;
      setInquiries(meetings || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('meeting_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
      toast.success(`Inquiry ${status}`);
    } catch (error) {
      toast.error('Failed to update inquiry');
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
      <DashboardLayout title="Dashboard" navItems={developerNavItems}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Developer Dashboard" navItems={developerNavItems}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{myListings.length}</p>
              <p className="text-sm text-muted-foreground">Active Listings</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inquiries.length}</p>
              <p className="text-sm text-muted-foreground">Total Inquiries</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1,245</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">+24%</p>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Listings */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">My Listings</h2>
            <button className="btn-primary py-2 px-4 text-sm">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {myListings.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <p className="text-sm font-semibold text-primary">{property.price}</p>
                    </div>
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Eye className="w-5 h-5 text-primary" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Recent Inquiries</h2>
          </div>
          <div className="p-6">
            {inquiries.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No inquiries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{inquiry.full_name}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Interested in: {inquiry.property_title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(inquiry.preferred_date).toLocaleDateString()} at {inquiry.preferred_time}
                    </div>
                    {inquiry.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'confirmed')}
                          className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'cancelled')}
                          className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
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

export default DeveloperDashboard;
