import { supabase } from '../api/apiClient';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../api/config';
import { apiClient } from '../api/apiClient';
export interface LoginCredentials {
  email: string;
  password: string;
}
export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
  avatar?: string;
}
/**
 * Authentication service for handling user authentication
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      // Authenticate with Supabase
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      if (authError) throw new Error(authError.message);
      // Get user profile from your API
      const userData = await apiClient.get(USER_ENDPOINTS.PROFILE);
      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin,
        isAuthenticated: true,
        avatar: userData.avatar
      }));
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      // Register with Supabase
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
        }
      });
      if (authError) throw new Error(authError.message);
      // Create user profile in your API
      const userData = await apiClient.post(AUTH_ENDPOINTS.REGISTER, {
        email: data.email,
        name: data.name,
        supabaseId: authData.user?.id
      });
      // Store user data
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        isAdmin: userData.isAdmin || false,
        isAuthenticated: true
      }));
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Remove user data from local storage
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user && JSON.parse(user).isAuthenticated;
  },
  /**
   * Get current user profile
   */
  getCurrentUser(): UserProfile | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updatedProfile = await apiClient.put(USER_ENDPOINTS.UPDATE_PROFILE, profileData);
      // Update local storage
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...updatedProfile
        }));
      }
      return updatedProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};