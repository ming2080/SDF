import React from 'react';
import {
  DeerRecord,
  HouseInfo,
  DeviceInfo,
  SensorDataRecord,
  AlarmItem,
  AlarmRule,
  TransferRecord,
} from '../../types/deer';
import { BasicInfoManager } from './BasicInfoManager';
import { IotDeviceManager } from './IotDeviceManager';
import { IotDataManager } from './IotDataManager';
import { AlarmManager } from './AlarmManager';
import {
  Database,
  Cpu,
  Activity,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Layers,
  Radio,
  Video,
  Smartphone,
  Tag,
  FileSpreadsheet,
  ArrowRightLeft,
  Building2,
  Sliders,
  BellRing,
  CheckCircle2,
} from 'lucide-react';

export type ManagementTopNavKey = 'basic' | 'iot-devices' | 'iot-data' | 'alarm';

interface ManagementPlatformProps {
  activeTopNav: ManagementTopNavKey;
  activeSubMenu: string;
  onSelectSubMenu: (key: string) => void;
  deers: DeerRecord[];
  houses: HouseInfo[];
  devices: DeviceInfo[];
  sensorData: {
    env: SensorDataRecord[];
    video: SensorDataRecord[];
    pda: SensorDataRecord[];
    tag: SensorDataRecord[];
    other: SensorDataRecord[];
  };
  alarms: AlarmItem[];
  rules: AlarmRule[];
  transfers: TransferRecord[];
  onAddDeer: (deer: Partial<DeerRecord>) => void;
  onBatchAddDeers: (count: number, breed: '梅花鹿' | '马鹿', houseId: string) => void;
  onAddTransfer: (transfer: Omit<TransferRecord, 'id'>) => void;
  onSelectDeer: (deer: DeerRecord) => void;
  onUpdateRule: (rule: AlarmRule) => void;
  onAddAlarm: (alarm: Omit<AlarmItem, 'id'>) => void;
  onResolveAlarm: (alarmId: string, handler: string, action: string, result: string) => void;
}

export const ManagementPlatform: React.FC<ManagementPlatformProps> = ({
  activeTopNav,
  activeSubMenu,
  onSelectSubMenu,
  deers,
  houses,
  devices,
  sensorData,
  alarms,
  rules,
  transfers,
  onAddDeer,
  onBatchAddDeers,
  onAddTransfer,
  onSelectDeer,
  onUpdateRule,
  onAddAlarm,
  onResolveAlarm,
}) => {
  // 定义与顶部菜单严格对应的一、二级菜单结构
  const topNavConfig: Record<
    ManagementTopNavKey,
    {
      title: string;
      desc: string;
      icon: any;
      subItems: Array<{ key: string; name: string; icon: any }>;
    }
  > = {
    basic: {
      title: '基础管理',
      desc: '鹿群个体精准建档、电子档案及圈舍流转',
      icon: Database,
      subItems: [
        { key: 'basic-entry', name: '鹿只入库建档', icon: FileSpreadsheet },
        { key: 'basic-transfer', name: '转舍调群管理', icon: ArrowRightLeft },
        { key: 'basic-house', name: '圈舍栏位配置', icon: Building2 },
      ],
    },
    'iot-devices': {
      title: '物联设备',
      desc: '208台套感知终端、测温主机与AI推流球机',
      icon: Cpu,
      subItems: [
        { key: 'iot-env-devices', name: '环境监测设备', icon: Activity },
        { key: 'iot-video-devices', name: '视频推流设备', icon: Video },
        { key: 'iot-pda-devices', name: 'PDA手持终端', icon: Smartphone },
        { key: 'iot-tag-devices', name: '智能耳标网关', icon: Tag },
        { key: 'iot-other-devices', name: '环控联动设备', icon: Radio },
      ],
    },
    'iot-data': {
      title: '物联数据',
      desc: '多模态传感器毫秒级时序遥测与视频AI特征流',
      icon: Activity,
      subItems: [
        { key: 'iot-env-data', name: '环境监测数据', icon: Activity },
        { key: 'iot-video-data', name: '视频AI识别流', icon: Video },
        { key: 'iot-pda-data', name: 'PDA作业数据', icon: Smartphone },
        { key: 'iot-tag-data', name: '耳标生理遥测', icon: Tag },
        { key: 'iot-other-data', name: '配套系统遥测', icon: Radio },
      ],
    },
    alarm: {
      title: '告警预警',
      desc: '多级预警引擎、异常行为研判与闭环处置',
      icon: ShieldAlert,
      subItems: [
        { key: 'alarm-rules', name: '告警规则引擎', icon: Sliders },
        { key: 'alarm-behavior', name: '异常行为识别', icon: ShieldAlert },
        { key: 'alarm-push', name: '告警推送中心', icon: BellRing },
        { key: 'alarm-feedback', name: '告警闭环反馈', icon: CheckCircle2 },
      ],
    },
  };

  const currentCategory = topNavConfig[activeTopNav] || topNavConfig.basic;
  const currentSubItem =
    currentCategory.subItems.find((item) => item.key === activeSubMenu) || currentCategory.subItems[0];

  const CategoryIcon = currentCategory.icon;

  return (
    <div className="w-full text-slate-800 select-none space-y-4">
      {/* 渲染对应子系统组件 */}
      {activeTopNav === 'basic' && (
        <BasicInfoManager
          subTab={
            activeSubMenu === 'basic-transfer'
              ? 'transfer'
              : activeSubMenu === 'basic-house'
              ? 'house'
              : 'entry'
          }
          deers={deers}
          houses={houses}
          transfers={transfers}
          onAddDeer={onAddDeer}
          onBatchAddDeers={onBatchAddDeers}
          onAddTransfer={onAddTransfer}
          onSelectDeer={onSelectDeer}
        />
      )}

      {activeTopNav === 'iot-devices' && (
        <IotDeviceManager
          subTab={
            activeSubMenu === 'iot-video-devices'
              ? 'video'
              : activeSubMenu === 'iot-pda-devices'
              ? 'pda'
              : activeSubMenu === 'iot-tag-devices'
              ? 'tag'
              : activeSubMenu === 'iot-other-devices'
              ? 'other'
              : 'env'
          }
          devices={devices}
        />
      )}

      {activeTopNav === 'iot-data' && (
        <IotDataManager
          subTab={
            activeSubMenu === 'iot-video-data'
              ? 'video'
              : activeSubMenu === 'iot-pda-data'
              ? 'pda'
              : activeSubMenu === 'iot-tag-data'
              ? 'tag'
              : activeSubMenu === 'iot-other-data'
              ? 'other'
              : 'env'
          }
          sensorData={sensorData}
        />
      )}

      {activeTopNav === 'alarm' && (
        <AlarmManager
          subTab={
            activeSubMenu === 'alarm-behavior'
              ? 'behavior'
              : activeSubMenu === 'alarm-push'
              ? 'push'
              : activeSubMenu === 'alarm-feedback'
              ? 'feedback'
              : 'rules'
          }
          rules={rules}
          alarms={alarms}
          onUpdateRule={onUpdateRule}
          onAddAlarm={onAddAlarm}
          onResolveAlarm={onResolveAlarm}
        />
      )}
    </div>
  );
};
