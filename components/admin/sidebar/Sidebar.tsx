'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, User } from 'lucide-react';
import { sidebarData } from './sidebar-data';
import { sidebarSingleItems } from './sidebar-data';
import { SidebarSection } from './sidebarSection';
import Link from 'next/link';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract active page from pathname
  const activePage = pathname.split('/').pop() || 'dashboard';

  const handleItemClick = () => {
    setMobileMenuOpen(false);
  };

  // Check if profile is active
  const isProfileActive = activePage === 'profile';

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
          w-64 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 
          border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-transform duration-300 ease-in-out shadow-lg
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              MarketHub
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
              Admin Portal
            </p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Active Page Indicator */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Active:
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize truncate">
              {activePage.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          {sidebarData.map((section, idx) => (
            <SidebarSection
              key={idx}
              section={section}
              activePage={activePage}
              onItemClick={handleItemClick}
            />
          ))}
          
          {/* Profile Link */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {sidebarSingleItems.map((item) => (
              <Link
                key={item.id}
                href={item.id}
                onClick={handleItemClick}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  relative
                  ${isProfileActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {/* Active Indicator Bar */}
                {isProfileActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm"></div>
                )}
                
                {/* Icon */}
                {item.icon && (
                  <div className={`
                    flex items-center justify-center
                    ${isProfileActive 
                      ? 'text-white' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    }
                  `}>
                    <item.icon className="h-5 w-5" />
                  </div>
                )}
                
                {/* Text */}
                <span className={`
                  font-medium text-sm flex-1
                  ${isProfileActive ? 'font-semibold' : 'group-hover:text-gray-900 dark:group-hover:text-white'}
                `}>
                  {item.label}
                </span>
                
                {/* Active Badge */}
                {isProfileActive && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Viewing:</span> {activePage.replace('-', ' ')}
            </div>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30
                      bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
                      p-4 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
          {activePage.replace('-', ' ')}
        </h1>
        <div className="w-10">
          {isProfileActive && (
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </>
  );
};