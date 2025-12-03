import React from 'react';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  verified?: boolean;
}

const SIZE_CLASSES: Record<string, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

export function UserAvatar({ name, avatar, size = 'md', verified }: UserAvatarProps) {
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return (
    <div className="relative inline-block">
      <div className={`avatar placeholder ${SIZE_CLASSES[size]}`}>
        <div className="bg-primary text-primary-content rounded-full">
          {avatar ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={avatar} alt={name} />
          ) : (
            <span className={size === 'xs' ? 'text-xs' : ''}>{initials}</span>
          )}
        </div>
      </div>
      {verified && (
        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5">
          <span className="text-primary-content text-xs">✓</span>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
