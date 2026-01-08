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
  const href = item.id.startsWith('/') ? item.id : `/${item.id}`;

  return (
    <div className="relative">

      
      <Link href={href} onClick={onClick} className="block">
        <div
          className={`
            relative flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-all duration-200
            ml-4
            ${isActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform -translate-x-1'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 hover:shadow-sm hover:translate-x-1'
            }
          `}
          aria-label={item.label}
        >
          {/* Active highlight bar */}
          {isActive && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-sm"></div>
          )}
          
          <span className="font-medium">{item.label}</span>
          
          {/* Badge */}
          {item.badge && (
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full min-w-6 text-center
              ${isActive
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }
            `}>
              {item.badge}
            </span>
          )}
          
          {/* Active chevron */}
          {isActive && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};