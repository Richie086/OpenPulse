import React from 'react';

export function SystemStatusCard() {
  return (
    <div className="mt-auto bg-slate-900/90 border border-white/10 rounded-xl p-3 backdrop-blur-md">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">SYSTEM STATUS</div>

      <div className="flex flex-col gap-1.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-mono text-[11px]">CONTAINER:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
            Running
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-mono text-[11px]">MEMORY:</span>
          <span className="text-slate-200 font-mono text-[11px]">35.2 MB</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-mono text-[11px]">UPTIME:</span>
          <span className="text-slate-200 font-mono text-[11px]">14h 23m</span>
        </div>
      </div>
    </div>
  );
}
