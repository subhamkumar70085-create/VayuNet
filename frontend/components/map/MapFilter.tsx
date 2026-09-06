import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export interface MapFilterState {
  city: string;
  risk: string;
  timeRange: string;
}

interface MapFilterProps {
  cities: string[];
  filterState: MapFilterState;
  onFilterChange: (newState: Partial<MapFilterState>) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
  className?: string;
}

export const MapFilter: React.FC<MapFilterProps> = ({
  cities,
  filterState,
  onFilterChange,
  onReset,
  filteredCount,
  totalCount,
  className = '',
}) => {
  return (
    <div
      className={`bg-white/95 backdrop-blur-md border border-[#e2e8f0] rounded-lg p-4 shadow-lg text-xs select-none ${className}`}
    >
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0a2540]">
          <Filter className="w-3.5 h-3.5 text-[#0a2540]" />
          <span>Surveillance Filters</span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Showing {filteredCount} of {totalCount} Sites
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* City Filter */}
        <div className="min-w-0">
          <label
            htmlFor="filter-city"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Air Basin / City
          </label>
          <select
            id="filter-city"
            value={filterState.city}
            onChange={(e) => onFilterChange({ city: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540] cursor-pointer"
          >
            <option value="ALL">All Monitored Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="min-w-0">
          <label
            htmlFor="filter-risk"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Risk Category
          </label>
          <select
            id="filter-risk"
            value={filterState.risk}
            onChange={(e) => onFilterChange({ risk: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540] cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Alerts Only</option>
            <option value="HIGH">High Risk</option>
            <option value="MODERATE">Moderate Exposure</option>
            <option value="LOW">Low Impact</option>
          </select>
        </div>

        {/* Date / Horizon Filter */}
        <div className="min-w-0">
          <label
            htmlFor="filter-time"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
          >
            Observation Window
          </label>
          <select
            id="filter-time"
            value={filterState.timeRange}
            onChange={(e) => onFilterChange({ timeRange: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-[#0a2540] focus:border-[#0a2540] cursor-pointer"
          >
            <option value="ALL">All Ingested Records</option>
            <option value="24H">Past 24 Hours</option>
            <option value="48H">Past 48 Hours</option>
            <option value="7D">Past 7 Days</option>
          </select>
        </div>
      </div>

      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-[#0a2540] font-semibold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All Filters</span>
        </button>
        <span className="text-[10px] text-slate-400 font-mono">
          OpenStreetMap Spatial Grid
        </span>
      </div>
    </div>
  );
};

export default MapFilter;
