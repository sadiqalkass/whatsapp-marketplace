// components/onboarding/VideoTutorials.tsx
'use client';

import { useState } from 'react';
import { Play, Video, Clock, ChevronRight, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoTutorials: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const tutorials = [
    {
      id: 'dashboard-tour',
      title: 'Dashboard Tour',
      description: 'Learn how to navigate your dashboard',
      duration: '4:30',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'video-calls',
      title: 'Video Calls Guide',
      description: 'How to use video calls for support',
      duration: '6:15',
      thumbnail: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'merchant-onboarding',
      title: 'Merchant Onboarding',
      description: 'Step-by-step onboarding process',
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  return (
    <>
      {/* Video Tutorials Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Video Tutorials
            </h3>
            <p className="text-sm text-gray-600 mt-1">Watch tutorials to learn faster</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(tutorial.id)}
            >
              <div className="relative rounded-lg overflow-hidden mb-3">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-blue-600 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tutorial.duration}
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{tutorial.title}</h4>
              <p className="text-sm text-gray-600">{tutorial.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black rounded-xl w-full max-w-4xl overflow-hidden"
            >
              <div className="p-4 bg-gradient-to-r from-gray-900 to-black flex items-center justify-between">
                <h3 className="text-white font-semibold">
                  {tutorials.find(t => t.id === selectedVideo)?.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg">
                    <Maximize2 className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={tutorials.find(t => t.id === selectedVideo)?.embedUrl}
                  title="Video Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoTutorials;