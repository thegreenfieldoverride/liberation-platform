import React from 'react';
import Link from 'next/link';
import { LibIcon } from './icons/LiberationIcons';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/runway-calculator" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Start Liberation
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Liberation Tools</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/tools/runway-calculator" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Runway Calculator
                </Link>
              </li>
              <li>
                <Link href="/real-hourly-wage" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Real Hourly Wage
                </Link>
              </li>
              <li>
                <Link href="/cognitive-debt-assessment" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Cognitive Debt Assessment
                </Link>
              </li>
              <li>
                <Link href="/values-vocation-matcher" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Values-to-Vocation Matcher
                </Link>
              </li>
              <li>
                <Link href="/ai-copilot" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  AI Co-Pilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Connect</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/developers" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Developer Resources
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/greenfield-override" 
                  className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Source
                  <LibIcon icon="ExternalLink" size="xs" />
                </a>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Mission</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-all duration-300 font-light hover:translate-x-1 inline-block">
                  Privacy Promise
                </Link>
              </li>
              <li>
                <span className="text-gray-400 text-sm">
                  Liberation License
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm font-light mb-4 md:mb-0">
              Built with radical empathy for those ready to rise from the ashes.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400 font-light">
                Privacy-first • Open source • Liberation tools
              </span>
              <div className="flex items-center gap-2">
                <LibIcon icon="Privacy" size="xs" className="text-green-400 animate-pulse" />
                <span className="text-xs text-green-400">100% Client-Side</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}