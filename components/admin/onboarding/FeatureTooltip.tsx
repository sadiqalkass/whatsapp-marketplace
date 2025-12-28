// components/onboarding/FeatureTooltip.tsx
'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeatureTooltipProps {
  featureId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  showOnce?: boolean;
}

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  featureId,
  title,
  description,
  position = 'top',
  children,
  showOnce = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    if (showOnce) {
      const seenFeatures = JSON.parse(localStorage.getItem('seenFeatures') || '{}');
      if (seenFeatures[featureId]) {
        setHasSeen(true);
      }
    }
  }, [featureId, showOnce]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (showOnce) {
      const seenFeatures = JSON.parse(localStorage.getItem('seenFeatures') || '{}');
      seenFeatures[featureId] = true;
      localStorage.setItem('seenFeatures', JSON.stringify(seenFeatures));
      setHasSeen(true);
    }
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-white border-t-8 border-x-transparent border-x-8 border-b-0',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-white border-b-8 border-x-transparent border-x-8 border-t-0',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-white border-l-8 border-y-transparent border-y-8 border-r-0',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-white border-r-8 border-y-transparent border-y-8 border-l-0'
  };

  if (hasSeen && showOnce) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="relative"
      >
        {children}
        
        {/* Help indicator */}
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute ${positionClasses[position]} z-50`}
          >
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-64">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{title}</h4>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{description}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleDismiss}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Got it
                  </button>
                </div>
              </div>
              <div className={`absolute ${arrowClasses[position]}`}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeatureTooltip;