import React, { useState, useMemo, useEffect } from 'react';
import { DeerRecord, HouseInfo, DeviceInfo, AlarmItem, TransferRecord } from '../../types/deer';
import { AMapContainer } from './AMapContainer';
import {
  Users,
  Search,
  ChevronDown,
  Clock,
  Sun,
  Bell,
  Maximize2,
  Minimize2,
  User,
  Shield,
  Radio,
  Video,
  Wind,
  Volume2,
  Activity,
  Footprints,
  Cpu,
  Layers,
  ArrowLeft,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  MapPin,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface CockpitDashboardProps {
  deers: DeerRecord[];
  houses: HouseInfo[];
  devices: DeviceInfo[];
  alarms: AlarmItem[];
  onSelectDeer: (deer: DeerRecord | null) => void;
  selectedDeer: DeerRecord | null;
  onInitiateTransfer: (deer: DeerRecord) => void;
  onNavigateToManagement: (menuKey: string) => void;
  onResolveAlarm: (alarmId: string) => void;
  onOpenAlarmQuickModal?: () => void;
}

export const CockpitDashboard: React.FC<CockpitDashboardProps> = ({
  deers,
  houses,
  devices,
  alarms,
  onSelectDeer,
  selectedDeer,
  onInitiateTransfer,
  onNavigateToManagement,
  onResolveAlarm,
  onOpenAlarmQuickModal,
}) => {
  // 视角模式：南平庭春鹿业全景 vs 圈舍精细 (参考图1顶部中间按钮)
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  // 搜索关键字与搜索过滤类型 (参考图1左上角 [人员 v | 输入姓名/工号...])
  const [searchCategory, setSearchCategory] = useState<'deer' | 'device' | 'house'>('deer');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchCategoryDropdownOpen, setIsSearchCategoryDropdownOpen] = useState(false);

  // 全屏状态
  const [isFullScreen, setIsFullScreen] = useState(false);

  // 实时时钟
  const [currentTimeStr, setCurrentTimeStr] = useState('2026-09-19 09:18:15 星期六');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const weekStr = days[now.getDay()];
      setCurrentTimeStr(`${dateStr} ${timeStr} ${weekStr}`);
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

  // 告警统计
  const pendingAlarms = useMemo(() => alarms.filter((a) => a.status !== 'resolved'), [alarms]);
  const resolvedAlarms = useMemo(() => alarms.filter((a) => a.status === 'resolved'), [alarms]);

  // 处理搜索匹配
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) return;

    if (searchCategory === 'deer') {
      const match = deers.find(
        (d) =>
          d.name.includes(searchKeyword) ||
          d.earTagId.includes(searchKeyword) ||
          d.houseName.includes(searchKeyword)
      );
      if (match) {
        onSelectDeer(match);
      }
    }
  };

  return (
    <div className="relative w-full h-[100vh] bg-[#07111a] text-white overflow-hidden select-none flex flex-col font-sans">
      {/* ===================== 顶部科技 Header (南平庭春鹿业驾驶舱顶栏) ===================== */}
      <header className="relative h-16 w-full z-40 bg-gradient-to-b from-[#071d28]/95 to-[#07131e]/90 border-b border-cyan-500/30 px-4 flex items-center justify-between backdrop-blur-md">
        {/* 左侧：返回系统 与 鹿只/人员快速搜索输入框 */}
        <div className="flex items-center space-x-3">
          {/* 返回系统按钮 */}
          <button
            onClick={() => onNavigateToManagement('basic-entry')}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>返回系统</span>
          </button>

          {/* 搜索分类选择与输入框 (参考图1 [人员 v | 输入姓名/工号...]) */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSearchCategoryDropdownOpen(!isSearchCategoryDropdownOpen)}
                className="h-8 px-2.5 rounded-l-xl bg-[#09222e] border-y border-l border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-cyan-900/60"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>{searchCategory === 'deer' ? '鹿只' : searchCategory === 'device' ? '设备' : '圈舍'}</span>
                <ChevronDown className="w-3 h-3 text-cyan-400" />
              </button>

              {isSearchCategoryDropdownOpen && (
                <div className="absolute top-9 left-0 w-24 bg-[#09222e] border border-cyan-500/50 rounded-lg shadow-2xl z-50 text-xs py-1">
                  <div
                    onClick={() => {
                      setSearchCategory('deer');
                      setIsSearchCategoryDropdownOpen(false);
                    }}
                    className="px-3 py-1.5 hover:bg-cyan-800 text-slate-200 cursor-pointer"
                  >
                    鹿只个体
                  </div>
                  <div
                    onClick={() => {
                      setSearchCategory('device');
                      setIsSearchCategoryDropdownOpen(false);
                    }}
                    className="px-3 py-1.5 hover:bg-cyan-800 text-slate-200 cursor-pointer"
                  >
                    物联设备
                  </div>
                  <div
                    onClick={() => {
                      setSearchCategory('house');
                      setIsSearchCategoryDropdownOpen(false);
                    }}
                    className="px-3 py-1.5 hover:bg-cyan-800 text-slate-200 cursor-pointer"
                  >
                    圈舍栏位
                  </div>
                </div>
              )}
            </div>

            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="输入鹿只名/耳标号/栏位..."
              className="h-8 w-44 lg:w-56 bg-[#071822] border-y border-r border-cyan-500/40 rounded-r-xl px-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
            />
            <button type="submit" className="absolute right-2 text-cyan-400 hover:text-cyan-200 cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 中间：大屏发光科技大标题与全景/精细切换胶囊 (完全参考图1 [厂区全景] [造船项目]) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* 大标题 */}
          <div className="relative flex items-center">
            <h1 className="text-lg lg:text-xl font-black tracking-widest bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
              南平庭春鹿业智慧驾驶舱
            </h1>
          </div>

          {/* 视角切换胶囊按钮 (参考图1 [厂区全景] [造船项目]) */}
          <div className="flex items-center space-x-1 mt-1 bg-[#051722]/80 border border-cyan-500/40 p-0.5 rounded-full shadow-inner">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'overview'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-900/50'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>南平庭春鹿业全景</span>
            </button>
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'detail'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-900/50'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>圈舍精细</span>
            </button>
          </div>
        </div>

        {/* 右侧：实时时钟、天气、触发告警信息、全屏、管理员 (完全复刻参考图1) */}
        <div className="flex items-center space-x-3.5 text-xs">
          {/* 实时时间与天气 */}
          <div className="hidden xl:flex items-center space-x-2 text-cyan-200 font-mono text-[11px]">
            <span>{currentTimeStr}</span>
            <div className="flex items-center space-x-1 pl-2 border-l border-cyan-500/30 text-amber-300">
              <Sun className="w-3.5 h-3.5" />
              <span>25℃ 晴</span>
            </div>
          </div>

          {/* 红色触发告警胶囊按钮 (参考图1 [🚨 触发告警信息]) */}
          <button
            onClick={() => {
              if (onOpenAlarmQuickModal) onOpenAlarmQuickModal();
              else onNavigateToManagement('alarm-records');
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 border border-rose-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-950/60 animate-pulse"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>触发告警信息 ({pendingAlarms.length})</span>
          </button>

          {/* 全屏控制 */}
          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 transition-colors cursor-pointer"
            title="全屏切换"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* 管理员身份 */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-slate-200">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold">南平庭春鹿业管理员</span>
          </div>
        </div>
      </header>

      {/* ===================== 主体：高德地图/卫星影像底座 (打点、围栏、设备完全融合在此) ===================== */}
      <div className="relative flex-1 w-full h-full">
        {/* 地图底图交互引擎 (打点、发光电子围栏、物联设备全部融合渲染) */}
        <AMapContainer
          deers={deers}
          houses={houses}
          devices={devices}
          alarms={alarms}
          selectedDeer={selectedDeer}
          onSelectDeer={onSelectDeer}
          selectedHouse={null}
          onSelectHouse={() => {}}
          viewMode={viewMode}
          onSwitchViewMode={setViewMode}
        />

        {/* ===================== 左侧科技面板 (完全复刻参考图 1 的 3 个统计卡片) ===================== */}
        <div className="absolute top-4 left-4 bottom-4 w-[300px] z-30 flex flex-col space-y-3 pointer-events-auto overflow-y-auto pr-1">
          
          {/* 卡片 1: 厂区鹿只定位总览 (参考图1大圆形环表与总数) */}
          <div className="bg-[#081b26]/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-3.5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center space-x-1.5 mb-3">
              <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45" />
              <h3 className="text-xs font-bold text-cyan-300 tracking-wider">南平庭春鹿业鹿只定位总览</h3>
            </div>

            <div className="flex items-center justify-between">
              {/* 大圆环仪表 (总数 1284只) */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#0e3042" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <Users className="w-4 h-4 text-cyan-400 mb-0.5" />
                  <div className="text-sm font-black font-mono text-cyan-300 leading-none">
                    {deers.length * 64 + 4}
                  </div>
                  <div className="text-[9px] text-slate-400 scale-90">鹿只总数</div>
                </div>
              </div>

              {/* 在栏/离栏指标胶囊 (参考图1) */}
              <div className="space-y-2 flex-1 pl-3 text-xs font-mono">
                <div className="bg-[#0c2636] p-2 rounded-xl border border-cyan-500/20 flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-slate-300 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>在栏鹿只</span>
                  </div>
                  <strong className="text-cyan-300 font-bold text-sm">
                    {deers.length * 64 - 32}
                  </strong>
                </div>

                <div className="bg-[#0c2636] p-2 rounded-xl border border-cyan-500/20 flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-slate-300 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>离栏/放牧</span>
                  </div>
                  <strong className="text-amber-400 font-bold text-sm">36</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 卡片 2: 当日各圈舍鹿群分布 (参考图1渐变长条进度条) */}
          <div className="bg-[#081b26]/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-3.5 shadow-2xl relative">
            <div className="flex items-center space-x-1.5 mb-3">
              <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45" />
              <h3 className="text-xs font-bold text-cyan-300 tracking-wider">当日各圈舍鹿群分布</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: '1号特级种公鹿舍', count: 48, max: 50, color: 'from-cyan-500 to-teal-400' },
                { name: '2号繁育母鹿舍', count: 286, max: 300, color: 'from-cyan-500 to-blue-400' },
                { name: '3号育成鹿舍', count: 165, max: 200, color: 'from-teal-500 to-emerald-400' },
                { name: '4号隔离/产房特护舍', count: 142, max: 150, color: 'from-blue-500 to-indigo-400' },
                { name: '南区生态放牧运动场', count: 320, max: 400, color: 'from-cyan-400 to-teal-300' },
                { name: '北区日光补钙场', count: 118, max: 150, color: 'from-sky-500 to-cyan-300' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {item.name}
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">{item.count} 头</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0e3042] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(item.count / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 卡片 3: 鹿群品种与类型统计 (参考图1下方甜甜圈图与图例) */}
          <div className="bg-[#081b26]/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-3.5 shadow-2xl relative flex-1 flex flex-col">
            <div className="flex items-center space-x-1.5 mb-2">
              <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45" />
              <h3 className="text-xs font-bold text-cyan-300 tracking-wider">鹿群品种与结构统计</h3>
            </div>

            <div className="flex items-center justify-between flex-1">
              {/* 环形图 */}
              <div className="relative w-22 h-22 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#0e3042" strokeWidth="4" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="45, 100" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="28, 100" strokeDashoffset="-45" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="14, 100" strokeDashoffset="-73" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#ec4899" strokeWidth="4" strokeDasharray="13, 100" strokeDashoffset="-87" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black font-mono text-white">1,284</span>
                  <span className="text-[8px] text-slate-400">总存栏</span>
                </div>
              </div>

              {/* 图例列表 */}
              <div className="space-y-1.5 text-[10px] flex-1 pl-2">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    特级种公鹿
                  </span>
                  <span className="font-mono text-cyan-300">158头 (12.3%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    繁育母鹿
                  </span>
                  <span className="font-mono text-emerald-400">368头 (28.7%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    育成青年鹿
                  </span>
                  <span className="font-mono text-amber-400">586头 (45.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    哺乳幼鹿
                  </span>
                  <span className="font-mono text-pink-400">172头 (13.4%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ===================== 右侧科技面板 (完全复刻参考图 1 实时告警、7日趋势、设备总览) ===================== */}
        <div className="absolute top-4 right-4 bottom-4 w-[300px] z-30 flex flex-col space-y-3 pointer-events-auto overflow-y-auto pl-1">
          
          {/* 卡片 1: 实时告警信息 (参考图1今日告警11起、已处理6起、未处理5起) */}
          <div className="bg-[#081b26]/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-3.5 shadow-2xl relative flex flex-col max-h-60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 rounded-xs bg-rose-500 rotate-45" />
                <h3 className="text-xs font-bold text-rose-400 tracking-wider">实时告警信息</h3>
              </div>
              <button
                onClick={() => onNavigateToManagement('alarm-records')}
                className="text-[10px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
              >
                更多 &gt;
              </button>
            </div>

            {/* 告警状态概览胶囊 */}
            <div className="flex items-center justify-between text-[11px] font-mono bg-[#0c2636] p-1.5 rounded-xl border border-cyan-500/20 mb-2">
              <span>今日告警: <strong className="text-white">11 起</strong></span>
              <span className="text-rose-400">● 未处理: <strong>5 起</strong></span>
              <span className="text-emerald-400">● 已处理: <strong>6 起</strong></span>
            </div>

            {/* 告警列表 */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 text-xs">
              {alarms.slice(0, 4).map((alm) => {
                const isResolved = alm.status === 'resolved';
                return (
                  <div
                    key={alm.id}
                    className="p-2 rounded-xl bg-[#0a202d] border border-cyan-500/20 space-y-1"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isResolved ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                          }`}
                        >
                          {isResolved ? '已处理' : '待处置'}
                        </span>
                        <span className="text-cyan-300 font-mono">{alm.occurredTime.split(' ')[1]}</span>
                      </div>
                      <span className="text-slate-400 text-[9px] font-mono">{alm.houseName}</span>
                    </div>

                    <div className="text-[11px] text-slate-200 font-semibold truncate">
                      {alm.title}
                    </div>

                    {!isResolved && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onResolveAlarm(alm.id)}
                          className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold cursor-pointer transition-colors"
                        >
                          立即闭环
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 卡片 2: 近7日告警与发情趋势 (参考图1发光折线图) */}
          <div className="bg-[#081b26]/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-3.5 shadow-2xl relative">
            <div className="flex items-center space-x-1.5 mb-2">
              <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45" />
              <h3 className="text-xs font-bold text-cyan-300 tracking-wider">近7日告警与发情趋势</h3>
            </div>

            {/* 折线图 SVG 模拟 */}
            <div className="relative h-20 w-full pt-2">
              <svg className="w-full h-full" viewBox="0 0 260 60">
                {/* 渐变发光折线 */}
                <defs>
                  <linearGradient id="alertLineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* 阴影面积 */}
                <polygon
                  points="10,35 50,25 90,40 130,15 170,28 210,29 250,42 250,55 10,55"
                  fill="url(#alertLineGrad)"
                />

                {/* 折线 */}
                <polyline
                  points="10,35 50,25 90,40 130,15 170,28 210,29 250,42"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* 数据圆点 */}
                {[
                  { x: 10, y: 35 },
                  { x: 50, y: 25 },
                  { x: 90, y: 40 },
                  { x: 130, y: 15 },
                  { x: 170, y: 28 },
                  { x: 210, y: 29 },
                  { x: 250, y: 42 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="2.5"
                    fill="#ffffff"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>

              {/* X轴日期 */}
              <div className="flex justify-between text-[8px] text-slate-400 font-mono mt-0.5">
                <span>08-29</span>
                <span>08-30</span>
                <span>08-31</span>
                <span>09-01</span>
                <span>09-02</span>
                <span>09-03</span>
                <span>09-04</span>
              </div>
            </div>
          </div>

          {/* 卡片 3: 设备总览与设备类型统计 (参考图1设备总数512、在线485、离线27、在线率94.7%) */}
          <div className="bg-[#081b26]/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-3.5 shadow-2xl relative flex-1 flex flex-col">
            <div className="flex items-center space-x-1.5 mb-2.5">
              <div className="w-2 h-2 rounded-xs bg-cyan-400 rotate-45" />
              <h3 className="text-xs font-bold text-cyan-300 tracking-wider">设备总览</h3>
            </div>

            {/* 4个核心设备指标方块 (参考图1 [512设备总数] [485在线] [27离线] [94.7%在线率]) */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono mb-3">
              <div className="bg-[#0a202e] p-1.5 rounded-xl border border-cyan-500/20">
                <div className="text-sm font-bold text-cyan-300">512</div>
                <div className="text-[8px] text-slate-400">设备总数</div>
              </div>
              <div className="bg-[#0a202e] p-1.5 rounded-xl border border-emerald-500/20">
                <div className="text-sm font-bold text-emerald-400">485</div>
                <div className="text-[8px] text-slate-400">在线设备</div>
              </div>
              <div className="bg-[#0a202e] p-1.5 rounded-xl border border-rose-500/20">
                <div className="text-sm font-bold text-rose-400">27</div>
                <div className="text-[8px] text-slate-400">离线设备</div>
              </div>
              <div className="bg-[#0a202e] p-1.5 rounded-xl border border-teal-500/20">
                <div className="text-sm font-bold text-teal-300">94.7%</div>
                <div className="text-[8px] text-slate-400">在线率</div>
              </div>
            </div>

            {/* 设备类型占比圆环图 (参考图1) */}
            <div className="flex items-center justify-between flex-1">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#0e3042" strokeWidth="4" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray="42.6, 100" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="31.6, 100" strokeDashoffset="-42.6" />
                  <circle cx="18" cy="18" r="13" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="25.8, 100" strokeDashoffset="-74.2" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xs font-black font-mono text-cyan-300">512</span>
                  <span className="text-[7px] text-slate-400">总台套</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[9px] flex-1 pl-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    E500主基站
                  </span>
                  <span className="text-cyan-300">218 台 (42.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    气体微气象站
                  </span>
                  <span className="text-emerald-400">162 台 (31.6%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    声光报警器
                  </span>
                  <span className="text-amber-400">132 台 (25.8%)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
