import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal
} from 'lucide-react';
import {
  MenuManage,
  SysMenuItem,
  INITIAL_DITING_MENUS,
  AvailableComponentOption,
  getEndpointKindIcon,
  getEndpointKindStyle
} from './MenuManage';
import { UNIFIED_CALL_MODULES } from '../data/unifiedCallModules';

export interface CustomerMenuManageProps {
  customerOrgName: string;
  customerOrgCode: string;
  appName?: string;
  appCode?: string;
  productVersion?: string;
  licenseType?: string;
  onShowToast?: (text: string, type: 'success' | 'warning' | 'info') => void;
}

interface CustomerEndpointConfig {
  id: string;
  name: string;
  kind: string;
  typeLabel: string;
  description: string;
  menus: SysMenuItem[];
}

export const CustomerMenuManage: React.FC<CustomerMenuManageProps> = ({
  customerOrgName,
  appName = '谛听预警系统',
  appCode = 'APP-DITING-01',
  onShowToast
}) => {
  // 初始化该机构专属的多访问端（PC管理端、用户业务端、移动协同端、数据大屏端）及其独立菜单树副本
  const [endpoints, setEndpoints] = useState<CustomerEndpointConfig[]>(() => {
    // 1. 管理端默认加载完整系统菜单
    const adminMenus: SysMenuItem[] = JSON.parse(JSON.stringify(INITIAL_DITING_MENUS));

    // 2. PC 业务协同端（精选业务研判、态势、线索上报等模块）
    const userMenus: SysMenuItem[] = [
      adminMenus[0] || {
        id: 'm_dt_home',
        parentId: '0',
        menuCode: 'DT_HOME',
        menuName: '工作台首页',
        hasIcon: true,
        iconType: 'library',
        icon: 'LayoutDashboard',
        routePath: '/diting/workbench',
        target: 'frame',
        sort: 1,
        visible: true,
        globalVisible: true,
      },
      {
        id: 'm_user_scheme',
        parentId: '0',
        menuCode: 'DT_USER_SCHEME',
        menuName: '业务研判分析',
        hasIcon: true,
        iconType: 'library',
        icon: 'TrendingUp',
        routePath: '/diting/scheme',
        target: 'frame',
        sort: 2,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_template_report',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'create', 'export']
      },
      {
        id: 'm_user_clue',
        parentId: 'm_user_scheme',
        menuCode: 'DT_USER_CLUE',
        menuName: '实时警情核查',
        hasIcon: true,
        iconType: 'library',
        icon: 'Activity',
        routePath: '/diting/scheme/clues',
        target: 'frame',
        sort: 1,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_instruction_flow',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'update', 'audit']
      },
      {
        id: 'm_user_dispatch',
        parentId: 'm_user_scheme',
        menuCode: 'DT_USER_DISPATCH',
        menuName: '协同处置分发',
        hasIcon: true,
        iconType: 'library',
        icon: 'Send',
        routePath: '/diting/scheme/dispatch',
        target: 'frame',
        sort: 2,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_template_dispatch',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'create', 'audit']
      },
      {
        id: 'm_user_archive',
        parentId: '0',
        menuCode: 'DT_USER_ARCHIVE',
        menuName: '研判档案文库',
        hasIcon: true,
        iconType: 'library',
        icon: 'Database',
        routePath: '/diting/archive',
        target: 'frame',
        sort: 3,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_template_config',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'export']
      }
    ];

    // 3. 移动微门户（移动快速上报、指令签收待办）
    const mobileMenus: SysMenuItem[] = [
      {
        id: 'm_mb_home',
        parentId: '0',
        menuCode: 'DT_MB_HOME',
        menuName: '微门户首页',
        hasIcon: true,
        iconType: 'library',
        icon: 'LayoutDashboard',
        routePath: '/diting/mobile/home',
        target: 'frame',
        sort: 1,
        visible: true,
        globalVisible: true,
      },
      {
        id: 'm_mb_todo',
        parentId: '0',
        menuCode: 'DT_MB_TODO',
        menuName: '待办指令签收',
        hasIcon: true,
        iconType: 'library',
        icon: 'ListTodo',
        routePath: '/diting/mobile/tasks',
        target: 'frame',
        sort: 2,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_instruction_flow',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'update', 'audit']
      },
      {
        id: 'm_mb_report',
        parentId: '0',
        menuCode: 'DT_MB_REPORT',
        menuName: '现场线索上报',
        hasIcon: true,
        iconType: 'library',
        icon: 'Send',
        routePath: '/diting/mobile/report',
        target: 'frame',
        sort: 3,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_template_report',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'create']
      },
      {
        id: 'm_mb_contacts',
        parentId: '0',
        menuCode: 'DT_MB_CONTACTS',
        menuName: '协同通讯录',
        hasIcon: true,
        iconType: 'library',
        icon: 'Users',
        routePath: '/diting/mobile/contacts',
        target: 'frame',
        sort: 4,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_personnel_manage',
        isModuleComponent: true,
        kernel: '组织核',
        moduleActions: ['query']
      }
    ];

    // 4. 数据大屏展示端
    const screenMenus: SysMenuItem[] = [
      {
        id: 'm_sc_overall',
        parentId: '0',
        menuCode: 'DT_SC_OVERALL',
        menuName: '全域态势综合大屏',
        hasIcon: true,
        iconType: 'library',
        icon: 'Gauge',
        routePath: '/diting/screen/overall',
        target: 'frame',
        sort: 1,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_template_report',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query', 'export']
      },
      {
        id: 'm_sc_clue',
        parentId: '0',
        menuCode: 'DT_SC_CLUE',
        menuName: '重点预警图谱看板',
        hasIcon: true,
        iconType: 'library',
        icon: 'Activity',
        routePath: '/diting/screen/graph',
        target: 'frame',
        sort: 2,
        visible: true,
        globalVisible: true,
        moduleKey: 'submenu_unified_instruction_flow',
        isModuleComponent: true,
        kernel: '业务核',
        moduleActions: ['query']
      }
    ];

    return [
      {
        id: 'ep-admin',
        name: '管理端 (PC)',
        kind: 'admin_web',
        typeLabel: '后台管理端',
        description: '面向机构管理员的系统级综合配置与菜单管理后台',
        menus: adminMenus
      },
      {
        id: 'ep-user',
        name: '业务协同端 (PC)',
        kind: 'user_web',
        typeLabel: '业务用户端',
        description: '面向业务干警和研判专员的日常研判与处置工作台',
        menus: userMenus
      },
      {
        id: 'ep-mobile',
        name: '移动微门户',
        kind: 'wechat',
        typeLabel: '移动端/微信',
        description: '适配掌上移动执勤、手机微信微门户及移动协同填报',
        menus: mobileMenus
      },
      {
        id: 'ep-screen',
        name: '数据大屏展示端',
        kind: 'pad',
        typeLabel: '可视化展示',
        description: '适配指挥中心 LED 大屏及指挥调度态势驾驶舱',
        menus: screenMenus
      }
    ];
  });

  // 当前选中的端
  const [activeEpId, setActiveEpId] = useState<string>('ep-admin');

  const currentEp = useMemo(() => {
    return endpoints.find((ep) => ep.id === activeEpId) || endpoints[0];
  }, [endpoints, activeEpId]);

  // 更新当前端的专属菜单
  const handleCurrentMenusChange = (
    updater: SysMenuItem[] | ((prev: SysMenuItem[]) => SysMenuItem[])
  ) => {
    setEndpoints((prev) =>
      prev.map((ep) => {
        if (ep.id === activeEpId) {
          const nextMenus = typeof updater === 'function' ? updater(ep.menus) : updater;
          return { ...ep, menus: nextMenus };
        }
        return ep;
      })
    );
  };

  // 构造全系统可用业务组件选项列表（支持一键快速挂载与能力绑定）
  const availableComponentOptions: AvailableComponentOption[] = useMemo(() => {
    return UNIFIED_CALL_MODULES.map((mod) => {
      const key = mod.menu as string;
      const kernelPrefix = mod.kernel === '业务核' ? 'alert' : mod.kernel === '组织核' ? 'org' : 'sys';
      return {
        key,
        title: mod.title,
        description: mod.description,
        kernel: mod.kernel,
        routePath: `/diting/${kernelPrefix}/${key.toLowerCase().replace(/_/g, '-')}`,
        icon: mod.kernel === '业务核' ? 'Activity' : mod.kernel === '组织核' ? 'Users' : 'Settings',
        displayedEndpoints: endpoints.map((ep) => ({
          id: ep.id,
          name: ep.name,
          kind: ep.kind
        }))
      };
    });
  }, [endpoints]);

  return (
    <div className="flex flex-col gap-5 w-full" id="customer_exclusive_menu_manage_module">
      {/* ========================================================
          访问端切换导航条
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1e376b]" />
            <h3 className="text-xs font-black text-slate-800 tracking-tight">机构产品访问端选择</h3>
            <span className="text-[10px] text-slate-400 font-normal">
              支持为不同终端定制专属菜单结构
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">当前正在配置:</span>
            <span className="font-bold text-[#1e376b] bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentEp.name}</span>
              <span className="text-[10px] text-slate-500 font-normal">({currentEp.typeLabel})</span>
            </span>
          </div>
        </div>

        {/* 访问端标签按钮条 */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-0.5">
          {endpoints.map((ep) => {
            const isSelected = activeEpId === ep.id;
            const EpIcon = getEndpointKindIcon(ep.kind);
            const kindStyle = getEndpointKindStyle(ep.kind);

            return (
              <button
                key={ep.id}
                type="button"
                onClick={() => setActiveEpId(ep.id)}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#1e376b] text-white border-[#1e376b] shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <EpIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{ep.name}</span>
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    isSelected ? 'bg-white/20 text-white' : kindStyle
                  }`}
                >
                  {ep.typeLabel}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {ep.menus.length} 项菜单
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          3. 核心全功能菜单管理组件 (MenuManage 核心引擎)
          ======================================================== */}
      <div className="w-full">
        <MenuManage
          appName={`${customerOrgName} · ${appName}`}
          appCode={appCode}
          endpointName={currentEp.name}
          endpointKind={currentEp.kind}
          menus={currentEp.menus}
          onMenusChange={handleCurrentMenusChange}
          availableComponents={availableComponentOptions}
          onNavigateToComponents={() => {
            onShowToast?.(
              '当前已载入全套系统业务核、组织核与开通核组件库，可直接在右侧表单选择并挂载！',
              'info'
            );
          }}
          onShowToast={(msg, type) => {
            onShowToast?.(msg, type);
          }}
        />
      </div>
    </div>
  );
};
