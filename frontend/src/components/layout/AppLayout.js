import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavigation } from './TopNavigation';
import { GlobalFilterBar } from './GlobalFilterBar';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar (App-wide) */}
      <TopNavigation />
      
      {/* Global Filter Bar (persistent, shared) */}
      <GlobalFilterBar />
      
      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
