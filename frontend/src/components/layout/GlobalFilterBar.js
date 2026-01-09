import React, { useState } from 'react';
import { useFilters } from '@/contexts/FilterContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Filter,
  X,
  Calendar as CalendarIcon,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  regions,
  states,
  salesReps,
  physicians,
  sites,
  payerTypes,
  payers,
  products,
} from '@/data/mockData';

const FilterSelect = ({ label, value, onValueChange, options, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-8 w-[140px] text-xs bg-background border-border/60 focus:ring-primary/20">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export const GlobalFilterBar = () => {
  const { filters, updateFilter, clearFilters, hasActiveFilters, getActiveFilterCount } = useFilters();
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const timePeriodOptions = [
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' },
  ];

  const statusOptions = [
    { id: 'active', name: 'Active' },
    { id: 'pending', name: 'Pending' },
    { id: 'stalled', name: 'Stalled' },
    { id: 'completed', name: 'Completed' },
  ];

  const activeCount = getActiveFilterCount();

  return (
    <div className="filter-bar px-6 py-3 sticky top-16 z-40">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Filter Icon & Label */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs h-5 px-1.5">
              {activeCount}
            </Badge>
          )}
        </div>

        {/* Time Period - Always Visible */}
        <div className="flex items-center gap-2">
          <Select value={filters.timePeriod} onValueChange={(val) => updateFilter('timePeriod', val)}>
            <SelectTrigger className="h-8 w-[130px] text-xs bg-background border-border/60">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timePeriodOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filters.timePeriod === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <span>{format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}</span>
                    ) : (
                      <span>{format(dateRange.from, 'MMM d, yyyy')}</span>
                    )
                  ) : (
                    <span>Pick dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range || { from: null, to: null });
                    updateFilter('customDateRange', range);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Primary Filters - Always Visible */}
        <FilterSelect
          label="Region"
          value={filters.region}
          onValueChange={(val) => updateFilter('region', val)}
          options={regions}
          placeholder="All Regions"
        />

        <FilterSelect
          label="Sales Rep"
          value={filters.salesRep}
          onValueChange={(val) => updateFilter('salesRep', val)}
          options={salesReps}
          placeholder="All Reps"
        />

        <FilterSelect
          label="Site"
          value={filters.site}
          onValueChange={(val) => updateFilter('site', val)}
          options={sites}
          placeholder="All Sites"
        />

        <FilterSelect
          label="Status"
          value={filters.status}
          onValueChange={(val) => updateFilter('status', val)}
          options={statusOptions}
          placeholder="All Status"
        />

        {/* More Filters Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          {showAllFilters ? 'Less' : 'More'}
          <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${showAllFilters ? 'rotate-180' : ''}`} />
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear All
          </Button>
        )}

        {/* Refresh Data */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-auto text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Expanded Filters */}
      {showAllFilters && (
        <div className="flex items-center gap-4 flex-wrap mt-3 pt-3 border-t border-border/40">
          <FilterSelect
            label="State"
            value={filters.state}
            onValueChange={(val) => updateFilter('state', val)}
            options={states}
            placeholder="All States"
          />

          <FilterSelect
            label="Territory"
            value={filters.territory}
            onValueChange={(val) => updateFilter('territory', val)}
            options={salesReps.map(r => ({ id: r.territory, name: r.territory }))}
            placeholder="All Territories"
          />

          <FilterSelect
            label="Physician"
            value={filters.physician}
            onValueChange={(val) => updateFilter('physician', val)}
            options={physicians}
            placeholder="All Physicians"
          />

          <FilterSelect
            label="Payer Type"
            value={filters.payerType}
            onValueChange={(val) => updateFilter('payerType', val)}
            options={payerTypes}
            placeholder="All Types"
          />

          <FilterSelect
            label="Payer"
            value={filters.payerName}
            onValueChange={(val) => updateFilter('payerName', val)}
            options={payers}
            placeholder="All Payers"
          />

          <FilterSelect
            label="Product"
            value={filters.product}
            onValueChange={(val) => updateFilter('product', val)}
            options={products}
            placeholder="All Products"
          />
        </div>
      )}
    </div>
  );
};
