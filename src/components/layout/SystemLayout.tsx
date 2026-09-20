import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Cpu,
  Activity,
  ShieldAlert,
  Smartphone,
  Network,
  FileCode2,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  ArrowRightLeft,
  Video,
  Tag,
  Radio,
  Sliders,
  BellRing,
} from 'lucide-react';
import { TopNavKey } from '../common/TechHeader';

export interface MenuItemConfig {
  key: string;
  name: string;
  icon: any;
  topKey: TopNavKey;
  subKey?: string;
  children?: Array<{
    key: string;
    name: string;
    icon: any;
    topKey: TopNavKey;
    subKey: string;
  }>;
}

interface SystemLayoutProps {
  currentTopNav: TopNavKey;
  currentSubNav: string;
  onNavigate: (topKey: TopNavKey, subKey?: string) => void;
  pendingAlarmCount: number;
  onOpenAlarmModal: () => void;
  children: React.ReactNode;
}

export const SystemLayout: React.FC<SystemLayoutProps> = ({
  currentTopNav,
  currentSubNav,
  onNavigate,
  pendingAlarmCount,
  onOpenAlarmModal,
  children,
}) => {
  // 控制各菜单项的手风琴折叠展开状态 (默认展开基础管理、物联设备、物联数据、告警预警)
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    basic: true,
    'iot-devices': false,
    'iot-data': false,
    alarm: false,
  });

  const [searchKeyword, setSearchKeyword] = useState('');

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 严格继承原系统完整业务功能体系的一、二级菜单分层结构
  const menuList: MenuItemConfig[] = [
    {
      key: 'cockpit',
      name: '驾驶舱',
      icon: LayoutDashboard,
      topKey: 'cockpit',
    },
    {
      key: 'basic',
      name: '基础管理',
      icon: Database,
      topKey: 'basic',
      children: [
        { key: 'basic-entry', name: '鹿只入库建档', icon: FileSpreadsheet, topKey: 'basic', subKey: 'basic-entry' },
        { key: 'basic-house', name: '圈舍栏位维护', icon: Building2, topKey: 'basic', subKey: 'basic-house' },
        { key: 'basic-transfer', name: '转舍调群记录', icon: ArrowRightLeft, topKey: 'basic', subKey: 'basic-transfer' },
      ],
    },
    {
      key: 'iot-devices',
      name: '物联设备',
      icon: Cpu,
      topKey: 'iot-devices',
      children: [
        { key: 'iot-env-devices', name: '环境监测设备', icon: Activity, topKey: 'iot-devices', subKey: 'iot-env-devices' },
        { key: 'iot-video-devices', name: '视频推流设备', icon: Video, topKey: 'iot-devices', subKey: 'iot-video-devices' },
        { key: 'iot-pda-devices', name: 'PDA手持终端', icon: Smartphone, topKey: 'iot-devices', subKey: 'iot-pda-devices' },
        { key: 'iot-tag-devices', name: '智能耳标网关', icon: Tag, topKey: 'iot-devices', subKey: 'iot-tag-devices' },
        { key: 'iot-other-devices', name: '环控联动设备', icon: Radio, topKey: 'iot-devices', subKey: 'iot-other-devices' },
      ],
    },
    {
      key: 'iot-data',
      name: '物联数据',
      icon: Activity,
      topKey: 'iot-data',
      children: [
        { key: 'iot-env-data', name: '环境监测数据', icon: Activity, topKey: 'iot-data', subKey: 'iot-env-data' },
        { key: 'iot-video-data', name: '视频AI识别流', icon: Video, topKey: 'iot-data', subKey: 'iot-video-data' },
        { key: 'iot-pda-data', name: 'PDA作业数据', icon: Smartphone, topKey: 'iot-data', subKey: 'iot-pda-data' },
        { key: 'iot-tag-data', name: '耳标生理遥测', icon: Tag, topKey: 'iot-data', subKey: 'iot-tag-data' },
        { key: 'iot-other-data', name: '配套系统遥测', icon: Radio, topKey: 'iot-data', subKey: 'iot-other-data' },
      ],
    },
    {
      key: 'alarm',
      name: '告警预警',
      icon: ShieldAlert,
      topKey: 'alarm',
      children: [
        { key: 'alarm-rules', name: '告警规则引擎', icon: Sliders, topKey: 'alarm', subKey: 'alarm-rules' },
        { key: 'alarm-behavior', name: '异常行为识别', icon: ShieldAlert, topKey: 'alarm', subKey: 'alarm-behavior' },
        { key: 'alarm-push', name: '告警推送中心', icon: BellRing, topKey: 'alarm', subKey: 'alarm-push' },
        { key: 'alarm-feedback', name: '告警闭环反馈', icon: CheckCircle2, topKey: 'alarm', subKey: 'alarm-feedback' },
      ],
    },
    {
      key: 'mobile',
      name: '移动协同',
      icon: Smartphone,
      topKey: 'mobile',
    },
    {
      key: 'topology',
      name: '系统拓扑',
      icon: Network,
      topKey: 'topology',
    },
    {
      key: 'specs',
      name: '需求规格',
      icon: FileCode2,
      topKey: 'specs',
    },
  ];

  // 计算当前顶栏标题文案 (对应参考图左上角的 "▌ 项目管理 | 智慧船厂综合管控平台")
  const getHeaderTitle = () => {
    const parent = menuList.find((m) => m.topKey === currentTopNav);
    if (!parent) return '南平庭春鹿业综合管控平台';

    if (parent.children) {
      const sub = parent.children.find((c) => c.subKey === currentSubNav);
      if (sub) {
        return `${parent.name} - ${sub.name}`;
      }
    }
    return parent.name;
  };

  return (
    <div className="flex h-screen w-screen bg-[#eef4f0] text-slate-800 overflow-hidden font-sans select-none">
      {/* ===================== 1. 左侧生态绿意白层级侧边栏 ===================== */}
      <aside className="w-56 xl:w-60 bg-white border-r border-[#d6e4db] flex flex-col shrink-0 z-20 shadow-xs">
        {/* 顶部系统 Logo 与名称 (南平庭春鹿业徽标) */}
        <div className="h-16 px-4 flex items-center space-x-3 border-b border-[#e5eee8]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              南平庭春鹿业
            </h1>
            <p className="text-[10px] text-emerald-700 font-bold tracking-wider font-mono uppercase mt-1">
              NANPING TINGCHUN DEER
            </p>
          </div>
        </div>

        {/* 侧边栏主菜单内容 (滚动) */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400">
            南平庭春鹿业功能
          </div>

          {menuList.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isParentActive = currentTopNav === item.topKey;
            const isExpanded = expandedKeys[item.key] ?? isParentActive;
            const ItemIcon = item.icon;

            if (!hasChildren) {
              // 单项一级菜单 (如 驾驶舱、移动协同、系统拓扑、需求规格)
              const isActive = isParentActive;

              return (
                <button
                  key={item.key}
                  id={`sidebar-menu-${item.key}`}
                  onClick={() => onNavigate(item.topKey)}
                  className={`relative w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-emerald-600 before:rounded-r'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#f3f7f4]'
                  }`}
                >
                  <ItemIcon
                    className={`w-4 h-4 mr-2.5 transition-colors ${
                      isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-700'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                  {item.key === 'cockpit' && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.2 bg-emerald-100/80 text-emerald-800 font-mono rounded-md">
                      大屏
                    </span>
                  )}
                </button>
              );
            }

            // 带子层级的手风琴一级菜单 (基础管理、物联设备、物联数据、告警预警)
            return (
              <div key={item.key} className="space-y-0.5">
                <button
                  onClick={() => {
                    toggleExpand(item.key);
                    // 默认点击父级也可以跳转到首个子项
                    if (!isParentActive && item.children?.[0]) {
                      onNavigate(item.topKey, item.children[0].subKey);
                    }
                  }}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer group ${
                    isParentActive
                      ? 'bg-emerald-50/90 text-emerald-800 font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-emerald-600 before:rounded-r'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-[#f3f7f4]'
                  }`}
                >
                  <div className="flex items-center truncate">
                    <ItemIcon
                      className={`w-4 h-4 mr-2.5 transition-colors ${
                        isParentActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-700'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {/* 展开的二级子菜单 */}
                {isExpanded && item.children && (
                  <div className="pl-6 pr-1 py-0.5 space-y-0.5 relative before:absolute before:left-5 before:top-1 before:bottom-1 before:w-px before:bg-[#dbe6df]">
                    {item.children.map((sub) => {
                      const isSubActive = isParentActive && currentSubNav === sub.subKey;
                      const SubIcon = sub.icon;

                      return (
                        <button
                          key={sub.key}
                          id={`sidebar-submenu-${sub.key}`}
                          onClick={() => onNavigate(sub.topKey, sub.subKey)}
                          className={`w-full flex items-center px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                            isSubActive
                              ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-[#f0f5f2]'
                          }`}
                        >
                          <SubIcon
                            className={`w-3.5 h-3.5 mr-2 shrink-0 ${
                              isSubActive ? 'text-white' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{sub.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 侧边栏底部服务运行状态 (参考图左下角) */}
        <div className="h-11 px-4 border-t border-[#e5eee8] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 font-medium">南平庭春鹿业服务运行中</span>
          </div>
          <span className="text-emerald-700 font-bold">V2.6 PRO</span>
        </div>
      </aside>

      {/* ===================== 2. 右侧主工作台与顶栏 ===================== */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* 顶部白色导航栏 (带有生态绿条指示) */}
        <header className="h-16 bg-white border-b border-[#d6e4db] px-6 flex items-center justify-between shrink-0 z-10">
          {/* 左侧：粗绿竖条 + 模块标题与系统副标题 */}
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-5 bg-emerald-600 rounded-full" />
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-extrabold text-slate-900 tracking-tight">
                {getHeaderTitle()}
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-xs text-slate-500 hidden md:inline">
                庭春鹿业生态养殖综合管控平台
              </span>
            </div>
          </div>

          {/* 右侧：全局搜索框 + 消息通知 + 帮助 + 用户信息 */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* 胶囊搜索框 */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索耳标、批次、圈舍、设备..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 rounded-full bg-[#f4f8f5] hover:bg-[#ebf3ee] focus:bg-white border border-[#d6e4db] text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            {/* 告警提醒铃铛 */}
            <button
              onClick={onOpenAlarmModal}
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-[#f0f5f2] transition-colors cursor-pointer"
              title="待处置预警"
            >
              <Bell className="w-4 h-4" />
              {pendingAlarmCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* 帮助中心 */}
            <button
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-[#f0f5f2] transition-colors cursor-pointer hidden md:flex items-center justify-center"
              title="养殖规范与帮助文档"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* 用户个人资料卡片 (生态深绿底头像) */}
            <div className="flex items-center space-x-2 pl-2 border-l border-[#d6e4db]">
              <div className="relative w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                <span>张</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">张工</div>
                <div className="text-[10px] text-emerald-700 font-medium">驻场畜牧主管</div>
              </div>
            </div>
          </div>
        </header>

        {/* 中间主工作区内容 (生态底色 #eef4f0，长久注视舒适柔和) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#eef4f0]">
          <div className="max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>

        {/* 底部状态栏 */}
        <footer className="h-9 px-6 bg-white border-t border-[#d6e4db] flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <span>南平庭春鹿业遥测状态:</span>
            <span className="text-emerald-700 font-semibold">同步正常 (遥测延时 24MS)</span>
          </div>
          <div>
            © 2026 NANPING TINGCHUN DEER ECOLOGICAL FARMING CO., LTD. ALL RIGHTS RESERVED.
          </div>
        </footer>
      </div>
    </div>
  );
};
