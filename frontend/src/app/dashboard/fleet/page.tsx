'use client';

import React, { useState, useEffect } from 'react';
import { api, FleetMember } from '@/lib/api';
import { AlertCircle, ShieldCheck, Clock, Settings, ChevronRight, Activity } from 'lucide-react';

export default function FleetPage() {
  const [fleet, setFleet] = useState<FleetMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FleetMember | null>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('fuselage');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getFleetHealth();
        setFleet(data);
        if (data.length > 0) {
          setSelectedMember(data[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to query fleet statistics.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getSubsystemData = (sub: string, tel: any) => {
    if (!tel) return null;
    
    if (sub === 'nose') {
      const bat = tel.battery_charge || 100;
      let status = 'Normal';
      let colorClass = 'text-safety';
      let nodeColor = '#34D399';
      let pulseRate = '3s';
      let riskWeight = 0;
      
      if (bat < 90) {
        status = 'Critical';
        colorClass = 'text-critical';
        nodeColor = '#F87171';
        pulseRate = '0.7s';
        riskWeight = 20;
      } else if (bat < 93) {
        status = 'Warning';
        colorClass = 'text-warning';
        nodeColor = '#FBBF24';
        pulseRate = '1.5s';
        riskWeight = 10;
      }
      return {
        name: 'Nose Avionics & Electrical',
        valueText: `Battery: ${Math.round(bat)}% // DC Bus: 28.2V`,
        rangeText: `Battery >= 92% // DC Bus 24-30V`,
        status, colorClass, nodeColor, pulseRate, riskWeight
      };
    }
    
    if (sub === 'left_engine') {
      const egt = tel.engine_egt || 0;
      const oil = tel.oil_pressure || 0;
      let status = 'Normal';
      let colorClass = 'text-safety';
      let nodeColor = '#34D399';
      let pulseRate = '3s';
      let riskWeight = 0;
      
      const egtCritical = egt > 650;
      const egtWarning = egt > 620;
      const oilCritical = oil < 40 || oil > 75;
      const oilWarning = oil < 45 || oil > 70;
      
      if (egtCritical || oilCritical) {
        status = 'Critical';
        colorClass = 'text-critical';
        nodeColor = '#F87171';
        pulseRate = '0.7s';
        riskWeight = 25;
      } else if (egtWarning || oilWarning) {
        status = 'Warning';
        colorClass = 'text-warning';
        nodeColor = '#FBBF24';
        pulseRate = '1.5s';
        riskWeight = 12;
      }
      return {
        name: 'Left Powerplant Systems',
        valueText: `EGT: ${Math.round(egt)}°C // Oil Press: ${Math.round(oil)} PSI`,
        rangeText: `EGT < 630°C // Oil Press 45-70 PSI`,
        status, colorClass, nodeColor, pulseRate, riskWeight
      };
    }
    
    if (sub === 'right_engine') {
      const egt = (tel.engine_egt || 0) * 0.98;
      const oil = (tel.oil_pressure || 0) * 1.02;
      let status = 'Normal';
      let colorClass = 'text-safety';
      let nodeColor = '#34D399';
      let pulseRate = '3s';
      let riskWeight = 0;
      
      const egtCritical = egt > 650;
      const egtWarning = egt > 620;
      const oilCritical = oil < 40 || oil > 75;
      const oilWarning = oil < 45 || oil > 70;
      
      if (egtCritical || oilCritical) {
        status = 'Critical';
        colorClass = 'text-critical';
        nodeColor = '#F87171';
        pulseRate = '0.7s';
        riskWeight = 25;
      } else if (egtWarning || oilWarning) {
        status = 'Warning';
        colorClass = 'text-warning';
        nodeColor = '#FBBF24';
        pulseRate = '1.5s';
        riskWeight = 12;
      }
      return {
        name: 'Right Powerplant Systems',
        valueText: `EGT: ${Math.round(egt)}°C // Oil Press: ${Math.round(oil)} PSI`,
        rangeText: `EGT < 630°C // Oil Press 45-70 PSI`,
        status, colorClass, nodeColor, pulseRate, riskWeight
      };
    }
    
    if (sub === 'fuselage') {
      const hyd = tel.hydraulic_pressure || 0;
      let status = 'Normal';
      let colorClass = 'text-safety';
      let nodeColor = '#34D399';
      let pulseRate = '3s';
      let riskWeight = 0;
      
      if (hyd < 2800) {
        status = 'Critical';
        colorClass = 'text-critical';
        nodeColor = '#F87171';
        pulseRate = '0.7s';
        riskWeight = 35;
      } else if (hyd < 2920) {
        status = 'Warning';
        colorClass = 'text-warning';
        nodeColor = '#FBBF24';
        pulseRate = '1.5s';
        riskWeight = 15;
      }
      return {
        name: 'Center Fuselage & Hydraulics',
        valueText: `Hydraulics: ${Math.round(hyd)} PSI`,
        rangeText: `Hydraulic Press 2900 - 3150 PSI`,
        status, colorClass, nodeColor, pulseRate, riskWeight
      };
    }
    
    if (sub === 'tail') {
      return {
        name: 'Empennage & Flight Controls',
        valueText: `Elevator/Rudder Trim: 0.1° // Actuators active`,
        rangeText: `Trim Deflection < 0.8°`,
        status: 'Normal',
        colorClass: 'text-safety',
        nodeColor: '#34D399',
        pulseRate: '3s',
        riskWeight: 0
      };
    }
    
    return null;
  };

  const getStatusClass = (status: string) => {
    if (status === 'Critical' || status === 'Degraded') return 'bg-critical/10 text-critical border-critical/20';
    if (status === 'Watch') return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-safety/10 text-safety border-safety/20';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="h-5 w-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-[9.5px] text-slate-500 font-mono tracking-[0.25em] uppercase font-bold">Querying fleet telemetry matrices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-critical/5 border border-critical/15 rounded-sm text-center space-y-5 font-mono glass-panel">
        <AlertCircle size={32} className="mx-auto text-critical animate-pulse" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">FLEET LINK FAILURE</h3>
        <p className="text-[10.5px] text-red-300/80 leading-relaxed">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h2 className="text-lg md:text-xl font-normal font-editorial-section tracking-wider uppercase text-white flex items-center gap-2.5">
            <Activity className="text-brand-gold" size={15} />
            <span>Airframe Status Matrix</span>
          </h2>
          <p className="text-[8.5px] text-slate-500 font-mono mt-1 tracking-widest uppercase">FLEET-WIDE TELETECTOR SYSTEMS // ACARS FLIGHT DECK LOG</p>
        </div>
      </div>

      {/* Museum-Quality Centerpiece Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column (1/3 Width): Airframe list selectors & Probabilities */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Airframe Selectors (spacious, borderless list) */}
          <div className="space-y-3">
            <h3 className="text-[9.5px] font-bold font-ui tracking-[0.25em] text-slate-500 uppercase pb-1">SELECT_AIRFRAME</h3>
            <div className="space-y-2.5">
              {fleet.map((ac) => {
                const active = selectedMember?.aircraft_id === ac.aircraft_id;
                const tel = ac.latest_telemetry;
                return (
                  <div
                    key={ac.aircraft_id}
                    onClick={() => {
                      setSelectedMember(ac);
                      setSelectedSubsystem('fuselage');
                    }}
                    className={`p-5 bg-[#0E1014]/25 border border-white/[0.03] rounded-sm transition-all duration-300 cursor-pointer flex items-center justify-between glass-panel ${
                      active ? 'border-brand-gold/30 bg-brand-gold/5 shadow-[0_0_12px_rgba(229,193,88,0.08)]' : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`text-xs font-bold block font-ui ${active ? 'text-brand-gold' : 'text-white'}`}>{ac.tail_number}</span>
                      <span className="text-[8.5px] text-slate-400 block font-ui font-light tracking-wide">{ac.aircraft_type}</span>
                    </div>
                    
                    <div className="text-right space-y-1">
                      {tel.hydraulic_pressure && tel.hydraulic_pressure < 2800 ? (
                        <span className="text-[8.5px] font-mono text-critical block font-bold">HYD_WARN</span>
                      ) : tel.engine_egt && tel.engine_egt > 650 ? (
                        <span className="text-[8.5px] font-mono text-warning block font-bold">EGT_WARN</span>
                      ) : (
                        <span className="text-[8.5px] font-mono text-safety block font-semibold">SYS_NOMINAL</span>
                      )}
                      <span className={`inline-block text-[7.5px] px-2 py-0.5 rounded-sm border font-ui font-bold uppercase tracking-wider ${getStatusClass(ac.current_health_status)}`}>
                        {ac.current_health_status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Failure Probabilities (placed left for visual balance) */}
          {selectedMember && (
            <div className="p-6 bg-[#0E1014]/20 border border-white/[0.03] rounded-sm glass-panel space-y-4">
              <h4 className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 font-ui">
                <Clock size={12} className="text-brand-gold" />
                <span>Risk Forecast Trajectories</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/45 border border-white/5 rounded-sm text-center font-ui">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider block">24H INTERVAL</span>
                  <span className={`text-lg font-bold font-mono block mt-1.5 ${selectedMember.failure_forecast_24h > 0.1 ? 'text-critical font-black' : 'text-slate-300'}`}>
                    {(selectedMember.failure_forecast_24h * 100).toFixed(1)}%
                  </span>
                  <span className="text-[7px] text-slate-500 block mt-0.5 font-mono">FAIL_PROB</span>
                </div>
                <div className="p-4 bg-black/45 border border-white/5 rounded-sm text-center font-ui">
                  <span className="text-[8px] text-slate-500 uppercase tracking-wider block">7D INTERVAL</span>
                  <span className={`text-lg font-bold font-mono block mt-1.5 ${selectedMember.failure_forecast_7d > 0.2 ? 'text-critical font-black' : 'text-slate-300'}`}>
                    {(selectedMember.failure_forecast_7d * 100).toFixed(1)}%
                  </span>
                  <span className="text-[7px] text-slate-500 block mt-0.5 font-mono">FAIL_PROB</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Center & Right Column (2/3 Width): Schematic Centerpiece & Details */}
        {selectedMember && (() => {
          const tel = selectedMember.latest_telemetry;
          const noseData = getSubsystemData('nose', tel) || { nodeColor: '#34D399', pulseRate: '3s' };
          const leftEngData = getSubsystemData('left_engine', tel) || { nodeColor: '#34D399', pulseRate: '3s' };
          const rightEngData = getSubsystemData('right_engine', tel) || { nodeColor: '#34D399', pulseRate: '3s' };
          const fuseData = getSubsystemData('fuselage', tel) || { nodeColor: '#34D399', pulseRate: '3s' };
          const tailData = getSubsystemData('tail', tel) || { nodeColor: '#34D399', pulseRate: '3s' };

          return (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Massive Schematic Centerpiece Panel */}
              <div className="glass-panel rounded-sm p-8 shadow-2xl space-y-6 relative">
                
                {/* Header info */}
                <div className="flex justify-between items-baseline pb-5">
                  <div>
                    <span className="text-[8.5px] text-slate-500 font-bold font-ui tracking-widest block uppercase">Telemetry Diagnostics</span>
                    <h3 className="text-base font-semibold text-white mt-1 font-ui">AIRFRAME: {selectedMember.tail_number}</h3>
                    <p className="text-[8.5px] text-slate-400 mt-0.5 font-ui">// TYPE: {selectedMember.aircraft_type}</p>
                  </div>
                  <span className="text-[8.5px] text-brand-gold font-mono tracking-widest uppercase font-bold">ACARS INTERFACE SYNCED</span>
                </div>

                {/* Main Centered SVG Graphic */}
                <div className="flex justify-center py-8 bg-black/20 border border-white/[0.03] rounded-sm relative">
                  <svg className="w-56 h-56" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Minimal Jet Silhouette */}
                    <path 
                      d="M100,20 L104,50 L108,80 L185,95 L183,101 L108,93 L106,155 L125,168 L123,172 L100,166 L77,172 L75,168 L94,155 L92,93 L17,101 L15,95 L92,80 L96,50 Z" 
                      fill="rgba(14, 16, 20, 0.4)" 
                      stroke="rgba(229, 193, 88, 0.12)" 
                      strokeWidth="1" 
                    />
                    
                    {/* Nose Node */}
                    <g className="cursor-pointer group" onClick={() => setSelectedSubsystem('nose')}>
                      <circle cx="100" cy="35" r="9" className="fill-brand-gold/5 group-hover:fill-brand-gold/15 transition-colors" />
                      <circle cx="100" cy="35" r="4" fill={noseData.nodeColor} />
                      <circle cx="100" cy="35" r="10" stroke={noseData.nodeColor} strokeWidth="0.5" fill="none" className="telemetry-pulse-ring" style={{ animationDuration: noseData.pulseRate }} />
                      <text x="100" y="23" className="fill-slate-400 text-[5.5px] font-mono opacity-50 uppercase font-bold" textAnchor="middle">ELECT</text>
                    </g>

                    {/* Left Engine Node */}
                    <g className="cursor-pointer group" onClick={() => setSelectedSubsystem('left_engine')}>
                      <circle cx="70" cy="90" r="9" className="fill-brand-gold/5 group-hover:fill-brand-gold/15 transition-colors" />
                      <circle cx="70" cy="90" r="4" fill={leftEngData.nodeColor} />
                      <circle cx="70" cy="90" r="10" stroke={leftEngData.nodeColor} strokeWidth="0.5" fill="none" className="telemetry-pulse-ring" style={{ animationDuration: leftEngData.pulseRate }} />
                      <text x="70" y="78" className="fill-slate-400 text-[5.5px] font-mono opacity-50 uppercase font-bold" textAnchor="middle">ENG_L</text>
                    </g>

                    {/* Right Engine Node */}
                    <g className="cursor-pointer group" onClick={() => setSelectedSubsystem('right_engine')}>
                      <circle cx="130" cy="90" r="9" className="fill-brand-gold/5 group-hover:fill-brand-gold/15 transition-colors" />
                      <circle cx="130" cy="90" r="4" fill={rightEngData.nodeColor} />
                      <circle cx="130" cy="90" r="10" stroke={rightEngData.nodeColor} strokeWidth="0.5" fill="none" className="telemetry-pulse-ring" style={{ animationDuration: rightEngData.pulseRate }} />
                      <text x="130" y="78" className="fill-slate-400 text-[5.5px] font-mono opacity-50 uppercase font-bold" textAnchor="middle">ENG_R</text>
                    </g>

                    {/* Fuselage Node */}
                    <g className="cursor-pointer group" onClick={() => setSelectedSubsystem('fuselage')}>
                      <circle cx="100" cy="95" r="9" className="fill-brand-gold/5 group-hover:fill-brand-gold/15 transition-colors" />
                      <circle cx="100" cy="95" r="4" fill={fuseData.nodeColor} />
                      <circle cx="100" cy="95" r="10" stroke={fuseData.nodeColor} strokeWidth="0.5" fill="none" className="telemetry-pulse-ring" style={{ animationDuration: fuseData.pulseRate }} />
                      <text x="100" y="109" className="fill-slate-400 text-[5.5px] font-mono opacity-50 uppercase font-bold" textAnchor="middle">HYDRAULIC</text>
                    </g>

                    {/* Tail Node */}
                    <g className="cursor-pointer group" onClick={() => setSelectedSubsystem('tail')}>
                      <circle cx="100" cy="155" r="9" className="fill-brand-gold/5 group-hover:fill-brand-gold/15 transition-colors" />
                      <circle cx="100" cy="155" r="4" fill={tailData.nodeColor} />
                      <circle cx="100" cy="155" r="10" stroke={tailData.nodeColor} strokeWidth="0.5" fill="none" className="telemetry-pulse-ring" style={{ animationDuration: tailData.pulseRate }} />
                      <text x="100" y="145" className="fill-slate-400 text-[5.5px] font-mono opacity-50 uppercase font-bold" textAnchor="middle">FLT_CTL</text>
                    </g>
                  </svg>
                  <span className="absolute bottom-3 right-3 text-[6px] font-mono text-slate-600 uppercase tracking-widest font-bold">ACTIVE DIAGNOSTIC SCHEMATIC</span>
                </div>

                {/* Node telemetry diagnostic sub-panel */}
                {selectedSubsystem && (() => {
                  const subData = getSubsystemData(selectedSubsystem, tel);
                  if (!subData) return null;
                  return (
                    <div className="p-5 bg-[#0E1014]/45 border border-white/[0.03] rounded-sm font-ui text-[10px] space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 bottom-0 left-0 w-[2.5px]" style={{ backgroundColor: subData.nodeColor }} />
                      
                      <div className="flex items-center justify-between pb-3">
                        <span className="font-bold text-white uppercase tracking-wider">{subData.name}</span>
                        <span className={`font-black uppercase text-[8px] px-2 py-0.5 rounded-sm border border-white/5 font-ui ${subData.colorClass}`}>
                          {subData.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-[9.5px]">
                        <div>
                          <span className="text-slate-500 block text-[7px] uppercase font-bold tracking-widest font-ui">Current Telemetry</span>
                          <span className="text-white font-bold font-mono block mt-0.5">{subData.valueText}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[7px] uppercase font-bold tracking-widest font-ui">Standard Envelope</span>
                          <span className="text-slate-400 font-mono block mt-0.5">{subData.rangeText}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-slate-500 block text-[7px] uppercase font-bold tracking-widest font-ui">Operations Risk Impact</span>
                        <span className={`font-bold font-mono block mt-0.5 ${subData.riskWeight > 0 ? 'text-critical font-black' : 'text-slate-400'}`}>
                          {subData.riskWeight > 0 ? `+${subData.riskWeight}% Compound Release Penalty` : '0% (Envelope Nominal)'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Parameter Drift Flags & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Anomalies */}
                <div className="p-7 bg-[#0E1014]/20 border border-white/[0.03] rounded-sm glass-panel space-y-5">
                  <h4 className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 font-ui">
                    <AlertCircle size={12} className="text-critical" />
                    <span>Active Telemetry Drifts</span>
                  </h4>
                  
                  <div className="space-y-2.5">
                    {selectedMember.anomalies.length > 0 ? (
                      selectedMember.anomalies.map((an, idx) => (
                        <div key={idx} className="p-4 bg-critical/[0.02] border border-critical/10 rounded-sm text-xs space-y-1 relative">
                          <div className="flex items-center justify-between text-[8px] font-bold text-critical uppercase tracking-wider font-mono">
                            <span>{an.subsystem}</span>
                            <span>{an.value}</span>
                          </div>
                          <p className="text-[10px] text-red-200/90 leading-relaxed font-body font-light">{an.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2.5 p-3.5 bg-safety/5 border border-safety/15 rounded-sm text-xs text-safety font-ui">
                        <ShieldCheck size={14} className="shrink-0" />
                        <span className="font-semibold">All sensors sync envelope parameters.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-7 bg-[#0E1014]/20 border border-white/[0.03] rounded-sm glass-panel space-y-5">
                  <h4 className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 font-ui">
                    <Settings size={12} className="text-brand-gold" />
                    <span>Maintenance Directives</span>
                  </h4>
                  
                  <div className="space-y-2">
                    {selectedMember.recommendations.length > 0 ? (
                      selectedMember.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-4 bg-black/20 border border-white/[0.03] rounded-sm text-[10.5px] leading-normal font-body text-slate-300 font-light">
                          <ChevronRight size={13} className="text-brand-gold shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 text-[9.5px] leading-normal py-4 text-center border border-dashed border-white/5 rounded-sm font-ui uppercase tracking-widest">
                        No pending work orders.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

      </div>

    </div>
  );
}
