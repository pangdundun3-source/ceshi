/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Users,
  Settings,
  Plus,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Network,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Database,
  RefreshCw,
  ExternalLink,
  Layers,
  Edit,
  Edit2,
  Edit3,
  Trash2,
  Check,
  Sparkles,
  Info,
  QrCode,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Eye,
  X,
  Radio,
  Lock,
  Boxes,
  HelpCircle,
  Smartphone,
  Share2,
  Download,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  FileText,
  CheckSquare,
  Square,
  Copy,
  UsersRound,
  Filter,
  UserPlus,
  Calendar,
  CalendarX2,
  Clock,
  PowerOff,
  RotateCcw,
  Mail,
  Send,
  Building,
  CheckCircle,
  ArrowUpDown
} from 'lucide-react';
import { INITIAL_APPS } from './AppManagement';
import { IntegratedApp } from '../types';
import { PermissionDictManage, PrimaryPermItem, SubPermItem } from './PermissionDictManage';
import { ExtDefaultInvitationConfig } from './ExtDefaultInvitationConfig';

// Data model for External User App Config Item
export interface ExternalUserAppConfigItem {
  id: string;
  appId: string;           // 对应 IntegratedApp 的 id
  appCode: string;         // 应用唯一ID / 编码
  appName: string;         // 应用全称
  appShortName: string;    // 应用简称
  iconBg: string;          // 应用图标渐变色
  category: string;        // 应用分类
  openedCustomerCount: number; // 有几个客户开通了这个应用

  // 核心配置字段
  hasExternalUserFeature: boolean; // 是否具有外部用户功能（外部用户就是应用内用户）
  wechatMpName: string;            // 消息推送的公众号名称
  wechatMpQrCode: string;          // 公众号的二维码 (图片数据 URL / Base64 / SVG)

  // 扩展信息
  description?: string;
  lastUpdated: string;
  pushChannels?: string[];
  status: 'active' | 'disabled';
}

// Data model for External User Role
export interface ExtRoleItem {
  id: string;
  roleName: string;
  roleCode: string;
  description: string;
  isEnabled: boolean;
  showInV8: boolean;
  sortOrder: number;
  assignedPermIds: string[];
  userCount: number;
}

// Data model for External User Group (群组)
export interface ExtGroupItem {
  id: string;
  groupCode: string;   // 群组唯一ID
  groupName: string;   // 群组名称
  description: string; // 群组说明
  isEnabled: boolean;  // 状态开关 (启用/停用)
  sortOrder: number;   // 排序
  userCount: number;   // 群组成员数
  createdAt: string;   // 创建时间
}

// Data model for Opened Organization (已开通机构)
export interface OpenedOrgItem {
  id: string;
  appCode: string;            // 所属应用编码
  orgCode: string;            // 机构编号 如 ORG-2026-001
  orgName: string;            // 机构全称
  orgShortName: string;       // 机构简称
  orgType: string;            // 机构类型（一类、二类、三类机构等）
  orgLevel: string;           // 机构级别（省级、地市级、区县级等）
  province: string;           // 机构所在省
  city: string;               // 机构所在市
  district: string;           // 机构所在区县
  creditCode: string;         // 机构统一社会信用代码
  knOrgId: string;            // 机构在康奈的 KN 唯一 ID
  statUnit: string;           // 统计单元
  salesName: string;          // 销售名称
  status: 'official' | 'trial' | 'expired' | 'disabled' | 'trash'; // 状态：正式、试用、已到期、已关停、回收站
  openDate: string;           // 开通时间
  expireDate: string;         // 到期时间
  externalUserCount: number;  // 已入驻外部用户数
  userQuota: number;          // 外部用户配额上限
  contactPerson?: string;     // 客户联系人
  contactPhone?: string;      // 联系电话
}

// 统计单元候选选项（统一演示数据）
export const STAT_UNIT_OPTIONS = [
  '全部统计单元',
  '康奈总部',
  '川藏区域',
  '东北区域',
  '四川区域',
  '陕西区域',
  '陕西一区',
  '陕西二区',
  '宁甘区域',
  '甘肃区域',
  '新疆区域',
  '海南区域',
  '广东区域',
];

// 默认已开通机构基础模拟数据
export const DEFAULT_OPENED_ORGS: OpenedOrgItem[] = [
  {
    id: 'org-01',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-001',
    orgName: '上海电气智能装备制造集团有限公司',
    orgShortName: '上海电气',
    orgType: '一类机构',
    orgLevel: '省级机构',
    province: '上海市',
    city: '上海市辖区',
    district: '闵行区',
    creditCode: '91310000132204567X',
    knOrgId: 'KN-ORG-SH-882101',
    statUnit: '康奈总部',
    salesName: '张建国',
    status: 'official',
    openDate: '2024-03-15',
    expireDate: '2027-03-14',
    externalUserCount: 142,
    userQuota: 200,
    contactPerson: '王晓光',
    contactPhone: '13812345678'
  },
  {
    id: 'org-02',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-002',
    orgName: '国家电网华东能源电力互联科技有限公司',
    orgShortName: '国家电网华东',
    orgType: '一类机构',
    orgLevel: '省级机构',
    province: '江苏省',
    city: '南京市',
    district: '鼓楼区',
    creditCode: '91310115717865432Y',
    knOrgId: 'KN-ORG-JS-773204',
    statUnit: '陕西二区',
    salesName: '李晓晨',
    status: 'official',
    openDate: '2024-05-10',
    expireDate: '2027-05-09',
    externalUserCount: 96,
    userQuota: 150,
    contactPerson: '赵志刚',
    contactPhone: '13987654321'
  },
  {
    id: 'org-03',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-003',
    orgName: '苏州工业园区微电子集成电路有限公司',
    orgShortName: '苏州微电子',
    orgType: '二类机构',
    orgLevel: '地市级机构',
    province: '江苏省',
    city: '苏州市',
    district: '苏州工业园区',
    creditCode: '91320500745231980A',
    knOrgId: 'KN-ORG-SZ-665412',
    statUnit: '康奈总部',
    salesName: '张建国',
    status: 'trial',
    openDate: '2026-08-01',
    expireDate: '2026-11-01',
    externalUserCount: 28,
    userQuota: 50,
    contactPerson: '陈立伟',
    contactPhone: '13711223344'
  },
  {
    id: 'org-04',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-004',
    orgName: '北京市智慧城市数字政务运营中心',
    orgShortName: '北京数字政务',
    orgType: '一类机构',
    orgLevel: '省级机构',
    province: '北京市',
    city: '北京市辖区',
    district: '海淀区',
    creditCode: '91110108MA01789B5C',
    knOrgId: 'KN-ORG-BJ-991032',
    statUnit: '东北区域',
    salesName: '王晓光',
    status: 'official',
    openDate: '2023-11-20',
    expireDate: '2026-11-19',
    externalUserCount: 310,
    userQuota: 500,
    contactPerson: '刘海波',
    contactPhone: '13699887766'
  },
  {
    id: 'org-05',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-005',
    orgName: '深圳前海金融科技创新实验室',
    orgShortName: '前海金科',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    creditCode: '91440300MA5DEF1234',
    knOrgId: 'KN-ORG-SZ-552190',
    statUnit: '广东区域',
    salesName: '郑雅琴',
    status: 'trial',
    openDate: '2026-07-15',
    expireDate: '2026-10-15',
    externalUserCount: 18,
    userQuota: 30,
    contactPerson: '孙雪梅',
    contactPhone: '13566778899'
  },
  {
    id: 'org-06',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-006',
    orgName: '广州市城市交通规划设计研究院',
    orgShortName: '广州交规院',
    orgType: '二类机构',
    orgLevel: '地市级机构',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    creditCode: '91440101MA5GHI5678',
    knOrgId: 'KN-ORG-GZ-441238',
    statUnit: '广东区域',
    salesName: '郑雅琴',
    status: 'official',
    openDate: '2024-08-01',
    expireDate: '2027-07-31',
    externalUserCount: 88,
    userQuota: 100,
    contactPerson: '周子墨',
    contactPhone: '13922334455'
  },
  {
    id: 'org-07',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-007',
    orgName: '成都天府软件产业园发展有限公司',
    orgShortName: '天府软件园',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '四川省',
    city: '成都市',
    district: '双流区',
    creditCode: '91510100MA6JKL9012',
    knOrgId: 'KN-ORG-CD-339811',
    statUnit: '四川区域',
    salesName: '吴东升',
    status: 'expired',
    openDate: '2023-08-10',
    expireDate: '2026-08-09',
    externalUserCount: 65,
    userQuota: 100,
    contactPerson: '杨建林',
    contactPhone: '13880011223'
  },
  {
    id: 'org-08',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-008',
    orgName: '西安高新区航空航天测控技术研究所',
    orgShortName: '高新航测所',
    orgType: '一类机构',
    orgLevel: '省级机构',
    province: '陕西省',
    city: '西安市',
    district: '雁塔区',
    creditCode: '91610131MA7MNO3456',
    knOrgId: 'KN-ORG-XA-227654',
    statUnit: '陕西一区',
    salesName: '陈立伟',
    status: 'official',
    openDate: '2024-01-05',
    expireDate: '2027-01-04',
    externalUserCount: 112,
    userQuota: 200,
    contactPerson: '魏思源',
    contactPhone: '13991122334'
  },
  {
    id: 'org-09',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-009',
    orgName: '武汉光谷生物城医药研发孵化基地',
    orgShortName: '光谷生物城',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '湖北省',
    city: '武汉市',
    district: '洪山区',
    creditCode: '91420100MA4PQR7890',
    knOrgId: 'KN-ORG-WH-114522',
    statUnit: '川藏区域',
    salesName: '李晓晨',
    status: 'trial',
    openDate: '2026-08-20',
    expireDate: '2026-11-20',
    externalUserCount: 15,
    userQuota: 50,
    contactPerson: '韩晓峰',
    contactPhone: '13607112233'
  },
  {
    id: 'org-10',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-010',
    orgName: '中海油华南分公司海上应急救援指挥部',
    orgShortName: '中海油应急部',
    orgType: '一类机构',
    orgLevel: '省级机构',
    province: '广东省',
    city: '湛江市',
    district: '坡头区',
    creditCode: '91440000190334561P',
    knOrgId: 'KN-ORG-ZJ-009843',
    statUnit: '海南区域',
    salesName: '张建国',
    status: 'official',
    openDate: '2024-09-01',
    expireDate: '2027-08-31',
    externalUserCount: 220,
    userQuota: 300,
    contactPerson: '方国强',
    contactPhone: '13820011990'
  },
  {
    id: 'org-11',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-011',
    orgName: '杭州西湖区文旅融媒体传播中心',
    orgShortName: '西湖文旅',
    orgType: '三类机构',
    orgLevel: '三类',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    creditCode: '91330106MA2STU1234',
    knOrgId: 'KN-ORG-HZ-881276',
    statUnit: '宁甘区域',
    salesName: '王晓光',
    status: 'expired',
    openDate: '2023-07-01',
    expireDate: '2026-07-01',
    externalUserCount: 42,
    userQuota: 80,
    contactPerson: '谢雨菲',
    contactPhone: '13588990011'
  },
  {
    id: 'org-12',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-012',
    orgName: '重庆两江新区智能网联汽车示范区',
    orgShortName: '两江智联汽车',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '重庆市',
    city: '重庆市辖区',
    district: '渝北区',
    creditCode: '91500000MA5VWX5678',
    knOrgId: 'KN-ORG-CQ-771902',
    statUnit: '川藏区域',
    salesName: '吴东升',
    status: 'disabled',
    openDate: '2023-12-01',
    expireDate: '2025-12-01',
    externalUserCount: 0,
    userQuota: 50,
    contactPerson: '唐晓波',
    contactPhone: '13908334455'
  },
  {
    id: 'org-13',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-013',
    orgName: '天津滨海新区现代物流供应链管理有限公司',
    orgShortName: '滨海物流',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '天津市',
    city: '天津市辖区',
    district: '滨海新区',
    creditCode: '91120116MA0YZ01234',
    knOrgId: 'KN-ORG-TJ-662319',
    statUnit: '东北区域',
    salesName: '王晓光',
    status: 'disabled',
    openDate: '2024-02-15',
    expireDate: '2025-02-15',
    externalUserCount: 0,
    userQuota: 100,
    contactPerson: '冯德华',
    contactPhone: '13312003344'
  },
  {
    id: 'org-14',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-014',
    orgName: '南京江北新区新材料产业技术研究院',
    orgShortName: '江北新材料',
    orgType: '三类机构',
    orgLevel: '三类',
    province: '江苏省',
    city: '南京市',
    district: '浦口区',
    creditCode: '91320191MA1ABC7890',
    knOrgId: 'KN-ORG-NJ-551108',
    statUnit: '陕西二区',
    salesName: '李晓晨',
    status: 'trash',
    openDate: '2023-05-10',
    expireDate: '2024-05-09',
    externalUserCount: 0,
    userQuota: 30,
    contactPerson: '徐志明',
    contactPhone: '13851002233'
  },
  {
    id: 'org-15',
    appCode: 'V8-A-01',
    orgCode: 'ORG-2026-015',
    orgName: '青岛市海洋生态环境监测科研中心',
    orgShortName: '青岛海洋监测',
    orgType: '二类机构',
    orgLevel: '地市级机构',
    province: '山东省',
    city: '青岛市',
    district: '市南区',
    creditCode: '91370200MA3DEF4567',
    knOrgId: 'KN-ORG-QD-449012',
    statUnit: '东北区域',
    salesName: '张建国',
    status: 'trash',
    openDate: '2023-06-01',
    expireDate: '2024-06-01',
    externalUserCount: 0,
    userQuota: 50,
    contactPerson: '宋子轩',
    contactPhone: '13605321122'
  }
];

// 统一机构候选主库（新开机构入驻时供搜索选择与自动带出信息）
export interface MasterOrgCandidate {
  id: string;
  orgName: string;            // 机构全称
  orgShortName: string;       // 机构简称
  creditCode: string;         // 统一社会信用代码
  orgType: string;            // 机构类型
  orgLevel: string;           // 机构管理级别
  province: string;
  city: string;
  district: string;
  knOrgId: string;
  statUnit: string;           // 机构所属统计单元
  salesName: string;          // 客户经理/销售经理的名字
}

export const MASTER_ORG_CANDIDATES: MasterOrgCandidate[] = [
  {
    id: 'cand-01',
    orgName: '上海市徐汇区宣传文化工作指导中心',
    orgShortName: '徐汇宣传指导中心',
    creditCode: '91310104MA1FL28K99',
    orgType: '一类机构',
    orgLevel: '区县级机构',
    province: '上海市',
    city: '上海市辖区',
    district: '徐汇区',
    knOrgId: 'KN-ORG-SH-880192',
    statUnit: '康奈总部',
    salesName: '张建国'
  },
  {
    id: 'cand-02',
    orgName: '上海市杨浦区融媒体新闻发布中心',
    orgShortName: '杨浦融媒体中心',
    creditCode: '91310110MA1FL9988X',
    orgType: '一类机构',
    orgLevel: '区县级机构',
    province: '上海市',
    city: '上海市辖区',
    district: '杨浦区',
    knOrgId: 'KN-ORG-SH-880231',
    statUnit: '康奈总部',
    salesName: '李晓晨'
  },
  {
    id: 'cand-03',
    orgName: '北京市海淀区文化创意产业促进会',
    orgShortName: '海淀文促会',
    creditCode: '91110108MA003ABC12',
    orgType: '一类机构',
    orgLevel: '区县级机构',
    province: '北京市',
    city: '北京市辖区',
    district: '海淀区',
    knOrgId: 'KN-ORG-BJ-991204',
    statUnit: '东北区域',
    salesName: '王晓光'
  },
  {
    id: 'cand-04',
    orgName: '北京市朝阳区公共文化服务协同保障中心',
    orgShortName: '朝阳文化协同中心',
    creditCode: '91110105MA019XYZ34',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '北京市',
    city: '北京市辖区',
    district: '朝阳区',
    knOrgId: 'KN-ORG-BJ-993418',
    statUnit: '东北区域',
    salesName: '陈立伟'
  },
  {
    id: 'cand-05',
    orgName: '广州市天河区数字创意产业园区管委会',
    orgShortName: '天河数创管委会',
    creditCode: '91440106MA59QWER78',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    knOrgId: 'KN-ORG-GZ-771239',
    statUnit: '广东区域',
    salesName: '吴东升'
  },
  {
    id: 'cand-06',
    orgName: '深圳市南山区科技创新与宣传工作部',
    orgShortName: '南山科创宣传部',
    creditCode: '91440300MA5DEF6789',
    orgType: '一类机构',
    orgLevel: '区县级机构',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    knOrgId: 'KN-ORG-SZ-778901',
    statUnit: '广东区域',
    salesName: '张建国'
  },
  {
    id: 'cand-07',
    orgName: '杭州市西湖区文旅融媒体传播服务站',
    orgShortName: '西湖文旅服务站',
    creditCode: '91330106MA2STU1234',
    orgType: '三类机构',
    orgLevel: '区县级机构',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    knOrgId: 'KN-ORG-HZ-881276',
    statUnit: '宁甘区域',
    salesName: '王晓光'
  },
  {
    id: 'cand-08',
    orgName: '杭州市滨江高新区产业数字大脑运营中心',
    orgShortName: '滨江高新数脑',
    creditCode: '91330108MA2UVW5678',
    orgType: '示范试点机构',
    orgLevel: '区县级机构',
    province: '浙江省',
    city: '杭州市',
    district: '滨江区',
    knOrgId: 'KN-ORG-HZ-883490',
    statUnit: '康奈总部',
    salesName: '李晓晨'
  },
  {
    id: 'cand-09',
    orgName: '南京市玄武区文化和旅游局综合信息中心',
    orgShortName: '玄武文旅信息中心',
    creditCode: '91320102MA1XYZ9900',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '江苏省',
    city: '南京市',
    district: '玄武区',
    knOrgId: 'KN-ORG-NJ-552233',
    statUnit: '陕西二区',
    salesName: '陈立伟'
  },
  {
    id: 'cand-10',
    orgName: '成都市高新区新经济发展局数字宣传中心',
    orgShortName: '成都高新数宣',
    creditCode: '91510100MA6JKL9012',
    orgType: '一类机构',
    orgLevel: '区县级机构',
    province: '四川省',
    city: '成都市',
    district: '武侯区',
    knOrgId: 'KN-ORG-CD-339811',
    statUnit: '四川区域',
    salesName: '吴东升'
  },
  {
    id: 'cand-11',
    orgName: '武汉市东湖新技术开发区现代服务业促进中心',
    orgShortName: '东湖高新促服中心',
    creditCode: '91420100MA4PQR7890',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '湖北省',
    city: '武汉市',
    district: '江夏区',
    knOrgId: 'KN-ORG-WH-114522',
    statUnit: '川藏区域',
    salesName: '李晓晨'
  },
  {
    id: 'cand-12',
    orgName: '西安市高新区数字丝路宣传推广中心',
    orgShortName: '西安高新数字丝路',
    creditCode: '91610131MA7MNO3456',
    orgType: '一类机构',
    orgLevel: '省级机构',
    province: '陕西省',
    city: '西安市',
    district: '雁塔区',
    knOrgId: 'KN-ORG-XA-227654',
    statUnit: '陕西区域',
    salesName: '陈立伟'
  },
  {
    id: 'cand-13',
    orgName: '天津市和平区融媒体矩阵调度指挥中心',
    orgShortName: '和平融媒指挥中心',
    creditCode: '91120101MA0XYZ7788',
    orgType: '二类机构',
    orgLevel: '区县级机构',
    province: '天津市',
    city: '天津市辖区',
    district: '和平区',
    knOrgId: 'KN-ORG-TJ-661102',
    statUnit: '东北区域',
    salesName: '王晓光'
  },
  {
    id: 'cand-14',
    orgName: '重庆市两江新区智能制造与数字创新服务中心',
    orgShortName: '两江数创中心',
    creditCode: '91500000MA5VWX5678',
    orgType: '示范试点机构',
    orgLevel: '区县级机构',
    province: '重庆市',
    city: '重庆市辖区',
    district: '渝北区',
    knOrgId: 'KN-ORG-CQ-771902',
    statUnit: '川藏区域',
    salesName: '吴东升'
  }
];

