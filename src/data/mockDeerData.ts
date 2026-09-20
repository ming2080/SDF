import { DeerRecord, HouseInfo, DeviceInfo, SensorDataRecord, AlarmItem, AlarmRule, TransferRecord } from '../types/deer';

// 鹿舍基础配置
export const initialHouses: HouseInfo[] = [
  {
    id: 'H-01',
    name: '1号特级种公鹿舍',
    type: '公鹿舍',
    capacity: 60,
    currentCount: 52,
    tempSensorId: 'ENV-BOX-01',
    cameraIds: ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'],
    hostId: 'HOST-01',
    temperature: 18.5,
    humidity: 58,
    nh3: 8.2,
    h2s: 1.1,
    co2: 680,
    pm25: 22,
    status: 'normal',
  },
  {
    id: 'H-02',
    name: '2号繁育母鹿舍',
    type: '母鹿舍',
    capacity: 70,
    currentCount: 65,
    tempSensorId: 'ENV-BOX-02',
    cameraIds: ['CAM-05', 'CAM-06', 'CAM-07', 'CAM-08'],
    hostId: 'HOST-02',
    temperature: 19.8,
    humidity: 62,
    nh3: 11.4,
    h2s: 1.8,
    co2: 740,
    pm25: 26,
    status: 'normal',
  },
  {
    id: 'H-03',
    name: '3号优质育成鹿舍',
    type: '育成鹿舍',
    capacity: 60,
    currentCount: 58,
    tempSensorId: 'ENV-BOX-03',
    cameraIds: ['CAM-09', 'CAM-10', 'CAM-11', 'CAM-12'],
    hostId: 'HOST-03',
    temperature: 21.2,
    humidity: 65,
    nh3: 16.8, // 偏高警示
    h2s: 2.9,
    co2: 890,
    pm25: 35,
    status: 'warning',
  },
  {
    id: 'H-04',
    name: '4号健康观察与隔离舍',
    type: '隔离/产房',
    capacity: 30,
    currentCount: 25,
    tempSensorId: 'ENV-BOX-04',
    cameraIds: ['CAM-13', 'CAM-14', 'CAM-15', 'CAM-16'],
    hostId: 'HOST-04',
    temperature: 20.1,
    humidity: 55,
    nh3: 6.5,
    h2s: 0.8,
    co2: 620,
    pm25: 18,
    status: 'normal',
  },
];

