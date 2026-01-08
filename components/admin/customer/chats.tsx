// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   MessageSquare,
//   Search,
//   User,
//   Tag,
//   UserPlus,
//   X,
//   Bot,
//   Users,
//   ShoppingBag,
//   Clock,
//   Phone,
//   Video,
//   Shield,
//   AlertCircle,
//   FileText,
//   Zap,
//   Send,
//   Image as ImageIcon,
//   Paperclip,
//   Smile,
//   Check,
//   List,
//   UserCircle,
//   Mail,
//   Plus,
//   ArrowRight,
//   Filter
// } from 'lucide-react';
// import { authService } from '@/services/auth.service';
// import whatsappService, {
//   Conversation,
//   Message as WhatsAppMessage,
//   NewMessageData,
//   MessageStatusUpdateData,
//   ConversationUpdatedData,
//   UserTypingData,
//   SendChatMessageData,
//   ConversationFilters,
//   Customer
// } from '@/services/whatsapp.service';
// import VideoCallButton from '../video-call/VideoCallButton';

// // Define User type based on authService
// type User = {
//   id: string;
//   email: string;
//   role: string;
//   name?: string;
// };

// // Mock data for customers
// const mockCustomers: Customer[] = [
//   {
//     id: 'C001',
//     name: 'John Doe',
//     phone: '+2348012345678',
//     email: 'john@example.com',
//     tags: ['VIP', 'Active'],
//     totalOrders: 5,
//     totalSpent: 1250000,
//     lastOrderDate: '2024-01-15',
//     status: 'active',
//     joinedAt: '2023-06-01'
//   },
//   {
//     id: 'C002',
//     name: 'Sarah Williams',
//     phone: '+2348023456789',
//     email: 'sarah@example.com',
//     tags: ['New Customer'],
//     totalOrders: 1,
//     totalSpent: 45000,
//     lastOrderDate: '2024-01-10',
//     status: 'active',
//     joinedAt: '2024-01-01'
//   },
//   {
//     id: 'C003',
//     name: 'Mike Johnson',
//     phone: '+2348034567890',
//     email: 'mike@example.com',
//     tags: ['Issue', 'Return'],
//     totalOrders: 3,
//     totalSpent: 180000,
//     lastOrderDate: '2024-01-12',
//     status: 'active',
//     joinedAt: '2023-11-15'
//   },
//   {
//     id: 'C004',
//     name: 'Grace Adeyemi',
//     phone: '+2348045678901',
//     email: 'grace@example.com',
//     tags: ['Negotiating'],
//     totalOrders: 7,
//     totalSpent: 320000,
//     lastOrderDate: '2024-01-14',
//     status: 'active',
//     joinedAt: '2023-08-20'
//   },
//   {
//     id: 'C005',
//     name: 'David Brown',
//     phone: '+2348056789012',
//     email: 'david@example.com',
//     tags: ['VIP'],
//     totalOrders: 12,
//     totalSpent: 2850000,
//     lastOrderDate: '2024-01-16',
//     status: 'active',
//     joinedAt: '2022-12-01'
//   },
//   {
//     id: 'C006',
//     name: 'Amina Hassan',
//     phone: '+2348067890123',
//     email: 'amina@example.com',
//     tags: ['New Customer'],
//     totalOrders: 0,
//     totalSpent: 0,
//     lastOrderDate: null,
//     status: 'active',
//     joinedAt: '2024-01-18'
//   },
//   {
//     id: 'C007',
//     name: 'James Wilson',
//     phone: '+2348078901234',
//     email: 'james@example.com',
//     tags: ['Loyal'],
//     totalOrders: 8,
//     totalSpent: 950000,
//     lastOrderDate: '2024-01-13',
//     status: 'inactive',
//     joinedAt: '2023-03-15'
//   },
//   {
//     id: 'C008',
//     name: 'Maria Garcia',
//     phone: '+2348089012345',
//     email: 'maria@example.com',
//     tags: ['VIP', 'Premium'],
//     totalOrders: 15,
//     totalSpent: 4200000,
//     lastOrderDate: '2024-01-17',
//     status: 'active',
//     joinedAt: '2022-10-01'
//   }
// ];

// const mockConversations: Conversation[] = [
//   {
//     id: '1',
//     customerPhone: '+2348012345678',
//     customerName: 'John Doe',
//     lastMessage: 'Thanks! When will it arrive?',
//     lastMessageAt: new Date(Date.now() - 2 * 60000),
//     unreadCount: 2,
//     status: 'active',
//     tags: ['VIP', 'Active'],
//     assignedTo: 'admin1',
//     assignedAdmin: {
//       id: 'admin1',
//       name: 'Admin 1',
//       email: 'admin1@example.com'
//     }
//   },
//   {
//     id: '2',
//     customerPhone: '+2348023456789',
//     customerName: 'Sarah Williams',
//     lastMessage: 'Do you have this in blue?',
//     lastMessageAt: new Date(Date.now() - 15 * 60000),
//     unreadCount: 0,
//     status: 'active',
//     tags: ['New Customer'],
//     assignedTo: undefined
//   },
//   {
//     id: '3',
//     customerPhone: '+2348034567890',
//     customerName: 'Mike Johnson',
//     lastMessage: 'I need to return this item',
//     lastMessageAt: new Date(Date.now() - 60 * 60000),
//     unreadCount: 1,
//     status: 'active',
//     tags: ['Issue'],
//     assignedTo: 'admin2',
//     assignedAdmin: {
//       id: 'admin2',
//       name: 'Admin 2',
//       email: 'admin2@example.com'
//     }
//   }
// ];

// const mockMessages: Record<string, WhatsAppMessage[]> = {
//   '1': [
//     { id: '1', sender: 'customer', text: 'Hi, I\'m interested in the iPhone 13', time: '10:30', timestamp: '2024-01-01T10:30:00Z', isBot: false },
//     { id: '2', sender: 'admin', text: 'Hello! Yes, we have it in stock. Which color would you prefer?', time: '10:31', timestamp: '2024-01-01T10:31:00Z', isBot: false },
//     { id: '3', sender: 'customer', text: 'Do you have it in black?', time: '10:32', timestamp: '2024-01-01T10:32:00Z', isBot: false },
//     { id: '4', sender: 'admin', text: 'Yes, black is available. The price is ₦450,000. Would you like to place an order?', time: '10:33', timestamp: '2024-01-01T10:33:00Z', isBot: false },
//     { id: '5', sender: 'customer', text: 'Yes please!', time: '10:35', timestamp: '2024-01-01T10:35:00Z', isBot: false },
//     { id: '6', sender: 'admin', text: 'Great! I\'ll create an order for you now.', time: '10:36', timestamp: '2024-01-01T10:36:00Z', isBot: false },
//     { id: '7', sender: 'customer', text: 'Thanks! When will it arrive?', time: '10:38', timestamp: '2024-01-01T10:38:00Z', isBot: false }
//   ],
//   '2': [
//     { id: '1', sender: 'customer', text: 'Hi there', time: '09:15', timestamp: '2024-01-01T09:15:00Z', isBot: false },
//     { id: '2', sender: 'bot', text: 'Hello! Welcome to our store. How can I help you today?', time: '09:15', timestamp: '2024-01-01T09:15:00Z', isBot: true },
//     { id: '3', sender: 'customer', text: 'Do you have this in blue?', time: '09:20', timestamp: '2024-01-01T09:20:00Z', isBot: false }
//   ],
//   '3': [
//     { id: '1', sender: 'customer', text: 'I need to return this item', time: '08:00', timestamp: '2024-01-01T08:00:00Z', isBot: false },
//     { id: '2', sender: 'admin', text: 'I\'m sorry to hear that. Can you tell me what the issue is?', time: '08:05', timestamp: '2024-01-01T08:05:00Z', isBot: false },
//     { id: '3', sender: 'admin', text: 'For complex returns, would you like to start a video call? We can do screen sharing to help resolve this faster.', time: '08:07', timestamp: '2024-01-01T08:07:00Z', isBot: false }
//   ]
// };

// const mockOrders = {
//   '+2348012345678': [
//     { id: 'ORD-001', item: 'iPhone 13', amount: 450000, date: '2 days ago' },
//     { id: 'ORD-015', item: 'AirPods Pro', amount: 89000, date: '1 week ago' }
//   ],
//   '+2348034567890': [
//     { id: 'ORD-028', item: 'Nike Sneakers', amount: 35000, date: '3 days ago' }
//   ],
//   '+2348045678901': [
//     { id: 'ORD-042', item: 'Blender', amount: 25000, date: '1 week ago' },
//     { id: 'ORD-033', item: 'Toaster', amount: 15000, date: '2 weeks ago' }
//   ],
//   '+2348056789012': [
//     { id: 'ORD-055', item: 'Laptop', amount: 520000, date: '1 day ago' }
//   ]
// };

// // TagBadge Component
// type TagBadgeProps = { tag: string; onRemove?: (tag: string) => void };
// const TagBadge: React.FC<TagBadgeProps> = ({ tag, onRemove }) => {
//   const getTagColor = (tag: string) => {
//     switch (tag.toLowerCase()) {
//       case 'vip':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'active':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'new customer':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'issue':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'negotiating':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'video-enabled':
//         return 'bg-indigo-100 text-indigo-800 border-indigo-200';
//       case 'resolved':
//         return 'bg-emerald-100 text-emerald-800 border-emerald-200';
//       case 'archived':
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//       case 'premium':
//         return 'bg-amber-100 text-amber-800 border-amber-200';
//       case 'loyal':
//         return 'bg-pink-100 text-pink-800 border-pink-200';
//       case 'return':
//         return 'bg-orange-100 text-orange-800 border-orange-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
//       {tag === 'video-enabled' && <Video className="w-3 h-3" />}
//       {tag}
//       {onRemove && (
//         <button onClick={() => onRemove(tag)} className="hover:opacity-70">
//           <X className="w-3 h-3" />
//         </button>
//       )}
//     </span>
//   );
// };

// // Customer List Item Component
// type CustomerListItemProps = { 
//   customer: Customer; 
//   isActive: boolean; 
//   onClick: () => void;
//   hasActiveChat: boolean;
// };
// const CustomerListItem: React.FC<CustomerListItemProps> = ({ customer, isActive, onClick, hasActiveChat }) => {
//   const getInitials = (name: string) => {
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-green-500';
//       case 'inactive': return 'bg-gray-400';
//       default: return 'bg-gray-400';
//     }
//   };

