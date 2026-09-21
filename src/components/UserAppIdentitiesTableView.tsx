/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  QrCode,
  Eye,
  Lock,
  X,
  Check,
  ShieldCheck,
  ShieldAlert,
  Key,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  AlertTriangle,
  Info,
  Building2,
  Users,
  Search,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import {
  AppAccountUserRecord,
  UserAppIdentityRecord,
  InviterProfile,
  AppRolePermissionDetail,
  SYSTEM_INVITERS,
  SYSTEM_ROLE_PERMISSIONS
} from '../data/mockAppAccounts';
import { IntegratedApp } from '../types';
import { UserDetailModal } from './UserDetailModal';

export interface UserAppIdentitiesTableViewProps {
  /** The user whose identities are being displayed/managed */
  user?: AppAccountUserRecord;
  /** Complete list of app accounts for switching or updating */
  allUsers?: AppAccountUserRecord[];
  /** Callback when user list/account is modified (e.g. after sending an invite) */
  onUpdateUsers?: (updatedUsers: AppAccountUserRecord[]) => void;
  /** Current app context (if any) */
  currentApp?: IntegratedApp;
  /** Whether this is rendered as a standalone page (with user switchers and header) or embedded in a modal */
  isStandalonePage?: boolean;
  /** Optional custom title for the section */
  title?: string;
  /** Custom breadcrumbs if standalone */
  breadcrumbs?: string[];
}

