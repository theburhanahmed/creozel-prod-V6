import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { UserPlusIcon, ShieldIcon, EditIcon, UserIcon, EyeIcon } from 'lucide-react';
interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: {
    email: string;
    role: string;
    message: string;
  }) => void;
}
export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [message, setMessage] = useState('');
  const roles = [{
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all features and settings',
    icon: <ShieldIcon size={16} className="text-red-500" />
  }, {
    id: 'editor',
    name: 'Editor',
    description: 'Can create and edit content',
    icon: <EditIcon size={16} className="text-blue-500" />
  }, {
    id: 'viewer',
    name: 'Viewer',
    description: 'Can view and comment on content',
    icon: <EyeIcon size={16} className="text-gray-500" />
  }];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite({
      email,
      role,
      message
    });
    setEmail('');
    setRole('editor');
    setMessage('');
  };
  return <Dialog isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Enter email address" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <div className="space-y-3">
            {roles.map(r => <label key={r.id} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${role === r.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={e => setRole(e.target.value)} className="sr-only" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {r.icon}
                    <span className={`font-medium ${role === r.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                      {r.name}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${role === r.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {r.description}
                  </p>
                </div>
              </label>)}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Personal Message (Optional)
          </label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none" rows={3} placeholder="Add a personal message to your invitation" />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<UserPlusIcon size={16} />}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Dialog>;
};
