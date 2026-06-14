'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api, FlightDetail } from '@/lib/api';
import { AlertCircle, ArrowLeft, Cloud, Activity, Radio, Users, Compass, Shield, ShieldCheck } from 'lucide-react';

export default function FlightDetailPage() {
  const { id } = useParams() as { id: string };
  const [detail, setDetail] = useState<FlightDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getFlightDetail(id);
        setDetail(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load telemetry link.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-critical border-critical/20 bg-critical/5 shadow-[0_0_15px_rgba(201,76,76,0.1)]';
    if (score >= 30) return 'text-warning border-warning/20 bg-warning/5 shadow-[0_0_15px_rgba(216,154,60,0.1)]';
    return 'text-accent border-accent/20 bg-accent/5 shadow-[0_0_15px_rgba(125,211,252,0.1)]';
  };

  const getSegmentColor = (score: number) => {
    if (score >= 70) return 'stroke-critical fill-critical/5';
    if (score >= 35) return 'stroke-warning fill-warning/5';
    return 'stroke-accent fill-accent/5';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="h-5 w-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-[9.5px] text-slate-500 font-mono tracking-[0.25em] uppercase font-bold">Establishing aircraft ACARS connection...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-critical/5 border border-critical/15 rounded-sm text-center space-y-5 font-mono glass-panel">
        <AlertCircle size={32} className="mx-auto text-critical animate-pulse" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">DATALINK CONNECTION LOST</h3>
        <p className="text-[10.5px] text-red-300/80 leading-relaxed">{error || 'Flight records not found.'}</p>
        <Link
          href="/dashboard"
          className="inline-block px-5 py-2.5 bg-[#0E1014] border border-white/5 text-slate-400 hover:text-white rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer"
        >
          Return to Board
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Header - Editorial Briefing Title */}
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="p-2.5 bg-[#0E1014]/60 border border-white/5 hover:border-brand-gold/45 text-slate-400 hover:text-white rounded-sm transition-all glass-panel cursor-pointer"
          >
            <ArrowLeft size={14} />
          </Link>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg md:text-xl font-normal font-editorial-section tracking-wide text-white">Aviation Safety Briefing: {detail.flight_number}</h2>
              <span className="text-[9.5px] text-slate-500 font-mono">({detail.origin_airport} to {detail.destination_airport})</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
              AIRFRAME: <span className="text-slate-300 font-bold">{detail.aircraft.tail_number}</span> // TYPE: {detail.aircraft.type}
            </p>
          </div>
        </div>
        
        {/* Large Composite Risk release Badge */}
        <div className="flex items-center gap-4">
          <div className="text-right font-ui text-[8.5px] text-slate-500 tracking-widest uppercase font-bold">
            <span>Composite Risk</span>
            <span className="block mt-0.5">RELEASE INDEX</span>
          </div>
          <div className={`font-mono font-bold text-lg px-4.5 py-1.5 rounded-sm border tracking-wider ${getRiskColor(detail.composite_risk)}`}>
            {detail.composite_risk}
          </div>
        </div>
      </div>

      {/* Flight Route Corridor Analysis */}
      <div className="glass-panel border-white/5 rounded-sm p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-5">
          <h3 className="text-[9.5px] font-bold uppercase tracking-[0.25em] font-ui text-white flex items-center gap-2">
            <Compass className="text-brand-gold animate-spin" style={{ animationDuration: '45s' }} size={14} />
            <span>Flight Route Corridor Analysis</span>
          </h3>
          <span className="text-[8px] text-slate-500 font-ui tracking-widest uppercase">EN-ROUTE HAZARD ZONES</span>
        </div>
        
        {/* SVG Route Map */}
        <div className="relative h-40 bg-black/20 border border-white/[0.03] rounded-sm overflow-hidden flex items-center justify-center">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div className="w-44 h-44 rounded-full border border-brand-gold" />
            <div className="w-88 h-88 rounded-full border border-brand-gold" />
          </div>

          <svg className="w-full h-full max-w-lg px-8" viewBox="0 0 500 100">
            {/* Background path line */}
            <path d="M 40 50 Q 250 15 460 50" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="6" strokeLinecap="round" />
            
            {/* Route segments */}
            {detail.route_segments.map((seg, idx) => {
              const xStart = 40 + idx * 105;
              const xEnd = 40 + (idx + 1) * 105;
              const colorClass = getSegmentColor(seg.weather_risk_score);
              const x1 = xStart;
              const y1 = 50 - Math.sin((xStart - 40) / 420 * Math.PI) * 35;
              const x2 = xEnd;
              const y2 = 50 - Math.sin((xEnd - 40) / 420 * Math.PI) * 35;
              
              const xMid = (x1 + x2) / 2;
              const yMid = (y1 + y2) / 2;
              const hazard = seg.dominant_hazard.toLowerCase();
              
              return (
                <g key={idx} className="group">
                  {/* Weather Overlays */}
                  {seg.weather_risk_score >= 35 && (
                    <>
                      {/* Storm cells */}
                      {(hazard.includes('convective') || hazard.includes('storm') || hazard.includes('thunderstorm')) && (
                        <g className="opacity-30">
                          <circle cx={xMid} cy={yMid} r="18" fill="rgba(201, 76, 76, 0.03)" stroke="#C94C4C" strokeWidth="0.4" strokeDasharray="1,2" />
                          <circle cx={xMid} cy={yMid} r="9" fill="rgba(201, 76, 76, 0.1)" stroke="#C94C4C" strokeWidth="0.7" />
                          <path d={`M ${xMid-2} ${yMid+3} L ${xMid+2} ${yMid-3} M ${xMid-4} ${yMid} L ${xMid+4} ${yMid}`} stroke="#C94C4C" strokeWidth="0.8" />
                        </g>
                      )}
                      
                      {/* Turbulence */}
                      {(hazard.includes('turbulence') || hazard.includes('clear air')) && (
                        <g className="opacity-35" stroke="#D89A3C" strokeWidth="0.7" fill="none">
                          <path d={`M ${xMid-10} ${yMid-3} Q ${xMid-5} ${yMid-7} ${xMid} ${yMid-3} T ${xMid+10} ${yMid-3}`} />
                          <path d={`M ${xMid-10} ${yMid+1} Q ${xMid-5} ${yMid-3} ${xMid} ${yMid+1} T ${xMid+10} ${yMid+1}`} />
                        </g>
                      )}

                      {/* Icing */}
                      {(hazard.includes('icing') || hazard.includes('ice') || hazard.includes('freezing')) && (
                        <g className="opacity-35" stroke="#7DD3FC" strokeWidth="0.7" fill="rgba(125,211,252,0.04)">
                          <polygon points={`${xMid-8},${yMid-4} ${xMid},${yMid-8} ${xMid+8},${yMid-4} ${xMid+8},${yMid+4} ${xMid},${yMid+8} ${xMid-8},${yMid+4}`} />
                          <line x1={xMid} y1={yMid-8} x2={xMid} y2={yMid+8} />
                        </g>
                      )}

                      {/* Wind shear */}
                      {(hazard.includes('shear') || hazard.includes('wind')) && (
                        <g className="opacity-35" stroke="#D89A3C" strokeWidth="0.7" fill="none">
                          <line x1={xMid-8} y1={yMid-2} x2={xMid+8} y2={yMid+2} />
                          <line x1={xMid+2} y1={yMid} x2={xMid+6} y2={yMid-5} />
                          <line x1={xMid-3} y1={yMid-1} x2={xMid+1} y2={yMid-6} />
                        </g>
                      )}
                    </>
                  )}

                  {/* Segment Curve line */}
                  <path 
                    d={`M ${x1} ${y1} L ${x2} ${y2}`}
                    fill="none" 
                    className={`${colorClass.split(' ')[0]} transition-all duration-300`}
                    strokeWidth="4.5" 
                    strokeLinecap="round" 
                  />
                </g>
              );
            })}

            {/* Jet marker along path */}
            {(() => {
              const isEnroute = detail.status === 'Active';
              const t = isEnroute ? 0.55 : detail.status === 'Completed' ? 1.0 : 0.0;
              
              const acX = (1-t)*(1-t)*40 + 2*(1-t)*t*250 + t*t*460;
              const acY = (1-t)*(1-t)*50 + 2*(1-t)*t*15 + t*t*50;
              
              const dx = 2*(1-t)*(250-40) + 2*t*(460-250);
              const dy = 2*(1-t)*(15-50) + 2*t*(50-15);
              const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;

              if (detail.status === 'Scheduled') return null;

              return (
                <g transform={`translate(${acX}, ${acY}) rotate(${angleDeg})`}>
                  <circle cx="0" cy="0" r="10" className="fill-brand-gold/10 stroke-brand-gold/20 stroke-[0.5px] telemetry-pulse-ring" />
                  <path 
                    d="M0,-8 L2,-3 L10,0 L2,2 L3,6 L6,8 L0,7 L-6,8 L-3,6 L-2,2 L-10,0 L-2,-3 Z" 
                    fill="#E5C158" 
                    stroke="#060709" 
                    strokeWidth="0.5" 
                  />
                </g>
              );
            })()}

            {/* Airport Nodes */}
            <circle cx="40" cy="50" r="4" className="fill-brand-gold stroke-background stroke-2" />
            <text x="32" y="70" className="fill-slate-400 text-[8.5px] font-mono font-bold tracking-wider">{detail.origin_airport}</text>
            
            <circle cx="460" cy="50" r="4" className="fill-brand-gold stroke-background stroke-2" />
            <text x="445" y="70" className="fill-slate-400 text-[8.5px] font-mono font-bold tracking-wider">{detail.destination_airport}</text>
          </svg>
        </div>

        {/* Route segment card columns (editorial spacing) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {detail.route_segments.map((seg, idx) => (
            <div key={idx} className="p-6 bg-[#0E1014]/25 border border-white/[0.03] rounded-sm font-ui text-[9.5px] space-y-2.5 glass-panel">
              <div className="flex items-center justify-between pb-3">
                <span className="text-[7.5px] text-slate-500 font-bold font-mono uppercase tracking-widest">SEGMENT_0{seg.segment_index}</span>
                <span className={`font-bold font-mono px-1.5 py-0.5 rounded-sm text-[8px] border border-white/5 ${
                  seg.weather_risk_score >= 70 ? 'text-critical bg-critical/5' : 
                  seg.weather_risk_score >= 35 ? 'text-warning bg-warning/5' : 'text-safety bg-safety/5'
                }`}>
                  {seg.weather_risk_score}%
                </span>
              </div>
              <h4 className="font-semibold text-white text-[10.5px] truncate tracking-wide uppercase">{seg.name}</h4>
              <p className="text-[9px] text-slate-400 truncate">{seg.dominant_hazard}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-score report cards (high contrast) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'WEATHER INTELLIGENCE', val: detail.sub_scores.weather, icon: Cloud, desc: 'Corridor forecast coordinate cell' },
          { label: 'AIRFRAME STATUS', val: detail.sub_scores.health, icon: Activity, desc: 'Telemetry snap envelope deviations' },
          { label: 'AIRSPACE TRAFFIC', val: detail.sub_scores.traffic, icon: Radio, desc: 'Corridor slot occupancy vectors' },
          { label: 'HUMAN FACTORS', val: detail.sub_scores.human, icon: Users, desc: 'Crew exhaustion & duty logs' }
        ].map((sub, idx) => (
          <div key={idx} className="p-6 bg-[#0E1014]/25 border border-white/[0.03] rounded-sm relative overflow-hidden shadow-xl glass-panel font-ui">
            <div className="flex items-center gap-2 pb-3">
              <sub.icon size={12} className="text-brand-gold" />
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{sub.label}</span>
            </div>
            
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-xl font-bold text-white font-mono">{sub.val}</span>
              <span className="text-[9px] text-slate-500 font-mono">/ 100</span>
            </div>
            <p className="text-[8.5px] text-slate-400 mt-1.5 leading-normal font-body font-light">{sub.desc}</p>
          </div>
        ))}
      </div>

      {/* Briefing Attribution & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Attribution & Time Series */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Explainable AI executive brief */}
          <div className="glass-panel border-white/5 rounded-sm p-8 shadow-xl space-y-4">
            <h3 className="text-[9.5px] font-bold uppercase tracking-[0.25em] font-ui text-white flex items-center gap-2">
              <Shield size={13} className="text-brand-gold" />
              <span>Attribution Summary Brief</span>
            </h3>
            <div className="p-6 bg-black/20 border border-white/[0.03] rounded-sm font-body text-[11px] leading-relaxed text-slate-300">
              <span className="text-slate-500 font-mono font-bold block mb-2.5 uppercase tracking-widest text-[8px]">// SYSTEM ANALYSIS LOG FEED</span>
              <p className="whitespace-pre-line font-light">{detail.explanation}</p>
            </div>
          </div>

          {/* Time Series Table */}
          <div className="glass-panel border-white/5 rounded-sm p-8 shadow-xl space-y-4">
            <h3 className="text-[9.5px] font-bold uppercase tracking-[0.25em] font-ui text-white flex items-center gap-2">
              <Activity size={13} className="text-brand-gold" />
              <span>Time-Series Diagnostics Log</span>
            </h3>
            
            <div className="border border-white/[0.03] rounded-sm overflow-hidden">
              <div className="grid grid-cols-5 bg-[#0E1014]/40 px-5 py-3 text-[7.5px] font-ui font-bold uppercase tracking-widest text-slate-500">
                <span>Timestamp</span>
                <span>Hydraulic</span>
                <span>Engine EGT</span>
                <span>Oil Press</span>
                <span>Battery</span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {detail.telemetry_history.map((tel, idx) => (
                  <div key={idx} className="grid grid-cols-5 px-5 py-2.5 text-[9.5px] font-mono text-slate-300 hover:bg-[#0E1014]/30 transition-colors">
                    <span className="text-slate-500">{new Date(tel.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                    <span className={tel.hydraulic_pressure < 2800 ? "text-critical font-bold" : "text-white"}>
                      {tel.hydraulic_pressure ? `${Math.round(tel.hydraulic_pressure)} PSI` : '—'}
                    </span>
                    <span className={tel.engine_egt > 650 ? "text-warning font-bold" : "text-white"}>
                      {tel.engine_egt ? `${Math.round(tel.engine_egt)}°C` : '—'}
                    </span>
                    <span className="text-white">{tel.oil_pressure ? `${Math.round(tel.oil_pressure)} PSI` : '—'}</span>
                    <span className="text-white">{tel.battery_charge ? `${Math.round(tel.battery_charge)}%` : '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Operations Blocks (Highly visible alerts) */}
        <div className="glass-panel border-white/5 rounded-sm p-8 shadow-xl flex flex-col min-h-full">
          <h3 className="text-[9.5px] font-bold uppercase tracking-[0.25em] font-ui text-white flex items-center gap-2 mb-4">
            <AlertCircle size={13} className="text-warning animate-pulse" />
            <span>Operations Blocks</span>
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 font-ui">
            {detail.alerts.length > 0 ? (
              detail.alerts.map((al, idx) => (
                <div key={idx} className={`p-5 border border-white/[0.03] rounded-sm text-[10px] space-y-2 relative overflow-hidden ${
                  al.severity === 'Critical' 
                    ? 'bg-critical/5 border-critical/20 text-red-200' 
                    : 'bg-warning/5 border-warning/20 text-amber-200'
                }`}>
                  <div className="flex items-center justify-between text-[7.5px] font-bold uppercase tracking-widest font-ui">
                    <span className={al.severity === 'Critical' ? "text-critical" : "text-warning"}>
                      {al.severity} Severity
                    </span>
                    <span className="opacity-60">{al.category}</span>
                  </div>
                  <p className="leading-relaxed font-body font-light">{al.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center border border-dashed border-white/[0.08] rounded-sm">
                <ShieldCheck size={18} className="text-safety mb-2" />
                <span className="text-[8px] text-slate-500 font-mono uppercase tracking-[0.2em]">Zero Blocks Detected</span>
                <span className="text-[7.5px] text-slate-400 mt-1 px-4 font-body font-light">Aircraft ready for standard release routing.</span>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
