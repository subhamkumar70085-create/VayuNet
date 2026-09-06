import React from 'react';
import { Shield } from 'lucide-react';

interface MapLegendProps {
  totalEvents: number;
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ totalEvents, className = '' }) => {
  const legendItems = [
    { label: 'Low (Good / Baseline)', color: 'bg-[#22c55e]', ring: 'ring-[#22c55e]/20' },
    { label: 'Moderate (Exposure Caution)', color: 'bg-[#eab308]', ring: 'ring-[#eab308]/20' },
    { label: 'High (Action Required)', color: 'bg-[#f97316]', ring: 'ring-[#f97316]/20' },
    { label: 'Critical (Emergency Protocol)', color: 'bg-[#ef4444]', ring: 'ring-[#ef4444]/20' },
  ];

  return (
    <div
      className={`bg-white/95 backdrop-blur-xs border border-[#e2e8f0] rounded-lg p-3.5 shadow-md text-xs select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0a2540]">
          <Shield className="w-3.5 h-3.5 text-[#0a2540]" />
          <span>Risk Classification</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          {totalEvents} Active Sites
        </span>
      </div>

      <div className="space-y-1.5">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${item.color} ring-2 ring-white shadow-xs shrink-0`}
            />
            <span className="text-slate-700 font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
        Projection: WGS84 • Spatial Leaflet Grid
      </div>
    </div>
  );
};

export default MapLegend;
