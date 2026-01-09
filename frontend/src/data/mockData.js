// Comprehensive mock data for Medical Device Enterprise Application

export const regions = [
  { id: 'northeast', name: 'Northeast' },
  { id: 'southeast', name: 'Southeast' },
  { id: 'midwest', name: 'Midwest' },
  { id: 'southwest', name: 'Southwest' },
  { id: 'west', name: 'West' },
];

export const states = [
  { id: 'ny', name: 'New York', region: 'northeast' },
  { id: 'ma', name: 'Massachusetts', region: 'northeast' },
  { id: 'fl', name: 'Florida', region: 'southeast' },
  { id: 'ga', name: 'Georgia', region: 'southeast' },
  { id: 'il', name: 'Illinois', region: 'midwest' },
  { id: 'oh', name: 'Ohio', region: 'midwest' },
  { id: 'tx', name: 'Texas', region: 'southwest' },
  { id: 'az', name: 'Arizona', region: 'southwest' },
  { id: 'ca', name: 'California', region: 'west' },
  { id: 'wa', name: 'Washington', region: 'west' },
];

export const salesReps = [
  { id: 'sr1', name: 'James Chen', territory: 'Northeast A', region: 'northeast', performance: 95 },
  { id: 'sr2', name: 'Maria Garcia', territory: 'Southeast B', region: 'southeast', performance: 88 },
  { id: 'sr3', name: 'Robert Johnson', territory: 'Midwest C', region: 'midwest', performance: 102 },
  { id: 'sr4', name: 'Sarah Williams', territory: 'Southwest D', region: 'southwest', performance: 91 },
  { id: 'sr5', name: 'David Lee', territory: 'West E', region: 'west', performance: 97 },
  { id: 'sr6', name: 'Emily Brown', territory: 'Northeast B', region: 'northeast', performance: 85 },
];

export const physicians = [
  { id: 'ph1', name: 'Dr. Michael Anderson', specialty: 'Urology', siteId: 'site1', cases: 45 },
  { id: 'ph2', name: 'Dr. Jennifer Martinez', specialty: 'Urology', siteId: 'site2', cases: 38 },
  { id: 'ph3', name: 'Dr. William Thompson', specialty: 'Urology', siteId: 'site3', cases: 52 },
  { id: 'ph4', name: 'Dr. Lisa Chen', specialty: 'Urology', siteId: 'site4', cases: 29 },
  { id: 'ph5', name: 'Dr. Christopher Davis', specialty: 'Urology', siteId: 'site5', cases: 41 },
  { id: 'ph6', name: 'Dr. Amanda Wilson', specialty: 'Urology', siteId: 'site6', cases: 33 },
];

export const sites = [
  { id: 'site1', name: 'Boston Medical Center', city: 'Boston', state: 'ma', status: 'active', physiciansCount: 3 },
  { id: 'site2', name: 'NYU Langone Health', city: 'New York', state: 'ny', status: 'active', physiciansCount: 5 },
  { id: 'site3', name: 'Emory Healthcare', city: 'Atlanta', state: 'ga', status: 'active', physiciansCount: 4 },
  { id: 'site4', name: 'Northwestern Memorial', city: 'Chicago', state: 'il', status: 'pending', physiciansCount: 2 },
  { id: 'site5', name: 'UCLA Medical Center', city: 'Los Angeles', state: 'ca', status: 'active', physiciansCount: 6 },
  { id: 'site6', name: 'Texas Medical Center', city: 'Houston', state: 'tx', status: 'active', physiciansCount: 4 },
];

export const payerTypes = [
  { id: 'commercial', name: 'Commercial' },
  { id: 'medicare', name: 'Medicare' },
  { id: 'medicare_advantage', name: 'Medicare Advantage' },
  { id: 'medicaid', name: 'Medicaid' },
  { id: 'va', name: 'VA' },
  { id: 'self_pay', name: 'Self-Pay' },
];

export const payers = [
  { id: 'pay1', name: 'United Healthcare', type: 'commercial', approvalRate: 87 },
  { id: 'pay2', name: 'Blue Cross Blue Shield', type: 'commercial', approvalRate: 82 },
  { id: 'pay3', name: 'Aetna', type: 'commercial', approvalRate: 79 },
  { id: 'pay4', name: 'CMS Medicare', type: 'medicare', approvalRate: 94 },
  { id: 'pay5', name: 'Humana MA', type: 'medicare_advantage', approvalRate: 76 },
  { id: 'pay6', name: 'State Medicaid', type: 'medicaid', approvalRate: 71 },
  { id: 'pay7', name: 'VA Health', type: 'va', approvalRate: 91 },
];

