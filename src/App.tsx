/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MOCK_DEERS,
  MOCK_HOUSES,
  MOCK_DEVICES,
  MOCK_ENV_DATA,
  MOCK_VIDEO_DATA,
  MOCK_PDA_DATA,
  MOCK_TAG_DATA,
  MOCK_OTHER_DATA,
  MOCK_ALARMS,
  MOCK_ALARM_RULES,
  MOCK_TRANSFER_RECORDS,
} from './data/mockDeerData';
import {
  DeerRecord,
  HouseInfo,
  DeviceInfo,
  SensorDataRecord,
  AlarmItem,
  AlarmRule,
  TransferRecord,
} from './types/deer';
import { TechHeader, TopNavKey } from './components/common/TechHeader';
import { CockpitDashboard } from './components/dashboard/CockpitDashboard';
import { ManagementPlatform, ManagementTopNavKey } from './components/management/ManagementPlatform';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { SystemTopology } from './components/topology/SystemTopology';
import { ProductSpecs } from './components/spec/ProductSpecs';
import { SystemLayout } from './components/layout/SystemLayout';
import {
  Thermometer,
  Footprints,
  Calendar,
  Layers,
  Activity,
  ShieldCheck,
  FileSpreadsheet,
  X,
  ArrowRightLeft,
  Clock,
  Radio,
  Sliders,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  // 一级顶部导航状态
  const [currentTopNav, setCurrentTopNav] = useState<TopNavKey>('cockpit');
  // 二级子菜单状态
  const [currentSubNav, setCurrentSubNav] = useState<string>('basic-entry');

  // 核心业务数据状态
  const [deers, setDeers] = useState<DeerRecord[]>(MOCK_DEERS);
  const [houses, setHouses] = useState<HouseInfo[]>(MOCK_HOUSES);
  const [devices, setDevices] = useState<DeviceInfo[]>(MOCK_DEVICES);
  const [alarms, setAlarms] = useState<AlarmItem[]>(MOCK_ALARMS);
  const [rules, setRules] = useState<AlarmRule[]>(MOCK_ALARM_RULES);
  const [transfers, setTransfers] = useState<TransferRecord[]>(MOCK_TRANSFER_RECORDS);

  const [sensorData, setSensorData] = useState({
    env: MOCK_ENV_DATA,
    video: MOCK_VIDEO_DATA,
    pda: MOCK_PDA_DATA,
    tag: MOCK_TAG_DATA,
    other: MOCK_OTHER_DATA,
  });

  // 全局交互状态
  const [selectedDeer, setSelectedDeer] = useState<DeerRecord | null>(null);
  const [isQuickAlarmModalOpen, setIsQuickAlarmModalOpen] = useState(false);

  // 处理顶部菜单切换，自动映射二级子菜单
  const handleTopNavSelect = (navKey: TopNavKey) => {
    setCurrentTopNav(navKey);
    if (navKey === 'basic') {
      if (!currentSubNav.startsWith('basic')) setCurrentSubNav('basic-entry');
    } else if (navKey === 'iot-devices') {
      if (!currentSubNav.includes('-devices')) setCurrentSubNav('iot-env-devices');
    } else if (navKey === 'iot-data') {
      if (!currentSubNav.includes('-data')) setCurrentSubNav('iot-env-data');
    } else if (navKey === 'alarm') {
      if (!currentSubNav.startsWith('alarm')) setCurrentSubNav('alarm-rules');
    }
  };

  // 从其他模块跳转至管理中台子菜单
  const navigateToSubMenu = (menuKey: string) => {
    setCurrentSubNav(menuKey);
    if (menuKey.startsWith('basic')) {
      setCurrentTopNav('basic');
    } else if (menuKey.includes('-devices')) {
      setCurrentTopNav('iot-devices');
    } else if (menuKey.includes('-data')) {
      setCurrentTopNav('iot-data');
    } else if (menuKey.startsWith('alarm')) {
      setCurrentTopNav('alarm');
    }
  };

  // 1. 新增鹿只 (单个)
  const handleAddDeer = (newDeer: Partial<DeerRecord>) => {
    const id = `deer-${Date.now()}`;
    const tagNum = String(deers.length + 1).padStart(4, '0');
    const earTagId = `E501-R1-${tagNum}`;
    const house = houses.find((h) => h.id === newDeer.houseId) || houses[0];

    const fullDeer: DeerRecord = {
      id,
      earTagId,
      name: newDeer.name || `${newDeer.breed || '梅花鹿'}-${tagNum}号`,
      breed: (newDeer.breed as '梅花鹿' | '马鹿' | '白鹿') || '梅花鹿',
      gender: newDeer.gender || '公',
      ageMonths: newDeer.ageMonths || 24,
      weightKg: newDeer.weightKg || 120,
      houseId: house.id,
      houseName: house.name,
      penNo: `${house.name.slice(0, 2)}-A${Math.floor(Math.random() * 8) + 1}`,
      status: 'healthy',
      temperature: 38.6,
      dailySteps: 6200,
      activeHours: 7.5,
      batteryLevel: 98,
      signalDbm: -55,
      lastReportTime: '刚刚',
      posX: 20 + Math.random() * 60,
      posY: 20 + Math.random() * 60,
      inSafeZone: true,
      rfidUid: `RFID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      entryDate: new Date().toISOString().split('T')[0],
      batchNo: `BATCH-2026-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      healthNote: '入库初检各项生理指标正常',
      estrusScore: 10,
    };

    setDeers((prev) => [fullDeer, ...prev]);

    // 更新圈舍在栏数
    setHouses((prev) =>
      prev.map((h) => (h.id === house.id ? { ...h, currentCount: h.currentCount + 1 } : h))
    );
  };

  // 2. 批量新增鹿只
  const handleBatchAddDeers = (count: number, breed: '梅花鹿' | '马鹿', houseId: string) => {
    const house = houses.find((h) => h.id === houseId) || houses[0];
    const newBatch: DeerRecord[] = [];

    for (let i = 0; i < count; i++) {
      const idx = deers.length + i + 1;
      const tagNum = String(idx).padStart(4, '0');
      const earTagId = `E501-R1-${tagNum}`;

      newBatch.push({
        id: `deer-batch-${Date.now()}-${i}`,
        earTagId,
        name: `${breed}-${tagNum}号`,
        breed,
        gender: i % 2 === 0 ? '公' : '母',
        ageMonths: 18 + Math.floor(Math.random() * 12),
        weightKg: breed === '梅花鹿' ? 110 + Math.floor(Math.random() * 25) : 180 + Math.floor(Math.random() * 40),
        houseId: house.id,
        houseName: house.name,
        penNo: `${house.name.slice(0, 2)}-B${(i % 8) + 1}`,
        status: 'healthy',
        temperature: Number((38.4 + Math.random() * 0.5).toFixed(1)),
        dailySteps: 5500 + Math.floor(Math.random() * 2000),
        activeHours: 7.0,
        batteryLevel: 95,
        signalDbm: -58,
        lastReportTime: '刚刚',
        posX: 15 + Math.random() * 70,
        posY: 15 + Math.random() * 70,
        inSafeZone: true,
        rfidUid: `RFID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        entryDate: new Date().toISOString().split('T')[0],
        batchNo: `BATCH-2026-IMP`,
        healthNote: '批量采购检疫合格',
        estrusScore: 12,
      });
    }

    setDeers((prev) => [...newBatch, ...prev]);
    setHouses((prev) =>
      prev.map((h) => (h.id === house.id ? { ...h, currentCount: h.currentCount + count } : h))
    );
  };

  // 3. 转舍/调群
  const handleAddTransfer = (transfer: Omit<TransferRecord, 'id'>) => {
    const newRecord: TransferRecord = {
      ...transfer,
      id: `TR-${Date.now().toString().slice(-6)}`,
    };

    setTransfers((prev) => [newRecord, ...prev]);

    // 更新鹿只所在圈舍
    setDeers((prev) =>
      prev.map((d) => {
        if (d.earTagId === transfer.tagId) {
          const targetHouse = houses.find((h) => h.name === transfer.toHouse);
          return {
            ...d,
            houseId: targetHouse ? targetHouse.id : d.houseId,
            houseName: transfer.toHouse,
            posX: 25 + Math.random() * 50,
            posY: 25 + Math.random() * 50,
          };
        }
        return d;
      })
    );

    // 更新圈舍计数
    setHouses((prev) =>
      prev.map((h) => {
        if (h.name === transfer.fromHouse) return { ...h, currentCount: Math.max(0, h.currentCount - 1) };
        if (h.name === transfer.toHouse) return { ...h, currentCount: h.currentCount + 1 };
        return h;
      })
    );
  };

  // 4. 更新告警规则
  const handleUpdateRule = (updatedRule: AlarmRule) => {
    setRules((prev) => prev.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
  };

  // 5. 新增告警
  const handleAddAlarm = (newAlarm: Omit<AlarmItem, 'id'>) => {
    const id = `ALM-${Date.now().toString().slice(-5)}`;
    setAlarms((prev) => [{ ...newAlarm, id }, ...prev]);
  };

  // 6. 处理告警闭环
  const handleResolveAlarm = (alarmId: string, handler?: string, action?: string, result?: string) => {
    setAlarms((prev) =>
      prev.map((a) => {
        if (a.id === alarmId) {
          return {
            ...a,
            status: 'resolved',
            handler: handler || '驻场值班员',
            handleAction: action || '已到场核验处理完毕',
            handleResult: result || '指标已平稳恢复正常，解除警报',
            handleTime: new Date().toLocaleTimeString(),
          };
        }
        return a;
      })
    );
  };

  const pendingAlarms = alarms.filter((a) => a.status !== 'resolved');

  // 判断当前一级菜单是否属于管理平台
  const isManagementSection =
    currentTopNav === 'basic' ||
    currentTopNav === 'iot-devices' ||
    currentTopNav === 'iot-data' ||
    currentTopNav === 'alarm';

  // 统一导航跳转处理函数
  const handleUnifiedNavigate = (topKey: TopNavKey, subKey?: string) => {
    setCurrentTopNav(topKey);
    if (subKey) {
      setCurrentSubNav(subKey);
    } else {
      if (topKey === 'basic' && !currentSubNav.startsWith('basic')) {
        setCurrentSubNav('basic-entry');
      } else if (topKey === 'iot-devices' && !currentSubNav.includes('-devices')) {
        setCurrentSubNav('iot-env-devices');
      } else if (topKey === 'iot-data' && !currentSubNav.includes('-data')) {
        setCurrentSubNav('iot-env-data');
      } else if (topKey === 'alarm' && !currentSubNav.startsWith('alarm')) {
        setCurrentSubNav('alarm-rules');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4f0] text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. 当处于综合态势大数据驾驶舱时：全屏科技大屏展示 (保留暗黑全要素卫星地图大屏) */}
      {currentTopNav === 'cockpit' ? (
        <CockpitDashboard
          deers={deers}
          houses={houses}
          devices={devices}
          alarms={alarms}
          onSelectDeer={setSelectedDeer}
          selectedDeer={selectedDeer}
          onInitiateTransfer={(deer) => {
            setSelectedDeer(deer);
            handleUnifiedNavigate('basic', 'basic-transfer');
          }}
          onNavigateToManagement={(menuKey) => {
            navigateToSubMenu(menuKey);
          }}
          onResolveAlarm={(id) =>
            handleResolveAlarm(
              id,
              '大屏值班调度员 (0018)',
              '已通过大屏调度派驻兽医现场核实',
              '已完成现场降温处置与隔离，状态恢复'
            )
          }
          onOpenAlarmQuickModal={() => setIsQuickAlarmModalOpen(true)}
        />
      ) : (
        /* 2. 除了驾驶舱之外的所有业务功能框架：严格按照参考图 UI 与布局展示 (左侧统一分层级展示全部菜单) */
        <SystemLayout
          currentTopNav={currentTopNav}
          currentSubNav={currentSubNav}
          onNavigate={handleUnifiedNavigate}
          pendingAlarmCount={pendingAlarms.length}
          onOpenAlarmModal={() => setIsQuickAlarmModalOpen(true)}
        >
          {/* 管理中台业务模块: 基础管理 / 物联设备 / 物联数据 / 告警预警 */}
          {isManagementSection && (
            <ManagementPlatform
              activeTopNav={currentTopNav as ManagementTopNavKey}
              activeSubMenu={currentSubNav}
              onSelectSubMenu={setCurrentSubNav}
              deers={deers}
              houses={houses}
              devices={devices}
              sensorData={sensorData}
              alarms={alarms}
              rules={rules}
              transfers={transfers}
              onAddDeer={handleAddDeer}
              onBatchAddDeers={handleBatchAddDeers}
              onAddTransfer={handleAddTransfer}
              onSelectDeer={setSelectedDeer}
              onUpdateRule={handleUpdateRule}
              onAddAlarm={handleAddAlarm}
              onResolveAlarm={(id, handler, action, res) => handleResolveAlarm(id, handler, action, res)}
            />
          )}

          {/* 移动端监控APP & PDA协同原型 */}
          {currentTopNav === 'mobile' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
              <MobileAppSimulator
                deers={deers}
                alarms={alarms}
                houses={houses}
                onResolveAlarm={(id, h, a, r) => handleResolveAlarm(id, h, a, r)}
                onInitiateTransfer={(deer) => {
                  setSelectedDeer(deer);
                  handleUnifiedNavigate('basic', 'basic-transfer');
                }}
              />
            </div>
          )}

          {/* 端-边-云系统拓扑架构图 */}
          {currentTopNav === 'topology' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
              <SystemTopology />
            </div>
          )}

          {/* 软件功能清单与硬件技术参数对照表 */}
          {currentTopNav === 'specs' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-6">
              <ProductSpecs />
            </div>
          )}
        </SystemLayout>
      )}

      {/* 鹿只详情弹窗 (电子全生命周期档案) */}
      {selectedDeer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-2xl w-full p-6 text-slate-800 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedDeer.name} 电子档案全生命周期卡片</h3>
                  <p className="text-xs font-mono text-slate-400">耳标RFID UID: {selectedDeer.earTagId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeer(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 核心生理遥测指标 */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" /> 皮下实时体温
                </div>
                <div
                  className={`text-xl font-bold mt-1 ${
                    selectedDeer.temperature >= 39.8 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'
                  }`}
                >
                  {selectedDeer.temperature} ℃
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">E501-R1 (±0.1℃)</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-emerald-600" /> 今日运动计步
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {(selectedDeer.dailySteps ?? 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">日均 6,500步</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> 发情活跃评分
                </div>
                <div className="text-xl font-bold text-amber-600 mt-1">
                  {selectedDeer.estrusScore} 分
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">多模态AI判定</div>
              </div>
            </div>

            {/* 档案属性详情 */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-slate-700">
                  <span className="text-slate-400">品种与性别:</span> {selectedDeer.breed} ({selectedDeer.gender})
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-400">月龄 / 体重:</span> {selectedDeer.ageMonths} 个月 / {selectedDeer.weightKg} kg
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-400">所在圈舍 / 栏位:</span>{' '}
                  <strong className="text-emerald-700">
                    {selectedDeer.houseName} ({selectedDeer.penNo})
                  </strong>
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-400">入库建档日期:</span> {selectedDeer.entryDate}
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-400">电子围栏状态:</span>{' '}
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      selectedDeer.inSafeZone ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {selectedDeer.inSafeZone ? '安全区域内' : '越界告警'}
                  </span>
                </div>
                <div className="text-slate-700">
                  <span className="text-slate-400">耳标电池 / 信号:</span>{' '}
                  <span className="text-emerald-600 font-mono font-bold">
                    {selectedDeer.batteryLevel}% ({selectedDeer.signalDbm}dBm)
                  </span>
                </div>
              </div>
            </div>

            {/* 调舍流转履历 */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> 全生命周期流转履历
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700">
                    2026-09-10: 从 <strong>2号繁育母鹿舍</strong> 调群至 <strong>{selectedDeer.houseName}</strong>
                  </span>
                  <span className="text-slate-400 font-mono">PDA经办: 张主管</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>2026-09-01: 完成秋季口蹄疫免疫接种与皮下体温探头校准</span>
                  <span className="text-slate-400 font-mono">兽医: 李兽医</span>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setSelectedDeer(null);
                  navigateToSubMenu('basic-transfer');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                前往业务中台发起调舍
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 快捷待办预警抽屉/弹窗 */}
      {isQuickAlarmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-2xl max-w-xl w-full p-5 text-slate-800 shadow-2xl animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                当前在网未处置紧急告警 ({pendingAlarms.length} 项)
              </h3>
              <button
                onClick={() => setIsQuickAlarmModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {pendingAlarms.map((alm) => (
                <div key={alm.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-rose-600">{alm.title}</span>
                    <span className="text-xs text-slate-400 font-mono">{alm.occurredTime}</span>
                  </div>
                  <p className="text-xs text-slate-600">{alm.description}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-emerald-700 font-mono text-xs">{alm.houseName}</span>
                    <button
                      onClick={() => {
                        handleResolveAlarm(alm.id, '大屏值班调度员', '已指派专人现场处置', '处置完毕');
                        setIsQuickAlarmModalOpen(false);
                      }}
                      className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      一键接单闭环
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
