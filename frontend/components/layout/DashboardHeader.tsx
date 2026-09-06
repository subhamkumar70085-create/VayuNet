'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Bell, Globe, Clock, ShieldCheck } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Authority Environmental Intelligence',
  subtitle = 'National Air Quality & Hyper-Local Emission Surveillance',
  actions,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toUTCString().replace('GMT', 'UTC')
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-[#e2e8f0] px-6 py-3.5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
      {/* Title & Basin Context */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold text-[#0f172a] tracking-tight">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Radio className="w-3 h-3 animate-pulse text-emerald-500" />
            Live Ingestion
          </span>
        </div>
        <p className="text-xs text-[#64748b] mt-0.5">{subtitle}</p>
      </div>

      {/* Operational Telemetry & Quick Indicators */}
      <div className="flex items-center gap-4">
        {actions}

        {/* Temporal telemetry readout */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#64748b] font-mono tabular-telemetry bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime || 'Synchronizing...'}</span>
        </div>

        {/* Clearance indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#0a2540] bg-slate-100 px-2.5 py-1.5 rounded border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-[#0a2540]" />
          <span className="hidden sm:inline">Authority Station</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
