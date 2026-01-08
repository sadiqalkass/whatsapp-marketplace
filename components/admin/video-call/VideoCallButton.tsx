// // components/video-call/VideoCallButton.tsx (Frontend Only)
// 'use client';

// import React, { useState } from 'react';
// import { Video, Phone, VideoOff, PhoneOff, Clock, CheckCircle } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import VideoCallModal from './VideoCallModal';

// interface VideoCallButtonProps {
//   callType: 'support' | 'dispute' | 'verification';
//   participantName: string;
//   participantRole: 'admin' | 'merchant' | 'customer';
//   disabled?: boolean;
//   size?: 'sm' | 'md' | 'lg';
//   variant?: 'primary' | 'secondary' | 'danger';
//   showLabel?: boolean;
// }

// const VideoCallButton: React.FC<VideoCallButtonProps> = ({
//   callType,
//   participantName,
//   participantRole,
//   disabled = false,
//   size = 'md',
//   variant = 'primary',
//   showLabel = true,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected'>('idle');

//   const sizeClasses = {
//     sm: 'p-2 text-sm',
//     md: 'p-3 text-base',
//     lg: 'p-4 text-lg',
//   };

//   const variantClasses = {
//     primary: 'bg-blue-600 hover:bg-blue-700 text-white',
//     secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
//     danger: 'bg-red-600 hover:bg-red-700 text-white',
//   };

//   const callTypeIcons = {
//     support: Video,
//     dispute: Phone,
//     verification: CheckCircle,
//   };

//   const handleStartCall = () => {
//     if (disabled) return;
    
//     // Simulate call ringing
//     setCallStatus('ringing');
//     setIsDropdownOpen(false);
    
//     // Simulate call acceptance after 3 seconds
//     setTimeout(() => {
//       setCallStatus('connected');
//       setIsModalOpen(true);
//     }, 3000);
//   };

//   const handleEndCall = () => {
//     setCallStatus('idle');
//     setIsModalOpen(false);
//   };

//   const CallIcon = callTypeIcons[callType];

//   if (callStatus === 'ringing') {
//     return (
//       <div className="relative">
//         <motion.button
//           animate={{ scale: [1, 1.05, 1] }}
//           transition={{ repeat: Infinity, duration: 1 }}
//           onClick={() => setCallStatus('idle')}
//           className={`${sizeClasses[size]} ${variantClasses.danger} rounded-lg flex items-center gap-2 font-medium`}
//         >
//           <PhoneOff className="w-5 h-5" />
//           <span>Cancel Call</span>
//         </motion.button>
        
//         {/* Ringing indicator */}
//         <div className="absolute -top-2 -right-2">
//           <div className="relative">
//             <div className="w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
//             <div className="absolute top-1 left-1 w-4 h-4 bg-red-600 rounded-full"></div>
//           </div>
//         </div>
        
//         <div className="mt-2 text-sm text-gray-600 text-center">
//           Calling {participantName}...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="relative">
//         <button
//           onClick={handleStartCall}
//           disabled={disabled}
//           className={`
//             ${sizeClasses[size]} 
//             ${variantClasses[variant]}
//             rounded-lg transition-all duration-200 
//             disabled:opacity-50 disabled:cursor-not-allowed
//             flex items-center gap-2 font-medium
//             hover:shadow-lg active:scale-95
//           `}
//         >
//           <CallIcon className="w-5 h-5" />
//           {showLabel && (
//             <span>
//               {callType === 'dispute' ? 'Dispute Call' : 
//                callType === 'verification' ? 'Verify Now' : 
//                'Video Support'}
//             </span>
//           )}
//         </button>

//         {/* Info tooltip */}
//         <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//           <div className="flex items-center gap-1">
//             <Clock className="w-3 h-3" />
//             <span>Connect instantly</span>
//           </div>
//           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
//         </div>

//         {/* Alternative call options dropdown */}
//         <AnimatePresence>
//           {isDropdownOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.95 }}
//               className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
//             >
//               <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
//                 <p className="font-semibold text-gray-900">Start a Call</p>
//                 <p className="text-sm text-gray-600">Choose call type with {participantName}</p>
//               </div>
              
//               <div className="p-2 space-y-1">
//                 <button
//                   onClick={handleStartCall}
//                   className="w-full p-3 text-left hover:bg-blue-50 rounded-lg flex items-center gap-3 group"
//                 >
//                   <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
//                     <Video className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Video Call</p>
//                     <p className="text-sm text-gray-500">Face-to-face with screen sharing</p>
//                   </div>
//                 </button>
                
//                 <button
//                   onClick={() => {
//                     setIsDropdownOpen(false);
//                     alert('Voice calls coming soon!');
//                   }}
//                   className="w-full p-3 text-left hover:bg-green-50 rounded-lg flex items-center gap-3 group"
//                 >
//                   <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
//                     <Phone className="w-5 h-5 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Voice Call</p>
//                     <p className="text-sm text-gray-500">Audio only, faster connection</p>
//                   </div>
//                 </button>
//               </div>
              
