import React from 'react';
interface CollaboratorAvatarProps {
  name: string;
  image?: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export const CollaboratorAvatar = ({
  name,
  image,
  isActive = false,
  size = 'md'
}: CollaboratorAvatarProps) => {
  // Get initials from name
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  // Generate a deterministic color based on the name
  const colors = ['bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500', 'bg-amber-500', 'bg-orange-500', 'bg-red-500'];
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };
  return <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium shadow-sm relative overflow-hidden ${image ? '' : bgColor}`}>
        {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <span>{initials}</span>}
      </div>
      {isActive && <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>}
    </div>;
};