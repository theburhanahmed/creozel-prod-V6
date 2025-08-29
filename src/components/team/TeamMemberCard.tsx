import React from 'react';
import { MoreVerticalIcon, ShieldIcon, UserIcon, EditIcon, TrashIcon, MailIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive?: string;
}
interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onResendInvite?: (member: TeamMember) => void;
  currentUserRole: 'owner' | 'admin' | 'editor' | 'viewer';
}
export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onResendInvite,
  currentUserRole
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  const canManageMember = currentUserRole === 'owner' || currentUserRole === 'admin' && member.role !== 'owner';
  return <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="relative">
          {member.avatar ? <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
              {member.name.split(' ').map(n => n[0]).join('')}
            </div>}
          {member.status === 'active' && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-400"></span>}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
            {member.name}
            {member.role === 'owner' && <ShieldIcon size={14} className="text-purple-500" />}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {member.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
        </span>
        {member.status === 'pending' && <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Pending
          </span>}
        {canManageMember && <div className="flex items-center gap-2">
            {member.status === 'pending' && <Button variant="ghost" size="sm" onClick={() => onResendInvite?.(member)} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                <MailIcon size={14} />
              </Button>}
            <Button variant="ghost" size="sm" onClick={() => onEdit(member)} className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              <EditIcon size={14} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(member)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
              <TrashIcon size={14} />
            </Button>
          </div>}
      </div>
    </div>;
};
