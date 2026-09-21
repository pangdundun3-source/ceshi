import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  LayoutList,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Folder,
  Globe,
  Settings,
  Activity,
  CheckSquare,
  Sliders,
  Flame,
  KeyRound,
  Users,
  ListTodo,
  FileCode,
  TrendingUp,
  Gauge,
  FileText,
  Database,
  Cpu,
  History,
  LayoutDashboard,
  Send,
  ShieldCheck,
  ShieldAlert,
  FileSpreadsheet,
  Check,
  Copy,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Code2,
  ExternalLink,
  Maximize2,
  HelpCircle,
  X,
  GripVertical,
  Link2,
  Unlink,
  Layers,
  MonitorSmartphone,
  Monitor,
  Server,
  Smartphone,
  Tablet,
  Network,
  MessageCircle,
  ArrowRight,
  Library
} from 'lucide-react';
// ==========================================
// 1. 数据结构类型定义
// ==========================================
export interface AvailableComponentOption {
  key: string;
  title: string;
  description: string;
  kernel: string;
  routePath?: string;
  icon?: string;
  displayedEndpoints?: Array<{
    id: string;
    name: string;
    kind?: string;
  }>;
}

export const getEndpointKindIcon = (kind?: string) => {
  switch (kind) {
    case 'admin_web': return Server;
    case 'user_web': return Monitor;
    case 'h5': return Smartphone;
    case 'pad': return Tablet;
    case 'intranet': return Network;
    case 'wechat': return MessageCircle;
    default: return Monitor;
  }
};

