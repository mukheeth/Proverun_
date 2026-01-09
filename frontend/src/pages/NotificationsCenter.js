import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { notifications } from '@/data/mockData';

// NotificationCard component moved outside the main component
const NotificationCard = ({ notification, getIcon, getPriorityBadge }) => (
  <div
    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
      notification.priority === 'high'
        ? 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10'
        : 'bg-card border-border/60 hover:bg-muted/30'
    }`}
  >
    <div className="mt-0.5">{getIcon(notification.type)}</div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">{notification.title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
        </div>
        {getPriorityBadge(notification.priority)}
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {notification.time}
        </span>
        <Button variant="ghost" size="sm" className="h-7 text-xs">
          View Details
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-success">
        <Check className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default function NotificationsCenter() {
  const navigate = useNavigate();

  // Extended notifications with more detail
  const allNotifications = [
    ...notifications,
    { id: 'n6', type: 'info', title: 'Training Scheduled', message: 'Dr. Martinez training on UroLift scheduled for Feb 20', time: '3d ago', priority: 'low' },
    { id: 'n7', type: 'alert', title: 'Contract Expiring', message: 'NYU Langone contract expires in 30 days', time: '3d ago', priority: 'medium' },
    { id: 'n8', type: 'success', title: 'Payment Received', message: 'Invoice INV-2024-0341 paid - $4,500', time: '4d ago', priority: 'low' },
    { id: 'n9', type: 'warning', title: 'VAC Denial', message: 'VAC for patient M.B. denied by Humana MA - appeal available', time: '5d ago', priority: 'high' },
    { id: 'n10', type: 'info', title: 'New Site Added', message: 'Texas Medical Center added to your territory', time: '1w ago', priority: 'low' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const config = {
      high: { label: 'Urgent', className: 'bg-destructive/10 text-destructive border-destructive/20' },
      medium: { label: 'Important', className: 'bg-warning/10 text-warning border-warning/20' },
      low: { label: 'Normal', className: 'bg-muted text-muted-foreground border-border' },
    };
    return (
      <Badge variant="outline" className={`text-xs ${config[priority]?.className}`}>
        {config[priority]?.label}
      </Badge>
    );
  };

  const urgentCount = allNotifications.filter(n => n.priority === 'high').length;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <PageHeader
        title="Notifications"
        subtitle={`${urgentCount} urgent items require your attention`}
        icon={Bell}
        actions={
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
        }
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2 text-xs">
              {allNotifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="urgent">
            Urgent
            <Badge variant="destructive" className="ml-2 text-xs">
              {urgentCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="info">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {allNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        <TabsContent value="urgent" className="space-y-3">
          {allNotifications
            .filter(n => n.priority === 'high')
            .map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-3">
          {allNotifications
            .filter(n => n.type === 'alert' || n.type === 'warning')
            .map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
        </TabsContent>

        <TabsContent value="info" className="space-y-3">
          {allNotifications
            .filter(n => n.type === 'info' || n.type === 'success')
            .map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
