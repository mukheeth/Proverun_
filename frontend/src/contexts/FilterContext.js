import React, { createContext, useContext, useState, useCallback } from 'react';

const FilterContext = createContext(undefined);

// Default filter state
const defaultFilters = {
  timePeriod: 'quarter',
  customDateRange: null,
  region: 'all',
  state: 'all',
  city: 'all',
  territory: 'all',
  salesRep: 'all',
  physician: 'all',
  site: 'all',
  payerType: 'all',
  payerName: 'all',
  product: 'all',
  status: 'all',
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== 'timePeriod' && value !== 'all' && value !== null
  );

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(
      ([key, value]) => key !== 'timePeriod' && value !== 'all' && value !== null
    ).length;
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilters,
        clearFilters,
        hasActiveFilters,
        getActiveFilterCount,
        defaultFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