export const getEndpointKindStyle = (kind?: string) => {
  switch (kind) {
    case 'admin_web': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'user_web': return 'bg-blue-50 text-[#1e376b] border-blue-200';
    case 'h5': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pad': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'intranet': return 'bg-slate-100 text-slate-700 border-slate-300';
    case 'wechat': return 'bg-green-50 text-green-700 border-green-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export type ActionCategory = 'query' | 'create' | 'update' | 'delete' | 'export' | 'audit';

export interface ComponentActionOption {
  code: string;           // 动作操作编码，如 'query' | 'create' | 'update' | 'delete' | 'export' | 'audit'
  name: string;           // 动作名称，如 '查询与明细浏览' | '新增录入'
  category: ActionCategory;
  categoryLabel: string;  // 查 / 增 / 改 / 删 / 导 / 审
  description: string;    // 功能详细说明
}

export const ACTION_CATEGORY_STYLES: Record<ActionCategory, { pill: string; badge: string; activeBorder: string }> = {
  create: {
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'bg-emerald-600 text-white',
    activeBorder: 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-200/70',
  },
  delete: {
    pill: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: 'bg-rose-600 text-white',
    activeBorder: 'border-rose-300 bg-rose-50/40 ring-1 ring-rose-200/70',
  },
  update: {
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'bg-amber-600 text-white',
    activeBorder: 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-200/70',
  },
  query: {
    pill: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'bg-blue-600 text-white',
    activeBorder: 'border-blue-300 bg-blue-50/40 ring-1 ring-blue-200/70',
  },
  export: {
    pill: 'bg-purple-50 text-purple-700 border-purple-200',
    badge: 'bg-purple-600 text-white',
    activeBorder: 'border-purple-300 bg-purple-50/40 ring-1 ring-purple-200/70',
  },
  audit: {
    pill: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badge: 'bg-cyan-600 text-white',
    activeBorder: 'border-cyan-300 bg-cyan-50/40 ring-1 ring-cyan-200/70',
  },
};

export const getModuleAvailableActions = (moduleKey?: string): ComponentActionOption[] => {
  if (!moduleKey) {
    return [
      { code: 'query', name: '数据查询浏览', category: 'query', categoryLabel: '查', description: '列表多维检索、分页过滤与明细穿透查看' },
      { code: 'create', name: '新增记录录入', category: 'create', categoryLabel: '增', description: '创建业务数据、录入新记录与表单初始化' },
      { code: 'update', name: '编辑修改更新', category: 'update', categoryLabel: '改', description: '修改已有记录参数、更新处理进度与状态' },
      { code: 'delete', name: '记录删除移除', category: 'delete', categoryLabel: '删', description: '作废无效记录、移入回收站或彻底清除' },
      { code: 'export', name: '报表数据导出', category: 'export', categoryLabel: '导', description: '批量导出列表数据至 Excel / PDF 台账' },
      { code: 'audit', name: '业务审核流转', category: 'audit', categoryLabel: '审', description: '业务流转核验、状态审批复核与归档确认' },
    ];
  }

  const key = moduleKey.toLowerCase();

  // 1. 警情/监测/告警/态势类
  if (key.includes('alert') || key.includes('warn') || key.includes('monitor') || key.includes('situation')) {
    return [
      { code: 'query', name: '警情检索与查看', category: 'query', categoryLabel: '查', description: '实时检索预警事件、查看警情详情与态势流' },
      { code: 'create', name: '手动录入与补录', category: 'create', categoryLabel: '增', description: '手动创建告警事件、补充上报外部突发线索' },
      { code: 'update', name: '研判改级与去向', category: 'update', categoryLabel: '改', description: '调整预警等级、编辑研判结论与分流指派' },
      { code: 'delete', name: '误报作废与清理', category: 'delete', categoryLabel: '删', description: '标记并作废误报事件、清理失效警情记录' },
      { code: 'export', name: '警情台账批量导出', category: 'export', categoryLabel: '导', description: '导出警情数据清单至 Excel 及预警通报简报' },
      { code: 'audit', name: '处置签批与结案', category: 'audit', categoryLabel: '审', description: '对处置方案进行审批盖章、归档复核与结案' },
    ];
  }

  // 2. 工单/任务/交办/调度类
  if (key.includes('task') || key.includes('dispatch') || key.includes('instruction') || key.includes('flow')) {
    return [
      { code: 'query', name: '工单查询与轨迹', category: 'query', categoryLabel: '查', description: '检索交办工单列表、流转轨迹及经办明细' },
      { code: 'create', name: '发起新建交办单', category: 'create', categoryLabel: '增', description: '下发协同指令、创建新工单并指定责任人' },
      { code: 'update', name: '进度填报与改派', category: 'update', categoryLabel: '改', description: '填写处置进度反馈、申请延期或改派经办人' },
      { code: 'delete', name: '撤销作废与删除', category: 'delete', categoryLabel: '删', description: '撤回误发工单、作废撤销任务或删除草稿' },
      { code: 'export', name: '协同台账导出', category: 'export', categoryLabel: '导', description: '导出协同任务完成明细与部门考核统计表' },
      { code: 'audit', name: '办结复核与验收', category: 'audit', categoryLabel: '审', description: '复核办结处置材料、质量验收与归档评价' },
    ];
  }

  // 3. 报表/统计/分析类
  if (key.includes('report') || key.includes('analysis') || key.includes('stat') || key.includes('chart')) {
    return [
      { code: 'query', name: '报表查询与多维下钻', category: 'query', categoryLabel: '查', description: '查询周期研判报表、多维统计指标与穿透下钻' },
      { code: 'create', name: '新建报表与自定义', category: 'create', categoryLabel: '增', description: '创建新的周期分析报表、自定义统计口径' },
      { code: 'update', name: '调整维度与指标', category: 'update', categoryLabel: '改', description: '编辑统计范围、调整加权算法与参数过滤' },
      { code: 'delete', name: '过时报表归档废除', category: 'delete', categoryLabel: '删', description: '归档历史过时报表、删除草稿统计模版' },
      { code: 'export', name: '多格式报表导出', category: 'export', categoryLabel: '导', description: '导出高保真 Excel 数据表与 PDF 汇报文档' },
      { code: 'audit', name: '数据审核与发布', category: 'audit', categoryLabel: '审', description: '发布前进行数据核对、签批审查与发布授权' },
    ];
  }

  // 4. 组织/人员/用户/群组类
  if (key.includes('org') || key.includes('personnel') || key.includes('user') || key.includes('group')) {
    return [
      { code: 'query', name: '名录架构多维查询', category: 'query', categoryLabel: '查', description: '检索组织架构树、岗位层级与人员名录信息' },
      { code: 'create', name: '新建节点与人员录入', category: 'create', categoryLabel: '增', description: '添加新部门节点、开通人员账号与设置岗位' },
      { code: 'update', name: '信息变更与调岗维护', category: 'update', categoryLabel: '改', description: '修改部门信息、人员任职与上下级汇报关系' },
      { code: 'delete', name: '离职清理与注销', category: 'delete', categoryLabel: '删', description: '冻结注销账号、人员离职清理与部门撤并' },
      { code: 'export', name: '组织花名册批量导出', category: 'export', categoryLabel: '导', description: '导出组织编制清单、部门员工花名册' },
      { code: 'audit', name: '人事变动审批复核', category: 'audit', categoryLabel: '审', description: '跨部门调岗、岗位提拔与任职异动审批' },
    ];
  }

  // 5. 角色/权限/安全类
  if (key.includes('role') || key.includes('perm') || key.includes('auth')) {
    return [
      { code: 'query', name: '权限矩阵与角色检索', category: 'query', categoryLabel: '查', description: '查看角色列表、权限分配矩阵与数据范围' },
      { code: 'create', name: '新建角色与基准授权', category: 'create', categoryLabel: '增', description: '创建业务管理角色、指定基准功能权限集' },
      { code: 'update', name: '权限微调与菜单变更', category: 'update', categoryLabel: '改', description: '勾选/剔除菜单权限、调整细粒度按钮控制' },
      { code: 'delete', name: '角色废除与下线清理', category: 'delete', categoryLabel: '删', description: '清理已停用角色、解除所有成员绑定并删除' },
      { code: 'export', name: '角色权限矩阵导出', category: 'export', categoryLabel: '导', description: '导出角色授权清单与系统安全合规对照表' },
      { code: 'audit', name: '敏感权限变更审计', category: 'audit', categoryLabel: '审', description: '特权账号授权双人复核、变更日志合规审计' },
    ];
  }

  // 6. 模版/规则/配置/字典类
  if (key.includes('config') || key.includes('tpl') || key.includes('rule') || key.includes('dict') || key.includes('scheme')) {
    return [
      { code: 'query', name: '规则配置检索与查看', category: 'query', categoryLabel: '查', description: '检索策略规则列表、系统配置项与字典值' },
      { code: 'create', name: '新增规则与配置模版', category: 'create', categoryLabel: '增', description: '录入新监测策略、设定阈值条件与模板项' },
      { code: 'update', name: '参数微调与策略优化', category: 'update', categoryLabel: '改', description: '修改生效参数、调整优先级与更新配置' },
      { code: 'delete', name: '规则停用与下线清理', category: 'delete', categoryLabel: '删', description: '下线失效规则、作废历史模版与清理冗余' },
      { code: 'export', name: '模版规则包备份导出', category: 'export', categoryLabel: '导', description: '导出规则包 JSON/Excel、系统配置备份文件' },
      { code: 'audit', name: '规则投产双人复核', category: 'audit', categoryLabel: '审', description: '生产环境规则发布前合规性校验与审批' },
    ];
  }

  // 7. 标准通用增删改查兜底
  return [
    { code: 'query', name: '数据查询浏览', category: 'query', categoryLabel: '查', description: '列表检索过滤、多维筛选及明细弹窗查看' },
    { code: 'create', name: '新增记录录入', category: 'create', categoryLabel: '增', description: '创建新增记录、表单填写与初始化录入' },
    { code: 'update', name: '编辑修改更新', category: 'update', categoryLabel: '改', description: '修改已有业务数据、调整参数与更新状态' },
    { code: 'delete', name: '记录删除移除', category: 'delete', categoryLabel: '删', description: '作废废弃记录、移入回收站或彻底删除' },
    { code: 'export', name: '报表数据导出', category: 'export', categoryLabel: '导', description: '批量将列表及分析数据导出至 Excel 文件' },
    { code: 'audit', name: '业务审核流转', category: 'audit', categoryLabel: '审', description: '业务流转核验、状态审批复核与归档签批' },
  ];
};

export interface SysMenuItem {
  id: string;
  parentId: string; // '0' 表示顶级一级菜单，或指向父级一级菜单 id
  menuCode: string; // 菜单唯一编码（应用内不可重复）
  menuName: string; // 菜单名称（最多10个汉字）

  // 图标与样式设置
  hasIcon: boolean; // 是否有图标
  iconType: 'library' | 'upload' | 'customClass'; // '使用图标库' | '上传图标' | '使用样式表'
  icon: string; // 图标库图标名称
  iconUploadUrl?: string; // 上传图片数据或URL
  iconCustomClass?: string; // 自定义 CSS 类名，如 'iconfont icon-warn'

  routePath: string; // 前端路由地址
  target: 'frame' | '_blank' | '_self'; // 打开方式：框架内 / 新窗口 / 本窗口 (self)
  sort: number; // 排序序号，数字越小越靠前
  globalVisible: boolean; // 显示范围：是否全局可见（true=全局可见无需权限；false=需绑定应用权限）
  boundPermCodes?: string[]; // 绑定的应用权限唯一标识编码列表（主权限/子权限）
  visible: boolean; // 前台显示状态：可见 / 不可见（不可见时沉底、置灰、加删除线且不可上下排序）
  isNewPlaceholder?: boolean; // 是否为新增待保存菜单
  moduleKey?: string; // 关联挂载的端组件模块Key
  isModuleComponent?: boolean; // 标识是否为挂载的端组件模块
  kernel?: string; // 组件所属核，如'业务核' | '组织核' | '开通核' | '私有组件'
  moduleActions?: string[]; // 选中的具体功能操作编码列表（二次勾选：增、删、改、查、导、审等）
}

// 可选图标列表供可视化选择
export const AVAILABLE_ICONS = [
  { name: 'LayoutDashboard', label: '态势大屏', icon: LayoutDashboard },
  { name: 'ShieldAlert', label: '预警告警', icon: ShieldAlert },
  { name: 'Globe', label: '网络舆情', icon: Globe },
  { name: 'FileSpreadsheet', label: '上报报表', icon: FileSpreadsheet },
  { name: 'BarChart3', label: '统计图表', icon: TrendingUp },
  { name: 'Settings', label: '系统设置', icon: Settings },
  { name: 'Activity', label: '实时监测', icon: Activity },
  { name: 'CheckSquare', label: '研判处置', icon: CheckSquare },
  { name: 'ShieldCheck', label: '审核把关', icon: ShieldCheck },
  { name: 'Sliders', label: '规则引擎', icon: Sliders },
  { name: 'Flame', label: '舆情热点', icon: Flame },
  { name: 'KeyRound', label: '敏感词库', icon: KeyRound },
  { name: 'Users', label: '网格队伍', icon: Users },
  { name: 'ListTodo', label: '工单交办', icon: ListTodo },
  { name: 'FileCode', label: '模板配置', icon: FileCode },
  { name: 'TrendingUp', label: '趋势分析', icon: TrendingUp },
  { name: 'Gauge', label: '效能评估', icon: Gauge },
  { name: 'FileText', label: '周期报告', icon: FileText },
  { name: 'Database', label: '数据字典', icon: Database },
  { name: 'Cpu', label: '接口集成', icon: Cpu },
  { name: 'History', label: '审计日志', icon: History }
];

export const getMenuIconComponent = (iconName: string) => {
  const found = AVAILABLE_ICONS.find(i => i.name === iconName);
  return found ? found.icon : Folder;
};

// ==========================================
// 2. 谛听预警系统 默认系统菜单树预设（全新菜单重构）
// ==========================================
export const INITIAL_DITING_MENUS: SysMenuItem[] = [
  // 1. 首页 (一级菜单，无子菜单)
  {
    id: 'm_dt_home',
    parentId: '0',
    menuCode: 'DT_HOME',
    menuName: '首页',
    hasIcon: true,
    iconType: 'library',
    icon: 'LayoutDashboard',
    routePath: '/diting/home',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },

  // 2. 监测方案 (一级菜单)
  {
    id: 'm_dt_scheme',
    parentId: '0',
    menuCode: 'DT_SCHEME',
    menuName: '监测方案',
    hasIcon: true,
    iconType: 'library',
    icon: 'ShieldAlert',
    routePath: '/diting/scheme',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:SITUATION:MONITOR']
  },
  {
    id: 'm_dt_scheme_new',
    parentId: 'm_dt_scheme',
    menuCode: 'DT_SCHEME_NEW',
    menuName: '新建监测方案',
    hasIcon: true,
    iconType: 'library',
    icon: 'Plus',
    routePath: '/diting/scheme/new',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_scheme_all',
    parentId: 'm_dt_scheme',
    menuCode: 'DT_SCHEME_ALL',
    menuName: '全部方案',
    hasIcon: true,
    iconType: 'library',
    icon: 'Folder',
    routePath: '/diting/scheme/all',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_scheme_mine',
    parentId: 'm_dt_scheme',
    menuCode: 'DT_SCHEME_MINE',
    menuName: '我的方案',
    hasIcon: true,
    iconType: 'library',
    icon: 'Users',
    routePath: '/diting/scheme/mine',
    target: 'frame',
    sort: 3,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_scheme_public',
    parentId: 'm_dt_scheme',
    menuCode: 'DT_SCHEME_PUBLIC',
    menuName: '公共方案',
    hasIcon: true,
    iconType: 'library',
    icon: 'Globe',
    routePath: '/diting/scheme/public',
    target: 'frame',
    sort: 4,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_scheme_manage',
    parentId: 'm_dt_scheme',
    menuCode: 'DT_SCHEME_MANAGE',
    menuName: '方案管理',
    hasIcon: true,
    iconType: 'library',
    icon: 'Sliders',
    routePath: '/diting/scheme/manage',
    target: 'frame',
    sort: 5,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_scheme_recycle',
    parentId: 'm_dt_scheme',
    menuCode: 'DT_SCHEME_RECYCLE',
    menuName: '数据回收站',
    hasIcon: true,
    iconType: 'library',
    icon: 'History',
    routePath: '/diting/scheme/recycle',
    target: 'frame',
    sort: 6,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },

  // 3. 话题汇总 (一级菜单)
  {
    id: 'm_dt_topic',
    parentId: '0',
    menuCode: 'DT_TOPIC',
    menuName: '话题汇总',
    hasIcon: true,
    iconType: 'library',
    icon: 'Flame',
    routePath: '/diting/topic',
    target: 'frame',
    sort: 3,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_topic_summary',
    parentId: 'm_dt_topic',
    menuCode: 'DT_TOPIC_SUMMARY',
    menuName: '话题汇总',
    hasIcon: true,
    iconType: 'library',
    icon: 'ListTodo',
    routePath: '/diting/topic/summary',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_topic_new',
    parentId: 'm_dt_topic',
    menuCode: 'DT_TOPIC_NEW',
    menuName: '新建汇总',
    hasIcon: true,
    iconType: 'library',
    icon: 'Plus',
    routePath: '/diting/topic/new',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },

  // 4. 数据仓库 (一级菜单)
  {
    id: 'm_dt_warehouse',
    parentId: '0',
    menuCode: 'DT_WAREHOUSE',
    menuName: '数据仓库',
    hasIcon: true,
    iconType: 'library',
    icon: 'Database',
    routePath: '/diting/warehouse',
    target: 'frame',
    sort: 4,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:SITUATION:MONITOR']
  },
  {
    id: 'm_dt_warehouse_list',
    parentId: 'm_dt_warehouse',
    menuCode: 'DT_WAREHOUSE_LIST',
    menuName: '数据仓库列表',
    hasIcon: true,
    iconType: 'library',
    icon: 'FileSpreadsheet',
    routePath: '/diting/warehouse/list',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_warehouse_manage',
    parentId: 'm_dt_warehouse',
    menuCode: 'DT_WAREHOUSE_MANAGE',
    menuName: '数据仓库管理',
    hasIcon: true,
    iconType: 'library',
    icon: 'Sliders',
    routePath: '/diting/warehouse/manage',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },

  // 5. 标签管理 (一级菜单)
  {
    id: 'm_dt_tag',
    parentId: '0',
    menuCode: 'DT_TAG',
    menuName: '标签管理',
    hasIcon: true,
    iconType: 'library',
    icon: 'KeyRound',
    routePath: '/diting/tag',
    target: 'frame',
    sort: 5,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_tag_item',
    parentId: 'm_dt_tag',
    menuCode: 'DT_TAG_ITEM',
    menuName: '标签',
    hasIcon: true,
    iconType: 'library',
    icon: 'KeyRound',
    routePath: '/diting/tag/item',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_tag_list',
    parentId: 'm_dt_tag',
    menuCode: 'DT_TAG_LIST',
    menuName: '标签管理列表',
    hasIcon: true,
    iconType: 'library',
    icon: 'ListTodo',
    routePath: '/diting/tag/list',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_tag_manage',
    parentId: 'm_dt_tag',
    menuCode: 'DT_TAG_MANAGE',
    menuName: '标签管理',
    hasIcon: true,
    iconType: 'library',
    icon: 'Settings',
    routePath: '/diting/tag/manage',
    target: 'frame',
    sort: 3,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },

  // 6. 热榜热搜 (一级菜单)
  {
    id: 'm_dt_hot',
    parentId: '0',
    menuCode: 'DT_HOT',
    menuName: '热榜热搜',
    hasIcon: true,
    iconType: 'library',
    icon: 'Flame',
    routePath: '/diting/hot',
    target: 'frame',
    sort: 6,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_hot_today',
    parentId: 'm_dt_hot',
    menuCode: 'DT_HOT_TODAY',
    menuName: '今日热榜',
    hasIcon: true,
    iconType: 'library',
    icon: 'Activity',
    routePath: '/diting/hot/today',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_hot_history',
    parentId: 'm_dt_hot',
    menuCode: 'DT_HOT_HISTORY',
    menuName: '历史上榜',
    hasIcon: true,
    iconType: 'library',
    icon: 'History',
    routePath: '/diting/hot/history',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },

  // 7. 智能统计 (一级菜单，无二级子菜单)
  {
    id: 'm_dt_smart_stat',
    parentId: '0',
    menuCode: 'DT_SMART_STAT',
    menuName: '智能统计',
    hasIcon: true,
    iconType: 'library',
    icon: 'TrendingUp',
    routePath: '/diting/smart-stat',
    target: 'frame',
    sort: 7,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },

  // 8. 报告库 (一级菜单)
  {
    id: 'm_dt_report_lib',
    parentId: '0',
    menuCode: 'DT_REPORT_LIB',
    menuName: '报告库',
    hasIcon: true,
    iconType: 'library',
    icon: 'FileText',
    routePath: '/diting/report-lib',
    target: 'frame',
    sort: 8,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:SITUATION:MONITOR']
  },
  {
    id: 'm_dt_report_received',
    parentId: 'm_dt_report_lib',
    menuCode: 'DT_REPORT_RECEIVED',
    menuName: '我收到的报告',
    hasIcon: true,
    iconType: 'library',
    icon: 'FileSpreadsheet',
    routePath: '/diting/report-lib/received',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_report_generated',
    parentId: 'm_dt_report_lib',
    menuCode: 'DT_REPORT_GENERATED',
    menuName: '我生成的报告',
    hasIcon: true,
    iconType: 'library',
    icon: 'FileCode',
    routePath: '/diting/report-lib/generated',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: true,
    boundPermCodes: []
  },
  {
    id: 'm_dt_report_recycle',
    parentId: 'm_dt_report_lib',
    menuCode: 'DT_REPORT_RECYCLE',
    menuName: '报告回收站',
    hasIcon: true,
    iconType: 'library',
    icon: 'History',
    routePath: '/diting/report-lib/recycle',
    target: 'frame',
    sort: 3,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },

  // 9. 系统设置 (一级菜单)
  {
    id: 'm_dt_sys_config',
    parentId: '0',
    menuCode: 'DT_SYS_CONFIG',
    menuName: '系统设置',
    hasIcon: true,
    iconType: 'library',
    icon: 'Settings',
    routePath: '/diting/sys-config',
    target: 'frame',
    sort: 9,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_sys_basic',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_BASIC',
    menuName: '基本信息',
    hasIcon: true,
    iconType: 'library',
    icon: 'Settings',
    routePath: '/diting/sys-config/basic',
    target: 'frame',
    sort: 1,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_sys_users',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_USERS',
    menuName: '人员管理',
    hasIcon: true,
    iconType: 'library',
    icon: 'Users',
    routePath: '/diting/sys-config/users',
    target: 'frame',
    sort: 2,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:INCIDENT:DISPATCH']
  },
  {
    id: 'm_dt_sys_roles',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_ROLES',
    menuName: '角色管理',
    hasIcon: true,
    iconType: 'library',
    icon: 'ShieldCheck',
    routePath: '/diting/sys-config/roles',
    target: 'frame',
    sort: 3,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_sys_perms',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_PERMS',
    menuName: '权限设置',
    hasIcon: true,
    iconType: 'library',
    icon: 'KeyRound',
    routePath: '/diting/sys-config/perms',
    target: 'frame',
    sort: 4,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_sys_push_tpl',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_PUSH_TPL',
    menuName: '推送模板',
    hasIcon: true,
    iconType: 'library',
    icon: 'Send',
    routePath: '/diting/sys-config/push-tpl',
    target: 'frame',
    sort: 5,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_sys_copy_tpl',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_COPY_TPL',
    menuName: '复制模板',
    hasIcon: true,
    iconType: 'library',
    icon: 'FileCode',
    routePath: '/diting/sys-config/copy-tpl',
    target: 'frame',
    sort: 6,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:CONFIG:RULE']
  },
  {
    id: 'm_dt_sys_logs',
    parentId: 'm_dt_sys_config',
    menuCode: 'DT_SYS_LOGS',
    menuName: '日志查询',
    hasIcon: true,
    iconType: 'library',
    icon: 'History',
    routePath: '/diting/sys-config/logs',
    target: 'frame',
    sort: 7,
    visible: true,
    globalVisible: false,
    boundPermCodes: ['PERM:AUDIT:LOG']
  }
];

export interface MenuManageProps {
  appName?: string;
  appCode?: string;
  endpointName?: string;
  endpointKind?: string;
  onShowToast?: (text: string, type: 'success' | 'warning' | 'info') => void;
  menus?: SysMenuItem[];
  onMenusChange?: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
  focusMenuId?: string | null;
  availableComponents?: AvailableComponentOption[];
  onNavigateToComponents?: () => void;
}

export const MenuManage: React.FC<MenuManageProps> = ({
  appName = '谛听预警系统',
  appCode = 'APP-DITING-01',
  endpointName,
  endpointKind,
  onShowToast,
  menus: externalMenus,
  onMenusChange: externalSetMenus,
  focusMenuId,
  availableComponents = [],
  onNavigateToComponents,
}) => {
  // 核心菜单状态（支持外部受控同步与内部默认状态）
  const [internalMenus, setInternalMenus] = useState<SysMenuItem[]>(INITIAL_DITING_MENUS);
  const menus = externalMenus !== undefined ? externalMenus : internalMenus;
  const setMenus = externalSetMenus !== undefined ? externalSetMenus : setInternalMenus;
  const [selectedMenuId, setSelectedMenuId] = useState<string>('m_dt_home');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenuIds, setExpandedMenuIds] = useState<string[]>([
    'm_dt_scheme'
  ]);

  // 编辑表单工作副本
  const [editForm, setEditForm] = useState<SysMenuItem | null>(INITIAL_DITING_MENUS[0]);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // 当外部指定聚焦的菜单项时（如点击了模块组件卡片上的“个性化配置”）
  useEffect(() => {
    if (focusMenuId) {
      const target = menus.find((m) => m.id === focusMenuId);
      if (target) {
        setSelectedMenuId(target.id);
        setEditForm({
          ...target,
          boundPermCodes: target.boundPermCodes ? [...target.boundPermCodes] : [],
          moduleActions: target.moduleActions
            ? [...target.moduleActions]
            : (target.moduleKey ? getModuleAvailableActions(target.moduleKey).map(a => a.code) : undefined)
        });
        setIsFormDirty(false);
        if (target.parentId && target.parentId !== '0') {
          setExpandedMenuIds((prev) => (prev.includes(target.parentId) ? prev : [...prev, target.parentId]));
        }
      }
    }
  }, [focusMenuId, menus]);

  // 浮框弹窗：“添加菜单”
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [addMenuLevel, setAddMenuLevel] = useState<'primary' | 'secondary'>('primary');
  const [addMenuName, setAddMenuName] = useState('');
  const [addMenuParentId, setAddMenuParentId] = useState<string>('m_dt_1');
  const [addMenuError, setAddMenuError] = useState<string>('');

  // 模态弹窗状态：永久删除确认、恢复默认模板确认、实时预览
  const [isResetDefaultModalOpen, setIsResetDefaultModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewActiveId, setPreviewActiveId] = useState('');
  const [previewExpandedIds, setPreviewExpandedIds] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 恢复为系统默认菜单模板
  const handleConfirmResetDefault = () => {
    const cloned = JSON.parse(JSON.stringify(INITIAL_DITING_MENUS));
    setMenus(cloned);
    setSelectedMenuId(cloned[0]?.id || 'm_dt_home');
    setEditForm(cloned[0] || null);
    setIsResetDefaultModalOpen(false);
    onShowToast?.('已成功重置恢复为系统初始菜单模板！', 'success');
  };

  // 拖拽排序状态（同级菜单拖拽排序）
  const [draggingMenuId, setDraggingMenuId] = useState<string | null>(null);
  const [dragOverMenuId, setDragOverMenuId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  // 图标库选择器搜索
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  // 上传文件 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当前选中的菜单
  const currentSelectedMenu = useMemo(() => {
    return menus.find(m => m.id === selectedMenuId) || menus[0] || null;
  }, [menus, selectedMenuId]);

  // 当选择菜单切换时同步到编辑表单
  const handleSelectMenu = (item: SysMenuItem) => {
    setSelectedMenuId(item.id);
    setEditForm({
      ...item,
      boundPermCodes: item.boundPermCodes ? [...item.boundPermCodes] : [],
      moduleActions: item.moduleActions
        ? [...item.moduleActions]
        : (item.moduleKey ? getModuleAvailableActions(item.moduleKey).map(a => a.code) : undefined)
    });
    setIsFormDirty(false);
  };

  // 复制文本
  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    onShowToast?.(`已复制「${text}」到剪贴板`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 展开/收起父级菜单
  const toggleExpand = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenuIds(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  // 快速切换单个菜单的“前台可见/不可见”
  // 规则：所有不可见（visible === false）的菜单排在最后，图标置灰、文字加删除线、不能进行上下移动
  const handleToggleVisible = (menuId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMenus(prev => {
      const target = prev.find(m => m.id === menuId);
      if (!target) return prev;
      const nextVisible = !target.visible;
      const updated = prev.map(m => (m.id === menuId ? { ...m, visible: nextVisible } : m));

      onShowToast?.(
        `菜单「${target.menuName}」已设为：${nextVisible ? '前台显示（可正常排序）' : '前台隐藏（已沉底置灰并加删除线）'}`,
        nextVisible ? 'success' : 'info'
      );
      return updated;
    });

    if (editForm && editForm.id === menuId) {
      setEditForm(prev => (prev ? { ...prev, visible: !prev.visible } : null));
    }
  };

  // ==========================================
  // 打开“添加菜单”浮框弹窗
  // ==========================================
  const handleOpenAddMenuModal = () => {
    setAddMenuLevel('primary');
    setAddMenuName('');
    setAddMenuError('');
    // 默认父级菜单为第一个一级菜单
    const firstPrimary = menus.find(m => m.parentId === '0');
    if (firstPrimary) {
      setAddMenuParentId(firstPrimary.id);
    }
    setIsAddMenuModalOpen(true);
  };

  // 提交添加菜单弹窗 (按钮文案为“添加”)
  const handleConfirmAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = addMenuName.trim();
    if (!trimmedName) {
      setAddMenuError('菜单名称不能为空');
      return;
    }
    if (trimmedName.length > 10) {
      setAddMenuError('菜单名称最长不能超过 10 个汉字');
      return;
    }

    let trimmedCode = `MENU_${Date.now().toString().slice(-6)}`;
    while (menus.some(m => m.menuCode.toUpperCase() === trimmedCode)) {
      trimmedCode = `MENU_${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
    }

    const newId = 'menu_' + Date.now();
    const parentId = addMenuLevel === 'primary' ? '0' : addMenuParentId;

    // 计算排序号
    const siblings = menus.filter(m => m.parentId === parentId);
    const newSort = siblings.length + 1;

    // 默认前端路由
    let defaultRoute = '/custom/' + trimmedCode.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (addMenuLevel === 'secondary') {
      const parentMenu = menus.find(m => m.id === parentId);
      if (parentMenu) {
        defaultRoute = parentMenu.routePath.replace(/\/$/, '') + '/' + trimmedCode.toLowerCase().replace(/[^a-z0-9]/g, '_');
      }
    }

    const newMenuItem: SysMenuItem = {
      id: newId,
      parentId: parentId,
      menuCode: trimmedCode,
      menuName: trimmedName,
      hasIcon: true,
      iconType: 'library',
      icon: addMenuLevel === 'primary' ? 'Folder' : 'Activity',
      routePath: defaultRoute,
      target: 'frame',
      sort: newSort,
      visible: true,
      globalVisible: true,
      boundPermCodes: [],
      isNewPlaceholder: true
    };

    // 插入列表
    setMenus(prev => [...prev, newMenuItem]);
    // 选中新菜单
    setSelectedMenuId(newId);
    setEditForm({ ...newMenuItem });
    setIsFormDirty(true);

    // 如果添加的是二级菜单，自动展开父菜单
    if (parentId !== '0' && !expandedMenuIds.includes(parentId)) {
      setExpandedMenuIds(prev => [...prev, parentId]);
    }

    // 关闭弹窗
    setIsAddMenuModalOpen(false);
    onShowToast?.(`已成功添加「${trimmedName}」，请在右侧完善菜单配置后保存！`, 'success');
  };

  // 保存表单（保存菜单配置）
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    const trimmedName = editForm.menuName.trim();
    if (!trimmedName) {
      onShowToast?.('菜单名称不能为空', 'warning');
      return;
    }
    if (trimmedName.length > 10) {
      onShowToast?.('菜单名称最长不能超过 10 个汉字', 'warning');
      return;
    }

    const trimmedCode = editForm.menuCode.trim().toUpperCase();
    if (!trimmedCode) {
      onShowToast?.('菜单唯一编码不能为空', 'warning');
      return;
    }

    // 校验编码在整个应用内唯一（排除自己）
    const isCodeDuplicate = menus.some(m => m.id !== editForm.id && m.menuCode.toUpperCase() === trimmedCode);
    if (isCodeDuplicate) {
      onShowToast?.(`菜单编码「${trimmedCode}」在应用内已存在，请更换！`, 'warning');
      return;
    }

    // 清除占位标识并固化
    const savedItem: SysMenuItem = {
      ...editForm,
      menuName: trimmedName,
      menuCode: trimmedCode,
      isNewPlaceholder: false
    };

    setMenus(prev => prev.map(m => (m.id === editForm.id ? savedItem : m)));
    setEditForm(savedItem);
    setIsFormDirty(false);

    onShowToast?.(`菜单「${savedItem.menuName}」配置已成功保存！`, 'success');
  };

  // 还原修改（仅在修改已有菜单时可用）
  const handleResetForm = () => {
    if (!currentSelectedMenu) return;
    setEditForm({
      ...currentSelectedMenu,
      boundPermCodes: currentSelectedMenu.boundPermCodes ? [...currentSelectedMenu.boundPermCodes] : [],
      moduleActions: currentSelectedMenu.moduleActions
        ? [...currentSelectedMenu.moduleActions]
        : (currentSelectedMenu.moduleKey ? getModuleAvailableActions(currentSelectedMenu.moduleKey).map(a => a.code) : undefined)
    });
    setIsFormDirty(false);
    onShowToast?.('已还原为修改前的配置', 'info');
  };

  // 永久删除菜单
  const handleConfirmPermanentDelete = () => {
    if (!editForm) return;
    const targetId = editForm.id;
    const targetName = editForm.menuName;

    // 找到所有需要删除的菜单项（包含其子菜单）
    const toDeleteIds = new Set<string>([targetId]);
    menus.forEach(m => {
      if (m.parentId === targetId) {
        toDeleteIds.add(m.id);
      }
    });

    const nextMenus = menus.filter(m => !toDeleteIds.has(m.id));
    setMenus(nextMenus);
    setIsDeleteConfirmOpen(false);

    // 切换选中的菜单
    const remaining = nextMenus[0] || null;
    if (remaining) {
      setSelectedMenuId(remaining.id);
      setEditForm({ ...remaining });
    } else {
      setSelectedMenuId('');
      setEditForm(null);
    }
    setIsFormDirty(false);

    onShowToast?.(`菜单「${targetName}」及其关联数据已永久删除`, 'info');
  };

  // 上移/下移排序 (仅前台可见菜单 visible === true 可排序)
  const handleMoveSort = (menuId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const target = menus.find(m => m.id === menuId);
    if (!target || !target.visible) return;

    // 找出同层级且同为可见的兄弟菜单
    const visibleSiblings = menus
      .filter(m => m.parentId === target.parentId && m.visible)
      .sort((a, b) => a.sort - b.sort);

    const index = visibleSiblings.findIndex(m => m.id === menuId);
    if (direction === 'up' && index > 0) {
      const prevSibling = visibleSiblings[index - 1];
      const targetSort = target.sort;
      const prevSort = prevSibling.sort;

      setMenus(prev =>
        prev.map(m => {
          if (m.id === target.id) return { ...m, sort: prevSort };
          if (m.id === prevSibling.id) return { ...m, sort: targetSort };
          return m;
        })
      );
      onShowToast?.(`「${target.menuName}」排序已上移`, 'success');
    } else if (direction === 'down' && index < visibleSiblings.length - 1) {
      const nextSibling = visibleSiblings[index + 1];
      const targetSort = target.sort;
      const nextSort = nextSibling.sort;

      setMenus(prev =>
        prev.map(m => {
          if (m.id === target.id) return { ...m, sort: nextSort };
          if (m.id === nextSibling.id) return { ...m, sort: targetSort };
          return m;
        })
      );
      onShowToast?.(`「${target.menuName}」排序已下移`, 'success');
    }
  };

  // ==========================================
  // 拖拽排序核心逻辑（同级菜单拖拽排序）
  // ==========================================
  const handleDragStart = (menuId: string, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', menuId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingMenuId(menuId);
  };

  const handleDragOver = (targetId: string, targetParentId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingMenuId || draggingMenuId === targetId) return;

    const sourceItem = menus.find((m) => m.id === draggingMenuId);
    if (!sourceItem || sourceItem.parentId !== targetParentId) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? 'before' : 'after';

    setDragOverMenuId(targetId);
    setDropPosition(pos);
  };

  const handleDragLeave = (targetId: string, e: React.DragEvent) => {
    if (dragOverMenuId === targetId) {
      setDragOverMenuId(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (targetId: string, targetParentId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggingMenuId || draggingMenuId === targetId) {
      setDraggingMenuId(null);
      setDragOverMenuId(null);
      setDropPosition(null);
      return;
    }

    const sourceItem = menus.find((m) => m.id === draggingMenuId);
    const targetItem = menus.find((m) => m.id === targetId);
    if (!sourceItem || !targetItem) {
      setDraggingMenuId(null);
      setDragOverMenuId(null);
      setDropPosition(null);
      return;
    }

    if (sourceItem.parentId !== targetItem.parentId) {
      onShowToast?.('仅支持在同级菜单之间进行拖拽排序', 'warning');
      setDraggingMenuId(null);
      setDragOverMenuId(null);
      setDropPosition(null);
      return;
    }

    const parentId = sourceItem.parentId;
    const siblings = menus
      .filter((m) => m.parentId === parentId)
      .sort((a, b) => a.sort - b.sort);

    const remaining = siblings.filter((m) => m.id !== draggingMenuId);
    const targetIdx = remaining.findIndex((m) => m.id === targetId);
    const insertIdx = dropPosition === 'after' ? targetIdx + 1 : targetIdx;

    remaining.splice(insertIdx, 0, sourceItem);

    const sortMap = new Map(remaining.map((item, idx) => [item.id, idx + 1]));

    setMenus((prev) =>
      prev.map((m) => {
        if (sortMap.has(m.id)) {
          return { ...m, sort: sortMap.get(m.id)! };
        }
        return m;
      })
    );

    onShowToast?.(`已成功更新「${sourceItem.menuName}」同级排序`, 'success');
    setDraggingMenuId(null);
    setDragOverMenuId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggingMenuId(null);
    setDragOverMenuId(null);
    setDropPosition(null);
  };

  // 自由快速添加一级菜单
  const handleQuickAddPrimary = () => {
    const trimmedCode = `MENU_${Date.now().toString().slice(-6)}`;
    const newId = 'menu_' + Date.now();
    const primarySiblings = menus.filter((m) => m.parentId === '0');
    const newSort = primarySiblings.length + 1;

    const newMenuItem: SysMenuItem = {
      id: newId,
      parentId: '0',
      menuCode: trimmedCode,
      menuName: '新一级菜单',
      hasIcon: true,
      iconType: 'library',
      icon: 'Folder',
      routePath: `/menu/${trimmedCode.toLowerCase()}`,
      target: 'frame',
      sort: newSort,
      visible: true,
      globalVisible: true,
      boundPermCodes: [],
      isNewPlaceholder: true,
    };

    setMenus((prev) => [...prev, newMenuItem]);
    setSelectedMenuId(newId);
    setEditForm({ ...newMenuItem });
    setIsFormDirty(true);
    onShowToast?.('已添加新的一级菜单，请在右侧完善菜单名称与配置', 'success');
  };

  // 自由快速添加子菜单
  const handleQuickAddChild = (parentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const parent = menus.find((m) => m.id === parentId) || menus.find((m) => m.parentId === '0');
    if (!parent) {
      handleQuickAddPrimary();
      return;
    }

    const trimmedCode = `SUB_${Date.now().toString().slice(-6)}`;
    const newId = 'menu_' + Date.now();
    const siblings = menus.filter((m) => m.parentId === parent.id);
    const newSort = siblings.length + 1;

    const newMenuItem: SysMenuItem = {
      id: newId,
      parentId: parent.id,
      menuCode: trimmedCode,
      menuName: '新子菜单',
      hasIcon: true,
      iconType: 'library',
      icon: 'Activity',
      routePath: `${parent.routePath.replace(/\/$/, '')}/${trimmedCode.toLowerCase()}`,
      target: 'frame',
      sort: newSort,
      visible: true,
      globalVisible: true,
      boundPermCodes: [],
      isNewPlaceholder: true,
    };

    setMenus((prev) => [...prev, newMenuItem]);
    setSelectedMenuId(newId);
    setEditForm({ ...newMenuItem });
    setIsFormDirty(true);
    if (!expandedMenuIds.includes(parent.id)) {
      setExpandedMenuIds((prev) => [...prev, parent.id]);
    }
    onShowToast?.(`已在「${parent.menuName}」下添加子菜单，请在右侧配置`, 'success');
  };

  // 快速删除菜单项（触发确认弹窗）
  const handleDeleteMenuItem = (item: SysMenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMenuId(item.id);
    setEditForm({ ...item });
    setIsDeleteConfirmOpen(true);
  };
  const handleSaveAndPublish = () => {
    const hasUnsavedPlaceholder = menus.some(m => m.isNewPlaceholder);
    if (hasUnsavedPlaceholder) {
      onShowToast?.('检测到存在未保存的新建菜单占位，已自动统一固化并发布', 'info');
      setMenus(prev => prev.map(m => ({ ...m, isNewPlaceholder: false })));
    }
    onShowToast?.('菜单配置已成功保存并发布至前端网关与服务节点！', 'success');
  };

  // 上传本地图标文件处理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast?.('请上传图片格式文件 (PNG, JPG, SVG)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (editForm && reader.result) {
        setEditForm({
          ...editForm,
          iconUploadUrl: reader.result as string
        });
        setIsFormDirty(true);
        onShowToast?.('图标上传成功', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // 排序与分组构建：
  // 规则：所有不可见（visible === false）的菜单排在同类最下方
  const sortMenuItems = (items: SysMenuItem[]) => {
    const visibleItems = items.filter(m => m.visible).sort((a, b) => a.sort - b.sort);
    const hiddenItems = items.filter(m => !m.visible).sort((a, b) => a.sort - b.sort);
    return [...visibleItems, ...hiddenItems];
  };

  // 顶级一级菜单列表
  const rootMenus = useMemo(() => {
    let list = menus.filter(m => m.parentId === '0');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m => {
        const matchRoot = m.menuName.toLowerCase().includes(q) || m.menuCode.toLowerCase().includes(q);
        const hasMatchChild = menus.some(
          sub =>
            sub.parentId === m.id &&
            (sub.menuName.toLowerCase().includes(q) || sub.menuCode.toLowerCase().includes(q))
        );
        return matchRoot || hasMatchChild;
      });
    }
    return sortMenuItems(list);
  }, [menus, searchQuery]);

  // 二级子菜单列表
  const getSubMenus = (parentId: string) => {
    let list = menus.filter(m => m.parentId === parentId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        m => m.menuName.toLowerCase().includes(q) || m.menuCode.toLowerCase().includes(q)
      );
    }
    return sortMenuItems(list);
  };

  // 现有的一级菜单列表（用于二级菜单选择父级）
  const existingPrimaryMenus = useMemo(() => {
    return menus.filter(m => m.parentId === '0');
  }, [menus]);

  const handleOpenPreview = () => {
    const visible = sortMenuItems(menus.filter(m => m.visible !== false));
    const roots = visible.filter(m => m.parentId === '0');
    const first = roots[0];
    const kids = first ? visible.filter(m => m.parentId === first.id) : [];
    setPreviewActiveId(kids[0]?.id || first?.id || '');
    setPreviewExpandedIds(first ? [first.id] : []);
    setIsPreviewOpen(true);
  };

  // 渲染菜单图标预览辅助组件
  const renderIconPreview = (item: SysMenuItem, className = 'w-4 h-4') => {
    if (!item.hasIcon) {
      return <span className="text-[10px] text-slate-300">无图标</span>;
    }
    if (item.iconType === 'upload' && item.iconUploadUrl) {
      return (
        <img
          src={item.iconUploadUrl}
          alt="icon"
          className={`${className} object-contain rounded`}
        />
      );
    }
    if (item.iconType === 'customClass' && item.iconCustomClass) {
      return (
        <span
          className={`${item.iconCustomClass} ${className} flex items-center justify-center text-xs text-blue-600`}
        />
      );
    }
    const IconComp = getMenuIconComponent(item.icon);
    return <IconComp className={className} />;
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col gap-6"
      id="menu_management_container"
    >
      {/* ---------------- 顶部标题栏（主标题，最右侧放置“恢复默认”、“保存并发布”按钮） ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
              <LayoutList className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {endpointName ? `${endpointName} · 菜单配置` : '默认菜单管理'}
                </h2>
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-[#1e376b] hover:bg-[#14264c] text-white flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                  title="打开当前端菜单实时预览"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  实时预览
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 最右侧：恢复默认、保存并发布按钮 */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* 恢复为默认系统模板 */}
          <button
            type="button"
            onClick={() => setIsResetDefaultModalOpen(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            title="将全部菜单重置恢复为系统初始发布模板"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>恢复默认</span>
          </button>

          {/* 保存并发布 */}
          <button
            type="button"
            onClick={handleSaveAndPublish}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:shadow-md"
            title="保存所有菜单修改并实时发布"
          >
            <Send className="w-3.5 h-3.5" />
            <span>保存并发布</span>
          </button>
        </div>
      </div>

      {/* ---------------- 左右层次化工作区 ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-1">
        {/* ===================== 左侧：菜单层级树组件 (5 列，独立卡片化面板，紧凑高层次) ===================== */}
        <div className="lg:col-span-5 bg-slate-50/75 rounded-xl border border-slate-200/90 p-4 flex flex-col gap-3 shadow-2xs h-full">
          {/* 树顶部：标题与快速添加操作 */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-800 tracking-tight">菜单层级导航树</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 font-bold">
                共 {menus.length} 项
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleQuickAddPrimary}
                className="px-2.5 py-1.5 text-xs font-bold bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs transition-all"
                title="自由快速添加新的一级主菜单"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 一级菜单</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAddChild(selectedMenuId || rootMenus[0]?.id || '')}
                className="px-2.5 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#1e376b] border border-blue-200/80 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
                title="在当前选中的菜单下添加子菜单"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 子菜单</span>
              </button>
            </div>
          </div>

          {/* 搜索与向导 */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索菜单名称或编码..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenAddMenuModal}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer transition-colors border border-slate-200 shadow-2xs"
              title="打开弹窗添加向导"
            >
              <span>向导</span>
            </button>
          </div>

          {/* 快捷展开/折叠与拖拽提示 */}
          <div className="flex items-center justify-between px-0.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span>同级支持拖拽排序</span>
              <span className="text-[10px] text-slate-300">· 点击选中配置</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allParentIds = rootMenus.map(m => m.id);
                  setExpandedMenuIds(expandedMenuIds.length > 0 ? [] : allParentIds);
                }}
                className="text-slate-500 hover:text-[#1e376b] font-medium cursor-pointer"
              >
                {expandedMenuIds.length > 0 ? '全部折叠' : '全部展开'}
              </button>
            </div>
          </div>

          {/* 菜单树列表（自适应填充高度，超出平滑滚动） */}
          <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto pr-1">
            {rootMenus.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2 bg-white rounded-xl border border-dashed border-slate-200">
                <Search className="w-6 h-6 text-slate-300" />
                <span>未找到匹配的菜单项</span>
              </div>
            ) : (
              rootMenus.map(root => {
                const isSelected = selectedMenuId === root.id;
                const isExpanded = expandedMenuIds.includes(root.id);
                const subItems = getSubMenus(root.id);
                const hasSubs = subItems.length > 0;

                // 判断在同级且可见菜单中的排序位置
                const visibleSiblings = rootMenus.filter(m => m.visible);
                const groupIdx = visibleSiblings.findIndex(m => m.id === root.id);
                const isFirstInVisibleGroup = groupIdx === 0;
                const isLastInVisibleGroup = groupIdx === visibleSiblings.length - 1;

                const isDraggingCurrent = draggingMenuId === root.id;
                const isOverCurrent = dragOverMenuId === root.id;

                return (
                  <div key={root.id} className="flex flex-col gap-1">
                    {/* 拖拽放置指示线 (Before) */}
                    {isOverCurrent && dropPosition === 'before' && (
                      <div className="h-1 bg-[#1e376b] rounded-full my-0.5 shadow-xs transition-all" />
                    )}

                    {/* 一级菜单项 */}
                    <div
                      draggable={root.visible}
                      onDragStart={e => handleDragStart(root.id, e)}
                      onDragOver={e => handleDragOver(root.id, root.parentId, e)}
                      onDragLeave={e => handleDragLeave(root.id, e)}
                      onDrop={e => handleDrop(root.id, root.parentId, e)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleSelectMenu(root)}
                      className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                        isDraggingCurrent
                          ? 'opacity-40 border-[#1e376b] border-dashed ring-2 ring-[#1e376b]/20 bg-blue-50/50'
                          : isSelected
                          ? 'bg-blue-50/90 border-blue-300 shadow-xs ring-2 ring-blue-400/20'
                          : root.isNewPlaceholder
                          ? 'bg-amber-50/80 border-amber-300 border-dashed'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                      }`}
                      id={`menu_tree_node_${root.id}`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {/* 拖拽把手 */}
                        <div
                          className={`p-0.5 rounded text-slate-300 group-hover:text-slate-500 hover:text-[#1e376b] shrink-0 transition-colors ${
                            root.visible ? 'cursor-grab active:cursor-grabbing' : 'opacity-20 cursor-not-allowed'
                          }`}
                          title={root.visible ? '拖拽调整同级排序' : '不可见菜单不可拖拽'}
                          onClick={e => e.stopPropagation()}
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>

                        {/* 展开/折叠箭头 */}
                        {hasSubs ? (
                          <button
                            type="button"
                            onClick={e => toggleExpand(root.id, e)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4 text-center text-slate-300 font-mono text-[10px]">●</span>
                        )}

                        {/* 图标（前台不可见时置灰） */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            !root.visible
                              ? 'bg-slate-100 text-slate-300 opacity-50 grayscale'
                              : isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                          }`}
                        >
                          {renderIconPreview(root, 'w-3.5 h-3.5')}
                        </div>

                        {/* 菜单名称（只保留名称，不可见时文字加横删除线） */}
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className={`text-xs truncate max-w-[130px] sm:max-w-[150px] ${
                              !root.visible
                                ? 'line-through text-slate-400 font-normal'
                                : isSelected
                                ? 'text-blue-950 font-black'
                                : 'text-slate-800 font-bold'
                            }`}
                          >
                            {root.menuName}
                          </span>
                          {root.isNewPlaceholder && (
                            <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1 py-0.2 rounded font-bold shrink-0">
                              新添加
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 右侧快捷操作：添加子级、删除、小眼睛、上下微调 */}
                      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        {/* 快捷添加子菜单 */}
                        <button
                          type="button"
                          onClick={e => handleQuickAddChild(root.id, e)}
                          className="p-1 text-slate-400 hover:text-[#1e376b] hover:bg-blue-50 rounded transition-colors"
                          title="为此主菜单添加二级子菜单"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        {/* 小眼睛图标（前台显隐开关） */}
                        <button
                          type="button"
                          onClick={e => handleToggleVisible(root.id, e)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            root.visible
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={root.visible ? '当前在前台显示，点击设为隐藏' : '当前在前台隐藏，点击设为显示'}
                        >
                          {root.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* 快捷删除按钮 */}
                        <button
                          type="button"
                          onClick={e => handleDeleteMenuItem(root, e)}
                          className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="删除此菜单"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* 上下微调按钮 */}
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={!root.visible || isFirstInVisibleGroup}
                            onClick={e => handleMoveSort(root.id, 'up', e)}
                            className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                              !root.visible || isFirstInVisibleGroup
                                ? 'opacity-20 cursor-not-allowed text-slate-300'
                                : 'cursor-pointer'
                            }`}
                            title={!root.visible ? '不可见菜单不可排序' : '上移排序'}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={!root.visible || isLastInVisibleGroup}
                            onClick={e => handleMoveSort(root.id, 'down', e)}
                            className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                              !root.visible || isLastInVisibleGroup
                                ? 'opacity-20 cursor-not-allowed text-slate-300'
                                : 'cursor-pointer'
                            }`}
                            title={!root.visible ? '不可见菜单不可排序' : '下移排序'}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 拖拽放置指示线 (After) */}
                    {isOverCurrent && dropPosition === 'after' && (
                      <div className="h-1 bg-[#1e376b] rounded-full my-0.5 shadow-xs transition-all" />
                    )}

                    {/* 二级子菜单列表 */}
                    {hasSubs && isExpanded && (
                      <div className="pl-5 flex flex-col gap-1 border-l-2 border-slate-200/80 ml-3.5 py-0.5">
                        {subItems.map(sub => {
                          const isSubSelected = selectedMenuId === sub.id;

                          const visibleSubs = subItems.filter(m => m.visible);
                          const subGroupIdx = visibleSubs.findIndex(m => m.id === sub.id);
                          const isFirstSub = subGroupIdx === 0;
                          const isLastSub = subGroupIdx === visibleSubs.length - 1;

                          const isDraggingSub = draggingMenuId === sub.id;
                          const isOverSub = dragOverMenuId === sub.id;

                          return (
                            <div key={sub.id} className="flex flex-col gap-0.5">
                              {/* 子菜单放置指示线 (Before) */}
                              {isOverSub && dropPosition === 'before' && (
                                <div className="h-1 bg-[#1e376b] rounded-full my-0.5 shadow-xs transition-all" />
                              )}

                              <div
                                draggable={sub.visible}
                                onDragStart={e => handleDragStart(sub.id, e)}
                                onDragOver={e => handleDragOver(sub.id, sub.parentId, e)}
                                onDragLeave={e => handleDragLeave(sub.id, e)}
                                onDrop={e => handleDrop(sub.id, sub.parentId, e)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleSelectMenu(sub)}
                                className={`group p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                                  isDraggingSub
                                    ? 'opacity-40 border-[#1e376b] border-dashed ring-2 ring-[#1e376b]/20 bg-blue-50/50'
                                    : isSubSelected
                                    ? 'bg-blue-50/90 border-blue-300 shadow-xs ring-2 ring-blue-400/20'
                                    : sub.isNewPlaceholder
                                    ? 'bg-amber-50/80 border-amber-300 border-dashed'
                                    : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                                }`}
                                id={`menu_tree_node_${sub.id}`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  {/* 子菜单拖拽把手 */}
                                  <div
                                    className={`p-0.5 rounded text-slate-300 group-hover:text-slate-500 hover:text-[#1e376b] shrink-0 transition-colors ${
                                      sub.visible ? 'cursor-grab active:cursor-grabbing' : 'opacity-20 cursor-not-allowed'
                                    }`}
                                    title={sub.visible ? '拖拽调整同级子菜单排序' : '不可见菜单不可拖拽'}
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <GripVertical className="w-3 h-3" />
                                  </div>

                                  <div
                                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${
                                      !sub.visible
                                        ? 'bg-slate-100 text-slate-300 opacity-50 grayscale'
                                        : isSubSelected
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {renderIconPreview(sub, 'w-3 h-3')}
                                  </div>
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <span
                                      className={`text-xs truncate max-w-[120px] ${
                                        !sub.visible
                                          ? 'line-through text-slate-400 font-normal'
                                          : isSubSelected
                                          ? 'text-blue-950 font-black'
                                          : 'text-slate-700 font-bold'
                                      }`}
                                    >
                                      {sub.menuName}
                                    </span>
                                    {sub.isNewPlaceholder && (
                                      <span className="text-[9px] text-amber-700 bg-amber-100/80 px-1 rounded font-bold shrink-0">
                                        新添加
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={e => handleToggleVisible(sub.id, e)}
                                    className={`p-1 rounded transition-colors cursor-pointer ${
                                      sub.visible
                                        ? 'text-emerald-600 hover:bg-emerald-50'
                                        : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                                    }`}
                                    title={sub.visible ? '在前台显示' : '在前台隐藏'}
                                  >
                                    {sub.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={e => handleDeleteMenuItem(sub, e)}
                                    className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                    title="删除此子菜单"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>

                                  {/* 上下排序 (不可见时禁止上下移动) */}
                                  <div className="flex flex-col">
                                    <button
                                      type="button"
                                      disabled={!sub.visible || isFirstSub}
                                      onClick={e => handleMoveSort(sub.id, 'up', e)}
                                      className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                                        !sub.visible || isFirstSub
                                          ? 'opacity-20 cursor-not-allowed text-slate-300'
                                          : 'cursor-pointer'
                                      }`}
                                    >
                                      <ChevronUp className="w-2.5 h-2.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={!sub.visible || isLastSub}
                                      onClick={e => handleMoveSort(sub.id, 'down', e)}
                                      className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                                        !sub.visible || isLastSub
                                          ? 'opacity-20 cursor-not-allowed text-slate-300'
                                          : 'cursor-pointer'
                                      }`}
                                    >
                                      <ChevronDown className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* 子菜单放置指示线 (After) */}
                              {isOverSub && dropPosition === 'after' && (
                                <div className="h-1 bg-[#1e376b] rounded-full my-0.5 shadow-xs transition-all" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ===================== 右侧：编辑菜单面板 (7 列，独立卡片化面板，模块分层清晰) ===================== */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
          {editForm ? (
            <form
              onSubmit={handleSaveForm}
              className="flex flex-col gap-5"
            >
              {/* 表单顶部标题 */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shrink-0 shadow-2xs">
                    {renderIconPreview(editForm, 'w-4 h-4')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-black text-slate-900">
                        {editForm.menuName}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                        {editForm.parentId === '0' ? '一级主菜单' : '二级子菜单'}
                      </span>
                      {editForm.isModuleComponent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#1e376b] text-white">
                          已挂载模块
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      编码: {editForm.menuCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                    editForm.visible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {editForm.visible ? '前台可见' : '前台隐藏'}
                  </span>
                  {editForm.isNewPlaceholder && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      待保存新菜单
                    </span>
                  )}
                </div>
              </div>

              {/* 表单分层卡片列表 */}
              <div className="flex flex-col gap-4">
                {/* ---------- 卡片 1: 基础属性 ---------- */}
                <div className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-4 flex flex-col gap-3.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      01 基础属性
                    </span>
                    <span className="text-[10px] text-slate-400">名称与层级归属</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 菜单名称 */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>
                          菜单名称 <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal font-mono">
                          {editForm.menuName.length}/10
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={editForm.menuName}
                        onChange={e => {
                          setEditForm({ ...editForm, menuName: e.target.value });
                          setIsFormDirty(true);
                        }}
                        placeholder="请输入菜单名称"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium text-slate-900 transition-colors"
                      />
                    </div>

                    {/* 父级菜单 */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>
                          挂载父级 <span className="text-rose-500">*</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          根目录为一级
                        </span>
                      </label>
                      <select
                        value={editForm.parentId}
                        onChange={e => {
                          setEditForm({ ...editForm, parentId: e.target.value });
                          setIsFormDirty(true);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800 transition-colors"
                      >
                        <option value="0">根目录（作为一级主菜单）</option>
                        {existingPrimaryMenus
                          .filter(m => m.id !== editForm.id)
                          .map(parent => (
                            <option key={parent.id} value={parent.id}>
                              ├─ {parent.menuName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ---------- 卡片 2: 组件库绑定设置 ---------- */}
                <div id="component_binding_section" className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-4 flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-[#1e376b]" />
                        02 组件库绑定设置
                      </span>
                      {editForm.moduleKey ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          已绑定组件
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
                          未绑定 (纯分类目录/空链接)
                        </span>
                      )}
                    </div>

                    {/* 直接跳转组件库管理 */}
                    {onNavigateToComponents && (
                      <button
                        type="button"
                        onClick={onNavigateToComponents}
                        className="px-2.5 py-1 text-xs font-bold text-[#1e376b] hover:text-[#14264c] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                        title="直接跳转至组件库管理与绑定界面"
                      >
                        <Library className="w-3.5 h-3.5 text-[#1e376b]" />
                        <span>去组件库管理</span>
                        <ArrowRight className="w-3 h-3 text-[#1e376b]/70" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <select
                      value={editForm.moduleKey || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = availableComponents?.find(c => c.key === val);
                        if (matched) {
                          const defaultActions = getModuleAvailableActions(matched.key).map(a => a.code);
                          setEditForm({
                            ...editForm,
                            moduleKey: matched.key,
                            isModuleComponent: true,
                            kernel: matched.kernel,
                            routePath: editForm.routePath && editForm.routePath !== '/' ? editForm.routePath : (matched.routePath || editForm.routePath),
                            moduleActions: defaultActions,
                          });
                        } else {
                          setEditForm({
                            ...editForm,
                            moduleKey: undefined,
                            isModuleComponent: false,
                            kernel: undefined,
                            moduleActions: undefined,
                          });
                        }
                        setIsFormDirty(true);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1e376b] font-medium text-slate-800"
                    >
                      <option value="">-- 未关联具体组件 (纯分类目录) --</option>
                      {availableComponents && availableComponents.length > 0 ? (
                        availableComponents.map((c) => (
                          <option key={c.key} value={c.key}>
                            [{c.kernel}] {c.title} ({c.key})
                          </option>
                        ))
                      ) : (
                        <option value="ALERT_REALTIME">[业务核] 实时警情监控 (ALERT_REALTIME)</option>
                      )}
                    </select>

                    {editForm.moduleKey && (
                      <button
                        type="button"
                        onClick={() => {
                          const matched = availableComponents?.find(c => c.key === editForm.moduleKey);
                          if (matched) {
                            setEditForm({
                              ...editForm,
                              menuName: matched.title,
                              routePath: matched.routePath || editForm.routePath,
                              hasIcon: true,
                              iconType: 'library',
                              iconName: (matched.icon as any) || editForm.iconName,
                            });
                            setIsFormDirty(true);
                          }
                        }}
                        className="px-2.5 py-2 text-xs font-bold text-[#1e376b] bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg cursor-pointer transition-colors shrink-0 shadow-2xs"
                        title="将组件默认名称、路由与推荐图标代入当前表单"
                      >
                        一键同步组件配置
                      </button>
                    )}
                  </div>

                  {/* 选中组件的预览详情卡片 */}
                  {editForm.moduleKey && (() => {
                    const matched = availableComponents?.find(c => c.key === editForm.moduleKey);
                    return (
                      <div className="bg-white border border-blue-200/80 rounded-lg p-2.5 flex flex-col gap-2 text-xs shadow-2xs mt-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-[#1e376b]">{matched?.title || editForm.moduleKey}</span>
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-mono">
                                #{editForm.moduleKey}
                              </span>
                              <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-medium border border-blue-200">
                                {matched?.kernel || editForm.kernel || '能力组件'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {matched?.description || '已成功绑定此组件能力，端访问时将自动渲染对应的模块视图。'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditForm({
                                ...editForm,
                                moduleKey: undefined,
                                isModuleComponent: false,
                                kernel: undefined,
                                moduleActions: undefined,
                              });
                              setIsFormDirty(true);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer shrink-0 transition-colors"
                            title="解除组件关联"
                          >
                            <Unlink className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 该组件会展示的端 */}
                        <div className="pt-2 border-t border-slate-100/90 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <MonitorSmartphone className="w-3.5 h-3.5 text-[#1e376b] shrink-0" />
                            <span className="font-bold text-slate-700">展示的端:</span>
                            {matched?.displayedEndpoints && matched.displayedEndpoints.length > 0 ? (
                              <div className="flex items-center gap-1.5 flex-wrap ml-1">
                                {matched.displayedEndpoints.map((ep) => {
                                  const isCurrent = endpointName && (ep.name === endpointName || ep.id === endpointName);
                                  const EpIcon = getEndpointKindIcon(ep.kind);
                                  const style = getEndpointKindStyle(ep.kind);
                                  return (
                                    <span
                                      key={ep.id || ep.name}
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${style} ${
                                        isCurrent ? 'ring-1 ring-[#1e376b]/30 shadow-2xs font-black' : ''
                                      }`}
                                      title={`该组件将在「${ep.name}」展示`}
                                    >
                                      <EpIcon className="w-2.5 h-2.5 shrink-0" />
                                      <span>{ep.name}</span>
                                      {isCurrent && (
                                        <span className="text-[9px] bg-[#1e376b] text-white px-1 py-0.2 rounded font-medium">
                                          当前端
                                        </span>
                                      )}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-dashed border-slate-200">
                                当前端（{endpointName || '本端'}）正在关联中，保存后将在本端展示
                              </span>
                            )}
                          </div>

                          {matched?.displayedEndpoints && matched.displayedEndpoints.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              共在 {matched.displayedEndpoints.length} 个端展示
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 选中模块后的具体功能清单展示与二次勾选（增删改查等功能细化） */}
                  {editForm.moduleKey && (() => {
                    const availableActions = getModuleAvailableActions(editForm.moduleKey);
                    const selectedActionCodes = editForm.moduleActions ?? availableActions.map(a => a.code);
                    const selectedCount = selectedActionCodes.length;
                    const totalCount = availableActions.length;
                    const allSelected = selectedCount === totalCount;
                    const noneSelected = selectedCount === 0;

                    const toggleAction = (code: string) => {
                      const next = selectedActionCodes.includes(code)
                        ? selectedActionCodes.filter(c => c !== code)
                        : [...selectedActionCodes, code];
                      setEditForm({ ...editForm, moduleActions: next });
                      setIsFormDirty(true);
                    };

                    const handleSelectAll = () => {
                      setEditForm({ ...editForm, moduleActions: availableActions.map(a => a.code) });
                      setIsFormDirty(true);
                    };

                    const handleSelectNone = () => {
                      setEditForm({ ...editForm, moduleActions: [] });
                      setIsFormDirty(true);
                    };

                    const handleSelectCrud = () => {
                      const crudCodes = ['query', 'create', 'update', 'delete'].filter(c =>
                        availableActions.some(a => a.code === c)
                      );
                      setEditForm({ ...editForm, moduleActions: crudCodes });
                      setIsFormDirty(true);
                    };

                    const handleInvertSelect = () => {
                      const inverted = availableActions
                        .map(a => a.code)
                        .filter(code => !selectedActionCodes.includes(code));
                      setEditForm({ ...editForm, moduleActions: inverted });
                      setIsFormDirty(true);
                    };

                    return (
                      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col gap-3 shadow-2xs mt-1">
                        {/* 顶栏：标题、勾选计数、快捷批量操作 */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-[#1e376b]" />
                              该模块具体功能授权 (二次勾选)
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                                selectedCount > 0
                                  ? 'bg-blue-50 text-[#1e376b] border-blue-200'
                                  : 'bg-rose-50 text-rose-600 border-rose-200'
                              }`}
                            >
                              已勾选 {selectedCount} / {totalCount} 项
                            </span>
                          </div>

                          {/* 快捷批量按钮 */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              type="button"
                              onClick={handleSelectAll}
                              className={`px-2 py-1 text-[11px] font-bold rounded border transition-colors cursor-pointer ${
                                allSelected
                                  ? 'bg-blue-50 text-[#1e376b] border-blue-200'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                              title="全部开启"
                            >
                              全选
                            </button>
                            <button
                              type="button"
                              onClick={handleSelectCrud}
                              className="px-2 py-1 text-[11px] font-bold rounded border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                              title="仅勾选基础增删改查四项功能"
                            >
                              基础增删改查
                            </button>
                            <button
                              type="button"
                              onClick={handleInvertSelect}
                              className="px-2 py-1 text-[11px] font-medium rounded border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                              title="反向选择勾选状态"
                            >
                              反选
                            </button>
                            <button
                              type="button"
                              onClick={handleSelectNone}
                              className={`px-2 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                                noneSelected
                                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                                  : 'bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:bg-rose-50/50'
                              }`}
                              title="清空所有勾选项"
                            >
                              清空
                            </button>
                          </div>
                        </div>

                        {/* 具体功能项网格卡片 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {availableActions.map((action) => {
                            const isChecked = selectedActionCodes.includes(action.code);
                            const style = ACTION_CATEGORY_STYLES[action.category];

                            return (
                              <div
                                key={action.code}
                                onClick={() => toggleAction(action.code)}
                                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                                  isChecked
                                    ? `${style.activeBorder} shadow-2xs`
                                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300 opacity-60'
                                }`}
                              >
                                {/* 复选框 */}
                                <div
                                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                    isChecked
                                      ? 'bg-[#1e376b] border-[#1e376b] text-white'
                                      : 'bg-white border-slate-300'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>

                                {/* 内容区 */}
                                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span
                                      className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase font-mono ${style.pill}`}
                                    >
                                      {action.categoryLabel}
                                    </span>
                                    <span
                                      className={`text-xs font-bold leading-none ${
                                        isChecked ? 'text-slate-900' : 'text-slate-500'
                                      }`}
                                    >
                                      {action.name}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-0.5">
                                    {action.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 提示说明 */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          <span className="flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>支持二次勾选具体功能（增、删、改、查、导、审等）。未勾选的功能在端操作界面中将被隐藏或置灰禁用。</span>
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0">
                            {selectedCount === totalCount ? '全功能就绪' : selectedCount === 0 ? '功能全禁用' : '部分功能启用'}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ---------- 卡片 3: 图标呈现 ---------- */}
                <div className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-4 flex flex-col gap-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      03 图标呈现
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, hasIcon: true });
                          setIsFormDirty(true);
                        }}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          editForm.hasIcon
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        启用图标
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, hasIcon: false });
                          setIsFormDirty(true);
                        }}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          !editForm.hasIcon
                            ? 'bg-slate-600 text-white border-slate-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        无图标
                      </button>
                    </div>
                  </div>

                  {/* 如果选择“是”，展开三个功能页签：使用图标库 / 上传图标 / 使用样式表 */}
                  {editForm.hasIcon && (
                    <div className="flex flex-col gap-3 pt-2 border-t border-slate-200/80">
                      {/* 三个页签切换 */}
                      <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({ ...editForm, iconType: 'library' });
                            setIsFormDirty(true);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editForm.iconType === 'library'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5" />
                          <span>使用图标库</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({ ...editForm, iconType: 'upload' });
                            setIsFormDirty(true);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editForm.iconType === 'upload'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>上传图标</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({ ...editForm, iconType: 'customClass' });
                            setIsFormDirty(true);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editForm.iconType === 'customClass'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>使用样式表</span>
                        </button>
                      </div>

                      {/* 页签 1: 使用图标库 */}
                      {editForm.iconType === 'library' && (
                        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-500">从内置图标库中选择：</span>
                            <input
                              type="text"
                              value={iconSearchQuery}
                              onChange={e => setIconSearchQuery(e.target.value)}
                              placeholder="搜索图标..."
                              className="px-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 w-32"
                            />
                          </div>
                          <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-2 max-h-40 overflow-y-auto pr-1 pt-1">
                            {AVAILABLE_ICONS.filter(i =>
                              !iconSearchQuery ||
                              i.label.includes(iconSearchQuery) ||
                              i.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
                            ).map(item => {
                              const isIconActive = editForm.icon === item.name;
                              const IconComponent = item.icon;
                              return (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setEditForm({ ...editForm, icon: item.name });
                                    setIsFormDirty(true);
                                  }}
                                  title={item.label}
                                  className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                    isIconActive
                                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200 shadow-xs'
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 页签 2: 上传图标 */}
                      {editForm.iconType === 'upload' && (
                        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {editForm.iconUploadUrl ? (
                                <img
                                  src={editForm.iconUploadUrl}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-300" />
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition-colors"
                                >
                                  选择图片上传
                                </button>
                                {editForm.iconUploadUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditForm({ ...editForm, iconUploadUrl: '' });
                                      setIsFormDirty(true);
                                    }}
                                    className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                                  >
                                    移除
                                  </button>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                支持 PNG、JPG、SVG 格式，建议尺寸 32x32px
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 页签 3: 使用样式表功能 */}
                      {editForm.iconType === 'customClass' && (
                        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <label className="text-[11px] font-bold text-slate-600">
                            输入图标 Class 名称：
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editForm.iconCustomClass || ''}
                              onChange={e => {
                                setEditForm({ ...editForm, iconCustomClass: e.target.value });
                                setIsFormDirty(true);
                              }}
                              placeholder="例如：iconfont icon-warning-bell 或 fa fa-shield"
                              className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                            />
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              {editForm.iconCustomClass ? (
                                <span className={editForm.iconCustomClass} />
                              ) : (
                                <Code2 className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            适用于项目中已全局引入的 IconFont 或自定义 CSS 字体图标类
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ---------- 卡片 4: 打开方式 ---------- */}
                <div className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-4 flex flex-col gap-3.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      04 页面行为
                    </span>
                    <span className="text-[10px] text-slate-400">窗口打开方式</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">窗口打开方式</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, target: 'frame' });
                          setIsFormDirty(true);
                        }}
                        className={`py-2 px-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          editForm.target === 'frame'
                            ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>整个框架(_top)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, target: '_blank' });
                          setIsFormDirty(true);
                        }}
                        className={`py-2 px-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          editForm.target === '_blank'
                            ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>新窗口(_blank)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, target: '_self' });
                          setIsFormDirty(true);
                        }}
                        className={`py-2 px-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          editForm.target === '_self'
                            ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>本窗口(_self)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- 底部操作按钮区域（还原修改与永久删除居左对齐，保存居右） ---------------- */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
                {/* 左侧操作按钮组：还原修改 + 永久删除 */}
                <div className="flex items-center gap-2">
                  {/* 1. 还原修改（新建时不显示，修改已有菜单时显示） */}
                  {!editForm.isNewPlaceholder && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>还原修改</span>
                    </button>
                  )}

                  {/* 2. 永久删除 */}
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>永久删除</span>
                  </button>
                </div>

                {/* 右侧：保存菜单配置 */}
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>保存菜单配置</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 min-h-[360px]">
              <LayoutList className="w-8 h-8 text-slate-300" />
              <span>请在左侧选择或添加一个菜单进行编辑</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          浮框弹窗 1：点击“添加菜单”时弹出 (选择一级菜单还是二级菜单)
          ======================================================== */}
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">添加菜单</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddMenu} className="flex flex-col gap-4">
              {/* 选择添加层级 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">请选择菜单层级</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddMenuLevel('primary');
                      setAddMenuError('');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      addMenuLevel === 'primary'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>添加一级菜单</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddMenuLevel('secondary');
                      setAddMenuError('');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      addMenuLevel === 'secondary'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>添加二级菜单</span>
                  </button>
                </div>
              </div>

              {/* 如果选择二级菜单：通过下拉框单选已存在的一级菜单 */}
              {addMenuLevel === 'secondary' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    所属一级菜单 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addMenuParentId}
                    onChange={e => setAddMenuParentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    {existingPrimaryMenus.map(primary => (
                      <option key={primary.id} value={primary.id}>
                        {primary.menuName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 菜单名称 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    菜单名称 <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    最长不能超过 10 个汉字 ({addMenuName.length}/10)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={addMenuName}
                  onChange={e => {
                    setAddMenuName(e.target.value);
                    setAddMenuError('');
                  }}
                  placeholder={addMenuLevel === 'primary' ? '例如：智能研判大厅' : '例如：高危线索追溯'}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {addMenuError && (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  {addMenuError}
                </div>
              )}

              {/* 底部按钮：按钮叫“添加” */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMenuModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          浮框弹窗 2：永久删除二次确认
          ======================================================== */}
      {isDeleteConfirmOpen && editForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-black text-slate-900">
                  确认永久删除菜单「{editForm.menuName}」？
                </h4>
                <p className="text-xs text-rose-700 leading-relaxed bg-rose-50 p-2.5 rounded-lg border border-rose-200/80 font-medium">
                  该菜单目前前台已经在使用了，如果永久删除，可能会引起系统故障。
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  若删除一级菜单，其下挂载的所有二级子菜单也将一并被移除，此操作不可撤销。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认永久删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          浮框弹窗：恢复系统默认菜单模板确认框
          ======================================================== */}
      {isResetDefaultModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">恢复为系统默认菜单模板</h4>
                <p className="text-xs text-slate-500 mt-0.5">重置后将清除当前的自定义增改项</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
              确定要将当前菜单树重置恢复为「系统初始发布菜单模板」吗？此操作将重新加载预设的初始菜单结构，请确认是否继续。
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsResetDefaultModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmResetDefault}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                确认恢复默认
              </button>
            </div>
          </div>
        </div>
      )}

      {isPreviewOpen && (() => {
        const visibleMenus = sortMenuItems(menus.filter(m => m.visible !== false));
        const previewRoots = visibleMenus.filter(m => m.parentId === '0');
        const isWechat = endpointKind === 'wechat' || endpointKind === 'h5';
        const activeItem = visibleMenus.find(m => m.id === previewActiveId) || previewRoots[0] || null;
        const activeParent = activeItem
          ? (activeItem.parentId === '0' ? activeItem : visibleMenus.find(m => m.id === activeItem.parentId) || activeItem)
          : null;

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[min(82vh,760px)] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0 bg-slate-50/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#1e376b] text-white flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate">
                      实时预览 · {endpointName || '默认菜单'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {appName} · 前台可见 {visibleMenus.length} 项
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                  title="关闭预览"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex-1 min-h-0 bg-slate-100 p-4 flex items-center justify-center">
                {visibleMenus.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm">
                    当前没有前台可见菜单，请先在左侧树中打开显示。
                  </div>
                ) : isWechat ? (
                  <div className="w-[340px] h-[620px] bg-white rounded-[32px] border-4 border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                    <div className="px-5 pt-4 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-900 shrink-0">
                      <span>09:41</span>
                      <span className="w-16 h-3 bg-slate-900 rounded-full" />
                      <span>5G</span>
                    </div>
                    <div className="px-4 py-2.5 border-b border-slate-100 font-black text-sm text-slate-900 truncate">
                      {appName}
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-2 content-start">
                      {visibleMenus.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreviewActiveId(item.id)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                            previewActiveId === item.id
                              ? 'bg-blue-50 border-blue-200 text-[#1e376b]'
                              : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#1e376b]">
                            {renderIconPreview(item, 'w-4 h-4')}
                          </div>
                          <span className="text-[10px] font-bold truncate w-full text-center">{item.menuName}</span>
                        </button>
                      ))}
                    </div>
                    {activeItem && (
                      <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500 shrink-0">
                        当前：<span className="font-bold text-slate-800">{activeItem.menuName}</span>
                        {activeItem.routePath ? ` · ${activeItem.routePath}` : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full max-w-4xl bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
                    <div className="h-11 px-4 bg-[#1e376b] text-white flex items-center justify-between shrink-0">
                      <span className="text-xs font-black truncate">{appName}</span>
                      <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-bold">
                        {endpointName || '管理端'}
                      </span>
                    </div>
                    <div className="flex-1 min-h-0 flex">
                      <aside className="w-[220px] shrink-0 bg-[#14264c] text-white/90 overflow-y-auto py-2">
                        {previewRoots.map(root => {
                          const children = visibleMenus.filter(m => m.parentId === root.id);
                          const expanded = previewExpandedIds.includes(root.id) || children.some(c => c.id === previewActiveId);
                          const rootActive = previewActiveId === root.id;
                          return (
                            <div key={root.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (children.length > 0) {
                                    setPreviewExpandedIds(prev =>
                                      prev.includes(root.id) ? prev.filter(id => id !== root.id) : [...prev, root.id]
                                    );
                                    setPreviewActiveId(children[0].id);
                                  } else {
                                    setPreviewActiveId(root.id);
                                  }
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold cursor-pointer ${
                                  rootActive || children.some(c => c.id === previewActiveId)
                                    ? 'bg-white/12 text-white'
                                    : 'hover:bg-white/8 text-white/80'
                                }`}
                              >
                                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                                  {renderIconPreview(root, 'w-3.5 h-3.5')}
                                </span>
                                <span className="truncate flex-1">{root.menuName}</span>
                                {children.length > 0 && (
                                  expanded
                                    ? <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />
                                    : <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
                                )}
                              </button>
                              {expanded && children.map(child => (
                                <button
                                  key={child.id}
                                  type="button"
                                  onClick={() => setPreviewActiveId(child.id)}
                                  className={`w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-left text-[11px] font-medium cursor-pointer ${
                                    previewActiveId === child.id
                                      ? 'bg-blue-500/30 text-white'
                                      : 'text-white/70 hover:bg-white/8 hover:text-white'
                                  }`}
                                >
                                  <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                                    {renderIconPreview(child, 'w-3 h-3')}
                                  </span>
                                  <span className="truncate">{child.menuName}</span>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </aside>
                      <section className="flex-1 min-w-0 bg-[#F8FAFC] p-5 overflow-y-auto">
                        {activeItem ? (
                          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs min-h-[220px]">
                            <div className="flex items-center gap-2.5 mb-3">
                              <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1e376b] border border-blue-100 flex items-center justify-center">
                                {renderIconPreview(activeItem, 'w-4.5 h-4.5')}
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900">{activeItem.menuName}</div>
                                <div className="text-[11px] text-slate-400 font-mono">
                                  {activeItem.routePath || '未配置路由'}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                              {activeParent && activeParent.id !== activeItem.id && (
                                <span>上级：{activeParent.menuName} · </span>
                              )}
                              {activeItem.moduleKey ? `已关联组件 ${activeItem.moduleKey}` : '纯分类目录 / 未关联组件'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-slate-400">请选择左侧菜单查看内容</div>
                        )}
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
