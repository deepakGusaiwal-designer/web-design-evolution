import React, { useRef, useState } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  color: string;
}

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkCount?: number;
  sparkSize?: number;
  className?: string;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = '#00f0ff',
  sparkCount = 8,
  className = '',
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = [sparkColor, '#8b5cf6', '#38bdf8', '#f59e0b', '#ffffff'];
    const newSparks: Spark[] = Array.from({ length: sparkCount }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x,
      y,
      angle: (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
      distance: 24 + Math.random() * 28,
      color: colors[i % colors.length],
    }));

    setSparks((prev) => [...prev, ...newSparks]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative inline-block overflow-visible ${className}`}
    >
      {children}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="pointer-events-none absolute w-1.5 h-1.5 rounded-full z-50 animate-spark"
          style={{
            left: spark.x,
            top: spark.y,
            backgroundColor: spark.color,
            boxShadow: `0 0 8px ${spark.color}`,
            transform: `translate(${Math.cos(spark.angle) * spark.distance}px, ${Math.sin(spark.angle) * spark.distance}px) scale(0)`,
            transition: 'transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.55s ease-out',
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
};

export default ClickSpark;
