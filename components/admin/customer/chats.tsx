"use client"

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Search, User, Tag, UserPlus, X, Bot, Users, ShoppingBag, Clock, Phone } from 'lucide-react';
import Chat from '@/Types/types';

const mockChats: Chat[] = [
  {
    id: 1,
    customer: 'John Doe',
    phone: '+234 801 234 5678',
    lastMessage: 'Thanks! When will it arrive?',
    timestamp: '2 min ago',
    unread: 2,
    tags: ['VIP', 'Active'],
    avatar: 'JD',
    status: 'online',
    orders: [
      { id: 'ORD-001', item: 'iPhone 13', amount: 450000, date: '2 days ago' },
      { id: 'ORD-015', item: 'AirPods Pro', amount: 89000, date: '1 week ago' }
    ]
  },
  {
    id: 2,
    customer: 'Sarah Williams',
    phone: '+234 802 345 6789',
    lastMessage: 'Do you have this in blue?',
    timestamp: '15 min ago',
    unread: 0,
    tags: ['New Customer'],
    avatar: 'SW',
    status: 'offline',
    orders: []
  },
  {
    id: 3,
    customer: 'Mike Johnson',
    phone: '+234 803 456 7890',
    lastMessage: 'I need to return this item',
    timestamp: '1 hour ago',
    unread: 1,
    tags: ['Issue'],
    avatar: 'MJ',
    status: 'online',
    orders: [
      { id: 'ORD-028', item: 'Nike Sneakers', amount: 35000, date: '3 days ago' }
    ]
  },
  {
    id: 4,
    customer: 'Grace Adeyemi',
    phone: '+234 804 567 8901',
    lastMessage: 'Can I get a discount?',
    timestamp: '3 hours ago',
    unread: 0,
    tags: ['Negotiating'],
    avatar: 'GA',
    status: 'offline',
    orders: [
      { id: 'ORD-042', item: 'Blender', amount: 25000, date: '1 week ago' },
      { id: 'ORD-033', item: 'Toaster', amount: 15000, date: '2 weeks ago' }
    ]
  },
  {
    id: 5,
    customer: 'David Brown',
    phone: '+234 805 678 9012',
    lastMessage: 'Perfect! I\'ll order now',
    timestamp: '5 hours ago',
    unread: 0,
    tags: ['VIP'],
    avatar: 'DB',
    status: 'offline',
    orders: [
      { id: 'ORD-055', item: 'Laptop', amount: 520000, date: '1 day ago' }
    ]
  },
  {
    id: 6,
    customer: 'Amina Hassan',
    phone: '+234 806 789 0123',
    lastMessage: 'Hello, is this available?',
    timestamp: '1 day ago',
    unread: 3,
    tags: ['New Customer'],
    avatar: 'AH',
    status: 'online',
    orders: []
  }
];

const mockMessages = {
  1: [
    { id: 1, sender: 'customer', text: 'Hi, I\'m interested in the iPhone 13', time: '10:30 AM', isBot: false },
    { id: 2, sender: 'admin', text: 'Hello! Yes, we have it in stock. Which color would you prefer?', time: '10:31 AM', isBot: false },
    { id: 3, sender: 'customer', text: 'Do you have it in black?', time: '10:32 AM', isBot: false },
    { id: 4, sender: 'admin', text: 'Yes, black is available. The price is ₦450,000. Would you like to place an order?', time: '10:33 AM', isBot: false },
    { id: 5, sender: 'customer', text: 'Yes please!', time: '10:35 AM', isBot: false },
    { id: 6, sender: 'admin', text: 'Great! I\'ll create an order for you now.', time: '10:36 AM', isBot: false },
    { id: 7, sender: 'customer', text: 'Thanks! When will it arrive?', time: '10:38 AM', isBot: false }
  ],
  2: [
    { id: 1, sender: 'customer', text: 'Hi there', time: '9:15 AM', isBot: false },
    { id: 2, sender: 'bot', text: 'Hello! Welcome to our store. How can I help you today?', time: '9:15 AM', isBot: true },
    { id: 3, sender: 'customer', text: 'Do you have this in blue?', time: '9:20 AM', isBot: false }
  ],
  3: [
    { id: 1, sender: 'customer', text: 'I need to return this item', time: '8:00 AM', isBot: false },
    { id: 2, sender: 'admin', text: 'I\'m sorry to hear that. Can you tell me what the issue is?', time: '8:05 AM', isBot: false }
  ]
};

