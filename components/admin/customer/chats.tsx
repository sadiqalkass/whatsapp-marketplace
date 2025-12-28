// "use client"

// import React, { useState, useRef, useEffect } from 'react';
// import { MessageSquare, Search, User, Tag, UserPlus, X, Bot, Users, ShoppingBag, Clock, Phone } from 'lucide-react';
// import Chat from '@/Types/types';

// const mockChats: Chat[] = [
//   {
//     id: 1,
//     customer: 'John Doe',
//     phone: '+234 801 234 5678',
//     lastMessage: 'Thanks! When will it arrive?',
//     timestamp: '2 min ago',
//     unread: 2,
//     tags: ['VIP', 'Active'],
//     avatar: 'JD',
//     status: 'online',
//     orders: [
//       { id: 'ORD-001', item: 'iPhone 13', amount: 450000, date: '2 days ago' },
//       { id: 'ORD-015', item: 'AirPods Pro', amount: 89000, date: '1 week ago' }
//     ]
//   },
//   {
//     id: 2,
//     customer: 'Sarah Williams',
//     phone: '+234 802 345 6789',
//     lastMessage: 'Do you have this in blue?',
//     timestamp: '15 min ago',
//     unread: 0,
//     tags: ['New Customer'],
//     avatar: 'SW',
//     status: 'offline',
//     orders: []
//   },
//   {
//     id: 3,
//     customer: 'Mike Johnson',
//     phone: '+234 803 456 7890',
//     lastMessage: 'I need to return this item',
//     timestamp: '1 hour ago',
//     unread: 1,
//     tags: ['Issue'],
//     avatar: 'MJ',
//     status: 'online',
//     orders: [
//       { id: 'ORD-028', item: 'Nike Sneakers', amount: 35000, date: '3 days ago' }
//     ]
//   },
//   {
//     id: 4,
//     customer: 'Grace Adeyemi',
//     phone: '+234 804 567 8901',
//     lastMessage: 'Can I get a discount?',
//     timestamp: '3 hours ago',
//     unread: 0,
//     tags: ['Negotiating'],
//     avatar: 'GA',
//     status: 'offline',
//     orders: [
//       { id: 'ORD-042', item: 'Blender', amount: 25000, date: '1 week ago' },
//       { id: 'ORD-033', item: 'Toaster', amount: 15000, date: '2 weeks ago' }
//     ]
//   },
//   {
//     id: 5,
//     customer: 'David Brown',
//     phone: '+234 805 678 9012',
//     lastMessage: 'Perfect! I\'ll order now',
//     timestamp: '5 hours ago',
//     unread: 0,
//     tags: ['VIP'],
//     avatar: 'DB',
//     status: 'offline',
//     orders: [
//       { id: 'ORD-055', item: 'Laptop', amount: 520000, date: '1 day ago' }
//     ]
//   },
//   {
//     id: 6,
//     customer: 'Amina Hassan',
//     phone: '+234 806 789 0123',
//     lastMessage: 'Hello, is this available?',
//     timestamp: '1 day ago',
//     unread: 3,
//     tags: ['New Customer'],
//     avatar: 'AH',
//     status: 'online',
//     orders: []
//   }
// ];

