'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import ChatPanel from '../../components/ChatPanel';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleSimulateTick = async () => {
    setLoading(true);
    try {
      await api.triggerSimulatorTick();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to inject airspace anomalies.');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { name: 'FLIGHT BOARD', href: '/dashboard' },
    { name: 'FLEET MATRIX', href: '/dashboard/fleet' },
  ];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#060709] text-foreground overflow-hidden font-body aviation-grid-overlay">
      
      {/* Luxury Brand Header Console */}
      <header className="h-20 bg-[#0E1014]/80 border-b border-white/[0.03] flex items-center justify-between px-8 shrink-0 z-20 backdrop-blur-md shadow-2xl">
        
        {/* Editorial Brand Emblem */}
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-[#060709] border border-brand-gold/15 rounded-sm text-brand-gold group-hover:border-brand-gold transition-colors duration-300">
              <Shield size={16} />
            </div>
            <div>
              <h1 className="text-sm font-semibold font-editorial-hero tracking-[0.25em] text-white group-hover:text-brand-gold transition-colors duration-300 uppercase">
                SKYGUARDIAN
              </h1>
              <span className="text-[7.5px] text-brand-gold font-ui tracking-[0.3em] block mt-0.5 font-bold">
                AEROSPACE OPERATIONS
              </span>
            </div>
          </Link>
          
          {/* Executive Stats Bar (Clean, Minimalist) */}
          <div className="hidden lg:flex items-center gap-4.5 border-l border-white/[0.03] pl-5 text-[9px] font-ui text-slate-400 tracking-wider">
            <span>SYS_ACTIVE: <span className="text-safety font-bold font-mono">154</span></span>
            <span className="text-slate-700">//</span>
            <span>ALERTS: <span className="text-critical font-bold font-mono">12</span></span>
            <span className="text-slate-700">//</span>
            <span>FLEET_HLTH: <span className="text-accent font-bold font-mono">96%</span></span>
          </div>
        </div>

        {/* Minimalist Navigation Links (Space Grotesk, Borderless) */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-2 font-ui text-[10.5px] font-semibold tracking-[0.2em] transition-colors duration-300 ${
                  active
                    ? 'text-brand-gold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{item.name}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-gold animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls - Premium Minimal Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateTick}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#060709] border border-critical/20 hover:border-critical/60 text-critical hover:text-white rounded-sm font-ui text-[9px] font-bold tracking-[0.2em] transition-all duration-500 uppercase shadow-lg disabled:opacity-50 group cursor-pointer"
          >
            <RefreshCw size={11} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span>{loading ? 'CALCULATING...' : 'INJECT ANOMALY'}</span>
          </button>
        </div>

      </header>

      {/* Main Workspace Frame (whitespace padding layout) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left/Center Pane: Main content briefing workspace */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#060709] via-[#0E1014]/25 to-[#060709] p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>

        {/* Right Side Pane: Monospace Advisor Console */}
        <aside className="shrink-0 h-full border-l border-white/[0.03] bg-[#0E1014]/40 z-10 shadow-2xl">
          <ChatPanel />
        </aside>

      </div>

    </div>
  );
}
