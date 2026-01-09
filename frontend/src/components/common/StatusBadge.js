import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/15',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/15',
  },
  stalled: {
    label: 'Stalled',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15',
  },
  completed: {
    label: 'Completed',
    className: 'bg-info/10 text-info border-info/20 hover:bg-info/15',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/15',
  },
  denied: {
    label: 'Denied',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15',
  },
  in_review: {
    label: 'In Review',
    className: 'bg-info/10 text-info border-info/20 hover:bg-info/15',
  },
  qualified: {
    label: 'Qualified',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/15',
  },
  not_qualified: {
    label: 'Not Qualified',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15',
  },
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/15',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15',
  },
  healthy: {
    label: 'Healthy',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/15',
  },
  low: {
    label: 'Low Stock',
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/15',
  },
  critical: {
    label: 'Critical',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15',
  },
};

export const StatusBadge = ({ status, className, customLabel }) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium border',
        config.className,
        className
      )}
    >
      {customLabel || config.label}
    </Badge>
  );
};
