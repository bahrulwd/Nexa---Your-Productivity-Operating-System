import React from 'react';

export const PRESET_AVATARS = [
  { id: 'avatar-1', path: '/images/AvatarNexa/avatar1.png' },
  { id: 'avatar-2', path: '/images/AvatarNexa/avatar2.png' },
  { id: 'avatar-3', path: '/images/AvatarNexa/avatar3.png' },
  { id: 'avatar-4', path: '/images/AvatarNexa/avatar4.png' },
  { id: 'avatar-5', path: '/images/AvatarNexa/avatar5.png' },
  { id: 'avatar-6', path: '/images/AvatarNexa/avatar6.png' },
  { id: 'avatar-7', path: '/images/AvatarNexa/avatar7.png' },
  { id: 'avatar-8', path: '/images/AvatarNexa/avatar8.png' },
  { id: 'avatar-9', path: '/images/AvatarNexa/avatar9.png' }
];

interface UserAvatarProps {
  avatarUrl?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl, className = "w-10 h-10" }) => {
  if (avatarUrl?.startsWith('preset:')) {
    const presetId = avatarUrl.split(':')[1];
    const preset = PRESET_AVATARS.find(p => p.id === presetId) || PRESET_AVATARS[0];
    return (
      <div className={`${className} rounded-full border border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0`}>
        <img
          className="w-full h-full object-cover"
          alt={`Preset ${presetId}`}
          src={preset.path}
        />
      </div>
    );
  }

  // Fallback to image rendering
  return (
    <div className={`${className} rounded-full border border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0`}>
      <img
        className="w-full h-full object-cover"
        alt="Avatar"
        src={avatarUrl || '/images/AvatarNexa/avatar1.png'}
      />
    </div>
  );
};

export default UserAvatar;
