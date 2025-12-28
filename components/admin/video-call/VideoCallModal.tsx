// components/admin/video-call/VideoCallModal.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Share2, 
  Smartphone, // Changed from ScreenShareOff
  PhoneOff,
  User,
  Maximize2,
  Settings,
  MessageSquare,
  FileText,
  Camera,
  Volume2,
  VolumeX,
  Users,
  Circle, // Changed from Record
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callType: 'support' | 'dispute' | 'verification';
  participantName: string;
  participantRole: 'admin' | 'merchant' | 'customer';
  onScreenShare?: () => Promise<void>;
  onRecord?: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  callType,
  participantName,
  participantRole,
  onScreenShare,
  onRecord,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: string, time: string}>>([
    { text: 'Hello! How can I help you today?', sender: 'Support Agent', time: '10:00 AM' },
    { text: 'I\'m having issues with my order delivery', sender: 'You', time: '10:01 AM' },
    { text: 'I can help with that. Can you share your screen to show me the issue?', sender: 'Support Agent', time: '10:02 AM' },
  ]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  // Simulate call duration timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleScreenShare = async () => {
    if (onScreenShare) {
      await onScreenShare();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  const handleRecord = () => {
    if (onRecord) {
      onRecord();
    }
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      alert('Recording started. This call will be recorded for quality assurance.');
    }
  };

  const handleLeaveCall = () => {
    if (isRecording) {
      if (confirm('Recording is in progress. Are you sure you want to end the call?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        text: chatMessage,
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
      
      setTimeout(() => {
        const responses = [
          "I understand. Let me check that for you.",
          "Can you please provide more details?",
          "I'll help you resolve this issue.",
          "Thank you for sharing that information.",
          "Let me guide you through the solution."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
          text: randomResponse,
          sender: participantName,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages(prev => [...prev, responseMessage]);
      }, 1000);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCallTypeBadge = () => {
    const config = {
      support: { color: 'bg-blue-100 text-blue-700', icon: Users, label: 'Support Call' },
      dispute: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Dispute Resolution' },
      verification: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Verification' },
    };
    
    const { color, icon: Icon, label } = config[callType];
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  const renderConnectionIndicator = () => {
    const config = {
      excellent: { color: 'bg-green-500', label: 'Excellent' },
      good: { color: 'bg-yellow-500', label: 'Good' },
      poor: { color: 'bg-red-500', label: 'Poor' },
    };
    
    const { color, label } = config[connectionQuality];
    
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden w-full max-w-6xl h-[90vh] flex flex-col border border-gray-800 shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-white font-semibold text-lg">Live Video Call</span>
              </div>
              {renderCallTypeBadge()}
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-4 h-4" />
                <span>{participantName} • {participantRole}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 px-3 py-1 rounded-lg">
                <span className="text-white font-mono font-semibold">
                  {formatDuration(callDuration)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Video Grid */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Remote Video */}
                <div className="relative bg-gray-950 rounded-2xl overflow-hidden border-2 border-gray-800 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-700">
                        <User className="w-16 h-16 text-gray-600" />
                      </div>
                      <p className="text-gray-400">{participantName}</p>
                      <p className="text-sm text-gray-500 mt-1">{participantRole}</p>
                    </div>
                    
                    {isVideoEnabled && (
                      <div className="absolute inset-0">
                        <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay info */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <p className="text-white font-medium">{participantName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isAudioEnabled ? (
                        <Volume2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-xs text-gray-300">Speaking now</span>
                    </div>
                  </div>
                </div>

                {/* Local Video */}
                <div className="relative bg-gray-950 rounded-2xl overflow-hidden border-2 border-blue-500/50 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    {isVideoEnabled ? (
                      <div className="w-full h-full relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <Camera className="w-16 h-16 text-gray-700" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-gray-700">
                          <VideoOff className="w-12 h-12 text-gray-600" />
                        </div>
                        <p className="text-gray-400">Camera Off</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay info */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <p className="text-white font-medium">You</p>
                    <div className="flex items-center gap-2 mt-1">
                      {isVideoEnabled ? (
                        <Video className="w-4 h-4 text-green-400" />
                      ) : (
                        <VideoOff className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-xs text-gray-300">
                        {isVideoEnabled ? 'Camera On' : 'Camera Off'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Screen Share Preview */}
                {isScreenSharing && (
                  <div className="lg:col-span-2 relative bg-gray-950 rounded-2xl overflow-hidden border-2 border-green-500/50 mt-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-6">
                      <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center">
                        <div className="text-center">
                          <Share2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <p className="text-gray-300 font-medium">Screen Sharing Active</p>
                          <p className="text-sm text-gray-500 mt-2">Displaying your screen to participants</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-green-600/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-green-400 text-sm font-medium">Live Screen Share</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Connection Status Bar */}
              <div className="mt-6 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                  {renderConnectionIndicator()}
                  <span className="text-sm text-gray-400">
                    Video: {isVideoEnabled ? 'HD 720p' : 'Off'} • Audio: {isAudioEnabled ? 'Clear' : 'Muted'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-sm">Recording</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            {showChat && (
              <motion.div
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                className="w-96 border-l border-gray-800 bg-gray-900 flex flex-col"
              >
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Call Chat
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Messages are saved for this call</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl ${msg.sender === 'You' ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-gray-800/50 border border-gray-700/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-medium ${msg.sender === 'You' ? 'text-blue-300' : 'text-gray-300'}`}>
                          {msg.sender}
                        </span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-200">{msg.text}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="px-6 py-4 bg-gradient-to-t from-gray-900 to-black border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Video Toggle */}
                <button
                  onClick={handleToggleVideo}
                  className={`p-4 rounded-2xl transition-all ${isVideoEnabled ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
                
                {/* Audio Toggle */}
                <button
                  onClick={handleToggleAudio}
                  className={`p-4 rounded-2xl transition-all ${isAudioEnabled ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
                
                {/* Screen Share */}
                <button
                  onClick={handleScreenShare}
                  className={`p-4 rounded-2xl transition-all ${isScreenSharing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                  title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
                >
                  {isScreenSharing ? <Smartphone className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                </button>
                
                {/* Chat Toggle */}
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`p-4 rounded-2xl transition-all ${showChat ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                  title="Toggle chat panel"
                >
                  <MessageSquare className="w-6 h-6" />
                </button>
                
                {/* Record */}
                <button
                  onClick={handleRecord}
                  className={`p-4 rounded-2xl transition-all ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <Circle className="w-6 h-6" />
                </button>
                
                {/* Settings */}
                <button
                  className="p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  title="Call settings"
                >
                  <Settings className="w-6 h-6" />
                </button>
              </div>
              
              {/* End Call Button */}
              <button
                onClick={handleLeaveCall}
                className="px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-3 font-semibold shadow-lg shadow-red-600/20"
              >
                <PhoneOff className="w-6 h-6" />
                End Call
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-4 flex items-center justify-center gap-6">
              {callType === 'dispute' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Escalate Issue</span>
                </button>
              )}
              
              {callType === 'support' && (
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Create Support Ticket</span>
                </button>
              )}
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm">Full Screen</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCallModal;