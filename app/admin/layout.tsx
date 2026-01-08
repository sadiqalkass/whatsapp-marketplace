'use client';

import { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoutes';
import { Sidebar } from '@/components/admin/sidebar/Sidebar';
import { initializeSocket, disconnectSocket } from '@/lib/socket';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeSocket();
    return () => disconnectSocket();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SUPPORT']}>
      <div className="h-screen flex overflow-hidden">
        <aside className="overflow-y-auto">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto bg-gray-200 dark:bg-gray-900 pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}