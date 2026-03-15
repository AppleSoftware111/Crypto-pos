import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// This wrapper helps render card views on mobile and tables on desktop
export const ResponsiveTableWrapper = ({ 
  data, 
  columns, 
  onRenderCard, 
  children // The Table component itself
}) => {
  
  if (!data || data.length === 0) {
      return children; // Let the table handle empty states
  }

  return (
    <>
      {/* Mobile View: Stacked Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div key={item.id || index} className="animate-in fade-in zoom-in-95 duration-300">
             {onRenderCard(item, index)}
          </div>
        ))}
      </div>

      {/* Desktop View: Traditional Table */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
            {children}
        </div>
      </div>
    </>
  );
};

export default ResponsiveTableWrapper;