export const products = [
  { id: 'prod1', name: 'UroLift System', category: 'BPH Treatment', price: 4500 },
  { id: 'prod2', name: 'iTind Device', category: 'BPH Treatment', price: 3800 },
  { id: 'prod3', name: 'Rezum System', category: 'BPH Treatment', price: 4200 },
];

export const patients = [
  { id: 'pt1', initials: 'J.S.', age: 67, physicianId: 'ph1', siteId: 'site1', status: 'qualified', vacStatus: 'approved', surgeryDate: '2024-02-15' },
  { id: 'pt2', initials: 'M.B.', age: 72, physicianId: 'ph2', siteId: 'site2', status: 'qualified', vacStatus: 'pending', surgeryDate: null },
  { id: 'pt3', initials: 'R.C.', age: 58, physicianId: 'ph3', siteId: 'site3', status: 'not_qualified', vacStatus: 'not_submitted', surgeryDate: null },
  { id: 'pt4', initials: 'D.W.', age: 65, physicianId: 'ph1', siteId: 'site1', status: 'qualified', vacStatus: 'approved', surgeryDate: '2024-02-18' },
  { id: 'pt5', initials: 'K.L.', age: 71, physicianId: 'ph4', siteId: 'site4', status: 'pending', vacStatus: 'pending', surgeryDate: null },
  { id: 'pt6', initials: 'P.H.', age: 63, physicianId: 'ph5', siteId: 'site5', status: 'qualified', vacStatus: 'approved', surgeryDate: '2024-02-20' },
];

export const vacRecords = [
  { id: 'vac1', patientId: 'pt1', payerId: 'pay1', status: 'approved', submissionDate: '2024-01-20', approvalDate: '2024-02-01', amount: 4500 },
  { id: 'vac2', patientId: 'pt2', payerId: 'pay2', status: 'pending', submissionDate: '2024-02-05', approvalDate: null, amount: 4500 },
  { id: 'vac3', patientId: 'pt4', payerId: 'pay4', status: 'approved', submissionDate: '2024-01-25', approvalDate: '2024-02-08', amount: 4500 },
  { id: 'vac4', patientId: 'pt5', payerId: 'pay5', status: 'pending', submissionDate: '2024-02-10', approvalDate: null, amount: 4500 },
  { id: 'vac5', patientId: 'pt6', payerId: 'pay3', status: 'approved', submissionDate: '2024-01-28', approvalDate: '2024-02-12', amount: 4500 },
];

export const invoices = [
  { id: 'inv1', siteId: 'site1', physicianId: 'ph1', patientId: 'pt1', amount: 4500, status: 'paid', dueDate: '2024-02-28', paidDate: '2024-02-25' },
  { id: 'inv2', siteId: 'site2', physicianId: 'ph2', patientId: 'pt2', amount: 4500, status: 'pending', dueDate: '2024-03-15', paidDate: null },
  { id: 'inv3', siteId: 'site3', physicianId: 'ph3', patientId: 'pt4', amount: 4500, status: 'overdue', dueDate: '2024-02-10', paidDate: null },
  { id: 'inv4', siteId: 'site5', physicianId: 'ph5', patientId: 'pt6', amount: 4500, status: 'paid', dueDate: '2024-02-20', paidDate: '2024-02-18' },
  { id: 'inv5', siteId: 'site1', physicianId: 'ph1', patientId: 'pt4', amount: 4500, status: 'pending', dueDate: '2024-03-05', paidDate: null },
];

export const inventory = [
  { id: 'inv1', productId: 'prod1', location: 'Main Warehouse', quantity: 245, reorderPoint: 50, status: 'healthy' },
  { id: 'inv2', productId: 'prod2', location: 'Main Warehouse', quantity: 128, reorderPoint: 30, status: 'healthy' },
  { id: 'inv3', productId: 'prod3', location: 'Regional Hub - East', quantity: 45, reorderPoint: 40, status: 'low' },
  { id: 'inv4', productId: 'prod1', location: 'Regional Hub - West', quantity: 89, reorderPoint: 30, status: 'healthy' },
];

