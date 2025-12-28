// components/onboarding/TourGuide.tsx
'use client';

import { useEffect, useState } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { HelpCircle, X, ArrowRight, ArrowLeft, Play, Book, Video, Sparkles } from 'lucide-react';

interface TourStep {
  element: string;
  title: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  tooltipClass?: string;
}

interface TourGuideProps {
  tourId: string;
  steps: TourStep[];
  autoStart?: boolean;
  onComplete?: () => void;
  onExit?: () => void;
}

const TourGuide: React.FC<TourGuideProps> = ({
  tourId,
  steps,
  autoStart = false,
  onComplete,
  onExit
}) => {
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  useEffect(() => {
    // Check if user has seen this tour before
    const seenTours = JSON.parse(localStorage.getItem('seenTours') || '{}');
    if (seenTours[tourId] && !autoStart) {
      setHasSeenTour(true);
    }

    if (autoStart && !seenTours[tourId]) {
      setTimeout(() => startTour(), 1000);
    }
  }, [tourId, autoStart]);

  const startTour = () => {
    const intro = introJs();
    
    intro.setOptions({
      steps: steps,
      nextLabel: 'Next →',
      prevLabel: '← Back',
      skipLabel: 'Skip',
      doneLabel: 'Finish',
      exitOnOverlayClick: true,
      exitOnEsc: true,
      showProgress: true,
      showBullets: true,
      overlayOpacity: 0.5,
      tooltipClass: 'custom-intro-tooltip',
      highlightClass: 'custom-highlight-class',
    });

    intro.oncomplete(() => {
      setIsTourActive(false);
      const seenTours = JSON.parse(localStorage.getItem('seenTours') || '{}');
      seenTours[tourId] = true;
      localStorage.setItem('seenTours', JSON.stringify(seenTours));
      onComplete?.();
    });

    intro.onexit(() => {
      setIsTourActive(false);
      onExit?.();
    });

    intro.start();
    setIsTourActive(true);
  };

  const skipTour = () => {
    const seenTours = JSON.parse(localStorage.getItem('seenTours') || '{}');
    seenTours[tourId] = true;
    localStorage.setItem('seenTours', JSON.stringify(seenTours));
    setHasSeenTour(true);
    setIsTourActive(false);
  };

  if (hasSeenTour && !autoStart) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isTourActive && (
        <button
          onClick={startTour}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
        >
          <Sparkles className="w-5 h-5 group-hover:animate-spin" />
          <span className="font-medium">Take a Tour</span>
        </button>
      )}
    </div>
  );
};

export default TourGuide;