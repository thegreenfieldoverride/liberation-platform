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
      width={size} 
      height={typeof size === 'number' ? size * 0.625 : size} 
      viewBox="0 0 160 100" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Two overlapping heart shapes forming butterfly wings */}
      <g 
        fill="none" 
        stroke={color} 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        
        {/* Left wing - heart shape */}
        <path d="M 80 50
                 C 65 35, 45 35, 35 50
                 C 25 65, 35 75, 50 75
                 C 65 75, 80 65, 80 50 Z" />
        
        {/* Right wing - mirrored heart shape */}
        <path d="M 80 50
                 C 95 35, 115 35, 125 50
                 C 135 65, 125 75, 110 75
                 C 95 75, 80 65, 80 50 Z" />
        
        {/* Small antennae */}
        <line x1="75" y1="35" x2="70" y2="25" strokeWidth="2" />
        <line x1="85" y1="35" x2="90" y2="25" strokeWidth="2" />
        
        {/* Small dots at antenna tips */}
        <circle cx="70" cy="25" r="1" fill={color}/>
        <circle cx="90" cy="25" r="1" fill={color}/>
        
      </g>
    </svg>
  );
}

// Export default for easier importing
export default MariposaLogo;