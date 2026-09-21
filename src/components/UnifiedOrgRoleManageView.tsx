/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerOrgItem, INITIAL_CUSTOMER_ORGS } from '../data/mockCustomerOrgs';
import {
  ShieldCheck,
  Plus,
  Building2,
  Users,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  KeyRound,
  Search,
  Check,
  X,
  AlertCircle,
  Save,
  Lock,
  ChevronRight,
  Shield,
  Filter,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { INITIAL_PRIMARY_PERMS, PrimaryPermItem } from './PermissionDictManage';

export interface OrgRole {
  id: string;
  code: string;
  name: string;
  usersCount: number;
  permsSummary: string;
  type: '内置' | '自定义';
  description: string;
  assignedPermCodes: string[];
  assignedUserNames: string[];
}

export interface UnifiedOrgRoleManageViewProps {
  customerOrg?: CustomerOrgItem;
  isStandalonePage?: boolean;
  onShowToast?: (text: string, type?: 'success' | 'warning' | 'info') => void;
}

export const UnifiedOrgRoleManageView: React.FC<UnifiedOrgRoleManageViewProps> = ({
  customerOrg,
  isStandalonePage = true,
  onShowToast
}) => {
  const [customerOrgs] = useState<CustomerOrgItem[]>(INITIAL_CUSTOMER_ORGS);
  const [selectedCustId, setSelectedCustId] = useState<string>(
    customerOrg?.id || INITIAL_CUSTOMER_ORGS[0].id
  );

  const currentCustomer = customerOrg ||
    customerOrgs.find((c) => c.id === selectedCustId) || customerOrgs[0];

  const [roles, setRoles] = useState<OrgRole[]>([
    {
      id: 'r1',
      code: 'ROLE_ORG_ADMIN',
      name: '机构超级管理员',
      usersCount: 1,
      permsSummary: '全部管理权限 (含机构配置与转正申请)',
      type: '内置',
      description: '拥有该客户机构在本系统的全部最高管理权限与人员调配权限。',
      assignedPermCodes: ['perm_grp_01', 'sub_01_01', 'sub_01_02', 'perm_grp_02', 'sub_02_01', 'sub_02_02', 'sub_02_03', 'perm_grp_03', 'sub_03_01', 'sub_03_02', 'perm_grp_04', 'sub_04_01', 'sub_04_02', 'perm_grp_05', 'sub_05_01'],
      assignedUserNames: ['陈明 (机构主管)']
    },
    {
      id: 'r2',
      code: 'ROLE_BIZ_DIRECTOR',
      name: '业务主管',
      usersCount: 2,
      permsSummary: '态势查看 + 预警审批 + 报表导出',
      type: '自定义',
      description: '负责日常业务监测、预警事件研判与批量导出报告。',
      assignedPermCodes: ['perm_grp_01', 'sub_01_01', 'sub_01_02', 'perm_grp_02', 'sub_02_01', 'perm_grp_03', 'sub_03_01'],
      assignedUserNames: ['刘丽华 (风控部经理)', '赵峰 (运营组长)']
    },
    {
      id: 'r3',
      code: 'ROLE_DATA_OPERATOR',
      name: '填报专员',
      usersCount: 6,
      permsSummary: '数据填报 + 草稿提交 + 基础态势',
      type: '自定义',
      description: '负责基层单位数据采集、草稿填报与审核流转。',
      assignedPermCodes: ['perm_grp_01', 'sub_01_01', 'perm_grp_02', 'sub_02_02'],
      assignedUserNames: ['孙婷', '周建国', '王海燕', '张雷', '徐艳', '钱伟']
    },
    {
      id: 'r4',
      code: 'ROLE_AUDITOR',
      name: '只读审计员',
      usersCount: 3,
      permsSummary: '只读查看 + 安全日志审计',
      type: '自定义',
      description: '负责系统使用合规性审计，只读访问各类分析看板。',
      assignedPermCodes: ['perm_grp_01', 'sub_01_01', 'perm_grp_04', 'sub_04_01'],
      assignedUserNames: ['林晓东 (内审专员)', '黄慧 (合规顾问)', '马超']
    }
  ]);

  // Filters & Search
  const [filterType, setFilterType] = useState<'all' | '内置' | '自定义'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Toast feedback internal helper
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    if (onShowToast) {
      onShowToast(text, type);
    } else {
      setToastMsg({ text, type });
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // Modal State: Create / Edit Role
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<OrgRole | null>(null);
  const [roleForm, setRoleForm] = useState<{ name: string; code: string; description: string; type: '内置' | '自定义' }>({
    name: '',
    code: '',
    description: '',
    type: '自定义'
  });

  // Modal State: Configure Permissions
  const [permModalOpen, setPermModalOpen] = useState<boolean>(false);
  const [permTargetRole, setPermTargetRole] = useState<OrgRole | null>(null);
  const [selectedPermCodes, setSelectedPermCodes] = useState<string[]>([]);

  // Modal State: Member Allocation
  const [memberModalOpen, setMemberModalOpen] = useState<boolean>(false);
  const [memberTargetRole, setMemberTargetRole] = useState<OrgRole | null>(null);
  const [newMemberInput, setNewMemberInput] = useState<string>('');

  // Filtered Roles
  const filteredRoles = roles.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      return (
        r.name.toLowerCase().includes(kw) ||
        r.code.toLowerCase().includes(kw) ||
        r.description.toLowerCase().includes(kw) ||
        r.permsSummary.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  // Open Create Role Modal
  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleForm({
      name: '',
      code: `ROLE_${Date.now().toString().slice(-4)}`,
      description: '',
      type: '自定义'
    });
    setRoleModalOpen(true);
  };

  // Open Edit Role Modal
  const handleOpenEditRole = (role: OrgRole) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      code: role.code,
      description: role.description,
      type: role.type
    });
    setRoleModalOpen(true);
  };

  // Save Role (Create or Edit)
  const handleSaveRole = () => {
    if (!roleForm.name.trim()) {
      showToast('请输入角色名称', 'warning');
      return;
    }
    if (!roleForm.code.trim()) {
      showToast('请输入角色唯一标识', 'warning');
      return;
    }

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: roleForm.name.trim(),
                code: roleForm.code.trim(),
                description: roleForm.description.trim()
              }
            : r
        )
      );
      showToast(`已成功更新角色「${roleForm.name}」配置`);
    } else {
      const newRole: OrgRole = {
        id: `r_${Date.now()}`,
        code: roleForm.code.trim().toUpperCase(),
        name: roleForm.name.trim(),
        usersCount: 0,
        permsSummary: '基础态势查看 (待分配详细权限)',
        type: '自定义',
        description: roleForm.description.trim() || '机构专属自定义业务角色。',
        assignedPermCodes: ['perm_grp_01', 'sub_01_01'],
        assignedUserNames: []
      };
      setRoles((prev) => [...prev, newRole]);
      showToast(`已成功新建机构专属角色「${newRole.name}」`);
    }
    setRoleModalOpen(false);
  };

  // Delete Role
  const handleDeleteRole = (role: OrgRole) => {
    if (role.type === '内置') {
      showToast('系统内置角色不可删除', 'warning');
      return;
    }
    if (confirm(`确定要删除机构角色「${role.name}」吗？已分配该角色的 ${role.usersCount} 位成员将被解除角色绑定。`)) {
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      showToast(`已删除角色「${role.name}」`, 'info');
    }
  };

  // Open Permission Configuration Modal
  const handleOpenPermConfig = (role: OrgRole) => {
    setPermTargetRole(role);
    setSelectedPermCodes([...role.assignedPermCodes]);
    setPermModalOpen(true);
  };

  // Toggle Single Permission Code
  const handleTogglePermCode = (code: string) => {
    setSelectedPermCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Toggle entire primary permission group
  const handleTogglePrimaryGroup = (group: PrimaryPermItem) => {
    const groupCodes = [group.id, ...group.subPermissions.map((s) => s.id)];
    const allSelected = groupCodes.every((c) => selectedPermCodes.includes(c));
    if (allSelected) {
      setSelectedPermCodes((prev) => prev.filter((c) => !groupCodes.includes(c)));
    } else {
      setSelectedPermCodes((prev) => Array.from(new Set([...prev, ...groupCodes])));
    }
  };

  // Save Permission Configuration
  const handleSavePermConfig = () => {
    if (!permTargetRole) return;
    const selectedCount = selectedPermCodes.length;
    let summaryText = '基础态势与查看';
    if (selectedCount > 8) {
      summaryText = '全部管理权限 (含机构配置与分析研判)';
    } else if (selectedCount > 4) {
      summaryText = '态势查看 + 预警审批 + 报表导出';
    } else if (selectedCount > 0) {
      summaryText = '数据填报 + 草稿提交 + 基础态势';
    } else {
      summaryText = '无已分配权限 (只读)';
    }

    setRoles((prev) =>
      prev.map((r) =>
        r.id === permTargetRole.id
          ? {
              ...r,
              assignedPermCodes: selectedPermCodes,
              permsSummary: summaryText
            }
          : r
      )
    );
    showToast(`✓ 已成功为「${permTargetRole.name}」保存权限配置（共分配 ${selectedCount} 项权限）`);
    setPermModalOpen(false);
  };

  // Open Member Allocation Modal
  const handleOpenMemberModal = (role: OrgRole) => {
    setMemberTargetRole(role);
    setNewMemberInput('');
    setMemberModalOpen(true);
  };

  // Add Member to Role
  const handleAddMember = () => {
    if (!newMemberInput.trim() || !memberTargetRole) return;
    const nameToAdd = newMemberInput.trim();
    if (memberTargetRole.assignedUserNames.includes(nameToAdd)) {
      showToast('该成员已在当前角色成员列表中', 'warning');
      return;
    }
    const updatedUsers = [...memberTargetRole.assignedUserNames, nameToAdd];
    setRoles((prev) =>
      prev.map((r) =>
        r.id === memberTargetRole.id
          ? {
              ...r,
              assignedUserNames: updatedUsers,
              usersCount: updatedUsers.length
            }
          : r
      )
    );
    setMemberTargetRole((prev) => (prev ? { ...prev, assignedUserNames: updatedUsers, usersCount: updatedUsers.length } : null));
    setNewMemberInput('');
    showToast(`已将「${nameToAdd}」添加至「${memberTargetRole.name}」`);
  };

  // Remove Member from Role
  const handleRemoveMember = (userName: string) => {
    if (!memberTargetRole) return;
    const updatedUsers = memberTargetRole.assignedUserNames.filter((u) => u !== userName);
    setRoles((prev) =>
      prev.map((r) =>
        r.id === memberTargetRole.id
          ? {
              ...r,
              assignedUserNames: updatedUsers,
              usersCount: updatedUsers.length
            }
          : r
      )
    );
    setMemberTargetRole((prev) => (prev ? { ...prev, assignedUserNames: updatedUsers, usersCount: updatedUsers.length } : null));
    showToast(`已从「${memberTargetRole.name}」中移除成员「${userName}」`, 'info');
  };

  // Main Content Component
  const MainContent = (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col gap-5">
      {/* 头部区域 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1e376b]" />
            <span>客户机构「{currentCustomer.orgShortName || currentCustomer.orgName}」角色配置</span>
            <span className="text-xs font-bold text-slate-500">（共 {roles.length} 个角色）</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            针对该特定客户机构业务架构定制角色身份与系统功能权限绑定策略。
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateRole}
          className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-blue-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建机构专属角色</span>
        </button>
      </div>

      {/* 筛选与搜索工具条 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            角色类型:
          </span>
          {(['all', '内置', '自定义'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-white text-[#1e376b] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {type === 'all' ? '全部角色' : type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索角色名称、标识或权限..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 角色卡片列表 */}
      {filteredRoles.length === 0 ? (
        <div className="p-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
          <Shield className="w-8 h-8 text-slate-300" />
          <span className="text-xs font-bold text-slate-500">未找到符合条件的角色记录</span>
          <button
            onClick={() => { setFilterType('all'); setSearchKeyword(''); }}
            className="text-xs text-[#1e376b] hover:underline font-bold mt-1"
          >
            重置筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRoles.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-slate-50/70 hover:bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between gap-3.5 transition-all hover:shadow-xs group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-black text-slate-900 truncate">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        r.type === '内置'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {r.type}
                    </span>
                    {r.type === '自定义' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(r)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="删除该自定义角色"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 bg-white/70 px-2 py-0.5 rounded border border-slate-200/60 inline-block self-start">
                  {r.code}
                </div>

                <span className="text-[11px] text-slate-500 leading-relaxed">
                  包含权限: <strong className="text-slate-800 font-semibold">{r.permsSummary}</strong>
                </span>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-white/50 p-2 rounded-lg border border-slate-100">
                  {r.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2.5 border-t border-slate-200/70 text-xs">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenMemberModal(r)}
                    className="text-slate-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    title="点击查看并管理已分配成员"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong className="text-slate-800 font-mono">{r.usersCount}</strong> 位已分配成员</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {r.type === '自定义' && (
                      <button
                        type="button"
                        onClick={() => handleOpenEditRole(r)}
                        className="text-slate-500 hover:text-slate-800 font-bold cursor-pointer text-xs"
                      >
                        编辑
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenPermConfig(r)}
                      className="text-[#1e376b] hover:text-blue-900 font-bold cursor-pointer text-xs bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                    >
                      配置权限
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 弹窗 1：新建 / 编辑角色 */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1e376b]" />
                <span>{editingRole ? `编辑机构角色「${editingRole.name}」` : '新建机构专属角色'}</span>
              </h3>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  角色名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：预警研判专家、合规审计员"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">
                  角色标识代码 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：ROLE_CUSTOM_ANALYSIS"
                  value={roleForm.code}
                  disabled={!!editingRole && editingRole.type === '内置'}
                  onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 uppercase disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="text-slate-600 font-bold block mb-1">角色职责描述</label>
                <textarea
                  rows={3}
                  placeholder="描述该角色在客户机构中的职责范围与业务分工..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-4 py-1.5 bg-[#1e376b] hover:bg-blue-900 text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存角色</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗 2：配置权限 (权限字典树形勾选) */}
      {permModalOpen && permTargetRole && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#1e376b]" />
                  <span>配置角色权限：{permTargetRole.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-200 text-slate-700">
                    {permTargetRole.code}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  勾选该角色可操作的功能模块与权限字典指令（已选 {selectedPermCodes.length} 项）
                </p>
              </div>
              <button
                onClick={() => setPermModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {INITIAL_PRIMARY_PERMS.map((primary) => {
                const groupCodes = [primary.id, ...primary.subPermissions.map((s) => s.id)];
                const allSelected = groupCodes.every((c) => selectedPermCodes.includes(c));
                const someSelected = groupCodes.some((c) => selectedPermCodes.includes(c));

                return (
                  <div
                    key={primary.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    <div className="p-3 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePrimaryGroup(primary)}
                          className="text-[#1e376b] hover:text-blue-900 cursor-pointer"
                        >
                          {allSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#1e376b]" />
                          ) : someSelected ? (
                            <div className="w-4 h-4 bg-[#1e376b] text-white rounded flex items-center justify-center text-[10px] font-bold">
                              -
                            </div>
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <span className="font-bold text-slate-900 text-xs">{primary.permName}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          {primary.permCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        包含 {primary.subPermissions.length} 个子权限
                      </span>
                    </div>

                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/20">
                      {primary.subPermissions.map((sub) => {
                        const isSubSelected = selectedPermCodes.includes(sub.id);
                        return (
                          <div
                            key={sub.id}
                            onClick={() => handleTogglePermCode(sub.id)}
                            className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-all ${
                              isSubSelected
                                ? 'bg-blue-50/60 border-blue-200 text-blue-950'
                                : 'bg-white border-slate-200/70 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <button
                              type="button"
                              className="mt-0.5 shrink-0"
                            >
                              {isSubSelected ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[#1e376b]" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-300" />
                              )}
                            </button>
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <span className="font-bold text-xs">{sub.subPermName}</span>
                              <span className="text-[10px] font-mono text-slate-400">{sub.subPermCode}</span>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{sub.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 font-medium">
                已选中 <strong className="text-[#1e376b] font-bold">{selectedPermCodes.length}</strong> 项权限
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPermModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSavePermConfig}
                  className="px-4 py-1.5 bg-[#1e376b] hover:bg-blue-900 text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>应用权限配置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗 3：成员分配与查看 */}
      {memberModalOpen && memberTargetRole && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1e376b]" />
                  <span>角色成员管理：{memberTargetRole.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  当前已分配 {memberTargetRole.assignedUserNames.length} 位机构成员
                </p>
              </div>
              <button
                onClick={() => setMemberModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* 添加成员输入 */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="输入成员姓名或工号进行添加..."
                  value={newMemberInput}
                  onChange={(e) => setNewMemberInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddMember(); }}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3.5 py-2 bg-[#1e376b] hover:bg-blue-900 text-white font-bold rounded-lg text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>
              </div>

              {/* 现有成员列表 */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {memberTargetRole.assignedUserNames.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">暂无已分配成员</div>
                ) : (
                  memberTargetRole.assignedUserNames.map((user, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1e376b] flex items-center justify-center font-bold text-[10px]">
                          {user.substring(0, 1)}
                        </div>
                        <span className="font-bold text-slate-800 text-xs">{user}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(user)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                        title="移除该成员"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setMemberModalOpen(false)}
                className="px-4 py-1.5 bg-[#1e376b] hover:bg-blue-900 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );

  // If embedded in CustomerAppConfig, render the MainContent directly
  if (!isStandalonePage) {
    return MainContent;
  }

  // Standalone Page Layout with Breadcrumb and Switcher
  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_org_role_manage_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* 顶部面包屑与标题栏 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_org_role_header_bar"
        >
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">统一组件库管理</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">机构角色管理</span>
            </nav>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                机构角色管理
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

        {/* 机构角色工作区 */}
        <div className="px-5 pb-5">
          {MainContent}
        </div>
      </div>
    </div>
  );
};
