/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MenuManage, SysMenuItem } from './MenuManage';
import { CheckCircle2, AlertCircle, Info, Boxes, Sparkles } from 'lucide-react';

interface UnifiedFrontendMenuManageViewProps {
  sharedMenus: SysMenuItem[];
  onSharedMenusChange: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
}

export const UnifiedFrontendMenuManageView: React.FC<UnifiedFrontendMenuManageViewProps> = ({
  sharedMenus,
  onSharedMenusChange
}) => {
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_frontend_menu_manage_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* Top Header Card: 严格遵循 V8 用户数据库页面顶部导航与样式规范 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_menu_header_bar"
        >
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">各应用统一调用组件</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">前端系统菜单管理</span>
            </nav>

            {/* 三、页面主标题（Title）与 徽标标签 */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                前端系统菜单管理
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>与应用配置「默认菜单管理」双向联动同步</span>
            </div>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5 flex flex-col gap-5">
          <MenuManage
            appName="谛听预警系统"
            appCode="APP-DITING-01"
            menus={sharedMenus}
            onMenusChange={onSharedMenusChange}
            onShowToast={(txt, tp) => showToast(txt, tp)}
          />
        </div>
      </div>

      {/* Toast 提示浮窗 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                : toastMessage.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-500 shadow-amber-500/20'
                : 'bg-slate-800 text-white border-slate-700 shadow-slate-900/30'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
