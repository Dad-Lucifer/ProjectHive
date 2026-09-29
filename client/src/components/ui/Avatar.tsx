import { clsx } from 'clsx';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function hashColor(name: string): string {
  const colors = [
    '#2C5C7A', '#3E6B52', '#C97A2E', '#B8452F', '#5B6472',
    '#4A6E8A', '#528564', '#8A6040', '#7A3D28', '#465260',
  ];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) % colors.length;
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name, avatarUrl, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={clsx('rounded-full object-cover flex-shrink-0', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx('rounded-full flex items-center justify-center flex-shrink-0 font-medium text-white select-none', sizes[size], className)}
      style={{ backgroundColor: hashColor(name) }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
