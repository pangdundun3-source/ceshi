/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EntityLogs } from './components/EntityLogs';
import { CustomerDirectory } from './components/CustomerDirectory';
import { AppDashboard } from './components/AppDashboard';
import { AppPlatform } from './components/AppPlatform';
import { AppDataDictionary } from './components/AppDataDictionary';
import { AppInnerCustomerList } from './components/AppInnerCustomerList';
import { ExternalUserAppConfig } from './components/ExternalUserAppConfig';
import { ExternalUserDashboard } from './components/ExternalUserDashboard';
import { V8UserDatabase } from './components/V8UserDatabase';
import { WechatUserDatabase } from './components/WechatUserDatabase';
import { CMSArticleDataView } from './components/CMSArticleDataView';
import { CMSPlaceholderView } from './components/CMSPlaceholderView';
import { UnifiedCallModuleView } from './components/UnifiedCallModuleView';
import { UNIFIED_CALL_MODULES } from './data/unifiedCallModules';
import { UnifiedDefaultRoleManageView } from './components/UnifiedDefaultRoleManageView';
import { UnifiedAppBasicConfigView } from './components/UnifiedAppBasicConfigView';
import { UnifiedAppCustomerOrgsView } from './components/UnifiedAppCustomerOrgsView';
import { UnifiedAppAccountManageView } from './components/UnifiedAppAccountManageView';
import { UnifiedUserAppIdentityDetailView } from './components/UnifiedUserAppIdentityDetailView';
import { UnifiedAppDefaultRoleView } from './components/UnifiedAppDefaultRoleView';
import { UnifiedAppPermissionDictView } from './components/UnifiedAppPermissionDictView';
import { UnifiedAppOrgDetailView } from './components/UnifiedAppOrgDetailView';
import { UnifiedOrgUserManageView } from './components/UnifiedOrgUserManageView';
import { UnifiedOrgRoleManageView } from './components/UnifiedOrgRoleManageView';
import { UnifiedOrgPermissionDictView } from './components/UnifiedOrgPermissionDictView';
import { UnifiedOrgUISettingsView } from './components/UnifiedOrgUISettingsView';
import { UnifiedExtUserOrgListView } from './components/UnifiedExtUserOrgListView';
import { UnifiedFrontendMenuManageView } from './components/UnifiedFrontendMenuManageView';
import { InstructionFlowMTView } from './components/InstructionFlowMTView';
import { MTCustomerOrgListView } from './components/MTCustomerOrgListView';
import { MTOpenUserListView } from './components/MTOpenUserListView';
import { INITIAL_DITING_MENUS, SysMenuItem } from './components/MenuManage';
import { INITIAL_PRIMARY_PERMS, PrimaryPermItem } from './components/PermissionDictManage';
import { INITIAL_APP_DEFAULT_ROLES, DefaultRoleItem } from './components/DefaultRoleManage';
import { INITIAL_CUSTOMER_ORGS, CustomerOrgItem, withOrgProductBindings } from './data/mockCustomerOrgs';
import { INITIAL_APP_ACCOUNTS, AppAccountUserRecord } from './data/mockAppAccounts';
import { MenuItem, SystemMode, OperationLog } from './types';
import { INITIAL_OPERATION_LOGS } from './data';
import { 
  Building2, 
  HelpCircle, 
  Settings, 
  ShieldAlert, 
  Sliders, 
  Sparkles, 
  Terminal, 
  Wrench, 
  Users, 
  Layers, 
  FileCheck2,
  BellRing,
  Bell,
  Target,
  ArrowLeft,
  X,
  ShieldCheck,
  Check,
  ExternalLink,
  AppWindow,
  Search,
  Filter,
  CheckSquare,
  Square,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Eye
} from 'lucide-react';

const getFormattedTime = (timeStr: string, id: number): string => {
  const now = new Date();
  let itemDate = new Date();
  
  const minMatch = timeStr.match(/(\d+)分钟前/);
  const hourMatch = timeStr.match(/(\d+)小时前/);
  const dayMatch = timeStr.match(/(\d+)天前/);
  
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    itemDate.setMinutes(itemDate.getMinutes() - mins);
  } else if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    itemDate.setHours(itemDate.getHours() - hours);
    // Add stable, deterministic minutes offset based on id so it becomes "X小时Y分钟前"
    const minOffset = (id * 7) % 45 + 5;
    itemDate.setMinutes(itemDate.getMinutes() - minOffset);
  } else if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    itemDate.setDate(itemDate.getDate() - days);
    // Set to a stable, realistic hour and minute on that day
    itemDate.setHours(9 + (id % 8), 10 + (id * 13) % 45);
  } else {
    return timeStr;
  }
  
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  
  if (itemDate < startOfToday) {
    const year = itemDate.getFullYear();
    const month = String(itemDate.getMonth() + 1).padStart(2, '0');
    const date = String(itemDate.getDate()).padStart(2, '0');
    const hour = String(itemDate.getHours()).padStart(2, '0');
    const min = String(itemDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date} ${hour}:${min}`;
  } else {
    // Show live relative difference
    const diffMs = now.getTime() - itemDate.getTime();
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;
      if (remainingMins === 0) {
        return `${diffHours}小时前`;
      }
      return `${diffHours}小时${remainingMins}分钟前`;
    }
  }
};

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${d} ${h}:${m}`;
};

const getAbsoluteTime = (timeStr: string, id: number): string => {
  const itemDate = new Date();
  
  const minMatch = timeStr.match(/(\d+)分钟前/);
  const hourMatch = timeStr.match(/(\d+)小时前/);
  const dayMatch = timeStr.match(/(\d+)天前/);
  
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    itemDate.setMinutes(itemDate.getMinutes() - mins);
  } else if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    itemDate.setHours(itemDate.getHours() - hours);
    const minOffset = (id * 7) % 45 + 5;
    itemDate.setMinutes(itemDate.getMinutes() - minOffset);
  } else if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    itemDate.setDate(itemDate.getDate() - days);
    itemDate.setHours(9 + (id % 8), 10 + (id * 13) % 45);
  } else {
    return timeStr;
  }
  
  return formatDateTime(itemDate);
};

const getReadTime = (timeStr: string, id: number): string => {
  const itemDate = new Date();
  
  const minMatch = timeStr.match(/(\d+)分钟前/);
  const hourMatch = timeStr.match(/(\d+)小时前/);
  const dayMatch = timeStr.match(/(\d+)天前/);
  
  if (minMatch) {
    const mins = parseInt(minMatch[1], 10);
    itemDate.setMinutes(itemDate.getMinutes() - mins);
  } else if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10);
    itemDate.setHours(itemDate.getHours() - hours);
    const minOffset = (id * 7) % 45 + 5;
    itemDate.setMinutes(itemDate.getMinutes() - minOffset);
  } else if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    itemDate.setDate(itemDate.getDate() - days);
    itemDate.setHours(9 + (id % 8), 10 + (id * 13) % 45);
  }
  
  // Deterministically make the read time 3 to 12 minutes after the item time to simulate real system behavior
  const readOffset = 3 + (id % 10);
  itemDate.setMinutes(itemDate.getMinutes() + readOffset);
  
  return formatDateTime(itemDate);
};

