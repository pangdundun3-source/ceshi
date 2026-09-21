/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckSquare,
  Square,
  Copy,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  RotateCcw,
  Save,
  KeyRound,
  Users
} from 'lucide-react';
import { PrimaryPermItem, INITIAL_PRIMARY_PERMS } from './PermissionDictManage';

export interface DefaultRoleItem {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
  isPreset: boolean;
  status: 'enabled' | 'disabled';
  assignedPermIds: string[];
  userCount?: number;
  sortOrder?: number;
  showInV8?: boolean;
}

export const INITIAL_DEFAULT_ROLES: DefaultRoleItem[] = [
  {
    id: 'role_01',
    roleCode: 'ROLE_SUPER_ADMIN',
    roleName: '超级管理员 (系统预置)',
    description: '拥有全系统最高级别无限制操作权限，包括全局权限配置、系统管理与数据字典。',
    isPreset: true,
    status: 'enabled',
    assignedPermIds: [
      'situation_01', 'situation_02', 'situation_03', 'situation_04',
      'warning_01', 'warning_02', 'warning_03', 'warning_04',
      'device_01', 'device_02', 'device_03', 'device_04',
      'system_01', 'system_02', 'system_03', 'system_04'
    ],
    userCount: 4,
    sortOrder: 1,
    showInV8: true
  },
  {
    id: 'role_02',
    roleCode: 'ROLE_SITUATION_DISPATCHER',
    roleName: '态势分析指挥员',
    description: '负责监控大屏态势掌控、预警研判处置以及多维雷达图表多源数据查询。',
    isPreset: false,
    status: 'enabled',
    assignedPermIds: [
      'situation_01', 'situation_02', 'situation_03',
      'warning_01', 'warning_02'
    ],
    userCount: 18,
    sortOrder: 2,
    showInV8: true
  },
  {
    id: 'role_03',
    roleCode: 'ROLE_DEVICE_OPERATOR',
    roleName: '设备运维巡检员',
    description: '负责感知终端设备接入、状态巡检监测与固件远程下发升级指令。',
    isPreset: false,
    status: 'enabled',
    assignedPermIds: [
      'device_01', 'device_02', 'device_03'
    ],
    userCount: 32,
    sortOrder: 3,
    showInV8: true
  },
  {
    id: 'role_04',
    roleCode: 'ROLE_AUDIT_VIEWER',
    roleName: '安全合规审计员',
    description: '拥有系统安全审计只读权限，负责审查操作轨迹与系统运行状态日志。',
    isPreset: false,
    status: 'enabled',
    assignedPermIds: [
      'situation_01', 'system_04'
    ],
    userCount: 6,
    sortOrder: 4,
    showInV8: true
  }
];

