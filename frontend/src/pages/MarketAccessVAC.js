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
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Building2,
  DollarSign,
  Plus,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { vacRecords, payers, patients, sites } from '@/data/mockData';

export default function MarketAccessVAC() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState('overview');

  // VAC pipeline data
  const vacPipeline = [
    { status: 'Submitted', count: 45, color: 'hsl(var(--info))' },
    { status: 'In Review', count: 32, color: 'hsl(var(--warning))' },
    { status: 'Pending Info', count: 18, color: 'hsl(var(--chart-4))' },
    { status: 'Approved', count: 127, color: 'hsl(var(--success))' },
    { status: 'Denied', count: 12, color: 'hsl(var(--destructive))' },
  ];

  // Approval rates by payer
  const approvalByPayer = payers.map(p => ({
    name: p.name,
    rate: p.approvalRate,
    type: p.type,
  }));

  // Stalled VACs (>7 days pending)
  const stalledVACs = [
    { id: 'vac101', patient: 'J.S.', payer: 'United Healthcare', daysPending: 14, reason: 'Missing documentation', site: 'Boston Medical' },
    { id: 'vac102', patient: 'M.B.', payer: 'Aetna', daysPending: 11, reason: 'Additional review', site: 'NYU Langone' },
    { id: 'vac103', patient: 'R.C.', payer: 'Humana MA', daysPending: 9, reason: 'Peer-to-peer required', site: 'Emory Healthcare' },
    { id: 'vac104', patient: 'D.W.', payer: 'BCBS', daysPending: 8, reason: 'Prior auth pending', site: 'UCLA Medical' },
  ];

  // Site readiness data
  const siteReadiness = [
    { site: 'Boston Medical', credentialed: true, contractActive: true, lastVAC: '2 days ago', successRate: 92 },
    { site: 'NYU Langone', credentialed: true, contractActive: true, lastVAC: '1 day ago', successRate: 88 },
    { site: 'Emory Healthcare', credentialed: true, contractActive: true, lastVAC: '3 days ago', successRate: 85 },
    { site: 'Northwestern', credentialed: true, contractActive: false, lastVAC: '15 days ago', successRate: 72 },
    { site: 'UCLA Medical', credentialed: true, contractActive: true, lastVAC: '1 day ago', successRate: 90 },
    { site: 'Texas Medical', credentialed: false, contractActive: true, lastVAC: 'N/A', successRate: 0 },
  ];

  // VAC record columns
  const vacColumns = [
    {
      header: 'Patient',
      accessor: 'patientId',
      render: (val) => {
        const patient = patients.find(p => p.id === val);
        return <span className="font-medium">{patient?.initials || val}</span>;
      },
    },
    {
      header: 'Payer',
      accessor: 'payerId',
      render: (val) => {
        const payer = payers.find(p => p.id === val);
        return payer?.name || val;
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Submitted',
      accessor: 'submissionDate',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      header: 'Approved',
      accessor: 'approvalDate',
      render: (val) => val ? new Date(val).toLocaleDateString() : '—',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (val) => `$${val.toLocaleString()}`,
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

  // Stalled VAC columns
  const stalledColumns = [
    { header: 'Patient', accessor: 'patient', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Payer', accessor: 'payer' },
    { header: 'Site', accessor: 'site' },
    {
      header: 'Days Pending',
      accessor: 'daysPending',
      render: (val) => (
        <Badge variant="outline" className={`text-xs ${
          val > 10 ? 'border-destructive text-destructive' : 'border-warning text-warning'
        }`}>
          {val} days
        </Badge>
      ),
    },
    { header: 'Reason', accessor: 'reason' },
    {
      header: 'Action',
      accessor: 'id',
      render: () => (
        <Button size="sm" variant="outline">
          Follow Up
        </Button>
      ),
    },
  ];

  // Site readiness columns
  const siteColumns = [
    { header: 'Site', accessor: 'site', render: (val) => <span className="font-medium">{val}</span> },
    {
      header: 'Credentialed',
      accessor: 'credentialed',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          {val ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <XCircle className="h-4 w-4 text-destructive" />
          )}
          <span className="text-sm">{val ? 'Yes' : 'No'}</span>
        </div>
      ),
    },
    {
      header: 'Contract',
      accessor: 'contractActive',
      render: (val) => (
        <div className="flex items-center gap-1.5">
          {val ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-warning" />
          )}
          <span className="text-sm">{val ? 'Active' : 'Pending'}</span>
        </div>
      ),
    },
    { header: 'Last VAC', accessor: 'lastVAC' },
    {
      header: 'Success Rate',
      accessor: 'successRate',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                val >= 85 ? 'bg-success' : val >= 70 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-sm font-medium">{val}%</span>
        </div>
      ),
    },
  ];

  const totalVACs = vacPipeline.reduce((sum, item) => sum + item.count, 0);
  const approvedVACs = vacPipeline.find(v => v.status === 'Approved')?.count || 0;
  const pendingVACs = vacPipeline.filter(v => ['Submitted', 'In Review', 'Pending Info'].includes(v.status))
    .reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Market Access (VAC)"
        subtitle="Verification and Authorization for Coverage tracking"
        icon={FileCheck}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New VAC Request
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total VACs"
          value={totalVACs}
          change={15.3}
          changeLabel="vs last month"
          icon={FileCheck}
        />
        <KPICard
          title="Approved"
          value={approvedVACs}
          change={8.7}
          changeLabel="vs last month"
          icon={CheckCircle2}
        />
        <KPICard
          title="Pending"
          value={pendingVACs}
          change={-12.4}
          changeLabel="vs last week"
          icon={Clock}
        />
        <KPICard
          title="Approval Rate"
          value={Math.round((approvedVACs / (totalVACs - pendingVACs)) * 100)}
          change={2.1}
          changeLabel="improvement"
          icon={TrendingUp}
          format="percent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* VAC Pipeline */}
        <Card className="card-clinical">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">VAC Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vacPipeline}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {vacPipeline.map((entry, index) => (
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
            <div className="flex flex-wrap justify-center gap-3 -mt-2">
              {vacPipeline.map((item) => (
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

        {/* Approval Rate by Payer */}
        <Card className="card-clinical">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Approval Rate by Payer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={approvalByPayer} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value}%`, 'Approval Rate']}
                  />
                  <Bar
                    dataKey="rate"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">All VACs</TabsTrigger>
          <TabsTrigger value="stalled">
            Stalled
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {stalledVACs.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sites">Site Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DataTable
            title="VAC Records"
            description="All verification and authorization requests"
            columns={vacColumns}
            data={vacRecords}
          />
        </TabsContent>

        <TabsContent value="stalled" className="space-y-4">
          <Card className="card-clinical border-warning/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-base font-semibold">Stalled VACs (&gt;7 Days)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={stalledColumns} data={stalledVACs} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sites" className="space-y-4">
          <DataTable
            title="Site Readiness"
            description="Site credentialing and contract status"
            columns={siteColumns}
            data={siteReadiness}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
