import React, { useState, useEffect } from 'react';
import {
  Bell,
  Maximize2,
  Minimize2,
  CloudLightning,
} from 'lucide-react';

export type TopNavKey =
  | 'cockpit'
  | 'basic'
  | 'iot-devices'
  | 'iot-data'
  | 'alarm'
  | 'mobile'
  | 'topology'
  | 'specs';

interface TechHeaderProps {
  currentTopNav: TopNavKey;
  onSelectTopNav: (navKey: TopNavKey) => void;
  pendingAlarmCount: number;
  onOpenAlarmQuickModal: () => void;
}

export const TechHeader: React.FC<TechHeaderProps> = ({
  currentTopNav,
  onSelectTopNav,
  pendingAlarmCount,
  onOpenAlarmQuickModal,
}) => {
  const [timeStr, setTimeStr] = useState('19:27');
  const [dateStr, setDateStr] = useState('2026-08-02');
  const [weekdayStr, setWeekdayStr] = useState('星期一');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      setWeekdayStr(days[now.getDay()]);
      setDateStr(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullScreen(false);
    }
  };

  const navItems: Array<{ key: TopNavKey; label: string; hasSub: boolean }> = [
    { key: 'cockpit', label: '驾驶舱', hasSub: false },
    { key: 'basic', label: '基础管理', hasSub: true },
    { key: 'iot-devices', label: '物联设备', hasSub: true },
    { key: 'iot-data', label: '物联数据', hasSub: true },
    { key: 'alarm', label: '告警预警', hasSub: true },
    { key: 'mobile', label: '移动协同', hasSub: false },
    { key: 'topology', label: '系统拓扑', hasSub: false },
    { key: 'specs', label: '需求规格', hasSub: false },
  ];

  return (
    <header className="h-16 bg-[#eef4f2] border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between select-none z-30 sticky top-0">
      {/* 左侧：标志性多边形Logo与标题 */}
      <div
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onSelectTopNav('cockpit')}
      >
        <div className="relative w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-xs">
            <polygon points="16,2 28,9 16,16 4,9" fill="#10b981" />
            <polygon points="4,9 16,16 16,30 4,23" fill="#059669" />
            <polygon points="16,16 28,9 28,23 16,30" fill="#0284c7" />
          </svg>
        </div>

        <div>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            南平庭春鹿业运营中心
          </h1>
          <p className="text-[9px] font-mono text-slate-400 -mt-0.5 tracking-wider uppercase">
            Nanping Tingchun Deer Farm Operation Center
          </p>
        </div>
      </div>

      {/* 中间：主导航链接 (高亮绿色下划线指示条) */}
      <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-semibold text-slate-600">
        {navItems.map((item) => {
          const isActive = currentTopNav === item.key;
          return (
            <button
              key={item.key}
              id={`top-nav-${item.key}`}
              onClick={() => onSelectTopNav(item.key)}
              className={`relative py-5 transition-colors cursor-pointer ${
                isActive ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 右侧：实时时钟 19:27、日期与天气 */}
      <div className="flex items-center space-x-3.5">
        {/* 大字号数字时钟 (匹配参考图中的 19:27) */}
        <div className="flex items-baseline text-slate-900 font-mono font-bold text-2xl tracking-tighter">
          <span>{timeStr}</span>
        </div>

        {/* 星期与日期 (竖向堆叠) */}
        <div className="hidden sm:flex flex-col text-[10px] text-slate-500 font-medium leading-tight">
          <span className="text-slate-800 font-bold">{weekdayStr}</span>
          <span className="font-mono text-slate-400">{dateStr}</span>
        </div>

        {/* 天气微组件 (匹配参考图中的 32℃ 雷阵雨) */}
        <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-amber-100/60 text-amber-600 flex items-center justify-center">
            <CloudLightning className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[10px] leading-tight">
            <div className="font-bold text-slate-800 font-mono">32 ℃</div>
            <div className="text-slate-400 text-[9px]">雷阵雨</div>
          </div>
        </div>

        {/* 告警提醒 */}
        <button
          onClick={onOpenAlarmQuickModal}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          title="待处理告警"
        >
          <Bell className="w-4 h-4" />
          {pendingAlarmCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-3.5 px-0.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {pendingAlarmCount}
            </span>
          )}
        </button>

        {/* 全屏切换 */}
        <button
          onClick={toggleFullScreen}
          className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          title={isFullScreen ? '退出全屏' : '全屏显示'}
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
