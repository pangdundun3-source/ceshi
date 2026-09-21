/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Left sidebar navigation items
export enum MenuItem {
  // 1. 应用综合看板
  AppDashboard = 'app_dashboard',
  BusinessDashboard = 'app_dashboard',

  // 2. 应用管理 -> 二级菜单
  AppList = 'product_manage',
  ProductManage = 'product_manage',
  OrgManage = 'org_manage',

  // 2.5 V8用户体系管理 -> 二级菜单：V8用户数据库、微信用户数据库
  V8UserDatabase = 'v8_user_database',
  WechatUserDatabase = 'wechat_user_database',

  // 3. 外部用户体系管理 -> 二级菜单
  ExtUserAppConfig = 'ext_user_app_config', // 外部用户体系配置
  ExtUserDashboard = 'ext_user_dashboard',   // 外部用户数据库

  // 4. 应用数据字典
  AppDataDict = 'app_data_dict',

  // 4.5 全局CMS管理系统 -> 二级菜单：CMS应用注册、CMS机构管理、文章数据查看
  CMSAppRegister = 'cms_app_register',
  CMSOrgManage = 'cms_org_manage',
  CMSArticleData = 'cms_article_data',

  // 4.6 模拟指令流转MT -> 二级菜单：客户机构列表、开通用户列表
  MTCustomerOrgList = 'mt_customer_org_list',
  MTOpenUserList = 'mt_open_user_list',
  InstructionFlowMT = 'mt_customer_org_list',

  // 保留板块 1: 客户管理 -> 客户名录
  CustDirectory = 'cust_directory',
  PaymentPendingList = 'cust_directory',

  // 各应用内的界面 -> 二级菜单
  AppInnerCustList = 'app_inner_cust_list',
  AppInnerDataDict = 'app_inner_data_dict',
  AppInnerUIManage = 'app_inner_ui_manage',
  // 统一调用组件 -> 二级菜单
  UnifiedFrontendMenuManage = 'unified_frontend_menu_manage',
  UnifiedDefaultRoleManage = 'unified_default_role_manage',
  UnifiedAppBasicConfig = 'unified_app_basic_config',
  UnifiedAppCustomerOrgs = 'unified_app_customer_orgs',
  UnifiedAppAccountManage = 'unified_app_account_manage',
  UnifiedUserAppIdentityDetail = 'unified_user_app_identity_detail',
  UnifiedAppDefaultRole = 'unified_app_default_role',
  UnifiedAppPermissionDict = 'unified_app_permission_dict',
  UnifiedAppOrgList = 'unified_app_org_list',
  UnifiedAppOrgDetail = 'unified_app_org_detail',
  UnifiedOrgUserManage = 'unified_org_user_manage',
  UnifiedOrgRoleManage = 'unified_org_role_manage',
  UnifiedOrgPermissionDict = 'unified_org_permission_dict',
  UnifiedOrgUISettings = 'unified_org_ui_settings',
  UnifiedExtUserOrgList = 'unified_ext_user_org_list',

  // 统一组件库管理 -> 二级菜单（业务核 / 组织核 / 开通核）
  UnifiedTemplateConfig = 'unified_template_config',
  UnifiedTemplateReport = 'unified_template_report',
  UnifiedTemplateDispatch = 'unified_template_dispatch',
  UnifiedInstructionFlow = 'unified_instruction_flow',
  UnifiedOrgStructure = 'unified_org_structure',
  UnifiedPersonnelManage = 'unified_personnel_manage',
  UnifiedGroupManage = 'unified_group_manage',
  UnifiedRolePermission = 'unified_role_permission',
  UnifiedDataDictionary = 'unified_data_dictionary',
  UnifiedMessageNotice = 'unified_message_notice',
  UnifiedSystemLog = 'unified_system_log',
  UnifiedInviteOpen = 'unified_invite_open',
  // 迁移至各应用内界面的二级菜单：客户组织架构、客户账号管理、客户角色管理、客户权限管理
  AppOrg = 'app_org',
  AppAccount = 'app_account',
  AppRole = 'app_role',
  AppPermission = 'app_permission',
  CustOrg = 'app_org',
  CustAccount = 'app_account',
  CustRole = 'app_role',
  CustPermission = 'app_permission',

  // 保留板块 2: 主体维护 / 操作日志
  EntityLog = 'entity_log',

  // 保留板块 3: 系统设置
  SystemSettings = 'system_settings',

  // 消息中心
  MessageCenter = 'message_center'
}

// System types
export type SystemMode = 'quotation_system' | 'contract_system';

