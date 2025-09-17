/**
 * Customers Impact Area Page
 * 
 * Detailed view for Customers impact area progress and tasks.
 */

import React from 'react';
import { ImpactAreaTemplate } from '@/components/impact-area-template';
import { Shield, Star, Lock, Target } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';

const Customers = () => {
  const config = {
    impactArea: 'Customers' as ImpactArea,
    title: 'Customers - Product & Service Impact',
    description: 'The Customers impact area evaluates how your company treats its customers, including product quality, customer service, data protection, and beneficial impact of products/services.',
    mainIcon: Shield,
    iconMap: {
      'quality': Star,
      'service': Shield,
      'protection': Lock,
      'impact': Target,
    },
    defaultIcon: Shield,
    resources: [
      {
        title: 'Customer Feedback Tools',
        description: 'Implement systems to gather and act on customer feedback',
        buttonText: 'Get Tools',
      },
      {
        title: 'Data Privacy Guide',
        description: 'Ensure GDPR compliance and customer data protection',
        buttonText: 'Learn More',
      },
      {
        title: 'Service Standards',
        description: 'Best practices for customer service excellence',
        buttonText: 'View Guide',
      },
    ],
  };

  return <ImpactAreaTemplate config={config} />;
};

export default Customers;