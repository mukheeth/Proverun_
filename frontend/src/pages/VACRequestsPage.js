import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '@/contexts/FilterContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  FileCheck,
  Plus,
  Search,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  FileText,
  Send,
  RefreshCw,
} from 'lucide-react';
import { sites, physicians, payers, payerTypes, products } from '@/data/mockData';

export default function VACRequestsPage() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedVAC, setSelectedVAC] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Extended VAC request data
  const vacRequests = [
    { id: 'vac1', requestNumber: 'VAC-2024-0001', patientInitials: 'J.S.', physicianId: 'ph1', siteId: 'site1', payerId: 'pay1', productId: 'prod1', status: 'approved', submissionDate: '2024-01-15', approvalDate: '2024-01-25', amount: 4500, cptCode: '52441', icd10: 'N40.1', notes: 'Standard BPH treatment' },
    { id: 'vac2', requestNumber: 'VAC-2024-0002', patientInitials: 'M.B.', physicianId: 'ph2', siteId: 'site2', payerId: 'pay2', productId: 'prod1', status: 'pending', submissionDate: '2024-01-20', approvalDate: null, amount: 4500, cptCode: '52441', icd10: 'N40.1', notes: 'Awaiting clinical review' },
    { id: 'vac3', requestNumber: 'VAC-2024-0003', patientInitials: 'D.W.', physicianId: 'ph3', siteId: 'site3', payerId: 'pay3', productId: 'prod2', status: 'denied', submissionDate: '2024-01-10', approvalDate: null, amount: 3800, cptCode: '52442', icd10: 'N40.0', notes: 'Appeal in progress', denialReason: 'Medical necessity not met' },
    { id: 'vac4', requestNumber: 'VAC-2024-0004', patientInitials: 'P.H.', physicianId: 'ph5', siteId: 'site5', payerId: 'pay4', productId: 'prod1', status: 'approved', submissionDate: '2024-01-25', approvalDate: '2024-02-05', amount: 4500, cptCode: '52441', icd10: 'N40.1', notes: '' },
    { id: 'vac5', requestNumber: 'VAC-2024-0005', patientInitials: 'K.L.', physicianId: 'ph1', siteId: 'site1', payerId: 'pay5', productId: 'prod3', status: 'in_review', submissionDate: '2024-02-01', approvalDate: null, amount: 4200, cptCode: '52441', icd10: 'N40.1', notes: 'Peer-to-peer scheduled' },
    { id: 'vac6', requestNumber: 'VAC-2024-0006', patientInitials: 'T.M.', physicianId: 'ph4', siteId: 'site4', payerId: 'pay1', productId: 'prod1', status: 'pending', submissionDate: '2024-02-05', approvalDate: null, amount: 4500, cptCode: '52441', icd10: 'N40.1', notes: 'Documentation submitted' },
    { id: 'vac7', requestNumber: 'VAC-2024-0007', patientInitials: 'S.G.', physicianId: 'ph2', siteId: 'site2', payerId: 'pay2', productId: 'prod2', status: 'approved', submissionDate: '2024-02-08', approvalDate: '2024-02-18', amount: 3800, cptCode: '52442', icd10: 'N40.0', notes: '' },
    { id: 'vac8', requestNumber: 'VAC-2024-0008', patientInitials: 'R.C.', physicianId: 'ph6', siteId: 'site6', payerId: 'pay6', productId: 'prod1', status: 'pending', submissionDate: '2024-02-10', approvalDate: null, amount: 4500, cptCode: '52441', icd10: 'N40.1', notes: 'Additional info requested' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    patient: '',
    physician: '',
    site: '',
    payer: '',
    product: '',
    cptCode: '52441',
    icd10: 'N40.1',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('VAC Request submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ patient: '', physician: '', site: '', payer: '', product: '', cptCode: '52441', icd10: 'N40.1', notes: '' });
  };

  const handleViewVAC = (vac) => {
    setSelectedVAC(vac);
    setIsSheetOpen(true);
  };

  // Enrich VAC data
  const enrichedVACs = vacRequests.map(vac => {
    const site = sites.find(s => s.id === vac.siteId);
    const physician = physicians.find(p => p.id === vac.physicianId);
    const payer = payers.find(p => p.id === vac.payerId);
    const product = products.find(p => p.id === vac.productId);
    return {
      ...vac,
      siteName: site?.name || 'Unknown',
      physicianName: physician?.name || 'Unknown',
      payerName: payer?.name || 'Unknown',
      productName: product?.name || 'Unknown',
    };
  });

  // Filter VACs
  const filteredVACs = enrichedVACs.filter(vac => {
    if (activeTab === 'approved' && vac.status !== 'approved') return false;
    if (activeTab === 'pending' && vac.status !== 'pending' && vac.status !== 'in_review') return false;
    if (activeTab === 'denied' && vac.status !== 'denied') return false;
    if (searchTerm && !vac.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !vac.patientInitials.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !vac.payerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      header: 'Request #',
      accessor: 'requestNumber',
      render: (val) => <span className="font-medium font-mono text-sm">{val}</span>,
    },
    { header: 'Patient', accessor: 'patientInitials' },
    { header: 'Physician', accessor: 'physicianName', render: (val) => <span className="text-sm truncate max-w-[120px] block">{val}</span> },
    { header: 'Payer', accessor: 'payerName', render: (val) => <span className="text-sm truncate max-w-[120px] block">{val}</span> },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (val) => <span className="font-medium">${val.toLocaleString()}</span>,
    },
    {
      header: 'Submitted',
      accessor: 'submissionDate',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => {
        const statusMap = {
          approved: 'approved',
          pending: 'pending',
          in_review: 'in_review',
          denied: 'denied',
        };
        return <StatusBadge status={statusMap[val] || 'pending'} customLabel={val === 'in_review' ? 'In Review' : undefined} />;
      },
    },
    {
      header: '',
      accessor: 'id',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewVAC(row)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const stats = {
    total: vacRequests.length,
    approved: vacRequests.filter(v => v.status === 'approved').length,
    pending: vacRequests.filter(v => v.status === 'pending' || v.status === 'in_review').length,
    denied: vacRequests.filter(v => v.status === 'denied').length,
    approvalRate: Math.round((vacRequests.filter(v => v.status === 'approved').length / 
      (vacRequests.filter(v => v.status === 'approved').length + vacRequests.filter(v => v.status === 'denied').length)) * 100) || 0,
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="VAC Requests"
        subtitle="Verification and Authorization for Coverage requests"
        icon={FileCheck}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New VAC Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Submit VAC Request</DialogTitle>
                <DialogDescription>
                  Request verification and authorization for coverage
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient Initials</Label>
                    <Input
                      id="patient"
                      placeholder="e.g., J.S."
                      value={formData.patient}
                      onChange={(e) => setFormData({...formData, patient: e.target.value})}
                    />
                  </div>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="payer">Payer</Label>
                    <Select value={formData.payer} onValueChange={(val) => setFormData({...formData, payer: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payer" />
                      </SelectTrigger>
                      <SelectContent>
                        {payers.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Product / Procedure</Label>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cptCode">CPT Code</Label>
                    <Select value={formData.cptCode} onValueChange={(val) => setFormData({...formData, cptCode: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="52441">52441 - UroLift</SelectItem>
                        <SelectItem value="52442">52442 - Additional implant</SelectItem>
                        <SelectItem value="53850">53850 - Transurethral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icd10">ICD-10 Code</Label>
                    <Select value={formData.icd10} onValueChange={(val) => setFormData({...formData, icd10: val})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="N40.0">N40.0 - BPH w/o LUTS</SelectItem>
                        <SelectItem value="N40.1">N40.1 - BPH w/ LUTS</SelectItem>
                        <SelectItem value="N40.2">N40.2 - Nodular prostate</SelectItem>
                        <SelectItem value="N40.3">N40.3 - Nodular w/ LUTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Clinical Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Include relevant clinical information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Attach Supporting Documents</p>
                      <p className="text-xs text-muted-foreground">Clinical records, test results, etc.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="ml-auto">
                      Browse
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
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
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
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
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.denied}</p>
                <p className="text-sm text-muted-foreground">Denied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approvalRate}%</p>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
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
            placeholder="Search VAC requests..."
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
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="denied">
            Denied
            {stats.denied > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">{stats.denied}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredVACs}
            emptyMessage="No VAC requests found"
          />
        </TabsContent>
      </Tabs>

      {/* VAC Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="font-mono">{selectedVAC?.requestNumber}</SheetTitle>
            <SheetDescription>
              Submitted on {selectedVAC?.submissionDate && new Date(selectedVAC.submissionDate).toLocaleDateString()}
            </SheetDescription>
          </SheetHeader>
          {selectedVAC && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedVAC.status === 'in_review' ? 'in_review' : selectedVAC.status} 
                  customLabel={selectedVAC.status === 'in_review' ? 'In Review' : undefined} />
                <span className="text-2xl font-bold">${selectedVAC.amount.toLocaleString()}</span>
              </div>

              {selectedVAC.status === 'approved' && (
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-xs text-success">Approved on</p>
                  <p className="text-sm font-medium text-success">
                    {new Date(selectedVAC.approvalDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {selectedVAC.status === 'denied' && selectedVAC.denialReason && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive">Denial Reason</p>
                  <p className="text-sm font-medium text-destructive">
                    {selectedVAC.denialReason}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Patient</p>
                    <p className="text-sm font-medium">{selectedVAC.patientInitials}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Physician</p>
                    <p className="text-sm font-medium">{selectedVAC.physicianName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Site</p>
                    <p className="text-sm font-medium truncate">{selectedVAC.siteName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Payer</p>
                    <p className="text-sm font-medium">{selectedVAC.payerName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="text-sm font-medium">{selectedVAC.productName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">CPT / ICD-10</p>
                    <p className="text-sm font-medium">{selectedVAC.cptCode} / {selectedVAC.icd10}</p>
                  </div>
                </div>

                {selectedVAC.notes && (
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedVAC.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedVAC.status === 'denied' && (
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    File Appeal
                  </Button>
                )}
                {(selectedVAC.status === 'pending' || selectedVAC.status === 'in_review') && (
                  <Button className="flex-1" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Documents
                  </Button>
                )}
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
