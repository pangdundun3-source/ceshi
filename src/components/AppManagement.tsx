/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Boxes,
  Search,
  Plus,
  ArrowLeft,
  Key,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Lock,
  Unlock,
  FileCode2,
  Sliders,
  Monitor,
  Wrench,
  MoreVertical,
  X,
  AlertCircle,
  Clock,
  Layers,
  Building2,
  Building,
  Users,
  UserCheck,
  Shield,
  KeyRound,
  FolderTree,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Link2,
  Globe,
  Activity,
  Sparkles,
  Server,
  Radio,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Database,
  ArrowUpRight,
  Info,
  BadgeCheck,
  HelpCircle,
  Trash2,
  Network,
  Zap,
  Flame,
  Binary,
  BrainCircuit,
  Landmark,
  Globe2,
  LayoutList,
  LayoutGrid,
  AppWindow,
  Video,
  Tv,
  MessageSquare,
  Megaphone,
  Siren,
  TrendingUp,
  Waves,
  MousePointerClick,
  Target,
  Swords,
  Gamepad2,
  Compass,
  Crosshair,
  Cpu,
  BarChart2,
  BarChart3,
  Radar,
  User,
  UploadCloud,
  Upload,
  QrCode,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { IntegratedApp } from '../types';
import { AppCreateStep2 } from './AppCreateStep2';
import { AppCreateModuleBuilder } from './AppCreateModuleBuilder';
import { AppCreateClientModulesStep } from './AppCreateClientModulesStep';
import { AppCreatePublishStep } from './AppCreatePublishStep';
import { AppCreateWizardHeader } from './AppCreateWizardHeader';
import { AppCreateBasicInfoForm } from './AppCreateBasicInfoForm';
import { ALL_UNIFIED_MODULE_KEYS } from '../data/unifiedCallModules';
import {
  AppClientModules,
  ensureClientModules,
  pruneClientModules,
} from '../data/appClients';
import { SysMenuItem } from './MenuManage';
import { PrimaryPermItem } from './PermissionDictManage';
import { DefaultRoleItem } from './DefaultRoleManage';
import { CustomerOrgItem } from '../data/mockCustomerOrgs';

export interface ProductManagerOption {
  id: string;
  name: string;
  dept: string;
}

export const SYSTEM_PRODUCT_MANAGERS: ProductManagerOption[] = [
  { id: 'pm-01', name: '张伟', dept: '研发中心产品一部' },
  { id: 'pm-02', name: '李晓明', dept: '研发中心产品一部' },
  { id: 'pm-03', name: '王敏', dept: '研发中心产品二部' },
  { id: 'pm-04', name: '陈俊', dept: '研发中心产品二部' },
  { id: 'pm-05', name: '周琳', dept: '研发中心产品三部' },
  { id: 'pm-06', name: '刘阳', dept: '研发中心产品三部' },
  { id: 'pm-07', name: '赵刚', dept: '研发中心产品四部' },
  { id: 'pm-08', name: '孙悦', dept: '研发中心产品四部' },
  { id: 'pm-09', name: '钱坤', dept: '标准合规部' },
  { id: 'pm-10', name: '吴佳', dept: '标准合规部' },
  { id: 'pm-11', name: '郑宇', dept: '数据部' },
  { id: 'pm-12', name: '徐浩', dept: '数据部' }
];

export const INITIAL_APPS: IntegratedApp[] = [
  {
    id: 'app-01',
    appCode: 'V8-P-01',
    appName: '正管用 - 网络生态综合治理平台',
    appShortName: '正管用',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://wxb.cn',
    adminUrl: 'https://wxb.cn/admin',
    officialOrgCount: 128,
    trialOrgCount: 16,
    disabledOrgCount: 2,
    trashOrgCount: 0,
    appKey: 'kn_wxb_89f023ac91e',
    appSecret: 'sec_98ab71c08fe4512903ea890124',
    status: 'active',
    activeAccounts: 5820,
    dailyCalls: 3240500,
    healthScore: 100,
    qpsLimit: 500,
    redirectUri: 'https://wxb.cn/oauth2/callback',
    ownerDept: '网络生态综合治理指挥中心',
    ownerName: '周正明',
    syncInterval: '实时 Webhook',
    integratedAt: '2025-01-10',
    description: '人工智能+网络生态综合治理',
    iconBg: 'from-blue-700 via-indigo-800 to-slate-900',
    enableExtUserSystem: true,
    extWechatMpName: '正管用平台',
    extWechatAppId: 'wx1100223344556601',
    extWechatAppSecret: 'sec_1100223344556601_key',
    extWechatToken: 'kn_token_zhengguanyong',
    extWechatEncodingAesKey: '54dcba9876543210fedcba9876543210fedcba987654'
  },
  {
    id: 'app-02',
    appCode: 'V8-P-02',
    appName: '谛听预警 - 双智协同全媒体态势感知预警系统',
    appShortName: '谛听预警',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://yuing.cn',
    officialOrgCount: 96,
    trialOrgCount: 12,
    disabledOrgCount: 1,
    trashOrgCount: 0,
    appKey: 'kn_dt_77a102bc45f',
    appSecret: 'sec_1188bb3322aa99887766554433',
    status: 'active',
    activeAccounts: 4360,
    dailyCalls: 2180000,
    healthScore: 99,
    qpsLimit: 400,
    redirectUri: 'https://yuing.cn/oauth2/callback',
    ownerDept: '态势感知与智能预警处',
    ownerName: '林海峰',
    syncInterval: '秒级流式推送',
    integratedAt: '2025-02-15',
    description: '谛听八方风雨，预警全域波澜',
    iconBg: 'from-amber-600 via-orange-600 to-red-700'
  },
  {
    id: 'app-03',
    appCode: 'V8-P-03',
    appName: '河图融媒体 - 双智协同全媒体传播分析系统',
    appShortName: '河图融媒体',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://rmt.cn',
    officialOrgCount: 85,
    trialOrgCount: 10,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_ht_3399ab77ff1',
    appSecret: 'sec_778899aabbccddeeff00112233',
    status: 'active',
    activeAccounts: 3950,
    dailyCalls: 1850000,
    healthScore: 100,
    qpsLimit: 350,
    redirectUri: 'https://rmt.cn/oauth2/callback',
    ownerDept: '全媒体传播效能评估部',
    ownerName: '赵云翔',
    syncInterval: '实时计算引擎',
    integratedAt: '2025-03-01',
    description: '统算全媒脉络，衍演传播真知',
    iconBg: 'from-purple-700 via-indigo-700 to-violet-900'
  },
  {
    id: 'app-04',
    appCode: 'V8-P-04',
    appName: '极速舆情 - 互联网舆情监测预警系统',
    appShortName: '极速舆情',
    appCategory: '企业应用',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://yuqing.com.cn',
    officialOrgCount: 142,
    trialOrgCount: 28,
    disabledOrgCount: 3,
    trashOrgCount: 1,
    appKey: 'kn_jsyq_4499bbee33a',
    appSecret: 'sec_332211aabbccddeeff778899',
    status: 'active',
    activeAccounts: 6890,
    dailyCalls: 4520000,
    healthScore: 100,
    qpsLimit: 600,
    redirectUri: 'https://yuqing.com.cn/oauth2/callback',
    ownerDept: '应急响应与舆情督办部',
    ownerName: '陈志强',
    syncInterval: '毫秒级感知',
    integratedAt: '2024-12-01',
    description: '追风极速响应，鉴察舆论秋毫',
    iconBg: 'from-red-600 via-rose-600 to-orange-700'
  },
  {
    id: 'app-05',
    appCode: 'V8-P-05',
    appName: '数解舆情 - 双智慧（R）全媒体平台信息监测预警系统',
    appShortName: '数解舆情',
    appCategory: '企业应用',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://yuqing.pro',
    officialOrgCount: 110,
    trialOrgCount: 15,
    disabledOrgCount: 2,
    trashOrgCount: 0,
    appKey: 'kn_sjyq_9944aacc11e',
    appSecret: 'sec_44556677889900aabbccddeeff',
    status: 'active',
    activeAccounts: 4780,
    dailyCalls: 2640000,
    healthScore: 98,
    qpsLimit: 400,
    redirectUri: 'https://yuqing.pro/oauth2/callback',
    ownerDept: '深度数据挖掘与算法中心',
    ownerName: '吴文彬',
    syncInterval: '5分钟批处理+实时',
    integratedAt: '2025-04-18',
    description: '数算全域真伪，解明万象清浊',
    iconBg: 'from-cyan-600 via-blue-700 to-indigo-800'
  },
  {
    id: 'app-06',
    appCode: 'V8-P-06',
    appName: '牧网守正 - 属地网络内容生态治理系统',
    appShortName: '牧网守正',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://shudi.cn',
    officialOrgCount: 76,
    trialOrgCount: 8,
    disabledOrgCount: 1,
    trashOrgCount: 0,
    appKey: 'kn_mwsz_5522ddeeff3',
    appSecret: 'sec_556677889900aabbccddee1122',
    status: 'active',
    activeAccounts: 3120,
    dailyCalls: 1420000,
    healthScore: 100,
    qpsLimit: 300,
    redirectUri: 'https://shudi.cn/oauth2/callback',
    ownerDept: '属地网格化治理监管处',
    ownerName: '孙立新',
    syncInterval: '网格化同步',
    integratedAt: '2025-05-20',
    description: '镇守数字疆域，护佑清朗空间',
    iconBg: 'from-emerald-700 via-teal-800 to-slate-900'
  },
  {
    id: 'app-07',
    appCode: 'V8-P-07',
    appName: '全球眼 - 境外公开信息监测预警系统',
    appShortName: '全球眼',
    appCategory: '企业应用',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://qqy.net.cn',
    officialOrgCount: 62,
    trialOrgCount: 9,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_qqy_8811eeff44c',
    appSecret: 'sec_11223344556677889900aabbcc',
    status: 'active',
    activeAccounts: 2450,
    dailyCalls: 980000,
    healthScore: 99,
    qpsLimit: 250,
    redirectUri: 'https://qqy.net.cn/oauth2/callback',
    ownerDept: '海外开源情报研判中心',
    ownerName: '郑远博',
    syncInterval: '全天候巡航',
    integratedAt: '2025-06-15',
    description: '纵览寰宇风云，洞穿海外先机',
    iconBg: 'from-blue-600 via-sky-600 to-cyan-800'
  },
  {
    id: 'app-08',
    appCode: 'V8-P-08',
    appName: '看讯 - 互联网视频与直播监测分析系统',
    appShortName: '看讯',
    appCategory: '企业应用',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://kanxun.cn',
    officialOrgCount: 88,
    trialOrgCount: 14,
    disabledOrgCount: 2,
    trashOrgCount: 0,
    appKey: 'kn_kx_7733ffaa11b',
    appSecret: 'sec_99887766554433221100aabb',
    status: 'unpublished',
    activeAccounts: 3880,
    dailyCalls: 1670000,
    healthScore: 100,
    qpsLimit: 450,
    redirectUri: 'https://kanxun.cn/oauth2/callback',
    ownerDept: '音视频智能审查实验室',
    ownerName: '王晓宇',
    syncInterval: '实时流解析',
    integratedAt: '2025-07-08',
    description: '尽览视界万象，明辨光影真伪',
    iconBg: 'from-fuchsia-600 via-pink-600 to-rose-700'
  },
  {
    id: 'app-09',
    appCode: 'V8-P-09',
    appName: '点点密信 - 跨平台加密即时通讯系统',
    appShortName: '点点密信',
    appCategory: '基础服务',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://dianIM.cn',
    officialOrgCount: 160,
    trialOrgCount: 22,
    disabledOrgCount: 1,
    trashOrgCount: 0,
    appKey: 'kn_ddmx_6633ccdd22a',
    appSecret: 'sec_9900112233445566778899aabb',
    status: 'published',
    activeAccounts: 8900,
    dailyCalls: 5120000,
    healthScore: 100,
    qpsLimit: 800,
    redirectUri: 'https://dianIM.cn/oauth2/callback',
    ownerDept: '安全通信与指挥调度保障部',
    ownerName: '高建国',
    syncInterval: '端到端加密通道',
    integratedAt: '2024-10-10',
    description: '加密通信点对点，应急指挥安如山',
    iconBg: 'from-slate-700 via-slate-800 to-slate-950'
  },
  {
    id: 'app-10',
    appCode: 'V8-P-10',
    appName: '点点速报 - 清朗净网鉴谣速报系统',
    appShortName: '点点速报',
    appCategory: '企业应用',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://subao.cn',
    officialOrgCount: 105,
    trialOrgCount: 18,
    disabledOrgCount: 1,
    trashOrgCount: 0,
    appKey: 'kn_ddsb_2211bbcc44e',
    appSecret: 'sec_554433221100998877665544',
    status: 'unpublished',
    activeAccounts: 4620,
    dailyCalls: 2890000,
    healthScore: 99,
    qpsLimit: 500,
    redirectUri: 'https://subao.cn/oauth2/callback',
    ownerDept: '谣言核查与辟谣速报中枢',
    ownerName: '刘敏捷',
    syncInterval: '秒级触发广播',
    integratedAt: '2025-08-01',
    description: '网格鸣哨示警，讯息秒达中枢',
    iconBg: 'from-amber-500 via-orange-600 to-red-600',
    enableExtUserSystem: true,
    extWechatMpName: '点点速报',
    extWechatAppId: 'wx1029384756102938',
    extWechatAppSecret: 'sec_1029384756102938_key',
    extWechatToken: 'kn_token_ddsb_subao',
    extWechatEncodingAesKey: '76fedcba9876543210fedcba9876543210fedcba9876'
  },
  {
    id: 'app-11',
    appCode: 'V8-P-11',
    appName: '观澜热媒 - 互联网热榜监测分析系统',
    appShortName: '观澜热媒',
    appCategory: '企业应用',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://remei.cn',
    officialOrgCount: 92,
    trialOrgCount: 11,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_glrm_1144aaff88c',
    appSecret: 'sec_889900112233445566778899',
    status: 'active',
    activeAccounts: 3740,
    dailyCalls: 1950000,
    healthScore: 100,
    qpsLimit: 400,
    redirectUri: 'https://remei.cn/oauth2/callback',
    ownerDept: '热点议题与趋势研判组',
    ownerName: '张观澜',
    syncInterval: '全网热榜实时聚合',
    integratedAt: '2025-09-12',
    description: '观热媒波澜，判热点走向',
    iconBg: 'from-orange-500 via-rose-600 to-red-700'
  },
  {
    id: 'app-12',
    appCode: 'V8-P-12',
    appName: '点点速评 - 网络宣传指挥效果分析系统',
    appShortName: '点点速评',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://suping.cn',
    officialOrgCount: 115,
    trialOrgCount: 16,
    disabledOrgCount: 2,
    trashOrgCount: 0,
    appKey: 'kn_ddsp_3366ccbb55e',
    appSecret: 'sec_223344556677889900112233',
    status: 'disabled',
    activeAccounts: 5120,
    dailyCalls: 3100000,
    healthScore: 100,
    qpsLimit: 550,
    redirectUri: 'https://suping.cn/oauth2/callback',
    ownerDept: '网络宣传效果综合督导部',
    ownerName: '何速平',
    syncInterval: '交互式指令下达',
    integratedAt: '2025-10-05',
    description: '一指直达、速速响应',
    iconBg: 'from-indigo-600 via-blue-600 to-cyan-700',
    enableExtUserSystem: true,
    extWechatMpName: '点点速评',
    extWechatAppId: 'wx1234567890abcdef',
    extWechatAppSecret: 'sec_1234567890abcdef_key',
    extWechatToken: 'kn_token_ddsp_suping',
    extWechatEncodingAesKey: '87fedcba9876543210fedcba9876543210fedcba9876'
  },
  {
    id: 'app-13',
    appCode: 'V8-P-13',
    appName: '百战演练 - 社会治理虚拟仿真演练系统',
    appShortName: '百战演练',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://yanlian.cn',
    officialOrgCount: 58,
    trialOrgCount: 6,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_bzyl_7788aabb44d',
    appSecret: 'sec_776655443322110099887766',
    status: 'active',
    activeAccounts: 2180,
    dailyCalls: 760000,
    healthScore: 97,
    qpsLimit: 200,
    redirectUri: 'https://yanlian.cn/oauth2/callback',
    ownerDept: '推演沙盘与仿真推演实验室',
    ownerName: '黄百战',
    syncInterval: '沙盘仿真推演',
    integratedAt: '2025-11-20',
    description: '沙盘推演百战，现实从容不殆',
    iconBg: 'from-emerald-700 via-teal-800 to-slate-900'
  },
  {
    id: 'app-14',
    appCode: 'V8-M-14',
    appName: '全网搜 - 全媒体即时搜索引擎',
    appShortName: '全网搜',
    appCategory: '基础服务',
    appLevel: 'feature',
    protocol: 'OAuth 2.0',
    roleType: 'no_role',
    homeUrl: 'https://qws.cn',
    officialOrgCount: 180,
    trialOrgCount: 30,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_qws_9900eedd11f',
    appSecret: 'sec_443322110099887766554433',
    status: 'active',
    activeAccounts: 12500,
    dailyCalls: 8900000,
    healthScore: 100,
    qpsLimit: 1200,
    redirectUri: 'https://qws.cn/oauth2/callback',
    ownerDept: '全网分布式检索技术中枢',
    ownerName: '宋全搜',
    syncInterval: '毫秒级索引探查',
    integratedAt: '2024-09-01',
    description: '指尖一点搜全域，毫秒同频探真源',
    iconBg: 'from-cyan-600 via-blue-600 to-indigo-700'
  },
  {
    id: 'app-15',
    appCode: 'V8-M-15',
    appName: '消息中心 - 全域多渠道统一消息通知中枢',
    appShortName: '消息中心',
    appCategory: '基础服务',
    appLevel: 'feature',
    protocol: 'OAuth 2.0',
    roleType: 'no_role',
    homeUrl: 'https://msg.konne.cn',
    officialOrgCount: 210,
    trialOrgCount: 15,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_msg_1122334455a',
    appSecret: 'sec_msg99887766554433221100aa',
    status: 'active',
    activeAccounts: 16800,
    dailyCalls: 12400000,
    healthScore: 100,
    qpsLimit: 2000,
    redirectUri: 'https://msg.konne.cn/oauth2/callback',
    ownerDept: '基础技术中台消息组',
    ownerName: '王通达',
    syncInterval: '高并发异步队列',
    integratedAt: '2024-08-15',
    description: '聚合邮件、短信、企微、系统站内信等多通道触达中枢',
    iconBg: 'from-teal-600 via-emerald-600 to-cyan-700'
  },
  {
    id: 'app-16',
    appCode: 'V8-M-16',
    appName: '数据仓库 - 企业统一湖仓一体指标与数据中枢',
    appShortName: '数据仓库',
    appCategory: '业务中台',
    appLevel: 'feature',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://dwh.konne.cn',
    officialOrgCount: 135,
    trialOrgCount: 12,
    disabledOrgCount: 1,
    trashOrgCount: 0,
    appKey: 'kn_dwh_7788990011b',
    appSecret: 'sec_dwh11223344556677889900bb',
    status: 'active',
    activeAccounts: 5400,
    dailyCalls: 6800000,
    healthScore: 100,
    qpsLimit: 800,
    redirectUri: 'https://dwh.konne.cn/oauth2/callback',
    ownerDept: '大数据与数据智能治理部',
    ownerName: '李数仓',
    syncInterval: '实时CDC与离线批计算',
    integratedAt: '2024-07-20',
    description: '统一多源异构业务数据资产，提供标准指标与数据服务接口',
    iconBg: 'from-blue-700 via-indigo-800 to-slate-900'
  },
  {
    id: 'app-17',
    appCode: 'V8-P-17',
    appName: '网络指令上传下达系统',
    appShortName: '指令流转',
    appCategory: '业务中台',
    appLevel: 'product',
    protocol: 'OAuth 2.0',
    roleType: 'with_role',
    homeUrl: 'https://zhiling.v8.cn',
    officialOrgCount: 86,
    trialOrgCount: 12,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    appKey: 'kn_zllz_778899aabb',
    appSecret: 'sec_zllz_998877665544332211',
    status: 'active',
    activeAccounts: 4180,
    dailyCalls: 2350000,
    healthScore: 100,
    qpsLimit: 500,
    redirectUri: 'https://zhiling.v8.cn/oauth2/callback',
    ownerDept: '网络指令流转与应急调度中心',
    ownerName: '赵令通',
    syncInterval: '实时 Webhook',
    integratedAt: '2025-06-01',
    description: '网络指令上传下达系统，实现扁平化指令秒级触达与闭环流转',
    iconBg: 'from-blue-600 via-indigo-700 to-cyan-800',
    enableExtUserSystem: true,
    extWechatMpName: '指令流转',
    extWechatAppId: 'wx8921a980cbf17001',
    extWechatAppSecret: 'sec_8921a980cbf17001_key',
    extWechatToken: 'kn_token_zhiling',
    extWechatEncodingAesKey: '43cba9876543210fedcba9876543210fedcba987654'
  }
];

