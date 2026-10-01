import React, { useState, useEffect, useRef } from 'react';
import { Brain, Wand2 } from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText';
import SpotlightCard from './reactbits/SpotlightCard';

export const WebAI: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeConceptIndex, setActiveConceptIndex] = useState(2);
  const [synthesizedMode, setSynthesizedMode] = useState<string>("default");

  const concepts = [
    { title: "INPUT", desc: "Sensory telemetry, voice prompts, gaze tracking, ambient noise." },
    { title: "CONTEXT", desc: "Temporal state, user identity, physical space, environmental conditions." },
    { title: "INTENT", desc: "Deciphering what the user wants to achieve rather than which button to tap." },
    { title: "GENERATE", desc: "Composing ephemeral UI primitives on the fly with zero static templates." },
    { title: "ADAPT", desc: "Continuous evolutionary tuning to reduce cognitive friction." },
  ];

  // Neural Connection Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    const nodeCount = 45;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulse: number;
      connections: number[];
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: 1.5 + Math.random() * 2.5,
        pulse: Math.random() * Math.PI * 2,
        connections: [],
      });
    }

    let mouseX = -999;
    let mouseY = -999;
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMouseMove);

    let rafId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.04;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse attraction/deflection
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0.01) {
          const force = (120 - dist) / 120;
          node.x += (dx / dist) * force * 1.5;
          node.y += (dy / dist) * force * 1.5;
        }
      });

      // Draw Neural Synaptic Connection Lines
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.65;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      nodes.forEach((node) => {
        const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(currentRadius, 1), 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleSynthesizeIntent = (mode: string) => {
    setSynthesizedMode(mode);
    if (typeof (window as unknown as { playWebChime?: (f: number, t: OscillatorType) => void }).playWebChime === 'function') {
      (window as unknown as { playWebChime: (f: number, t: OscillatorType) => void }).playWebChime(720, 'sine');
    }
  };

  return (
    <section className="relative min-h-screen w-full py-36 sm:py-48 px-6 sm:px-12 flex flex-col justify-center items-center">
      {/* Chapter 06 Header with Strong Narrative Voice */}
      <div className="max-w-4xl w-full mx-auto mb-16 sm:mb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 font-mono text-xs text-violet-400 uppercase tracking-widest mb-6">
          <Brain className="w-3.5 h-3.5 text-violet-400" />
          CHAPTER 06 // 2023 — 2025
        </div>
        <h2 className="font-syne font-bold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-6">
          THE COGNITIVE SYMBIOSIS
        </h2>
        <p className="font-dm text-xl sm:text-3xl text-slate-200 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
          “THE INTERFACE STARTED RESPONDING TO US.”
        </p>
        <p className="font-dm text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          For thirty years, humanity learned the rigid syntax of computers—menus, forms, and buttons. In 2023, the equation inverted: neural networks began understanding human intent, generating bespoke interfaces on the fly.
        </p>
      </div>

      {/* Neural Synapse Particle Network Canvas */}
      <div className="max-w-5xl w-full mx-auto glass-panel rounded-2xl overflow-hidden border border-violet-500/30 relative mb-8">
        <canvas ref={canvasRef} className="w-full h-[360px] cursor-crosshair block" />

        <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[10px] text-cyan-400 uppercase tracking-widest pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Synaptic Node Network // Interactive Intent Field
        </div>

        {/* Floating Intent Pipeline Words */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-center gap-2">
          {concepts.map((concept, idx) => {
            const isActive = activeConceptIndex === idx;
            return (
              <button
                key={concept.title}
                onClick={() => {
                  setActiveConceptIndex(idx);
                  if (typeof (window as unknown as { playWebChime?: (f: number) => void }).playWebChime === 'function') {
                    (window as unknown as { playWebChime: (f: number) => void }).playWebChime(480 + idx * 60);
                  }
                }}
                data-cursor-hover
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-violet-600/40 border border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105'
                    : 'bg-black/60 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <DecryptedText
                  text={concept.title}
                  speed={25}
                  maxIterations={8}
                  animateOn="hover"
                  className={isActive ? 'text-white' : 'text-slate-300'}
                  encryptedClassName="text-cyan-400"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Concept Explanation */}
      <div className="max-w-2xl w-full mx-auto text-center mb-10 glass-panel p-6 rounded-2xl border border-white/10">
        <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block mb-2">
          Paradigm Step {activeConceptIndex + 1} of {concepts.length}
        </span>
        <h4 className="font-syne font-bold text-2xl text-white mb-2">
          {concepts[activeConceptIndex].title}
        </h4>
        <p className="text-sm text-slate-300 font-dm leading-relaxed">
          {concepts[activeConceptIndex].desc}
        </p>
      </div>

      {/* Interactive Intent Synthesizer */}
      <SpotlightCard
        spotlightColor="rgba(139, 92, 246, 0.25)"
        className="max-w-4xl w-full mx-auto rounded-3xl p-8 border border-white/10 bg-slate-900/40"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-wider">
            <Wand2 className="w-4 h-4 text-cyan-400" />
            Adaptive Interface Synthesis
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Current Schema: {synthesizedMode}
          </span>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Select an intent below to watch how the interface dynamically adapts layout, color tokens, and widgets:
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { id: "spatial-audio", label: "Intent: Spatial Audio Environment" },
            { id: "neural-telemetry", label: "Intent: Real-time Neural Telemetry" },
            { id: "minimal-void", label: "Intent: Zero-Chrome Focused Canvas" },
          ].map((intent) => (
            <button
              key={intent.id}
              onClick={() => handleSynthesizeIntent(intent.id)}
              data-cursor-hover
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-300 ${
                synthesizedMode === intent.id
                  ? 'border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'border border-white/10 glass-panel text-slate-400 hover:text-white'
              }`}
            >
              {intent.label}
            </button>
          ))}
        </div>

        {/* Synthesized Live Viewport Preview */}
        <div
          className={`p-6 rounded-xl border transition-all duration-500 ${
            synthesizedMode === "spatial-audio"
              ? 'bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border-cyan-500/40 text-cyan-100'
              : synthesizedMode === "neural-telemetry"
              ? 'bg-gradient-to-r from-violet-950/60 to-purple-950/60 border-violet-500/40 text-violet-100'
              : synthesizedMode === "minimal-void"
              ? 'bg-black/90 border-slate-700 text-slate-300'
              : 'bg-white/5 border-white/10 text-slate-300'
          }`}
        >
          {synthesizedMode === "spatial-audio" ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                  Synthesized Audio Matrix
                </div>
                <div className="font-syne font-bold text-lg text-white">
                  Binaural 3D Soundstage Active
                </div>
                <div className="text-xs text-slate-400">
                  Adaptive frequencies responding to physical room resonance
                </div>
              </div>
              <div className="flex gap-1.5 items-end h-8">
                {[40, 70, 95, 60, 85, 30, 90, 50, 75].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 bg-cyan-400 rounded-t animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : synthesizedMode === "neural-telemetry" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { k: "INTENT CONFIDENCE", v: "99.4%" },
                { k: "COGNITIVE LOAD", v: "14.2 ms" },
                { k: "ADAPTIVE NODES", v: "128 active" },
                { k: "LATENCY", v: "0.4 ms" },
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-lg bg-black/40 border border-violet-500/20">
                  <div className="text-[10px] font-mono text-violet-400">{m.k}</div>
                  <div className="text-base font-bold text-white font-mono">{m.v}</div>
                </div>
              ))}
            </div>
          ) : synthesizedMode === "minimal-void" ? (
            <div className="py-6 text-center">
              <span className="font-mono text-xs tracking-widest text-slate-500 uppercase block mb-1">
                Zero Chrome Mode
              </span>
              <div className="font-syne text-xl text-white font-light">
                All superfluous layout discarded. Thought alone drives the viewport.
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center font-mono">
              [Waiting for intent input... Choose an intent archetype above to trigger UI generation]
            </div>
          )}
        </div>
      </SpotlightCard>
    </section>
  );
};
