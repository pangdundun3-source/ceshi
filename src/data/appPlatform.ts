import { ALL_UNIFIED_MODULE_KEYS } from './unifiedCallModules';

export type ProductType = '业务应用' | '基础服务';
export type DeployMode = 'SaaS' | '专有云' | '专网';
export type InstanceStatus = 'draft' | 'running' | 'stopped';
export type PrivateModuleStatus = 'deployed' | 'undeployed';
export type ComponentSource = 'platform' | 'private';
export type EndpointKind = 'admin_web' | 'user_web' | 'h5' | 'pad' | 'intranet' | 'wechat';
export type DomainStatus = 'bound' | 'pending' | 'idle';
export type SslStatus = 'normal' | 'none' | 'expiring';

export interface BusinessProduct {
  id: string;
  name: string;
  code: string;
  type: ProductType;
  version: string;
  description: string;
  iconBg: string;
  modules: string[];
  createdAt: string;
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
  { key: 'admin_web', name: '管理后台端', typeLabel: '网页端', description: '运营与后台配置入口' },
  { key: 'user_web', name: '用户端', typeLabel: '网页端', description: 'PC 浏览器业务工作台' },
  { key: 'h5', name: '移动端', typeLabel: 'H5', description: '手机浏览器 / App 内嵌页' },
  { key: 'pad', name: 'Pad端', typeLabel: 'Pad', description: '横屏指挥与值班席' },
  { key: 'intranet', name: '专网端', typeLabel: '专网', description: '内网地址，不走公网域名' },
  { key: 'wechat', name: '微信端', typeLabel: '小程序', description: '公众号 / 小程序入口' },
];

export const getEndpointKind = (key: EndpointKind) =>
  ENDPOINT_KINDS.find((item) => item.key === key);

export const INITIAL_PRODUCTS: BusinessProduct[] = [
  {
    id: 'prod-tb',
    name: '信息通报',
    code: 'TB',
    type: '业务应用',
    version: 'V1.0',
    description: '事件上报、审核、通报闭环。同一产品可按客户拆出全国版、北京市版、公安版实例。',
    iconBg: 'from-sky-700 via-blue-800 to-slate-900',
    modules: ALL_UNIFIED_MODULE_KEYS,
    createdAt: '2025-11-02',
  },
  {
    id: 'prod-zgy',
    name: '正管用',
    code: 'ZGY',
    type: '业务应用',
    version: 'V3.2',
    description: '网络生态综合治理。产品只定义能力，具体客户部署走实例。',
    iconBg: 'from-blue-700 via-indigo-800 to-slate-900',
    modules: ALL_UNIFIED_MODULE_KEYS,
    createdAt: '2025-01-10',
  },
  {
    id: 'prod-dt',
    name: '谛听预警',
    code: 'DT',
    type: '业务应用',
    version: 'V2.6',
    description: '全媒体态势感知预警。平台公共菜单 + 产品菜单在实例里组装。',
    iconBg: 'from-amber-600 via-orange-600 to-red-700',
    modules: ALL_UNIFIED_MODULE_KEYS.filter((key) => key !== 'unified_invite_open'),
    createdAt: '2025-02-15',
  },
  {
    id: 'prod-sb',
    name: '点点速报',
    code: 'SB',
    type: '业务应用',
    version: 'V1.8',
    description: '鉴谣速报与指令协同，支持公网 SaaS 与专网实例并存。',
    iconBg: 'from-emerald-700 via-teal-800 to-slate-900',
    modules: ALL_UNIFIED_MODULE_KEYS,
    createdAt: '2025-04-08',
  },
  {
    id: 'prod-msg',
    name: '消息中心',
    code: 'MSG',
    type: '基础服务',
    version: 'V4.0',
    description: '多渠道通知中枢，被各业务产品实例调用。',
    iconBg: 'from-slate-600 via-slate-800 to-slate-950',
    modules: ALL_UNIFIED_MODULE_KEYS.filter((key) =>
      ['unified_template_config', 'unified_template_dispatch', 'unified_org_structure'].includes(key)
    ),
    createdAt: '2025-03-20',
  },
];