// Dedicated semantic icon graphic renderer based on the specific application's explanation and meaning
export const renderAppSemanticIcon = (appCode: string, appShortName?: string, size: 'sm' | 'md' | 'lg' = 'md', customIconUrl?: string) => {
  if (customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt={appShortName || '应用图标'}
        className="w-full h-full object-contain rounded-xl"
      />
    );
  }

  const code = (appCode || '').toUpperCase();
  const name = appShortName || '';
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';

  // 1. 正管用 (人工智能+网络生态综合治理)
  if (code.includes('WXB') || name.includes('正管用')) {
    return (
      <div className="relative flex items-center justify-center">
        <ShieldCheck className={`${iconSize} stroke-[2.2] text-cyan-200 drop-shadow-xs`} />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse ring-1 ring-white/50" />
      </div>
    );
  }

  // 2. 谛听预警 (谛听八方风雨，预警全域波澜)
  if (code.includes('DITING') || name.includes('谛听')) {
    return (
      <div className="relative flex items-center justify-center">
        <Radio className={`${iconSize} stroke-[2.2] text-amber-200`} />
        <Waves className="w-3.5 h-3.5 text-yellow-300 absolute -bottom-1 -right-1 opacity-90" />
      </div>
    );
  }

  // 3. 河图融媒体 (统算全媒脉络，衍演传播真知)
  if (code.includes('HETU') || name.includes('河图')) {
    return (
      <div className="relative flex items-center justify-center">
        <Network className={`${iconSize} stroke-[2.2] text-purple-200`} />
        <Sparkles className="w-3 h-3 text-pink-300 absolute -top-1 -right-1" />
      </div>
    );
  }

  // 4. 极速舆情 (追风极速响应，鉴察舆论秋毫)
  if (code.includes('JSYQ') || name.includes('极速')) {
    return (
      <div className="relative flex items-center justify-center">
        <Zap className={`${iconSize} stroke-[2.4] text-yellow-200 drop-shadow-xs fill-yellow-400/20`} />
        <Activity className="w-3 h-3 text-rose-200 absolute -bottom-1 -right-1" />
      </div>
    );
  }

  // 5. 数解舆情 (数算全域真伪，解明万象清浊)
  if (code.includes('SJYQ') || name.includes('数解')) {
    return (
      <div className="relative flex items-center justify-center">
        <BrainCircuit className={`${iconSize} stroke-[2.2] text-sky-200`} />
        <Binary className="w-3.5 h-3.5 text-cyan-300 absolute -top-1 -right-1.5 opacity-90" />
      </div>
    );
  }

  // 6. 牧网守正 (镇守数字疆域，护佑清朗空间)
  if (code.includes('MWSZ') || name.includes('牧网')) {
    return (
      <div className="relative flex items-center justify-center">
        <Landmark className={`${iconSize} stroke-[2.2] text-emerald-200`} />
        <Shield className="w-3 h-3 text-teal-300 absolute -bottom-1 -right-1" />
      </div>
    );
  }

  // 7. 全球眼 (纵览寰宇风云，洞穿海外先机)
  if (code.includes('QQY') || name.includes('全球眼')) {
    return (
      <div className="relative flex items-center justify-center">
        <Globe2 className={`${iconSize} stroke-[2.2] text-sky-200`} />
        <Crosshair className="w-3.5 h-3.5 text-blue-200 absolute inset-0 m-auto opacity-75" />
      </div>
    );
  }

  // 8. 看讯 (尽览视界万象，明辨光影真伪)
  if (code.includes('KANXUN') || name.includes('看讯')) {
    return (
      <div className="relative flex items-center justify-center">
        <Video className={`${iconSize} stroke-[2.2] text-pink-200`} />
        <Eye className="w-3 h-3 text-fuchsia-300 absolute -bottom-1 -right-1" />
      </div>
    );
  }

  // 9. 点点密信 (加密通信点对点，应急指挥安如山)
  if (code.includes('DDMX') || name.includes('密信')) {
    return (
      <div className="relative flex items-center justify-center">
        <Lock className={`${iconSize} stroke-[2.2] text-slate-200`} />
        <MessageSquare className="w-3.5 h-3.5 text-cyan-300 absolute -top-1 -right-1.5 opacity-85" />
      </div>
    );
  }

  // 10. 点点速豹 (网格鸣哨示警，讯息秒达中枢)
  if (code.includes('DDSB') || name.includes('速豹')) {
    return (
      <div className="relative flex items-center justify-center">
        <Megaphone className={`${iconSize} stroke-[2.2] text-amber-200`} />
        <Zap className="w-3.5 h-3.5 text-red-300 absolute -bottom-1 -right-1 fill-red-400" />
      </div>
    );
  }

  // 11. 观澜热媒 (观热媒波澜，判热点走向)
  if (code.includes('GLRM') || name.includes('观澜') || name.includes('热媒')) {
    return (
      <div className="relative flex items-center justify-center">
        <Flame className={`${iconSize} stroke-[2.2] text-orange-200 fill-orange-400/30`} />
        <TrendingUp className="w-3.5 h-3.5 text-yellow-300 absolute -bottom-1 -right-1 font-bold" />
      </div>
    );
  }

  // 12. 点点速评 (一指直达、速速响应)
  if (code.includes('DDSP') || name.includes('速评')) {
    return (
      <div className="relative flex items-center justify-center">
        <MousePointerClick className={`${iconSize} stroke-[2.2] text-indigo-200`} />
        <Target className="w-3 h-3 text-cyan-300 absolute -top-1 -right-1" />
      </div>
    );
  }

  // 13. 百战演练 (沙盘推演百战，现实从容不殆)
  if (code.includes('BZYL') || name.includes('百战') || name.includes('演练')) {
    return (
      <div className="relative flex items-center justify-center">
        <Swords className={`${iconSize} stroke-[2.2] text-teal-200`} />
        <Layers className="w-3 h-3 text-emerald-300 absolute -bottom-1 -right-1 opacity-90" />
      </div>
    );
  }

  // 14. 全网搜 (指尖一点搜全域，毫秒同频探真源)
  if (code.includes('QWS') || name.includes('全网搜')) {
    return (
      <div className="relative flex items-center justify-center">
        <Search className={`${iconSize} stroke-[2.4] text-cyan-200`} />
        <Sparkles className="w-3.5 h-3.5 text-blue-300 absolute -top-1 -right-1.5 animate-pulse" />
      </div>
    );
  }

  // 15. 消息中心 (全域多渠道统一消息通知中枢)
  if (code.includes('MSG') || name.includes('消息中心') || name.includes('消息')) {
    return (
      <div className="relative flex items-center justify-center">
        <MessageSquare className={`${iconSize} stroke-[2.2] text-teal-200`} />
        <Megaphone className="w-3.5 h-3.5 text-cyan-300 absolute -bottom-1 -right-1" />
      </div>
    );
  }

  // 16. 数据仓库 (企业统一湖仓一体指标与数据中枢)
  if (code.includes('DWH') || name.includes('数据仓库') || name.includes('数仓')) {
    return (
      <div className="relative flex items-center justify-center">
        <Database className={`${iconSize} stroke-[2.2] text-sky-200`} />
        <Layers className="w-3.5 h-3.5 text-indigo-300 absolute -top-1 -right-1" />
      </div>
    );
  }

  // Fallback icon
  return <Boxes className={`${iconSize} text-white`} />;
};

