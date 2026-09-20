import React, { useState } from 'react';
import {
  GitFork,
  Layers,
  Cpu,
  Radio,
  Video,
  Smartphone,
  Database,
  Cloud,
  ShieldCheck,
  Zap,
  ArrowRight,
  Server,
  Workflow,
  CheckCircle2,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const SystemTopology: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'workflow'>('topology');

  return (
    <div className="p-3 md:p-5 max-w-[1920px] mx-auto text-slate-800 space-y-4">
      {/* 顶部切换导航 */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'topology'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-4 h-4" />
            <span>端-边-云系统逻辑拓扑架构图</span>
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'workflow'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>核心业务交互操作引导流程图</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-600 flex items-center gap-2">
          <span>吞吐承载: <strong className="text-blue-700">10,000+ TPS</strong></span>
          <span>•</span>
          <span>端边协同延迟: <strong className="text-emerald-700">&lt; 20ms</strong></span>
        </div>
      </div>

      {/* 视图1：端-边-云系统逻辑拓扑架构图 */}
      {activeTab === 'topology' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">南平庭春鹿业端-边-云协同三层系统架构</h3>
            <p className="text-xs text-slate-500">
              通过感知终端低功耗采集、本地边缘节点毫秒级AI计算与过滤、云端平台大数据聚合与智能决策，保障高并发与低延迟。
            </p>
          </div>

          <div className="space-y-4">
            {/* 1. 云端数据与应用层 */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 shadow-xs space-y-2 relative">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-900">
                    【云端平台层】云服务器 (8vCPU / 16GiB / 20M 带宽)
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  分布式微服务 / 时序数据库 / 规则引擎
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">大数据驾驶舱</div>
                  <div className="text-[11px] text-slate-500">全景图 / 实时地图 / 电子围栏 / 决策建议</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">业务管理中台</div>
                  <div className="text-[11px] text-slate-500">鹿只入库建档 / 调群转舍 / 电子档案生命周期</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">时序数据与物联中心</div>
                  <div className="text-[11px] text-slate-500">环境/视频/PDA/耳标数据存储与高并发处理</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">智能告警推送中心</div>
                  <div className="text-[11px] text-slate-500">规则引擎 / APP强推 / 微信服务号 / 短信SMS</div>
                </div>
              </div>
            </div>

            {/* 连接管道 1 */}
            <div className="flex justify-center items-center py-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-blue-700 bg-slate-50 px-4 py-1 rounded-full border border-slate-200">
                <span>▲ MQTT / HTTPS 安全加密通道 (双向时序心跳与OTA下发) ▼</span>
              </div>
            </div>

            {/* 2. 边缘计算与网络汇聚层 */}
            <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4 shadow-xs space-y-2 relative">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-950">
                    【本地边缘计算节点】边缘AI测温主机 (14台) + 智能网关 (1台)
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                  边缘推理 15TOPS / 4G+BLE5.2双模 / 本地数据缓存
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>14台 边缘测温主机</span>
                    <span className="text-[10px] text-blue-600 font-mono">14栋圈舍各1台</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    4G/以太网回传，皮下温度滤波计算，蓝牙网状组网并发轮询。
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>边缘AI视频结构化引擎</span>
                    <span className="text-[10px] text-indigo-600 font-mono">16路4MP流</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    本地运行打斗/跌倒/发情检测模型，输出告警切片，降低云端带宽90%。
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>通道式超高频识读网关</span>
                    <span className="text-[10px] text-amber-600 font-mono">900张/秒</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    通道天线阵列，支持群体高速通过防冲突读取，自动触发转舍事件。
                  </div>
                </div>
              </div>
            </div>

            {/* 连接管道 2 */}
            <div className="flex justify-center items-center py-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-indigo-700 bg-slate-50 px-4 py-1 rounded-full border border-slate-200">
                <span>▲ BLE 5.2 / UHF RFID 900MHz / RS485 Modbus / RTSP ▼</span>
              </div>
            </div>

            {/* 3. 感知终端与执行设备层 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 relative">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">
                    【现场感知与执行终端】低功耗智能物联硬件
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  毫秒级采集 / ±0.1℃测温精度 / 超长续航
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-600" />
                    <span>智能测温计步耳标</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    E501-R1 皮下接触测温 + 3轴计步，双向UHF RFID，电池续航&gt;20月。
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>4MP AI监控摄像机 (16台)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    2560×1440分辨率，H.265编码，星光级双光夜视补光，全天候全景监控。
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>超高频PDA手持机 (1台)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    840~960MHz多频段，4000mAh大电池，现场秒级盘点与调舍登记。
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>六合一环境变送器 (14套)</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    实时监测温湿度、NH3、N2、H2S及CO2，Modbus工业级防腐总线。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 视图2：核心业务交互操作引导流程图 */}
      {activeTab === 'workflow' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-900">短平快交互引导流程与操作闭环</h3>
            <p className="text-xs text-slate-500">
              专为养殖一线场景优化操作路径，确保“发现异常-触达通知-现场核验-处置闭环”全流程不超过3步。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 流程 1: 疾病发热早期预警处置闭环 */}
            <div className="bg-slate-50 border border-rose-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-rose-200">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-bold text-rose-900 text-xs">疾病发热早期预警处置闭环</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 1: 实时超温检出</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    E501-R1耳标测得皮下体温连续2次≥39.8℃，边缘主机过滤确认后触发。
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 2: 秒级分级强推</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    云端规则引擎分发：APP强震动提醒 + 驻场兽医短信SMS + 微信卡片。
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 3: 现场核验与隔离</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    兽医点开通知一键导航至圈舍，PDA扫耳标核对用药并登记转入隔离舍。
                  </p>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-200 text-emerald-800">
                  <span className="font-bold">✓ 闭环结果:</span> 电子档案自动归档病历，体温恢复后一键解除。
                </div>
              </div>
            </div>

            {/* 流程 2: 鹿只快速入库与耳标自动绑定 */}
            <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-blue-200">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-bold text-blue-900 text-xs">新鹿入库建档与耳标秒级绑定</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 1: 扫码/录入基本信息</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    管理端/PDA录入品种、性别、月龄，或通过Excel模板批量一键导入。
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 2: 自动分配RFID耳标</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    系统顺序分配E501-R1耳标ID与900MHz UHF UID，下发至本地测温主机。
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 3: 分配初始圈舍</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    圈舍容量与环境传感器自动关联，大屏地图即时点亮新增鹿只节点。
                  </p>
                </div>
                <div className="bg-blue-50 p-2 rounded border border-blue-200 text-blue-800">
                  <span className="font-bold">✓ 闭环结果:</span> 生成终身电子档案，全生命周期可溯源。
                </div>
              </div>
            </div>

            {/* 流程 3: 通道式自动调群与转舍记录 */}
            <div className="bg-slate-50 border border-amber-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-amber-200">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-bold text-amber-900 text-xs">通道式自动转舍与履历台账</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 1: 发起转舍指令</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    养殖主管在大屏或管理端登记转群原因（配种/断奶/隔离）与目标舍位。
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 2: 通道识读器过门感应</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    鹿群经过转舍通道，RFID-PASS-4CH以900张/秒速度非接触全量识读。
                  </p>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900">Step 3: 状态即时更新</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    圈舍在栏数量、分布地图与测温主机通信信道自动完成无缝重定向。
                  </p>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-200 text-amber-800">
                  <span className="font-bold">✓ 闭环结果:</span> 生成防篡改流转履历，实现无纸化调群。
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
