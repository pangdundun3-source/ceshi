/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  AppWindow,
  Briefcase,
  Layers,
  MapPin,
  Tag,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { CustomerOrgItem, INITIAL_CUSTOMER_ORGS, STATISTICAL_UNITS } from '../data/mockCustomerOrgs';
import { CustomerAppConfig } from './CustomerAppConfig';

interface AppOption {
  id: string;
  name: string;
  code: string;
  shortName: string;
  roleType: 'with_role' | 'no_role';
}

const APPS_LIST: AppOption[] = [
  { id: 'app-yq', name: '舆情分析与全网监测预警系统', code: 'yq_monitor_sys', shortName: '舆情系统', roleType: 'with_role' },
  { id: 'app-wxb', name: '微小宝微信营销智能助手', code: 'wxb_marketing_bot', shortName: '微小宝', roleType: 'with_role' },
  { id: 'app-cw', name: '数智财务共享协同中心', code: 'cw_finance_center', shortName: '数智财务', roleType: 'with_role' },
  { id: 'app-oa', name: '企业数字化协同办公平台', code: 'oa_collab_platform', shortName: '协同办公', roleType: 'no_role' }
];

export const AppInnerCustomerList: React.FC = () => {
  // Current Selected App
  const [selectedApp, setSelectedApp] = useState<AppOption>(APPS_LIST[0]);

  // Customer List Data State
  const [customerOrgs, setCustomerOrgs] = useState<CustomerOrgItem[]>(INITIAL_CUSTOMER_ORGS);

  // Filter States
  const [custSearchQuery, setCustSearchQuery] = useState('');
  const [custStatusFilter, setCustStatusFilter] = useState<string>('全部');
  const [custStatUnitFilter, setCustStatUnitFilter] = useState<string>('全部');
  const [custCategoryFilter, setCustCategoryFilter] = useState<string>('全部');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPageInput, setJumpPageInput] = useState('1');

  // Selected customer for Management Config
  const [selectedCustForConfig, setSelectedCustForConfig] = useState<CustomerOrgItem | null>(null);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = customerOrgs.length;
    const active = customerOrgs.filter(c => c.status === 'active').length;
    const expired = customerOrgs.filter(c => c.status === 'expired').length;
    const disabled = customerOrgs.filter(c => c.status === 'disabled').length;
    const trash = customerOrgs.filter(c => c.status === 'trash').length;
    return { total, active, expired, disabled, trash };
  }, [customerOrgs]);

  // Expiration helper
  const getDaysRemaining = (expireDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expireDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      days: diffDays,
      isExpired: diffDays < 0
    };
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return customerOrgs.filter(cust => {
      // Search query
      if (custSearchQuery.trim()) {
        const q = custSearchQuery.trim().toLowerCase();
        const matchName = cust.orgName.toLowerCase().includes(q);
        const matchShortName = (cust.orgShortName || '').toLowerCase().includes(q);
        const matchCode = cust.orgCode.toLowerCase().includes(q);
        const matchCredit = cust.creditCode.toLowerCase().includes(q);
        const matchSales = cust.salesPerson.toLowerCase().includes(q);
        if (!matchName && !matchShortName && !matchCode && !matchCredit && !matchSales) {
          return false;
        }
      }

      // Status filter
      if (custStatusFilter !== '全部' && cust.status !== custStatusFilter) {
        return false;
      }

      // Statistical Unit filter
      if (custStatUnitFilter !== '全部' && cust.statUnit !== custStatUnitFilter) {
        return false;
      }

      // Category filter
      if (custCategoryFilter !== '全部' && cust.customerCategory !== custCategoryFilter) {
        return false;
      }

      return true;
    });
  }, [customerOrgs, custSearchQuery, custStatusFilter, custStatUnitFilter, custCategoryFilter]);

  // Paginated List
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Reset Filters
  const handleResetFilters = () => {
    setCustSearchQuery('');
    setCustStatusFilter('全部');
    setCustStatUnitFilter('全部');
    setCustCategoryFilter('全部');
    setCurrentPage(1);
    setJumpPageInput('1');
  };

  // If in Management Detail View
  if (selectedCustForConfig) {
    return (
      <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-6">
        <CustomerAppConfig
          customer={selectedCustForConfig}
          appName={selectedApp.name}
          appCode={selectedApp.code}
          appShortName={selectedApp.shortName}
          roleType={selectedApp.roleType}
          onBack={() => setSelectedCustForConfig(null)}
          onUpdateCustomer={(updated) => {
            setCustomerOrgs(prev => prev.map(c => c.id === updated.id ? updated : c));
            setSelectedCustForConfig(updated);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 flex flex-col gap-5 text-slate-800" id="app_inner_cust_page">
      
      {/* 顶部标题与当前应用选择器 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <AppWindow className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>各应用内的界面 · 客户机构列表</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                独立查看并维护各业务系统下的开通客户、授权期限及专属配置
              </p>
            </div>
          </div>
        </div>

        {/* 应用切换器 */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shrink-0">
          <span className="text-xs font-bold text-slate-500 pl-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>当前归属应用：</span>
          </span>
          <select
            value={selectedApp.id}
            onChange={(e) => {
              const target = APPS_LIST.find(a => a.id === e.target.value);
              if (target) setSelectedApp(target);
            }}
            className="text-xs font-bold text-[#1e376b] bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            id="select_current_app"
          >
            {APPS_LIST.map(app => (
              <option key={app.id} value={app.id}>
                {app.name} ({app.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 顶部数据卡片：5 大统计指标 (支持点击穿透筛选) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        
        {/* 1. 客户总数 */}
        <div
          onClick={() => {
            setCustStatusFilter('全部');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === '全部'
              ? 'border-[#1e376b] ring-2 ring-[#1e376b]/20 shadow-md bg-blue-50/10'
              : 'border-slate-200/90 hover:border-blue-400 hover:shadow-sm'
          }`}
        >
          <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span className="group-hover:text-blue-700 transition-colors">客户总数</span>
            <Building2 className={`w-4 h-4 ${custStatusFilter === '全部' ? 'text-[#1e376b]' : 'text-blue-600'}`} />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{stats.total}</span>
            <span className="text-xs font-bold text-slate-400">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded w-fit">
              全域覆盖机构
            </span>
            {custStatusFilter === '全部' && (
              <span className="text-[10px] text-[#1e376b] font-bold">已筛选</span>
            )}
          </div>
        </div>

        {/* 2. 已开通数 (运行中) */}
        <div
          onClick={() => {
            setCustStatusFilter('active');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'active'
              ? 'border-emerald-600 ring-2 ring-emerald-500/25 shadow-md bg-emerald-50/30'
              : 'border-emerald-200/90 bg-emerald-50/15 hover:border-emerald-500 hover:shadow-sm'
          }`}
        >
          <span className="text-xs font-bold text-emerald-700 flex items-center justify-between">
            <span className="group-hover:text-emerald-800 transition-colors">已开通数 (运行中)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">{stats.active}</span>
            <span className="text-xs font-bold text-emerald-600">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded w-fit">
              正常服务中
            </span>
            {custStatusFilter === 'active' && (
              <span className="text-[10px] text-emerald-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>

        {/* 3. 试用中 */}
        <div
          onClick={() => {
            setCustStatusFilter('expired');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'expired'
              ? 'border-amber-500 ring-2 ring-amber-400/25 shadow-md bg-amber-50/40'
              : 'border-amber-200/90 bg-amber-50/15 hover:border-amber-400 hover:shadow-sm'
          }`}
        >
          <span className="text-xs font-bold text-amber-700 flex items-center justify-between">
            <span className="group-hover:text-amber-800 transition-colors">试用中</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-amber-700 font-mono">{stats.expired}</span>
            <span className="text-xs font-bold text-amber-600">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded w-fit">
              试用期观察
            </span>
            {custStatusFilter === 'expired' && (
              <span className="text-[10px] text-amber-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>

        {/* 4. 已关停 */}
        <div
          onClick={() => {
            setCustStatusFilter('disabled');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'disabled'
              ? 'border-rose-500 ring-2 ring-rose-400/25 shadow-md bg-rose-50/40'
              : 'border-rose-200/90 bg-rose-50/15 hover:border-rose-400 hover:shadow-sm'
          }`}
        >
          <span className="text-xs font-bold text-rose-700 flex items-center justify-between">
            <span className="group-hover:text-rose-800 transition-colors">已关停</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-rose-700 font-mono">{stats.disabled}</span>
            <span className="text-xs font-bold text-rose-600">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-1.5 py-0.5 rounded w-fit">
              停止访问授权
            </span>
            {custStatusFilter === 'disabled' && (
              <span className="text-[10px] text-rose-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>

        {/* 5. 回收站 */}
        <div
          onClick={() => {
            setCustStatusFilter('trash');
            setCurrentPage(1);
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'trash'
              ? 'border-slate-500 ring-2 ring-slate-400/25 shadow-md bg-slate-100'
              : 'border-slate-200/90 bg-slate-50 hover:border-slate-400 hover:shadow-sm'
          }`}
        >
          <span className="text-xs font-bold text-slate-600 flex items-center justify-between">
            <span className="group-hover:text-slate-800 transition-colors">回收站</span>
            <Trash2 className="w-4 h-4 text-slate-500" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-700 font-mono">{stats.trash}</span>
            <span className="text-xs font-bold text-slate-500">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-slate-600 font-bold bg-slate-200/80 px-1.5 py-0.5 rounded w-fit">
              已下架隔离
            </span>
            {custStatusFilter === 'trash' && (
              <span className="text-[10px] text-slate-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>

      </div>

      {/* 客户机构表格主容器 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
        
        {/* 搜索与过滤工具条 */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            
            {/* 关键词检索 */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索客户简称/全称/信用代码/销售..."
                value={custSearchQuery}
                onChange={(e) => {
                  setCustSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 状态筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">状态：</span>
              <select
                value={custStatusFilter}
                onChange={(e) => {
                  setCustStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-bold"
              >
                <option value="全部">全部状态</option>
                <option value="active">已开通 (运行中)</option>
                <option value="expired">试用中</option>
                <option value="disabled">已关停</option>
                <option value="trash">回收站</option>
              </select>
            </div>

            {/* 统计单元筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">统计单元：</span>
              <select
                value={custStatUnitFilter}
                onChange={(e) => {
                  setCustStatUnitFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-bold max-w-[180px] truncate"
              >
                <option value="全部">全部统计单元</option>
                {STATISTICAL_UNITS.filter(u => u !== '全部统计单元').map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* 客户分类筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500">分类：</span>
              <select
                value={custCategoryFilter}
                onChange={(e) => {
                  setCustCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 font-bold"
              >
                <option value="全部">全部分类</option>
                <option value="一类客户">一类客户</option>
                <option value="二类客户">二类客户</option>
                <option value="三类客户">三类客户</option>
              </select>
            </div>

            {/* 重置 */}
            {(custSearchQuery || custStatusFilter !== '全部' || custStatUnitFilter !== '全部' || custCategoryFilter !== '全部') && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-colors"
                title="重置全部筛选"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            )}

          </div>

          <div className="text-xs text-slate-400 font-bold self-end xl:self-center">
            共找到 <span className="text-blue-600 font-mono font-black">{filteredList.length}</span> 家机构
          </div>

        </div>

        {/* 客户机构表格 */}
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-black select-none">
                <th className="py-3 px-3.5 w-14 text-center">序号</th>
                <th className="py-3 px-4 min-w-[220px]">客户简称</th>
                <th className="py-3 px-4 min-w-[130px]">销售负责人</th>
                <th className="py-3 px-4 min-w-[110px]">级别 / 分类</th>
                <th className="py-3 px-4 min-w-[100px]">授权版本</th>
                <th className="py-3 px-4 min-w-[180px]">服务有效期</th>
                <th className="py-3 px-4 min-w-[110px] text-center">状态</th>
                <th className="py-3 px-4 w-24 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building2 className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <span className="font-bold">暂无匹配的客户机构记录</span>
                      <p className="text-slate-400 text-[11px]">请调整筛选条件或搜索关键词</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedList.map((cust, idx) => {
                  const seqNo = (currentPage - 1) * pageSize + idx + 1;
                  const { days, isExpired } = getDaysRemaining(cust.expireDate);

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-blue-50/30 transition-colors group relative hover:z-30"
                    >
                      {/* 1. 序号 */}
                      <td className="py-3 px-3.5 text-center font-mono text-slate-400 font-bold">
                        {seqNo}
                      </td>

                      {/* 2. 客户简称 (悬浮展示 6 项全量信息 Tooltip + 附统计单元) */}
                      <td className="py-3 px-4">
                        <div className="relative group/tooltip inline-block max-w-full">
                          <span className="font-black text-slate-800 hover:text-blue-700 cursor-pointer transition-colors block text-xs underline decoration-dotted decoration-slate-300 underline-offset-4">
                            {cust.orgShortName || cust.orgName}
                          </span>

                          {/* 悬浮提示卡片 (Tooltip: 包含 6 大核心维度) - 向下弹出防止被表头遮挡 */}
                          <div className="absolute left-0 top-full mt-1.5 hidden group-hover/tooltip:block z-50 w-72 p-3 bg-slate-900/95 backdrop-blur-xs text-white rounded-xl shadow-2xl border border-slate-700/80 text-[11px] pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                            {/* Tooltip 小三角指示箭头 */}
                            <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 ml-4 -mt-4.5 mb-1 border-l border-t border-slate-700" />
                            <div className="font-black text-xs text-blue-300 border-b border-slate-700/80 pb-1.5 mb-2 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span className="truncate">{cust.orgName}</span>
                            </div>
                            
                            <div className="flex flex-col gap-1.5 text-slate-200">
                              <div className="flex items-start gap-1">
                                <span className="text-slate-400 shrink-0">客户全称：</span>
                                <span className="font-bold text-white break-all">{cust.orgName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 shrink-0">统一信用代码：</span>
                                <span className="font-mono text-blue-200 font-bold break-all">{cust.creditCode}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 shrink-0">客户唯一 ID：</span>
                                <span className="font-mono text-slate-300">{cust.orgCode}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 shrink-0">所在地区：</span>
                                <span className="text-slate-100 flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>{cust.region}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 shrink-0">所属分类：</span>
                                <span className="px-1.5 py-0.2 bg-blue-900/60 text-blue-300 rounded text-[10px] font-bold">
                                  {cust.customerCategory}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 shrink-0">客户级别：</span>
                                <span className="px-1.5 py-0.2 bg-indigo-900/60 text-indigo-300 rounded text-[10px] font-bold">
                                  {cust.customerLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 统计单元 */}
                        <div className="text-[11px] text-slate-400 truncate mt-0.5" title={cust.statUnit}>
                          {cust.statUnit}
                        </div>
                      </td>

                      {/* 3. 销售负责人 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            {cust.salesPerson.substring(0, 1)}
                          </span>
                          <span className="font-bold text-slate-800 text-xs">
                            {cust.salesPerson}
                          </span>
                        </div>
                      </td>

                      {/* 4. 级别 / 分类 */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            cust.customerLevel === '省级'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : cust.customerLevel === '地市级'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {cust.customerLevel}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {cust.customerCategory}
                          </span>
                        </div>
                      </td>

                      {/* 5. 授权版本 */}
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          cust.version === '正式版'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cust.version === '正式版' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{cust.version}</span>
                        </span>
                      </td>

                      {/* 6. 服务有效期 */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                          <span className="text-slate-600">{cust.startDate} ~ {cust.expireDate}</span>
                          <span className={`text-[10px] font-bold ${
                            isExpired
                              ? 'text-rose-600'
                              : days <= 30
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}>
                            {isExpired ? '已逾期' : `剩余 ${days} 天`}
                          </span>
                        </div>
                      </td>

                      {/* 7. 状态 */}
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          cust.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : cust.status === 'expired'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : cust.status === 'disabled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {cust.status === 'active' && '正常服务'}
                          {cust.status === 'expired' && '试用中'}
                          {cust.status === 'disabled' && '已关停'}
                          {cust.status === 'trash' && '回收站'}
                        </span>
                      </td>

                      {/* 8. 操作: 仅保留唯一的【管理】按钮 */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedCustForConfig(cust)}
                          className="px-2.5 py-1 text-xs bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-lg font-bold transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1"
                          title="进入客户专属应用配置与权限管理"
                        >
                          <SlidersHorizontal className="w-3 h-3 text-blue-600" />
                          <span>管理</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控制栏 */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2 text-slate-500">
            <span>每页展示</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
            >
              <option value={10}>10 条</option>
              <option value={20}>20 条</option>
              <option value={50}>50 条</option>
            </select>
            <span>条，第 <span className="font-mono font-bold text-slate-800">{currentPage}</span> / <span className="font-mono font-bold text-slate-800">{totalPages}</span> 页</span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="首页"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="上一页"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1 px-1">
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = Number(jumpPageInput);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                    }
                  }
                }}
                className="w-10 text-center py-0.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const page = Number(jumpPageInput);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
                className="px-2 py-0.5 bg-slate-200/80 hover:bg-slate-300 text-slate-700 rounded text-[11px] font-bold cursor-pointer transition-colors"
              >
                跳转
              </button>
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="下一页"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="p-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="末页"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