// Helper to get system initials for icon
function getSystemIconAbbr(appCode: string, appName: string) {
  if (appCode.includes('CRM')) return 'CRM';
  if (appCode.includes('ERP')) return 'ERP';
  if (appCode.includes('OA')) return 'OA';
  if (appCode.includes('WIKI')) return 'WIKI';
  if (appCode.includes('FIN')) return 'FIN';
  if (appCode.includes('MES')) return 'MES';
  if (appCode.includes('BI')) return 'BI';
  if (appCode.includes('VISIT')) return '访客';
  if (appCode.includes('WMS')) return 'WMS';
  if (appCode.includes('SURVEY')) return '问卷';
  if (appCode.includes('MSG') || appName.includes('消息')) return '消息';
  if (appCode.includes('DWH') || appName.includes('数仓') || appName.includes('数据仓库')) return '数仓';
  return appName.substring(0, 2);
}

/**
 * 校验应用唯一 ID 规则：
 * 1. 必须以“V8-”开头
 * 2. 标识符要求：如果是产品级应用，应该用“P”作为标识；如果是功能级应用，应该用“M”做标识
 * 3. 后面的数字在整个系统内不可重复，且必须是整数
 */
export function validateAppCode(
  code: string,
  appLevel: 'product' | 'feature',
  existingApps: IntegratedApp[],
  currentEditingId?: string
): { isValid: boolean; error?: string; parsedNum?: number; ruleChecks: { startsWithV8: boolean; hasCorrectIdentifier: boolean; isInteger: boolean; isUnique: boolean } } {
  const trimmed = (code || '').trim().toUpperCase();
  
  const ruleChecks = {
    startsWithV8: false,
    hasCorrectIdentifier: false,
    isInteger: false,
    isUnique: false,
  };

  if (!trimmed) {
    return { isValid: false, error: '请输入应用唯一 ID', ruleChecks };
  }

  // 1. 必须以“V8-”开头
  ruleChecks.startsWithV8 = trimmed.startsWith('V8-');
  if (!ruleChecks.startsWithV8) {
    return {
      isValid: false,
      error: '应用唯一 ID 必须以“V8-”开头（例如：' + (appLevel === 'product' ? 'V8-P-01' : 'V8-M-01') + '）',
      ruleChecks
    };
  }

  // 2. 标识符要求：如果是产品级应用，应该用“P”作为标识；如果是功能级应用，应该用“M”做标识
  const requiredPrefix = appLevel === 'product' ? 'V8-P-' : 'V8-M-';
  ruleChecks.hasCorrectIdentifier = trimmed.startsWith(requiredPrefix);
  if (!ruleChecks.hasCorrectIdentifier) {
    if (appLevel === 'product' && trimmed.startsWith('V8-M-')) {
      return {
        isValid: false,
        error: '当前应用级别为【产品级应用】，标识符必须为“P”（正确格式为：V8-P-数字，例如：V8-P-01）',
        ruleChecks
      };
    }
    if (appLevel === 'feature' && trimmed.startsWith('V8-P-')) {
      return {
        isValid: false,
        error: '当前应用级别为【功能级应用】，标识符必须为“M”（正确格式为：V8-M-数字，例如：V8-M-01）',
        ruleChecks
      };
    }
    return {
      isValid: false,
      error: `应用唯一 ID 标识符不正确，${appLevel === 'product' ? '产品级应用' : '功能级应用'}必须以“${requiredPrefix}”开头`,
      ruleChecks
    };
  }

  // 3. 后面的数字必须是整数
  const numPart = trimmed.slice(requiredPrefix.length);
  if (!numPart) {
    return {
      isValid: false,
      error: `请在标识符后填写整数序号（例如：${requiredPrefix}01）`,
      ruleChecks
    };
  }

  if (!/^\d+$/.test(numPart)) {
    return {
      isValid: false,
      error: '标识符后面的序号必须为纯整数数字（例如：01、02、17）',
      ruleChecks
    };
  }

  const parsedNum = parseInt(numPart, 10);
  if (isNaN(parsedNum) || parsedNum <= 0) {
    return {
      isValid: false,
      error: '序号必须为大于 0 的有效正整数',
      ruleChecks
    };
  }
  ruleChecks.isInteger = true;

  // 4. 后面的数字在整个系统内不可重复
  const conflictingApp = existingApps.find(app => {
    if (currentEditingId && app.id === currentEditingId) return false;
    
    // 完全相同编码
    if (app.appCode.toUpperCase() === trimmed) return true;

    // 检查数字是否冲突（V8-P-XX 或 V8-M-XX 或 原编码末尾数字）
    const match = app.appCode.toUpperCase().match(/(\d+)$/);
    if (match) {
      return parseInt(match[1], 10) === parsedNum;
    }
    return false;
  });

  if (conflictingApp) {
    const appDisplayName = conflictingApp.appName.split(' - ')[0] || conflictingApp.appName;
    return {
      isValid: false,
      error: `序号数字「${numPart}」在系统内已存在（已分配给「${appDisplayName}」[${conflictingApp.appCode}]），不可重复使用`,
      ruleChecks
    };
  }

  ruleChecks.isUnique = true;
  return { isValid: true, parsedNum, ruleChecks };
}

/**
 * 自动计算系统下一个可用的应用唯一 ID
 */
export function getNextAvailableAppCode(appLevel: 'product' | 'feature', existingApps: IntegratedApp[]): string {
  const usedNumbers = new Set<number>();
  existingApps.forEach(a => {
    const match = a.appCode.match(/(\d+)$/);
    if (match) {
      usedNumbers.add(parseInt(match[1], 10));
    }
  });
  let nextNum = 1;
  while (usedNumbers.has(nextNum)) {
    nextNum++;
  }
  const prefix = appLevel === 'product' ? 'V8-P-' : 'V8-M-';
  return `${prefix}${nextNum < 10 ? '0' + nextNum : nextNum}`;
}

export interface AppManagementProps {
  onNavigateToExtUserConfig?: (appCode: string) => void;
  sharedMenus?: SysMenuItem[];
  onSharedMenusChange?: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
  sharedPrimaryPerms?: PrimaryPermItem[];
  onSharedPrimaryPermsChange?: (perms: PrimaryPermItem[]) => void;
  sharedDefaultRoles?: DefaultRoleItem[];
  onSharedDefaultRolesChange?: (roles: DefaultRoleItem[]) => void;
  sharedCustomerOrgs?: CustomerOrgItem[];
  onSharedCustomerOrgsChange?: (orgs: CustomerOrgItem[]) => void;
}

