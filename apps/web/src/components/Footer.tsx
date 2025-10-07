import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Explore */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  About
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/runway-calculator" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  Start Reading
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wider">Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/tools/runway-calculator" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  Runway Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/real-hourly-wage" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  Real Hourly Wage
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/developers" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  Reach Out
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/greenfield-override" 
                  className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Source
                </a>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wider">Credits</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-all duration-300 font-light">
                  Privacy Promise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm font-light">
              Built with radical empathy for those ready to rise from the ashes.
            </div>
            <div className="mt-4 md:mt-0">
              <span className="text-sm text-gray-400 font-light">
                Privacy-first • Open source • Liberation tools
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}