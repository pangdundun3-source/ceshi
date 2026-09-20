/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  Search,
  RotateCcw,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Download,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Calendar,
  Lock,
  Layers,
  Sparkles,
  Info,
  X,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { STATISTICAL_UNITS } from '../data/mockCustomerOrgs';
import { INITIAL_APPS } from './AppManagement';

// 外部用户组织数据模型
export interface ExtUserOrgItem {
  id: string;
  appId: string;
  appCode: string;
  appName: string;
  appShortName: string;
  orgCode: string;
  orgName: string;
  orgShortName: string;
  statUnit: string;
  salesPerson: string;
  status: 'active' | 'expiring' | 'expired' | 'disabled';
  externalUserCount: number;
  userQuota: number;
  uniqueUserCount: number;
  startDate: string;
  expireDate: string;
  wechatMpName: string;
  autoApprove: boolean;
  notifyEnabled: boolean;
  contactPerson: string;
  contactPhone: string;
  remark?: string;
}

// 初始模拟数据集（横跨指令流转、点点速报、点点速评、正管用等各应用）
const INITIAL_EXT_USER_ORGS: ExtUserOrgItem[] = [
  {
    id: 'ext-org-01',
    appId: 'app-02',
    appCode: 'V8-P-02',
    appName: '指令流转 - 跨层级指挥调度系统',
    appShortName: '指令流转',
    orgCode: 'CUST-SN-XA-001',
    orgName: '西安市网络安全与应急指挥运营中心',
    orgShortName: '西安网安指挥中心',
    statUnit: '陕西一区',
    salesPerson: '周正明',
    status: 'active',
    externalUserCount: 1250,
    userQuota: 3000,
    uniqueUserCount: 1180,
    startDate: '2025-01-01',
    expireDate: '2026-12-31',
    wechatMpName: '网安指令流转服务号',
    autoApprove: true,
    notifyEnabled: true,
    contactPerson: '李科长',
    contactPhone: '13891823344',
    remark: '市级重点指挥中枢，已开通全网指令双向直通与群发通知'
  },
  {
    id: 'ext-org-02',
    appId: 'app-03',
    appCode: 'V8-P-03',
    appName: '点点速报 - 移动端全媒体直报矩阵',
    appShortName: '点点速报',
    orgCode: 'CUST-SN-XY-002',
    orgName: '咸阳市秦都区融媒体中心直报科',
    orgShortName: '咸阳秦都融媒',
    statUnit: '陕西二区',
    salesPerson: '李思源',
    status: 'active',
    externalUserCount: 860,
    userQuota: 1000,
    uniqueUserCount: 820,
    startDate: '2025-02-15',
    expireDate: '2026-08-30',
    wechatMpName: '点点速报直通车',
    autoApprove: true,
    notifyEnabled: true,
    contactPerson: '张编辑',
    contactPhone: '13991283746',
    remark: '基层直报主力网格员队伍，外部用户即一线直报通讯员'
  },
  {
    id: 'ext-org-03',
    appId: 'app-04',
    appCode: 'V8-P-04',
    appName: '点点速评 - 矩阵化网评实战演练系统',
    appShortName: '点点速评',
    orgCode: 'CUST-SC-CD-003',
    orgName: '成都市武侯区网评信息调度大队',
    orgShortName: '成都武侯网评',
    statUnit: '四川区域',
    salesPerson: '陈子昂',
    status: 'expiring',
    externalUserCount: 4850,
    userQuota: 5000,
    uniqueUserCount: 4620,
    startDate: '2024-10-01',
    expireDate: '2026-09-30',
    wechatMpName: '速评任务调度助手',
    autoApprove: false,
    notifyEnabled: true,
    contactPerson: '王队长',
    contactPhone: '18628091122',
    remark: '距到期仅剩不足一个月，已发起配额扩容与服务续期流程'
  },
  {
    id: 'ext-org-04',
    appId: 'app-01',
    appCode: 'V8-P-01',
    appName: '正管用 - 网络生态综合治理平台',
    appShortName: '正管用',
    orgCode: 'CUST-SN-BJ-004',
    orgName: '宝鸡市金台区网信协同治理站',
    orgShortName: '宝鸡金台网信',
    statUnit: '陕西一区',
    salesPerson: '赵雪峰',
    status: 'active',
    externalUserCount: 320,
    userQuota: 500,
    uniqueUserCount: 310,
    startDate: '2025-03-01',
    expireDate: '2027-03-01',
    wechatMpName: '正管用政企直连',
    autoApprove: true,
    notifyEnabled: true,
    contactPerson: '刘主任',
    contactPhone: '13709172288',
    remark: '治理站辖区各企事业单位联络员账号体系'
  },
  {
    id: 'ext-org-05',
    appId: 'app-02',
    appCode: 'V8-P-02',
    appName: '指令流转 - 跨层级指挥调度系统',
    appShortName: '指令流转',
    orgCode: 'CUST-SC-MY-005',
    orgName: '绵阳市涪城区数字治理联合执勤办',
    orgShortName: '绵阳涪城数治',
    statUnit: '四川区域',
    salesPerson: '陈子昂',
    status: 'active',
    externalUserCount: 620,
    userQuota: 1500,
    uniqueUserCount: 605,
    startDate: '2025-04-01',
    expireDate: '2026-11-20',
    wechatMpName: '网安指令流转服务号',
    autoApprove: true,
    notifyEnabled: true,
    contactPerson: '孙干事',
    contactPhone: '18081290033',
    remark: '多部门协同联动应急外勤小组'
  },
  {
    id: 'ext-org-06',
    appId: 'app-03',
    appCode: 'V8-P-03',
    appName: '点点速报 - 移动端全媒体直报矩阵',
    appShortName: '点点速报',
    orgCode: 'CUST-HQ-006',
    orgName: '康奈全球数字化研发与运营总部',
    orgShortName: '康奈集团总部',
    statUnit: '康奈总部',
    salesPerson: '张国强',
    status: 'active',
    externalUserCount: 2200,
    userQuota: 10000,
    uniqueUserCount: 2150,
    startDate: '2024-01-01',
    expireDate: '2029-12-31',
    wechatMpName: '点点速报直通车',
    autoApprove: true,
    notifyEnabled: true,
    contactPerson: '高总监',
    contactPhone: '13900112233',
    remark: '集团全员及外部生态合作伙伴内测与演练'
  },
  {
    id: 'ext-org-07',
    appId: 'app-04',
    appCode: 'V8-P-04',
    appName: '点点速评 - 矩阵化网评实战演练系统',
    appShortName: '点点速评',
    orgCode: 'CUST-SN-WN-007',
    orgName: '渭南市临渭区网络文明传播志愿团',
    orgShortName: '渭南临渭文明团',
    statUnit: '陕西二区',
    salesPerson: '李思源',
    status: 'disabled',
    externalUserCount: 1400,
    userQuota: 2000,
    uniqueUserCount: 1350,
    startDate: '2024-05-01',
    expireDate: '2025-05-01',
    wechatMpName: '速评任务调度助手',
    autoApprove: false,
    notifyEnabled: false,
    contactPerson: '吴秘书',
    contactPhone: '13609137788',
    remark: '服务协议到期已锁定，等待续费开通'
  }
];