export const UnifiedDefaultRoleManageView: React.FC = () => {
  const [roles, setRoles] = useState<DefaultRoleItem[]>(INITIAL_DEFAULT_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role_01');
  const [primaryPerms] = useState<PrimaryPermItem[]>(INITIAL_PRIMARY_PERMS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    roleName: '',
    roleCode: '',
    description: '',
    showInV8: true,
    status: 'enabled' as 'enabled' | 'disabled'
  });

  // 删除确认弹窗
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<DefaultRoleItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const filteredRoles = roles.filter(
    (r) =>
      r.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roleCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 切换单个子权限
  const handleToggleSubPerm = (subId: string) => {
    if (!activeRole) return;
    const isAssigned = activeRole.assignedPermIds.includes(subId);
    const newAssigned = isAssigned
      ? activeRole.assignedPermIds.filter((id) => id !== subId)
      : [...activeRole.assignedPermIds, subId];

    setRoles((prev) =>
      prev.map((r) => (r.id === activeRole.id ? { ...r, assignedPermIds: newAssigned } : r))
    );
  };

  // 切换主权限分组全部子权限
  const handleTogglePrimaryGroup = (primary: PrimaryPermItem) => {
    if (!activeRole) return;
    const subIds = primary.subPermissions.map((s) => s.id);
    const allSelected = subIds.every((id) => activeRole.assignedPermIds.includes(id));

    let newAssigned: string[];
    if (allSelected) {
      newAssigned = activeRole.assignedPermIds.filter((id) => !subIds.includes(id));
    } else {
      const set = new Set([...activeRole.assignedPermIds, ...subIds]);
      newAssigned = Array.from(set);
    }

    setRoles((prev) =>
      prev.map((r) => (r.id === activeRole.id ? { ...r, assignedPermIds: newAssigned } : r))
    );
  };

  // 全选/清空
  const handleSelectAllPerms = () => {
    if (!activeRole) return;
    const allSubIds: string[] = [];
    primaryPerms.forEach((p) => p.subPermissions.forEach((s) => allSubIds.push(s.id)));
    setRoles((prev) =>
      prev.map((r) => (r.id === activeRole.id ? { ...r, assignedPermIds: allSubIds } : r))
    );
    showToast('已为当前角色全选所有功能权限', 'success');
  };

  const handleClearAllPerms = () => {
    if (!activeRole) return;
    setRoles((prev) =>
      prev.map((r) => (r.id === activeRole.id ? { ...r, assignedPermIds: [] } : r))
    );
    showToast('已清空当前角色的所有功能权限', 'info');
  };

  // 新建/编辑角色
  const openCreateModal = () => {
    setModalMode('create');
    setEditingRoleId(null);
    setFormData({
      roleName: '',
      roleCode: `ROLE_${Date.now().toString().slice(-4)}`,
      description: '',
      showInV8: true,
      status: 'enabled'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (role: DefaultRoleItem) => {
    setModalMode('edit');
    setEditingRoleId(role.id);
    setFormData({
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      showInV8: role.showInV8 !== false,
      status: role.status
    });
    setIsModalOpen(true);
  };

  const handleSaveRoleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleName.trim()) {
      showToast('请输入角色名称', 'warning');
      return;
    }
    if (!formData.roleCode.trim()) {
      showToast('请输入角色英文编码', 'warning');
      return;
    }

    if (modalMode === 'create') {
      const newRole: DefaultRoleItem = {
        id: `role_${Date.now()}`,
        roleCode: formData.roleCode.toUpperCase().trim(),
        roleName: formData.roleName.trim(),
        description: formData.description.trim(),
        isPreset: false,
        status: formData.status,
        assignedPermIds: [],
        userCount: 0,
        sortOrder: roles.length + 1,
        showInV8: formData.showInV8
      };
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newRole.id);
      showToast(`新建角色「${newRole.roleName}」成功`, 'success');
    } else if (editingRoleId) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRoleId
            ? {
                ...r,
                roleName: formData.roleName.trim(),
                roleCode: formData.roleCode.toUpperCase().trim(),
                description: formData.description.trim(),
                showInV8: formData.showInV8,
                status: formData.status
              }
            : r
        )
      );
      showToast('角色信息已更新', 'success');
    }
    setIsModalOpen(false);
  };

  // 删除角色
  const handleDeleteRole = () => {
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.isPreset) {
      showToast('系统预置角色不可删除', 'warning');
      setDeleteConfirmTarget(null);
      return;
    }

    setRoles((prev) => prev.filter((r) => r.id !== deleteConfirmTarget.id));
    if (selectedRoleId === deleteConfirmTarget.id) {
      const remaining = roles.filter((r) => r.id !== deleteConfirmTarget.id);
      if (remaining.length > 0) {
        setSelectedRoleId(remaining[0].id);
      }
    }
    showToast(`角色「${deleteConfirmTarget.roleName}」已删除`, 'success');
    setDeleteConfirmTarget(null);
  };

  // 计算已选子权限数
  const totalSubPermsCount = primaryPerms.reduce((acc, p) => acc + p.subPermissions.length, 0);
  const currentAssignedCount = activeRole ? activeRole.assignedPermIds.length : 0;

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_default_role_manage_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* 顶部面包屑与标题栏 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_role_header_bar"
        >
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">统一组件库管理</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">默认角色管理页面</span>
            </nav>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                默认角色管理与权限分配
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>支持角色与权限字典双向精细化勾选授权</span>
            </div>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col gap-5">
            {/* 卡片头部说明 */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                    默认角色管理与权限分配
                  </h2>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    配置系统内置默认角色、角色代码及对应的功能权限集合。支持按角色精细化勾选主权限与子权限项，并提供一键全选、重置与静态化发布。
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
                共 {roles.length} 个角色
              </span>
            </div>

            {/* 双栏布局容器 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs flex flex-col lg:flex-row min-h-[580px]">
              {/* 左侧：角色列表 */}
              <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/40">
                {/* 左栏头部与工具 */}
                <div className="p-3.5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>角色列表 ({filteredRoles.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="bg-[#1e376b] hover:bg-blue-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    id="btn_create_role"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新建角色</span>
                  </button>
                </div>

                {/* 搜索框 */}
                <div className="p-2.5 border-b border-slate-100 bg-white">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索角色名称 / 编码..."
                      className="w-full bg-slate-100/80 border border-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* 角色卡片列表 */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[540px]">
                  {filteredRoles.map((role) => {
                    const isSelected = activeRole?.id === role.id;
                    const permCount = role.assignedPermIds.length;

                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-300 border-l-4 border-l-[#1e376b] shadow-2xs'
                            : 'bg-white border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-900">
                              {role.roleName}
                            </span>
                            {role.isPreset && (
                              <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                                预置
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => openEditModal(role)}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="编辑角色"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {!role.isPreset && (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmTarget(role)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="删除角色"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="font-mono text-[11px] text-slate-500 font-bold mt-1">
                          ID: {role.roleCode}
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                          {role.description || '暂无描述信息'}
                        </p>

                        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">
                            使用人数: <strong className="font-bold text-slate-700 font-mono">{role.userCount ?? 0}</strong> 人
                          </span>
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-100">
                            已选 {permCount} 项权限
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {filteredRoles.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400">
                      未检索到匹配的角色
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧：权限分配与勾选工作区 */}
              <div className="flex-1 flex flex-col min-w-0 bg-white">
                {activeRole ? (
                  <>
                    {/* 右侧顶部快捷工具栏 */}
                    <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-slate-900">
                            {activeRole.roleName}
                          </h3>
                          <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                            {activeRole.roleCode}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          已分配权限：<strong className="text-blue-700 font-mono font-bold">{currentAssignedCount}</strong> / 总计 {totalSubPermsCount} 项
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllPerms}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>全部全选</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleClearAllPerms}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          <span>一键清空</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast(`✓ 角色「${activeRole.roleName}」权限配置已成功保存！`, 'success')}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>保存角色权限</span>
                        </button>
                      </div>
                    </div>

                    {/* 权限分组与子权限网格 */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 max-h-[540px] bg-slate-50/40">
                      {primaryPerms.map((primary) => {
                        const subIds = primary.subPermissions.map((s) => s.id);
                        const selectedSubCount = subIds.filter((id) =>
                          activeRole.assignedPermIds.includes(id)
                        ).length;
                        const allSubSelected =
                          subIds.length > 0 && selectedSubCount === subIds.length;
                        const isIndeterminate =
                          selectedSubCount > 0 && selectedSubCount < subIds.length;

                        return (
                          <div
                            key={primary.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
                          >
                            {/* 分组头部 */}
                            <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div
                                  onClick={() => handleTogglePrimaryGroup(primary)}
                                  className="flex items-center justify-center cursor-pointer"
                                >
                                  {allSubSelected ? (
                                    <CheckSquare className="w-4 h-4 text-blue-600" />
                                  ) : isIndeterminate ? (
                                    <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white">
                                      <div className="w-2 h-0.5 bg-white rounded-full" />
                                    </div>
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-slate-800">
                                    {primary.permName}
                                  </span>
                                  <span className="font-mono text-[11px] text-slate-400">
                                    {primary.permCode}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                  已选 {selectedSubCount} / {subIds.length} 项
                                </span>
                              </div>
                            </div>

                            {/* 子权限网格列表 */}
                            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {primary.subPermissions.map((sub) => {
                                const isChecked = activeRole.assignedPermIds.includes(sub.id);

                                return (
                                  <div
                                    key={sub.id}
                                    onClick={() => handleToggleSubPerm(sub.id)}
                                    className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                                      isChecked
                                        ? 'bg-blue-50/60 border-blue-300'
                                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="pt-0.5 shrink-0">
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-300" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1 flex-wrap">
                                        <span className={`text-xs font-bold ${isChecked ? 'text-blue-950 font-black' : 'text-slate-800'}`}>
                                          {sub.subPermName}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                            {sub.subPermCode}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigator.clipboard.writeText(sub.subPermCode);
                                              showToast(`已复制: ${sub.subPermCode}`, 'success');
                                            }}
                                            className="p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                                            title="复制权限标识"
                                          >
                                            <Copy className="w-2.5 h-2.5" />
                                          </button>
                                        </div>
                                      </div>
                                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 leading-tight">
                                        {sub.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
                    请在左侧选择需要分配权限的角色
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 新建/编辑角色模态弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  {modalMode === 'create' ? '新建默认角色' : '编辑角色属性'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoleForm} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  角色中文名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  placeholder="例如：态势分析指挥员"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  角色唯一代码 (Role Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.roleCode}
                  onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
                  placeholder="例如：ROLE_SITUATION_DISPATCHER"
                  className="w-full text-xs font-mono font-bold text-blue-900 border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  职能与权限说明
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入该角色对应的业务职责边界、管理范围说明..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.showInV8}
                    onChange={(e) => setFormData({ ...formData, showInV8: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>在 V8 用户体系中可见并可选用</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1e376b] hover:bg-blue-900 rounded-lg shadow-xs cursor-pointer"
                >
                  确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  确认删除角色「{deleteConfirmTarget.roleName}」？
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  删除后，该角色的权限配置将彻底清除，已分配该角色的用户将失去相应权限，操作不可恢复。
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDeleteRole}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast 提示浮窗 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                : toastMessage.type === 'warning'
                ? 'bg-amber-600 text-white border-amber-500 shadow-amber-500/20'
                : 'bg-slate-800 text-white border-slate-700 shadow-slate-900/30'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
