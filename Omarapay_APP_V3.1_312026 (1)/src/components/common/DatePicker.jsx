import React from 'react';
import { Input } from '@/components/ui/input';
import { CalendarPlus as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DatePicker = ({ value, onChange, label, error, maxDate = new Date().toISOString().split('T')[0] }) => {
  
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate > maxDate) {
        // Prevent future dates if maxDate is strictly today
        return; 
    }
    onChange(selectedDate);
  };

  const clearDate = () => {
    onChange('');
  };

  return (
    <div className="flex flex-col gap-1.5">
        <div className="relative">
            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
                type="date"
                value={value || ''}
                onChange={handleDateChange}
                max={maxDate}
                className={cn(
                    "pl-9", 
                    !value && "text-muted-foreground",
                    error && "border-red-500 focus-visible:ring-red-500"
                )}
            />
            {value && (
                <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={clearDate}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default DatePicker;