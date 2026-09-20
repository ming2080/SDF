import React from 'react';
import { FileText, CheckCircle2, Cpu, HardDrive, Layers, Database } from 'lucide-react';

export const ProductSpecs: React.FC = () => {
  return (
    <div className="p-3 md:p-5 max-w-[1920px] mx-auto text-slate-800 space-y-5">
      {/* 头部摘要 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            南平庭春鹿业项目软件与硬件需求清单 100% 映射规格书
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            由资深产品经理严格按照需求清单设计，实现软件一/二级功能严密对应、硬件设备参数完整承载。
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200 font-medium">
            ✓ 软件功能对齐率: 100%
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 font-medium">
            ✓ 硬件参数匹配率: 100%
          </span>
        </div>
      </div>

      {/* 第一部分：软件功能清单对照表 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-2">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-blue-600" /> 表1：软件功能清单与实现对照 (严格按照一、二级功能菜单)
          </span>
          <span className="text-[11px] text-slate-500">4大一级系统 / 16个二级功能全覆盖</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-[11px] text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-4 py-3 w-40">一级模块</th>
                <th className="px-4 py-3 w-44">二级功能</th>
                <th className="px-4 py-3">功能描述 (需求标准)</th>
                <th className="px-4 py-3 w-64">系统落地与交互支撑</th>
                <th className="px-4 py-3 w-28 text-center">满足状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {/* 智慧养殖大数据驾驶舱系统 */}
              <tr className="hover:bg-slate-50">
                <td rowSpan={5} className="px-4 py-3 font-bold text-blue-800 bg-blue-50/40 border-r border-slate-200">
                  智慧养殖大数据驾驶舱系统
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">养殖全景图</td>
                <td className="px-4 py-3 text-slate-600">以地图或流程图形式展示鹿只从入库到转舍的全链路关键节点数据。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">大屏支持GIS交互地图与全生命周期4节点流转全景一键切换</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">实时位置地图</td>
                <td className="px-4 py-3 text-slate-600">在养殖场地图上实时显示佩戴定位项圈/耳标的鹿只位置。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">200个耳标散点高频刷新，支持按发热/发情/圈舍过滤高亮</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">电子围栏设置</td>
                <td className="px-4 py-3 text-slate-600">在地图上绘制安全区域，越界即触发告警。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">支持地图可视化安全边界调节、越界判定与毫秒级报警</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">活动量分析</td>
                <td className="px-4 py-3 text-slate-600">统计鹿只每日步数、运动时长，评估健康与发情体温状态。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">多时段步数柱状图、发情激增评估、倦怠发热低位识别</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">物联网设备状态监控</td>
                <td className="px-4 py-3 text-slate-600">展示在线设备数量、离线报警、电池电量、信号强度等设备运维数据。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">236台套设备状态全息监控、14台主机100%在网感知</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>

              {/* 基础信息管理系统 */}
              <tr className="hover:bg-slate-50">
                <td rowSpan={2} className="px-4 py-3 font-bold text-amber-800 bg-amber-50/40 border-r border-slate-200">
                  基础信息管理系统
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">鹿只入库管理</td>
                <td className="px-4 py-3 text-slate-600">支持单个或批量录入新购/新生鹿只信息，生成唯一电子档案。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">支持单只精细建档与1-50只批量入库，自动绑定E501-R1耳标</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">转舍/调群管理</td>
                <td className="px-4 py-3 text-slate-600">记录鹿只在不同鹿舍或群体间的转移记录，更新位置信息。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">联动900t/s通道门禁识读，形成全链路流转台账并实时同步</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>

              {/* 物联网设备管理系统 */}
              <tr className="hover:bg-slate-50">
                <td rowSpan={5} className="px-4 py-3 font-bold text-indigo-800 bg-indigo-50/40 border-r border-slate-200">
                  物联网设备管理系统
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">环境设备管理</td>
                <td className="px-4 py-3 text-slate-600">展示基地名称、圈舍名称、设备编号、传感器名称、设备类型、机位号。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">精准匹配全部6项字段规范，支持自检与状态联动</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">可视化设备管理</td>
                <td className="px-4 py-3 text-slate-600">展示序号、基地名称、圈舍名称、设备编号、传感器名称、设备类型、机位号。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">16台4MP摄像机台账全量匹配，支持分辨率/帧率展示</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">PDA设备管理</td>
                <td className="px-4 py-3 text-slate-600">展示PDA编号、所属基地名称、所属养殖场、所属圈舍名称、设备类型。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">超高频手持机电量监控、巡检状态及责任人关联</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">耳标设备管理</td>
                <td className="px-4 py-3 text-slate-600">展示各耳标编号、基地名称、圈舍名称、设备类型。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">200套皮下测温计步耳标台账，测温精度±0.1℃</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">其他设备管理</td>
                <td className="px-4 py-3 text-slate-600">展示设备编号、基地名称、圈舍名称、设备类型。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">14台测温主机与1台900t/s通道识读器网络参数管理</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>

              {/* 物联网数据管理系统 */}
              <tr className="hover:bg-slate-50">
                <td rowSpan={5} className="px-4 py-3 font-bold text-cyan-800 bg-cyan-50/40 border-r border-slate-200">
                  物联网数据管理系统
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">环境数据管理</td>
                <td className="px-4 py-3 text-slate-600">列表展示温度、湿度、氨气、氮气、硫化氢、二氧化碳数据。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">六合一传感器数据高频展示，超标数值自动红字警示</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">可视化数据管理</td>
                <td className="px-4 py-3 text-slate-600">展示包含设备信息及视频直播数据。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">内嵌RTSP流播放器视窗与AI视频识别目标框（98.2%）</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">PDA数据管理</td>
                <td className="px-4 py-3 text-slate-600">展示经办人、所更改业务数据（支持按经办人模糊搜索）。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">PDA巡检与用药修改记录毫秒级审计，支持搜索</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">耳标数据管理</td>
                <td className="px-4 py-3 text-slate-600">展示皮下测温、计步数据及基站三角定位位置数据。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">体温、步数、坐标三角定位三位一体时序呈现</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">其他设备数据管理</td>
                <td className="px-4 py-3 text-slate-600">展示设备遥测与交互数据。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">测温主机心跳数据与通道通过流水审计</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>

              {/* 告警信息管理系统 */}
              <tr className="hover:bg-slate-50">
                <td rowSpan={4} className="px-4 py-3 font-bold text-rose-800 bg-rose-50/40 border-r border-slate-200">
                  告警信息管理系统
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">告警规则管理</td>
                <td className="px-4 py-3 text-slate-600">自定义告警触发条件（如体温&gt;39.8℃、有害气体超标）。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">可视化滑块阈值微调、开关启用及通知角色绑定</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">异常行为识别</td>
                <td className="px-4 py-3 text-slate-600">基于视频AI识别打斗、跌倒、发情行为等。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">种公鹿打斗(98.4%)、发情爬跨(96.5%)、倒地不起检测</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">告警推送中心</td>
                <td className="px-4 py-3 text-slate-600">支持APP、短信、微信等多渠道分级推送。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">Socket APP强推、紧急SMS短息兜底、企业微信模板消息</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold text-slate-900">告警处理反馈</td>
                <td className="px-4 py-3 text-slate-600">记录告警确认人、处理措施及处理结果，形成闭环。</td>
                <td className="px-4 py-3 text-blue-700 text-[11px]">全流程处置模态弹窗、措施记录与100%闭环状态归档</td>
                <td className="px-4 py-3 text-center text-emerald-700 font-bold">✓ 100% 满足</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 第二部分：硬件设备配置清单对照 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-2">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-600" /> 表2：硬件设备采购清单与技术参数承载表
          </span>
          <span className="text-[11px] text-slate-500">6类关键硬件 / 236台套全部在网运行</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-[11px] text-slate-600 uppercase tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-4 py-3">序号</th>
                <th className="px-4 py-3">设备品名</th>
                <th className="px-4 py-3">型号/规格</th>
                <th className="px-4 py-3">配置数量</th>
                <th className="px-4 py-3">关键技术指标与参数要求</th>
                <th className="px-4 py-3">现场部署及系统接入点</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400 font-sans">1</td>
                <td className="px-4 py-3 font-bold text-slate-900 font-sans">云服务器 (应用/数据中心)</td>
                <td className="px-4 py-3 text-blue-700">8vCPU / 16GiB</td>
                <td className="px-4 py-3 font-bold text-slate-900">1 台</td>
                <td className="px-4 py-3 font-sans text-slate-600">20M 峰值带宽，百G时序数据库，高并发微服务集群</td>
                <td className="px-4 py-3 font-sans text-slate-600">公有云核心中心节点</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400 font-sans">2</td>
                <td className="px-4 py-3 font-bold text-slate-900 font-sans">智能网关</td>
                <td className="px-4 py-3 text-blue-700">GW-IND-2026</td>
                <td className="px-4 py-3 font-bold text-slate-900">1 台</td>
                <td className="px-4 py-3 font-sans text-slate-600">多协议转换(MQTT/Modbus)，工业级宽温防雷，断网续传</td>
                <td className="px-4 py-3 font-sans text-slate-600">南平庭春鹿业监控弱电总机房</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400 font-sans">3</td>
                <td className="px-4 py-3 font-bold text-slate-900 font-sans">测温主机 (边缘计算节点)</td>
                <td className="px-4 py-3 text-blue-700">HOST-EDGE-4G</td>
                <td className="px-4 py-3 font-bold text-slate-900">14 台</td>
                <td className="px-4 py-3 font-sans text-slate-600">4G全网通回传，蓝牙5.2网状透传，内置皮下体温滤波算法</td>
                <td className="px-4 py-3 font-sans text-slate-600">14栋鹿舍各安装1台</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400 font-sans">4</td>
                <td className="px-4 py-3 font-bold text-slate-900 font-sans">通道式超高频识读器</td>
                <td className="px-4 py-3 text-blue-700">RFID-PASS-4CH</td>
                <td className="px-4 py-3 font-bold text-slate-900">1 台</td>
                <td className="px-4 py-3 font-sans text-slate-600">识读速度 ≥ 900张/秒，4通道天线阵列，多标签防冲撞</td>
                <td className="px-4 py-3 font-sans text-slate-600">调群转舍主通道出入口</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400 font-sans">5</td>
                <td className="px-4 py-3 font-bold text-slate-900 font-sans">手持机 (PDA终端)</td>
                <td className="px-4 py-3 text-blue-700">PDA-UHF-840</td>
                <td className="px-4 py-3 font-bold text-slate-900">1 台</td>
                <td className="px-4 py-3 font-sans text-slate-600">840-960MHz，4000mAh大电池，带物理手柄与条码引擎</td>
                <td className="px-4 py-3 font-sans text-slate-600">现场兽医与巡检员携带</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-400 font-sans">6</td>
                <td className="px-4 py-3 font-bold text-slate-900 font-sans">测温计步耳标 (智能终端)</td>
                <td className="px-4 py-3 text-blue-700">E501-R1</td>
                <td className="px-4 py-3 font-bold text-slate-900">200 套</td>
                <td className="px-4 py-3 font-sans text-slate-600">测温精度 ±0.1℃，3轴计步，双向UHF RFID，电池续航 &gt; 20个月</td>
                <td className="px-4 py-3 font-sans text-slate-600">佩戴于200头种鹿与核心鹿</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
