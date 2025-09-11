/**
 * Rotating B Corp Facts Component
 * 
 * Displays engaging B Corp facts that rotate every few seconds
 */

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const bCorpFacts = [
  {
    title: "Global Movement",
    fact: "Over 4,000 B Corps across 80+ countries are redefining success in business",
    highlight: "4,000+ Companies"
  },
  {
    title: "UK Leadership", 
    fact: "51% awareness of B Corp Certification reached in the UK, showing growing impact",
    highlight: "51% UK Awareness"
  },
  {
    title: "Standards Evolution",
    fact: "B Lab's new 2026 standards are raising the bar for sustainable business practices",
    highlight: "New 2026 Standards"
  },
  {
    title: "Economic Impact",
    fact: "B Corps use business as a force for good, benefiting people, communities, and planet",
    highlight: "Force for Good"
  },
  {
    title: "Stakeholder Governance",
    fact: "Legal requirement ensures directors consider all stakeholders, not just shareholders",
    highlight: "Beyond Profit"
  },
  {
    title: "Purpose & Profit",
    fact: "B Corps balance profit with purpose, creating sustainable competitive advantage",
    highlight: "Balanced Success"
  },
  {
    title: "Climate Action",
    fact: "B Corps lead on climate commitments and environmental stewardship initiatives",
    highlight: "Climate Leaders"
  },
  {
    title: "Worker Benefits",
    fact: "B Corps demonstrate better working conditions and employee satisfaction rates",
    highlight: "Great Workplaces"
  }
];

export function RotatingBCorpFacts() {
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % bCorpFacts.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const fact = bCorpFacts[currentFact];

  return (
    <div className="space-y-6 h-full flex flex-col justify-center">
      <div className="animate-fade-in key={currentFact}">
        <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
          {fact.highlight}
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {fact.title}
        </h2>
        
        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
          {fact.fact}
        </p>
      </div>
      
      {/* Progress indicators */}
      <div className="flex space-x-2">
        {bCorpFacts.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentFact ? 'bg-white w-8' : 'bg-white/30 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}