//               <div className="p-3 bg-gray-50 border-t border-gray-200">
//                 <div className="flex items-center justify-between text-xs text-gray-600">
//                   <span>Call Type:</span>
//                   <span className="font-medium capitalize">{callType}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
//                   <span>With:</span>
//                   <span className="font-medium">{participantName}</span>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <VideoCallModal
//         isOpen={isModalOpen}
//         onClose={handleEndCall}
//         callType={callType}
//         participantName={participantName}
//         participantRole={participantRole}
//         onScreenShare={async () => {
//           // Simulate screen share permission request
//           const granted = confirm('Allow screen sharing? This will share your entire screen.');
//           return granted;
//         }}
//         onRecord={() => {
//           // Recording logic would go here
//           console.log('Recording toggled');
//         }}
//       />
//     </>
//   );
// };

// export default VideoCallButton;
// components/admin/video-call/VideoCallButton.tsx
'use client';

import React, { useState } from 'react';
import { Video, Phone, Users, AlertCircle, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VideoCallButtonProps {
  callType: 'support' | 'dispute' | 'consultation';
  participantName: string;
  participantRole?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'primary' | 'danger' | 'success';
  onCallInitiated?: () => void;
}

const VideoCallButton: React.FC<VideoCallButtonProps> = ({
  callType,
  participantName,
  participantRole = 'customer',
  size = 'md',
  showLabel = true,
  variant = 'primary',
  onCallInitiated
}) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700';
      case 'success':
        return 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getCallTypeInfo = () => {
    switch (callType) {
      case 'dispute':
        return {
          label: 'Dispute Resolution',
          icon: AlertCircle,
          description: 'Resolve issues with screen sharing'
        };
      case 'consultation':
        return {
          label: 'Consultation',
          icon: Users,
          description: 'Product consultation and advice'
        };
      case 'support':
      default:
        return {
          label: 'Support Call',
          icon: Phone,
          description: 'Customer support assistance'
        };
    }
  };

  const callTypeInfo = getCallTypeInfo();

  const handleStartCall = () => {
    setIsCalling(true);
    // Simulate call connection
    setTimeout(() => {
      setIsCalling(false);
      setIsConnected(true);
    }, 2000);

    // Call the WhatsApp service to initiate video call
    try {
      const whatsappService = require('@/services/whatsapp.service').default;
      whatsappService.initiateVideoCall({
        participantId: participantName.toLowerCase().replace(/\s+/g, '-'),
        participantName,
        callType
      });
    } catch (error) {
      console.error('Error initiating video call:', error);
    }

    onCallInitiated?.();
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsCalling(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  // If call is in progress, show call controls
  if (isConnected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl">
          {/* Call header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {participantName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{participantName}</h3>
                <p className="text-gray-400 text-sm">{callTypeInfo.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected
              </span>
            </div>
          </div>

          {/* Video area */}
          <div className="bg-gray-800 rounded-lg h-96 mb-6 flex items-center justify-center relative">
            {isVideoOff ? (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-16 h-16 text-gray-500" />
                </div>
                <p className="text-gray-400">Video is turned off</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-4xl">
                      {participantName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="w-24 h-16 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                      <span className="text-white text-xs">You</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Call controls overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-4 bg-gray-900 bg-opacity-75 px-6 py-3 rounded-full">
                <button
                  onClick={handleToggleMute}
                  className={`p-3 rounded-full ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleToggleVideo}
                  className={`p-3 rounded-full ${isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={handleEndCall}
                  className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
                >
                  <Phone className="w-5 h-5 rotate-135" />
                </button>
                <button
                  className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Call info */}
          <div className="text-center text-gray-400 text-sm">
            <p>Screen sharing is available. Click the share button to share your screen.</p>
            <p className="mt-1">Call duration: 02:45</p>
          </div>
        </div>
      </div>
    );
  }

  // If calling (connecting), show connecting state
  if (isCalling) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-8 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Connecting to {participantName}</h3>
          <p className="text-gray-400 mb-6">{callTypeInfo.description}</p>
          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <button
            onClick={handleEndCall}
            className="mt-8 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Call
          </button>
        </div>
      </div>
    );
  }

  // Default state - show call button
  return (
    <button
      onClick={handleStartCall}
      disabled={isCalling}
      className={`
        flex items-center gap-2 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md
        ${getVariantStyles()}
        ${getSizeStyles()}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Video className="w-5 h-5" />
      {showLabel && (
        <span>
          {callType === 'dispute' ? 'Dispute Call' : 
           callType === 'consultation' ? 'Consultation' : 'Video Call'}
        </span>
      )}
    </button>
  );
};

export default VideoCallButton;