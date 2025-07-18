import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlusIcon, UsersIcon, SearchIcon, FilterIcon, UserPlusIcon } from 'lucide-react';
import { TeamMemberCard } from '../components/team/TeamMemberCard';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import { toast } from 'sonner';
import { teamService, TeamMember } from '../services/team/teamService';
export const Team = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const data = await teamService.getTeamMembers();
        setTeamMembers(data.teamMembers);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);
  const handleInviteMember = (data: {
    email: string;
    role: string;
    message: string;
  }) => {
    toast.success('Invitation sent successfully', {
      description: `An invitation has been sent to ${data.email}`
    });
    setShowInviteModal(false);
  };
  const handleEditMember = (member: TeamMember) => {
    toast.success('Member updated successfully');
  };
  const handleDeleteMember = (member: TeamMember) => {
    toast.success('Member removed successfully');
  };
  const handleResendInvite = (member: TeamMember) => {
    toast.success('Invitation resent successfully', {
      description: `A new invitation has been sent to ${member.email}`
    });
  };
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  return <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Team
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your team members and their roles
          </p>
        </div>
        <Button variant="primary" leftIcon={<UserPlusIcon size={16} />} onClick={() => setShowInviteModal(true)}>
          Invite Member
        </Button>
      </div>
      <Card>
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search team members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredMembers.map(member => <TeamMemberCard key={member.id} member={member} onEdit={handleEditMember} onDelete={handleDeleteMember} onResendInvite={handleResendInvite} currentUserRole="owner" />)}
          </div>
        </div>
      </Card>
      <InviteMemberModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} onInvite={handleInviteMember} />
    </div>;
};