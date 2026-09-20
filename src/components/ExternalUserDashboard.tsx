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
  Filter
} from 'lucide-react';

// 外部用户数据接口
export interface ExternalUserRecord {
  id: string;                  // 唯一 ID (例如 EU-1082910)
  avatarBg: string;            // 头像背景色
  avatarText: string;          // 头像缩写
  wechatNickname: string;      // 微信昵称
  realName: string;            // 用户备注的姓名
  firstFollowTime: string;     // 首次关注时间
  followDays: number;          // 已关注天数
  mpAccountName: string;       // 关注的公众号名称（应用简称）
  appName: string;             // 所属应用简称
  appFullName: string;         // 所属应用全称
  appCode: string;             // 所属应用编码
  orgName: string;             // 所属机构全称
  orgShortName: string;        // 所属机构简称
  statUnit: string;            // 统计单元
  departmentStructure: string; // 组织架构
  status: 'normal' | 'unsubscribed' | 'locked' | 'deleted'; // 正常 | 已取消关注 | 已锁定 | 已删除
  mobile: string;              // 手机号码
  openId: string;              // 微信 OpenID
  unionId: string;             // 微信 UnionID
  assignedRoles: string[];     // 分配角色
  assignedGroups: string[];    // 所属群组
  lastActiveTime: string;      // 最近活跃时间
  msgCount: number;            // 消息交互次数
}

