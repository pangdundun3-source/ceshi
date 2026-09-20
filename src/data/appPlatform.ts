import { ALL_UNIFIED_MODULE_KEYS } from './unifiedCallModules';
import { SysMenuItem } from '../components/MenuManage';

export type ProductType = '业务应用' | '基础服务';
export type DeployMode = 'SaaS' | '专有云' | '专网';
export type InstanceStatus = 'draft' | 'running' | 'stopped';
export type PrivateModuleStatus = 'deployed' | 'undeployed';
export type ComponentSource = 'platform' | 'private';
export type EndpointKind = 'admin_web' | 'user_web' | 'h5' | 'pad' | 'intranet' | 'wechat';
export type DomainStatus = 'bound' | 'pending' | 'idle';
export type SslStatus = 'normal' | 'none' | 'expiring';

export interface ThemeColorOption {
  key: string;
  name: string;
  hex: string;
  bgGradient: string;
  lightBg: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
}

export const THEME_COLOR_PRESETS: ThemeColorOption[] = [
  {
    key: 'navy',
    name: '经典深蓝',
    hex: '#1e376b',
    bgGradient: 'from-[#1e376b] via-blue-900 to-slate-900',
    lightBg: 'bg-blue-50',
    badgeBg: 'bg-[#1e376b]',
    textColor: 'text-[#1e376b]',
    borderColor: 'border-[#1e376b]',
  },
  {
    key: 'ocean',
    name: '海天蔚蓝',
    hex: '#0284c7',
    bgGradient: 'from-sky-700 via-blue-800 to-slate-900',
    lightBg: 'bg-sky-50',
    badgeBg: 'bg-sky-600',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-500',
  },
  {
    key: 'emerald',
    name: '极光翡翠',
    hex: '#059669',
    bgGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    lightBg: 'bg-emerald-50',
    badgeBg: 'bg-emerald-600',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-500',
  },
  {
    key: 'amber',
    name: '赤金琥珀',
    hex: '#d97706',
    bgGradient: 'from-amber-600 via-orange-600 to-red-700',
    lightBg: 'bg-amber-50',
    badgeBg: 'bg-amber-600',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-500',
  },
  {
    key: 'purple',
    name: '数智紫罗兰',
    hex: '#7c3aed',
    bgGradient: 'from-purple-700 via-indigo-800 to-slate-900',
    lightBg: 'bg-purple-50',
    badgeBg: 'bg-purple-600',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-500',
  },
  {
    key: 'rose',
    name: '警务赤霞',
    hex: '#dc2626',
    bgGradient: 'from-rose-700 via-red-800 to-slate-900',
    lightBg: 'bg-rose-50',
    badgeBg: 'bg-rose-600',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-500',
  },
];

export const PRESET_AVATARS = [
  { id: 'flame', name: '特情火苗', icon: 'Flame', label: '特情预警' },
  { id: 'zap', name: '闪电速豹', icon: 'Zap', label: '敏捷处置' },
  { id: 'message', name: '智评对话', icon: 'MessageSquare', label: '舆情态势' },
  { id: 'shield', name: '安全护盾', icon: 'Shield', label: '安消防控' },
  { id: 'radar', name: '雷达监测', icon: 'Radio', label: '全域感知' },
  { id: 'cpu', name: '智能大脑', icon: 'Cpu', label: '数智枢纽' },
  { id: 'bell', name: '通知广播', icon: 'Bell', label: '指令通报' },
  { id: 'globe', name: '全球视野', icon: 'Globe', label: '互联互通' },
  { id: 'layers', name: '组件底座', icon: 'Layers', label: '平台架构' },
];

export interface BusinessProduct {
  id: string;
  name: string; // 产品名称
  code: string; // 产品编码
  type: ProductType;
  version: string;
  description: string; // 产品描述
  themeColor?: string; // 产品主题色 (Hex / Key)
  themeColorName?: string; // 主题色名称
  avatar?: string; // 产品头像 (图标名 / 图片 URL)
  avatarType?: 'icon' | 'image' | 'text';
  iconBg: string;
  modules: string[];
  createdAt: string; // 创建日期
  status?: 'enabled' | 'disabled';
  publishStatus?: 'published' | 'unpublished';
  publishedVersion?: string;
  lastPublishedAt?: string;
}

export interface PrivateModuleDeploy {
  moduleKey: string;
  status: PrivateModuleStatus;
  version: string;
  source?: ComponentSource;
  name?: string;
  description?: string;
  kernel?: string;
}

