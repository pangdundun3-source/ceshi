/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  Share2,
  Search,
  Plus,
  Edit3,
  Trash2,
  Palette,
  Shield,
  Activity,
  AlertCircle,
  Eye,
  EyeOff,
  Boxes,
  Smartphone,
  CheckSquare,
  X
} from 'lucide-react';
import {
  CustomerOrgItem,
  ProvisionRecordItem,
  CustomerOrgSysSettings,
  CustomerOrgExtUserConfig,
  PRODUCT_VERSIONS_MAP
} from '../data/mockCustomerOrgs';
import { CustomerMenuManage } from './CustomerMenuManage';
import { CustomerUserManage } from './CustomerUserManage';
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

export type CustomerConfigTab =
  | 'system_settings'
  | 'user_management'
  | 'external_user_config'
  | 'role_management'
  | 'menu_config'
  | 'provision_records';

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

  // Tab 标签状态：支持系统设置、用户管理、外部用户使用配置、角色管理、菜单配置、开通记录
  const [activeTab, setActiveTab] = useState<CustomerConfigTab>('system_settings');

  // Toast 提示
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
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

  // ===================== 1. 系统设置状态 =====================
  const [sysSettings, setSysSettings] = useState<CustomerOrgSysSettings>({
    customSystemTitle: customer.sysSettings?.customSystemTitle || `${customer.orgShortName || customer.orgName} · ${customer.productName || appName}业务系统`,
    maxConcurrentSessions: customer.sysSettings?.maxConcurrentSessions || (customer.version === '正式版' ? 100 : 25),
    accountQuota: customer.sysSettings?.accountQuota || customer.accountLimit || (customer.version === '正式版' ? 100 : 20),
    storageQuotaGb: customer.sysSettings?.storageQuotaGb || (customer.version === '正式版' ? 500 : 50),
    sessionTimeoutMinutes: customer.sysSettings?.sessionTimeoutMinutes || 60,
    isolationPolicy: customer.sysSettings?.isolationPolicy || (customer.customerLevel === '省级' ? '租户独立分库' : '多租户逻辑隔离'),
    enableIpWhitelist: customer.sysSettings?.enableIpWhitelist || false,
    ipWhitelist: customer.sysSettings?.ipWhitelist || '117.34.12.0/24\n218.244.11.89',
    enableMfa: customer.sysSettings?.enableMfa || false,
    enableDataDesensitization: customer.sysSettings?.enableDataDesensitization !== false,
    enableMaintenanceNotice: customer.sysSettings?.enableMaintenanceNotice || false,
    alertContactPhone: customer.sysSettings?.alertContactPhone || customer.contactPhone || '139****8866',
    alertContactEmail: customer.sysSettings?.alertContactEmail || 'admin-sec@enterprise.cn'
  });

  const handleSaveSysSettings = () => {
    const updated: CustomerOrgItem = {
      ...customer,
      accountLimit: sysSettings.accountQuota,
      sysSettings: { ...sysSettings }
    };
    onUpdateCustomer?.(updated);
    showToast('机构系统设置已成功保存并下发即时生效！', 'success');
  };

  // ===================== 2. 外部用户使用配置状态 =====================
  const [extUserConfig, setExtUserConfig] = useState<CustomerOrgExtUserConfig>({
    idSource: customer.extUserConfig?.idSource || '企业微信',
    corpId: customer.extUserConfig?.corpId || `wx_${customer.orgCode?.toLowerCase().replace(/-/g, '_') || 'corp_91610'}`,
    appSecret: customer.extUserConfig?.appSecret || 'sec_8f99e3a1023d8c72b',
    callbackUrl: customer.extUserConfig?.callbackUrl || `https://auth.gov.cn/oauth2/callback/${customer.orgCode || 'default'}`,
    scope: customer.extUserConfig?.scope || 'snsapi_base',
    accountMappingField: customer.extUserConfig?.accountMappingField || '手机号',
    syncFrequency: customer.extUserConfig?.syncFrequency || '每日凌晨',
    defaultRole: customer.extUserConfig?.defaultRole || '外部填报员',
    allowGuestApply: customer.extUserConfig?.allowGuestApply !== false,
    dataScope: customer.extUserConfig?.dataScope || '仅本部门',
    lastTestedAt: customer.extUserConfig?.lastTestedAt || '2025-06-18 10:15',
    testStatus: customer.extUserConfig?.testStatus || 'connected',
    latencyMs: customer.extUserConfig?.latencyMs || 35
  });

  const [showSecret, setShowSecret] = useState(false);
  const [isTestingConn, setIsTestingConn] = useState(false);

  const handleTestConnectivity = () => {
    setIsTestingConn(true);
    setTimeout(() => {
      setIsTestingConn(false);
      const now = new Date();
      const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
      setExtUserConfig(prev => ({
        ...prev,
        testStatus: 'connected',
        lastTestedAt: timeStr,
        latencyMs: Math.floor(25 + Math.random() * 20)
      }));
      showToast('对接连通性检测通过：外部身份认证接口响应正常 (延迟 32ms)', 'success');
    }, 700);
  };

  const handleSaveExtUserConfig = () => {
    const updated: CustomerOrgItem = {
      ...customer,
      extUserConfig: { ...extUserConfig }
    };
    onUpdateCustomer?.(updated);
    showToast('外部用户使用配置已成功保存！', 'success');
  };

  // ===================== 3. 开通记录与续期/变更弹窗 =====================
  const [provisionRecords, setProvisionRecords] = useState<ProvisionRecordItem[]>(() => {
    if (customer.provisionRecords && customer.provisionRecords.length > 0) {
      return customer.provisionRecords;
    }
    return [
      {
        id: `pr-${customer.id}-01`,
        recordTime: `${customer.startDate} 09:30`,
        type: customer.version === '正式版' ? '首次开通' : '开通试用',
        productId: customer.productId || 'prod-tq',
        productName: customer.productName || appName || '特情',
        productVersion: customer.productVersion || 'V2.0.0-Release',
        licenseType: customer.version,
        validPeriod: `${customer.startDate} 至 ${customer.expireDate}`,
        operator: customer.salesPerson || '系统管理员',
        remark: customer.remark || (customer.version === '正式版' ? '商业合同正式签约交付开通' : '售前技术评估试用接入'),
        status: '生效中'
      }
    ];
  });

  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [recordType, setRecordType] = useState<ProvisionRecordItem['type']>('期限续费');
  const [recordVersion, setRecordVersion] = useState<string>(customer.productVersion || 'V2.0.0-Release');
  const [recordLicenseType, setRecordLicenseType] = useState<'正式版' | '试用版'>(customer.version);
  const [recordNewExpireDate, setRecordNewExpireDate] = useState<string>('2028-12-31');
  const [recordOperator, setRecordOperator] = useState<string>(customer.salesPerson || '系统管理员');
  const [recordRemark, setRecordRemark] = useState<string>('');

  const handleAddProvisionRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = `${todayStr} ${now.toTimeString().slice(0, 5)}`;

    const newRecord: ProvisionRecordItem = {
      id: `pr-${Date.now()}`,
      recordTime: timeStr,
      type: recordType,
      productId: customer.productId || 'prod-tq',
      productName: customer.productName || appName,
      productVersion: recordVersion,
      licenseType: recordLicenseType,
      validPeriod: `${todayStr} 至 ${recordNewExpireDate}`,
      operator: recordOperator.trim() || '系统管理员',
      remark: recordRemark.trim() || `经办${recordType}，授权变更为${recordLicenseType}`,
      status: '生效中'
    };

    // 将历史的生效中记录置为已升级
    const updatedList = [
      newRecord,
      ...provisionRecords.map(r => r.status === '生效中' ? { ...r, status: '已升级' as const } : r)
    ];
    setProvisionRecords(updatedList);

    // 同步更新机构对象信息
    const updatedCust: CustomerOrgItem = {
      ...customer,
      version: recordLicenseType,
      productVersion: recordVersion,
      expireDate: recordNewExpireDate,
      provisionRecords: updatedList
    };
    onUpdateCustomer?.(updatedCust);

    setIsAddRecordModalOpen(false);
    setRecordRemark('');
    showToast(`开通变更记录已新增，机构服务有效期已同步延长至 ${recordNewExpireDate}`, 'success');
  };

  // Tab 标签配置数组：严格对齐用户要求的6大功能模块
  const tabList: Array<{
    id: CustomerConfigTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeClass?: string;
  }> = [
    { id: 'system_settings', label: '系统设置', icon: Settings },
    { id: 'user_management', label: '用户管理', icon: Users, badge: `${customer.accountUsed || 12}人`, badgeClass: 'bg-slate-100 text-slate-700' },
    { id: 'external_user_config', label: '外部用户使用配置', icon: Share2, badge: '已对接', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { id: 'role_management', label: '角色管理', icon: ShieldCheck, badge: '4个', badgeClass: 'bg-slate-100 text-slate-700' },
    { id: 'menu_config', label: '菜单配置', icon: Menu },
    { id: 'provision_records', label: '开通记录', icon: History, badge: `${provisionRecords.length}条`, badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' }
  ];

  return (
    <div className="flex flex-col animate-in fade-in duration-200" id="customer_app_config_page">
      {/* 1. 顶部返回标签与当前机构/产品上下文提示 */}
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer group"
          id="btn_back_to_customer_list"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>返回机构管理列表</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">所属开通产品：</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-[#1e376b] border border-blue-200 rounded text-xs font-bold">
            <Boxes className="w-3.5 h-3.5" />
            <span>{customer.productName || appName}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {customer.productVersion || 'V2.0.0-Release'}
          </span>
        </div>
      </div>

      {/* 2. 机构核心档案看板卡片 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden mb-4">
        <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 to-white">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {customer.orgShortName || customer.orgName}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                customer.version === '正式版'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {customer.version}
              </span>
              {isEnabled ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  运行中
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <Lock className="w-3 h-3 text-slate-400" />
                  已关停
                </span>
              )}
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

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-[11px] text-slate-500 font-bold">授权有效期限</span>
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

        {/* 3. 六大功能 Tab 标签切换栏 */}
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

        {/* 4. 详情配置工作区内容渲染 */}
        <div className="p-6 bg-white min-h-[460px] flex flex-col">

          {/* ======================= Tab 1: 系统设置 ======================= */}
          {activeTab === 'system_settings' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-150" id="tab_content_sys_settings">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-sky-600" />
                    <span>机构专属「系统设置」</span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      参数与运行策略
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    为「{customer.orgShortName || customer.orgName}」定制在产品【{customer.productName || appName}】中的运行参数、配额与安全隔离策略
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveSysSettings}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  id="btn_save_sys_settings"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存系统设置</span>
                </button>
              </div>

              {/* 基础信息与门户展示 */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>基础参数与个性化标题</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">机构系统定制展示名称</label>
                    <input
                      type="text"
                      value={sysSettings.customSystemTitle || ''}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, customSystemTitle: e.target.value }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                      placeholder="输入该机构定制的首页显示名称"
                    />
                    <span className="text-[11px] text-slate-400">将显示在顶部导航与登录欢迎页标题</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">开通产品及对应版本</label>
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-slate-800">
                      <span className="font-bold">{customer.productName || appName}</span>
                      <span className="font-mono text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-bold">
                        {customer.productVersion || 'V2.0.0-Release'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">如需版本升级可在「开通记录」标签中变更</span>
                  </div>
                </div>
              </div>

              {/* 配额与并发控制 */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>资源配额与并发限制</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">最大并发在线会话</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={sysSettings.maxConcurrentSessions}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, maxConcurrentSessions: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                      />
                      <span className="absolute right-3 text-slate-400 text-xs">个</span>
                    </div>
                    <span className="text-[10px] text-slate-400">限制该机构成员同时在线并发</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">机构成员账号上限</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={sysSettings.accountQuota}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, accountQuota: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                      />
                      <span className="absolute right-3 text-slate-400 text-xs">人</span>
                    </div>
                    <span className="text-[10px] text-slate-400">已使用: {customer.accountUsed || 12} 人</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">数据与附件存储配额</label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={sysSettings.storageQuotaGb}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, storageQuotaGb: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                      />
                      <span className="absolute right-3 text-slate-400 text-xs">GB</span>
                    </div>
                    <span className="text-[10px] text-slate-400">包含文档、影像及研判归档数据</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">无操作会话超时登出</label>
                    <select
                      value={sysSettings.sessionTimeoutMinutes}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, sessionTimeoutMinutes: Number(e.target.value) }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value={15}>15 分钟</option>
                      <option value={30}>30 分钟</option>
                      <option value={60}>1 小时</option>
                      <option value={120}>2 小时</option>
                      <option value={480}>8 小时 (工作日免登)</option>
                    </select>
                    <span className="text-[10px] text-slate-400">静止空闲后强制重新认证</span>
                  </div>
                </div>
              </div>

              {/* 安全与隔离策略 */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>数据安全与租户隔离策略</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">租户数据隔离等级</label>
                    <select
                      value={sysSettings.isolationPolicy}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, isolationPolicy: e.target.value as any }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value="租户独立分库">租户独立分库 (最高安全性物理隔离)</option>
                      <option value="独立专区VPC">独立专区 VPC (政企私网通道)</option>
                      <option value="多租户逻辑隔离">多租户逻辑隔离 (标准云服务模式)</option>
                    </select>
                    <span className="text-[10px] text-slate-400">保障政企敏感业务数据安全独立存储</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700">IP 访问白名单</label>
                      <input
                        type="checkbox"
                        checked={sysSettings.enableIpWhitelist}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, enableIpWhitelist: e.target.checked }))}
                        className="accent-blue-600 rounded cursor-pointer w-4 h-4"
                      />
                    </div>
                    <textarea
                      rows={2}
                      disabled={!sysSettings.enableIpWhitelist}
                      value={sysSettings.ipWhitelist || ''}
                      onChange={(e) => setSysSettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                      placeholder="支持每行输入一个企业出口 IP 或 CIDR 网段"
                      className="px-2.5 py-1.5 bg-white disabled:bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-xs text-slate-800 resize-none"
                    />
                    <span className="text-[10px] text-slate-400">开启后仅白名单网段允许登录系统</span>
                  </div>

                  <div className="flex flex-col gap-3 justify-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sysSettings.enableMfa}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, enableMfa: e.target.checked }))}
                        className="accent-blue-600 rounded w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">双因子登录认证 (MFA)</span>
                        <span className="text-[10px] text-slate-500">登录时需手机短信或动态令牌二次校验</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sysSettings.enableDataDesensitization}
                        onChange={(e) => setSysSettings(prev => ({ ...prev, enableDataDesensitization: e.target.checked }))}
                        className="accent-blue-600 rounded w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-slate-800 block">敏感信息脱敏显示</span>
                        <span className="text-[10px] text-slate-500">身份证、手机号、涉密线索默认打码脱敏</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= Tab 2: 用户管理 ======================= */}
          {activeTab === 'user_management' && (
            <div className="animate-in fade-in duration-150" id="tab_content_user_manage">
              <CustomerUserManage
                customerOrgName={customer.orgShortName || customer.orgName}
                customerOrgCode={customer.orgCode}
                appName={customer.productName || appName}
              />
            </div>
          )}

          {/* ======================= Tab 3: 外部用户使用配置 ======================= */}
          {activeTab === 'external_user_config' && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-150" id="tab_content_ext_user_config">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>外部用户使用配置</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      单点登录 (SSO) 与外部身份对接
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    配置「{customer.orgShortName || customer.orgName}」与企业微信、钉钉、飞书或自建统一认证中心的免密单点登录与权限映射
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestConnectivity}
                    disabled={isTestingConn}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isTestingConn ? 'animate-spin text-blue-600' : ''}`} />
                    <span>{isTestingConn ? '连通性检测中...' : '测试连通性'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveExtUserConfig}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    id="btn_save_ext_user_config"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>保存使用配置</span>
                  </button>
                </div>
              </div>

              {/* 连通性状态横条 */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900">外部身份源对接链路运行正常</span>
                    <span className="text-[11px] text-emerald-700 ml-2">
                      上次连通检测：{extUserConfig.lastTestedAt} · 响应延迟: {extUserConfig.latencyMs}ms
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                  已连接生效
                </span>
              </div>

              {/* 认证协议与租户凭据 */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>对接身份源与认证凭证</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">外部身份源系统</label>
                    <select
                      value={extUserConfig.idSource}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, idSource: e.target.value as any }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value="企业微信">企业微信 (WeCom SSO)</option>
                      <option value="钉钉">钉钉 (DingTalk)</option>
                      <option value="飞书">飞书 (Lark/Feishu)</option>
                      <option value="自建CAS/OAuth">客户自建 CAS / OAuth2 平台</option>
                      <option value="OIDC/LDAP">标准 OIDC / LDAP 协议</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">外部租户识别号 (CorpID / AppID)</label>
                    <input
                      type="text"
                      value={extUserConfig.corpId}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, corpId: e.target.value }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">对接凭据密钥 (AppSecret)</label>
                    <div className="relative flex items-center">
                      <input
                        type={showSecret ? 'text' : 'password'}
                        value={extUserConfig.appSecret}
                        onChange={(e) => setExtUserConfig(prev => ({ ...prev, appSecret: e.target.value }))}
                        className="w-full pl-3 pr-16 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-slate-800"
                      />
                      <div className="absolute right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowSecret(!showSecret)}
                          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          title={showSecret ? '隐藏密钥' : '显示密钥'}
                        >
                          {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopy(extUserConfig.appSecret, 'appSecret')}
                          className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                          title="复制密钥"
                        >
                          {copiedField === 'appSecret' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">外部认证授权回调地址 (Callback URL)</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={extUserConfig.callbackUrl}
                        onChange={(e) => setExtUserConfig(prev => ({ ...prev, callbackUrl: e.target.value }))}
                        className="w-full pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(extUserConfig.callbackUrl, 'callbackUrl')}
                        className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="复制回调地址"
                      >
                        {copiedField === 'callbackUrl' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">授权作用域 (Scope)</label>
                    <select
                      value={extUserConfig.scope}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, scope: e.target.value }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                    >
                      <option value="snsapi_base">snsapi_base (静默免密授权)</option>
                      <option value="snsapi_userinfo">snsapi_userinfo (获取外部昵称头像)</option>
                      <option value="corp_internal_sso">corp_internal_sso (企业专线免登)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 用户映射与权限策略 */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>外部用户映射与权限授权策略</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">账号唯一匹配映射字段</label>
                    <select
                      value={extUserConfig.accountMappingField}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, accountMappingField: e.target.value as any }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value="手机号">手机号码 (推荐政企常用)</option>
                      <option value="工号">员工工号 (匹配 HR 组织)</option>
                      <option value="邮箱">企业电子邮箱</option>
                      <option value="外部UnionID">外部系统唯一 UnionID</option>
                    </select>
                    <span className="text-[10px] text-slate-400">用于自动绑定内部系统成员</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">外部组织架构自动同步频次</label>
                    <select
                      value={extUserConfig.syncFrequency}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, syncFrequency: e.target.value as any }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value="每日凌晨">每日凌晨 (02:00 自动拉取)</option>
                      <option value="每4小时">每 4 小时增量同步</option>
                      <option value="每小时">每小时高频同步</option>
                      <option value="仅手动同步">仅手动触发同步</option>
                    </select>
                    <span className="text-[10px] text-slate-400">自动拉取部门与任职人员变动</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">外部首次登录默认角色</label>
                    <select
                      value={extUserConfig.defaultRole}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, defaultRole: e.target.value }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value="外部填报员">外部填报员 (仅限提交工单)</option>
                      <option value="普通业务访客">普通业务访客 (只读看板)</option>
                      <option value="外部协同督查员">外部协同督查员 (协助处置)</option>
                    </select>
                    <span className="text-[10px] text-slate-400">管理员可随时在角色管理调整</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-700">外部人员数据可见范围</label>
                    <select
                      value={extUserConfig.dataScope}
                      onChange={(e) => setExtUserConfig(prev => ({ ...prev, dataScope: e.target.value as any }))}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    >
                      <option value="仅本部门">仅本部门可见 (严格边界)</option>
                      <option value="全机构跨部门协同">全机构跨部门协同处理</option>
                    </select>
                    <span className="text-[10px] text-slate-400">控制外部成员可查阅的线索</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= Tab 4: 角色管理 ======================= */}
          {activeTab === 'role_management' && (
            <div className="flex flex-col animate-in fade-in duration-150" id="tab_content_role_manage">
              <UnifiedOrgRoleManageView
                customerOrg={customer}
                isStandalonePage={false}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* ======================= Tab 5: 菜单配置 ======================= */}
          {activeTab === 'menu_config' && (
            <div className="flex flex-col animate-in fade-in duration-150" id="tab_content_menu_manage">
              <CustomerMenuManage
                customerOrgName={customer.orgShortName || customer.orgName}
                customerOrgCode={customer.orgCode}
                appName={customer.productName || appName}
                appCode={customer.productCode || appCode}
                productVersion={customer.productVersion}
                licenseType={customer.licenseType}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* ======================= Tab 6: 开通记录 ======================= */}
          {activeTab === 'provision_records' && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-150" id="tab_content_provision_records">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>机构产品开通与变更历史流水</span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      审计存证
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    记录「{customer.orgShortName || customer.orgName}」从首次开通、产品版本升级、期限续费至正式交付的全周期记录
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  id="btn_add_provision_record"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>录入开通 / 续期变更</span>
                </button>
              </div>

              {/* 开通流水表格 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-3.5">记录时间</th>
                      <th className="py-3 px-3">操作类型</th>
                      <th className="py-3 px-3">开通产品</th>
                      <th className="py-3 px-3">开通软件版本</th>
                      <th className="py-3 px-3">授权模式</th>
                      <th className="py-3 px-3">有效期限</th>
                      <th className="py-3 px-3">经办人员</th>
                      <th className="py-3 px-3">变更说明 / 备注</th>
                      <th className="py-3 px-3 text-right">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {provisionRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-slate-500 whitespace-nowrap">
                          {rec.recordTime}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            rec.type === '首次开通' || rec.type === '转正式版'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : rec.type === '版本升级'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : rec.type === '期限续费'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {rec.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {rec.productName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                            {rec.productVersion}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rec.licenseType === '正式版'
                              ? 'text-purple-700 bg-purple-50 border border-purple-200'
                              : 'text-amber-700 bg-amber-50 border border-amber-200'
                          }`}>
                            {rec.licenseType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-600">
                          {rec.validPeriod}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                          {rec.operator}
                        </td>
                        <td className="py-3 px-3 text-slate-500 max-w-xs truncate" title={rec.remark}>
                          {rec.remark || '-'}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {rec.status === '生效中' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              当前生效
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                              {rec.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 5. 录入开通 / 续期变更弹窗 */}
      {isAddRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">录入开通 / 续期变更</h3>
                  <p className="text-[11px] text-slate-500">为「{customer.orgShortName || customer.orgName}」增加开通履约流水</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddRecordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProvisionRecord} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">操作类型 *</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                >
                  <option value="期限续费">期限续费 (延长服务有效期)</option>
                  <option value="版本升级">版本升级 (升级至新功能版本)</option>
                  <option value="转正式版">转正式版 (试用结束商业转正)</option>
                  <option value="开通试用">开通试用 (新增试用评估)</option>
                  <option value="功能变更">功能变更 (规格及配额调整)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">开通对应的软件版本 *</label>
                <input
                  type="text"
                  required
                  value={recordVersion}
                  onChange={(e) => setRecordVersion(e.target.value)}
                  placeholder="例如：V2.0.0-Release"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">授权模式 *</label>
                  <select
                    value={recordLicenseType}
                    onChange={(e) => setRecordLicenseType(e.target.value as any)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    <option value="正式版">正式版</option>
                    <option value="试用版">试用版</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">新服务到期日 *</label>
                  <input
                    type="date"
                    required
                    value={recordNewExpireDate}
                    onChange={(e) => setRecordNewExpireDate(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">经办人员</label>
                <input
                  type="text"
                  value={recordOperator}
                  onChange={(e) => setRecordOperator(e.target.value)}
                  placeholder="经办销售或管理员姓名"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">变更说明 / 备注</label>
                <textarea
                  rows={2}
                  value={recordRemark}
                  onChange={(e) => setRecordRemark(e.target.value)}
                  placeholder="填写合同编号、升级说明或试用评估事项"
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-2xs cursor-pointer"
                >
                  确认录入变更
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. 全局 Toast 提示条 */}
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