type Message = { id: number; sender: 'customer' | 'admin' | 'bot'; text: string; time: string; isBot?: boolean };

type Chat = { id: number; customer: string; phone: string; lastMessage: string; timestamp: string; unread: number; tags: string[]; avatar: string; status: 'online' | 'offline'; orders: { id: string; item: string; amount: number; date: string }[] };

// TagBadge Component
type TagBadgeProps = { tag: string; onRemove?: (tag: string) => void };
const TagBadge: React.FC<TagBadgeProps> = ({ tag, onRemove }) => {
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vip':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'new customer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'issue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
      {tag}
      {onRemove && (
        <button onClick={() => onRemove(tag)} className="hover:opacity-70">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// ChatListItem Component
type ChatListItemProps = { chat: Chat; isActive: boolean; onClick: () => void };
const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {chat.avatar}
          </div>
          {chat.status === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{chat.customer}</h3>
            <span className="text-xs text-gray-500">{chat.timestamp}</span>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
          <div className="flex items-center gap-1 flex-wrap">
            {chat.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>

        {/* Unread Badge */}
        {chat.unread > 0 && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
              {chat.unread}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Message Bubble Component
type MessageBubbleProps = { message: Message };
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isCustomer = message.sender === 'customer';
  const isBot = message.isBot;

  const messageRef = useRef<HTMLDivElement | null>(null);
  const [highlight, setHighlight] = useState(false);

  const handleClick = () => {
    // Scroll the clicked message to the top of the messages viewport
    messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlight(true);
    setTimeout(() => setHighlight(false), 1400);
  };

  return (
    <div
      onClick={handleClick}
      ref={messageRef}
      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-4 cursor-pointer ${highlight ? 'ring-2 ring-blue-300 rounded-xl' : ''}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isCustomer ? 'order-1' : 'order-2'}`}>
        {isBot && (
          <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
            <Bot className="w-3 h-3" />
            <span>Bot</span>
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isCustomer
              ? 'bg-gray-100 text-gray-900'
              : isBot
              ? 'bg-purple-100 text-purple-900 border border-purple-200'
              : 'bg-blue-600 text-white'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
      </div>
    </div>
  );
};

// Main Chats Page Component
const ChatsPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<Chat>(mockChats[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  const filteredChats = mockChats.filter(chat =>
    chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.phone.includes(searchTerm) ||
    chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const messages = (mockMessages as Record<number, Message[]>)[activeChat.id] || [];

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Incremental loading + lightweight virtualization
  const [displayCount, setDisplayCount] = useState<number>(() => Math.min(30, messages.length));
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  useEffect(() => {
    // Reset view when switching chats
    setDisplayCount(Math.min(30, messages.length));
    setIsUserScrolledUp(false);
  }, [activeChat.id]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      endRef.current?.scrollIntoView({ behavior: 'auto' });
      return;
    }
    // Auto scroll to bottom only if the user hasn't scrolled up
    if (!isUserScrolledUp) {
      container.scrollTop = container.scrollHeight;
    }
  }, [activeChat.id, messages.length, displayCount, isUserScrolledUp]);

  type Order = { id: string; item: string; amount: number; date: string };
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const MAX_RENDER = 300; // cap DOM nodes for lightweight virtualization

  const handleLoadOlder = () => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingOlder) return;
    setIsLoadingOlder(true);
    const prevScrollHeight = container.scrollHeight;
    const toLoad = 30;
    setDisplayCount((prev) => Math.min(messages.length, prev + toLoad));
    // After DOM updates, preserve scroll position
    requestAnimationFrame(() => {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight;
      setIsLoadingOlder(false);
    });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    // If user scrolled to (near) top, load older messages
    if (container.scrollTop <= 10 && !isLoadingOlder && displayCount < messages.length) {
      handleLoadOlder();
    }
    const atBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 10;
    setIsUserScrolledUp(!atBottom);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      console.log('Adding tag:', newTag);
      alert(`Tag "${newTag}" added to ${activeChat.customer}`);
      setNewTag('');
      setShowTagModal(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    console.log('Removing tag:', tag);
    alert(`Tag "${tag}" removed from ${activeChat.customer}`);
  };

  const handleAssignChat = (admin: string) => {
    console.log('Assigning chat to:', admin);
    alert(`Chat assigned to ${admin}`);
    setShowAssignModal(false);
  };

  const handleBotHandoff = () => {
    console.log('Handing off from bot to human');
    alert('Chat handed off from bot to human agent');
  };

  return (
    <div className="min-h-screen p-8 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Chats</h1>
            <p className="text-sm text-gray-600">Manage WhatsApp conversations</p>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Chat List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat: any) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isActive={activeChat.id === chat.id}
                onClick={() => setActiveChat(chat)}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Active Chat */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {activeChat.avatar}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{activeChat.customer}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>{activeChat.phone}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm">Assign</span>
                </button>
                <button
                  onClick={() => setShowTagModal(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  <span className="text-sm">Tags</span>
                </button>
                <button
                  onClick={handleBotHandoff}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span className="text-sm">Bot → Human</span>
                </button>
              </div>
            </div>

            {/* Tags Display */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {activeChat.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
              ))}
            </div>
          </div>

          {/* Chat Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Messages */}
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 flex flex-col">
              <div className="flex-1 flex flex-col gap-4">
                {/* Loader / Load older control */}
                {(() => {
                  const total = messages.length;
                  const effectiveDisplay = Math.min(displayCount, MAX_RENDER);
                  const startIndex = Math.max(0, total - effectiveDisplay);
                  const visibleMessages = messages.slice(startIndex, total);
                  const hasMoreAbove = startIndex > 0;

                  return (
                    <>
                      {hasMoreAbove && (
                        <div className="text-center py-2">
                          <button
                            onClick={handleLoadOlder}
                            className="text-sm text-blue-600"
                          >
                            {isLoadingOlder ? 'Loading...' : 'Load older messages'}
                          </button>
                        </div>
                      )}

                      {visibleMessages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}

                      <div ref={endRef} />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right Sidebar - Order Context */}
            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Recent Orders
              </h3>
              <p className="text-xs text-gray-500 mb-4">Orders placed by this customer (most recent first). Click `View` to open order details.</p>

              {activeChat.orders.length > 0 ? (
                <div className="space-y-3">
                  {activeChat.orders.map((order) => (
                    <div key={order.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600">{order.id}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {order.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1">{order.item}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">₦{order.amount.toLocaleString()}</p>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs text-blue-600 hover:underline"
                          aria-label={`View order ${order.id}`}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No orders yet</p>
                </div>
              )}

              {/* Customer Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-semibold text-gray-900">{activeChat.orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Spent:</span>
                    <span className="font-semibold text-gray-900">
                      ₦{activeChat.orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${activeChat.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                      {activeChat.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Order Detail Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order {selectedOrder.id}</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.item}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Amount</span>
                    <span className="font-semibold">₦{selectedOrder.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Date</span>
                    <span>{selectedOrder.date}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Tag</h3>
            <input
              type="text"
              placeholder="Enter tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTag}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowTagModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Assign Chat</h3>
            <div className="space-y-2 mb-4">
              {['Admin 1', 'Admin 2', 'Admin 3'].map((admin) => (
                <button
                  key={admin}
                  onClick={() => handleAssignChat(admin)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {admin}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAssignModal(false)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsPage;