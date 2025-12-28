// components/video-call/VideoCallButton.tsx (Frontend Only)
'use client';

import React, { useState } from 'react';
import { Video, Phone, VideoOff, PhoneOff, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCallModal from './VideoCallModal';

interface VideoCallButtonProps {
  callType: 'support' | 'dispute' | 'verification';
  participantName: string;
  participantRole: 'admin' | 'merchant' | 'customer';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger';
  showLabel?: boolean;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  callType,
  participantName,
  participantRole,
  disabled = false,
  size = 'md',
  variant = 'primary',
  showLabel = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected'>('idle');

  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const callTypeIcons = {
    support: Video,
    dispute: Phone,
    verification: CheckCircle,
  };

  const handleStartCall = () => {
    if (disabled) return;
    
    // Simulate call ringing
    setCallStatus('ringing');
    setIsDropdownOpen(false);
    
    // Simulate call acceptance after 3 seconds
    setTimeout(() => {
      setCallStatus('connected');
      setIsModalOpen(true);
    }, 3000);
  };

  const handleEndCall = () => {
    setCallStatus('idle');
    setIsModalOpen(false);
  };

  const CallIcon = callTypeIcons[callType];

  if (callStatus === 'ringing') {
    return (
      <div className="relative">
        <motion.button
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          onClick={() => setCallStatus('idle')}
          className={`${sizeClasses[size]} ${variantClasses.danger} rounded-lg flex items-center gap-2 font-medium`}
        >
          <PhoneOff className="w-5 h-5" />
          <span>Cancel Call</span>
        </motion.button>
        
        {/* Ringing indicator */}
        <div className="absolute -top-2 -right-2">
          <div className="relative">
            <div className="w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute top-1 left-1 w-4 h-4 bg-red-600 rounded-full"></div>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600 text-center">
          Calling {participantName}...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={handleStartCall}
          disabled={disabled}
          className={`
            ${sizeClasses[size]} 
            ${variantClasses[variant]}
            rounded-lg transition-all duration-200 
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2 font-medium
            hover:shadow-lg active:scale-95
          `}
        >
          <CallIcon className="w-5 h-5" />
          {showLabel && (
            <span>
              {callType === 'dispute' ? 'Dispute Call' : 
               callType === 'verification' ? 'Verify Now' : 
               'Video Support'}
            </span>
          )}
        </button>

        {/* Info tooltip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Connect instantly</span>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
        </div>

        {/* Alternative call options dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                <p className="font-semibold text-gray-900">Start a Call</p>
                <p className="text-sm text-gray-600">Choose call type with {participantName}</p>
              </div>
              
              <div className="p-2 space-y-1">
                <button
                  onClick={handleStartCall}
                  className="w-full p-3 text-left hover:bg-blue-50 rounded-lg flex items-center gap-3 group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Video Call</p>
                    <p className="text-sm text-gray-500">Face-to-face with screen sharing</p>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    alert('Voice calls coming soon!');
                  }}
                  className="w-full p-3 text-left hover:bg-green-50 rounded-lg flex items-center gap-3 group"
                >
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Voice Call</p>
                    <p className="text-sm text-gray-500">Audio only, faster connection</p>
                  </div>
                </button>
              </div>
              
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Call Type:</span>
                  <span className="font-medium capitalize">{callType}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                  <span>With:</span>
                  <span className="font-medium">{participantName}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <VideoCallModal
        isOpen={isModalOpen}
        onClose={handleEndCall}
        callType={callType}
        participantName={participantName}
        participantRole={participantRole}
        onScreenShare={async () => {
          // Simulate screen share permission request
          const granted = confirm('Allow screen sharing? This will share your entire screen.');
          return granted;
        }}
        onRecord={() => {
          // Recording logic would go here
          console.log('Recording toggled');
        }}
      />
    </>
  );
};

export default VideoCallButton;