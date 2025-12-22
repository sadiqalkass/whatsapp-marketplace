"use client"

import React, { useState } from 'react';
import { ShoppingCart, Search, Bell, Tag, Clock, TrendingDown, AlertCircle, CheckCircle, Filter, ChevronDown } from 'lucide-react';

// Mock Data for Abandoned Carts
const mockAbandonedCarts = [
  {
    id: 1,
    customer: 'John Doe',
    phone: '+234 801 234 5678',
    items: [
      { name: 'iPhone 13 Pro', quantity: 1, price: 520000 },
      { name: 'AirPods Pro', quantity: 1, price: 89000 }
    ],
    cartValue: 609000,
    timeAbandoned: '2 hours ago',
    abandonedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reminderSent: false,
    discountApplied: false
  },
  {
    id: 2,
    customer: 'Sarah Williams',
    phone: '+234 802 345 6789',
    items: [
      { name: 'Nike Air Max Sneakers', quantity: 2, price: 35000 }
    ],
    cartValue: 70000,
    timeAbandoned: '5 hours ago',
    abandonedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    reminderSent: true,
    discountApplied: false
  },
  {
    id: 3,
    customer: 'Mike Johnson',
    phone: '+234 803 456 7890',
    items: [
      { name: 'Samsung 55" Smart TV', quantity: 1, price: 380000 },
      { name: 'Soundbar', quantity: 1, price: 75000 }
    ],
    cartValue: 455000,
    timeAbandoned: '1 day ago',
    abandonedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    reminderSent: true,
    discountApplied: true
  },
  {
    id: 4,
    customer: 'Grace Adeyemi',
    phone: '+234 804 567 8901',
    items: [
      { name: 'Designer Handbag', quantity: 1, price: 125000 }
    ],
    cartValue: 125000,
    timeAbandoned: '3 hours ago',
    abandonedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    reminderSent: false,
    discountApplied: false
  },
  {
    id: 5,
    customer: 'David Brown',
    phone: '+234 805 678 9012',
    items: [
      { name: 'Gaming Laptop', quantity: 1, price: 850000 },
      { name: 'Gaming Mouse', quantity: 1, price: 15000 },
      { name: 'Mechanical Keyboard', quantity: 1, price: 25000 }
    ],
    cartValue: 890000,
    timeAbandoned: '6 hours ago',
    abandonedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    reminderSent: false,
    discountApplied: false
  },
  {
    id: 6,
    customer: 'Amina Hassan',
    phone: '+234 806 789 0123',
    items: [
      { name: 'Blender Set', quantity: 1, price: 45000 },
      { name: 'Toaster', quantity: 1, price: 18000 }
    ],
    cartValue: 63000,
    timeAbandoned: '12 hours ago',
    abandonedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    reminderSent: true,
    discountApplied: false
  },
  {
    id: 7,
    customer: 'Peter Obidi',
    phone: '+234 807 890 1234',
    items: [
      { name: 'Office Chair', quantity: 2, price: 95000 }
    ],
    cartValue: 190000,
    timeAbandoned: '8 hours ago',
    abandonedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    reminderSent: false,
    discountApplied: false
  },
  {
    id: 8,
    customer: 'Blessing Okoro',
    phone: '+234 808 901 2345',
    items: [
      { name: 'Yoga Mat', quantity: 1, price: 12000 },
      { name: 'Dumbbells Set', quantity: 1, price: 35000 },
      { name: 'Resistance Bands', quantity: 1, price: 8000 }
    ],
    cartValue: 55000,
    timeAbandoned: '4 hours ago',
    abandonedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    reminderSent: false,
    discountApplied: false
  }
];

type StatusBadgeProps = { reminderSent: boolean; discountApplied: boolean };
const StatusBadge: React.FC<StatusBadgeProps> = ({ reminderSent, discountApplied }) => {
  if (discountApplied) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-xs font-medium">
        <Tag className="w-3 h-3" />
        Discount Applied
      </div>
    );
  }
  
  if (reminderSent) {
    return (
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-medium">
        <CheckCircle className="w-3 h-3" />
        Reminder Sent
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full text-xs font-medium">
      <AlertCircle className="w-3 h-3" />
      No Action
    </div>
  );
};

type CartItem = { name: string; quantity: number; price: number };
type Cart = { id: number; customer: string; phone: string; items: CartItem[]; cartValue: number; timeAbandoned: string; abandonedAt: Date; reminderSent: boolean; discountApplied: boolean };