export interface AppInstance {
  id: string;
  productId: string;
  name: string;
  deployMode: DeployMode;
  status: InstanceStatus;
  orgScope: string;
  isolation: string;
  createdAt: string;
  publishStatus?: 'published' | 'unpublished';
  publishedVersion?: string;
  lastPublishedAt?: string;
  privateModules?: PrivateModuleDeploy[];
}

export const buildPrivateModules = (
  moduleKeys: string[],
  version: string,
  undeployedKeys: string[] = []
): PrivateModuleDeploy[] =>
  moduleKeys.map((moduleKey) => ({
    moduleKey,
    version,
    source: 'platform' as const,
    status: undeployedKeys.includes(moduleKey) ? 'undeployed' : 'deployed'
  }));

export const deployedModuleKeys = (instance: AppInstance, productModules: string[]) => {
  if (!instance.privateModules?.length) return productModules;
  return instance.privateModules
    .filter((item) => item.status === 'deployed')
    .map((item) => item.moduleKey);
};

export interface AccessEndpoint {
  id: string;
  instanceId: string;
  name: string;
  kind: EndpointKind;
  homePage: string;
  menuProfile: string;
  permissionProfile: string;
  modules: string[];
  domainId?: string;
  customMenus?: SysMenuItem[];
}

export interface DomainRecord {
  id: string;
  host: string;
  kind: 'sub' | 'intranet';
  ssl: SslStatus;
  status: DomainStatus;
  endpointId?: string;
  instanceId?: string;
}

export const ENDPOINT_KINDS: Array<{
  key: EndpointKind;
  name: string;
  typeLabel: string;
  description: string;
}> = [
  { key: 'admin_web', name: '管理端', typeLabel: '管理后台', description: '管理控制台与运营配置入口' },
  { key: 'user_web', name: '用户端PC', typeLabel: 'PC桌面端', description: 'PC 浏览器业务工作台' },
  { key: 'wechat', name: '微信端', typeLabel: '微信端', description: '微信服务号 / 小程序移动门户' },
  { key: 'h5', name: '移动端H5', typeLabel: 'H5', description: '通用手机浏览器 / App 内嵌页' },
  { key: 'pad', name: 'Pad端', typeLabel: 'Pad', description: '横屏指挥与值班席' },
  { key: 'intranet', name: '专网端', typeLabel: '专网', description: '内网专用地址，隔离运行' },
];

export const getEndpointKind = (key: EndpointKind) =>
  ENDPOINT_KINDS.find((item) => item.key === key);

export const INITIAL_PRODUCTS: BusinessProduct[] = [
  {
    id: 'prod-tq',
    name: '特情',
    code: 'TQ',
    type: '业务应用',
    version: 'V2.0',
    description: '特殊舆情与突发事件监控、预警及紧急响应联动闭环。支持多级指挥协同。',
    themeColor: '#d97706',
    themeColorName: '赤金琥珀',
    avatar: 'Flame',
    iconBg: 'from-amber-600 via-orange-600 to-red-700',
    modules: ALL_UNIFIED_MODULE_KEYS,
    createdAt: '2025-11-02',
    status: 'enabled',
    publishStatus: 'published',
    publishedVersion: 'V2.0.0-Release',
    lastPublishedAt: '2025-11-08 10:30',
  },
  {
    id: 'prod-ddsb',
    name: '点点速豹',
    code: 'DDSB',
    type: '业务应用',
    version: 'V1.8',
    description: '鉴谣速报与快速处置协同系统，支持全渠道线索汇聚与敏捷流转。',
    themeColor: '#059669',
    themeColorName: '极光翡翠',
    avatar: 'Zap',
    iconBg: 'from-emerald-700 via-teal-800 to-slate-900',
    modules: ALL_UNIFIED_MODULE_KEYS,
    createdAt: '2025-04-08',
    status: 'disabled',
    publishStatus: 'unpublished',
  },
  {
    id: 'prod-zlsp',
    name: '知了速评',
    code: 'ZLSP',
    type: '业务应用',
    version: 'V3.2',
    description: '全网态势感知与智能网评引导体系，多端协同分析与快速研判。',
    themeColor: '#0284c7',
    themeColorName: '海天蔚蓝',
    avatar: 'MessageSquare',
    iconBg: 'from-sky-700 via-blue-800 to-slate-900',
    modules: ALL_UNIFIED_MODULE_KEYS,
    createdAt: '2025-01-10',
    status: 'enabled',
    publishStatus: 'published',
    publishedVersion: 'V3.2.0-Release',
    lastPublishedAt: '2025-01-10 16:20',
  },
];