// 生成200只鹿的真实数据（与200个测温计步耳标对应）
export const generateInitialDeers = (): DeerRecord[] => {
  const deers: DeerRecord[] = [];
  const houseConfigs = [
    { houseId: 'H-01', houseName: '1号特级种公鹿舍', breed: '梅花鹿' as const, gender: '公' as const, count: 52, xRange: [8, 45], yRange: [15, 48] },
    { houseId: 'H-02', houseName: '2号繁育母鹿舍', breed: '梅花鹿' as const, gender: '母' as const, count: 65, xRange: [55, 92], yRange: [15, 48] },
    { houseId: 'H-03', houseName: '3号优质育成鹿舍', breed: '马鹿' as const, gender: '公' as const, count: 58, xRange: [8, 45], yRange: [55, 88] },
    { houseId: 'H-04', houseName: '4号健康观察与隔离舍', breed: '梅花鹿' as const, gender: '母' as const, count: 25, xRange: [55, 92], yRange: [55, 88] },
  ];

  let tagIndex = 1;
  houseConfigs.forEach((cfg) => {
    for (let i = 1; i <= cfg.count; i++) {
      const tagId = `E501-R1-${String(tagIndex).padStart(4, '0')}`;
      const isEstrusCandidate = cfg.gender === '母' && tagIndex % 15 === 0;
      const isSickCandidate = tagIndex === 38 || tagIndex === 112;
      const isWarningCandidate = tagIndex === 74 || tagIndex === 169;

      let status: DeerRecord['status'] = 'healthy';
      let temp = 38.5 + Number((Math.sin(tagIndex) * 0.4).toFixed(1));
      let steps = 4200 + Math.floor(Math.abs(Math.sin(tagIndex * 3)) * 3500);
      let estrusScore = 15;

      if (isEstrusCandidate) {
        status = 'estrus';
        temp = 39.3;
        steps = 11200; // 发情活动量暴增
        estrusScore = 92;
      } else if (isSickCandidate) {
        status = 'sick';
        temp = 40.2; // 异常发热
        steps = 980; // 活动量骤降
        estrusScore = 5;
      } else if (isWarningCandidate) {
        status = 'warning';
        temp = 39.6;
        steps = 2200;
        estrusScore = 25;
      }

      const posX = cfg.xRange[0] + Math.random() * (cfg.xRange[1] - cfg.xRange[0]);
      const posY = cfg.yRange[0] + Math.random() * (cfg.yRange[1] - cfg.yRange[0]);

      deers.push({
        id: `DEER-${String(tagIndex).padStart(4, '0')}`,
        earTagId: tagId,
        name: `${cfg.breed}-${cfg.gender === '公' ? '雄' : '雌'}-${String(tagIndex).padStart(3, '0')}号`,
        breed: cfg.breed,
        gender: cfg.gender,
        ageMonths: 12 + (tagIndex % 36),
        weightKg: 85 + (tagIndex % 45),
        houseId: cfg.houseId,
        houseName: cfg.houseName,
        penNo: `A区-栏位${(i % 12) + 1}`,
        status,
        temperature: temp,
        dailySteps: steps,
        activeHours: Number((steps / 650).toFixed(1)),
        batteryLevel: Math.max(30, 99 - (tagIndex % 25)),
        signalDbm: -55 - (tagIndex % 30),
        lastReportTime: '10秒前',
        posX: Number(posX.toFixed(1)),
        posY: Number(posY.toFixed(1)),
        inSafeZone: true,
        rfidUid: `RFID-900M-${tagIndex.toString(16).toUpperCase().padStart(8, '0')}`,
        entryDate: '2025-03-12',
        batchNo: `B202503-${cfg.breed === '梅花鹿' ? 'MHL' : 'ML'}`,
        healthNote: isSickCandidate ? '体温高于40℃，皮下测温已触发早期发热预警，建议兽医复查' : isEstrusCandidate ? '活动量激增超日常240%，发情指数高，建议适时配种' : '各项生理指标正常',
        estrusScore,
      });

      tagIndex++;
    }
  });

  return deers;
};

