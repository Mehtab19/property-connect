/**
 * Investor Dashboard
 * Dashboard for investors with portfolio tracking and ROI analytics
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout, { investorNavItems } from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, Heart, BarChart3, Eye, DollarSign, Percent, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { SAMPLE_PROPERTIES, getPropertyById } from '@/data/propertyData';

interface SavedProperty {
  id: string;
  property_id: string;
  created_at: string;
}

const InvestorDashboard = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: saved, error: savedError } = await supabase
        .from('saved_properties')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (savedError) throw savedError;
      setSavedProperties(saved || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate portfolio metrics from saved properties
  const portfolioValue = savedProperties.reduce((total, saved) => {
    const property = getPropertyById(saved.property_id);
    if (property) {
      const priceMatch = property.price.match(/[\d.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
      const multiplier = property.price.toLowerCase().includes('m') ? 1000000 : 1000;
      return total + price * multiplier;
    }
    return total;
  }, 0);

  const avgROI = savedProperties.length > 0
    ? savedProperties.reduce((total, saved) => {
        const property = getPropertyById(saved.property_id);
        const roiValue = property?.expectedRoi ? parseFloat(property.expectedRoi.replace('%', '')) : 0;
        return total + roiValue;
      }, 0) / savedProperties.length
    : 0;

  // Get investment-focused properties (high ROI)
  const investmentProperties = SAMPLE_PROPERTIES
    .filter((p) => {
      const roiValue = p.expectedRoi ? parseFloat(p.expectedRoi.replace('%', '')) : 0;
      return roiValue >= 12;
    })
    .slice(0, 4);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" navItems={investorNavItems}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Investor Dashboard" navItems={investorNavItems}>
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{savedProperties.length}</p>
              <p className="text-sm text-muted-foreground">Tracked Properties</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ₹{(portfolioValue / 10000000).toFixed(1)}Cr
              </p>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Percent className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgROI.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Avg. Expected ROI</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">+15%</p>
              <p className="text-sm text-muted-foreground">Market Growth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Opportunities */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">High ROI Opportunities</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {investmentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{property.title}</p>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-semibold text-primary">{property.price}</span>
                      <span className="text-sm text-green-600 font-semibold">
                        ROI: {property.expectedRoi}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="btn-outline py-2 px-4 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Market Insights</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Bahria Town</span>
                </div>
                <p className="text-sm text-green-700">
                  Property values increased by 18% in the last quarter. High demand for commercial plots.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">DHA Phase 6</span>
                </div>
                <p className="text-sm text-blue-700">
                  Steady growth of 12% annually. Luxury villas seeing premium pricing.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Gulberg</span>
                </div>
                <p className="text-sm text-amber-700">
                  Commercial properties yielding 14% rental returns. New metro line boosting demand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