export const INITIAL_INSTANCES: AppInstance[] = [
  {
    id: 'ins-tq-nation',
    productId: 'prod-tq',
    name: '特情全国指挥中心',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '全国省级节点',
    isolation: '租户库隔离',
    createdAt: '2025-11-08',
    publishStatus: 'published',
    publishedVersion: 'V2.0.0-Release',
    lastPublishedAt: '2025-11-08 10:30',
  },
  {
    id: 'ins-tq-intranet',
    productId: 'prod-tq',
    name: '特情应急专网系统',
    deployMode: '专网',
    status: 'running',
    orgScope: '应急专网单位',
    isolation: '物理专网',
    createdAt: '2026-01-18',
    publishStatus: 'published',
    publishedVersion: 'V2.0.0-Intranet',
    lastPublishedAt: '2026-01-18 14:00',
  },
  {
    id: 'ins-ddsb-nation',
    productId: 'prod-ddsb',
    name: '点点速豹全国运营版',
    deployMode: 'SaaS',
    status: 'draft',
    orgScope: '全网接入机构',
    isolation: '租户库隔离',
    createdAt: '2025-04-08',
    publishStatus: 'unpublished',
  },
  {
    id: 'ins-ddsb-cloud',
    productId: 'prod-ddsb',
    name: '点点速豹政企专有云版',
    deployMode: '专有云',
    status: 'draft',
    orgScope: '专有云客户节点',
    isolation: '私有化隔离',
    createdAt: '2025-06-12',
    publishStatus: 'unpublished',
  },
  {
    id: 'ins-zlsp-nation',
    productId: 'prod-zlsp',
    name: '知了速评全国分析平台',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '全网接入机构',
    isolation: '租户库隔离',
    createdAt: '2025-01-10',
    publishStatus: 'published',
    publishedVersion: 'V3.2.0-Release',
    lastPublishedAt: '2025-01-10 16:20',
  },
  {
    id: 'ins-zlsp-demo',
    productId: 'prod-zlsp',
    name: '知了速评示范区实例',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '华东示范试点区',
    isolation: '租户库隔离',
    createdAt: '2025-03-15',
    publishStatus: 'published',
    publishedVersion: 'V3.2.0-Demo',
    lastPublishedAt: '2025-03-15 09:00',
  },
];

const PRIVATE_UNDEPLOYED_BY_MODE: Record<DeployMode, string[]> = {
  SaaS: [],
  专有云: ['unified_invite_open'],
  专网: ['unified_invite_open', 'unified_group_manage', 'unified_message_notice'],
};

INITIAL_INSTANCES.forEach((instance) => {
  if (instance.privateModules?.length) return;
  const product = INITIAL_PRODUCTS.find((item) => item.id === instance.productId);
  if (!product) return;
  instance.privateModules = buildPrivateModules(
    product.modules,
    product.version,
    PRIVATE_UNDEPLOYED_BY_MODE[instance.deployMode]
  );
});

const tqIntranetInstance = INITIAL_INSTANCES.find((item) => item.id === 'ins-tq-intranet');
if (tqIntranetInstance) {
  tqIntranetInstance.privateModules = [
    ...(tqIntranetInstance.privateModules || []),
    {
      moduleKey: 'private-tq-audit',
      source: 'private',
      name: '专网审计插件',
      description: '专网环境操作留痕与审计导出',
      kernel: '组织核',
      version: 'V1.0',
      status: 'undeployed'
    }
  ];
}

