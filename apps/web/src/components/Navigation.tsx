'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LibIcon } from './icons/LiberationIcons';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-black/5' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className={`text-2xl font-light transition-all duration-300 ${
                scrolled ? 'text-gray-900' : 'text-white'
              } group-hover:scale-105`}>
                <span className="font-sans">Greenfield Override</span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              About
            </Link>
            <Link href="/manifesto" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Manifesto
            </Link>
            <Link href="/tools" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Tools
            </Link>
            <Link href="/ai-copilot" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              AI Co-Pilot
            </Link>
            <Link href="/developers" className={`relative px-3 py-2 rounded-lg transition-all duration-300 font-light ${
              scrolled 
                ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}>
              Resources
            </Link>
            <Link 
              href="/tools/runway-calculator" 
              className={`px-6 py-3 rounded-xl font-light transition-all duration-300 transform hover:scale-105 ${
                scrolled
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
                scrolled 
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
            scrolled ? 'border-t border-gray-200/50 bg-white/95' : 'border-t border-white/20 bg-black/20'
          } backdrop-blur-md`}>
            <div className="px-4 pt-6 pb-6 space-y-3">
              <Link 
                href="/about" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/tools" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Tools
              </Link>
              <Link 
                href="/ai-copilot" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                AI Co-Pilot
              </Link>
              <Link 
                href="/developers" 
                className={`block px-4 py-3 rounded-xl font-light transition-all duration-300 ${
                  scrolled 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Resources
              </Link>
              <Link 
                href="/tools/runway-calculator" 
                className={`block px-6 py-4 font-light text-center rounded-xl transition-all duration-300 mt-4 ${
                  scrolled
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