//   return (
//     <div
//       onClick={onClick}
//       className={`p-3 border-b border-gray-200 cursor-pointer transition-all duration-200 ${
//         isActive
//           ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm'
//           : 'hover:bg-gray-50 hover:shadow-sm'
//       }`}
//     >
//       <div className="flex items-start gap-3">
//         {/* Avatar */}
//         <div className="relative">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
//             {getInitials(customer.name)}
//           </div>
//           <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(customer.status)} border-2 border-white rounded-full shadow-sm`}></div>
//           {hasActiveChat && (
//             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-sm"></div>
//           )}
//         </div>

//         {/* Customer Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1">
//               {customer.name}
//               {customer.tags.includes('VIP') && (
//                 <span className="text-yellow-500">
//                   <Shield className="w-3 h-3" />
//                 </span>
//               )}
//             </h3>
//             {customer.totalOrders > 0 && (
//               <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
//                 {customer.totalOrders} order{customer.totalOrders > 1 ? 's' : ''}
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
//             <Phone className="w-3 h-3" />
//             <span className="truncate">{whatsappService.maskPhoneNumber(customer.phone)}</span>
//           </div>

//           <div className="flex items-center gap-1 flex-wrap">
//             {customer.tags.slice(0, 2).map((tag) => (
//               <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
//                 {tag}
//               </span>
//             ))}
//             {customer.tags.length > 2 && (
//               <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
//             )}
//           </div>

//           {customer.totalOrders > 0 && (
//             <div className="mt-2 pt-2 border-t border-gray-100">
//               <div className="flex items-center justify-between text-xs">
//                 <span className="text-gray-600">Total spent:</span>
//                 <span className="font-semibold text-gray-900">
//                   ₦{customer.totalSpent.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ChatListItem Component
// type ChatListItemProps = { conversation: Conversation; isActive: boolean; onClick: () => void };
// const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, isActive, onClick }) => {
//   const formatTime = (date: Date) => {
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     if (minutes < 1) return 'just now';
//     if (minutes < 60) return `${minutes}m ago`;
//     if (hours < 24) return `${hours}h ago`;
//     if (days < 7) return `${days}d ago`;
//     return date.toLocaleDateString();
//   };

//   const getInitials = (name?: string) => {
//     if (!name) return 'C';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//   };

//   const phoneOrders = mockOrders[conversation.customerPhone as keyof typeof mockOrders] || [];
//   const hasOrders = phoneOrders.length > 0;

//   return (
//     <div
//       onClick={onClick}
//       className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${isActive
//           ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm'
//           : 'hover:bg-gray-50 hover:shadow-sm'
//         }`}
//     >
//       <div className="flex items-start gap-3">
//         {/* Avatar */}
//         <div className="relative">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
//             {getInitials(conversation.customerName)}
//           </div>
//           {conversation.status === 'active' && (
//             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
//           )}
//           {conversation.tags.includes('Issue') && (
//             <div className="absolute -top-1 -right-1">
//               <AlertCircle className="w-4 h-4 text-red-500" />
//             </div>
//           )}
//         </div>

//         {/* Chat Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="font-semibold text-gray-900 truncate flex items-center gap-1">
//               {conversation.customerName || 'Customer'}
//               {conversation.tags.includes('VIP') && (
//                 <span className="text-yellow-500">
//                   <Shield className="w-3 h-3" />
//                 </span>
//               )}
//             </h3>
//             <span className="text-xs text-gray-500 flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               {formatTime(new Date(conversation.lastMessageAt))}
//             </span>
//           </div>
//           <p className="text-sm text-gray-600 truncate mb-2">
//             {conversation.lastMessage || 'No messages yet'}
//           </p>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-1 flex-wrap">
//               {conversation.tags.map((tag) => (
//                 <TagBadge key={tag} tag={tag} />
//               ))}
//               {conversation.tags.includes('Issue') && hasOrders && (
//                 <TagBadge tag="video-enabled" />
//               )}
//             </div>
//             {conversation.unreadCount > 0 && (
//               <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
//                 {conversation.unreadCount}
//               </span>
//             )}
//           </div>
//           {conversation.assignedAdmin && (
//             <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
//               <User className="w-3 h-3" />
//               <span>Assigned to {conversation.assignedAdmin.name}</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Message Bubble Component
// type MessageBubbleProps = { message: WhatsAppMessage; isActiveUser: boolean };
// const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isActiveUser }) => {
//   const isCustomer = message.sender === 'customer';
//   const isBot = message.isBot;
//   const isAdmin = message.sender === 'admin';
//   const showVideoCallHint = message.text?.toLowerCase().includes('video call') || 
//     message.text?.toLowerCase().includes('screen sharing');

//   const messageRef = useRef<HTMLDivElement | null>(null);
//   const [highlight, setHighlight] = useState(false);

//   const handleClick = () => {
//     messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     setHighlight(true);
//     setTimeout(() => setHighlight(false), 1400);
//   };

//   const formatTime = (time: string) => {
//     try {
//       const date = new Date(time);
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     } catch {
//       return time;
//     }
//   };

//   return (
//     <div
//       onClick={handleClick}
//       ref={messageRef}
//       className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-4 cursor-pointer ${highlight ? 'ring-2 ring-blue-300 rounded-xl' : ''}`}
//     >
//       <div className={`max-w-xs lg:max-w-md ${isCustomer ? 'order-1' : 'order-2'}`}>
//         {isBot && (
//           <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
//             <Bot className="w-3 h-3" />
//             <span>Auto-bot</span>
//           </div>
//         )}
//         {isAdmin && isActiveUser && (
//           <div className="flex items-center gap-1 mb-1 text-xs text-blue-500">
//             <User className="w-3 h-3" />
//             <span>You</span>
//           </div>
//         )}
//         <div
//           className={`px-4 py-2 rounded-2xl relative ${isCustomer
//               ? 'bg-gray-100 text-gray-900'
//               : isBot
//                 ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border border-purple-200'
//                 : showVideoCallHint
//                   ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border border-blue-200'
//                   : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
//             }`}
//         >
//           {showVideoCallHint && (
//             <div className="absolute -top-2 -right-2">
//               <Video className="w-5 h-5 text-blue-500 bg-white rounded-full p-1 shadow-md" />
//             </div>
//           )}
//           <p className="text-sm">{message.text}</p>
//           {showVideoCallHint && (
//             <div className="mt-2 pt-2 border-t border-blue-200 border-dashed">
//               <p className="text-xs text-blue-700 flex items-center gap-1">
//                 <Zap className="w-3 h-3" />
//                 Fast resolution available
//               </p>
//             </div>
//           )}
//         </div>
//         <p className="text-xs text-gray-500 mt-1 px-2">{formatTime(message.timestamp)}</p>
//       </div>
//     </div>
//   );
// };

// // Quick Action Bar Component
// type QuickActionBarProps = { 
//   conversation: Conversation; 
//   onVideoCall: () => void;
//   onAssign: () => void;
//   onAddTag: () => void;
// };
// const QuickActionBar: React.FC<QuickActionBarProps> = ({ conversation, onVideoCall, onAssign, onAddTag }) => {
//   const phoneOrders = mockOrders[conversation.customerPhone as keyof typeof mockOrders] || [];
//   const hasOrders = phoneOrders.length > 0;
//   const isIssue = conversation.tags.includes('Issue');
//   const isAssigned = !!conversation.assignedTo;

//   return (
//     <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-200 px-4 py-3">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <div className="flex items-center gap-2">
//             <span className={`w-2 h-2 rounded-full ${conversation.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
//             <span className="font-medium capitalize">{conversation.status}</span>
//           </div>
//           {hasOrders && (
//             <>
//               <span className="text-gray-400">•</span>
//               <span className="flex items-center gap-1">
//                 <ShoppingBag className="w-3 h-3" />
//                 {phoneOrders.length} order{phoneOrders.length > 1 ? 's' : ''}
//               </span>
//             </>
//           )}
//           {isAssigned && conversation.assignedAdmin && (
//             <>
//               <span className="text-gray-400">•</span>
//               <span className="flex items-center gap-1 text-blue-600">
//                 <User className="w-3 h-3" />
//                 {conversation.assignedAdmin.name}
//               </span>
//             </>
//           )}
//         </div>

//         <div className="flex items-center gap-2">
//           {isIssue && (
//             <button
//               onClick={onVideoCall}
//               className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
//             >
//               <Video className="w-4 h-4" />
//               <span className="text-sm font-medium">Quick Resolution</span>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Tab Navigation Component
// type TabType = 'conversations' | 'customers';
// interface TabNavigationProps {
//   activeTab: TabType;
//   onTabChange: (tab: TabType) => void;
//   unreadCount: number;
//   customerCount: number;
// }
// const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, unreadCount, customerCount }) => {
//   return (
//     <div className="flex border-b border-gray-200 bg-white">
//       <button
//         onClick={() => onTabChange('conversations')}
//         className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
//           activeTab === 'conversations'
//             ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
//             : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//         }`}
//       >
//         <MessageSquare className="w-4 h-4" />
//         Conversations
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>
//       <button
//         onClick={() => onTabChange('customers')}
//         className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
//           activeTab === 'customers'
//             ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
//             : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//         }`}
//       >
//         <Users className="w-4 h-4" />
//         Customers
//         <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
//           {customerCount}
//         </span>
//       </button>
//     </div>
//   );
// };

// // Main Chats Page Component
// const ChatsPage: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
//   const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
//   const [activeTab, setActiveTab] = useState<TabType>('conversations');
//   const [activeConversation, setActiveConversation] = useState<Conversation>(mockConversations[0]);
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [customerSearchTerm, setCustomerSearchTerm] = useState('');
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Modal states
//   const [showTagModal, setShowTagModal] = useState(false);
//   const [newTag, setNewTag] = useState('');
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [showNewChatModal, setShowNewChatModal] = useState(false);
//   const [newChatPhone, setNewChatPhone] = useState('');
//   const [newChatMessage, setNewChatMessage] = useState('');

//   // Message loading
//   const messagesContainerRef = useRef<HTMLDivElement | null>(null);
//   const endRef = useRef<HTMLDivElement | null>(null);
//   const [displayCount, setDisplayCount] = useState(30);
//   const [isLoadingOlder, setIsLoadingOlder] = useState(false);
//   const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

//   // Order state
//   type Order = { id: string; item: string; amount: number; date: string };
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const phoneOrders = mockOrders[activeConversation.customerPhone as keyof typeof mockOrders] || [];

//   // Calculate unread count
//   const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

//   // Filter conversations and customers
//   const filteredConversations = conversations.filter(conv =>
//     (conv.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//     conv.customerPhone.includes(searchTerm) ||
//     conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     conv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const filteredCustomers = customers.filter(customer =>
//     customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
//     customer.phone.includes(customerSearchTerm) ||
//     customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
//     customer.tags.some(tag => tag.toLowerCase().includes(customerSearchTerm.toLowerCase()))
//   );

//   // Check if customer has active conversation
//   const hasActiveConversation = (customerPhone: string) => {
//     return conversations.some(conv => conv.customerPhone === customerPhone);
//   };

//   // Initialize user from auth service
//   useEffect(() => {
//     const currentUser = authService.getUser();
//     if (currentUser) {
//       setUser(currentUser);
//     } else {
//       // Redirect to login if not authenticated
//       window.location.href = '/login';
//     }
//   }, []);

//   // Initialize socket connection
//   useEffect(() => {
//     if (user?.id) {
//       whatsappService.connectSocket(user.id, user.role);
      
//       // Setup real-time updates
//       const cleanup = whatsappService.setupRealTimeUpdates(
//         handleNewMessage,
//         handleMessageStatusUpdate,
//         handleConversationUpdated,
//         handleUserTyping
//       );

//       return () => {
//         cleanup();
//         whatsappService.disconnectSocket();
//       };
//     }
//   }, [user?.id]);

//   // Load conversations and customers
//   useEffect(() => {
//     loadConversations();
//     loadCustomers();
//   }, []);

//   // Load messages when conversation changes
//   useEffect(() => {
//     if (activeConversation.id) {
//       loadMessages(activeConversation.id);
//       whatsappService.subscribeToConversation(activeConversation.id);
//     }
//   }, [activeConversation.id]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;
    
//     if (!isUserScrolledUp) {
//       container.scrollTop = container.scrollHeight;
//     }
//   }, [messages.length, displayCount, isUserScrolledUp]);

//   const loadConversations = async () => {
//     try {
//       setLoading(true);
//       const filters: ConversationFilters = {
//         status: 'active',
//         page: 1,
//         limit: 50
//       };
      
//       const response = await whatsappService.getConversations(filters);
//       if (response.success) {
//         setConversations(response.data);
//       } else {
//         // Use mock data for development
//         setConversations(mockConversations);
//       }
//     } catch (err) {
//       console.error('Error loading conversations:', err);
//       setError('Failed to load conversations');
//       setConversations(mockConversations);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCustomers = async () => {
//     try {
//       // In a real app, you would fetch customers from an API
//       // For now, using mock data
//       setCustomers(mockCustomers);
//     } catch (err) {
//       console.error('Error loading customers:', err);
//       setError('Failed to load customers');
//       setCustomers(mockCustomers);
//     }
//   };

//   const loadMessages = async (conversationId: string) => {
//     try {
//       const response = await whatsappService.getMessages(conversationId, 50);
//       if (response.success) {
//         setMessages(response.data);
//         setDisplayCount(Math.min(30, response.data.length));
//       } else {
//         // Use mock data for development
//         setMessages(mockMessages[conversationId as keyof typeof mockMessages] || []);
//       }
//     } catch (err) {
//       console.error('Error loading messages:', err);
//       setMessages(mockMessages[conversationId as keyof typeof mockMessages] || []);
//     }
//   };

//   // Socket event handlers
//   const handleNewMessage = useCallback((data: NewMessageData) => {
//     if (data.customerPhone === activeConversation.customerPhone) {
//       const newMessage: WhatsAppMessage = {
//         ...data.message,
//         timestamp: data.timestamp,
//         time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
//       setMessages(prev => [...prev, newMessage]);
      
//       setConversations(prev => prev.map(conv => 
//         conv.customerPhone === data.customerPhone 
//           ? { 
//               ...conv, 
//               lastMessage: data.message.text,
//               lastMessageAt: new Date(data.timestamp),
//               unreadCount: conv.unreadCount + (conv.id === activeConversation.id ? 0 : 1)
//             }
//           : conv
//       ));
//     }
//   }, [activeConversation.customerPhone, activeConversation.id]);

//   const handleMessageStatusUpdate = useCallback((data: MessageStatusUpdateData) => {
//     if (messages.some(msg => msg.id === data.messageId)) {
//       setMessages(prev => prev.map(msg => 
//         msg.id === data.messageId 
//           ? { ...msg, status: data.status }
//           : msg
//       ));
//     }
//   }, [messages]);

//   const handleConversationUpdated = useCallback((data: ConversationUpdatedData) => {
//     setConversations(prev => prev.map(conv => 
//       conv.id === data.conversationId
//         ? { ...conv, ...data.updates }
//         : conv
//     ));

//     if (activeConversation.id === data.conversationId) {
//       setActiveConversation(prev => ({ ...prev, ...data.updates }));
//     }
//   }, [activeConversation.id]);

//   const handleUserTyping = useCallback((data: UserTypingData) => {
//     if (data.conversationId === activeConversation.id) {
//       setIsTyping(data.isTyping);
//     }
//   }, [activeConversation.id]);

//   // Message sending
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !user?.id) return;