export default function App() {
  // Global Mode Toggle
  const [systemMode, setSystemMode] = useState<SystemMode>('quotation_system');
  
  // Independent page URL parameter mapping
  const [urlPage, setUrlPage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('page');
    }
    return null;
  });
  
  // Left menu navigation state
  const [currentMenu, setCurrentMenu] = useState<MenuItem>(MenuItem.AppDashboard);
  const [showOnlyOverduePayment, setShowOnlyOverduePayment] = useState(false);
  const [targetExtUserAppCode, setTargetExtUserAppCode] = useState<string | null>(null);

  // 全局菜单共享状态：保证「前端系统菜单管理」与应用配置中的「默认菜单管理」数据双向联动
  const [sharedMenus, setSharedMenus] = useState<SysMenuItem[]>(INITIAL_DITING_MENUS);

  // 全局权限字典共享状态：保证「应用权限字典」与应用配置中的「权限字典」数据双向联动
  const [sharedPrimaryPerms, setSharedPrimaryPerms] = useState<PrimaryPermItem[]>(INITIAL_PRIMARY_PERMS);

  // 全局默认角色共享状态：保证「应用默认角色」与应用配置中的「默认角色」数据双向联动
  const [sharedDefaultRoles, setSharedDefaultRoles] = useState<DefaultRoleItem[]>(INITIAL_APP_DEFAULT_ROLES);

  // 全局客户机构共享状态：保证「应用客户机构」与应用配置中的「客户机构」数据双向联动
  const [sharedCustomerOrgs, setSharedCustomerOrgs] = useState<CustomerOrgItem[]>(() => {
    return withOrgProductBindings(INITIAL_CUSTOMER_ORGS).map(c => ({
      ...c,
      isEnabled: c.isEnabled !== undefined ? c.isEnabled : c.status !== 'disabled'
    }));
  });

  useEffect(() => {
    setSharedCustomerOrgs((prev) => {
      const next = withOrgProductBindings(prev);
      return next.some((org, index) => org.productId !== prev[index]?.productId) ? next : prev;
    });
  }, []);

  // 全局应用账号共享状态：保证「各应用统一调用组件 > 应用账号管理」与「模拟指令流转MT > 开通用户账号列表」数据双向联动
  const [sharedAppAccounts, setSharedAppAccounts] = useState<AppAccountUserRecord[]>(() => INITIAL_APP_ACCOUNTS);

  useEffect(() => {
    if (currentMenu !== MenuItem.PaymentPendingList) {
      setShowOnlyOverduePayment(false);
    }
  }, [currentMenu]);

  // Application shared State - reactive arrays of Logs
  const [logs, setLogs] = useState<OperationLog[]>(INITIAL_OPERATION_LOGS);

  // Mock settings configuration state
  const [sandboxConfig, setSandboxConfig] = useState({
    auditorName: '张华',
    auditorDept: '标准合规部',
    mockIp: '192.108.1.88',
    showTips: true
  });

  // Unique elements for Screenshot Enhancements
  const [isSystemsMenuOpen, setIsSystemsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);
  const [openedAsUnread, setOpenedAsUnread] = useState<Record<number, boolean>>({});
  const [notifications, setNotifications] = useState([
    { id: 1, title: '立项审核归档成功', time: '10分钟前', content: '您审批的《华西能源智慧大脑技术支撑服务合同》已由省局印章控制中心备份并入库成功。', read: false, msgClass: '通知类', category: '商务消息' },
    { id: 2, title: '签单进度警报', time: '1小时前', content: '康奈整体本期签单进度已达 65.6%，距离 5000 万年度销售目标尚有部分缺口，请各区销售尽快落实签约。', read: false, msgClass: '通知类', category: '商务消息' },
    { id: 3, title: '税务专营发票寄出件', time: '1天前', content: '成都公安高新分局 1,850,000 元增值税专用发票已寄出，快递单号：SF98234850。', read: false, msgClass: '通知类', category: '财务消息' },
    { id: 4, title: '物理主机节点升级通告', time: '2天前', content: '配合电信安全合规审计要求，今晚 23:00 起物理IP溯源服务器将进行热备份升级，期间短暂无法获取审计信息。', read: true, msgClass: '通知类', category: '系统消息' },
    { id: 5, title: '审批《太原安全防范及网络审计服务协议》', time: '2小时前', content: '提报人：张三（销售部）。需要您核对标准合规退款扣减服务标准。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 6, title: '确认 5 月份财务开票扣率明细', time: '3小时前', content: '请核实并签署 5 月份大区税务申报折扣率表，确保与云网防御审计系统账套对齐。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 7, title: '研发服务器接入合规签审核', time: '1天前', content: 'FastDo 新升级研发测试部署网关安全组物理IP安全准入请求，由于合规安全需要标准审核批准。', read: false, msgClass: '待办类', category: '研发消息' },
    { id: 8, title: 'FastDo 节点性能及安全配置检查', time: '3天前', content: '请依据安全规范对 FastDo 系统外部存储读写合规行文进行确认并打签署印。', read: true, msgClass: '待办类', category: 'FastDo' },
    { id: 9, title: '财务退款单 HXZ-202605 审核', time: '4天前', content: '大宗采购退款 150k 人民币审计需要合规专员二次盖章。', read: true, msgClass: '待办类', category: '财务消息' },
    { id: 10, title: '服务标准协议 (SLA) 修订签署', time: '5天前', content: '华西能源云服务售后白皮书修订版签字盖章手续待补办。', read: false, msgClass: '待办类', category: '服务消息' },
    { id: 11, title: '销售周报合规检查未通过', time: '15分钟前', content: '西南大区上周有 3 笔销售记录缺少客户拜访凭证，需要您核实并联系销售进行补充。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 12, title: '《重庆网络安全升级方案》待盖章', time: '40分钟前', content: '提报人：网络部李四。项目预算 450,000 元，需要标准合规部门负责人签章。', read: false, msgClass: '待办类', category: '服务消息' },
    { id: 13, title: 'FastDo 云网灾备配置异常警告', time: '50分钟前', content: '检测到 FastDo 西安节点冷备数据在 2026-06-16 未能按约定时间成功上传，需人工干预。', read: false, msgClass: '通知类', category: 'FastDo' },
    { id: 14, title: '系统安全漏洞修复通知', time: '1小时前', content: '安全网关已自动拦截 3 次由于旧版 API 导致的密码爆破，系统已在下午 14:00 平滑升级补丁。', read: true, msgClass: '通知类', category: '系统消息' },
    { id: 15, title: '成都交子金控回款核销待办', time: '3小时前', content: '财务部提醒：成都交子金控期末对账单 1,200,000 元已到账，请业务经理跟进财务归档手续。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 16, title: '资质授权变更协议审核', time: '4小时前', content: '收到黑龙江电信二级代理资质授权变更申请书，请法务 and 合规专员初审。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 17, title: '快巡技术准入合规通报', time: '5小时前', content: '《康奈信息安全快巡工具》已成功通过省通信管理局的软件安全性和物理接口审查。', read: true, msgClass: '通知类', category: '系统消息' },
    { id: 18, title: '客户反馈：昆明安全测试不通过', time: '6小时前', content: '昆明交通集团反馈在进行物理链路边界防御演练时，日志解析部分存在漏报，要求技术部在 3 日内修复。', read: false, msgClass: '待办类', category: '研发消息' },
    { id: 19, title: '财务异常充值提报处理', time: '10小时前', content: '发现一笔来自未实名认证渠道的 50k 线上大额充值申请，已被系统自动挂起，需要您手动审核。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 20, title: '五月商务折扣返利发放成功', time: '1天前', content: '面向西北地区 12 家签约合作伙伴的五月商务折扣现金返还（共计 680,000 元）已完成支付。', read: true, msgClass: '通知类', category: '财务消息' },
    { id: 21, title: 'FastDo 网关密钥自动轮转完成', time: '1天前', content: '已经针对 FastDo 内部微服务通信网关证书和 Secret Key 进行了 180 天一次的例行加密更新。', read: true, msgClass: '通知类', category: 'FastDo' },
    { id: 22, title: '外部数据接入安全合规承诺书签署', time: '1天前', content: '华东销售大区接入第三方用户画像数据库前，需签署物理IP数据无溢出合规责任书。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 23, title: '服务工单：重庆医院维保合同到期', time: '2天前', content: '重庆市第一人民医院的《网络防御与安全审计维保合同》将于 2026-06-30 到期，请客户经理催续签。', read: false, msgClass: '待办类', category: '服务消息' },
    { id: 24, title: '数据安全分类分级规范下发', time: '2天前', content: '国家网信办、工信部发布最新行业数据分级分类标准，合规部已编制《康奈标准指南》，请全员查阅。', read: true, msgClass: '通知类', category: '系统消息' },
    { id: 25, title: '销售合同 HXZ-202611 纠错待办', time: '2天前', content: '内审发现与贵阳大数据城签署的合同中，关于延迟交付罚则与省局标准范本条款存在冲突，需联系修改。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 26, title: 'FastDo 热备集群存储容量告警', time: '2天前', content: '由于近日流量激增，西安 FastDo 存储冗余磁盘组使用空间已达 88%，请及时补充或者启动归档清理。', read: false, msgClass: '通知类', category: 'FastDo' },
    { id: 27, title: '物理防盗报警网络审计联动测试', time: '3天前', content: '合规部协同研发部今日将对公司数据中心核心物理隔离区防盗入侵告警网关等硬件进行联调。', read: true, msgClass: '通知类', category: '研发消息' },
    { id: 28, title: '开发环境物理IP范围授权调整', time: '3天前', content: '配合高新园区网安升级，张江研发中心全部本地编译设备的外网出网物理IP将重新绑定，请相关研发人员配合。', read: false, msgClass: '待办类', category: '系统消息' },
    { id: 29, title: '《大区财务核算审计规程》签阅', time: '4天前', content: '请在 6 月 20 日前通过此待办阅读并打签署印确认遵守全新的大区二级财务账簿核对规范。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 30, title: '外部安全服务投标成果公示', time: '4天前', content: '我司在《四川省水利厅安全防御态势感知系统技术支持采购》中获得综合评分第一名，成功中标。', read: true, msgClass: '通知类', category: '商务消息' },
    { id: 32, title: '客户投诉处理：贵州电网流量波动', time: '5天前', content: '由于电信主干光缆故障，导致贵州电力专网安全探针出现周期性丢包，客服部已派出技术特派员上门排查。', read: false, msgClass: '待办类', category: '服务消息' },
    { id: 33, title: 'FastDo 主机物理硬件扩容论证会', time: '5天前', content: '本周五下午 14:00 于 501 举行西安 FastDo 系统硬件服务器增购与物理安全组拓扑图变更讨论会。', read: false, msgClass: '待办类', category: 'FastDo' },
    { id: 34, title: '华中财务抵扣明细审核单', time: '5天前', content: '提报人：财务陈经理。涉及进项税额转出与高新技术退税合并申报科目核验，紧急。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 35, title: '《太重燃气发电机组系统合同》入库', time: '6天前', content: '提报人：销售刘五。该项目 3,500,000 元已首笔回款，合同已归档并生成归档编号 GXZ-98124。', read: true, msgClass: '通知类', category: '商务消息' },
    { id: 36, title: '外聘安全专家劳务费报销审批', time: '6天前', content: '合规标准研讨会议所邀请的省厅专家名单及差旅会务劳务费（合计 18,500 元）需要您复签。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 37, title: '物理数据安全机房日常巡检合格', time: '7天前', content: '标准合规组会同行政安全员对成都高新物理服务器机房 of 温湿度、双路供电及消防气体设施进行检查，符合标准。', read: true, msgClass: '通知类', category: '系统消息' },
    { id: 38, title: '研发服务器 IP 段变动报备', time: '7天前', content: '研发实验室由于新增华为云 VPC，原物理 IP 段 (172.16.8.0/24) 扩展至 B 段，请知悉涉及 of 合规准入。', read: true, msgClass: '通知类', category: '研发消息' },
    { id: 39, title: 'FastDo 接口异常拦截报告', time: '7天前', content: '安全网关检测到某代理商使用未授权脚本拉取库存数据，系统已自动阻断并将其物理 IP 列入黑名单 24 小时。', read: true, msgClass: '通知类', category: 'FastDo' },
    { id: 40, title: '《大客户白金服务升级备忘录》待办', time: '8天前', content: '针对中石油西南分局的增值云安全服务的定制白皮书需在 21 日对标评审，请业务经理准备。', read: false, msgClass: '待办类', category: '服务消息' },
    { id: 41, title: '代理商违规串货处罚决定签署', time: '8天前', content: '西北区某二级代理商违规降价并跨地区物理分销，合规部根据条款扣减其全年轻度返利，请签署生效。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 42, title: '年中大区税务预缴测算报表', time: '9天前', content: '本期年中全国销售回款与高精扣率预测已生成排程，请各位合规专家校审税率。', read: true, msgClass: '通知类', category: '财务消息' },
    { id: 43, title: '物理网络审计测试床环境到期', time: '9天前', content: '阿里云租用的高防模拟审计测试环境将于 3 天后到期，请研发三部主管跟进是否继续支付或转移。', read: false, msgClass: '待办类', category: '研发消息' },
    { id: 44, title: 'FastDo 多租户物理安全壁垒方案', time: '10天前', content: '关于 FastDo 核心数据库在容器环境下实现云物理隔离的研究性白皮书已通过法务合规审查。', read: true, msgClass: '通知类', category: 'FastDo' },
    { id: 45, title: '全员网络合规与信息红线考核', time: '10天前', content: '2026 年第一期销售行为合规及信息安全试卷已下发，请公司全员在 6 月 25 日完成作答。', read: false, msgClass: '待办类', category: '系统消息' },
    { id: 46, title: '售后：四川能投二期工程上线通过', time: '10天前', content: '四川能投智慧水务防御节点的合规审查和试运行调试已经全部办结，反馈优良，合同可转运维。', read: true, msgClass: '通知类', category: '服务消息' },
    { id: 47, title: '审批《上海中心大厦网络合规评测表》', time: '11天前', content: '提报人：销售王六。涉及物理及链路安全标准的评测结果，请复核后予以盖章。', read: false, msgClass: '待办类', category: '商务消息' },
    { id: 48, title: '端午节放假期间值班与网络安防通告', time: '11天前', content: '放假期间将实施双人双岗，系统监控部门将加强对物理主干道网络流量与 API 异常请求的告警。', read: true, msgClass: '通知类', category: '系统消息' },
    { id: 49, title: '研发：基于 Docker 的物理隔离机制通过', time: '12天前', content: '安全研发团队提交并完成评估的新网络架构白皮书，已被标准合规部认定符合中国网安 B 级标准。', read: true, msgClass: '通知类', category: '研发消息' },
    { id: 50, title: '财务罚款及呆坏账核销明细', time: '12天前', content: '关于吉林审计因合作终止导致的一笔 120k 项目尾数呆坏账核销案，需要主管 and 合规专家确认。', read: false, msgClass: '待办类', category: '财务消息' },
    { id: 51, title: 'FastDo 三期迁移合规建议书', time: '13天前', content: 'FastDo 商务与云技术重构架构 of 合规评估意见书已出炉，建议保留西安物理隔离机房 of 独立审计。', read: true, msgClass: '通知类', category: 'FastDo' },
    { id: 52, title: '华南大区安全销售渠道自查表收回', time: '13天前', content: '全区 45 家核心合作伙伴已全部交回《安全销售规范自查表》，全部存档通过。', read: true, msgClass: '通知类', category: '商务消息' },
    { id: 53, title: '客户：甘肃电力网络拦截策略更新待批', time: '14天前', content: '客户申请在网安审计平台上新增一条特定物理 IP 网段的阻断例外，由于属于重要保障客户，需专家审批。', read: false, msgClass: '待办类', category: '服务消息' },
    { id: 54, title: '新版财务发票流转控制系统试运行', time: '14天前', content: '新版增值税发票电子化直连及流转审计控制系统即日起展开试运行，财务对接有疑问请联系周经理。', read: true, msgClass: '通知类', category: '财务消息' },
    { id: 55, title: '销售违规信息阻断警示', time: '15天前', content: '在华中区某次拜访中，系统监测到销售在邮件中传输了敏感的网络拓扑图附件，该邮件已被阻断并记录。', read: true, msgClass: '通知类', category: '系统消息' }
  ]);

  // Message Center States
  const [activeMsgTab, setActiveMsgTab] = useState<'pending' | 'completed'>('pending');
  const [msgSearchQuery, setMsgSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedMsgCats, setSelectedMsgCats] = useState<string[]>([
    '系统消息',
    '财务消息',
    '商务消息',
    '服务消息',
    '研发消息',
    'FastDo'
  ]);
  const [msgCurrentPage, setMsgCurrentPage] = useState(1);
  const [msgItemsPerPage, setMsgItemsPerPage] = useState(50);


  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDrawerAnimOpen, setIsDrawerAnimOpen] = useState(false);
  const [cachedMsg, setCachedMsg] = useState<any>(null);
  const closeTimeoutRef = useRef<any>(null);

  const handleCloseDrawer = () => {
    setIsDrawerAnimOpen(false);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setSelectedNotificationId(null);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        const clickedRow = target.closest('tr');
        if (!clickedRow) {
          handleCloseDrawer();
        }
      }
    }
    
    if (selectedNotificationId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedNotificationId]);

  const handleMarkAllRead = () => {
    // Only affect unread notifications of "通知类" class
    setNotifications(prev => prev.map(n => (n.msgClass === '通知类' && !n.read) ? { ...n, read: true } : n));
  };

  const toggleMsgCategory = (cat: string) => {
    setSelectedMsgCats(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat) 
        : [...prev, cat]
    );
  };

  // Handler to clear history logs if desired
  const handleClearLogs = () => {
    setLogs([]);
  };

  // Render workspace content dynamically based on current selected left menu state
  const renderWorkspaceContent = () => {
    const unifiedModule = UNIFIED_CALL_MODULES.find((item) => item.menu === currentMenu);
    if (unifiedModule) {
      return <UnifiedCallModuleView module={unifiedModule} />;
    }

    switch (currentMenu) {
      // 1. 应用综合看板
      case MenuItem.AppDashboard:
      case MenuItem.BusinessDashboard:
        return <AppDashboard />;

      // 2. 应用管理：产品 / 机构
      case MenuItem.AppList:
      case MenuItem.ProductManage:
        return (
          <AppPlatform
            sharedMenus={sharedMenus}
            onSharedMenusChange={setSharedMenus}
          />
        );

      case MenuItem.OrgManage:
        return (
          <UnifiedAppCustomerOrgsView
            sharedCustomerOrgs={sharedCustomerOrgs}
            onSharedCustomerOrgsChange={setSharedCustomerOrgs}
            breadcrumbs={['V8应用集成管理中心', '应用管理', '机构管理']}
            pageTitle="机构管理"
            pageSubtitle="按产品查看已开通机构"
          />
        );

      // 2.5 V8用户体系管理 (二级菜单：V8用户数据库, 微信用户数据库)
      case MenuItem.V8UserDatabase:
        return <V8UserDatabase />;

      case MenuItem.WechatUserDatabase:
        return <WechatUserDatabase />;

      // 3. 外部用户体系管理 -> 二级菜单：外部用户应用配置
      case MenuItem.ExtUserAppConfig:
        return (
          <ExternalUserAppConfig
            initialEditingAppCode={targetExtUserAppCode}
            onClearInitialEditing={() => setTargetExtUserAppCode(null)}
          />
        );

      // 3. 应用用户体系管理 -> 二级菜单：应用内用户（外部用户）看板
      case MenuItem.ExtUserDashboard:
        return <ExternalUserDashboard />;

      // 7. 应用数据字典 (主菜单 -> 全局数据字典)
      case MenuItem.AppDataDict:
        return <AppDataDictionary isInnerApp={false} />;

      // 全局CMS管理系统 -> 二级菜单：CMS应用注册、CMS机构管理、文章数据查看
      case MenuItem.CMSAppRegister:
        return (
          <CMSPlaceholderView
            title="CMS应用注册"
            subtitle="管理全局 CMS 体系下各业务系统对接协议、授权密钥与接口鉴权"
            badge="CMS注册中心"
            description="已对齐谛听预警、数解舆情、看讯、点点密信等核心系统的数据上报与接入规范。"
          />
        );

      case MenuItem.CMSOrgManage:
        return (
          <CMSPlaceholderView
            title="CMS机构管理"
            subtitle="统一纳管全平台 CMS 客户机构发布权限、内容审核流程与配额"
            badge="CMS机构架构"
            description="支持按大区/统计单元划分客户机构内容生产范围，统一管理机构管理员与发布员角色。"
          />
        );

      case MenuItem.CMSArticleData:
        return <CMSArticleDataView />;

      // 4.6 模拟指令流转MT -> 二级菜单：客户机构列表、开通用户列表
      case MenuItem.MTCustomerOrgList:
        return (
          <MTCustomerOrgListView
            sharedCustomerOrgs={sharedCustomerOrgs}
            onSharedCustomerOrgsChange={setSharedCustomerOrgs}
          />
        );

      case MenuItem.MTOpenUserList:
        return (
          <MTOpenUserListView
            sharedAppAccounts={sharedAppAccounts}
            onSharedAppAccountsChange={setSharedAppAccounts}
          />
        );

      // 保留的客户管理主菜单和客户名录
      case MenuItem.CustDirectory:
        return <CustomerDirectory />;

      // 各应用内的界面 -> 二级菜单：客户机构列表
      case MenuItem.AppInnerCustList:
        return <AppInnerCustomerList />;

      // 各应用内的界面 -> 二级菜单：应用数据字典 (单应用范围)
      case MenuItem.AppInnerDataDict:
        return <AppDataDictionary isInnerApp={true} />;

      // 统一调用组件 -> 二级菜单：前端系统菜单管理
      case MenuItem.UnifiedFrontendMenuManage:
        return (
          <UnifiedFrontendMenuManageView
            sharedMenus={sharedMenus}
            onSharedMenusChange={setSharedMenus}
          />
        );

      // 统一调用组件 -> 二级菜单：默认角色管理页面
      case MenuItem.UnifiedDefaultRoleManage:
        return <UnifiedDefaultRoleManageView />;

      // 统一调用组件 -> 二级菜单：应用基本配置
      case MenuItem.UnifiedAppBasicConfig:
        return <UnifiedAppBasicConfigView />;

      // 统一调用组件 -> 二级菜单：应用客户机构
      case MenuItem.UnifiedAppCustomerOrgs:
        return (
          <UnifiedAppCustomerOrgsView
            sharedCustomerOrgs={sharedCustomerOrgs}
            onSharedCustomerOrgsChange={setSharedCustomerOrgs}
          />
        );

      // 统一调用组件 -> 二级菜单：应用账号管理
      case MenuItem.UnifiedAppAccountManage:
        return (
          <UnifiedAppAccountManageView
            sharedAppAccounts={sharedAppAccounts}
            onSharedAppAccountsChange={setSharedAppAccounts}
          />
        );

      // 统一调用组件 -> 二级菜单：用户应用身份详情
      case MenuItem.UnifiedUserAppIdentityDetail:
        return (
          <UnifiedUserAppIdentityDetailView
            sharedAppAccounts={sharedAppAccounts}
            onSharedAppAccountsChange={setSharedAppAccounts}
          />
        );

      // 统一调用组件 -> 二级菜单：应用默认角色
      case MenuItem.UnifiedAppDefaultRole:
        return (
          <UnifiedAppDefaultRoleView
            sharedDefaultRoles={sharedDefaultRoles}
            onSharedDefaultRolesChange={setSharedDefaultRoles}
            sharedPrimaryPerms={sharedPrimaryPerms}
          />
        );

      // 统一调用组件 -> 二级菜单：应用权限字典
      case MenuItem.UnifiedAppPermissionDict:
        return (
          <UnifiedAppPermissionDictView
            sharedPrimaryPerms={sharedPrimaryPerms}
            onSharedPrimaryPermsChange={setSharedPrimaryPerms}
          />
        );

      // 统一调用组件 -> 二级菜单：应用机构列表
      case MenuItem.UnifiedAppOrgList:
        return <AppInnerCustomerList />;

      // 统一调用组件 -> 二级菜单：应用机构详情管理
      case MenuItem.UnifiedAppOrgDetail:
        return <UnifiedAppOrgDetailView />;

      // 统一调用组件 -> 二级菜单：机构用户管理
      case MenuItem.UnifiedOrgUserManage:
        return <UnifiedOrgUserManageView />;

      // 统一调用组件 -> 二级菜单：机构角色管理
      case MenuItem.UnifiedOrgRoleManage:
        return <UnifiedOrgRoleManageView />;

      // 统一调用组件 -> 二级菜单：机构权限字典
      case MenuItem.UnifiedOrgPermissionDict:
        return <UnifiedOrgPermissionDictView />;

      // 各应用统一调用组件 -> 二级菜单：机构界面设置
      case MenuItem.UnifiedOrgUISettings:
        return <UnifiedOrgUISettingsView />;

      // 各应用统一调用组件 -> 二级菜单：外部用户组织列表
      case MenuItem.UnifiedExtUserOrgList:
        return <UnifiedExtUserOrgListView />;

      // 主体维护日志
      case MenuItem.EntityLog:
        return (
          <EntityLogs 
            logs={logs}
            onClearLogs={handleClearLogs}
          />
        );

      // 消息中心
      case MenuItem.MessageCenter: {
        const filteredNotifications = notifications.filter(msg => {
          const matchesSearch = msg.title.toLowerCase().includes(msgSearchQuery.toLowerCase()) || 
                                msg.content.toLowerCase().includes(msgSearchQuery.toLowerCase());
          const matchesCategory = selectedMsgCats.includes(msg.category || '');
          const matchesTab = activeMsgTab === 'pending' ? !msg.read : msg.read;
          return matchesSearch && matchesCategory && matchesTab;
        });

        const pendingCount = notifications.filter(n => !n.read).length;

        // Pagination calculations
        const totalItems = filteredNotifications.length;
        const totalPages = Math.ceil(totalItems / msgItemsPerPage) || 1;
        const activePage = Math.min(msgCurrentPage, totalPages);
        const startIndex = totalItems === 0 ? 0 : (activePage - 1) * msgItemsPerPage;
        const endIndex = Math.min(startIndex + msgItemsPerPage, totalItems);
        const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

        return (
          <div className="h-full w-full relative overflow-hidden flex flex-row bg-[#F8FAFC]" id="message_center_page">
            {/* Left Column: Notification Center List */}
            <div className={`flex-1 h-full overflow-y-auto p-6 flex flex-col gap-6 selection:bg-blue-100 selection:text-blue-800 ${
              selectedNotificationId !== null ? 'hidden md:flex' : 'flex'
            }`}>
            
            {/* Message Center Top Header Control Panel */}
            <div 
              style={{ height: '80.3229px' }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 text-blue-655 text-blue-600 rounded-lg">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </span>
                  <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <span>个人消息中心</span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  你个人的所有的待办和通知消息将会在这里显示
                </p>
              </div>
            </div>

            {/* Notifications Display Grid (Tabular Format) */}
            <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              {/* Table Top Header Filters & Search bar - Highly responsive layout */}
              <div className="p-5 border-b border-slate-200 bg-white">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full">
                  {/* Left Side: Tab groups */}
                  <div className="flex flex-row items-center gap-4 shrink-0">
                    {/* Box 1: Pending/Unread */}
                    <div
                      onClick={() => {
                        setActiveMsgTab('pending');
                        setMsgCurrentPage(1);
                      }}
                      className={`w-[180px] h-12 px-4 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        activeMsgTab === 'pending'
                          ? 'bg-[#1e376b]/5 border-[#1e376b] shadow-[0_4px_12px_rgba(30,55,107,0.04)] text-[#1e376b]'
                          : 'bg-white border-slate-200/95 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tight">待办 | 未读</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                        activeMsgTab === 'pending'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {pendingCount}
                      </span>
                    </div>

                    {/* Box 2: Completed/Read */}
                    <div
                      onClick={() => {
                        setActiveMsgTab('completed');
                        setMsgCurrentPage(1);
                      }}
                      className={`w-[180px] h-12 px-4 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                        activeMsgTab === 'completed'
                          ? 'bg-[#1e376b]/5 border-[#1e376b] shadow-[0_4px_12px_rgba(30,55,107,0.04)] text-[#1e376b]'
                          : 'bg-white border-slate-200/95 hover:border-slate-300 text-slate-500'
                      }`}
                    >
                      <span className="text-xs font-black tracking-tight">办结 | 已读</span>
                    </div>
                  </div>

                  {/* Right Side: Search & Filters on a Single Row, Aligned Row-right */}
                  <div className="flex flex-row flex-nowrap items-center gap-2.5 xl:ml-auto w-full xl:w-auto justify-end">
                    {/* Search Input Box */}
                    <div className="relative w-full sm:w-80">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        placeholder="输入关键词检索标题、内容..."
                        value={tempSearchQuery}
                        onChange={(e) => {
                          setTempSearchQuery(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setMsgSearchQuery(tempSearchQuery);
                            setMsgCurrentPage(1);
                          }
                        }}
                        className="w-full h-9 pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400/85"
                      />
                      {tempSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setTempSearchQuery('');
                            setMsgSearchQuery('');
                            setMsgCurrentPage(1);
                          }}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Popover Filter Category Select Icon Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                        className={`h-9 px-3 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all text-xs font-bold ${
                          selectedMsgCats.length < 6
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="按消息类型筛选"
                      >
                        <Filter className="w-3.5 h-3.5" />
                        <span>过滤</span>
                        {selectedMsgCats.length < 6 && (
                          <span className="bg-blue-600 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold font-mono">
                            {selectedMsgCats.length}
                          </span>
                        )}
                      </button>

                      {isFilterDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-10 cursor-default" 
                            onClick={() => setIsFilterDropdownOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200/90 rounded-xl shadow-xl z-20 p-4 flex flex-col gap-3">
                            <div className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-100 flex items-center justify-between">
                              <span>选择消息类型：</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const ALL_CATS = ['系统消息', '财务消息', '商务消息', '服务消息', '研发消息', 'FastDo'];
                                  if (selectedMsgCats.length === 6) {
                                    setSelectedMsgCats([]);
                                  } else {
                                    setSelectedMsgCats(ALL_CATS);
                                  }
                                  setMsgCurrentPage(1);
                                }}
                                className="text-[10px] text-blue-500 hover:underline font-bold"
                              >
                                {selectedMsgCats.length === 6 ? '清空筛选' : '全部勾选'}
                              </button>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              {['系统消息', '财务消息', '商务消息', '服务消息', '研发消息', 'FastDo'].map((cat) => {
                                const isChecked = selectedMsgCats.includes(cat);
                                const handleCheckboxToggle = () => {
                                  setSelectedMsgCats(prev => {
                                    const updated = prev.includes(cat)
                                      ? prev.filter(c => c !== cat)
                                      : [...prev, cat];
                                    return updated;
                                  });
                                  setMsgCurrentPage(1);
                                };

                                return (
                                  <button
                                    type="button"
                                    key={cat}
                                    onClick={handleCheckboxToggle}
                                    className="flex items-center gap-2 px-1.5 py-1 text-xs text-slate-650 hover:text-slate-850 hover:bg-slate-50 rounded-md text-left transition-colors cursor-pointer font-medium"
                                  >
                                    {isChecked ? (
                                      <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                                    )}
                                    <span>{cat}</span>
                                  </button>
                                );
                              })}
                            </div>

                            <div className="mt-1 pt-2 border-t border-slate-100 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setIsFilterDropdownOpen(false)}
                                className="px-3 py-1 bg-[#1e376b] hover:bg-[#14264c] text-[#F8FAFC] rounded text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                确 定
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Search Button (Aligned beside the input on the same row) */}
                    <button
                      type="button"
                      onClick={() => {
                        setMsgSearchQuery(tempSearchQuery);
                        setMsgCurrentPage(1);
                      }}
                      className="h-9 px-5 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm hover:shadow shrink-0"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>搜索</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-secondary-200/60 text-[#1e376b] font-bold border-slate-200">
                      <th className="py-3 px-4 w-32 text-center select-none">
                        {activeMsgTab === 'pending' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAllRead();
                            }}
                            style={{
                              fontSize: '9.5px',
                              width: '66.3229px',
                              height: '18px',
                              backgroundColor: '#cfbf90',
                              borderColor: '#b9630d',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '2px',
                              lineHeight: '1'
                            }}
                            className="text-white border rounded cursor-pointer transition-all hover:brightness-105 active:scale-[0.98] mx-auto text-nowrap font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                            title="点击一键将所有 通知类 的消息进行标为已读"
                          >
                            <Check className="w-2.5 h-2.5 shrink-0 stroke-[3px]" />
                            <span>全部已读</span>
                          </button>
                        ) : (
                          <span>状态</span>
                        )}
                      </th>
                      <th className="py-3 px-4 w-36">业务类型</th>
                      <th className="py-3 px-4 min-w-[340px]">标题与内容详情</th>
                      <th className="py-3 px-4 w-28 text-right">时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedNotifications.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Sliders className="w-6 h-6 text-slate-300" />
                            <span>暂无匹配的消息通知，请尝试调整筛选或搜索条件</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedNotifications.map((msg) => {
                        const isCurrentlySelected = selectedNotificationId === msg.id;
                        return (
                          <tr 
                            key={msg.id}
                            onClick={() => {
                              if (msg.msgClass === '待办类') {
                                setShowPendingModal(true);
                                if (!msg.read) {
                                  handleMarkAsRead(msg.id);
                                }
                              } else if (msg.msgClass === '通知类') {
                                const wasUnread = !msg.read;
                                if (wasUnread) {
                                  setOpenedAsUnread(prev => ({ ...prev, [msg.id]: true }));
                                  const nowStr = formatDateTime(new Date());
                                  setNotifications(prev => prev.map(n => 
                                    n.id === msg.id 
                                      ? { ...n, read: true, readTime: n.readTime || nowStr } 
                                      : n
                                  ));
                                }
                                if (closeTimeoutRef.current) {
                                  clearTimeout(closeTimeoutRef.current);
                                  closeTimeoutRef.current = null;
                                }
                                setCachedMsg(msg);
                                setSelectedNotificationId(msg.id);
                                setTimeout(() => {
                                  setIsDrawerAnimOpen(true);
                                }, 30);
                              }
                            }}
                            className={`hover:bg-slate-50/60 transition-all group cursor-pointer ${
                              isCurrentlySelected ? 'bg-blue-50/20' : !msg.read ? 'bg-blue-50/10' : ''
                            }`}
                          >
                            {/* Col 1: Status */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5" onClick={(e) => {
                                if (msg.msgClass === '待办类') {
                                  setShowPendingModal(true);
                                  if (!msg.read) handleMarkAsRead(msg.id);
                                } else if (msg.msgClass === '通知类') {
                                  // bubble up to tr onClick handler
                                } else {
                                  e.stopPropagation();
                                }
                              }}>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? 'bg-blue-600 animate-pulse' : 'bg-slate-250 bg-slate-300'}`}></span>
                                {!msg.read ? (
                                  <span className="text-[9px] bg-red-50 text-red-600 font-extrabold px-1.5 py-0.5 rounded border border-red-100/50">
                                    未读
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded">
                                    已处理
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Col 2: Business categorization types */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => {
                                if (msg.msgClass === '待办类') {
                                  setShowPendingModal(true);
                                  if (!msg.read) handleMarkAsRead(msg.id);
                                } else if (msg.msgClass === '通知类') {
                                  // bubble up to tr onClick handler
                                } else {
                                  e.stopPropagation();
                                }
                              }}>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                msg.msgClass === '待办类' 
                                  ? 'bg-orange-50 text-orange-600 border border-orange-100/50' 
                                  : 'bg-blue-50 text-blue-600 border border-blue-100/50'
                              }`}>
                                {msg.msgClass}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                msg.category === '系统消息' ? 'bg-purple-50 text-purple-600 border border-purple-150/40' :
                                msg.category === '财务消息' ? 'bg-amber-50 text-amber-600 border border-amber-150/40' :
                                msg.category === '商务消息' ? 'bg-sky-50 text-sky-600 border border-sky-150/40' :
                                msg.category === '服务消息' ? 'bg-teal-50 text-teal-600 border border-teal-150/40' :
                                msg.category === '研发消息' ? 'bg-indigo-50 text-indigo-600 border border-indigo-150/40' :
                                msg.category === 'FastDo' ? 'bg-rose-50 text-rose-600 border border-rose-150/40' :
                                'bg-slate-50 text-slate-500 border border-slate-150/40'
                              }`}>
                                {msg.category}
                              </span>
                            </div>
                          </td>

                          {/* Col 3: Description, Title & Contents */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className={`text-xs font-bold leading-normal truncate max-w-[500px] ${!msg.read ? 'text-[#1E293B]' : 'text-slate-500 font-medium'}`}>
                                {msg.title}
                              </span>
                              <span className={`text-[11px] leading-relaxed transition-colors ${!msg.read ? 'text-slate-600' : 'text-slate-450'}`}>
                                {msg.content}
                              </span>
                            </div>
                          </td>

                          {/* Col 4: Time of distribution */}
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-[10px] text-slate-400 font-mono scale-95 origin-right">{getFormattedTime(msg.time, msg.id)}</span>
                          </td>
                        </tr>
                      );
                    })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table pagination footer */}
              <div className="bg-slate-50/50 border-t border-slate-200 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>
                    第 <strong className="text-slate-700 font-bold">{totalItems === 0 ? 0 : startIndex + 1} - {endIndex}</strong> 条 
                    / 共 <strong className="text-slate-700 font-black">{totalItems}</strong> 条记录
                  </span>
                  <div className="h-3 w-[1px] bg-slate-300"></div>
                  <div className="flex items-center gap-1.5">
                    <span>每页最多显示：</span>
                    <select
                      value={msgItemsPerPage}
                      onChange={(e) => {
                        setMsgItemsPerPage(Number(e.target.value));
                        setMsgCurrentPage(1);
                      }}
                      className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value={5}>5 行</option>
                      <option value={10}>10 行</option>
                      <option value={20}>20 行</option>
                      <option value={50}>50 行</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* First page button */}
                  <button
                    type="button"
                    onClick={() => setMsgCurrentPage(1)}
                    disabled={activePage === 1}
                    className="p-1.5 rounded border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-800 transition-all cursor-pointer"
                    title="第一页"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Previous page button */}
                  <button
                    type="button"
                    onClick={() => setMsgCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={activePage === 1}
                    className="p-1.5 rounded border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-800 transition-all cursor-pointer flex items-center gap-1"
                    title="上一页"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Discrete page page numbering */}
                  <div className="flex items-center gap-1 mx-1.5">
                    {(() => {
                      const pagesRange: number[] = [];
                      const maxPageButtons = 5;
                      let startPage = Math.max(1, activePage - Math.floor(maxPageButtons / 2));
                      let endPage = startPage + maxPageButtons - 1;
                      
                      if (endPage > totalPages) {
                        endPage = totalPages;
                        startPage = Math.max(1, endPage - maxPageButtons + 1);
                      }
                      
                      for (let i = startPage; i <= endPage; i++) {
                        pagesRange.push(i);
                      }
                      
                      return pagesRange.map(pageNo => (
                        <button
                          type="button"
                          key={pageNo}
                          onClick={() => setMsgCurrentPage(pageNo)}
                          className={`min-w-[24px] h-6 px-1.5 text-xs font-bold rounded flex items-center justify-center transition-all cursor-pointer ${
                            activePage === pageNo
                              ? 'bg-[#1e376b] text-white shadow-sm font-black'
                              : 'border border-slate-200/40 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          {pageNo}
                        </button>
                      ));
                    })()}
                  </div>

                  {/* Next page button */}
                  <button
                    type="button"
                    onClick={() => setMsgCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={activePage === totalPages}
                    className="p-1.5 rounded border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-800 transition-all cursor-pointer flex items-center gap-1"
                    title="下一页"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Last page button */}
                  <button
                    type="button"
                    onClick={() => setMsgCurrentPage(totalPages)}
                    disabled={activePage === totalPages}
                    className="p-1.5 rounded border border-slate-200/60 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-800 transition-all cursor-pointer"
                    title="最后一页"
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
            </div>

            {/* Right Column Sliding Drawer */}
            {(() => {
              const activeMsg = notifications.find(n => n.id === selectedNotificationId) || cachedMsg;
              if (!activeMsg) return null;
              
              const isDrawerVisible = selectedNotificationId !== null || isDrawerAnimOpen;
              if (!isDrawerVisible) return null;

              const wasFirstOpenedSession = openedAsUnread[activeMsg.id] === true;
              const formattedPublishTime = getAbsoluteTime(activeMsg.time, activeMsg.id);
              
              // Get the stable, first-read-time
              const firstClickReadTime = activeMsg.readTime 
                ? (typeof activeMsg.readTime === 'string' ? activeMsg.readTime : formatDateTime(new Date(activeMsg.readTime))) 
                : getReadTime(activeMsg.time, activeMsg.id);
              
              return (
                <div 
                  ref={drawerRef}
                  className={`fixed top-0 right-0 h-screen w-full md:w-[480px] bg-white border-l border-slate-200/90 shadow-[0_4px_30px_rgba(30,41,59,0.15)] flex flex-col z-50 transition-all duration-500 ease-out transform ${
                    isDrawerAnimOpen ? 'translate-x-0' : 'translate-x-full'
                  }`}
                >
                  {/* Panel Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-2">
                      {/* Left Top Badge 1: Category Name */}
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${
                        activeMsg.category === '系统消息' ? 'bg-purple-50/70 text-purple-600 border-purple-100' :
                        activeMsg.category === '财务消息' ? 'bg-amber-50/70 text-amber-600 border-amber-100' :
                        activeMsg.category === '商务消息' ? 'bg-sky-50/70 text-sky-600 border-sky-100' :
                        activeMsg.category === '服务消息' ? 'bg-teal-50/70 text-teal-600 border-teal-100' :
                        activeMsg.category === '研发消息' ? 'bg-indigo-50/70 text-indigo-600 border-indigo-100' :
                        activeMsg.category === 'FastDo' ? 'bg-rose-50/70 text-rose-600 border-rose-100' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {activeMsg.category}
                      </span>
                      
                      {/* Left Top Badge 2: Message Read Status */}
                      <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        消息状态：已读
                      </span>
                    </div>

                    <button 
                      onClick={handleCloseDrawer}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="关闭"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Top Right Box (Inside content scroll or header, styled elegantly) */}
                  <div className="px-6 py-4 bg-slate-50/20 border-b border-slate-100 flex flex-col gap-1.5 shrink-0">
                    {/* Time line 1: publish time */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-450">发布时间：</span>
                      <span className="font-mono text-slate-600 font-semibold">{formattedPublishTime}</span>
                    </div>

                    {/* Time line 2: read time - show if read */}
                    {activeMsg.read && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium animate-in fade-in duration-300">
                        <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-450">已读时间：</span>
                        <span className="font-mono text-slate-600 font-semibold">{firstClickReadTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Middle Content Details Area */}
                  <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-4">
                    <h3 className="text-sm font-black text-slate-800 leading-snug tracking-tight">
                      {activeMsg.title}
                    </h3>
                    <div className="h-px bg-slate-100 w-12 my-1"></div>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-wrap font-normal">
                      {activeMsg.content}
                    </p>
                  </div>

                  {/* Bottom Footer Area */}
                  <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
                    <button
                      onClick={handleCloseDrawer}
                      className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95 border border-slate-200"
                    >
                      关闭
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }

      // 5. 系统设置
      case MenuItem.SystemSettings:
        return (
          <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6" id="settings_workbench">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>MT 管理后台系统设置与调试面板</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">定制 MT 模拟参数、权限分配，并在页面之间无缝联动。</p>
            </div>

            {/* Sandbox setting variables */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sliders className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">沙箱仿真管理参数</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* 1. Auditor Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">模拟操作人姓名</label>
                  <input
                    type="text"
                    value={sandboxConfig.auditorName}
                    onChange={e => setSandboxConfig({ ...sandboxConfig, auditorName: e.target.value })}
                    className="border border-slate-200 rounded-lg py-2 px-3 outline-none"
                  />
                </div>
                {/* 2. Department */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">所属标准部门</label>
                  <input
                    type="text"
                    value={sandboxConfig.auditorDept}
                    onChange={e => setSandboxConfig({ ...sandboxConfig, auditorDept: e.target.value })}
                    className="border border-slate-200 rounded-lg py-2 px-3 outline-none"
                  />
                </div>
                {/* 3. IP address */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-slate-600">物理访问 IP (审计溯源使用)</label>
                  <input
                    type="text"
                    value={sandboxConfig.mockIp}
                    onChange={e => setSandboxConfig({ ...sandboxConfig, mockIp: e.target.value })}
                    className="border border-slate-200 rounded-lg py-2 px-3 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Tips trigger */}
              <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100/30">
                <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>参数生效提示:</strong> 修改操作人或部门后，您在「次级产品」中所做的新增，或是「合同审核」中驳回/审批的行为，都会以对应的操作人 IP 及时间戳，安全归档到「主体维护日志」中以供审计。
                </p>
              </div>
            </div>

            {/* Architecture Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-1">报价系统 (Quotation Sys)</span>
                <p className="text-[11px] text-slate-500">
                  支持功能清单查询、折扣核算、文件导出以及创建并上架全新的半月报/研究季报服务产品。
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-1">销售合同系统 (Contract Sys)</span>
                <p className="text-[11px] text-slate-500">
                  具有多级高级筛选器、动态 KPI 合同金额汇总数以及可在弹盒中签发或整改驳回的核决通道。
                </p>
              </div>
            </div>
          </div>
        );

      // 6. General placeholder views for other secondary lists
      default:
        return (
          <div className="p-8 max-w-xl mx-auto text-center flex flex-col items-center justify-center min-h-[50vh] gap-4" id="placeholder_screen">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Wrench className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">模块框架已架设完成</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {currentMenu} 对应页面的数据绑定、导航点位、及列网格已完美注册。后续可继续对该特定分支页完善深度报表与表单逻辑。
              </p>
            </div>
            
            <button
              onClick={() => {
                setCurrentMenu(MenuItem.AppDashboard);
              }}
              className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors"
            >
              返回综合看板
            </button>
          </div>
        );
    }
  };

  if (urlPage === 'signing_target') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans select-text overflow-y-auto">
        <div className="max-w-[1600px] w-full mx-auto flex flex-col gap-6">
          
          {/* Header Line with icon title and description styled exactly like ProjList page */}
          <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  window.open(window.location.pathname, '_self');
                }}
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-sm text-xs font-semibold mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回看板</span>
              </button>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>年度签单目标</span>
                  <span className="text-[10px] bg-blue-600/10 text-blue-700 px-1.5 py-0.5 rounded font-bold font-mono">WORKSPACE</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">项目立项、跟进及状态管理明细台账。提供康奈网络（Konne.cn）整体业务进程追溯。</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowPendingModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>+ 提报/新建年度签单目标</span>
            </button>
          </div>

          {/* Rest of the area is blank (Other areas left empty for future layout design) */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200/80 p-12 min-h-[500px] shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center justify-center">
            <p className="text-xs text-slate-400 border border-dashed border-slate-200 bg-slate-50 p-4 rounded-lg">
              其他区域留空，等待后续设计。
            </p>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-text select-none overflow-hidden antialiased relative">
      
      {/* Top Header */}
      <Header
        systemMode={systemMode}
        setSystemMode={(mode) => {
          setSystemMode(mode);
          // Auto route to primary dashboard screen to avoid confusion
          setCurrentMenu(MenuItem.BusinessDashboard);
        }}
        userName={sandboxConfig.auditorName}
        departmentName={sandboxConfig.auditorDept}
        onToggleSystemsMenu={() => setIsSystemsMenuOpen(!isSystemsMenuOpen)}
        isSystemsMenuOpen={isSystemsMenuOpen}
        onOpenProfile={() => setIsProfileOpen(true)}
        unreadCount={notifications.filter(n => !n.read).length}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onMarkAsRead={handleMarkAsRead}
        onOpenMessageCenter={() => setCurrentMenu(MenuItem.MessageCenter)}
      />

      {/* Main Bottom Frame (Sidebar + Content Workspace Workspace) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          systemMode={systemMode}
        />

        {/* Central Work Environment Workspace */}
        <main className={`flex-1 bg-slate-50/70 ${currentMenu === MenuItem.MessageCenter ? 'h-full overflow-hidden' : 'overflow-y-auto'}`} id="workspace_viewport">
          
          {/* Render Active view */}
          {renderWorkspaceContent()}

        </main>

      </div>

      {/* OVERLAY 1: Sitewide Systems Portal Menu (全平台系统菜单导航) */}
      {isSystemsMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Dismiss backing click */}
          <div className="absolute inset-0" onClick={() => setIsSystemsMenuOpen(false)}></div>
          
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.15)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative z-50 animate-in zoom-in-95 duration-200">
            {/* Header and Close */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 tracking-tight">Konne.cn 康奈网络 · 全平台业务子系统调度中心</h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5 uppercase">
                    Integrated Enterprise System Control Panel
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setIsSystemsMenuOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Systems Grid Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 bg-slate-50/50">
              
              {/* 1. Active System */}
              <div className="bg-white p-5 rounded-xl border-2 border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.08)] flex flex-col justify-between transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 py-1 px-2.5 bg-blue-600 text-[8px] font-black text-white rounded-bl-xl tracking-wider select-none animate-pulse">
                  ACTIVE · 当前激活
                </div>
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                    <AppWindow className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight">销售业务管理系统</h3>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    销售漏斗看板、项目采购、发票流、合同归档审核等商务合规多维台账。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSystemsMenuOpen(false)}
                  className="mt-4 text-[10px] font-black tracking-wider text-center w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  继续操作当前系统
                </button>
              </div>

              {/* 2. Stamp Audit system */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] bg-emerald-100 text-emerald-700 py-0.5 px-1.5 font-black uppercase rounded tracking-wider scale-90 origin-right">
                      已联动
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>智能电子用印审计系统</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    集中授权四川省内公安三级用章、主合同归章与重印章审查防错链。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert("【康奈智能用印审计系统】联动模块激活成功，已校验审计密钥，模拟完成跨系统日志通联。");
                  }}
                  className="mt-4 text-[10px] font-bold tracking-wider text-center w-full py-2 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-lg transition-all cursor-pointer"
                >
                  进入印章控制中心
                </button>
              </div>

              {/* 3. Public opinion */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <BellRing className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] bg-rose-100 text-rose-700 py-0.5 px-1.5 font-black uppercase rounded tracking-wider scale-90 origin-right">
                      已联动
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>大数据舆情及网信监测系统</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    太原、朝阳等关键片区备份服务器舆情捕获及预警，跟进公关决策。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert("【公关舆情大数据监测系统】模拟重定向成功：正在为您载入当前时区热词台账与安全边界预警！");
                  }}
                  className="mt-4 text-[10px] font-bold tracking-wider text-center w-full py-2 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-lg transition-all cursor-pointer"
                >
                  查看实时网信监控
                </button>
              </div>

              {/* 4. Network audit */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] bg-violet-100 text-violet-700 py-0.5 px-1.5 font-black uppercase rounded tracking-wider scale-90 origin-right">
                      节点正常
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>云网边界安全与物理溯源系统</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    精确捕获和比对主体物理访问 IP 与子安全组行为，溯源访问日志。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert("【云网防御安全溯源】当前已完美记录操作 IP 访问轨迹，未发现未经授权的边界请求。");
                  }}
                  className="mt-4 text-[10px] font-bold tracking-wider text-center w-full py-2 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-lg transition-all cursor-pointer"
                >
                  加载物理IP审计日志
                </button>
              </div>

              {/* 5. Intelligent BI */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] bg-amber-100 text-amber-700 py-0.5 px-1.5 font-black uppercase rounded tracking-wider scale-90 origin-right">
                      BI 监控中
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>智能 BI 决策数据研判中心</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    自适应测算最新的半月报、季度研究及全地区签单大宗预算占比进度。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert("【智能 BI 研判决策中心】本期绩效数据分析通链成功！已加载多维折扣及折旧率。");
                  }}
                  className="mt-4 text-[10px] font-bold tracking-wider text-center w-full py-2 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-lg transition-all cursor-pointer"
                >
                  查看智能决策研判
                </button>
              </div>

              {/* 6. Finance */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] bg-teal-100 text-teal-700 py-0.5 px-1.5 font-black uppercase rounded tracking-wider scale-90 origin-right">
                      账套已同步
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>税务开票与收付款结算系统</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-blue-600" />
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-relaxed">
                    与大数据、公安等税发票管理模块直接联通，对专票、发票扣率合规比对。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert("【财务开票及结算系统】与销售业务管理系统同步：专票和扣率数据完美无差额记录。");
                  }}
                  className="mt-4 text-[10px] font-bold tracking-wider text-center w-full py-2 bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent rounded-lg transition-all cursor-pointer"
                >
                  核对账套明细清单
                </button>
              </div>

            </div>
            
            {/* Footer info banner */}
            <div className="p-4 bg-slate-50 text-center text-[10px] text-slate-400 border-t border-slate-100 select-none">
              安全标识: KONNE-SYSTEM-NAVIGATOR-628 · 物理位置: 四川省成都市公安专网联通安全审计端
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 2: Personal Profile Editor Modal (个人信息页模态框) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Dismiss backing click */}
          <div className="absolute inset-0" onClick={() => setIsProfileOpen(false)}></div>
          
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.15)] max-w-md w-full overflow-hidden flex flex-col relative z-50 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-[#D5EBFE]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-800">个人信息合规中心 · 沙箱控制</span>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Profile details */}
            <div className="p-6 flex flex-col items-center gap-5">
              {/* Big Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-blue-500 p-0.5 overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                    alt="user big portrait" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              
              {/* Metadata labels */}
              <div className="text-center">
                <h3 className="text-sm font-black text-slate-800">{sandboxConfig.auditorName}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
                  Level-3 (安全核决专员)
                </p>
              </div>
              
              {/* Divider */}
              <div className="w-full h-[1px] bg-slate-100"></div>

              {/* Interactive editing Form */}
              <div className="w-full flex flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600">模拟操作人姓名</label>
                  <input 
                    type="text"
                    value={sandboxConfig.auditorName}
                    onChange={(e) => setSandboxConfig({...sandboxConfig, auditorName: e.target.value})}
                    className="w-full border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 outline-none text-slate-800 font-medium tracking-tight bg-slate-50 shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600">所属标准部门</label>
                  <input 
                    type="text"
                    value={sandboxConfig.auditorDept}
                    onChange={(e) => setSandboxConfig({...sandboxConfig, auditorDept: e.target.value})}
                    className="w-full border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 outline-none text-slate-800 font-medium tracking-tight bg-slate-50 shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600">物理访问 IP (审计专用)</label>
                  <input 
                    type="text"
                    value={sandboxConfig.mockIp}
                    onChange={(e) => setSandboxConfig({...sandboxConfig, mockIp: e.target.value})}
                    className="w-full border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg py-2 px-3 outline-none text-slate-800 font-mono bg-slate-50 shadow-inner"
                  />
                </div>
                
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-[10px] text-emerald-800 leading-relaxed mt-1">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>您在全系统执行的新增产品、合同审批等日志印迹均将使用这些参数绑定归档。</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-6 rounded-lg shadow transition-all active:scale-95 cursor-pointer animate-pulse-slow"
              >
                保存模拟参数并关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY 3: Message Control Popup (Message Class '待办类' notification click) */}
      {showPendingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowPendingModal(false)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 max-w-2xl w-full relative z-50 animate-in zoom-in-95 duration-200">
            {/* Header: 产品开发提示 (Background: Orange, Text: White Bold, Right text: Black regular) */}
            <div className="bg-orange-500 px-5 py-4 border-b border-orange-600/10 flex items-center justify-between gap-2">
              <span className="text-white text-sm font-black tracking-wider font-sans">
                产品开发提示
              </span>
              <span className="text-xs text-black font-normal font-sans opacity-95">
                控件ID: msg-101
              </span>
            </div>
            
            {/* Content area: 14px Text, around 200 characters describing custom actions behavior */}
            <div className="p-6 flex flex-col gap-6 text-left">
              <div className="text-[14px] text-slate-600 leading-relaxed font-sans font-medium flex flex-col gap-3">
                <p>当用户点击 所有 待办类 的消息的时候，使用新窗口打开这个消息指定的URL。</p>
                <p>用户点击的打开新URL的地址后，这个消息依旧状态是：未读。</p>
                <p>但是打开其他的系统的时候需要传这个 待办消息的唯一ID，用以在其他系统完成操作以后回调 本消息系统的 完成办结的接口，以触发把这个消息的状态变为 办结。</p>
              </div>
              
              {/* Button: 我知道了 */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPendingModal(false)}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white border border-orange-600 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