// const mockMessages = {
//   1: [
//     { id: 1, sender: 'customer', text: 'Hi, I\'m interested in the iPhone 13', time: '10:30 AM', isBot: false },
//     { id: 2, sender: 'admin', text: 'Hello! Yes, we have it in stock. Which color would you prefer?', time: '10:31 AM', isBot: false },
//     { id: 3, sender: 'customer', text: 'Do you have it in black?', time: '10:32 AM', isBot: false },
//     { id: 4, sender: 'admin', text: 'Yes, black is available. The price is ₦450,000. Would you like to place an order?', time: '10:33 AM', isBot: false },
//     { id: 5, sender: 'customer', text: 'Yes please!', time: '10:35 AM', isBot: false },
//     { id: 6, sender: 'admin', text: 'Great! I\'ll create an order for you now.', time: '10:36 AM', isBot: false },
//     { id: 7, sender: 'customer', text: 'Thanks! When will it arrive?', time: '10:38 AM', isBot: false }
//   ],
//   2: [
//     { id: 1, sender: 'customer', text: 'Hi there', time: '9:15 AM', isBot: false },
//     { id: 2, sender: 'bot', text: 'Hello! Welcome to our store. How can I help you today?', time: '9:15 AM', isBot: true },
//     { id: 3, sender: 'customer', text: 'Do you have this in blue?', time: '9:20 AM', isBot: false }
//   ],
//   3: [
//     { id: 1, sender: 'customer', text: 'I need to return this item', time: '8:00 AM', isBot: false },
//     { id: 2, sender: 'admin', text: 'I\'m sorry to hear that. Can you tell me what the issue is?', time: '8:05 AM', isBot: false }
//   ]
// };

// type Message = { id: number; sender: 'customer' | 'admin' | 'bot'; text: string; time: string; isBot?: boolean };

// type Chat = { id: number; customer: string; phone: string; lastMessage: string; timestamp: string; unread: number; tags: string[]; avatar: string; status: 'online' | 'offline'; orders: { id: string; item: string; amount: number; date: string }[] };

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
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
//       {tag}
//       {onRemove && (
//         <button onClick={() => onRemove(tag)} className="hover:opacity-70">
//           <X className="w-3 h-3" />
//         </button>
//       )}
//     </span>
//   );
// };

// // ChatListItem Component
// type ChatListItemProps = { chat: Chat; isActive: boolean; onClick: () => void };
// const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isActive, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
//         isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
//       }`}
//     >
//       <div className="flex items-start gap-3">
//         {/* Avatar */}
//         <div className="relative">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//             {chat.avatar}
//           </div>
//           {chat.status === 'online' && (
//             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//           )}
//         </div>

//         {/* Chat Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="font-semibold text-gray-900 truncate">{chat.customer}</h3>
//             <span className="text-xs text-gray-500">{chat.timestamp}</span>
//           </div>
//           <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
//           <div className="flex items-center gap-1 flex-wrap">
//             {chat.tags.map((tag) => (
//               <TagBadge key={tag} tag={tag} />
//             ))}
//           </div>
//         </div>

//         {/* Unread Badge */}
//         {chat.unread > 0 && (
//           <div className="flex-shrink-0">
//             <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
//               {chat.unread}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Message Bubble Component
// type MessageBubbleProps = { message: Message };
// const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
//   const isCustomer = message.sender === 'customer';
//   const isBot = message.isBot;

//   const messageRef = useRef<HTMLDivElement | null>(null);
//   const [highlight, setHighlight] = useState(false);

//   const handleClick = () => {
//     // Scroll the clicked message to the top of the messages viewport
//     messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     setHighlight(true);
//     setTimeout(() => setHighlight(false), 1400);
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
//             <span>Bot</span>
//           </div>
//         )}
//         <div
//           className={`px-4 py-2 rounded-2xl ${
//             isCustomer
//               ? 'bg-gray-100 text-gray-900'
//               : isBot
//               ? 'bg-purple-100 text-purple-900 border border-purple-200'
//               : 'bg-blue-600 text-white'
//           }`}
//         >
//           <p className="text-sm">{message.text}</p>
//         </div>
//         <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
//       </div>
//     </div>
//   );
// };

// // Main Chats Page Component
// const ChatsPage: React.FC = () => {
//   const [activeChat, setActiveChat] = useState<Chat>(mockChats[0]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showTagModal, setShowTagModal] = useState(false);
//   const [newTag, setNewTag] = useState('');
//   const [showAssignModal, setShowAssignModal] = useState(false);

//   const filteredChats = mockChats.filter(chat =>
//     chat.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     chat.phone.includes(searchTerm) ||
//     chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const messages = (mockMessages as Record<number, Message[]>)[activeChat.id] || [];

//   const messagesContainerRef = useRef<HTMLDivElement | null>(null);
//   const endRef = useRef<HTMLDivElement | null>(null);

