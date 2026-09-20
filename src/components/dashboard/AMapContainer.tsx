import React, { useState, useEffect, useMemo } from 'react';
import { DeerRecord, HouseInfo, DeviceInfo, AlarmItem } from '../../types/deer';
import {
  MapPin,
  Layers,
  Radio,
  Video,
  Activity,
  Footprints,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Thermometer,
  Shield,
  Volume2,
  Wind,
  Eye,
  Camera,
  Cpu,
  SlidersHorizontal,
  X,
  Sparkles,
  Play,
  RotateCcw,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AMapContainerProps {
  deers: DeerRecord[];
  houses: HouseInfo[];
  devices: DeviceInfo[];
  alarms: AlarmItem[];
  selectedDeer: DeerRecord | null;
  onSelectDeer: (deer: DeerRecord | null) => void;
  selectedHouse: HouseInfo | null;
  onSelectHouse: (house: HouseInfo | null) => void;
  viewMode: 'overview' | 'detail';
  onSwitchViewMode: (mode: 'overview' | 'detail') => void;
  onTriggerSimulatedAlarm?: () => void;
}

export const AMapContainer: React.FC<AMapContainerProps> = ({
  deers,
  houses,
  devices,
  alarms,
  selectedDeer,
  onSelectDeer,
  selectedHouse,
  onSelectHouse,
  viewMode,
  onSwitchViewMode,
}) => {
  // 缩放等级
  const [zoomLevel, setZoomLevel] = useState<number>(viewMode === 'detail' ? 18.5 : 17);
  // 地图中心平移偏移量
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 图层控制 (参考图1左侧悬浮图层栏)
  const [layerVisibility, setLayerVisibility] = useState({
    personnel: true, // 鹿只 / 人员
    devices: true,   // 物联设备
    regions: true,   // 区域 / 电子围栏
    cameras: true,   // 视频监控球机
  });

  // 图层控制面板折叠状态 (置于左侧数据区域框边上，默认展开)
  const [isLayerControlOpen, setIsLayerControlOpen] = useState(true);
  const [activeControlTab, setActiveControlTab] = useState<'layers' | 'devices'>('layers');

  // 设备分类筛选 (参考图1左侧设备分类浮动窗)
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState<string>('all');

  // 选中的设备详情
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);

  // 轨迹回放状态
  const [isPlayingTrack, setIsPlayingTrack] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);

  // 监听视角模式切换
  useEffect(() => {
    if (viewMode === 'detail') {
      setZoomLevel(18.5);
      setPanOffset({ x: -20, y: -10 });
    } else {
      setZoomLevel(17);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [viewMode]);

  // 轨迹回放动画循环
  useEffect(() => {
    let interval: any;
    if (isPlayingTrack) {
      interval = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingTrack(false);
            return 100;
          }
          return prev + 4;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingTrack]);

  // 真实的福建南平庭春鹿业生态发展有限公司物联设备点位分布
  const iotDevicePoints = [
    {
      id: 'DEV-BS-01',
      name: '南平庭春鹿业1号主基站 (4G/BLE5.2)',
      category: 'main_station',
      categoryLabel: '主基站',
      type: 'base_station',
      x: 48,
      y: 36,
      icon: Radio,
      color: '#06b6d4',
      status: 'online',
      coverageRadius: 24,
      model: 'E500-GW-PRO',
      rssi: -45,
      power: '市电 220V',
    },
    {
      id: 'DEV-BS-02',
      name: '南区放牧场无线网关基站',
      category: 'main_station',
      categoryLabel: '主基站',
      type: 'base_station',
      x: 72,
      y: 54,
      icon: Radio,
      color: '#06b6d4',
      status: 'online',
      coverageRadius: 20,
      model: 'E500-GW-PRO',
      rssi: -52,
      power: '太阳能+市电双路',
    },
    {
      id: 'DEV-BS-03',
      name: '北区日光运动场中继基站',
      category: 'main_station',
      categoryLabel: '主基站',
      type: 'base_station',
      x: 32,
      y: 22,
      icon: Radio,
      color: '#06b6d4',
      status: 'online',
      coverageRadius: 18,
      model: 'E500-GW-R1',
      rssi: -48,
      power: '市电 220V',
    },
    {
      id: 'DEV-ENV-01',
      name: '1号舍智能环境微气象站',
      category: 'gas_sensor',
      categoryLabel: '气体探测器',
      type: 'env_sensor',
      x: 42,
      y: 44,
      icon: Wind,
      color: '#10b981',
      status: 'online',
      data: 'NH3: 8.2ppm | 舍温: 19.5℃ | 湿度: 58%',
      model: 'ENV-TH-NH3-04',
      power: '市电 220V',
    },
    {
      id: 'DEV-ENV-02',
      name: '2号繁育舍多气体探测器',
      category: 'gas_sensor',
      categoryLabel: '气体探测器',
      type: 'env_sensor',
      x: 58,
      y: 44,
      icon: Wind,
      color: '#10b981',
      status: 'online',
      data: 'NH3: 11.4ppm | CO2: 680ppm | 湿度: 62%',
      model: 'ENV-TH-NH3-04',
      power: '市电 220V',
    },
    {
      id: 'DEV-ALARM-01',
      name: '322国道边界声光防逃预警器',
      category: 'sound_alarm',
      categoryLabel: '声光报警器',
      type: 'alarm_horn',
      x: 46,
      y: 78,
      icon: Volume2,
      color: '#f59e0b',
      status: 'online',
      data: '110dB高响度 | 红色频闪激光',
      model: 'ALM-FL-100',
      power: '太阳能蓄电池',
    },
    {
      id: 'DEV-ALARM-02',
      name: '西侧隔离区声光报警器',
      category: 'sound_alarm',
      categoryLabel: '声光报警器',
      type: 'alarm_horn',
      x: 28,
      y: 52,
      icon: Volume2,
      color: '#f59e0b',
      status: 'online',
      data: '联锁联动就绪',
      model: 'ALM-FL-100',
      power: '市电 220V',
    },
    {
      id: 'DEV-CAM-01',
      name: '4MP AI星光级全景云台球机#1',
      category: 'camera',
      categoryLabel: '摄像头',
      type: 'camera',
      x: 51,
      y: 28,
      icon: Camera,
      color: '#a855f7',
      status: 'online',
      data: '4K超清 | 行为识别AI使能',
      model: 'IPC-HFW-4MP',
      power: 'PoE供电',
    },
    {
      id: 'DEV-CAM-02',
      name: '4MP AI星光级全景球机#2 (放牧区)',
      category: 'camera',
      categoryLabel: '摄像头',
      type: 'camera',
      x: 68,
      y: 42,
      icon: Camera,
      color: '#a855f7',
      status: 'online',
      data: '4K超清 | 鹿只计数AI使能',
      model: 'IPC-HFW-4MP',
      power: 'PoE供电',
    },
    {
      id: 'DEV-CAM-03',
      name: '南平庭春大门与322国道高清球机',
      category: 'camera',
      categoryLabel: '摄像头',
      type: 'camera',
      x: 62,
      y: 72,
      icon: Camera,
      color: '#a855f7',
      status: 'online',
      data: '车牌识别与周界入侵检测',
      model: 'IPC-HFW-4MP',
      power: 'PoE供电',
    },
  ];

  // 电子围栏高亮发光多边形 (参考图1紫色、橙色、青色发光区域)
  const geofencePolygons = [
    {
      id: 'FENCE-PURPLE',
      name: '1号特级种公鹿舍安全防线',
      type: '种公鹿重点防护区',
      points: '37,28 54,28 55,42 36,43',
      color: '#d946ef', // 紫色高亮发光
      fillColor: 'rgba(217, 70, 239, 0.28)',
      borderColor: '#e879f9',
      status: 'safe',
      deerCount: 48,
    },
    {
      id: 'FENCE-ORANGE',
      name: '2号繁育母鹿与南区放牧场防线',
      type: '生态放牧运动防线',
      points: '35,56 58,56 68,68 40,70',
      color: '#f97316', // 橙色高亮发光
      fillColor: 'rgba(249, 115, 22, 0.25)',
      borderColor: '#fb923c',
      status: 'safe',
      deerCount: 286,
    },
    {
      id: 'FENCE-CYAN',
      name: '3号优质育成与产房特护区',
      type: '繁育育成隔离区',
      points: '70,30 88,34 86,52 69,50',
      color: '#06b6d4', // 青色高亮发光
      fillColor: 'rgba(6, 182, 212, 0.25)',
      borderColor: '#22d3ee',
      status: 'warning',
      deerCount: 165,
    },
    {
      id: 'FENCE-RED-ROAD',
      name: '322国道外围防逃逸电子边界',
      type: '外围硬隔离防线',
      points: '12,74 88,74 88,86 12,86',
      color: '#ef4444', // 红色警戒
      fillColor: 'rgba(239, 68, 68, 0.12)',
      borderColor: '#f87171',
      status: 'danger',
      deerCount: 0,
    },
  ];

  // 鹿只点位数据（在真实南平庭春鹿业坐标内打点）
  const deerMarkers = [
    {
      id: 'DEER-001',
      name: '南平庭春01号',
      earTagId: 'TAG-E501-0891',
      tagCode: 'E501-0891',
      breed: '双阳梅花鹿',
      gender: '公鹿',
      age: '36个月',
      status: 'healthy',
      statusLabel: '在栏 / 正常',
      statusColor: '#10b981',
      x: 45,
      y: 35,
      house: '1号特级种公鹿舍',
      location: '1号舍 01栏位',
      hostGw: '南平庭春鹿业1号主基站',
      battery: 95,
      rssi: -64,
      rssiDesc: '优秀',
      temp: 38.6,
      steps: 5420,
      activeHours: 6.8,
      historyTrack: [
        { x: 38, y: 32 },
        { x: 41, y: 34 },
        { x: 43, y: 33 },
        { x: 44, y: 36 },
        { x: 45, y: 35 },
      ],
    },
    {
      id: 'DEER-002',
      name: '春鹿·繁育08号',
      earTagId: 'TAG-E501-0422',
      tagCode: 'E501-0422',
      breed: '吉林双阳梅花鹿',
      gender: '母鹿',
      age: '28个月',
      status: 'estrus',
      statusLabel: '疑似发情旺期',
      statusColor: '#f59e0b',
      x: 48,
      y: 62,
      house: '2号繁育母鹿舍',
      location: '南区放牧草场',
      hostGw: '南区放牧场无线网关基站',
      battery: 88,
      rssi: -58,
      rssiDesc: '极佳',
      temp: 39.2,
      steps: 8940,
      activeHours: 9.4,
      historyTrack: [
        { x: 40, y: 58 },
        { x: 44, y: 60 },
        { x: 46, y: 64 },
        { x: 47, y: 61 },
        { x: 48, y: 62 },
      ],
    },
    {
      id: 'DEER-003',
      name: '春鹿·种鹿12号',
      earTagId: 'TAG-E501-1102',
      tagCode: 'E501-1102',
      breed: '东大梅花鹿',
      gender: '公鹿',
      age: '48个月',
      status: 'healthy',
      statusLabel: '在栏 / 正常',
      statusColor: '#10b981',
      x: 41,
      y: 38,
      house: '1号特级种公鹿舍',
      location: '1号舍 东区日光场',
      hostGw: '庭春鹿业1号主基站',
      battery: 92,
      rssi: -51,
      rssiDesc: '极佳',
      temp: 38.5,
      steps: 4320,
      activeHours: 5.5,
      historyTrack: [
        { x: 39, y: 36 },
        { x: 40, y: 37 },
        { x: 41, y: 38 },
      ],
    },
    {
      id: 'DEER-004',
      name: '春鹿·育成33号',
      earTagId: 'TAG-E501-0988',
      tagCode: 'E501-0988',
      breed: '双阳梅花鹿',
      gender: '母鹿',
      age: '14个月',
      status: 'sick',
      statusLabel: '高热预警 39.9℃',
      statusColor: '#ef4444',
      x: 76,
      y: 42,
      house: '3号优质育成与产房舍',
      location: '3号舍 隔离观察栏',
      hostGw: '北区日光运动场中继基站',
      battery: 79,
      rssi: -72,
      rssiDesc: '良好',
      temp: 39.9,
      steps: 1280,
      activeHours: 2.1,
      historyTrack: [
        { x: 74, y: 40 },
        { x: 75, y: 41 },
        { x: 76, y: 42 },
      ],
    },
    {
      id: 'DEER-005',
      name: '春鹿·特级公鹿03号',
      earTagId: 'TAG-E501-0305',
      tagCode: 'E501-0305',
      breed: '双阳梅花鹿',
      gender: '公鹿',
      age: '42个月',
      status: 'healthy',
      statusLabel: '在栏 / 正常',
      statusColor: '#10b981',
      x: 52,
      y: 33,
      house: '1号特级种公鹿舍',
      location: '1号舍 03栏位',
      hostGw: '庭春鹿业1号主基站',
      battery: 98,
      rssi: -49,
      rssiDesc: '极佳',
      temp: 38.7,
      steps: 6120,
      activeHours: 7.2,
      historyTrack: [
        { x: 48, y: 30 },
        { x: 50, y: 32 },
        { x: 52, y: 33 },
      ],
    },
    {
      id: 'DEER-006',
      name: '春鹿·母鹿19号',
      earTagId: 'TAG-E501-0774',
      tagCode: 'E501-0774',
      breed: '双阳梅花鹿',
      gender: '母鹿',
      age: '24个月',
      status: 'healthy',
      statusLabel: '在栏 / 正常',
      statusColor: '#10b981',
      x: 52,
      y: 64,
      house: '2号繁育母鹿舍',
      location: '南区放牧草场',
      hostGw: '南区放牧场无线网关基站',
      battery: 91,
      rssi: -62,
      rssiDesc: '优秀',
      temp: 38.8,
      steps: 7300,
      activeHours: 8.1,
      historyTrack: [
        { x: 49, y: 61 },
        { x: 51, y: 63 },
        { x: 52, y: 64 },
      ],
    },
  ];

  // 当前选中展示的鹿只 (保证一进入就能体验参考图1的详细弹窗，且动态选择鹿只时安全回退)
  const activeDeerPopup = useMemo(() => {
    if (!selectedDeer) return deerMarkers[0];
    const found = deerMarkers.find(
      (d) => d.id === selectedDeer.id || d.earTagId === selectedDeer.earTagId
    );
    if (found) return found;

    return {
      id: selectedDeer.id,
      name: selectedDeer.name || '鹿只个体',
      earTagId: selectedDeer.earTagId || 'TAG-E501-XXXX',
      tagCode: selectedDeer.earTagId?.replace('TAG-', '') || 'E501-XXXX',
      breed: selectedDeer.breed || '梅花鹿',
      gender: selectedDeer.gender || '公鹿',
      age: `${selectedDeer.ageMonths || 24}个月`,
      status: selectedDeer.status || 'healthy',
      statusLabel:
        selectedDeer.status === 'sick'
          ? '高热预警'
          : selectedDeer.status === 'estrus'
          ? '发情中'
          : '在栏 / 正常',
      statusColor:
        selectedDeer.status === 'sick'
          ? '#ef4444'
          : selectedDeer.status === 'estrus'
          ? '#f59e0b'
          : '#10b981',
      x: selectedDeer.posX || 50,
      y: selectedDeer.posY || 50,
      house: selectedDeer.houseName || '1号特级种公鹿舍',
      location: `${selectedDeer.houseName || '1号舍'} ${selectedDeer.penNo || '01栏位'}`,
      hostGw: '庭春鹿业1号主基站',
      battery: selectedDeer.batteryLevel ?? 95,
      rssi: selectedDeer.signalDbm ?? -55,
      rssiDesc: '良好',
      temp: selectedDeer.temperature ?? 38.5,
      steps: selectedDeer.dailySteps ?? 5200,
      activeHours: selectedDeer.activeHours ?? 6.5,
      historyTrack: [
        { x: (selectedDeer.posX || 50) - 2, y: (selectedDeer.posY || 50) - 2 },
        { x: (selectedDeer.posX || 50) - 1, y: (selectedDeer.posY || 50) - 1 },
        { x: selectedDeer.posX || 50, y: selectedDeer.posY || 50 },
      ],
    };
  }, [selectedDeer, deerMarkers]);

  // 鼠标拖拽平移事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // 设备筛选过滤
  const filteredDevices = iotDevicePoints.filter((dev) => {
    if (selectedDeviceCategory === 'all') return true;
    return dev.category === selectedDeviceCategory;
  });

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none bg-[#0a1118]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      {/* ===================== 地图视口可缩放平移层 ===================== */}
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${zoomLevel / 17}) translate(${panOffset.x * 0.15}px, ${panOffset.y * 0.15}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* ========== 底图: 真实高清卫星影像遥感 (按参考图 2 完美还原福建南平庭春鹿业地理环境) ========== */}
        <div className="absolute inset-0 w-full h-full">
          {/* 卫星底图背景 */}
            <div
              className="absolute inset-0 bg-[#2b3529]"
              style={{
                backgroundImage: `radial-gradient(ellipse at 50% 45%, #425239 0%, #2a3825 50%, #152014 90%)`,
              }}
            />

            {/* 高分辨率航拍地貌矢量渲染层 */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 700"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                {/* 茶山梯田与农田土壤纹理 */}
                <pattern id="teaTerrace" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0,10 Q20,5 40,10" fill="none" stroke="#5d6f4e" strokeWidth="1.5" opacity="0.6" />
                  <path d="M0,20 Q20,15 40,20" fill="none" stroke="#48583c" strokeWidth="1.2" opacity="0.5" />
                </pattern>

                {/* 茂密生态林地斑块 */}
                <pattern id="forestPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="8" cy="8" r="4" fill="#2d4224" opacity="0.7" />
                  <circle cx="22" cy="18" r="5" fill="#23351b" opacity="0.8" />
                  <circle cx="15" cy="24" r="3.5" fill="#354e2b" opacity="0.6" />
                </pattern>

                {/* 鹿舍标准顶棚金属彩钢瓦纹理 */}
                <pattern id="roofRibs" width="8" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="20" fill="#786558" />
                  <rect x="4" y="0" width="4" height="20" fill="#655347" />
                </pattern>
              </defs>

              {/* 1. 北侧与两侧丘陵茶山植被底色 (图2特征) */}
              <rect x="0" y="0" width="1000" height="700" fill="url(#teaTerrace)" />
              <path d="M0,0 L1000,0 L1000,280 L750,220 L300,200 L0,260 Z" fill="url(#forestPattern)" />
              <path d="M700,200 L1000,240 L1000,600 L780,550 Z" fill="url(#forestPattern)" />
              <path d="M0,240 L280,220 L260,560 L0,580 Z" fill="url(#forestPattern)" />

              {/* 2. 庭春鹿业核心厂区开阔平整场地 (图2特征：中间浅土黄开阔地坪) */}
              <polygon
                points="280,180 720,190 750,530 250,520"
                fill="#8f7a63"
                opacity="0.85"
                stroke="#6d5a45"
                strokeWidth="2"
              />

              {/* 3. 核心现代化鹿舍规整建筑群 (严格按图2真实屋顶结构绘制：6排纵向/横向标准鹿舍) */}
              {/* 1号特级种公鹿舍 (左上) */}
              <g id="roof-house-1" className="cursor-pointer hover:opacity-90">
                <rect x="360" y="220" width="85" height="42" fill="url(#roofRibs)" stroke="#42342c" strokeWidth="2" rx="2" />
                <rect x="360" y="270" width="85" height="42" fill="url(#roofRibs)" stroke="#42342c" strokeWidth="2" rx="2" />
                {/* 舍间连廊通道 */}
                <rect x="395" y="262" width="15" height="8" fill="#524337" />
              </g>

              {/* 2号繁育母鹿舍 (右上) */}
              <g id="roof-house-2" className="cursor-pointer hover:opacity-90">
                <rect x="465" y="220" width="85" height="42" fill="url(#roofRibs)" stroke="#42342c" strokeWidth="2" rx="2" />
                <rect x="465" y="270" width="85" height="42" fill="url(#roofRibs)" stroke="#42342c" strokeWidth="2" rx="2" />
                <rect x="500" y="262" width="15" height="8" fill="#524337" />
              </g>

              {/* 3号育成与产房舍 (中下) */}
              <g id="roof-house-3" className="cursor-pointer hover:opacity-90">
                <rect x="380" y="340" width="70" height="38" fill="url(#roofRibs)" stroke="#42342c" strokeWidth="2" rx="2" />
                <rect x="460" y="340" width="70" height="38" fill="url(#roofRibs)" stroke="#42342c" strokeWidth="2" rx="2" />
              </g>

              {/* 庭春鹿业综合办公管理用房与饲料加工车间 */}
              <rect x="375" y="410" width="60" height="32" fill="#9c8774" stroke="#4c3d31" strokeWidth="1.5" rx="2" />
              <rect x="450" y="405" width="75" height="36" fill="#887361" stroke="#4c3d31" strokeWidth="1.5" rx="2" />

              {/* 场内标准化硬化环道 */}
              <path
                d="M 320,490 L 320,200 L 580,200 L 580,490 Z"
                fill="none"
                stroke="#d4c5b3"
                strokeWidth="12"
                strokeLinejoin="round"
                opacity="0.8"
              />
              <path
                d="M 320,490 L 320,200 L 580,200 L 580,490 Z"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />

              {/* 4. 南侧紧邻的 322国道 (G322) 真实道路绘制 (参考图2底部贯穿的大道) */}
              <g id="g322-highway">
                {/* 322国道公路路基 */}
                <path
                  d="M 0,620 Q 500,600 1000,580"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                {/* 沥青路面 */}
                <path
                  d="M 0,620 Q 500,600 1000,580"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="22"
                />
                {/* 道路中心黄色双虚线 */}
                <path
                  d="M 0,620 Q 500,600 1000,580"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="2"
                  strokeDasharray="14 10"
                />

                {/* 进场专用林荫道路 */}
                <path
                  d="M 460,608 L 460,490"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="14"
                />

                {/* G322 国道标志牌 (图2右下角/左下角标牌) */}
                <g transform="translate(860, 530)">
                  <rect x="0" y="0" width="60" height="22" rx="4" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                  <text x="6" y="15" fill="#1f2937" fontSize="10" fontFamily="sans-serif" fontWeight="bold">322国道</text>
                  <rect x="52" y="2" width="38" height="18" rx="3" fill="#dc2626" />
                  <text x="56" y="15" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">G322</text>
                </g>

                <g transform="translate(360, 580)">
                  <rect x="0" y="0" width="60" height="22" rx="4" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                  <text x="6" y="15" fill="#1f2937" fontSize="10" fontFamily="sans-serif" fontWeight="bold">322国道</text>
                  <rect x="52" y="2" width="38" height="18" rx="3" fill="#dc2626" />
                  <text x="56" y="15" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">G322</text>
                </g>
              </g>

              {/* 5. 庭春鹿业核心定位地标圆环 (图2中央标靶) */}
              <g transform="translate(480, 360)">
                <circle cx="0" cy="0" r="22" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" className="animate-spin" style={{ transformOrigin: '0px 0px', animationDuration: '16s' }} />
                <circle cx="0" cy="0" r="14" fill="#1e293b" stroke="#ffffff" strokeWidth="3" />
                <circle cx="0" cy="0" r="6" fill="#0284c7" />
                {/* 地理标牌 */}
                <rect x="-110" y="24" width="220" height="24" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="40" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                  福建南平庭春鹿业生态发展有限公司
                </text>
              </g>
            </svg>
          </div>

        {/* ===================== SVG 覆盖层：电子围栏多边形与动态发光 (完全参考图1) ===================== */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {/* 紫色多边形渐变与阴影 (参考图1紫色围栏) */}
            <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#d946ef" floodOpacity="0.8" />
            </filter>

            {/* 橙色多边形渐变与阴影 (参考图1橙色围栏) */}
            <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#f97316" floodOpacity="0.8" />
            </filter>

            {/* 青色多边形渐变与阴影 */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#06b6d4" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 电子围栏多边形 (直接在画面上高亮框出) */}
          {layerVisibility.regions &&
            geofencePolygons.map((fence) => (
              <g key={fence.id}>
                {/* 半透明发光填充多边形 */}
                <polygon
                  points={fence.points}
                  fill={fence.fillColor}
                  stroke={fence.borderColor}
                  strokeWidth="0.6"
                  strokeDasharray={fence.id === 'FENCE-RED-ROAD' ? '1.5 1' : 'none'}
                  style={{
                    filter:
                      fence.id === 'FENCE-PURPLE'
                        ? 'url(#purpleGlow)'
                        : fence.id === 'FENCE-ORANGE'
                        ? 'url(#orangeGlow)'
                        : 'url(#cyanGlow)',
                  }}
                />

                {/* 围栏角落发光顶点 */}
                {fence.points.split(' ').map((p, pIdx) => {
                  const [cx, cy] = p.split(',').map(Number);
                  return (
                    <circle
                      key={pIdx}
                      cx={cx}
                      cy={cy}
                      r="0.8"
                      fill="#ffffff"
                      stroke={fence.borderColor}
                      strokeWidth="0.4"
                    />
                  );
                })}
              </g>
            ))}

          {/* 动态轨迹回放线路 (当点击“查看轨迹回放”时实时绘制发光动效) */}
          {isPlayingTrack && (
            <g id="animated-trajectory">
              <path
                d="M 38 32 L 41 34 L 43 33 L 44 36 L 45 35"
                fill="none"
                stroke="#10b981"
                strokeWidth="0.8"
                strokeDasharray="2 1"
                className="animate-pulse"
              />
              <circle
                cx={38 + (45 - 38) * (trackProgress / 100)}
                cy={32 + (35 - 32) * (trackProgress / 100)}
                r="1.2"
                fill="#34d399"
                stroke="#ffffff"
                strokeWidth="0.4"
              />
            </g>
          )}
        </svg>

        {/* ===================== 地图要素打点 1: 物联网设备监控打点 (带图层与分类筛选) ===================== */}
        {layerVisibility.devices &&
          filteredDevices.map((dev) => {
            const IconComp = dev.icon;
            const isSelected = selectedDevice?.id === dev.id;

            return (
              <div
                key={dev.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDevice(dev);
                  onSelectDeer(null);
                }}
                className="interactive-control absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                style={{ left: `${dev.x}%`, top: `${dev.y}%` }}
              >
                {/* 扩散无线波脉冲 */}
                <div
                  className="absolute -inset-2 rounded-full animate-ping opacity-30 pointer-events-none"
                  style={{ backgroundColor: dev.color }}
                />

                {/* 设备实体圆形图标 (完全参考图1发光设备圆标) */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform shadow-lg ${
                    isSelected ? 'scale-125 ring-2 ring-white' : 'group-hover:scale-115'
                  }`}
                  style={{
                    backgroundColor: dev.color,
                    borderColor: '#ffffff',
                    boxShadow: `0 0 12px ${dev.color}`,
                  }}
                >
                  <IconComp className="w-4 h-4 text-white drop-shadow-xs" />
                </div>

                {/* 设备微标悬浮气泡 */}
                <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-cyan-500/50 shadow-2xl whitespace-nowrap z-40">
                  <div className="font-bold text-cyan-300">{dev.name}</div>
                  <div className="text-slate-300 font-mono text-[9px] mt-0.5">
                    类型: {dev.categoryLabel} | 状态: {dev.status === 'online' ? '● 在线' : '○ 离线'}
                  </div>
                </div>
              </div>
            );
          })}

        {/* ===================== 地图要素打点 2: 鹿只 / 人员 实时位置打点 (完全参考图1) ===================== */}
        {layerVisibility.personnel &&
          deerMarkers.map((deer) => {
            const isSelected = selectedDeer?.id === deer.id || (!selectedDeer && deer.id === 'DEER-001');

            return (
              <div
                key={deer.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDeer(deer as any);
                  setSelectedDevice(null);
                }}
                className={`interactive-control absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-transform ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-120'
                }`}
                style={{ left: `${deer.x}%`, top: `${deer.y}%` }}
              >
                {/* 活跃状态脉冲光晕 */}
                <div
                  className="absolute -inset-2 rounded-full animate-ping opacity-35 pointer-events-none"
                  style={{ backgroundColor: deer.statusColor }}
                />

                {/* 圆形定位图标 (参考图1绿色人员/鹿只小圆标) */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shadow-xl ${
                    isSelected ? 'ring-2 ring-cyan-300 shadow-cyan-500/50' : ''
                  }`}
                  style={{
                    backgroundColor: deer.statusColor,
                    borderColor: '#ffffff',
                    boxShadow: `0 0 10px ${deer.statusColor}`,
                  }}
                >
                  <Activity className="w-4 h-4 text-white drop-shadow-xs" />
                </div>
              </div>
            );
          })}

        {/* ===================== 核心交互弹窗: 鹿只 / 人员 档案详情卡片 (完全复刻参考图1吴凯卡片) ===================== */}
        {activeDeerPopup && !selectedDevice && (
          <div
            className="interactive-control absolute z-50 transition-all duration-200"
            style={{
              left: `${activeDeerPopup.x + 2}%`,
              top: `${Math.max(12, activeDeerPopup.y - 18)}%`,
            }}
          >
            <div className="w-[300px] bg-[#071d24]/95 backdrop-blur-xl rounded-2xl border-2 border-[#14b8a6] shadow-[0_0_25px_rgba(20,184,166,0.35)] p-4 text-white text-xs font-sans select-text">
              {/* 头部：头像/姓名/状态标签/关闭 */}
              <div className="flex items-start justify-between pb-3 border-b border-teal-500/30">
                <div className="flex items-center space-x-2.5">
                  {/* 鹿只头像图标 */}
                  <div className="w-10 h-10 rounded-xl bg-teal-900/60 border border-teal-400 flex items-center justify-center text-teal-300">
                    <Footprints className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white tracking-wide">
                        {activeDeerPopup.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                        style={{ backgroundColor: activeDeerPopup.statusColor }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {activeDeerPopup.statusLabel}
                      </span>
                    </div>
                    <div className="text-[10px] text-teal-200/80 font-mono mt-0.5">
                      耳标号: {activeDeerPopup.earTagId} · {activeDeerPopup.breed}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDeer(null)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 档案属性字段网格 (对标参考图1) */}
              <div className="py-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">所属圈舍:</span>
                  <span className="font-bold text-teal-100">{activeDeerPopup.house}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">当前位置:</span>
                  <span className="font-bold text-cyan-400">{activeDeerPopup.location}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">关联网关:</span>
                  <span className="font-bold text-slate-200">{activeDeerPopup.hostGw}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">终端电量:</span>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${activeDeerPopup.battery}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-emerald-400">
                      {activeDeerPopup.battery}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">信号强度:</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {activeDeerPopup.rssi} dBm ({activeDeerPopup.rssiDesc})
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-teal-500/20">
                  <span className="text-slate-400">皮下实时体温:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      activeDeerPopup.temp >= 39.5 ? 'text-rose-400' : 'text-emerald-300'
                    }`}
                  >
                    {activeDeerPopup.temp} ℃
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">今日运动步数:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {(activeDeerPopup.steps ?? 0).toLocaleString()} 步 ({activeDeerPopup.activeHours || 0}h)
                  </span>
                </div>
              </div>

              {/* 底部功能大按钮 (完全复刻参考图1 “查看轨迹回放”) */}
              <button
                onClick={() => {
                  setIsPlayingTrack(true);
                  setTrackProgress(0);
                }}
                className="w-full mt-1 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-900/50 cursor-pointer transition-all border border-teal-300/40"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isPlayingTrack ? 'animate-spin' : ''}`} />
                <span>{isPlayingTrack ? `轨迹回放中 ${trackProgress}%` : '查看轨迹回放'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== 设备详情弹窗卡片 (当点击物联网设备点位时弹出) ===================== */}
        {selectedDevice && (
          <div
            className="interactive-control absolute z-50 transition-all duration-200"
            style={{
              left: `${selectedDevice.x + 2}%`,
              top: `${Math.max(12, selectedDevice.y - 15)}%`,
            }}
          >
            <div className="w-[280px] bg-[#071d24]/95 backdrop-blur-xl rounded-2xl border-2 border-[#06b6d4] shadow-[0_0_25px_rgba(6,182,212,0.35)] p-4 text-white text-xs font-sans select-text">
              <div className="flex items-start justify-between pb-2.5 border-b border-cyan-500/30">
                <div>
                  <h4 className="font-bold text-cyan-300 text-sm">{selectedDevice.name}</h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    型号: {selectedDevice.model}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDevice(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2.5 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">设备类型:</span>
                  <span className="font-bold text-white">{selectedDevice.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">运行工况:</span>
                  <span className="font-bold text-emerald-400">● 正常在线</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">供电方式:</span>
                  <span className="font-bold text-slate-200">{selectedDevice.power}</span>
                </div>
                {selectedDevice.data && (
                  <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-200 font-mono text-[10px]">
                    {selectedDevice.data}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== 地图悬浮组件 1: 图层与设备分类控制面板 (移至左侧数据区域框边上，完全无重叠) ===================== */}
      {isLayerControlOpen ? (
        <div className="interactive-control absolute top-4 left-[324px] z-40 bg-[#0a1b24]/95 backdrop-blur-md rounded-2xl border border-cyan-500/40 shadow-2xl p-3 w-[190px] text-white select-none transition-all">
          {/* 面板顶栏：标题与折叠按钮 */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>图层与设备控制</span>
            </span>
            <button
              onClick={() => setIsLayerControlOpen(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="收起面板"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab 切换胶囊: 图层控制 vs 设备筛选 */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#06141c] rounded-xl border border-cyan-500/30 mb-2.5 text-[11px] font-bold">
            <button
              onClick={() => setActiveControlTab('layers')}
              className={`py-1 rounded-lg text-center transition-all cursor-pointer ${
                activeControlTab === 'layers'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              图层显隐
            </button>
            <button
              onClick={() => setActiveControlTab('devices')}
              className={`py-1 rounded-lg text-center transition-all cursor-pointer ${
                activeControlTab === 'devices'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              设备筛选
            </button>
          </div>

          {/* 内容 1: 图层显隐控制 */}
          {activeControlTab === 'layers' && (
            <div className="space-y-2 text-xs">
              {/* 鹿只/人员 图层 */}
              <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>鹿只定位点</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.personnel}
                  onChange={(e) =>
                    setLayerVisibility({ ...layerVisibility, personnel: e.target.checked })
                  }
                  className="accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {/* 设备 图层 */}
              <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>物联设备点</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.devices}
                  onChange={(e) =>
                    setLayerVisibility({ ...layerVisibility, devices: e.target.checked })
                  }
                  className="accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {/* 区域 / 围栏 图层 */}
              <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>电子围栏区</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.regions}
                  onChange={(e) =>
                    setLayerVisibility({ ...layerVisibility, regions: e.target.checked })
                  }
                  className="accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {/* 视频摄像头 图层 */}
              <div className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-800/40">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  <span>安防监控点</span>
                </span>
                <input
                  type="checkbox"
                  checked={layerVisibility.cameras}
                  onChange={(e) =>
                    setLayerVisibility({ ...layerVisibility, cameras: e.target.checked })
                  }
                  className="accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 内容 2: 物联设备分类筛选 */}
          {activeControlTab === 'devices' && (
            <div className="space-y-1 text-xs">
              {[
                { key: 'all', label: '全部设备 (512)' },
                { key: 'main_station', label: 'E500测温基站 (218)' },
                { key: 'gas_sensor', label: '气体微气象站 (162)' },
                { key: 'sound_alarm', label: '声光报警器 (132)' },
                { key: 'camera', label: '4MP AI摄像机 (16)' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedDeviceCategory(cat.key)}
                  className={`w-full py-1.5 px-2 rounded-lg text-left transition-colors cursor-pointer text-[11px] ${
                    selectedDeviceCategory === cat.key
                      ? 'bg-cyan-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* 折叠后的小胶囊按钮，紧贴在左侧数据框边上 */
        <button
          onClick={() => setIsLayerControlOpen(true)}
          className="interactive-control absolute top-4 left-[324px] z-40 bg-[#0a1b24]/95 hover:bg-[#0c2432] backdrop-blur-md px-3 py-2 rounded-xl border border-cyan-500/40 shadow-2xl text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:border-cyan-400"
          title="展开图层与设备控制"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>图层控制</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
};
