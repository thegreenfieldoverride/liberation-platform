'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-light text-gray-900">Greenfield®</div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/about" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
              About
            </Link>
            <Link href="/tools" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
              Tools
            </Link>
            <Link href="/ai-copilot" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
              AI Co-Pilot
            </Link>
            <Link href="/developers" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
              Resources
            </Link>
            <Link 
              href="/tools/runway-calculator" 
              className="bg-gray-700 text-white px-8 py-4 rounded-2xl font-light hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Begin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-2 pt-6 pb-6 space-y-4">
              <Link 
                href="/about" 
                className="block px-3 py-2 text-gray-500 hover:text-gray-700 font-light transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/tools" 
                className="block px-3 py-2 text-gray-500 hover:text-gray-700 font-light transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Tools
              </Link>
              <Link 
                href="/ai-copilot" 
                className="block px-3 py-2 text-gray-500 hover:text-gray-700 font-light transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                AI Co-Pilot
              </Link>
              <Link 
                href="/developers" 
                className="block px-3 py-2 text-gray-500 hover:text-gray-700 font-light transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Resources
              </Link>
              <Link 
                href="/tools/runway-calculator" 
                className="block px-4 py-4 bg-gray-700 text-white font-light mx-3 text-center rounded-2xl hover:bg-gray-600 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Begin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}