//   // Incremental loading + lightweight virtualization
//   const [displayCount, setDisplayCount] = useState<number>(() => Math.min(30, messages.length));
//   const [isLoadingOlder, setIsLoadingOlder] = useState(false);
//   const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

//   useEffect(() => {
//     // Reset view when switching chats
//     setDisplayCount(Math.min(30, messages.length));
//     setIsUserScrolledUp(false);
//   }, [activeChat.id]);

//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) {
//       endRef.current?.scrollIntoView({ behavior: 'auto' });
//       return;
//     }
//     // Auto scroll to bottom only if the user hasn't scrolled up
//     if (!isUserScrolledUp) {
//       container.scrollTop = container.scrollHeight;
//     }
//   }, [activeChat.id, messages.length, displayCount, isUserScrolledUp]);

//   type Order = { id: string; item: string; amount: number; date: string };
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   const MAX_RENDER = 300; // cap DOM nodes for lightweight virtualization

//   const handleLoadOlder = () => {
//     const container = messagesContainerRef.current;
//     if (!container || isLoadingOlder) return;
//     setIsLoadingOlder(true);
//     const prevScrollHeight = container.scrollHeight;
//     const toLoad = 30;
//     setDisplayCount((prev) => Math.min(messages.length, prev + toLoad));
//     // After DOM updates, preserve scroll position
//     requestAnimationFrame(() => {
//       const newScrollHeight = container.scrollHeight;
//       container.scrollTop = newScrollHeight - prevScrollHeight;
//       setIsLoadingOlder(false);
//     });
//   };

//   const handleScroll = () => {
//     const container = messagesContainerRef.current;
//     if (!container) return;
//     // If user scrolled to (near) top, load older messages
//     if (container.scrollTop <= 10 && !isLoadingOlder && displayCount < messages.length) {
//       handleLoadOlder();
//     }
//     const atBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 10;
//     setIsUserScrolledUp(!atBottom);
//   };

//   const handleAddTag = () => {
//     if (newTag.trim()) {
//       console.log('Adding tag:', newTag);
//       alert(`Tag "${newTag}" added to ${activeChat.customer}`);
//       setNewTag('');
//       setShowTagModal(false);
//     }
//   };

//   const handleRemoveTag = (tag: string) => {
//     console.log('Removing tag:', tag);
//     alert(`Tag "${tag}" removed from ${activeChat.customer}`);
//   };

//   const handleAssignChat = (admin: string) => {
//     console.log('Assigning chat to:', admin);
//     alert(`Chat assigned to ${admin}`);
//     setShowAssignModal(false);
//   };

//   const handleBotHandoff = () => {
//     console.log('Handing off from bot to human');
//     alert('Chat handed off from bot to human agent');
//   };

//   return (
//     <div className="min-h-screen p-8 flex flex-col">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-4">
//         <div className="flex items-center gap-3">
//           <MessageSquare className="w-8 h-8 text-blue-600" />
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Customer Chats</h1>
//             <p className="text-sm text-gray-600">Manage WhatsApp conversations</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content - Two Column Layout */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Left Column - Chat List */}
//         <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
//           {/* Search */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search chats..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* Chat List */}
//           <div className="flex-1 overflow-y-auto">
//             {filteredChats.map((chat: any) => (
//               <ChatListItem
//                 key={chat.id}
//                 chat={chat}
//                 isActive={activeChat.id === chat.id}
//                 onClick={() => setActiveChat(chat)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Column - Active Chat */}
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="bg-white border-b border-gray-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//                   {activeChat.avatar}
//                 </div>
//                 <div>
//                   <h2 className="font-semibold text-gray-900">{activeChat.customer}</h2>
//                   <div className="flex items-center gap-2 text-sm text-gray-500">
//                     <Phone className="w-3 h-3" />
//                     <span>{activeChat.phone}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setShowAssignModal(true)}
//                   className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <UserPlus className="w-4 h-4" />
//                   <span className="text-sm">Assign</span>
//                 </button>
//                 <button
//                   onClick={() => setShowTagModal(true)}
//                   className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Tag className="w-4 h-4" />
//                   <span className="text-sm">Tags</span>
//                 </button>
//                 <button
//                   onClick={handleBotHandoff}
//                   className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//                 >
//                   <Bot className="w-4 h-4" />
//                   <span className="text-sm">Bot → Human</span>
//                 </button>
//               </div>
//             </div>

