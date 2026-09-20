import React, { useState } from 'react';
import {
  LayoutDashboard,
  Database,
  Cpu,
  Activity,
  Bell,
  Smartphone,
  GitFork,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Radio,
  Video,
  Tag,
  Sliders,
  CheckCircle2,
  ArrowRightLeft,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export interface MenuItem {
  key: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  children?: {
    key: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: number | string;
  }[];
}

interface SidebarProps {
  currentNav: string;
  currentSubMenu: string;
  onNavigate: (nav: 'cockpit' | 'management' | 'mobile' | 'topology' | 'specs', subMenu?: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingAlarmCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  currentSubMenu,
  onNavigate,
  collapsed,
  onToggleCollapse,
  pendingAlarmCount,
}) => {
  // 默认展开所有一级父菜单，支持用户点击自由折叠
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'basic': true,
    'iot-devices': true,
    'iot-data': true,
    'alarms': true,
  });

  const toggleGroup = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuGroups: MenuItem[] = [
    {
      key: 'cockpit',
      name: '养殖大数据驾驶舱',
      icon: LayoutDashboard,
    },
    {
      key: 'basic',
      name: '基础信息管理',
      icon: Database,
      children: [
        { key: 'basic-entry', name: '鹿只入库管理', icon: PlusCircle },
        { key: 'basic-transfer', name: '转舍/调群管理', icon: ArrowRightLeft },
      ],
    },
    {
      key: 'iot-devices',
      name: '物联设备管理',
      icon: Cpu,
      children: [
        { key: 'iot-env-devices', name: '环境监测设备', icon: Radio },
        { key: 'iot-video-devices', name: 'AI视频设备', icon: Video },
        { key: 'iot-pda-devices', name: 'PDA手持终端', icon: Smartphone },
        { key: 'iot-tag-devices', name: '测温计步耳标', icon: Tag },
        { key: 'iot-other-devices', name: '网关与门禁', icon: Radio },
      ],
    },
    {
      key: 'iot-data',
      name: '物联数据管理',
      icon: Activity,
      children: [
        { key: 'iot-env-data', name: '环境时序数据', icon: Radio },
        { key: 'iot-video-data', name: '视频流与识别', icon: Video },
        { key: 'iot-pda-data', name: 'PDA巡检记录', icon: Smartphone },
        { key: 'iot-tag-data', name: '耳标体温与计步', icon: Tag },
        { key: 'iot-other-data', name: '门禁盘点数据', icon: Radio },
      ],
    },
    {
      key: 'alarms',
      name: '智能告警系统',
      icon: Bell,
      badge: pendingAlarmCount > 0 ? pendingAlarmCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      children: [
        { key: 'alarm-rules', name: '告警规则配置', icon: Sliders },
        { key: 'alarm-behavior', name: '异常行为识别', icon: ShieldAlert },
        { key: 'alarm-push', name: '告警推送中心', icon: Bell },
        {
          key: 'alarm-feedback',
          name: '告警处理闭环',
          icon: CheckCircle2,
          badge: pendingAlarmCount > 0 ? `${pendingAlarmCount}待办` : undefined,
        },
      ],
    },
    {
      key: 'mobile',
      name: '移动协同终端',
      icon: Smartphone,
    },
    {
      key: 'topology',
      name: '端边云系统拓扑',
      icon: GitFork,
    },
    {
      key: 'specs',
      name: '软硬件规格清单',
      icon: FileText,
    },
  ];

  return (
    <aside
      className={`relative bg-white border-r border-slate-200 flex flex-col transition-all duration-300 select-none z-30 shadow-xs ${
        collapsed ? 'w-[70px]' : 'w-[250px]'
      }`}
    >
      {/* 顶部系统 Logo 与名称 */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
          鹿
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
              南平庭春鹿业管理系统
            </h1>
            <p className="text-[11px] text-emerald-700 font-normal truncate">
              南平庭春鹿业
            </p>
          </div>
        )}
      </div>

      {/* 菜单导航列表 */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 custom-scrollbar">
        {menuGroups.map((group) => {
          const GroupIcon = group.icon || LayoutDashboard;
          const isGroupDirect = !group.children || group.children.length === 0;
          const isDirectActive = isGroupDirect && currentNav === group.key;
          const isGroupOpen = !!openGroups[group.key];
          
          // 判断组内是否有激活的子项
          const isChildActive =
            currentNav === 'management' &&
            group.children?.some((c) => c.key === currentSubMenu);

          if (isGroupDirect) {
            return (
              <button
                key={group.key}
                onClick={() => onNavigate(group.key as any)}
                title={collapsed ? group.name : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isDirectActive
                    ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-600 pl-2.5'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <GroupIcon className={`w-4 h-4 shrink-0 ${isDirectActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{group.name}</span>}
              </button>
            );
          }

          // 带有子项的分组菜单
          return (
            <div key={group.key} className="space-y-0.5">
              <button
                onClick={(e) => {
                  if (collapsed) {
                    onToggleCollapse();
                  } else {
                    toggleGroup(group.key, e);
                  }
                }}
                title={collapsed ? group.name : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isChildActive
                    ? 'text-blue-700 bg-blue-50/50'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GroupIcon className={`w-4 h-4 shrink-0 ${isChildActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{group.name}</span>}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {group.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${group.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {group.badge}
                      </span>
                    )}
                    {isGroupOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                )}
              </button>

              {/* 子菜单展开列表 */}
              {!collapsed && isGroupOpen && group.children && (
                <div className="pl-4 pr-1 py-0.5 space-y-0.5 border-l-2 border-slate-100 ml-5">
                  {group.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isActive = currentNav === 'management' && currentSubMenu === child.key;

                    return (
                      <button
                        key={child.key}
                        onClick={() => onNavigate('management', child.key)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.8 rounded-md text-[11.5px] font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {ChildIcon && (
                            <ChildIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          )}
                          <span className="truncate">{child.name}</span>
                        </div>
                        {child.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                              isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部折叠/展开按钮与在线统计 */}
      <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/70">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-600">设备在网 236/236</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors mx-auto"
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
