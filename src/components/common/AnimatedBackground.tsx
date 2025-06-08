'use client';

import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  );
};

export default AnimatedBackground;
