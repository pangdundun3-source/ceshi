/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Clock,
  Lock,
  Trash2,
  Plus,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Info,
  User,
  Sliders,
  ShieldCheck,
  X,
  Check,
  Calendar,
  FileText,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import {
  CustomerOrgItem,
  INITIAL_CUSTOMER_ORGS,
  STATISTICAL_UNITS,
  MASTER_ENTERPRISE_CUSTOMERS
} from '../data/mockCustomerOrgs';
import { CustomerAppConfig } from './CustomerAppConfig';

export interface CustomerOrgManageProps {
  appName?: string;
  appCode?: string;
  appShortName?: string;
  roleType?: 'with_role' | 'no_role';
  customerOrgs?: CustomerOrgItem[];
  onChangeCustomerOrgs?: (updatedOrgs: CustomerOrgItem[]) => void;
  showToast?: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const CustomerOrgManage: React.FC<CustomerOrgManageProps> = ({
  appName = '正管用 - 网络生态综合治理平台',
  appCode = 'V8-P-01',
  appShortName = '正管用',
  roleType = 'with_role',
  customerOrgs: propCustomerOrgs,
  onChangeCustomerOrgs,
  showToast: propShowToast
}) => {
  // 内部或受控客户机构数据
  const [internalOrgs, setInternalOrgs] = useState<CustomerOrgItem[]>(() => {
    return INITIAL_CUSTOMER_ORGS.map(c => ({
      ...c,
      isEnabled: c.isEnabled !== undefined ? c.isEnabled : c.status !== 'disabled'
    }));
  });

  const customerOrgs = propCustomerOrgs || internalOrgs;

  const updateCustomerOrgs = (updater: (prev: CustomerOrgItem[]) => CustomerOrgItem[]) => {
    const next = updater(customerOrgs);
    setInternalOrgs(next);
    onChangeCustomerOrgs?.(next);
  };

  const showToast = (msg: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    if (propShowToast) {
      propShowToast(msg, type);
    }
  };

  // 筛选与搜索状态
  const [statUnitFilter, setStatUnitFilter] = useState<string>('全部统计单元');
  const [custSearchQuery, setCustSearchQuery] = useState<string>('');
  const [salesPersonFilter, setSalesPersonFilter] = useState<string>('');
  const [custVersionFilter, setCustVersionFilter] = useState<string>('全部授权');
  const [custStatusFilter, setCustStatusFilter] = useState<'全部' | 'active' | 'expired' | 'disabled' | 'trash'>('全部');
  // 服务到期日期排序状态: null | 'asc' (近到远) | 'desc' (远到近)
  const [expireSortOrder, setExpireSortOrder] = useState<'asc' | 'desc' | null>(null);

  // 分页状态 (默认每页 50 条记录)
  const [custPageSize, setCustPageSize] = useState<number>(50);
  const [currentCustPage, setCurrentCustPage] = useState<number>(1);
  const [custJumpPage, setCustJumpPage] = useState<string>('1');

  // 弹窗状态：授权开通新机构
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);

  // 浮窗内的机构搜索选择状态
  const [modalSearchKeyword, setModalSearchKeyword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMasterOrg, setSelectedMasterOrg] = useState<typeof MASTER_ENTERPRISE_CUSTOMERS[0] | null>(null);

  // 浮窗内的开通配置表单状态
  const [openVersion, setOpenVersion] = useState<'正式版' | '试用版'>('正式版');
  const [openExpireDate, setOpenExpireDate] = useState('2027-12-31');
  const [openRemark, setOpenRemark] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉建议框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 打开弹窗初始化
  const handleOpenAddModal = () => {
    setModalSearchKeyword('');
    setSelectedMasterOrg(null);
    setIsDropdownOpen(false);
    setOpenVersion('正式版');
    setOpenExpireDate('2027-12-31');
    setOpenRemark('');
    setIsAddCustModalOpen(true);
  };

  // 客户专属应用配置页状态（点击服务到期日右侧的“管理”按钮进入）
  const [selectedCustForAppConfig, setSelectedCustForAppConfig] = useState<CustomerOrgItem | null>(null);

