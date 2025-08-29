import { supabase } from '../../../supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  plan_name: string;
  price: number;
  status: string;
  next_billing_date: string;
  features: string[];
}

export interface UserCredits {
  balance: number;
  total_earned: number;
  total_spent: number;
}

export interface UserData {
  user: UserProfile;
  subscription: Subscription | null;
  credits: UserCredits;
}

export const userService = {
  async getUserProfile(): Promise<UserData> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_DATABASE_URL}/functions/v1/get-user-profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile');
    }

    return data;
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error('Failed to update password');
    }
  }
};
