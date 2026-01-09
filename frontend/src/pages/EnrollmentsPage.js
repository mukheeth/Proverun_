import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '@/contexts/FilterContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  UserPlus,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  Building2,
  User,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { physicians, sites, salesReps, products } from '@/data/mockData';

export default function EnrollmentsPage() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock enrollments data
  const [enrollments] = useState([
    { id: 'enr1', physicianId: 'ph1', siteId: 'site1', salesRepId: 'sr1', status: 'active', enrollmentDate: '2024-01-15', product: 'UroLift System', trainingComplete: true },
    { id: 'enr2', physicianId: 'ph2', siteId: 'site2', salesRepId: 'sr2', status: 'pending', enrollmentDate: '2024-02-01', product: 'iTind Device', trainingComplete: false },
    { id: 'enr3', physicianId: 'ph3', siteId: 'site3', salesRepId: 'sr3', status: 'active', enrollmentDate: '2024-01-20', product: 'UroLift System', trainingComplete: true },
    { id: 'enr4', physicianId: 'ph4', siteId: 'site4', salesRepId: 'sr4', status: 'pending', enrollmentDate: '2024-02-10', product: 'Rezum System', trainingComplete: false },
    { id: 'enr5', physicianId: 'ph5', siteId: 'site5', salesRepId: 'sr5', status: 'active', enrollmentDate: '2024-01-25', product: 'UroLift System', trainingComplete: true },
    { id: 'enr6', physicianId: 'ph6', siteId: 'site6', salesRepId: 'sr6', status: 'stalled', enrollmentDate: '2023-12-15', product: 'iTind Device', trainingComplete: false },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    physician: '',
    site: '',
    salesRep: '',
    product: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    console.log('Enrollment submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ physician: '', site: '', salesRep: '', product: '', notes: '' });
  };

  // Enrich enrollment data
  const enrichedEnrollments = enrollments.map(enr => {
    const physician = physicians.find(p => p.id === enr.physicianId);
    const site = sites.find(s => s.id === enr.siteId);
    const salesRep = salesReps.find(r => r.id === enr.salesRepId);
    return {
      ...enr,
      physicianName: physician?.name || 'Unknown',
      siteName: site?.name || 'Unknown',
      salesRepName: salesRep?.name || 'Unknown',
    };
  });

  // Filter enrollments
  const filteredEnrollments = enrichedEnrollments.filter(enr => {
    if (activeTab !== 'all' && enr.status !== activeTab) return false;
    if (searchTerm && !enr.physicianName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !enr.siteName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      header: 'Physician',
      accessor: 'physicianName',
      render: (val) => <span className="font-medium">{val}</span>,
    },
    { header: 'Site', accessor: 'siteName' },
    { header: 'Sales Rep', accessor: 'salesRepName' },
    { header: 'Product', accessor: 'product' },
    {
      header: 'Enrollment Date',
      accessor: 'enrollmentDate',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      header: 'Training',
      accessor: 'trainingComplete',
      render: (val) => (
        <Badge variant="outline" className={val ? 'border-success text-success' : 'border-warning text-warning'}>
          {val ? 'Complete' : 'Pending'}
        </Badge>
      ),
    },
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

  const stats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.status === 'active').length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    stalled: enrollments.filter(e => e.status === 'stalled').length,
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="Enrollments"
        subtitle="Manage physician and site enrollments"
        icon={UserPlus}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Enrollment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Enrollment</DialogTitle>
                <DialogDescription>
                  Enroll a new physician or site into the program
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="physician">Physician</Label>
                  <Select value={formData.physician} onValueChange={(val) => setFormData({...formData, physician: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select physician" />
                    </SelectTrigger>
                    <SelectContent>
                      {physicians.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  <Select value={formData.site} onValueChange={(val) => setFormData({...formData, site: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesRep">Sales Representative</Label>
                  <Select value={formData.salesRep} onValueChange={(val) => setFormData({...formData, salesRep: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sales rep" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesReps.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select value={formData.product} onValueChange={(val) => setFormData({...formData, product: val})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Create Enrollment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.stalled}</p>
                <p className="text-sm text-muted-foreground">Stalled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by physician or site..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs and Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="stalled">Stalled ({stats.stalled})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredEnrollments}
            emptyMessage="No enrollments found"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
