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
  TrendingUp,
  Users,
  Target,
  Award,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Plus,
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
  AreaChart,
  Area,
} from 'recharts';
import {
  salesReps,
  physicians,
  sites,
  patients,
} from '@/data/mockData';

export default function SalesDashboard() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate filtered data based on global filters
  const filteredSites = sites.filter(site => 
    filters.region === 'all' || site.state === filters.region
  );

  const filteredReps = salesReps.filter(rep =>
    filters.region === 'all' || rep.region === filters.region
  );

  // Weekly case velocity data
  const caseVelocity = [
    { week: 'W1', cases: 28, target: 30 },
    { week: 'W2', cases: 35, target: 30 },
    { week: 'W3', cases: 32, target: 32 },
    { week: 'W4', cases: 38, target: 32 },
    { week: 'W5', cases: 42, target: 35 },
    { week: 'W6', cases: 39, target: 35 },
    { week: 'W7', cases: 45, target: 38 },
    { week: 'W8', cases: 48, target: 38 },
  ];

  // Patient pipeline data
  const pipelineData = [
    { stage: 'New Lead', count: 85, conversion: '100%' },
    { stage: 'Contacted', count: 72, conversion: '85%' },
    { stage: 'Qualifying', count: 58, conversion: '68%' },
    { stage: 'VAC Submitted', count: 45, conversion: '53%' },
    { stage: 'VAC Approved', count: 38, conversion: '45%' },
    { stage: 'Scheduled', count: 32, conversion: '38%' },
    { stage: 'Completed', count: 28, conversion: '33%' },
  ];

  // Sales rep columns
  const repColumns = [
    {
      header: 'Rep',
      accessor: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {val.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm">{val}</p>
            <p className="text-xs text-muted-foreground">{row.territory}</p>
          </div>
        </div>
      ),
    },
    { header: 'Region', accessor: 'region', render: (val) => <span className="capitalize">{val}</span> },
    {
      header: 'Performance',
      accessor: 'performance',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                val >= 100 ? 'bg-success' : val >= 80 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(val, 100)}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${
            val >= 100 ? 'text-success' : val >= 80 ? 'text-warning' : 'text-destructive'
          }`}>
            {val}%
          </span>
        </div>
      ),
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

  // Site columns
  const siteColumns = [
    {
      header: 'Site',
      accessor: 'name',
      render: (val, row) => (
        <div>
          <p className="font-medium text-sm">{val}</p>
          <p className="text-xs text-muted-foreground">{row.city}, {row.state.toUpperCase()}</p>
        </div>
      ),
    },
    { header: 'Physicians', accessor: 'physiciansCount' },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
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

  // Patient columns
  const patientColumns = [
    { header: 'Patient', accessor: 'initials', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Age', accessor: 'age' },
    {
      header: 'Clinical Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'VAC Status',
      accessor: 'vacStatus',
      render: (val) => <StatusBadge status={val === 'approved' ? 'approved' : val === 'pending' ? 'pending' : 'stalled'} />,
    },
    {
      header: 'Surgery Date',
      accessor: 'surgeryDate',
      render: (val) => val ? new Date(val).toLocaleDateString() : '—',
    },
    {
      header: 'Next Action',
      accessor: 'id',
      render: (_, row) => {
        if (row.status === 'not_qualified') return <span className="text-xs text-muted-foreground">Re-evaluate</span>;
        if (row.vacStatus === 'pending') return <span className="text-xs text-warning">Follow up VAC</span>;
        if (row.vacStatus === 'approved' && !row.surgeryDate) return <span className="text-xs text-info">Schedule surgery</span>;
        if (row.surgeryDate) return <span className="text-xs text-success">Prep complete</span>;
        return <span className="text-xs text-muted-foreground">Submit VAC</span>;
      },
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Sales & Commercial"
        subtitle="Territory performance and patient pipeline tracking"
        icon={TrendingUp}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Enrollment
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Pipeline"
          value={245}
          change={8.2}
          changeLabel="vs last month"
          icon={Users}
        />
        <KPICard
          title="Sites Live"
          value={filteredSites.filter(s => s.status === 'active').length}
          change={12.5}
          changeLabel="vs last quarter"
          icon={MapPin}
        />
        <KPICard
          title="Quota Attainment"
          value={94}
          change={3.2}
          changeLabel="vs target"
          icon={Target}
          format="percent"
        />
        <KPICard
          title="Top Rep Score"
          value={102}
          change={0}
          changeLabel="of quota"
          icon={Award}
          format="percent"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Patient Pipeline</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="reps">Sales Reps</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Case Velocity Trend */}
            <Card className="card-clinical">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Weekly Case Velocity</CardTitle>
                  <Badge variant="secondary" className="text-xs font-normal">8-week trend</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={caseVelocity}>
                      <defs>
                        <linearGradient id="caseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="cases"
                        stroke="hsl(var(--primary))"
                        fill="url(#caseGradient)"
                        strokeWidth={2}
                        name="Cases"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        dot={false}
                        name="Target"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sales Leaderboard */}
            <Card className="card-clinical">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Sales Leaderboard</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActiveTab('reps')}>
                    View All
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredReps.sort((a, b) => b.performance - a.performance).slice(0, 5).map((rep, index) => (
                    <div
                      key={rep.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-warning text-warning-foreground' :
                        index === 1 ? 'bg-muted-foreground/30 text-foreground' :
                        index === 2 ? 'bg-warning/50 text-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rep.name}</p>
                        <p className="text-xs text-muted-foreground">{rep.territory}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          rep.performance >= 100 ? 'text-success' : 'text-foreground'
                        }`}>
                          {rep.performance}%
                        </p>
                        <p className="text-xs text-muted-foreground">of quota</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Pipeline Funnel */}
          <Card className="card-clinical">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Patient Pipeline by Stage</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActiveTab('pipeline')}>
                  View Details
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {pipelineData.map((stage, index) => (
                  <div key={stage.stage} className="text-center">
                    <div
                      className="bg-primary/10 rounded-lg flex items-end justify-center mx-auto mb-2 w-full max-w-[60px]"
                      style={{ height: `${(stage.count / pipelineData[0].count) * 120 + 40}px` }}
                    >
                      <span className="text-lg font-bold text-primary pb-2">{stage.count}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">{stage.stage}</p>
                    <p className="text-xs font-medium text-primary mt-1">{stage.conversion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-4">
          <DataTable
            title="Patient Pipeline"
            description="Active patients in the sales funnel"
            columns={patientColumns}
            data={patients}
            onRowClick={(row) => navigate('/clinical')}
          />
        </TabsContent>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-4">
          <DataTable
            title="Sites"
            description="All enrolled sites and their status"
            columns={siteColumns}
            data={filteredSites}
          />
        </TabsContent>

        {/* Reps Tab */}
        <TabsContent value="reps" className="space-y-4">
          <DataTable
            title="Sales Representatives"
            description="Performance by territory"
            columns={repColumns}
            data={filteredReps}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