//     const messageData: SendChatMessageData = {
//       conversationId: activeConversation.id,
//       customerPhone: activeConversation.customerPhone,
//       message: newMessage,
//       type: 'text',
//       adminId: user.id
//     };

//     try {
//       const response = await whatsappService.sendChatMessage(messageData);
//       if (response.success) {
//         const tempMessage: WhatsAppMessage = {
//           id: response.data.messageId,
//           sender: 'admin',
//           text: newMessage,
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           timestamp: response.data.timestamp.toISOString(),
//           isBot: false,
//           status: 'sent'
//         };
        
//         setMessages(prev => [...prev, tempMessage]);
//         setNewMessage('');
        
//         setActiveConversation(prev => ({
//           ...prev,
//           lastMessage: newMessage,
//           lastMessageAt: new Date()
//         }));

//         setConversations(prev => prev.map(conv => 
//           conv.id === activeConversation.id
//             ? { 
//                 ...conv, 
//                 lastMessage: newMessage,
//                 lastMessageAt: new Date()
//               }
//             : conv
//         ));
//       }
//     } catch (err) {
//       console.error('Error sending message:', err);
//       setError('Failed to send message');
//     }
//   };

//   // Start new conversation with customer
//   const handleStartConversation = async (customer: Customer) => {
//     try {
//       // Check if conversation already exists
//       const existingConv = conversations.find(conv => conv.customerPhone === customer.phone);
      
//       if (existingConv) {
//         // Switch to existing conversation
//         setActiveConversation(existingConv);
//         setActiveTab('conversations');
//       } else {
//         // Start new conversation
//         const response = await whatsappService.startConversation(customer.phone);
//         if (response.success) {
//           const newConversation: Conversation = {
//             id: response.data.conversationId,
//             customerPhone: customer.phone,
//             customerName: customer.name,
//             lastMessage: '',
//             lastMessageAt: new Date(),
//             unreadCount: 0,
//             status: 'active',
//             tags: [...customer.tags],
//             assignedTo: user?.id
//           };
          
//           setConversations(prev => [newConversation, ...prev]);
//           setActiveConversation(newConversation);
//           setActiveTab('conversations');
          
//           setSelectedCustomer(null);
//         }
//       }
//     } catch (err) {
//       console.error('Error starting conversation:', err);
//       setError('Failed to start conversation');
//     }
//   };

//   // Start new chat with phone number
//   const handleNewChat = async () => {
//     if (!newChatPhone.trim()) {
//       setError('Please enter a phone number');
//       return;
//     }

//     try {
//       // Format phone number (add + if not present)
//       const formattedPhone = newChatPhone.startsWith('+') ? newChatPhone : `+${newChatPhone}`;
      
//       const response = await whatsappService.startConversation(formattedPhone);
//       if (response.success) {
//         const newConversation: Conversation = {
//           id: response.data.conversationId,
//           customerPhone: formattedPhone,
//           customerName: '', // Will be updated when customer responds
//           lastMessage: newChatMessage,
//           lastMessageAt: new Date(),
//           unreadCount: 0,
//           status: 'active',
//           tags: ['New Chat'],
//           assignedTo: user?.id
//         };
        
//         // Send initial message if provided
//         if (newChatMessage.trim() && user?.id) {
//           const messageData: SendChatMessageData = {
//             conversationId: response.data.conversationId,
//             customerPhone: formattedPhone,
//             message: newChatMessage,
//             type: 'text',
//             adminId: user.id
//           };
//           await whatsappService.sendChatMessage(messageData);
//         }
        
//         setConversations(prev => [newConversation, ...prev]);
//         setActiveConversation(newConversation);
//         setActiveTab('conversations');
        
//         // Reset form
//         setNewChatPhone('');
//         setNewChatMessage('');
//         setShowNewChatModal(false);
//       }
//     } catch (err) {
//       console.error('Error creating new chat:', err);
//       setError('Failed to create new chat');
//     }
//   };

//   // Conversation actions
//   const handleAssignConversation = async (adminId: string) => {
//     try {
//       const response = await whatsappService.assignConversation(activeConversation.id, adminId);
//       if (response.success) {
//         setActiveConversation(response.data);
//         setConversations(prev => prev.map(conv => 
//           conv.id === activeConversation.id ? response.data : conv
//         ));
//       }
//       setShowAssignModal(false);
//     } catch (err) {
//       console.error('Error assigning conversation:', err);
//       setError('Failed to assign conversation');
//     }
//   };

//   const handleAddTag = async () => {
//     if (!newTag.trim()) return;

//     try {
//       const updatedTags = [...activeConversation.tags, newTag];
//       const response = await whatsappService.updateTags(activeConversation.id, updatedTags);
//       if (response.success) {
//         setActiveConversation(response.data);
//         setConversations(prev => prev.map(conv => 
//           conv.id === activeConversation.id ? response.data : conv
//         ));
//       }
//       setNewTag('');
//       setShowTagModal(false);
//     } catch (err) {
//       console.error('Error adding tag:', err);
//       setError('Failed to add tag');
//     }
//   };

//   const handleRemoveTag = async (tag: string) => {
//     try {
//       const updatedTags = activeConversation.tags.filter(t => t !== tag);
//       const response = await whatsappService.updateTags(activeConversation.id, updatedTags);
//       if (response.success) {
//         setActiveConversation(response.data);
//         setConversations(prev => prev.map(conv => 
//           conv.id === activeConversation.id ? response.data : conv
//         ));
//       }
//     } catch (err) {
//       console.error('Error removing tag:', err);
//       setError('Failed to remove tag');
//     }
//   };

//   const handleMarkAsResolved = async () => {
//     try {
//       const response = await whatsappService.markAsResolved(activeConversation.id);
//       if (response.success) {
//         setActiveConversation(response.data);
//         setConversations(prev => prev.map(conv => 
//           conv.id === activeConversation.id ? response.data : conv
//         ));
//       }
//     } catch (err) {
//       console.error('Error marking as resolved:', err);
//       setError('Failed to mark as resolved');
//     }
//   };

