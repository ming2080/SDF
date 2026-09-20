import React, { useState } from 'react';
import { AlarmItem, AlarmRule } from '../../types/deer';
import { ShieldAlert, Video, BellRing, CheckCircle2, Sliders, Smartphone, MessageSquare, Send, Check, AlertTriangle, Eye, Flame, RotateCcw } from 'lucide-react';

interface AlarmManagerProps {
  subTab: 'rules' | 'behavior' | 'push' | 'feedback';
  rules: AlarmRule[];
  alarms: AlarmItem[];
  onUpdateRule: (rule: AlarmRule) => void;
  onAddAlarm: (alarm: Omit<AlarmItem, 'id'>) => void;
  onResolveAlarm: (alarmId: string, handler: string, action: string, result: string) => void;
}

export const AlarmManager: React.FC<AlarmManagerProps> = ({
  subTab,
  rules,
  alarms,
  onUpdateRule,
  onAddAlarm,
  onResolveAlarm,
}) => {
  const [selectedAlarmForModal, setSelectedAlarmForModal] = useState<AlarmItem | null>(null);
  const [handleForm, setHandleForm] = useState({
    handler: '李兽医 (工号: 0806)',
    handleAction: '已到场查验，肌注安乃近退热剂，并补充电解质水',
    handleResult: '体温已由40.2℃降至38.9℃，食欲恢复，解除隔离警戒',
  });

  // 模拟AI异常行为触发
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  const handleSimulateAI = (behaviorType: '打斗' | '发情' | '跌倒') => {
    setIsSimulatingAI(true);
    setTimeout(() => {
      onAddAlarm({
        title: `AI视频检测到[${behaviorType}]异常行为`,
        level: behaviorType === '打斗' ? 'CRITICAL' : 'WARNING',
        sourceType: '异常行为',
        houseName: '1号特级种公鹿舍',
        deerTagId: 'E501-R1-0008',
        description: `边缘AI计算节点通过摄像机CAM-02识别到鹿群${behaviorType}行为，置信度97.8%，已自动捕获15秒证据切片并分级推送。`,
        occurredTime: new Date().toLocaleTimeString(),
        status: 'pending',
        channel: ['APP', 'WECHAT', 'SMS'],
      });
      setIsSimulatingAI(false);
    }, 600);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlarmForModal) {
      onResolveAlarm(
        selectedAlarmForModal.id,
        handleForm.handler,
        handleForm.handleAction,
        handleForm.handleResult
      );
      setSelectedAlarmForModal(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. 告警规则引擎 */}
      {subTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#d6e4db] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-700" /> 智能告警规则引擎与阈值自定义
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                支持对皮下体温、日活动量、有害气体(NH3/H2S/CO2)及电子围栏等指标进行动态规则评估。
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 font-semibold">
              规则引擎活跃度: 8/8 全天候生效
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white border border-[#d6e4db] hover:border-emerald-300 rounded-xl p-4 transition-all shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-emerald-700 font-bold">{rule.id}</span>
                      <h5 className="text-sm font-bold text-slate-900">{rule.name}</h5>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 inline-block">
                      分类: {rule.category} • 指标: {rule.metric}
                    </span>
                  </div>

                  {/* 启停切换 */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => onUpdateRule({ ...rule, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 阈值滑块交互调优 */}
                <div className="bg-[#f6faf7] p-3 rounded-lg border border-[#d6e4db] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">判定条件:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {rule.operator} {Array.isArray(rule.threshold) ? rule.threshold.join('~') : rule.threshold} {rule.unit}
                    </span>
                  </div>

                  {!Array.isArray(rule.threshold) && (
                    <input
                      type="range"
                      min={rule.unit === '℃' ? 37 : rule.unit === 'ppm' ? 5 : 1000}
                      max={rule.unit === '℃' ? 42 : rule.unit === 'ppm' ? 30 : 15000}
                      step={rule.unit === '℃' ? 0.1 : rule.unit === 'ppm' ? 0.5 : 500}
                      value={rule.threshold}
                      onChange={(e) => onUpdateRule({ ...rule, threshold: Number(e.target.value) })}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  )}
                </div>

                {/* 推送渠道与责任人 */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500">渠道:</span>
                    {rule.pushChannels.map((ch) => (
                      <span key={ch} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                        {ch}
                      </span>
                    ))}
                  </div>

                  <span className="text-slate-500">
                    通知: {rule.notifyRoles.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 异常行为识别 */}
      {subTab === 'behavior' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" /> 边缘AI视频异常行为识别工作台
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                基于16路4MP AI网络摄像机，边缘端内置深度学习模型，精准识别打斗撞角、倒地不起、发情爬跨等动作。
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSimulateAI('打斗')}
                disabled={isSimulatingAI}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
              >
                模拟打斗识别
              </button>
              <button
                onClick={() => handleSimulateAI('发情')}
                disabled={isSimulatingAI}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold transition-colors"
              >
                模拟发情识别
              </button>
              <button
                onClick={() => handleSimulateAI('跌倒')}
                disabled={isSimulatingAI}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
              >
                模拟跌倒异常
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 行为分类1：打斗撞角 */}
            <div className="bg-white border border-rose-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-800 text-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> 种公鹿激烈打斗识别
                </span>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-medium">
                  AI算法模型 v3.2
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                利用骨骼关键点与角部撞击动力学，识别两头以上公鹿角部对抗持续超过30秒的攻击行为，保护高价值鹿茸免受撞损。
              </p>
              <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1 font-mono border border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>识别准确率:</span>
                  <span className="text-emerald-700 font-bold">98.4%</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>联动响应:</span>
                  <span className="text-blue-700 font-semibold">声光驱离 + APP告警</span>
                </div>
              </div>
            </div>

            {/* 行为分类2：发情爬跨 */}
            <div className="bg-white border border-amber-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-800 text-sm flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" /> 母鹿发情爬跨行为
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-medium">
                  多模态融合判定
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                结合计步耳标活动量激增(超日常200%)与摄像头拍摄到的频繁嗅闻、爬跨、静立反射姿态，输出发情评分与配种黄金期。
              </p>
              <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1 font-mono border border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>多模态置信度:</span>
                  <span className="text-emerald-700 font-bold">96.5%</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>受胎率提升:</span>
                  <span className="text-amber-700 font-semibold">+18%</span>
                </div>
              </div>
            </div>

            {/* 行为分类3：跌倒不起与倦怠 */}
            <div className="bg-white border border-blue-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-800 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-blue-600" /> 倒地不起与长时间未进食
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-medium">
                  时序状态机
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                鹿只连续卧倒超过4小时或超过12小时未出现在采食槽热度区，自动判定为重度疾病或难产风险，立即呼叫驻场兽医。
              </p>
              <div className="bg-slate-50 p-2.5 rounded text-xs space-y-1 font-mono border border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>超时阈值:</span>
                  <span className="text-blue-700 font-bold">&gt; 240 分钟</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>推送级别:</span>
                  <span className="text-rose-700 font-bold">CRITICAL 强提醒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 告警推送中心 */}
      {subTab === 'push' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BellRing className="w-4 h-4 text-blue-600" /> 告警分级多渠道统一推送中心
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                支持移动端APP推送、手机短信(SMS)、微信服务号模板消息分级协同下发，确保100%必达。
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>多通道网关下发成功率: 99.98%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 渠道1: 移动端APP强推送 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h5 className="font-bold text-slate-900 text-sm">移动端监控APP推送</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                全天候Socket长连接与手机系统级推送通道，支持紧急告警震动+警报音强提醒，点击直接打开一键处置工单。
              </p>
              <div className="text-[11px] text-emerald-700 font-mono bg-emerald-50 p-2 rounded border border-emerald-100">
                ● 延迟: &lt; 200ms | 状态: 连接活跃
              </div>
            </div>

            {/* 渠道2: 手机短信 (SMS) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h5 className="font-bold text-slate-900 text-sm">运营商SMS短信通道</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                用于CRITICAL严重级警报（如高热≥40℃、电子围栏逃逸越界），直接下发短信至场长与兽医手机号，保障无网兜底。
              </p>
              <div className="text-[11px] text-amber-700 font-mono bg-amber-50 p-2 rounded border border-amber-100">
                ● 今日发送: 12条 | 到达率: 100%
              </div>
            </div>

            {/* 渠道3: 微信公众号/企业微信 */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <h5 className="font-bold text-slate-900 text-sm">微信服务号 / 企业微信</h5>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                推送结构化告警卡片（含鹿只编号、发热数值、圈舍名称与现场抓拍），支持微信内一键点击确认与指派。
              </p>
              <div className="text-[11px] text-emerald-700 font-mono bg-emerald-50 p-2 rounded border border-emerald-100">
                ● 绑定员工: 18人 | 模板状态: 正常
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 告警处理反馈 */}
      {subTab === 'feedback' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 告警全生命周期处置闭环管理
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                记录每一笔预警的触发时间、确认人、诊断处理措施及最终复查结果，形成养殖医疗完整数字闭环。
              </p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 font-medium">
              闭环率: 100%
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">告警编号</th>
                    <th className="px-4 py-3">事件主题 / 级别</th>
                    <th className="px-4 py-3">所在圈舍 / 关联耳标</th>
                    <th className="px-4 py-3">发生时间</th>
                    <th className="px-4 py-3">确认责任人</th>
                    <th className="px-4 py-3">处理措施</th>
                    <th className="px-4 py-3">处理结果反馈</th>
                    <th className="px-4 py-3">闭环状态</th>
                    <th className="px-4 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {alarms.map((alm) => (
                    <tr key={alm.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-blue-700 font-bold">{alm.id}</td>
                      <td className="px-4 py-3 font-sans">
                        <div className="font-bold text-slate-900">{alm.title}</div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          alm.level === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {alm.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <div className="text-slate-800">{alm.houseName}</div>
                        <div className="text-[10px] text-slate-500">{alm.deerTagId || '-'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{alm.occurredTime}</td>
                      <td className="px-4 py-3 font-sans text-blue-700 font-medium">{alm.handler || '待认领'}</td>
                      <td className="px-4 py-3 font-sans text-slate-600 max-w-[200px] truncate">
                        {alm.handleAction || '—'}
                      </td>
                      <td className="px-4 py-3 font-sans text-slate-600 max-w-[200px] truncate">
                        {alm.handleResult || '—'}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alm.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          alm.status === 'processing' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {alm.status === 'resolved' ? '已闭环' : alm.status === 'processing' ? '处置中' : '待处理'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-sans">
                        {alm.status !== 'resolved' ? (
                          <button
                            onClick={() => {
                              setSelectedAlarmForModal(alm);
                            }}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors shadow-xs"
                          >
                            处置反馈
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedAlarmForModal(alm)}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            查看详情
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 处置反馈模态框 */}
      {selectedAlarmForModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-5 text-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 告警处置与闭环反馈登记
              </h3>
              <button onClick={() => setSelectedAlarmForModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3 text-xs space-y-1">
              <div className="font-bold text-slate-900">{selectedAlarmForModal.title}</div>
              <div className="text-slate-600 text-[11px]">{selectedAlarmForModal.description}</div>
              <div className="text-blue-700 font-mono text-[10px] pt-1">
                发生地点: {selectedAlarmForModal.houseName} • 时间: {selectedAlarmForModal.occurredTime}
              </div>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">处置确认人 / 责任兽医</label>
                <input
                  type="text"
                  required
                  value={handleForm.handler}
                  onChange={(e) => setHandleForm({ ...handleForm, handler: e.target.value })}
                  className="w-full bg-white border border-slate-300 px-3 py-1.5 rounded text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">实施处理措施 (如打针/分栏/通风换气)</label>
                <textarea
                  rows={2}
                  required
                  value={handleForm.handleAction}
                  onChange={(e) => setHandleForm({ ...handleForm, handleAction: e.target.value })}
                  className="w-full bg-white border border-slate-300 px-3 py-1.5 rounded text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">最终处理与复核结果</label>
                <textarea
                  rows={2}
                  required
                  value={handleForm.handleResult}
                  onChange={(e) => setHandleForm({ ...handleForm, handleResult: e.target.value })}
                  className="w-full bg-white border border-slate-300 px-3 py-1.5 rounded text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlarmForModal(null)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs"
                >
                  关闭
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs shadow-xs"
                >
                  提交闭环登记
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
