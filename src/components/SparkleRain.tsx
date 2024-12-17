import { useState, useEffect } from 'react';
import { Sparkle } from 'lucide-react';

interface SparkleProps {
  style: React.CSSProperties;
}

const SparkleRain = () => {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);

  useEffect(() => {
    const createSparkle = () => {
      const sparkle = {
        style: {
          position: 'fixed',
          left: `${Math.random() * 100}%`,
          top: '-20px',
          color: 'white',
          opacity: 0.6,
          transform: 'scale(0.8)',
          animation: 'fall 8s linear infinite', // Changed from 4s to 8s
          pointerEvents: 'none',
          zIndex: 0,
        } as React.CSSProperties,
      };

      setSparkles((prev) => [...prev, sparkle]);

      // Remove sparkle after animation completes
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s !== sparkle));
      }, 8000); // Changed from 4000 to 8000 to match animation duration
    };

    // Create new sparkle every 2000ms instead of 500ms
    const interval = setInterval(createSparkle, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {sparkles.map((sparkle, index) => (
        <Sparkle
          key={index}
          size={24}
          style={sparkle.style}
        />
      ))}
    </>
  );
};

export default SparkleRain;