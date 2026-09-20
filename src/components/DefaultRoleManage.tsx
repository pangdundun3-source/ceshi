/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  Copy,
  CheckSquare,
  Square
} from 'lucide-react';
import { PrimaryPermItem } from './PermissionDictManage';

export interface DefaultRoleItem {
  id: string;
  roleCode: string;
  roleName: string;
  description: string;
  isSystemDefault: boolean;
  userCount?: number;
  showInV8?: boolean;
  isEnabled?: boolean;
  sortOrder?: number;
  assignedPermIds: string[];
}

export const INITIAL_APP_DEFAULT_ROLES: DefaultRoleItem[] = [
  {
    id: 'role-01',
    roleCode: 'ROLE_ADMIN',
    roleName: '超级管理员 (系统最高权)',
    description: '拥有该应用的全部业务模块访问、接口配置、数据导出与人员授权权限',
    isSystemDefault: true,
    userCount: 8,
    showInV8: true,
    isEnabled: true,
    sortOrder: 1,
    assignedPermIds: ['p-01', 'p-02', 'p-03', 'p-04', 'p-05', 'p-06', 'p-07', 'p-08', 'perm_01', 'perm_02', 'perm_03', 'perm_04', 'situation_01', 'situation_02', 'situation_03', 'situation_04']
  },
  {
    id: 'role-02',
    roleCode: 'ROLE_BIZ_AUDITOR',
    roleName: '业务研判与处置审核员',
    description: '负责核心业务研判审核、预警事件流转、督办指令下达与闭环处理',
    isSystemDefault: false,
    userCount: 23,
    showInV8: true,
    isEnabled: true,
    sortOrder: 2,
    assignedPermIds: ['p-01', 'p-02', 'p-04', 'p-05', 'perm_01', 'perm_02', 'situation_01', 'situation_02']
  },
  {
    id: 'role-03',
    roleCode: 'ROLE_DATA_ANALYST',
    roleName: '数据分析与监控专员',
    description: '负责实时态势大屏查看、多维指标趋势分析以及业务报表查询导出',
    isSystemDefault: false,
    userCount: 5,
    showInV8: false,
    isEnabled: true,
    sortOrder: 3,
    assignedPermIds: ['p-01', 'p-03', 'p-06', 'perm_01', 'perm_03', 'situation_01', 'situation_03']
  },
  {
    id: 'role-04',
    roleCode: 'ROLE_READONLY_AUDIT',
    roleName: '只读审计与巡检员',
    description: '仅具备只读访问大屏与历史记录权限，无增删改及导出操作权限',
    isSystemDefault: false,
    userCount: 0,
    showInV8: true,
    isEnabled: false,
    sortOrder: 4,
    assignedPermIds: ['p-01', 'perm_01', 'situation_01']
  }
];

export interface DefaultRoleManageProps {
  appCode?: string;
  defaultRoles: DefaultRoleItem[];
  onChangeDefaultRoles: (roles: DefaultRoleItem[]) => void;
  primaryPerms: PrimaryPermItem[];
  showToast: (text: string, type?: 'success' | 'warning' | 'info') => void;
}

