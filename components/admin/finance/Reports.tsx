'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Download, FileText, Filter } from 'lucide-react';
import { SummaryCardProps } from '@/Types/types';
import { reportApi } from '@/services/report.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const SummaryCard = ({ title, value, icon: Icon, trend, className = '' }: SummaryCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedMerchant, setSelectedMerchant] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [merchantData, setMerchantData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const router = useRouter();
  const fetchReports = async () => {
    try {
      setLoading(true);
      const [comparisonRes, merchantRes] = await Promise.all([
        reportApi.getReportComparison(), // Fetch all periods at once
        reportApi.getMerchantPerformance(dateRange as 'daily' | 'weekly' | 'monthly'),
      ]);

      setSummaryData(comparisonRes.data); 
      
      // Apply filters
      let filtered = merchantRes.data;
      
      if (selectedMerchant !== 'all') {
        filtered = filtered.filter((m: any) => m.merchantName === selectedMerchant);
      }
      
      setMerchantData(filtered);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Acess denied');
        router.push('/admin/dashboard');
      } else {
        toast.error('Failed to load Reports');
      } 
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [dateRange, selectedMerchant]);

  const handleDownload = async (format: string) => {
    if (format === 'csv') {
      await reportApi.exportCSV(dateRange as 'daily' | 'weekly' | 'monthly');
    } else {
      toast.error('PDF export coming soon');
    }
  };

  const getCurrentData = () => {
    if (!summaryData) return { sales: '₦0', orders: 0, trend: { value: '0%', isPositive: true } };
    
    return {
      sales: `₦${(summaryData.gmv || 0).toLocaleString()}`,
      orders: summaryData.ordersCount || 0,
      trend: { value: '0%', isPositive: true },
    };
  };

  const currentData = getCurrentData();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600 mt-2">Comprehensive financial summaries and analytics</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload('csv')}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setDateRange('daily')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === 'daily'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setDateRange('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === 'weekly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setDateRange('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  dateRange === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Merchant
                  </label>
                  <select
                    value={selectedMerchant}
                    onChange={(e) => setSelectedMerchant(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Merchants</option>
                    {merchantData.map((m) => (
                      <option key={m.merchant} value={m.merchant}>
                        {m.merchant}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="food">Food</option>
                    <option value="books">Books</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading? (
          <div className='text-center py-16'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            <p className='mt-4 text-gray-600'>Loading reports...</p>
          </div>
        ) : (
          <>
            {/* Report Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryCard
                title={`${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Sales`}
                value={currentData.sales}
                icon={DollarSign}
                trend={currentData.trend}
              />
              <SummaryCard
                title={`${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Orders`}
                value={currentData.orders}
                icon={TrendingUp}
              />
              <SummaryCard
                title="Report Period"
                value={dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}
                icon={Calendar}
              />
            </div>

            {/* Financial Summary Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Financial Summary
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weekly
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {summaryData && [
                    { 
                      metric: 'Gross Merchandise Value (GMV)', 
                      daily: summaryData.gmv,
                      weekly: summaryData.gmv, 
                      monthly: summaryData.gmv 
                    },
                    { 
                      metric: 'Platform Revenue', 
                      daily: summaryData.platformRevenue,
                      weekly: summaryData.platformRevenue,
                      monthly: summaryData.platformRevenue
                    },
                    { 
                      metric: 'Total Payouts', 
                      daily: summaryData.totalPayouts,
                      weekly: summaryData.totalPayouts,
                      monthly: summaryData.totalPayouts
                    },
                    { 
                      metric: 'Orders Count', 
                      daily: summaryData.ordersCount,
                      weekly: summaryData.ordersCount,
                      monthly: summaryData.ordersCount
                    },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.metric}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof row.daily === 'number' && row.metric !== 'Orders Count' 
                          ? `₦${row.daily.toLocaleString()}` 
                          : row.daily}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof row.weekly === 'number' && row.metric !== 'Orders Count'
                          ? `₦${row.weekly.toLocaleString()}` 
                          : row.weekly}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {typeof row.monthly === 'number' && row.metric !== 'Orders Count'
                          ? `₦${row.monthly.toLocaleString()}` 
                          : row.monthly}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>

            {/* Merchant Performance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Merchant Performance (Monthly)</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Merchant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GMV
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {merchantData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">No merchant data available</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Merchant performance will appear here once orders are placed
                          </p>
                        </td>
                      </tr>
                    ) : (
                      merchantData.map((merchant, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {merchant.merchantName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ₦{merchant.gmv.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {merchant.ordersCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                            ₦{merchant.platformRevenue.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Summary */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Export Options</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Download comprehensive reports in CSV format for spreadsheet analysis or PDF for presentations and record-keeping.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}