// KPI Summary Data
export const kpiSummary = {
  totalPatients: 1247,
  patientsChange: 12.5,
  activeSites: 48,
  sitesChange: 8.3,
  quarterRevenue: 5420000,
  revenueChange: 15.2,
  pendingVACs: 127,
  vacsChange: -5.8,
  inventoryHealth: 94,
  inventoryChange: 2.1,
  avgASP: 4380,
  aspTarget: 4500,
  aspVariance: -2.7,
};

// Chart Data
export const revenueByMonth = [
  { month: 'Aug', revenue: 1420000, target: 1500000 },
  { month: 'Sep', revenue: 1580000, target: 1550000 },
  { month: 'Oct', revenue: 1720000, target: 1600000 },
  { month: 'Nov', revenue: 1650000, target: 1700000 },
  { month: 'Dec', revenue: 1890000, target: 1750000 },
  { month: 'Jan', revenue: 1780000, target: 1800000 },
];

export const casesByRegion = [
  { region: 'Northeast', cases: 342, target: 300 },
  { region: 'Southeast', cases: 285, target: 280 },
  { region: 'Midwest', cases: 256, target: 250 },
  { region: 'Southwest', cases: 198, target: 220 },
  { region: 'West', cases: 312, target: 290 },
];

export const vacStatusDistribution = [
  { status: 'Approved', count: 523, color: 'hsl(var(--success))' },
  { status: 'Pending', count: 127, color: 'hsl(var(--warning))' },
  { status: 'Denied', count: 45, color: 'hsl(var(--destructive))' },
  { status: 'In Review', count: 89, color: 'hsl(var(--info))' },
];

export const payerMix = [
  { payer: 'Commercial', percentage: 42, amount: 2276400 },
  { payer: 'Medicare', percentage: 28, amount: 1517600 },
  { payer: 'Medicare Adv', percentage: 15, amount: 813000 },
  { payer: 'Medicaid', percentage: 8, amount: 433600 },
  { payer: 'VA', percentage: 5, amount: 271000 },
  { payer: 'Self-Pay', percentage: 2, amount: 108400 },
];

export const siteRampFunnel = [
  { stage: 'Identified', count: 85 },
  { stage: 'Contacted', count: 72 },
  { stage: 'Training Scheduled', count: 58 },
  { stage: 'Training Complete', count: 52 },
  { stage: 'First Case', count: 48 },
  { stage: 'Ramped', count: 41 },
];

export const clinicalMetrics = [
  { metric: 'IPSS Score', value: 22.4, threshold: 8, unit: 'points', status: 'qualified' },
  { metric: 'Prostate Volume', value: 45.2, threshold: 30, unit: 'cc', status: 'qualified' },
  { metric: 'Qmax', value: 8.5, threshold: 15, unit: 'mL/s', status: 'qualified' },
  { metric: 'PVR', value: 125, threshold: 200, unit: 'mL', status: 'qualified' },
];

export const notifications = [
  { id: 'n1', type: 'alert', title: 'VAC Approval Required', message: '5 VACs pending approval > 7 days', time: '2h ago', priority: 'high' },
  { id: 'n2', type: 'warning', title: 'Inventory Low', message: 'Rezum System below reorder point at East Hub', time: '4h ago', priority: 'medium' },
  { id: 'n3', type: 'info', title: 'New Site Onboarded', message: 'Northwestern Memorial completed training', time: '6h ago', priority: 'low' },
  { id: 'n4', type: 'alert', title: 'Overdue Invoice', message: 'Invoice #INV-2024-0342 is 15 days overdue', time: '1d ago', priority: 'high' },
  { id: 'n5', type: 'success', title: 'Target Achieved', message: 'Northeast region hit Q1 target', time: '2d ago', priority: 'low' },
];

export const agingBuckets = [
  { bucket: 'Current', amount: 892000, count: 45 },
  { bucket: '1-30 Days', amount: 456000, count: 28 },
  { bucket: '31-60 Days', amount: 234000, count: 15 },
  { bucket: '61-90 Days', amount: 128000, count: 8 },
  { bucket: '90+ Days', amount: 67000, count: 4 },
];
