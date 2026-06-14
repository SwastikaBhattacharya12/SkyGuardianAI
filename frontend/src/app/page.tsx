'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CloudRain, Activity, PlaneTakeoff, Users, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen w-screen flex flex-col justify-between overflow-hidden px-8 py-10 md:px-16 md:py-14 text-foreground bg-[#05070A] font-body">
      
      {/* Background Cinematic Photo with Volumetric Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105 pointer-events-none z-0"
        style={{ 
          backgroundImage: "url('/luxury_aviation_hero.png')",
        }}
      />
      
      {/* Gradient & Noise Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070A]/50 via-[#05070A]/85 to-[#05070A] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#05070A]/90 pointer-events-none z-0" />

      {/* Faint Dotted Aviation Crosshair Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#E5C158" strokeWidth="0.5" strokeDasharray="3,9" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#E5C158" strokeWidth="0.5" strokeDasharray="3,9" />
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#E5C158" strokeWidth="0.5" strokeDasharray="3,9" />
        </svg>
      </div>

      {/* Header - Minimalist & Confident */}
      <header className="relative flex items-center justify-between z-10 w-full">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-black/60 border border-brand-gold/20 rounded-sm text-brand-gold backdrop-blur-md">
            <Shield size={18} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold font-ui tracking-[0.35em] text-white">SKYGUARDIAN</h2>
            <p className="text-[7.5px] text-brand-gold font-mono tracking-[0.3em] uppercase mt-0.5">AEROSPACE TECHNOLOGY</p>
          </div>
        </div>
        
        <div className="text-[8.5px] text-slate-400 font-mono tracking-[0.2em] border border-white/5 bg-black/40 px-4 py-2 rounded-sm backdrop-blur-md flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-safety animate-ping" />
          <span>OPERATIONAL DECK // ONLINE</span>
        </div>
      </header>

      {/* Hero Content - Editorial & Spacious */}
      <main className="relative flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto z-10 space-y-16 py-20">
        
        <div className="space-y-8">
          <span className="text-[9px] text-brand-gold font-mono tracking-[0.4em] uppercase block">PRE-DEPARTURE EXPLAINABLE RISK Attributions</span>
          
          <h1 className="text-6xl md:text-8xl font-light font-editorial-hero text-white leading-none tracking-tight">
            Predicting Aviation Risk <br />
            <span className="font-light italic text-brand-gold">
              Before Departure
            </span>
          </h1>
          
          <p className="text-xs md:text-sm text-slate-300 font-body max-w-2xl mx-auto font-light leading-relaxed tracking-wider opacity-85">
            Fusing micro-scale atmospheric grid forecasts, continuous avionics telemetry streams, enroute corridor density, and crew human factors into a secure, explainable decision layer.
          </p>
        </div>

        {/* Minimal Metrics Indicators (Whitespace-focused) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl w-full p-8 rounded-sm font-mono text-center bg-black/45 backdrop-blur-lg border border-white/5 shadow-2xl">
          {[
            { label: 'METAR FORECASTS', desc: 'Convective cell data', icon: CloudRain },
            { label: 'AVIONICS DRIFTS', desc: 'Telemetry snapshots', icon: Activity },
            { label: 'CORRIDOR DENSITY', desc: 'Route slot analytics', icon: PlaneTakeoff },
            { label: 'HUMAN INDICES', desc: 'Crew exhaustion logs', icon: Users }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2 relative group">
              <item.icon size={15} className="text-brand-gold/75 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[8.5px] text-white font-bold tracking-[0.2em]">{item.label}</span>
              <span className="text-[7.5px] text-slate-500 tracking-wider font-light">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Action Button - Elegant Gold Accent */}
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-4 px-10 py-4.5 bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:text-white rounded-sm font-ui text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-500 shadow-2xl group relative overflow-hidden"
          >
            <span className="relative z-10">Enter Command Deck</span>
            <ArrowRight size={12} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
          </Link>
        </div>
      </main>

      {/* Footer - Minimalist Metadata */}
      <footer className="relative flex items-center justify-between text-slate-500 text-[8px] font-mono z-10 border-t border-white/5 pt-6 tracking-widest uppercase">
        <div>
          <span>COMMAND SYSTEM CORE v1.5 // SECURE CONSOLE</span>
        </div>
        <div className="flex gap-6">
          <span>LATENCY: P95 &lt; 2.4S</span>
          <span>//</span>
          <span>AIRSPACE LINK ACTIVE</span>
        </div>
      </footer>

    </div>
  );
}
