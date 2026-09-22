import { MenuItem } from '../types';

export type UnifiedKernel = '业务核' | '组织核' | '开通核';

export interface UnifiedCallModule {
  menu: MenuItem;
  title: string;
  kernel: UnifiedKernel;
  description: string;
  id: string;
}

export const UNIFIED_CALL_MODULES: UnifiedCallModule[] = [
  {
    menu: MenuItem.UnifiedTemplateConfig,
    title: '模板配置',
    kernel: '业务核',
    description: '设计上报/下发用的表单模板',
    id: 'submenu_unified_template_config',
  },
  {
    menu: MenuItem.UnifiedInstructionFlow,
    title: '流程配置',
    kernel: '业务核',
    description: '配置指令流转流程节点、签收与闭环规则',
    id: 'submenu_unified_instruction_flow',
  },
  {
    menu: MenuItem.UnifiedTemplateReport,
    title: '模板上报',
    kernel: '业务核',
    description: '按模板提交业务数据',
    id: 'submenu_unified_template_report',
  },
  {
    menu: MenuItem.UnifiedTemplateDispatch,
    title: '模板下发',
    kernel: '业务核',
    description: '按模板把任务发到下级',
    id: 'submenu_unified_template_dispatch',
  },
  {
    menu: MenuItem.UnifiedOrgStructure,
    title: '组织机构',
    kernel: '组织核',
    description: '树形单位结构',
    id: 'submenu_unified_org_structure',
  },
  {
    menu: MenuItem.UnifiedPersonnelManage,
    title: '人员管理',
    kernel: '组织核',
    description: '本机构人员档案',
    id: 'submenu_unified_personnel_manage',
  },
  {
    menu: MenuItem.UnifiedGroupManage,
    title: '群组管理',
    kernel: '组织核',
    description: '跨部门工作群',
    id: 'submenu_unified_group_manage',
  },
  {
    menu: MenuItem.UnifiedRolePermission,
    title: '角色权限',
    kernel: '组织核',
    description: '在骨架内给角色勾模块',
    id: 'submenu_unified_role_permission',
  },
  {
    menu: MenuItem.UnifiedDataDictionary,
    title: '数据字典',
    kernel: '组织核',
    description: '维护各应用统一调用的字典项与枚举值',
    id: 'submenu_unified_data_dictionary',
  },
  {
    menu: MenuItem.UnifiedMessageNotice,
    title: '消息公告',
    kernel: '组织核',
    description: '面向接入机构发布通知、公告与站内消息',
    id: 'submenu_unified_message_notice',
  },
  {
    menu: MenuItem.UnifiedSystemLog,
    title: '系统日志',
    kernel: '组织核',
    description: '查看统一调用组件的操作记录与审计日志',
    id: 'submenu_unified_system_log',
  },
  {
    menu: MenuItem.UnifiedInviteOpen,
    title: '邀请开通',
    kernel: '开通核',
    description: '激活码 / 二维码 / 主动邀请',
    id: 'submenu_unified_invite_open',
  },
];

export const UNIFIED_CALL_MENU_ITEMS = UNIFIED_CALL_MODULES.map((item) => item.menu);

export const ALL_UNIFIED_MODULE_KEYS = UNIFIED_CALL_MODULES.map((item) => item.menu as string);

export const getUnifiedModuleByKey = (key: string) =>
  UNIFIED_CALL_MODULES.find((item) => item.menu === key);
