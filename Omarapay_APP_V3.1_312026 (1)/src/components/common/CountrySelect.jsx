import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

// Simplified list for demo purposes, but structure allows for full list
const COUNTRIES = [
  { value: "Philippines", label: "Philippines" },
  { value: "United States", label: "United States" },
  { value: "Australia", label: "Australia" },
  { value: "Canada", label: "Canada" },
  { value: "China", label: "China" },
  { value: "France", label: "France" },
  { value: "Germany", label: "Germany" },
  { value: "Hong Kong", label: "Hong Kong" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Japan", label: "Japan" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Singapore", label: "Singapore" },
  { value: "South Korea", label: "South Korea" },
  { value: "Thailand", label: "Thailand" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Vietnam", label: "Vietnam" },
];

const CountrySelect = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sort: Pinned (PH, US) first, then alphabetical
  const sortedCountries = useMemo(() => {
    const pinned = ["Philippines", "United States"];
    const others = COUNTRIES.filter(c => !pinned.includes(c.label));
    const pinnedObjs = pinned.map(p => COUNTRIES.find(c => c.label === p)).filter(Boolean);
    
    others.sort((a, b) => a.label.localeCompare(b.label));
    return [...pinnedObjs, ...others];
  }, []);

  const filteredCountries = sortedCountries.filter(country => 
    country.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500 focus:ring-red-500"
            )}
          >
            {value
              ? COUNTRIES.find((country) => country.value === value)?.label
              : "Select country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search country..."
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
              />
            </div>
            <ScrollArea className="h-72">
                <div className="p-1">
                    {filteredCountries.length === 0 && (
                        <div className="py-6 text-center text-sm">No country found.</div>
                    )}
                    {filteredCountries.map((country) => (
                        <div
                            key={country.value}
                            className={cn(
                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                value === country.value ? "bg-accent text-accent-foreground" : ""
                            )}
                            onClick={() => {
                                onChange(country.value);
                                setOpen(false);
                            }}
                        >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                value === country.value ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {country.label}
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default CountrySelect;