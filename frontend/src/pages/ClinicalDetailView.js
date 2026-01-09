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
  Stethoscope,
  UserCheck,
  FileCheck,
  Activity,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Plus,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { patients, physicians, clinicalMetrics } from '@/data/mockData';

export default function ClinicalDetailView() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample patient clinical data
  const patientClinicalData = {
    'pt1': { ipss: 24, prostateVol: 48, qmax: 7.2, pvr: 145, trus: 'Complete', biopsy: 'Negative' },
    'pt2': { ipss: 22, prostateVol: 42, qmax: 8.5, pvr: 120, trus: 'Complete', biopsy: 'Negative' },
    'pt3': { ipss: 12, prostateVol: 28, qmax: 14.2, pvr: 80, trus: 'Pending', biopsy: 'N/A' },
    'pt4': { ipss: 26, prostateVol: 52, qmax: 6.8, pvr: 165, trus: 'Complete', biopsy: 'Negative' },
    'pt5': { ipss: 20, prostateVol: 45, qmax: 9.1, pvr: 110, trus: 'Complete', biopsy: 'Pending' },
    'pt6': { ipss: 28, prostateVol: 55, qmax: 5.5, pvr: 180, trus: 'Complete', biopsy: 'Negative' },
  };

  // Qualification thresholds
  const thresholds = {
    ipss: { min: 13, label: 'IPSS Score', unit: 'points', idealRange: '≥13' },
    prostateVol: { min: 30, max: 80, label: 'Prostate Volume', unit: 'cc', idealRange: '30-80' },
    qmax: { max: 15, label: 'Qmax', unit: 'mL/s', idealRange: '<15' },
    pvr: { max: 250, label: 'PVR', unit: 'mL', idealRange: '<250' },
  };

  // Radar chart data for clinical metrics
  const radarData = [
    { metric: 'IPSS', value: 85, fullMark: 100 },
    { metric: 'Volume', value: 70, fullMark: 100 },
    { metric: 'Qmax', value: 75, fullMark: 100 },
    { metric: 'PVR', value: 65, fullMark: 100 },
    { metric: 'TRUS', value: 90, fullMark: 100 },
  ];

  // Qualification rate by site
  const qualificationBySite = [
    { site: 'Boston Medical', qualified: 78, total: 92 },
    { site: 'NYU Langone', qualified: 65, total: 84 },
    { site: 'Emory Healthcare', qualified: 52, total: 68 },
    { site: 'Northwestern', qualified: 28, total: 45 },
    { site: 'UCLA Medical', qualified: 71, total: 88 },
  ];

  // Check if patient meets criteria
  const checkQualification = (patientId) => {
    const data = patientClinicalData[patientId];
    if (!data) return { qualified: false, issues: ['No data'] };

    const issues = [];
    if (data.ipss < thresholds.ipss.min) issues.push('IPSS too low');
    if (data.prostateVol < thresholds.prostateVol.min || data.prostateVol > thresholds.prostateVol.max) 
      issues.push('Volume out of range');
    if (data.qmax >= thresholds.qmax.max) issues.push('Qmax too high');
    if (data.pvr >= thresholds.pvr.max) issues.push('PVR too high');

    return { qualified: issues.length === 0, issues };
  };

  // Patient columns
  const patientColumns = [
    { header: 'Patient', accessor: 'initials', render: (val) => <span className="font-medium">{val}</span> },
    { header: 'Age', accessor: 'age' },
    {
      header: 'IPSS',
      accessor: 'id',
      render: (id) => {
        const data = patientClinicalData[id];
        const isGood = data && data.ipss >= thresholds.ipss.min;
        return (
          <span className={isGood ? 'text-success font-medium' : 'text-destructive font-medium'}>
            {data?.ipss || '—'}
          </span>
        );
      },
    },
    {
      header: 'Volume',
      accessor: 'id',
      cellClassName: 'volume-cell',
      render: (id) => {
        const data = patientClinicalData[id];
        const isGood = data && data.prostateVol >= 30 && data.prostateVol <= 80;
        return (
          <span className={isGood ? 'text-success font-medium' : 'text-warning font-medium'}>
            {data?.prostateVol || '—'} cc
          </span>
        );
      },
    },
    {
      header: 'Qmax',
      accessor: 'id',
      cellClassName: 'qmax-cell',
      render: (id) => {
        const data = patientClinicalData[id];
        const isGood = data && data.qmax < 15;
        return (
          <span className={isGood ? 'text-success font-medium' : 'text-destructive font-medium'}>
            {data?.qmax || '—'} mL/s
          </span>
        );
      },
    },
    {
      header: 'Clinical Status',
      accessor: 'id',
      cellClassName: 'status-cell',
      render: (id) => {
        const result = checkQualification(id);
        return <StatusBadge status={result.qualified ? 'qualified' : 'not_qualified'} />;
      },
    },
    {
      header: 'TRUS',
      accessor: 'id',
      cellClassName: 'trus-cell',
      render: (id) => {
        const data = patientClinicalData[id];
        return <Badge variant="outline" className="text-xs">{data?.trus || 'Pending'}</Badge>;
      },
    },
    {
      header: '',
      accessor: 'id',
      render: (id) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(id)}>
          View Details
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ),
    },
  ];

  const selectedPatientData = selectedPatient ? patientClinicalData[selectedPatient] : null;
  const selectedPatientInfo = selectedPatient ? patients.find(p => p.id === selectedPatient) : null;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Clinical Qualification"
        subtitle="Patient eligibility validation and clinical metrics tracking"
        icon={Stethoscope}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Clinical Data
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Qualified Patients"
          value={patients.filter(p => p.status === 'qualified').length}
          change={12.5}
          changeLabel="vs last month"
          icon={UserCheck}
        />
        <KPICard
          title="Pending Review"
          value={patients.filter(p => p.status === 'pending').length}
          change={-8.2}
          changeLabel="vs last week"
          icon={FileCheck}
        />
        <KPICard
          title="Qualification Rate"
          value={72}
          change={3.5}
          changeLabel="vs target"
          icon={Activity}
          format="percent"
        />
        <KPICard
          title="Avg IPSS Score"
          value={22.4}
          change={1.2}
          changeLabel="improvement"
          icon={TrendingUp}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Patient List */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/50 mb-4">
              <TabsTrigger value="overview">All Patients</TabsTrigger>
              <TabsTrigger value="qualified">Qualified</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="not_qualified">Not Qualified</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DataTable columns={patientColumns} data={patients} />
            </TabsContent>
            <TabsContent value="qualified">
              <DataTable columns={patientColumns} data={patients.filter(p => p.status === 'qualified')} />
            </TabsContent>
            <TabsContent value="pending">
              <DataTable columns={patientColumns} data={patients.filter(p => p.status === 'pending')} />
            </TabsContent>
            <TabsContent value="not_qualified">
              <DataTable columns={patientColumns} data={patients.filter(p => p.status === 'not_qualified')} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Detail Panel */}
        <div className="space-y-4">
          {/* Patient Detail Card */}
          {selectedPatient && selectedPatientData ? (
            <Card className="card-clinical">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Patient {selectedPatientInfo?.initials}</CardTitle>
                    <p className="text-sm text-muted-foreground">Age: {selectedPatientInfo?.age}</p>
                  </div>
                  <StatusBadge status={checkQualification(selectedPatient).qualified ? 'qualified' : 'not_qualified'} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Clinical Metrics */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Clinical Metrics</h4>
                  
                  {/* IPSS */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>IPSS Score</span>
                      <span className={selectedPatientData.ipss >= 13 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                        {selectedPatientData.ipss} (≥13 required)
                      </span>
                    </div>
                    <Progress value={(selectedPatientData.ipss / 35) * 100} className="h-2" />
                  </div>

                  {/* Prostate Volume */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Prostate Volume</span>
                      <span className="font-medium">{selectedPatientData.prostateVol} cc</span>
                    </div>
                    <Progress value={(selectedPatientData.prostateVol / 80) * 100} className="h-2" />
                  </div>

                  {/* Qmax */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Qmax</span>
                      <span className={selectedPatientData.qmax < 15 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                        {selectedPatientData.qmax} mL/s (&lt;15 required)
                      </span>
                    </div>
                    <Progress value={((15 - selectedPatientData.qmax) / 15) * 100} className="h-2" />
                  </div>

                  {/* PVR */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Post-Void Residual</span>
                      <span className="font-medium">{selectedPatientData.pvr} mL</span>
                    </div>
                    <Progress value={(selectedPatientData.pvr / 250) * 100} className="h-2" />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-3 border-t border-border/60">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tests</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">TRUS</p>
                      <p className="text-sm font-medium">{selectedPatientData.trus}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Biopsy</p>
                      <p className="text-sm font-medium">{selectedPatientData.biopsy}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => navigate('/vac')}>
                    Submit VAC
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Update Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-clinical">
              <CardContent className="py-12 text-center">
                <Stethoscope className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Select a patient to view clinical details</p>
              </CardContent>
            </Card>
          )}

          {/* Qualification by Site */}
          <Card className="card-clinical">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Qualification by Site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {qualificationBySite.map((site) => (
                  <div key={site.site}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground truncate">{site.site}</span>
                      <span className="font-medium">{Math.round((site.qualified / site.total) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(site.qualified / site.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
