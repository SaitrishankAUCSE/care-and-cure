import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald',
  onClick,
  badgeText
}) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-700',
      border: 'hover:border-emerald-300',
      accent: 'text-emerald-700',
      glow: 'group-hover:bg-emerald-500/10'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-300',
      accent: 'text-amber-600',
      glow: 'group-hover:bg-amber-500/10'
    },
    blue: {
      bg: 'bg-slate-100 text-slate-700',
      border: 'hover:border-slate-300',
      accent: 'text-slate-700',
      glow: 'group-hover:bg-slate-500/10'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700',
      border: 'hover:border-purple-300',
      accent: 'text-purple-700',
      glow: 'group-hover:bg-purple-500/10'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 ' + scheme.border : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
            {badgeText && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} transition-colors duration-200`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}

      {/* Decorative background glow on hover */}
      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl pointer-events-none transition-all duration-300 ${scheme.glow}`} />
    </div>
  );
}