// 硬件设备清单映射（严格根据清单中的设备与数量配置）
export const initialDevices: DeviceInfo[] = [
  // 环境设备（4台环境监测箱）
  { id: 'ENV-01', code: 'ENV-BOX-01', name: '1号舍环境中央综合采集箱', category: '环境设备', baseName: '南平庭春鹿业', houseName: '1号特级种公鹿舍', slotNo: 'A1-机位-01', type: '多参数气体温湿度箱', model: 'ENV-ST-8PRO', status: 'online', battery: 100, signalStrength: -48, ip: '192.168.10.21', firmwareVersion: 'v2.4.1', lastActive: '刚刚' },
  { id: 'ENV-02', code: 'ENV-BOX-02', name: '2号舍环境中央综合采集箱', category: '环境设备', baseName: '南平庭春鹿业', houseName: '2号繁育母鹿舍', slotNo: 'B1-机位-02', type: '多参数气体温湿度箱', model: 'ENV-ST-8PRO', status: 'online', battery: 100, signalStrength: -52, ip: '192.168.10.22', firmwareVersion: 'v2.4.1', lastActive: '刚刚' },
  { id: 'ENV-03', code: 'ENV-BOX-03', name: '3号舍环境中央综合采集箱', category: '环境设备', baseName: '南平庭春鹿业', houseName: '3号优质育成鹿舍', slotNo: 'C1-机位-03', type: '多参数气体温湿度箱', model: 'ENV-ST-8PRO', status: 'alert', battery: 98, signalStrength: -65, ip: '192.168.10.23', firmwareVersion: 'v2.4.1', lastActive: '1分钟前' },
  { id: 'ENV-04', code: 'ENV-BOX-04', name: '4号舍环境中央综合采集箱', category: '环境设备', baseName: '南平庭春鹿业', houseName: '4号健康观察与隔离舍', slotNo: 'D1-机位-04', type: '多参数气体温湿度箱', model: 'ENV-ST-8PRO', status: 'online', battery: 100, signalStrength: -50, ip: '192.168.10.24', firmwareVersion: 'v2.4.1', lastActive: '刚刚' },

  // 可视化设备（16台网络摄像机）
  ...Array.from({ length: 16 }, (_, i) => {
    const camIdx = i + 1;
    const houseIndex = Math.floor(i / 4);
    const houseNames = ['1号特级种公鹿舍', '2号繁育母鹿舍', '3号优质育成鹿舍', '4号健康观察与隔离舍'];
    const deviceStatus: 'online' | 'offline' | 'alert' = camIdx === 11 ? 'alert' : 'online';
    return {
      id: `CAM-${String(camIdx).padStart(2, '0')}`,
      code: `IPC-AI-4K-${String(camIdx).padStart(3, '0')}`,
      name: `${houseNames[houseIndex]} ${String((i % 4) + 1)}号AI行为球机`,
      category: '可视化设备' as const,
      baseName: '南平庭春鹿业',
      houseName: houseNames[houseIndex],
      slotNo: `CAM-SLOT-${String(camIdx).padStart(2, '0')}`,
      type: '2560x1440 4MP高清AI网络摄像机',
      model: 'IPC-2.7CMOS-H265',
      status: deviceStatus,
      signalStrength: -45 - (i % 15),
      ip: `192.168.20.${100 + camIdx}`,
      firmwareVersion: 'v3.1.0-AI',
      lastActive: '实时流中',
      extraData: { fps: 30, resolution: '2560*1440', nightVision: '智能双光', poe: 'IEEE 802.3af' },
    };
  }),

  // PDA设备（1台）
  {
    id: 'PDA-01',
    code: 'PDA-UHF-900',
    name: '南平庭春鹿业巡检移动手持机#01',
    category: 'PDA设备' as const,
    baseName: '南平庭春鹿业',
    houseName: '全场移动巡检区',
    type: '840-960MHz UHF手持触控终端',
    model: 'PDA-Pro-4000mAh',
    status: 'online' as const,
    battery: 88,
    signalStrength: -42,
    firmwareVersion: 'v4.5.2-Android',
    lastActive: '刚刚 (操作员: 张班长)',
    extraData: { readDistance: '室外>10米/室内>22米', os: 'Android 13', barcodeScan: '已开启' },
  },

  // 测温主机（14台，列入其他/网关类或耳标网关）
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `HOST-${String(i + 1).padStart(2, '0')}`,
    code: `HOST-4G-BT52-${String(i + 1).padStart(2, '0')}`,
    name: `测温计步定位网关基站#${i + 1}`,
    category: '其他设备' as const,
    baseName: '南平庭春鹿业',
    houseName: `${(i % 4) + 1}号鹿舍及周边运动场`,
    type: '4G三网通/BLE5.2测温采集主机',
    model: 'E500-HOST-4G',
    status: 'online' as const,
    battery: 100,
    signalStrength: -50 - (i % 20),
    ip: `4G-LBS-NODE-${i + 1}`,
    firmwareVersion: 'v1.8.4-OTA',
    lastActive: '刚刚',
    extraData: { bleRange: '半径120m', uploadRate: '20min/次(高频2min)' },
  })),

  // 通道识读器（1台）
  {
    id: 'CHANNEL-01',
    code: 'RFID-PASS-4CH',
    name: '鹿舍通道高频RFID自动盘点门禁',
    category: '其他设备' as const,
    baseName: '南平庭春鹿业',
    houseName: '主通道转舍调群门禁区',
    type: '4路SMA外接天线通道识读器',
    model: 'UHF-Reader-33dBm',
    status: 'online' as const,
    signalStrength: -38,
    ip: '192.168.10.88',
    firmwareVersion: 'v5.0.1',
    lastActive: '900张/秒 实时轮询中',
    extraData: { maxSpeed: '900 tags/s', distance: '>20m', rfPower: '33dBm' },
  },

  // 耳标代表设备（200个耳标，展示代表性列表）
  ...Array.from({ length: 10 }, (_, i) => {
    const tagStatus: 'online' | 'offline' | 'alert' = i === 5 ? 'alert' : 'online';
    return {
      id: `TAG-DEV-${i + 1}`,
      code: `E501-R1-${String(i + 1).padStart(4, '0')}`,
      name: `皮下测温计步耳标#${i + 1}`,
      category: '耳标设备' as const,
      baseName: '南平庭春鹿业',
      houseName: '1号特级种公鹿舍',
      type: '皮下测温RFID耳标 (±0.1℃)',
      model: 'E501-R1',
      status: tagStatus,
      battery: 95 - i,
      signalStrength: -58,
      firmwareVersion: 'v1.2-BLE',
      lastActive: '5分钟前',
    };
  }),
];

