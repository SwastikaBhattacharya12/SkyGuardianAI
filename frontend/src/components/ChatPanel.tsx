'use client';

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { Terminal, Send, Loader, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "SYSTEM INITIALIZED // GEMINI SAFETY INTELLIGENCE LAYER ACTIVE.\n\nReady for operations risk queries. Enter target flight index or query parameters below."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Is Flight AI102 safe to operate?",
    "What if we delay departure of AI102 by 30 minutes?",
    "What are the highest-risk flights today?",
    "Which aircraft require inspection this week?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    
    const userMsg = textToSend.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const reply = await api.queryAssistant(userMsg);
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: "ERR_CONNECTION_FAILED: Operational database offline. Ensure backend is active on port 8000." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Bold syntax
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<span class="text-brand-gold font-semibold">$1</span>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<span class="text-slate-400 font-light">$1</span>');
      
      // Inline Code / Tail Numbers
      formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-[#060709] px-1.5 py-0.5 rounded-sm text-brand-gold text-[10px] font-mono border border-white/5">$1</code>');
      
      // Table rows parsing
      if (line.startsWith('|') && idx > 0) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
        if (line.includes('---')) return null; // skip separator
        
        const isHeader = idx === 1 || line.includes('Metric');
        return (
          <div key={idx} className={`grid grid-cols-5 gap-1.5 px-3 py-1.5 border-b border-white/5 text-[9.5px] font-mono ${isHeader ? 'bg-[#0E1014] text-brand-gold font-bold border-t border-white/5' : 'text-slate-400 font-light'}`}>
            {cells.map((cell, cIdx) => (
              <span key={cIdx} className={cIdx === 0 ? "col-span-1" : "col-span-1 text-center"} dangerouslySetInnerHTML={{ __html: cell }} />
            ))}
          </div>
        );
      }

      // Headers (rendered in Cormorant Garamond for luxury executive briefing style)
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-xs font-semibold text-brand-gold font-editorial-section tracking-wide mt-4 mb-2 uppercase flex items-center gap-1.5" dangerouslySetInnerHTML={{ __html: formatted.replace('### ', '') }} />;
      }
      if (line.startsWith('#### ')) {
        return <h5 key={idx} className="text-[10px] font-bold text-slate-400 font-ui mt-3 mb-1.5 uppercase" dangerouslySetInnerHTML={{ __html: formatted.replace('#### ', '') }} />;
      }

      // Bullet points
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <div key={idx} className="text-slate-400 text-[10.5px] font-body ml-3 pl-2.5 border-l border-brand-gold/20 mb-1.5 flex items-start gap-2 font-light" >
            <span className="text-brand-gold font-bold">▪</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^[\*\-\s]+/, '') }} />
          </div>
        );
      }

      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={idx} className="text-slate-400 text-[10.5px] font-body ml-3 pl-2.5 border-l border-brand-gold/20 mb-1.5 flex items-start gap-2 font-light">
            <span className="text-slate-500 font-bold">{line.match(/^\d+/)?.[0]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\.\s*/, '') }} />
          </div>
        );
      }

      if (line.trim() === '') return <div key={idx} className="h-2" />;

      return <p key={idx} className="text-slate-300 text-[11px] font-body mb-1.5 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0E1014]/40 w-96 max-w-md shadow-2xl relative">
      
      {/* Subtle vertical accent glow */}
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.03] bg-[#0E1014]/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Terminal size={14} className="text-brand-gold animate-pulse" />
          <div>
            <h3 className="text-[10px] font-bold font-ui tracking-widest text-white uppercase">AEROS_INTEL_CONSOLE</h3>
            <span className="text-[7.5px] text-brand-gold font-mono tracking-widest block font-bold">SYS_SYNC: GEMINI_RAG_v1.5</span>
          </div>
        </div>
        <Sparkles size={11} className="text-warning" />
      </div>

      {/* Terminal Screen Console (Added pt-6 to resolve top message clipping) */}
      <div className="flex-1 overflow-y-auto p-6 pt-6 space-y-5 select-text bg-[#060709]/30">
        {messages.map((msg, index) => (
          <div key={index} className="space-y-2 pb-6 border-b border-white/[0.03]">
            {msg.sender === 'user' ? (
              <div className="space-y-1">
                <div className="text-[8px] font-bold text-brand-gold/75 tracking-wider uppercase font-mono">
                  {`>>> DIRECTIVE_EXEC_INCEPT // SECURE_DATALINK`}
                </div>
                <div className="text-slate-300 text-[10px] font-semibold pl-3 border-l border-brand-gold/30 font-ui">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-[8px] font-bold text-safety flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <span className="h-1 w-1 rounded-full bg-safety animate-pulse" />
                  <span>[SYS_RESPONSE_OK // GENAI_INTEL_FEED]</span>
                </div>
                <div className="text-white text-[10px] leading-relaxed pl-3 border-l border-safety/30 space-y-1">
                  {formatMarkdown(msg.text)}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[8px] font-bold tracking-widest text-slate-500 uppercase">
              <span>[CALCULATING_RISK_FACTORS]</span>
              <span>//</span>
              <span className="animate-pulse">PARSING_TELEMETRY...</span>
            </div>
            <div className="p-5 bg-[#0E1014]/35 border border-white/[0.03] rounded-sm text-[10px] shadow-sm flex items-center gap-2.5 text-brand-gold font-bold">
              <Loader size={12} className="animate-spin" />
              <span className="font-light tracking-wide text-slate-400">INGESTING atmospheric forecasts, log metrics, and airframes...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Commands (Structured as Terminal Directives) */}
      <div className="p-5 border-t border-white/[0.03] bg-[#0E1014]/20 space-y-3">
        <div className="flex items-center gap-1.5 text-[8px] text-slate-500 font-bold uppercase tracking-widest font-ui">
          <HelpCircle size={10} />
          <span>Operations Diagnostic Macros</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="text-left px-3 py-2 bg-[#060709] hover:bg-[#0E1014] border border-white/[0.03] hover:border-brand-gold/30 rounded-sm text-[8.5px] font-mono text-slate-400 hover:text-brand-gold transition-all duration-150 flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate">{`[ EXEC_QUERY: ${s.replace('?', '').toUpperCase()} ]`}</span>
              <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-5 border-t border-white/[0.03] bg-[#0E1014]/40 flex gap-3"
      >
        <div className="flex-1 relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-gold font-mono text-xs font-bold pointer-events-none">{`>`}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Execute safety operations directive..."
            className="w-full bg-[#060709] border border-white/[0.03] rounded-sm px-3 pl-6 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-gold/30 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/15 hover:border-brand-gold text-brand-gold rounded-sm px-4 transition-colors duration-150 shrink-0 flex items-center justify-center cursor-pointer"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}
