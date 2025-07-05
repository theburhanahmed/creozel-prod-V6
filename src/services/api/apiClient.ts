import { createClient } from '@supabase/supabase-js';
import { ENV_CONFIG } from './config';
// Initialize Supabase client
export const supabase = createClient(ENV_CONFIG.SUPABASE_URL, ENV_CONFIG.SUPABASE_ANON_KEY);
// API client with authentication
export const apiClient = {
  /**
   * Make authenticated GET request
   */
  async get(url: string) {
    const {
      data: sessionData
    } = await supabase.auth.getSession();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionData?.session?.access_token || ''}`
      }
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  },
  /**
   * Make authenticated POST request with JSON body
   */
  async post(url: string, body: any) {
    const {
      data: sessionData
    } = await supabase.auth.getSession();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionData?.session?.access_token || ''}`
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  },
  /**
   * Make authenticated PUT request with JSON body
   */
  async put(url: string, body: any) {
    const {
      data: sessionData
    } = await supabase.auth.getSession();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionData?.session?.access_token || ''}`
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  },
  /**
   * Make authenticated DELETE request
   */
  async delete(url: string) {
    const {
      data: sessionData
    } = await supabase.auth.getSession();
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionData?.session?.access_token || ''}`
      }
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  },
  /**
   * Upload media file with authentication
   */
  async uploadMedia(url: string, file: File, additionalData?: Record<string, any>) {
    const {
      data: sessionData
    } = await supabase.auth.getSession();
    const formData = new FormData();
    formData.append('file', file);
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionData?.session?.access_token || ''}`
      },
      body: formData
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  }
};