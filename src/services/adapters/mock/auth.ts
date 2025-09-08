/**
 * Mock Authentication Service Implementation
 */

import { Account } from '@/domain/data-contracts';
import { IAuthService } from '@/services/ports/auth';

// Mock user data
const mockUsers: (Account & { password: string })[] = [
  {
    id: 'user-1',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    password: 'password123',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Simple in-memory session
let currentUser: Account | null = null;
let authToken: string | null = null;

export const signIn = async (email: string, password: string): Promise<{ account: Account; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const { password: _, ...account } = user; // Remove password from response
  const token = `mock-token-${user.id}-${Date.now()}`;

  currentUser = account;
  authToken = token;

  return { account, token };
};

export const signUp = async (email: string, password: string, name: string): Promise<{ account: Account; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUser = {
    id: `user-${mockUsers.length + 1}`,
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  mockUsers.push(newUser);

  const { password: _, ...account } = newUser;
  const token = `mock-token-${newUser.id}-${Date.now()}`;

  currentUser = account;
  authToken = token;

  return { account, token };
};

export const signOut = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  currentUser = null;
  authToken = null;
};

export const getCurrentUser = async (): Promise<Account | null> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return currentUser;
};

export const isAuthenticated = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return currentUser !== null && authToken !== null;
};

export const resetPassword = async (email: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    // In a real app, you might not want to reveal if email exists
    // For demo purposes, we'll just succeed silently
    console.log('Password reset email would be sent to:', email);
  }
};

export const updateProfile = async (updates: Partial<Pick<Account, 'name'>>): Promise<Account> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  if (!currentUser) {
    throw new Error('Not authenticated');
  }

  // Update in mock users array
  const userIndex = mockUsers.findIndex(u => u.id === currentUser!.id);
  if (userIndex >= 0) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    const { password: _, ...account } = mockUsers[userIndex];
    currentUser = account;
  }

  return currentUser;
};