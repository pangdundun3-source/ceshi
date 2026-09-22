import React, { useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Check,
} from 'lucide-react';

interface ProductRole {
  id: string;
  name: string;
  description: string;
}

interface PermAction {
  id: string;
  label: string;
}

interface PermSubModule {
  id: string;
  name: string;
  actions: PermAction[];
}

interface PermModule {
  id: string;
  name: string;
  children: PermSubModule[];
}

const SEED_ROLES: ProductRole[] = [
  {
    id: 'role_super',
    name: '超级管理员',
    description: '拥有系统所有模块与数据的全量控制权限',
  },
  {
    id: 'role_org',
    name: '机构管理员',
    description: '管理机构组织、人员与本机构业务配置',
  },
  {
    id: 'role_reporter',
    name: '上报员',
    description: '负责材料填报与报送待办处理',
  },
  {
    id: 'role_auditor',
    name: '审核员',
    description: '负责报送内容审核与退回处理',
  },
  {
    id: 'role_ops',
    name: '运营管理员',
    description: '负责日常运营、统计与考核管理',
  },
  {
    id: 'role_temp_auditor',
    name: '临时审核员',
    description: '可按项目临时授权的审核角色，支持自定义权限',
  },
];

const PERM_MODULES: PermModule[] = [
  {
    id: 'home',
    name: '首页',
    children: [
      {
        id: 'home_dash',
        name: '工作台',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'detail', label: '查看详情' },
        ],
      },
    ],
  },
  {
    id: 'report',
    name: '报送管理',
    children: [
      {
        id: 'report_todo',
        name: '报送待办',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'detail', label: '查看详情' },
          { id: 'create', label: '新建速报' },
          { id: 'edit', label: '编辑' },
          { id: 'withdraw', label: '撤回' },
          { id: 'delete', label: '删除' },
        ],
      },
      {
        id: 'report_record',
        name: '报送记录',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'detail', label: '查看详情' },
          { id: 'create', label: '新建速报' },
          { id: 'edit', label: '编辑' },
          { id: 'withdraw', label: '撤回' },
          { id: 'delete', label: '删除' },
          { id: 'export', label: '导出台账' },
        ],
      },
    ],
  },
  {
    id: 'audit',
    name: '审核管理',
    children: [
      {
        id: 'audit_todo',
        name: '审核待办',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'pass', label: '通过' },
          { id: 'reject', label: '退回' },
        ],
      },
    ],
  },
  {
    id: 'badinfo',
    name: '不良信息库',
    children: [
      {
        id: 'badinfo_list',
        name: '信息库列表',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'create', label: '新增' },
          { id: 'edit', label: '编辑' },
          { id: 'delete', label: '删除' },
        ],
      },
    ],
  },
  {
    id: 'stats',
    name: '统计管理',
    children: [
      {
        id: 'stats_board',
        name: '统计看板',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'export', label: '导出' },
        ],
      },
    ],
  },
  {
    id: 'assess',
    name: '考核管理',
    children: [
      {
        id: 'assess_list',
        name: '考核任务',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'create', label: '新建' },
          { id: 'edit', label: '编辑' },
        ],
      },
    ],
  },
  {
    id: 'system',
    name: '系统管理',
    children: [
      {
        id: 'system_user',
        name: '用户与角色',
        actions: [
          { id: 'view', label: '查看' },
          { id: 'edit', label: '编辑' },
          { id: 'assign', label: '授权' },
        ],
      },
    ],
  },
];

const allActionKeys = (): string[] => {
  const keys: string[] = [];
  PERM_MODULES.forEach((mod) => {
    mod.children.forEach((sub) => {
      sub.actions.forEach((action) => {
        keys.push(`${sub.id}:${action.id}`);
      });
    });
  });
  return keys;
};

const buildFullPermMap = (): Record<string, boolean> =>
  Object.fromEntries(allActionKeys().map((key) => [key, true]));

const buildPartialPermMap = (enabled: string[]): Record<string, boolean> => {
  const map = Object.fromEntries(allActionKeys().map((key) => [key, false]));
  enabled.forEach((key) => {
    map[key] = true;
  });
  return map;
};

const seedPerms = (): Record<string, Record<string, boolean>> => {
  const full = buildFullPermMap();
  return {
    role_super: { ...full },
    role_org: { ...full },
    role_reporter: buildPartialPermMap([
      'home_dash:view',
      'home_dash:detail',
      'report_todo:view',
      'report_todo:detail',
      'report_todo:create',
      'report_todo:edit',
      'report_todo:withdraw',
      'report_record:view',
      'report_record:detail',
      'report_record:create',
      'report_record:edit',
      'report_record:export',
    ]),
    role_auditor: buildPartialPermMap([
      'home_dash:view',
      'report_todo:view',
      'report_todo:detail',
      'report_record:view',
      'report_record:detail',
      'audit_todo:view',
      'audit_todo:pass',
      'audit_todo:reject',
    ]),
    role_ops: buildPartialPermMap([
      'home_dash:view',
      'stats_board:view',
      'stats_board:export',
      'assess_list:view',
      'assess_list:create',
      'assess_list:edit',
    ]),
    role_temp_auditor: buildPartialPermMap([
      'home_dash:view',
      'report_todo:view',
      'report_todo:detail',
      'report_record:view',
      'report_record:detail',
      'audit_todo:view',
      'audit_todo:pass',
      'audit_todo:reject',
    ]),
  };
};

