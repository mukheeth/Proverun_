import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumb,
  className,
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumb && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          {breadcrumb}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