// 默认外部用户独立权限体系演示数据（与应用自身的权限字典完全不关联）
export const DEFAULT_EXT_PERMISSIONS: PrimaryPermItem[] = [
  {
    id: 'ext_perm_grp_01',
    permName: '网宣任务协作与转发',
    permCode: 'EXT:TASK:FORWARD',
    description: '外部联络员及协查人员接收网宣指令、任务多渠道转发、完成回执上传与转发效果统计。',
    v8Display: true,
    subPermissions: [
      {
        id: 'sub_ext_0101',
        subPermName: '网宣任务转发与分发',
        subPermCode: 'task:forward:execute',
        description: '允许外部用户将政务网宣任务一键转推至各级宣传矩阵与社群。',
        v8Display: true
      },
      {
        id: 'sub_ext_0102',
        subPermName: '任务转发回执与截图上传',
        subPermCode: 'task:forward:receipt',
        description: '支持上传任务转发完成凭证、截图与传播链接，以供核验。',
        v8Display: true
      },
      {
        id: 'sub_ext_0103',
        subPermName: '网宣任务转发效果统计',
        subPermCode: 'task:forward:stats',
        description: '查看本部门或个人任务转推量、阅读量与互动数据统计。',
        v8Display: true
      }
    ]
  },
  {
    id: 'ext_perm_grp_02',
    permName: '配置组织节点与层级',
    permCode: 'EXT:ORG:CONFIG',
    description: '负责应用内外部组织架构层级搭建、协作节点维护与人员归属设定。',
    v8Display: true,
    subPermissions: [
      {
        id: 'sub_ext_0201',
        subPermName: '配置组织节点与层级维护',
        subPermCode: 'org:node:manage',
        description: '支持在当前应用体系内创建、调整与维护各级业务协作组织节点。',
        v8Display: true
      },
      {
        id: 'sub_ext_0202',
        subPermName: '组织节点成员归属调配',
        subPermCode: 'org:member:assign',
        description: '支持将外部注册用户划拨关联至指定的协作组织节点。',
        v8Display: true
      },
      {
        id: 'sub_ext_0203',
        subPermName: '组织节点权限继承设置',
        subPermCode: 'org:node:inherit',
        description: '设置组织节点上下级之间的权限继承与消息穿透规则。',
        v8Display: true
      }
    ]
  },
  {
    id: 'ext_perm_grp_03',
    permName: '应用内外部用户角色管理',
    permCode: 'EXT:ROLE:MANAGE',
    description: '应用内不同外部用户角色的自定义创建、权限集勾选与身份授权。',
    v8Display: true,
    subPermissions: [
      {
        id: 'sub_ext_0301',
        subPermName: '角色管理与新增',
        subPermCode: 'role:custom:create',
        description: '支持根据协作场景创建自定义外部业务角色。',
        v8Display: true
      },
      {
        id: 'sub_ext_0302',
        subPermName: '角色权限分配与修改',
        subPermCode: 'role:perm:assign',
        description: '为指定角色勾选可使用的外部功能权限集合。',
        v8Display: true
      },
      {
        id: 'sub_ext_0303',
        subPermName: '角色成员批量绑定与调配',
        subPermCode: 'role:member:bind',
        description: '向外部人员批量指派角色身份或解除角色绑定。',
        v8Display: true
      }
    ]
  }
];

// 默认外部用户独立角色演示数据（包含：网宣指令操作员、网宣结果审核员）
export const DEFAULT_EXT_ROLES: ExtRoleItem[] = [
  {
    id: 'ext_role_01',
    roleName: '网宣指令操作员',
    roleCode: 'ROLE_EXT_DISPATCHER',
    description: '负责接收网宣指令，执行多渠道一键转发、上传完成回执及查看基础统计。',
    isEnabled: true,
    showInV8: true,
    sortOrder: 1,
    userCount: 48,
    assignedPermIds: ['ext_perm_grp_01', 'sub_ext_0101', 'sub_ext_0102', 'sub_ext_0103']
  },
  {
    id: 'ext_role_02',
    roleName: '网宣结果审核员',
    roleCode: 'ROLE_EXT_AUDITOR',
    description: '负责审核网宣任务完成凭证、核验转发效果并管理外部协作组织节点与角色分配。',
    isEnabled: true,
    showInV8: true,
    sortOrder: 2,
    userCount: 12,
    assignedPermIds: [
      'ext_perm_grp_01', 'sub_ext_0101', 'sub_ext_0102', 'sub_ext_0103',
      'ext_perm_grp_02', 'sub_ext_0201', 'sub_ext_0202', 'sub_ext_0203',
      'ext_perm_grp_03', 'sub_ext_0301', 'sub_ext_0302'
    ]
  }
];

// 默认外部用户独立群组演示数据（群主唯一ID、群组名称、群组说明）
export const DEFAULT_EXT_GROUPS: ExtGroupItem[] = [
  {
    id: 'grp-01',
    groupCode: 'GRP-WXB-001',
    groupName: '网宣核心调度群组',
    description: '承担重点网宣任务与应急舆论引导核心分发协同，覆盖省市核心网宣联络员与骨干人员。',
    isEnabled: true,
    sortOrder: 1,
    userCount: 28,
    createdAt: '2026-09-01 10:00'
  },
  {
    id: 'grp-02',
    groupCode: 'GRP-EMG-002',
    groupName: '应急联络响应群组',
    description: '突发事件与网络安全事件多方联动应急响应群组，负责即时工单对接与线索互通。',
    isEnabled: true,
    sortOrder: 2,
    userCount: 16,
    createdAt: '2026-09-03 14:30'
  },
  {
    id: 'grp-03',
    groupCode: 'GRP-SPV-003',
    groupName: '特约网评员协作群组',
    description: '汇聚各领域特邀专家与网评员队伍，开展常态化稿件推介、评论引导与信息反馈。',
    isEnabled: true,
    sortOrder: 3,
    userCount: 35,
    createdAt: '2026-09-05 09:15'
  }
];