// 传感器与物联数据管理记录
export const initialSensorData: SensorDataRecord[] = [
  { id: 'SD-01', seq: 1, baseName: '南平庭春鹿业', houseName: '1号特级种公鹿舍', deviceCode: 'ENV-BOX-01', deviceName: '1号舍环境中央综合采集箱', deviceType: '环境传感器', temp: 18.5, humidity: 58.2, nh3: 8.2, n2: 78.1, h2s: 1.1, co2: 680, timestamp: '2026-09-18 15:20:10' },
  { id: 'SD-02', seq: 2, baseName: '南平庭春鹿业', houseName: '2号繁育母鹿舍', deviceCode: 'ENV-BOX-02', deviceName: '2号舍环境中央综合采集箱', deviceType: '环境传感器', temp: 19.8, humidity: 62.0, nh3: 11.4, n2: 78.0, h2s: 1.8, co2: 740, timestamp: '2026-09-18 15:20:08' },
  { id: 'SD-03', seq: 3, baseName: '南平庭春鹿业', houseName: '3号优质育成鹿舍', deviceCode: 'ENV-BOX-03', deviceName: '3号舍环境中央综合采集箱', deviceType: '环境传感器', temp: 21.2, humidity: 65.4, nh3: 16.8, n2: 77.9, h2s: 2.9, co2: 890, timestamp: '2026-09-18 15:20:05' },
  { id: 'SD-04', seq: 4, baseName: '南平庭春鹿业', houseName: '4号健康观察与隔离舍', deviceCode: 'ENV-BOX-04', deviceName: '4号舍环境中央综合采集箱', deviceType: '环境传感器', temp: 20.1, humidity: 55.3, nh3: 6.5, n2: 78.2, h2s: 0.8, co2: 620, timestamp: '2026-09-18 15:20:02' },
];

export const initialVideoData: SensorDataRecord[] = Array.from({ length: 8 }, (_, i) => ({
  id: `VD-${i + 1}`,
  seq: i + 1,
  baseName: '南平庭春鹿业',
  houseName: `${Math.floor(i / 2) + 1}号鹿舍`,
  deviceCode: `IPC-AI-4K-${String(i + 1).padStart(3, '0')}`,
  deviceName: `鹿舍高清监控摄像头#${i + 1}`,
  deviceType: '可视化网络摄像机',
  streamUrl: `rtsp://edge-gateway.farm.internal/live/cam_${i + 1}.h265`,
  streamFps: 30,
  timestamp: '实时推流中 (H.265 4MP)',
}));

