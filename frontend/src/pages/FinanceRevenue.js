import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '@/contexts/FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/common/PageHeader';
import { KPICard } from '@/components/common/KPICard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  DollarSign,
  Receipt,
  CreditCard,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Download,
  Plus,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { invoices, agingBuckets, sites, physicians, patients, payerMix } from '@/data/mockData';

export default function FinanceRevenue() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState('overview');

  // Revenue trend data
  const revenueTrend = [
    { month: 'Aug', revenue: 1420000, collections: 1380000 },
    { month: 'Sep', revenue: 1580000, collections: 1520000 },
    { month: 'Oct', revenue: 1720000, collections: 1650000 },
    { month: 'Nov', revenue: 1650000, collections: 1590000 },
    { month: 'Dec', revenue: 1890000, collections: 1780000 },
    { month: 'Jan', revenue: 1780000, collections: 1720000 },
  ];

  // Aging buckets colors
  const agingColors = [
    'hsl(var(--success))',
    'hsl(var(--chart-2))',
    'hsl(var(--warning))',
    'hsl(var(--chart-4))',
    'hsl(var(--destructive))',
  ];

  // Payment status summary
  const paymentSummary = {
    totalBilled: 1890000,
    collected: 1720000,
    outstanding: 170000,
    overdue: 67000,
  };

  // Extended invoice data with more details
  const enhancedInvoices = invoices.map(inv => {
    const site = sites.find(s => s.id === inv.siteId);
    const physician = physicians.find(p => p.id === inv.physicianId);
    const patient = patients.find(p => p.id === inv.patientId);
    return {
      ...inv,
      siteName: site?.name || inv.siteId,
      physicianName: physician?.name || inv.physicianId,
      patientInitials: patient?.initials || inv.patientId,
      invoiceNumber: `INV-2024-${inv.id.replace('inv', '0').padStart(4, '0')}`,
    };
  });

  // Invoice columns
  const invoiceColumns = [
    { header: 'Invoice #', accessor: 'invoiceNumber', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Patient', accessor: 'patientInitials' },
    { header: 'Site', accessor: 'siteName', render: (val) => <span className="text-sm text-muted-foreground truncate max-w-[120px] block">{val}</span> },
    { header: 'Amount', accessor: 'amount', render: (val) => <span className="font-medium">${val.toLocaleString()}</span> },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      header: 'Paid Date',
      accessor: 'paidDate',
      render: (val) => val ? new Date(val).toLocaleDateString() : '—',
    },
    {
      header: '',
      accessor: 'id',
      render: () => (
        <Button variant="ghost" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Aging bucket columns
  const agingColumns = [
    { header: 'Bucket', accessor: 'bucket', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Amount', accessor: 'amount', render: (val) => <span className="font-medium">${val.toLocaleString()}</span> },
    { header: 'Invoices', accessor: 'count' },
    {
      header: '% of Total',
      accessor: 'amount',
      cellClassName: 'percent-cell',
      render: (val) => {
        const total = agingBuckets.reduce((sum, b) => sum + b.amount, 0);
        return `${Math.round((val / total) * 100)}%`;
      },
    },
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);

  const totalAging = agingBuckets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Finance & Revenue"
        subtitle="Invoice management and cash flow visibility"
        icon={DollarSign}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Billed (MTD)"
          value={paymentSummary.totalBilled}
          change={15.2}
          changeLabel="vs last month"
          icon={Receipt}
          format="currency"
        />
        <KPICard
          title="Collected (MTD)"
          value={paymentSummary.collected}
          change={12.8}
          changeLabel="vs last month"
          icon={CreditCard}
          format="currency"
        />
        <KPICard
          title="Outstanding"
          value={paymentSummary.outstanding}
          change={-8.4}
          changeLabel="improved"
          icon={Clock}
          format="currency"
        />
        <KPICard
          title="Overdue"
          value={paymentSummary.overdue}
          change={-15.2}
          changeLabel="reduced"
          icon={AlertCircle}
          format="currency"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="card-clinical lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Revenue vs Collections</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">6-month trend</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="collectGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(val) => `$${val / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    fill="url(#revenueGrad)"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="collections"
                    stroke="hsl(var(--success))"
                    fill="url(#collectGrad)"
                    strokeWidth={2}
                    name="Collections"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Aging Buckets Chart */}
        <Card className="card-clinical">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">A/R Aging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agingBuckets}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {agingBuckets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={agingColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 -mt-4">
              {agingBuckets.map((item, index) => (
                <div key={item.bucket} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: agingColors[index] }}
                  />
                  <span className="text-xs text-muted-foreground">{item.bucket}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aging Summary Bars */}
      <Card className="card-clinical">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Aging Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agingBuckets.map((bucket, index) => {
              const percentage = (bucket.amount / totalAging) * 100;
              return (
                <div key={bucket.bucket}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{bucket.bucket}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{bucket.count} invoices</span>
                      <span className="font-medium w-24 text-right">{formatCurrency(bucket.amount)}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: agingColors[index],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {enhancedInvoices.filter(i => i.status === 'overdue').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DataTable
            title="Invoice Register"
            description="All invoices and payment status"
            columns={invoiceColumns}
            data={enhancedInvoices}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <DataTable
            title="Pending Invoices"
            description="Invoices awaiting payment"
            columns={invoiceColumns}
            data={enhancedInvoices.filter(i => i.status === 'pending')}
          />
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card className="card-clinical border-destructive/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-base font-semibold">Overdue Invoices</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={invoiceColumns}
                data={enhancedInvoices.filter(i => i.status === 'overdue')}
                emptyMessage="No overdue invoices"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <DataTable
            title="Paid Invoices"
            description="Completed payments"
            columns={invoiceColumns}
            data={enhancedInvoices.filter(i => i.status === 'paid')}
          />
        </TabsContent>
      </Tabs>

      {/* Payer Mix */}
      <DataTable
        title="Revenue by Payer Type"
        description="Distribution across payer categories"
        columns={[
          { header: 'Payer Type', accessor: 'payer', render: (val) => <span className="font-medium">{val}</span> },
          { header: 'Revenue', accessor: 'amount', render: (val) => formatCurrency(val) },
          { header: 'Share', accessor: 'percentage', render: (val) => `${val}%` },
          {
            header: 'Distribution',
            accessor: 'percentage',
            cellClassName: 'dist-cell',
            render: (val) => (
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${val * 2}%` }}
                />
              </div>
            ),
          },
        ]}
        data={payerMix}
      />
    </div>
  );
}