export const ProductRolePermissionPanel: React.FC = () => {
  const [roles, setRoles] = useState<ProductRole[]>(SEED_ROLES);
  const [selectedId, setSelectedId] = useState('role_super');
  const [keyword, setKeyword] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ report: true });
  const [permMap, setPermMap] = useState(seedPerms);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const selected = roles.find((role) => role.id === selectedId) ?? roles[0];
  const selectedPerms = permMap[selected?.id ?? ''] ?? {};

  const filteredRoles = useMemo(() => {
    const q = keyword.trim();
    if (!q) return roles;
    return roles.filter((role) => role.name.includes(q));
  }, [roles, keyword]);

  const toggleModule = (moduleId: string) => {
    setExpanded((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const toggleAction = (subId: string, actionId: string) => {
    if (!selected) return;
    const key = `${subId}:${actionId}`;
    setPermMap((prev) => ({
      ...prev,
      [selected.id]: {
        ...(prev[selected.id] ?? {}),
        [key]: !prev[selected.id]?.[key],
      },
    }));
  };

  const startEdit = (role: ProductRole, event: React.MouseEvent) => {
    event.stopPropagation();
    setAdding(false);
    setEditingRoleId(role.id);
    setEditName(role.name);
    setSelectedId(role.id);
  };

  const saveEdit = () => {
    if (!editingRoleId || !editName.trim()) return;
    setRoles((prev) =>
      prev.map((role) => (role.id === editingRoleId ? { ...role, name: editName.trim() } : role)),
    );
    setEditingRoleId(null);
    setEditName('');
  };

  const addRole = () => {
    if (!newName.trim()) return;
    const id = `role_custom_${Date.now()}`;
    const role: ProductRole = {
      id,
      name: newName.trim(),
      description: '自定义业务角色，可按需调整权限范围',
    };
    setRoles((prev) => [...prev, role]);
    setPermMap((prev) => ({
      ...prev,
      [id]: buildPartialPermMap(['home_dash:view']),
    }));
    setSelectedId(id);
    setNewName('');
    setAdding(false);
  };

  return (
    <div
      id="product_role_permission_panel"
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[620px]"
    >
      {/* 左侧角色列表 */}
      <aside className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col bg-white shrink-0">
        <div className="p-3 border-b border-slate-100 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="输入角色名称"
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-400 bg-slate-50 focus:bg-white"
            />
          </div>
          <button
            type="button"
            title="新增角色"
            onClick={() => {
              setEditingRoleId(null);
              setAdding(true);
              setNewName('');
            }}
            className="h-9 w-9 rounded-lg bg-[#1e376b] text-white flex items-center justify-center hover:bg-[#14264c] shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 pt-2 flex flex-col gap-1">
          {adding && (
            <div className="mx-1 mb-1 rounded-lg border border-dashed border-blue-300 bg-blue-50/40 p-2.5 flex flex-col gap-2">
              <input
                autoFocus
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="输入新角色名称"
                className="h-8 rounded-md border border-slate-200 px-2 text-xs outline-none focus:border-blue-400"
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  className="h-7 px-2 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:bg-white"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={addRole}
                  className="h-7 px-2.5 rounded-md bg-[#1e376b] text-white text-[11px] font-bold hover:bg-[#14264c] inline-flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  保存
                </button>
              </div>
            </div>
          )}

          {filteredRoles.map((role) => {
            const active = role.id === selected?.id;
            const isEditing = editingRoleId === role.id;
            return (
              <div
                key={role.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(role.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setSelectedId(role.id);
                }}
                className={`rounded-lg px-3 py-2.5 cursor-pointer transition-colors border ${
                  active
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                {isEditing ? (
                  <div className="flex items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
                    <input
                      autoFocus
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      className="h-8 flex-1 rounded-md border border-slate-200 px-2 text-xs outline-none focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="h-8 w-8 rounded-md bg-[#1e376b] text-white flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRoleId(null)}
                      className="h-8 w-8 rounded-md border border-slate-200 text-slate-500 flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-semibold truncate ${active ? 'text-[#1e376b]' : 'text-slate-800'}`}>
                      {role.name}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => startEdit(role, event)}
                      className="shrink-0 inline-flex items-center gap-1 text-[11px] text-[#1e376b] hover:underline"
                    >
                      <Edit2 className="w-3 h-3" />
                      编辑
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredRoles.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">未找到匹配角色</div>
          )}
        </div>
      </aside>

      {/* 右侧权限配置 */}
      <section className="flex-1 min-w-0 flex flex-col bg-white">
        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">权限配置 - {selected?.name}</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">{selected?.description}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {PERM_MODULES.map((mod) => {
            const open = Boolean(expanded[mod.id]);
            return (
              <div key={mod.id} className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-slate-50"
                >
                  <span className="text-sm font-semibold text-slate-800">{mod.name}</span>
                  {open ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {open && (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-3.5 py-3 flex flex-col gap-3">
                    {mod.children.map((sub) => (
                      <div key={sub.id}>
                        <div className="text-xs font-semibold text-slate-700 mb-2">{sub.name}</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {sub.actions.map((action) => {
                            const key = `${sub.id}:${action.id}`;
                            const checked = Boolean(selectedPerms[key]);
                            return (
                              <label
                                key={key}
                                className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleAction(sub.id, action.id)}
                                  className="rounded border-slate-300 text-[#1e376b] focus:ring-[#1e376b]/30"
                                />
                                <span>{action.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
