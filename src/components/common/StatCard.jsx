import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'teal',
  onClick,
  badgeText
}) {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
      border: 'hover:border-teal-300 dark:hover:border-teal-700',
      accent: 'text-teal-600 dark:text-teal-400',
      glow: 'group-hover:bg-teal-500/10'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-300 dark:hover:border-amber-700',
      accent: 'text-amber-600 dark:text-amber-400',
      glow: 'group-hover:bg-amber-500/10'
    },
    blue: {
      bg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
      border: 'hover:border-sky-300 dark:hover:border-sky-700',
      accent: 'text-sky-600 dark:text-sky-400',
      glow: 'group-hover:bg-sky-500/10'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      accent: 'text-emerald-600 dark:text-emerald-400',
      glow: 'group-hover:bg-emerald-500/10'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-300 dark:hover:border-purple-700',
      accent: 'text-purple-600 dark:text-purple-400',
      glow: 'group-hover:bg-purple-500/10'
    }
  };

  const scheme = colorMap[color] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 ' + scheme.border : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {value}
            </h3>
            {badgeText && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
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
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}

      {/* Decorative background glow on hover */}
      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl pointer-events-none transition-all duration-300 ${scheme.glow}`} />
    </div>
  );
}