export const UnifiedExtUserOrgListView: React.FC = () => {
  // 状态管理
  const [orgsList, setOrgsList] = useState<ExtUserOrgItem[]>(INITIAL_EXT_USER_ORGS);
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>('all');
  const [selectedStatUnit, setSelectedStatUnit] = useState<string>('全部统计单元');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');

  // 弹窗状态
  const [editingOrg, setEditingOrg] = useState<ExtUserOrgItem | null>(null);
  const [detailOrg, setDetailOrg] = useState<ExtUserOrgItem | null>(null);
  const [qrModalOrg, setQrModalOrg] = useState<ExtUserOrgItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('已成功复制到剪贴板', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 重置筛选
  const handleResetFilter = () => {
    setSelectedAppFilter('all');
    setSelectedStatUnit('全部统计单元');
    setSelectedStatus('all');
    setSearchKeyword('');
    setSortOrder('default');
  };

  // 核心统计计算
  const stats = useMemo(() => {
    const totalOrgs = orgsList.length;
    const totalUsers = orgsList.reduce((sum, item) => sum + item.externalUserCount, 0);
    const totalQuota = orgsList.reduce((sum, item) => sum + item.userQuota, 0);
    const activeOrgs = orgsList.filter(o => o.status === 'active').length;
    const expiringOrgs = orgsList.filter(o => o.status === 'expiring').length;
    const disabledOrgs = orgsList.filter(o => o.status === 'disabled' || o.status === 'expired').length;
    return { totalOrgs, totalUsers, totalQuota, activeOrgs, expiringOrgs, disabledOrgs };
  }, [orgsList]);

  // 快捷点击统计卡片筛选
  const handleStatCardClick = (statusKey: string) => {
    if (selectedStatus === statusKey) {
      setSelectedStatus('all');
    } else {
      setSelectedStatus(statusKey);
    }
  };

  // 过滤数据
  const filteredOrgs = useMemo(() => {
    return orgsList.filter(org => {
      // 1. 应用过滤
      if (selectedAppFilter !== 'all' && org.appShortName !== selectedAppFilter && org.appId !== selectedAppFilter) {
        return false;
      }
      // 2. 统计单元过滤
      if (selectedStatUnit !== '全部统计单元' && org.statUnit !== selectedStatUnit) {
        return false;
      }
      // 3. 状态过滤
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'active' && org.status !== 'active') return false;
        if (selectedStatus === 'expiring' && org.status !== 'expiring') return false;
        if (selectedStatus === 'disabled' && org.status !== 'disabled' && org.status !== 'expired') return false;
      }
      // 4. 关键字搜索
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = org.orgName.toLowerCase().includes(kw);
        const matchShortName = org.orgShortName.toLowerCase().includes(kw);
        const matchCode = org.orgCode.toLowerCase().includes(kw);
        const matchSales = org.salesPerson.toLowerCase().includes(kw);
        const matchContact = org.contactPerson.toLowerCase().includes(kw);
        if (!matchName && !matchShortName && !matchCode && !matchSales && !matchContact) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime();
      }
      if (sortOrder === 'desc') {
        return new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime();
      }
      return 0;
    });
  }, [orgsList, selectedAppFilter, selectedStatUnit, selectedStatus, searchKeyword, sortOrder]);

  // 保存参数配置
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    setOrgsList(prev => prev.map(o => o.id === editingOrg.id ? editingOrg : o));
    setEditingOrg(null);
    showToast(`✓ 已成功更新【${editingOrg.orgShortName}】外部用户组织参数`, 'success');
  };

  // 切换状态
  const handleToggleStatus = (org: ExtUserOrgItem) => {
    const newStatus = org.status === 'disabled' ? 'active' : 'disabled';
    const updated = { ...org, status: newStatus as 'active' | 'disabled' };
    setOrgsList(prev => prev.map(o => o.id === org.id ? updated : o));
    showToast(`✓ 已${newStatus === 'active' ? '恢复启用' : '暂停锁定'}【${org.orgShortName}】外部用户权限`, 'info');
  };

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_ext_user_org_list_view"
    >
      {/* Toast 提示 */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900/95 text-emerald-100 border-emerald-700'
              : 'bg-slate-900/95 text-slate-100 border-slate-700'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-5">
        
        {/* Top Header Card: 严格遵循 V8 设计规范 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_ext_user_org_header_bar"
        >
          <div className="flex flex-col">
            {/* 面包屑导航 */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">各应用统一调用组件</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">外部用户组织列表</span>
            </nav>

            {/* 页面主标题与徽标 */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                外部用户组织列表
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-2xs select-none">
                多应用统一调用
              </span>
              <span className="text-xs text-slate-400 hidden md:inline ml-2">
                统一纳管与分配各应用下开通外部用户体系的客户组织架构、授权配额及到期时间
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => showToast('已成功导出外部用户组织名单数据报表 (CSV/Excel)', 'success')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer select-none"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出组织数据</span>
            </button>
          </div>
        </div>

        {/* 页面内容区 */}
        <div className="px-5 pb-5 flex flex-col gap-5">

          {/* 1. 顶部 6 项核心统计指标卡片 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            
            {/* 卡片 1: 外部用户组织总数 */}
            <div
              onClick={() => handleStatCardClick('all')}
              title="点击查看全部外部用户组织"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                selectedStatus === 'all'
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/30'
                  : 'bg-white border-slate-200/80 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">已开通组织数</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-900 tracking-tight">{stats.totalOrgs}</span>
                  <span className="text-xs text-slate-400">家机构</span>
                </div>
                <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-blue-100">
                  覆盖多款核心应用
                </div>
              </div>
            </div>

            {/* 卡片 2: 外部用户总人数 */}
            <div
              className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">外部用户总数</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalUsers.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">人次</span>
                </div>
                <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-indigo-100">
                  去重约 {(stats.totalUsers * 0.95).toFixed(0)} 人
                </div>
              </div>
            </div>

            {/* 卡片 3: 授权许可总配额 */}
            <div
              className="p-4 rounded-xl border border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">授权许可总配额</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-purple-900 tracking-tight">{stats.totalQuota.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">配额</span>
                </div>
                <div className="text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-purple-100">
                  使用率 {Math.round((stats.totalUsers / stats.totalQuota) * 100)}%
                </div>
              </div>
            </div>

            {/* 卡片 4: 正常运行组织 */}
            <div
              onClick={() => handleStatCardClick('active')}
              title="点击单选筛选正常运行中的组织"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                selectedStatus === 'active'
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'bg-white border-slate-200/80 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">正常运行组织</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">{stats.activeOrgs}</span>
                  <span className="text-xs text-slate-400">家</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-emerald-100">
                  服务状态健康
                </div>
              </div>
            </div>

            {/* 卡片 5: 即将到期预警 */}
            <div
              onClick={() => handleStatCardClick('expiring')}
              title="点击筛选即将到期的组织"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                selectedStatus === 'expiring'
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/30'
                  : 'bg-white border-slate-200/80 hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">即将到期预警</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-600 tracking-tight">{stats.expiringOrgs}</span>
                  <span className="text-xs text-slate-400">家</span>
                </div>
                <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-amber-100">
                  30天内到期
                </div>
              </div>
            </div>

            {/* 卡片 6: 已锁定/停用 */}
            <div
              onClick={() => handleStatCardClick('disabled')}
              title="点击筛选已锁定停用的组织"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                selectedStatus === 'disabled'
                  ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/30'
                  : 'bg-white border-slate-200/80 hover:border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">已停用/锁定</span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-rose-600 tracking-tight">{stats.disabledOrgs}</span>
                  <span className="text-xs text-slate-400">家</span>
                </div>
                <div className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-rose-100">
                  已暂停服务访问
                </div>
              </div>
            </div>

          </div>

          {/* 2. 综合搜索与多维过滤控制栏 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* 所属应用过滤 */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <span className="font-bold text-slate-500">所属应用:</span>
                <select
                  value={selectedAppFilter}
                  onChange={(e) => setSelectedAppFilter(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">全部开通应用 ({INITIAL_APPS.length})</option>
                  {INITIAL_APPS.map(app => (
                    <option key={app.id} value={app.appShortName}>
                      {app.appShortName} ({app.appCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* 统计单元过滤 */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <span className="font-bold text-slate-500">统计单元:</span>
                <select
                  value={selectedStatUnit}
                  onChange={(e) => setSelectedStatUnit(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  {STATISTICAL_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              {/* 组织状态过滤 */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                <span className="font-bold text-slate-500">状态:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">全部状态</option>
                  <option value="active">正常运行</option>
                  <option value="expiring">即将到期 (30天内)</option>
                  <option value="disabled">已停用/已锁定</option>
                </select>
              </div>

              {/* 模糊搜索框 */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索机构简称/全称/编码/销售/联系人..."
                  className="w-64 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

            </div>

            {/* 右侧重置与操作 */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>重置</span>
              </button>
            </div>
          </div>

          {/* 3. 外部用户组织数据列表卡片 */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  外部用户组织机构列表
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                  共 {filteredOrgs.length} 家
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                数据已与各应用外部用户体系完成实时双向校验
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-600 font-bold">
                    <th className="py-3 px-3.5 text-center w-12">序号</th>
                    <th className="py-3 px-4 min-w-[140px]">所属应用</th>
                    <th className="py-3 px-4 min-w-[240px]">机构简称 / 统计单元 · 销售</th>
                    <th className="py-3 px-4 text-center min-w-[110px]">外部体系状态</th>
                    <th className="py-3 px-4 min-w-[150px]">
                      <button
                        type="button"
                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? 'default' : 'asc')}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer select-none"
                      >
                        <span>授权有效期</span>
                        {sortOrder === 'asc' ? (
                          <span className="text-blue-700 font-black text-[10px] bg-blue-50 px-1 py-0.5 rounded">近到远 ↑</span>
                        ) : sortOrder === 'desc' ? (
                          <span className="text-blue-700 font-black text-[10px] bg-blue-50 px-1 py-0.5 rounded">远到近 ↓</span>
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 text-center min-w-[150px]">外部用户数 / 配额</th>
                    <th className="py-3 px-4 text-center min-w-[160px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrgs.length > 0 ? (
                    filteredOrgs.map((org, idx) => {
                      const percent = Math.min(100, Math.round((org.externalUserCount / (org.userQuota || 1)) * 100));
                      const isNearExpire = org.status === 'expiring';
                      const isDisabled = org.status === 'disabled';

                      return (
                        <tr key={org.id} className="hover:bg-blue-50/30 transition-colors group">
                          {/* 序号 */}
                          <td className="py-3.5 px-3.5 text-center font-mono text-slate-400 text-[11px]">
                            {String(idx + 1).padStart(2, '0')}
                          </td>

                          {/* 所属应用 */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 font-bold text-blue-900 bg-blue-50 text-[11px] px-2 py-0.5 rounded-md border border-blue-100/80 w-fit">
                                <Layers className="w-3 h-3 text-blue-600" />
                                {org.appShortName}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {org.appCode}
                              </span>
                            </div>
                          </td>

                          {/* 机构信息 */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-xs">
                                  {org.orgShortName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({org.orgCode})
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 line-clamp-1" title={org.orgName}>
                                {org.orgName}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {org.statUnit}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  销售: <strong className="text-slate-600">{org.salesPerson}</strong>
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 外部体系状态 */}
                          <td className="py-3.5 px-4 text-center">
                            {org.status === 'active' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                正常运行
                              </span>
                            )}
                            {org.status === 'expiring' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                即将到期
                              </span>
                            )}
                            {org.status === 'disabled' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                已锁定停用
                              </span>
                            )}
                          </td>

                          {/* 授权有效期 */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-xs font-bold text-slate-800">
                                {org.expireDate}
                              </span>
                              <span className={`text-[10px] font-semibold ${
                                isNearExpire ? 'text-amber-600 font-bold' : isDisabled ? 'text-slate-400' : 'text-slate-400'
                              }`}>
                                {isDisabled ? '已暂停' : isNearExpire ? '⚠ 不足30天' : `自 ${org.startDate}`}
                              </span>
                            </div>
                          </td>

                          {/* 外部用户数 / 配额 */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-1 max-w-[130px] mx-auto">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-800">
                                  {org.externalUserCount.toLocaleString()}
                                </span>
                                <span className="text-slate-400">
                                  / {org.userQuota.toLocaleString()}
                                </span>
                              </div>
                              {/* 进度条 */}
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    percent > 90 ? 'bg-rose-500' : percent > 70 ? 'bg-amber-500' : 'bg-blue-600'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-right text-slate-400 font-mono">
                                占比 {percent}%
                              </span>
                            </div>
                          </td>

                          {/* 操作 */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setEditingOrg(org)}
                                className="px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="配置专属外部用户参数、配额与到期时间"
                              >
                                参数配置
                              </button>
                              <button
                                onClick={() => setDetailOrg(org)}
                                className="px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                title="查看组织详细信息"
                              >
                                详情
                              </button>
                              <button
                                onClick={() => handleToggleStatus(org)}
                                className={`px-2 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                                  org.status === 'disabled'
                                    ? 'text-emerald-700 hover:bg-emerald-50'
                                    : 'text-rose-700 hover:bg-rose-50'
                                }`}
                                title={org.status === 'disabled' ? '恢复启用' : '暂停锁定'}
                              >
                                {org.status === 'disabled' ? '启用' : '停用'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        暂无符合条件的外部用户组织数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页栏 */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
              <span>显示第 1 至 {filteredOrgs.length} 项，共 {filteredOrgs.length} 条组织记录</span>
              <div className="flex items-center gap-1">
                <button disabled className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-300 cursor-not-allowed">上一页</button>
                <button className="px-2 py-1 bg-blue-600 text-white rounded font-bold">1</button>
                <button disabled className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-300 cursor-not-allowed">下一页</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- 弹窗 1: 外部用户组织参数配置弹窗 ---------------- */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    配置外部用户组织参数
                  </h3>
                  <span className="text-xs text-slate-500">
                    【{editingOrg.appShortName}】· {editingOrg.orgShortName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingOrg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              
              {/* 配额人数 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  外部用户许可配额人数 (人) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={editingOrg.userQuota}
                  onChange={(e) => setEditingOrg({ ...editingOrg, userQuota: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  当前已注册外部用户数: {editingOrg.externalUserCount} 人
                </span>
              </div>

              {/* 授权有效期 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">生效起始日期</label>
                  <input
                    type="date"
                    value={editingOrg.startDate}
                    onChange={(e) => setEditingOrg({ ...editingOrg, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">到期截止日期 <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    value={editingOrg.expireDate}
                    onChange={(e) => setEditingOrg({ ...editingOrg, expireDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* 消息推送服务号 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  关联消息推送公众号
                </label>
                <input
                  type="text"
                  value={editingOrg.wechatMpName}
                  onChange={(e) => setEditingOrg({ ...editingOrg, wechatMpName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* 自动免审入驻与消息开关 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">新外部用户入驻自动免审开通</span>
                  <span className="text-[11px] text-slate-400">开启后扫描公众号关注二维码直接获得使用授权</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingOrg.autoApprove}
                  onChange={(e) => setEditingOrg({ ...editingOrg, autoApprove: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              {/* 备注说明 */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={editingOrg.remark || ''}
                  onChange={(e) => setEditingOrg({ ...editingOrg, remark: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  保存参数
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------- 弹窗 2: 组织详情弹窗 (V8 沉浸式风格) ---------------- */}
      {detailOrg && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">
                  外部用户组织机构详情
                </h3>
              </div>
              <button
                onClick={() => setDetailOrg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              
              {/* 核心黑色高对比参数区 */}
              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span>组织机构标识编码</span>
                  <button
                    onClick={() => handleCopy(detailOrg.orgCode, 'orgCode')}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    {copiedKey === 'orgCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>复制编码</span>
                  </button>
                </div>
                <div className="text-sm font-black text-emerald-400 tracking-tight">
                  {detailOrg.orgCode}
                </div>
                <div className="text-[11px] text-slate-300">
                  所属系统: {detailOrg.appName}（{detailOrg.appCode}）
                </div>
              </div>

              {/* 详细信息网格 */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px]">机构全称:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailOrg.orgName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">机构简称:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailOrg.orgShortName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">统计单元:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailOrg.statUnit}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">责任销售:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailOrg.salesPerson}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">外部联系人:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailOrg.contactPerson} ({detailOrg.contactPhone})</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">推送公众号:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{detailOrg.wechatMpName}</p>
                </div>
              </div>

              {detailOrg.remark && (
                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-600">
                  <strong className="text-slate-800">业务备注:</strong> {detailOrg.remark}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setDetailOrg(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg cursor-pointer hover:bg-slate-800"
                >
                  关闭
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
