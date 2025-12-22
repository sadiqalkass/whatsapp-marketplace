'use client';

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Download, FileText, Filter } from 'lucide-react';
import { SummaryCardProps } from '@/Types/types';

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

// Mock Data
const mockReportData = {
  daily: {
    sales: '₦450,000',
    orders: 45,
    trend: { value: '15% vs yesterday', isPositive: true }
  },
  weekly: {
    sales: '₦2,800,000',
    orders: 280,
    trend: { value: '8% vs last week', isPositive: true }
  },
  monthly: {
    sales: '₦12,500,000',
    orders: 1250,
    trend: { value: '22% vs last month', isPositive: true }
  }
};

const mockSummaryData = [
  {
    metric: 'Gross Merchandise Value (GMV)',
    daily: '₦450,000',
    weekly: '₦2,800,000',
    monthly: '₦12,500,000',
  },
  {
    metric: 'Platform Revenue',
    daily: '₦45,000',
    weekly: '₦280,000',
    monthly: '₦1,250,000',
  },
  {
    metric: 'Total Payouts',
    daily: '₦380,000',
    weekly: '₦2,200,000',
    monthly: '₦10,000,000',
  },
  {
    metric: 'Delivery Costs',
    daily: '₦15,000',
    weekly: '₦180,000',
    monthly: '₦750,000',
  },
  {
    metric: 'Taxes Collected',
    daily: '₦10,000',
    weekly: '₦140,000',
    monthly: '₦500,000',
  },
];

const mockMerchantData = [
  { merchant: 'Fashion Hub', gmv: '₦3,200,000', orders: 320, revenue: '₦320,000' },
  { merchant: 'Tech World', gmv: '₦4,500,000', orders: 180, revenue: '₦450,000' },
  { merchant: 'Food Mart', gmv: '₦1,800,000', orders: 450, revenue: '₦180,000' },
  { merchant: 'Electronics Plus', gmv: '₦2,000,000', orders: 150, revenue: '₦200,000' },
  { merchant: 'Book Store', gmv: '₦1,000,000', orders: 150, revenue: '₦100,000' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedMerchant, setSelectedMerchant] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleDownload = (format: string) => {
    alert(`Downloading report in ${format.toUpperCase()} format...`);
  };

  const getCurrentData = () => {
    switch(dateRange) {
      case 'daily': return mockReportData.daily;
      case 'weekly': return mockReportData.weekly;
      case 'monthly': return mockReportData.monthly;
      default: return mockReportData.monthly;
    }
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
                    {mockMerchantData.map((m) => (
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
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                {mockSummaryData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.metric}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.daily}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.weekly}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {row.monthly}
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
                {mockMerchantData.map((merchant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {merchant.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {merchant.gmv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {merchant.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      {merchant.revenue}
                    </td>
                  </tr>
                ))}
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
      </div>
    </div>
  );
}