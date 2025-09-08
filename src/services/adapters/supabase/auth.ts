/**
 * Supabase Authentication Service Implementation
 */

import { Account } from '@/domain/data-contracts';
import { IAuthService } from '@/services/ports/auth';
import { supabase } from '@/integrations/supabase/client';

export const signIn = async (email: string, password: string): Promise<{ account: Account; token: string }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('No user returned from sign in');
  }

  const account: Account = {
    id: data.user.id,
    name: data.user.user_metadata?.name || data.user.email || 'User',
    email: data.user.email!,
    createdAt: data.user.created_at
  };

  return { 
    account, 
    token: data.session?.access_token || '' 
  };
};

export const signUp = async (email: string, password: string, name: string): Promise<{ account: Account; token: string }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      },
      emailRedirectTo: `${window.location.origin}/`
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('No user returned from sign up');
  }

  const account: Account = {
    id: data.user.id,
    name: name,
    email: data.user.email!,
    createdAt: data.user.created_at
  };

  return { 
    account, 
    token: data.session?.access_token || '' 
  };
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (): Promise<Account | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.user_metadata?.name || user.email || 'User',
    email: user.email!,
    createdAt: user.created_at
  };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};

export const resetPassword = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  
  if (error) {
    throw new Error(error.message);
  }
};

export const updateProfile = async (updates: Partial<Pick<Account, 'name'>>): Promise<Account> => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('No user returned from profile update');
  }

  return {
    id: data.user.id,
    name: data.user.user_metadata?.name || data.user.email || 'User',
    email: data.user.email!,
    createdAt: data.user.created_at
  };
};