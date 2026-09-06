import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Shield,
  Radio,
  ArrowRight,
  MapPin,
  Sparkles,
  Layers,
  Wind,
  Camera,
  Mic,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import RiskBadge from '@/components/ui/RiskBadge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col">
      {/* Global Command Header */}
      <header className="bg-[#0a2540] text-white border-b border-[#0f2a3f] px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-xs">
              <Activity className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  VayuNet
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                  v1.0 Civic AI
                </span>
              </div>
              <span className="text-xs text-slate-300 block font-normal">
                Federated Environmental Intelligence Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Pan-India Surveillance Grid</span>
            </span>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Authority View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0a2540] via-[#0d2e4d] to-[#f8fafc] text-white pt-14 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Beyond Simple AQI Numbers • The Pollution Event Paradigm</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hyper-Local Pollution Event Detection & Evidence Synthesis
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            VayuNet detects hidden, abnormal pollution spikes by fusing crowdsourced citizen evidence, CPCB ground monitors, Sentinel-5P orbital passes, and synoptic weather data — generating explainable, AI-reasoned alerts routed to municipal authorities.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <RiskBadge level="LOW" size="sm" />
            <RiskBadge level="MODERATE" size="sm" />
            <RiskBadge level="HIGH" size="sm" />
            <RiskBadge level="CRITICAL" size="sm" />
          </div>
        </div>
      </section>

      {/* Dual Portal Gateway Section */}
      <main className="max-w-6xl mx-auto px-6 -mt-10 pb-16 flex-1 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Portal 1: Authority Intelligence Dashboard */}
          <div className="bg-white border-2 border-slate-200 hover:border-[#0a2540] rounded-xl p-6 sm:p-8 shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-[#0a2540] text-white flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 text-sky-300" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  Authority Portal
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0f172a] group-hover:text-[#0a2540] transition-colors">
                  Authority Intelligence Dashboard
                </h2>
                <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                  Engineered for Municipal Corporations, State Pollution Control Boards, and Environmental Officers. Monitor active incident feeds, inspect multi-sensor evidence breakdowns, evaluate 72h diffusion forecasts, and issue civic containment directives.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Geospatial Leaflet Hotspot Surveillance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Gemini AI Multimodal Evidence Explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>PM2.5 Trajectory Projections vs. WHO & NAAQS Limits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Alert Routing & Investigation Dispatch</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <Link
                href="/dashboard"
                className="w-full py-3 px-4 rounded-lg bg-[#0a2540] hover:bg-[#0f2a3f] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Launch Authority Dashboard</span>
                <ArrowRight className="w-4 h-4 text-sky-300" />
              </Link>

              <div className="flex items-center justify-center gap-4 text-xs text-[#64748b] pt-1">
                <Link href="/dashboard/map" className="hover:text-[#0a2540] underline font-medium">
                  Hotspot Map
                </Link>
                <span>•</span>
                <Link href="/dashboard/forecast" className="hover:text-[#0a2540] underline font-medium">
                  Forecasts
                </Link>
                <span>•</span>
                <Link href="/dashboard/alerts" className="hover:text-[#0a2540] underline font-medium">
                  Alert Centre
                </Link>
              </div>
            </div>
          </div>

          {/* Portal 2: Citizen Pollution Reporter */}
          <div className="bg-white border-2 border-slate-200 hover:border-sky-600 rounded-xl p-6 sm:p-8 shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-md">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
                  Public Portal
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0f172a] group-hover:text-sky-700 transition-colors">
                  Citizen Pollution Reporter
                </h2>
                <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                  Mobile-first public interface for reporting local pollution observations. Capture smoke or illegal burning photos, dictate narratives using browser voice speech-to-text in English or Hindi, and pin GPS coordinates on an interactive mini-map.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mobile Camera Capture & Gallery Upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Web Speech Voice Dictation (English & हिंदी)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic GPS Geolocation with Draggable Pin</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Animated 5-Stage Ingest & AI Fusion Pipeline</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <Link
                href="/report"
                className="w-full py-3 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Open Citizen Reporter</span>
                <ArrowRight className="w-4 h-4 text-sky-200" />
              </Link>

              <div className="flex items-center justify-center gap-4 text-xs text-[#64748b] pt-1">
                <span>Available in English & हिंदी</span>
                <span>•</span>
                <span>Camera & Mic Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Source Fusion Architecture Pillars */}
        <section className="bg-white border border-[#e2e8f0] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 font-mono">
              System Architecture
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] mt-1">
              4-Tier Multi-Source Environmental Ingestion Grid
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Every pollution event is verified through cross-corroboration of ground, orbital, and crowdsourced telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-sky-600" />
                <h4 className="text-xs font-bold text-[#0f172a] uppercase">
                  Citizen Observations
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual plumes and odor narratives interpreted through Gemini Multimodal API into structured severity scores.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#0a2540]" />
                <h4 className="text-xs font-bold text-[#0f172a] uppercase">
                  CPCB Sensor Network
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ground monitoring stations measuring real-time PM2.5 and PM10 with statistical anomaly detectors.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-sky-700" />
                <h4 className="text-xs font-bold text-[#0f172a] uppercase">
                  Sentinel-5P Satellite
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orbital TROPOMI spectral passes delivering independent NO₂ column and aerosol index verification.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-cyan-700" />
                <h4 className="text-xs font-bold text-[#0f172a] uppercase">
                  Synoptic Weather
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Surface wind velocity and relative humidity tracking atmospheric stagnation and particulate dispersion.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e2e8f0] px-6 py-6 text-center text-xs text-[#64748b]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0a2540]">VayuNet Platform</span>
            <span>•</span>
            <span>Federated Environmental Intelligence</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Compliant with VayuNet Frontend Build Guide & Pollution Event Data Contract
          </div>
        </div>
      </footer>
    </div>
  );
}