// Operational log interface
export interface OperationLog {
  id: number;
  operationType: string;
  operator: string;
  operatorPinyin: string;
  department: string;
  content: string;
  ip: string;
  result: '成功' | '失败';
  createdAt: string;
}

// Application item interface
export interface IntegratedApp {
  id: string;
  appCode: string;
  appName: string;
  appCategory: '业务中台' | '企业应用' | '财务协同' | '生产制造' | '基础服务' | '外部生态';
  protocol: 'OAuth 2.0' | 'SAML 2.0' | 'CAS 3.0' | 'REST API' | 'OpenID Connect';
  roleType?: 'with_role' | 'no_role'; // 有角色应用 vs 无角色应用
  appLevel?: 'product' | 'feature'; // 产品级应用 vs 功能级应用
  appShortName?: string; // 应用简称（1~6个字）
  homeUrl?: string; // V8客户入口网址
  adminUrl?: string; // MT管理端入口网址
  officialOrgCount?: number; // 正式机构数
  trialOrgCount?: number; // 试用机构数
  disabledOrgCount?: number; // 关停机构数
  trashOrgCount?: number; // 回收站机构数
  productManager?: string; // 所属产品经理（系统联想选择）
  appIcon?: string; // 上传的应用图标 Data URL / 图片地址
  appIconName?: string; // 上传的应用图标文件名
  // 外部用户体系配置
  enableExtUserSystem?: boolean; // 是否启用本应用自有外部用户体系
  extWechatMpName?: string; // 外部用户使用的公众号名称
  extWechatAppId?: string; // 公众号 AppID
  extWechatAppSecret?: string; // 公众号 AppSecret
  extWechatToken?: string; // 公众号 Token
  extWechatEncodingAesKey?: string; // 公众号 EncodingAESKey
  extWechatQrCode?: string; // 公众号关注二维码图片
  extWechatQrCodeName?: string; // 公众号关注二维码文件名
  appKey: string;
  appSecret?: string;
  status: 'published' | 'unpublished' | 'disabled' | 'active' | 'testing';
  activeAccounts: number;
  dailyCalls: number;
  healthScore: number;
  qpsLimit: number;
  redirectUri: string;
  ownerDept: string;
  ownerName: string;
  syncInterval: string;
  integratedAt: string;
  description: string;
  iconBg?: string;
  iconColor?: string;
  pageModules?: string[];
  clientConfigs?: Record<string, string[]>;
}

// Organization Node Interface
export interface OrgNode {
  id: string;
  deptCode?: string;
  code?: string;
  deptName?: string;
  name?: string;
  leader: string;
  memberCount: number;
  status?: 'active' | 'disabled';
  boundApps?: string[];
  linkedApps?: string[];
  syncStatus?: string;
  boundAppCount?: number;
  parentId?: string;
  children?: OrgNode[];
}

// User Account Interface
export interface AppUserAccount {
  id: string;
  username?: string;
  accountNo?: string;
  realName: string;
  deptName?: string;
  department?: string;
  roleName?: string;
  phone: string;
  email: string;
  boundApps: string[];
  ssoEnabled: boolean;
  mfaEnabled: boolean;
  roleCount?: number;
  status: 'active' | 'locked' | 'disabled';
  lastLoginAt?: string;
  lastLoginTime?: string;
  lastLoginIp: string;
}

// App Role Interface
export interface AppRoleItem {
  id: string;
  roleCode: string;
  roleName: string;
  appScope?: string;
  targetApp?: string;
  dataScope: string;
  memberCount?: number;
  userCount?: number;
  isSystem?: boolean;
  status: 'active' | 'disabled';
  description: string;
  updatedAt?: string;
}

// App Permission Interface
export interface AppPermissionItem {
  id: string;
  permCode?: string;
  code?: string;
  permName?: string;
  name?: string;
  resourceType?: 'menu' | 'button' | 'api' | 'data';
  type?: 'menu' | 'button' | 'api' | 'data';
  appCode: string;
  appName?: string;
  apiUrl?: string;
  resourcePath?: string;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | '*';
  status: 'active' | 'disabled';
  description: string;
}

// Data Dictionary Interface
export interface DictCategory {
  id: string;
  dictCode: string;
  dictName: string;
  appScope?: string;
  scope?: '全局通用' | '应用级专属';
  itemCount?: number;
  status?: 'active' | 'disabled';
  description: string;
  updatedAt?: string;
}

export interface DictItem {
  id: string;
  dictCode?: string;
  itemKey?: string;
  itemLabel: string;
  itemValue: string;
  sortOrder: number;
  isDefault: boolean;
  status: 'active' | 'disabled';
  remark?: string;
}
