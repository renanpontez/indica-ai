'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserMenu } from './UserMenu';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showUserMenu?: boolean;
}

export function Breadcrumb({ items, showUserMenu = true }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <header className="bg-background border-b border-divider">
      <div className="mx-auto max-w-[1000px] 2xl:max-w-[1440px] px-4 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-body">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <svg
                      className="h-4 w-4 text-medium-grey"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="text-medium-grey hover:text-dark-grey transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-dark-grey font-medium' : 'text-medium-grey'}>
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
