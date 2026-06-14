'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Flight } from '@/lib/api';
import { AlertTriangle, Compass, ShieldAlert, Radio, ArrowUpRight } from 'lucide-react';

export default function DashboardHome() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredFlight, setHoveredFlight] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getFlights();
        setFlights(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch operational airspace data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-critical border-critical/20 bg-critical/5';
    if (score >= 30) return 'text-warning border-warning/20 bg-warning/5';
    return 'text-accent border-accent/20 bg-accent/5';
  };

  const getRiskBorderClass = (score: number) => {
    if (score >= 60) return 'neon-glow-critical';
    if (score >= 30) return 'neon-glow-warning';
    return 'neon-glow-normal';
  };

  const getRiskBarColor = (score: number) => {
    if (score >= 60) return 'bg-critical shadow-[0_0_12px_#F87171]';
    if (score >= 30) return 'bg-warning shadow-[0_0_12px_#FBBF24]';
    return 'bg-accent shadow-[0_0_12px_#7DD3FC]';
  };

  const getStatusText = (status: string) => {
    if (status === 'Active') return 'IN FLIGHT';
    if (status === 'Completed') return 'ARCHIVED';
    return 'STANDBY';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="h-5 w-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-[9.5px] text-slate-500 font-mono tracking-[0.25em] uppercase font-bold">Initializing operations flight deck...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-critical/5 border border-critical/15 rounded-sm text-center space-y-5 font-mono glass-panel">
        <ShieldAlert size={32} className="mx-auto text-critical animate-pulse" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">DATALINK CONNECTION FAULT</h3>
        <p className="text-[10.5px] text-red-300/80 leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-critical/10 hover:bg-critical/20 text-white rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] border border-critical/30 transition-all cursor-pointer"
        >
          Re-establish Link
        </button>
      </div>
    );
  }

  const activeFlights = flights.filter(f => f.status === 'Active' || f.status === 'Scheduled');

  return (
    <div className="space-y-16">
      
      {/* Airspace Header Bar */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="text-lg md:text-xl font-normal font-editorial-section tracking-wider uppercase text-white flex items-center gap-2.5">
            <Compass className="text-brand-gold animate-spin" style={{ animationDuration: '40s' }} size={15} />
            <span>Airspace Monitoring Deck</span>
          </h2>
          <p className="text-[8.5px] text-slate-500 font-mono mt-1 tracking-widest uppercase">SECTOR: NORTH ATLANTIC CORRIDORS // SECURE ACARS TELEMETRY</p>
        </div>
        
        {/* High contrast alert counters */}
        <div className="text-[9px] font-mono flex items-center gap-5 tracking-wider">
          <span className="text-slate-400">ACTIVE ALERTS: <span className="text-warning font-bold">{flights.reduce((sum, f) => sum + f.alert_count, 0)}</span></span>
          <span className="text-slate-700">//</span>
          <span className="text-slate-400">RADAR TRACKS: <span className="text-accent font-bold">{flights.filter(f => f.status === 'Active').length}</span></span>
        </div>
      </div>

      {/* Centerpiece - Large Tactical Radar Screen */}
      <div className="glass-panel rounded-sm p-8 shadow-2xl relative overflow-hidden h-[400px] flex flex-col justify-between">
        
        {/* Radar concentric circular grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="relative w-[560px] h-[560px] rounded-full border border-brand-gold/15 flex items-center justify-center">
            <div className="w-[420px] h-[420px] rounded-full border border-brand-gold/10 flex items-center justify-center">
              <div className="w-[280px] h-[280px] rounded-full border border-brand-gold/5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
              </div>
            </div>
            {/* Compass crosshairs */}
            <div className="absolute top-0 bottom-0 left-1/2 w-[0.5px] bg-brand-gold/10" />
            <div className="absolute left-0 right-0 top-1/2 h-[0.5px] bg-brand-gold/10" />
            
            {/* Elegant slow sweeping sweep */}
            <div className="radar-sweep-effect" />
          </div>
        </div>

        {/* Tactical overlay information */}
        <div className="relative flex justify-between text-[8px] font-mono text-slate-500 z-10 tracking-wider">
          <div className="space-y-0.5">
            <span>GRID_REF: NAT-381A // AUTO_ACQUISITION</span>
            <span className="block">WIND: 280° AT 24KT // BARO: 1013.2 MB</span>
          </div>
          <div className="text-right space-y-0.5">
            <span>RECEIVER: ACTIVE_SYNC // ACARS_METAR</span>
            <span className="block text-brand-gold font-bold">ATMOSPHERIC GRID STABLE</span>
          </div>
        </div>

        {/* Trajectory vector paths */}
        <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {activeFlights.map((f, idx) => {
            const xPositions = [35, 70, 48, 22, 62];
            const yPositions = [45, 25, 65, 50, 72];
            const x = xPositions[idx % xPositions.length];
            const y = yPositions[idx % yPositions.length];
            
            const xOrigin = 15 + (idx * 15);
            const yOrigin = 88;
            
            const isCritical = f.composite_risk >= 60;
            const isWarning = f.composite_risk >= 30;
            const pathColor = isCritical ? 'rgba(248, 113, 113, 0.15)' : isWarning ? 'rgba(251, 191, 36, 0.15)' : 'rgba(125, 211, 252, 0.12)';
            const vectorColor = isCritical ? '#F87171' : isWarning ? '#FBBF24' : '#7DD3FC';
            
            return (
              <g key={`traj-${f.flight_id}`}>
                <path 
                  d={`M ${xOrigin}% ${yOrigin}% Q ${(xOrigin + x)/2}% ${(yOrigin + y)/2 - 12}% ${x}% ${y}%`} 
                  fill="none" 
                  stroke={pathColor}
                  strokeWidth="0.8" 
                  strokeDasharray="4,6" 
                />
                <path 
                  d={`M ${xOrigin}% ${yOrigin}% Q ${(xOrigin + x)/2}% ${(yOrigin + y)/2 - 12}% ${x}% ${y}%`} 
                  fill="none" 
                  stroke={vectorColor}
                  strokeWidth="1.2" 
                  className="animated-flight-line opacity-25" 
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Flight vector target symbols */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {activeFlights.map((f, idx) => {
            const xPositions = [35, 70, 48, 22, 62];
            const yPositions = [45, 25, 65, 50, 72];
            const x = xPositions[idx % xPositions.length];
            const y = yPositions[idx % yPositions.length];
            
            const isTarget = f.flight_number === 'AI102';
            const isCritical = f.composite_risk >= 60;
            const isWarning = f.composite_risk >= 30;
            
            const markerColor = isCritical ? 'fill-critical/15 stroke-critical' : 
                                isWarning ? 'fill-warning/15 stroke-warning' : 'fill-accent/15 stroke-accent';
            
            const headingAngle = (idx * 73 + 30) % 360;
            
            return (
              <div
                key={f.flight_id}
                className="absolute pointer-events-auto cursor-pointer group"
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setHoveredFlight(f.flight_id)}
                onMouseLeave={() => setHoveredFlight(null)}
              >
                <Link href={`/dashboard/flight/${f.flight_id}`} className="relative flex items-center justify-center">
                  
                  {/* Flashing alerting ring (highly visible Level 1) */}
                  {isTarget && (
                    <span className="absolute h-9 w-9 rounded-full border border-critical telemetry-pulse-ring" />
                  )}
                  
                  {/* Tactical aerospace plane symbol */}
                  <svg 
                    className={`h-4.5 w-4.5 ${markerColor} transition-transform duration-300 group-hover:scale-125`}
                    style={{ transform: `rotate(${headingAngle}deg)` }}
                    viewBox="0 0 100 100"
                  >
                    <path 
                      d="M50,5 L58,35 L95,45 L58,55 L62,80 L75,87 L50,84 L25,87 L38,80 L42,55 L5,45 L42,35 Z" 
                      strokeWidth="6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                  {/* Aircraft label tag (highly readable) */}
                  <span className={`absolute top-6 left-6 bg-[#0E1014]/95 border border-white/5 rounded-sm px-2 py-0.5 text-[8.5px] font-mono text-slate-300 font-bold tracking-wider opacity-75 group-hover:opacity-100 transition-opacity z-20 ${
                    isCritical ? 'border-critical/30 text-critical font-black shadow-[0_0_8px_rgba(248,113,113,0.1)]' : ''
                  }`}>
                    {f.flight_number} ({f.composite_risk})
                  </span>
                </Link>
              </div>
            );
          })}

          {/* Meteorological Convective radar cell */}
          <div className="absolute right-[10%] top-[8%] w-40 h-40 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <path d="M25,55 Q50,25 90,35 Q110,65 80,90 Q45,100 25,75 Z" fill="rgba(216, 154, 60, 0.03)" stroke="rgba(216, 154, 60, 0.15)" strokeWidth="0.5" strokeDasharray="3,3" />
              <path d="M45,58 Q60,40 80,50 Q85,70 70,80 Q50,82 45,58 Z" fill="rgba(201, 76, 76, 0.05)" stroke="rgba(201, 76, 76, 0.2)" strokeWidth="0.8" />
              <path d="M55,60 Q65,50 72,55 Q70,68 62,70 Z" fill="rgba(201, 76, 76, 0.15)" />
              
              <line x1="85" y1="35" x2="95" y2="25" stroke="rgba(216, 154, 60, 0.3)" strokeWidth="0.7" />
              <line x1="95" y1="25" x2="90" y2="25" stroke="rgba(216, 154, 60, 0.3)" strokeWidth="0.7" />
              <line x1="93" y1="27" x2="88" y2="27" stroke="rgba(216, 154, 60, 0.3)" strokeWidth="0.7" />

              <text x="22" y="18" className="fill-warning text-[6px] font-mono tracking-wider uppercase opacity-50 font-bold">SECTOR_TURB_WARN</text>
              <text x="35" y="105" className="fill-critical text-[6px] font-mono tracking-wider uppercase opacity-60 font-bold">METAR_CONVECTIVE</text>
            </svg>
          </div>
        </div>

        {/* Legend (Whitespace-spaced, highly readable) */}
        <div className="relative flex items-center gap-6 text-[8px] font-mono text-slate-400 z-10 pt-5 tracking-wider uppercase font-bold">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-critical shadow-[0_0_8px_#F87171]" />
            <span>CRITICAL RISK (&ge;60)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning shadow-[0_0_8px_#FBBF24]" />
            <span>ELEVATED WATCH (30-59)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_#7DD3FC]" />
            <span>OPTIMAL STATUS (&lt;30)</span>
          </div>
        </div>

      </div>

      {/* Flight Cards Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-[9.5px] font-bold font-ui tracking-[0.25em] text-slate-500 uppercase">ACTIVE_FLIGHT_RISK_MONITORS</h3>
          <span className="text-[8px] text-slate-400 font-ui tracking-widest uppercase">SELECT FOR DETAILS & BRIEFING</span>
        </div>

        {/* Asymmetrical Layout grid of Flight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {flights.map((f) => {
            const isTarget = f.flight_number === 'AI102';
            
            const subScores = isTarget 
              ? { weather: 85, health: 75, traffic: 40, human: 45 } 
              : f.flight_number === 'SG202'
              ? { weather: 20, health: 68, traffic: 35, human: 30 }
              : { weather: 10, health: 15, traffic: 20, human: 15 };

            return (
              <div 
                key={f.flight_id}
                className={`p-8 bg-[#0E1014]/25 border border-white/[0.03] rounded-sm transition-all duration-500 relative overflow-hidden select-none glass-panel ${getRiskBorderClass(f.composite_risk)}`}
              >
                {/* Minimal glowing status bar accent */}
                <div className={`absolute top-0 bottom-0 left-0 w-[2.5px] ${getRiskBarColor(f.composite_risk)}`} />

                {/* Card Header (Typography driven) */}
                <div className="flex items-start justify-between pb-4">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-white font-ui tracking-wide">{f.flight_number}</span>
                      <span className="text-[9px] text-slate-400 font-mono">// {f.aircraft_tail} ({f.aircraft_type})</span>
                    </div>
                    <div className="text-[10px] font-ui text-accent font-semibold tracking-wider flex items-center gap-2">
                      <span>{f.origin_airport}</span>
                      <span className="text-slate-500 text-[8px]">➡️</span>
                      <span>{f.destination_airport}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`text-[12px] font-bold px-3 py-1 rounded-sm border font-mono tracking-wider ${getRiskColor(f.composite_risk)}`}>
                      {f.composite_risk}
                    </span>
                    <span className="text-[7.5px] text-slate-400 block mt-2 font-ui tracking-widest font-bold uppercase">{getStatusText(f.status)}</span>
                  </div>
                </div>

                {/* Sub-score progress indicators (spacious, thin high-contrast bars) */}
                <div className="mt-5 space-y-4 font-ui text-[9.5px] tracking-wider uppercase">
                  {[
                    { label: 'WEATHER RISK', score: subScores.weather },
                    { label: 'AVIONICS HEALTH', score: subScores.health },
                    { label: 'TRAFFIC DENSITY', score: subScores.traffic },
                    { label: 'HUMAN FACTOR', score: subScores.human }
                  ].map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex justify-between text-slate-400">
                        <span>{sub.label}</span>
                        <span className={`font-mono ${sub.score >= 70 ? 'text-critical' : sub.score >= 40 ? 'text-warning' : 'text-accent'}`}>
                          {sub.score}%
                        </span>
                      </div>
                      
                      {/* High readability thin telemetry bar */}
                      <div className="h-[2px] bg-black/60 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full transition-all duration-1000" 
                          style={{ 
                            width: `${sub.score}%`,
                            backgroundColor: sub.score >= 70 ? '#F87171' : sub.score >= 40 ? '#FBBF24' : '#7DD3FC'
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trigger Footer */}
                <div className="mt-8 flex items-center justify-between text-[9px] font-ui font-bold tracking-wider uppercase">
                  <div>
                    {f.alert_count > 0 ? (
                      <span className="flex items-center gap-2 text-warning">
                        <AlertTriangle size={13} className="animate-pulse" />
                        <span>{f.alert_count} OPERATIONS BLOCKS</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">RELEASE CLEARANCE: READY</span>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/flight/${f.flight_id}`}
                    className="inline-flex items-center gap-1.5 text-brand-gold hover:text-white transition-colors group cursor-pointer"
                  >
                    <span>ANALYZE</span>
                    <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