// Generate realistic crisp QR Code SVG Data URI for WeChat MP
const generateSampleQrSvg = (title: string, color: string = '#07C160') => {
  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#ffffff" rx="12"/>
      <!-- Corner Markers -->
      <rect x="20" y="20" width="46" height="46" fill="#111827" rx="6"/>
      <rect x="26" y="26" width="34" height="34" fill="#ffffff" rx="3"/>
      <rect x="32" y="32" width="22" height="22" fill="#111827" rx="2"/>
      
      <rect x="134" y="20" width="46" height="46" fill="#111827" rx="6"/>
      <rect x="140" y="26" width="34" height="34" fill="#ffffff" rx="3"/>
      <rect x="146" y="32" width="22" height="22" fill="#111827" rx="2"/>
      
      <rect x="20" y="134" width="46" height="46" fill="#111827" rx="6"/>
      <rect x="26" y="140" width="34" height="34" fill="#ffffff" rx="3"/>
      <rect x="32" y="146" width="22" height="22" fill="#111827" rx="2"/>
      
      <!-- Data Pattern Dots -->
      <rect x="74" y="24" width="8" height="8" fill="#111827"/>
      <rect x="90" y="24" width="16" height="8" fill="#111827"/>
      <rect x="114" y="24" width="8" height="8" fill="#111827"/>
      <rect x="74" y="40" width="16" height="8" fill="#111827"/>
      <rect x="98" y="40" width="8" height="8" fill="#111827"/>
      <rect x="114" y="40" width="8" height="8" fill="#111827"/>
      <rect x="74" y="56" width="8" height="8" fill="#111827"/>
      <rect x="90" y="56" width="8" height="8" fill="#111827"/>
      <rect x="106" y="56" width="16" height="8" fill="#111827"/>

      <!-- Center Logo Box -->
      <rect x="76" y="76" width="48" height="48" fill="#ffffff" rx="8" stroke="${color}" stroke-width="2"/>
      <circle cx="100" cy="100" r="18" fill="${color}"/>
      <path d="M93 96 C93 92.5 96 90 100 90 C104 90 107 92.5 107 96 C107 99.5 104 102 100 102 C99.2 102 98.4 101.8 97.7 101.5 L95 103 L95.6 100.5 C94 99.3 93 97.7 93 96 Z" fill="#ffffff"/>
      <path d="M103 100 C103 97.2 105.2 95 108 95 C110.8 95 113 97.2 113 100 C113 102.8 110.8 105 108 105 C107.4 105 106.8 104.8 106.3 104.6 L104.2 105.8 L104.7 103.8 C103.6 102.8 103 101.5 103 100 Z" fill="#ffffff" opacity="0.9"/>
      
      <!-- Bottom Right Pattern -->
      <rect x="134" y="76" width="8" height="8" fill="#111827"/>
      <rect x="150" y="76" width="16" height="8" fill="#111827"/>
      <rect x="174" y="76" width="8" height="8" fill="#111827"/>
      <rect x="134" y="92" width="16" height="8" fill="#111827"/>
      <rect x="158" y="92" width="8" height="8" fill="#111827"/>
      <rect x="174" y="92" width="8" height="8" fill="#111827"/>
      <rect x="134" y="108" width="8" height="8" fill="#111827"/>
      <rect x="150" y="108" width="16" height="8" fill="#111827"/>
      <rect x="174" y="108" width="8" height="8" fill="#111827"/>

      <!-- Bottom Center Pattern -->
      <rect x="74" y="134" width="16" height="8" fill="#111827"/>
      <rect x="98" y="134" width="8" height="8" fill="#111827"/>
      <rect x="114" y="134" width="8" height="8" fill="#111827"/>
      <rect x="74" y="150" width="8" height="8" fill="#111827"/>
      <rect x="90" y="150" width="16" height="8" fill="#111827"/>
      <rect x="114" y="150" width="8" height="8" fill="#111827"/>
      <rect x="74" y="166" width="16" height="8" fill="#111827"/>
      <rect x="98" y="166" width="24" height="8" fill="#111827"/>

      <rect x="134" y="134" width="8" height="16" fill="#111827"/>
      <rect x="150" y="134" width="16" height="8" fill="#111827"/>
      <rect x="174" y="134" width="8" height="16" fill="#111827"/>
      <rect x="150" y="150" width="8" height="16" fill="#111827"/>
      <rect x="166" y="150" width="16" height="8" fill="#111827"/>
      <rect x="134" y="166" width="8" height="8" fill="#111827"/>
      <rect x="150" y="166" width="16" height="8" fill="#111827"/>
      <rect x="174" y="166" width="8" height="8" fill="#111827"/>
    </svg>
  `);
  return `data:image/svg+xml;utf8,${encoded}`;
};

// Official WeChat MP name presets specified by user
export const WECHAT_MP_PRESETS = [
  '指令流转',
  '点点速报',
  '点点速评',
  '康奈网络',
  '正管用平台'
];

// Initial Mock Configs matching existing system applications
const INITIAL_CONFIGS: ExternalUserAppConfigItem[] = [
  {
    id: 'cfg-01',
    appId: 'app-17',
    appCode: 'V8-P-17',
    appName: '网络指令上传下达系统',
    appShortName: '指令流转',
    iconBg: 'from-blue-600 via-indigo-700 to-cyan-800',
    category: '业务中台',
    openedCustomerCount: 98, // 86 official + 12 trial
    hasExternalUserFeature: true,
    wechatMpName: '指令流转',
    wechatMpQrCode: generateSampleQrSvg('指令流转', '#1d4ed8'),
    description: '支持各级网宣机构、联络处及协作专班人员通过公众号实时接收下达网络指令、完成回执上传与闭环流转',
    lastUpdated: '2026-09-08 16:30',
    pushChannels: ['微信服务号模板消息', '系统站内信', '短信协同'],
    status: 'active'
  },
  {
    id: 'cfg-02',
    appId: 'app-10',
    appCode: 'V8-P-10',
    appName: '点点速报 - 清朗净网鉴谣速报系统',
    appShortName: '点点速报',
    iconBg: 'from-amber-500 via-orange-600 to-red-600',
    category: '企业应用',
    openedCustomerCount: 123, // 105 official + 18 trial
    hasExternalUserFeature: true,
    wechatMpName: '点点速报',
    wechatMpQrCode: generateSampleQrSvg('点点速报', '#d97706'),
    description: '针对各单位外部网络监测员与舆情联络员，推送毫秒级谣言线索鉴别与速报通报提醒',
    lastUpdated: '2026-09-07 14:15',
    pushChannels: ['微信服务号预警卡片', '秒级广播推送'],
    status: 'active'
  },
  {
    id: 'cfg-03',
    appId: 'app-12',
    appCode: 'V8-P-12',
    appName: '点点速评 - 网络宣传指挥效果分析系统',
    appShortName: '点点速评',
    iconBg: 'from-indigo-600 via-blue-600 to-cyan-700',
    category: '业务中台',
    openedCustomerCount: 131, // 115 official + 16 trial
    hasExternalUserFeature: true,
    wechatMpName: '点点速评',
    wechatMpQrCode: generateSampleQrSvg('点点速评', '#4338ca'),
    description: '聚合特约网评员及外部宣传协作人员，开展任务指派、评论引导与传播效果实时追踪',
    lastUpdated: '2026-09-05 11:00',
    pushChannels: ['微信订阅通知', '公众号事件触发'],
    status: 'active'
  }
];

interface ExternalUserAppConfigProps {
  initialEditingAppCode?: string | null;
  onClearInitialEditing?: () => void;
  hideBreadcrumb?: boolean;
}

export const ExternalUserAppConfig: React.FC<ExternalUserAppConfigProps> = ({
  initialEditingAppCode,
  onClearInitialEditing,
  hideBreadcrumb = false
}) => {
  const [configs, setConfigs] = useState<ExternalUserAppConfigItem[]>(INITIAL_CONFIGS);

  // Drill-down Edit Page State (when not null, renders the configuration page)
  const [editingItem, setEditingItem] = useState<ExternalUserAppConfigItem | null>(null);

  // Auto drill-down if initialEditingAppCode is passed from AppManagement
  useEffect(() => {
    if (initialEditingAppCode) {
      const target = configs.find(c => c.appCode === initialEditingAppCode || c.appId === initialEditingAppCode);
      if (target) {
        handleDrillDownEdit(target);
      } else {
        const appMatch = INITIAL_APPS.find(a => a.appCode === initialEditingAppCode || a.id === initialEditingAppCode);
        if (appMatch) {
          const defaultMp = appMatch.extWechatMpName || appMatch.appShortName;
          const newCfg: ExternalUserAppConfigItem = {
            id: `cfg-${Date.now()}`,
            appId: appMatch.id,
            appCode: appMatch.appCode,
            appName: appMatch.appName,
            appShortName: appMatch.appShortName,
            iconBg: appMatch.iconBg || 'from-blue-600 via-indigo-700 to-cyan-800',
            category: appMatch.appCategory || '业务中台',
            openedCustomerCount: (appMatch.officialOrgCount || 0) + (appMatch.trialOrgCount || 0),
            hasExternalUserFeature: true,
            wechatMpName: defaultMp,
            wechatMpQrCode: generateSampleQrSvg(defaultMp),
            description: appMatch.description ? `承载${appMatch.appShortName}应用内外部用户消息触达与组织架构拓展` : '',
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'active'
          };
          setConfigs(prev => [newCfg, ...prev]);
          handleDrillDownEdit(newCfg);
        }
      }
      if (onClearInitialEditing) {
        onClearInitialEditing();
      }
    }
  }, [initialEditingAppCode]);
  
  // Horizontal Tab state in drill-down configuration page (ordered: 外部-基础配置, 默认邀请配置, 外部-默认权限, 外部-默认角色, 外部-默认群组, 已开通机构, 外部用户数据)
  const [activeDetailTab, setActiveDetailTab] = useState<'basic' | 'invitation' | 'permissions' | 'roles' | 'groups' | 'orgs' | 'users'>('basic');

  // 外部-基础配置 左侧子菜单状态：'core_params' (核心参数) | 'wechat_mp' (公众号配置)
  const [extBasicSubTab, setExtBasicSubTab] = useState<'core_params' | 'wechat_mp'>('core_params');

  // 各应用独立已开通机构数据
  const [openedOrgsMap, setOpenedOrgsMap] = useState<Record<string, OpenedOrgItem[]>>({
    'app-17': DEFAULT_OPENED_ORGS,
    'app-10': DEFAULT_OPENED_ORGS.slice(0, 10),
    'app-12': DEFAULT_OPENED_ORGS.slice(0, 12),
    'app-01': DEFAULT_OPENED_ORGS,
    'app-02': DEFAULT_OPENED_ORGS.slice(0, 10),
    'app-04': DEFAULT_OPENED_ORGS.slice(0, 12),
    'app-09': DEFAULT_OPENED_ORGS.slice(0, 8),
    'app-14': DEFAULT_OPENED_ORGS.slice(0, 11),
    'app-03': DEFAULT_OPENED_ORGS.slice(0, 7)
  });

  // 外部用户独立权限字典（按应用隔离）
  const [extPermsMap, setExtPermsMap] = useState<Record<string, PrimaryPermItem[]>>({
    'app-17': DEFAULT_EXT_PERMISSIONS,
    'app-10': DEFAULT_EXT_PERMISSIONS,
    'app-12': DEFAULT_EXT_PERMISSIONS,
    'app-01': DEFAULT_EXT_PERMISSIONS,
    'app-02': DEFAULT_EXT_PERMISSIONS,
    'app-04': DEFAULT_EXT_PERMISSIONS,
    'app-09': DEFAULT_EXT_PERMISSIONS,
    'app-14': DEFAULT_EXT_PERMISSIONS,
    'app-03': DEFAULT_EXT_PERMISSIONS
  });

  // 外部用户独立默认角色体系（按应用隔离）
  const [extRolesMap, setExtRolesMap] = useState<Record<string, ExtRoleItem[]>>({
    'app-17': DEFAULT_EXT_ROLES,
    'app-10': DEFAULT_EXT_ROLES,
    'app-12': DEFAULT_EXT_ROLES,
    'app-01': DEFAULT_EXT_ROLES,
    'app-02': DEFAULT_EXT_ROLES,
    'app-04': DEFAULT_EXT_ROLES,
    'app-09': DEFAULT_EXT_ROLES,
    'app-14': DEFAULT_EXT_ROLES,
    'app-03': DEFAULT_EXT_ROLES
  });

  // 外部用户独立默认群组体系（按应用隔离）
  const [extGroupsMap, setExtGroupsMap] = useState<Record<string, ExtGroupItem[]>>({
    'app-17': DEFAULT_EXT_GROUPS,
    'app-10': DEFAULT_EXT_GROUPS,
    'app-12': DEFAULT_EXT_GROUPS,
    'app-01': DEFAULT_EXT_GROUPS,
    'app-02': DEFAULT_EXT_GROUPS,
    'app-04': DEFAULT_EXT_GROUPS,
    'app-09': DEFAULT_EXT_GROUPS,
    'app-14': DEFAULT_EXT_GROUPS,
    'app-03': DEFAULT_EXT_GROUPS
  });

  // 当前下钻应用的唯一键值
  const currentAppKey = editingItem?.appId || editingItem?.appCode || 'app-01';

  // 当前应用的已开通机构数据
  const currentAppOrgs = useMemo(() => {
    return openedOrgsMap[currentAppKey] || DEFAULT_OPENED_ORGS;
  }, [openedOrgsMap, currentAppKey]);

  // ---------------- 已开通机构搜索与统计逻辑 ----------------
  const [orgFilterStatUnit, setOrgFilterStatUnit] = useState<string>('all');
  const [orgFilterSalesName, setOrgFilterSalesName] = useState<string>('');
  const [orgFilterNameQuery, setOrgFilterNameQuery] = useState<string>('');
  const [orgFilterStatus, setOrgFilterStatus] = useState<string>('all');

  // 到期天数计算辅助函数
  const getDaysUntilExpire = (expireDateStr: string): number => {
    if (!expireDateStr) return 0;
    const targetDate = new Date(expireDateStr + 'T00:00:00');
    const now = new Date('2026-09-10T00:00:00');
    const diffTime = targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 到期时间排序方向: 'none' | 'asc' | 'desc'
  const [orgExpireSortOrder, setOrgExpireSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // 悬停在机构简称上的浮动提示框状态
  const [hoveredOrgTooltip, setHoveredOrgTooltip] = useState<{
    org: OpenedOrgItem;
    x: number;
    y: number;
  } | null>(null);

  // =========================================================================
  // “新开机构入驻”弹窗交互与表单状态
  // =========================================================================
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState<boolean>(false);
  
  // 1. 机构搜索与选择状态
  const [orgSearchText, setOrgSearchText] = useState<string>('');
  const [isOrgSearchDropdownOpen, setIsOrgSearchDropdownOpen] = useState<boolean>(false);
  const [selectedCandidateOrg, setSelectedCandidateOrg] = useState<MasterOrgCandidate | null>(MASTER_ORG_CANDIDATES[0]);

  // 3. 试用与正式配置
  const [newOrgServiceType, setNewOrgServiceType] = useState<'official' | 'trial'>('official');
  const [newOrgExpireDate, setNewOrgExpireDate] = useState<string>('2027-09-10');
  const [newOrgUserQuota, setNewOrgUserQuota] = useState<number>(100);
  const [quotaValidationMsg, setQuotaValidationMsg] = useState<string>('');

  // 4. 状态标识 (开通 vs 关停)
  const [newOrgActiveStatus, setNewOrgActiveStatus] = useState<'open' | 'closed'>('open'); // 'open' = 开通 (生效), 'closed' = 关停 (暂缓)

  // 打开新开机构入驻弹窗
  const handleOpenAddOrgModal = () => {
    const defaultCand = MASTER_ORG_CANDIDATES[0] || null;
    setSelectedCandidateOrg(defaultCand);
    setOrgSearchText(defaultCand ? defaultCand.orgShortName : '');
    setIsOrgSearchDropdownOpen(false);
    setNewOrgServiceType('official');
    setNewOrgExpireDate('2027-09-10');
    setNewOrgUserQuota(100);
    setQuotaValidationMsg('');
    setNewOrgActiveStatus('open');
    setIsAddOrgModalOpen(true);
  };

  // 选择候选机构并自动带出信息
  const handleSelectCandidateOrg = (candidate: MasterOrgCandidate) => {
    setSelectedCandidateOrg(candidate);
    setOrgSearchText(candidate.orgShortName);
    setIsOrgSearchDropdownOpen(false);
    triggerToast(`已选择机构：${candidate.orgShortName}，已自动带出机构档案信息`);
  };

  // 切换“试用”与“正式”配置
  const handleServiceTypeChange = (type: 'official' | 'trial') => {
    setNewOrgServiceType(type);
    if (type === 'trial') {
      // 试用默认 1 个月后到期 (2026-10-10)
      setNewOrgExpireDate('2026-10-10');
      if (newOrgUserQuota === 100 || newOrgUserQuota === 500) {
        setNewOrgUserQuota(50);
      }
      triggerToast('已切换为【试用】模式，已将默认到期日设为1个月后');
    } else {
      // 正式默认 1 年后到期 (2027-09-10)
      setNewOrgExpireDate('2027-09-10');
      if (newOrgUserQuota === 50) {
        setNewOrgUserQuota(200);
      }
      triggerToast('已切换为【正式】模式，已将默认到期日设为1年后');
    }
  };

  // 配额人数输入与严格校验 (0 到 100,000)
  const handleUserQuotaChange = (valStr: string) => {
    if (valStr === '') {
      setNewOrgUserQuota(0);
      setQuotaValidationMsg('');
      return;
    }
    const val = Number(valStr);
    if (isNaN(val)) return;
    if (val < 0) {
      setQuotaValidationMsg('配额人数不能小于 0');
      setNewOrgUserQuota(0);
    } else if (val > 100000) {
      setQuotaValidationMsg('配额人数不能超过 100,000 人（10万）');
      setNewOrgUserQuota(100000);
    } else {
      setQuotaValidationMsg('');
      setNewOrgUserQuota(val);
    }
  };

  // 快捷设置配额人数
  const handleSetQuickQuota = (num: number) => {
    const clamped = Math.max(0, Math.min(100000, num));
    setNewOrgUserQuota(clamped);
    setQuotaValidationMsg('');
  };

  // 候选机构搜索结果过滤
  const searchedCandidateOrgs = useMemo(() => {
    if (!orgSearchText.trim()) {
      return MASTER_ORG_CANDIDATES;
    }
    const q = orgSearchText.trim().toLowerCase();
    return MASTER_ORG_CANDIDATES.filter(
      c => c.orgName.toLowerCase().includes(q) ||
           c.orgShortName.toLowerCase().includes(q) ||
           c.creditCode.toLowerCase().includes(q) ||
           c.salesName.toLowerCase().includes(q) ||
           c.statUnit.toLowerCase().includes(q)
    );
  }, [orgSearchText]);

  // 实际生效的筛选条件（点击搜索按钮后触发应用）
  const [appliedOrgFilters, setAppliedOrgFilters] = useState<{
    statUnit: string;
    salesName: string;
    nameQuery: string;
    status: string;
  }>({
    statUnit: 'all',
    salesName: '',
    nameQuery: '',
    status: 'all'
  });

  // 统计信息（6项指标）- 基于当前应用的总机构数据
  const orgMetrics = useMemo(() => {
    const total = currentAppOrgs.length;
    const trial = currentAppOrgs.filter(o => o.status === 'trial').length;
    const official = currentAppOrgs.filter(o => o.status === 'official').length;
    const expired = currentAppOrgs.filter(o => o.status === 'expired').length;
    const disabled = currentAppOrgs.filter(o => o.status === 'disabled').length;
    const trash = currentAppOrgs.filter(o => o.status === 'trash').length;
    return { total, trial, official, expired, disabled, trash };
  }, [currentAppOrgs]);

  // 执行搜索
  const handleSearchOrgs = () => {
    setAppliedOrgFilters({
      statUnit: orgFilterStatUnit,
      salesName: orgFilterSalesName.trim(),
      nameQuery: orgFilterNameQuery.trim(),
      status: orgFilterStatus
    });
    triggerToast('已按条件筛选机构列表');
  };

  // 重置搜索
  const handleResetOrgSearch = () => {
    setOrgFilterStatUnit('all');
    setOrgFilterSalesName('');
    setOrgFilterNameQuery('');
    setOrgFilterStatus('all');
    setAppliedOrgFilters({
      statUnit: 'all',
      salesName: '',
      nameQuery: '',
      status: 'all'
    });
    setOrgExpireSortOrder('none');
    triggerToast('已重置机构搜索条件');
  };

  // 点击顶部统计卡片快捷筛选状态
  const handleMetricCardClick = (statusKey: string) => {
    setOrgFilterStatus(statusKey);
    setAppliedOrgFilters(prev => ({
      ...prev,
      status: statusKey
    }));
    triggerToast(`已切换筛选：${statusKey === 'all' ? '全部机构' : statusKey === 'official' ? '正式机构' : statusKey === 'trial' ? '试用机构' : statusKey === 'expired' ? '已到期机构' : statusKey === 'disabled' ? '已关停机构' : '回收站机构'}`);
  };

  // 切换到期时间排序
  const toggleOrgExpireSort = () => {
    if (orgExpireSortOrder === 'none') {
      setOrgExpireSortOrder('asc');
      triggerToast('已按距离到期最近时间升序排列');
    } else if (orgExpireSortOrder === 'asc') {
      setOrgExpireSortOrder('desc');
      triggerToast('已按距离到期最远时间降序排列');
    } else {
      setOrgExpireSortOrder('none');
      triggerToast('已恢复默认排序');
    }
  };

  // 点击表格“统计单元”标签穿透筛选
  const handleFilterByStatUnit = (unit: string) => {
    setOrgFilterStatUnit(unit);
    setAppliedOrgFilters(prev => ({
      ...prev,
      statUnit: unit
    }));
    triggerToast(`已添加筛选条件：统计单元【${unit}】`);
  };

  // 点击表格“销售名称”标签穿透筛选
  const handleFilterBySalesName = (sales: string) => {
    setOrgFilterSalesName(sales);
    setAppliedOrgFilters(prev => ({
      ...prev,
      salesName: sales
    }));
    triggerToast(`已添加筛选条件：销售人员【${sales}】`);
  };

  // 点击表格“机构状态”徽章穿透筛选
  const handleFilterByStatus = (status: OpenedOrgItem['status']) => {
    setOrgFilterStatus(status);
    setAppliedOrgFilters(prev => ({
      ...prev,
      status: status
    }));
    const labelMap: Record<string, string> = {
      official: '正式',
      trial: '试用',
      expired: '已到期',
      disabled: '已关停',
      trash: '回收站'
    };
    triggerToast(`已添加筛选条件：机构状态【${labelMap[status] || status}】`);
  };

  // 回收站状态下：点击“恢复/回收”移入“已关停”状态
  const handleRestoreFromTrash = (orgId: string, orgShortName: string) => {
    setOpenedOrgsMap(prev => {
      const list = prev[currentAppKey] || DEFAULT_OPENED_ORGS;
      return {
        ...prev,
        [currentAppKey]: list.map(o => o.id === orgId ? { ...o, status: 'disabled' as const } : o)
      };
    });
    triggerToast(`已将【${orgShortName}】从回收站移入到“已关停”状态`);
  };

  // 已关停状态下：点击“删除”移入“回收站”状态
  const handleMoveToTrash = (orgId: string, orgShortName: string) => {
    setOpenedOrgsMap(prev => {
      const list = prev[currentAppKey] || DEFAULT_OPENED_ORGS;
      return {
        ...prev,
        [currentAppKey]: list.map(o => o.id === orgId ? { ...o, status: 'trash' as const } : o)
      };
    });
    triggerToast(`已将【${orgShortName}】从已关停移入到“回收站”`);
  };

  // 提交新开机构入驻
  const handleSaveNewOrg = () => {
    if (!selectedCandidateOrg) {
      triggerToast('请搜索并选择要开通的机构');
      return;
    }
    if (newOrgUserQuota < 0 || newOrgUserQuota > 100000) {
      triggerToast('许可配额人数必须在 0 到 10 万之间');
      return;
    }
    if (!newOrgExpireDate) {
      triggerToast('请选择外部服务到期日期');
      return;
    }

    const newId = `org-custom-${Date.now()}`;
    const newCode = `ORG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 899) + 100)}`;
    const newKnId = selectedCandidateOrg.knOrgId || `KN-ORG-2026-${String(Math.floor(Math.random() * 899) + 100)}`;
    
    // 状态标识：关停 => disabled; 开通 => official 或 trial
    const finalStatus: OpenedOrgItem['status'] = newOrgActiveStatus === 'closed'
      ? 'disabled'
      : newOrgServiceType;

    const item: OpenedOrgItem = {
      id: newId,
      appCode: editingItem?.appCode || 'V8-A-01',
      orgCode: newCode,
      orgName: selectedCandidateOrg.orgName,
      orgShortName: selectedCandidateOrg.orgShortName,
      orgType: selectedCandidateOrg.orgType,
      orgLevel: selectedCandidateOrg.orgLevel,
      province: selectedCandidateOrg.province,
      city: selectedCandidateOrg.city,
      district: selectedCandidateOrg.district,
      creditCode: selectedCandidateOrg.creditCode,
      knOrgId: newKnId,
      statUnit: selectedCandidateOrg.statUnit,
      salesName: selectedCandidateOrg.salesName,
      status: finalStatus,
      openDate: '2026-09-10',
      expireDate: newOrgExpireDate,
      externalUserCount: 0,
      userQuota: newOrgUserQuota,
      contactPerson: '',
      contactPhone: ''
    };

    setOpenedOrgsMap(prev => {
      const list = prev[currentAppKey] || DEFAULT_OPENED_ORGS;
      return {
        ...prev,
        [currentAppKey]: [item, ...list]
      };
    });

    setIsAddOrgModalOpen(false);
    triggerToast(
      `已成功为当前应用新开机构【${selectedCandidateOrg.orgShortName}】(${
        newOrgActiveStatus === 'open'
          ? newOrgServiceType === 'official'
            ? '正式开通'
            : '试用开通'
          : '已关停'
      })`
    );
  };

  // 经过搜索菜单过滤与排序后的机构列表
  const filteredOrgs = useMemo(() => {
    let result = currentAppOrgs.filter(org => {
      // 1. 统计单元筛选
      if (appliedOrgFilters.statUnit !== 'all' && org.statUnit !== appliedOrgFilters.statUnit) {
        return false;
      }
      // 2. 销售名称筛选
      if (appliedOrgFilters.salesName && !org.salesName.toLowerCase().includes(appliedOrgFilters.salesName.toLowerCase())) {
        return false;
      }
      // 3. 机构名称、简称模糊搜索
      if (appliedOrgFilters.nameQuery) {
        const q = appliedOrgFilters.nameQuery.toLowerCase();
        const matchName = org.orgName.toLowerCase().includes(q);
        const matchShortName = org.orgShortName.toLowerCase().includes(q);
        const matchCode = org.orgCode.toLowerCase().includes(q);
        if (!matchName && !matchShortName && !matchCode) {
          return false;
        }
      }
      // 4. 机构状态筛选
      if (appliedOrgFilters.status !== 'all' && org.status !== appliedOrgFilters.status) {
        return false;
      }
      return true;
    });

    // 到期时间排序
    if (orgExpireSortOrder === 'asc') {
      // 升序：距离到期最近的时间（天数最少或已到期负数最多）排在最前
      result = [...result].sort((a, b) => {
        return getDaysUntilExpire(a.expireDate) - getDaysUntilExpire(b.expireDate);
      });
    } else if (orgExpireSortOrder === 'desc') {
      // 降序：距离到期最远的时间排在最前
      result = [...result].sort((a, b) => {
        return getDaysUntilExpire(b.expireDate) - getDaysUntilExpire(a.expireDate);
      });
    }

    return result;
  }, [currentAppOrgs, appliedOrgFilters, orgExpireSortOrder]);

  // 当前应用的外部用户权限数据
  const currentAppPerms = useMemo(() => {
    return extPermsMap[currentAppKey] || DEFAULT_EXT_PERMISSIONS;
  }, [extPermsMap, currentAppKey]);

  // 当前应用的外部用户角色数据
  const currentAppRoles = useMemo(() => {
    return extRolesMap[currentAppKey] || DEFAULT_EXT_ROLES;
  }, [extRolesMap, currentAppKey]);

  // 当前应用的外部用户群组数据
  const currentAppGroups = useMemo(() => {
    return extGroupsMap[currentAppKey] || DEFAULT_EXT_GROUPS;
  }, [extGroupsMap, currentAppKey]);

  // ---------------- 默认角色状态与逻辑 ----------------
  const [selectedExtRoleId, setSelectedExtRoleId] = useState<string>('ext_role_01');
  const [editingExtRoleId, setEditingExtRoleId] = useState<'new' | string | null>(null);
  const [extRoleInlineForm, setExtRoleInlineForm] = useState<{
    roleName: string;
    roleCode: string;
    description: string;
    isEnabled: boolean;
    showInV8: boolean;
    sortOrder: string;
  }>({
    roleName: '',
    roleCode: '',
    description: '',
    isEnabled: true,
    showInV8: true,
    sortOrder: '1'
  });

  // 获取当前激活的角色
  const activeExtRole = useMemo(() => {
    return currentAppRoles.find(r => r.id === selectedExtRoleId) || currentAppRoles[0] || null;
  }, [currentAppRoles, selectedExtRoleId]);

  // 开始新增角色
  const handleStartAddExtRole = () => {
    const nextSort = currentAppRoles.length + 1;
    setExtRoleInlineForm({
      roleName: '',
      roleCode: '',
      description: '',
      isEnabled: true,
      showInV8: true,
      sortOrder: String(nextSort)
    });
    setEditingExtRoleId('new');
  };

  // 开始编辑角色
  const handleStartEditExtRole = (role: ExtRoleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExtRoleInlineForm({
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description,
      isEnabled: role.isEnabled,
      showInV8: role.showInV8,
      sortOrder: String(role.sortOrder)
    });
    setEditingExtRoleId(role.id);
  };

  // 取消内联编辑角色
  const handleCancelInlineExtRole = () => {
    setEditingExtRoleId(null);
  };

  // 保存内联编辑/新增角色
  const handleSaveInlineExtRole = () => {
    if (!extRoleInlineForm.roleName.trim()) {
      alert('请填写角色名称');
      return;
    }
    if (!extRoleInlineForm.roleCode.trim()) {
      alert('请填写角色唯一ID/编码');
      return;
    }

    const code = extRoleInlineForm.roleCode.trim().toUpperCase();
    const sortVal = parseInt(extRoleInlineForm.sortOrder, 10) || (currentAppRoles.length + 1);

    if (editingExtRoleId === 'new') {
      const exists = currentAppRoles.some(r => r.roleCode === code);
      if (exists) {
        alert(`角色唯一ID【${code}】已存在，请使用其他ID`);
        return;
      }
      const newRole: ExtRoleItem = {
        id: `ext_role_${Date.now()}`,
        roleName: extRoleInlineForm.roleName.trim(),
        roleCode: code,
        description: extRoleInlineForm.description.trim() || '外部用户业务权限角色',
        isEnabled: extRoleInlineForm.isEnabled,
        showInV8: extRoleInlineForm.showInV8,
        sortOrder: sortVal,
        assignedPermIds: currentAppPerms.flatMap(p => [p.id, ...p.subPermissions.map(s => s.id)]),
        userCount: 0
      };
      setExtRolesMap(prev => ({
        ...prev,
        [currentAppKey]: [...(prev[currentAppKey] || DEFAULT_EXT_ROLES), newRole]
      }));
      setSelectedExtRoleId(newRole.id);
      triggerToast(`成功新增外部用户角色【${newRole.roleName}】`);
    } else if (editingExtRoleId) {
      const exists = currentAppRoles.some(r => r.id !== editingExtRoleId && r.roleCode === code);
      if (exists) {
        alert(`角色唯一ID【${code}】已被其他角色占用，请修改`);
        return;
      }
      setExtRolesMap(prev => ({
        ...prev,
        [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_ROLES).map(r => {
          if (r.id === editingExtRoleId) {
            return {
              ...r,
              roleName: extRoleInlineForm.roleName.trim(),
              roleCode: code,
              description: extRoleInlineForm.description.trim(),
              isEnabled: extRoleInlineForm.isEnabled,
              showInV8: extRoleInlineForm.showInV8,
              sortOrder: sortVal
            };
          }
          return r;
        })
      }));
      triggerToast(`已更新角色【${extRoleInlineForm.roleName}】基本信息`);
    }

    setEditingExtRoleId(null);
  };

  // 删除角色
  const handleDeleteExtRole = (role: ExtRoleItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`确定要删除外部用户角色【${role.roleName}】吗？删除后相关外部用户将失去该角色权限。`)) {
      return;
    }
    setExtRolesMap(prev => {
      const list = (prev[currentAppKey] || DEFAULT_EXT_ROLES).filter(r => r.id !== role.id);
      return {
        ...prev,
        [currentAppKey]: list
      };
    });
    if (selectedExtRoleId === role.id) {
      const remaining = currentAppRoles.filter(r => r.id !== role.id);
      if (remaining.length > 0) {
        setSelectedExtRoleId(remaining[0].id);
      }
    }
    triggerToast(`已删除角色【${role.roleName}】`);
  };

  // 切换单个权限勾选
  const handleToggleExtPermForRole = (permId: string) => {
    if (!activeExtRole) return;
    const isCurrentlyChecked = activeExtRole.assignedPermIds.includes(permId);
    let newAssigned: string[];

    if (isCurrentlyChecked) {
      newAssigned = activeExtRole.assignedPermIds.filter(id => id !== permId);
      // 如果取消的是主权限，同时取消其下所有子权限
      const primary = currentAppPerms.find(p => p.id === permId);
      if (primary) {
        const subIds = new Set(primary.subPermissions.map(s => s.id));
        newAssigned = newAssigned.filter(id => !subIds.has(id));
      }
    } else {
      newAssigned = [...activeExtRole.assignedPermIds, permId];
      // 如果选中的是子权限，自动勾选所属主权限
      for (const primary of currentAppPerms) {
        if (primary.subPermissions.some(s => s.id === permId)) {
          if (!newAssigned.includes(primary.id)) {
            newAssigned.push(primary.id);
          }
          break;
        }
      }
    }

    setExtRolesMap(prev => ({
      ...prev,
      [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_ROLES).map(r => {
        if (r.id === activeExtRole.id) {
          return { ...r, assignedPermIds: newAssigned };
        }
        return r;
      })
    }));
  };

  // 切换主权限分组（全选/取消该组全部子项）
  const handleToggleExtPrimaryGroupForRole = (primary: PrimaryPermItem) => {
    if (!activeExtRole) return;
    const allGroupIds = [primary.id, ...primary.subPermissions.map(s => s.id)];
    const allChecked = allGroupIds.every(id => activeExtRole.assignedPermIds.includes(id));

    let newAssigned: string[];
    if (allChecked) {
      const groupSet = new Set(allGroupIds);
      newAssigned = activeExtRole.assignedPermIds.filter(id => !groupSet.has(id));
    } else {
      const combined = new Set([...activeExtRole.assignedPermIds, ...allGroupIds]);
      newAssigned = Array.from(combined);
    }

    setExtRolesMap(prev => ({
      ...prev,
      [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_ROLES).map(r => {
        if (r.id === activeExtRole.id) {
          return { ...r, assignedPermIds: newAssigned };
        }
        return r;
      })
    }));
  };

  // 为当前角色全选所有权限
  const handleSelectAllExtPermsForRole = () => {
    if (!activeExtRole) return;
    const allIds = currentAppPerms.flatMap(p => [p.id, ...p.subPermissions.map(s => s.id)]);
    setExtRolesMap(prev => ({
      ...prev,
      [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_ROLES).map(r => {
        if (r.id === activeExtRole.id) {
          return { ...r, assignedPermIds: allIds };
        }
        return r;
      })
    }));
    triggerToast(`已为【${activeExtRole.roleName}】分配全部权限`);
  };

  // 为当前角色清空所有权限
  const handleClearAllExtPermsForRole = () => {
    if (!activeExtRole) return;
    setExtRolesMap(prev => ({
      ...prev,
      [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_ROLES).map(r => {
        if (r.id === activeExtRole.id) {
          return { ...r, assignedPermIds: [] };
        }
        return r;
      })
    }));
    triggerToast(`已清空【${activeExtRole.roleName}】的所有权限`);
  };

  // ---------------- 默认群组状态与逻辑 ----------------
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupStatusFilter, setGroupStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<'add' | 'edit'>('add');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupFormData, setGroupFormData] = useState<{
    groupCode: string;
    groupName: string;
    description: string;
    isEnabled: boolean;
    sortOrder: string;
  }>({
    groupCode: '',
    groupName: '',
    description: '',
    isEnabled: true,
    sortOrder: '1'
  });

  // 过滤后的群组列表
  const filteredGroups = useMemo(() => {
    return currentAppGroups.filter(g => {
      const matchSearch =
        !groupSearchQuery.trim() ||
        g.groupName.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
        g.groupCode.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(groupSearchQuery.toLowerCase());

      const matchStatus =
        groupStatusFilter === 'all' ||
        (groupStatusFilter === 'active' && g.isEnabled) ||
        (groupStatusFilter === 'disabled' && !g.isEnabled);

      return matchSearch && matchStatus;
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [currentAppGroups, groupSearchQuery, groupStatusFilter]);

  // 打开新增群组模态框
  const handleOpenAddGroup = () => {
    const nextSort = currentAppGroups.length + 1;
    const randomCode = `GRP-${editingItem?.appCode ? editingItem.appCode.toUpperCase() : 'APP'}-${String(nextSort).padStart(3, '0')}`;
    setGroupModalMode('add');
    setEditingGroupId(null);
    setGroupFormData({
      groupCode: randomCode,
      groupName: '',
      description: '',
      isEnabled: true,
      sortOrder: String(nextSort)
    });
    setIsGroupModalOpen(true);
  };

  // 打开编辑群组模态框
  const handleOpenEditGroup = (group: ExtGroupItem) => {
    setGroupModalMode('edit');
    setEditingGroupId(group.id);
    setGroupFormData({
      groupCode: group.groupCode,
      groupName: group.groupName,
      description: group.description,
      isEnabled: group.isEnabled,
      sortOrder: String(group.sortOrder)
    });
    setIsGroupModalOpen(true);
  };

  // 保存群组（新增或编辑）
  const handleSaveGroupModal = () => {
    if (!groupFormData.groupName.trim()) {
      alert('请填写群组名称');
      return;
    }
    if (!groupFormData.groupCode.trim()) {
      alert('请填写群组唯一ID');
      return;
    }

    const code = groupFormData.groupCode.trim().toUpperCase();
    const sortVal = parseInt(groupFormData.sortOrder, 10) || (currentAppGroups.length + 1);

    if (groupModalMode === 'add') {
      const exists = currentAppGroups.some(g => g.groupCode === code);
      if (exists) {
        alert(`群组唯一ID【${code}】已存在，请使用其他唯一ID`);
        return;
      }
      const newGroup: ExtGroupItem = {
        id: `grp-${Date.now()}`,
        groupCode: code,
        groupName: groupFormData.groupName.trim(),
        description: groupFormData.description.trim() || '应用内外部协同工作群组',
        isEnabled: groupFormData.isEnabled,
        sortOrder: sortVal,
        userCount: 0,
        createdAt: '刚刚'
      };
      setExtGroupsMap(prev => ({
        ...prev,
        [currentAppKey]: [...(prev[currentAppKey] || DEFAULT_EXT_GROUPS), newGroup]
      }));
      triggerToast(`成功新增群组【${newGroup.groupName}】`);
    } else if (groupModalMode === 'edit' && editingGroupId) {
      const exists = currentAppGroups.some(g => g.id !== editingGroupId && g.groupCode === code);
      if (exists) {
        alert(`群组唯一ID【${code}】已被其他群组占用，请修改`);
        return;
      }
      setExtGroupsMap(prev => ({
        ...prev,
        [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_GROUPS).map(g => {
          if (g.id === editingGroupId) {
            return {
              ...g,
              groupCode: code,
              groupName: groupFormData.groupName.trim(),
              description: groupFormData.description.trim(),
              isEnabled: groupFormData.isEnabled,
              sortOrder: sortVal
            };
          }
          return g;
        })
      }));
      triggerToast(`已更新群组【${groupFormData.groupName}】`);
    }

    setIsGroupModalOpen(false);
  };

  // 切换群组启用/停用开关
  const handleToggleGroupStatus = (group: ExtGroupItem) => {
    const nextStatus = !group.isEnabled;
    setExtGroupsMap(prev => ({
      ...prev,
      [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_GROUPS).map(g => {
        if (g.id === group.id) {
          return { ...g, isEnabled: nextStatus };
        }
        return g;
      })
    }));
    triggerToast(`群组【${group.groupName}】已${nextStatus ? '启用' : '停用'}`);
  };

  // 删除群组
  const handleDeleteGroup = (group: ExtGroupItem) => {
    if (!window.confirm(`确定要删除群组【${group.groupName}】（唯一ID: ${group.groupCode}）吗？删除后相关外部用户将解除群组归属。`)) {
      return;
    }
    setExtGroupsMap(prev => ({
      ...prev,
      [currentAppKey]: (prev[currentAppKey] || DEFAULT_EXT_GROUPS).filter(g => g.id !== group.id)
    }));
    triggerToast(`已删除群组【${group.groupName}】`);
  };

  // 上移群组
  const handleMoveGroupUp = (index: number) => {
    if (index === 0) return;
    const list = [...filteredGroups];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    // 更新 sortOrder
    const updated = list.map((g, idx) => ({ ...g, sortOrder: idx + 1 }));
    setExtGroupsMap(prev => ({
      ...prev,
      [currentAppKey]: updated
    }));
    triggerToast('已更新群组排序');
  };

  // 下移群组
  const handleMoveGroupDown = (index: number) => {
    if (index === filteredGroups.length - 1) return;
    const list = [...filteredGroups];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    // 更新 sortOrder
    const updated = list.map((g, idx) => ({ ...g, sortOrder: idx + 1 }));
    setExtGroupsMap(prev => ({
      ...prev,
      [currentAppKey]: updated
    }));
    triggerToast('已更新群组排序');
  };

  // Modal State for Add
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Selected App in Add Modal (from INITIAL_APPS)
  const [selectedAppToAdd, setSelectedAppToAdd] = useState<IntegratedApp | null>(null);

  // Form Fields State for Modal & Drill-down Page
  const [formState, setFormState] = useState<{
    id?: string;
    appId: string;
    appCode: string;
    appName: string;
    appShortName: string;
    iconBg: string;
    category: string;
    openedCustomerCount: number;
    hasExternalUserFeature: boolean;
    wechatMpName: string;
    wechatMpQrCode: string;
    description: string;
  }>({
    appId: '',
    appCode: '',
    appName: '',
    appShortName: '',
    iconBg: '',
    category: '',
    openedCustomerCount: 0,
    hasExternalUserFeature: true,
    wechatMpName: '正管用平台',
    wechatMpQrCode: '',
    description: ''
  });

  // Toast / Feedback State
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal State for QR Code Zoom / Preview
  const [previewQrModal, setPreviewQrModal] = useState<{
    isOpen: boolean;
    appName: string;
    appShortName: string;
    wechatMpName: string;
    qrUrl: string;
  }>({
    isOpen: false,
    appName: '',
    appShortName: '',
    wechatMpName: '',
    qrUrl: ''
  });

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set of App IDs that have already been configured (for disabled state)
  const configuredAppIdSet = useMemo(() => {
    return new Set(configs.map(c => c.appId || c.appCode));
  }, [configs]);

  // Show temporary toast message
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  // Open "新增外部用户应用配置" Modal
  const handleOpenAddModal = () => {
    setSelectedAppToAdd(null);
    setFormState({
      appId: '',
      appCode: '',
      appName: '',
      appShortName: '',
      iconBg: '',
      category: '',
      openedCustomerCount: 0,
      hasExternalUserFeature: true,
      wechatMpName: WECHAT_MP_PRESETS[0],
      wechatMpQrCode: '',
      description: ''
    });
    setIsAddModalOpen(true);
  };

  // When clicking an App Card in the Add Modal
  const handleSelectAppToAdd = (app: IntegratedApp) => {
    const isAlreadyConfigured = configuredAppIdSet.has(app.id) || configuredAppIdSet.has(app.appCode);
    if (isAlreadyConfigured) {
      return; // Cannot be selected if already configured
    }

    setSelectedAppToAdd(app);
    const totalClients = (app.officialOrgCount || 0) + (app.trialOrgCount || 0);

    // Pick a default preset name
    const defaultMpName = WECHAT_MP_PRESETS[configs.length % WECHAT_MP_PRESETS.length] || '正管用平台';

    // Auto-fill fields from app
    setFormState(prev => ({
      ...prev,
      appId: app.id,
      appCode: app.appCode,
      appName: app.appName,
      appShortName: app.appShortName,
      iconBg: app.iconBg || 'from-blue-700 via-indigo-800 to-slate-900',
      category: app.appCategory || '业务中台',
      openedCustomerCount: totalClients,
      hasExternalUserFeature: true,
      wechatMpName: defaultMpName,
      wechatMpQrCode: generateSampleQrSvg(defaultMpName),
      description: app.description ? `承载${app.appShortName}应用内外部用户消息触达与组织架构拓展` : ''
    }));
  };

  // Click "编辑" -> Drill down to the Configuration Page
  const handleDrillDownEdit = (item: ExternalUserAppConfigItem) => {
    setEditingItem(item);
    setActiveDetailTab('basic');
    setFormState({
      id: item.id,
      appId: item.appId,
      appCode: item.appCode,
      appName: item.appName,
      appShortName: item.appShortName,
      iconBg: item.iconBg,
      category: item.category,
      openedCustomerCount: item.openedCustomerCount,
      hasExternalUserFeature: item.hasExternalUserFeature,
      wechatMpName: item.wechatMpName,
      wechatMpQrCode: item.wechatMpQrCode,
      description: item.description || ''
    });
  };

  // Handle Image Upload from disk
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请上传有效的图片文件（JPG、PNG、WEBP、SVG）');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormState(prev => ({
            ...prev,
            wechatMpQrCode: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new configuration from Modal
  const handleSaveNewConfig = () => {
    if (!selectedAppToAdd || !formState.appCode) {
      alert('请先选择要开通外部用户功能的应用');
      return;
    }
    if (!formState.wechatMpName.trim()) {
      alert('请填写或选择消息推送的公众号名称');
      return;
    }
    if (!formState.wechatMpQrCode) {
      alert('请上传或生成公众号二维码图片');
      return;
    }

    const newConfigItem: ExternalUserAppConfigItem = {
      id: `cfg-${Date.now()}`,
      appId: formState.appId,
      appCode: formState.appCode,
      appName: formState.appName,
      appShortName: formState.appShortName,
      iconBg: formState.iconBg,
      category: formState.category,
      openedCustomerCount: formState.openedCustomerCount,
      hasExternalUserFeature: formState.hasExternalUserFeature,
      wechatMpName: formState.wechatMpName.trim(),
      wechatMpQrCode: formState.wechatMpQrCode,
      description: formState.description || '已成功开通外部用户体系与公众号消息推送通道',
      lastUpdated: '刚刚',
      pushChannels: ['微信服务号推送', '系统通知'],
      status: 'active'
    };

    setConfigs(prev => [newConfigItem, ...prev]);
    setIsAddModalOpen(false);
    triggerToast(`成功新增【${newConfigItem.appShortName}】外部用户应用配置`);
  };

  // Save changes from Drill-down Configuration Page
  const handleSaveDrillDownConfig = () => {
    if (!formState.wechatMpName.trim()) {
      alert('请填写或选择消息推送的公众号名称');
      return;
    }
    if (!formState.wechatMpQrCode) {
      alert('请上传或生成公众号二维码图片');
      return;
    }

    setConfigs(prev => prev.map(item => {
      if (item.id === formState.id) {
        const updated = {
          ...item,
          hasExternalUserFeature: formState.hasExternalUserFeature,
          wechatMpName: formState.wechatMpName.trim(),
          wechatMpQrCode: formState.wechatMpQrCode,
          description: formState.description,
          lastUpdated: '刚刚'
        };
        setEditingItem(updated);
        return updated;
      }
      return item;
    }));

    triggerToast(`已成功保存【${formState.appShortName}】外部用户功能配置`);
  };

  // Toggle Application External User Config Status (开启 / 关闭)
  const handleToggleStatus = (item: ExternalUserAppConfigItem) => {
    const isClosing = item.status === 'active';
    const newStatus: 'active' | 'disabled' = isClosing ? 'disabled' : 'active';

    setConfigs(prev => prev.map(c => {
      if (c.id === item.id) {
        return {
          ...c,
          status: newStatus,
          lastUpdated: '刚刚'
        };
      }
      return c;
    }));

    if (isClosing) {
      triggerToast(`已关闭【${item.appShortName}】外部用户应用配置（已整行置灰并排序置底）`);
    } else {
      triggerToast(`已开启【${item.appShortName}】外部用户应用配置（已恢复正常显示）`);
    }
  };

  // 列表排序：开启的应用排在前面，关闭的应用排序放在最底下
  const displayConfigs = useMemo(() => {
    return [...configs].sort((a, b) => {
      const aDisabled = a.status === 'disabled' ? 1 : 0;
      const bDisabled = b.status === 'disabled' ? 1 : 0;
      return aDisabled - bDisabled;
    });
  }, [configs]);

  // =========================================================================
  // VIEW 1: Drill-down Configuration Page (下钻配置页)
  // =========================================================================
  if (editingItem) {
    return (
      <div className={`flex-1 ${hideBreadcrumb ? 'p-0' : 'h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] p-5'} text-slate-800 animate-in fade-in duration-200`} id="ext_user_config_detail_page">
        <div className="w-full flex flex-col gap-4">

          {/* Success Toast Notification */}
          {successToast && (
            <div className="fixed top-20 right-8 z-50 bg-[#1e376b] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}

          {/* 1. 面包屑导航: 放到顶部介绍框的上面，不要背景了，直接写到页面上 (仅在非内嵌标签页模式下显示) */}
          {!hideBreadcrumb && (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pl-1">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-[#1e376b] hover:text-blue-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>返回应用列表</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-bold">{editingItem.appShortName} 功能配置</span>
            </div>
          )}

          {/* 2. 顶部介绍框 */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {!hideBreadcrumb ? (
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${editingItem.iconBg || 'from-blue-600 to-indigo-700'} text-white font-black text-xs flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0`}
                >
                  {editingItem.appShortName.slice(0, 2)}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>
                      {hideBreadcrumb
                        ? '应用用户（外部用户）功能配置'
                        : `${editingItem.appShortName} - 应用用户（外部用户）功能配置`}
                    </span>
                  </h2>
                  {!hideBreadcrumb && (
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200 font-mono">
                      唯一ID: {editingItem.appCode}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  该应用已开通外部用户体系，在这里配置外部用户的各项初始化和默认参数。
                </p>
              </div>
            </div>
          </div>

          {/* 3. 横向 Tab 标签行 */}
          {/* 标签顺序：1. 外部-基础配置 2. 默认邀请配置 3. 外部-默认权限 4. 外部-默认角色 5. 外部-默认群组 6. 已开通机构 7. 外部用户数据 */}
          <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4 pt-2 rounded-xl shadow-xs overflow-x-auto">
            {[
              { id: 'basic', label: '外部-基础配置', icon: SlidersHorizontal },
              { id: 'invitation', label: '默认邀请配置', icon: UserPlus },
              { id: 'permissions', label: '外部-默认权限', icon: KeyRound },
              { id: 'roles', label: '外部-默认角色', icon: ShieldCheck },
              { id: 'groups', label: '外部-默认群组', icon: UsersRound },
              { id: 'orgs', label: '已开通机构', icon: Building2 },
              { id: 'users', label: '外部用户数据', icon: Users }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDetailTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-[#1e376b] text-[#1e376b] bg-blue-50/50 rounded-t-lg'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1e376b]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4. Tab 页面主体内容 */}
          {activeDetailTab === 'basic' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              
              {/* 包含左侧菜单与右侧主配置框的一体化容器（中间一条竖线分割） */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row min-h-[520px] overflow-hidden">
                
                {/* 左侧菜单栏 (与右侧框一体，右侧带一条竖线分割) */}
                <div className="w-full md:w-52 lg:w-56 bg-slate-50/70 md:border-r border-b md:border-b-0 border-slate-200/80 shrink-0 flex flex-col">
                  <nav className="flex-1 divide-y divide-slate-200/80" id="nav_ext_basic_submenu">
                    {/* (a) 第一个菜单：核心参数 */}
                    <button
                      type="button"
                      onClick={() => setExtBasicSubTab('core_params')}
                      id="submenu_ext_core_params"
                      className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer select-none text-xs font-bold ${
                        extBasicSubTab === 'core_params'
                          ? 'bg-white text-[#1e376b] font-black border-l-4 border-[#1e376b] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SlidersHorizontal className={`w-4 h-4 ${extBasicSubTab === 'core_params' ? 'text-[#1e376b]' : 'text-slate-400'}`} />
                        <span>核心参数</span>
                      </div>
                      {extBasicSubTab === 'core_params' && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#1e376b]" />
                      )}
                    </button>

                    {/* (b) 第二个菜单：公众号配置 */}
                    <button
                      type="button"
                      onClick={() => setExtBasicSubTab('wechat_mp')}
                      id="submenu_ext_wechat_mp"
                      className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer select-none text-xs font-bold ${
                        extBasicSubTab === 'wechat_mp'
                          ? 'bg-white text-[#1e376b] font-black border-l-4 border-[#1e376b] shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className={`w-4 h-4 ${extBasicSubTab === 'wechat_mp' ? 'text-[#1e376b]' : 'text-slate-400'}`} />
                        <span>公众号配置</span>
                      </div>
                      {extBasicSubTab === 'wechat_mp' && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#1e376b]" />
                      )}
                    </button>
                  </nav>
                </div>

                {/* 右侧主配置内容区 */}
                <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
                  
                  {/* 子菜单1：核心参数 */}
                  {extBasicSubTab === 'core_params' && (
                    <div className="flex flex-col gap-5 max-w-3xl animate-in fade-in duration-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-[#1e376b]" />
                          <div>
                            <h3 className="text-xs font-black text-slate-800 tracking-tight">外部用户与消息推送核心参数设置</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              配置该应用外部用户功能开关与业务形态定位
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveDrillDownConfig}
                          className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-[#15274d] text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          id="btn_save_ext_core_params"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>保存</span>
                        </button>
                      </div>

                      {/* 1. 是否具有外部用户功能（外部用户就是应用内用户） */}
                      <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 rounded-xl border border-blue-100 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">是否具有外部用户功能</span>
                            <span className="text-[10px] text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200 font-bold">
                              外部用户即应用内用户
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            开启后，该应用支持建立专属的外部人员账号体系与自主组织架构，支持外部人员通过公众号关注接收消息提醒
                          </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formState.hasExternalUserFeature}
                            onChange={(e) => setFormState(prev => ({ ...prev, hasExternalUserFeature: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6.5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5.5 after:w-5.5 after:transition-all peer-checked:bg-[#1e376b]"></div>
                        </label>
                      </div>

                      {/* 2. 外部用户业务说明与定位 */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black text-slate-800">外部用户业务说明与定位</label>
                        <textarea
                          rows={4}
                          placeholder="请输入该应用外部用户的组织形态、角色定位或消息推送业务场景说明..."
                          value={formState.description}
                          onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                        />
                      </div>

                      {/* Save Bar */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          最后更新时间：{editingItem.lastUpdated}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            取消并返回
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveDrillDownConfig}
                            className="px-6 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>保存修改</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 子菜单2：公众号配置 */}
                  {extBasicSubTab === 'wechat_mp' && (
                    <div className="flex flex-col gap-5 max-w-3xl animate-in fade-in duration-100">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <div>
                            <h3 className="text-xs font-black text-slate-800 tracking-tight">公众号配置</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              微信公众号服务号接入与消息推送关注二维码配置
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveDrillDownConfig}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          id="btn_save_ext_wechat_mp"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>保存</span>
                        </button>
                      </div>

                      {/* 1. 消息推送公众号名称 */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#07C160]" />
                          <span>消息推送的公众号名称 *</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="请输入或选择绑定的官方公众号名称"
                            value={formState.wechatMpName}
                            onChange={(e) => setFormState(prev => ({ ...prev, wechatMpName: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-3 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white font-bold text-slate-900"
                          />
                        </div>

                        {/* Preset Tags */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <span className="text-[11px] text-slate-400 font-medium">快捷选择预设：</span>
                          {WECHAT_MP_PRESETS.map(mp => (
                            <button
                              key={mp}
                              type="button"
                              onClick={() => {
                                setFormState(prev => ({
                                  ...prev,
                                  wechatMpName: mp,
                                  wechatMpQrCode: generateSampleQrSvg(mp)
                                }));
                              }}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                                formState.wechatMpName === mp
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              {mp}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. 公众号的二维码 (传图片) */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-blue-600" />
                          <span>公众号的二维码 (传图片) *</span>
                        </label>

                        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                          
                          {/* QR Code Container */}
                          <div className="w-28 h-28 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center overflow-hidden shrink-0 relative group shadow-xs">
                            {formState.wechatMpQrCode ? (
                              <>
                                <img
                                  src={formState.wechatMpQrCode}
                                  alt="公众号二维码"
                                  className="w-full h-full object-contain rounded-lg"
                                />
                                <div
                                  onClick={() => setPreviewQrModal({
                                    isOpen: true,
                                    appName: formState.appName,
                                    appShortName: formState.appShortName,
                                    wechatMpName: formState.wechatMpName,
                                    qrUrl: formState.wechatMpQrCode
                                  })}
                                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] cursor-pointer transition-opacity font-bold rounded-lg"
                                >
                                  <Eye className="w-4 h-4 mr-1" /> 点击放大
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center text-slate-400">
                                <QrCode className="w-8 h-8 stroke-[1.5]" />
                                <span className="text-[10px] mt-1">暂无二维码</span>
                              </div>
                            )}
                          </div>

                          {/* Actions and instructions */}
                          <div className="flex-1 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageFileChange}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3.5 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>上传二维码图片</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setFormState(prev => ({
                                  ...prev,
                                  wechatMpQrCode: generateSampleQrSvg(prev.wechatMpName || prev.appShortName)
                                }))}
                                className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                                <span>生成官方模板二维码</span>
                              </button>

                              {formState.wechatMpQrCode && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewQrModal({
                                    isOpen: true,
                                    appName: formState.appName,
                                    appShortName: formState.appShortName,
                                    wechatMpName: formState.wechatMpName,
                                    qrUrl: formState.wechatMpQrCode
                                  })}
                                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>大图预览</span>
                                </button>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              支持 JPG、PNG、SVG、WEBP 格式图片文件，上传后客户或外部用户可在该应用内扫码关注绑定微信公众号。
                            </p>
                          </div>

                        </div>
                      </div>

                      {/* Save Bar */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          最后更新时间：{editingItem.lastUpdated}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            取消并返回
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveDrillDownConfig}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>保存修改</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ---------------- 4.2 默认权限 Tab (照抄应用配置“权限字典”页面全部功能与样式，独立数据) ---------------- */}
          {activeDetailTab === 'permissions' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              
              {/* 顶部说明提示 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black shrink-0 border border-blue-100">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <span>【{editingItem.appShortName}】应用内外部用户默认权限字典</span>
                      <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono font-bold">
                        APP_CODE: {editingItem.appCode}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      本页面配置当前应用下各个不同外部用户的独立权限体系，包含【网宣任务转发】、【配置组织节点】、【角色管理】等外部专属权限。与应用系统全局权限字典相互隔离。
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                    主权限: {currentAppPerms.length} 组 · 子权限: {currentAppPerms.reduce((acc, p) => acc + p.subPermissions.length, 0)} 项
                  </span>
                </div>
              </div>

              {/* 嵌入完整的权限字典管理组件 */}
              <PermissionDictManage
                appCode={editingItem.appCode}
                primaryPerms={currentAppPerms}
                onChangePrimaryPerms={(newPerms) => {
                  setExtPermsMap(prev => ({
                    ...prev,
                    [currentAppKey]: newPerms
                  }));
                  triggerToast('外部用户权限字典已实时更新');
                }}
                showToast={(msg, type) => triggerToast(msg)}
              />

            </div>
          )}

          {/* ---------------- 4.3 默认角色 Tab (照抄应用配置“默认角色”页面全部功能与样式，独立数据) ---------------- */}
          {activeDetailTab === 'roles' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              
              {/* 顶部说明 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black shrink-0 border border-indigo-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <span>【{editingItem.appShortName}】应用内外部用户默认角色体系</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                        当前已配置 {currentAppRoles.length} 个角色
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      管理应用内外部用户的角色体系（如：网宣指令操作员、网宣结果审核员），支持为不同外部用户角色分配专属的外部权限树。
                    </p>
                  </div>
                </div>
              </div>

              {/* 左右分栏布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* 1. 左侧：角色列表管理 (4 栏) */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-slate-800">外部用户角色列表 ({currentAppRoles.length})</span>
                    </div>
                    {editingExtRoleId !== 'new' && (
                      <button
                        type="button"
                        onClick={handleStartAddExtRole}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>添加新角色</span>
                      </button>
                    )}
                  </div>

                  {/* 新增角色内联虚线表单 */}
                  {editingExtRoleId === 'new' && (
                    <div className="p-3 bg-indigo-50/40 rounded-xl border-2 border-dashed border-indigo-300 flex flex-col gap-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5 text-indigo-600" /> 新建外部用户角色
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelInlineExtRole}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">角色名称 *</label>
                        <input
                          type="text"
                          placeholder="例如: 网宣指令操作员"
                          value={extRoleInlineForm.roleName}
                          onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, roleName: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">角色唯一ID / 编码 *</label>
                        <input
                          type="text"
                          placeholder="例如: ROLE_EXT_DISPATCHER"
                          value={extRoleInlineForm.roleCode}
                          onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, roleCode: e.target.value.toUpperCase() }))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 font-mono font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-slate-600">角色说明</label>
                        <textarea
                          rows={2}
                          placeholder="描述该外部用户角色的主要职责与业务权限范围..."
                          value={extRoleInlineForm.description}
                          onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 text-slate-700"
                        />
                      </div>

                      {/* 附加开关设置 */}
                      <div className="p-2 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">1. 角色启用状态</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={extRoleInlineForm.isEnabled}
                              onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, isEnabled: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 font-medium">2. V8 客户端显示</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={extRoleInlineForm.showInV8}
                              onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, showInV8: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-slate-600 font-medium">3. 排序序号</span>
                          <input
                            type="number"
                            min={1}
                            value={extRoleInlineForm.sortOrder}
                            onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, sortOrder: e.target.value }))}
                            className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-center text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCancelInlineExtRole}
                          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveInlineExtRole}
                          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                        >
                          保存角色
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 角色卡片列表 */}
                  <div className="flex flex-col gap-2.5">
                    {currentAppRoles.map((role) => {
                      const isSelected = selectedExtRoleId === role.id;
                      const isInlineEditing = editingExtRoleId === role.id;

                      if (isInlineEditing) {
                        return (
                          <div
                            key={role.id}
                            className="p-3 bg-indigo-50/40 rounded-xl border-2 border-indigo-400 flex flex-col gap-2.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                                <Edit2 className="w-3.5 h-3.5 text-indigo-600" /> 编辑角色信息
                              </span>
                              <button
                                type="button"
                                onClick={handleCancelInlineExtRole}
                                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-600">角色名称 *</label>
                              <input
                                type="text"
                                value={extRoleInlineForm.roleName}
                                onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, roleName: e.target.value }))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 font-bold"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-600">角色唯一ID / 编码 *</label>
                              <input
                                type="text"
                                value={extRoleInlineForm.roleCode}
                                onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, roleCode: e.target.value.toUpperCase() }))}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 font-mono font-bold"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-slate-600">角色说明</label>
                              <textarea
                                rows={2}
                                value={extRoleInlineForm.description}
                                onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-indigo-500 text-slate-700"
                              />
                            </div>

                            <div className="p-2 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 text-[11px]">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 font-medium">1. 角色启用状态</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={extRoleInlineForm.isEnabled}
                                    onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, isEnabled: e.target.checked }))}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 font-medium">2. V8 客户端显示</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={extRoleInlineForm.showInV8}
                                    onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, showInV8: e.target.checked }))}
                                    className="sr-only peer"
                                  />
                                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                <span className="text-slate-600 font-medium">3. 排序序号</span>
                                <input
                                  type="number"
                                  min={1}
                                  value={extRoleInlineForm.sortOrder}
                                  onChange={(e) => setExtRoleInlineForm(prev => ({ ...prev, sortOrder: e.target.value }))}
                                  className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-center text-xs font-bold"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={handleCancelInlineExtRole}
                                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                取消
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveInlineExtRole}
                                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                              >
                                保存修改
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedExtRoleId(role.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative group ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-2 ring-indigo-500/10'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-black truncate ${isSelected ? 'text-indigo-950 font-black' : 'text-slate-900'}`}>
                                  {role.roleName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                  {role.roleCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {role.description}
                              </p>
                            </div>

                            {/* Actions on hover / active */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                type="button"
                                title="编辑角色信息"
                                onClick={(e) => handleStartEditExtRole(role, e)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="删除角色"
                                onClick={(e) => handleDeleteExtRole(role, e)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 rounded font-bold ${role.isEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                                {role.isEnabled ? '已启用' : '已停用'}
                              </span>
                              {role.showInV8 && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                  V8显示
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span>使用人数: <strong className="text-slate-700 font-bold">{role.userCount}</strong> 人</span>
                              <span>排序: {role.sortOrder}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* 2. 右侧：选定角色的权限勾选矩阵 (8 栏) */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col gap-4">
                  
                  {activeExtRole ? (
                    <>
                      {/* 右侧 Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">当前正在配置角色：</span>
                            <span className="text-sm font-black text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                              {activeExtRole.roleName}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {activeExtRole.roleCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            请勾选该外部角色允许调用的功能与数据权限。配置实时自动暂存。
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleSelectAllExtPermsForRole}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                          >
                            全选所有权限
                          </button>
                          <button
                            type="button"
                            onClick={handleClearAllExtPermsForRole}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          >
                            清空
                          </button>
                        </div>
                      </div>

                      {/* 权限勾选列表 */}
                      <div className="flex flex-col gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                        {currentAppPerms.map((primary) => {
                          const isPrimaryChecked = activeExtRole.assignedPermIds.includes(primary.id);
                          const subCount = primary.subPermissions.length;
                          const checkedSubCount = primary.subPermissions.filter(s => activeExtRole.assignedPermIds.includes(s.id)).length;
                          const isAllSubChecked = subCount > 0 && checkedSubCount === subCount;

                          return (
                            <div
                              key={primary.id}
                              className={`rounded-xl border transition-all p-3.5 flex flex-col gap-2.5 ${
                                isPrimaryChecked || checkedSubCount > 0
                                  ? 'border-indigo-200 bg-indigo-50/20'
                                  : 'border-slate-200 bg-white'
                              }`}
                            >
                              {/* 主权限行 */}
                              <div className="flex items-start justify-between gap-3">
                                <div
                                  onClick={() => handleToggleExtPermForRole(primary.id)}
                                  className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0"
                                >
                                  <div className="pt-0.5 shrink-0">
                                    {isPrimaryChecked ? (
                                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-300" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-black text-slate-900">
                                        {primary.permName}
                                      </span>
                                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                                        {primary.permCode}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                      {primary.description}
                                    </p>
                                  </div>
                                </div>

                                {subCount > 0 && (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] text-slate-400 font-bold">
                                      ({checkedSubCount}/{subCount})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleExtPrimaryGroupForRole(primary)}
                                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors cursor-pointer"
                                    >
                                      {isAllSubChecked ? '取消全部' : '全选子项'}
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* 子权限列表 */}
                              {primary.subPermissions.length > 0 ? (
                                <div className="flex flex-col divide-y divide-slate-100 pl-6 pt-1">
                                  {primary.subPermissions.map((sub) => {
                                    const isSubChecked = activeExtRole.assignedPermIds.includes(sub.id);

                                    return (
                                      <div
                                        key={sub.id}
                                        onClick={() => handleToggleExtPermForRole(sub.id)}
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
                                            <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                              {sub.subPermCode}
                                            </span>
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
                                <div className="text-[11px] text-slate-400 italic py-1 pl-6">
                                  暂无嵌套子权限
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>

                      {/* 底部实时状态条 */}
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center justify-between">
                        <span>✓ 角色权限配置实时生效已暂存</span>
                        <span>已分配 {activeExtRole.assignedPermIds.length} 项功能权限</span>
                      </div>

                    </>
                  ) : (
                    <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
                      <ShieldCheck className="w-8 h-8 text-slate-300" />
                      <p className="text-xs">请在左侧选择一个角色以配置权限</p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ---------------- 4.4 默认群组 Tab (新增独立群组管理列表) ---------------- */}
          {activeDetailTab === 'groups' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              
              {/* 顶部操作与检索栏 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black shrink-0 border border-purple-100">
                    <UsersRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <span>【{editingItem.appShortName}】应用内默认群组管理</span>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                        共 {currentAppGroups.length} 个群组
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      维护应用专属的外部协作群组清单，支持按组进行批量任务分发、权限委派与消息触达。各应用群组数据相互独立。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索群组名称 / 唯一ID..."
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-purple-500 focus:bg-white w-48 text-slate-800"
                    />
                  </div>

                  {/* Status filter */}
                  <select
                    value={groupStatusFilter}
                    onChange={(e) => setGroupStatusFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500 text-slate-700 font-bold cursor-pointer"
                  >
                    <option value="all">全部状态</option>
                    <option value="active">启用中</option>
                    <option value="disabled">已停用</option>
                  </select>

                  {/* Add Group button */}
                  <button
                    type="button"
                    onClick={handleOpenAddGroup}
                    className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-[#15274d] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增默认群组</span>
                  </button>
                </div>
              </div>

              {/* 群组数据列表表格 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4 w-20 text-center">排序</th>
                        <th className="py-3 px-4 w-44">群组唯一ID</th>
                        <th className="py-3 px-4 w-48">群组名称</th>
                        <th className="py-3 px-4">群组说明</th>
                        <th className="py-3 px-4 w-28 text-center">成员数</th>
                        <th className="py-3 px-4 w-28 text-center">状态开关</th>
                        <th className="py-3 px-4 w-40 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredGroups.length > 0 ? (
                        filteredGroups.map((group, index) => {
                          return (
                            <tr
                              key={group.id}
                              className="hover:bg-slate-50/60 transition-colors group"
                            >
                              {/* 排序 */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <div className="flex flex-col">
                                    <button
                                      type="button"
                                      disabled={index === 0}
                                      onClick={() => handleMoveGroupUp(index)}
                                      title="上移"
                                      className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={index === filteredGroups.length - 1}
                                      onClick={() => handleMoveGroupDown(index)}
                                      title="下移"
                                      className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    #{group.sortOrder}
                                  </span>
                                </div>
                              </td>

                              {/* 群组唯一ID */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/70 text-[11px]">
                                    {group.groupCode}
                                  </span>
                                  <button
                                    type="button"
                                    title="复制群组唯一ID"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(group.groupCode);
                                      triggerToast(`已复制唯一ID: ${group.groupCode}`);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 p-0.5 rounded cursor-pointer transition-opacity"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>

                              {/* 群组名称 */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-[10px] shrink-0 border border-purple-100">
                                    <UsersRound className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="font-black text-slate-900">
                                    {group.groupName}
                                  </span>
                                </div>
                              </td>

                              {/* 群组说明 */}
                              <td className="py-3 px-4 text-slate-500 leading-relaxed max-w-md">
                                {group.description || <span className="text-slate-300 italic">暂无说明</span>}
                              </td>

                              {/* 成员数 */}
                              <td className="py-3 px-4 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  {group.userCount} 人
                                </span>
                              </td>

                              {/* 状态开关 */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={group.isEnabled}
                                      onChange={() => handleToggleGroupStatus(group)}
                                      className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                                  </label>
                                  <span className={`text-[11px] font-bold ${group.isEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {group.isEnabled ? '启用' : '停用'}
                                  </span>
                                </div>
                              </td>

                              {/* 操作 */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditGroup(group)}
                                    className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-blue-700 font-bold rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    <span>编辑</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGroup(group)}
                                    className="px-2 py-1 text-rose-600 hover:bg-rose-50 font-bold rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>删除</span>
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <UsersRound className="w-8 h-8 text-slate-300" />
                              <p className="text-xs">暂无匹配的默认群组数据</p>
                              <button
                                type="button"
                                onClick={handleOpenAddGroup}
                                className="mt-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold hover:bg-purple-100 cursor-pointer"
                              >
                                立即新增第一个群组
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ---------------- 4.2 已开通机构 Tab ---------------- */}
          {activeDetailTab === 'orgs' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              
              {/* 1. 顶部 6 个统计指标卡片排列 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                
                {/* 指标 1: 目前开通的机构总数 */}
                <div
                  onClick={() => handleMetricCardClick('all')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    appliedOrgFilters.status === 'all'
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">开通机构总数</span>
                    <div className="w-7 h-7 rounded-lg bg-[#1e376b]/10 text-[#1e376b] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">{orgMetrics.total}</span>
                    <span className="text-[11px] font-medium text-slate-400">家</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">全系统开通总建档</p>
                </div>

                {/* 指标 2: 试用机构总数 */}
                <div
                  onClick={() => handleMetricCardClick('trial')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    appliedOrgFilters.status === 'trial'
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-amber-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-700">试用机构总数</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-amber-600 tracking-tight">{orgMetrics.trial}</span>
                    <span className="text-[11px] font-medium text-amber-600/70">家</span>
                  </div>
                  <p className="text-[11px] text-amber-600/70 mt-1 truncate">试用评估周期内</p>
                </div>

                {/* 指标 3: 正式机构总数 */}
                <div
                  onClick={() => handleMetricCardClick('official')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    appliedOrgFilters.status === 'official'
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-emerald-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700">正式机构总数</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-600 tracking-tight">{orgMetrics.official}</span>
                    <span className="text-[11px] font-medium text-emerald-600/70">家</span>
                  </div>
                  <p className="text-[11px] text-emerald-600/70 mt-1 truncate">正式签约服务中</p>
                </div>

                {/* 指标 4: 已到期机构总数 */}
                <div
                  onClick={() => handleMetricCardClick('expired')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    appliedOrgFilters.status === 'expired'
                      ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-500/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-orange-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-700">已到期机构总数</span>
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <CalendarX2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-orange-600 tracking-tight">{orgMetrics.expired}</span>
                    <span className="text-[11px] font-medium text-orange-600/70">家</span>
                  </div>
                  <p className="text-[11px] text-orange-600/70 mt-1 truncate">服务期满待续约</p>
                </div>

                {/* 指标 5: 已经关停机构总数 */}
                <div
                  onClick={() => handleMetricCardClick('disabled')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    appliedOrgFilters.status === 'disabled'
                      ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-rose-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-700">已关停机构总数</span>
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <PowerOff className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-rose-600 tracking-tight">{orgMetrics.disabled}</span>
                    <span className="text-[11px] font-medium text-rose-600/70">家</span>
                  </div>
                  <p className="text-[11px] text-rose-600/70 mt-1 truncate">业务中止或锁定</p>
                </div>

                {/* 指标 6: 回收站机构总数 */}
                <div
                  onClick={() => handleMetricCardClick('trash')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                    appliedOrgFilters.status === 'trash'
                      ? 'bg-slate-200/70 border-slate-400 ring-2 ring-slate-400/20 shadow-xs'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600">回收站机构总数</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-700 tracking-tight">{orgMetrics.trash}</span>
                    <span className="text-[11px] font-medium text-slate-400">家</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">归档待清理机构</p>
                </div>

              </div>

              {/* 2. 统计数据下面的搜索菜单 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4">
                <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-100 flex-wrap">
                  <Filter className="w-3.5 h-3.5 text-[#1e376b]" />
                  <span className="text-xs font-black text-slate-800">已开通机构检索与筛选</span>
                  {appliedOrgFilters.status !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                      状态：{appliedOrgFilters.status === 'official' ? '正式' : appliedOrgFilters.status === 'trial' ? '试用' : appliedOrgFilters.status === 'expired' ? '已到期' : appliedOrgFilters.status === 'disabled' ? '已关停' : '回收站'}
                    </span>
                  )}
                  {appliedOrgFilters.statUnit !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      单元：{appliedOrgFilters.statUnit}
                    </span>
                  )}
                  {appliedOrgFilters.salesName && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                      销售：{appliedOrgFilters.salesName}
                    </span>
                  )}
                </div>

                {/* 筛选输入项与操作按钮排在同一排 */}
                <div className="flex items-end gap-2.5 flex-wrap">
                  {/* (a) 统计单元下拉菜单 (宽度减少一半: w-44) */}
                  <div className="w-44 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      统计单元
                    </label>
                    <select
                      value={orgFilterStatUnit}
                      onChange={e => setOrgFilterStatUnit(e.target.value)}
                      className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:border-[#1e376b] focus:outline-none transition-colors"
                    >
                      {STAT_UNIT_OPTIONS.map(opt => (
                        <option key={opt} value={opt === '全部统计单元' ? 'all' : opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* (b) 销售名称单行文本框 (宽度减少一半: w-28) */}
                  <div className="w-28 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      销售名称
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orgFilterSalesName}
                        onChange={e => setOrgFilterSalesName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearchOrgs()}
                        placeholder="销售姓名..."
                        className="w-full h-9 pl-2.5 pr-6 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:border-[#1e376b] focus:outline-none transition-colors"
                      />
                      {orgFilterSalesName && (
                        <button
                          type="button"
                          onClick={() => setOrgFilterSalesName('')}
                          className="absolute right-1.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 机构名称、简称单行文本框 */}
                  <div className="w-44 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      机构名称、简称
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={orgFilterNameQuery}
                        onChange={e => setOrgFilterNameQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearchOrgs()}
                        placeholder="机构全称或简称..."
                        className="w-full h-9 pl-2.5 pr-6 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:border-[#1e376b] focus:outline-none transition-colors"
                      />
                      {orgFilterNameQuery && (
                        <button
                          type="button"
                          onClick={() => setOrgFilterNameQuery('')}
                          className="absolute right-1.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* (c) 机构状态下拉菜单 (宽度减少一半: w-28) */}
                  <div className="w-28 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      机构状态
                    </label>
                    <select
                      value={orgFilterStatus}
                      onChange={e => setOrgFilterStatus(e.target.value)}
                      className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:border-[#1e376b] focus:outline-none transition-colors"
                    >
                      <option value="all">全部状态</option>
                      <option value="official">正式</option>
                      <option value="trial">试用</option>
                      <option value="expired">已到期</option>
                      <option value="disabled">已关停</option>
                      <option value="trash">回收站</option>
                    </select>
                  </div>

                  {/* 布局调整：重置、搜索按钮与搜索项排在同一排，全部居左对齐 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetOrgSearch}
                      className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSearchOrgs}
                      className="h-9 px-4 bg-[#1e376b] hover:bg-[#15274d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>搜索</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* 3. 机构列表明细表格 */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#1e376b]" />
                    <h3 className="text-xs font-black text-slate-800">
                      开通机构清单
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      当前结果: {filteredOrgs.length} 家
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    所属应用: <span className="font-bold text-slate-700">{editingItem.appShortName}</span>（{editingItem.appCode}）
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
                        <th className="py-3 px-3.5 text-center w-12">序号</th>
                        {/* 第一列：机构简称 / 统计单元 · 销售 */}
                        <th className="py-3 px-4 min-w-[240px]">机构简称 / 统计单元 · 销售</th>
                        {/* 第二列：机构状态 */}
                        <th className="py-3 px-4 text-center min-w-[100px]">机构状态</th>
                        {/* 第三列：到期时间 (可点击排序) */}
                        <th className="py-3 px-4 min-w-[150px]">
                          <button
                            type="button"
                            onClick={toggleOrgExpireSort}
                            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer select-none group/sort"
                            title="点击按到期时间排序"
                          >
                            <span>到期时间</span>
                            {orgExpireSortOrder === 'asc' ? (
                              <span className="text-blue-700 font-black flex items-center text-[10px] bg-blue-50 px-1 py-0.5 rounded">
                                距离最近 ↑
                              </span>
                            ) : orgExpireSortOrder === 'desc' ? (
                              <span className="text-blue-700 font-black flex items-center text-[10px] bg-blue-50 px-1 py-0.5 rounded">
                                距离最远 ↓
                              </span>
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover/sort:text-slate-600" />
                            )}
                          </button>
                        </th>
                        {/* 第四列：外部用户数 / 配额 */}
                        <th className="py-3 px-4 text-center min-w-[130px]">外部用户数 / 配额</th>
                        {/* 第五列：操作 */}
                        <th className="py-3 px-4 text-center min-w-[160px]">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredOrgs.length > 0 ? (
                        filteredOrgs.map((org, idx) => {
                          const percent = Math.min(100, Math.round((org.externalUserCount / (org.userQuota || 1)) * 100));
                          const daysUntilExpire = getDaysUntilExpire(org.expireDate);
                          const isExpired = daysUntilExpire < 0;

                          return (
                            <tr key={org.id} className="hover:bg-blue-50/30 transition-colors group">
                              {/* 序号 */}
                              <td className="py-3 px-3.5 text-center font-mono text-slate-400 text-[11px]">
                                {String(idx + 1).padStart(2, '0')}
                              </td>

                              {/* 第一列：机构简称 + 悬停提示框 + 下方统计单元与销售名称标签 */}
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1.5">
                                  {/* (a) 机构简称 (加粗) */}
                                  <div
                                    className="inline-flex items-center gap-1.5 cursor-pointer select-none group/org w-fit"
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredOrgTooltip({
                                        org,
                                        x: rect.left + rect.width / 2,
                                        y: rect.top
                                      });
                                    }}
                                    onMouseMove={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredOrgTooltip({
                                        org,
                                        x: rect.left + rect.width / 2,
                                        y: rect.top
                                      });
                                    }}
                                    onMouseLeave={() => setHoveredOrgTooltip(null)}
                                  >
                                    <span className="font-black text-slate-900 text-xs group-hover/org:text-[#1e376b] transition-colors flex items-center gap-1">
                                      <Building className="w-3.5 h-3.5 text-[#1e376b]" />
                                      {org.orgShortName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 group-hover/org:text-blue-600">
                                      <Info className="w-3 h-3" />
                                    </span>
                                  </div>

                                  {/* (b) 在“机构简称”下方，显示“统计单元”和“销售名称”的标签（同一列内） */}
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {/* 统计单元标签 (点击只筛选该单元) */}
                                    <button
                                      type="button"
                                      onClick={() => handleFilterByStatUnit(org.statUnit)}
                                      title="点击仅筛选此统计单元"
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 border border-slate-200/80 transition-colors cursor-pointer"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                      <span className="truncate max-w-[160px]">{org.statUnit}</span>
                                    </button>

                                    {/* 销售名称标签 (点击只筛选该销售) */}
                                    <button
                                      type="button"
                                      onClick={() => handleFilterBySalesName(org.salesName)}
                                      title="点击仅筛选此销售经理所属机构"
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200/60 transition-colors cursor-pointer"
                                    >
                                      <UserCheck className="w-2.5 h-2.5 text-indigo-600" />
                                      <span>{org.salesName}</span>
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* 第二列：机构状态 (点击增加该状态筛选) */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleFilterByStatus(org.status)}
                                  title="点击快速筛选此状态"
                                  className="inline-flex cursor-pointer transition-transform hover:scale-105"
                                >
                                  {org.status === 'official' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                      正式
                                    </span>
                                  )}
                                  {org.status === 'trial' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                      试用
                                    </span>
                                  )}
                                  {org.status === 'expired' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200/80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                      已到期
                                    </span>
                                  )}
                                  {org.status === 'disabled' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                      已关停
                                    </span>
                                  )}
                                  {org.status === 'trash' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                      回收站
                                    </span>
                                  )}
                                </button>
                              </td>

                              {/* 第三列：到期时间 (第一行到期时间，第二行天数/已到期红色负数括号) */}
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-0.5">
                                  {/* 主要显示到期时间 */}
                                  <span className="font-mono text-slate-800 text-xs font-semibold">
                                    {org.expireDate}
                                  </span>
                                  {/* 距离到期天数，若已到期使用红色负数并括号括住 */}
                                  {isExpired ? (
                                    <span className="text-rose-600 font-bold text-[11px] font-mono">
                                      ({daysUntilExpire}天)
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[11px]">
                                      还有 <strong className="font-mono text-slate-700">{daysUntilExpire}</strong> 天
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 第四列：外部用户数 / 配额 */}
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1 items-center">
                                  <div className="flex items-center justify-between w-full max-w-[120px] text-[11px]">
                                    <span className="font-bold text-slate-900">{org.externalUserCount}</span>
                                    <span className="text-slate-400 text-[10px]">上限 {org.userQuota}</span>
                                  </div>
                                  <div className="w-full max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        percent > 90 ? 'bg-rose-500' : percent > 70 ? 'bg-amber-500' : 'bg-blue-600'
                                      }`}
                                      style={{ width: `${percent}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>

                              {/* 第五列：操作 */}
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                  {/* 配置机构专属外部用户参数按钮 (两行展示) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      triggerToast(`已开启【${org.orgShortName}】专属外部用户参数配置`);
                                    }}
                                    className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold rounded-md text-[11px] transition-colors cursor-pointer text-center leading-tight flex flex-col items-center justify-center"
                                  >
                                    <span>配置机构专属</span>
                                    <span>外部用户参数</span>
                                  </button>

                                  {/* 如果是“回收站”状态，增加“恢复/回收”按钮，移入“已关停”状态 */}
                                  {org.status === 'trash' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRestoreFromTrash(org.id, org.orgShortName)}
                                      title="从回收站恢复至已关停状态"
                                      className="px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      <span>恢复</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Building2 className="w-8 h-8 text-slate-300" />
                              <p className="text-xs">未找到符合搜索条件的开通机构</p>
                              <button
                                type="button"
                                onClick={handleResetOrgSearch}
                                className="mt-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer"
                              >
                                重置搜索条件
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ---------------- 4.3 外部用户管理 Placeholder Tab ---------------- */}
          {activeDetailTab === 'users' && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-12 flex flex-col items-center justify-center text-center gap-3 min-h-[380px] animate-in fade-in duration-150">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1e376b] flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-slate-800">
                【{editingItem.appShortName}】外部用户管理
              </h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                管理入驻本应用体系的外部协同用户台账、关联机构组织、实名身份核验与微信公众号关注绑定情况。
              </p>
              <button
                type="button"
                onClick={() => setActiveDetailTab('orgs')}
                className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                查看已开通机构
              </button>
            </div>
          )}

          {/* ---------------- 4.4 默认邀请配置 Tab ---------------- */}
          {activeDetailTab === 'invitation' && (
            <ExtDefaultInvitationConfig
              appConfig={editingItem}
              showToast={(msg) => triggerToast(msg)}
            />
          )}

        </div>

        {/* ========================================================================= */}
        {/* Floating Tooltip for 机构简称 (悬停提示框) */}
        {/* ========================================================================= */}
        {hoveredOrgTooltip && (
          <div
            className="fixed z-50 pointer-events-none transition-all duration-75 animate-in fade-in zoom-in-95"
            style={{
              left: `${Math.min(window.innerWidth - 340, Math.max(20, hoveredOrgTooltip.x - 160))}px`,
              top: `${Math.max(16, hoveredOrgTooltip.y - 190)}px`,
              width: '320px'
            }}
          >
            <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs backdrop-blur-md">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-1.5 font-black text-slate-100 truncate">
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{hoveredOrgTooltip.org.orgShortName}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-400/30 shrink-0">
                  {hoveredOrgTooltip.org.orgLevel || '省级机构'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-[11px]">
                {/* (a) 机构全称 */}
                <div className="flex items-start gap-1">
                  <span className="text-slate-400 shrink-0">机构全称:</span>
                  <span className="font-semibold text-slate-100 break-all leading-tight">
                    {hoveredOrgTooltip.org.orgName}
                  </span>
                </div>

                {/* (b) 机构类型 */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">机构类型:</span>
                  <span className="text-amber-300 font-medium">
                    {hoveredOrgTooltip.org.orgType || '一类机构'}
                  </span>
                </div>

                {/* (c) 所属省市区 */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">所属省市区:</span>
                  <span className="text-slate-200">
                    {hoveredOrgTooltip.org.province || '上海市'} / {hoveredOrgTooltip.org.city || '上海市辖区'} / {hoveredOrgTooltip.org.district || '闵行区'}
                  </span>
                </div>

                {/* (d) 统一社会信用代码 */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">统一信用代码:</span>
                  <span className="font-mono text-slate-300">
                    {hoveredOrgTooltip.org.creditCode || '91310000MA1FL28K99'}
                  </span>
                </div>

                {/* (e) 机构在系统的 KN 唯一标识 */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">KN唯一标识:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {hoveredOrgTooltip.org.knOrgId || 'KN-ORG-2026-8801'}
                  </span>
                </div>

                {/* (f) 机构级别 */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">管理层级:</span>
                  <span className="text-slate-200">
                    {hoveredOrgTooltip.org.orgLevel || '省级直管机构'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Modal: 新开机构入驻 (New Org Onboarding Modal) */}
        {/* ========================================================================= */}
        {isAddOrgModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 relative flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        新开机构入驻
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        外部组织入驻配置
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      为应用【<strong>{editingItem.appShortName}</strong>】（{editingItem.appCode}）开通外部机构入驻服务与许可配额
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddOrgModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form Container */}
              <div className="flex flex-col gap-5 text-xs">

                {/* ------------------------------------------------------------- */}
                {/* 1. 机构搜索与选择 (通过下拉菜单输入简称/全称搜索，并使用单选框选择) */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[11px] font-bold">1</span>
                      <span>机构搜索与选择</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      支持输入机构简称、全称、信用代码或责任销售进行模糊联想
                    </span>
                  </div>

                  {/* 搜索框与下拉菜单 */}
                  <div className="relative">
                    <div className="flex items-center relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={orgSearchText}
                        onChange={e => {
                          setOrgSearchText(e.target.value);
                          setIsOrgSearchDropdownOpen(true);
                        }}
                        onFocus={() => setIsOrgSearchDropdownOpen(true)}
                        placeholder="请输入机构简称或全称进行搜索选择..."
                        className="w-full h-10 pl-9 pr-24 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:border-[#1e376b] focus:ring-1 focus:ring-[#1e376b] focus:outline-none transition-all shadow-xs"
                      />
                      {orgSearchText && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrgSearchText('');
                            setIsOrgSearchDropdownOpen(true);
                          }}
                          className="absolute right-14 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsOrgSearchDropdownOpen(!isOrgSearchDropdownOpen)}
                        className="absolute right-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md cursor-pointer transition-colors"
                      >
                        {isOrgSearchDropdownOpen ? '收起候选' : '查看全部'}
                      </button>
                    </div>

                    {/* 下拉联想与单选候选列表 */}
                    {isOrgSearchDropdownOpen && (
                      <div className="absolute top-11 left-0 right-0 z-30 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                        {searchedCandidateOrgs.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-xs">
                            未检索到符合条件的机构，请尝试更换关键词
                          </div>
                        ) : (
                          searchedCandidateOrgs.map(cand => {
                            const isSelected = selectedCandidateOrg?.id === cand.id;
                            return (
                              <label
                                key={cand.id}
                                onClick={() => handleSelectCandidateOrg(cand)}
                                className={`p-3 flex items-start gap-3 hover:bg-blue-50/60 cursor-pointer transition-colors ${
                                  isSelected ? 'bg-blue-50/80 border-l-4 border-l-red-600' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="candidate_org_radio"
                                  checked={isSelected}
                                  onChange={() => handleSelectCandidateOrg(cand)}
                                  className="mt-0.5 text-red-600 focus:ring-red-500 cursor-pointer"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-900 text-xs">
                                      {cand.orgShortName}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                                      {cand.orgType}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {cand.statUnit}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-600 truncate mt-0.5">
                                    全称：{cand.orgName}
                                  </div>
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                                    <span>信用代码: {cand.creditCode}</span>
                                    <span>客户经理: {cand.salesName}</span>
                                  </div>
                                </div>
                              </label>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* ------------------------------------------------------------- */}
                {/* 2. 自动带出信息展示卡片 (选择机构后系统自动带出以下信息) */}
                {/* ------------------------------------------------------------- */}
                {selectedCandidateOrg && (
                  <div className="bg-white rounded-xl border border-blue-200 shadow-xs p-4 flex flex-col gap-3.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1e376b] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                        <h4 className="text-xs font-black text-slate-900">
                          已选机构档案（系统已自动带出）
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        已匹配主数据档案
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      
                      {/* (a) 机构简称与全称 */}
                      <div className="sm:col-span-2 md:col-span-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-slate-500">
                          (a) 机构简称与全称
                        </span>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900">
                            {selectedCandidateOrg.orgShortName}
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            （{selectedCandidateOrg.orgName}）
                          </span>
                        </div>
                      </div>

                      {/* (b) 统一社会信用代码 */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          (b) 统一社会信用代码
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {selectedCandidateOrg.creditCode}
                        </span>
                      </div>

                      {/* (c) 机构类型 */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          (c) 机构类型
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-blue-700">
                            {selectedCandidateOrg.orgType}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({selectedCandidateOrg.orgLevel})
                          </span>
                        </div>
                      </div>

                      {/* (d) 机构所属的统计单元 */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          (d) 所属统计单元
                        </span>
                        <span className="font-bold text-xs text-slate-800 truncate" title={selectedCandidateOrg.statUnit}>
                          {selectedCandidateOrg.statUnit}
                        </span>
                      </div>

                      {/* (e) 客户经理的名字 */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          (e) 客户经理姓名
                        </span>
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-bold text-xs text-slate-800">
                            {selectedCandidateOrg.salesName}
                          </span>
                        </div>
                      </div>

                      {/* KN唯一标识 */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          KN系统唯一标识
                        </span>
                        <span className="font-mono text-xs font-bold text-emerald-600">
                          {selectedCandidateOrg.knOrgId}
                        </span>
                      </div>

                      {/* 区域归属 */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          省份 / 城市 / 区县
                        </span>
                        <span className="text-xs text-slate-700 font-medium truncate">
                          {selectedCandidateOrg.province} / {selectedCandidateOrg.city} / {selectedCandidateOrg.district}
                        </span>
                      </div>

                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 3. 试用与正式配置 (选择试用/正式 + 填写到期日期 + 配额0~10万) */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-4 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1e376b] text-white flex items-center justify-center text-[11px] font-bold">3</span>
                      <h4 className="text-xs font-black text-slate-900">
                        服务模式与许可配额配置
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      请选择开通类型并设定到期日与许可人数
                    </span>
                  </div>

                  {/* 模式单选切换：试用 vs 正式 */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* 试用单选项 */}
                    <label
                      onClick={() => handleServiceTypeChange('trial')}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        newOrgServiceType === 'trial'
                          ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="org_service_type_radio"
                          checked={newOrgServiceType === 'trial'}
                          onChange={() => handleServiceTypeChange('trial')}
                          className="text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span>试用机构</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                              体验评估
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            默认开通 1 个月试用期
                          </div>
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </label>

                    {/* 正式单选项 */}
                    <label
                      onClick={() => handleServiceTypeChange('official')}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        newOrgServiceType === 'official'
                          ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="org_service_type_radio"
                          checked={newOrgServiceType === 'official'}
                          onChange={() => handleServiceTypeChange('official')}
                          className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span>正式机构</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              商用授权
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            长期商用签约服务
                          </div>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </label>

                  </div>

                  {/* 详细配置输入项：(a) 到期日期 & (b) 配额人数 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    
                    {/* (a) 外部服务到期日期 */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        (a) 外部服务到期日期 <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="date"
                          value={newOrgExpireDate}
                          onChange={e => setNewOrgExpireDate(e.target.value)}
                          className="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:border-[#1e376b] focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        当前设定为：{newOrgExpireDate || '未选择'}
                      </span>
                    </div>

                    {/* (b) 外部用户许可的配额人数 (0 到 10 万之间，不能更多) */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        (b) 外部用户许可配额人数 <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="number"
                          min="0"
                          max="100000"
                          value={newOrgUserQuota}
                          onChange={e => handleUserQuotaChange(e.target.value)}
                          className={`w-full h-9 pl-9 pr-14 bg-white border rounded-lg text-xs font-bold text-slate-900 focus:outline-none ${
                            quotaValidationMsg
                              ? 'border-rose-500 focus:border-rose-600 ring-1 ring-rose-200'
                              : 'border-slate-300 focus:border-[#1e376b]'
                          }`}
                        />
                        <span className="absolute right-3 text-xs font-bold text-slate-400 pointer-events-none">
                          人
                        </span>
                      </div>

                      {/* 错误提示或范围提醒 */}
                      {quotaValidationMsg ? (
                        <span className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {quotaValidationMsg}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          人数必须在 <strong>0 到 100,000 (10万)</strong> 之间，不能更多
                        </span>
                      )}

                      {/* 快捷选值 */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        <span className="text-[10px] text-slate-400">快捷设定:</span>
                        {[50, 200, 500, 1000, 5000, 20000, 100000].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => handleSetQuickQuota(n)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              newOrgUserQuota === n
                                ? 'bg-[#1e376b] text-white'
                                : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            {n === 100000 ? '10万人' : `${n}人`}
                          </button>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>

                {/* ------------------------------------------------------------- */}
                {/* 4. 状态标识 (显示该机构当前是“开通”还是“关停”的状态) */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1e376b] text-white flex items-center justify-center text-[11px] font-bold">4</span>
                      <h4 className="text-xs font-black text-slate-900">
                        机构初始状态设置
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      决定入驻后外部用户是否可立即访问系统
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* 开通状态 */}
                    <label
                      onClick={() => setNewOrgActiveStatus('open')}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        newOrgActiveStatus === 'open'
                          ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="org_active_status_radio"
                          checked={newOrgActiveStatus === 'open'}
                          onChange={() => setNewOrgActiveStatus('open')}
                          className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span>开通 (正常生效)</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            开通后外部用户可立即接收通知并登录系统
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </label>

                    {/* 关停状态 */}
                    <label
                      onClick={() => setNewOrgActiveStatus('closed')}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        newOrgActiveStatus === 'closed'
                          ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="org_active_status_radio"
                          checked={newOrgActiveStatus === 'closed'}
                          onChange={() => setNewOrgActiveStatus('closed')}
                          className="text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <div>
                          <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                            <span>关停 (暂缓开通)</span>
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            暂缓外部协同访问，需在机构列表中手动恢复
                          </div>
                        </div>
                      </div>
                      <PowerOff className="w-4 h-4 text-rose-500 shrink-0" />
                    </label>

                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  当前开通应用：<strong className="text-slate-800">{editingItem.appShortName}</strong>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddOrgModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewOrg}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg cursor-pointer flex items-center gap-1.5 transition-all"
                    id="btn_confirm_save_new_org"
                  >
                    <Check className="w-4 h-4" />
                    <span>立即开通入驻</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* QR Code Big Lightbox Modal */}
        {previewQrModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 relative flex flex-col items-center gap-4 text-center">
              <button
                onClick={() => setPreviewQrModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-[#07C160]"></span>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {previewQrModal.wechatMpName}
                </h3>
              </div>

              <p className="text-xs text-slate-500 -mt-2">
                所属应用：<strong>{previewQrModal.appShortName}</strong>
              </p>

              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-md flex items-center justify-center">
                <img
                  src={previewQrModal.qrUrl}
                  alt={previewQrModal.wechatMpName}
                  className="w-56 h-56 object-contain rounded-lg"
                />
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                微信扫描上方二维码关注公众号，接收【{previewQrModal.appShortName}】应用专属外部用户消息通知
              </div>

              <div className="w-full pt-2 flex items-center justify-center gap-2">
                <a
                  href={previewQrModal.qrUrl}
                  download={`${previewQrModal.appShortName}-公众号二维码.svg`}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载二维码</span>
                </a>
                <button
                  onClick={() => setPreviewQrModal(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-2 bg-[#1e376b] hover:bg-[#15274d] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  关闭
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: Primary List Page (应用配置列表页)
  // =========================================================================
  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800" id="external_user_app_config_page">
      <div className="w-full flex flex-col gap-5">
        
        {/* Success Toast Notification */}
        {successToast && (
          <div className="fixed top-20 right-8 z-50 bg-[#1e376b] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        {/* 1. Top Header Banner & Introduction: 严格遵循设计与样式规范 */}
        <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="ext_app_config_header_bar">
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">外部用户体系管理 / 外部用户应用配置</span>
            </nav>

            {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                外部用户应用配置
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
                复用页
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden md:block">
            配置与维护各应用专属外部用户体系、公众号推送与权限模型
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5 flex flex-col gap-5">

        {/* 3. Configured Apps Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-600 font-bold">
                  <th className="py-3 px-4">应用信息 (图标 / 简称 / 全称 / 唯一ID)</th>
                  <th className="py-3 px-4">是否具有外部用户功能</th>
                  <th className="py-3 px-4">开通客户数</th>
                  <th className="py-3 px-4">消息推送公众号名称</th>
                  <th className="py-3 px-4 text-center">公众号二维码</th>
                  <th className="py-3 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayConfigs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                        <span>暂无开通外部用户功能的应用配置</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayConfigs.map(item => {
                    const isDisabled = item.status === 'disabled';
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors group ${
                          isDisabled
                            ? 'bg-slate-100/70 hover:bg-slate-100/90 text-slate-400'
                            : 'bg-white hover:bg-blue-50/40'
                        }`}
                      >
                        
                        {/* 1. 应用信息 (图标、简称、全称、唯一ID) */}
                        <td className={`py-3.5 px-4 transition-opacity ${isDisabled ? 'opacity-40 grayscale-[0.85] select-none' : ''}`}>
                          <div className="flex items-center gap-3">
                            {/* 应用图标 */}
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.iconBg || 'from-blue-600 to-indigo-800'} text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0`}
                            >
                              {item.appShortName.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`font-black text-[13px] ${isDisabled ? 'text-slate-600 line-through decoration-slate-400' : 'text-slate-900'}`}>
                                  {item.appShortName}
                                </span>
                                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                                  ID: {item.appCode}
                                </span>
                                {isDisabled && (
                                  <span className="font-bold text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300">
                                    已关闭
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {item.appName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. 是否具有外部用户功能 */}
                        <td className={`py-3.5 px-4 transition-opacity ${isDisabled ? 'opacity-40 grayscale-[0.85] select-none' : ''}`}>
                          {isDisabled ? (
                            <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-200/90 px-3 py-1.5 rounded-full font-bold text-[11px] border border-slate-300">
                              <PowerOff className="w-3.5 h-3.5 text-slate-500" />
                              外部用户已关闭
                            </span>
                          ) : item.hasExternalUserFeature ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-bold text-[11px] border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              已开通外部用户功能
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full text-[11px]">
                              <XCircle className="w-3.5 h-3.5" />
                              未开启外部用户
                            </span>
                          )}
                          <span className="block text-[10px] text-slate-400 mt-0.5">外部用户即应用内用户</span>
                        </td>

                        {/* 3. 开通客户数 */}
                        <td className={`py-3.5 px-4 transition-opacity ${isDisabled ? 'opacity-40 grayscale-[0.85] select-none' : ''}`}>
                          <div className="flex items-center gap-1.5">
                            <Building2 className={`w-4 h-4 ${isDisabled ? 'text-slate-400' : 'text-indigo-600'}`} />
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {item.openedCustomerCount}
                            </span>
                          </div>
                        </td>

                        {/* 4. 消息推送公众号名称 */}
                        <td className={`py-3.5 px-4 transition-opacity ${isDisabled ? 'opacity-40 grayscale-[0.85] select-none' : ''}`}>
                          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                            <span className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-slate-400' : 'bg-[#07C160]'}`}></span>
                            <span>{item.wechatMpName || '未配置公众号'}</span>
                          </div>
                        </td>

                        {/* 5. 公众号二维码 */}
                        <td className={`py-3.5 px-4 text-center transition-opacity ${isDisabled ? 'opacity-40 grayscale-[0.85] select-none' : ''}`}>
                          <div className="inline-flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setPreviewQrModal({
                                isOpen: true,
                                appName: item.appName,
                                appShortName: item.appShortName,
                                wechatMpName: item.wechatMpName,
                                qrUrl: item.wechatMpQrCode
                              })}
                              className="relative group/qr p-1 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-blue-400 hover:shadow transition-all cursor-pointer"
                              title="点击放大查看公众号二维码"
                            >
                              <img
                                src={item.wechatMpQrCode}
                                alt={item.wechatMpName}
                                className="w-10 h-10 object-contain rounded"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover/qr:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Eye className="w-3.5 h-3.5" />
                              </div>
                            </button>
                          </div>
                        </td>

                        {/* 6. 操作 (编辑按钮 + 关闭/开启按钮，该列不置灰) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* 编辑按钮 */}
                            <button
                              type="button"
                              onClick={() => handleDrillDownEdit(item)}
                              className={`px-2.5 py-1 text-xs rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                                isDisabled
                                  ? 'text-slate-700 bg-slate-200/90 hover:bg-slate-300 border border-slate-300/80'
                                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100'
                              }`}
                              title="进入配置页"
                            >
                              <Edit className="w-3 h-3" />
                              <span>编辑</span>
                            </button>

                            {/* 关闭 / 开启 切换按钮 (关闭状态下变成开启按钮且不置灰) */}
                            {isDisabled ? (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item)}
                                className="px-3 py-1 text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs ring-1 ring-emerald-500/30"
                                title="点击开启该应用的外部用户功能（恢复正常排序与显示）"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-white" />
                                <span>开启</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(item)}
                                className="px-2.5 py-1 text-xs text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200/90 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                                title="点击关闭该应用的外部用户功能（置灰并排序移至最底下）"
                              >
                                <PowerOff className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                                <span>关闭</span>
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. [新增外部用户应用配置] Modal Popup */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 relative flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      新增外部用户应用配置
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      选择开通外部用户功能的应用，并为其配置消息推送公众号与二维码
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step 1: Select Application from all apps list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#1e376b] text-white flex items-center justify-center text-[10px]">1</span>
                    <span>选择开通此功能的应用 (已开通的应用不能二次选择) *</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    共 {INITIAL_APPS.length} 款可选应用
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {INITIAL_APPS.map(app => {
                    const isAlreadyConfigured = configuredAppIdSet.has(app.id) || configuredAppIdSet.has(app.appCode);
                    const isSelected = selectedAppToAdd?.id === app.id;
                    const totalClients = (app.officialOrgCount || 0) + (app.trialOrgCount || 0);

                    return (
                      <button
                        key={app.id}
                        type="button"
                        disabled={isAlreadyConfigured}
                        onClick={() => handleSelectAppToAdd(app)}
                        className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                          isAlreadyConfigured
                            ? 'bg-slate-100/80 border-slate-200 opacity-55 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        {/* App Icon + Badge */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.iconBg || 'from-blue-600 to-indigo-800'} text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0`}
                          >
                            {app.appShortName.slice(0, 2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-900 truncate">
                              {app.appShortName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {app.appCode}
                            </div>
                          </div>
                        </div>

                        {/* Customer Count & State */}
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 font-medium">
                            {totalClients} 家客户
                          </span>
                          {isAlreadyConfigured ? (
                            <span className="text-slate-400 font-bold bg-slate-200 px-1 py-0.2 rounded">
                              已开通
                            </span>
                          ) : isSelected ? (
                            <span className="text-blue-700 font-bold flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> 已选
                            </span>
                          ) : (
                            <span className="text-slate-400">可选</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Configure Details for Selected App */}
              {selectedAppToAdd ? (
                <div className="flex flex-col gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-[#1e376b] text-white flex items-center justify-center text-[10px]">2</span>
                    <span>外部用户与消息推送详细配置</span>
                  </div>

                  {/* Locked Application Info Readout */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">应用简称</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{formState.appShortName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">应用唯一ID</span>
                      <span className="font-mono font-bold text-blue-700 mt-0.5 block">{formState.appCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">应用全称</span>
                      <span className="font-medium text-slate-700 mt-0.5 block truncate" title={formState.appName}>
                        {formState.appName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">开通客户数</span>
                      <span className="font-bold text-indigo-700 mt-0.5 block">
                        {formState.openedCustomerCount} 家客户机构
                      </span>
                    </div>
                  </div>

                  {/* Feature Toggle: 是否具有外部用户功能（外部用户就是应用内用户） */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>是否具有外部用户功能</span>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-semibold">
                          外部用户即应用内用户
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        开启后，该应用允许具备独立的外部用户账号体系及消息推送触达通道
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formState.hasExternalUserFeature}
                        onChange={(e) => setFormState(prev => ({ ...prev, hasExternalUserFeature: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e376b]"></div>
                    </label>
                  </div>

                  {/* 消息推送公众号名称 */}
                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">
                      消息推送的公众号名称 *
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-[#07C160] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="如：正管用政务微讯 / 谛听预警官方公众号"
                        value={formState.wechatMpName}
                        onChange={(e) => setFormState(prev => ({ ...prev, wechatMpName: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* 公众号的二维码（传图片） */}
                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">
                      公众号的二维码 (传图片) *
                    </label>
                    <div className="p-4 bg-white rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all flex flex-col sm:flex-row items-center gap-4">
                      
                      {/* Image Preview Box */}
                      <div className="w-24 h-24 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                        {formState.wechatMpQrCode ? (
                          <>
                            <img
                              src={formState.wechatMpQrCode}
                              alt="二维码预览"
                              className="w-full h-full object-contain"
                            />
                            <div
                              onClick={() => setPreviewQrModal({
                                isOpen: true,
                                appName: formState.appName,
                                appShortName: formState.appShortName,
                                wechatMpName: formState.wechatMpName,
                                qrUrl: formState.wechatMpQrCode
                              })}
                              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] cursor-pointer transition-opacity"
                            >
                              <Eye className="w-4 h-4 mr-1" /> 放大
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-slate-400">
                            <QrCode className="w-8 h-8 stroke-[1.5]" />
                            <span className="text-[10px] mt-1">未选二维码</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Actions */}
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-[#1e376b] hover:bg-[#15274d] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>上传二维码图片</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormState(prev => ({
                              ...prev,
                              wechatMpQrCode: generateSampleQrSvg(prev.wechatMpName || prev.appShortName)
                            }))}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>使用微信绿标模板二维码</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          支持 JPG、PNG、SVG、WEBP 格式文件，推荐 500x500 像素以上清晰二维码。可点击放大预览。
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">
                      外部用户业务说明 (选填)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="说明该应用外部用户的组织形态、角色定位或消息推送场景..."
                      value={formState.description}
                      onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-slate-400" />
                  <span>请在上方列表中点击选中一款【未开通】的应用以继续配置</span>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {selectedAppToAdd ? `已选: ${formState.appShortName} (${formState.appCode})` : '未选择应用'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    disabled={!selectedAppToAdd}
                    onClick={handleSaveNewConfig}
                    className={`px-5 py-2 font-bold rounded-lg shadow-sm transition-all cursor-pointer ${
                      selectedAppToAdd
                        ? 'bg-[#1e376b] hover:bg-[#15274d] text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    保存配置
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. [查看二维码大图] Preview Lightbox Modal */}
        {previewQrModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 relative flex flex-col items-center gap-4 text-center">
              <button
                onClick={() => setPreviewQrModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-[#07C160]"></span>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {previewQrModal.wechatMpName}
                </h3>
              </div>

              <p className="text-xs text-slate-500 -mt-2">
                所属应用：<strong>{previewQrModal.appShortName}</strong>
              </p>

              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-md flex items-center justify-center">
                <img
                  src={previewQrModal.qrUrl}
                  alt={previewQrModal.wechatMpName}
                  className="w-56 h-56 object-contain rounded-lg"
                />
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                微信扫描上方二维码关注公众号，接收【{previewQrModal.appShortName}】应用专属外部用户消息通知
              </div>

              <div className="w-full pt-2 flex items-center justify-center gap-2">
                <a
                  href={previewQrModal.qrUrl}
                  download={`${previewQrModal.appShortName}-公众号二维码.svg`}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载二维码</span>
                </a>
                <button
                  onClick={() => setPreviewQrModal(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-2 bg-[#1e376b] hover:bg-[#15274d] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
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
