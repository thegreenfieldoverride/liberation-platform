'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LibIcon } from '../components/icons/LiberationIcons';

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial value
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate smooth gradient background based on scroll position
  const getBackgroundStyle = () => {
    if (typeof window === 'undefined') {
      return { 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)'
      };
    }
    
    const scrollPercentage = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
    
    // Smooth color transitions based on scroll
    if (scrollPercentage < 0.25) {
      // Corporate stress - dark grays
      const intensity = scrollPercentage * 4;
      return {
        background: `linear-gradient(135deg, 
          hsl(0, 0%, ${10 + intensity * 5}%) 0%, 
          hsl(0, 0%, ${15 + intensity * 5}%) 100%
        )`
      };
    } else if (scrollPercentage < 0.5) {
      // Recognition - warm ambers
      const intensity = (scrollPercentage - 0.25) * 4;
      return {
        background: `linear-gradient(135deg, 
          hsl(${20 + intensity * 15}, ${30 + intensity * 20}%, ${15 + intensity * 10}%) 0%, 
          hsl(${35 + intensity * 10}, ${40 + intensity * 20}%, ${20 + intensity * 15}%) 100%
        )`
      };
    } else if (scrollPercentage < 0.75) {
      // Understanding - soft blues
      const intensity = (scrollPercentage - 0.5) * 4;
      return {
        background: `linear-gradient(135deg, 
          hsl(${220 + intensity * 10}, ${30 + intensity * 20}%, ${15 + intensity * 10}%) 0%, 
          hsl(${210 + intensity * 15}, ${40 + intensity * 20}%, ${25 + intensity * 15}%) 100%
        )`
      };
    } else {
      // Liberation - serene greens
      const intensity = (scrollPercentage - 0.75) * 4;
      return {
        background: `linear-gradient(135deg, 
          hsl(${140 + intensity * 20}, ${25 + intensity * 30}%, ${10 + intensity * 15}%) 0%, 
          hsl(${160 + intensity * 20}, ${35 + intensity * 25}%, ${20 + intensity * 20}%) 100%
        )`
      };
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={getBackgroundStyle()}
    >
      {/* Hero Section - Magazine Takeover Style */}
      <section className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden pt-20">
        <div 
          className="max-w-5xl mx-auto text-left relative z-10"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        >
          <div className="mb-8">
            <div className="text-sm font-display uppercase tracking-widest text-white/70 mb-4">
              The Greenfield Override
            </div>
            <div className="w-16 h-1 bg-white/30 mb-8"></div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-sans font-bold text-white mb-16 leading-[0.9] tracking-tight">
            You're not burned out.
            <br />
            <span className="text-white/60">You're being burned down.</span>
          </h1>
          
          <h2 className="text-4xl md:text-5xl font-sans font-light text-white/90 mb-20 max-w-4xl leading-tight">
            Here's how to rise from the ashes.
          </h2>
          
          <div className="max-w-4xl">
            <p className="text-2xl md:text-3xl font-sans text-white/90 leading-relaxed mb-20 font-light">
              The fluorescent lights hum above your head. The urgent emails pile up. 
              Each project blends into the next, and the phrase "work-life balance" feels like a cruel joke. 
              But you sense something deeper is wrong—there's a spark inside you that's barely hanging on, 
              a sense of purpose that's getting buried by endless corporate fires.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-16">
              <p className="text-xl font-sans text-white leading-relaxed mb-6">
                You are not alone. This isn't laziness, or lack of grit. 
                This is a system that's draining you.
              </p>
              <p className="text-2xl font-sans font-medium text-white">
                <strong>You are being burned down.</strong>
              </p>
            </div>
            
            <div className="space-y-6">
              <p className="text-white/70 font-sans text-lg mb-8">
                Ready to begin your investigation?
              </p>
              <p className="text-white/50 text-sm mb-12 font-sans uppercase tracking-wide">
                Move forward at your own pace.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 max-w-xl">
                <a 
                  href="#manifesto" 
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 text-lg font-sans hover:bg-white/30 transition-all duration-300 rounded-xl border border-white/30 hover-lift glow-hover group inline-flex items-center gap-3"
                >
                  <LibIcon icon="Documentation" size="sm" className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                    Read the Investigation
                  </span>
                </a>
                
                <Link 
                  href="/tools/runway-calculator" 
                  className="border border-white/40 text-white px-8 py-4 text-lg font-sans hover:bg-white/10 transition-all duration-300 rounded-xl backdrop-blur-sm hover-lift group inline-flex items-center gap-3"
                >
                  <LibIcon icon="RunwayCalculator" size="sm" className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                    Skip to Tools
                  </span>
                  <LibIcon icon="Arrow" size="sm" className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* The rest of your content... */}
    </div>
  );
}