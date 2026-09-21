/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerOrgItem, INITIAL_CUSTOMER_ORGS } from '../data/mockCustomerOrgs';
import { Layout, Building2, Save, Upload, Palette, CheckCircle2 } from 'lucide-react';

export const UnifiedOrgUISettingsView: React.FC = () => {
  const [customerOrgs] = useState<CustomerOrgItem[]>(INITIAL_CUSTOMER_ORGS);
  const [selectedCustId, setSelectedCustId] = useState<string>(INITIAL_CUSTOMER_ORGS[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCustomer =
    customerOrgs.find((c) => c.id === selectedCustId) || customerOrgs[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_org_ui_settings_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* 顶部面包屑与标题栏 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_org_ui_header_bar"
        >
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">统一组件库管理</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">机构界面设置</span>
            </nav>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                机构界面设置
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">切换机构:</span>
              <select
                value={selectedCustId}
                onChange={(e) => setSelectedCustId(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-bold rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {customerOrgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.orgShortName || org.orgName} ({org.orgCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 机构界面配置卡片 */}
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-sky-600" />
                  <span>机构专属界面与主题定制</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  为「{currentCustomer.orgShortName || currentCustomer.orgName}」定制登录页 Logo、主色调风格及前端显示元素
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('✓ 机构专属界面设置已保存成功！')}
                className="px-4 py-2 bg-[#1e376b] hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-3.5 h-3.5" />
                <span>应用界面设置</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Logo 定制 */}
              <div className="p-5 bg-sky-50/40 rounded-xl border border-sky-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>专属机构品牌 Logo 定制</span>
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-bold text-sky-800 text-sm shadow-2xs">
                    {currentCustomer.orgShortName?.substring(0, 4) || 'LOGO'}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => showToast('已模拟触发 Logo 上传窗口')}
                      className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg text-xs font-bold cursor-pointer self-start"
                    >
                      上传定制 Logo
                    </button>
                    <span className="text-[10px] text-slate-400">推荐尺寸 240x80px，支持 PNG / SVG / WebP</span>
                  </div>
                </div>
              </div>

              {/* 主题色调 */}
              <div className="p-5 bg-sky-50/40 rounded-xl border border-sky-100 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-sky-600" />
                  <span>应用顶部导航栏主色调</span>
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#1e376b] border-2 border-white shadow-xs"></span>
                    <span className="text-xs font-bold text-slate-800">经典科技藏蓝 (默认)</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    #1E376B
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