export const initialPdaData: SensorDataRecord[] = [
  { id: 'PDA-LOG-01', seq: 1, baseName: '南平庭春鹿业', houseName: '2号繁育母鹿舍', deviceCode: 'PDA-UHF-900', deviceName: 'PDA手持终端', deviceType: 'PDA设备', pdaChangedData: '批量复核RFID耳标25只，更新疫苗免疫记录[破伤风抗毒素]', pdaOperator: '张班长 (工号: 0802)', timestamp: '2026-09-18 14:45:12' },
  { id: 'PDA-LOG-02', seq: 2, baseName: '南平庭春鹿业', houseName: '1号特级种公鹿舍', deviceCode: 'PDA-UHF-900', deviceName: 'PDA手持终端', deviceType: 'PDA设备', pdaChangedData: '记录鹿只[梅花鹿-雄-008]茸重称重 2.45kg，调群至A2栏', pdaOperator: '李兽医 (工号: 0806)', timestamp: '2026-09-18 11:30:20' },
  { id: 'PDA-LOG-03', seq: 3, baseName: '南平庭春鹿业', houseName: '4号健康观察与隔离舍', deviceCode: 'PDA-UHF-900', deviceName: 'PDA手持终端', deviceType: 'PDA设备', pdaChangedData: '登记隔离鹿只[梅花鹿-雌-038]体温复测39.8℃，用药记录已同步', pdaOperator: '王巡检 (工号: 0811)', timestamp: '2026-09-18 09:15:00' },
];

export const initialEarTagData: SensorDataRecord[] = [
  { id: 'ETD-01', seq: 1, baseName: '南平庭春鹿业', houseName: '1号特级种公鹿舍', deviceCode: 'E501-R1-0001', deviceName: '测温计步耳标', deviceType: '皮下测温耳标', earTagTemp: 38.6, earTagSteps: 6540, earTagLocation: '1号舍-东侧运动场 (X:22.4, Y:35.1)', timestamp: '2026-09-18 15:20:15' },
  { id: 'ETD-02', seq: 2, baseName: '南平庭春鹿业', houseName: '2号繁育母鹿舍', deviceCode: 'E501-R1-0060', deviceName: '测温计步耳标', deviceType: '皮下测温耳标', earTagTemp: 39.3, earTagSteps: 11200, earTagLocation: '2号舍-采食槽区 (X:68.2, Y:28.4)', timestamp: '2026-09-18 15:20:14' },
  { id: 'ETD-03', seq: 3, baseName: '南平庭春鹿业', houseName: '4号健康观察与隔离舍', deviceCode: 'E501-R1-0038', deviceName: '测温计步耳标', deviceType: '皮下测温耳标', earTagTemp: 40.2, earTagSteps: 980, earTagLocation: '4号舍-隔离特护栏 (X:75.0, Y:72.5)', timestamp: '2026-09-18 15:20:12' },
  { id: 'ETD-04', seq: 4, baseName: '南平庭春鹿业', houseName: '3号优质育成鹿舍', deviceCode: 'E501-R1-0125', deviceName: '测温计步耳标', deviceType: '皮下测温耳标', earTagTemp: 38.8, earTagSteps: 7800, earTagLocation: '3号舍-西侧遮阴棚 (X:32.1, Y:64.3)', timestamp: '2026-09-18 15:20:10' },
];

export const initialOtherData: SensorDataRecord[] = [
  { id: 'OD-01', seq: 1, baseName: '南平庭春鹿业', houseName: '主通道转舍调群门禁区', deviceCode: 'RFID-PASS-4CH', deviceName: '通道高频识读器', deviceType: 'UHF门禁识读器', otherData: '通道自动盘点：今日过门累计 86次，标签识读成功率 99.98%，瞬时通量 850 tags/s', timestamp: '2026-09-18 15:20:00' },
  { id: 'OD-02', seq: 2, baseName: '南平庭春鹿业', houseName: '1号特级种公鹿舍', deviceCode: 'HOST-4G-BT52-01', deviceName: '测温网关基站#01', deviceType: '网关基站', otherData: '已连接耳标节点: 52台, 4G上行网络延时: 22ms, 蓝牙丢包率: 0.01%', timestamp: '2026-09-18 15:19:55' },
];