//             {/* Tags Display */}
//             <div className="mt-3 flex items-center gap-2 flex-wrap">
//               {activeChat.tags.map((tag) => (
//                 <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
//               ))}
//             </div>
//           </div>

//           {/* Chat Content Area */}
//           <div className="flex-1 flex overflow-hidden">
//             {/* Messages */}
//             <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 flex flex-col">
//               <div className="flex-1 flex flex-col gap-4">
//                 {/* Loader / Load older control */}
//                 {(() => {
//                   const total = messages.length;
//                   const effectiveDisplay = Math.min(displayCount, MAX_RENDER);
//                   const startIndex = Math.max(0, total - effectiveDisplay);
//                   const visibleMessages = messages.slice(startIndex, total);
//                   const hasMoreAbove = startIndex > 0;

//                   return (
//                     <>
//                       {hasMoreAbove && (
//                         <div className="text-center py-2">
//                           <button
//                             onClick={handleLoadOlder}
//                             className="text-sm text-blue-600"
//                           >
//                             {isLoadingOlder ? 'Loading...' : 'Load older messages'}
//                           </button>
//                         </div>
//                       )}

//                       {visibleMessages.map((message) => (
//                         <MessageBubble key={message.id} message={message} />
//                       ))}

//                       <div ref={endRef} />
//                     </>
//                   );
//                 })()}
//               </div>
//             </div>

//             {/* Right Sidebar - Order Context */}
//             <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
//               <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                 <ShoppingBag className="w-5 h-5" />
//                 Recent Orders
//               </h3>
//               <p className="text-xs text-gray-500 mb-4">Orders placed by this customer (most recent first). Click `View` to open order details.</p>

//               {activeChat.orders.length > 0 ? (
//                 <div className="space-y-3">
//                   {activeChat.orders.map((order) => (
//                     <div key={order.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex items-start justify-between mb-2">
//                         <span className="text-xs font-medium text-blue-600">{order.id}</span>
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <Clock className="w-3 h-3" />
//                           {order.date}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-900 font-medium mb-1">{order.item}</p>
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm font-semibold text-gray-900">₦{order.amount.toLocaleString()}</p>
//                         <button
//                           onClick={() => setSelectedOrder(order)}
//                           className="text-xs text-blue-600 hover:underline"
//                           aria-label={`View order ${order.id}`}
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                   <p className="text-sm">No orders yet</p>
//                 </div>
//               )}

//               {/* Customer Stats */}
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <h3 className="font-semibold text-gray-900 mb-3">Customer Stats</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Total Orders:</span>
//                     <span className="font-semibold text-gray-900">{activeChat.orders.length}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Total Spent:</span>
//                     <span className="font-semibold text-gray-900">
//                       ₦{activeChat.orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Status:</span>
//                     <span className={`font-semibold ${activeChat.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
//                       {activeChat.status === 'online' ? 'Online' : 'Offline'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Optional Order Detail Modal */}
//           {selectedOrder && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h3 className="text-lg font-semibold">Order {selectedOrder.id}</h3>
//                     <p className="text-sm text-gray-600">{selectedOrder.item}</p>
//                   </div>
//                   <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Amount</span>
//                     <span className="font-semibold">₦{selectedOrder.amount.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>Date</span>
//                     <span>{selectedOrder.date}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Message Input */}
//           <div className="bg-white border-t border-gray-200 p-4">
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

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
//               {['Admin 1', 'Admin 2', 'Admin 3'].map((admin) => (
//                 <button
//                   key={admin}
//                   onClick={() => handleAssignChat(admin)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left flex items-center gap-2"
//                 >
//                   <User className="w-4 h-4" />
//                   {admin}
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
//     </div>
//   );
// };