//   // Typing indicator
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewMessage(e.target.value);
    
//     if (e.target.value.trim() && !isTyping) {
//       whatsappService.sendTypingStatus(activeConversation.id, true);
//       setIsTyping(true);
//     } else if (!e.target.value.trim() && isTyping) {
//       whatsappService.sendTypingStatus(activeConversation.id, false);
//       setIsTyping(false);
//     }
//   };

//   // Load older messages
//   const handleLoadOlder = () => {
//     if (isLoadingOlder || displayCount >= messages.length) return;
    
//     setIsLoadingOlder(true);
//     const toLoad = 30;
//     setDisplayCount(prev => Math.min(messages.length, prev + toLoad));
//     setIsLoadingOlder(false);
//   };

//   const handleScroll = () => {
//     const container = messagesContainerRef.current;
//     if (!container) return;
    
//     if (container.scrollTop <= 10 && !isLoadingOlder && displayCount < messages.length) {
//       handleLoadOlder();
//     }
    
//     const atBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 10;
//     setIsUserScrolledUp(!atBottom);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const getCallType = () => {
//     if (activeConversation.tags.includes('Issue')) return 'dispute';
//     if (activeConversation.tags.includes('Negotiating')) return 'support';
//     return 'consultation';
//   };

//   const getAdminOptions = () => {
//     return ['admin1', 'admin2', 'admin3'].map(id => ({
//       id,
//       name: id === 'admin1' ? 'Admin 1' : id === 'admin2' ? 'Admin 2' : 'Admin 3'
//     }));
//   };

//   const handleLogout = () => {
//     authService.logout();
//   };

//   // Show loading while checking authentication
//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
//               <MessageSquare className="w-7 h-7 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">WhatsApp Support</h1>
//               <p className="text-sm text-gray-600">Real-time conversations & video support</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
//               <div className={`w-2 h-2 rounded-full ${whatsappService.isSocketConnected() ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//               <span className="text-sm font-medium text-gray-700">
//                 {whatsappService.isSocketConnected() ? 'Connected' : 'Disconnected'}
//               </span>
//             </div>
//             <div className="text-sm text-gray-600">
//               {user?.email || 'Admin'}
//             </div>
//             <button
//               onClick={handleLogout}
//               className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Left Column - Tabs with Conversations/Customers */}
//         <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-inner">
//           {/* Tab Navigation */}
//           <TabNavigation
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//             unreadCount={totalUnread}
//             customerCount={customers.length}
//           />

//           {/* Search Bar */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder={
//                   activeTab === 'conversations' 
//                     ? 'Search conversations...' 
//                     : 'Search customers...'
//                 }
//                 value={activeTab === 'conversations' ? searchTerm : customerSearchTerm}
//                 onChange={(e) => activeTab === 'conversations' 
//                   ? setSearchTerm(e.target.value) 
//                   : setCustomerSearchTerm(e.target.value)
//                 }
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
//               />
//             </div>
//           </div>

//           {/* New Chat Button for Conversations Tab */}
//           {activeTab === 'conversations' && (
//             <div className="px-4 py-3 border-b border-gray-200">
//               <button
//                 onClick={() => setShowNewChatModal(true)}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
//               >
//                 <Plus className="w-4 h-4" />
//                 New Chat
//               </button>
//             </div>
//           )}

//           {/* Content Area */}
//           <div className="flex-1 overflow-y-auto">
//             {loading ? (
//               <div className="flex items-center justify-center h-32">
//                 <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//               </div>
//             ) : activeTab === 'conversations' ? (
//               filteredConversations.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                   <p>No conversations found</p>
//                   <p className="text-sm text-gray-400 mt-1">Start a new chat to begin</p>
//                 </div>
//               ) : (
//                 filteredConversations.map((conv) => (
//                   <ChatListItem
//                     key={conv.id}
//                     conversation={conv}
//                     isActive={activeConversation.id === conv.id}
//                     onClick={() => {
//                       setActiveConversation(conv);
//                       setActiveTab('conversations');
//                     }}
//                   />
//                 ))
//               )
//             ) : (
//               // Customers Tab
//               filteredCustomers.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                   <p>No customers found</p>
//                 </div>
//               ) : (
//                 filteredCustomers.map((customer) => (
//                   <CustomerListItem
//                     key={customer.id}
//                     customer={customer}
//                     isActive={selectedCustomer?.id === customer.id}
//                     hasActiveChat={hasActiveConversation(customer.phone)}
//                     onClick={() => {
//                       setSelectedCustomer(customer);
//                       if (hasActiveConversation(customer.phone)) {
//                         const conv = conversations.find(c => c.customerPhone === customer.phone);
//                         if (conv) {
//                           setActiveConversation(conv);
//                           setActiveTab('conversations');
//                         }
//                       }
//                     }}
//                   />
//                 ))
//               )
//             )}
//           </div>

//           {/* Selected Customer Actions (Customers Tab) */}
//           {activeTab === 'customers' && selectedCustomer && (
//             <div className="p-4 border-t border-gray-200 bg-gray-50">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="font-medium text-gray-900">Selected Customer</h4>
//                 <button
//                   onClick={() => setSelectedCustomer(null)}
//                   className="text-sm text-gray-500 hover:text-gray-700"
//                 >
//                   Clear
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => handleStartConversation(selectedCustomer)}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
//                 >
//                   <MessageSquare className="w-4 h-4" />
//                   {hasActiveConversation(selectedCustomer.phone) ? 'Open Chat' : 'Start Chat'}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setNewChatPhone(selectedCustomer.phone);
//                     setShowNewChatModal(true);
//                   }}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
//                 >
//                   <Phone className="w-4 h-4" />
//                   Call Customer
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Column - Active Chat */}
//         <div className="flex-1 flex flex-col">
//           {activeTab === 'conversations' ? (
//             <>
//               {/* Chat Header */}
//               <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
//                         {activeConversation.customerName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'C'}
//                       </div>
//                       {activeConversation.status === 'active' && (
//                         <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
//                       )}
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <h2 className="font-bold text-gray-900 text-lg">
//                           {activeConversation.customerName || 'Customer'}
//                         </h2>
//                         {activeConversation.tags.includes('VIP') && (
//                           <span className="bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
//                             <Shield className="w-3 h-3" />
//                             VIP
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-3 text-sm text-gray-600">
//                         <span className="flex items-center gap-1">
//                           <Phone className="w-3.5 h-3.5" />
//                           {whatsappService.maskPhoneNumber(activeConversation.customerPhone)}
//                         </span>
//                         <span className="text-gray-300">•</span>
//                         <span className="capitalize">{activeConversation.status}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-3">
//                     <VideoCallButton
//                       callType={getCallType()}
//                       participantName={activeConversation.customerName || 'Customer'}
//                       participantRole="customer"
//                       size="md"
//                       showLabel={true}
//                       variant={activeConversation.tags.includes('Issue') ? 'danger' : 'primary'}
//                     />

//                     <button
//                       onClick={() => setShowAssignModal(true)}
//                       className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
//                     >
//                       <UserPlus className="w-4 h-4" />
//                       <span className="text-sm font-medium">Assign</span>
//                     </button>
//                     <button
//                       onClick={() => setShowTagModal(true)}
//                       className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
//                     >
//                       <Tag className="w-4 h-4" />
//                       <span className="text-sm font-medium">Tags</span>
//                     </button>
//                     {activeConversation.status === 'active' && (
//                       <button
//                         onClick={handleMarkAsResolved}
//                         className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
//                       >
//                         <Check className="w-4 h-4" />
//                         <span className="text-sm font-medium">Resolve</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Tags Display */}
//                 <div className="mt-3 flex items-center gap-2 flex-wrap">
//                   {activeConversation.tags.map((tag) => (
//                     <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
//                   ))}
//                   {activeConversation.tags.includes('Issue') && phoneOrders.length > 0 && (
//                     <TagBadge tag="video-enabled" />
//                   )}
//                 </div>
//               </div>

//               {/* Quick Action Bar */}
//               <QuickActionBar
//                 conversation={activeConversation}
//                 onVideoCall={() => {}}
//                 onAssign={() => setShowAssignModal(true)}
//                 onAddTag={() => setShowTagModal(true)}
//               />

//               {/* Messages Area */}
//               <div className="flex-1 flex overflow-hidden">
//                 {/* Messages */}
//                 <div 
//                   ref={messagesContainerRef} 
//                   onScroll={handleScroll} 
//                   className="flex-1 overflow-y-auto p-6 flex flex-col"
//                 >
//                   <div className="flex-1 flex flex-col gap-4">
//                     {(() => {
//                       const total = messages.length;
//                       const effectiveDisplay = Math.min(displayCount, 300);
//                       const startIndex = Math.max(0, total - effectiveDisplay);
//                       const visibleMessages = messages.slice(startIndex, total);
//                       const hasMoreAbove = startIndex > 0;

//                       return (
//                         <>
//                           {hasMoreAbove && (
//                             <div className="text-center py-4">
//                               <button
//                                 onClick={handleLoadOlder}
//                                 className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
//                                 disabled={isLoadingOlder}
//                               >
//                                 {isLoadingOlder ? (
//                                   <span className="flex items-center gap-2">
//                                     <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                                     Loading...
//                                   </span>
//                                 ) : 'Load older messages'}
//                               </button>
//                             </div>
//                           )}

//                           {visibleMessages.map((message) => (
//                             <MessageBubble 
//                               key={message.id} 
//                               message={message} 
//                               isActiveUser={message.sender === 'admin' && user?.id === activeConversation.assignedTo}
//                             />
//                           ))}

//                           {isTyping && (
//                             <div className="flex justify-start mb-4">
//                               <div className="max-w-xs lg:max-w-md">
//                                 <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-900">
//                                   <div className="flex gap-1">
//                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           <div ref={endRef} />
//                         </>
//                       );
//                     })()}
//                   </div>
//                 </div>

//                 {/* Right Sidebar - Order Context */}
//                 <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-inner">
//                   {/* Header */}
//                   <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//                     <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                       <ShoppingBag className="w-5 h-5 text-blue-600" />
//                       Customer Context
//                     </h3>
//                     <p className="text-xs text-gray-500 mt-1">Order history and customer insights</p>
//                   </div>

//                   {/* Order List */}
//                   <div className="flex-1 overflow-y-auto p-4">
//                     <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
//                       <span>Recent Orders</span>
//                       <span className="text-xs text-gray-500">{phoneOrders.length} total</span>
//                     </h4>