export const DefaultRoleManage: React.FC<DefaultRoleManageProps> = ({
  appCode,
  defaultRoles,
  onChangeDefaultRoles,
  primaryPerms,
  showToast
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    defaultRoles[0]?.id || 'role-01'
  );

  // 内联编辑角色 ID：'new' 表示新建角色中，角色 ID 字符串表示正在编辑该角色，null 表示无编辑状态
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleInlineForm, setRoleInlineForm] = useState({
    roleName: '',
    roleCode: '',
    description: '',
    isEnabled: true,
    showInV8: true,
    sortOrder: '1'
  });

  const activeRole = defaultRoles.find(r => r.id === selectedRoleId) || defaultRoles[0];

  // 开始新增角色（内联卡片，不弹窗）
  const handleStartAddRole = () => {
    if (editingRoleId !== null) {
      showToast('当前有角色正在编辑中，请先保存或取消', 'warning');
      return;
    }
    const maxSort = defaultRoles.reduce((max, r) => Math.max(max, r.sortOrder || 0), 0);
    setEditingRoleId('new');
    setRoleInlineForm({
      roleName: '',
      roleCode: '',
      description: '',
      isEnabled: true,
      showInV8: true,
      sortOrder: String(maxSort + 1)
    });
  };

  // 开始编辑已有角色（内联切换，不弹窗）
  const handleStartEditRole = (e: React.MouseEvent, role: DefaultRoleItem) => {
    e.stopPropagation();
    if (editingRoleId !== null) {
      showToast('当前有角色正在编辑中，请先保存或取消', 'warning');
      return;
    }
    setEditingRoleId(role.id);
    setRoleInlineForm({
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      isEnabled: role.isEnabled !== false,
      showInV8: role.showInV8 !== false,
      sortOrder: String(role.sortOrder || 1)
    });
  };

  // 取消内联编辑/新增
  const handleCancelInlineRole = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRoleId(null);
  };

  // 保存内联编辑/新增角色
  const handleSaveInlineRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInlineForm.roleName.trim()) {
      showToast('请输入角色名称', 'warning');
      return;
    }
    if (!roleInlineForm.roleCode.trim()) {
      showToast('请输入角色唯一 ID', 'warning');
      return;
    }

    const sortNum = parseInt(roleInlineForm.sortOrder, 10);
    if (isNaN(sortNum) || sortNum <= 0) {
      showToast('排序数字必须是正整数（大于 0 的整数）', 'warning');
      return;
    }

    if (editingRoleId === 'new') {
      const newRole: DefaultRoleItem = {
        id: `role-${Date.now()}`,
        roleCode: roleInlineForm.roleCode.trim().toUpperCase(),
        roleName: roleInlineForm.roleName.trim(),
        description: roleInlineForm.description.trim() || '用户自定义业务角色',
        isSystemDefault: false,
        userCount: 0,
        isEnabled: roleInlineForm.isEnabled,
        showInV8: roleInlineForm.showInV8,
        sortOrder: sortNum,
        assignedPermIds: primaryPerms[0] ? [primaryPerms[0].id] : []
      };
      const updated = [...defaultRoles, newRole];
      onChangeDefaultRoles(updated);
      setSelectedRoleId(newRole.id);
      setEditingRoleId(null);
      showToast(`已成功添加新角色「${newRole.roleName}」！`, 'success');
    } else if (editingRoleId) {
      const updated = defaultRoles.map(r => {
        if (r.id === editingRoleId) {
          return {
            ...r,
            roleName: roleInlineForm.roleName.trim(),
            roleCode: roleInlineForm.roleCode.trim().toUpperCase(),
            description: roleInlineForm.description.trim(),
            isEnabled: roleInlineForm.isEnabled,
            showInV8: roleInlineForm.showInV8,
            sortOrder: sortNum
          };
        }
        return r;
      });
      onChangeDefaultRoles(updated);
      setEditingRoleId(null);
      showToast(`角色「${roleInlineForm.roleName}」已成功保存！`, 'success');
    }
  };

  // 删除角色
  const handleDeleteRole = (e: React.MouseEvent, role: DefaultRoleItem) => {
    e.stopPropagation();
    if ((role.userCount || 0) > 0) {
      showToast(`角色「${role.roleName}」当前仍有 ${role.userCount} 位在用人员，不可删除！`, 'warning');
      return;
    }
    if (editingRoleId === role.id) {
      setEditingRoleId(null);
    }
    const updated = defaultRoles.filter(r => r.id !== role.id);
    onChangeDefaultRoles(updated);
    if (selectedRoleId === role.id) {
      if (updated.length > 0) {
        setSelectedRoleId(updated[0].id);
      }
    }
    showToast(`已删除角色「${role.roleName}」`, 'info');
  };

  // 切换角色的某个权限勾选
  const handleTogglePermForRole = (permId: string) => {
    if (!activeRole) return;
    const isAssigned = activeRole.assignedPermIds.includes(permId);
    const updatedPermIds = isAssigned
      ? activeRole.assignedPermIds.filter(id => id !== permId)
      : [...activeRole.assignedPermIds, permId];

    const updatedRoles = defaultRoles.map(r =>
      r.id === activeRole.id ? { ...r, assignedPermIds: updatedPermIds } : r
    );
    onChangeDefaultRoles(updatedRoles);
  };

  // 切换主权限及其全部子权限勾选
  const handleTogglePrimaryGroupForRole = (primary: PrimaryPermItem) => {
    if (!activeRole) return;
    const subIds = primary.subPermissions.map(s => s.id);
    const selectedSubCount = primary.subPermissions.filter(s => activeRole.assignedPermIds.includes(s.id)).length;
    const allSubSelected = primary.subPermissions.length > 0 && selectedSubCount === primary.subPermissions.length;

    let updatedPermIds: string[];
    if (allSubSelected) {
      // 取消全部子项
      updatedPermIds = activeRole.assignedPermIds.filter(id => !subIds.includes(id));
    } else {
      // 全选子项并包含主项
      const combined = new Set([...activeRole.assignedPermIds, primary.id, ...subIds]);
      updatedPermIds = Array.from(combined);
    }

    const updatedRoles = defaultRoles.map(r =>
      r.id === activeRole.id ? { ...r, assignedPermIds: updatedPermIds } : r
    );
    onChangeDefaultRoles(updatedRoles);
  };

  const handleSelectAllPermsForRole = () => {
    if (!activeRole) return;
    const allIds: string[] = [];
    primaryPerms.forEach(p => {
      allIds.push(p.id);
      p.subPermissions.forEach(s => allIds.push(s.id));
    });
    const updatedRoles = defaultRoles.map(r =>
      r.id === activeRole.id ? { ...r, assignedPermIds: allIds } : r
    );
    onChangeDefaultRoles(updatedRoles);
  };

  const handleClearAllPermsForRole = () => {
    if (!activeRole) return;
    const updatedRoles = defaultRoles.map(r =>
      r.id === activeRole.id ? { ...r, assignedPermIds: [] } : r
    );
    onChangeDefaultRoles(updatedRoles);
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-5"
      id="app_default_roles_container"
    >
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>默认角色管理与权限分配</span>
          </h2>
          <span className="text-rose-500 font-bold text-xs tracking-tight">
            （应用级的默认角色，用户在前端使用默认身份去添加其他的角色和权限。）
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          左侧添加角色并选择，右侧为当前选中的角色勾选模块权限（支持多选）。
        </p>
      </div>

      {/* 左右分栏布局：左侧添加与选择角色，右侧选择模块权限 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* 左侧：角色列表与添加角色 */}
        <div className="md:col-span-5 flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>应用角色列表 ({defaultRoles.length})</span>
            </span>
            <button
              type="button"
              disabled={editingRoleId !== null}
              onClick={handleStartAddRole}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors ${
                editingRoleId !== null
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              }`}
              title={editingRoleId !== null ? '当前正处于编辑状态，请先保存或取消后再添加角色' : '添加新角色'}
              id="btn_add_default_role"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加新角色</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* 1. 当点击“添加新角色”时，直接在列表顶部展开新增卡片（虚线边框） */}
            {editingRoleId === 'new' && (
              <div className="p-3.5 rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/30 shadow-xs ring-2 ring-indigo-500/10 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
                  <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>新增角色</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCancelInlineRole}
                      className="px-2 py-0.8 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveInlineRole}
                      className="px-2.5 py-0.8 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold cursor-pointer shadow-2xs flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>保存</span>
                    </button>
                  </div>
                </div>

                {/* (a) 角色名称 */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>角色名称 <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={roleInlineForm.roleName}
                    onChange={(e) => setRoleInlineForm({ ...roleInlineForm, roleName: e.target.value })}
                    placeholder="例如：业务研判与处置审核员"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold"
                    autoFocus
                  />
                </div>

                {/* (b) 角色的唯一 ID */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    角色唯一 ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={roleInlineForm.roleCode}
                    onChange={(e) => setRoleInlineForm({ ...roleInlineForm, roleCode: e.target.value.toUpperCase() })}
                    placeholder="例如：ROLE_BIZ_AUDITOR"
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono font-bold uppercase"
                  />
                </div>

                {/* (c) 角色的说明 */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-700">角色说明</label>
                  <textarea
                    rows={2}
                    value={roleInlineForm.description}
                    onChange={(e) => setRoleInlineForm({ ...roleInlineForm, description: e.target.value })}
                    placeholder="输入此角色的职责边界及业务操作范围..."
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none font-normal"
                  />
                </div>

                {/* 选项配置：一行一个 */}
                <div className="flex flex-col gap-2 pt-1">
                  {/* 1. 角色启用或停用 */}
                  <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">1. 角色启用或停用</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {roleInlineForm.isEnabled ? '当前处于启用状态' : '当前处于停用状态'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRoleInlineForm({ ...roleInlineForm, isEnabled: !roleInlineForm.isEnabled })}
                      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors cursor-pointer shrink-0 ${
                        roleInlineForm.isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${
                          roleInlineForm.isEnabled ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 2. V8 显示或不显示 */}
                  <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">2. V8 显示或不显示</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {roleInlineForm.showInV8 ? '在 V8 工作台正常显示' : '在 V8 工作台隐藏不显示'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRoleInlineForm({ ...roleInlineForm, showInV8: !roleInlineForm.showInV8 })}
                      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors cursor-pointer shrink-0 ${
                        roleInlineForm.showInV8 ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${
                          roleInlineForm.showInV8 ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3. 排序序号（数字越小越靠前） */}
                  <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">3. 排序序号（数字越小越靠前）</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        正整数（1, 2, 3...）
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-400">#</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={roleInlineForm.sortOrder}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, '');
                          setRoleInlineForm({ ...roleInlineForm, sortOrder: cleaned });
                        }}
                        placeholder="1"
                        className="w-16 text-center px-2 py-1 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 已有角色卡片列表：支持点击编辑转化为内联虚线编辑状态 */}
            {[...defaultRoles]
              .sort((a, b) => {
                const aEnabled = a.isEnabled !== false;
                const bEnabled = b.isEnabled !== false;
                if (aEnabled === bEnabled) {
                  return (a.sortOrder || 0) - (b.sortOrder || 0);
                }
                return aEnabled ? -1 : 1;
              })
              .map((role) => {
                const isSelected = role.id === selectedRoleId;
                const isEnabled = role.isEnabled !== false;
                const isEditingThis = editingRoleId === role.id;

                {/* 处于编辑状态：页卡边框变为虚线 */}
                if (isEditingThis) {
                  return (
                    <div
                      key={role.id}
                      className="p-3.5 rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/30 shadow-xs ring-2 ring-indigo-500/10 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
                        <span className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                          <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>编辑角色</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCancelInlineRole}
                            className="px-2 py-0.8 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveInlineRole}
                            className="px-2.5 py-0.8 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-bold cursor-pointer shadow-2xs flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>保存</span>
                          </button>
                        </div>
                      </div>

                      {/* (a) 角色名称 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          角色名称 <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={roleInlineForm.roleName}
                          onChange={(e) => setRoleInlineForm({ ...roleInlineForm, roleName: e.target.value })}
                          placeholder="例如：业务研判与处置审核员"
                          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-bold"
                          autoFocus
                        />
                      </div>

                      {/* (b) 角色的唯一 ID */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          角色唯一 ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={roleInlineForm.roleCode}
                          onChange={(e) => setRoleInlineForm({ ...roleInlineForm, roleCode: e.target.value.toUpperCase() })}
                          placeholder="例如：ROLE_BIZ_AUDITOR"
                          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 font-mono font-bold uppercase"
                        />
                      </div>

                      {/* (c) 角色的说明 */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-700">角色说明</label>
                        <textarea
                          rows={2}
                          value={roleInlineForm.description}
                          onChange={(e) => setRoleInlineForm({ ...roleInlineForm, description: e.target.value })}
                          placeholder="输入此角色的职责边界及业务操作范围..."
                          className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none font-normal"
                        />
                      </div>

                      {/* 选项配置：一行一个 */}
                      <div className="flex flex-col gap-2 pt-1">
                        {/* 1. 角色启用或停用 */}
                        <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800">1. 角色启用或停用</div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {roleInlineForm.isEnabled ? '当前处于启用状态' : '当前处于停用状态'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRoleInlineForm({ ...roleInlineForm, isEnabled: !roleInlineForm.isEnabled })}
                            className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors cursor-pointer shrink-0 ${
                              roleInlineForm.isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${
                                roleInlineForm.isEnabled ? 'translate-x-4.5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* 2. V8 显示或不显示 */}
                        <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800">2. V8 显示或不显示</div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {roleInlineForm.showInV8 ? '在 V8 工作台正常显示' : '在 V8 工作台隐藏不显示'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRoleInlineForm({ ...roleInlineForm, showInV8: !roleInlineForm.showInV8 })}
                            className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors cursor-pointer shrink-0 ${
                              roleInlineForm.showInV8 ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${
                                roleInlineForm.showInV8 ? 'translate-x-4.5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        {/* 3. 排序序号（数字越小越靠前） */}
                        <div className="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800">3. 排序序号（数字越小越靠前）</div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              正整数（1, 2, 3...）
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-400">#</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={roleInlineForm.sortOrder}
                              onChange={(e) => {
                                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                                setRoleInlineForm({ ...roleInlineForm, sortOrder: cleaned });
                              }}
                              placeholder="1"
                              className="w-16 text-center px-2 py-1 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={role.id}
                    onClick={() => {
                      if (editingRoleId !== null && editingRoleId !== role.id) {
                        showToast('请先保存或取消当前正在编辑的角色', 'warning');
                        return;
                      }
                      setSelectedRoleId(role.id);
                    }}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    } ${!isEnabled ? 'opacity-65 bg-slate-50/80 border-dashed border-slate-300' : ''}`}
                  >
                    {/* 头部：角色名称与操作按钮 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className={`text-xs font-black truncate ${!isEnabled ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {role.roleName}
                        </span>
                      </div>

                      {/* 编辑与删除按钮 */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={editingRoleId !== null}
                          onClick={(e) => handleStartEditRole(e, role)}
                          className={`p-1 rounded transition-colors ${
                            editingRoleId !== null
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-400 hover:text-indigo-600 hover:bg-white cursor-pointer'
                          }`}
                          title={editingRoleId !== null ? '当前有角色处于编辑中' : '编辑角色信息'}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {(role.userCount || 0) > 0 ? (
                          <button
                            type="button"
                            disabled
                            className="p-1 text-slate-300 cursor-not-allowed rounded"
                            title="当前角色已有使用人数，不可删除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={editingRoleId !== null}
                            onClick={(e) => handleDeleteRole(e, role)}
                            className={`p-1 rounded transition-colors ${
                              editingRoleId !== null
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                            }`}
                            title={editingRoleId !== null ? '当前有角色处于编辑中' : '删除角色'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 角色 ID */}
                    <div className={`text-[11px] font-mono font-bold ${!isEnabled ? 'text-slate-400' : 'text-slate-500'}`}>
                      ID: {role.roleCode}
                    </div>

                    {/* 角色描述 */}
                    <p className={`text-[11px] leading-snug ${!isEnabled ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                      {role.description}
                    </p>

                    {/* 底部信息：使用人数与标签 */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="text-slate-500 font-medium">
                        <span>
                          使用人数：<strong className="font-bold text-slate-700 font-mono">{role.userCount ?? 0}</strong> 人
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {role.sortOrder !== undefined && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-mono font-bold">
                            #{role.sortOrder}
                          </span>
                        )}
                        {role.showInV8 !== false ? (
                          <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">
                            V8启用
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                            V8停用
                          </span>
                        )}
                        {!isEnabled && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-500 border border-slate-200 rounded text-[10px] font-bold">
                            已停用
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 右侧：为该角色选择可使用的模块权限（权限可多选） */}
        <div className="md:col-span-7 flex flex-col gap-4 h-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900">
                  模块权限选择（支持多选）
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                当前正在为角色 <strong className="text-indigo-900 font-bold">【{activeRole?.roleName}】</strong> 分配可使用的功能权限：
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSelectAllPermsForRole}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 cursor-pointer shadow-2xs"
              >
                全选
              </button>
              <button
                type="button"
                onClick={handleClearAllPermsForRole}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded text-[11px] font-bold text-slate-700 cursor-pointer shadow-2xs"
              >
                清空
              </button>
            </div>
          </div>

          {/* 按主权限及子权限呈现的可多选权限清单（无内部上下滚动条，两边高度自适应对齐） */}
          <div className="flex flex-col gap-3.5 flex-1">
            {primaryPerms.map((primary) => {
              const isPrimaryChecked = activeRole?.assignedPermIds.includes(primary.id);
              const selectedSubCount = primary.subPermissions.filter(s => activeRole?.assignedPermIds.includes(s.id)).length;
              const allSubSelected = primary.subPermissions.length > 0 && selectedSubCount === primary.subPermissions.length;

              return (
                <div key={primary.id} className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-3 shadow-2xs">
                  {/* 主权限头部 */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePermForRole(primary.id)}
                        className="pt-0.5 cursor-pointer"
                      >
                        {isPrimaryChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-900">
                            {primary.permName}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              {primary.permCode}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(primary.permCode);
                                showToast(`已复制权限唯一ID: ${primary.permCode}`, 'success');
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                              title="复制权限唯一ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {primary.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        {selectedSubCount} / {primary.subPermissions.length} 子权限已选
                      </span>
                      {primary.subPermissions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleTogglePrimaryGroupForRole(primary)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                            allSubSelected
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {allSubSelected ? '取消全部' : '全选子项'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 嵌套子权限列表：无蓝色竖线、横线分割、复选框居中对齐 */}
                  {primary.subPermissions.length > 0 ? (
                    <div className="flex flex-col divide-y divide-slate-100">
                      {primary.subPermissions.map((sub) => {
                        const isSubChecked = activeRole?.assignedPermIds.includes(sub.id);

                        return (
                          <div
                            key={sub.id}
                            onClick={() => handleTogglePermForRole(sub.id)}
                            className={`py-2 px-2 rounded-lg transition-all cursor-pointer flex items-center gap-3 hover:bg-slate-50/80 ${
                              isSubChecked ? 'bg-indigo-50/30' : ''
                            }`}
                          >
                            <div className="flex items-center justify-center shrink-0">
                              {isSubChecked ? (
                                <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300 shrink-0" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className={`text-[11px] font-bold ${isSubChecked ? 'text-indigo-950 font-black' : 'text-slate-700'}`}>
                                  {sub.subPermName}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                    {sub.subPermCode}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(sub.subPermCode);
                                      showToast(`已复制权限唯一ID: ${sub.subPermCode}`, 'success');
                                    }}
                                    className="p-0.8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                                    title="复制权限唯一ID"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                                {sub.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic py-2">
                      暂无嵌套子权限
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center justify-between mt-auto">
            <span>✓ 角色权限配置实时生效已暂存</span>
            <span>已选中 {activeRole?.assignedPermIds?.length || 0} 项功能权限</span>
          </div>
        </div>
      </div>
    </div>
  );
};
