import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundSystemProps {
  onToggleSound?: (enabled: boolean) => void;
}

export const SoundSystem: React.FC<SoundSystemProps> = ({ onToggleSound }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const chordOscsRef = useRef<OscillatorNode[]>([]);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // 1. Sub drone (55Hz A1)
      const drone = ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.setValueAtTime(55, ctx.currentTime);
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.12, ctx.currentTime);
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();
      droneOscRef.current = drone;

      // 2. Ethereal ambient chords (110Hz, 164.8Hz, 220Hz, 329.6Hz)
      const freqs = [110, 164.81, 220, 329.63, 440];
      const oscs: OscillatorNode[] = [];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + idx * 100, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.025 / (idx + 1), ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        oscs.push(osc);
      });
      chordOscsRef.current = oscs;

      // Fade in master
      master.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 3.0);
    } catch {
      console.warn("Web Audio API not supported or user blocked");
    }
  }, []);

  const toggleSound = () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        initAudio();
      } else if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(0.4, audioCtxRef.current.currentTime + 1.0);
      }
      setIsPlaying(true);
      onToggleSound?.(true);
    } else {
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        masterGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);
      }
      setIsPlaying(false);
      onToggleSound?.(false);
    }
  };

  // Expose sound triggers globally for interaction
  useEffect(() => {
    const playInteractionChime = (freq = 440, type: OscillatorType = 'sine') => {
      if (!isPlaying || !audioCtxRef.current || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    };

    (window as unknown as { playWebChime: typeof playInteractionChime }).playWebChime = playInteractionChime;

    return () => {
      delete (window as unknown as { playWebChime?: typeof playInteractionChime }).playWebChime;
    };
  }, [isPlaying]);

  return (
    <button
      onClick={toggleSound}
      data-cursor-hover
      title={isPlaying ? "Mute ambient soundscape" : "Enable atmospheric audio experience"}
      aria-label={isPlaying ? "Mute sound" : "Enable sound"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full glass-panel border border-white/10 hover:border-cyan-500/40 text-xs tracking-widest text-slate-300 hover:text-cyan-300 transition-all duration-300 group"
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </>
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
        )}
      </div>
      <span className="hidden sm:inline-block font-mono uppercase text-[10px]">
        {isPlaying ? "SOUND ON" : "AUDIO OFF"}
      </span>
    </button>
  );
};
