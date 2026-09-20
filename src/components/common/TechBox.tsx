import React from 'react';

interface TechBoxProps {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  borderColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate';
  badge?: string;
  id?: string;
}

export const TechBox: React.FC<TechBoxProps> = ({
  title,
  subTitle,
  extra,
  children,
  className = '',
  borderColor = 'slate',
  badge,
  id,
}) => {
  const accentColors = {
    cyan: 'border-l-4 border-l-cyan-600',
    emerald: 'border-l-4 border-l-emerald-600',
    amber: 'border-l-4 border-l-amber-500',
    rose: 'border-l-4 border-l-rose-500',
    indigo: 'border-l-4 border-l-indigo-600',
    slate: 'border-l-4 border-l-blue-600',
  };

  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all duration-200 p-4.5 ${accentColors[borderColor]} ${className}`}
    >
      {/* 标题栏 */}
      {(title || extra) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              {title}
              {badge && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {badge}
                </span>
              )}
            </h3>
            {subTitle && <span className="text-xs text-slate-400 font-normal">| {subTitle}</span>}
          </div>
          {extra && <div className="flex items-center space-x-2">{extra}</div>}
        </div>
      )}

      {/* 内容区域 */}
      <div className="relative z-10 text-slate-700">{children}</div>
    </div>
  );
};
