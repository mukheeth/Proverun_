import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '@/contexts/FilterContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Stethoscope,
  Plus,
  Search,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  Users,
  Building2,
} from 'lucide-react';
import { physicians, sites, regions } from '@/data/mockData';

export default function PhysiciansPage() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPhysician, setSelectedPhysician] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Extended physician data
  const extendedPhysicians = [
    { id: 'ph1', name: 'Dr. Michael Anderson', specialty: 'Urology', siteId: 'site1', cases: 45, status: 'active', email: 'm.anderson@hospital.com', phone: '(555) 123-4567', npi: '1234567890', credentialed: true, trainingDate: '2023-06-15' },
    { id: 'ph2', name: 'Dr. Jennifer Martinez', specialty: 'Urology', siteId: 'site2', cases: 38, status: 'active', email: 'j.martinez@hospital.com', phone: '(555) 234-5678', npi: '2345678901', credentialed: true, trainingDate: '2023-07-20' },
    { id: 'ph3', name: 'Dr. William Thompson', specialty: 'Urology', siteId: 'site3', cases: 52, status: 'active', email: 'w.thompson@hospital.com', phone: '(555) 345-6789', npi: '3456789012', credentialed: true, trainingDate: '2023-05-10' },
    { id: 'ph4', name: 'Dr. Lisa Chen', specialty: 'Urology', siteId: 'site4', cases: 29, status: 'pending', email: 'l.chen@hospital.com', phone: '(555) 456-7890', npi: '4567890123', credentialed: false, trainingDate: null },
    { id: 'ph5', name: 'Dr. Christopher Davis', specialty: 'Urology', siteId: 'site5', cases: 41, status: 'active', email: 'c.davis@hospital.com', phone: '(555) 567-8901', npi: '5678901234', credentialed: true, trainingDate: '2023-08-05' },
    { id: 'ph6', name: 'Dr. Amanda Wilson', specialty: 'Urology', siteId: 'site6', cases: 33, status: 'active', email: 'a.wilson@hospital.com', phone: '(555) 678-9012', npi: '6789012345', credentialed: true, trainingDate: '2023-09-12' },
    { id: 'ph7', name: 'Dr. Robert Kim', specialty: 'Urology', siteId: 'site1', cases: 18, status: 'pending', email: 'r.kim@hospital.com', phone: '(555) 789-0123', npi: '7890123456', credentialed: false, trainingDate: null },
    { id: 'ph8', name: 'Dr. Sarah Johnson', specialty: 'Urology', siteId: 'site2', cases: 27, status: 'active', email: 's.johnson@hospital.com', phone: '(555) 890-1234', npi: '8901234567', credentialed: true, trainingDate: '2023-10-18' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Urology',
    site: '',
    email: '',
    phone: '',
    npi: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Physician submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ name: '', specialty: 'Urology', site: '', email: '', phone: '', npi: '' });
  };

  const handleViewPhysician = (physician) => {
    setSelectedPhysician(physician);
    setIsSheetOpen(true);
  };

  // Enrich physician data
  const enrichedPhysicians = extendedPhysicians.map(ph => {
    const site = sites.find(s => s.id === ph.siteId);
    return {
      ...ph,
      siteName: site?.name || 'Unknown',
      siteCity: site?.city || '',
    };
  });

  // Filter physicians
  const filteredPhysicians = enrichedPhysicians.filter(ph => {
    if (activeTab === 'active' && ph.status !== 'active') return false;
    if (activeTab === 'pending' && ph.status !== 'pending') return false;
    if (searchTerm && !ph.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ph.siteName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      header: 'Physician',
      accessor: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {val.split(' ').slice(1).map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium">{val}</p>
            <p className="text-xs text-muted-foreground">{row.specialty}</p>
          </div>
        </div>
      ),
    },
    { header: 'Site', accessor: 'siteName', render: (val) => <span className="text-sm truncate max-w-[150px] block">{val}</span> },
    {
      header: 'Cases',
      accessor: 'cases',
      render: (val) => <span className="font-medium">{val}</span>,
    },
    {
      header: 'Credentialed',
      accessor: 'credentialed',
      render: (val) => (
        <Badge variant="outline" className={val ? 'border-success text-success' : 'border-warning text-warning'}>
          {val ? 'Yes' : 'Pending'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'Training',
      accessor: 'trainingDate',
      render: (val) => val ? new Date(val).toLocaleDateString() : <span className="text-muted-foreground">Not trained</span>,
    },
    {
      header: '',
      accessor: 'id',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewPhysician(row)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const stats = {
    total: extendedPhysicians.length,
    active: extendedPhysicians.filter(p => p.status === 'active').length,
    pending: extendedPhysicians.filter(p => p.status === 'pending').length,
    totalCases: extendedPhysicians.reduce((sum, p) => sum + p.cases, 0),
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="Physicians"
        subtitle="Manage physician credentials and performance"
        icon={Stethoscope}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Physician
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Physician</DialogTitle>
                <DialogDescription>
                  Enter physician information and assign to a site
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Dr. John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select value={formData.specialty} onValueChange={(val) => setFormData({...formData, specialty: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urology">Urology</SelectItem>
                        <SelectItem value="General Surgery">General Surgery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">Primary Site</Label>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="npi">NPI Number</Label>
                    <Input
                      id="npi"
                      placeholder="10-digit NPI"
                      value={formData.npi}
                      onChange={(e) => setFormData({...formData, npi: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Physician
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
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Physicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-success" />
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
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Credentialing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalCases}</p>
                <p className="text-sm text-muted-foreground">Total Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search physicians or sites..."
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
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredPhysicians}
            emptyMessage="No physicians found"
          />
        </TabsContent>
      </Tabs>

      {/* Physician Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedPhysician?.name}</SheetTitle>
            <SheetDescription>
              {selectedPhysician?.specialty}
            </SheetDescription>
          </SheetHeader>
          {selectedPhysician && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedPhysician.status} />
                <Badge variant="outline" className={selectedPhysician.credentialed ? 'border-success text-success' : 'border-warning text-warning'}>
                  {selectedPhysician.credentialed ? 'Credentialed' : 'Pending'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Primary Site</p>
                    <p className="text-sm font-medium">{selectedPhysician.siteName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedPhysician.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{selectedPhysician.phone}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card className="card-kpi">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedPhysician.cases}</p>
                    <p className="text-xs text-muted-foreground">Total Cases</p>
                  </CardContent>
                </Card>
                <Card className="card-kpi">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedPhysician.npi}</p>
                    <p className="text-xs text-muted-foreground">NPI Number</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  View Cases
                </Button>
                <Button variant="outline" className="flex-1">
                  Edit Profile
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
