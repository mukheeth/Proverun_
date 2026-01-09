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
import { Progress } from '@/components/ui/progress';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Users,
  Plus,
  Search,
  ChevronRight,
  UserCheck,
  Clock,
  AlertTriangle,
  Activity,
  FileText,
  Calendar,
} from 'lucide-react';
import { patients, physicians, sites } from '@/data/mockData';

export default function PatientsPage() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Extended patient data
  const extendedPatients = [
    { id: 'pt1', initials: 'J.S.', age: 67, dob: '1957-03-15', physicianId: 'ph1', siteId: 'site1', status: 'qualified', vacStatus: 'approved', surgeryDate: '2024-02-15', ipss: 24, prostateVol: 48, qmax: 7.2, createdAt: '2024-01-10' },
    { id: 'pt2', initials: 'M.B.', age: 72, dob: '1952-07-22', physicianId: 'ph2', siteId: 'site2', status: 'qualified', vacStatus: 'pending', surgeryDate: null, ipss: 22, prostateVol: 42, qmax: 8.5, createdAt: '2024-01-15' },
    { id: 'pt3', initials: 'R.C.', age: 58, dob: '1966-11-08', physicianId: 'ph3', siteId: 'site3', status: 'not_qualified', vacStatus: 'not_submitted', surgeryDate: null, ipss: 12, prostateVol: 28, qmax: 14.2, createdAt: '2024-01-20' },
    { id: 'pt4', initials: 'D.W.', age: 65, dob: '1959-05-30', physicianId: 'ph1', siteId: 'site1', status: 'qualified', vacStatus: 'approved', surgeryDate: '2024-02-18', ipss: 26, prostateVol: 52, qmax: 6.8, createdAt: '2024-01-22' },
    { id: 'pt5', initials: 'K.L.', age: 71, dob: '1953-09-12', physicianId: 'ph4', siteId: 'site4', status: 'pending', vacStatus: 'pending', surgeryDate: null, ipss: 20, prostateVol: 45, qmax: 9.1, createdAt: '2024-01-25' },
    { id: 'pt6', initials: 'P.H.', age: 63, dob: '1961-01-28', physicianId: 'ph5', siteId: 'site5', status: 'qualified', vacStatus: 'approved', surgeryDate: '2024-02-20', ipss: 28, prostateVol: 55, qmax: 5.5, createdAt: '2024-01-28' },
    { id: 'pt7', initials: 'T.M.', age: 69, dob: '1955-04-17', physicianId: 'ph2', siteId: 'site2', status: 'qualified', vacStatus: 'in_review', surgeryDate: null, ipss: 25, prostateVol: 50, qmax: 7.8, createdAt: '2024-02-01' },
    { id: 'pt8', initials: 'S.G.', age: 74, dob: '1950-08-05', physicianId: 'ph3', siteId: 'site3', status: 'pending', vacStatus: 'not_submitted', surgeryDate: null, ipss: 19, prostateVol: 38, qmax: 10.2, createdAt: '2024-02-05' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    initials: '',
    age: '',
    dob: '',
    physician: '',
    site: '',
    ipss: '',
    prostateVol: '',
    qmax: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Patient submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ initials: '', age: '', dob: '', physician: '', site: '', ipss: '', prostateVol: '', qmax: '' });
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsSheetOpen(true);
  };

  // Enrich patient data
  const enrichedPatients = extendedPatients.map(pt => {
    const physician = physicians.find(p => p.id === pt.physicianId);
    const site = sites.find(s => s.id === pt.siteId);
    return {
      ...pt,
      physicianName: physician?.name || 'Unknown',
      siteName: site?.name || 'Unknown',
    };
  });

  // Filter patients
  const filteredPatients = enrichedPatients.filter(pt => {
    if (activeTab === 'qualified' && pt.status !== 'qualified') return false;
    if (activeTab === 'pending' && pt.status !== 'pending') return false;
    if (activeTab === 'not_qualified' && pt.status !== 'not_qualified') return false;
    if (searchTerm && !pt.initials.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !pt.physicianName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      header: 'Patient',
      accessor: 'initials',
      render: (val, row) => (
        <div>
          <span className="font-medium">{val}</span>
          <p className="text-xs text-muted-foreground">Age: {row.age}</p>
        </div>
      ),
    },
    { header: 'Physician', accessor: 'physicianName' },
    { header: 'Site', accessor: 'siteName', render: (val) => <span className="text-sm truncate max-w-[150px] block">{val}</span> },
    {
      header: 'IPSS',
      accessor: 'ipss',
      render: (val) => (
        <span className={val >= 13 ? 'text-success font-medium' : 'text-destructive font-medium'}>
          {val}
        </span>
      ),
    },
    {
      header: 'Volume',
      accessor: 'prostateVol',
      render: (val) => <span>{val} cc</span>,
    },
    {
      header: 'Clinical Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: 'VAC',
      accessor: 'vacStatus',
      render: (val) => {
        const statusMap = {
          approved: 'approved',
          pending: 'pending',
          in_review: 'in_review',
          not_submitted: 'stalled',
        };
        return <StatusBadge status={statusMap[val] || 'pending'} customLabel={val.replace('_', ' ')} />;
      },
    },
    {
      header: 'Surgery',
      accessor: 'surgeryDate',
      render: (val) => val ? new Date(val).toLocaleDateString() : <span className="text-muted-foreground">—</span>,
    },
    {
      header: '',
      accessor: 'id',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewPatient(row)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const stats = {
    total: extendedPatients.length,
    qualified: extendedPatients.filter(p => p.status === 'qualified').length,
    pending: extendedPatients.filter(p => p.status === 'pending').length,
    notQualified: extendedPatients.filter(p => p.status === 'not_qualified').length,
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="Patients"
        subtitle="Manage patient records and clinical data"
        icon={Users}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter patient information and clinical data
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initials">Patient Initials</Label>
                    <Input
                      id="initials"
                      placeholder="e.g., J.S."
                      value={formData.initials}
                      onChange={(e) => setFormData({...formData, initials: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="physician">Physician</Label>
                    <Select value={formData.physician} onValueChange={(val) => setFormData({...formData, physician: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Clinical Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipss">IPSS Score</Label>
                      <Input
                        id="ipss"
                        type="number"
                        placeholder="0-35"
                        value={formData.ipss}
                        onChange={(e) => setFormData({...formData, ipss: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prostateVol">Volume (cc)</Label>
                      <Input
                        id="prostateVol"
                        type="number"
                        placeholder="cc"
                        value={formData.prostateVol}
                        onChange={(e) => setFormData({...formData, prostateVol: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qmax">Qmax (mL/s)</Label>
                      <Input
                        id="qmax"
                        type="number"
                        step="0.1"
                        placeholder="mL/s"
                        value={formData.qmax}
                        onChange={(e) => setFormData({...formData, qmax: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Add Patient
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
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.qualified}</p>
                <p className="text-sm text-muted-foreground">Qualified</p>
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
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.notQualified}</p>
                <p className="text-sm text-muted-foreground">Not Qualified</p>
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
            placeholder="Search patients..."
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
          <TabsTrigger value="qualified">Qualified ({stats.qualified})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="not_qualified">Not Qualified ({stats.notQualified})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredPatients}
            emptyMessage="No patients found"
          />
        </TabsContent>
      </Tabs>

      {/* Patient Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Patient Details</SheetTitle>
            <SheetDescription>
              {selectedPatient?.initials} - Age {selectedPatient?.age}
            </SheetDescription>
          </SheetHeader>
          {selectedPatient && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedPatient.status} />
                <Badge variant="outline">{selectedPatient.vacStatus.replace('_', ' ')}</Badge>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase">Clinical Metrics</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>IPSS Score</span>
                      <span className={selectedPatient.ipss >= 13 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                        {selectedPatient.ipss} (≥13 required)
                      </span>
                    </div>
                    <Progress value={(selectedPatient.ipss / 35) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Prostate Volume</span>
                      <span className="font-medium">{selectedPatient.prostateVol} cc</span>
                    </div>
                    <Progress value={(selectedPatient.prostateVol / 80) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Qmax</span>
                      <span className={selectedPatient.qmax < 15 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                        {selectedPatient.qmax} mL/s
                      </span>
                    </div>
                    <Progress value={((15 - selectedPatient.qmax) / 15) * 100} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase">Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Physician</p>
                    <p className="text-sm font-medium">{selectedPatient.physicianName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Site</p>
                    <p className="text-sm font-medium truncate">{selectedPatient.siteName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Surgery Date</p>
                    <p className="text-sm font-medium">{selectedPatient.surgeryDate ? new Date(selectedPatient.surgeryDate).toLocaleDateString() : 'Not scheduled'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => navigate('/vac')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit VAC
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
