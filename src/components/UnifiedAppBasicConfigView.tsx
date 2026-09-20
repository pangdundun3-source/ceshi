/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Boxes,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AppBasicConfigPanel, AppBasicConfigForm } from './AppBasicConfigPanel';
import { IntegratedApp } from '../types';
import { INITIAL_APPS } from './AppManagement';

interface UnifiedAppBasicConfigViewProps {
  currentApp?: IntegratedApp;
  onUpdateApp?: (updated: IntegratedApp) => void;
  appsList?: IntegratedApp[];
}

export const UnifiedAppBasicConfigView: React.FC<UnifiedAppBasicConfigViewProps> = ({
  currentApp: propApp,
  onUpdateApp,
  appsList = INITIAL_APPS
}) => {
  // 当前选中的应用（支持从应用列表中切换）
  const [selectedAppId, setSelectedAppId] = useState<string>(
    propApp?.id || appsList[0]?.id || 'app-01'
  );

  const activeApp = appsList.find(a => a.id === selectedAppId) || propApp || appsList[0] || {
    id: 'app-01',
    appCode: 'V8-P-01',
    appName: '正管用 - 网络生态综合治理平台',
    appShortName: '正管用',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://wxb.cn',
    adminUrl: 'https://wxb.cn/admin',
    productManager: '周正明',
    status: 'active'
  };

  const [currentAppForm, setCurrentAppForm] = useState<AppBasicConfigForm>({
    ...activeApp,
    appLevel: activeApp.appLevel || 'product',
    roleType: activeApp.roleType || 'with_role',
    homeUrl: activeApp.homeUrl || '',
    appShortName: activeApp.appShortName || '应用',
    appName: activeApp.appName || '应用系统'
  });

  const handleUpdate = (updated: AppBasicConfigForm) => {
    setCurrentAppForm(updated);
    if (onUpdateApp && activeApp) {
      onUpdateApp({
        ...activeApp,
        ...updated
      } as IntegratedApp);
    }
  };

  const handleStatusChange = (newStatus: 'published' | 'unpublished' | 'disabled') => {
    const updated = {
      ...currentAppForm,
      status: newStatus
    };
    setCurrentAppForm(updated);
    if (onUpdateApp && activeApp) {
      onUpdateApp({
        ...activeApp,
        ...updated
      } as IntegratedApp);
    }
  };

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_app_basic_config_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* Top Header Card: 严格遵循 V8 用户数据库页面顶部导航与样式规范 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_app_basic_config_header_bar"
        >
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">各应用统一调用组件</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">应用基本配置</span>
            </nav>

            {/* 三、页面主标题（Title）与 徽标标签 */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                应用基本配置
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>

            {/* 四、功能说明文案 */}
            <p className="text-xs text-slate-500 m-0 p-0 font-normal mt-1 flex items-center gap-1.5">
              <span>提供应用基本档案信息总览、微信公众号独立服务号配置以及系统上线发布状态切换的统一配置界面。</span>
            </p>
          </div>

          {/* 右侧：选择应用下拉切换 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500">当前配置应用:</span>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedAppId(newId);
                  const found = appsList.find(a => a.id === newId);
                  if (found) {
                    setCurrentAppForm({
                      ...found,
                      appLevel: found.appLevel || 'product',
                      roleType: found.roleType || 'with_role',
                      homeUrl: found.homeUrl || '',
                      appShortName: found.appShortName || '应用',
                      appName: found.appName || '应用系统'
                    });
                  }
                }}
                className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#1e376b] cursor-pointer"
                id="select_unified_basic_config_app"
              >
                {appsList.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.appShortName} ({app.appCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 内容主体区 */}
        <div className="w-full px-6 pb-8">
          <AppBasicConfigPanel
            key={selectedAppId}
            appForm={currentAppForm}
            onUpdateAppForm={handleUpdate}
            currentStatus={
              currentAppForm.status === 'published' || currentAppForm.status === 'active'
                ? 'published'
                : currentAppForm.status === 'disabled'
                ? 'disabled'
                : 'unpublished'
            }
            onUpdateAppStatus={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
};