export const INITIAL_ENDPOINTS: AccessEndpoint[] = [
  {
    id: 'ep-tq-nation-admin',
    instanceId: 'ins-tq-nation',
    name: '管理端',
    kind: 'admin_web',
    homePage: '管理首页',
    menuProfile: '后台菜单',
    permissionProfile: '管理员',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-tq-nation-admin',
  },
  {
    id: 'ep-tq-nation-user',
    instanceId: 'ins-tq-nation',
    name: '用户端PC',
    kind: 'user_web',
    homePage: '工作台',
    menuProfile: '特情研判 / 态势看板 / 通知',
    permissionProfile: '业务用户',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-tq-nation-user',
  },
  {
    id: 'ep-tq-nation-wechat',
    instanceId: 'ins-tq-nation',
    name: '微信端',
    kind: 'wechat',
    homePage: '微门户工作台',
    menuProfile: '移动研判 / 待办流转 / 公告',
    permissionProfile: '移动用户',
    modules: [
      'submenu_unified_template_report',
      'submenu_unified_instruction_flow',
      'submenu_unified_message_notice',
      'submenu_unified_personnel_manage'
    ],
    domainId: 'dom-tq-nation-wechat',
  },
  {
    id: 'ep-ddsb-admin',
    instanceId: 'ins-ddsb-nation',
    name: '管理端',
    kind: 'admin_web',
    homePage: '速报管理台',
    menuProfile: '管理后台',
    permissionProfile: '管理员',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-ddsb-admin',
  },
  {
    id: 'ep-ddsb-user',
    instanceId: 'ins-ddsb-nation',
    name: '用户端PC',
    kind: 'user_web',
    homePage: '研判主页',
    menuProfile: '鉴谣研判 / 线索流转',
    permissionProfile: '业务用户',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-ddsb-user',
  },
  {
    id: 'ep-ddsb-wechat',
    instanceId: 'ins-ddsb-nation',
    name: '微信端',
    kind: 'wechat',
    homePage: '移动速报',
    menuProfile: '线索速报 / 处置审批',
    permissionProfile: '业务用户',
    modules: [
      'submenu_unified_template_report',
      'submenu_unified_instruction_flow',
      'submenu_unified_message_notice'
    ],
    domainId: 'dom-ddsb-wechat',
  },
  {
    id: 'ep-zlsp-admin',
    instanceId: 'ins-zlsp-nation',
    name: '管理端',
    kind: 'admin_web',
    homePage: '管理首页',
    menuProfile: '管理菜单',
    permissionProfile: '管理员',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-zlsp-admin',
  },
  {
    id: 'ep-zlsp-user',
    instanceId: 'ins-zlsp-nation',
    name: '用户端PC',
    kind: 'user_web',
    homePage: '评价大屏',
    menuProfile: '网评分析 / 舆情追踪',
    permissionProfile: '分析师',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-zlsp-user',
  },
  {
    id: 'ep-zlsp-wechat',
    instanceId: 'ins-zlsp-nation',
    name: '微信端',
    kind: 'wechat',
    homePage: '速评小程序',
    menuProfile: '舆情简报 / 快速响应',
    permissionProfile: '移动分析师',
    modules: [
      'submenu_unified_template_report',
      'submenu_unified_message_notice'
    ],
    domainId: 'dom-zlsp-wechat',
  },
];

export const INITIAL_DOMAINS: DomainRecord[] = [
  { id: 'dom-tq-nation-admin', host: 'admin.teqing.gov.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tq-nation-admin', instanceId: 'ins-tq-nation' },
  { id: 'dom-tq-nation-user', host: 'work.teqing.gov.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tq-nation-user', instanceId: 'ins-tq-nation' },
  { id: 'dom-tq-nation-wechat', host: 'wx.teqing.gov.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tq-nation-wechat', instanceId: 'ins-tq-nation' },
  { id: 'dom-ddsb-admin', host: 'admin.ddsb.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-ddsb-admin', instanceId: 'ins-ddsb-nation' },
  { id: 'dom-ddsb-user', host: 'work.ddsb.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-ddsb-user', instanceId: 'ins-ddsb-nation' },
  { id: 'dom-ddsb-wechat', host: 'wx.ddsb.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-ddsb-wechat', instanceId: 'ins-ddsb-nation' },
  { id: 'dom-zlsp-admin', host: 'admin.zlsp.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-zlsp-admin', instanceId: 'ins-zlsp-nation' },
  { id: 'dom-zlsp-user', host: 'app.zlsp.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-zlsp-user', instanceId: 'ins-zlsp-nation' },
  { id: 'dom-zlsp-wechat', host: 'wx.zlsp.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-zlsp-wechat', instanceId: 'ins-zlsp-nation' },
];

export const statusLabel: Record<InstanceStatus, string> = {
  draft: '未发布',
  running: '运行中',
  stopped: '已停用',
};

export const statusClass: Record<InstanceStatus, string> = {
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  running: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  stopped: 'bg-slate-100 text-slate-500 border-slate-200',
};
