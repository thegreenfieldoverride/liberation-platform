'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LibIcon } from './icons/LiberationIcons';
import { MariposaLogo } from './icons/MariposaLogo';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Pages that have light backgrounds and need dark navigation
  const lightBackgroundPages = [
    '/tools',
    '/insight-engine', 
    '/cognitive-debt-assessment',
    '/tools/runway-calculator',
    '/tools/real-hourly-wage',
    '/tools/small-bets-portfolio',
    '/tools/values-vocation-matcher',
    '/about',
    '/privacy',
    '/developers',
    '/funding',
    '/projects'
  ];
  
  // Always check pathname, but be conservative about scrolled state
  const isLightBackground = lightBackgroundPages.some(page => pathname?.startsWith(page));
  const safeScrolled = mounted ? scrolled : false;

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      handleScroll(); // Set initial state
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return <NavigationContent isLightBackground={isLightBackground} scrolled={safeScrolled} isOpen={isOpen} setIsOpen={setIsOpen} />;
}

function NavigationContent({ 
  isLightBackground, 
  scrolled, 
  isOpen, 
  setIsOpen 
}: {
  isLightBackground: boolean;
  scrolled: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isLightBackground
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-black/5'
        : scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-black/5' 
          : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <MariposaLogo 
                size={32}
                isDark={!(isLightBackground || scrolled)}
                className="transition-all duration-300 group-hover:scale-110"
              />
              <div className={`text-2xl font-medium transition-all duration-300 ${
                isLightBackground || scrolled ? 'text-gray-900' : 'text-white'
              } group-hover:scale-105`}>
                <span className="font-sans">Greenfield Override</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/tools" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              isLightBackground || scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Tools
            </Link>
            <Link href="/projects" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              isLightBackground || scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Projects
            </Link>
            <Link href="/funding" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              isLightBackground || scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Funding
            </Link>
            <Link href="/about" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              isLightBackground || scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              About
            </Link>
            <Link 
              href="/tools/runway-calculator" 
              className={`px-6 py-3 rounded-xl font-light transition-all duration-300 transform hover:scale-105 ${
                isLightBackground || scrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
              }`}
            >
              Begin Liberation
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-300 focus:outline-none ${
                isLightBackground || scrolled 
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <LibIcon 
                icon={isOpen ? "Close" : "Menu"} 
                size="lg" 
                aria-label={isOpen ? "Close menu" : "Open menu"}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`md:hidden transition-all duration-300 ${
            isLightBackground || scrolled ? 'border-t border-gray-200/50 bg-white/95' : 'border-t border-white/20 bg-black/20'
          } backdrop-blur-md`}>
            <div className="px-4 pt-6 pb-6 space-y-3">
              <Link 
                href="/tools" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  isLightBackground || scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Tools
              </Link>
              <Link 
                href="/projects" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  isLightBackground || scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
              <Link 
                href="/funding" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  isLightBackground || scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Funding
              </Link>
              <Link 
                href="/about" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  isLightBackground || scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/tools/runway-calculator" 
                className={`block px-6 py-4 font-light text-center rounded-xl transition-all duration-300 mt-4 ${
                  isLightBackground || scrolled
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Begin Liberation
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}