export const AppManagement: React.FC<AppManagementProps> = ({
  onNavigateToExtUserConfig,
  sharedMenus,
  onSharedMenusChange,
  sharedPrimaryPerms,
  onSharedPrimaryPermsChange,
  sharedDefaultRoles,
  onSharedDefaultRolesChange,
  sharedCustomerOrgs,
  onSharedCustomerOrgsChange
}) => {
  const [apps, setApps] = useState<IntegratedApp[]>(INITIAL_APPS);
  
  // Primary Search and Filter States
  const [appLevelFilter, setAppLevelFilter] = useState<'全部' | 'product' | 'feature'>('全部');
  const [roleTypeFilter, setRoleTypeFilter] = useState<'全部' | 'with_role' | 'no_role'>('全部');
  const [extUserFilter, setExtUserFilter] = useState<'全部' | 'enabled' | 'disabled'>('全部');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'card'>('card');

  // Modals & Navigation
  const [isCreatingApp, setIsCreatingApp] = useState(false);
  const [isWizardFlow, setIsWizardFlow] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4>(1);
  const [step2InitialTab, setStep2InitialTab] = useState<
    | 'basic_info'
    | 'customer_orgs'
    | 'default_roles'
    | 'permission_dict'
    | 'menu_manage'
    | 'analytics_board'
    | 'data_dict'
    | 'ext_user_config'
    | 'page_modules'
    | 'client_modules'
    | 'app_publish'
  >('basic_info');
  const [step1Feedback, setStep1Feedback] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedApp, setSelectedApp] = useState<IntegratedApp | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Sub-action Modals: 机构管理 / 组织架构 / 用户账号 / 角色管理 / 权限管理
  const [activeModal, setActiveModal] = useState<{
    app: IntegratedApp;
    type: 'org_manage' | 'org_arch' | 'user_account' | 'role_manage' | 'permission_manage';
  } | null>(null);

  // New App form state
  const [newAppForm, setNewAppForm] = useState({
    id: '',
    appCode: '',
    appName: '',
    appShortName: '',
    appLevel: 'product' as 'product' | 'feature',
    roleType: 'with_role' as 'with_role' | 'no_role',
    homeUrl: '',
    adminUrl: '',
    appIcon: '',
    appIconName: '',
    productManager: '张伟',
    appCategory: '业务中台' as any,
    protocol: 'OAuth 2.0' as any,
    officialOrgCount: 0,
    trialOrgCount: 0,
    disabledOrgCount: 0,
    trashOrgCount: 0,
    redirectUri: '',
    ownerDept: '技术研发中心',
    ownerName: '张华',
    qpsLimit: 200,
    description: '',
    status: 'unpublished' as 'published' | 'unpublished' | 'disabled',
    // 外部用户体系配置
    enableExtUserSystem: false,
    extWechatMpName: '',
    extWechatAppId: '',
    extWechatAppSecret: '',
    extWechatToken: '',
    extWechatEncodingAesKey: '',
    extWechatQrCode: '',
    extWechatQrCodeName: '',
    pageModules: ALL_UNIFIED_MODULE_KEYS,
    clientConfigs: {} as AppClientModules
  });

  // External User Wechat QR Code Upload States & Handlers
  const extQrInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingExtQr, setIsDraggingExtQr] = useState(false);
  const [extQrUploadError, setExtQrUploadError] = useState<string | null>(null);
  const [showExtSecret, setShowExtSecret] = useState(false);

  const handleExtQrFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_ICON_EXTENSIONS.includes(ext) && !ALLOWED_ICON_MIME_TYPES.includes(file.type)) {
      setExtQrUploadError('不支持该文件格式。仅支持上传 JPG、JPEG、GIF、PNG 和 SVG 格式的图片！');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setExtQrUploadError('文件大小超出限制，二维码图片大小不可超过 5MB！');
      return;
    }

    setExtQrUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewAppForm(prev => ({
        ...prev,
        extWechatQrCode: dataUrl,
        extWechatQrCodeName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveExtQr = () => {
    setNewAppForm(prev => ({
      ...prev,
      extWechatQrCode: '',
      extWechatQrCodeName: ''
    }));
    setExtQrUploadError(null);
    if (extQrInputRef.current) {
      extQrInputRef.current.value = '';
    }
  };

  // App Icon Upload States & Handlers
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);

  const ALLOWED_ICON_EXTENSIONS = ['jpg', 'jpeg', 'gif', 'png', 'svg'];
  const ALLOWED_ICON_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

  const handleIconFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Check format
    if (!ALLOWED_ICON_EXTENSIONS.includes(ext) && !ALLOWED_ICON_MIME_TYPES.includes(file.type)) {
      setIconUploadError('不支持该文件格式。仅支持上传 JPG、JPEG、GIF、PNG 和 SVG 格式的图标图片！');
      return;
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setIconUploadError('文件大小超出限制，图标大小不可超过 5MB！');
      return;
    }

    setIconUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setNewAppForm(prev => ({
        ...prev,
        appIcon: dataUrl,
        appIconName: file.name
      }));
      setFormErrors(prev => ({ ...prev, appIcon: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setNewAppForm(prev => ({
      ...prev,
      appIcon: '',
      appIconName: ''
    }));
    setIconUploadError(null);
    if (iconInputRef.current) {
      iconInputRef.current.value = '';
    }
  };

  // Product Manager Searchable Combobox Dropdown State
  const [isPmDropdownOpen, setIsPmDropdownOpen] = useState(false);
  const pmDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pmDropdownRef.current && !pmDropdownRef.current.contains(e.target as Node)) {
        setIsPmDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Apps List (停用状态排在列表最下面)
  const filteredApps = apps
    .filter(app => {
      // 1. Filter by App Level (产品级应用 / 功能级应用)
      const matchesAppLevel = appLevelFilter === '全部' || 
        (appLevelFilter === 'product' && (app.appLevel || 'product') === 'product') ||
        (appLevelFilter === 'feature' && app.appLevel === 'feature');

      // 2. Filter by Role Type (有角色应用 / 无角色应用)
      const matchesRoleType = roleTypeFilter === '全部' || app.roleType === roleTypeFilter;

      // 3. Filter by External User System (外部用户体系: 全部 / 已开启 / 未开启)
      const matchesExtUser = extUserFilter === '全部' ||
        (extUserFilter === 'enabled' && !!app.enableExtUserSystem) ||
        (extUserFilter === 'disabled' && !app.enableExtUserSystem);

      // 4. Status filter (运行状态: 全部状态 / 已发布 / 未发布 / 停用)
      const matchesStatus = statusFilter === '全部' ||
        (statusFilter === '已发布' && (app.status === 'published' || app.status === 'active' || !app.status)) ||
        (statusFilter === '未发布' && (app.status === 'unpublished' || app.status === 'testing')) ||
        (statusFilter === '停用' && app.status === 'disabled') ||
        (statusFilter === '正常运行' && (app.status === 'published' || app.status === 'active' || !app.status)) ||
        (statusFilter === '联调中' && (app.status === 'unpublished' || app.status === 'testing')) ||
        (statusFilter === '已关停' && app.status === 'disabled');

      return matchesAppLevel && matchesRoleType && matchesExtUser && matchesStatus;
    })
    .sort((a, b) => {
      // 停用状态排在列表最下面
      const aDisabled = a.status === 'disabled' ? 1 : 0;
      const bDisabled = b.status === 'disabled' ? 1 : 0;
      return aDisabled - bDisabled;
    });

  // KPI Calculations
  const totalAppsCount = apps.length;
  const productAppsCount = apps.filter(a => (a.appLevel || 'product') === 'product').length;
  const featureAppsCount = apps.filter(a => a.appLevel === 'feature').length;
  const withRoleAppsCount = apps.filter(a => a.roleType === 'with_role').length;
  const noRoleAppsCount = apps.filter(a => a.roleType === 'no_role').length;
  const extUserEnabledCount = apps.filter(a => !!a.enableExtUserSystem).length;
  const extUserDisabledCount = apps.filter(a => !a.enableExtUserSystem).length;

  const moveAppUp = (id: string) => {
    setApps(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const moveAppDown = (id: string) => {
    setApps(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const toggleSecretReveal = (id: string) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppForm.appCode || !newAppForm.appName) return;

    const randomKey = `kn_${newAppForm.appCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 9)}`;
    const randomSecret = `sec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const created: IntegratedApp = {
      id: `app-${Date.now()}`,
      appCode: newAppForm.appCode.toUpperCase(),
      appName: newAppForm.appName,
      appShortName: newAppForm.appShortName || newAppForm.appName.substring(0, 4),
      appLevel: newAppForm.appLevel || 'product',
      roleType: newAppForm.roleType,
      homeUrl: newAppForm.homeUrl || `https://${newAppForm.appCode.toLowerCase()}.konne.cn`,
      officialOrgCount: Number(newAppForm.officialOrgCount) || 1,
      trialOrgCount: Number(newAppForm.trialOrgCount) || 0,
      disabledOrgCount: Number(newAppForm.disabledOrgCount) || 0,
      trashOrgCount: Number(newAppForm.trashOrgCount) || 0,
      appCategory: newAppForm.appCategory,
      protocol: newAppForm.protocol,
      appKey: randomKey,
      appSecret: randomSecret,
      status: 'testing',
      activeAccounts: 1,
      dailyCalls: 0,
      healthScore: 100,
      qpsLimit: Number(newAppForm.qpsLimit) || 200,
      redirectUri: newAppForm.redirectUri || `https://${newAppForm.appCode.toLowerCase()}.konne.cn/oauth2/callback`,
      ownerDept: newAppForm.ownerDept,
      ownerName: newAppForm.ownerName,
      syncInterval: '联调中',
      integratedAt: new Date().toISOString().split('T')[0],
      description: newAppForm.description || '新建集成应用系统',
      iconBg: newAppForm.roleType === 'with_role' ? 'from-indigo-600 to-blue-700' : 'from-teal-600 to-cyan-700'
    };

    setApps([created, ...apps]);
    setIsCreatingApp(false);
    setCreateStep(1);
    setStep1Feedback(null);
    setFormErrors({});
    setNewAppForm({
      appCode: '',
      appName: '',
      appShortName: '',
      appLevel: 'product',
      roleType: 'with_role',
      homeUrl: '',
      appCategory: '业务中台',
      protocol: 'OAuth 2.0',
      officialOrgCount: 1,
      trialOrgCount: 0,
      disabledOrgCount: 0,
      trashOrgCount: 0,
      redirectUri: '',
      ownerDept: '技术研发中心',
      ownerName: '张华',
      qpsLimit: 200,
      description: ''
    });
  };

  const toggleAppStatus = (id: string) => {
    setApps(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'active' ? 'disabled' : 'active';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: prev.status === 'active' ? 'disabled' : 'active' } : null);
    }
  };

  // Navigate to Step 2 (待配置内容页面) for any application
  const handleNavigateToStep2 = (
    app: IntegratedApp,
    initialTab:
      | 'basic_info'
      | 'customer_orgs'
      | 'default_roles'
      | 'permission_dict'
      | 'menu_manage'
      | 'analytics_board'
      | 'data_dict'
    | 'ext_user_config'
    | 'page_modules'
    | 'client_modules'
    | 'app_publish' = 'basic_info'
  ) => {
    setStep2InitialTab(initialTab);
    setNewAppForm({
      id: app.id,
      appName: app.appName,
      appShortName: app.appShortName,
      appCode: app.appCode,
      appLevel: app.appLevel || 'product',
      roleType: app.roleType,
      homeUrl: app.homeUrl || app.redirectUri || '',
      adminUrl: app.adminUrl || '',
      appIcon: app.appIcon || '',
      appIconName: app.appIconName || '',
      productManager: app.productManager || '张伟',
      appCategory: app.appCategory || '业务中台',
      protocol: app.protocol || 'OAuth 2.0',
      redirectUri: app.redirectUri || '',
      ownerDept: app.ownerDept || '技术研发中心',
      ownerName: app.ownerName || '张华',
      qpsLimit: app.qpsLimit || 200,
      officialOrgCount: app.officialOrgCount || 0,
      trialOrgCount: app.trialOrgCount || 0,
      disabledOrgCount: app.disabledOrgCount || 0,
      trashOrgCount: app.trashOrgCount || 0,
      description: app.description || '',
      status: app.status,
      enableExtUserSystem: app.enableExtUserSystem || false,
      extWechatMpName: app.extWechatMpName || '',
      extWechatAppId: app.extWechatAppId || '',
      extWechatAppSecret: app.extWechatAppSecret || '',
      extWechatToken: app.extWechatToken || '',
      extWechatEncodingAesKey: app.extWechatEncodingAesKey || '',
      extWechatQrCode: app.extWechatQrCode || '',
      extWechatQrCodeName: app.extWechatQrCodeName || '',
      pageModules: app.pageModules?.length ? app.pageModules : ALL_UNIFIED_MODULE_KEYS,
      clientConfigs: ensureClientModules(
        app.clientConfigs,
        app.pageModules?.length ? app.pageModules : ALL_UNIFIED_MODULE_KEYS
      )
    });
    setIsWizardFlow(false);
    setIsCreatingApp(true);
    setCreateStep(2);
    setStep1Feedback(null);
    setFormErrors({});
  };

  // If in create app drilldown page
  if (isCreatingApp) {
    const handleBackToList = () => {
      setIsCreatingApp(false);
      setIsWizardFlow(false);
      setCreateStep(1);
      setStep2InitialTab('basic_info');
      setStep1Feedback(null);
      setFormErrors({});
    };

    const persistPageModules = (keys: string[], status?: IntegratedApp['status']) => {
      setNewAppForm(prev => {
        const clientConfigs = pruneClientModules(prev.clientConfigs, keys);
        return { ...prev, pageModules: keys, clientConfigs, ...(status ? { status } : {}) };
      });
      setApps(prevApps => prevApps.map(a => {
        if (a.id === newAppForm.id || (a.appCode && a.appCode.toUpperCase() === newAppForm.appCode.toUpperCase())) {
          return {
            ...a,
            pageModules: keys,
            clientConfigs: pruneClientModules(a.clientConfigs || newAppForm.clientConfigs, keys),
            ...(status ? { status } : {})
          };
        }
        return a;
      }));
    };

    const persistClientConfigs = (configs: AppClientModules, status?: IntegratedApp['status']) => {
      const pruned = pruneClientModules(configs, newAppForm.pageModules || []);
      setNewAppForm(prev => ({ ...prev, clientConfigs: pruned, ...(status ? { status } : {}) }));
      setApps(prevApps => prevApps.map(a => {
        if (a.id === newAppForm.id || (a.appCode && a.appCode.toUpperCase() === newAppForm.appCode.toUpperCase())) {
          return { ...a, clientConfigs: pruned, ...(status ? { status } : {}) };
        }
        return a;
      }));
    };

    if (isWizardFlow && createStep === 2) {
      return (
        <AppCreateModuleBuilder
          mode="wizard"
          appName={newAppForm.appName}
          selectedKeys={newAppForm.pageModules || []}
          onChange={(keys) => persistPageModules(keys)}
          onBack={() => setCreateStep(1)}
          onNext={() => {
            setNewAppForm(prev => ({
              ...prev,
              clientConfigs: ensureClientModules(prev.clientConfigs, prev.pageModules || [])
            }));
            setCreateStep(3);
          }}
          onBackToList={handleBackToList}
          onGoStep={(step) => setCreateStep(step)}
        />
      );
    }

    if (isWizardFlow && createStep === 3) {
      return (
        <AppCreateClientModulesStep
          mode="wizard"
          appName={newAppForm.appName}
          availableModules={newAppForm.pageModules || []}
          clientConfigs={newAppForm.clientConfigs || {}}
          onChange={(configs) => persistClientConfigs(configs)}
          onBack={() => setCreateStep(2)}
          onNext={() => setCreateStep(4)}
          onBackToList={handleBackToList}
          onGoStep={(step) => setCreateStep(step)}
        />
      );
    }

    if (isWizardFlow && createStep === 4) {
      return (
        <AppCreatePublishStep
          appName={newAppForm.appName}
          appCode={newAppForm.appCode}
          appShortName={newAppForm.appShortName}
          selectedKeys={newAppForm.pageModules || []}
          clientConfigs={newAppForm.clientConfigs || {}}
          onBack={() => setCreateStep(3)}
          onBackToList={handleBackToList}
          onGoStep={(step) => setCreateStep(step)}
          onPublish={() => {
            persistPageModules(newAppForm.pageModules || [], 'published');
            persistClientConfigs(newAppForm.clientConfigs || {}, 'published');
            setIsWizardFlow(false);
            setCreateStep(2);
            setStep2InitialTab('client_modules');
          }}
        />
      );
    }

    if (!isWizardFlow) {
      return (
        <AppCreateStep2
          appForm={newAppForm}
          existingApps={apps}
          initialTab={step2InitialTab}
          sharedMenus={sharedMenus}
          onSharedMenusChange={onSharedMenusChange}
          sharedPrimaryPerms={sharedPrimaryPerms}
          onSharedPrimaryPermsChange={onSharedPrimaryPermsChange}
          sharedDefaultRoles={sharedDefaultRoles}
          onSharedDefaultRolesChange={onSharedDefaultRolesChange}
          sharedCustomerOrgs={sharedCustomerOrgs}
          onSharedCustomerOrgsChange={onSharedCustomerOrgsChange}
          onBackToList={handleBackToList}
          onUpdateAppForm={(updatedForm) => {
            setNewAppForm(updatedForm);
            setApps(prevApps => prevApps.map(a => {
              if (a.id === updatedForm.id || (a.appCode && a.appCode.toUpperCase() === updatedForm.appCode.toUpperCase())) {
                return {
                  ...a,
                  appName: updatedForm.appName,
                  appShortName: updatedForm.appShortName,
                  appCode: updatedForm.appCode,
                  homeUrl: updatedForm.homeUrl,
                  adminUrl: updatedForm.adminUrl,
                  productManager: updatedForm.productManager,
                  appLevel: updatedForm.appLevel,
                  roleType: updatedForm.roleType,
                  ownerDept: updatedForm.ownerDept,
                  ownerName: updatedForm.ownerName,
                  description: updatedForm.description,
                  qpsLimit: updatedForm.qpsLimit,
                  protocol: updatedForm.protocol,
                  appIcon: updatedForm.appIcon,
                  appIconName: updatedForm.appIconName,
                  enableExtUserSystem: updatedForm.enableExtUserSystem,
                  extWechatMpName: updatedForm.extWechatMpName,
                  extWechatAppId: updatedForm.extWechatAppId,
                  extWechatAppSecret: updatedForm.extWechatAppSecret,
                  extWechatToken: updatedForm.extWechatToken,
                  extWechatEncodingAesKey: updatedForm.extWechatEncodingAesKey,
                  extWechatQrCode: updatedForm.extWechatQrCode,
                  extWechatQrCodeName: updatedForm.extWechatQrCodeName,
                  pageModules: updatedForm.pageModules,
                  clientConfigs: updatedForm.clientConfigs
                };
              }
              return a;
            }));
          }}
          onUpdateAppStatus={(newStatus) => {
            setNewAppForm(prev => ({ ...prev, status: newStatus }));
            setApps(prevApps => prevApps.map(a => {
              if (a.id === newAppForm.id || (a.appCode && a.appCode.toUpperCase() === newAppForm.appCode.toUpperCase())) {
                return { ...a, status: newStatus };
              }
              return a;
            }));
          }}
        />
      );
    }


    const handleNextStep = (e: React.FormEvent) => {
      e.preventDefault();
      const errors: Record<string, string> = {};
      const appNameTrimmed = newAppForm.appName.trim();

      if (!appNameTrimmed) {
        errors.appName = '请输入应用名称';
      }
      if (!newAppForm.appIcon?.trim()) {
        errors.appIcon = '请上传应用图标';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const appId = newAppForm.id || `app-${Date.now()}`;
      const appLevel = newAppForm.appLevel || 'product';
      const appCode = (newAppForm.appCode || '').trim()
        || getNextAvailableAppCode(appLevel, apps.filter((a) => a.id !== appId));
      const shortNameTrimmed = (newAppForm.appShortName || appNameTrimmed).trim().slice(0, 6);
      const randomKey = `kn_${appCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 9)}`;
      const randomSecret = `sec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const slug = appCode.toLowerCase().replace(/[^a-z0-9]+/g, '');
      const homeUrl = newAppForm.homeUrl?.trim() || `https://${slug || 'app'}.konne.cn`;
      const adminUrl = newAppForm.adminUrl?.trim() || `${homeUrl}/admin`;

      const savedApp: IntegratedApp = {
        id: appId,
        appCode: appCode.toUpperCase(),
        appName: appNameTrimmed,
        appShortName: shortNameTrimmed,
        appLevel,
        roleType: newAppForm.roleType || 'with_role',
        homeUrl,
        adminUrl,
        appIcon: newAppForm.appIcon || undefined,
        appIconName: newAppForm.appIconName || undefined,
        productManager: newAppForm.productManager?.trim() || '张伟',
        officialOrgCount: Number(newAppForm.officialOrgCount) || 0,
        trialOrgCount: Number(newAppForm.trialOrgCount) || 0,
        disabledOrgCount: Number(newAppForm.disabledOrgCount) || 0,
        trashOrgCount: Number(newAppForm.trashOrgCount) || 0,
        appCategory: newAppForm.appCategory || '业务中台',
        protocol: newAppForm.protocol || 'OAuth 2.0',
        appKey: randomKey,
        appSecret: randomSecret,
        status: 'unpublished',
        activeAccounts: 0,
        dailyCalls: 0,
        healthScore: 100,
        qpsLimit: Number(newAppForm.qpsLimit) || 200,
        redirectUri: `${homeUrl}/oauth2/callback`,
        ownerDept: newAppForm.ownerDept || '技术研发中心',
        ownerName: newAppForm.ownerName || '张华',
        syncInterval: '实时 Webhook',
        integratedAt: new Date().toISOString().split('T')[0],
        description: newAppForm.description?.trim() || '',
        enableExtUserSystem: false,
        pageModules: newAppForm.pageModules?.length ? newAppForm.pageModules : ALL_UNIFIED_MODULE_KEYS,
        clientConfigs: newAppForm.clientConfigs || {},
        iconBg: appLevel === 'product'
          ? (newAppForm.roleType === 'with_role' ? 'from-purple-700 via-indigo-800 to-slate-900' : 'from-purple-600 to-blue-700')
          : (newAppForm.roleType === 'with_role' ? 'from-sky-700 via-blue-800 to-slate-900' : 'from-teal-600 via-emerald-700 to-cyan-800')
      };

      setApps(prevApps => {
        const existingIdx = prevApps.findIndex(a => a.id === appId || a.appCode.toUpperCase() === savedApp.appCode);
        if (existingIdx >= 0) {
          const updated = [...prevApps];
          updated[existingIdx] = { ...updated[existingIdx], ...savedApp };
          return updated;
        } else {
          return [savedApp, ...prevApps];
        }
      });

      setNewAppForm({
        ...newAppForm,
        id: appId,
        appCode: savedApp.appCode,
        appShortName: savedApp.appShortName,
        homeUrl: savedApp.homeUrl,
        adminUrl: savedApp.adminUrl,
        description: savedApp.description,
        status: 'unpublished'
      });

      setFormErrors({});
      setStep1Feedback(`应用「${savedApp.appName}」基本信息已保存（当前状态：未发布），请继续配置调用模块。`);
      setCreateStep(2);
    };

    return (
      <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800" id="app_management_page">
        <div className="w-full flex flex-col gap-5">
          
          {/* 1. 页面顶部：面包屑导航 (返回应用列表) 与步骤条 */}
            <AppCreateWizardHeader
              currentStep={1}
              onBackToList={() => {
                setIsCreatingApp(false);
                setIsWizardFlow(false);
                setCreateStep(1);
                setStep1Feedback(null);
                setFormErrors({});
              }}
            />

          {/* Step 1 Feedback Alert if transitioned */}
          {step1Feedback && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{step1Feedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setCreateStep(1)}
                className="underline hover:text-emerald-950 font-bold ml-4 cursor-pointer"
              >
                返回修改第 1 步
              </button>
            </div>
          )}

          {/* Step 1 Main Form Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
              
              {/* Card Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    第 1 步：填写基本信息
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    只需填写名称、描述并上传图标，即可进入调用模块搭建
                  </p>
                </div>
                <div className="text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-lg font-mono self-start sm:self-auto">
                  Step 1 of 4
                </div>
              </div>

              <AppCreateBasicInfoForm
                values={{
                  appName: newAppForm.appName,
                  description: newAppForm.description || '',
                  appIcon: newAppForm.appIcon,
                  appIconName: newAppForm.appIconName
                }}
                errors={formErrors}
                iconUploadError={iconUploadError}
                isDraggingIcon={isDraggingIcon}
                iconInputRef={iconInputRef}
                onNameChange={(value) => {
                  setNewAppForm({ ...newAppForm, appName: value });
                  if (formErrors.appName) {
                    setFormErrors({ ...formErrors, appName: '' });
                  }
                }}
                onDescriptionChange={(value) => {
                  setNewAppForm({ ...newAppForm, description: value });
                }}
                onIconFiles={handleIconFiles}
                onRemoveIcon={handleRemoveIcon}
                onDragState={setIsDraggingIcon}
                onCancel={() => {
                  setIsCreatingApp(false);
                  setIsWizardFlow(false);
                  setCreateStep(1);
                  setStep1Feedback(null);
                  setFormErrors({});
                }}
                onSubmit={handleNextStep}
              />

            </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] text-slate-800" id="app_management_page">
      <div className="w-full flex flex-col gap-5">

        {/* Top Header Card: 严格遵循设计与样式规范 */}
        <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="app_list_header_bar">
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">应用管理 / 应用列表</span>
            </nav>

            {/* 三、页面主标题（Title）与 统计标签 */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                应用列表
              </h1>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono border border-blue-200/60 ml-1">
                共接入 {totalAppsCount} 个应用
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsCreatingApp(true);
                setIsWizardFlow(true);
                setCreateStep(1);
                setStep1Feedback(null);
                setFormErrors({});
              }}
              className="px-4 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
              id="btn_create_new_app"
            >
              <Plus className="w-4 h-4" />
              <span>新增应用接入</span>
            </button>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-6 pb-6 flex flex-col gap-5">

        {/* Search & Category Filter Section (分类搜索) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Filter 1: App Level (应用级别：产品级应用 vs 功能级应用) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">
                应用级别:
              </span>
              <select
                value={appLevelFilter}
                onChange={(e) => setAppLevelFilter(e.target.value as '全部' | 'product' | 'feature')}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none hover:border-slate-300 focus:border-blue-500 font-medium cursor-pointer"
                id="select_filter_app_level"
              >
                <option value="全部">全部级别 ({totalAppsCount})</option>
                <option value="product">产品级应用 ({productAppsCount})</option>
                <option value="feature">功能级应用 ({featureAppsCount})</option>
              </select>
            </div>

            {/* Filter 2: Role Type (角色类型：健全类型) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">
                角色类型:
              </span>
              <select
                value={roleTypeFilter}
                onChange={(e) => setRoleTypeFilter(e.target.value as '全部' | 'with_role' | 'no_role')}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none hover:border-slate-300 focus:border-blue-500 font-medium cursor-pointer"
                id="select_filter_role_type"
              >
                <option value="全部">全部角色类型</option>
                <option value="with_role">有角色 ({withRoleAppsCount})</option>
                <option value="no_role">无角色 ({noRoleAppsCount})</option>
              </select>
            </div>

            {/* Filter: External User Filter (外部用户体系: 全部 / 已开启 / 未开启) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">外部用户体系:</span>
              <select
                value={extUserFilter}
                onChange={(e) => setExtUserFilter(e.target.value as '全部' | 'enabled' | 'disabled')}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none hover:border-slate-300 focus:border-blue-500 font-medium cursor-pointer"
                id="select_filter_ext_user"
              >
                <option value="全部">全部外部用户</option>
                <option value="enabled">已开启 ({extUserEnabledCount})</option>
                <option value="disabled">未开启 ({extUserDisabledCount})</option>
              </select>
            </div>

            {/* Filter 3: Status Filter (运行状态: 全部状态 / 已发布 / 未发布 / 停用) */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 shrink-0">运行状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none hover:border-slate-300 focus:border-blue-500 font-medium cursor-pointer"
              >
                <option value="全部">全部状态</option>
                <option value="已发布">已发布</option>
                <option value="未发布">未发布</option>
                <option value="停用">停用</option>
              </select>
            </div>

          </div>

          {/* Right Side Controls: Reset Filters & View Mode Toggle (列表显示 / 九宫格显示) */}
          <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
            {/* Reset Filters */}
            {(appLevelFilter !== '全部' || roleTypeFilter !== '全部' || extUserFilter !== '全部' || statusFilter !== '全部') && (
              <button
                onClick={() => {
                  setAppLevelFilter('全部');
                  setRoleTypeFilter('全部');
                  setExtUserFilter('全部');
                  setStatusFilter('全部');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重置筛选</span>
              </button>
            )}

            {/* View Mode Toggle (列表显示 / 九宫格显示 / 卡片方式) */}
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-white text-[#1e376b] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="列表显示模式"
                id="btn_viewmode_list"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>列表显示</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#1e376b] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="九宫格显示模式"
                id="btn_viewmode_grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>九宫格显示</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'card'
                    ? 'bg-white text-[#1e376b] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="卡片方式（一行三个）"
                id="btn_viewmode_card"
              >
                <AppWindow className="w-3.5 h-3.5" />
                <span>卡片方式</span>
              </button>
            </div>
          </div>

        </div>

        {/* 1. 九宫格显示模式 (展示应用图标与图标下方的应用简称标签，点击跳转至第2步功能配置页) */}
        {viewMode === 'grid' ? (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" id="app_grid_container">
            {filteredApps.length === 0 ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <Boxes className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                <span className="font-medium text-sm text-slate-600">未找到符合条件的应用系统</span>
                <span className="text-xs text-slate-400">请尝试调整搜索关键词或角色类型筛选</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-x-6 gap-y-8 items-start justify-items-center">
                {filteredApps.map((app) => {
                  const isDisabled = app.status === 'disabled';
                  const isUnpublished = app.status === 'unpublished' || app.status === 'testing';

                  return (
                    <div
                      key={app.id}
                      id={`grid_app_${app.id}`}
                      onClick={() => handleNavigateToStep2(app)}
                      className="flex flex-col items-center gap-2.5 select-none group cursor-pointer"
                      title={`点击配置应用「${app.appName}」`}
                    >
                      {/* App Icon: 停用状态图标置灰，未发布状态图标仍为彩色 */}
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${app.iconBg || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center shadow-sm group-hover:shadow-md border border-white/20 transition-all duration-200 group-hover:scale-105 overflow-hidden ${
                        isDisabled ? 'grayscale opacity-60' : ''
                      }`}>
                        {renderAppSemanticIcon(app.appCode, app.appShortName, 'lg', app.appIcon)}
                      </div>
                      {/* App Short Name Tag (应用简称): 停用打删除线置灰，未发布灰度无删除线 */}
                      <span className={`px-2 py-0.5 rounded-md text-xs tracking-tight text-center whitespace-nowrap shadow-2xs transition-colors border ${
                        isDisabled
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                          : isUnpublished
                            ? 'bg-slate-100 text-slate-500 border-slate-200 font-medium'
                            : 'bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 text-slate-700 border-slate-200/90 font-bold'
                      }`}>
                        {app.appShortName || app.appName.substring(0, 4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : viewMode === 'card' ? (
          /* 2. 卡片方式 (一行三个卡片，现代雅致设计，带完整状态、网址快捷访问与操作按钮) */
          <div className="w-full" id="app_cards_grid_container">
            {filteredApps.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 shadow-xs">
                <Boxes className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                <span className="font-medium text-sm text-slate-600">未找到符合条件的应用系统</span>
                <span className="text-xs text-slate-400">请尝试调整搜索关键词或角色类型筛选</span>
              </div>
            ) : (
              <div
                className="grid gap-5"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                }}
              >
                {filteredApps.map((app, index) => {
                  const isDisabled = app.status === 'disabled';
                  const isUnpublished = app.status === 'unpublished' || app.status === 'testing';
                  const isWithRole = app.roleType === 'with_role';
                  const isFirst = index === 0;
                  const isLast = index === filteredApps.length - 1;
                  const v8Url = app.homeUrl || app.redirectUri || '#';
                  const mtUrl = app.adminUrl || (app.homeUrl ? `${app.homeUrl}/admin` : `https://mt-${app.appCode.toLowerCase().replace(/[^a-z0-9]/g, '')}.konne.cn/admin`);

                  return (
                    <div
                      key={app.id}
                      id={`card_mode_app_${app.id}`}
                      className={`group relative bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                        isDisabled
                          ? 'border-slate-200/90 bg-slate-50/40 opacity-75 hover:opacity-100 hover:border-slate-300'
                          : isUnpublished
                            ? 'border-slate-200/90 hover:border-blue-300 hover:ring-1 hover:ring-blue-400/20'
                            : 'border-slate-200/90 hover:border-blue-400 hover:ring-1 hover:ring-blue-500/20'
                      }`}
                    >
                      {/* Top Status & Attribute Header Bar */}
                      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-slate-100 bg-slate-50/60">
                        {/* Status Tag */}
                        <div className="flex items-center gap-1.5">
                          {isDisabled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>停用</span>
                            </span>
                          ) : isUnpublished ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <Clock className="w-3 h-3 text-blue-600" />
                              <span>未发布</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>已发布</span>
                            </span>
                          )}

                          {/* Level Badge */}
                          {(app.appLevel || 'product') === 'product' ? (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              isDisabled
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200/80'
                            }`}>
                              <Layers className="w-2.5 h-2.5" />
                              <span>产品级</span>
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              isDisabled
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200/80'
                            }`}>
                              <Cpu className="w-2.5 h-2.5" />
                              <span>功能级</span>
                            </span>
                          )}
                        </div>

                        {/* Role Type & Sorting */}
                        <div className="flex items-center gap-1.5">
                          {isWithRole ? (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              isDisabled
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                            }`}>
                              <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                              <span>有角色</span>
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                              isDisabled
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            }`}>
                              <BadgeCheck className="w-2.5 h-2.5 text-emerald-600" />
                              <span>无角色</span>
                            </span>
                          )}

                          {/* Quick Sorting Arrows */}
                          <div className="flex items-center gap-0.5 ml-1 bg-white rounded border border-slate-200 p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveAppUp(app.id);
                              }}
                              disabled={isFirst}
                              title={isFirst ? "已在最前" : "上移"}
                              className={`p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                                isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600'
                              }`}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveAppDown(app.id);
                              }}
                              disabled={isLast}
                              title={isLast ? "已在最后" : "下移"}
                              className={`p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer ${
                                isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600'
                              }`}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Card Middle: Icon + Name + Unique ID */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* App Icon */}
                          <div
                            onClick={() => handleNavigateToStep2(app)}
                            className="flex flex-col items-center gap-1 shrink-0 select-none cursor-pointer group/icon"
                            title={`点击配置应用「${app.appName}」`}
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.iconBg || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center shadow-xs border border-white/20 transition-transform group-hover/icon:scale-105 overflow-hidden group-hover/icon:shadow-md ${
                              isDisabled ? 'grayscale opacity-60' : ''
                            }`}>
                              {renderAppSemanticIcon(app.appCode, app.appShortName, 'md', app.appIcon)}
                            </div>
                            <span className={`px-1.5 py-0.2 border rounded text-[10px] tracking-tight text-center whitespace-nowrap shadow-2xs transition-colors ${
                              isDisabled
                                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                                : isUnpublished
                                  ? 'bg-slate-100 text-slate-500 border-slate-200 font-medium'
                                  : 'bg-slate-100 group-hover/icon:bg-blue-50 group-hover/icon:text-blue-700 group-hover/icon:border-blue-200 text-slate-700 border-slate-200/90 font-bold'
                            }`}>
                              {app.appShortName || app.appName.substring(0, 4)}
                            </span>
                          </div>

                          {/* App Titles & Unique ID */}
                          <div className="min-w-0 flex-1">
                            <h3
                              onClick={() => handleNavigateToStep2(app)}
                              className={`text-xs font-black tracking-tight leading-snug line-clamp-2 cursor-pointer hover:text-blue-700 transition-colors ${
                                isDisabled
                                  ? 'text-slate-400 line-through'
                                  : isUnpublished
                                    ? 'text-slate-600'
                                    : 'text-slate-900'
                              }`}
                              title={app.appName}
                            >
                              {app.appName}
                            </h3>

                            <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                              <span className="text-slate-400 font-medium text-[10px]">唯一ID:</span>
                              <span className={`font-mono font-bold bg-slate-100 px-1.5 py-0.2 rounded text-[10px] border border-slate-200/60 ${
                                isDisabled ? 'text-slate-400 line-through' : isUnpublished ? 'text-slate-500' : 'text-slate-700'
                              }`}>
                                {app.appCode}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(app.appCode, `code-card-${app.id}`)}
                                title="复制应用唯一ID"
                                className="text-slate-400 hover:text-blue-600 cursor-pointer p-0.5"
                              >
                                {copiedKey === `code-card-${app.id}` ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* URLs Box (V8 and MT) */}
                        <div className="bg-slate-50/80 rounded-lg p-2.5 space-y-1.5 text-xs font-mono">
                          {/* V8 URL */}
                          <div className="flex items-center justify-between gap-1.5 text-[11px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                V8
                              </span>
                              <a
                                href={v8Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`V8入口: ${v8Url}`}
                                className={`truncate text-[11px] font-medium ${
                                  isDisabled
                                    ? 'text-slate-400 line-through'
                                    : isUnpublished
                                      ? 'text-slate-500 hover:text-blue-600 hover:underline'
                                      : 'text-slate-600 hover:text-blue-600 hover:underline'
                                }`}
                              >
                                {v8Url}
                              </a>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCopyUrl(v8Url, `card-v8-${app.id}`)}
                                title="复制 V8 网址"
                                className="text-slate-400 hover:text-blue-600 p-0.5"
                              >
                                {copiedUrl === `card-v8-${app.id}` ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                              <a
                                href={v8Url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="在新窗口中打开 V8 网址"
                                className="text-slate-400 hover:text-blue-600 p-0.5"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>

                          {/* MT URL */}
                          <div className="flex items-center justify-between gap-1.5 text-[11px]">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                MT
                              </span>
                              <a
                                href={mtUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`MT管理端: ${mtUrl}`}
                                className={`truncate text-[11px] font-medium ${
                                  isDisabled
                                    ? 'text-slate-400 line-through'
                                    : isUnpublished
                                      ? 'text-slate-500 hover:text-indigo-600 hover:underline'
                                      : 'text-slate-600 hover:text-indigo-600 hover:underline'
                                }`}
                              >
                                {mtUrl}
                              </a>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleCopyUrl(mtUrl, `card-mt-${app.id}`)}
                                title="复制 MT 网址"
                                className="text-slate-400 hover:text-indigo-600 p-0.5"
                              >
                                {copiedUrl === `card-mt-${app.id}` ? (
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-2.5 h-2.5" />
                                )}
                              </button>
                              <a
                                href={mtUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="在新窗口中打开 MT 网址"
                                className="text-slate-400 hover:text-indigo-600 p-0.5"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Action Buttons */}
                      <div className="px-3.5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleNavigateToStep2(app, 'customer_orgs')}
                          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1e376b] border border-slate-250 hover:border-blue-300 rounded-lg text-xs font-bold shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                          id={`card_btn_org_${app.id}`}
                          title="查看该应用已开通的机构"
                        >
                          <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>查看机构</span>
                        </button>

                        {app.enableExtUserSystem && (
                          <button
                            type="button"
                            onClick={() => handleNavigateToStep2(app, 'ext_user_config')}
                            className="py-1.5 px-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-[#1e376b] border border-blue-200 hover:border-blue-300 rounded-lg text-xs font-bold shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                            id={`card_btn_ext_user_${app.id}`}
                            title={`管理「${app.appName}」的外部用户体系`}
                          >
                            <Users className="w-3 h-3 text-[#1e376b] shrink-0" />
                            <span>外部用户配置</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleNavigateToStep2(app)}
                          className="flex-1 py-1.5 px-2 bg-[#1e376b] hover:bg-[#15274d] text-white rounded-lg text-xs font-bold shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                          id={`card_btn_config_${app.id}`}
                          title={`配置「${app.appName}」`}
                        >
                          <Sliders className="w-3 h-3 text-blue-200 shrink-0" />
                          <span>配置应用</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* 3. 列表显示模式 (表格列表形式，整体带外层边框与圆角，条目间以横线分隔) */
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs divide-y divide-slate-200/80 overflow-hidden" id="app_cards_container">
          {filteredApps.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Boxes className="w-10 h-10 text-slate-300 stroke-[1.5]" />
              <span className="font-medium text-sm text-slate-600">未找到符合条件的应用系统</span>
              <span className="text-xs text-slate-400">请尝试调整搜索关键词或角色类型筛选</span>
            </div>
          ) : (
            filteredApps.map((app, index) => {
              const abbr = getSystemIconAbbr(app.appCode, app.appName);
              const isWithRole = app.roleType === 'with_role';
              const isFirst = index === 0;
              const isLast = index === filteredApps.length - 1;

              const isDisabled = app.status === 'disabled';
              const isUnpublished = app.status === 'unpublished' || app.status === 'testing';
              const v8Url = app.homeUrl || app.redirectUri || '#';
              const mtUrl = app.adminUrl || (app.homeUrl ? `${app.homeUrl}/admin` : `https://mt-${app.appCode.toLowerCase().replace(/[^a-z0-9]/g, '')}.konne.cn/admin`);

              return (
                <div
                  key={app.id}
                  className={`transition-colors relative ${
                    isDisabled
                      ? 'bg-slate-50/50 hover:bg-slate-100/50'
                      : isUnpublished
                        ? 'bg-white hover:bg-blue-50/30'
                        : 'bg-white hover:bg-slate-50/70'
                  }`}
                  id={`app_card_${app.id}`}
                >
                  {/* Top-Left Corner Border Tag: 发布状态标签 (已发布: 绿底 / 未发布: 蓝底 / 停用: 灰底) */}
                  <div className="absolute top-0 left-0 z-10">
                    {isDisabled ? (
                      <span
                        className="inline-flex items-center gap-1 border-r border-b px-2.5 py-1 rounded-br-lg text-[11px] font-bold shadow-2xs bg-slate-100 text-slate-500 border-slate-200"
                        title="发布状态：停用"
                      >
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>停用</span>
                      </span>
                    ) : isUnpublished ? (
                      <span
                        className="inline-flex items-center gap-1 border-r border-b px-2.5 py-1 rounded-br-lg text-[11px] font-bold shadow-2xs bg-blue-50/95 text-blue-700 border-blue-200/90"
                        title="发布状态：未发布"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>未发布</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 border-r border-b px-2.5 py-1 rounded-br-lg text-[11px] font-bold shadow-2xs bg-emerald-50/95 text-emerald-700 border-emerald-200/90"
                        title="发布状态：已发布"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>已发布</span>
                      </span>
                    )}
                  </div>

                  {/* Top-Right Corner Border Tag: 角色类型标签 (有角色应用 / 无角色应用) */}
                  <div className="absolute top-0 right-0 z-10">
                    {isWithRole ? (
                      <span
                        className={`inline-flex items-center gap-1 border-l border-b px-2.5 py-1 rounded-bl-lg text-[11px] font-bold shadow-2xs ${
                          isDisabled
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : 'bg-indigo-50/95 text-indigo-700 border-indigo-200/90'
                        }`}
                        title="有角色应用：支持分配多级角色及细粒度数据权限"
                      >
                        <ShieldCheck className={`w-3.5 h-3.5 ${isDisabled ? 'text-slate-400' : 'text-indigo-600'}`} />
                        <span>有角色应用</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 border-l border-b px-2.5 py-1 rounded-bl-lg text-[11px] font-bold shadow-2xs ${
                          isDisabled
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : 'bg-emerald-50/95 text-emerald-700 border-emerald-200/90'
                        }`}
                        title="无角色应用：全员通用平权访问，无差异化角色控制"
                      >
                        <BadgeCheck className={`w-3.5 h-3.5 ${isDisabled ? 'text-slate-400' : 'text-emerald-600'}`} />
                        <span>无角色应用</span>
                      </span>
                    )}
                  </div>

                  {/* Top / Main App Information Row */}
                  <div className="pt-7 sm:pt-6 pb-4 sm:pb-5 px-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left Part: Up/Down Sorting + App Icon + Main Details Stack */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 pr-2">
                      
                       {/* Up/Down Sorting Buttons */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pr-1">
                        <button
                          type="button"
                          onClick={() => moveAppUp(app.id)}
                          disabled={isFirst}
                          title={isFirst ? "已在最前" : "上移该应用"}
                          className={`w-6 h-6 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                            isFirst 
                              ? 'text-slate-300 border-slate-100 bg-slate-50/50 cursor-not-allowed' 
                              : 'text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                          }`}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAppDown(app.id)}
                          disabled={isLast}
                          title={isLast ? "已在最后" : "下移该应用"}
                          className={`w-6 h-6 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                            isLast 
                              ? 'text-slate-300 border-slate-100 bg-slate-50/50 cursor-not-allowed' 
                              : 'text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* 1. App Icon & Short Name Tag: 停用状态图标置灰，未发布状态图标仍为彩色 */}
                      <div
                        onClick={() => handleNavigateToStep2(app)}
                        className="flex flex-col items-center gap-1.5 shrink-0 select-none cursor-pointer group/icon"
                        title={`点击配置应用「${app.appName}」`}
                      >
                        <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${app.iconBg || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center shadow-md select-none border border-white/20 transition-transform group-hover/icon:scale-105 overflow-hidden group-hover/icon:shadow-lg ${
                          isDisabled ? 'grayscale opacity-60' : ''
                        }`}>
                          {renderAppSemanticIcon(app.appCode, app.appShortName, 'md', app.appIcon)}
                        </div>
                        <span className={`px-1.5 py-0.5 border rounded text-[11px] tracking-tight text-center whitespace-nowrap shadow-2xs transition-colors ${
                          isDisabled
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            : isUnpublished
                              ? 'bg-slate-100 text-slate-500 border-slate-200 font-medium'
                              : 'bg-slate-100 group-hover/icon:bg-blue-50 group-hover/icon:text-blue-700 group-hover/icon:border-blue-200 text-slate-700 border-slate-200/90 font-bold'
                        }`}>
                          {app.appShortName || app.appName.substring(0, 4)}
                        </span>
                      </div>

                      {/* 2. Main Details Stack */}
                      <div className="flex flex-col gap-1 min-w-0">
                        
                        {/* Line 1: Application System Name + Level Badge: 停用打删除线置灰，未发布灰度无删除线 */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className={`text-sm sm:text-base tracking-tight leading-snug truncate ${
                            isDisabled
                              ? 'text-slate-400 line-through font-semibold'
                              : isUnpublished
                                ? 'text-slate-500 font-semibold'
                                : 'text-slate-900 font-black'
                          }`}>
                            {app.appName}
                          </h2>
                          {(app.appLevel || 'product') === 'product' ? (
                            <span
                              className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-bold shadow-2xs ${
                                isDisabled
                                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                                  : isUnpublished
                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                    : 'bg-purple-50 text-purple-700 border-purple-200/90'
                              }`}
                              title="产品级应用：如谛听预警、极速舆情等独立业务产品系统"
                            >
                              <Layers className={`w-3 h-3 ${isDisabled || isUnpublished ? 'text-slate-400' : 'text-purple-600'}`} />
                              <span>产品级应用</span>
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-bold shadow-2xs ${
                                isDisabled
                                  ? 'bg-slate-100 text-slate-400 border-slate-200'
                                  : isUnpublished
                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                    : 'bg-sky-50 text-sky-700 border-sky-200/90'
                              }`}
                              title="功能级应用：如消息中心、数据仓库等中台功能支撑系统"
                            >
                              <Cpu className={`w-3 h-3 ${isDisabled || isUnpublished ? 'text-slate-400' : 'text-sky-600'}`} />
                              <span>功能级应用</span>
                            </span>
                          )}
                        </div>

                        {/* Line 2: Unique App ID */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 font-medium text-[11px]">唯一ID:</span>
                          <span className={`font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px] ${
                            isDisabled ? 'text-slate-400 line-through' : isUnpublished ? 'text-slate-500' : 'text-slate-700'
                          }`}>
                            {app.appCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(app.appCode, `code-${app.id}`)}
                            title="复制应用唯一ID"
                            className="text-slate-400 hover:text-blue-600 cursor-pointer p-0.5"
                          >
                            {copiedKey === `code-${app.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Line 3: Direct Website / URL (V8 网址 + MT入口 网址) */}
                        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono pt-0.5 flex-wrap">
                          {/* (1) V8 网址 */}
                          <div className={`flex items-center gap-1.5 text-xs font-mono ${
                            isDisabled ? 'text-slate-400' : isUnpublished ? 'text-slate-500' : 'text-slate-600'
                          }`}>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                              V8
                            </span>
                            <a
                              href={v8Url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`在独立窗口中打开 V8 客户入口: ${v8Url}`}
                              className={`truncate max-w-[170px] sm:max-w-[240px] text-[11px] font-medium ${
                                isDisabled
                                  ? 'text-slate-400 line-through hover:text-slate-500'
                                  : isUnpublished
                                    ? 'text-slate-500 hover:text-blue-600 hover:underline'
                                    : 'text-slate-600 hover:text-blue-600 hover:underline'
                              }`}
                            >
                              {v8Url}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(v8Url, `url-v8-${app.id}`)}
                              title="复制 V8 网址"
                              className="text-slate-400 hover:text-blue-600 cursor-pointer shrink-0 p-0.5"
                            >
                              {copiedUrl === `url-v8-${app.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <a
                              href={v8Url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="在新窗口中打开 V8 网址"
                              className="text-slate-400 hover:text-blue-600 shrink-0 p-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {/* 细分隔线 */}
                          <span className="w-px h-3.5 bg-slate-200 shrink-0 hidden sm:inline-block" />

                          {/* (2) MT入口 网址 */}
                          <div className={`flex items-center gap-1.5 text-xs font-mono ${
                            isDisabled ? 'text-slate-400' : isUnpublished ? 'text-slate-500' : 'text-slate-600'
                          }`}>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                              MT入口
                            </span>
                            <a
                              href={mtUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`在独立窗口中打开 MT 管理端: ${mtUrl}`}
                              className={`truncate max-w-[170px] sm:max-w-[240px] text-[11px] font-medium ${
                                isDisabled
                                  ? 'text-slate-400 line-through hover:text-slate-500'
                                  : isUnpublished
                                    ? 'text-slate-500 hover:text-indigo-600 hover:underline'
                                    : 'text-slate-600 hover:text-indigo-600 hover:underline'
                              }`}
                            >
                              {mtUrl}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(mtUrl, `url-mt-${app.id}`)}
                              title="复制 MT 入口网址"
                              className="text-slate-400 hover:text-indigo-600 cursor-pointer shrink-0 p-0.5"
                            >
                              {copiedUrl === `url-mt-${app.id}` ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <a
                              href={mtUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="在新窗口中打开 MT 入口网址"
                              className="text-slate-400 hover:text-indigo-600 shrink-0 p-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Right Part: Action Buttons */}
                    <div className="flex items-center justify-end shrink-0 pt-2 md:pt-3 gap-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleNavigateToStep2(app, 'customer_orgs')}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#1e376b] border border-slate-300 hover:border-blue-300 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                        id={`btn_view_org_${app.id}`}
                      >
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>查看应用开通机构</span>
                      </button>

                      {/* (b) 在每一个应用中，如果该应用已开启外部用户功能，就在“查看应用开通机构”和“配置应用”按钮的中间，增加一个“管理外部用户体系”按钮。 */}
                      {app.enableExtUserSystem && (
                        <button
                          type="button"
                          onClick={() => handleNavigateToStep2(app, 'ext_user_config')}
                          className="px-3.5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-[#1e376b] hover:text-blue-900 border border-blue-200 hover:border-blue-400 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                          id={`btn_manage_ext_user_${app.id}`}
                          title={`管理「${app.appName}」的外部用户体系与公众号配置`}
                        >
                          <Users className="w-3.5 h-3.5 text-[#1e376b]" />
                          <span>管理外部用户体系</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleNavigateToStep2(app)}
                        className="px-3.5 py-2 bg-white hover:bg-blue-50 text-[#1e376b] hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                        id={`btn_config_${app.id}`}
                      >
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>配置应用</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Drawer: 7. Enter Configuration Detail (配置详情抽屉) */}
      {/* ========================================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedApp(null)}></div>
          
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto relative animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedApp.iconBg || 'from-[#1e376b] to-blue-700'} text-white flex items-center justify-center shadow-md border border-white/20 shrink-0 overflow-hidden`}>
                  {renderAppSemanticIcon(selectedApp.appCode, selectedApp.appShortName, 'md', selectedApp.appIcon)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-black text-slate-900">{selectedApp.appName}</h2>
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                      {selectedApp.protocol}
                    </span>
                    {(selectedApp.appLevel || 'product') === 'product' ? (
                      <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" />
                        <span>产品级应用</span>
                      </span>
                    ) : (
                      <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-sky-600" />
                        <span>功能级应用</span>
                      </span>
                    )}
                    {selectedApp.roleType === 'with_role' ? (
                      <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded">
                        有角色应用
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                        无角色应用
                      </span>
                    )}
                  </div>
                  {selectedApp.description && (
                    <div className="text-xs text-blue-700 font-medium flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{selectedApp.description}</span>
                    </div>
                  )}
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    应用唯一ID: {selectedApp.appCode} · 接入时间: {selectedApp.integratedAt}
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex flex-col gap-6 text-xs">
              
              {/* Credentials Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-col gap-3.5">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                  <Key className="w-4 h-4 text-blue-600" />
                  <span>鉴权凭据与密钥管理 (API Credentials)</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-500 font-semibold">AppKey (唯一客户端标识):</span>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono">
                    <span className="text-slate-800 select-all font-bold flex-1">{selectedApp.appKey}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedApp.appKey, 'drawer-key')}
                      className="text-slate-400 hover:text-blue-600 cursor-pointer"
                    >
                      {copiedKey === 'drawer-key' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-500 font-semibold">AppSecret (服务端通信私钥):</span>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono">
                    <span className="text-slate-800 select-all font-bold flex-1">
                      {revealedSecrets[selectedApp.id] ? selectedApp.appSecret : '••••••••••••••••••••••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleSecretReveal(selectedApp.id)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {revealedSecrets[selectedApp.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedApp.appSecret || '', 'drawer-secret')}
                      className="text-slate-400 hover:text-blue-600 cursor-pointer"
                    >
                      {copiedKey === 'drawer-secret' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Endpoint & URLs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-semibold">应用首页地址 (Home URL)</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-800 text-[11px] truncate">
                    <span className="truncate">{selectedApp.homeUrl || '未配置'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-semibold">SSO回调地址 (Redirect URI)</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px] truncate" title={selectedApp.redirectUri}>
                    {selectedApp.redirectUri}
                  </span>
                </div>

                <div className="flex flex-col gap-1 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-semibold">所属业务中心</span>
                  <span className="font-bold text-slate-800">{selectedApp.ownerDept}</span>
                </div>

                <div className="flex flex-col gap-1 bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-400 font-semibold">业务与技术接口人</span>
                  <span className="font-bold text-slate-800">{selectedApp.ownerName}</span>
                </div>
              </div>

              {/* Organization Authorization Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2.5">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>各机构授权开通详情</span>
                  </span>
                  <span className="font-mono text-blue-700">共计 {(selectedApp.officialOrgCount || 0) + (selectedApp.trialOrgCount || 0) + (selectedApp.disabledOrgCount || 0)} 家机构</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">正式授权机构</span>
                    <span className="font-mono font-bold text-sm text-emerald-700">{selectedApp.officialOrgCount || 0} 家</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">试用期机构</span>
                    <span className="font-mono font-bold text-sm text-amber-700">{selectedApp.trialOrgCount || 0} 家</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block">已关停机构</span>
                    <span className="font-mono font-bold text-sm text-slate-500">{selectedApp.disabledOrgCount || 0} 家</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-slate-700">系统描述与集成职责</span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 leading-relaxed">
                  {selectedApp.description}
                </p>
              </div>

              {/* SLA & Health Stats */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-950">集成健康度指数</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">SLA 可用性 99.99% · 接口异常自动报警</div>
                </div>
                <div className="text-lg font-black text-blue-600 font-mono">{selectedApp.healthScore} 分</div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleAppStatus(selectedApp.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  selectedApp.status === 'active'
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedApp.status === 'active' ? '停用此应用运行' : '启用此应用运行'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-[#1e376b] text-white rounded-lg text-xs font-bold hover:bg-[#14264c] cursor-pointer"
              >
                关 闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-action Modal: 机构管理 (Organization Management for this App) */}
      {/* ========================================================================= */}
      {activeModal && activeModal.type === 'org_manage' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    机构管理 · {activeModal.app.appName}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    管理全集团各级分子公司、研发基地及事业部的授权接入状态
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
                  <span className="text-emerald-800 font-bold block">正式运行机构</span>
                  <span className="text-lg font-black font-mono text-emerald-700">{activeModal.app.officialOrgCount} 家</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-center">
                  <span className="text-amber-800 font-bold block">试用评估机构</span>
                  <span className="text-lg font-black font-mono text-amber-700">{activeModal.app.trialOrgCount} 家</span>
                </div>
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-lg text-center">
                  <span className="text-slate-700 font-bold block">关停停用机构</span>
                  <span className="text-lg font-black font-mono text-slate-600">{activeModal.app.disabledOrgCount} 家</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">机构/法人名称</th>
                      <th className="py-2.5 px-3">所属战区</th>
                      <th className="py-2.5 px-3">授权类型</th>
                      <th className="py-2.5 px-3">有效期限</th>
                      <th className="py-2.5 px-3 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">上海电气智能装备制造集团</td>
                      <td className="py-2.5 px-3 text-slate-600">康奈总部</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">永久授权 (正式)</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">2029-12-31</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold">正常</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">苏州微电子集成电路有限公司</td>
                      <td className="py-2.5 px-3 text-slate-600">陕西区域</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">商业许可 (正式)</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">2027-06-30</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-bold">正常</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">四川智慧水务防御工程技术集团</td>
                      <td className="py-2.5 px-3 text-slate-600">四川区域</td>
                      <td className="py-2.5 px-3 text-amber-700 font-bold">试点接入 (试用)</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">2026-10-15</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-bold">试用中</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1e376b] text-white rounded-lg font-bold text-xs hover:bg-[#14264c] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-action Modal: 组织架构 (Org Architecture for this App) */}
      {/* ========================================================================= */}
      {activeModal && activeModal.type === 'org_arch' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">组织架构挂载 · {activeModal.app.appName}</h3>
                  <div className="text-[11px] text-slate-500">查看该系统已绑定的部门层级及数据同步链路</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-950 block">组织数据双向同步</span>
                  <span className="text-[11px] text-slate-500">同步机制: {activeModal.app.syncInterval} · 最近成功同步: 10分钟前</span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  立即同步组织
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 flex flex-col gap-2">
                <span className="font-bold text-slate-800">已授权挂载的主体部门:</span>
                <div className="flex flex-col gap-1.5 pl-2 font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>集团总部 / 销售业务中心 (全员 180人)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>康奈总部运营管理中心 (全员 92人)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>技术研发与技术服务中心 (全员 340人)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1e376b] text-white rounded-lg font-bold text-xs hover:bg-[#14264c] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-action Modal: 用户账号 (User Accounts for this App) */}
      {/* ========================================================================= */}
      {activeModal && activeModal.type === 'user_account' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">用户账号授权 · {activeModal.app.appName}</h3>
                  <div className="text-[11px] text-slate-500">该应用目前活跃授权账号: {activeModal.app.activeAccounts.toLocaleString()} 人</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <div>
                  <span className="font-bold text-emerald-950 block">SSO 单点登录开通率 100%</span>
                  <span className="text-[11px] text-slate-500">支持企微、飞书、企业邮箱统一扫码免密登录</span>
                </div>
                <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded text-xs">
                  正常通行
                </span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">工号 / 姓名</th>
                      <th className="py-2.5 px-3">所属部门</th>
                      <th className="py-2.5 px-3">登录权限</th>
                      <th className="py-2.5 px-3 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">EMP001 · 罗肖</td>
                      <td className="py-2.5 px-3 text-slate-600">集团总裁办</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">超级管理员</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[11px]">已开通</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">EMP042 · 张建军</td>
                      <td className="py-2.5 px-3 text-slate-600">销售业务中心</td>
                      <td className="py-2.5 px-3 font-bold text-blue-700">业务主管</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[11px]">已开通</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1e376b] text-white rounded-lg font-bold text-xs hover:bg-[#14264c] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-action Modal: 角色管理 (Role Management for this App) */}
      {/* ========================================================================= */}
      {activeModal && activeModal.type === 'role_manage' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">角色管理 · {activeModal.app.appName}</h3>
                  <div className="text-[11px] text-slate-500">
                    角色类型: {activeModal.app.roleType === 'with_role' ? '有角色应用 (支持多角色RBAC)' : '无角色应用 (全员通用访问)'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              {activeModal.app.roleType === 'with_role' ? (
                <div className="flex flex-col gap-3">
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-950 block">多角色鉴权体系</span>
                      <span className="text-[11px] text-slate-500">支持为不同职能人员分配差异化操作权限与数据范围</span>
                    </div>
                    <span className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded text-xs">
                      已配置 4 个角色
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">角色名称</th>
                          <th className="py-2.5 px-3">数据权限范围</th>
                          <th className="py-2.5 px-3 text-right">授权人数</th>
                          <th className="py-2.5 px-3 text-center">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">系统超级管理员</td>
                          <td className="py-2.5 px-3 text-slate-600">全部数据权限</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">3 人</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[11px]">启用</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">业务销售总监</td>
                          <td className="py-2.5 px-3 text-slate-600">本部及下级部门数据</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">12 人</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[11px]">启用</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">一线业务操作员</td>
                          <td className="py-2.5 px-3 text-slate-600">仅本人创建的数据</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">1,405 人</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[11px]">启用</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col gap-3 text-slate-700">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    <span>该应用为「无角色应用」</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    本应用内部未设置差异化角色权限隔离，已授权机构的所有有效用户均享有标准访问权限。如后续业务演进需要细化角色，可随时升级为「有角色应用」。
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1e376b] text-white rounded-lg font-bold text-xs hover:bg-[#14264c] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Sub-action Modal: 权限管理 (Permission Management for this App) */}
      {/* ========================================================================= */}
      {activeModal && activeModal.type === 'permission_manage' && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">权限资源清单 · {activeModal.app.appName}</h3>
                  <div className="text-[11px] text-slate-500">统一维护菜单权限、按钮操作与API接口资源校验</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">资源类型</th>
                      <th className="py-2.5 px-3">权限编码</th>
                      <th className="py-2.5 px-3">资源路径 / 接口地址</th>
                      <th className="py-2.5 px-3 text-center">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-[10px]">菜单资源</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">crm:customer:view</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">/crm/customer/list</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">生效中</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">
                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold text-[10px]">按钮操作</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">crm:contract:export</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">btn_export_contract</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">生效中</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3">
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold text-[10px]">API接口</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">api:v1:orders:create</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">POST /api/v1/orders</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">生效中</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#1e376b] text-white rounded-lg font-bold text-xs hover:bg-[#14264c] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
};