// export default ChatsPage;
'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Zap
} from 'lucide-react';
import Chat from '@/Types/types';
import VideoCallButton from '../video-call/VideoCallButton';

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
    { id: 2, sender: 'admin', text: 'I\'m sorry to hear that. Can you tell me what the issue is?', time: '8:05 AM', isBot: false },
    { id: 3, sender: 'admin', text: 'For complex returns, would you like to start a video call? We can do screen sharing to help resolve this faster.', time: '8:07 AM', isBot: false }
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
      case 'video-enabled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getTagColor(tag)}`}>
      {tag === 'video-enabled' && <Video className="w-3 h-3" />}
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
      className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${isActive
          ? 'bg-linear-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-600 shadow-sm'
          : 'hover:bg-gray-50 hover:shadow-sm'
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm">
            {chat.avatar}
          </div>
          {chat.status === 'online' && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          )}
          {chat.tags.includes('Issue') && (
            <div className="absolute -top-1 -right-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate flex items-center gap-1">
              {chat.customer}
              {chat.tags.includes('VIP') && (
                <span className="text-yellow-500">
                  <Shield className="w-3 h-3" />
                </span>
              )}
            </h3>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {chat.timestamp}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">{chat.lastMessage}</p>
          <div className="flex items-center gap-1 flex-wrap">
            {chat.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {chat.tags.includes('Issue') && (
              <TagBadge tag="video-enabled" />
            )}
          </div>
        </div>

        {/* Unread Badge */}
        {chat.unread > 0 && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
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
  const showVideoCallHint = message.text.includes('video call') || message.text.includes('screen sharing');

  const messageRef = useRef<HTMLDivElement | null>(null);
  const [highlight, setHighlight] = useState(false);

  const handleClick = () => {
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
            <span>Auto-bot</span>
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
        <p className="text-xs text-gray-500 mt-1 px-2">{message.time}</p>
      </div>
    </div>
  );
};

// Quick Action Bar Component
const QuickActionBar: React.FC<{ chat: Chat; onVideoCall: () => void }> = ({ chat, onVideoCall }) => {
  const isIssueChat = chat.tags.includes('Issue');
  const hasOrders = chat.orders.length > 0;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${chat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="font-medium">{chat.status === 'online' ? 'Online now' : 'Last seen recently'}</span>
          </div>
          {hasOrders && (
            <span className="text-gray-400">•</span>
          )}
          {hasOrders && (
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              {chat.orders.length} order{chat.orders.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isIssueChat && (
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

// Main Chats Page Component
const ChatsPage: React.FC = () => {
  const [activeChat, setActiveChat] = useState<Chat>(mockChats[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showVideoCallHint, setShowVideoCallHint] = useState(true);

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
    if (!isUserScrolledUp) {
      container.scrollTop = container.scrollHeight;
    }
  }, [activeChat.id, messages.length, displayCount, isUserScrolledUp]);

  type Order = { id: string; item: string; amount: number; date: string };
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const MAX_RENDER = 300;

  const handleLoadOlder = () => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingOlder) return;
    setIsLoadingOlder(true);
    const prevScrollHeight = container.scrollHeight;
    const toLoad = 30;
    setDisplayCount((prev) => Math.min(messages.length, prev + toLoad));
    requestAnimationFrame(() => {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight;
      setIsLoadingOlder(false);
    });
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

  const handleVideoCall = () => {
    console.log('Starting video call with:', activeChat.customer);
  };

  const getCallType = () => {
    if (activeChat.tags.includes('Issue')) return 'dispute';
    if (activeChat.tags.includes('Negotiating')) return 'support';
    return 'support';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col px-2">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
              <p className="text-sm text-gray-600">WhatsApp conversations & video support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Video calls enabled</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md">
              <Users className="w-4 h-4" />
              <span className="text-sm">Team View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Chat List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-inner">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats by name, phone, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Chat List Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active Conversations</span>
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {filteredChats.length} chats
            </span>
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
          <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {activeChat.avatar}
                  </div>
                  {activeChat.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900 text-lg">{activeChat.customer}</h2>
                    {activeChat.tags.includes('VIP') && (
                      <span className="bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {activeChat.phone}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className={`flex items-center gap-1 ${activeChat.status === 'online' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${activeChat.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      {activeChat.status === 'online' ? 'Online now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Video Call Button */}
                <VideoCallButton
                  callType={getCallType()}
                  participantName={activeChat.customer}
                  participantRole="customer"
                  size="md"
                  showLabel={true}
                  variant={activeChat.tags.includes('Issue') ? 'danger' : 'primary'}
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
                <button
                  onClick={handleBotHandoff}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
                >
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-medium">Take Over</span>
                </button>
              </div>
            </div>

            {/* Tags Display */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {activeChat.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} onRemove={handleRemoveTag} />
              ))}
              {activeChat.tags.includes('Issue') && (
                <TagBadge tag="video-enabled" />
              )}
            </div>
          </div>

          {/* Quick Action Bar */}
          <QuickActionBar chat={activeChat} onVideoCall={handleVideoCall} />

          {/* Video Call Hint Banner */}
          {showVideoCallHint && activeChat.tags.includes('Issue') && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Video call available for this issue</p>
                    <p className="text-xs text-blue-700">Start a call for faster resolution with screen sharing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowVideoCallHint(false)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Dismiss
                  </button>
                  <VideoCallButton
                    callType="dispute"
                    participantName={activeChat.customer}
                    participantRole="customer"
                    size="sm"
                    showLabel={true}
                    variant="primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Chat Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Messages */}
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 flex flex-col">
              <div className="flex-1 flex flex-col gap-4">
                {(() => {
                  const total = messages.length;
                  const effectiveDisplay = Math.min(displayCount, MAX_RENDER);
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
                        <MessageBubble key={message.id} message={message} />
                      ))}

                      <div ref={endRef} />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right Sidebar - Order Context */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-inner">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  Customer Context
                </h3>
                <p className="text-xs text-gray-500 mt-1">Order history and customer insights</p>
              </div>

              {/* Order List */}
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                  <span>Recent Orders</span>
                  <span className="text-xs text-gray-500">{activeChat.orders.length} total</span>
                </h4>

                {activeChat.orders.length > 0 ? (
                  <div className="space-y-3">
                    {activeChat.orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">{order.id}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium mb-1 truncate">{order.item}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">₦{order.amount.toLocaleString()}</p>
                          <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium">
                            View →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No orders yet</p>
                    <p className="text-xs text-gray-400 mt-1">This customer hasn't placed any orders</p>
                  </div>
                )}

                {/* Customer Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Customer Insights</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Total Spent</span>
                        <span className="font-bold text-gray-900">
                          ₦{activeChat.orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Order Count</span>
                        <span className="font-bold text-gray-900">{activeChat.orders.length}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Avg. Order Value</span>
                        <span className="font-bold text-gray-900">
                          ₦{activeChat.orders.length > 0
                            ? Math.round(activeChat.orders.reduce((sum, order) => sum + order.amount, 0) / activeChat.orders.length).toLocaleString()
                            : '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Call Recommendation */}
                {activeChat.tags.includes('Issue') && activeChat.orders.length > 0 && (
                  <div className="mt-6 p-4 bg-linear-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3">
                      <Video className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900">Video Call Recommended</p>
                        <p className="text-xs text-red-700 mt-1">
                          This customer has an order issue. A video call with screen sharing could resolve this 70% faster.
                        </p>
                        <button className="mt-2 text-xs font-medium text-red-700 hover:text-red-900">
                          Learn more →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                    <Video className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Type your message... (Press Enter to send)"
                  className="flex-1 px-4 py-3 border-0 focus:outline-none focus:ring-0"
                />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md font-medium">
                Send
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

    </div >
  );
};

export default ChatsPage;
