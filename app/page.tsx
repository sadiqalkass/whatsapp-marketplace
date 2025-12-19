export default function Home() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your marketplace</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Merchants</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">1,234</p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Orders</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">4,567</p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">$89,123</p>
          </div>
        </section>

        <section className="mt-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent activity</h2>
            <p className="text-sm text-gray-500 mt-2">No recent activity to display.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