export const UserAppIdentitiesTableView: React.FC<UserAppIdentitiesTableViewProps> = ({
  user: propUser,
  allUsers = [],
  onUpdateUsers,
  currentApp,
  isStandalonePage = false,
  title,
  breadcrumbs = ['统一组件库管理', '用户应用身份详情']
}) => {
  // Selected user for standalone mode
  const [selectedUserId, setSelectedUserId] = useState<string>(() => {
    return propUser?.id || allUsers[0]?.id || '';
  });

  const currentUser = isStandalonePage
    ? allUsers.find(u => u.id === selectedUserId) || propUser || allUsers[0]
    : propUser;

  // Search filter for applications within the table
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unfollowed' | 'canceled_follow' | 'locked'>('all');

  // User search/picker query in standalone mode
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Toast state
  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastNotice({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToastNotice(null);
    }, 3200);
  };

  // Copy helper
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

  // 1. Modal State: Exclusive QR Code Invite
  const [inviteModalData, setInviteModalData] = useState<{
    appIdentity: UserAppIdentityRecord;
    roleCode: string;
    realName: string;
    activationCode: string;
  } | null>(null);

  // 2. Modal State: Read-only Role Permissions Detail
  const [rolePermissionModalData, setRolePermissionModalData] = useState<{
    appName: string;
    roleName: string;
    roleCode: string;
    description: string;
    groups: AppRolePermissionDetail['groups'];
  } | null>(null);

  // 3. Modal State: Inviter Profile Detail (Legacy fallback)
  const [inviterProfileModalData, setInviterProfileModalData] = useState<InviterProfile | null>(null);

  // 4. Modal State: Standard V8 User Detail Modal (与“应用账号管理”用户详情一模一样)
  const [selectedV8UserDetail, setSelectedV8UserDetail] = useState<AppAccountUserRecord | null>(null);
  const [isV8UserDetailModalOpen, setIsV8UserDetailModalOpen] = useState(false);

  // Open invite modal
  const handleOpenInvite = (appIdentity: UserAppIdentityRecord) => {
    if (!currentUser) return;
    const randomCode = `ACT-${Math.floor(1000 + Math.random() * 9000)}-${currentUser.id.replace('ACC-', '')}`;
    setInviteModalData({
      appIdentity,
      roleCode: appIdentity.roleCode || 'ROLE_BIZ_AUDITOR',
      realName: currentUser.realName || '',
      activationCode: randomCode
    });
  };

  // Confirm and issue invite
  const handleConfirmInvite = () => {
    if (!currentUser || !inviteModalData) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const selectedRoleDetail = SYSTEM_ROLE_PERMISSIONS[inviteModalData.roleCode] || SYSTEM_ROLE_PERMISSIONS['ROLE_BIZ_AUDITOR'];

    const updatedIdentities = (currentUser.appIdentities || []).map(item => {
      if (item.appId === inviteModalData.appIdentity.appId || item.appCode === inviteModalData.appIdentity.appCode) {
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
      ...currentUser,
      realName: inviteModalData.realName.trim() || currentUser.realName,
      appIdentities: updatedIdentities,
      operationLogs: [inviteLog, ...(currentUser.operationLogs || [])]
    };

    if (onUpdateUsers && allUsers.length > 0) {
      const updatedList = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
      onUpdateUsers(updatedList);
    }
    showToast(`邀请信息已生成并下发！用户在【${inviteModalData.appIdentity.appName}】已开通`, 'success');
    setInviteModalData(null);
  };

  // Open role permissions modal
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

  // Open standard V8 User Detail Modal (与“应用账号管理”用户详情一模一样)
  const handleOpenV8UserDetail = (inviterRawName: string) => {
    const cleanName = inviterRawName.replace(/\s*[（(][^）)]*[）)]/g, '').trim() || inviterRawName;
    let foundUser = allUsers.find(u => 
      u.realName === cleanName || 
      u.wechatNickname === cleanName || 
      (u.realName && cleanName.includes(u.realName)) ||
      (u.wechatNickname && cleanName.includes(u.wechatNickname))
    );

    if (!foundUser) {
      // Synthesize realistic V8 user record matching this user
      foundUser = {
        id: `V8-USR-${Math.floor(100000 + Math.random() * 900000)}`,
        wechatNickname: cleanName,
        realName: cleanName,
        mobile: '138' + Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8),
        mobileMasked: '138****' + Math.floor(1000 + Math.random() * 9000),
        openId: `oV8_${cleanName}_${Math.random().toString(36).substring(2, 8)}`,
        unionId: `uV8_${cleanName}_${Math.random().toString(36).substring(2, 10)}`,
        creditCode: '91330300MA28T499XX',
        orgFullName: currentUser?.orgFullName || '温州康奈集团有限公司营销总公司',
        orgShortName: currentUser?.orgShortName || '康奈股份',
        provinceCityDistrict: currentUser?.provinceCityDistrict || '浙江省 / 温州市 / 鹿城区',
        orgLevel: 'KA战略直营机构',
        salesPerson: '张志华 (区域销售总监)',
        statUnit: currentUser?.statUnit || '温州总部运营中心',
        statUnitPath: currentUser?.statUnitPath || '华东大区 / 浙江省区 / 温州直营运营中心',
        activeDays: 320,
        firstActivateDate: '2023-11-18',
        status: 'normal',
        userRemark: 'V8前端核心业务骨干，具备各应用内用户协同与邀请开通权限。',
        avatarBg: 'bg-purple-600',
        loginLogs: [
          {
            id: `L-${Date.now()}-1`,
            loginTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            ip: '122.224.186.42',
            location: '浙江省温州市 (中国电信)',
            device: 'iPhone 15 Pro / iOS 17.4',
            clientType: '微信客户端 / 微信小程序',
            status: 'success'
          },
          {
            id: `L-${Date.now()}-2`,
            loginTime: '2026-03-10 14:22:18',
            ip: '122.224.186.42',
            location: '浙江省温州市 (中国电信)',
            device: 'MacBook Pro / macOS 14.2',
            clientType: 'Chrome 122.0 / Web端',
            status: 'success'
          }
        ],
        operationLogs: [
          {
            id: `OP-${Date.now()}-1`,
            operationTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            action: '发起应用协同邀请',
            module: '各应用身份/邀请开通',
            operator: cleanName,
            ip: '122.224.186.42',
            details: `V8用户在业务前端向客户生成并下发专属邀请协同码`
          },
          {
            id: `OP-${Date.now()}-2`,
            operationTime: '2026-03-08 10:15:00',
            action: '更新个人名片与营销片区',
            module: '个人中心/身份名片',
            operator: cleanName,
            ip: '122.224.186.42',
            details: `用户更新了在【销售业务管理系统】中的联系名片及所属片区信息`
          }
        ],
        appIdentities: [
          {
            appId: 'app-diting',
            appCode: 'diting_yujing',
            appName: '地听预警系统',
            appShortName: '地听预警',
            appStatus: 'active',
            status: 'active',
            roleName: '业务执行员',
            roleCode: 'ROLE_BIZ_AUDITOR',
            inviterName: '张志华',
            inviterType: 'MT',
            activatedAt: '2023-11-18 09:30:00'
          },
          {
            appId: 'app-sales',
            appCode: 'sales_biz_system',
            appName: '销售业务管理系统',
            appShortName: '销售业务',
            appStatus: 'active',
            status: 'active',
            roleName: '高级营销代表',
            roleCode: 'ROLE_SYS_ADMIN',
            inviterName: '张志华',
            inviterType: 'MT',
            activatedAt: '2023-11-18 09:30:00'
          },
          {
            appId: 'app-tech',
            appCode: 'tech_yujing',
            appName: '技术预警分析平台',
            appShortName: '技术预警',
            appStatus: 'active',
            status: 'active',
            roleName: '数据分析员',
            roleCode: 'ROLE_BIZ_USER',
            inviterName: '张志华',
            inviterType: 'MT',
            activatedAt: '2024-02-10 11:20:00'
          }
        ]
      };
    }

    setSelectedV8UserDetail(foundUser);
    setIsV8UserDetailModalOpen(true);
  };

  // Open inviter profile modal (fallback)
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

  // Sort identities: active first, then unfollowed, canceled, locked, disabled
  const rawIdentities = currentUser?.appIdentities || [];
  const currentAppCode = currentApp?.appCode || 'sales_biz_system';

  const sortedIdentities = [...rawIdentities].sort((a, b) => {
    // Current app always on top
    const aIsCurrent = a.appCode === currentAppCode;
    const bIsCurrent = b.appCode === currentAppCode;
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;

    // Disabled apps at bottom
    const aDisabled = a.appStatus === 'disabled' || a.appStatus === 'unpublished';
    const bDisabled = b.appStatus === 'disabled' || b.appStatus === 'unpublished';
    if (!aDisabled && bDisabled) return -1;
    if (aDisabled && !bDisabled) return 1;

    // Active status first
    const statusPriority: Record<string, number> = {
      active: 1,
      unfollowed: 2,
      canceled_follow: 3,
      locked: 4
    };
    const pA = statusPriority[a.status] || 99;
    const pB = statusPriority[b.status] || 99;
    return pA - pB;
  });

  const filteredIdentities = sortedIdentities.filter(item => {
    if (appSearchQuery) {
      const q = appSearchQuery.toLowerCase();
      const matchName = item.appName.toLowerCase().includes(q);
      const matchCode = item.appCode.toLowerCase().includes(q);
      const matchRole = (item.roleName || '').toLowerCase().includes(q);
      const matchInviter = (item.inviterName || '').toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchRole && !matchInviter) return false;
    }
    if (statusFilter !== 'all') {
      if (item.status !== statusFilter) return false;
    }
    return true;
  });

  // Filtered users for user switcher dropdown
  const filteredUsersList = allUsers.filter(u => {
    if (!userSearchQuery) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      (u.realName || '').toLowerCase().includes(q) ||
      (u.wechatNickname || '').toLowerCase().includes(q) ||
      (u.mobile || '').includes(q) ||
      (u.orgShortName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className={`flex flex-col ${isStandalonePage ? 'min-h-full bg-slate-50/70 p-6 space-y-5' : 'space-y-4'}`}>
      
      {/* 1. Standalone Page Header */}
      {isStandalonePage && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1e376b] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              {/* 面包屑导航 */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-slate-300">/</span>}
                    <span className={idx === breadcrumbs.length - 1 ? 'font-bold text-[#1e376b]' : ''}>
                      {crumb}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>用户应用身份详情</span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                  统一身份联动矩阵
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                全域应用系统开通状态、权限角色、邀请人及激活记录详情。此页面与弹窗“各应用身份”完全共享视图与交互。
              </p>
            </div>
          </div>

          {/* 右侧所属应用标识 */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <div className="px-3.5 py-1.5 bg-blue-50/80 border border-blue-200/90 rounded-xl flex items-center gap-2 text-xs text-[#1e376b]">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="font-medium text-slate-500">所属应用:</span>
              <span className="font-bold">{currentApp?.appName || '销售业务管理系统'}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Standalone Mode: User Profile & Selector Card */}
      {isStandalonePage && currentUser && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: User Avatar & Basic Info */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${currentUser.avatarBg || 'bg-[#1e376b]'} text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0`}>
                {currentUser.avatarText || (currentUser.realName || currentUser.wechatNickname || '用').substring(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900">
                    {currentUser.realName || currentUser.wechatNickname || '未实名用户'}
                  </h2>
                  {currentUser.realName ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      已实名认证
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      微信昵称：{currentUser.wechatNickname}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    ID: {currentUser.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-slate-600 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">所属机构:</span>
                    <span className="font-bold text-slate-800">{currentUser.orgShortName || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">手机号码:</span>
                    <span className="font-mono font-bold text-slate-800">{currentUser.mobile || '未绑定'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">统计单元:</span>
                    <span className="text-slate-700">{currentUser.statUnit || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Switch User Picker Dropdown */}
            {allUsers.length > 0 && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#1e376b] flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>切换查看其他用户 ({allUsers.length} 人)</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-100 bg-slate-50/70">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            placeholder="搜索姓名、手机、机构..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto divide-y divide-slate-100 max-h-72">
                        {filteredUsersList.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">
                            未找到匹配的用户
                          </div>
                        ) : (
                          filteredUsersList.map(u => {
                            const isSelected = u.id === currentUser.id;
                            return (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => {
                                  setSelectedUserId(u.id);
                                  setIsUserDropdownOpen(false);
                                }}
                                className={`w-full p-3 text-left flex items-center justify-between gap-3 hover:bg-blue-50/50 transition-colors cursor-pointer ${
                                  isSelected ? 'bg-blue-50/80 font-bold text-blue-900' : 'text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-lg ${u.avatarBg || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                                    {u.avatarText || (u.realName || u.wechatNickname || '用').substring(0, 1)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-800">
                                      {u.realName || u.wechatNickname}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      {u.mobile || '未实名'} · {u.orgShortName}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Identities Table Box */}
      <div className={`bg-white rounded-2xl ${isStandalonePage ? 'border border-slate-200/90 shadow-xs p-5' : ''}`}>
        
        {/* Top filter & search bar inside the table card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{title || '各应用身份与开通情况'}</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              (已接入 {sortedIdentities.length} 个应用系统，当前显示 {filteredIdentities.length} 项)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 状态过滤 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500 font-medium cursor-pointer"
            >
              <option value="all">全部开通状态</option>
              <option value="active">已启用</option>
              <option value="unfollowed">未关注</option>
              <option value="canceled_follow">已取消关注</option>
              <option value="locked">已锁定</option>
            </select>

            {/* 应用搜索 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
                placeholder="快速检索应用/角色/邀请人..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition-colors w-48 sm:w-56"
              />
              {appSearchQuery && (
                <button
                  type="button"
                  onClick={() => setAppSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 表格区 */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3 w-12 text-center">序号</th>
                  <th className="py-2.5 px-3.5 min-w-[210px]">所在应用</th>
                  <th className="py-2.5 px-3.5 min-w-[180px]">开通状态</th>
                  <th className="py-2.5 px-3.5 min-w-[200px]">所在应用角色</th>
                  <th className="py-2.5 px-3.5 min-w-[160px]">邀请人</th>
                  <th className="py-2.5 px-3.5 min-w-[150px]">激活时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredIdentities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Layers className="w-8 h-8 text-slate-300" />
                        <span>暂无符合条件的应用身份记录</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIdentities.map((item, idx) => {
                    const isAppDisabled = item.appStatus === 'disabled' || item.appStatus === 'unpublished';
                    return (
                      <tr
                        key={item.appId || item.appCode}
                        className={`transition-colors ${
                          isAppDisabled ? 'bg-slate-50/60 hover:bg-slate-100/70 text-slate-500' : 'hover:bg-blue-50/30'
                        }`}
                      >
                        {/* 1. 序号 */}
                        <td className="py-3 px-3 text-center text-slate-400 font-medium align-middle">
                          {idx + 1}
                        </td>

                        {/* 2. 所在应用 */}
                        <td className="py-3 px-3.5 align-middle">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-xs ${isAppDisabled ? 'text-slate-600' : 'text-slate-800'}`}>
                              {item.appName}
                            </span>
                            {isAppDisabled && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                停用
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            应用标识: {item.appCode}
                          </div>
                        </td>

                        {/* 3. 开通状态 */}
                        <td className="py-3 px-3.5 align-middle">
                          {item.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              启用
                            </span>
                          )}

                          {item.status === 'unfollowed' && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                未关注
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenInvite(item)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                                title="点击生成专属邀请二维码与激活码"
                              >
                                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                                <span>邀请</span>
                              </button>
                            </div>
                          )}

                          {item.status === 'canceled_follow' && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                已取消关注
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenInvite(item)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border border-blue-200 text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                                title="点击生成专属邀请二维码与激活码"
                              >
                                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                                <span>邀请</span>
                              </button>
                            </div>
                          )}

                          {item.status === 'locked' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <Lock className="w-3 h-3 text-rose-500" />
                              已锁定
                            </span>
                          )}
                        </td>

                        {/* 4. 所在应用角色 */}
                        <td className="py-3 px-3.5 align-middle">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold text-xs ${isAppDisabled ? 'text-slate-600' : 'text-slate-800'}`}>
                              {item.roleName || '-'}
                            </span>
                            {item.roleName && item.roleName !== '-' && (
                              <button
                                type="button"
                                onClick={() => handleOpenRolePermissions(item)}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="查看该角色拥有的所有权限列表 (只读)"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* 5. 邀请人 */}
                        <td className="py-3 px-3.5 align-middle">
                          {item.inviterName && item.inviterName !== '-' ? (() => {
                            const rawName = item.inviterName;
                            // MT check: explicit MT type or matches MT admin/management titles
                            const isMT = item.inviterType === 'MT' || 
                              (!item.inviterType && (
                                rawName.includes('经理') || 
                                rawName.includes('顾问') || 
                                rawName.includes('主管') || 
                                rawName.includes('总监') || 
                                rawName.includes('专家') ||
                                rawName.includes('管理员') ||
                                rawName.includes('运维')
                              ));

                            // 去掉括号里的身份，例如 "张志华 (区域销售总监)" -> "张志华"
                            const cleanName = rawName.replace(/\s*[（(][^）)]*[）)]/g, '').trim() || rawName;

                            if (isMT) {
                              // MT 的邀请人：不能点击，并且只显示人的名称，不需要显示括号里的身份
                              return (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0" title="系统管理员邀请 (MT)">
                                    MT
                                  </span>
                                  <span className="text-slate-700 font-medium text-xs">
                                    {cleanName}
                                  </span>
                                </div>
                              );
                            } else {
                              // V8 前端用户邀请：只有 V8 的用户会点击详情，弹出与“用户标准身份”一模一样的详情浮窗
                              return (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0" title="前端用户邀请 (V8)">
                                    V8
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenV8UserDetail(cleanName)}
                                    className="text-blue-600 hover:text-blue-800 hover:underline font-bold text-xs cursor-pointer transition-colors text-left"
                                    title="点击查看该 V8 用户完整详情档案"
                                  >
                                    <span>{cleanName}</span>
                                  </button>
                                </div>
                              );
                            }
                          })() : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>

                        {/* 6. 激活时间 */}
                        <td className="py-3 px-3.5 align-middle">
                          <span className="font-mono text-slate-600 text-xs">
                            {item.activatedAt && item.activatedAt !== '-' ? (
                              item.activatedAt
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. MODAL 1: 专属二维码与激活码邀请弹窗 */}
      {inviteModalData && (
        <div
          className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setInviteModalData(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    邀请用户开通应用 · {inviteModalData.appIdentity.appName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    生成专属邀请二维码与激活码，用户扫码或输入激活码即可完成身份绑定
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInviteModalData(null)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* 用户姓名核对/修改 */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  实名认证姓名 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={inviteModalData.realName}
                  onChange={(e) => setInviteModalData({ ...inviteModalData, realName: e.target.value })}
                  placeholder="请输入用户真实姓名"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* 拟分配角色选择 */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  拟授予应用角色 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={inviteModalData.roleCode}
                  onChange={(e) => setInviteModalData({ ...inviteModalData, roleCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  {Object.entries(SYSTEM_ROLE_PERMISSIONS).map(([code, role]) => (
                    <option key={code} value={code}>
                      {role.roleName} ({code})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  {SYSTEM_ROLE_PERMISSIONS[inviteModalData.roleCode]?.description || '分配业务角色'}
                </p>
              </div>

              {/* 专属二维码与激活码展示区 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center gap-2">
                  <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex items-center justify-center relative overflow-hidden">
                    <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-white rounded">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-xs ${
                            (i % 2 === 0 && (i % 3 === 0 || i % 5 === 0)) || i < 6 || i % 6 === 0 || i > 30 || i % 6 === 5
                              ? 'bg-slate-900'
                              : 'bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">微信扫一扫完成身份绑定</span>
                </div>

                {/* 激活码 */}
                <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block">专属激活码 (7天有效):</span>
                    <span className="font-mono font-bold text-sm text-[#1e376b] tracking-wider">
                      {inviteModalData.activationCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(inviteModalData.activationCode, '激活码')}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-bold transition-colors cursor-pointer"
                  >
                    复制激活码
                  </button>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                <span>下发后用户开通状态将变更为“启用”</span>
              </span>
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

      {/* 5. MODAL 2: 角色权限详情弹窗 (只读查看) */}
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
              {/* 角色定位说明 */}
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

      {/* 6. MODAL 3: 邀请人身份详情弹窗 */}
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

      {/* 7. MODAL 4: V8 前端用户完整详情档案弹窗 (与“应用账号管理”用户详情一模一样) */}
      <UserDetailModal
        user={selectedV8UserDetail}
        isOpen={isV8UserDetailModalOpen}
        onClose={() => {
          setIsV8UserDetailModalOpen(false);
          setSelectedV8UserDetail(null);
        }}
        onUpdateUser={(updatedUser) => {
          if (onUpdateUsers && allUsers.length > 0) {
            const updatedList = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
            onUpdateUsers(updatedList);
          }
          setSelectedV8UserDetail(updatedUser);
        }}
        allUsers={allUsers}
        currentApp={currentApp}
        defaultTab="basic"
      />

      {/* 8. 全局 Toast */}
      {toastNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-70 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl border bg-slate-900 text-white text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-200">
          {toastNotice.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastNotice.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toastNotice.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
          <span>{toastNotice.message}</span>
        </div>
      )}

    </div>
  );
};
