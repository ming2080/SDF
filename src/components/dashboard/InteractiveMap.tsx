import React, { useState } from 'react';
import { DeerRecord, HouseInfo } from '../../types/deer';
import {
  MapPin,
  Layers,
  Shield,
  Radio,
  Video,
  Activity,
  AlertTriangle,
  Flame,
  Thermometer,
  Footprints,
  ArrowRightLeft,
  Eye,
  CheckCircle,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface InteractiveMapProps {
  deers: DeerRecord[];
  houses: HouseInfo[];
  onSelectDeer: (deer: DeerRecord) => void;
  selectedDeer: DeerRecord | null;
  onInitiateTransfer: (deer: DeerRecord) => void;
  onSelectHouse: (house: HouseInfo) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  deers,
  houses,
  onSelectDeer,
  selectedDeer,
  onInitiateTransfer,
  onSelectHouse,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'map' | 'lifecycle'>('map');
  const [filterStatus, setFilterStatus] = useState<'all' | 'sick' | 'estrus'>('all');
  const [isDrawingFence, setIsDrawingFence] = useState<boolean>(false);
  const [fenceSafetyRadius, setFenceSafetyRadius] = useState<number>(85); // 电子围栏覆盖范围百分比
  const [layerConfig, setLayerConfig] = useState({
    showDeers: true,
    showHosts: true,
    showCameras: true,
    showEnvBoxes: true,
    showFences: true,
  });

  // 14台测温主机网关坐标
  const hostGateways = [
    { id: 'HOST-01', name: '1号舍主网关', x: 25, y: 30 },
    { id: 'HOST-02', name: '2号舍主网关', x: 75, y: 30 },
    { id: 'HOST-03', name: '3号舍主网关', x: 25, y: 70 },
    { id: 'HOST-04', name: '4号舍主网关', x: 75, y: 70 },
    { id: 'HOST-05', name: '中央通道基站', x: 50, y: 50 },
  ];

  // 过滤鹿只
  const filteredDeers = deers.filter((d) => {
    if (filterStatus === 'sick') return d.status === 'sick' || d.temperature >= 39.8;
    if (filterStatus === 'estrus') return d.status === 'estrus' || d.estrusScore > 80;
    return true;
  });

  return (
    <div className="relative w-full h-[620px] bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
      {/* 顶部控制栏 */}
      <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
          {/* 模式切换按钮 */}
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg">
            <button
              id="map-mode-realtime-btn"
              onClick={() => setActiveTabMode('map')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTabMode === 'map' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>实时定位与电子围栏 ({deers.length}只)</span>
            </button>
            <button
              id="map-mode-lifecycle-btn"
              onClick={() => setActiveTabMode('lifecycle')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTabMode === 'lifecycle' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>全生命周期流转全景</span>
            </button>
          </div>

          <span className="h-4 w-[1px] bg-slate-300 hidden sm:inline" />

          {/* 状态过滤按钮组 */}
          {activeTabMode === 'map' && (
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-500 text-[11px]">快速筛选:</span>
              <button
                id="filter-status-all"
                onClick={() => setFilterStatus('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                全部({deers.length})
              </button>
              <button
                id="filter-status-sick"
                onClick={() => setFilterStatus('sick')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  filterStatus === 'sick'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-white text-rose-600 border-slate-200 hover:bg-rose-50/50'
                }`}
              >
                <Thermometer className="w-3 h-3" />
                发热({deers.filter((d) => d.status === 'sick' || d.temperature >= 39.8).length})
              </button>
              <button
                id="filter-status-estrus"
                onClick={() => setFilterStatus('estrus')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                  filterStatus === 'estrus'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-white text-amber-600 border-slate-200 hover:bg-amber-50/50'
                }`}
              >
                <Flame className="w-3 h-3" />
                发情({deers.filter((d) => d.status === 'estrus' || d.estrusScore > 80).length})
              </button>
            </div>
          )}
        </div>

        {/* 右侧围栏与图层 */}
        <div className="flex items-center space-x-2 text-xs">
          {activeTabMode === 'map' && (
            <>
              <button
                id="toggle-fence-draw-btn"
                onClick={() => setIsDrawingFence(!isDrawingFence)}
                className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all text-xs font-medium ${
                  isDrawingFence
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isDrawingFence ? '围栏调参中' : '电子围栏'}</span>
              </button>

              <div className="hidden lg:flex items-center space-x-2.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[11px] text-slate-600">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layerConfig.showHosts}
                    onChange={(e) => setLayerConfig({ ...layerConfig, showHosts: e.target.checked })}
                    className="accent-blue-600 rounded"
                  />
                  <span>14台基站</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layerConfig.showCameras}
                    onChange={(e) => setLayerConfig({ ...layerConfig, showCameras: e.target.checked })}
                    className="accent-blue-600 rounded"
                  />
                  <span>16路AI摄像机</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layerConfig.showEnvBoxes}
                    onChange={(e) => setLayerConfig({ ...layerConfig, showEnvBoxes: e.target.checked })}
                    className="accent-blue-600 rounded"
                  />
                  <span>4组环境箱</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 地图核心视口 */}
      <div className="relative flex-1 bg-slate-100/60 overflow-hidden select-none">
        {/* 背景轻量网格 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />

        {activeTabMode === 'map' ? (
          <>
            {/* 4大鹿舍区域 */}
            {houses.map((house, idx) => {
              const positions = [
                { left: '5%', top: '10%', width: '42%', height: '40%' }, // 1号
                { left: '53%', top: '10%', width: '42%', height: '40%' }, // 2号
                { left: '5%', top: '54%', width: '42%', height: '40%' }, // 3号
                { left: '53%', top: '54%', width: '42%', height: '40%' }, // 4号
              ];
              const pos = positions[idx];
              const isAlert = house.status === 'warning' || house.status === 'danger';

              return (
                <div
                  key={house.id}
                  id={`house-zone-${house.id}`}
                  onClick={() => onSelectHouse(house)}
                  style={{ left: pos.left, top: pos.top, width: pos.width, height: pos.height }}
                  className={`absolute rounded-xl border transition-all cursor-pointer p-3 flex flex-col justify-between group shadow-xs ${
                    isAlert
                      ? 'border-amber-400 bg-amber-50/50 hover:bg-amber-50/80'
                      : 'border-slate-300/80 bg-white/90 hover:bg-white hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {house.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                          {house.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        在栏: <strong className="text-slate-900">{house.currentCount}</strong> / {house.capacity} 只
                      </p>
                    </div>

                    {/* 舍内环境小标签 */}
                    <div className="flex flex-col items-end text-[11px] space-y-0.5 font-mono">
                      <span className="text-emerald-700 font-medium">
                        {house.temperature}℃ | {house.humidity}%
                      </span>
                      <span className={`${house.nh3 > 15 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                        NH₃: {house.nh3} ppm
                      </span>
                    </div>
                  </div>

                  {/* 鹿舍底部信息 */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Radio className="w-3 h-3 text-blue-600" />
                      基站:{house.hostId}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 group-hover:underline font-medium">
                      <Eye className="w-3 h-3" />
                      点击定位鹿舍
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 中央过道 */}
            <div className="absolute left-[48%] top-[10%] w-[4%] h-[84%] border-x border-dashed border-slate-300 bg-slate-200/30 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] text-slate-400 rotate-90 tracking-widest uppercase font-mono font-medium">
                主通道
              </span>
            </div>

            {/* 通道识读器标记 */}
            <div
              className="absolute left-[50%] top-[48%] -translate-x-1/2 -translate-y-1/2 z-20 bg-white border border-blue-400 px-2 py-1 rounded-md shadow-sm flex items-center gap-1.5 text-[11px] text-blue-700 font-medium"
              title="通道识读器: 900张/秒 自动盘点门禁"
            >
              <Radio className="w-3.5 h-3.5 text-blue-600" />
              <span>RFID通道门禁(900t/s)</span>
            </div>

            {/* 电子围栏绘制层 */}
            {layerConfig.showFences && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <rect
                  x="4%"
                  y="8%"
                  width="92%"
                  height={`${fenceSafetyRadius}%`}
                  fill="rgba(59, 130, 246, 0.03)"
                  stroke={isDrawingFence ? '#f59e0b' : '#3b82f6'}
                  strokeWidth="2"
                  strokeDasharray={isDrawingFence ? '6,6' : 'none'}
                />
                <text x="6%" y="11%" fill="#2563eb" fontSize="11" fontWeight="bold">
                  🛡️ 电子安全围栏 (实时监控范围)
                </text>
              </svg>
            )}

            {/* 14台测温主机点位 */}
            {layerConfig.showHosts &&
              hostGateways.map((host) => (
                <div
                  key={host.id}
                  style={{ left: `${host.x}%`, top: `${host.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-15 group cursor-pointer"
                  title={`${host.name} - 4G/BLE5.2 测温主机`}
                >
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform">
                    <Radio className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="hidden group-hover:block absolute left-5 top-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30 shadow-md">
                    {host.name} ({host.id})
                  </span>
                </div>
              ))}

            {/* 200只鹿实时位置散点 */}
            {layerConfig.showDeers &&
              filteredDeers.map((deer) => {
                const isSelected = selectedDeer?.id === deer.id;
                const isSick = deer.status === 'sick' || deer.temperature >= 39.8;
                const isEstrus = deer.status === 'estrus' || deer.estrusScore > 80;

                let dotBg = 'bg-blue-600';
                let pulseRing = '';

                if (isSick) {
                  dotBg = 'bg-rose-600';
                  pulseRing = 'animate-ping bg-rose-400 opacity-75';
                } else if (isEstrus) {
                  dotBg = 'bg-amber-500';
                  pulseRing = 'animate-ping bg-amber-400 opacity-60';
                }

                return (
                  <div
                    key={deer.id}
                    id={`deer-dot-${deer.id}`}
                    onClick={() => onSelectDeer(deer)}
                    style={{ left: `${deer.posX}%`, top: `${deer.posY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 transition-transform duration-200 ${
                      isSelected ? 'scale-150 z-40' : 'hover:scale-125'
                    }`}
                  >
                    {/* 扩散环 */}
                    {pulseRing && (
                      <span className={`absolute -inset-1.5 rounded-full ${pulseRing}`} />
                    )}
                    {/* 点位 */}
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-xs ${dotBg} flex items-center justify-center`}>
                      {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                    </div>

                    {/* 选中锁定框 */}
                    {isSelected && (
                      <div className="absolute -inset-2.5 border-2 border-blue-600 border-dashed rounded-full animate-spin pointer-events-none" />
                    )}
                  </div>
                );
              })}

            {/* 电子围栏参数调整浮层 */}
            {isDrawingFence && (
              <div className="absolute top-4 left-4 bg-white border border-amber-400 rounded-xl p-3.5 text-xs text-slate-800 shadow-xl z-40 max-w-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-amber-700 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" /> 电子围栏参数设置
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-600 mb-1">
                      <span>安全边界覆盖纵深:</span>
                      <strong className="text-amber-700 font-mono">{fenceSafetyRadius}%</strong>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="95"
                      value={fenceSafetyRadius}
                      onChange={(e) => setFenceSafetyRadius(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    * 测温计步耳标每5分钟上报RSSI，越界立即触发高优先级预警。
                  </p>
                  <button
                    onClick={() => setIsDrawingFence(false)}
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    保存并下发边缘网关
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* 全生命周期流程节点 */
          <div className="relative w-full h-full p-6 flex flex-col justify-center overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-center mb-6">
                <h3 className="text-base font-bold text-slate-900">鹿只全生命周期数据链流转全景</h3>
                <p className="text-xs text-slate-500 mt-1">从新购入库、耳标绑定、圈舍调配、环境伴随到出栏转舍全链路数字化追溯</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 relative">
                {/* 节点1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">01 入库建档</span>
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="my-2.5 space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">新购/新生鹿只入库</h4>
                    <p className="text-[11px] text-slate-500">录入耳标ID、品种、月龄、性别及初始圈舍，建立电子档案。</p>
                  </div>
                  <div className="text-[11px] font-mono text-blue-700 bg-slate-50 p-2 rounded border border-slate-100 font-medium">
                    在档鹿只: 200只
                  </div>
                </div>

                {/* 节点2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">02 智能监测</span>
                    <Radio className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="my-2.5 space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">体征与环境实时监测</h4>
                    <p className="text-[11px] text-slate-500">皮下测温(±0.1℃)、日步数统计、8种环境指标及16路AI视频。</p>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 bg-slate-50 p-2 rounded border border-slate-100 font-medium">
                    上报频次: 5分钟/次
                  </div>
                </div>

                {/* 节点3 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">03 调群转舍</span>
                    <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="my-2.5 space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">通道识读与分群</h4>
                    <p className="text-[11px] text-slate-500">配种、断奶或隔离时，900t/s超高频通道门禁自动识别并更新圈舍。</p>
                  </div>
                  <div className="text-[11px] font-mono text-amber-700 bg-slate-50 p-2 rounded border border-slate-100 font-medium">
                    今日转舍: 3次
                  </div>
                </div>

                {/* 节点4 */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">04 闭环处置</span>
                    <Shield className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="my-2.5 space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">疾病与发情闭环</h4>
                    <p className="text-[11px] text-slate-500">体温异常、发情高活跃多渠道推送移动APP/PDA，记录兽医诊疗处置。</p>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-700 bg-slate-50 p-2 rounded border border-slate-100 font-medium">
                    处置率: 100%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 选中鹿只浮动卡片 */}
        {selectedDeer && (
          <div
            id="selected-deer-quick-card"
            className="absolute bottom-4 right-4 bg-white/95 border border-slate-200 rounded-xl p-4 text-slate-800 shadow-xl z-40 w-80 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">{selectedDeer.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      selectedDeer.status === 'sick'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedDeer.status === 'estrus'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedDeer.status === 'sick' ? '发热预警' : selectedDeer.status === 'estrus' ? '发情中' : '健康'}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-500">耳标: {selectedDeer.earTagId}</p>
              </div>
              <button
                onClick={() => onSelectDeer(null as any)}
                className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-2.5 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-rose-500" /> 皮下体温
                </span>
                <p
                  className={`text-sm font-bold font-mono mt-0.5 ${
                    selectedDeer.temperature >= 39.8 ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {selectedDeer.temperature} ℃
                </p>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Footprints className="w-3 h-3 text-blue-600" /> 今日计步
                </span>
                <p className="text-sm font-bold font-mono mt-0.5 text-slate-900">
                  {(selectedDeer.dailySteps ?? 0).toLocaleString()} 步
                </p>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500">所在圈舍</span>
                <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{selectedDeer.houseName}</p>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-500">电量与信号</span>
                <p className="text-xs font-mono text-emerald-700 mt-0.5">
                  {selectedDeer.batteryLevel}% | {selectedDeer.signalDbm}dBm
                </p>
              </div>
            </div>

            {selectedDeer.healthNote && (
              <div className="bg-blue-50 border border-blue-200/70 p-2 rounded text-[11px] text-blue-800 mb-2.5 leading-relaxed">
                💡 <strong>诊断建议:</strong> {selectedDeer.healthNote}
              </div>
            )}

            <button
              id={`quick-transfer-btn-${selectedDeer.id}`}
              onClick={() => onInitiateTransfer(selectedDeer)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>快速发起转舍 / 调群</span>
            </button>
          </div>
        )}
      </div>

      {/* 底部图例 */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            正常 (38.0~39.2℃)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            发情活跃 ({'>'}10,000步)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            体温发热 (≥39.8℃)
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 font-mono text-[10px] text-slate-500">
          <span>RFID询查: 900 tags/s</span>
          <span>•</span>
          <span>测温精度: ±0.1℃</span>
          <span>•</span>
          <span>耳标续航: 20个月</span>
        </div>
      </div>
    </div>
  );
};
