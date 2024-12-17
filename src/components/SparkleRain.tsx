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
          animation: 'fall 4s linear infinite',
          pointerEvents: 'none',
          zIndex: 0,
        } as React.CSSProperties,
      };

      setSparkles((prev) => [...prev, sparkle]);

      // Remove sparkle after animation completes
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s !== sparkle));
      }, 4000);
    };

    // Create new sparkle every 500ms
    const interval = setInterval(createSparkle, 500);

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