/**
 * BusinessLabelDropwDown Component
 * 
 * A thin wrapper around BusinessSwitcher that hides the "Add New Company" option.
 * Used ONLY on the Welcome section of the home page.
 */

import React from 'react';
import { Business } from '@/domain/data-contracts';
import { BusinessSwitcher } from '@/components/business-switcher';

interface BusinessLabelDropwDownProps {
  businesses: Business[];
  currentBusiness: Business | null;
  onBusinessChange: (business: Business) => void;
  disabled?: boolean;
}

export function BusinessLabelDropwDown({
  businesses,
  currentBusiness,
  onBusinessChange,
  disabled = false,
}: BusinessLabelDropwDownProps) {
  return (
    <BusinessSwitcher
      businesses={businesses}
      currentBusiness={currentBusiness}
      onBusinessChange={onBusinessChange}
      disabled={disabled}
      hideAddCompany
    />
  );
}
