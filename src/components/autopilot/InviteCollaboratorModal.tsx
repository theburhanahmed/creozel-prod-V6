import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CollaboratorAvatar } from './CollaboratorAvatar';
import { toast } from 'sonner';
import { UserPlusIcon, SearchIcon, XIcon, CheckIcon, MailIcon, LinkIcon, CopyIcon } from 'lucide-react';
interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'editor' | 'viewer';
}
interface InviteCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pipelineId: string;
  pipelineName: string;
  currentCollaborators: Collaborator[];
}
export const InviteCollaboratorModal = ({
  isOpen,
  onClose,
  pipelineId,
  pipelineName,
  currentCollaborators
}: InviteCollaboratorModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const teamMembers: Collaborator[] = [{
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'editor'
  }, {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'editor'
  }, {
    id: '3',
    name: 'Alex Rodriguez',
    email: 'alex@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
    role: 'editor'
  }, {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    role: 'editor'
  }];
  const filteredTeamMembers = teamMembers.filter(member => !currentCollaborators.some(collab => collab.id === member.id) && (member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.email.toLowerCase().includes(searchTerm.toLowerCase())));
  const handleInviteByEmail = () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Invitation sent', {
      description: `An invitation has been sent to ${email}`
    });
    setEmail('');
  };
  const handleCopyLink = () => {
    // In a real app, this would be a proper sharing link
    navigator.clipboard.writeText(`https://creativedash.app/share/pipeline/${pipelineId}`);
    setIsCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  const handleAddCollaborator = (member: Collaborator) => {
    toast.success('Collaborator added', {
      description: `${member.name} has been added as a collaborator`
    });
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Invite Collaborators" size="md">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Invite team members to collaborate on{' '}
            <strong>{pipelineName}</strong>
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invite by email
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <MailIcon size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select value={role} onChange={e => setRole(e.target.value as 'editor' | 'viewer')} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <Button variant="primary" onClick={handleInviteByEmail}>
                  Invite
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  or
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Share link
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input type="text" value={`https://creativedash.app/share/pipeline/${pipelineId}`} readOnly className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                  <LinkIcon size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <Button variant="outline" onClick={handleCopyLink} leftIcon={isCopied ? <CheckIcon size={16} className="text-green-500" /> : <CopyIcon size={16} />}>
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Team members
            </h3>
            <div className="relative">
              <SearchIcon size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search team members" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {filteredTeamMembers.length > 0 ? filteredTeamMembers.map(member => <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <CollaboratorAvatar name={member.name} image={member.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleAddCollaborator(member)} leftIcon={<UserPlusIcon size={14} />}>
                    Add
                  </Button>
                </div>) : <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No team members found
                </p>
              </div>}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Current collaborators
          </h3>
          <div className="space-y-2">
            {currentCollaborators.map(collaborator => <div key={collaborator.id} className="flex items-center justify-between p-2 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CollaboratorAvatar name={collaborator.name} image={collaborator.avatar} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {collaborator.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {collaborator.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-2">
                    {collaborator.role === 'editor' ? 'Editor' : 'Viewer'}
                  </span>
                  {collaborator.id !== '0' && <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                      <XIcon size={14} />
                    </Button>}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </Modal>;
};
