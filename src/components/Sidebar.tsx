import React, { useState } from 'react';
import { 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Database,
  LayoutDashboard,
  Boxes,
  Network,
  UserCheck,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { MenuItem, SystemMode } from '../types';
import { UNIFIED_CALL_MENU_ITEMS, UNIFIED_CALL_MODULES } from '../data/unifiedCallModules';

interface SidebarProps {
  currentMenu: MenuItem;
  setCurrentMenu: (menu: MenuItem) => void;
  systemMode: SystemMode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  setCurrentMenu
}) => {
  // Collapsible configurations targeting App Management and Unified Components sections
  const [openSections, setOpenSections] = useState({
    appManage: true,
    unifiedComponents: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="w-[200px] bg-[#D5EBFE] border-r border-[#b9d7f6] flex flex-col justify-between h-full min-h-0 overflow-y-auto select-none grow-0 shrink-0 text-[#1e376b]">
      
      {/* Menu Categories */}
      <div className="py-4 flex flex-col gap-1.5" id="sidebar_menu_container">
        
        {/* 1. 首页看板(不做) (Flat Direct Link) */}
        <div className="px-3 mb-1">
          <button
            onClick={() => setCurrentMenu(MenuItem.AppDashboard)}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              currentMenu === MenuItem.AppDashboard
                ? 'bg-[#1e376b] text-white font-semibold shadow-sm'
                : 'text-[#1e376b] hover:bg-blue-200/50'
            }`}
            id="menu_app_dashboard"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className={`w-4 h-4 ${currentMenu === MenuItem.AppDashboard ? 'text-white' : 'text-[#1e376b]'}`} />
              <span>首页看板(不做)</span>
            </span>
            <span className="text-[9px] bg-blue-600/15 text-[#1e376b] px-1.5 py-0.5 rounded-full font-black scale-90">看板</span>
          </button>
        </div>

        {/* 2. 应用管理 (Folder / Collapsible) -> 二级菜单：应用列表 */}
        <div className="px-3">
          <button
            onClick={() => toggleSection('appManage')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              currentMenu === MenuItem.AppList
                ? 'text-[#1e376b] bg-blue-200/30'
                : 'text-[#1e376b] hover:bg-blue-200/50'
            }`}
            id="sec_app_manage"
          >
            <span className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#1e376b]" />
              <span>应用管理</span>
            </span>
            {openSections.appManage ? <ChevronUp className="w-3.5 h-3.5 text-[#1e376b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#1e376b]" />}
          </button>
          
          {openSections.appManage && (
            <div className="mt-1 pl-4 flex flex-col gap-0.5 border-l border-[#1e376b]/20 ml-4 animate-in fade-in duration-200">
              <button
                onClick={() => setCurrentMenu(MenuItem.AppList)}
                className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all cursor-pointer ${
                  currentMenu === MenuItem.AppList
                    ? 'bg-[#1e376b] text-white font-semibold shadow-sm'
                    : 'text-[#1e376b] hover:bg-blue-200/50'
                }`}
                id="submenu_app_list"
              >
                应用列表
              </button>
            </div>
          )}
        </div>

        {/* Divider: 各应用统一调用组件上方横线 */}
        <div className="px-3 mt-3 border-t border-[#1e376b]/15 pt-3">
          {/* 新增主菜单: 各应用统一调用组件 */}
          <button
            onClick={() => toggleSection('unifiedComponents')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              UNIFIED_CALL_MENU_ITEMS.includes(currentMenu)
                ? 'text-[#1e376b] bg-blue-200/30'
                : 'text-[#1e376b] hover:bg-blue-200/50'
            }`}
            id="sec_unified_components"
          >
            <span className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#1e376b]" />
              <span>各应用统一调用组件</span>
            </span>
            {openSections.unifiedComponents ? <ChevronUp className="w-3.5 h-3.5 text-[#1e376b]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#1e376b]" />}
          </button>
          
          {openSections.unifiedComponents && (
            <div className="mt-1 pl-4 flex flex-col gap-0.5 border-l border-[#1e376b]/20 ml-4 animate-in fade-in duration-200">
              {UNIFIED_CALL_MODULES.map((mod, index) => {
                const prevKernel = UNIFIED_CALL_MODULES[index - 1]?.kernel;
                const showDivider = Boolean(prevKernel && prevKernel !== mod.kernel);
                return (
                  <React.Fragment key={mod.menu}>
                    {showDivider && <div className="my-1.5 border-t border-[#1e376b]/20 mx-1" />}
                    <button
                      onClick={() => setCurrentMenu(mod.menu)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-md transition-all cursor-pointer ${
                        currentMenu === mod.menu
                          ? 'bg-[#1e376b] text-white font-semibold shadow-sm'
                          : 'text-[#1e376b] hover:bg-blue-200/50'
                      }`}
                      id={mod.id}
                      title={mod.description}
                    >
                      {mod.title}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider 2: 主体维护日志上方的横线 */}
        <div className="px-3 mt-3 border-t border-[#1e376b]/15 pt-3">
          {/* 保留板块 2: 主体维护日志 */}
          <button
            onClick={() => setCurrentMenu(MenuItem.EntityLog)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              currentMenu === MenuItem.EntityLog
                ? 'bg-[#1e376b] text-[#ffffff] font-bold shadow-sm'
                : 'text-[#1e376b] hover:bg-blue-200/50'
            }`}
            id="menu_entity_log"
          >
            <Database className="w-4 h-4 text-[#1e376b]" />
            <span>主体维护日志</span>
          </button>
        </div>

        {/* 保留板块 3: 系统设置 */}
        <div className="px-3">
          <button
            onClick={() => setCurrentMenu(MenuItem.SystemSettings)}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
              currentMenu === MenuItem.SystemSettings 
                ? 'bg-[#1e376b] text-white font-semibold shadow-sm' 
                : 'text-[#1e376b] hover:bg-blue-200/50'
            }`}
            id="menu_system_settings"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#1e376b]" />
              <span>系统设置</span>
            </span>
          </button>
        </div>

      </div>

    </aside>
  );
};
