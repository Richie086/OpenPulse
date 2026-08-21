import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function SystemStatusCard() {
  return (
    <Card size="sm" className="mt-auto bg-slate-900/90 border-white/10 backdrop-blur-md">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          SYSTEM STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex flex-col gap-1.5 text-xs">
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
      </CardContent>
    </Card>
  );
}
