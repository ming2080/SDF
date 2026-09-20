import React, { useState } from 'react';
import { SensorDataRecord } from '../../types/deer';
import { Search, Download, Video, Radio, Activity, Eye, Play, Sparkles } from 'lucide-react';

interface IotDataManagerProps {
  subTab: 'env' | 'video' | 'pda' | 'tag' | 'other';
  sensorData: {
    env: SensorDataRecord[];
    video: SensorDataRecord[];
    pda: SensorDataRecord[];
    tag: SensorDataRecord[];
    other: SensorDataRecord[];
  };
}

export const IotDataManager: React.FC<IotDataManagerProps> = ({ subTab, sensorData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideoStream, setSelectedVideoStream] = useState<SensorDataRecord | null>(sensorData.video[0] || null);

  const currentDataList = sensorData[subTab] || [];
  const filteredData = currentDataList.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.houseName.toLowerCase().includes(term) ||
      item.deviceCode.toLowerCase().includes(term) ||
      item.deviceName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* 顶部工具栏 */}
      <div className="bg-white p-4 rounded-xl border border-[#d6e4db] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索圈舍/设备编号/传感器名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#f6faf7] border border-[#d6e4db] text-xs text-slate-800 pl-9 pr-3 py-1.5 rounded-lg w-72 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors"
            />
          </div>
          <span className="text-xs text-slate-500">
            时序遥测记录: <strong className="text-emerald-700 font-mono font-bold">{filteredData.length}</strong> 条
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button className="px-3 py-1.5 bg-[#f6faf7] hover:bg-[#ebf3ee] text-slate-700 rounded-lg flex items-center gap-1.5 border border-[#d6e4db] transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>导出时序遥测CSV</span>
          </button>
        </div>
      </div>

      {/* 1. 环境数据管理 */}
      {subTab === 'env' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
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
                  <th className="px-4 py-3">温度 (℃)</th>
                  <th className="px-4 py-3">湿度 (%)</th>
                  <th className="px-4 py-3">氨气 (ppm)</th>
                  <th className="px-4 py-3">氮气 (%)</th>
                  <th className="px-4 py-3">硫化氢 (ppm)</th>
                  <th className="px-4 py-3">二氧化碳 (ppm)</th>
                  <th className="px-4 py-3">采集时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-sans">{row.seq}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.baseName}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900">{row.houseName}</td>
                    <td className="px-4 py-3 font-bold text-blue-700">{row.deviceCode}</td>
                    <td className="px-4 py-3 font-sans text-slate-800">{row.deviceName}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.deviceType}</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">{row.temp} ℃</td>
                    <td className="px-4 py-3 text-blue-700">{row.humidity} %</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${(row.nh3 || 0) > 15 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {row.nh3}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{row.n2} %</td>
                    <td className="px-4 py-3 text-slate-600">{row.h2s}</td>
                    <td className="px-4 py-3 text-slate-600">{row.co2}</td>
                    <td className="px-4 py-3 text-slate-400">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. 可视化数据管理 */}
      {subTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧：列表 */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">网络摄像机视频流清单</span>
              <span className="text-[11px] text-blue-600">点击查看右侧实时画面</span>
            </div>
            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5">序号</th>
                    <th className="px-3 py-2.5">基地名称</th>
                    <th className="px-3 py-2.5">圈舍名称</th>
                    <th className="px-3 py-2.5">设备编号</th>
                    <th className="px-3 py-2.5">传感器名称</th>
                    <th className="px-3 py-2.5">设备类型</th>
                    <th className="px-3 py-2.5">视频流地址</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredData.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedVideoStream(row)}
                      className={`cursor-pointer transition-colors ${
                        selectedVideoStream?.id === row.id ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-3 py-2 text-slate-400 font-sans">{row.seq}</td>
                      <td className="px-3 py-2 font-sans text-slate-600">{row.baseName}</td>
                      <td className="px-3 py-2 font-sans text-slate-900">{row.houseName}</td>
                      <td className="px-3 py-2 text-indigo-700 font-bold">{row.deviceCode}</td>
                      <td className="px-3 py-2 font-sans">{row.deviceName}</td>
                      <td className="px-3 py-2 font-sans text-[11px] text-slate-500">{row.deviceType}</td>
                      <td className="px-3 py-2 text-blue-600 truncate max-w-[160px]">{row.streamUrl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右侧：播放器 & AI智能识别叠层 */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-slate-900">{selectedVideoStream?.deviceName || '1号舍高清监控球机'}</span>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  2560×1440 @30fps H.265
                </span>
              </div>

              {/* 拟真视频视窗 */}
              <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center group">
                <div className="text-center text-slate-400 space-y-2">
                  <Video className="w-10 h-10 text-blue-400 mx-auto" />
                  <div className="text-xs font-mono text-slate-300">
                    RTSP: {selectedVideoStream?.deviceCode}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    ● 边缘AI视频分析引擎实时识别中 (打斗/发情/倒地)
                  </div>
                </div>

                {/* 模拟AI识别目标检测框 */}
                <div className="absolute left-[20%] top-[30%] w-28 h-20 border-2 border-blue-400 rounded bg-blue-500/10 flex flex-col justify-between p-1">
                  <span className="text-[9px] bg-blue-900 text-white px-1 rounded self-start font-mono">
                    鹿只:0001 (98.2%)
                  </span>
                  <span className="text-[8px] text-blue-200 font-mono">状态: 采食</span>
                </div>

                <div className="absolute right-[22%] top-[40%] w-28 h-20 border-2 border-amber-400 rounded bg-amber-500/10 flex flex-col justify-between p-1">
                  <span className="text-[9px] bg-amber-900 text-white px-1 rounded self-start font-mono">
                    母鹿:0060 (爬跨 96.5%)
                  </span>
                  <span className="text-[8px] text-amber-200 font-mono">触发行为告警</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
              <span>推流延迟: <strong className="text-emerald-700 font-mono">18ms</strong></span>
              <span>双光夜视模式</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. PDA 数据管理 */}
      {subTab === 'pda' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">序号</th>
                  <th className="px-4 py-3">基地名称</th>
                  <th className="px-4 py-3">圈舍名称</th>
                  <th className="px-4 py-3">设备编号</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">操作经办人</th>
                  <th className="px-4 py-3">所更改业务数据 (巡检/称重/用药/调舍)</th>
                  <th className="px-4 py-3">同步时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-sans">{row.seq}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.baseName}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900">{row.houseName}</td>
                    <td className="px-4 py-3 font-bold text-amber-700">{row.deviceCode}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.deviceType}</td>
                    <td className="px-4 py-3 font-sans text-blue-700 font-medium">{row.pdaOperator}</td>
                    <td className="px-4 py-3 font-sans text-slate-800">{row.pdaChangedData}</td>
                    <td className="px-4 py-3 text-slate-400">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. 耳标数据管理 */}
      {subTab === 'tag' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
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
                  <th className="px-4 py-3">皮下测温数据</th>
                  <th className="px-4 py-3">计步数据</th>
                  <th className="px-4 py-3">基站三角定位位置数据</th>
                  <th className="px-4 py-3">上报时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-sans">{row.seq}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.baseName}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900">{row.houseName}</td>
                    <td className="px-4 py-3 font-bold text-blue-700">{row.deviceCode}</td>
                    <td className="px-4 py-3 font-sans text-slate-800">{row.deviceName}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.deviceType}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${(row.earTagTemp || 0) >= 39.8 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {row.earTagTemp} ℃
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-700 font-bold">{(row.earTagSteps ?? 0).toLocaleString()} 步</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.earTagLocation}</td>
                    <td className="px-4 py-3 text-slate-400">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. 其他设备数据管理 */}
      {subTab === 'other' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">序号</th>
                  <th className="px-4 py-3">基地名称</th>
                  <th className="px-4 py-3">圈舍名称</th>
                  <th className="px-4 py-3">设备类型</th>
                  <th className="px-4 py-3">设备遥测与交互数据</th>
                  <th className="px-4 py-3">上报时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-sans">{row.seq}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.baseName}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900">{row.houseName}</td>
                    <td className="px-4 py-3 font-sans text-blue-700 font-medium">{row.deviceType}</td>
                    <td className="px-4 py-3 font-sans text-slate-800">{row.otherData}</td>
                    <td className="px-4 py-3 text-slate-400">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