type CartRowProps = { cart: Cart; onSendReminder: (id: number) => void; onApplyDiscount: (id: number) => void };
// CartRow Component
const CartRow: React.FC<CartRowProps> = ({ cart, onSendReminder, onApplyDiscount }) => {
  const [expanded, setExpanded] = useState(false);

  const getUrgencyColor = () => {
    const hoursAgo = (Date.now() - cart.abandonedAt.getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 4) return 'text-green-600';
    if (hoursAgo < 12) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">{cart.customer}</p>
            <p className="text-xs text-gray-500">{cart.phone}</p>
          </div>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {cart.items.length} item{cart.items.length > 1 ? 's' : ''}
          </button>
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
          ₦{cart.cartValue.toLocaleString()}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${getUrgencyColor()}`} />
            <span className={`text-sm font-medium ${getUrgencyColor()}`}>
              {cart.timeAbandoned}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <StatusBadge 
            reminderSent={cart.reminderSent} 
            discountApplied={cart.discountApplied} 
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendReminder(cart.id)}
              disabled={cart.reminderSent}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                cart.reminderSent
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title={cart.reminderSent ? 'Reminder already sent' : 'Send reminder'}
            >
              <Bell className="w-3 h-3" />
              Remind
            </button>
            <button
              onClick={() => onApplyDiscount(cart.id)}
              disabled={cart.discountApplied}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                cart.discountApplied
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
              title={cart.discountApplied ? 'Discount already applied' : 'Apply discount'}
            >
              <Tag className="w-3 h-3" />
              Discount
            </button>
          </div>
        </td>
      </tr>
      
      {/* Expanded Row - Items Detail */}
      {expanded && (
        <tr className="bg-blue-50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Cart Items:</p>
              {cart.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-white rounded px-3 py-2 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-gray-500">× {item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Main Abandoned Carts Page Component
const AbandonedCartsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const handleSendReminder = (cartId: number) => {
    const cart = mockAbandonedCarts.find(c => c.id === cartId);
    console.log('Sending reminder for cart:', cartId);
    if (cart) alert(`Reminder sent to ${cart.customer} via WhatsApp`);
  };

  const handleApplyDiscount = (cartId: number) => {
    const cart = mockAbandonedCarts.find(c => c.id === cartId);
    console.log('Applying discount for cart:', cartId);
    if (cart) alert(`10% discount code sent to ${cart.customer}`);
  };

  const filteredCarts = mockAbandonedCarts.filter(cart => {
    const matchesSearch = cart.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cart.phone.includes(searchTerm) ||
                         cart.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter === 'Reminder Sent') matchesStatus = cart.reminderSent;
    if (statusFilter === 'No Action') matchesStatus = !cart.reminderSent && !cart.discountApplied;
    if (statusFilter === 'Discount Applied') matchesStatus = cart.discountApplied;
    
    return matchesSearch && matchesStatus;
  });

  const totalCartValue = mockAbandonedCarts.reduce((sum, cart) => sum + cart.cartValue, 0);
  const remindersSent = mockAbandonedCarts.filter(c => c.reminderSent).length;
  const noAction = mockAbandonedCarts.filter(c => !c.reminderSent && !c.discountApplied).length;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Abandoned Carts</h1>
              <p className="text-gray-600">Recover lost sales and reduce drop-offs</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Total Carts</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockAbandonedCarts.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <p className="text-sm text-gray-600">Lost Revenue</p>
            </div>
            <p className="text-2xl font-bold text-red-600">₦{totalCartValue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Reminders Sent</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{remindersSent}</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">Needs Action</p>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{noAction}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, phone, or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="No Action">No Action</option>
                  <option value="Reminder Sent">Reminder Sent</option>
                  <option value="Discount Applied">Discount Applied</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Abandoned Carts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Cart Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Time Abandoned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCarts.length > 0 ? (
                  filteredCarts.map(cart => (
                    <CartRow
                      key={cart.id}
                      cart={cart}
                      onSendReminder={handleSendReminder}
                      onApplyDiscount={handleApplyDiscount}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No abandoned carts found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredCarts.length} of {mockAbandonedCarts.length} abandoned carts</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-200 rounded-full border border-yellow-300"></div>
              <span>No Action</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded-full border border-blue-300"></div>
              <span>Reminder Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-200 rounded-full border border-purple-300"></div>
              <span>Discount Applied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCartsPage;