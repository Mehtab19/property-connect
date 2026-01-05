/**
 * Mortgage Partner Dashboard
 * Dashboard for mortgage/lending partners to manage leads and loan products
 */

import { useState } from 'react';
import DashboardLayout, { mortgagePartnerNavItems } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, DollarSign, Clock, CheckCircle2, FileText, Phone } from 'lucide-react';

const MortgagePartnerDashboard = () => {
  // Mock data
  const stats = {
    totalLeads: 48,
    newLeads: 12,
    inProgress: 18,
    approved: 8,
    disbursed: 5,
    totalValue: '₹12.5 Cr',
  };

  const recentLeads = [
    { id: '1', name: 'Suresh Menon', amount: '₹85 L', property: 'Marina Bay Residences', status: 'new', date: '1 hour ago' },
    { id: '2', name: 'Kavita Reddy', amount: '₹1.2 Cr', property: 'Crystal Tower', status: 'processing', date: '3 hours ago' },
    { id: '3', name: 'Rajesh Iyer', amount: '₹65 L', property: 'Oak Park Apartments', status: 'approved', date: '1 day ago' },
    { id: '4', name: 'Anita Sharma', amount: '₹95 L', property: 'Sunset Heights', status: 'documents', date: '2 days ago' },
  ];

  const loanProducts = [
    { name: 'Home Loan Standard', rate: '8.5% - 9.75%', tenure: 'Up to 30 years', leads: 25 },
    { name: 'Home Loan Premium', rate: '8.25% - 9.25%', tenure: 'Up to 30 years', leads: 15 },
    { name: 'Balance Transfer', rate: '8.0% onwards', tenure: 'Up to 25 years', leads: 8 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
      case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400';
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400';
      case 'documents': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400';
      default: return '';
    }
  };

  return (
    <DashboardLayout title="Mortgage Partner Dashboard" navItems={mortgagePartnerNavItems}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.totalLeads}</p>
              <p className="text-xs text-muted-foreground">Total Leads</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 dark:border-blue-900">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.newLeads}</p>
              <p className="text-xs text-muted-foreground">New Leads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stats.disbursed}</p>
              <p className="text-xs text-muted-foreground">Disbursed</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{stats.totalValue}</p>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Mortgage Leads</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.property}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="font-bold text-primary">{lead.amount}</p>
                        <p className="text-xs text-muted-foreground">{lead.date}</p>
                      </div>
                      <Badge className={getStatusColor(lead.status)} variant="secondary">
                        {lead.status}
                      </Badge>
                      <Button size="icon" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loan Products Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanProducts.map((product, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-primary font-semibold">{product.rate}</p>
                    <p className="text-xs text-muted-foreground">{product.tenure}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Active Leads</span>
                      <Badge variant="secondary">{product.leads}</Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  Manage Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Users className="h-5 w-5" />
                <span>View New Leads</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="h-5 w-5" />
                <span>Update Products</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Process Approvals</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MortgagePartnerDashboard;
