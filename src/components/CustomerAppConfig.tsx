/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Sliders,
  Settings,
  ShieldCheck,
  KeyRound,
  Layers,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info,
  HelpCircle,
  Check,
  Copy,
  RefreshCw,
  Save,
  FileCode,
  Globe,
  SlidersHorizontal,
  FolderTree,
  Database,
  Users,
  Menu,
  History,
  FileText,
  Share2,
  Search,
  Plus,
  Edit3,
  Trash2,
  Palette,
  Shield,
  Activity,
  AlertCircle
} from 'lucide-react';
import { CustomerOrgItem } from '../data/mockCustomerOrgs';
import { CustomerMenuManage } from './CustomerMenuManage';
import { CustomerUserManage } from './CustomerUserManage';
import { CustomerPermissionDictManage } from './CustomerPermissionDictManage';
import { UnifiedOrgRoleManageView } from './UnifiedOrgRoleManageView';

export interface CustomerAppConfigProps {
  customer: CustomerOrgItem;
  appName: string;
  appCode: string;
  appShortName?: string;
  roleType?: 'with_role' | 'no_role';
  onBack: () => void;
  onUpdateCustomer?: (updated: CustomerOrgItem) => void;
}

export const CustomerAppConfig: React.FC<CustomerAppConfigProps> = ({
  customer,
  appName,
  appCode,
  appShortName,
  roleType = 'with_role',
  onBack,
  onUpdateCustomer
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Tab标签状态
  const [activeTab, setActiveTab] = useState<
    | 'system_settings'
    | 'user_management'
    | 'menu_settings'
    | 'trial_records'
    | 'op_logs'
    | 'perm_dict'
    | 'role_management'
    | 'external_user_system'
  >('system_settings');

  // Toast 提示
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const isEnabled = customer.isEnabled ?? (customer.status !== 'disabled');

  // 计算距离到期天数
  const getDaysUntilExpire = (expireDateStr: string) => {
    if (!expireDateStr) return { days: 0, isExpired: false, text: '' };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expireDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { days: diffDays, isExpired: true, text: `(${diffDays}天)` };
    }
    return { days: diffDays, isExpired: false, text: `(${diffDays}天)` };
  };

  const expireInfo = getDaysUntilExpire(customer.expireDate);

  // Tab 标签配置数组
  const tabList = [
    { id: 'system_settings', label: '系统设置', icon: Settings },
    { id: 'user_management', label: '用户管理', icon: Users, badge: '12人', badgeClass: 'bg-slate-100 text-slate-700' },
    { id: 'menu_settings', label: '菜单设置(不做)', icon: Menu },
    { id: '试用记录', idKey: 'trial_records', label: '试用记录(不做)', icon: History },
    { id: '操作日志', idKey: 'op_logs', label: '操作日志(不做)', icon: FileText },
    { id: '权限字典', idKey: 'perm_dict', label: '权限字典', icon: KeyRound },
    { id: '角色管理', idKey: 'role_management', label: '角色管理', icon: ShieldCheck, badge: '4个', badgeClass: 'bg-slate-100 text-slate-700' },
    { id: '外部用户体系配置', idKey: 'external_user_system', label: '外部用户体系配置', icon: Share2, badge: '已对接', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' }
  ].map(t => ({
    id: (t.idKey || t.id) as typeof activeTab,
    label: t.label,
    icon: t.icon,
    badge: t.badge,
    badgeClass: t.badgeClass
  }));

  return (
    <div className="flex flex-col animate-in fade-in duration-200" id="customer_app_config_page">
      
      {/* 1. 紧挨客户信息介绍容器边框左上角的返回标签 (从边框向上凸起贴合，无独立按钮样式) */}
      <div className="flex items-center pl-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100/80 px-3.5 py-1.5 rounded-t-lg border-t border-l border-r border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer shadow-[0_-2px_4px_rgba(0,0,0,0.02)] group -mb-[1px] relative z-10 select-none"
          id="btn_back_to_customer_list"
          title="点击返回客户机构列表"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 group-hover:-translate-x-0.5 transition-transform" />
          <span>返回客户机构列表</span>
        </button>
      </div>

      {/* 2. 合为一体的主容器 (包含：客户信息介绍 + 中间Tab导航 + 底部该客户应用配置页) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden" id="customer_unified_config_container">
        
        {/* =================================== 上部：客户信息介绍 =================================== */}
        <div className="p-6 bg-gradient-to-b from-slate-50/50 via-white to-white border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* 大字显示客户简称 */}
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {customer.orgShortName || customer.orgName}
                </h1>

                {/* 客户ID徽章，点击可直接复制 */}
                <button
                  type="button"
                  onClick={() => handleCopy(customer.orgCode || customer.id, 'orgCode')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs group"
                  title="点击复制客户ID"
                  id="btn_copy_customer_id"
                >
                  <span className="text-slate-400 font-sans font-medium text-[11px]">客户ID:</span>
                  <span>{customer.orgCode || customer.id}</span>
                  {copiedField === 'orgCode' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
                  )}
                </button>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  customer.version === '正式版'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {customer.version}
                </span>
                {isEnabled ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    已开通运行中
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <Lock className="w-3 h-3 text-slate-400" />
                    已关停
                  </span>
                )}
              </div>

              {/* 客户全称 */}
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                {customer.orgName}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mt-0.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-sans">统一社会信用代码:</span>
                  <span className="text-slate-800 font-bold">{customer.creditCode}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(customer.creditCode, 'creditCode')}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="复制信用代码"
                  >
                    {copiedField === 'creditCode' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 font-sans">
                  <span className="text-slate-400">统计单元:</span>
                  <span className="text-slate-800 font-bold">{customer.statUnit}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 font-sans">
                  <span className="text-slate-400">负责销售:</span>
                  <span className="text-slate-800 font-bold">{customer.salesPerson}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end group/tip relative">
                    <span className="text-[11px] text-slate-500 font-bold">综合服务有效期</span>
                    <div className="relative inline-flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-help transition-colors">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {/* 悬停提示内容浮层 */}
                      <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-80 p-3 bg-slate-900/95 text-white text-[11px] font-normal leading-relaxed rounded-xl shadow-xl opacity-0 group-hover/tip:opacity-100 transition-all duration-200 z-50 translate-y-1 group-hover/tip:translate-y-0 text-left border border-slate-700 backdrop-blur-xs">
                        系统依据机构下最后到期的应用，确定机构登录 V8 系统的最终时效；但不影响单应用登录权限，用户能否登录应用以该应用自身配置的到期时间为准。
                        <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-slate-900/95" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold mt-0.5 flex items-center gap-1 justify-end">
                    <span className={expireInfo.isExpired ? 'text-rose-600' : 'text-slate-800'}>
                      {customer.expireDate}
                    </span>
                    <span className={expireInfo.isExpired ? 'text-rose-600 font-bold' : 'text-slate-500 font-medium'}>
                      {expireInfo.text}
                    </span>
                  </div>
                </div>
                <Calendar className={`w-5 h-5 shrink-0 ${expireInfo.isExpired ? 'text-rose-500' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* =================================== 中间：Tab 标签导航栏 =================================== */}
        {/* 浅蓝色统一设计风格 */}
        <div className="bg-sky-50/50 border-b border-sky-100 px-5 pt-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {tabList.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer relative border rounded-lg shadow-2xs select-none ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-black ring-2 ring-sky-500/20'
                    : 'bg-white hover:bg-sky-50/80 text-slate-600 hover:text-sky-700 border-slate-200/90 hover:border-sky-200'
                }`}
                id={`tab_customer_config_${tab.id}`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badgeClass || 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* =================================== 下部：该客户专属应用配置工作区 =================================== */}
        <div className="p-6 bg-white min-h-[440px] flex flex-col gap-6">
          
          {/* 1. 系统设置面板 */}
          {activeTab === 'system_settings' && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-sky-600" />
                    <span>该客户的「系统设置」</span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      运行参数配置
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    为「{customer.orgShortName || customer.orgName}」定制在应用【{appName || '当前应用'}】中的运行参数与策略配置
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('系统设置已保存')}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存设置</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">机构版本模式</span>
                    <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {customer.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    当前开通版本为 {customer.version}，享有该版本对应的全量功能与资源配额。
                  </p>
                </div>

                <div className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">最大并发会话限制</span>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      100 会话
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    限制该机构同时在线的用户并发数，超出时排队或提示。
                  </p>
                </div>

                <div className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">独立数据隔离策略</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      租户独立分库
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    为该客户分配独立的数据存储集，确保业务数据物理隔离与高安全性。
                  </p>
                </div>

                <div className="p-4 bg-sky-50/30 rounded-xl border border-sky-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">IP 访问白名单</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                      未开启 (全部允许)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    开启后仅允许该客户登记的企业固定出口 IP 段访问应用。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. 用户管理面板：3项统计卡片 + 微信头像与成员数据表格 */}
          {activeTab === 'user_management' && (
            <CustomerUserManage
              customerOrgName={customer.orgShortName || customer.orgName}
              customerOrgCode={customer.orgCode}
              appName={appName}
            />
          )}

          {/* 3. 菜单设置面板：客户系统菜单设置 */}
          {activeTab === 'menu_settings' && (
            <CustomerMenuManage
              customerOrgName={customer.orgShortName || customer.orgName}
              customerOrgCode={customer.orgCode}
              appName={appName}
              appCode={appCode}
            />
          )}

          {/* 4. 试用记录面板 */}
          {activeTab === 'trial_records' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-700" />
                    <span>试用开通与延期历史记录</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    查看客户「{customer.orgShortName || customer.orgName}」在当前应用的历史开通、试用及转正日志
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2.5 px-3.5">记录时间</th>
                      <th className="py-2.5 px-3">变更类型</th>
                      <th className="py-2.5 px-3">开通版本</th>
                      <th className="py-2.5 px-3">有效期限</th>
                      <th className="py-2.5 px-3">经办销售/管理员</th>
                      <th className="py-2.5 px-3">备注说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3.5 font-mono text-slate-500">2025-01-01 09:30</td>
                      <td className="py-2.5 px-3 font-bold text-purple-700">正式开通</td>
                      <td className="py-2.5 px-3">正式版</td>
                      <td className="py-2.5 px-3 font-mono">{customer.startDate} 至 {customer.expireDate}</td>
                      <td className="py-2.5 px-3">{customer.salesPerson}</td>
                      <td className="py-2.5 px-3 text-slate-500">项目一期正式合同交付签署</td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3.5 font-mono text-slate-500">2024-10-15 14:20</td>
                      <td className="py-2.5 px-3 font-bold text-amber-700">试用开通</td>
                      <td className="py-2.5 px-3">试用版</td>
                      <td className="py-2.5 px-3 font-mono">2024-10-15 至 2024-12-31</td>
                      <td className="py-2.5 px-3">{customer.salesPerson}</td>
                      <td className="py-2.5 px-3 text-slate-500">售前方案验证与领导试用</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. 操作日志面板 */}
          {activeTab === 'op_logs' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>机构专属操作审计日志</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    追踪该客户机构在应用内的管理员操作轨迹与安全审计事件
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                {[
                  { time: '2026-09-10 11:25:30', user: '张华(系统管理员)', action: '更新了应用综合服务有效期', ip: '192.168.1.102' },
                  { time: '2026-09-08 16:40:12', user: '王立新(机构超管)', action: '为用户「李梅」分配了「业务主管」角色', ip: '117.34.22.18' },
                  { time: '2026-09-05 09:12:05', user: '夏小花(负责销售)', action: '更新了客户机构统一信用代码与归属单元', ip: '117.34.22.99' },
                  { time: '2026-09-01 10:00:00', user: '系统调度', action: '执行了月初机构授权配额自动核验', ip: '127.0.0.1' }
                ].map((log, i) => (
                  <div key={i} className="p-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 text-[11px]">{log.time}</span>
                      <span className="font-bold text-slate-900">{log.user}</span>
                      <span className="text-slate-700">{log.action}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[10px] bg-slate-100 px-2 py-0.5 rounded">{log.ip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. 权限字典面板 */}
          {activeTab === 'perm_dict' && (
            <div className="animate-in fade-in duration-150">
              <CustomerPermissionDictManage
                customerOrgName={customer.orgShortName || customer.orgName}
                customerOrgCode={customer.orgCode}
                appCode={appCode}
                appName={appName}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* 8. 角色管理面板 (统一调用组件 -> 机构角色管理) */}
          {activeTab === 'role_management' && (
            <div className="flex flex-col animate-in fade-in duration-150">
              <UnifiedOrgRoleManageView
                customerOrg={customer}
                isStandalonePage={false}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* 9. 外部用户体系配置面板 */}
          {activeTab === 'external_user_system' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-slate-700" />
                    <span>外部用户体系与单点登录（SSO）配置</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">已连接生效</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    为「{customer.orgShortName || customer.orgName}」对接企业微信/钉钉/自建统一认证中心
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存对接配置</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">对接认证协议</span>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">OAuth 2.0 / OIDC</span>
                  </div>
                  <p className="text-[11px] text-slate-500">支持通过标准授权码流程实现免密登录与用户同步。</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">外部身份源唯一租户标识</span>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      wx_corp_91610131
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">用于匹配该客户机构企业微信或钉钉的 CorpID。</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 浮动 Toast 提示 */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border-emerald-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-amber-50 border-amber-700'
                : 'bg-slate-900 text-slate-50 border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

