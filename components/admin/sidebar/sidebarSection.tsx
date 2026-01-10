'use client';

import React from 'react';
import { SidebarSection as SidebarSectionType } from '@/Types/types';
import { SidebarItem } from './sidebarItems';

interface SidebarSectionProps {
  section: SidebarSectionType;
  activePage: string;
  onItemClick: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  activePage,
  onItemClick,
}) => {
  const Icon = section.icon;
  
  // Check if any item in this section is active
  const isSectionActive = section.items.some(item => {
    const itemId = item.id.split('/').pop();
    return activePage === itemId;
  });

  return (
    <div>
      {/* Section Header */}
      <div className={`flex items-center gap-2 mb-2 px-1 ${isSectionActive ? 'bg-blue-50 dark:bg-blue-900/20 py-1 rounded-lg' : ''}`}>
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider dark:text-white">
          {section.section}
        </h3>
      </div>

      {/* Items */}
      <div className="space-y-1 relative ml-2">
        {/* Vertical connector line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 via-gray-300 to-gray-300 dark:from-blue-700 dark:via-gray-700 dark:to-gray-700" />

        {section.items.map((item) => {
          const itemId = item.id.split('/').pop();
          const isActive = activePage === itemId;
          
          return (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={isActive}
              onClick={onItemClick}
            />
          );
        })}
      </div>
    </div>
  );
};