import { Sidebar } from '@/components/admin/sidebar/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-h-screen flex flex-col bg-gray-200 dark:bg-gray-900 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}