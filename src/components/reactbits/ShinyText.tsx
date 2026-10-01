import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerColor?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
  shimmerColor = '#ffffff',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block font-dm font-semibold transition-all duration-300 ${
        disabled ? 'text-slate-400' : 'animate-shine'
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? 'none'
          : `linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, ${shimmerColor} 50%, rgba(255, 255, 255, 0) 70%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: disabled ? 'unset' : 'text',
        WebkitTextFillColor: disabled ? 'inherit' : 'transparent',
        animationDuration: animationDuration,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
