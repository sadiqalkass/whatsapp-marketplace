'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { sidebarData } from './sidebar-data';
import { SidebarSection } from './sidebarSection';
// import { DarkModeToggle } from '@/components/darkmodetoggle'; // commented out per UX change (toggle removed)

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract active page from pathname
  const activePage = pathname.split('/')[1] || 'dashboard';

  const handleItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              MarketHub
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Admin Portal
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search + Dark Mode */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                           placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            {/* ✅ Dark mode toggle commented out per request */}
            {/* <DarkModeToggle /> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sidebarData.map((section, idx) => (
            <SidebarSection
              key={idx}
              section={section}
              activePage={activePage}
              onItemClick={handleItemClick}
            />
          ))}
        </nav>


      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30
                      bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
                      p-4 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-gray-700 dark:text-gray-300"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          MarketHub
        </h1>
        <div className="w-6" />
      </div>
    </>
  );
};
