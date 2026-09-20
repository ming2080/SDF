import React, { useState, useEffect } from 'react';
import { DeerRecord, HouseInfo, DeviceInfo, AlarmItem } from '../../types/deer';
import {
  Maximize2,
  Minimize2,
  RotateCw,
  Layers,
  Eye,
  Shield,
  Zap,
  Thermometer,
  Radio,
  Video,
  Activity,
  Flame,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface IsometricDigitalTwinProps {
  deers: DeerRecord[];
  houses: HouseInfo[];
  devices: DeviceInfo[];
  alarms: AlarmItem[];
  onSelectDeer: (deer: DeerRecord) => void;
  selectedDeer: DeerRecord | null;
  onInitiateTransfer: (deer: DeerRecord) => void;
}

export const IsometricDigitalTwin: React.FC<IsometricDigitalTwinProps> = ({
  deers,
  houses,
  devices,
  alarms,
  onSelectDeer,
  selectedDeer,
  onInitiateTransfer,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'thermal' | 'fence' | 'pipeline' | 'patrol'>('all');
  const [activeBarnHover, setActiveBarnHover] = useState<HouseInfo | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 待处理异常
  const feverDeers = deers.filter((d) => d.status === 'sick' || d.temperature >= 39.8);
  const estrusDeers = deers.filter((d) => d.status === 'estrus' || d.estrusScore > 80);

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col justify-between overflow-hidden select-none">
      {/* 3D 视图工具栏 (顶部居中浮动胶囊) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-md space-x-1 text-xs">
        <button
          onClick={() => setViewMode('all')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            viewMode === 'all'
              ? 'bg-emerald-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          全景沙盘
        </button>
        <button
          onClick={() => setViewMode('thermal')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            viewMode === 'thermal'
              ? 'bg-emerald-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          热力测温 (14台)
        </button>
        <button
          onClick={() => setViewMode('fence')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            viewMode === 'fence'
              ? 'bg-emerald-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          电子围栏
        </button>
        <button
          onClick={() => setViewMode('pipeline')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            viewMode === 'pipeline'
              ? 'bg-emerald-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          管网与能耗
        </button>
        <button
          onClick={() => setViewMode('patrol')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${
            viewMode === 'patrol'
              ? 'bg-emerald-500 text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          AI巡检视点
        </button>

        <span className="w-px h-3.5 bg-slate-200 mx-1" />

        <button
          onClick={() => setIsRotating(!isRotating)}
          title="自动旋转视角"
          className={`p-1.5 rounded-full transition-colors ${
            isRotating ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 核心 3D 数字孪生等轴测主沙盘 (SVG 3D Architecture Canvas) */}
      <div className="relative w-full flex-1 flex items-center justify-center p-2">
        <svg
          viewBox="0 0 1200 700"
          className={`w-full h-full max-h-[620px] transition-transform duration-700 ease-out ${
            isRotating ? 'scale-[1.02]' : ''
          }`}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            {/* 渐变与滤镜 */}
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eaf1ed" />
              <stop offset="50%" stopColor="#e3ede8" />
              <stop offset="100%" stopColor="#dce8e1" />
            </linearGradient>

            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cfded7" />
              <stop offset="100%" stopColor="#c5d6ce" />
            </linearGradient>

            {/* 建筑白色陶瓷质感 */}
            <linearGradient id="buildingTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f4f7f6" />
            </linearGradient>
            <linearGradient id="buildingLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2ebe6" />
              <stop offset="100%" stopColor="#d3dfd9" />
            </linearGradient>
            <linearGradient id="buildingRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c2d3cc" />
              <stop offset="100%" stopColor="#b4c7be" />
            </linearGradient>

            {/* 现代化钢构与玻璃 */}
            <linearGradient id="glassTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>

            {/* 发光绿色塔与管道 (匹配参考图中的绿色冷却塔/粮仓) */}
            <linearGradient id="towerGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* 发光橙色塔 (匹配参考图中的橙色发光塔) */}
            <linearGradient id="towerOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            {/* 发光圆球储罐 */}
            <linearGradient id="sphereGrad" x1="30%" y1="30%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e0e8e4" />
              <stop offset="100%" stopColor="#a3b8af" />
            </linearGradient>

            {/* 柔和阴影 */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#1e3a2f" floodOpacity="0.12" />
            </filter>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.6" />
            </filter>
            <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f97316" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. 地面基础等轴测多边形 */}
          <polygon
            points="600,60 1150,340 600,660 50,340"
            fill="url(#groundGrad)"
            stroke="#d0ded6"
            strokeWidth="1.5"
            filter="url(#softShadow)"
          />

          {/* 地面等轴测网格与道路系统 */}
          {/* 主环道 */}
          <polygon points="600,100 1080,340 600,620 120,340" fill="none" stroke="url(#roadGrad)" strokeWidth="32" strokeLinejoin="round" />
          {/* 道路中虚线 */}
          <polygon points="600,100 1080,340 600,620 120,340" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" />

          {/* 园区内部横向连通支路 */}
          <path d="M 360,220 L 840,460" stroke="#cfded7" strokeWidth="16" />
          <path d="M 400,440 L 800,240" stroke="#cfded7" strokeWidth="16" />

          {/* 绿化草坪与太阳能光伏区 */}
          <polygon points="200,320 300,270 380,310 280,360" fill="#cbe2d3" stroke="#b4d4be" strokeWidth="1" />
          <polygon points="820,410 920,360 1000,400 900,450" fill="#cbe2d3" stroke="#b4d4be" strokeWidth="1" />

          {/* 电子围栏激光边界 (动态可见) */}
          {(viewMode === 'all' || viewMode === 'fence') && (
            <g className="transition-opacity duration-300">
              <polygon
                points="590,75 1130,335 590,645 70,335"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="12 6"
                className="animate-pulse"
                filter="url(#glowGreen)"
              />
              {/* 围栏四角预警柱 */}
              <circle cx="590" cy="75" r="4" fill="#10b981" />
              <circle cx="1130" cy="335" r="4" fill="#10b981" />
              <circle cx="590" cy="645" r="4" fill="#10b981" />
              <circle cx="70" cy="335" r="4" fill="#10b981" />
            </g>
          )}

          {/* 2. 管道与能量流 (连接各圈舍与中控楼) */}
          {(viewMode === 'all' || viewMode === 'pipeline') && (
            <g>
              {/* 绿色液态饲料配料主管道 */}
              <path
                d="M 440,380 L 520,340 L 580,370 L 670,325 L 750,365"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowGreen)"
              />
              {/* 橙色供暖与沼气能耗主管道 */}
              <path
                d="M 680,310 L 740,340 L 800,310 L 720,270"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glowOrange)"
              />
            </g>
          )}

          {/* 3. 后景建筑群：现代化球形发酵储罐群 (3只大球罐) */}
          <g transform="translate(420, 80)">
            {/* 球罐1 */}
            <circle cx="40" cy="40" r="32" fill="url(#sphereGrad)" stroke="#c2d3cc" strokeWidth="1" />
            <ellipse cx="40" cy="40" rx="32" ry="12" fill="none" stroke="#9bb1a7" strokeWidth="0.8" />
            <line x1="40" y1="8" x2="40" y2="72" stroke="#9bb1a7" strokeWidth="0.8" />
            <line x1="20" y1="68" x2="20" y2="82" stroke="#718c80" strokeWidth="3" />
            <line x1="60" y1="68" x2="60" y2="82" stroke="#718c80" strokeWidth="3" />

            {/* 球罐2 */}
            <circle cx="100" cy="30" r="28" fill="url(#sphereGrad)" stroke="#c2d3cc" strokeWidth="1" />
            <ellipse cx="100" cy="30" rx="28" ry="10" fill="none" stroke="#9bb1a7" strokeWidth="0.8" />
            <line x1="100" y1="2" x2="100" y2="58" stroke="#9bb1a7" strokeWidth="0.8" />
            <line x1="82" y1="54" x2="82" y2="68" stroke="#718c80" strokeWidth="3" />
            <line x1="118" y1="54" x2="118" y2="68" stroke="#718c80" strokeWidth="3" />

            {/* 球罐3 */}
            <circle cx="155" cy="45" r="34" fill="url(#sphereGrad)" stroke="#c2d3cc" strokeWidth="1" />
            <ellipse cx="155" cy="45" rx="34" ry="12" fill="none" stroke="#9bb1a7" strokeWidth="0.8" />
            <line x1="155" y1="11" x2="155" y2="79" stroke="#9bb1a7" strokeWidth="0.8" />
            <line x1="135" y1="74" x2="135" y2="90" stroke="#718c80" strokeWidth="3" />
            <line x1="175" y1="74" x2="175" y2="90" stroke="#718c80" strokeWidth="3" />
          </g>

          {/* 4. 标志性中央结构：高耸冷却/测温数字双塔 (绿塔 + 橙塔，完美还原参考图) */}
          <g transform="translate(560, 190)">
            {/* 绿色网格塔 (左塔) */}
            <g className="cursor-pointer" onClick={() => setSelectedHotspot('tower-green')}>
              <path
                d="M 50,20 C 50,50 30,110 20,150 L 80,150 C 70,110 50,50 50,20 Z"
                fill="url(#towerGreenGrad)"
                opacity="0.9"
                filter="url(#glowGreen)"
              />
              {/* 塔顶网格发光线 */}
              <ellipse cx="50" cy="20" rx="14" ry="5" fill="#34d399" stroke="#ffffff" strokeWidth="1" />
              {/* 塔身经纬网格线 */}
              <path d="M 40,60 Q 50,65 60,60" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <path d="M 32,95 Q 50,103 68,95" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <path d="M 24,130 Q 50,140 76,130" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <line x1="50" y1="20" x2="50" y2="150" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <line x1="38" y1="22" x2="28" y2="150" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              <line x1="62" y1="22" x2="72" y2="150" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            </g>

            {/* 橙色发光塔 (右塔) */}
            <g className="cursor-pointer" onClick={() => setSelectedHotspot('tower-orange')}>
              <path
                d="M 125,10 C 125,45 100,105 88,145 L 160,145 C 148,105 125,45 125,10 Z"
                fill="url(#towerOrangeGrad)"
                opacity="0.92"
                filter="url(#glowOrange)"
              />
              <ellipse cx="125" cy="10" rx="16" ry="6" fill="#fed7aa" stroke="#ffffff" strokeWidth="1" />
              <path d="M 112,50 Q 125,56 138,50" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <path d="M 102,85 Q 125,93 148,85" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <path d="M 92,120 Q 125,130 158,120" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <line x1="125" y1="10" x2="125" y2="145" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
              <line x1="112" y1="12" x2="98" y2="145" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              <line x1="138" y1="12" x2="152" y2="145" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            </g>

            {/* 细长银色通风排气主烟囱 */}
            <rect x="7" y="-10" width="8" height="160" fill="#94a3b8" rx="2" />
            <ellipse cx="11" cy="-10" rx="4" ry="2" fill="#e2e8f0" />
          </g>

          {/* 5. 智慧钢架立体饲料加工塔 (左侧立体楼) */}
          <g transform="translate(390, 150)" className="cursor-pointer" onClick={() => setSelectedHotspot('tower-feed')}>
            {/* 立体钢架立柱 */}
            <rect x="0" y="30" width="6" height="150" fill="#94a3b8" />
            <rect x="70" y="0" width="6" height="150" fill="#64748b" />
            <rect x="35" y="80" width="6" height="130" fill="#475569" />

            {/* 层叠平台 */}
            {[0, 25, 50, 75, 100, 125].map((y, i) => (
              <polygon
                key={i}
                points={`0,${30 + y} 70,${y} 105,${20 + y} 35,${50 + y}`}
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth="1.2"
                opacity="0.85"
              />
            ))}
          </g>

          {/* 6. 智慧圈舍 1：1号特级种公鹿舍 (左前侧大建筑) */}
          <g
            transform="translate(480, 420)"
            className="cursor-pointer group"
            onMouseEnter={() => setActiveBarnHover(houses[0])}
            onMouseLeave={() => setActiveBarnHover(null)}
            onClick={() => setSelectedHotspot('barn-1')}
          >
            {/* 建筑顶面 */}
            <polygon points="0,-20 120,-80 170,-55 50,5" fill="url(#buildingTop)" stroke="#94a3b8" strokeWidth="1" />
            {/* 建筑左侧面 */}
            <polygon points="0,-20 50,5 50,65 0,40" fill="url(#buildingLeft)" stroke="#94a3b8" strokeWidth="1" />
            {/* 建筑右侧面 */}
            <polygon points="50,5 170,-55 170,5 50,65" fill="url(#buildingRight)" stroke="#94a3b8" strokeWidth="1" />

            {/* 窗户矩阵与太阳能板 */}
            <polygon points="10,-10 110,-60 125,-52 25,-2" fill="#38bdf8" opacity="0.7" />
            {/* 侧面通风百叶窗 */}
            {[10, 20, 30, 40].map((y, idx) => (
              <line key={idx} x1="10" y1={-5 + y} x2="40" y2={10 + y} stroke="#0284c7" strokeWidth="2.5" />
            ))}

            {/* 圈舍状态指示标牌 */}
            <circle cx="85" cy="-25" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="url(#glowGreen)" />
            <text x="96" y="-22" fontSize="9" fill="#0f172a" fontWeight="bold">
              1号特级种公舍 (在栏48只)
            </text>
          </g>

          {/* 智慧圈舍 2：2号繁育母鹿舍 (右侧现代大楼) */}
          <g
            transform="translate(760, 320)"
            className="cursor-pointer group"
            onMouseEnter={() => setActiveBarnHover(houses[1])}
            onMouseLeave={() => setActiveBarnHover(null)}
            onClick={() => setSelectedHotspot('barn-2')}
          >
            <polygon points="0,-15 110,-70 160,-45 50,10" fill="url(#buildingTop)" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="0,-15 50,10 50,70 0,45" fill="url(#buildingLeft)" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="50,10 160,-45 160,10 50,70" fill="url(#buildingRight)" stroke="#94a3b8" strokeWidth="1" />

            {/* 天窗矩阵 */}
            <polygon points="15,-10 95,-50 110,-42 30,-2" fill="#34d399" opacity="0.6" />

            <circle cx="80" cy="-20" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="url(#glowGreen)" />
            <text x="92" y="-17" fontSize="9" fill="#0f172a" fontWeight="bold">
              2号繁育母舍 (在栏56只)
            </text>
          </g>

          {/* 智慧圈舍 3：3号育成舍 (左侧后楼) */}
          <g transform="translate(280, 300)" className="cursor-pointer" onClick={() => setSelectedHotspot('barn-3')}>
            <polygon points="0,-10 90,-55 130,-35 40,10" fill="url(#buildingTop)" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="0,-10 40,10 40,60 0,40" fill="url(#buildingLeft)" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="40,10 130,-35 130,15 40,60" fill="url(#buildingRight)" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="65" cy="-12" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            <text x="75" y="-9" fontSize="8" fill="#334155" fontWeight="bold">
              3号育成舍 (在栏42只)
            </text>
          </g>

          {/* 智慧圈舍 4：4号隔离/康复舍 (左侧发热点高亮红光) */}
          <g transform="translate(340, 420)" className="cursor-pointer" onClick={() => setSelectedHotspot('barn-4')}>
            <polygon points="0,-10 70,-45 100,-30 30,5" fill="url(#buildingTop)" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="0,-10 30,5 30,45 0,30" fill="url(#buildingLeft)" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="30,5 100,-30 100,10 30,45" fill="url(#buildingRight)" stroke="#94a3b8" strokeWidth="1" />
            {feverDeers.length > 0 ? (
              <g>
                <circle cx="50" cy="-10" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="animate-ping" />
                <circle cx="50" cy="-10" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="60" y="-7" fontSize="8" fill="#dc2626" fontWeight="bold">
                  4号隔离舍 (预警 {feverDeers.length}只发热)
                </text>
              </g>
            ) : (
              <circle cx="50" cy="-10" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            )}
          </g>

          {/* 7. 通道式超高频识读网关 (通道出入口处，900张/秒雷达波) */}
          <g transform="translate(730, 460)" className="cursor-pointer" onClick={() => setSelectedHotspot('rfid-gate')}>
            {/* 门架 */}
            <rect x="0" y="0" width="6" height="36" fill="#0284c7" />
            <rect x="34" y="-18" width="6" height="36" fill="#0284c7" />
            <line x1="3" y1="0" x2="37" y2="-18" stroke="#0284c7" strokeWidth="4" />
            {/* 扫描激光波 */}
            <polygon points="3,6 37,-12 55,2 21,20" fill="#38bdf8" opacity="0.35" className="animate-pulse" />
            <text x="45" y="10" fontSize="8" fill="#0369a1" fontWeight="bold">
              RFID高速通道 (900t/s)
            </text>
          </g>

          {/* 8. 实时漫游鹿只点位 (佩戴E501-R1耳标，可点击交互) */}
          {deers.slice(0, 32).map((deer, idx) => {
            // 根据坐标计算等轴测投影位置
            const baseX = 200 + (deer.posX / 100) * 780;
            const baseY = 200 + (deer.posY / 100) * 360;

            const isFever = deer.status === 'sick' || deer.temperature >= 39.8;
            const isEstrus = deer.status === 'estrus' || deer.estrusScore > 80;
            const isSelected = selectedDeer?.id === deer.id;

            return (
              <g
                key={deer.id}
                transform={`translate(${baseX}, ${baseY})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectDeer(deer)}
              >
                {/* 状态光晕 */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 10 : isFever ? 8 : 4}
                  fill={isFever ? '#ef4444' : isEstrus ? '#f59e0b' : '#10b981'}
                  opacity={isSelected ? 0.9 : 0.75}
                  className={isFever ? 'animate-ping' : ''}
                />
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 6 : 3}
                  fill="#ffffff"
                  stroke={isFever ? '#dc2626' : isEstrus ? '#d97706' : '#059669'}
                  strokeWidth="1.5"
                />

                {/* 悬浮选中或异常鹿只浮动标签 */}
                {(isSelected || isFever) && (
                  <g transform="translate(10, -18)">
                    <rect x="0" y="0" width="84" height="26" rx="4" fill="#ffffff" stroke="#cbd5e1" filter="url(#softShadow)" />
                    <text x="6" y="11" fontSize="8" fontWeight="bold" fill="#0f172a">
                      {deer.earTagId}
                    </text>
                    <text x="6" y="21" fontSize="7" fill={isFever ? '#dc2626' : '#059669'} fontWeight="bold">
                      {deer.temperature}℃ • {deer.dailySteps}步
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* 交互提示气泡 (当选中圈舍/热点时弹出) */}
        {selectedHotspot && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl text-slate-800 z-40 max-w-md w-full animate-in fade-in slide-in-from-bottom-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {selectedHotspot === 'tower-green' && '1号热力双光AI测温塔 (实时监测中)'}
                {selectedHotspot === 'tower-orange' && '2号沼气供暖能量转化中枢塔'}
                {selectedHotspot === 'tower-feed' && '立体全自动数智配料饲喂中心'}
                {selectedHotspot === 'barn-1' && '1号特级种公鹿舍 (配置1台测温主机+2路AI摄像机)'}
                {selectedHotspot === 'barn-2' && '2号繁育母鹿舍 (发情与产房红外监测)'}
                {selectedHotspot === 'barn-3' && '3号育成鹿舍 (体征与生长发育监测)'}
                {selectedHotspot === 'barn-4' && '4号隔离检疫舍 (负压通风+精准给药)'}
                {selectedHotspot === 'rfid-gate' && '通道式超高频识读网关 (RFID-PASS-4CH)'}
              </span>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            <div className="pt-2 text-xs space-y-1 text-slate-600">
              {selectedHotspot === 'barn-1' && (
                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                  <div className="bg-slate-50 p-1.5 rounded">
                    <div className="text-[10px] text-slate-400">在栏公鹿</div>
                    <div className="text-sm font-bold text-slate-900">48 只</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <div className="text-[10px] text-slate-400">舍温/湿度</div>
                    <div className="text-sm font-bold text-emerald-700">22.4℃ / 58%</div>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded">
                    <div className="text-[10px] text-slate-400">氨气浓度</div>
                    <div className="text-sm font-bold text-blue-700">11.2 ppm</div>
                  </div>
                </div>
              )}

              {selectedHotspot === 'rfid-gate' && (
                <div className="text-[11px] leading-relaxed">
                  具备 ≥900张/秒群读能力，鹿群在通过通道时自动触发调舍登记与数据库位置同步，无需人工驻守扫码。
                </div>
              )}

              {selectedHotspot.includes('tower') && (
                <div className="text-[11px] leading-relaxed">
                  集成15TOPS本地边缘AI推理卡，对圈舍内16路4MP视频流与200套E501-R1耳标数据进行毫秒级滤波计算。
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部视角与图例控制 */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 z-20">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 健康在网 (745只)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> 早期发热 (4只)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 发情活跃 (44只)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>缩放级别:</span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-bold hover:bg-slate-50"
          >
            -
          </button>
          <span className="font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-bold hover:bg-slate-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
