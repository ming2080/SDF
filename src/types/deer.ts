export type DeerStatus = 'healthy' | 'warning' | 'sick' | 'estrus' | 'quarantine';

export interface DeerRecord {
  id: string;
  earTagId: string; // E501-R1 RFID耳标
  name: string;
  breed: '梅花鹿' | '马鹿' | '白鹿';
  gender: '公' | '母';
  ageMonths: number;
  weightKg: number;
  houseId: string; // 圈舍编号
  houseName: string;
  penNo: string; // 栏位号
  status: DeerStatus;
  temperature: number; // 皮下测温 °C
  dailySteps: number; // 计步数据
  activeHours: number; // 活跃小时数
  batteryLevel: number; // 耳标电量 %
  signalDbm: number; // RSSI信号
  lastReportTime: string;
  posX: number; // 相对地图坐标 0-100%
  posY: number;
  inSafeZone: boolean;
  rfidUid: string;
  entryDate: string;
  batchNo: string;
  healthNote?: string;
  estrusScore: number; // 发情指数 0-100
}

export interface HouseInfo {
  id: string;
  name: string;
  type: '公鹿舍' | '母鹿舍' | '育成鹿舍' | '隔离/产房';
  capacity: number;
  currentCount: number;
  tempSensorId: string;
  cameraIds: string[];
  hostId: string; // 测温主机ID
  temperature: number;
  humidity: number;
  nh3: number; // 氨气 ppm
  h2s: number; // 硫化氢 ppm
  co2: number; // 二氧化碳 ppm
  pm25: number;
  status: 'normal' | 'warning' | 'danger';
}

export interface DeviceInfo {
  id: string;
  name: string;
  code: string;
  category: '环境设备' | '可视化设备' | 'PDA设备' | '耳标设备' | '其他设备';
  baseName: string;
  houseName: string;
  slotNo?: string; // 机位号
  type: string;
  model: string;
  status: 'online' | 'offline' | 'alert';
  battery?: number;
  signalStrength?: number;
  ip?: string;
  firmwareVersion: string;
  lastActive: string;
  extraData?: Record<string, any>;
}

export interface SensorDataRecord {
  id: string;
  seq: number;
  baseName: string;
  houseName: string;
  deviceCode: string;
  deviceName: string;
  deviceType: string;
  temp?: number;
  humidity?: number;
  nh3?: number;
  n2?: number;
  h2s?: number;
  co2?: number;
  streamUrl?: string;
  streamFps?: number;
  pdaChangedData?: string;
  pdaOperator?: string;
  earTagTemp?: number;
  earTagSteps?: number;
  earTagLocation?: string;
  otherData?: string;
  timestamp: string;
}

export interface AlarmItem {
  id: string;
  title: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO'; // 紧急/重要/提醒
  sourceType: '环境异常' | '异常行为' | '体温异常' | '越界告警' | '设备离线';
  houseName: string;
  deerTagId?: string;
  description: string;
  occurredTime: string;
  status: 'pending' | 'processing' | 'resolved';
  channel: ('APP' | 'SMS' | 'WECHAT')[];
  handler?: string;
  handleTime?: string;
  handleAction?: string;
  handleResult?: string;
  snapshotUrl?: string;
}

export interface AlarmRule {
  id: string;
  name: string;
  category: string;
  metric: string;
  operator: '>' | '<' | '=' | 'BETWEEN';
  threshold: number | [number, number];
  unit: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  enabled: boolean;
  pushChannels: ('APP' | 'SMS' | 'WECHAT')[];
  notifyRoles: string[];
}

export interface FenceZone {
  id: string;
  name: string;
  points: { x: number; y: number }[];
  color: string;
  status: 'active' | 'warning';
  alertCount: number;
}

export interface TransferRecord {
  id: string;
  tagId: string;
  deerName: string;
  fromHouse: string;
  toHouse: string;
  transferType: '常规调群' | '发情配种' | '病患隔离' | '断奶分群';
  operator: string;
  transferTime: string;
  reason: string;
  status: '已生效' | '待确认';
}
