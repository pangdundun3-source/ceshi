/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Building2,
  Network,
  UserCheck,
  ShieldCheck,
  Search,
  RotateCcw,
  Sparkles,
  Database,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Boxes,
  MessageSquare,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Tag,
  Shield,
  Layers,
  Check,
  Copy,
  ExternalLink,
  SlidersHorizontal,
  UserMinus,
  UserX,
  Lock,
  HelpCircle,
  Filter,
  Download,
  Activity
} from 'lucide-react';
import { UserDetailModal } from './UserDetailModal';
import {
  AppAccountUserRecord,
  generateMockAppAccounts
} from '../data/mockAppAccounts';

// V8 应用全集列表 (来自应用列表)
export const V8_ALL_APPS = [
  { appCode: 'V8-P-01', appFullName: '正管用 - 网络生态综合治理平台', shortName: '正管用', iconBg: 'from-blue-600 to-indigo-700' },
  { appCode: 'V8-P-02', appFullName: '谛听 - 网络风险预警感知系统', shortName: '谛听预警', iconBg: 'from-amber-500 to-orange-600' },
  { appCode: 'V8-P-03', appFullName: '极速 - 7x24小时全网舆情研判中台', shortName: '极速舆情', iconBg: 'from-emerald-600 to-teal-700' },
  { appCode: 'V8-P-04', appFullName: '智媒 - 全媒体账号内容矩阵协同中心', shortName: '新媒体矩阵', iconBg: 'from-purple-600 to-violet-700' },
  { appCode: 'V8-P-05', appFullName: '网评 - 网络评论引导与态势推演平台', shortName: '舆情推演', iconBg: 'from-rose-500 to-pink-600' },
  { appCode: 'V8-P-06', appFullName: '民声 - 网络问政与诉求直通督办系统', shortName: '网络问政', iconBg: 'from-cyan-600 to-blue-700' },
  { appCode: 'V8-P-07', appFullName: '天网 - 跨域多维态势全景态势感知系统', shortName: '全域态势感知', iconBg: 'from-sky-500 to-blue-600' },
  { appCode: 'V8-P-08', appFullName: '阵地 - 意识形态责任制网络督查台账', shortName: '督查台账', iconBg: 'from-indigo-600 to-blue-800' },
  { appCode: 'V8-P-09', appFullName: '数仓 - 网信大数据汇聚交换与治理枢纽', shortName: '数仓中台', iconBg: 'from-emerald-500 to-green-600' },
  { appCode: 'V8-P-10', appFullName: '点点速报 - 清朗净网鉴谣速报系统', shortName: '点点速报', iconBg: 'from-orange-500 to-amber-600' },
  { appCode: 'V8-P-11', appFullName: '风控 - 突发公共事件危机模拟与推演', shortName: '危机推演', iconBg: 'from-red-500 to-rose-700' },
  { appCode: 'V8-P-12', appFullName: '点点速评 - 网络宣传指挥效果分析系统', shortName: '点点速评', iconBg: 'from-violet-600 to-purple-800' },
  { appCode: 'V8-P-17', appFullName: '网络指令上传下达系统', shortName: '指令流转', iconBg: 'from-blue-600 to-cyan-600' },
  { appCode: 'V8-P-18', appFullName: '全域新媒体综合管理中台', shortName: '账号管理', iconBg: 'from-indigo-500 to-purple-600' },
];

