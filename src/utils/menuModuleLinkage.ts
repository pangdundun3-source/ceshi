import { SysMenuItem, INITIAL_DITING_MENUS } from '../components/MenuManage';
import { PrivateModuleDeploy } from '../data/appPlatform';
import { getUnifiedModuleByKey, UNIFIED_CALL_MODULES } from '../data/unifiedCallModules';

export interface ModuleMenuMeta {
  name: string;
  code: string;
  route: string;
  icon: string;
  kernel: string;
  description: string;
  defaultParentId: string;
}

// 统一模块配置默认元数据字典
const UNIFIED_MODULE_META_MAP: Record<string, Partial<ModuleMenuMeta>> = {
  submenu_unified_template_config: {
    name: '模板配置',
    code: 'MOD_TPL_CONFIG',
    route: '/unified/template-config',
    icon: 'FileCode',
    kernel: '业务核',
    defaultParentId: 'm_dt_scheme',
  },
  submenu_unified_template_report: {
    name: '模板上报',
    code: 'MOD_TPL_REPORT',
    route: '/unified/template-report',
    icon: 'FileSpreadsheet',
    kernel: '业务核',
    defaultParentId: 'm_dt_scheme',
  },
  submenu_unified_template_dispatch: {
    name: '模板下发',
    code: 'MOD_TPL_DISPATCH',
    route: '/unified/template-dispatch',
    icon: 'Send',
    kernel: '业务核',
    defaultParentId: 'm_dt_scheme',
  },
  submenu_unified_instruction_flow: {
    name: '指令流转',
    code: 'MOD_INST_FLOW',
    route: '/unified/instruction-flow',
    icon: 'CheckSquare',
    kernel: '业务核',
    defaultParentId: 'm_dt_scheme',
  },
  submenu_unified_org_structure: {
    name: '组织机构',
    code: 'MOD_ORG_STRUCT',
    route: '/unified/org-structure',
    icon: 'Database',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_personnel_manage: {
    name: '人员管理',
    code: 'MOD_PERSONNEL',
    route: '/unified/personnel',
    icon: 'Users',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_group_manage: {
    name: '群组管理',
    code: 'MOD_GROUP_MNG',
    route: '/unified/group-manage',
    icon: 'Users',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_role_permission: {
    name: '角色权限',
    code: 'MOD_ROLE_PERM',
    route: '/unified/role-permission',
    icon: 'ShieldCheck',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_data_dictionary: {
    name: '数据字典',
    code: 'MOD_DATA_DICT',
    route: '/unified/data-dictionary',
    icon: 'Database',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_message_notice: {
    name: '消息公告',
    code: 'MOD_MSG_NOTICE',
    route: '/unified/message-notice',
    icon: 'Activity',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_system_log: {
    name: '系统日志',
    code: 'MOD_SYS_LOG',
    route: '/unified/system-log',
    icon: 'History',
    kernel: '组织核',
    defaultParentId: 'm_dt_sys_config',
  },
  submenu_unified_invite_open: {
    name: '邀请开通',
    code: 'MOD_INVITE_OPEN',
    route: '/unified/invite-open',
    icon: 'KeyRound',
    kernel: '开通核',
    defaultParentId: 'm_dt_sys_config',
  },
};

/**
 * 获取模块的元数据信息
 */
export const getModuleMenuMeta = (
  moduleKey: string,
  privateModules: PrivateModuleDeploy[] = []
): ModuleMenuMeta => {
  const unified = getUnifiedModuleByKey(moduleKey);
  const known = UNIFIED_MODULE_META_MAP[moduleKey];

  if (unified) {
    return {
      name: known?.name || unified.title,
      code: known?.code || `MOD_${moduleKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
      route: known?.route || `/unified/${moduleKey.replace(/[^a-zA-Z0-9]/g, '-')}`,
      icon: known?.icon || (unified.kernel === '业务核' ? 'FileCode' : 'Settings'),
      kernel: unified.kernel,
      description: unified.description,
      defaultParentId: known?.defaultParentId || (unified.kernel === '业务核' ? 'm_dt_scheme' : 'm_dt_sys_config'),
    };
  }

  // 尝试从私有模块中查找
  const priv = privateModules.find((p) => p.moduleKey === moduleKey);
  if (priv) {
    return {
      name: priv.name || moduleKey,
      code: `MOD_PRIV_${moduleKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
      route: `/private/${moduleKey.replace(/[^a-zA-Z0-9]/g, '-')}`,
      icon: 'Sliders',
      kernel: priv.kernel || '私有组件',
      description: priv.description || '私有化定制组件模块',
      defaultParentId: 'm_dt_sys_config',
    };
  }

  return {
    name: moduleKey,
    code: `MOD_${moduleKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
    route: `/modules/${moduleKey.toLowerCase()}`,
    icon: 'Cpu',
    kernel: '扩展组件',
    description: '端扩展模块组件',
    defaultParentId: 'm_dt_sys_config',
  };
};

/**
 * 产生模块在菜单项中的唯一 ID
 */
export const getModuleMenuItemId = (endpointId: string, moduleKey: string): string => {
  const safeEp = endpointId.replace(/[^a-zA-Z0-9]/g, '_');
  const safeMod = moduleKey.replace(/[^a-zA-Z0-9]/g, '_');
  return `m_ep_${safeEp}_${safeMod}`;
};

/**
 * 为具体的模块组件构建 SysMenuItem 菜单项
 */
export const createModuleMenuItem = (
  moduleKey: string,
  endpointId: string,
  existingMenus: SysMenuItem[],
  privateModules: PrivateModuleDeploy[] = []
): SysMenuItem => {
  const meta = getModuleMenuMeta(moduleKey, privateModules);
  const id = getModuleMenuItemId(endpointId, moduleKey);

  // 检查默认父级菜单是否存在于现有菜单树中
  let parentId = meta.defaultParentId;
  const parentExists = existingMenus.some((m) => m.id === parentId);
  if (!parentExists) {
    // 降级为系统设置或根目录
    const sysExists = existingMenus.some((m) => m.id === 'm_dt_sys_config');
    parentId = sysExists ? 'm_dt_sys_config' : '0';
  }

  // 计算排序号
  const siblings = existingMenus.filter((m) => m.parentId === parentId);
  const sort = siblings.length + 1;

  return {
    id,
    parentId,
    menuCode: meta.code,
    menuName: meta.name,
    hasIcon: true,
    iconType: 'library',
    icon: meta.icon,
    routePath: meta.route,
    target: 'frame',
    sort,
    globalVisible: true,
    boundPermCodes: [],
    visible: true,
    moduleKey,
    isModuleComponent: true,
    kernel: meta.kernel,
  };
};

/**
 * 核心联动逻辑：根据端配置的模块列表实时同步/挂载端专属菜单树
 * 1. 保持已有自定义菜单（保留用户修改的名称、路由、挂载父级、排序、显隐等个性化配置）
 * 2. 对当前端勾选的模块：若未挂载，则新建并挂载到对应父级菜单；若已挂载，则激活保持
 * 3. 对当前端取消勾选的模块：从菜单树中实时卸载（移除）
 */
export const syncEndpointMenus = (
  existingMenus: SysMenuItem[] | undefined,
  endpointModules: string[],
  endpointId: string,
  privateModules: PrivateModuleDeploy[] = []
): SysMenuItem[] => {
  const baseMenus = existingMenus && existingMenus.length > 0 ? existingMenus : INITIAL_DITING_MENUS;

  // 1. 过滤掉已不在 endpointModules 中的端组件模块（实时卸载）
  let nextMenus = baseMenus.filter((item) => {
    if (!item.isModuleComponent) return true;
    if (!item.moduleKey) return true;
    return endpointModules.includes(item.moduleKey);
  });

  // 2. 遍历 endpointModules，若尚未挂载，则创建并挂载
  endpointModules.forEach((modKey) => {
    const existing = nextMenus.find(
      (m) => m.moduleKey === modKey || m.id === getModuleMenuItemId(endpointId, modKey)
    );
    if (!existing) {
      const newMenuItem = createModuleMenuItem(modKey, endpointId, nextMenus, privateModules);
      nextMenus.push(newMenuItem);
    } else {
      // 保证 moduleKey 与 isModuleComponent 标识完整
      if (!existing.isModuleComponent || !existing.moduleKey) {
        nextMenus = nextMenus.map((m) =>
          m.id === existing.id
            ? { ...m, isModuleComponent: true, moduleKey: modKey, kernel: m.kernel || getModuleMenuMeta(modKey, privateModules).kernel }
            : m
        );
      }
    }
  });

  return nextMenus;
};

/**
 * 获取某个模块当前挂载在菜单的哪个父级下
 */
export const getMountedModuleParentInfo = (
  menus: SysMenuItem[],
  moduleKey: string
): { isMounted: boolean; parentName: string; menuId: string | null; customName: string } => {
  const target = menus.find((m) => m.moduleKey === moduleKey);
  if (!target) {
    return { isMounted: false, parentName: '未挂载', menuId: null, customName: '' };
  }

  if (target.parentId === '0') {
    return {
      isMounted: true,
      parentName: '根目录（一级主菜单）',
      menuId: target.id,
      customName: target.menuName,
    };
  }

  const parent = menus.find((m) => m.id === target.parentId);
  return {
    isMounted: true,
    parentName: parent ? parent.menuName : '根目录（一级主菜单）',
    menuId: target.id,
    customName: target.menuName,
  };
};
