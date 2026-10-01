import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number;
  scale?: number;
  glareEffect?: boolean;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  maxAngle = 12,
  scale = 1.02,
  glareEffect = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const springConfig = { stiffness: 260, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scaleSpring = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    rotateX.set(-yPct * maxAngle);
    rotateY.set(xPct * maxAngle);
    scaleSpring.set(scale);

    if (glareEffect) {
      setGlarePosition({
        x: (mouseX / width) * 100,
        y: (mouseY / height) * 100,
        opacity: 0.22,
      });
    }
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scaleSpring.set(1);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: scaleSpring,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
      >
        {children}

        {glareEffect && (
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.35), transparent 80%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltedCard;
