/**
 * Business Switcher Component
 * 
 * Dropdown to select between user's businesses.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Building2 } from 'lucide-react';
import { Business } from '@/domain/data-contracts';
import { cn } from '@/lib/utils';

interface BusinessSwitcherProps {
  businesses: Business[];
  currentBusiness: Business | null;
  onBusinessChange: (business: Business) => void;
  disabled?: boolean;
}

export function BusinessSwitcher({ 
  businesses, 
  currentBusiness, 
  onBusinessChange,
  disabled = false
}: BusinessSwitcherProps) {
  if (businesses.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground text-sm">
        <Building2 className="h-4 w-4" />
        <span>No businesses</span>
      </div>
    );
  }

  if (businesses.length === 1) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{businesses[0].name}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-3 font-medium"
          disabled={disabled}
        >
          <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="max-w-[200px] truncate">
            {currentBusiness?.name || 'Select business'}
          </span>
          <ChevronDown className="h-3 w-3 ml-2 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-white z-50">
        {businesses.map((business) => (
          <DropdownMenuItem
            key={business.id}
            onClick={() => onBusinessChange(business)}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">{business.name}</span>
              {business.companyNumber && (
                <span className="text-xs text-muted-foreground">
                  {business.companyNumber}
                </span>
              )}
            </div>
            {currentBusiness?.id === business.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => console.log('Add new company')}
          className="flex items-center gap-2 border-t border-border mt-1 pt-2"
        >
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">+ Add New Company</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}