//                     {phoneOrders.length > 0 ? (
//                       <div className="space-y-3">
//                         {phoneOrders.map((order) => (
//                           <div
//                             key={order.id}
//                             onClick={() => setSelectedOrder(order)}
//                             className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
//                           >
//                             <div className="flex items-start justify-between mb-2">
//                               <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">{order.id}</span>
//                               <span className="text-xs text-gray-500 flex items-center gap-1">
//                                 <Clock className="w-3 h-3" />
//                                 {order.date}
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-900 font-medium mb-1 truncate">{order.item}</p>
//                             <div className="flex items-center justify-between">
//                               <p className="text-sm font-semibold text-gray-900">₦{order.amount.toLocaleString()}</p>
//                               <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">
//                                 View →
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 text-gray-500">
//                         <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                         <p className="text-sm">No orders yet</p>
//                         <p className="text-xs text-gray-400 mt-1">This customer hasn't placed any orders</p>
//                       </div>
//                     )}

//                     {/* Customer Stats */}
//                     {phoneOrders.length > 0 && (
//                       <div className="mt-6 pt-6 border-t border-gray-200">
//                         <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Insights</h4>
//                         <div className="space-y-3">
//                           <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
//                             <div className="flex justify-between items-center">
//                               <span className="text-sm text-gray-700">Total Spent</span>
//                               <span className="font-bold text-gray-900">
//                                 ₦{phoneOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
//                             <div className="flex justify-between items-center">
//                               <span className="text-sm text-gray-700">Order Count</span>
//                               <span className="font-bold text-gray-900">{phoneOrders.length}</span>
//                             </div>
//                           </div>

