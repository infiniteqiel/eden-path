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
  onAddCompany?: () => void;
  disabled?: boolean;
  hideAddCompany?: boolean;
}

export function BusinessSwitcher({ 
  businesses, 
  currentBusiness, 
  onBusinessChange,
  onAddCompany,
  disabled = false,
  hideAddCompany = false
}: BusinessSwitcherProps) {
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
      <DropdownMenuContent align="start" className="w-64 bg-background border border-border shadow-md z-[60]">
        {businesses.length > 0 ? (
          businesses.map((business) => (
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
          ))
        ) : (
          <DropdownMenuItem disabled className="text-muted-foreground">
            No businesses yet
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}