/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Boxes,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import {
  CustomerOrgManage
} from './CustomerOrgManage';
import { CustomerOrgItem, INITIAL_CUSTOMER_ORGS, withOrgProductBindings } from '../data/mockCustomerOrgs';
import { IntegratedApp } from '../types';
import { INITIAL_APPS } from './AppManagement';

export interface UnifiedAppCustomerOrgsViewProps {
  currentApp?: IntegratedApp;
  appsList?: IntegratedApp[];
  sharedCustomerOrgs?: CustomerOrgItem[];
  onSharedCustomerOrgsChange?: (orgs: CustomerOrgItem[]) => void;
  breadcrumbs?: string[];
  pageTitle?: string;
  pageSubtitle?: string;
  pageSubtitlePosition?: 'inline' | 'below';
  rightPromptBadge?: string;
}

export const UnifiedAppCustomerOrgsView: React.FC<UnifiedAppCustomerOrgsViewProps> = ({
  currentApp: propApp,
  appsList = INITIAL_APPS,
  sharedCustomerOrgs,
  onSharedCustomerOrgsChange,
  breadcrumbs,
  pageTitle,
  pageSubtitle,
  pageSubtitlePosition = 'inline',
  rightPromptBadge
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

  const [localCustomerOrgs, setLocalCustomerOrgs] = useState<CustomerOrgItem[]>(() => {
    return withOrgProductBindings(sharedCustomerOrgs || INITIAL_CUSTOMER_ORGS).map(c => ({
      ...c,
      isEnabled: c.isEnabled !== undefined ? c.isEnabled : c.status !== 'disabled'
    }));
  });

  const customerOrgs = sharedCustomerOrgs || localCustomerOrgs;

  const handleCustomerOrgsChange = (updatedOrgs: CustomerOrgItem[]) => {
    setLocalCustomerOrgs(updatedOrgs);
    if (onSharedCustomerOrgsChange) {
      onSharedCustomerOrgsChange(updatedOrgs);
    }
  };

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'info' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_app_customer_orgs_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* Top Header Card: 严格遵循 V8 页面顶部导航与样式规范 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_customer_orgs_header_bar"
        >
          <div className="flex flex-col">
            {/* 面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              {breadcrumbs && breadcrumbs.length > 0 ? (
                breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-400 font-normal">/</span>}
                    <span className={idx === breadcrumbs.length - 1 ? "text-slate-600 font-medium" : "text-slate-400 font-normal"}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))
              ) : (
                <>
                  <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
                  <span className="text-slate-400 font-normal">/</span>
                  <span className="text-slate-400 font-normal">各应用统一调用组件</span>
                  <span className="text-slate-400 font-normal">/</span>
                  <span className="text-slate-600 font-medium">客户机构</span>
                </>
              )}
            </nav>

            {/* 页面主标题与标签 */}
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-5 h-5 text-[#1e376b] shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight">{pageTitle || '客户机构'}</h1>
                  {pageSubtitlePosition === 'inline' && pageSubtitle && (
                    <span className="text-xs text-slate-500 font-normal">· {pageSubtitle}</span>
                  )}
                  {pageSubtitlePosition === 'inline' && !pageSubtitle && (
                    <span className="text-xs text-slate-500 font-normal">· 按产品查看已开通机构</span>
                  )}
                </div>
                {pageSubtitlePosition === 'below' && (
                  <span className="text-xs text-slate-500 font-normal mt-0.5">
                    {pageSubtitle || '按产品查看已开通机构'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：胶囊提示标签 */}
          <div className="flex items-center gap-3">
            {rightPromptBadge ? (
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full border border-orange-200 text-xs font-semibold shadow-2xs select-none">
                <Boxes className="w-4 h-4 text-orange-600" />
                <span className="font-bold text-orange-700/80">所属应用:</span>
                <span className="text-orange-900 font-medium">{rightPromptBadge}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full border border-orange-200 text-xs font-semibold shadow-2xs select-none">
                <Boxes className="w-4 h-4 text-orange-600" />
                <span className="text-orange-900 font-medium font-mono">
                  /MT-AIM-API/客户机构列表
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed top-16 right-8 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold border ${
                toastMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : toastMessage.type === 'warning'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : toastMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : toastMessage.type === 'warning' || toastMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              ) : (
                <Info className="w-4 h-4 text-blue-600" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="px-6 pb-8">
          <CustomerOrgManage
            appName={activeApp.appName}
            appCode={activeApp.appCode}
            appShortName={activeApp.appShortName}
            roleType={activeApp.roleType}
            customerOrgs={customerOrgs}
            onChangeCustomerOrgs={handleCustomerOrgsChange}
            showToast={showToast}
          />
        </div>
      </div>
    </div>
  );
};
