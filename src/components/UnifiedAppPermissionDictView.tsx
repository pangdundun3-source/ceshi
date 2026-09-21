/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  KeyRound,
  Boxes,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import {
  PermissionDictManage,
  PrimaryPermItem,
  INITIAL_PRIMARY_PERMS
} from './PermissionDictManage';
import { IntegratedApp } from '../types';
import { INITIAL_APPS } from './AppManagement';

interface UnifiedAppPermissionDictViewProps {
  currentApp?: IntegratedApp;
  appsList?: IntegratedApp[];
  sharedPrimaryPerms?: PrimaryPermItem[];
  onSharedPrimaryPermsChange?: (perms: PrimaryPermItem[]) => void;
}

export const UnifiedAppPermissionDictView: React.FC<UnifiedAppPermissionDictViewProps> = ({
  currentApp: propApp,
  appsList = INITIAL_APPS,
  sharedPrimaryPerms,
  onSharedPrimaryPermsChange
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

  const [localPrimaryPerms, setLocalPrimaryPerms] = useState<PrimaryPermItem[]>(
    sharedPrimaryPerms || INITIAL_PRIMARY_PERMS
  );

  const primaryPerms = sharedPrimaryPerms || localPrimaryPerms;

  const handlePrimaryPermsChange = (updatedPerms: PrimaryPermItem[]) => {
    setLocalPrimaryPerms(updatedPerms);
    if (onSharedPrimaryPermsChange) {
      onSharedPrimaryPermsChange(updatedPerms);
    }
  };

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
      id="unified_app_permission_dict_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* Top Header Card: 严格遵循 V8 用户数据库页面顶部导航与样式规范 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_permission_dict_header_bar"
        >
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">统一组件库管理</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">权限字典</span>
            </nav>

            {/* 三、页面主标题（Title）与 徽标标签 */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                权限字典
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>

            {/* 四、功能说明文案 */}
            <p className="text-xs text-slate-500 m-0 p-0 font-normal mt-1 flex items-center gap-1.5">
              <span>提供应用权限字典层级树状结构配置、权限唯一编码维护、同级上下移动排序与静态化发布同步。</span>
            </p>
          </div>

          {/* 右侧：选择应用下拉切换与联动提示 */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>与应用配置「权限字典」双向联动同步</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-500">当前配置应用:</span>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  setSelectedAppId(e.target.value);
                }}
                className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-[#1e376b] cursor-pointer"
                id="select_unified_permission_dict_app"
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

        {/* 内容主体区：完整调用并呈现 PermissionDictManage 组件及其所有样式与交互 */}
        <div className="w-full px-6 pb-8">
          <PermissionDictManage
            key={selectedAppId}
            appCode={activeApp.appCode}
            primaryPerms={primaryPerms}
            onChangePrimaryPerms={handlePrimaryPermsChange}
            showToast={showToast}
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
