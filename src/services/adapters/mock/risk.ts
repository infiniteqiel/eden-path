/**
 * Mock Risk Assessment Service Implementation
 * 
 * Implements the FR3 14-question risk checklist with mock data.
 */

import { RiskAnswer, RiskQuestion } from '@/domain/data-contracts';
import { IRiskService } from '@/services/ports/risk';

// FR3 Risk Assessment Questions (14 questions)
const mockQuestions: RiskQuestion[] = [
  {
    code: 'FR3-01',
    label: 'Does your company operate in a high-risk industry?',
    details: 'Industries like fossil fuels, tobacco, gambling, or weapons manufacturing require additional scrutiny.',
    category: 'Business Model'
  },
  {
    code: 'FR3-02', 
    label: 'Are there any pending legal disputes or investigations?',
    details: 'Any ongoing litigation, regulatory investigations, or compliance issues must be disclosed.',
    category: 'Legal & Compliance'
  },
  {
    code: 'FR3-03',
    label: 'Has your company been subject to any regulatory fines in the past 3 years?',
    details: 'Include fines from employment, environmental, tax, or other regulatory bodies.',
    category: 'Legal & Compliance'
  },
  {
    code: 'FR3-04',
    label: 'Does your company have operations in countries with poor human rights records?',
    details: 'Operations in regions with documented human rights concerns require additional due diligence.',
    category: 'Operations'
  },
  {
    code: 'FR3-05',
    label: 'Are there any conflicts of interest among board members or key stakeholders?',
    details: 'Undisclosed financial interests or competing business relationships must be identified.',
    category: 'Governance'
  },
  {
    code: 'FR3-06',
    label: 'Has your company experienced any significant environmental incidents?',
    details: 'Include spills, violations, or other environmental damage in the past 5 years.',
    category: 'Environment'
  },
  {
    code: 'FR3-07',
    label: 'Are there any concerns about your supply chain practices?',
    details: 'Known or suspected issues with suppliers regarding labor, environment, or ethics.',
    category: 'Supply Chain'
  },
  {
    code: 'FR3-08',
    label: 'Does your company have any debt covenant violations?',
    details: 'Breaches of loan agreements or financial covenants that could impact operations.',
    category: 'Financial'
  },
  {
    code: 'FR3-09',
    label: 'Are there any significant tax disputes or audits in progress?',
    details: 'Ongoing tax investigations or disputes with HMRC or international tax authorities.',
    category: 'Financial'
  },
  {
    code: 'FR3-10',
    label: 'Has your company been involved in any data breaches or privacy violations?',
    details: 'Security incidents affecting customer or employee data in the past 3 years.',
    category: 'Data & Privacy'
  },
  {
    code: 'FR3-11',
    label: 'Are there any concerns about executive compensation or related party transactions?',
    details: 'Unusually high executive pay or transactions with related entities that may pose conflicts.',
    category: 'Governance'
  },
  {
    code: 'FR3-12',
    label: 'Does your company have adequate insurance coverage for its operations?',
    details: 'Gaps in liability, environmental, or professional indemnity insurance coverage.',
    category: 'Risk Management'
  },
  {
    code: 'FR3-13',
    label: 'Are there any material changes to the business expected in the next 12 months?',
    details: 'Planned acquisitions, disposals, or significant operational changes that could affect certification.',
    category: 'Business Model'
  },
  {
    code: 'FR3-14',
    label: 'Has your company received any complaints through formal grievance procedures?',
    details: 'Formal complaints from employees, customers, or stakeholders about conduct or practices.',
    category: 'Stakeholder Relations'
  }
];

// In-memory storage for answers
let mockAnswers: { [businessId: string]: RiskAnswer[] } = {
  '1': [
    {
      code: 'FR3-01',
      answer: false,
      notes: 'Technology consulting services - not a high-risk industry',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      code: 'FR3-05',
      answer: true,
      notes: 'CEO holds shares in a supplier company - documented in board minutes',
      updatedAt: '2024-01-15T11:00:00Z'
    }
  ]
};

export const listQuestions = async (): Promise<RiskQuestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockQuestions;
};

export const getAnswers = async (businessId: string): Promise<RiskAnswer[]> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockAnswers[businessId] || [];
};

export const setAnswer = async (
  businessId: string,
  code: string,
  answer: boolean,
  notes?: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!mockAnswers[businessId]) {
    mockAnswers[businessId] = [];
  }

  const existingIndex = mockAnswers[businessId].findIndex(a => a.code === code);
  const answerRecord: RiskAnswer = {
    code,
    answer,
    notes,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    mockAnswers[businessId][existingIndex] = answerRecord;
  } else {
    mockAnswers[businessId].push(answerRecord);
  }
};

export const getSummary = async (businessId: string): Promise<{
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  completionPct: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const answers = mockAnswers[businessId] || [];
  const totalQuestions = mockQuestions.length;
  const answeredCount = answers.length;
  const flaggedCount = answers.filter(a => a.answer === true).length;
  const completionPct = Math.round((answeredCount / totalQuestions) * 100);

  return {
    totalQuestions,
    answeredCount,
    flaggedCount,
    completionPct
  };
};

export const clearAnswers = async (businessId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  delete mockAnswers[businessId];
};