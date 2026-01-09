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
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Receipt,
  Plus,
  Search,
  ChevronRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  Printer,
} from 'lucide-react';
import { sites, physicians, products, payers } from '@/data/mockData';

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Extended invoice data
  const extendedInvoices = [
    { id: 'inv1', invoiceNumber: 'INV-2024-0001', siteId: 'site1', physicianId: 'ph1', patientInitials: 'J.S.', productId: 'prod1', payerId: 'pay1', amount: 4500, status: 'paid', issueDate: '2024-01-15', dueDate: '2024-02-15', paidDate: '2024-02-10', paymentMethod: 'ACH' },
    { id: 'inv2', invoiceNumber: 'INV-2024-0002', siteId: 'site2', physicianId: 'ph2', patientInitials: 'M.B.', productId: 'prod1', payerId: 'pay2', amount: 4500, status: 'pending', issueDate: '2024-01-20', dueDate: '2024-02-20', paidDate: null, paymentMethod: null },
    { id: 'inv3', invoiceNumber: 'INV-2024-0003', siteId: 'site3', physicianId: 'ph3', patientInitials: 'D.W.', productId: 'prod2', payerId: 'pay3', amount: 3800, status: 'overdue', issueDate: '2024-01-10', dueDate: '2024-02-10', paidDate: null, paymentMethod: null },
    { id: 'inv4', invoiceNumber: 'INV-2024-0004', siteId: 'site5', physicianId: 'ph5', patientInitials: 'P.H.', productId: 'prod1', payerId: 'pay4', amount: 4500, status: 'paid', issueDate: '2024-01-25', dueDate: '2024-02-25', paidDate: '2024-02-20', paymentMethod: 'Check' },
    { id: 'inv5', invoiceNumber: 'INV-2024-0005', siteId: 'site1', physicianId: 'ph1', patientInitials: 'K.L.', productId: 'prod3', payerId: 'pay5', amount: 4200, status: 'pending', issueDate: '2024-02-01', dueDate: '2024-03-01', paidDate: null, paymentMethod: null },
    { id: 'inv6', invoiceNumber: 'INV-2024-0006', siteId: 'site4', physicianId: 'ph4', patientInitials: 'T.M.', productId: 'prod1', payerId: 'pay1', amount: 4500, status: 'paid', issueDate: '2024-02-05', dueDate: '2024-03-05', paidDate: '2024-02-28', paymentMethod: 'Wire' },
    { id: 'inv7', invoiceNumber: 'INV-2024-0007', siteId: 'site2', physicianId: 'ph2', patientInitials: 'S.G.', productId: 'prod2', payerId: 'pay2', amount: 3800, status: 'pending', issueDate: '2024-02-10', dueDate: '2024-03-10', paidDate: null, paymentMethod: null },
    { id: 'inv8', invoiceNumber: 'INV-2024-0008', siteId: 'site6', physicianId: 'ph6', patientInitials: 'R.C.', productId: 'prod1', payerId: 'pay6', amount: 4500, status: 'overdue', issueDate: '2024-01-05', dueDate: '2024-02-05', paidDate: null, paymentMethod: null },
  ];

  // Form state
  const [formData, setFormData] = useState({
    site: '',
    physician: '',
    patient: '',
    product: '',
    payer: '',
    amount: '',
    dueDate: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Invoice submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ site: '', physician: '', patient: '', product: '', payer: '', amount: '', dueDate: '', notes: '' });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsSheetOpen(true);
  };

  // Enrich invoice data
  const enrichedInvoices = extendedInvoices.map(inv => {
    const site = sites.find(s => s.id === inv.siteId);
    const physician = physicians.find(p => p.id === inv.physicianId);
    const product = products.find(p => p.id === inv.productId);
    const payer = payers.find(p => p.id === inv.payerId);
    return {
      ...inv,
      siteName: site?.name || 'Unknown',
      physicianName: physician?.name || 'Unknown',
      productName: product?.name || 'Unknown',
      payerName: payer?.name || 'Unknown',
    };
  });

  // Filter invoices
  const filteredInvoices = enrichedInvoices.filter(inv => {
    if (activeTab === 'paid' && inv.status !== 'paid') return false;
    if (activeTab === 'pending' && inv.status !== 'pending') return false;
    if (activeTab === 'overdue' && inv.status !== 'overdue') return false;
    if (searchTerm && !inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inv.siteName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !inv.patientInitials.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'invoiceNumber',
      render: (val) => <span className="font-medium font-mono text-sm">{val}</span>,
    },
    { header: 'Patient', accessor: 'patientInitials' },
    { header: 'Site', accessor: 'siteName', render: (val) => <span className="text-sm truncate max-w-[120px] block">{val}</span> },
    { header: 'Product', accessor: 'productName', render: (val) => <span className="text-sm truncate max-w-[100px] block">{val}</span> },
    { header: 'Payer', accessor: 'payerName', render: (val) => <span className="text-sm truncate max-w-[120px] block">{val}</span> },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (val) => <span className="font-medium">${val.toLocaleString()}</span>,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: '',
      accessor: 'id',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(row)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const stats = {
    total: extendedInvoices.length,
    totalAmount: extendedInvoices.reduce((sum, i) => sum + i.amount, 0),
    paid: extendedInvoices.filter(i => i.status === 'paid').length,
    paidAmount: extendedInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    pending: extendedInvoices.filter(i => i.status === 'pending').length,
    pendingAmount: extendedInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0),
    overdue: extendedInvoices.filter(i => i.status === 'overdue').length,
    overdueAmount: extendedInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0),
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(val);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="Invoices"
        subtitle="Manage billing and payment tracking"
        icon={Receipt}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice for a procedure
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      <Label htmlFor="patient">Patient Initials</Label>
                      <Input
                        id="patient"
                        placeholder="e.g., J.S."
                        value={formData.patient}
                        onChange={(e) => setFormData({...formData, patient: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Select value={formData.product} onValueChange={(val) => {
                        const prod = products.find(p => p.id === val);
                        setFormData({...formData, product: val, amount: prod?.price?.toString() || ''});
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name} - ${p.price}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional billing notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Create Invoice
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-kpi">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                <p className="text-sm text-muted-foreground">{stats.total} Invoices</p>
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
                <p className="text-2xl font-bold">{formatCurrency(stats.paidAmount)}</p>
                <p className="text-sm text-muted-foreground">{stats.paid} Paid</p>
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
                <p className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</p>
                <p className="text-sm text-muted-foreground">{stats.pending} Pending</p>
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
                <p className="text-2xl font-bold">{formatCurrency(stats.overdueAmount)}</p>
                <p className="text-sm text-muted-foreground">{stats.overdue} Overdue</p>
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
            placeholder="Search invoices..."
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
          <TabsTrigger value="paid">Paid ({stats.paid})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="overdue">
            Overdue
            {stats.overdue > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">{stats.overdue}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredInvoices}
            emptyMessage="No invoices found"
          />
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="font-mono">{selectedInvoice?.invoiceNumber}</SheetTitle>
            <SheetDescription>
              Issued on {selectedInvoice?.issueDate && new Date(selectedInvoice.issueDate).toLocaleDateString()}
            </SheetDescription>
          </SheetHeader>
          {selectedInvoice && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedInvoice.status} />
                <span className="text-2xl font-bold">{formatCurrency(selectedInvoice.amount)}</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Patient</p>
                    <p className="text-sm font-medium">{selectedInvoice.patientInitials}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Physician</p>
                    <p className="text-sm font-medium">{selectedInvoice.physicianName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Site</p>
                    <p className="text-sm font-medium truncate">{selectedInvoice.siteName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Product</p>
                    <p className="text-sm font-medium">{selectedInvoice.productName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Payer</p>
                    <p className="text-sm font-medium">{selectedInvoice.payerName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {selectedInvoice.status === 'paid' && (
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-xs text-success">Payment Received</p>
                    <p className="text-sm font-medium text-success">
                      {new Date(selectedInvoice.paidDate).toLocaleDateString()} via {selectedInvoice.paymentMethod}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                {selectedInvoice.status !== 'paid' && (
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
