// components/onboarding/HelpCenter.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  Book, 
  Video, 
  Play, 
  ChevronRight,
  MessageSquare,
  FileText,
  Star,
  TrendingUp,
  Shield,
  Download,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'features' | 'troubleshooting' | 'advanced';
  readTime: string;
  tags: string[];
  content: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  url: string;
}

const HelpCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'faq'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const helpArticles: HelpArticle[] = [
    {
      id: 'getting-started-1',
      title: 'Getting Started with Marketplace',
      description: 'Learn how to navigate and use the marketplace dashboard effectively',
      category: 'getting-started',
      readTime: '5 min',
      tags: ['beginner', 'dashboard', 'navigation'],
      content: 'Welcome to your marketplace dashboard! This guide will walk you through the key features...'
    },
    {
      id: 'video-call-1',
      title: 'Using Video Calls for Support',
      description: 'How to initiate and manage video calls with customers',
      category: 'features',
      readTime: '3 min',
      tags: ['video', 'support', 'communication'],
      content: 'Video calls allow you to provide face-to-face support to customers...'
    },
    {
      id: 'orders-1',
      title: 'Managing Orders and Fulfillment',
      description: 'Complete guide to order management and fulfillment process',
      category: 'features',
      readTime: '7 min',
      tags: ['orders', 'fulfillment', 'delivery'],
      content: 'Learn how to process orders, manage inventory, and handle delivery logistics...'
    },
    {
      id: 'troubleshooting-1',
      title: 'Common Issues and Solutions',
      description: 'Troubleshoot common problems you might encounter',
      category: 'troubleshooting',
      readTime: '4 min',
      tags: ['troubleshooting', 'issues', 'fix'],
      content: 'This article covers common issues and their solutions...'
    }
  ];

  const videoTutorials: VideoTutorial[] = [
    {
      id: 'video-1',
      title: 'Dashboard Walkthrough',
      description: 'Complete tour of the marketplace dashboard',
      duration: '4:30',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      url: '#'
    },
    {
      id: 'video-2',
      title: 'Video Call Feature Guide',
      description: 'Learn how to use video calls for customer support',
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w-400&h=225&fit=crop',
      url: '#'
    },
    {
      id: 'video-3',
      title: 'Merchant Onboarding Process',
      description: 'Step-by-step guide to onboarding new merchants',
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      url: '#'
    }
  ];

  const faqs = [
    {
      question: 'How do I start a video call with a customer?',
      answer: 'Click the video call button in the chat interface. Make sure your camera and microphone are enabled.'
    },
    {
      question: 'How do I verify a new merchant?',
      answer: 'Go to the Onboarding page, review their documents, and click "Approve" once verified.'
    },
    {
      question: 'Where can I view order analytics?',
      answer: 'Check the Analytics dashboard for detailed order statistics and trends.'
    },
    {
      question: 'How do I assign a chat to another agent?',
      answer: 'Click the "Assign" button in the chat header and select the agent from the list.'
    }
  ];

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
  };

  const renderContent = () => {
    if (selectedArticle) {
      return (
        <div className="p-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Help Center
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h2>
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {selectedArticle.category}
            </span>
            <span className="text-gray-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {selectedArticle.readTime} read
            </span>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700">{selectedArticle.content}</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'articles':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      article.category === 'getting-started' ? 'bg-blue-100 text-blue-700' :
                      article.category === 'features' ? 'bg-green-100 text-green-700' :
                      article.category === 'troubleshooting' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{article.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'videos':
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTutorials.map((video) => (
                <div key={video.id} className="group">
                  <div className="relative rounded-xl overflow-hidden mb-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-blue-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="p-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
      >
        <HelpCircle className="w-5 h-5 group-hover:animate-pulse" />
        <span className="font-medium">Help Center</span>
      </button>

      {/* Help Center Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Help Center</h2>
                      <p className="text-sm text-gray-600">Get help, watch tutorials, and learn features</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help articles, tutorials, or FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex space-x-1 px-6">
                  <button
                    onClick={() => setActiveTab('articles')}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${
                      activeTab === 'articles'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4" />
                      Articles
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${
                      activeTab === 'videos'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Tutorials
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('faq')}
                    className={`px-4 py-3 font-medium text-sm transition-colors ${
                      activeTab === 'faq'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      FAQs
                    </div>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {renderContent()}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Need more help?
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Contact Support
                    </button>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    <Download className="w-4 h-4" />
                    Download User Guide
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpCenter;