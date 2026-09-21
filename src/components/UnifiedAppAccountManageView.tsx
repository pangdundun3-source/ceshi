/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  Building2,
  Search,
  RotateCcw,
  CheckCircle2,
  Boxes,
  Eye,
  X,
  UserMinus,
  UserX,
  Lock,
  Download,
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Phone,
  ShieldCheck,
  Calendar,
  Layers,
  MapPin,
  FileText,
  User,
  Edit3,
  Check,
  Activity,
  LogIn,
  History,
  Smartphone,
  Laptop,
  Globe,
  MessageSquare,
  Clock,
  QrCode,
  Unlock,
  Copy,
  ExternalLink,
  Share2,
  Key,
  ShieldAlert,
  BadgeCheck,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Send,
  Mail,
  UserCheck,
  Briefcase,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

import {
  AppAccountUserRecord,
  APP_STAT_UNITS,
  SALES_MANAGERS,
  SAMPLE_ORGS_DATA,
  SAMPLE_USERS,
  maskMobile,
  INITIAL_APP_ACCOUNTS,
  generateMockAppAccounts,
  UserAppIdentityRecord,
  InviterProfile,
  SYSTEM_INVITERS,
  SYSTEM_ROLE_PERMISSIONS,
  SYSTEM_APPS_DEFINITIONS,
  AppRolePermissionDetail
} from '../data/mockAppAccounts';
import { IntegratedApp } from '../types';
import { INITIAL_APPS } from './AppManagement';
import { UserAppIdentitiesTableView } from './UserAppIdentitiesTableView';
import { UserDetailModal } from './UserDetailModal';

export { APP_STAT_UNITS };
export type { AppAccountUserRecord };

export interface UnifiedAppAccountManageViewProps {
  currentApp?: IntegratedApp;
  appsList?: IntegratedApp[];
  sharedAppAccounts?: AppAccountUserRecord[];
  onSharedAppAccountsChange?: (accounts: AppAccountUserRecord[]) => void;
  breadcrumbs?: string[];
  pageTitle?: string;
  pageSubtitle?: string;
  pageSubtitlePosition?: 'inline' | 'below';
  rightPromptBadge?: string;
}

export const UnifiedAppAccountManageView: React.FC<UnifiedAppAccountManageViewProps> = ({
  currentApp: propApp,
  appsList = INITIAL_APPS,
  sharedAppAccounts,
  onSharedAppAccountsChange,
  breadcrumbs,
  pageTitle,
  pageSubtitle,
  pageSubtitlePosition = 'inline',
  rightPromptBadge
}) => {
  const [localAccounts, setLocalAccounts] = useState<AppAccountUserRecord[]>(() => INITIAL_APP_ACCOUNTS);
  const userList = sharedAppAccounts || localAccounts;

  const handleUpdateAccounts = (updated: AppAccountUserRecord[]) => {
    setLocalAccounts(updated);
    if (onSharedAppAccountsChange) {
      onSharedAppAccountsChange(updated);
    }
  };

  // Toast 提示状态
  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastNotice({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastNotice(null);
    }, 3200);
  };

  // 复制文本辅助函数
  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`已成功复制${label}到剪贴板！`, 'success');
      }).catch(() => {
        fallbackCopyText(text, label);
      });
    } else {
      fallbackCopyText(text, label);
    }
  };

  const fallbackCopyText = (text: string, label: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      showToast(`已成功复制${label}到剪贴板！`, 'success');
    } catch {
      showToast(`复制失败，请手动选取复制`, 'warning');
    }
  };

  // 用户详情弹窗状态
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<AppAccountUserRecord | null>(null);
  const [detailModalTab, setDetailModalTab] = useState<'basic' | 'appIdentities' | 'loginLogs' | 'operationLogs'>('basic');
  const [isEditingRemark, setIsEditingRemark] = useState<boolean>(false);
  const [editRemarkValue, setEditRemarkValue] = useState<string>('');

  // 二维码邀请弹窗状态
  const [inviteModalData, setInviteModalData] = useState<{
    appIdentity: UserAppIdentityRecord;
    roleCode: string;
    realName: string;
    activationCode: string;
  } | null>(null);

  // 角色权限查看弹窗状态 (只读)
  const [rolePermissionModalData, setRolePermissionModalData] = useState<{
    appName: string;
    roleName: string;
    roleCode: string;
    description: string;
    groups: AppRolePermissionDetail['groups'];
  } | null>(null);

  // 邀请人身份详情弹窗状态
  const [inviterProfileModalData, setInviterProfileModalData] = useState<InviterProfile | null>(null);

  const handleOpenUserDetail = (user: AppAccountUserRecord) => {
    setSelectedUserForDetail(user);
    setDetailModalTab('basic');
    setIsEditingRemark(false);
    setEditRemarkValue(user.userRemark || '');
  };

  const handleSaveRemark = () => {
    if (!selectedUserForDetail) return;
    const newRemark = editRemarkValue.trim();
    const updatedUser: AppAccountUserRecord = {
      ...selectedUserForDetail,
      userRemark: newRemark
    };

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `OP-${Date.now()}`,
      operationTime: nowStr,
      action: '修改用户备注',
      module: '用户管理/管理员备注',
      operator: 'MT管理员',
      ip: '127.0.0.1 (内网管理端)',
      details: `管理员更新了用户专属备注（仅MT管理员可见）`
    };
    updatedUser.operationLogs = [newLog, ...(updatedUser.operationLogs || [])];

    setSelectedUserForDetail(updatedUser);
    const updatedList = userList.map(u => u.id === updatedUser.id ? updatedUser : u);
    handleUpdateAccounts(updatedList);
    setIsEditingRemark(false);
    showToast('管理员专属备注已成功保存！', 'success');
  };

  // 切换解锁应用账号状态
  const handleToggleUnlock = (appIdentity: UserAppIdentityRecord) => {
    if (!selectedUserForDetail) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const updatedIdentities = (selectedUserForDetail.appIdentities || []).map(item => {
      if (item.appId === appIdentity.appId) {
        return {
          ...item,
          status: 'active' as const
        };
      }
      return item;
    });

    const unlockLog = {
      id: `OP-${Date.now()}`,
      operationTime: nowStr,
      action: '解除应用锁定',
      module: '各应用身份/状态管理',
      operator: 'MT管理员',
      ip: '127.0.0.1 (内网管理端)',
      details: `管理员取消了用户在【${appIdentity.appName}】中的账号锁定状态，已恢复为【启用】`
    };

    const updatedUser: AppAccountUserRecord = {
      ...selectedUserForDetail,
      appIdentities: updatedIdentities,
      operationLogs: [unlockLog, ...(selectedUserForDetail.operationLogs || [])]
    };

    setSelectedUserForDetail(updatedUser);
    const updatedList = userList.map(u => u.id === updatedUser.id ? updatedUser : u);
    handleUpdateAccounts(updatedList);
    showToast(`已成功解除【${appIdentity.appName}】的锁定状态，该账号已恢复正常启用！`, 'success');
  };

  // 打开邀请二维码弹窗
  const handleOpenInvite = (appIdentity: UserAppIdentityRecord) => {
    if (!selectedUserForDetail) return;
    const randomCode = `ACT-${Math.floor(1000 + Math.random() * 9000)}-${selectedUserForDetail.id.replace('ACC-', '')}`;
    setInviteModalData({
      appIdentity,
      roleCode: appIdentity.roleCode || 'ROLE_BIZ_AUDITOR',
      realName: selectedUserForDetail.realName || '',
      activationCode: randomCode
    });
  };

  // 确认并下发邀请
  const handleConfirmInvite = () => {
    if (!selectedUserForDetail || !inviteModalData) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const selectedRoleDetail = SYSTEM_ROLE_PERMISSIONS[inviteModalData.roleCode] || SYSTEM_ROLE_PERMISSIONS['ROLE_BIZ_AUDITOR'];

    const updatedIdentities = (selectedUserForDetail.appIdentities || []).map(item => {
      if (item.appId === inviteModalData.appIdentity.appId) {
        return {
          ...item,
          status: 'active' as const,
          roleCode: inviteModalData.roleCode,
          roleName: selectedRoleDetail.roleName,
          activatedAt: nowStr
        };
      }
      return item;
    });

    const inviteLog = {
      id: `OP-${Date.now()}`,
      operationTime: nowStr,
      action: '发送应用邀请与激活',
      module: '各应用身份/邀请开通',
      operator: 'MT管理员',
      ip: '127.0.0.1 (内网管理端)',
      details: `管理员为用户生成并下发了【${inviteModalData.appIdentity.appName}】专属激活邀请码（${inviteModalData.activationCode}），授予角色：${selectedRoleDetail.roleName}`
    };

    const updatedUser: AppAccountUserRecord = {
      ...selectedUserForDetail,
      realName: inviteModalData.realName.trim() || selectedUserForDetail.realName,
      appIdentities: updatedIdentities,
      operationLogs: [inviteLog, ...(selectedUserForDetail.operationLogs || [])]
    };

    setSelectedUserForDetail(updatedUser);
    const updatedList = userList.map(u => u.id === updatedUser.id ? updatedUser : u);
    handleUpdateAccounts(updatedList);
    showToast(`邀请信息已生成并下发！用户在【${inviteModalData.appIdentity.appName}】已开通`, 'success');
    setInviteModalData(null);
  };

  // 打开角色权限查看弹窗
  const handleOpenRolePermissions = (appIdentity: UserAppIdentityRecord) => {
    const roleKey = appIdentity.roleCode || 'ROLE_BIZ_AUDITOR';
    const permDetail = SYSTEM_ROLE_PERMISSIONS[roleKey] || SYSTEM_ROLE_PERMISSIONS['ROLE_BIZ_AUDITOR'];
    setRolePermissionModalData({
      appName: appIdentity.appName,
      roleName: appIdentity.roleName || permDetail.roleName,
      roleCode: roleKey,
      description: permDetail.description,
      groups: permDetail.groups
    });
  };

  // 打开邀请人身份详情弹窗
  const handleOpenInviterProfile = (inviterRawName: string) => {
    const cleanName = inviterRawName.split(' ')[0].split('(')[0].trim();
    let profile = SYSTEM_INVITERS[cleanName];
    if (!profile) {
      profile = {
        id: `INV-AUTO-${Date.now().toString().slice(-4)}`,
        name: cleanName || '系统专员',
        inviterType: cleanName.includes('组长') || cleanName.includes('专员') ? 'V8' : 'MT',
        avatarBg: 'bg-blue-600',
        title: '客户成功顾问 / 专职对接人',
        employeeNo: 'EMP-20230099',
        dept: '政企业务生态支持部',
        org: '康奈总部',
        phone: '13800000000',
        email: `${cleanName || 'inviter'}@konne.cn`,
        wechatId: `wx_${cleanName || 'service'}`,
        totalInvited: 68,
        lastActive: '10分钟前',
        firstInviteDate: '2024-01-10',
        status: 'active'
      };
    }
    setInviterProfileModalData(profile);
  };

  // 排序各应用身份列表：正常应用在上，停用应用在下
  const sortedUserAppIdentities = useMemo(() => {
    if (!selectedUserForDetail) return [];
    let identities = selectedUserForDetail.appIdentities;
    if (!identities || identities.length === 0) {
      // 兼容生成
      identities = SYSTEM_APPS_DEFINITIONS.map(app => ({
        appId: app.appId,
        appCode: app.appCode,
        appName: app.appName,
        appShortName: app.appShortName,
        appStatus: app.appStatus,
        status: 'active' as const,
        roleName: '业务研判与处置审核员',
        roleCode: 'ROLE_BIZ_AUDITOR',
        inviterName: '张伟 (客户经理)',
        activatedAt: selectedUserForDetail.firstActivateDate ? `${selectedUserForDetail.firstActivateDate} 09:30:00` : '-'
      }));
    }

    return [...identities].sort((a, b) => {
      const isADisabled = a.appStatus === 'disabled' || a.appStatus === 'unpublished';
      const isBDisabled = b.appStatus === 'disabled' || b.appStatus === 'unpublished';
      if (isADisabled && !isBDisabled) return 1;
      if (!isADisabled && isBDisabled) return -1;
      return 0;
    });
  }, [selectedUserForDetail]);

  // Filters State
  const [selectedStatUnit, setSelectedStatUnit] = useState<string>('all');
  const [salesPersonInput, setSalesPersonInput] = useState<string>('');
  const [custOrgInput, setCustOrgInput] = useState<string>('');
  const [selectedRealNameStatus, setSelectedRealNameStatus] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 当前激活生效的过滤条件（点击“搜索”按钮或直接筛选时生效）
  const [appliedFilters, setAppliedFilters] = useState<{
    statUnit: string;
    salesPerson: string;
    custOrg: string;
    realNameStatus: string;
    status: string;
  }>({
    statUnit: 'all',
    salesPerson: '',
    custOrg: '',
    realNameStatus: 'all',
    status: 'all'
  });

  // 是否已执行搜索并有条件
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // 排序状态 (首次激活日期)
  const [activateDateSort, setActivateDateSort] = useState<'asc' | 'desc' | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 浮窗状态与坐标 (通过 Portal 渲染在顶层，彻底解决被表格或容器遮挡的问题)
  const [activePopover, setActivePopover] = useState<{
    user: AppAccountUserRecord;
    coords: { left: number; top: number; bottom: number };
    isPinned: boolean;
  } | null>(null);

  // 点击外部关闭 pinned popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activePopover?.isPinned) {
        const target = event.target as HTMLElement;
        if (!target.closest('.org-popover-box') && !target.closest('.org-popover-trigger')) {
          setActivePopover(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopover]);

  // 执行搜索
  const handleApplySearch = () => {
    setAppliedFilters({
      statUnit: selectedStatUnit,
      salesPerson: salesPersonInput,
      custOrg: custOrgInput,
      realNameStatus: selectedRealNameStatus,
      status: selectedStatus
    });
    setHasSearched(true);
    setCurrentPage(1);
  };

  // 重置所有筛选条件
  const handleResetAll = () => {
    setSelectedStatUnit('all');
    setSalesPersonInput('');
    setCustOrgInput('');
    setSelectedRealNameStatus('all');
    setSelectedStatus('all');
    setAppliedFilters({
      statUnit: 'all',
      salesPerson: '',
      custOrg: '',
      realNameStatus: 'all',
      status: 'all'
    });
    setHasSearched(false);
    setActivateDateSort(null);
    setCurrentPage(1);
  };

  // 联动点击机构简称：过滤对应机构 (搜索穿透)
  const handleFilterByOrgShortName = (shortName: string) => {
    setCustOrgInput(shortName);
    setAppliedFilters(prev => ({ ...prev, custOrg: shortName }));
    setHasSearched(true);
    setCurrentPage(1);
  };

  // 联动点击统计单元：过滤对应统计单元 (搜索穿透)
  const handleFilterByStatUnit = (statUnit: string) => {
    setSelectedStatUnit(statUnit);
    setAppliedFilters(prev => ({ ...prev, statUnit: statUnit }));
    setHasSearched(true);
    setCurrentPage(1);
  };

  // 联动点击客户经理：过滤对应客户经理 (搜索穿透)
  const handleFilterBySalesPerson = (salesPersonName: string) => {
    setSalesPersonInput(salesPersonName);
    setAppliedFilters(prev => ({ ...prev, salesPerson: salesPersonName }));
    setHasSearched(true);
    setCurrentPage(1);
  };

  // 切换首次激活日期排序
  const handleToggleActivateSort = () => {
    if (activateDateSort === null) {
      setActivateDateSort('desc'); // 首次点击：最近激活在前 (远到近)
    } else if (activateDateSort === 'desc') {
      setActivateDateSort('asc'); // 第二次点击：最早激活在前 (近到远)
    } else {
      setActivateDateSort(null); // 第三次点击：默认顺序
    }
  };

  // 顶部 5 项统计数据
  const stats = useMemo(() => {
    // 1. 应用用户总数
    const totalCount = userList.length;

    // 2. 正常状态用户数
    const normalCount = userList.filter(u => u.status === 'normal').length;

    // 3. 已取消关注用户数
    const unsubscribedCount = userList.filter(u => u.status === 'unsubscribed').length;

    // 4. 已锁定用户数
    const lockedCount = userList.filter(u => u.status === 'locked').length;

    // 5. 已删除用户数
    const deletedCount = userList.filter(u => u.status === 'deleted').length;

    return {
      totalCount,
      normalCount,
      unsubscribedCount,
      lockedCount,
      deletedCount
    };
  }, [userList]);

  // 根据当前生效条件过滤数据
  const filteredList = useMemo(() => {
    let result = userList.filter(item => {
      // 1. 统计单元
      if (appliedFilters.statUnit !== 'all') {
        if (item.statUnit !== appliedFilters.statUnit) return false;
      }

      // 2. 客户经理
      if (appliedFilters.salesPerson.trim()) {
        const sp = appliedFilters.salesPerson.trim().toLowerCase();
        if (!item.salesPerson.toLowerCase().includes(sp)) return false;
      }

      // 3. 客户简称、全称
      if (appliedFilters.custOrg.trim()) {
        const q = appliedFilters.custOrg.trim().toLowerCase();
        const matchShort = item.orgShortName.toLowerCase().includes(q);
        const matchFull = item.orgFullName.toLowerCase().includes(q);
        if (!matchShort && !matchFull) return false;
      }

      // 4. 实名状态
      if (appliedFilters.realNameStatus !== 'all') {
        const hasMobile = Boolean(item.mobile && item.mobile.trim().length > 0);
        if (appliedFilters.realNameStatus === 'real' && !hasMobile) return false;
        if (appliedFilters.realNameStatus === 'unreal' && hasMobile) return false;
      }

      // 5. 账号状态
      if (appliedFilters.status !== 'all') {
        if (item.status !== appliedFilters.status) return false;
      }

      return true;
    });

    // 排序处理
    if (activateDateSort === 'asc') {
      result = [...result].sort((a, b) => a.firstActivateDate.localeCompare(b.firstActivateDate));
    } else if (activateDateSort === 'desc') {
      result = [...result].sort((a, b) => b.firstActivateDate.localeCompare(a.firstActivateDate));
    }

    return result;
  }, [userList, appliedFilters, activateDateSort]);

  // Paging calculations
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  // 活跃筛选条件的文本标签
  const activeConditionTags = useMemo(() => {
    const tags: { label: string; key: string; value: string }[] = [];
    if (appliedFilters.statUnit !== 'all') {
      tags.push({ label: `统计单元: ${appliedFilters.statUnit}`, key: 'statUnit', value: appliedFilters.statUnit });
    }
    if (appliedFilters.salesPerson.trim()) {
      tags.push({ label: `客户经理: ${appliedFilters.salesPerson.trim()}`, key: 'salesPerson', value: appliedFilters.salesPerson.trim() });
    }
    if (appliedFilters.custOrg.trim()) {
      tags.push({ label: `客户: ${appliedFilters.custOrg.trim()}`, key: 'custOrg', value: appliedFilters.custOrg.trim() });
    }
    if (appliedFilters.realNameStatus !== 'all') {
      const realNameMap: Record<string, string> = {
        real: '已实名',
        unreal: '未实名'
      };
      tags.push({ label: `实名状态: ${realNameMap[appliedFilters.realNameStatus] || appliedFilters.realNameStatus}`, key: 'realNameStatus', value: appliedFilters.realNameStatus });
    }
    if (appliedFilters.status !== 'all') {
      const statusMap: Record<string, string> = {
        normal: '正常状态',
        unsubscribed: '已取消关注',
        locked: '已锁定',
        deleted: '已删除'
      };
      tags.push({ label: `账号状态: ${statusMap[appliedFilters.status] || appliedFilters.status}`, key: 'status', value: appliedFilters.status });
    }
    return tags;
  }, [appliedFilters]);

  // 清除单个条件
  const handleRemoveSingleCondition = (key: string) => {
    if (key === 'statUnit') {
      setSelectedStatUnit('all');
      setAppliedFilters(prev => ({ ...prev, statUnit: 'all' }));
    } else if (key === 'salesPerson') {
      setSalesPersonInput('');
      setAppliedFilters(prev => ({ ...prev, salesPerson: '' }));
    } else if (key === 'custOrg') {
      setCustOrgInput('');
      setAppliedFilters(prev => ({ ...prev, custOrg: '' }));
    } else if (key === 'realNameStatus') {
      setSelectedRealNameStatus('all');
      setAppliedFilters(prev => ({ ...prev, realNameStatus: 'all' }));
    } else if (key === 'status') {
      setSelectedStatus('all');
      setAppliedFilters(prev => ({ ...prev, status: 'all' }));
    }
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800" id="unified_app_account_manage_view">
      <div className="w-full flex flex-col gap-5">
        
        {/* Top Header Card: 参照客户机构顶部的风格样式 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_account_manage_header_bar"
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
                  <span className="text-slate-400 font-normal">统一组件库管理</span>
                  <span className="text-slate-400 font-normal">/</span>
                  <span className="text-slate-600 font-medium">应用账号管理</span>
                </>
              )}
            </nav>

            {/* 页面主标题与标签 */}
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-5 h-5 text-[#1e376b] shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight">{pageTitle || '应用账号管理'}</h1>
                  {pageSubtitlePosition === 'inline' && (
                    <span className="text-xs text-slate-500 font-normal">
                      · {pageSubtitle || '各应用统一调用的用户账号与身份管理'}
                    </span>
                  )}
                </div>
                {pageSubtitlePosition === 'below' && (
                  <span className="text-xs text-slate-500 font-normal mt-0.5">
                    {pageSubtitle || '本系统已开通的账号信息'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：橙色胶囊提示标签 */}
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
                  /MT-AIM-API/应用账号管理
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5 flex flex-col gap-4">

          {/* 二、 顶部统计数据 (5项指标) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* 1. 应用用户总数 */}
            <div
              id="app_total_users_stat_card"
              onClick={() => {
                handleResetAll();
              }}
              title="点击查看所有应用用户"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                appliedFilters.status === 'all' && appliedFilters.statUnit === 'all' && !appliedFilters.salesPerson && !appliedFilters.custOrg
                  ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/30'
                  : 'bg-white border-slate-200/80 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">应用用户总数</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalCount}</span>
                <span className="text-xs text-slate-400 ml-1 font-bold">个</span>
              </div>
            </div>

            {/* 2. 正常状态用户数 */}
            <div
              onClick={() => {
                const nextStatus = appliedFilters.status === 'normal' ? 'all' : 'normal';
                setSelectedStatus(nextStatus);
                setAppliedFilters(prev => ({ ...prev, status: nextStatus }));
                setHasSearched(true);
                setCurrentPage(1);
              }}
              title="点击筛选“正常”状态用户"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                appliedFilters.status === 'normal'
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'bg-white border-slate-200/80 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">正常状态用户</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-black text-emerald-600 tracking-tight">{stats.normalCount}</span>
                <span className="text-xs text-slate-400 ml-1 font-bold">个</span>
              </div>
            </div>

            {/* 3. 已取消关注用户数 */}
            <div
              onClick={() => {
                const nextStatus = appliedFilters.status === 'unsubscribed' ? 'all' : 'unsubscribed';
                setSelectedStatus(nextStatus);
                setAppliedFilters(prev => ({ ...prev, status: nextStatus }));
                setHasSearched(true);
                setCurrentPage(1);
              }}
              title="点击筛选“已取消关注”状态用户"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                appliedFilters.status === 'unsubscribed'
                  ? 'bg-slate-200 border-slate-400 ring-2 ring-slate-400/30'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">已取消关注</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <UserMinus className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-black text-slate-600 tracking-tight">{stats.unsubscribedCount}</span>
                <span className="text-xs text-slate-400 ml-1 font-bold">个</span>
              </div>
            </div>

            {/* 4. 已锁定用户数 */}
            <div
              onClick={() => {
                const nextStatus = appliedFilters.status === 'locked' ? 'all' : 'locked';
                setSelectedStatus(nextStatus);
                setAppliedFilters(prev => ({ ...prev, status: nextStatus }));
                setHasSearched(true);
                setCurrentPage(1);
              }}
              title="点击筛选“已锁定”状态用户"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                appliedFilters.status === 'locked'
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/30'
                  : 'bg-white border-slate-200/80 hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">已锁定用户</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-black text-amber-600 tracking-tight">{stats.lockedCount}</span>
                <span className="text-xs text-slate-400 ml-1 font-bold">个</span>
              </div>
            </div>

            {/* 5. 已删除用户数 */}
            <div
              onClick={() => {
                const nextStatus = appliedFilters.status === 'deleted' ? 'all' : 'deleted';
                setSelectedStatus(nextStatus);
                setAppliedFilters(prev => ({ ...prev, status: nextStatus }));
                setHasSearched(true);
                setCurrentPage(1);
              }}
              title="点击筛选“已删除”状态用户"
              className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
                appliedFilters.status === 'deleted'
                  ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/30'
                  : 'bg-white border-slate-200/80 hover:border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">已删除用户</span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-black text-rose-600 tracking-tight">{stats.deletedCount}</span>
                <span className="text-xs text-slate-400 ml-1 font-bold">个</span>
              </div>
            </div>
          </div>

          {/* 三与四、 搜索筛选与用户表格一体化容器 */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
            {/* 顶部搜索与筛选区域（上标题、下输入框排布） */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
              <div className="flex flex-wrap items-end gap-3.5">
                {/* 1. 统计单元 */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">统计单元</label>
                  <select
                    value={selectedStatUnit}
                    onChange={e => setSelectedStatUnit(e.target.value)}
                    className="w-[100px] px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] text-slate-800 font-medium cursor-pointer shadow-2xs h-8.5"
                  >
                    <option value="all">全部统计单元</option>
                    {APP_STAT_UNITS.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. 客户经理 */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">客户经理</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="销售姓名"
                      value={salesPersonInput}
                      onChange={e => setSalesPersonInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplySearch()}
                      className="w-[90px] px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] font-medium shadow-2xs placeholder:text-slate-400 h-8.5"
                    />
                    {salesPersonInput && (
                      <button
                        type="button"
                        onClick={() => setSalesPersonInput('')}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded-full cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. 客户简称、全称 */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">客户简称、全称</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={50}
                      placeholder="客户简称或全称"
                      value={custOrgInput}
                      onChange={e => setCustOrgInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleApplySearch()}
                      className="w-[180px] sm:w-[220px] px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] font-medium shadow-2xs placeholder:text-slate-400 h-8.5"
                    />
                    {custOrgInput && (
                      <button
                        type="button"
                        onClick={() => setCustOrgInput('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded-full cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. 实名状态 */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">实名状态</label>
                  <select
                    value={selectedRealNameStatus}
                    onChange={e => setSelectedRealNameStatus(e.target.value)}
                    className="w-[100px] px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] text-slate-800 font-medium cursor-pointer shadow-2xs h-8.5"
                  >
                    <option value="all">全部状态</option>
                    <option value="real">已实名</option>
                    <option value="unreal">未实名</option>
                  </select>
                </div>

                {/* 5. 账号状态 */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <label className="text-xs font-bold text-slate-700 whitespace-nowrap">账号状态</label>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="w-[110px] px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1e376b] text-slate-800 font-medium cursor-pointer shadow-2xs h-8.5"
                  >
                    <option value="all">全部状态</option>
                    <option value="normal">正常状态</option>
                    <option value="unsubscribed">已取消关注</option>
                    <option value="locked">已锁定</option>
                    <option value="deleted">已删除</option>
                  </select>
                </div>

                {/* 搜索与重置按钮 */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleApplySearch}
                    className="h-8.5 px-3.5 py-1.5 text-xs bg-[#1e376b] hover:bg-[#162952] text-white rounded-lg font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>搜索</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="h-8.5 px-3 py-1.5 text-xs bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>重置</span>
                  </button>
                </div>
              </div>

              {/* 筛选条件展示行（仅在有激活筛选条件时显示，移除右下角重复文字） */}
              {activeConditionTags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-600 whitespace-nowrap">筛选条件:</span>
                  {activeConditionTags.map(tag => (
                    <span
                      key={tag.key}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
                    >
                      <span>{tag.label}</span>
                      <button
                        onClick={() => handleRemoveSingleCondition(tag.key)}
                        className="text-blue-500 hover:text-blue-800 p-0.5 rounded-full hover:bg-blue-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 表格区域 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    {/* 第一列：用户V8唯一ID (宽度改为 100px) */}
                    <th className="py-3 px-3 w-[100px] min-w-[100px] whitespace-nowrap">用户V8唯一ID</th>

                    {/* 第二列：用户信息 (180px) */}
                    <th className="py-3 px-4 w-[180px] min-w-[180px]">用户信息</th>

                    {/* 第三列：已实名 */}
                    <th className="py-3 px-4 w-[130px] text-center">已实名</th>

                    {/* 第四列：所属客户机构 */}
                    <th className="py-3 px-4 min-w-[220px]">所属客户机构</th>

                    {/* 第五列：客户经理 (居中对齐) */}
                    <th className="py-3 px-4 w-[110px] text-center">客户经理</th>

                    {/* 第六列：首次激活日期（带排序） */}
                    <th
                      onClick={handleToggleActivateSort}
                      className="py-3 px-4 w-[140px] text-center cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                      title="点击切换首次激活日期排序"
                    >
                      <div className="inline-flex items-center justify-center gap-1 text-slate-700 font-bold">
                        <span>首次激活日期</span>
                        {activateDateSort === 'asc' ? (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono">
                            <ArrowUp className="w-3 h-3 text-blue-600" />
                            <span>升序</span>
                          </span>
                        ) : activateDateSort === 'desc' ? (
                          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono">
                            <ArrowDown className="w-3 h-3 text-blue-600" />
                            <span>降序</span>
                          </span>
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        )}
                      </div>
                    </th>

                    {/* 第七列：用户状态 */}
                    <th className="py-3 px-4 w-[120px] text-center">用户状态</th>

                    {/* 第八列：操作 (80px) */}
                    <th className="py-3 px-2 w-[80px] min-w-[80px] text-center">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="text-xs">未找到符合条件的用户账号记录</p>
                          <button
                            onClick={handleResetAll}
                            className="mt-1 px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded text-xs hover:bg-blue-100 cursor-pointer"
                          >
                            重置所有筛选条件
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map(user => {
                      const isTriggerActive = activePopover?.user.id === user.id;

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* 第一列：用户唯一ID (100px) */}
                          <td className="py-3.5 px-3 w-[100px] font-mono font-bold text-slate-700 text-xs">
                            {user.id}
                          </td>

                          {/* 第二列：用户信息 (180px) */}
                          <td className="py-3.5 px-4 w-[180px]">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}
                              >
                                {user.avatarText}
                              </div>
                              <div className="flex flex-col min-w-0 text-left">
                                <span className="font-bold text-slate-900 text-xs truncate leading-snug">
                                  {user.wechatNickname}
                                </span>
                                <span className="text-xs text-slate-600 font-medium leading-snug">
                                  {user.realName}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px] leading-snug">
                                  {user.openId}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 第三列：已实名 */}
                          <td className="py-3.5 px-4 text-center">
                            {user.mobile ? (
                              <div className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 text-xs bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200">
                                <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>{maskMobile(user.mobile)}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                未实名
                              </span>
                            )}
                          </td>

                          {/* 第四列：所属客户机构 */}
                          <td className="py-3.5 px-4 text-left">
                            <div className="flex flex-col items-start gap-1">
                              {/* 客户简称 + 信息提示图标 */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleFilterByOrgShortName(user.orgShortName)}
                                  title="点击按该客户简称过滤"
                                  className="font-black text-slate-900 text-xs hover:text-blue-700 transition-colors underline decoration-dotted decoration-slate-300 underline-offset-4 cursor-pointer text-left"
                                >
                                  {user.orgShortName}
                                </button>

                                {/* 信息提示图标 (Hover 展示，点击锁定/解锁固定) */}
                                <div className="relative inline-block">
                                  <button
                                    type="button"
                                    onMouseEnter={(e) => {
                                      if (!activePopover?.isPinned || activePopover.user.id === user.id) {
                                        const r = e.currentTarget.getBoundingClientRect();
                                        setActivePopover({
                                          user,
                                          coords: { left: r.left, top: r.top, bottom: r.bottom },
                                          isPinned: activePopover?.isPinned && activePopover.user.id === user.id ? true : false,
                                        });
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      if (activePopover && !activePopover.isPinned) {
                                        setActivePopover(null);
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const r = e.currentTarget.getBoundingClientRect();
                                      setActivePopover(prev => {
                                        if (prev?.isPinned && prev.user.id === user.id) {
                                          return null;
                                        }
                                        return {
                                          user,
                                          coords: { left: r.left, top: r.top, bottom: r.bottom },
                                          isPinned: true,
                                        };
                                      });
                                    }}
                                    className={`org-popover-trigger p-0.5 rounded-full transition-colors cursor-pointer ${
                                      isTriggerActive
                                        ? 'text-blue-600 bg-blue-100'
                                        : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                                    }`}
                                    title={activePopover?.isPinned && activePopover.user.id === user.id ? '点击关闭固定浮窗' : '点击固定详情浮窗（悬浮可预览）'}
                                  >
                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                  </button>
                                </div>
                              </div>

                              {/* 统计单元标签 (点击联动筛选统计单元) */}
                              <button
                                type="button"
                                onClick={() => handleFilterByStatUnit(user.statUnit)}
                                title="点击筛选该统计单元"
                                className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                {user.statUnit}
                              </button>
                            </div>
                          </td>

                          {/* 第五列：客户经理 (居中对齐，支持搜索穿透) */}
                          <td className="py-3.5 px-4 text-center text-xs">
                            <button
                              type="button"
                              onClick={() => handleFilterBySalesPerson(user.salesPerson)}
                              title={`点击筛选客户经理“${user.salesPerson}”`}
                              className="font-bold text-slate-800 hover:text-blue-700 hover:underline decoration-dotted transition-colors cursor-pointer"
                            >
                              {user.salesPerson}
                            </button>
                          </td>

                          {/* 第六列：首次激活日期 (第一行日期，第二行已激活xxx天，居中对齐) */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-mono font-bold text-slate-800 text-xs">
                                {user.firstActivateDate}
                              </span>
                              <span className="text-[11px] text-slate-400 font-normal mt-0.5">
                                已激活 {user.activeDays} 天
                              </span>
                            </div>
                          </td>

                          {/* 第七列：用户状态 (胶囊标签，居中对齐) */}
                          <td className="py-3.5 px-4 text-center">
                            {user.status === 'normal' && (
                              <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <span>正常状态</span>
                              </span>
                            )}
                            {user.status === 'unsubscribed' && (
                              <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                <span>已取消关注</span>
                              </span>
                            )}
                            {user.status === 'locked' && (
                              <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                <span>已锁定</span>
                              </span>
                            )}
                            {user.status === 'deleted' && (
                              <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                <span>已删除</span>
                              </span>
                            )}
                          </td>

                          {/* 第八列：操作 (宽度80px，查看详情按钮，居中对齐) */}
                          <td className="py-3.5 px-2 w-[80px] text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenUserDetail(user)}
                              className="inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>查看详情</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页控制区 */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredList.length)} 项，共 {filteredList.length} 条记录
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer"
                >
                  上一页
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-[#1e376b] text-white shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>

          {/* 机构详情全局浮窗（Portal 置顶在最上层，彻底杜绝任何表格或容器的层级遮挡与裁剪问题） */}
          {activePopover && createPortal(
            <div
              style={{
                position: 'fixed',
                left: Math.max(12, Math.min(window.innerWidth - 360, activePopover.coords.left - 20)),
                top: Math.max(12, activePopover.coords.top - 8),
                transform: 'translateY(-100%)',
                zIndex: 99999,
              }}
              onMouseEnter={() => {}}
              onMouseLeave={() => {
                if (!activePopover.isPinned) {
                  setActivePopover(null);
                }
              }}
              className="org-popover-box drop-shadow-2xl min-w-[320px] max-w-sm transition-all animate-in fade-in zoom-in-95 duration-150 text-left"
            >
              <div className="bg-slate-900 text-white text-xs p-3.5 rounded-xl shadow-2xl border border-slate-700/90">
                
                {/* 头部：标题与右上角关闭叉号 */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-bold text-white text-xs">机构详细信息</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopover(null);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                    title="关闭"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 内容列表 */}
                <div className="mt-2.5 space-y-1.5 text-[11px] leading-relaxed">
                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">机构全称:</span>
                    <span className="text-white font-bold break-words flex-1">{activePopover.user.orgFullName}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">统一社会信用代码:</span>
                    <span className="text-slate-200 font-mono">{activePopover.user.creditCode}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">首次添加时间:</span>
                    <span className="text-slate-200 font-mono">{activePopover.user.firstAddedTime}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">所在省市区:</span>
                    <span className="text-slate-200">{activePopover.user.provinceCityDistrict}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">机构级别:</span>
                    <span className="text-amber-300 font-medium">{activePopover.user.orgLevel}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">统计单元:</span>
                    <span className="text-slate-200">{activePopover.user.statUnitPath}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">客户分类:</span>
                    <span className="text-emerald-300 font-medium">{activePopover.user.custCategory}</span>
                  </div>

                  <div className="flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">客户经理:</span>
                    <span className="text-white font-bold">{activePopover.user.salesPerson}</span>
                  </div>
                </div>

                {/* 底部：关闭按钮 */}
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopover(null);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
              {/* 下方箭头指示 */}
              <div
                style={{
                  marginLeft: `${Math.max(14, Math.min(300, activePopover.coords.left - Math.max(12, Math.min(window.innerWidth - 360, activePopover.coords.left - 20)) + 6))}px`
                }}
                className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1.5 border-r border-b border-slate-700"
              />
            </div>,
            document.body
          )}

          {/* 标准用户账号查看组件 */}
          <UserDetailModal
            user={selectedUserForDetail}
            isOpen={!!selectedUserForDetail}
            onClose={() => setSelectedUserForDetail(null)}
            allUsers={userList}
            currentApp={propApp}
            onUpdateUser={(updatedUser) => {
              const updatedList = userList.map(u => u.id === updatedUser.id ? updatedUser : u);
              handleUpdateAccounts(updatedList);
              setSelectedUserForDetail(updatedUser);
            }}
          />

          {/* 1. 二维码邀请与激活码生成模态弹窗 */}
          {inviteModalData && selectedUserForDetail && (
            <div
              className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setInviteModalData(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 头部 */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#1e376b] to-[#2a4d8f] text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">生成应用开通邀请与激活码</h3>
                      <p className="text-[11px] text-blue-200 mt-0.5">
                        目标应用: <span className="text-white font-semibold">{inviteModalData.appIdentity.appName}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInviteModalData(null)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 内容表单 */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  {/* 用户信息与待开通应用 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">被邀请用户 (V8账号)</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {selectedUserForDetail.realName || selectedUserForDetail.wechatNickname}
                        <span className="ml-2 font-mono text-xs font-normal text-slate-500">({selectedUserForDetail.mobileMasked})</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {inviteModalData.appIdentity.appShortName}
                    </span>
                  </div>

                  {/* 表单字段: 填写真实姓名 */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                      <span>用户真实姓名</span>
                      <span className="text-rose-500">*</span>
                      <span className="text-[11px] font-normal text-slate-400">(邀请入库身份登记)</span>
                    </label>
                    <input
                      type="text"
                      value={inviteModalData.realName}
                      onChange={(e) => setInviteModalData({ ...inviteModalData, realName: e.target.value })}
                      placeholder="请输入用户真实姓名"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1e376b] focus:border-[#1e376b] bg-white font-medium"
                    />
                  </div>

                  {/* 表单字段: 选择开通角色 */}
                  <div>
                    <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1">
                      <span>授权业务角色</span>
                      <span className="text-rose-500">*</span>
                      <span className="text-[11px] font-normal text-slate-400">(在该业务系统中的操作权限)</span>
                    </label>
                    <select
                      value={inviteModalData.roleCode}
                      onChange={(e) => setInviteModalData({ ...inviteModalData, roleCode: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1e376b] focus:border-[#1e376b] bg-white font-medium"
                    >
                      {Object.values(SYSTEM_ROLE_PERMISSIONS).map(role => (
                        <option key={role.roleCode} value={role.roleCode}>
                          {role.roleName} ({role.roleCode})
                        </option>
                      ))}
                    </select>
                    <div className="text-[11px] text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                      {SYSTEM_ROLE_PERMISSIONS[inviteModalData.roleCode]?.description || '标准业务权限'}
                    </div>
                  </div>

                  {/* 二维码与激活码展示卡片 */}
                  <div className="bg-gradient-to-b from-slate-50 to-blue-50/30 p-4 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                    <div className="text-xs font-bold text-slate-700 mb-2">
                      微信 / 企业微信扫码或输入激活码完成绑定
                    </div>

                    {/* 模拟高保真邀请二维码卡片 */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative mb-3">
                      <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex flex-col items-center justify-between relative overflow-hidden">
                        {/* 模拟二维码点阵与视觉 */}
                        <div className="w-full h-full flex flex-col justify-between text-white">
                          <div className="flex justify-between w-full">
                            <div className="w-8 h-8 border-2 border-white rounded-sm p-1 flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-xs"></div>
                            </div>
                            <div className="w-8 h-8 border-2 border-white rounded-sm p-1 flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-xs"></div>
                            </div>
                          </div>
                          <div className="w-full py-1 text-center font-mono text-[9px] text-blue-200 tracking-wider">
                            KONNE V8 SYSTEM
                          </div>
                          <div className="flex justify-between w-full items-end">
                            <div className="w-8 h-8 border-2 border-white rounded-sm p-1 flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-xs"></div>
                            </div>
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                              V8
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 text-center">
                        有效期限: 72小时有效
                      </div>
                    </div>

                    {/* 专属激活码 */}
                    <div className="w-full flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs mb-2">
                      <span className="text-slate-500 font-medium">专属激活码:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1e376b] text-sm tracking-wider">
                          {inviteModalData.activationCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(inviteModalData.activationCode, '激活码')}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>复制</span>
                        </button>
                      </div>
                    </div>

                    {/* 专属链接 */}
                    <div className="w-full flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium shrink-0">专属链接:</span>
                      <div className="flex items-center gap-2 overflow-hidden ml-2">
                        <span className="font-mono text-slate-600 truncate text-[11px]">
                          {`https://v8.konne.cn/i/${inviteModalData.activationCode.toLowerCase()}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`https://v8.konne.cn/i/${inviteModalData.activationCode.toLowerCase()}`, '邀请链接')}
                          className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>复制</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `【系统邀请】请使用微信扫码或访问 https://v8.konne.cn/i/${inviteModalData.activationCode.toLowerCase()} 加入【${inviteModalData.appIdentity.appName}】系统。您的专属激活码为：${inviteModalData.activationCode}，开通角色：${SYSTEM_ROLE_PERMISSIONS[inviteModalData.roleCode]?.roleName || '业务员'}。`;
                      copyToClipboard(msg, '完整邀请文案');
                    }}
                    className="px-3 py-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>复制完整邀请文案</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInviteModalData(null)}
                      className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmInvite}
                      className="px-4 py-1.5 bg-[#1e376b] hover:bg-[#15274d] text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>确认并完成邀请</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. 角色权限详情弹窗 (只读查看) */}
          {rolePermissionModalData && (
            <div
              className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setRolePermissionModalData(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 头部 */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {rolePermissionModalData.roleName}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {rolePermissionModalData.roleCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        所属系统应用: <span className="font-semibold text-slate-700">{rolePermissionModalData.appName}</span> (只读权限视图)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRolePermissionModalData(null)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 权限内容列表 */}
                <div className="p-6 overflow-y-auto space-y-4 text-xs">
                  {/* 角色职责描述 */}
                  <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl text-slate-700 leading-relaxed">
                    <span className="font-bold text-blue-900">角色定位说明: </span>
                    {rolePermissionModalData.description}
                  </div>

                  {/* 权限分组与具体清单 */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-600" />
                      <span>已分配功能与数据权限清单 (共 {rolePermissionModalData.groups.reduce((acc, g) => acc + g.permissions.length, 0)} 项)</span>
                    </h4>

                    {rolePermissionModalData.groups.map((group, gIdx) => (
                      <div key={gIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
                          <span>{group.groupName}</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            {group.permissions.length} 项权限
                          </span>
                        </div>
                        <div className="divide-y divide-slate-100 bg-white">
                          {group.permissions.map((perm, pIdx) => (
                            <div key={pIdx} className="px-3.5 py-2.5 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                  <div className="font-medium text-slate-800">{perm.name}</div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">{perm.description}</div>
                                </div>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200 shrink-0">
                                {perm.code}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 底部 */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    <span>权限受企业级RBAC统一鉴权策略约束</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRolePermissionModalData(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. 邀请人身份详情弹窗 */}
          {inviterProfileModalData && (
            <div
              className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
              onClick={() => setInviterProfileModalData(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 头部 */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${inviterProfileModalData.avatarBg} text-white font-bold flex items-center justify-center text-xl shadow-md shrink-0`}>
                      {inviterProfileModalData.name.substring(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          {inviterProfileModalData.name}
                        </h3>
                        {inviterProfileModalData.inviterType === 'MT' ? (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40">
                            MT 系统管理员
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                            V8 前端用户
                          </span>
                        )}
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          在职认证
                        </span>
                      </div>
                      <p className="text-xs text-blue-200 mt-0.5">
                        {inviterProfileModalData.title}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInviterProfileModalData(null)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 详情内容 */}
                <div className="p-6 space-y-4 text-xs">
                  {/* 所属组织架构 */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">所属机构:</span>
                      <span className="font-bold text-slate-800">{inviterProfileModalData.org}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">所属部门:</span>
                      <span className="font-medium text-slate-800">{inviterProfileModalData.dept}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">员工工号:</span>
                      <span className="font-mono font-medium text-slate-700">{inviterProfileModalData.employeeNo}</span>
                    </div>
                  </div>

                  {/* 联络方式 */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                    <div className="px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>联络手机:</span>
                        <span className="font-mono font-bold text-slate-800">{inviterProfileModalData.phone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(inviterProfileModalData.phone, '手机号')}
                        className="px-2 py-0.5 text-[11px] text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        复制
                      </button>
                    </div>

                    <div className="px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <span>工作邮箱:</span>
                        <span className="font-mono text-slate-700">{inviterProfileModalData.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(inviterProfileModalData.email, '工作邮箱')}
                        className="px-2 py-0.5 text-[11px] text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        复制
                      </button>
                    </div>

                    <div className="px-3.5 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>企业微信:</span>
                        <span className="font-mono text-slate-700">{inviterProfileModalData.wechatId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(inviterProfileModalData.wechatId, '微信号')}
                        className="px-2 py-0.5 text-[11px] text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                      >
                        复制
                      </button>
                    </div>
                  </div>

                  {/* 邀请业务统计 */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] text-slate-400">累计成功邀请开通</div>
                      <div className="font-mono font-bold text-base text-[#1e376b] mt-0.5">
                        {inviterProfileModalData.totalInvited} 人
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div className="text-[11px] text-slate-400">近端系统活跃</div>
                      <div className="font-medium text-slate-700 text-xs mt-1">
                        {inviterProfileModalData.lastActive}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部 */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                  <button
                    type="button"
                    onClick={() => setInviterProfileModalData(null)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 全局悬浮 Toast 通知 */}
          {toastNotice && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-70 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl border bg-slate-900 text-white text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-200">
              {toastNotice.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toastNotice.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {toastNotice.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{toastNotice.message}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
