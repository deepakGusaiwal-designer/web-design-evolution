import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusItem {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
}

interface TrueFocusProps {
  items: TrueFocusItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  accentColor?: string;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  items,
  activeId,
  onSelect,
  className = '',
  accentColor = '#00f0ff',
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSelected = hoveredId || activeId || items[0]?.id;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg ${className}`}
    >
      {items.map((item) => {
        const isFocused = item.id === currentSelected;

        return (
          <button
            key={item.id}
            onClick={() => onSelect?.(item.id)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-dm font-medium transition-colors z-10 flex items-center gap-2 focus:outline-none cursor-pointer"
          >
            {isFocused && (
              <motion.div
                layoutId="true-focus-frame"
                className="absolute inset-0 rounded-xl border border-cyan-400/60 bg-cyan-500/15 shadow-[0_0_20px_rgba(0,240,255,0.25)] z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              >
                {/* Corner reticle brackets */}
                <span
                  className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2"
                  style={{ borderColor: accentColor }}
                />
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2"
                  style={{ borderColor: accentColor }}
                />
                <span
                  className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2"
                  style={{ borderColor: accentColor }}
                />
                <span
                  className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2"
                  style={{ borderColor: accentColor }}
                />
              </motion.div>
            )}

            <span className={`relative z-10 ${isFocused ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}>
              {item.label}
            </span>

            {item.badge && (
              <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isFocused ? 'bg-cyan-400/30 text-cyan-200' : 'bg-white/10 text-slate-400'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TrueFocus;
