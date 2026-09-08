'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getEvents } from '@/lib/api';
import { PollutionEvent, RiskLevel } from '@/lib/types';
import DashboardHeader from '@/components/layout/DashboardHeader';
import MapFilter, { MapFilterState } from '@/components/map/MapFilter';
import MapLegend from '@/components/map/MapLegend';
import { MapPin, RefreshCw } from 'lucide-react';

// Dynamic import with SSR disabled to prevent Leaflet window reference errors
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500">
      <div className="h-8 w-8 border-3 border-[#0a2540] border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
        Initializing Spatial Leaflet Engine...
      </span>
    </div>
  ),
});

export default function MapPage() {
  const [events, setEvents] = useState<PollutionEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [filterState, setFilterState] = useState<MapFilterState>({
    city: 'ALL',
    risk: 'ALL',
    timeRange: 'ALL',
  });

  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load map events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEvents();
  }, []);

  // Extract distinct monitored cities from loaded events
  const cities = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.location.city));
    return Array.from(set).sort();
  }, [events]);

  // Filter events based on active controls
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // 1. City Filter
      if (filterState.city !== 'ALL' && e.location.city !== filterState.city) {
        return false;
      }

      // 2. Risk Filter
      if (filterState.risk !== 'ALL' && e.risk !== filterState.risk) {
        return false;
      }

      // 3. Time Horizon Filter
      if (filterState.timeRange !== 'ALL') {
        const eventTime = new Date(e.timestamp).getTime();
        const now = Date.now();
        const diffHours = (now - eventTime) / (1000 * 3600);

        if (filterState.timeRange === '24H' && diffHours > 24) return false;
        if (filterState.timeRange === '48H' && diffHours > 48) return false;
        if (filterState.timeRange === '7D' && diffHours > 168) return false;
      }

      return true;
    });
  }, [events, filterState]);

  const handleFilterChange = (newState: Partial<MapFilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newState }));
  };

  const handleResetFilters = () => {
    setFilterState({
      city: 'ALL',
      risk: 'ALL',
      timeRange: 'ALL',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden">
      {/* Header */}
      <DashboardHeader
        title="Geospatial Pollution Surveillance"
        subtitle="Interactive Leaflet Map • CPCB, Sentinel-5P & Citizen Evidence"
        actions={
          <button
            onClick={loadAllEvents}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            title="Refresh surveillance events"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        }
      />

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-full min-h-[500px]">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-500">
            <div className="h-8 w-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Retrieving Pan-India Telemetry Hotspots...
            </p>
          </div>
        ) : (
          <>
            <LeafletMap
              events={filteredEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={(id) => setSelectedEventId(id)}
              className="w-full h-full"
            />

            {/* Floating Filter Controls: Desktop panel / Mobile button (Top-Right) */}
            <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-[1000] max-w-xl w-auto pointer-events-auto">
              <MapFilter
                cities={cities}
                filterState={filterState}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                filteredCount={filteredEvents.length}
                totalCount={events.length}
              />
            </div>

            {/* Floating Risk Legend (Bottom-Left) */}
            <div className="absolute bottom-6 left-4 z-[1000] max-w-[calc(100%-2rem)] sm:max-w-xs w-auto pointer-events-auto">
              <MapLegend totalEvents={filteredEvents.length} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