// 已开通外部用户体系的应用名单 (仅3款：指令流转、点点速报、点点速评，使用应用简称)
export const OPENED_EXT_APPS = [
  { appCode: 'V8-P-17', appFullName: '网络指令上传下达系统', shortName: '指令流转' },
  { appCode: 'V8-P-10', appFullName: '点点速报 - 清朗净网鉴谣速报系统', shortName: '点点速报' },
  { appCode: 'V8-P-12', appFullName: '点点速评 - 网络宣传指挥效果分析系统', shortName: '点点速评' },
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

// 机构候选名单（使用机构简称）
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

// 组织架构与部门预设
const SAMPLE_DEPTS = [
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
  { nick: '风清扬', name: '张海林', bg: 'bg-blue-600' },
  { nick: '山水清晖', name: '李晓晨', bg: 'bg-indigo-600' },
  { nick: '晨曦微光', name: '王敏', bg: 'bg-emerald-600' },
  { nick: '追风少年', name: '陈建国', bg: 'bg-teal-600' },
  { nick: '静水流深', name: '赵志刚', bg: 'bg-cyan-700' },
  { nick: '云卷云舒', name: '谢雨菲', bg: 'bg-purple-600' },
  { nick: '落霞秋水', name: '周子墨', bg: 'bg-amber-600' },
  { nick: '浩然正气', name: '刘海波', bg: 'bg-rose-600' },
  { nick: '天高云淡', name: '陈立伟', bg: 'bg-blue-700' },
  { nick: '乘风破浪', name: '吴东升', bg: 'bg-emerald-700' },
  { nick: '星河璀璨', name: '杨建林', bg: 'bg-indigo-700' },
  { nick: '凌云之志', name: '魏思源', bg: 'bg-teal-700' },
  { nick: '清风徐来', name: '冯德华', bg: 'bg-slate-700' },
  { nick: '明镜高悬', name: '徐志明', bg: 'bg-cyan-800' },
  { nick: '大浪淘沙', name: '郑雅琴', bg: 'bg-purple-700' },
  { nick: '一苇以航', name: '孙立强', bg: 'bg-blue-800' },
  { nick: '千帆竞发', name: '韩雪松', bg: 'bg-emerald-800' },
  { nick: '行稳致远', name: '黄嘉诚', bg: 'bg-indigo-800' },
  { nick: '登峰造极', name: '朱思雨', bg: 'bg-rose-700' },
  { nick: '沧海一粟', name: '何文俊', bg: 'bg-teal-800' },
];

// 生成 150 条外部用户真实 Mock 数据
const generateMockExternalUsers = (): ExternalUserRecord[] => {
  const list: ExternalUserRecord[] = [];
  const statuses: ('normal' | 'unsubscribed' | 'locked' | 'deleted')[] = [
    'normal', 'normal', 'normal', 'normal', 'normal', 'unsubscribed', 'locked', 'deleted'
  ];

  for (let i = 1; i <= 150; i++) {
    const userSeed = SAMPLE_USERS[(i - 1) % SAMPLE_USERS.length];
    const appSeed = OPENED_EXT_APPS[(i - 1) % OPENED_EXT_APPS.length];
    const orgSeed = SAMPLE_ORGS[(i - 1) % SAMPLE_ORGS.length];
    const deptSeed = SAMPLE_DEPTS[(i - 1) % SAMPLE_DEPTS.length];
    const statusSeed = statuses[(i - 1) % statuses.length];

    const month = String(1 + ((i * 3) % 12)).padStart(2, '0');
    const day = String(1 + ((i * 7) % 28)).padStart(2, '0');
    const hour = String(8 + (i % 13)).padStart(2, '0');
    const min = String(10 + (i % 49)).padStart(2, '0');
    const sec = String(10 + (i % 49)).padStart(2, '0');
    const year = 2024 + (i % 3);

    // 计算已关注天数 (从 2024-01-01 起根据序号模拟真实的 15~850 天)
    const followDays = Math.max(12, Math.floor(((2026 - year) * 365) + (Number(month) * 30) + Number(day) + (i % 17)));

    const userSuffix = i > SAMPLE_USERS.length ? `_${Math.floor(i / SAMPLE_USERS.length) + 1}` : '';

    list.push({
      id: `EU-108${String(2900 + i).padStart(5, '0')}`,
      avatarBg: userSeed.bg,
      avatarText: userSeed.name.slice(0, 1),
      wechatNickname: `${userSeed.nick}${userSuffix}`,
      realName: `${userSeed.name}${userSuffix}`,
      firstFollowTime: `${year}-${month}-${day} ${hour}:${min}:${sec}`,
      followDays: followDays,
      mpAccountName: appSeed.shortName, // 公众号名称使用应用简称
      appName: appSeed.shortName,       // 所属应用使用应用简称
      appFullName: appSeed.appFullName,
      appCode: appSeed.appCode,
      orgName: orgSeed.fullName,
      orgShortName: orgSeed.shortName,  // 所属机构使用机构简称
      statUnit: orgSeed.statUnit,
      departmentStructure: deptSeed,
      status: statusSeed,
      mobile: `138${String(10000000 + i * 137).slice(0, 8)}`,
      openId: `wx_openid_eu_${appSeed.appCode.toLowerCase().replace(/[^a-z0-9]/g, '')}_${10000 + i}`,
      unionId: `wx_unionid_v8_${900000 + i}`,
      assignedRoles: ['外部协作专员', i % 2 === 0 ? '信息直报员' : '研判分析师'],
      assignedGroups: ['政务直通协同群', i % 3 === 0 ? '重点舆情处置专班' : '常规工作推送组'],
      lastActiveTime: `${year}-${month}-${day} ${String(Number(hour) + 1).padStart(2, '0')}:${min}:${sec}`,
      msgCount: 12 + (i * 7) % 150
    });
  }

  return list;
};

export const ExternalUserDashboard: React.FC = () => {
  // 基础数据
  const [userList] = useState<ExternalUserRecord[]>(generateMockExternalUsers());

  // 搜索筛选状态
  const [selectedAppCode, setSelectedAppCode] = useState<string>('all');
  const [selectedStatUnit, setSelectedStatUnit] = useState<string>('all');
  const [searchUserText, setSearchUserText] = useState<string>('');
  const [searchOrgText, setSearchOrgText] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 分页状态 (默认 50 条/页)
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 用户详情弹窗状态
  const [selectedUserDetail, setSelectedUserDetail] = useState<ExternalUserRecord | null>(null);

  // 提示复制状态
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 点击用户 openID 快速单独筛选该用户
  const handleFilterByOpenId = (openId: string) => {
    setSearchUserText(openId);
    setSelectedAppCode('all');
    setSelectedStatUnit('all');
    setSearchOrgText('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // 重置搜索
  const handleResetFilters = () => {
    setSelectedAppCode('all');
    setSelectedStatUnit('all');
    setSearchUserText('');
    setSearchOrgText('');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  // 过滤数据计算
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      // 1. 所属应用筛选
      if (selectedAppCode !== 'all' && user.appCode !== selectedAppCode) {
        return false;
      }
      // 2. 统计单元筛选
      if (selectedStatUnit !== 'all' && user.statUnit !== selectedStatUnit) {
        return false;
      }
      // 3. 微信昵称、备注姓名或 OpenID 搜索
      if (searchUserText.trim()) {
        const q = searchUserText.trim().toLowerCase();
        const matchNick = user.wechatNickname.toLowerCase().includes(q);
        const matchReal = user.realName.toLowerCase().includes(q);
        const matchOpenId = user.openId.toLowerCase().includes(q);
        if (!matchNick && !matchReal && !matchOpenId) return false;
      }
      // 4. 客户机构简称或全称搜索
      if (searchOrgText.trim()) {
        const q = searchOrgText.trim().toLowerCase();
        const matchShort = user.orgShortName.toLowerCase().includes(q);
        const matchFull = user.orgName.toLowerCase().includes(q);
        if (!matchShort && !matchFull) return false;
      }
      // 5. 用户状态筛选
      if (selectedStatus !== 'all' && user.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [userList, selectedAppCode, selectedStatUnit, searchUserText, searchOrgText, selectedStatus]);

  // 分页数据截取
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // 顶部统计数据计算
  const stats = useMemo(() => {
    // 固定业务统计指标与外部用户体系配置同步
    const openedAppCount = OPENED_EXT_APPS.length; // 3款
    const totalUsersCount = 128650;                // 外部用户总数
    const deduplicatedUsersCount = 92430;          // 去重以后的总人数
    const normalUsersCount = 112430;               // 正常状态用户数 (87.4%)
    const unsubscribedUsersCount = 11240;          // 已取消关注用户数 (8.7%)
    const lockedUsersCount = 1650;                 // 已锁定用户数 (1.3%)
    const deletedUsersCount = 3330;                // 已删除用户数 (2.6%)

    return {
      openedAppCount,
      totalUsersCount,
      deduplicatedUsersCount,
      normalUsersCount,
      unsubscribedUsersCount,
      lockedUsersCount,
      deletedUsersCount
    };
  }, []);

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800" id="app_ext_user_dashboard">
      <div className="w-full flex flex-col gap-5">
        
        {/* ========================================================================= */}
        {/* 1. 介绍页顶部 Banner: 严格遵循设计与样式规范 */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="ext_user_header_bar">
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">应用用户体系管理 / 外部用户看板</span>
            </nav>

            {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                外部用户看板
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
                复用页
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold hidden sm:flex">
            <span className="text-slate-400">数据状态：</span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              实时联机同步
            </span>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5 flex flex-col gap-5">

        {/* ========================================================================= */}
        {/* 2. 介绍页统计数据（6项指标卡片，包含已锁定用户数，总数卡片包含去重人数） */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* (a) 已开通外部用户的应用数 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">已开通外部用户的应用数</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-900 tracking-tight">{stats.openedAppCount}</span>
              <span className="text-xs font-bold text-slate-400">款应用</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-slate-400">指令流转 / 点点速报 / 点点速评</span>
            </div>
          </div>

          {/* (b) 外部用户总数（包含去重后总人数） */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">外部用户总数</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.totalUsersCount.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">人次</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-slate-500 font-medium">去重：</span>
              <span className="text-blue-700 font-bold font-mono">{stats.deduplicatedUsersCount.toLocaleString()} 人</span>
            </div>
          </div>

          {/* (c) 正常状态的用户数 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">正常状态的用户数</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-800 tracking-tight">{stats.normalUsersCount.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">人</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>正常关注/活跃</span>
              <span className="text-emerald-600 font-bold font-mono">87.4%</span>
            </div>
          </div>

          {/* (d) 已取消关注的用户数 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">已取消关注的用户数</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <UserMinus className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-800 tracking-tight">{stats.unsubscribedUsersCount.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">人</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>取关休眠用户</span>
              <span className="text-amber-600 font-bold font-mono">8.7%</span>
            </div>
          </div>

          {/* (e) 已锁定用户数 (新增位于已取消关注与已删除之间) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">已锁定用户数</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-900 tracking-tight">{stats.lockedUsersCount.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">人</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>账号安全锁定</span>
              <span className="text-purple-600 font-bold font-mono">1.3%</span>
            </div>
          </div>

          {/* (f) 已删除的用户数 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">已删除的用户数</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-800 tracking-tight">{stats.deletedUsersCount.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400">人</span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>已注销/清理</span>
              <span className="text-rose-600 font-bold font-mono">2.6%</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. 搜索区域（单行紧凑排布，100% 自适应宽度） */}
        {/* ========================================================================= */}
        <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4">
          <div className="w-full flex items-center gap-2.5 flex-wrap xl:flex-nowrap">
            
            {/* (a) 所属应用下拉菜单 (使用应用简称) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">所属应用:</span>
              <select
                value={selectedAppCode}
                onChange={(e) => {
                  setSelectedAppCode(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-36 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">全部应用</option>
                {OPENED_EXT_APPS.map((app) => (
                  <option key={app.appCode} value={app.appCode}>
                    {app.shortName}
                  </option>
                ))}
              </select>
            </div>

            {/* (d) 统计单元下拉菜单 (位于两个文本框左边) */}
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

            {/* (b) 微信昵称、备注姓名或 OpenID 单行文本框 */}
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

            {/* (c) 客户机构的简称或全称单行文本框 */}
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

        {/* ========================================================================= */}
        {/* 4. 外部用户表格（6列排布：所属应用 | 所属机构 | 用户信息 | 关注时间 | 当前状态 | 查看详情） */}
        {/* ========================================================================= */}
        <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          
          {/* 表格标题栏 */}
          <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">外部用户人员名单列表</h3>
              <span className="text-xs text-slate-400 font-mono">
                (已检索出 <strong className="text-blue-700">{filteredUsers.length}</strong> 条记录)
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">
              默认每页显示 50 人 · 支持切换 100/200/500 条
            </div>
          </div>

          {/* 表格主体 */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold whitespace-nowrap">
                  {/* 第1列：所属应用（包含公众号名称） */}
                  <th className="py-3 px-4 min-w-[150px]">所属应用</th>
                  {/* 第2列：所属机构 */}
                  <th className="py-3 px-4 min-w-[160px]">所属机构</th>
                  {/* 第3列：用户信息 */}
                  <th className="py-3 px-4 min-w-[220px]">用户信息</th>
                  {/* 第4列：关注时间 */}
                  <th className="py-3 px-4 w-44">关注时间</th>
                  {/* 第5列：当前状态 */}
                  <th className="py-3 px-4 w-28 text-center">当前状态</th>
                  {/* 第6列：查看详情 */}
                  <th className="py-3 px-4 w-28 text-center">查看详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-slate-300" />
                        <span className="text-xs">暂无符合条件的外部用户数据</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                      
                      {/* 第1列：所属应用 (应用简称 + 公众号名称在下方) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded text-xs border border-blue-200 inline-block">
                            {user.appName}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="text-slate-600 font-medium">
                              公众号：{user.mpAccountName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 第2列：所属机构 (机构简称) */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">
                          {user.orgShortName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[170px]" title={user.statUnit}>
                          {user.statUnit}
                        </div>
                      </td>

                      {/* 第3列：用户信息 (头像 + 微信昵称 + 姓名 + 微信 openID 可点击筛选) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs mt-0.5`}>
                            {user.avatarText}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-xs leading-tight">
                              {user.wechatNickname}
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5 font-normal">
                              姓名：{user.realName}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleFilterByOpenId(user.openId)}
                              title="点击按该 OpenID 单独查看"
                              className="text-[10px] font-mono text-blue-600 hover:text-blue-800 hover:underline mt-0.5 flex items-center gap-1 text-left cursor-pointer group"
                            >
                              <span className="text-slate-400 font-sans">OpenID:</span>
                              <span className="group-hover:font-bold">{user.openId}</span>
                              <Filter className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 第4列：关注时间 (首次关注时间 + 下一行显示已关注天数) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-mono text-slate-700 text-xs font-medium">
                            {user.firstFollowTime}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5 font-normal">
                            已关注 <strong className="text-blue-700 font-bold">{user.followDays}</strong> 天
                          </span>
                        </div>
                      </td>

                      {/* 第5列：当前状态 (正常、已取消关注、已锁定、已删除) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {user.status === 'normal' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            正常
                          </span>
                        )}
                        {user.status === 'unsubscribed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            已取消关注
                          </span>
                        )}
                        {user.status === 'locked' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                            已锁定
                          </span>
                        )}
                        {user.status === 'deleted' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            已删除
                          </span>
                        )}
                      </td>

                      {/* 第6列：查看详情 (表头为“查看详情”) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedUserDetail(user)}
                          className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold rounded-md text-[11px] transition-colors cursor-pointer"
                        >
                          查看用户详情
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* 5. 分页栏（支持 50、100、200、500 每页切换） */}
          {/* ========================================================================= */}
          <div className="p-4 px-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/50">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-500 font-medium">
                显示第 <strong className="text-slate-900">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> 到 <strong className="text-slate-900">{Math.min(currentPage * pageSize, filteredUsers.length)}</strong> 条，共 <strong className="text-blue-700 font-bold">{filteredUsers.length}</strong> 条数据
              </span>

              {/* 每页条数切换下拉菜单 (50, 100, 200, 500) */}
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-slate-400">每页显示：</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-md px-2 py-1 font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value={50}>50 条 / 页</option>
                  <option value={100}>100 条 / 页</option>
                  <option value={200}>200 条 / 页</option>
                  <option value={500}>500 条 / 页</option>
                </select>
              </div>
            </div>

            {/* 翻页按钮组 */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一页</span>
              </button>

              <div className="px-3 py-1 font-mono font-bold text-slate-700">
                {currentPage} / {totalPages}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-700 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              >
                <span>下一页</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 6. 查看用户详情弹窗 */}
        {/* ========================================================================= */}
        {selectedUserDetail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
              
              {/* 弹窗 Header */}
              <div className="p-4 px-6 bg-[#1e376b] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${selectedUserDetail.avatarBg} border-2 border-white/20 text-white flex items-center justify-center font-bold text-base shadow-sm`}>
                    {selectedUserDetail.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black tracking-tight">{selectedUserDetail.wechatNickname}</h3>
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                        姓名：{selectedUserDetail.realName}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-200 font-mono mt-0.5">
                      唯一识别码: {selectedUserDetail.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUserDetail(null)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 弹窗 Body 内容 */}
              <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
                
                {/* 状态总览 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[11px] text-slate-400">当前账号状态</span>
                    <span className="mt-1 font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      {selectedUserDetail.status === 'normal' && <span className="text-emerald-700 font-black">● 正常活跃</span>}
                      {selectedUserDetail.status === 'unsubscribed' && <span className="text-amber-700 font-black">● 已取消关注</span>}
                      {selectedUserDetail.status === 'locked' && <span className="text-purple-700 font-black">● 已安全锁定</span>}
                      {selectedUserDetail.status === 'deleted' && <span className="text-rose-700 font-black">● 已注销删除</span>}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[11px] text-slate-400">首次关注与时长</span>
                    <span className="mt-1 font-mono font-bold text-slate-800 text-xs">
                      {selectedUserDetail.firstFollowTime}
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold mt-0.5">
                      已关注 {selectedUserDetail.followDays} 天
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[11px] text-slate-400">最近活跃时间</span>
                    <span className="mt-1 font-mono font-bold text-slate-800 text-xs">
                      {selectedUserDetail.lastActiveTime}
                    </span>
                  </div>
                </div>

                {/* 归属应用与公众号 */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col gap-2.5">
                  <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-blue-700" />
                    <span>所属应用与公众号</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">所属应用名称及编码：</span>
                      <strong className="text-slate-900 text-xs">{selectedUserDetail.appName}</strong>
                      <span className="text-[10px] font-mono text-blue-700 ml-1">({selectedUserDetail.appCode})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">绑定服务公众号：</span>
                      <strong className="text-slate-900 text-xs">{selectedUserDetail.mpAccountName}</strong>
                    </div>
                  </div>
                </div>

                {/* 机构与组织架构 */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-2.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-indigo-700" />
                    <span>机构归属与组织架构</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">客户机构名称：</span>
                      <strong className="text-slate-900">{selectedUserDetail.orgShortName}</strong>
                      <span className="text-slate-500 text-[11px] block">（全称：{selectedUserDetail.orgName}）</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">所属统计单元：</span>
                      <strong className="text-slate-800">{selectedUserDetail.statUnit}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[11px]">所在组织架构部门：</span>
                      <strong className="text-slate-900">{selectedUserDetail.departmentStructure}</strong>
                    </div>
                  </div>
                </div>

                {/* 微信标识与安全信息 */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-2.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>微信凭证与安全身份</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">手机号码：</span>
                      <span className="font-mono font-bold text-slate-900">{selectedUserDetail.mobile}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">累计消息交互：</span>
                      <span className="font-mono font-bold text-slate-900">{selectedUserDetail.msgCount} 次</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">WeChat OpenID：</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <code className="font-mono text-[11px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[200px]">
                          {selectedUserDetail.openId}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedUserDetail.openId, 'openid')}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                        >
                          {copiedKey === 'openid' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">WeChat UnionID：</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <code className="font-mono text-[11px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[200px]">
                          {selectedUserDetail.unionId}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedUserDetail.unionId, 'unionid')}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                        >
                          {copiedKey === 'unionid' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* 弹窗 Footer */}
              <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>数据已与各应用外部用户体系完成实时双向校验</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUserDetail(null)}
                  className="px-5 py-2 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
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
