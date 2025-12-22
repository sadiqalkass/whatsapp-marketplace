'use client';

import React, { useState } from 'react';
import { TrendingUp, MousePointer, MessageCircle, ShoppingCart, Percent, Filter, Facebook, Instagram } from 'lucide-react';
import { AdCampaign } from '@/Types/types';

const mockAdCampaigns: AdCampaign[] = [
  {
    id: 'AD-001',
    campaignName: 'Holiday Season Sale',
    source: 'Facebook',
    clicks: 12500,
    chatsStarted: 3200,
    ordersGenerated: 850,
    conversionRate: 26.6,
    spend: 250000,
    revenue: 1850000,
    roi: 640,
    startDate: '2024-12-01',
  },
  {
    id: 'AD-002',
    campaignName: 'New Product Launch',
    source: 'Instagram',
    clicks: 8900,
    chatsStarted: 2100,
    ordersGenerated: 520,
    conversionRate: 24.8,
    spend: 180000,
    revenue: 920000,
    roi: 411,
    startDate: '2024-12-10',
  },
  {
    id: 'AD-003',
    campaignName: 'Flash Weekend Deals',
    source: 'Facebook',
    clicks: 15200,
    chatsStarted: 4100,
    ordersGenerated: 1200,
    conversionRate: 29.3,
    spend: 320000,
    revenue: 2400000,
    roi: 650,
    startDate: '2024-12-15',
  },
  {
    id: 'AD-004',
    campaignName: 'Back to School Campaign',
    source: 'Instagram',
    clicks: 6500,
    chatsStarted: 1500,
    ordersGenerated: 380,
    conversionRate: 25.3,
    spend: 120000,
    revenue: 680000,
    roi: 467,
    startDate: '2024-11-20',
  },
  {
    id: 'AD-005',
    campaignName: 'Summer Collection 2024',
    source: 'Facebook',
    clicks: 9800,
    chatsStarted: 2600,
    ordersGenerated: 720,
    conversionRate: 27.7,
    spend: 200000,
    revenue: 1320000,
    roi: 560,
    startDate: '2024-11-15',
  },
];

export default function AdTrackingPage() {
  const [campaigns, setCampaigns] = useState(mockAdCampaigns);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filterSource === 'all') return true;
    return campaign.source.toLowerCase() === filterSource.toLowerCase();
  });

  const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalChats = filteredCampaigns.reduce((sum, c) => sum + c.chatsStarted, 0);
  const totalOrders = filteredCampaigns.reduce((sum, c) => sum + c.ordersGenerated, 0);
  const avgConversionRate = filteredCampaigns.length > 0
    ? filteredCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / filteredCampaigns.length
    : 0;
  const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const avgROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100) : 0;

  const getSourceIcon = (source: string) => {
    if (source === 'Facebook') return <Facebook className="w-4 h-4" />;
    if (source === 'Instagram') return <Instagram className="w-4 h-4" />;
    return <MessageCircle className="w-4 h-4" />;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 500) return 'text-green-600';
    if (roi >= 300) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ad Campaign Tracking</h1>
          <p className="text-gray-600 mt-2">Monitor click-to-WhatsApp ad performance and ROI</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterSource('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filterSource === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setFilterSource('facebook')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                  filterSource === 'facebook'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => setFilterSource('instagram')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                  filterSource === 'instagram'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Date Range
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <MousePointer className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chats Started</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalChats.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders Generated</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalOrders.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Percent className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ad Spend</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">₦{totalSpend.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">₦{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average ROI</p>
                <p className={`text-2xl font-bold mt-2 ${getROIColor(avgROI)}`}>
                  {avgROI.toFixed(0)}%
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chats Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {campaign.campaignName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(campaign.source)}
                        {campaign.source}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.chatsStarted.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {campaign.ordersGenerated.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${campaign.conversionRate}%` }}
                          />
                        </div>
                        <span className="text-gray-900 font-medium">{campaign.conversionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ₦{campaign.spend.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      ₦{campaign.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-bold ${getROIColor(campaign.roi)}`}>
                        {campaign.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">Ad Performance Insights</p>
              <p className="text-sm text-blue-700 mt-1">
                Your click-to-WhatsApp campaigns are performing well with an average conversion rate of {avgConversionRate.toFixed(1)}%. 
                Focus on high-performing campaigns and consider scaling Facebook ads with ROI above 600%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}