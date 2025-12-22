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

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider dark:text-white">
          {section.section}
        </h3>
      </div>

      {/* Items (always visible) */}
      <div className="space-y-1 relative">
        {/* Vertical connector line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />

        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activePage === item.id}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
};