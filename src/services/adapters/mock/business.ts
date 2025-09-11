/**
 * Mock Business Service Implementation
 */

import { Business, Account } from '@/domain/data-contracts';
import { IBusinessService } from '@/services/ports/business';

// Mock data
const mockAccount: Account = {
  id: 'user-1',
  name: 'Sarah Mitchell',
  email: 'sarah@example.com',
  createdAt: '2024-01-01T00:00:00Z'
};

let mockBusinesses: Business[] = [
  {
    id: '1',
    accountId: 'user-1',
    name: 'TechCorp Solutions Ltd',
    companyNumber: '12345678',
    legalForm: 'Ltd',
    country: 'UK',
    operatingMonths: 36,
    workersCount: 25,
    industry: 'Technology',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    accountId: 'user-1',
    name: 'GreenSpace Consulting',
    companyNumber: '87654321',
    legalForm: 'Ltd',
    country: 'UK',
    operatingMonths: 18,
    workersCount: 8,
    industry: 'Environmental Consulting',
    createdAt: '2024-06-15T00:00:00Z'
  }
];

let nextId = mockBusinesses.length + 1;

export const list = async (): Promise<Business[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockBusinesses;
};

export const get = async (id: string): Promise<Business> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const business = mockBusinesses.find(b => b.id === id);
  if (!business) {
    throw new Error('Business not found');
  }
  
  return business;
};

export const create = async (business: Omit<Business, 'id' | 'createdAt'>): Promise<Business> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBusiness: Business = {
    ...business,
    id: String(nextId++),
    createdAt: new Date().toISOString()
  };
  
  mockBusinesses.push(newBusiness);
  return newBusiness;
};

export const update = async (id: string, updates: Partial<Business>): Promise<Business> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const businessIndex = mockBusinesses.findIndex(b => b.id === id);
  if (businessIndex === -1) {
    throw new Error('Business not found');
  }
  
  mockBusinesses[businessIndex] = { ...mockBusinesses[businessIndex], ...updates };
  return mockBusinesses[businessIndex];
};

export const deleteBusiness = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockBusinesses = mockBusinesses.filter(b => b.id !== id);
};

export const getCurrentAccount = async (): Promise<Account> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockAccount;
};

// Export with different name to avoid conflict
export { deleteBusiness as delete };