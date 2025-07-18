import { supabase } from '../../../supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
}

export interface TeamData {
  teamMembers: TeamMember[];
}

export const teamService = {
  async getTeamMembers(): Promise<TeamData> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const response = await fetch(`${process.env.VITE_SUPABASE_DATABASE_URL}/functions/v1/get-team-members`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }

    return await response.json();
  },

  async inviteMember(email: string, role: string, message?: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase
      .from('team_invitations')
      .insert({
        email,
        role,
        message,
        invited_by: session.user.id,
        status: 'pending'
      });

    if (error) {
      throw new Error('Failed to invite team member');
    }
  },

  async updateMemberRole(memberId: string, role: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId);

    if (error) {
      throw new Error('Failed to update member role');
    }
  },

  async removeMember(memberId: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }

    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      throw new Error('Failed to remove team member');
    }
  }
}; 