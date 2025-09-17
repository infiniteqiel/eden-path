/**
 * Community Impact Area Page
 * 
 * Detailed view for Community impact area progress and tasks.
 */

import React from 'react';
import { ImpactAreaTemplate } from '@/components/impact-area-template';
import { Target, HandHeart, ShoppingCart, MapPin } from 'lucide-react';
import { ImpactArea } from '@/domain/data-contracts';

const Community = () => {
  const config = {
    impactArea: 'Community' as ImpactArea,
    title: 'Community - Local Impact',
    description: 'The Community impact area evaluates your company\'s impact on the communities where it operates, including local economic development, supplier diversity, charitable giving, and civic engagement.',
    mainIcon: Target,
    iconMap: {
      'local': MapPin,
      'supply': ShoppingCart,
      'charity': HandHeart,
    },
    defaultIcon: Target,
    resources: [
      {
        title: 'Supplier Directory',
        description: 'Find diverse and local suppliers for your business',
        buttonText: 'Browse',
      },
      {
        title: 'Volunteering Programs',
        description: 'Set up employee volunteer programs in your community',
        buttonText: 'Learn More',
      },
      {
        title: 'Impact Measurement',
        description: 'Tools to measure and report community impact',
        buttonText: 'Get Tools',
      },
    ],
  };

  return <ImpactAreaTemplate config={config} />;
};

export default Community;