// 告警规则引擎初始规则
export const initialAlarmRules: AlarmRule[] = [
  { id: 'R-01', name: '鹿只体温高热早期预警', category: '生理监测', metric: '皮下测温温度', operator: '>', threshold: 39.8, unit: '℃', level: 'CRITICAL', enabled: true, pushChannels: ['APP', 'SMS', 'WECHAT'], notifyRoles: ['驻场兽医', '养殖场长'] },
  { id: 'R-02', name: '鹿只体温过低异常警报', category: '生理监测', metric: '皮下测温温度', operator: '<', threshold: 37.5, unit: '℃', level: 'WARNING', enabled: true, pushChannels: ['APP', 'WECHAT'], notifyRoles: ['驻场兽医'] },
  { id: 'R-03', name: '母鹿疑似发情活动量激增', category: '行为识别', metric: '日累计运动步数', operator: '>', threshold: 10000, unit: '步/日', level: 'WARNING', enabled: true, pushChannels: ['APP', 'WECHAT'], notifyRoles: ['繁育技术员', '养殖班长'] },
  { id: 'R-04', name: '鹿只异常呆立/疾病倦怠', category: '行为识别', metric: '日运动步数', operator: '<', threshold: 1500, unit: '步/日', level: 'WARNING', enabled: true, pushChannels: ['APP'], notifyRoles: ['养殖班长', '驻场兽医'] },
  { id: 'R-05', name: '鹿舍氨气(NH3)超标浓度', category: '环境监测', metric: '氨气浓度', operator: '>', threshold: 15.0, unit: 'ppm', level: 'CRITICAL', enabled: true, pushChannels: ['APP', 'SMS', 'WECHAT'], notifyRoles: ['环控专员', '养殖班长'] },
  { id: 'R-06', name: '鹿舍硫化氢(H2S)警戒', category: '环境监测', metric: '硫化氢浓度', operator: '>', threshold: 2.5, unit: 'ppm', level: 'WARNING', enabled: true, pushChannels: ['APP', 'WECHAT'], notifyRoles: ['环控专员'] },
  { id: 'R-07', name: '鹿舍二氧化碳(CO2)超标', category: '环境监测', metric: 'CO2浓度', operator: '>', threshold: 850, unit: 'ppm', level: 'INFO', enabled: true, pushChannels: ['APP'], notifyRoles: ['环控专员'] },
  { id: 'R-08', name: '电子围栏越界逃逸告警', category: '安全防护', metric: '围栏越界判定', operator: '=', threshold: 1, unit: '次', level: 'CRITICAL', enabled: true, pushChannels: ['APP', 'SMS', 'WECHAT'], notifyRoles: ['全员安防'] },
];