//                           <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
//                             <div className="flex justify-between items-center">
//                               <span className="text-sm text-gray-700">Avg. Order Value</span>
//                               <span className="font-bold text-gray-900">
//                                 ₦{Math.round(phoneOrders.reduce((sum, order) => sum + order.amount, 0) / phoneOrders.length).toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="flex-1 flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
//                     <div className="flex items-center gap-1 px-3 border-r border-gray-300">
//                       <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
//                         <Tag className="w-4 h-4 text-gray-500" />
//                       </button>
//                       <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
//                         <ImageIcon className="w-4 h-4 text-gray-500" />
//                       </button>
//                       <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
//                         <Paperclip className="w-4 h-4 text-gray-500" />
//                       </button>
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Type your message... (Press Enter to send)"
//                       value={newMessage}
//                       onChange={handleInputChange}
//                       onKeyPress={handleKeyPress}
//                       className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0"
//                     />
//                     <button className="p-2 hover:bg-gray-100 rounded transition-colors">
//                       <Smile className="w-5 h-5 text-gray-500" />
//                     </button>
//                   </div>
//                   <button
//                     onClick={sendMessage}
//                     disabled={!newMessage.trim() || loading}
//                     className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Send className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <div className="mt-2 flex items-center justify-between">
//                   <p className="text-xs text-gray-500">
//                     💡 Tip: Type "/video" to suggest a video call
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs text-green-600 flex items-center gap-1">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       WhatsApp connected
//                     </span>
//                     <span className="text-xs text-blue-600 flex items-center gap-1">
//                       <Video className="w-3 h-3" />
//                       Video enabled
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             // Customers Tab Main View
//             <div className="flex-1 flex items-center justify-center bg-gray-50">
//               <div className="text-center p-8 max-w-md">
//                 <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Directory</h3>
//                 <p className="text-gray-600 mb-6">
//                   {selectedCustomer 
//                     ? `Viewing details for ${selectedCustomer.name}. Click "Start Chat" to begin a conversation.`
//                     : 'Select a customer from the list to view details and start a conversation.'}
//                 </p>
//                 {!selectedCustomer && (
//                   <button
//                     onClick={() => setShowNewChatModal(true)}
//                     className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
//                   >
//                     <Plus className="w-5 h-5" />
//                     New Chat with Phone Number
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       {/* New Chat Modal */}
//       {showNewChatModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold">Start New Chat</h3>
//                 <p className="text-sm text-gray-600">Begin a conversation with a customer</p>
//               </div>
//               <button
//                 onClick={() => {
//                   setShowNewChatModal(false);
//                   setNewChatPhone('');
//                   setNewChatMessage('');
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {selectedCustomer && (
//               <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                 <div className="flex items-center gap-2">
//                   <UserCircle className="w-5 h-5 text-blue-600" />
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
//                     <p className="text-xs text-gray-600">{selectedCustomer.phone}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number *
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="tel"
//                     placeholder="+2348012345678"
//                     value={newChatPhone}
//                     onChange={(e) => setNewChatPhone(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Initial Message (Optional)
//                 </label>
//                 <textarea
//                   placeholder="Hello! How can I help you today?"
//                   value={newChatMessage}
//                   onChange={(e) => setNewChatMessage(e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 />
//               </div>
//             </div>

//             <div className="mt-6 flex gap-2">
//               <button
//                 onClick={handleNewChat}
//                 className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
//               >
//                 Start Chat
//               </button>
//               <button
//                 onClick={() => {
//                   setShowNewChatModal(false);
//                   setNewChatPhone('');
//                   setNewChatMessage('');
//                 }}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Tag Modal */}
//       {showTagModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h3 className="text-lg font-semibold mb-4">Add Tag</h3>
//             <input
//               type="text"
//               placeholder="Enter tag name..."
//               value={newTag}
//               onChange={(e) => setNewTag(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={handleAddTag}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Add
//               </button>
//               <button
//                 onClick={() => setShowTagModal(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assign Modal */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h3 className="text-lg font-semibold mb-4">Assign Chat</h3>
//             <div className="space-y-2 mb-4">
//               {getAdminOptions().map((admin) => (
//                 <button
//                   key={admin.id}
//                   onClick={() => handleAssignConversation(admin.id)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-2"
//                 >
//                   <User className="w-4 h-4" />
//                   {admin.name}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => setShowAssignModal(false)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Order Detail Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold">Order {selectedOrder.id}</h3>
//                 <p className="text-sm text-gray-600">{selectedOrder.item}</p>
//               </div>
//               <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Amount</span>
//                 <span className="font-semibold">₦{selectedOrder.amount.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>Date</span>
//                 <span>{selectedOrder.date}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Toast */}
//       {error && (
//         <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
//           <div className="flex items-center gap-2">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//             <p className="text-sm text-red-700">{error}</p>
//             <button onClick={() => setError(null)} className="ml-4 text-red-600 hover:text-red-800">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatsPage;

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  User,
  Tag,
  UserPlus,
  X,
  Bot,
  Users,
  ShoppingBag,
  Clock,
  Phone,
  Video,
  Shield,
  AlertCircle,
  FileText,
  Zap,
  Send,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Check,
  List,
  UserCircle,
  Mail,
  Plus,
  ArrowRight,
  Filter,
  RefreshCw,
  ShieldCheck,
  Building,
  Briefcase,
  Ban,
  Globe
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import whatsappService, {
  Conversation,
  Message as WhatsAppMessage,
  NewMessageData,
  MessageStatusUpdateData,
  ConversationUpdatedData,
  UserTypingData,
  SendChatMessageData,
  ConversationFilters,
  WhatsAppContact,
  ContactInfo,
  ContactSyncResult,
  MessageStats,
  ContactsOverview
} from '@/services/whatsapp.service';
import VideoCallButton from '../video-call/VideoCallButton';

// Define User type based on authService
type User = {
  id: string;
  email: string;
  role: string;
  name?: string;
};

// Define Customer type based on WhatsApp contact
type Customer = {
  id: string;
  wa_id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  status: 'active' | 'inactive';
  joinedAt: string;
  profile_name?: string;
  is_business?: boolean;
  business_name?: string;
  is_blocked?: boolean;
  last_seen?: string;
  messageStats?: MessageStats;
};

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
      case 'video-enabled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'premium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'loyal':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'return':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'business':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'whatsapp-registered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
      {tag === 'video-enabled' && <Video className="w-3 h-3" />}
      {tag === 'business' && <Building className="w-3 h-3" />}
      {tag === 'blocked' && <Ban className="w-3 h-3" />}
      {tag}
      {onRemove && (
        <button onClick={() => onRemove(tag)} className="hover:opacity-70">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

// Contact Status Badge Component
const ContactStatusBadge: React.FC<{ status: string; lastSeen?: string }> = ({ status, lastSeen }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      case 'blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (status === 'active' || status === 'online') return 'Online';
    if (status === 'away') return 'Away';
    if (status === 'offline') return 'Offline';
    if (status === 'blocked') return 'Blocked';
    return 'Unknown';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
      <span className="text-xs text-gray-600">{getStatusText()}</span>
      {lastSeen && (
        <span className="text-xs text-gray-500">• Last seen: {new Date(lastSeen).toLocaleDateString()}</span>
      )}
    </div>
  );
};

// Customer List Item Component
type CustomerListItemProps = { 
  customer: Customer; 
  isActive: boolean; 
  onClick: () => void;
  hasActiveChat: boolean;
  onBlock?: (phone: string) => void;
  onUnblock?: (phone: string) => void;
};
const CustomerListItem: React.FC<CustomerListItemProps> = ({ 
  customer, 
  isActive, 
  onClick, 
  hasActiveChat,
  onBlock,
  onUnblock
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-gray-200 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm'
          : 'hover:bg-gray-50 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {getInitials(customer.name)}
          </div>
          <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(customer.status)} border-2 border-white rounded-full shadow-sm`}></div>
          {hasActiveChat && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-sm"></div>
          )}
          {customer.is_business && (
            <div className="absolute -top-1 -left-1">
              <Briefcase className="w-4 h-4 text-teal-600 bg-white rounded-full p-1" />
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1">
              {customer.name}
              {customer.tags.includes('VIP') && (
                <span className="text-yellow-500">
                  <Shield className="w-3 h-3" />
                </span>
              )}
              {customer.is_business && (
                <span className="text-teal-500">
                  <Building className="w-3 h-3" />
                </span>
              )}
            </h3>
            {customer.totalOrders > 0 && (
              <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {customer.totalOrders} order{customer.totalOrders > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Phone className="w-3 h-3" />
            <span className="truncate">{whatsappService.maskPhoneNumber(customer.phone)}</span>
          </div>

          {/* Contact Status */}
          <div className="mb-2">
            <ContactStatusBadge 
              status={customer.is_blocked ? 'blocked' : 'active'} 
              lastSeen={customer.last_seen}
            />
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            {customer.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
                {tag}
              </span>
            ))}
            {customer.is_business && (
              <span className="text-xs px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded">
                Business
              </span>
            )}
            {customer.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
            )}
          </div>

          {customer.totalOrders > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Total spent:</span>
                <span className="font-semibold text-gray-900">
                  ₦{customer.totalSpent.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-2 flex gap-1">
            {customer.is_blocked ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnblock?.(customer.wa_id);
                }}
                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Unblock
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBlock?.(customer.wa_id);
                }}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Block
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Contacts Overview Card Component
const ContactsOverviewCard: React.FC<{ overview: ContactsOverview }> = ({ overview }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      {/* <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Contacts Overview
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="w-4 h-4" />
          {overview.uniqueCountries.length} countries
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700">Total Contacts</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{overview.totalContacts}</div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-3 rounded-lg border border-teal-100">
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-4 h-4 text-teal-600" />
            <span className="text-sm text-gray-700">Business</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{overview.businessContacts}</div>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-1">
            <Ban className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-700">Blocked</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{overview.blockedContacts}</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-700">Avg Msgs/Day</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{overview.messagesLast30Days.averagePerDay}</div>
        </div>
      </div> */}
      
      {/* <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700">Incoming Messages</span>
            <span className="text-sm font-medium text-green-700">
              {Math.round((overview.messagesLast30Days.incoming / overview.messagesLast30Days.total) * 100)}%
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">{overview.messagesLast30Days.incoming}</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-700">Outgoing Messages</span>
            <span className="text-sm font-medium text-blue-700">
              {Math.round((overview.messagesLast30Days.outgoing / overview.messagesLast30Days.total) * 100)}%
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">{overview.messagesLast30Days.outgoing}</div>
        </div>
      </div> */}
    </div>
  );
};

// ChatListItem Component (Remains the same as before)
type ChatListItemProps = { conversation: Conversation; isActive: boolean; onClick: () => void };
const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, isActive, onClick }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Mock orders for now - in a real app this would come from your order service
  const phoneOrders: any[] = [];
  const hasOrders = phoneOrders.length > 0;

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${isActive
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm'
          : 'hover:bg-gray-50 hover:shadow-sm'
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {getInitials(conversation.customerName)}
          </div>
          {conversation.status === 'active' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          )}
          {conversation.tags.includes('Issue') && (
            <div className="absolute -top-1 -right-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate flex items-center gap-1">
              {conversation.customerName || 'Customer'}
              {conversation.tags.includes('VIP') && (
                <span className="text-yellow-500">
                  <Shield className="w-3 h-3" />
                </span>
              )}
            </h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(new Date(conversation.lastMessageAt))}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">
            {conversation.lastMessage || 'No messages yet'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-wrap">
              {conversation.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
              {conversation.tags.includes('Issue') && hasOrders && (
                <TagBadge tag="video-enabled" />
              )}
            </div>
            {conversation.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
                {conversation.unreadCount}
              </span>
            )}
          </div>
          {conversation.assignedAdmin && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span>Assigned to {conversation.assignedAdmin.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component (Remains the same as before)
type MessageBubbleProps = { message: WhatsAppMessage; isActiveUser: boolean };
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isActiveUser }) => {
  const isCustomer = message.sender === 'customer';
  const isBot = message.isBot;
  const isAdmin = message.sender === 'admin';
  const showVideoCallHint = message.text?.toLowerCase().includes('video call') || 
    message.text?.toLowerCase().includes('screen sharing');

  const messageRef = useRef<HTMLDivElement | null>(null);
  const [highlight, setHighlight] = useState(false);

  const handleClick = () => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setHighlight(true);
    setTimeout(() => setHighlight(false), 1400);
  };

  const formatTime = (time: string) => {
    try {
      const date = new Date(time);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return time;
    }
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
            <span>Auto-bot</span>
          </div>
        )}
        {isAdmin && isActiveUser && (
          <div className="flex items-center gap-1 mb-1 text-xs text-blue-500">
            <User className="w-3 h-3" />
            <span>You</span>
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl relative ${isCustomer
              ? 'bg-gray-100 text-gray-900'
              : isBot
                ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border border-purple-200'
                : showVideoCallHint
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border border-blue-200'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
            }`}
        >
          {showVideoCallHint && (
            <div className="absolute -top-2 -right-2">
              <Video className="w-5 h-5 text-blue-500 bg-white rounded-full p-1 shadow-md" />
            </div>
          )}
          <p className="text-sm">{message.text}</p>
          {showVideoCallHint && (
            <div className="mt-2 pt-2 border-t border-blue-200 border-dashed">
              <p className="text-xs text-blue-700 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Fast resolution available
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 px-2">{formatTime(message.timestamp)}</p>
      </div>
    </div>
  );
};

// Quick Action Bar Component (Remains the same as before)
type QuickActionBarProps = { 
  conversation: Conversation; 
  onVideoCall: () => void;
  onAssign: () => void;
  onAddTag: () => void;
};
const QuickActionBar: React.FC<QuickActionBarProps> = ({ conversation, onVideoCall, onAssign, onAddTag }) => {
  // Mock orders for now
  const phoneOrders: any[] = [];
  const hasOrders = phoneOrders.length > 0;
  const isIssue = conversation.tags.includes('Issue');
  const isAssigned = !!conversation.assignedTo;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${conversation.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="font-medium capitalize">{conversation.status}</span>
          </div>
          {hasOrders && (
            <>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" />
                {phoneOrders.length} order{phoneOrders.length > 1 ? 's' : ''}
              </span>
            </>
          )}
          {isAssigned && conversation.assignedAdmin && (
            <>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1 text-blue-600">
                <User className="w-3 h-3" />
                {conversation.assignedAdmin.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isIssue && (
            <button
              onClick={onVideoCall}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
            >
              <Video className="w-4 h-4" />
              <span className="text-sm font-medium">Quick Resolution</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Tab Navigation Component (Remains the same as before)
type TabType = 'conversations' | 'customers' | 'contacts';
interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount: number;
  customerCount: number;
  contactCount: number;
}
const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, unreadCount, customerCount, contactCount }) => {
  return (
    <div className="flex border-b border-gray-200 bg-white">
      <button
        onClick={() => onTabChange('conversations')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
          activeTab === 'conversations'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        Conversations
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange('customers')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
          activeTab === 'customers'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Users className="w-4 h-4" />
        Customers
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {customerCount}
        </span>
      </button>
      <button
        onClick={() => onTabChange('contacts')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
          activeTab === 'contacts'
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <UserCircle className="w-4 h-4" />
        Contacts
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {contactCount}
        </span>
      </button>
    </div>
  );
};

// Main Chats Page Component
const ChatsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [contactInfo, setContactInfo] = useState<Record<string, ContactInfo>>({});
  const [activeTab, setActiveTab] = useState<TabType>('conversations');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState({
    conversations: false,
    customers: false,
    contacts: false,
    sync: false,
    overview: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [contactsOverview, setContactsOverview] = useState<ContactsOverview | null>(null);

  // Modal states
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatPhone, setNewChatPhone] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');

  // Message loading
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [displayCount, setDisplayCount] = useState(30);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  // Order state
  type Order = { id: string; item: string; amount: number; date: string };
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Calculate unread count
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // Filter conversations, customers, and contacts
  const filteredConversations = conversations.filter(conv =>
    (conv.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    conv.customerPhone.includes(searchTerm) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm) ||
    customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.tags.some(tag => tag.toLowerCase().includes(customerSearchTerm.toLowerCase()))
  );

  const filteredContacts = contacts.filter(contact =>
    (contact.profile_name?.toLowerCase() || '').includes(contactSearchTerm.toLowerCase()) ||
    contact.input.includes(contactSearchTerm) ||
    (contact.business_name?.toLowerCase() || '').includes(contactSearchTerm.toLowerCase()) ||
    contact.wa_id.includes(contactSearchTerm)
  );

  // Check if customer has active conversation
  const hasActiveConversation = (customerPhone: string) => {
    return conversations.some(conv => conv.customerPhone === customerPhone);
  };

  // Convert WhatsAppContact to Customer
  const convertContactToCustomer = (contact: WhatsAppContact): Customer => {
    return {
      id: `contact_${contact.wa_id}`,
      wa_id: contact.wa_id,
      name: contact.profile_name || `Customer ${contact.wa_id.slice(-4)}`,
      phone: contact.wa_id,
      tags: ['whatsapp-registered', ...(contact.is_business ? ['business'] : [])],
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      status: contact.status === 'valid' ? 'active' : 'inactive',
      joinedAt: new Date().toISOString(),
      profile_name: contact.profile_name,
      is_business: contact.is_business,
      business_name: contact.business_name,
      is_blocked: contact.is_blocked,
      last_seen: contact.last_seen
    };
  };

  // Initialize user from auth service
  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (user?.id) {
      whatsappService.connectSocket(user.id, user.role);
      
      // Setup real-time updates
      const cleanup = whatsappService.setupRealTimeUpdates(
        handleNewMessage,
        handleMessageStatusUpdate,
        handleConversationUpdated,
        handleUserTyping
      );

      return () => {
        cleanup();
        whatsappService.disconnectSocket();
      };
    }
  }, [user?.id]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'conversations') {
      loadConversations();
    } else if (activeTab === 'customers') {
      loadCustomers();
    } else if (activeTab === 'contacts') {
      loadContacts();
      loadContactsOverview();
    }
  }, [activeTab]);

  // Load messages when conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);
      whatsappService.subscribeToConversation(activeConversation.id);
    }
  }, [activeConversation?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    if (!isUserScrolledUp) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, displayCount, isUserScrolledUp]);

  const loadConversations = async () => {
    try {
      setLoading(prev => ({ ...prev, conversations: true }));
      const filters: ConversationFilters = {
        status: 'active',
        page: 1,
        limit: 50
      };
      
      const response = await whatsappService.getConversations(filters);
      if (response.success) {
        setConversations(response.data);
        if (response.data.length > 0 && !activeConversation) {
          setActiveConversation(response.data[0]);
        }
      } else {
        setError('Failed to load conversations');
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(prev => ({ ...prev, conversations: false }));
    }
  };

  const loadCustomers = async () => {
    try {
      setLoading(prev => ({ ...prev, customers: true }));
      // In a real app, you would fetch customers from your customer API
      // For now, we'll use contacts as customers
      const contactsResponse = await whatsappService.getRegisteredContacts(100);
      if (contactsResponse.success) {
        const customerList = contactsResponse.data.map(convertContactToCustomer);
        setCustomers(customerList);
      } else {
        setError('Failed to load customers');
      }
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers');
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(prev => ({ ...prev, contacts: true }));
      const response = await whatsappService.getRegisteredContacts(200);
      if (response.success) {
        setContacts(response.data);
        
        // Load detailed info for each contact
        const infoMap: Record<string, ContactInfo> = {};
        for (const contact of response.data.slice(0, 20)) { // Limit to 20 to avoid rate limits
          try {
            const infoResponse = await whatsappService.getContactInfo(contact.wa_id);
            if (infoResponse.success && infoResponse.data) {
              infoMap[contact.wa_id] = infoResponse.data;
            }
          } catch (err) {
            console.error(`Error loading contact info for ${contact.wa_id}:`, err);
          }
        }
        setContactInfo(infoMap);
      } else {
        setError('Failed to load contacts');
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  const loadContactsOverview = async () => {
    try {
      setLoading(prev => ({ ...prev, overview: true }));
      const response = await whatsappService.getContactsOverview();
      if (response.success) {
        setContactsOverview(response.data);
      }
    } catch (err) {
      console.error('Error loading contacts overview:', err);
    } finally {
      setLoading(prev => ({ ...prev, overview: false }));
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await whatsappService.getMessages(conversationId, 50);
      if (response.success) {
        setMessages(response.data);
        setDisplayCount(Math.min(30, response.data.length));
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    }
  };

  // Sync contacts with database
  const handleSyncContacts = async () => {
    try {
      setLoading(prev => ({ ...prev, sync: true }));
      const response = await whatsappService.syncContacts();
      if (response.success) {
        setSuccess(`Synced ${response.data.synced} contacts (${response.data.newContacts} new, ${response.data.updatedContacts} updated)`);
        loadContacts();
        loadContactsOverview();
      } else {
        setError('Failed to sync contacts');
      }
    } catch (err) {
      console.error('Error syncing contacts:', err);
      setError('Failed to sync contacts');
    } finally {
      setLoading(prev => ({ ...prev, sync: false }));
    }
  };

  // Block/Unblock contact
  const handleBlockContact = async (phone: string) => {
    try {
      const response = await whatsappService.blockContact(phone);
      if (response.success) {
        setSuccess(`Contact ${whatsappService.maskPhoneNumber(phone)} blocked successfully`);
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact.wa_id === phone ? { ...contact, is_blocked: true } : contact
        ));
        setCustomers(prev => prev.map(customer => 
          customer.wa_id === phone ? { ...customer, is_blocked: true } : customer
        ));
      } else {
        setError('Failed to block contact');
      }
    } catch (err) {
      console.error('Error blocking contact:', err);
      setError('Failed to block contact');
    }
  };

  const handleUnblockContact = async (phone: string) => {
    try {
      const response = await whatsappService.unblockContact(phone);
      if (response.success) {
        setSuccess(`Contact ${whatsappService.maskPhoneNumber(phone)} unblocked successfully`);
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact.wa_id === phone ? { ...contact, is_blocked: false } : contact
        ));
        setCustomers(prev => prev.map(customer => 
          customer.wa_id === phone ? { ...customer, is_blocked: false } : customer
        ));
      } else {
        setError('Failed to unblock contact');
      }
    } catch (err) {
      console.error('Error unblocking contact:', err);
      setError('Failed to unblock contact');
    }
  };

  // Load contact details
  const handleViewContactDetails = async (contact: WhatsAppContact) => {
    setSelectedContact(contact);
    try {
      const [infoResponse, statsResponse] = await Promise.all([
        whatsappService.getContactInfo(contact.wa_id),
        whatsappService.getContactMessageStats(contact.wa_id)
      ]);
      
      if (infoResponse.success) {
        setContactInfo(prev => ({
          ...prev,
          [contact.wa_id]: infoResponse.data
        }));
      }
      
      // Update customer with message stats if they exist in customers list
      setCustomers(prev => prev.map(customer => 
        customer.wa_id === contact.wa_id 
          ? { 
              ...customer, 
              messageStats: statsResponse.success ? statsResponse.data : undefined 
            }
          : customer
      ));
    } catch (err) {
      console.error('Error loading contact details:', err);
    }
  };

  // Socket event handlers (same as before)
  const handleNewMessage = useCallback((data: NewMessageData) => {
    if (activeConversation && data.customerPhone === activeConversation.customerPhone) {
      const newMessage: WhatsAppMessage = {
        ...data.message,
        timestamp: data.timestamp,
        time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newMessage]);
      
      setConversations(prev => prev.map(conv => 
        conv.customerPhone === data.customerPhone 
          ? { 
              ...conv, 
              lastMessage: data.message.text,
              lastMessageAt: new Date(data.timestamp),
              unreadCount: conv.unreadCount + (conv.id === activeConversation.id ? 0 : 1)
            }
          : conv
      ));
    }
  }, [activeConversation]);

  const handleMessageStatusUpdate = useCallback((data: MessageStatusUpdateData) => {
    if (messages.some(msg => msg.id === data.messageId)) {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, status: data.status }
          : msg
      ));
    }
  }, [messages]);

  const handleConversationUpdated = useCallback((data: ConversationUpdatedData) => {
    setConversations(prev => prev.map(conv => 
      conv.id === data.conversationId
        ? { ...conv, ...data.updates }
        : conv
    ));

    if (activeConversation?.id === data.conversationId) {
      setActiveConversation(prev => ({ ...prev, ...data.updates }));
    }
  }, [activeConversation]);

  const handleUserTyping = useCallback((data: UserTypingData) => {
    if (data.conversationId === activeConversation?.id) {
      setIsTyping(data.isTyping);
    }
  }, [activeConversation]);

  // Message sending (same as before)
  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !activeConversation) return;

    const messageData: SendChatMessageData = {
      conversationId: activeConversation.id,
      customerPhone: activeConversation.customerPhone,
      message: newMessage,
      type: 'text',
      adminId: user.id
    };

    try {
      const response = await whatsappService.sendChatMessage(messageData);
      if (response.success) {
        const tempMessage: WhatsAppMessage = {
          id: response.data.messageId,
          sender: 'admin',
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: response.data.timestamp.toISOString(),
          isBot: false,
          status: 'sent'
        };
        
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        
        setActiveConversation(prev => ({
          ...prev!,
          lastMessage: newMessage,
          lastMessageAt: new Date()
        }));

        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation.id
            ? { 
                ...conv, 
                lastMessage: newMessage,
                lastMessageAt: new Date()
              }
            : conv
        ));
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Start new conversation with customer/contact
  const handleStartConversation = async (phone: string, name?: string) => {
    try {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => conv.customerPhone === phone);
      
      if (existingConv) {
        // Switch to existing conversation
        setActiveConversation(existingConv);
        setActiveTab('conversations');
      } else {
        // Create new conversation in the backend
        // Note: You'll need to implement this in your backend
        const newConversation: Conversation = {
          id: `conv_${Date.now()}`,
          customerPhone: phone,
          customerName: name || `Customer ${phone.slice(-4)}`,
          lastMessage: '',
          lastMessageAt: new Date(),
          unreadCount: 0,
          status: 'active',
          tags: ['New Chat'],
          assignedTo: user?.id
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversation(newConversation);
        setActiveTab('conversations');
        
        setSelectedCustomer(null);
        setSelectedContact(null);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation');
    }
  };

  // Start new chat with phone number (same as before)
  const handleNewChat = async () => {
    if (!newChatPhone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    try {
      // Format phone number
      const formattedPhone = whatsappService.formatPhoneNumber(newChatPhone);
      
      // Create new conversation
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        customerPhone: formattedPhone,
        customerName: '', // Will be updated when customer responds
        lastMessage: newChatMessage,
        lastMessageAt: new Date(),
        unreadCount: 0,
        status: 'active',
        tags: ['New Chat'],
        assignedTo: user?.id
      };
      
      // Send initial message if provided
      if (newChatMessage.trim() && user?.id) {
        const messageData: SendChatMessageData = {
          conversationId: newConversation.id,
          customerPhone: formattedPhone,
          message: newChatMessage,
          type: 'text',
          adminId: user.id
        };
        await whatsappService.sendChatMessage(messageData);
      }
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation);
      setActiveTab('conversations');
      
      // Reset form
      setNewChatPhone('');
      setNewChatMessage('');
      setShowNewChatModal(false);
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Failed to create new chat');
    }
  };

  // Conversation actions (same as before)
  const handleAssignConversation = async (adminId: string) => {
    if (!activeConversation) return;
    
    try {
      const response = await whatsappService.assignConversation(activeConversation.id, adminId);
      if (response.success) {
        setActiveConversation(response.data);
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation.id ? response.data : conv
        ));
      }
      setShowAssignModal(false);
    } catch (err) {
      console.error('Error assigning conversation:', err);
      setError('Failed to assign conversation');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !activeConversation) return;

    try {
      const updatedTags = [...activeConversation.tags, newTag];
      const response = await whatsappService.updateTags(activeConversation.id, updatedTags);
      if (response.success) {
        setActiveConversation(response.data);
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation.id ? response.data : conv
        ));
      }
      setNewTag('');
      setShowTagModal(false);
    } catch (err) {
      console.error('Error adding tag:', err);
      setError('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!activeConversation) return;
    
    try {
      const updatedTags = activeConversation.tags.filter(t => t !== tag);
      const response = await whatsappService.updateTags(activeConversation.id, updatedTags);
      if (response.success) {
        setActiveConversation(response.data);
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation.id ? response.data : conv
        ));
      }
    } catch (err) {
      console.error('Error removing tag:', err);
      setError('Failed to remove tag');
    }
  };

  const handleMarkAsResolved = async () => {
    if (!activeConversation) return;
    
    try {
      const response = await whatsappService.markAsResolved(activeConversation.id);
      if (response.success) {
        setActiveConversation(response.data);
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation.id ? response.data : conv
        ));
      }
    } catch (err) {
      console.error('Error marking as resolved:', err);
      setError('Failed to mark as resolved');
    }
  };

  // Typing indicator (same as before)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (e.target.value.trim() && !isTyping && activeConversation) {
      whatsappService.sendTypingStatus(activeConversation.id, true);
      setIsTyping(true);
    } else if (!e.target.value.trim() && isTyping && activeConversation) {
      whatsappService.sendTypingStatus(activeConversation.id, false);
      setIsTyping(false);
    }
  };

  // Load older messages (same as before)
  const handleLoadOlder = () => {
    if (isLoadingOlder || displayCount >= messages.length) return;
    
    setIsLoadingOlder(true);
    const toLoad = 30;
    setDisplayCount(prev => Math.min(messages.length, prev + toLoad));
    setIsLoadingOlder(false);
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    if (container.scrollTop <= 10 && !isLoadingOlder && displayCount < messages.length) {
      handleLoadOlder();
    }
    
    const atBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 10;
    setIsUserScrolledUp(!atBottom);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCallType = () => {
    if (!activeConversation) return 'consultation';
    
    if (activeConversation.tags.includes('Issue')) return 'dispute';
    if (activeConversation.tags.includes('Negotiating')) return 'support';
    return 'consultation';
  };

  const getAdminOptions = () => {
    return ['admin1', 'admin2', 'admin3'].map(id => ({
      id,
      name: id === 'admin1' ? 'Admin 1' : id === 'admin2' ? 'Admin 2' : 'Admin 3'
    }));
  };

  const handleLogout = () => {
    authService.logout();
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Support</h1>
              <p className="text-sm text-gray-600">Real-time conversations & contact management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
              <div className={`w-2 h-2 rounded-full ${whatsappService.isSocketConnected() ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {whatsappService.isSocketConnected() ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {user?.email || 'Admin'}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Tabs with Conversations/Customers/Contacts */}
        <div className="w-100 bg-white border-r border-gray-200 flex flex-col shadow-inner">
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadCount={totalUnread}
            customerCount={customers.length}
            contactCount={contacts.length}
          />

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeTab === 'conversations' 
                    ? 'Search conversations...' 
                    : activeTab === 'customers'
                    ? 'Search customers...'
                    : 'Search contacts...'
                }
                value={
                  activeTab === 'conversations' ? searchTerm 
                  : activeTab === 'customers' ? customerSearchTerm
                  : contactSearchTerm
                }
                onChange={(e) => {
                  if (activeTab === 'conversations') setSearchTerm(e.target.value);
                  else if (activeTab === 'customers') setCustomerSearchTerm(e.target.value);
                  else setContactSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-4 py-3 border-b border-gray-200 space-y-2">
            {activeTab === 'conversations' && (
              <button
                onClick={() => setShowNewChatModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </button>
            )}
            
            {activeTab === 'contacts' && (
              <>
                <button
                  onClick={handleSyncContacts}
                  disabled={loading.sync}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading.sync ? 'animate-spin' : ''}`} />
                  {loading.sync ? 'Syncing...' : 'Sync Contacts'}
                </button>
                
                <button
                  onClick={() => whatsappService.checkTokenHealth()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Check WhatsApp Status
                </button>
              </>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {loading.conversations && activeTab === 'conversations' ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : loading.customers && activeTab === 'customers' ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : loading.contacts && activeTab === 'contacts' ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeTab === 'conversations' ? (
              filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No conversations found</p>
                  <p className="text-sm text-gray-400 mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <ChatListItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setActiveTab('conversations');
                    }}
                  />
                ))
              )
            ) : activeTab === 'customers' ? (
              // Customers Tab
              filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No customers found</p>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Sync WhatsApp contacts →
                  </button>
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerListItem
                    key={customer.id}
                    customer={customer}
                    isActive={selectedCustomer?.id === customer.id}
                    hasActiveChat={hasActiveConversation(customer.phone)}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      if (hasActiveConversation(customer.phone)) {
                        const conv = conversations.find(c => c.customerPhone === customer.phone);
                        if (conv) {
                          setActiveConversation(conv);
                          setActiveTab('conversations');
                        }
                      }
                    }}
                    onBlock={handleBlockContact}
                    onUnblock={handleUnblockContact}
                  />
                ))
              )
            ) : (
              // Contacts Tab
              <>
                {/* {contactsOverview && (
                  <ContactsOverviewCard overview={contactsOverview} />
                )} */}
                
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <UserCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No WhatsApp contacts found</p>
                    <p className="text-sm text-gray-400 mt-1">Sync contacts to load WhatsApp data</p>
                    <button
                      onClick={handleSyncContacts}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Sync Now
                    </button>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredContacts.map((contact) => {
                      const info = contactInfo[contact.wa_id];
                      const customer = convertContactToCustomer(contact);
                      
                      return (
                        <div
                          key={contact.wa_id}
                          onClick={() => handleViewContactDetails(contact)}
                          className={`p-3 mb-2 border rounded-lg cursor-pointer transition-all ${
                            selectedContact?.wa_id === contact.wa_id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {contact.profile_name?.[0]?.toUpperCase() || contact.wa_id.slice(-2)}
                              </div>
                              {contact.is_business && (
                                <Building className="absolute -top-1 -right-1 w-4 h-4 text-teal-600 bg-white rounded-full" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {contact.profile_name || `+${contact.wa_id}`}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {contact.status === 'valid' ? (
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                      Valid
                                    </span>
                                  ) : (
                                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                                      Invalid
                                    </span>
                                  )}
                                  {contact.is_blocked && (
                                    <Ban className="w-3 h-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500 mt-1">
                                {contact.is_business && (
                                  <div className="flex items-center gap-1">
                                    <Briefcase className="w-3 h-3" />
                                    <span>{contact.business_name}</span>
                                  </div>
                                )}
                                {info?.last_seen && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Last seen: {new Date(info.last_seen).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartConversation(contact.wa_id, contact.profile_name);
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                  Start Chat
                                </button>
                                {contact.is_blocked ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnblockContact(contact.wa_id);
                                    }}
                                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                  >
                                    Unblock
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBlockContact(contact.wa_id);
                                    }}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                  >
                                    Block
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Selected Customer/Contact Actions */}
          {(selectedCustomer && activeTab === 'customers') || (selectedContact && activeTab === 'contacts') ? (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Selected</h4>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setSelectedContact(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const phone = selectedCustomer?.phone || selectedContact?.wa_id;
                    const name = selectedCustomer?.name || selectedContact?.profile_name;
                    if (phone) handleStartConversation(phone, name);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start Chat
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column - Active Chat */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'conversations' && activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {activeConversation.customerName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'C'}
                      </div>
                      {activeConversation.status === 'active' && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-gray-900 text-lg">
                          {activeConversation.customerName || 'Customer'}
                        </h2>
                        {activeConversation.tags.includes('VIP') && (
                          <span className="bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {whatsappService.maskPhoneNumber(activeConversation.customerPhone)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="capitalize">{activeConversation.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <VideoCallButton
                      callType={getCallType()}
                      participantName={activeConversation.customerName || 'Customer'}
                      participantRole="customer"
                      size="md"
                      showLabel={true}
                      variant={activeConversation.tags.includes('Issue') ? 'danger' : 'primary'}
                    />

                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">Assign</span>
                    </button>
                    <button
                      onClick={() => setShowTagModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium">Tags</span>
                    </button>
                    {activeConversation.status === 'active' && (
                      <button
                        onClick={handleMarkAsResolved}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">Resolve</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags Display */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {activeConversation.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
                  ))}
                </div>
              </div>

              {/* Quick Action Bar */}
              <QuickActionBar
                conversation={activeConversation}
                onVideoCall={() => {}}
                onAssign={() => setShowAssignModal(true)}
                onAddTag={() => setShowTagModal(true)}
              />

              {/* Messages Area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Messages */}
                <div 
                  ref={messagesContainerRef} 
                  onScroll={handleScroll} 
                  className="flex-1 overflow-y-auto p-6 flex flex-col"
                >
                  <div className="flex-1 flex flex-col gap-4">
                    {(() => {
                      const total = messages.length;
                      const effectiveDisplay = Math.min(displayCount, 300);
                      const startIndex = Math.max(0, total - effectiveDisplay);
                      const visibleMessages = messages.slice(startIndex, total);
                      const hasMoreAbove = startIndex > 0;

                      return (
                        <>
                          {hasMoreAbove && (
                            <div className="text-center py-4">
                              <button
                                onClick={handleLoadOlder}
                                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                disabled={isLoadingOlder}
                              >
                                {isLoadingOlder ? (
                                  <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    Loading...
                                  </span>
                                ) : 'Load older messages'}
                              </button>
                            </div>
                          )}

                          {visibleMessages.map((message) => (
                            <MessageBubble 
                              key={message.id} 
                              message={message} 
                              isActiveUser={message.sender === 'admin' && user?.id === activeConversation.assignedTo}
                            />
                          ))}

                          {isTyping && (
                            <div className="flex justify-start mb-4">
                              <div className="max-w-xs lg:max-w-md">
                                <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-900">
                                  <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div ref={endRef} />
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <div className="flex items-center gap-1 px-3 border-r border-gray-300">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Tag className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Type your message... (Press Enter to send)"
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0"
                    />
                    <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                      <Smile className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    💡 Tip: Type "/video" to suggest a video call
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      WhatsApp connected
                    </span>
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      Video enabled
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'customers' || activeTab === 'contacts' ? (
            // Customers/Contacts Tab Main View
            <div className="flex-1 flex flex-col bg-gray-50">
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center">
                      {activeTab === 'customers' ? (
                        <>
                          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Directory</h3>
                          <p className="text-gray-600 mb-6">
                            {selectedCustomer 
                              ? `Viewing details for ${selectedCustomer.name}. Click "Start Chat" to begin a conversation.`
                              : 'Select a customer from the list to view details and start a conversation.'}
                          </p>
                        </>
                      ) : (
                        <>
                          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Contacts</h3>
                          <p className="text-gray-600 mb-6">
                            {selectedContact 
                              ? `Viewing details for ${selectedContact.profile_name || selectedContact.wa_id}.`
                              : 'Select a contact from the list to view details and start a conversation.'}
                          </p>
                        </>
                      )}
                      
                      {!selectedCustomer && !selectedContact && (
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowNewChatModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium"
                          >
                            <Plus className="w-5 h-5" />
                            New Chat with Phone Number
                          </button>
                          
                          {activeTab === 'contacts' && (
                            <div>
                              <button
                                onClick={handleSyncContacts}
                                disabled={loading.sync}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium disabled:opacity-50"
                              >
                                <RefreshCw className={`w-5 h-5 ${loading.sync ? 'animate-spin' : ''}`} />
                                {loading.sync ? 'Syncing...' : 'Sync WhatsApp Contacts'}
                              </button>
                              <p className="text-xs text-gray-500 mt-2">
                                Sync contacts from WhatsApp Business API to view registered users
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Default view when no active tab
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h3>
                <p className="text-gray-600">Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Start New Chat</h3>
                <p className="text-sm text-gray-600">Begin a conversation with a customer</p>
              </div>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatPhone('');
                  setNewChatMessage('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(selectedCustomer || selectedContact) && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedCustomer?.name || selectedContact?.profile_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {selectedCustomer?.phone || selectedContact?.wa_id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+2348012345678"
                    value={newChatPhone}
                    onChange={(e) => setNewChatPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Message (Optional)
                </label>
                <textarea
                  placeholder="Hello! How can I help you today?"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={handleNewChat}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Start Chat
              </button>
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatPhone('');
                  setNewChatMessage('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              {getAdminOptions().map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => handleAssignConversation(admin.id)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {admin.name}
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

      {/* Success Toast */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-4 text-green-600 hover:text-green-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-4 text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsPage;
