'use client';

import React from 'react';
import { SidebarSection as SidebarSectionType } from '@/Types/types';
import { SidebarItem } from './sidebarItems';

interface SidebarSectionProps {
  section: SidebarSectionType;
  activePage: string;
  onItemClick: () => void;
  open?: boolean;
  onToggle?: () => void;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  section,
  activePage,
  onItemClick,
  open = false,
  onToggle,
}) => {
  const Icon = section.icon;

  return (
    <div>
      {/* Section Header (clickable to toggle) */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider dark:text-white">
            {section.section}
          </h3>
        </div>

        {section.items.length > 0 && (
          <svg
            className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Collapsible items */}
      <div className={`space-y-1 relative transition-[max-height,opacity] duration-200 ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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