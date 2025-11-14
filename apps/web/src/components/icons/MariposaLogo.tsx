import React from 'react';

interface MariposaLogoProps {
  size?: number | string;
  className?: string;
  color?: string;
}

export function MariposaLogo({ 
  size = 40, 
  className = "", 
  color = "currentColor" 
}: MariposaLogoProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 140" 
      width={size} 
      height={typeof size === 'number' ? size * 0.7 : size} 
      className={className}
      style={{ color }}
    >
      <g fill="currentColor">
        
        {/* Left half butterfly with proper anchor point */}
        <path d="M 100 70
                 C 80 40, 40 30, 10 35
                 L 20 70
                 C 10 75, 15 90, 35 95
                 C 50 100, 70 95, 85 90
                 C 80 100, 70 120, 50 130
                 C 30 140, 20 120, 30 110
                 C 40 100, 60 105, 75 100
                 C 85 95, 95 85, 100 70 Z" />
        
        {/* Right half butterfly with proper anchor point */}
        <path d="M 100 70
                 C 120 40, 160 30, 190 35
                 L 180 70
                 C 190 75, 185 90, 165 95
                 C 150 100, 130 95, 115 90
                 C 120 100, 130 120, 150 130
                 C 170 140, 180 120, 170 110
                 C 160 100, 140 105, 125 100
                 C 115 95, 105 85, 100 70 Z" />
        
        {/* Shorter torso with more wing gap and less rounded tip */}
        <path d="M 100 78
                 L 92 90
                 L 97 132
                 C 98.5 133, 101.5 133, 103 132
                 L 108 90
                 Z" />
        
        {/* Smaller antennae closer to center merging point */}
        <path d="M 97 50 Q 92 40, 90 35" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="90" cy="35" r="1" />
        
        <path d="M 103 50 Q 108 40, 110 35" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="110" cy="35" r="1" />
        
      </g>
    </svg>
  );
}

// Export default for easier importing
export default MariposaLogo;