// 统计单元候选名单（统一演示数据）
export const STAT_UNITS = [
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

// 机构候选名单
const SAMPLE_ORGS = [
  { shortName: '静安融媒', fullName: '上海市静安区融媒体中心', statUnit: '康奈总部' },
  { shortName: '陕西大数据', fullName: '陕西省大数据发展管理局', statUnit: '陕西区域' },
  { shortName: '苏州微电子', fullName: '苏州工业园区微电子集成电路有限公司', statUnit: '康奈总部' },
  { shortName: '北京数字政务', fullName: '北京市智慧城市数字政务运营中心', statUnit: '东北区域' },
  { shortName: '前海金科', fullName: '深圳前海金融科技创新实验室', statUnit: '广东区域' },
  { shortName: '广州交规院', fullName: '广州市城市交通规划设计研究院', statUnit: '广东区域' },
  { shortName: '天府软件园', fullName: '成都天府软件产业园发展有限公司', statUnit: '四川区域' },
  { shortName: '高新航测所', fullName: '西安高新区航空航天测控技术研究所', statUnit: '陕西一区' },
  { shortName: '武汉数投', fullName: '武汉长江数字产业投资集团', statUnit: '川藏区域' },
  { shortName: '青岛海洋监测', fullName: '青岛市海洋生态环境监测科研中心', statUnit: '东北区域' },
  { shortName: '江北新材料', fullName: '南京江北新区新材料产业技术研究院', statUnit: '陕西二区' },
  { shortName: '西湖文旅服务站', fullName: '杭州市西湖区文旅融媒体传播服务站', statUnit: '宁甘区域' },
  { shortName: '海南自贸创新港', fullName: '海南自贸港数字经济创新产业园', statUnit: '海南区域' },
  { shortName: '兰州丝路数科', fullName: '甘肃丝路数智信息技术有限公司', statUnit: '甘肃区域' },
  { shortName: '乌鲁木齐天山物联', fullName: '新疆天山数字物联网科技有限公司', statUnit: '新疆区域' },
];

// 组织架构与部门预设（V8平台该机构的组织架构）
const SAMPLE_DEPTS = [
  '智能制造事业部 / 系统集成部',
  '融媒采编中心 / 深度调查组',
  '应急指挥调度室 / 前沿哨点组',
  '网络安全运维部 / 态势感知一组',
  '政务协同督办处 / 联络综合室',
  '数据分析研判部 / 算法建模中心',
  '技术创新实验室 / 云原生研发组',
  '公共事务沟通部 / 危机应对专班',
  '客户成功支持中心 / 专属保障二组',
  '市场品牌运营部 / 外部特邀创作者专班',
  '政策合规研究室 / 审核二组',
  '信息资源整合部 / 数据清洗一组',
  '区域协作联络站 / 基层驻点工作队',
];

// 姓名与微信昵称候选
const SAMPLE_USERS = [
  { nick: '风清扬', name: '张海林', bg: 'bg-blue-600', mobile: '13811223344' },
  { nick: '山水清晖', name: '李晓晨', bg: 'bg-indigo-600', mobile: '13922334455' },
  { nick: '晨曦微光', name: '王敏', bg: 'bg-emerald-600', mobile: '13733445566' },
  { nick: '追风少年', name: '陈建国', bg: 'bg-teal-600', mobile: '13644556677' },
  { nick: '静水流深', name: '赵志刚', bg: 'bg-cyan-700', mobile: '13555667788' },
  { nick: '云卷云舒', name: '谢雨菲', bg: 'bg-purple-600', mobile: '13366778899' },
  { nick: '落霞秋水', name: '周子墨', bg: 'bg-amber-600', mobile: '15811223344' },
  { nick: '浩然正气', name: '刘海波', bg: 'bg-rose-600', mobile: '15922334455' },
  { nick: '天高云淡', name: '陈立伟', bg: 'bg-blue-700', mobile: '18633445566' },
  { nick: '乘风破浪', name: '吴东升', bg: 'bg-emerald-700', mobile: '18844556677' },
  { nick: '星河璀璨', name: '杨建林', bg: 'bg-indigo-700', mobile: '17755667788' },
  { nick: '凌云之志', name: '魏思源', bg: 'bg-teal-700', mobile: '17366778899' },
  { nick: '清风徐来', name: '冯德华', bg: 'bg-slate-700', mobile: '19911223344' },
  { nick: '明镜高悬', name: '徐志明', bg: 'bg-cyan-800', mobile: '19822334455' },
  { nick: '大浪淘沙', name: '郑雅琴', bg: 'bg-purple-700', mobile: '13133445566' },
  { nick: '一苇以航', name: '孙立强', bg: 'bg-blue-800', mobile: '13244556677' },
  { nick: '千帆竞发', name: '韩雪松', bg: 'bg-emerald-800', mobile: '15055667788' },
  { nick: '行稳致远', name: '黄嘉诚', bg: 'bg-indigo-800', mobile: '15166778899' },
  { nick: '登峰造极', name: '朱思雨', bg: 'bg-rose-700', mobile: '18011223344' },
  { nick: '沧海一粟', name: '何文俊', bg: 'bg-teal-800', mobile: '18122334455' },
];

export interface V8OrgUserRecord {
  id: string;
  avatarBg: string;
  avatarText: string;
  wechatNickname: string;
  realName: string;
  mobile: string;
  openId: string;
  unionId: string;
  appName: string;
  appFullName: string;
  appCode: string;
  orgName: string;
  orgShortName: string;
  statUnit: string;
  departmentStructure: string; // 所属组织架构
  status: 'normal' | 'unsubscribed' | 'locked' | 'deleted';
  firstFollowTime: string;
  followDays: number;
  assignedRoles: string[];
  assignedGroups: string[];
  lastActiveTime: string;
  msgCount: number;
}

// 生成 V8 机构用户真实 Mock 数据 (涵盖全量 V8 开通应用)
const generateMockV8Users = (): V8OrgUserRecord[] => {
  const list: V8OrgUserRecord[] = [];
  const statuses: ('normal' | 'unsubscribed' | 'locked' | 'deleted')[] = [
    'normal', 'normal', 'normal', 'normal', 'normal', 'unsubscribed', 'locked', 'deleted'
  ];

  for (let i = 1; i <= 180; i++) {
    const userSeed = SAMPLE_USERS[(i - 1) % SAMPLE_USERS.length];
    const orgSeed = SAMPLE_ORGS[(i - 1) % SAMPLE_ORGS.length];
    const appSeed = V8_ALL_APPS[(i - 1) % V8_ALL_APPS.length];
    const dept = SAMPLE_DEPTS[(i - 1) % SAMPLE_DEPTS.length];
    const status = statuses[(i * 7 + 3) % statuses.length];

    const followDays = Math.floor(Math.random() * 600) + 15;
    const followDate = new Date(Date.now() - followDays * 86400000);
    const dateStr = followDate.toISOString().split('T')[0];

    list.push({
      id: `V8U-${1080000 + i}`,
      avatarBg: userSeed.bg,
      avatarText: userSeed.name.substring(0, 1),
      wechatNickname: userSeed.nick + (i > SAMPLE_USERS.length ? `_${Math.floor(i / SAMPLE_USERS.length)}` : ''),
      realName: userSeed.name,
      mobile: userSeed.mobile,
      openId: `oXv8_${Math.random().toString(36).substring(2, 12)}_${i}`,
      unionId: `u_v8union_${i.toString().padStart(6, '0')}`,
      appName: appSeed.shortName,
      appFullName: appSeed.appFullName,
      appCode: appSeed.appCode,
      orgName: orgSeed.fullName,
      orgShortName: orgSeed.shortName,
      statUnit: orgSeed.statUnit,
      departmentStructure: dept,
      status: status,
      firstFollowTime: dateStr,
      followDays: followDays,
      assignedRoles: ['机构操作员', (i % 3 === 0 ? '业务审核员' : i % 2 === 0 ? '数据只读员' : '协同督办员')],
      assignedGroups: ['华东业务协作专班', 'V8机构标准响应组'],
      lastActiveTime: '2026-09-10 16:30',
      msgCount: Math.floor(Math.random() * 450) + 12
    });
  }

  return list;
};

export const V8UserDatabase: React.FC = () => {
  const [userList, setUserList] = useState<V8OrgUserRecord[]>(() => generateMockV8Users());
  const [allAppAccounts, setAllAppAccounts] = useState<AppAccountUserRecord[]>(() => generateMockAppAccounts());

  // Filters State
  const [selectedApp, setSelectedApp] = useState<string>('all');
  const [selectedStatUnit, setSelectedStatUnit] = useState<string>('all');
  const [searchUserText, setSearchUserText] = useState<string>('');
  const [searchOrgText, setSearchOrgText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Detail Modal State (标准 UserDetailModal 共享组件)
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<AppAccountUserRecord | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 打开用户标准详情弹窗
  const handleOpenUserDetail = (v8User: V8OrgUserRecord) => {
    // 优先匹配全量 mock 账号池以获取完整应用身份和日志
    const matchedAccount = allAppAccounts.find(
      a => a.id === v8User.id || a.realName === v8User.realName || (a.mobile && a.mobile === v8User.mobile) || a.openId === v8User.openId
    );

    if (matchedAccount) {
      setSelectedUserForDetail({
        ...matchedAccount,
        id: v8User.id,
        avatarBg: v8User.avatarBg,
        avatarText: v8User.avatarText,
        wechatNickname: v8User.wechatNickname,
        realName: v8User.realName,
        mobile: v8User.mobile,
        openId: v8User.openId,
        unionId: v8User.unionId,
        orgShortName: v8User.orgShortName,
        orgFullName: v8User.orgName,
        statUnit: v8User.statUnit,
        status: v8User.status,
        firstActivateDate: v8User.firstFollowTime,
        activeDays: v8User.followDays,
      });
    } else {
      // 构造完备的标准 AppAccountUserRecord
      const fallbackAccount: AppAccountUserRecord = {
        id: v8User.id,
        avatarBg: v8User.avatarBg,
        avatarText: v8User.avatarText,
        wechatNickname: v8User.wechatNickname,
        realName: v8User.realName,
        mobile: v8User.mobile,
        openId: v8User.openId,
        unionId: v8User.unionId,
        orgShortName: v8User.orgShortName,
        orgFullName: v8User.orgName,
        statUnit: v8User.statUnit,
        creditCode: '91310106MB1928374X',
        firstAddedTime: v8User.firstFollowTime,
        provinceCityDistrict: '上海市-静安区',
        orgLevel: '省级机构',
        statUnitPath: `华东区域-${v8User.statUnit}-直属`,
        custCategory: '一类客户',
        salesPerson: '夏小花',
        status: v8User.status,
        firstActivateDate: v8User.firstFollowTime,
        activeDays: v8User.followDays,
        userRemark: '由 V8 用户数据库同步生成。',
        loginLogs: [
          {
            id: `LOG-${v8User.id}-1`,
            loginTime: `${v8User.lastActiveTime}:12`,
            ip: '117.136.19.88',
            location: '上海市静安区',
            device: 'iPhone 15 Pro (iOS 17.4)',
            clientType: '微信内嵌浏览器',
            status: 'success'
          },
          {
            id: `LOG-${v8User.id}-2`,
            loginTime: '2026-09-08 14:20:00',
            ip: '183.214.55.67',
            location: '上海市静安区',
            device: 'Windows 11 (Chrome 122.0)',
            clientType: 'Web客户端',
            status: 'success'
          }
        ],
        operationLogs: [
          {
            id: `OP-${v8User.id}-1`,
            operationTime: `${v8User.lastActiveTime}:15`,
            action: '登录系统',
            module: v8User.appName,
            operator: v8User.realName || v8User.wechatNickname,
            ip: '117.136.19.88',
            details: `用户成功访问 ${v8User.appName} 业务控制台`
          }
        ],
        appIdentities: [
          {
            appId: 'app-01',
            appCode: v8User.appCode,
            appName: v8User.appFullName,
            appShortName: v8User.appName,
            appStatus: 'active',
            status: v8User.status === 'normal' ? 'active' : v8User.status === 'unsubscribed' ? 'canceled_follow' : 'locked',
            roleName: v8User.assignedRoles[0] || '机构操作员',
            roleCode: 'ROLE_OPERATOR',
            inviterName: '夏小花',
            inviterRole: '区域运营总监',
            inviterType: 'MT',
            activatedAt: `${v8User.firstFollowTime} 09:30:00`
          }
        ]
      };
      setSelectedUserForDetail(fallbackAccount);
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Top Statistics Calculations
  const stats = useMemo(() => {
    // 1. 已开通的应用数 (应用列表里的应用总数)
    const openedAppsCount = V8_ALL_APPS.length;

    // 2. V8 用户总数（去重处理，以手机号/姓名去重）
    const uniqueUsersSet = new Set(userList.map(u => u.realName + '_' + u.mobile));
    const uniqueUserCount = uniqueUsersSet.size;

    // 3. 正常状态用户数
    const normalCount = userList.filter(u => u.status === 'normal').length;

    // 4. 已取消关注用户数
    const unsubscribedCount = userList.filter(u => u.status === 'unsubscribed').length;

    // 5. 已锁定用户数
    const lockedCount = userList.filter(u => u.status === 'locked').length;

    // 6. 已删除用户数
    const deletedCount = userList.filter(u => u.status === 'deleted').length;

    return {
      openedAppsCount,
      uniqueUserCount,
      totalRecordCount: userList.length,
      normalCount,
      unsubscribedCount,
      lockedCount,
      deletedCount
    };
  }, [userList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return userList.filter(item => {
      // 1. App Filter
      if (selectedApp !== 'all') {
        if (item.appName !== selectedApp && item.appCode !== selectedApp) return false;
      }

      // 2. Stat Unit Filter
      if (selectedStatUnit !== 'all') {
        if (item.statUnit !== selectedStatUnit) return false;
      }

      // 3. 微信昵称、备注姓名或 OpenID 搜索
      if (searchUserText.trim()) {
        const q = searchUserText.trim().toLowerCase();
        const matchName = item.realName.toLowerCase().includes(q);
        const matchNick = item.wechatNickname.toLowerCase().includes(q);
        const matchOpenId = item.openId.toLowerCase().includes(q);
        const matchMobile = item.mobile.includes(q);

        if (!matchName && !matchNick && !matchOpenId && !matchMobile) {
          return false;
        }
      }

      // 4. 机构简称或全称搜索
      if (searchOrgText.trim()) {
        const q = searchOrgText.trim().toLowerCase();
        const matchOrgFull = item.orgName.toLowerCase().includes(q);
        const matchOrgShort = item.orgShortName.toLowerCase().includes(q);

        if (!matchOrgFull && !matchOrgShort) {
          return false;
        }
      }

      // 5. Status Filter
      if (selectedStatus !== 'all') {
        if (item.status !== selectedStatus) return false;
      }

      return true;
    });
  }, [userList, selectedApp, selectedStatUnit, searchUserText, searchOrgText, selectedStatus]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const handleResetFilters = () => {
    setSelectedApp('all');
    setSelectedStatUnit('all');
    setSearchUserText('');
    setSearchOrgText('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800" id="v8_user_database_view">
      <div className="w-full flex flex-col gap-5">
        
        {/* Top Header Card: 严格遵循设计与样式规范 */}
        <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="v8_user_header_bar">
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">应用数据管理 / 用户数据</span>
            </nav>

            {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                V8用户数据库
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
                复用页
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                alert(`已成功导出 ${filteredList.length} 条 V8 机构用户人员名单数据（CSV格式）`);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>导出名单数据</span>
            </button>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5 flex flex-col gap-5">

        {/* 二、 顶部统计数据 (6项指标) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* 1. 已开通的应用数 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已开通应用数</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-blue-900 tracking-tight">{stats.openedAppsCount}</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">个系统</span>
            </div>
          </div>

          {/* 2. V8 用户总数（去重处理） */}
          <div
            id="v8_total_users_stat_card"
            onClick={handleResetFilters}
            title="点击显示所有数据库里的用户（清除筛选条件）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedApp === 'all' && selectedStatUnit === 'all' && selectedStatus === 'all' && !searchUserText && !searchOrgText
                ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/30'
                : 'bg-white border-slate-200/80 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">V8 用户总数</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalRecordCount}</span>
                <span className="text-xs text-slate-400 ml-1">人次</span>
              </div>
              <span
                className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 pointer-events-none select-none cursor-default"
                title="已剔除跨应用重复绑定的去重人数"
              >
                去重 {stats.uniqueUserCount} 人
              </span>
            </div>
          </div>

          {/* 3. 正常状态用户数 */}
          <div
            onClick={() => {
              setSelectedStatus(prev => prev === 'normal' ? 'all' : 'normal');
              setCurrentPage(1);
            }}
            title="点击筛选“正常”状态用户"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedStatus === 'normal'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-white border-slate-200/80 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">正常状态用户</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-600 tracking-tight">{stats.normalCount}</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>

          {/* 4. 已取消关注用户数 */}
          <div
            onClick={() => {
              setSelectedStatus(prev => prev === 'unsubscribed' ? 'all' : 'unsubscribed');
              setCurrentPage(1);
            }}
            title="点击筛选“已取消关注”状态用户"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedStatus === 'unsubscribed'
                ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-500/30'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已取消关注</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <UserMinus className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-600 tracking-tight">{stats.unsubscribedCount}</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>

          {/* 5. 已锁定用户数 */}
          <div
            onClick={() => {
              setSelectedStatus(prev => prev === 'locked' ? 'all' : 'locked');
              setCurrentPage(1);
            }}
            title="点击筛选“已锁定”状态用户"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedStatus === 'locked'
                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/30'
                : 'bg-white border-slate-200/80 hover:border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已锁定用户</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-amber-600 tracking-tight">{stats.lockedCount}</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>

          {/* 6. 已删除的用户数 */}
          <div
            onClick={() => {
              setSelectedStatus(prev => prev === 'deleted' ? 'all' : 'deleted');
              setCurrentPage(1);
            }}
            title="点击筛选“已删除”状态用户"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedStatus === 'deleted'
                ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/30'
                : 'bg-white border-slate-200/80 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已删除用户</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-rose-600 tracking-tight">{stats.deletedCount}</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>
        </div>

        {/* 三、 搜索区域（单行紧凑排布，100% 自适应宽度） */}
        <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4">
          <div className="w-full flex items-center gap-2.5 flex-wrap xl:flex-nowrap">
            
            {/* (a) 所属应用下拉菜单 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">所属应用:</span>
              <select
                value={selectedApp}
                onChange={(e) => {
                  setSelectedApp(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">全部开通应用 ({V8_ALL_APPS.length})</option>
                {V8_ALL_APPS.map(app => (
                  <option key={app.appCode} value={app.shortName}>
                    {app.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* (b) 统计单元下拉菜单 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">统计单元:</span>
              <select
                value={selectedStatUnit}
                onChange={(e) => {
                  setSelectedStatUnit(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">全部统计单元</option>
                {STAT_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            {/* (c) 微信昵称、备注姓名或 OpenID 单行文本框 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[170px] max-w-[240px]">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">昵称/姓名/OpenID:</span>
              <input
                type="text"
                value={searchUserText}
                onChange={(e) => {
                  setSearchUserText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="昵称、姓名或 OpenID..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            {/* (d) 客户机构的简称或全称单行文本框 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[140px] max-w-[190px]">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">机构简称/全称:</span>
              <input
                type="text"
                value={searchOrgText}
                onChange={(e) => {
                  setSearchOrgText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="机构简称或全称..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            {/* (e) 用户状态下拉菜单 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">用户状态:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-28 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="normal">正常</option>
                <option value="unsubscribed">已取消关注</option>
                <option value="locked">已锁定</option>
                <option value="deleted">已删除</option>
              </select>
            </div>

            {/* 按钮区域：搜索与重置按钮排在同一行 */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>

          </div>
        </div>

        {/* 四、 人员名单列表: V8 机构用户人员名单列表 */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          
          {/* Table Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-black text-slate-900">V8 机构用户人员名单列表</h2>
            </div>
            <span className="text-xs text-slate-400">
              第 {currentPage} / {totalPages} 页
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-bold">
                  {/* 1. 所属应用 */}
                  <th className="py-3 px-4 w-[140px]">所属应用</th>
                  
                  {/* 2. 所属机构 */}
                  <th className="py-3 px-4 min-w-[200px]">所属机构</th>
                  
                  {/* 3. 用户信息 */}
                  <th className="py-3 px-4 min-w-[220px]">用户信息</th>
                  
                  {/* 4. 所属组织架构 (原关注时间替换为所属组织架构) */}
                  <th className="py-3 px-4 min-w-[200px]">所属组织架构</th>
                  
                  {/* 5. 当前状态 */}
                  <th className="py-3 px-4 w-[110px] text-center">当前状态</th>
                  
                  {/* 6. 查看详情 */}
                  <th className="py-3 px-4 w-[100px] text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      没有找到符合条件的 V8 机构用户
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      
                      {/* 1. 所属应用 (使用应用列表里的应用) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApp(user.appName);
                              setCurrentPage(1);
                            }}
                            title={`点击筛选应用：${user.appName}`}
                            className={`px-2 py-0.5 rounded-md font-bold text-xs transition-all cursor-pointer text-left ${
                              selectedApp === user.appName
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-blue-50 text-blue-700 border border-blue-200/80 hover:bg-blue-100 hover:border-blue-300'
                            }`}
                          >
                            {user.appName}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{user.appCode}</div>
                      </td>

                      {/* 2. 所属机构 (机构简称 + 机构全称 + 统计单元) */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOrgText(user.orgShortName);
                              setCurrentPage(1);
                            }}
                            title={`点击筛选机构简称：${user.orgShortName}`}
                            className="hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left"
                          >
                            {user.orgShortName}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[260px] mt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOrgText(user.orgName);
                              setCurrentPage(1);
                            }}
                            title={`点击筛选机构全称：${user.orgName}`}
                            className="hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left truncate max-w-full block"
                          >
                            {user.orgName}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Network className="w-2.5 h-2.5 text-slate-400" />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatUnit(user.statUnit);
                              setCurrentPage(1);
                            }}
                            title={`点击筛选统计单元：${user.statUnit}`}
                            className="hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left"
                          >
                            {user.statUnit}
                          </button>
                        </div>
                      </td>

                      {/* 3. 用户信息 (微信昵称黑体、姓名备注括号、头像、OpenID) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenUserDetail(user)}
                            title={`点击查看用户【${user.realName || user.wechatNickname}】详情`}
                            className={`w-8 h-8 rounded-lg ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-offset-1 hover:ring-2 hover:ring-blue-400`}
                          >
                            {user.avatarText}
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleOpenUserDetail(user)}
                                className="font-bold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left"
                              >
                                {user.wechatNickname}
                              </button>
                              <span className="text-slate-500 text-[11px]">({user.realName})</span>
                              <button
                                type="button"
                                id={`btn_user_detail_icon_${user.id}`}
                                onClick={() => handleOpenUserDetail(user)}
                                title={`点击查看用户【${user.realName || user.wechatNickname}】详情档案`}
                                className="inline-flex items-center justify-center p-0.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[190px] mt-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchUserText(user.openId);
                                  setCurrentPage(1);
                                }}
                                title={`点击按此 openid 筛选：${user.openId}`}
                                className="hover:text-blue-600 hover:underline cursor-pointer transition-colors text-left font-mono"
                              >
                                openid: {user.openId}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. 所属组织架构 (V8 平台该机构的组织架构) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStatUnit(user.statUnit);
                                setCurrentPage(1);
                              }}
                              title={`点击筛选所属组织架构（统计单元：${user.statUnit}）`}
                              className="font-bold text-slate-800 text-xs text-left hover:text-blue-600 hover:underline cursor-pointer transition-colors block"
                            >
                              {user.departmentStructure}
                            </button>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <span>已授权角色:</span>
                              <span className="text-indigo-600 font-medium">{user.assignedRoles.join(' / ')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 5. 当前状态 (胶囊标签居中对齐) */}
                      <td className="py-3.5 px-4 text-center">
                        {user.status === 'normal' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatus('normal');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“正常”状态用户"
                            className="w-[100px] inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer text-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>正常</span>
                          </button>
                        )}
                        {user.status === 'unsubscribed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatus('unsubscribed');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“已取消关注”状态用户"
                            className="w-[100px] inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer text-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                            <span>已取消关注</span>
                          </button>
                        )}
                        {user.status === 'locked' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatus('locked');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“已锁定”状态用户"
                            className="w-[100px] inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer text-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                            <span>已锁定</span>
                          </button>
                        )}
                        {user.status === 'deleted' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStatus('deleted');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“已删除”状态用户"
                            className="w-[100px] inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-colors cursor-pointer text-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                            <span>已删除</span>
                          </button>
                        )}
                      </td>

                      {/* 6. 查看详情 */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenUserDetail(user)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>查看详情</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredList.length)} 项，共 {filteredList.length} 条记录
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer"
              >
                上一页
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium cursor-pointer"
              >
                下一页
              </button>
            </div>
          </div>
        </div>

        {/* 标准用户账号查看组件 (UserDetailModal) */}
        <UserDetailModal
          user={selectedUserForDetail}
          isOpen={!!selectedUserForDetail}
          onClose={() => setSelectedUserForDetail(null)}
          allUsers={allAppAccounts}
          onUpdateUser={(updatedUser) => {
            setAllAppAccounts(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            setSelectedUserForDetail(updatedUser);
            setUserList(prev => prev.map(u => u.id === updatedUser.id ? { ...u, status: updatedUser.status } : u));
          }}
        />

        </div>

      </div>
    </div>
  );
};
