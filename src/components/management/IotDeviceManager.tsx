import React, { useState } from 'react';
import { DeviceInfo } from '../../types/deer';
import { Search, Radio, Video, Smartphone, Tag, Layers, CheckCircle2, AlertCircle, RefreshCw, Plus, Settings } from 'lucide-react';

interface IotDeviceManagerProps {
  subTab: 'env' | 'video' | 'pda' | 'tag' | 'other';
  devices: DeviceInfo[];
}

export const IotDeviceManager: React.FC<IotDeviceManagerProps> = ({ subTab, devices }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 根据子Tab过滤设备列表
  const categoryMap = {
    env: '环境设备' as const,
    video: '可视化设备' as const,
    pda: 'PDA设备' as const,
    tag: '耳标设备' as const,
    other: '其他设备' as const,
  };

  const currentCategory = categoryMap[subTab];
  const filteredDevices = devices.filter((d) => {
    const matchCat = d.category === currentCategory;
    const matchSearch = d.code.includes(searchTerm) || d.name.includes(searchTerm) || d.houseName.includes(searchTerm);
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* 顶部过滤与统计栏 */}
      <div className="bg-white p-4 rounded-xl border border-[#d6e4db] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`搜索${currentCategory}编号/圈舍/机位号...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f6faf7] border border-[#d6e4db] text-xs text-slate-800 pl-9 pr-3 py-1.5 rounded-lg w-72 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
            />
          </div>
          <span className="text-xs text-slate-500">
            在网设备: <strong className="text-emerald-700 font-mono font-bold">{filteredDevices.length}</strong> 台套
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button className="px-3 py-1.5 bg-[#f6faf7] hover:bg-[#ebf3ee] text-slate-700 rounded-lg flex items-center gap-1.5 border border-[#d6e4db] transition-colors cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
            <span>实时自检与心跳轮询</span>
          </button>
        </div>
      </div>

      {/* 数据列表 */}
      <div className="bg-white rounded-xl border border-[#d6e4db] overflow-hidden shadow-xs">
        {/* 1. 环境设备 */}
        {subTab === 'env' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">序号</th>
                  <th className="px-4 py-3">基地名称</th>
                  <th className="px-4 py-3">圈舍名称</th>
                  <th className="px-4 py-3">设备编号</th>
                  <th className="px-4 py-3">传感器名称</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">机位号</th>
                  <th className="px-4 py-3">通信状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredDevices.map((dev, idx) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-sans">{idx + 1}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.baseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">{dev.houseName}</td>
                    <td className="px-4 py-3 font-bold text-blue-700">{dev.code}</td>
                    <td className="px-4 py-3 font-sans text-slate-800">{dev.name}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.type}</td>
                    <td className="px-4 py-3 text-amber-700">{dev.slotNo || '-'}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className={`flex items-center gap-1.5 ${dev.status === 'online' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        <span className={`w-2 h-2 rounded-full ${dev.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {dev.status === 'online' ? '正常在线' : '告警'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. 可视化设备 */}
        {subTab === 'video' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">序号</th>
                  <th className="px-4 py-3">基地名称</th>
                  <th className="px-4 py-3">圈舍名称</th>
                  <th className="px-4 py-3">设备编号</th>
                  <th className="px-4 py-3">传感器/摄像机名称</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">机位号</th>
                  <th className="px-4 py-3">分辨率/帧率</th>
                  <th className="px-4 py-3">运行状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredDevices.map((dev, idx) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-sans">{idx + 1}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.baseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">{dev.houseName}</td>
                    <td className="px-4 py-3 font-bold text-indigo-700">{dev.code}</td>
                    <td className="px-4 py-3 font-sans text-slate-800">{dev.name}</td>
                    <td className="px-4 py-3 font-sans text-[11px] text-slate-500">{dev.type}</td>
                    <td className="px-4 py-3 text-blue-700">{dev.slotNo}</td>
                    <td className="px-4 py-3 text-slate-600">2560×1440 @30fps</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 实时推流中
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. PDA 设备 */}
        {subTab === 'pda' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">PDA 编号</th>
                  <th className="px-4 py-3">所属基地名称</th>
                  <th className="px-4 py-3">所属养殖场</th>
                  <th className="px-4 py-3">所属圈舍名称</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">电池电量</th>
                  <th className="px-4 py-3">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-amber-700">{dev.code}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.baseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">南平庭春鹿业一分场</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">{dev.houseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.type}</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{dev.battery}% (4000mAh)</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 巡检作业中
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. 耳标设备 */}
        {subTab === 'tag' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">耳标编号 (RFID)</th>
                  <th className="px-4 py-3">基地名称</th>
                  <th className="px-4 py-3">圈舍名称</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">测温精度</th>
                  <th className="px-4 py-3">电池续航</th>
                  <th className="px-4 py-3">通信状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-blue-700">{dev.code}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.baseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">{dev.houseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.type}</td>
                    <td className="px-4 py-3 text-emerald-700">±0.1℃</td>
                    <td className="px-4 py-3 text-slate-600">20个月 (内置纽扣电池)</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <Radio className="w-3.5 h-3.5 text-blue-600" /> 5分钟/次 上报
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. 其他设备 */}
        {subTab === 'other' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">设备编号</th>
                  <th className="px-4 py-3">基地名称</th>
                  <th className="px-4 py-3">圈舍名称</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">网络/通信方式</th>
                  <th className="px-4 py-3">工作状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-blue-700">{dev.code}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.baseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">{dev.houseName}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{dev.type}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {dev.code.includes('HOST') ? '4G全网通 + 蓝牙5.2 + GNSS' : '4路SMA外接天线 UHF'}
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 正常运行 (OTA支持)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
