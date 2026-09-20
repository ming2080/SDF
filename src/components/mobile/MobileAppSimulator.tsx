import React, { useState } from 'react';
import { DeerRecord, AlarmItem, HouseInfo } from '../../types/deer';
import {
  Smartphone,
  Bell,
  Thermometer,
  Footprints,
  QrCode,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle,
  Radio,
  Search,
  Check,
  Flame,
  User,
  Sliders,
  RefreshCw,
} from 'lucide-react';

interface MobileAppSimulatorProps {
  deers: DeerRecord[];
  alarms: AlarmItem[];
  houses: HouseInfo[];
  onResolveAlarm: (alarmId: string, handler: string, action: string, result: string) => void;
  onInitiateTransfer: (deer: DeerRecord) => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  deers,
  alarms,
  houses,
  onResolveAlarm,
  onInitiateTransfer,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'alarms' | 'scan' | 'inspect'>('home');
  const [activeDeviceMode, setActiveDeviceMode] = useState<'app' | 'pda'>('app');
  const [scannedDeer, setScannedDeer] = useState<DeerRecord | null>(deers[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [pdaSuccessMsg, setPdaSuccessMsg] = useState('');

  // 模拟PDA扫码读卡
  const handlePdaScan = () => {
    setIsScanning(true);
    setPdaSuccessMsg('');
    setTimeout(() => {
      const randIdx = Math.floor(Math.random() * deers.length);
      setScannedDeer(deers[randIdx]);
      setIsScanning(false);
      setPdaSuccessMsg(`成功识读UHF RFID标签: ${deers[randIdx].earTagId} (读距 4.5m)`);
    }, 600);
  };

  const pendingAlarms = alarms.filter((a) => a.status !== 'resolved');

  return (
    <div className="p-3 md:p-5 max-w-[1400px] mx-auto text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左侧说明与控制台 (4列) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">移动端监控APP & PDA终端协同</h3>
                <p className="text-[11px] text-slate-500">现场巡检与短平快掌上处置模拟</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  id="switch-mobile-app-btn"
                  onClick={() => setActiveDeviceMode('app')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                    activeDeviceMode === 'app' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  养殖员/兽医移动APP
                </button>
                <button
                  id="switch-pda-terminal-btn"
                  onClick={() => setActiveDeviceMode('pda')}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                    activeDeviceMode === 'pda' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PDA超高频手持机
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>移动端链路状态:</span>
                  <span className="text-emerald-700 font-bold">5G / 局域网自愈</span>
                </div>
                <div className="flex justify-between">
                  <span>即时推送延迟:</span>
                  <span className="text-blue-700 font-mono">&lt; 150 ms</span>
                </div>
                <div className="flex justify-between">
                  <span>PDA手持机规格:</span>
                  <span className="text-amber-700 font-mono">840~960MHz (4000mAh)</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-900 leading-relaxed">
              💡 <strong>交互优化说明：</strong> 移动端专为现场养殖工人与驻场兽医设计，优化了触达路径：
              1. 收到发热/打斗通知直接点开即达处置；
              2. PDA手持机一键触发UHF射频枪识读；
              3. 3步内完成现场调群与用药登记。
            </div>
          </div>
        </div>

        {/* 中间/右侧：真实手机模拟器视窗 (8列) */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-[360px] h-[720px] bg-slate-900 rounded-[44px] border-[10px] border-slate-800 shadow-2xl flex flex-col overflow-hidden relative">
            {/* 手机顶部刘海 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-black/60 mr-2" />
              <div className="w-8 h-1 rounded-full bg-black/60" />
            </div>

            {/* 手机状态栏 */}
            <div className="bg-white pt-6 px-5 pb-2 flex justify-between items-center text-[10px] font-mono text-slate-700 z-40 border-b border-slate-100">
              <span>09:41</span>
              <span className="font-bold text-emerald-700">
                {activeDeviceMode === 'app' ? '南平庭春鹿业掌上通' : 'PDA UHF RFID 终端'}
              </span>
              <div className="flex items-center space-x-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* 手机视口主容器 */}
            <div className="flex-1 bg-slate-50 overflow-y-auto p-3 space-y-3 text-xs scrollbar-none text-slate-800">
              {/* Tab 1: 首页概览 */}
              {mobileTab === 'home' && (
                <div className="space-y-3 animate-in fade-in">
                  {/* 移动端Banner概览 */}
                  <div className="bg-emerald-700 text-white p-3.5 rounded-xl shadow-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold">南平庭春鹿业</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-emerald-100">
                        运行正常
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                      <div className="bg-blue-700/60 p-1.5 rounded">
                        <div className="text-[10px] text-blue-200">在栏总数</div>
                        <div className="text-base font-bold">{deers.length}只</div>
                      </div>
                      <div className="bg-blue-700/60 p-1.5 rounded">
                        <div className="text-[10px] text-blue-200">早期发热</div>
                        <div className="text-base font-bold text-amber-200">
                          {deers.filter((d) => d.status === 'sick' || d.temperature >= 39.8).length}只
                        </div>
                      </div>
                      <div className="bg-blue-700/60 p-1.5 rounded">
                        <div className="text-[10px] text-blue-200">发情期</div>
                        <div className="text-base font-bold text-emerald-200">
                          {deers.filter((d) => d.status === 'estrus').length}只
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 快捷功能金刚区 */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                    <button
                      onClick={() => setMobileTab('alarms')}
                      className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:border-rose-300 transition-colors shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium">预警中心</span>
                    </button>
                    <button
                      onClick={() => setMobileTab('scan')}
                      className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:border-blue-300 transition-colors shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium">RFID识读</span>
                    </button>
                    <button
                      onClick={() => setMobileTab('inspect')}
                      className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:border-emerald-300 transition-colors shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium">圈舍巡检</span>
                    </button>
                    <button
                      onClick={() => {
                        if (scannedDeer) onInitiateTransfer(scannedDeer);
                      }}
                      className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center gap-1 hover:border-amber-300 transition-colors shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium">调群转舍</span>
                    </button>
                  </div>

                  {/* 待办处置动态列表 */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5 text-rose-600" /> 待处理紧急预警
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold font-mono">
                        {pendingAlarms.length} 条待接单
                      </span>
                    </div>

                    {pendingAlarms.slice(0, 3).map((alm) => (
                      <div
                        key={alm.id}
                        className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-rose-700 truncate max-w-[170px]">{alm.title}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{alm.occurredTime}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 line-clamp-1">{alm.description}</p>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-[10px]">
                          <span className="text-blue-700 font-medium">{alm.houseName}</span>
                          <button
                            onClick={() => {
                              setMobileTab('alarms');
                            }}
                            className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold"
                          >
                            立即接单
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: 预警中心 */}
              {mobileTab === 'alarms' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">预警处置工单池</span>
                    <span className="text-[10px] text-slate-500">已自动同步至PDA</span>
                  </div>

                  <div className="space-y-2">
                    {alarms.map((alm) => (
                      <div
                        key={alm.id}
                        className={`p-3 rounded-xl border ${
                          alm.status === 'resolved'
                            ? 'bg-white border-slate-200'
                            : 'bg-white border-rose-200 shadow-xs'
                        } space-y-2`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-xs text-slate-900">{alm.title}</span>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {alm.houseName} • 耳标: {alm.deerTagId || '未绑定'}
                            </div>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            alm.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700 font-bold'
                          }`}>
                            {alm.status === 'resolved' ? '已闭环' : '待处置'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-tight">{alm.description}</p>

                        {alm.status !== 'resolved' && (
                          <div className="pt-2 border-t border-slate-100 flex gap-2">
                            <button
                              onClick={() => {
                                onResolveAlarm(
                                  alm.id,
                                  '李兽医 (移动端快速处置)',
                                  '现场注射退热解毒针剂，补充体能液',
                                  '体温已恢复至38.8℃正常范围，食欲良好'
                                );
                              }}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold text-center"
                            >
                              一键完成用药闭环
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: RFID扫码识读 */}
              {mobileTab === 'scan' && (
                <div className="space-y-3 animate-in fade-in text-center">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                    <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <Radio className={`w-8 h-8 ${isScanning ? 'animate-ping text-amber-600' : ''}`} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">PDA 超高频 900MHz 远距离识读</h4>
                      <p className="text-[11px] text-slate-500 mt-1">对准圈舍鹿群扣动扳机，秒级感应E501-R1耳标</p>
                    </div>

                    <button
                      id="trigger-pda-scan-btn"
                      onClick={handlePdaScan}
                      disabled={isScanning}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs"
                    >
                      {isScanning ? '正在高速群读射频标签...' : '🔫 扣动把手立即扫描 (UHF RFID)'}
                    </button>

                    {pdaSuccessMsg && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                        {pdaSuccessMsg}
                      </div>
                    )}
                  </div>

                  {/* 识读到的鹿只即时卡片 */}
                  {scannedDeer && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-left space-y-2 shadow-xs">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                        <span className="font-bold text-xs text-blue-700">{scannedDeer.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">{scannedDeer.earTagId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>品种: <strong className="text-slate-800">{scannedDeer.breed}</strong></div>
                        <div>圈舍: <strong className="text-slate-800">{scannedDeer.houseName}</strong></div>
                        <div>当前体温: <strong className={scannedDeer.temperature >= 39.8 ? 'text-rose-600 font-bold' : 'text-emerald-700'}>{scannedDeer.temperature} ℃</strong></div>
                        <div>今日步数: <strong className="text-blue-700">{scannedDeer.dailySteps} 步</strong></div>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => onInitiateTransfer(scannedDeer)}
                          className="flex-1 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold text-center"
                        >
                          发起调群转舍
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: 圈舍巡检 */}
              {mobileTab === 'inspect' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">圈舍现场巡检台账</span>
                    <span className="text-[10px] text-slate-500">4栋全覆盖</span>
                  </div>

                  <div className="space-y-2">
                    {houses.map((h) => (
                      <div key={h.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 shadow-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-slate-900">{h.name}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                            在栏 {h.currentCount}/{h.capacity}只
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] bg-slate-50 p-2 rounded text-slate-600">
                          <div>温度: <strong className="text-slate-800">{h.temperature}℃</strong></div>
                          <div>湿度: <strong className="text-slate-800">{h.humidity}%</strong></div>
                          <div>氨气: <strong className="text-slate-800">{h.nh3}ppm</strong></div>
                        </div>
                        <button
                          onClick={() => alert(`已登记【${h.name}】现场日常巡检无异常`)}
                          className="w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold"
                        >
                          ✓ 提交该舍日常巡视打卡
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 手机底部导航栏 */}
            <div className="bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center text-[10px] z-40 text-slate-500">
              <button
                onClick={() => setMobileTab('home')}
                className={`flex flex-col items-center gap-0.5 ${mobileTab === 'home' ? 'text-blue-600 font-bold' : ''}`}
              >
                <Smartphone className="w-4 h-4" />
                <span>工作台</span>
              </button>
              <button
                onClick={() => setMobileTab('alarms')}
                className={`flex flex-col items-center gap-0.5 relative ${mobileTab === 'alarms' ? 'text-rose-600 font-bold' : ''}`}
              >
                <Bell className="w-4 h-4" />
                {pendingAlarms.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] flex items-center justify-center font-mono">
                    {pendingAlarms.length}
                  </span>
                )}
                <span>预警</span>
              </button>
              <button
                onClick={() => setMobileTab('scan')}
                className={`flex flex-col items-center gap-0.5 ${mobileTab === 'scan' ? 'text-blue-600 font-bold' : ''}`}
              >
                <QrCode className="w-4 h-4" />
                <span>RFID</span>
              </button>
              <button
                onClick={() => setMobileTab('inspect')}
                className={`flex flex-col items-center gap-0.5 ${mobileTab === 'inspect' ? 'text-emerald-600 font-bold' : ''}`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>巡检</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
