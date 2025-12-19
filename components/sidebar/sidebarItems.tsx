'use client';

import React from 'react';
import Link from 'next/link';
import { SidebarItem as SidebarItemType } from '@/Types/types';

interface SidebarItemProps {
  item: SidebarItemType;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const href = item.id === 'dashboard' ? '/' : `/${item.id}`;

  return (
    <Link href={href} onClick={onClick}>
      <button
        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
        aria-label={item.label}
      >
        <span className="pl-4">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full dark:bg-red-900 dark:text-red-300">
            {item.badge}
          </span>
        )}
      </button>
    </Link>
  );
};