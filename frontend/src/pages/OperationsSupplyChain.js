import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '@/contexts/FilterContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common/PageHeader';
import { KPICard } from '@/components/common/KPICard';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Package,
  Truck,
  Factory,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { inventory, products } from '@/data/mockData';

export default function OperationsSupplyChain() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState('overview');

  // Units in process data
  const unitsInProcess = [
    { stage: 'Raw Materials', count: 120, status: 'healthy' },
    { stage: 'Assembly', count: 85, status: 'healthy' },
    { stage: 'Quality Check', count: 45, status: 'healthy' },
    { stage: 'Sterilization', count: 32, status: 'warning' },
    { stage: 'Packaging', count: 28, status: 'healthy' },
    { stage: 'Ready to Ship', count: 156, status: 'healthy' },
  ];

  // Demand forecast data
  const demandForecast = [
    { month: 'Jan', actual: 145, forecast: 150, pipeline: 142 },
    { month: 'Feb', actual: 162, forecast: 155, pipeline: 158 },
    { month: 'Mar', actual: 178, forecast: 165, pipeline: 172 },
    { month: 'Apr', actual: null, forecast: 175, pipeline: 168 },
    { month: 'May', actual: null, forecast: 185, pipeline: 178 },
    { month: 'Jun', actual: null, forecast: 195, pipeline: 188 },
  ];

  // Inventory by location
  const inventoryByLocation = [
    { location: 'Main Warehouse', urolift: 245, itind: 128, rezum: 89, total: 462 },
    { location: 'East Hub', urolift: 78, itind: 45, rezum: 32, total: 155 },
    { location: 'West Hub', urolift: 89, itind: 52, rezum: 41, total: 182 },
    { location: 'South Hub', urolift: 56, itind: 38, rezum: 28, total: 122 },
  ];

  // Manufacturing schedule
  const manufacturingSchedule = [
    { id: 'lot1', product: 'UroLift System', quantity: 500, startDate: '2024-02-15', endDate: '2024-02-28', status: 'in_progress' },
    { id: 'lot2', product: 'iTind Device', quantity: 300, startDate: '2024-02-20', endDate: '2024-03-05', status: 'scheduled' },
    { id: 'lot3', product: 'Rezum System', quantity: 400, startDate: '2024-02-25', endDate: '2024-03-10', status: 'scheduled' },
    { id: 'lot4', product: 'UroLift System', quantity: 600, startDate: '2024-03-01', endDate: '2024-03-15', status: 'planned' },
  ];

  // Inventory risk alerts
  const inventoryRisks = [
    { product: 'Rezum System', location: 'East Hub', currentQty: 32, reorderPoint: 40, daysToStockout: 8, priority: 'high' },
    { product: 'iTind Device', location: 'South Hub', currentQty: 38, reorderPoint: 35, daysToStockout: 12, priority: 'medium' },
    { product: 'UroLift System', location: 'West Hub', currentQty: 89, reorderPoint: 75, daysToStockout: 18, priority: 'low' },
  ];

  // Inventory columns
  const inventoryColumns = [
    {
      header: 'Product',
      accessor: 'productId',
      render: (val) => {
        const product = products.find(p => p.id === val);
        return <span className="font-medium">{product?.name || val}</span>;
      },
    },
    { header: 'Location', accessor: 'location' },
    { header: 'Quantity', accessor: 'quantity', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Reorder Point', accessor: 'reorderPoint' },
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

  // Manufacturing columns
  const manufacturingColumns = [
    { header: 'Product', accessor: 'product', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Quantity', accessor: 'quantity', render: (val) => val.toLocaleString() },
    { header: 'Start Date', accessor: 'startDate', render: (val) => new Date(val).toLocaleDateString() },
    { header: 'End Date', accessor: 'endDate', render: (val) => new Date(val).toLocaleDateString() },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => {
        const statusMap = {
          in_progress: { label: 'In Progress', status: 'pending' },
          scheduled: { label: 'Scheduled', status: 'info' },
          planned: { label: 'Planned', status: 'completed' },
        };
        return <StatusBadge status={statusMap[val]?.status || 'pending'} customLabel={statusMap[val]?.label} />;
      },
    },
  ];

  // Risk columns
  const riskColumns = [
    { header: 'Product', accessor: 'product', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Location', accessor: 'location' },
    {
      header: 'Current Qty',
      accessor: 'currentQty',
      render: (val, row) => (
        <span className={val < row.reorderPoint ? 'text-destructive font-medium' : ''}>
          {val}
        </span>
      ),
    },
    { header: 'Reorder Point', accessor: 'reorderPoint' },
    {
      header: 'Days to Stockout',
      accessor: 'daysToStockout',
      render: (val) => (
        <Badge variant="outline" className={`text-xs ${
          val <= 7 ? 'border-destructive text-destructive' :
          val <= 14 ? 'border-warning text-warning' :
          'border-muted-foreground'
        }`}>
          {val} days
        </Badge>
      ),
    },
    {
      header: 'Action',
      accessor: 'priority',
      render: (val) => (
        <Button size="sm" variant={val === 'high' ? 'destructive' : 'outline'}>
          Reorder
        </Button>
      ),
    },
  ];

  const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(i => i.status === 'low' || i.status === 'critical').length;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Operations & Supply Chain"
        subtitle="Inventory management and manufacturing oversight"
        icon={Package}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync ERP
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Inventory"
          value={totalInventory}
          change={5.2}
          changeLabel="vs last month"
          icon={Package}
        />
        <KPICard
          title="Units in Process"
          value={unitsInProcess.reduce((sum, u) => sum + u.count, 0)}
          change={12.4}
          changeLabel="production up"
          icon={Factory}
        />
        <KPICard
          title="Ready to Ship"
          value={156}
          change={8.7}
          changeLabel="vs last week"
          icon={Truck}
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockItems}
          change={lowStockItems > 0 ? -1 : 0}
          changeLabel="items at risk"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Units in Process */}
        <Card className="card-clinical lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Production Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unitsInProcess.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{stage.stage}</span>
                    <span className="font-medium">{stage.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stage.status === 'healthy' ? 'bg-primary' : 'bg-warning'
                      }`}
                      style={{ width: `${(stage.count / 160) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demand vs Supply Forecast */}
        <Card className="card-clinical lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Demand vs Supply Forecast</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">6-month view</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandForecast}>
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="forecast"
                    stroke="hsl(var(--primary))"
                    fill="url(#forecastGradient)"
                    strokeWidth={2}
                    name="Forecast"
                  />
                  <Area
                    type="monotone"
                    dataKey="pipeline"
                    stroke="hsl(var(--success))"
                    fill="url(#pipelineGradient)"
                    strokeWidth={2}
                    name="Pipeline"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--foreground))', r: 4 }}
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory by Location */}
      <Card className="card-clinical">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Inventory by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryByLocation}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="location"
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
                <Bar dataKey="urolift" stackId="a" fill="hsl(var(--primary))" name="UroLift" />
                <Bar dataKey="itind" stackId="a" fill="hsl(var(--chart-2))" name="iTind" />
                <Bar dataKey="rezum" stackId="a" fill="hsl(var(--chart-3))" name="Rezum" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Inventory</TabsTrigger>
          <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
          <TabsTrigger value="risks">
            Risks
            {inventoryRisks.filter(r => r.priority === 'high').length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                {inventoryRisks.filter(r => r.priority === 'high').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DataTable
            title="Current Inventory"
            description="Stock levels across all locations"
            columns={inventoryColumns}
            data={inventory}
          />
        </TabsContent>

        <TabsContent value="manufacturing" className="space-y-4">
          <DataTable
            title="Manufacturing Schedule"
            description="Upcoming production lots"
            columns={manufacturingColumns}
            data={manufacturingSchedule}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card className="card-clinical border-warning/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-base font-semibold">Inventory Risk Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={riskColumns} data={inventoryRisks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