// 初始告警记录
export const initialAlarms: AlarmItem[] = [
  {
    id: 'ALM-20260918-001',
    title: '鹿只体温持续发热(40.2℃)预警',
    level: 'CRITICAL',
    sourceType: '体温异常',
    houseName: '4号健康观察与隔离舍',
    deerTagId: 'E501-R1-0038',
    description: '鹿只[梅花鹿-雌-038]皮下测温已达40.2℃，超警戒阈值39.8℃，连续3个采样周期呈升温趋势，疑似急性肺炎感染。',
    occurredTime: '15:12:30',
    status: 'processing',
    channel: ['APP', 'SMS', 'WECHAT'],
    handler: '李兽医',
    handleTime: '15:15:00',
    handleAction: '已转入隔离特护间，肌注退热消炎针剂，采血样送检',
    handleResult: '体温已回落至39.5℃，持续观察中',
  },
  {
    id: 'ALM-20260918-002',
    title: '3号舍氨气(NH3)浓度达到16.8ppm',
    level: 'CRITICAL',
    sourceType: '环境异常',
    houseName: '3号优质育成鹿舍',
    description: '3号育成舍中央传感器监测到NH3浓度达16.8ppm(阈值15.0ppm)，空气污浊度上升，易诱发呼吸道黏膜充血。',
    occurredTime: '14:58:10',
    status: 'pending',
    channel: ['APP', 'SMS', 'WECHAT'],
  },
  {
    id: 'ALM-20260918-003',
    title: '2号舍繁育母鹿发情行为高发识别',
    level: 'WARNING',
    sourceType: '异常行为',
    houseName: '2号繁育母鹿舍',
    deerTagId: 'E501-R1-0060',
    description: 'AI摄像头CAM-06识别到母鹿[梅花鹿-雌-060]出现频繁爬跨行为，且计步达11200步，发情置信度96.5%。',
    occurredTime: '14:20:05',
    status: 'resolved',
    channel: ['APP', 'WECHAT'],
    handler: '繁育组王组长',
    handleTime: '14:30:12',
    handleAction: '人工复核生殖道黏膜红肿充血，已安排种公鹿[梅花鹿-雄-001]进行本交配种',
    handleResult: '完成初次配种登记，档案已更新',
  },
  {
    id: 'ALM-20260918-004',
    title: '1号舍公鹿激烈顶撞打斗行为预警',
    level: 'WARNING',
    sourceType: '异常行为',
    houseName: '1号特级种公鹿舍',
    deerTagId: 'E501-R1-0008',
    description: 'AI行为识别检测到1号舍两只成年种公鹿发生角部剧烈顶撞持续超45秒，存在茸角损伤与骨折风险。',
    occurredTime: '13:40:22',
    status: 'resolved',
    channel: ['APP'],
    handler: '巡检班张班长',
    handleTime: '13:42:10',
    handleAction: '启动声光驱离装置，养殖员现场分栏隔开',
    handleResult: '两只公鹿已分开，无茸角破损，情绪已平复',
  },
];

// 转舍调群记录
export const initialTransfers: TransferRecord[] = [
  { id: 'TR-20260918-01', tagId: 'E501-R1-0038', deerName: '梅花鹿-雌-038号', fromHouse: '2号繁育母鹿舍', toHouse: '4号健康观察与隔离舍', transferType: '病患隔离', operator: '李兽医', transferTime: '2026-09-18 15:15:00', reason: '体温40.2℃持续发热，转入特护栏隔离治疗', status: '已生效' },
  { id: 'TR-20260918-02', tagId: 'E501-R1-0060', deerName: '梅花鹿-雌-060号', fromHouse: '2号繁育母鹿舍', toHouse: '1号特级种公鹿舍(配种栏)', transferType: '发情配种', operator: '王组长', transferTime: '2026-09-18 14:30:00', reason: '发情行为与步数激增，转入配种专栏', status: '已生效' },
  { id: 'TR-20260918-03', tagId: 'E501-R1-0188', deerName: '马鹿-公-188号', fromHouse: '3号优质育成鹿舍', toHouse: '1号特级种公鹿舍', transferType: '断奶分群', operator: '张班长', transferTime: '2026-09-17 10:20:00', reason: '满18月龄体成熟，转入种公鹿管理群', status: '已生效' },
];

export const MOCK_DEERS = generateInitialDeers();
export const MOCK_HOUSES = initialHouses;
export const MOCK_DEVICES = initialDevices;
export const MOCK_ENV_DATA = initialSensorData;
export const MOCK_VIDEO_DATA = initialVideoData;
export const MOCK_PDA_DATA = initialPdaData;
export const MOCK_TAG_DATA = initialEarTagData;
export const MOCK_OTHER_DATA = initialOtherData;
export const MOCK_ALARMS = initialAlarms;
export const MOCK_ALARM_RULES = initialAlarmRules;
export const MOCK_TRANSFER_RECORDS = initialTransfers;


