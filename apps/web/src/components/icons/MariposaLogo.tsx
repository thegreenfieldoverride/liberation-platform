import React from 'react';
import Image from 'next/image';

interface MariposaLogoProps {
  size?: number | string;
  className?: string;
  isDark?: boolean;
}

export function MariposaLogo({ 
  size = 40, 
  className = "",
  isDark = false 
}: MariposaLogoProps) {
  return (
    <Image
      src="/mariposa-black.png"
      alt="Mariposa butterfly logo"
      width={typeof size === 'number' ? size : 40}
      height={typeof size === 'number' ? size : 40}
      className={`${className} ${isDark ? 'brightness-0 invert' : ''}`}
      priority
    />
  );
}

// Export default for easier importing
export default MariposaLogo;