import React from 'react';
import { RiskLevel } from '@/lib/types';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  riskAccent?: RiskLevel;
  className?: string;
}

const ACCENT_BORDER: Record<RiskLevel, string> = {
  LOW: 'border-l-4 border-l-[#22c55e]',
  MODERATE: 'border-l-4 border-l-[#eab308]',
  HIGH: 'border-l-4 border-l-[#f97316]',
  CRITICAL: 'border-l-4 border-l-[#ef4444]',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  riskAccent,
  className = '',
}) => {
  const accentClass = riskAccent ? ACCENT_BORDER[riskAccent] : '';

  return (
    <div
      className={`bg-white border border-[#e2e8f0] rounded-lg p-5 shadow-xs transition-shadow hover:shadow-sm ${accentClass} ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
          {title}
        </span>
        {icon && (
          <div className="p-1.5 rounded bg-slate-50 text-[#0a2540] border border-slate-100">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <span className="text-3xl font-bold tracking-tight text-[#0f172a] tabular-telemetry">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#64748b] flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
