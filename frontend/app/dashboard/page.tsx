'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getEvents } from '@/lib/api';
import { PollutionEvent } from '@/lib/types';
import DashboardHeader from '@/components/layout/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import RiskBadge from '@/components/ui/RiskBadge';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import {
  Activity,
  AlertTriangle,
  Building2,
  Clock,
  ArrowRight,
  MapPin,
  Flame,
  Radio,
  ExternalLink,
  Shield,
  RefreshCw,
} from 'lucide-react';

// Dynamic import of Leaflet map with SSR disabled
const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center bg-slate-50 text-slate-400">
      <div className="h-7 w-7 border-2 border-[#0a2540] border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-xs font-mono">Loading Spatial Preview...</span>
    </div>
  ),
});

export default function DashboardOverviewPage() {
  const [events, setEvents] = useState<PollutionEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load dashboard events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute KPI metrics dynamically from ingested data
  const metrics = useMemo(() => {
    const activeEvents = events.filter(
      (e) => e.outcome !== 'resolved' && e.outcome !== 'false_alarm'
    ).length;

    const criticalAlerts = events.filter((e) => e.risk === 'CRITICAL').length;

    const uniqueCities = new Set(events.map((e) => e.location.city)).size;

    const pendingReview = events.filter(
      (e) => e.response.status === 'pending'
    ).length;

    return {
      activeEvents,
      criticalAlerts,
      uniqueCities,
      pendingReview,
    };
  }, [events]);

  // 5 Most Recent Events (sorted by timestamp descending)
  const recentEvents = useMemo(() => {
    return [...events]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 5);
  }, [events]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <DashboardHeader
        title="VayuNet — Environmental Intelligence Dashboard"
        subtitle="National Surveillance Authority • Real-time Multi-Source Sensor & Satellite Synthesis"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              title="Refresh telemetry stream"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link
              href="/dashboard/map"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0a2540] hover:bg-[#0f2a3f] text-white text-xs font-semibold transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              <span>Surveillance Map</span>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Events"
            value={loading ? '...' : metrics.activeEvents}
            subtitle="Corroborated pollution anomalies"
            icon={<Activity className="w-4 h-4 text-[#0a2540]" />}
          />

          <StatCard
            title="Critical Alerts"
            value={loading ? '...' : metrics.criticalAlerts}
            subtitle="Immediate authority action required"
            icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
            riskAccent="CRITICAL"
          />

          <StatCard
            title="Cities Monitored"
            value={loading ? '...' : metrics.uniqueCities}
            subtitle="Air quality surveillance basins"
            icon={<Building2 className="w-4 h-4 text-[#0a2540]" />}
          />

          <StatCard
            title="Pending Review"
            value={loading ? '...' : metrics.pendingReview}
            subtitle="Awaiting officer confirmation"
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            riskAccent="MODERATE"
          />
        </div>

        {/* Main Grid: Recent Events List (Left) & Embedded Map Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Events List (5 columns) */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <CardHeader
                title="Recent Incident Feed"
                subtitle="5 latest multi-source pollution events detected"
                action={
                  <Link
                    href="/dashboard/alerts"
                    className="text-xs font-semibold text-[#0a2540] hover:text-sky-700 flex items-center gap-1 transition-colors"
                  >
                    <span>View All Alerts</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                }
              />
              <CardContent className="p-0 divide-y divide-slate-100">
                {loading ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    <div className="h-6 w-6 border-2 border-[#0a2540] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Ingesting active event catalog...
                  </div>
                ) : recentEvents.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No recent events logged.
                  </div>
                ) : (
                  recentEvents.map((evt) => {
                    const eventType =
                      evt.source_hypothesis?.category ||
                      evt.evidence?.citizen?.gemini_output?.event_type ||
                      'Unclassified';

                    const pm25 = evt.evidence?.sensor?.pm25;

                    return (
                      <div
                        key={evt.event_id}
                        className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#0f172a]">
                              {evt.location.city}
                            </span>
                            <RiskBadge level={evt.risk} size="sm" />
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                              {evt.outcome}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#64748b] flex-wrap">
                            <span className="flex items-center gap-1 capitalize font-medium text-slate-700">
                              <Flame className="w-3.5 h-3.5 text-orange-500" />
                              {eventType.replace('_', ' ')}
                            </span>
                            {pm25 && (
                              <>
                                <span>•</span>
                                <span className="font-mono tabular-telemetry">
                                  PM2.5: <strong className="text-slate-900">{pm25} µg/m³</strong>
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              {new Date(evt.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Link
                            href={`/dashboard/event/${evt.event_id}`}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#0a2540] hover:bg-[#0f2a3f] text-white text-xs font-semibold rounded transition-colors shadow-xs"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Authority Guidance Callout */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-lg p-4 flex items-start gap-3 text-xs">
              <Shield className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#0a2540] uppercase tracking-wider text-[11px]">
                  Operational Protocol Reminder
                </h4>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  All critical incidents trigger automated notifications to respective State Pollution Control Boards. Review evidence breakdowns before issuing containment directives.
                </p>
              </div>
            </div>
          </div>

          {/* Embedded Map Preview (6 columns) */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader
                title="Spatial Hotspot Surveillance"
                subtitle="Real-time multi-city event coordinates"
                action={
                  <Link
                    href="/dashboard/map"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a2540] hover:text-sky-700 transition-colors"
                  >
                    <span>Full Screen Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                }
              />
              <div className="h-[380px] w-full relative">
                <LeafletMap events={events} className="w-full h-full" />
              </div>
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-[#64748b]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Click any pin to inspect hotspot telemetry</span>
                </div>
                <Link
                  href="/dashboard/map"
                  className="font-semibold text-[#0a2540] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Open Interactive Map</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