export const INITIAL_INSTANCES: AppInstance[] = [
  {
    id: 'ins-tb-nation',
    productId: 'prod-tb',
    name: '全国信息通报系统',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '全国省级节点',
    isolation: '租户库隔离',
    createdAt: '2025-11-08',
  },
  {
    id: 'ins-tb-bj',
    productId: 'prod-tb',
    name: '北京市信息通报系统',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '北京市及下辖区县',
    isolation: '租户库隔离',
    createdAt: '2025-12-01',
  },
  {
    id: 'ins-tb-ga',
    productId: 'prod-tb',
    name: '公安信息通报系统',
    deployMode: '专网',
    status: 'draft',
    orgScope: '公安专网单位',
    isolation: '物理专网',
    createdAt: '2026-01-18',
  },
  {
    id: 'ins-zgy-nation',
    productId: 'prod-zgy',
    name: '正管用全国版',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '全网接入机构',
    isolation: '租户库隔离',
    createdAt: '2025-01-10',
  },
  {
    id: 'ins-dt-nation',
    productId: 'prod-dt',
    name: '谛听预警全国版',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '全网接入机构',
    isolation: '租户库隔离',
    createdAt: '2025-02-15',
  },
  {
    id: 'ins-sb-nation',
    productId: 'prod-sb',
    name: '点点速报全国版',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '全网接入机构',
    isolation: '租户库隔离',
    createdAt: '2025-04-08',
  },
  {
    id: 'ins-msg-core',
    productId: 'prod-msg',
    name: '消息中心主实例',
    deployMode: 'SaaS',
    status: 'running',
    orgScope: '平台级',
    isolation: '共享服务',
    createdAt: '2025-03-20',
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

const gaInstance = INITIAL_INSTANCES.find((item) => item.id === 'ins-tb-ga');
if (gaInstance) {
  gaInstance.privateModules = [
    ...(gaInstance.privateModules || []),
    {
      moduleKey: 'private-ga-audit',
      source: 'private',
      name: '专网审计插件',
      description: '专网环境操作留痕与审计导出',
      kernel: '组织核',
      version: 'V1.0',
      status: 'undeployed'
    }
  ];
}

const tbModules = ALL_UNIFIED_MODULE_KEYS;
const userModules = ALL_UNIFIED_MODULE_KEYS.filter((key) => key !== 'unified_role_permission');

export const INITIAL_ENDPOINTS: AccessEndpoint[] = [
  {
    id: 'ep-tb-nation-admin',
    instanceId: 'ins-tb-nation',
    name: '管理后台',
    kind: 'admin_web',
    homePage: '管理首页',
    menuProfile: '后台菜单',
    permissionProfile: '管理员',
    modules: tbModules,
    domainId: 'dom-tb-nation-admin',
  },
  {
    id: 'ep-tb-nation-user',
    instanceId: 'ins-tb-nation',
    name: '用户端',
    kind: 'user_web',
    homePage: '工作台',
    menuProfile: '上报 / 任务 / 通知',
    permissionProfile: '基层用户',
    modules: userModules,
    domainId: 'dom-tb-nation-user',
  },
  {
    id: 'ep-tb-bj-admin',
    instanceId: 'ins-tb-bj',
    name: '管理后台',
    kind: 'admin_web',
    homePage: '管理首页',
    menuProfile: '后台菜单A',
    permissionProfile: '管理员',
    modules: tbModules,
    domainId: 'dom-tb-bj-admin',
  },
  {
    id: 'ep-tb-bj-user',
    instanceId: 'ins-tb-bj',
    name: '基层用户端',
    kind: 'user_web',
    homePage: '工作台',
    menuProfile: '上报 / 任务 / 通知',
    permissionProfile: '基层用户',
    modules: userModules,
    domainId: 'dom-tb-bj-user',
  },
  {
    id: 'ep-tb-bj-pad',
    instanceId: 'ins-tb-bj',
    name: 'Pad值班席',
    kind: 'pad',
    homePage: '指挥大屏',
    menuProfile: '值班菜单',
    permissionProfile: '值班员',
    modules: userModules,
    domainId: 'dom-tb-bj-pad',
  },
  {
    id: 'ep-tb-ga-intranet',
    instanceId: 'ins-tb-ga',
    name: '专网端',
    kind: 'intranet',
    homePage: '专网工作台',
    menuProfile: '专网菜单',
    permissionProfile: '专网用户',
    modules: tbModules,
    domainId: 'dom-tb-ga-intranet',
  },
  {
    id: 'ep-zgy-admin',
    instanceId: 'ins-zgy-nation',
    name: 'MT 管理端',
    kind: 'admin_web',
    homePage: '管理首页',
    menuProfile: '管理菜单',
    permissionProfile: '管理员',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-zgy-admin',
  },
  {
    id: 'ep-zgy-user',
    instanceId: 'ins-zgy-nation',
    name: 'V8 用户端',
    kind: 'user_web',
    homePage: '治理工作台',
    menuProfile: '用户菜单',
    permissionProfile: '业务用户',
    modules: ALL_UNIFIED_MODULE_KEYS,
    domainId: 'dom-zgy-user',
  },
  {
    id: 'ep-dt-user',
    instanceId: 'ins-dt-nation',
    name: '预警工作台',
    kind: 'user_web',
    homePage: '态势首页',
    menuProfile: '预警菜单',
    permissionProfile: '研判员',
    modules: ALL_UNIFIED_MODULE_KEYS.filter((key) => key !== 'unified_invite_open'),
    domainId: 'dom-dt-user',
  },
  {
    id: 'ep-dt-admin',
    instanceId: 'ins-dt-nation',
    name: '预警管理端',
    kind: 'admin_web',
    homePage: '管理首页',
    menuProfile: '管理菜单',
    permissionProfile: '管理员',
    modules: ALL_UNIFIED_MODULE_KEYS.filter((key) => key !== 'unified_invite_open'),
    domainId: 'dom-dt-admin',
  },
];

export const INITIAL_DOMAINS: DomainRecord[] = [
  { id: 'dom-tb-bj-admin', host: 'admin.bj.tb.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tb-bj-admin', instanceId: 'ins-tb-bj' },
  { id: 'dom-tb-bj-user', host: 'user.bj.tb.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tb-bj-user', instanceId: 'ins-tb-bj' },
  { id: 'dom-tb-bj-pad', host: 'pad.bj.tb.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tb-bj-pad', instanceId: 'ins-tb-bj' },
  { id: 'dom-tb-ga-intranet', host: '10.10.10.20', kind: 'intranet', ssl: 'none', status: 'bound', endpointId: 'ep-tb-ga-intranet', instanceId: 'ins-tb-ga' },
  { id: 'dom-tb-nation-admin', host: 'admin.tb.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tb-nation-admin', instanceId: 'ins-tb-nation' },
  { id: 'dom-tb-nation-user', host: 'user.tb.com', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-tb-nation-user', instanceId: 'ins-tb-nation' },
  { id: 'dom-zgy-user', host: 'wxb.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-zgy-user', instanceId: 'ins-zgy-nation' },
  { id: 'dom-zgy-admin', host: 'wxb.cn/admin', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-zgy-admin', instanceId: 'ins-zgy-nation' },
  { id: 'dom-dt-user', host: 'yuing.cn', kind: 'sub', ssl: 'normal', status: 'bound', endpointId: 'ep-dt-user', instanceId: 'ins-dt-nation' },
  { id: 'dom-dt-admin', host: 'yuing.cn/admin', kind: 'sub', ssl: 'expiring', status: 'bound', endpointId: 'ep-dt-admin', instanceId: 'ins-dt-nation' },
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
