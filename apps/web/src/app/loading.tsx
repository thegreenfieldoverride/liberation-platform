import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="relative">
          {/* Animated spinner */}
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Pulsing dots */}
          <div className="flex justify-center space-x-1 mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-400"></div>
          </div>
        </div>
        
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Loading Liberation Tools
        </h2>
        <p className="text-gray-600">
          Preparing your privacy-first experience...
        </p>
      </div>
    </div>
  );
}