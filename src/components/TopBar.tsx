'use client';

import { useRouter } from 'next/navigation';
import { IconButton } from './IconButton';
import { UserMenu } from './UserMenu';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showUserMenu?: boolean;
}

export function TopBar({ title, showBack = false, showUserMenu = true }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="bg-background border-b border-divider">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <IconButton
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              }
              label="Go back"
              onClick={() => router.back()}
              size="sm"
            />
          )}
          {title && (
            <h1 className="text-2xl font-bold text-text-primary flex-1">
              {title}
            </h1>
          )}
          {!title && <div className="flex-1" />}
          {showUserMenu && <UserMenu />}
        </div>
      </div>
    </header>
  );
}
