/**
 * Partner Management Page
 * Admin page for managing mortgage partners - create/edit partner banks
 */

import { useState, useEffect } from 'react';
import DashboardLayout, { adminNavItems } from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Building2,
  Shield,
  ShieldOff,
  Eye,
  Percent,
  Banknote,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TableSkeleton } from '@/components/admin/TableSkeleton';
import { EmptyState } from '@/components/admin/EmptyState';

interface MortgagePartner {
  id: string;
  user_id: string;
  bank_name: string;
  logo_url: string | null;
  interest_rate_min: number | null;
  interest_rate_max: number | null;
  max_loan_amount: number | null;
  max_tenure_years: number | null;
  processing_fee_percent: number | null;
  features: string[];
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

type TabValue = 'all' | 'verified' | 'unverified';

const PartnerManagement = () => {
  const { user } = useAuth();
  const [partners, setPartners] = useState<MortgagePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [selectedPartner, setSelectedPartner] = useState<MortgagePartner | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    bank_name: '',
    interest_rate_min: '',
    interest_rate_max: '',
    max_loan_amount: '',
    max_tenure_years: '',
    processing_fee_percent: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    features: '',
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mortgage_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPartners((data || []).map(p => ({
        ...p,
        features: p.features || [],
      })));
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (partner: MortgagePartner) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('mortgage_partners')
        .update({ verified: true, updated_at: new Date().toISOString() })
        .eq('id', partner.id);

      if (error) throw error;

      // Log audit event
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'partner_verified',
        entity_type: 'mortgage_partner',
        entity_id: partner.id,
        details: { partner_name: partner.bank_name },
      });

      setPartners(partners.map(p => 
        p.id === partner.id ? { ...p, verified: true } : p
      ));
      toast.success('Partner verified successfully');
    } catch (error) {
      console.error('Error verifying partner:', error);
      toast.error('Failed to verify partner');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnverify = async (partner: MortgagePartner) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('mortgage_partners')
        .update({ verified: false, updated_at: new Date().toISOString() })
        .eq('id', partner.id);

      if (error) throw error;

      // Log audit event
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'partner_unverified',
        entity_type: 'mortgage_partner',
        entity_id: partner.id,
        details: { partner_name: partner.bank_name },
      });

      setPartners(partners.map(p => 
        p.id === partner.id ? { ...p, verified: false } : p
      ));
      toast.success('Partner verification removed');
    } catch (error) {
      console.error('Error unverifying partner:', error);
      toast.error('Failed to remove verification');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (partner?: MortgagePartner) => {
    if (partner) {
      setSelectedPartner(partner);
      setFormData({
        bank_name: partner.bank_name,
        interest_rate_min: partner.interest_rate_min?.toString() || '',
        interest_rate_max: partner.interest_rate_max?.toString() || '',
        max_loan_amount: partner.max_loan_amount?.toString() || '',
        max_tenure_years: partner.max_tenure_years?.toString() || '',
        processing_fee_percent: partner.processing_fee_percent?.toString() || '',
        contact_email: partner.contact_email || '',
        contact_phone: partner.contact_phone || '',
        website_url: partner.website_url || '',
        features: partner.features.join(', '),
      });
    } else {
      setSelectedPartner(null);
      setFormData({
        bank_name: '',
        interest_rate_min: '',
        interest_rate_max: '',
        max_loan_amount: '',
        max_tenure_years: '',
        processing_fee_percent: '',
        contact_email: '',
        contact_phone: '',
        website_url: '',
        features: '',
      });
    }
    setEditOpen(true);
  };

  const handleSavePartner = async () => {
    if (!formData.bank_name.trim()) {
      toast.error('Bank name is required');
      return;
    }

    setActionLoading(true);
    try {
      const partnerData = {
        bank_name: formData.bank_name,
        interest_rate_min: formData.interest_rate_min ? parseFloat(formData.interest_rate_min) : null,
        interest_rate_max: formData.interest_rate_max ? parseFloat(formData.interest_rate_max) : null,
        max_loan_amount: formData.max_loan_amount ? parseFloat(formData.max_loan_amount) : null,
        max_tenure_years: formData.max_tenure_years ? parseInt(formData.max_tenure_years) : null,
        processing_fee_percent: formData.processing_fee_percent ? parseFloat(formData.processing_fee_percent) : null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        website_url: formData.website_url || null,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      };

      if (selectedPartner) {
        // Update existing
        const { error } = await supabase
          .from('mortgage_partners')
          .update(partnerData)
          .eq('id', selectedPartner.id);

        if (error) throw error;

        // Log audit event
        await supabase.from('activity_logs').insert({
          user_id: user?.id,
          action: 'partner_updated',
          entity_type: 'mortgage_partner',
          entity_id: selectedPartner.id,
          details: { partner_name: formData.bank_name },
        });

        toast.success('Partner updated successfully');
      } else {
        // Create new - need a user_id
        const { error } = await supabase
          .from('mortgage_partners')
          .insert({
            ...partnerData,
            user_id: user?.id,
          });

        if (error) throw error;

        // Log audit event
        await supabase.from('activity_logs').insert({
          user_id: user?.id,
          action: 'partner_created',
          entity_type: 'mortgage_partner',
          entity_id: null,
          details: { partner_name: formData.bank_name },
        });

        toast.success('Partner created successfully');
      }

      setEditOpen(false);
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error('Failed to save partner');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPartners = partners.filter(partner => {
    // Tab filter
    if (activeTab === 'verified' && !partner.verified) return false;
    if (activeTab === 'unverified' && partner.verified) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        partner.bank_name.toLowerCase().includes(q) ||
        partner.contact_email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: partners.length,
    verified: partners.filter(p => p.verified).length,
    unverified: partners.filter(p => !p.verified).length,
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout title="Partner Management" navItems={adminNavItems}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Partners</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.verified}</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <ShieldOff className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.unverified}</p>
              <p className="text-xs text-muted-foreground">Unverified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-xl border border-border">
        {/* Tabs */}
        <div className="border-b border-border px-4 pt-4 flex justify-between items-start">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
              >
                All Partners
              </TabsTrigger>
              <TabsTrigger
                value="verified"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
              >
                Verified
              </TabsTrigger>
              <TabsTrigger
                value="unverified"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3"
              >
                Unverified
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => openEditModal()} className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Partner
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by bank name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : filteredPartners.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No partners found"
              description="No mortgage partners match your current filters"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Max Loan</TableHead>
                  <TableHead>Max Tenure</TableHead>
                  <TableHead>Processing Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{partner.bank_name}</p>
                          <p className="text-sm text-muted-foreground">{partner.contact_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {partner.interest_rate_min && partner.interest_rate_max ? (
                        <span className="font-medium">
                          {partner.interest_rate_min}% - {partner.interest_rate_max}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(partner.max_loan_amount)}</TableCell>
                    <TableCell>
                      {partner.max_tenure_years ? `${partner.max_tenure_years} years` : '-'}
                    </TableCell>
                    <TableCell>
                      {partner.processing_fee_percent ? `${partner.processing_fee_percent}%` : '-'}
                    </TableCell>
                    <TableCell>
                      {partner.verified ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <ShieldOff className="w-3 h-3 mr-1" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedPartner(partner);
                            setDetailsOpen(true);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditModal(partner)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Partner
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {partner.verified ? (
                            <DropdownMenuItem 
                              onClick={() => handleUnverify(partner)}
                              disabled={actionLoading}
                            >
                              <ShieldOff className="w-4 h-4 mr-2" />
                              Remove Verification
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleVerify(partner)}
                              disabled={actionLoading}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Verify Partner
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Partner Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedPartner.bank_name}</h3>
                  {selectedPartner.verified && (
                    <Badge className="bg-green-100 text-green-700">Verified Partner</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-medium">
                    {selectedPartner.interest_rate_min && selectedPartner.interest_rate_max
                      ? `${selectedPartner.interest_rate_min}% - ${selectedPartner.interest_rate_max}%`
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Loan Amount</p>
                  <p className="font-medium">{formatCurrency(selectedPartner.max_loan_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Tenure</p>
                  <p className="font-medium">
                    {selectedPartner.max_tenure_years ? `${selectedPartner.max_tenure_years} years` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processing Fee</p>
                  <p className="font-medium">
                    {selectedPartner.processing_fee_percent ? `${selectedPartner.processing_fee_percent}%` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedPartner.contact_email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedPartner.contact_phone || '-'}</p>
                </div>
              </div>

              {selectedPartner.website_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Website</p>
                  <a 
                    href={selectedPartner.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {selectedPartner.website_url}
                  </a>
                </div>
              )}

              {selectedPartner.features.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.features.map((feature, i) => (
                      <Badge key={i} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => openEditModal(selectedPartner)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {selectedPartner.verified ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleUnverify(selectedPartner)}
                    disabled={actionLoading}
                  >
                    <ShieldOff className="w-4 h-4 mr-2" />
                    Remove Verification
                  </Button>
                ) : (
                  <Button onClick={() => handleVerify(selectedPartner)} disabled={actionLoading}>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Partner
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPartner ? 'Edit Partner' : 'Add New Partner'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank_name">Bank Name *</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                placeholder="Enter bank name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="interest_rate_min">Min Interest Rate (%)</Label>
                <Input
                  id="interest_rate_min"
                  type="number"
                  step="0.1"
                  value={formData.interest_rate_min}
                  onChange={(e) => setFormData({ ...formData, interest_rate_min: e.target.value })}
                  placeholder="e.g., 12.5"
                />
              </div>
              <div>
                <Label htmlFor="interest_rate_max">Max Interest Rate (%)</Label>
                <Input
                  id="interest_rate_max"
                  type="number"
                  step="0.1"
                  value={formData.interest_rate_max}
                  onChange={(e) => setFormData({ ...formData, interest_rate_max: e.target.value })}
                  placeholder="e.g., 18.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_loan_amount">Max Loan Amount (PKR)</Label>
                <Input
                  id="max_loan_amount"
                  type="number"
                  value={formData.max_loan_amount}
                  onChange={(e) => setFormData({ ...formData, max_loan_amount: e.target.value })}
                  placeholder="e.g., 50000000"
                />
              </div>
              <div>
                <Label htmlFor="max_tenure_years">Max Tenure (years)</Label>
                <Input
                  id="max_tenure_years"
                  type="number"
                  value={formData.max_tenure_years}
                  onChange={(e) => setFormData({ ...formData, max_tenure_years: e.target.value })}
                  placeholder="e.g., 25"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="processing_fee_percent">Processing Fee (%)</Label>
              <Input
                id="processing_fee_percent"
                type="number"
                step="0.1"
                value={formData.processing_fee_percent}
                onChange={(e) => setFormData({ ...formData, processing_fee_percent: e.target.value })}
                placeholder="e.g., 1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="partner@bank.com"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://www.bank.com"
              />
            </div>
            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Quick approval, No prepayment penalty, Flexible terms"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePartner} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : selectedPartner ? 'Update Partner' : 'Create Partner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PartnerManagement;
