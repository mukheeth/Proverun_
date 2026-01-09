import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const KPICard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  format = 'number',
  target,
  onClick,
  className,
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (format === 'percent') {
      return `${val}%`;
    }
    if (format === 'number') {
      return new Intl.NumberFormat('en-US').format(val);
    }
    return val;
  };

  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <Card
      className={cn(
        'card-kpi cursor-pointer hover:shadow-card-hover transition-shadow duration-200',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="kpi-label mb-1.5">{title}</p>
            <p className="kpi-value">{formatValue(value)}</p>
            
            {/* Change Indicator */}
            {change !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                {isNeutral ? (
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                ) : isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  isNeutral ? 'text-muted-foreground' :
                  isPositive ? 'text-success' : 'text-destructive'
                )}>
                  {isPositive && '+'}{change}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {changeLabel}
                  </span>
                )}
              </div>
            )}

            {/* Target Indicator */}
            {target !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">vs Target</span>
                  <span className={value >= target ? 'text-success' : 'text-warning'}>
                    {formatValue(target)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      value >= target ? 'bg-success' : 'bg-warning'
                    )}
                    style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Icon */}
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
