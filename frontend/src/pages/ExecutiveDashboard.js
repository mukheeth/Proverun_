import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '@/contexts/FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { KPICard } from '@/components/common/KPICard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Package,
  Activity,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  FileCheck,
  Clock,
  ChevronRight,
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
  Legend,
} from 'recharts';
import {
  kpiSummary,
  revenueByMonth,
  casesByRegion,
  vacStatusDistribution,
  siteRampFunnel,
  payerMix,
  notifications,
} from '@/data/mockData';

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { filters } = useFilters();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Alert items for quick action
  const alertItems = notifications.filter(n => n.priority === 'high');

  // Top payers data
  const topPayersColumns = [
    { header: 'Payer', accessor: 'payer' },
    { header: 'Revenue', accessor: 'amount', render: (val) => formatCurrency(val) },
    { header: 'Share', accessor: 'percentage', render: (val) => `${val}%` },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Executive Dashboard"
        subtitle={`Business overview for ${filters.timePeriod === 'quarter' ? 'Q1 2024' : filters.timePeriod === 'month' ? 'January 2024' : '2024'}`}
        icon={LayoutDashboard}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/reports')}
          >
            Export Report
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Patients"
          value={kpiSummary.totalPatients}
          change={kpiSummary.patientsChange}
          changeLabel="vs last quarter"
          icon={Users}
          onClick={() => navigate('/sales')}
        />
        <KPICard
          title="Active Sites"
          value={kpiSummary.activeSites}
          change={kpiSummary.sitesChange}
          changeLabel="vs last quarter"
          icon={Building2}
          onClick={() => navigate('/sales')}
        />
        <KPICard
          title="Quarter Revenue"
          value={kpiSummary.quarterRevenue}
          change={kpiSummary.revenueChange}
          changeLabel="vs last quarter"
          icon={DollarSign}
          format="currency"
          onClick={() => navigate('/finance')}
        />
        <KPICard
          title="Pending VACs"
          value={kpiSummary.pendingVACs}
          change={kpiSummary.vacsChange}
          changeLabel="vs last week"
          icon={FileCheck}
          onClick={() => navigate('/vac')}
        />
        <KPICard
          title="Inventory Health"
          value={kpiSummary.inventoryHealth}
          change={kpiSummary.inventoryChange}
          changeLabel="vs last month"
          icon={Package}
          format="percent"
          onClick={() => navigate('/operations')}
        />
      </div>

      {/* Health Score & ASP Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <Card className="card-kpi lg:col-span-1">
          <CardContent className="p-5">
            <p className="kpi-label mb-3">Business Health Score</p>
            <div className="relative h-28 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="hsl(var(--success))"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(87 / 100) * 301.59} 301.59`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-bold text-foreground">87</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">Good</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted" />
                <span className="text-xs text-muted-foreground">Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ASP vs Target */}
        <Card className="card-kpi lg:col-span-1">
          <CardContent className="p-5">
            <p className="kpi-label mb-3">ASP vs Target</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    {formatCurrency(kpiSummary.avgASP)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Average Selling Price</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target: {formatCurrency(kpiSummary.aspTarget)}</span>
                  <span className={kpiSummary.aspVariance >= 0 ? 'text-success' : 'text-warning'}>
                    {kpiSummary.aspVariance > 0 && '+'}{kpiSummary.aspVariance}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full"
                    style={{ width: `${(kpiSummary.avgASP / kpiSummary.aspTarget) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Red Flags & Opportunities */}
        <Card className="card-kpi lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Alerts & Opportunities
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => navigate('/notifications')}
              >
                View All
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {alertItems.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate('/notifications')}
                >
                  <span className={`mt-0.5 h-2 w-2 rounded-full ${
                    alert.type === 'alert' ? 'bg-destructive' :
                    alert.type === 'warning' ? 'bg-warning' : 'bg-info'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="card-clinical lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">
                6-month view
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(value) => `$${value / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [formatCurrency(value), '']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* VAC Status Distribution */}
        <Card className="card-clinical">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">VAC Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vacStatusDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {vacStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 -mt-4">
              {vacStatusDistribution.map((item) => (
                <div key={item.status} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                  <span className="text-xs font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Ramp Funnel & Cases by Region */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Site Ramp Funnel */}
        <Card className="card-clinical">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Site Ramp Funnel</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => navigate('/sales')}
              >
                View Details
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {siteRampFunnel.map((stage, index) => {
                const maxCount = siteRampFunnel[0].count;
                const width = (stage.count / maxCount) * 100;
                return (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{stage.stage}</span>
                      <span className="font-medium">{stage.count}</span>
                    </div>
                    <div className="h-7 bg-muted/30 rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary/20 rounded-md flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${width}%` }}
                      >
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cases by Region */}
        <Card className="card-clinical">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Cases by Region</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">
                vs Target
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={casesByRegion} layout="vertical" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="region"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Actual" />
                  <Bar dataKey="target" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Payers Table */}
      <DataTable
        title="Top Payers by Revenue"
        description="Revenue distribution across payer types"
        columns={topPayersColumns}
        data={payerMix}
        onRowClick={() => navigate('/finance')}
      />
    </div>
  );
}