  // 删除确认弹窗状态
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCust, setDeletingCust] = useState<CustomerOrgItem | null>(null);

  // 计算距离到期天数与状态
  const getDaysUntilExpire = (expireDateStr: string) => {
    if (!expireDateStr) return { days: 0, isExpired: false };
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

  // 顶部 5 大统计指标（客户总数、已开通数、已到期数、已关停数、已在回收站数）
  const custTotalCount = customerOrgs.length;
  const custActiveCount = customerOrgs.filter(c => (c.isEnabled ?? c.status !== 'disabled') && c.status !== 'expired' && c.status !== 'trash').length;
  const custExpiredCount = customerOrgs.filter(c => c.status === 'expired' && c.status !== 'trash').length;
  const custDisabledCount = customerOrgs.filter(c => !(c.isEnabled ?? c.status !== 'disabled') && c.status !== 'trash').length;
  const custTrashCount = customerOrgs.filter(c => c.status === 'trash').length;

  // 客户列表综合过滤
  const filteredCustomerOrgs = customerOrgs.filter(c => {
    // 1. 统计单元
    if (statUnitFilter !== '全部统计单元' && c.statUnit !== statUnitFilter) {
      return false;
    }

    // 2. 版本授权 (全部授权 / 试用版 / 正式版)
    if (custVersionFilter !== '全部授权' && c.version !== custVersionFilter) {
      return false;
    }

    const isCustEnabled = c.isEnabled ?? (c.status !== 'disabled');

    // 3. 授权状态 (全部状态 / 开通中 / 已到期 / 已关停 / 已删除)
    if (custStatusFilter === 'active') {
      if (!isCustEnabled || c.status === 'expired' || c.status === 'trash') return false;
    } else if (custStatusFilter === 'expired') {
      if (c.status !== 'expired' || c.status === 'trash') return false;
    } else if (custStatusFilter === 'disabled') {
      if (isCustEnabled || c.status === 'trash') return false;
    } else if (custStatusFilter === 'trash') {
      if (c.status !== 'trash') return false;
    }

    // 4. 客户经理搜索
    if (salesPersonFilter.trim()) {
      const sp = salesPersonFilter.trim().toLowerCase();
      if (!c.salesPerson.toLowerCase().includes(sp)) {
        return false;
      }
    }

    // 5. 搜索匹配：客户名称、统一社会信用代码、客户唯一 ID 或客户简称
    if (custSearchQuery.trim()) {
      const q = custSearchQuery.trim().toLowerCase();
      const matchName = c.orgName.toLowerCase().includes(q);
      const matchShort = c.orgShortName ? c.orgShortName.toLowerCase().includes(q) : false;
      const matchCode = c.orgCode.toLowerCase().includes(q);
      const matchCredit = c.creditCode.toLowerCase().includes(q);
      if (!matchName && !matchShort && !matchCode && !matchCredit) {
        return false;
      }
    }

    return true;
  });

  // 服务到期日期排序
  const sortedCustomerOrgs = [...filteredCustomerOrgs].sort((a, b) => {
    if (!expireSortOrder) return 0;
    const timeA = new Date(a.expireDate).getTime();
    const timeB = new Date(b.expireDate).getTime();
    return expireSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  // 分页计算
  const totalCustCount = sortedCustomerOrgs.length;
  const totalCustPages = Math.max(1, Math.ceil(totalCustCount / custPageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentCustPage), totalCustPages);
  const startIndex = (safeCurrentPage - 1) * custPageSize;
  const endIndex = Math.min(startIndex + custPageSize, totalCustCount);
  const paginatedCustomerOrgs = sortedCustomerOrgs.slice(startIndex, endIndex);

  // 切换服务到期日期排序
  const handleToggleExpireSort = () => {
    setExpireSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentCustPage(1);
    setCustJumpPage('1');
  };

  const handleJumpToPage = () => {
    const p = parseInt(custJumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalCustPages) {
      setCurrentCustPage(p);
    } else {
      setCustJumpPage(String(safeCurrentPage));
    }
  };

  // 弹窗中搜索备选机构列表
  const dropdownFilteredMasterOrgs = useMemo(() => {
    const query = modalSearchKeyword.trim().toLowerCase();
    return MASTER_ENTERPRISE_CUSTOMERS.filter((org) => {
      if (!query) return true;
      const matchName = org.orgName.toLowerCase().includes(query);
      const matchShort = (org.orgShortName || '').toLowerCase().includes(query);
      const matchCredit = org.creditCode.toLowerCase().includes(query);
      const matchCode = org.orgCode.toLowerCase().includes(query);
      const matchSales = org.salesPerson.toLowerCase().includes(query);
      return matchName || matchShort || matchCredit || matchCode || matchSales;
    });
  }, [modalSearchKeyword]);

  // 检查某机构是否已经在当前应用中开通
  const checkIsAlreadyOpened = (org: typeof MASTER_ENTERPRISE_CUSTOMERS[0]) => {
    return customerOrgs.find(
      (c) => c.orgName === org.orgName || c.creditCode === org.creditCode || c.id === org.id
    );
  };

  // 处理在下拉框中选择机构
  const handleSelectMasterOrgFromDropdown = (org: typeof MASTER_ENTERPRISE_CUSTOMERS[0]) => {
    const alreadyOpened = checkIsAlreadyOpened(org);
    if (alreadyOpened) {
      setIsAddCustModalOpen(false);
      setSelectedCustForAppConfig(alreadyOpened);
      showToast(`已自动定位并打开已授权机构「${alreadyOpened.orgShortName || alreadyOpened.orgName}」的管理详情页`, 'info');
      return;
    }

    setSelectedMasterOrg(org);
    setModalSearchKeyword(org.orgShortName || org.orgName);
    setIsDropdownOpen(false);
  };

  // 处理提交“确认授权开通”
  const handleConfirmAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMasterOrg) return;

    const existing = checkIsAlreadyOpened(selectedMasterOrg);
    if (existing) {
      setIsAddCustModalOpen(false);
      setSelectedCustForAppConfig(existing);
      showToast(`机构「${existing.orgShortName || existing.orgName}」此前已开通，已直接为您跳转至管理页`, 'info');
      return;
    }

    const newId = `cust-${Date.now()}`;
    const newOrg: CustomerOrgItem = {
      id: newId,
      orgName: selectedMasterOrg.orgName,
      orgShortName: selectedMasterOrg.orgShortName,
      orgCode: selectedMasterOrg.orgCode || `CUST-ZL-${String(customerOrgs.length + 1).padStart(3, '0')}`,
      creditCode: selectedMasterOrg.creditCode,
      region: selectedMasterOrg.region || '陕西省 · 西安市',
      customerCategory: selectedMasterOrg.customerCategory || '一类客户',
      customerLevel: selectedMasterOrg.customerLevel || '地市级',
      version: openVersion,
      status: 'active',
      isEnabled: true,
      startDate: new Date().toISOString().split('T')[0],
      expireDate: openExpireDate || '2027-12-31',
      statUnit: selectedMasterOrg.statUnit,
      salesPerson: selectedMasterOrg.salesPerson || '夏小花',
      contactPerson: selectedMasterOrg.contactPerson,
      contactPhone: selectedMasterOrg.contactPhone,
      remark: openRemark.trim() || undefined,
      accountUsed: 0,
      accountLimit: openVersion === '正式版' ? 100 : 20
    };

    updateCustomerOrgs(prev => [newOrg, ...prev]);
    setIsAddCustModalOpen(false);
    setCustStatusFilter('全部');
    setCurrentCustPage(1);
    setCustJumpPage('1');
    showToast(`成功为「${newOrg.orgShortName || newOrg.orgName}」授权开通「${appName || appShortName}」应用！`, 'success');
  };

  // 确认删除客户机构
  const handleConfirmDeleteCust = () => {
    if (!deletingCust) return;
    updateCustomerOrgs(prev => prev.filter(c => c.id !== deletingCust.id));
    setIsDeleteModalOpen(false);
    const name = deletingCust.orgShortName || deletingCust.orgName;
    setDeletingCust(null);
    showToast(`已成功删除客户机构「${name}」`, 'success');
  };

  // 如果处于单独机构的客户应用配置页面
  if (selectedCustForAppConfig) {
    return (
      <CustomerAppConfig
        customer={selectedCustForAppConfig}
        appName={appName}
        appCode={appCode}
        appShortName={appShortName}
        roleType={roleType}
        onBack={() => setSelectedCustForAppConfig(null)}
        onUpdateCustomer={(updated) => {
          updateCustomerOrgs(prev => prev.map(c => c.id === updated.id ? updated : c));
          setSelectedCustForAppConfig(updated);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5" id="customer_org_manage_panel">
      {/* (a) 顶部数据卡片：5 大统计指标 (支持点击穿透筛选客户清单) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* 1. 客户总数 */}
        <div
          onClick={() => {
            setCustStatusFilter('全部');
            setCurrentCustPage(1);
            setCustJumpPage('1');
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === '全部'
              ? 'border-[#1e376b] ring-2 ring-[#1e376b]/20 shadow-md bg-blue-50/10'
              : 'border-slate-200/90 hover:border-blue-400 hover:shadow-sm'
          }`}
          title="点击查看全部客户机构"
        >
          <span className="text-xs font-bold text-slate-500 flex items-center justify-between">
            <span className="group-hover:text-blue-700 transition-colors">客户总数</span>
            <Building2 className={`w-4 h-4 ${custStatusFilter === '全部' ? 'text-[#1e376b]' : 'text-blue-600'}`} />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{custTotalCount}</span>
            <span className="text-xs font-bold text-slate-400">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded w-fit">
              全域覆盖机构
            </span>
          </div>
        </div>

        {/* 2. 已开通数 */}
        <div
          onClick={() => {
            setCustStatusFilter('active');
            setCurrentCustPage(1);
            setCustJumpPage('1');
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'active'
              ? 'border-emerald-600 ring-2 ring-emerald-500/25 shadow-md bg-emerald-50/30'
              : 'border-emerald-200/90 bg-emerald-50/15 hover:border-emerald-500 hover:shadow-sm'
          }`}
          title="点击筛选已开通 (正常运行) 客户"
        >
          <span className="text-xs font-bold text-emerald-700 flex items-center justify-between">
            <span className="group-hover:text-emerald-800 transition-colors">已开通数 (运行中)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">{custActiveCount}</span>
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

        {/* 3. 已到期数 */}
        <div
          onClick={() => {
            setCustStatusFilter('expired');
            setCurrentCustPage(1);
            setCustJumpPage('1');
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'expired'
              ? 'border-amber-600 ring-2 ring-amber-500/25 shadow-md bg-amber-50/30'
              : 'border-amber-200/90 bg-amber-50/15 hover:border-amber-500 hover:shadow-sm'
          }`}
          title="点击筛选已到期待续期客户"
        >
          <span className="text-xs font-bold text-amber-700 flex items-center justify-between">
            <span className="group-hover:text-amber-800 transition-colors">已到期数</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-amber-700 font-mono">{custExpiredCount}</span>
            <span className="text-xs font-bold text-amber-600">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded w-fit">
              待续期沟通
            </span>
            {custStatusFilter === 'expired' && (
              <span className="text-[10px] text-amber-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>

        {/* 4. 已关停数 */}
        <div
          onClick={() => {
            setCustStatusFilter('disabled');
            setCurrentCustPage(1);
            setCustJumpPage('1');
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'disabled'
              ? 'border-slate-600 ring-2 ring-slate-400/25 shadow-md bg-slate-100/60'
              : 'border-slate-200/90 bg-slate-50/40 hover:border-slate-400 hover:shadow-sm'
          }`}
          title="点击筛选已关停停用客户"
        >
          <span className="text-xs font-bold text-slate-600 flex items-center justify-between">
            <span className="group-hover:text-slate-900 transition-colors">已关停数</span>
            <Lock className="w-4 h-4 text-slate-500" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-700 font-mono">{custDisabledCount}</span>
            <span className="text-xs font-bold text-slate-400">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded w-fit">
              暂停授权访问
            </span>
            {custStatusFilter === 'disabled' && (
              <span className="text-[10px] text-slate-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>

        {/* 5. 已在回收站数 */}
        <div
          onClick={() => {
            setCustStatusFilter('trash');
            setCurrentCustPage(1);
            setCustJumpPage('1');
          }}
          className={`bg-white p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-1 group ${
            custStatusFilter === 'trash'
              ? 'border-rose-600 ring-2 ring-rose-500/25 shadow-md bg-rose-50/30'
              : 'border-rose-200/90 bg-rose-50/15 hover:border-rose-500 hover:shadow-sm'
          }`}
          title="点击筛选回收站客户"
        >
          <span className="text-xs font-bold text-rose-700 flex items-center justify-between">
            <span className="group-hover:text-rose-800 transition-colors">已在回收站</span>
            <Trash2 className="w-4 h-4 text-rose-600" />
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-rose-700 font-mono">{custTrashCount}</span>
            <span className="text-xs font-bold text-rose-600">家</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-rose-700 font-bold bg-rose-100 px-1.5 py-0.5 rounded w-fit">
              已移入回收站
            </span>
            {custStatusFilter === 'trash' && (
              <span className="text-[10px] text-rose-700 font-bold">已穿透筛选</span>
            )}
          </div>
        </div>
      </div>

      {/* (b) 客户机构清单这一页：搜索、字段列表与底部分页 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 flex flex-col gap-4">
        {/* 工具条与搜索筛选区域 */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex flex-wrap items-end gap-3 flex-1">
            {/* 1. 统计单元 (下拉菜单 单选) */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">统计单元</label>
              <select
                value={statUnitFilter}
                onChange={(e) => {
                  setStatUnitFilter(e.target.value);
                  setCurrentCustPage(1);
                  setCustJumpPage('1');
                }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] text-slate-800 font-medium cursor-pointer shadow-2xs h-8.5"
              >
                {STATISTICAL_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. 客户简称、全称、统一社会信用代码 (单行文本框, 最长50汉字, 宽度设定, 占位提示) */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">客户简称、全称、统一社会信用代码</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={50}
                  placeholder="客户简称、全称、统一社会信用代码"
                  value={custSearchQuery}
                  onChange={(e) => {
                    setCustSearchQuery(e.target.value);
                    setCurrentCustPage(1);
                    setCustJumpPage('1');
                  }}
                  className="w-[200px] lg:w-[240px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] font-medium shadow-2xs placeholder:text-slate-400 h-8.5"
                />
                {custSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustSearchQuery('');
                      setCurrentCustPage(1);
                      setCustJumpPage('1');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded-full cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 3. 客户经理 (单行文本框, 最长6汉字, 宽度设定, 占位提示) */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">客户经理</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="客户经理名称"
                  value={salesPersonFilter}
                  onChange={(e) => {
                    setSalesPersonFilter(e.target.value);
                    setCurrentCustPage(1);
                    setCustJumpPage('1');
                  }}
                  className="w-[95px] px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] font-medium shadow-2xs placeholder:text-slate-400 h-8.5"
                />
                {salesPersonFilter && (
                  <button
                    type="button"
                    onClick={() => {
                      setSalesPersonFilter('');
                      setCurrentCustPage(1);
                      setCustJumpPage('1');
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded-full cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* 4. 第五个筛选：版本授权 (下拉菜单 单选：全部授权、试用版、正式版) */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">版本授权</label>
              <select
                value={custVersionFilter}
                onChange={(e) => {
                  setCustVersionFilter(e.target.value);
                  setCurrentCustPage(1);
                  setCustJumpPage('1');
                }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] text-slate-800 font-medium cursor-pointer shadow-2xs h-8.5"
              >
                <option value="全部授权">全部授权</option>
                <option value="试用版">试用版</option>
                <option value="正式版">正式版</option>
              </select>
            </div>

            {/* 5. 第六个筛选：版本授权 (下拉菜单 单选：全部状态、开通中、已到期、已关停、已删除) */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">版本授权</label>
              <select
                value={custStatusFilter}
                onChange={(e) => {
                  setCustStatusFilter(e.target.value as any);
                  setCurrentCustPage(1);
                  setCustJumpPage('1');
                }}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] text-slate-800 font-medium cursor-pointer shadow-2xs h-8.5"
              >
                <option value="全部">全部状态</option>
                <option value="active">开通中</option>
                <option value="expired">已到期</option>
                <option value="disabled">已关停</option>
                <option value="trash">已删除</option>
              </select>
            </div>

            {/* 搜索与重置按钮 */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCurrentCustPage(1);
                  setCustJumpPage('1');
                  showToast('已完成搜索筛选', 'info');
                }}
                className="h-8.5 px-3.5 py-1.5 text-xs bg-[#1e376b] hover:bg-[#162952] text-white rounded-lg font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustSearchQuery('');
                  setSalesPersonFilter('');
                  setStatUnitFilter('全部统计单元');
                  setCustVersionFilter('全部授权');
                  setCustStatusFilter('全部');
                  setExpireSortOrder(null);
                  setCurrentCustPage(1);
                  setCustJumpPage('1');
                  showToast('已重置所有筛选条件', 'info');
                }}
                className="h-8.5 px-3 py-1.5 text-xs bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 右侧：授权开通新机构 */}
          <div className="flex items-center gap-2 shrink-0 self-end">
            <button
              onClick={handleOpenAddModal}
              className="h-8.5 px-3.5 py-1.5 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              id="btn_open_add_cust_modal"
            >
              <Plus className="w-4 h-4" />
              <span>授权开通新机构</span>
            </button>
          </div>
        </div>

        {/* 客户机构清单表格 */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-4 min-w-[260px]">客户简称 (悬浮查看详情) / 统计单元</th>
                <th className="py-3 px-3 min-w-[120px]">所属销售</th>
                <th className="py-3 px-3 min-w-[90px]">开通版本</th>
                <th className="py-3 px-3 min-w-[110px]">授权状态</th>
                <th
                  onClick={handleToggleExpireSort}
                  className="py-3 px-3 min-w-[190px] cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                  title="点击按服务到期日期排序：第一次近到远，再次点击远到近"
                >
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <span>服务到期日期</span>
                    {expireSortOrder === 'asc' ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono">
                        <ArrowUp className="w-3 h-3 text-blue-600" />
                        <span>近到远</span>
                      </span>
                    ) : expireSortOrder === 'desc' ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono">
                        <ArrowDown className="w-3 h-3 text-blue-600" />
                        <span>远到近</span>
                      </span>
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-right min-w-[90px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCustomerOrgs.length > 0 ? (
                paginatedCustomerOrgs.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors relative hover:z-30">
                    {/* 1. 客户简称（悬浮显示画像卡片）+ 统计单元（灰色小字） */}
                    <td className="py-3.5 px-4">
                      <div className="relative group/tooltip inline-block max-w-full">
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <span
                            className="font-black text-slate-900 text-xs sm:text-sm group-hover/tooltip:text-blue-700 transition-colors underline decoration-dotted decoration-slate-300 underline-offset-4"
                          >
                            {cust.orgShortName || cust.orgName}
                          </span>
                          <Info className="w-3.5 h-3.5 text-slate-400 group-hover/tooltip:text-blue-600 transition-colors shrink-0" />
                        </div>

                        {/* 悬浮提示标签（Tooltip）：向下弹出 (top-full mt-2)，避免被表头遮挡 */}
                        <div className="absolute left-0 top-full mt-1.5 hidden group-hover/tooltip:flex flex-col z-50 pointer-events-none drop-shadow-2xl min-w-[300px] max-w-sm transition-all animate-in fade-in zoom-in-95 duration-150">
                          <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 ml-5 -mb-1.5 border-l border-t border-slate-700 self-start" />
                          <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-2xl border border-slate-700/80">
                            {/* (a) 客户全称 */}
                            <div className="pb-2 border-b border-slate-800">
                              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-blue-400" />
                                <span>客户全称</span>
                              </div>
                              <div className="font-bold text-white text-xs mt-1 leading-snug break-words">
                                {cust.orgName}
                              </div>
                            </div>

                            {/* (b)~(f) 关键信息矩阵 */}
                            <div className="pt-2.5 space-y-1.5 text-[11px]">
                              {/* (b) 统一社会代码 */}
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-slate-400 shrink-0">统一社会代码:</span>
                                <span className="font-mono font-bold text-slate-200 text-right select-all break-all">{cust.creditCode}</span>
                              </div>
                              {/* (c) 客户唯一 ID */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-400 shrink-0">客户唯一 ID:</span>
                                <span className="font-mono font-bold text-blue-300 bg-blue-950/70 px-1.5 py-0.2 rounded border border-blue-800/50 text-[10px]">{cust.orgCode}</span>
                              </div>
                              {/* (d) 客户所在地区（省、市、县） */}
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-slate-400 shrink-0">所在地区:</span>
                                <span className="font-bold text-slate-200 text-right">{cust.region || '陕西省 · 西安市'}</span>
                              </div>
                              {/* (e) 客户所属分类 */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-400 shrink-0">所属分类:</span>
                                <span className="font-bold text-amber-300 bg-amber-950/50 px-1.5 py-0.2 rounded border border-amber-800/40 text-[10px]">{cust.customerCategory || '一类客户'}</span>
                              </div>
                              {/* (f) 客户级别 */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-slate-400 shrink-0">客户级别:</span>
                                <span className="font-bold text-emerald-300 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/40 text-[10px]">{cust.customerLevel || '地市级'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 地区统计单元 */}
                      <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                        <span className="text-slate-400">统计单元:</span>
                        <span className="text-slate-600">{cust.statUnit}</span>
                      </div>
                    </td>

                    {/* 2. 所属销售 */}
                    <td className="py-3.5 px-3 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cust.salesPerson}</span>
                      </div>
                    </td>

                    {/* 3. 开通版本 */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                        cust.version === '正式版'
                          ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {cust.version}
                      </span>
                    </td>

                    {/* 4. 授权状态 */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {!(cust.isEnabled ?? (cust.status !== 'disabled')) ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[11px] font-bold shadow-2xs">
                          <Lock className="w-3 h-3 text-slate-400" />
                          已关停
                        </span>
                      ) : cust.status === 'expired' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md text-[11px] font-bold shadow-2xs">
                          <Clock className="w-3 h-3 text-amber-500" />
                          已到期
                        </span>
                      ) : cust.status === 'trash' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[11px] font-bold shadow-2xs">
                          <Trash2 className="w-3 h-3 text-rose-500" />
                          在回收站
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          已开通
                        </span>
                      )}
                    </td>

                    {/* 5. 服务到期日期 与 距离到期天数 */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs">
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>到期: {cust.expireDate}</span>
                          {cust.status === 'expired' && (
                            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                              已过期
                            </span>
                          )}
                        </div>
                        {(() => {
                          const expireInfo = getDaysUntilExpire(cust.expireDate);
                          return (
                            <div className={`text-[11px] font-mono mt-0.5 ${
                              expireInfo.isExpired ? 'text-rose-600 font-bold' : 'text-slate-400 font-medium'
                            }`}>
                              距离到期：{expireInfo.days} 天
                            </div>
                          );
                        })()}
                      </div>
                    </td>

                    {/* 6. 操作按钮：管理 */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedCustForAppConfig(cust)}
                          className="px-3 py-1.5 text-xs text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          title={`进入客户「${cust.orgShortName || cust.orgName}」的应用配置页`}
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>管理</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-600">未找到符合条件的客户机构</p>
                    <p className="text-xs text-slate-400 mt-1">请尝试调整统计单元或搜索关键字</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 客户机构页底部分页控制区 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 pt-4 border-t border-slate-200/90 text-xs">
          {/* 左侧：记录统计与“每页显示多少条”的标签 */}
          <div className="flex items-center gap-3 flex-wrap text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">
                显示第 {totalCustCount > 0 ? startIndex + 1 : 0} 至 {endIndex} 条
              </span>
              <span className="text-slate-300">•</span>
              <span>共 <strong className="font-mono text-slate-900 font-black">{totalCustCount}</strong> 家客户机构</span>
            </div>

            {/* “每页显示多少条”的标签与下拉选择 */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-bold text-[11px]">每页显示条数:</span>
              <select
                value={custPageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setCustPageSize(newSize);
                  setCurrentCustPage(1);
                  setCustJumpPage('1');
                }}
                className="bg-transparent font-black text-slate-900 text-xs cursor-pointer focus:outline-none"
              >
                <option value={20}>20 条/页</option>
                <option value={50}>50 条/页 (默认)</option>
                <option value={100}>100 条/页</option>
              </select>
            </div>
          </div>

          {/* 右侧：上一页、页码列表、下一页与直达第几页 */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 上一页 */}
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => {
                const prev = Math.max(1, safeCurrentPage - 1);
                setCurrentCustPage(prev);
                setCustJumpPage(String(prev));
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                safeCurrentPage <= 1
                  ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer shadow-2xs'
              }`}
            >
              上一页
            </button>

            {/* 页码列表 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalCustPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    setCurrentCustPage(pageNum);
                    setCustJumpPage(String(pageNum));
                  }}
                  className={`min-w-8 h-8 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    safeCurrentPage === pageNum
                      ? 'bg-[#1e376b] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  第 {pageNum} 页
                </button>
              ))}
            </div>

            {/* 下一页 */}
            <button
              type="button"
              disabled={safeCurrentPage >= totalCustPages}
              onClick={() => {
                const next = Math.min(totalCustPages, safeCurrentPage + 1);
                setCurrentCustPage(next);
                setCustJumpPage(String(next));
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                safeCurrentPage >= totalCustPages
                  ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer shadow-2xs'
              }`}
            >
              下一页
            </button>

            {/* 直达第几页 */}
            <div className="flex items-center gap-1.5 pl-2.5 border-l border-slate-200 text-xs text-slate-600">
              <span>直达第</span>
              <input
                type="number"
                min={1}
                max={totalCustPages}
                value={custJumpPage}
                onChange={(e) => setCustJumpPage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleJumpToPage();
                  }
                }}
                className="w-12 px-1.5 py-1 text-center font-bold font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 text-xs shadow-2xs"
              />
              <span>页</span>
              <button
                type="button"
                onClick={handleJumpToPage}
                className="px-2.5 py-1 bg-[#1e376b] hover:bg-blue-800 text-white rounded-md text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                跳转
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= Modal 1: 授权开通新机构 ======================= */}
      {isAddCustModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1e376b] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">授权开通新机构</h3>
                  <p className="text-[11px] text-slate-500">
                    为未授权的客户机构开通「{appName || appShortName}」应用访问权限
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCustModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAuthorize} className="flex flex-col gap-4">
              {/* 1. 机构选择与即时搜索框 */}
              <div className="flex flex-col gap-1.5" ref={dropdownRef}>
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>选择客户机构 *</span>
                  <span className="text-[11px] font-normal text-slate-400">支持输入客户简称、全称、信用代码检索</span>
                </label>

                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="搜索机构（例如：中铁七局、91610...、西安高新）"
                      value={modalSearchKeyword}
                      onChange={(e) => {
                        setModalSearchKeyword(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-slate-800 transition-all placeholder:text-slate-400"
                      id="input_modal_search_org"
                    />
                    {modalSearchKeyword && (
                      <button
                        type="button"
                        onClick={() => {
                          setModalSearchKeyword('');
                          setSelectedMasterOrg(null);
                        }}
                        className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* 下拉联想搜索列表 */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200/90 z-50 max-h-60 overflow-y-auto p-1.5 flex flex-col gap-1">
                      {dropdownFilteredMasterOrgs.length > 0 ? (
                        dropdownFilteredMasterOrgs.map((org) => {
                          const alreadyOpened = checkIsAlreadyOpened(org);
                          return (
                            <div
                              key={org.id}
                              onClick={() => handleSelectMasterOrgFromDropdown(org)}
                              className={`p-2.5 rounded-lg text-xs cursor-pointer flex items-center justify-between transition-colors ${
                                alreadyOpened
                                  ? 'bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200/70 text-rose-900'
                                  : selectedMasterOrg?.id === org.id
                                  ? 'bg-blue-50 text-[#1e376b] font-bold border border-blue-200'
                                  : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                              }`}
                            >
                              <div className="flex flex-col min-w-0 pr-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-slate-900">{org.orgShortName || org.orgName}</span>
                                  <span className="text-[10px] text-slate-400">({org.orgCode})</span>
                                </div>
                                <span className="text-[11px] text-slate-500 truncate mt-0.5">{org.orgName}</span>
                                <span className="text-[10px] font-mono text-slate-400 mt-0.5">{org.creditCode} · {org.salesPerson}</span>
                              </div>

                              <div className="shrink-0 flex items-center gap-1">
                                {alreadyOpened ? (
                                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs animate-pulse">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>已开通 (点击直达管理) →</span>
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                                    未开通
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                          未搜索到匹配的机构档案，请尝试其他关键词
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. 自动带出的机构详细信息矩阵卡片 */}
              {selectedMasterOrg ? (
                <div className="p-3.5 bg-slate-50/90 rounded-xl border border-blue-200/80 flex flex-col gap-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>已选定机构档案详情</span>
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      系统已匹配
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* (1) 客户机构全称 */}
                    <div className="sm:col-span-2 bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 block">客户机构全称</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 block break-words">
                        {selectedMasterOrg.orgName}
                      </span>
                    </div>

                    {/* (2) 统一社会信用代码 */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 block">客户统一社会信用代码</span>
                      <span className="font-mono font-black text-slate-900 text-xs mt-0.5 block select-all">
                        {selectedMasterOrg.creditCode}
                      </span>
                    </div>

                    {/* (3) 客户经理 / 销售名称 */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 block">所属客户经理 (销售)</span>
                      <span className="font-bold text-slate-900 text-xs mt-0.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedMasterOrg.salesPerson}</span>
                        {selectedMasterOrg.contactPhone && (
                          <span className="text-slate-400 text-[10px]">({selectedMasterOrg.contactPhone})</span>
                        )}
                      </span>
                    </div>

                    {/* (4) 所属统计单元 */}
                    <div className="sm:col-span-2 bg-white p-2.5 rounded-lg border border-slate-200/70">
                      <span className="text-[10px] font-bold text-slate-400 block">所属统计单元</span>
                      <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                        {selectedMasterOrg.statUnit}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-1">
                  <Building2 className="w-6 h-6 text-slate-300" />
                  <span>请先在上方搜索框中检索并选定未开通的客户机构</span>
                </div>
              )}

              {/* 3. 授权配置信息 */}
              {selectedMasterOrg && (
                <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                  <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>应用授权配置参数</span>
                  </h4>

                  {/* 开通的版本 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">开通的版本 *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        onClick={() => setOpenVersion('正式版')}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          openVersion === '正式版'
                            ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-100'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-purple-900">正式版</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">全功能开放与长周期服务</span>
                        </div>
                        <input
                          type="radio"
                          name="open_version_modal"
                          checked={openVersion === '正式版'}
                          onChange={() => setOpenVersion('正式版')}
                          className="accent-purple-600 w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label
                        onClick={() => setOpenVersion('试用版')}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          openVersion === '试用版'
                            ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-100'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-amber-900">试用版</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">短期测试评估与限额体验</span>
                        </div>
                        <input
                          type="radio"
                          name="open_version_modal"
                          checked={openVersion === '试用版'}
                          onChange={() => setOpenVersion('试用版')}
                          className="accent-amber-600 w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* 服务到期日期 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>服务到期日期 *</span>
                      </label>
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setOpenExpireDate('2026-12-31')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-medium cursor-pointer"
                        >
                          2026年底
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenExpireDate('2027-12-31')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-medium cursor-pointer"
                        >
                          2027年底
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenExpireDate('2028-12-31')}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-medium cursor-pointer"
                        >
                          2028年底
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      required
                      value={openExpireDate}
                      onChange={(e) => setOpenExpireDate(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800 shadow-2xs"
                      id="input_open_expire_date"
                    />
                  </div>

                  {/* 备注（可选输入） */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>开通备注 (可选)</span>
                      </span>
                      <span className="text-[10px] text-slate-400">选填说明</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="请输入开通备注、项目审批单号或特殊要求说明..."
                      value={openRemark}
                      onChange={(e) => setOpenRemark(e.target.value)}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium text-slate-800 shadow-2xs resize-y placeholder:text-slate-400"
                      id="textarea_open_remark"
                    />
                  </div>
                </div>
              )}

              {/* 底部按钮栏 */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-1">
                <button
                  type="button"
                  onClick={() => setIsAddCustModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!selectedMasterOrg}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all ${
                    selectedMasterOrg
                      ? 'bg-[#1e376b] hover:bg-blue-800 text-white cursor-pointer shadow-md active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  id="btn_confirm_authorize_submit"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>确认授权开通</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= Modal: 删除客户机构确认提示 ======================= */}
      {isDeleteModalOpen && deletingCust && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-slate-900">确认删除客户机构？</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  您确定要删除客户机构「<span className="font-bold text-slate-800">{deletingCust.orgShortName || deletingCust.orgName}</span>」吗？
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">客户全称:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[240px]" title={deletingCust.orgName}>
                  {deletingCust.orgName}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">客户唯一 ID:</span>
                <span className="font-mono font-bold text-blue-700">{deletingCust.orgCode}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">统一信用代码:</span>
                <span className="font-mono text-slate-700">{deletingCust.creditCode}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">所属大区:</span>
                <span className="font-bold text-slate-700">{deletingCust.statUnit}</span>
              </div>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs text-rose-700 leading-relaxed">
              <strong className="font-black">风险提示：</strong>
              删除后该机构将被移出客户清单，此机构下的全部授权账号将立即失去该应用的登录与业务操作权限。
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingCust(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCust}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
