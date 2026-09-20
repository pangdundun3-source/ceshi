/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Users,
  Building2,
  Network,
  CheckCircle2,
  UserCheck,
  UserMinus,
  UserX,
  Search,
  RotateCcw,
  Smartphone,
  Eye,
  X,
  Copy,
  Check,
  Download,
  Filter,
  ShieldCheck,
  HelpCircle,
  Clock,
  Lock,
  Boxes,
  AlertCircle
} from 'lucide-react';

// 公众号清单 (康奈V8平台下各微信公众号)
export const WECHAT_OFFICIAL_ACCOUNTS = [
  { id: 'gh-01', name: '康奈网络', appId: 'wx88a01bc892110', type: '服务号', orgDefault: '静安融媒' },
  { id: 'gh-02', name: '陕西康奈网络', appId: 'wx99b02cd983221', type: '订阅号', orgDefault: '陕西大数据' },
  { id: 'gh-03', name: '四川康奈网络', appId: 'wx77c03ef874332', type: '服务号', orgDefault: '天府软件园' },
  { id: 'gh-04', name: '云南康奈网络', appId: 'wx66d04ab765443', type: '服务号', orgDefault: '前海金科' },
  { id: 'gh-05', name: '点点密信', appId: 'wx55e05bc656554', type: '订阅号', orgDefault: '苏州微电子' },
  { id: 'gh-06', name: '点点速豹', appId: 'wx44f06cd547665', type: '服务号', orgDefault: '广州交规院' },
  { id: 'gh-07', name: '康奈舆情研究', appId: 'wx33e07fe658776', type: '服务号', orgDefault: '北京数字政务' },
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

// 机构候选
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
  { shortName: '海南自贸创新港', fullName: '海南自贸港数字经济创新产业园', statUnit: '海南区域' },
  { shortName: '兰州丝路数科', fullName: '甘肃丝路数智信息技术有限公司', statUnit: '甘肃区域' },
  { shortName: '乌鲁木齐天山物联', fullName: '新疆天山数字物联网科技有限公司', statUnit: '新疆区域' },
];

// 姓名与微信昵称候选
const SAMPLE_USERS = [
  { nick: '风清扬', name: '张海林', bg: 'bg-blue-600', mobile: '13811223344' },
  { nick: '山水清晖', name: '李晓晨', bg: 'bg-indigo-600', mobile: '13922334455' },
  { nick: '晨曦微光', name: '王敏', bg: 'bg-emerald-600', mobile: '13733445566' },
  { nick: '追风少年', name: '陈建国', bg: 'bg-teal-600', mobile: '' }, // 未实名
  { nick: '静水流深', name: '赵志刚', bg: 'bg-cyan-700', mobile: '13555667788' },
  { nick: '云卷云舒', name: '谢雨菲', bg: 'bg-purple-600', mobile: '' }, // 未实名
  { nick: '落霞秋水', name: '周子墨', bg: 'bg-amber-600', mobile: '15811223344' },
  { nick: '浩然正气', name: '刘海波', bg: 'bg-rose-600', mobile: '15922334455' },
  { nick: '天高云淡', name: '陈立伟', bg: 'bg-blue-700', mobile: '' }, // 未实名
  { nick: '乘风破浪', name: '吴东升', bg: 'bg-emerald-700', mobile: '18844556677' },
  { nick: '星河璀璨', name: '杨建林', bg: 'bg-indigo-700', mobile: '17755667788' },
  { nick: '凌云之志', name: '魏思源', bg: 'bg-teal-700', mobile: '' }, // 未实名
  { nick: '清风徐来', name: '冯德华', bg: 'bg-slate-700', mobile: '19911223344' },
  { nick: '明镜高悬', name: '徐志明', bg: 'bg-cyan-800', mobile: '19822334455' },
  { nick: '大浪淘沙', name: '郑雅琴', bg: 'bg-purple-700', mobile: '' }, // 未实名
  { nick: '一苇以航', name: '孙立强', bg: 'bg-blue-800', mobile: '13244556677' },
  { nick: '千帆竞发', name: '韩雪松', bg: 'bg-emerald-800', mobile: '15055667788' },
  { nick: '行稳致远', name: '黄嘉诚', bg: 'bg-indigo-800', mobile: '' }, // 未实名
  { nick: '登峰造极', name: '朱思雨', bg: 'bg-rose-700', mobile: '18011223344' },
  { nick: '沧海一粟', name: '何文俊', bg: 'bg-teal-800', mobile: '18122334455' },
];

export interface WechatUserRecord {
  id: string;
  avatarBg: string;
  avatarText: string;
  wechatNickname: string;
  realName: string;
  mobile: string; // 若为空则为未实名
  isRealName: boolean; // 是否实名 (绑定了手机号)
  mpAccountName: string; // 所属公众号
  mpAppId: string;
  isBoundOrg: boolean; // 是否绑定机构
  orgName: string; // 所属机构全称 (未绑定则为 '未绑定')
  orgShortName: string; // 所属机构简称
  statUnit: string;
  followStatus: 'followed' | 'unfollowed' | 'locked'; // 已关注 | 已取关 | 已锁定
  followTime: string;
  followDays: number;
  openId: string;
  unionId: string;
  sex: '男' | '女' | '未知';
  location: string;
}

// 手机号脱敏方法：隐藏中间4位
export const maskPhoneNumber = (mobile: string): string => {
  if (!mobile || mobile.length < 7) return '未实名';
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 生成 160 条微信用户 Mock 数据
const generateMockWechatUsers = (): WechatUserRecord[] => {
  const list: WechatUserRecord[] = [];
  const followStatuses: ('followed' | 'followed' | 'followed' | 'followed' | 'unfollowed' | 'locked')[] = [
    'followed', 'followed', 'followed', 'followed', 'unfollowed', 'locked'
  ];

  for (let i = 1; i <= 160; i++) {
    const userSeed = SAMPLE_USERS[(i - 1) % SAMPLE_USERS.length];
    const mpSeed = WECHAT_OFFICIAL_ACCOUNTS[(i - 1) % WECHAT_OFFICIAL_ACCOUNTS.length];
    
    // 约 25% 的用户未绑定机构
    const isBound = (i % 4 !== 0);
    const orgSeed = isBound ? SAMPLE_ORGS[(i - 1) % SAMPLE_ORGS.length] : null;
    
    // 实名判定：是否有手机号 (userSeed.mobile 不为空)
    const isRealName = Boolean(userSeed.mobile);
    const followStatus = followStatuses[(i * 3) % followStatuses.length];

    const followDays = Math.floor(Math.random() * 500) + 10;
    const followDate = new Date(Date.now() - followDays * 86400000);
    const dateStr = followDate.toISOString().split('T')[0];

    list.push({
      id: `WXU-${2080000 + i}`,
      avatarBg: userSeed.bg,
      avatarText: userSeed.name ? userSeed.name.substring(0, 1) : userSeed.nick.substring(0, 1),
      wechatNickname: userSeed.nick + (i > SAMPLE_USERS.length ? `_${Math.floor(i / SAMPLE_USERS.length)}` : ''),
      realName: isRealName ? userSeed.name : '',
      mobile: userSeed.mobile,
      isRealName: isRealName,
      mpAccountName: mpSeed.name,
      mpAppId: mpSeed.appId,
      isBoundOrg: isBound,
      orgName: orgSeed ? orgSeed.fullName : '未绑定',
      orgShortName: orgSeed ? orgSeed.shortName : '未绑定',
      statUnit: orgSeed ? orgSeed.statUnit : '未分配统计单元',
      followStatus: followStatus,
      followTime: dateStr,
      followDays: followDays,
      openId: `oWx_mp_${Math.random().toString(36).substring(2, 12)}_${i}`,
      unionId: `u_wxunion_${i.toString().padStart(6, '0')}`,
      sex: i % 2 === 0 ? '男' : '女',
      location: orgSeed ? orgSeed.statUnit.split(' · ')[1] || '上海' : '未知'
    });
  }

  return list;
};

export const WechatUserDatabase: React.FC = () => {
  const [userList] = useState<WechatUserRecord[]>(() => generateMockWechatUsers());

  // Filters State
  const [selectedMp, setSelectedMp] = useState<string>('all');
  const [selectedStatUnit, setSelectedStatUnit] = useState<string>('all');
  const [selectedRealNameStatus, setSelectedRealNameStatus] = useState<string>('all'); // 'all' | 'real_named' | 'not_real_named'
  const [selectedBoundStatus, setSelectedBoundStatus] = useState<string>('all'); // 'all' | 'bound' | 'unbound'
  const [selectedFollowStatus, setSelectedFollowStatus] = useState<string>('all'); // 'all' | 'followed' | 'unfollowed' | 'locked'
  const [searchUserText, setSearchUserText] = useState<string>('');
  const [searchOrgText, setSearchOrgText] = useState<string>('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Detail Modal State
  const [detailUser, setDetailUser] = useState<WechatUserRecord | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. 数据概览：计算全平台微信公众号的用户总数及统计指标（含去重人数）
  const stats = useMemo(() => {
    // 全平台微信公众号用户总数 (总人次与去重总人数)
    const totalCount = userList.length;
    const totalUniqueCount = new Set(userList.map(u => u.unionId || u.openId)).size;

    // (1) 已关注用户数及去重人数
    const followedList = userList.filter(u => u.followStatus === 'followed');
    const followedCount = followedList.length;
    const followedUniqueCount = new Set(followedList.map(u => u.unionId || u.openId)).size;

    // (2) 已激活用户数（原已绑定）及去重人数
    const boundList = userList.filter(u => u.isBoundOrg);
    const boundCount = boundList.length;
    const boundUniqueCount = new Set(boundList.map(u => u.unionId || u.openId)).size;

    // (3) 未激活用户数（原未绑定）
    const unboundList = userList.filter(u => !u.isBoundOrg);
    const unboundCount = unboundList.length;

    // (4) 已取关用户数及去重人数
    const unfollowedList = userList.filter(u => u.followStatus === 'unfollowed');
    const unfollowedCount = unfollowedList.length;
    const unfollowedUniqueCount = new Set(unfollowedList.map(u => u.unionId || u.openId)).size;

    // (5) 已锁定用户数及去重人数
    const lockedList = userList.filter(u => u.followStatus === 'locked');
    const lockedCount = lockedList.length;
    const lockedUniqueCount = new Set(lockedList.map(u => u.unionId || u.openId)).size;

    // (6) 已实名用户数及去重人数 (实名指绑定了手机号)
    const realNamedList = userList.filter(u => u.isRealName);
    const realNamedCount = realNamedList.length;
    const realNamedUniqueCount = new Set(realNamedList.map(u => u.mobile || u.unionId)).size;

    return {
      totalCount,
      totalUniqueCount,
      followedCount,
      followedUniqueCount,
      boundCount,
      boundUniqueCount,
      unboundCount,
      unfollowedCount,
      unfollowedUniqueCount,
      lockedCount,
      lockedUniqueCount,
      realNamedCount,
      realNamedUniqueCount
    };
  }, [userList]);

  // 2. 搜索筛选逻辑
  const filteredList = useMemo(() => {
    return userList.filter(item => {
      // 公众号筛选
      if (selectedMp !== 'all') {
        if (item.mpAccountName !== selectedMp) return false;
      }

      // 统计单元筛选
      if (selectedStatUnit !== 'all') {
        if (item.statUnit !== selectedStatUnit) return false;
      }

      // 实名状态筛选 (分为“未实名”和“已实名”)
      if (selectedRealNameStatus !== 'all') {
        if (selectedRealNameStatus === 'real_named' && !item.isRealName) return false;
        if (selectedRealNameStatus === 'not_real_named' && item.isRealName) return false;
      }

      // 机构绑定状态筛选
      if (selectedBoundStatus !== 'all') {
        if (selectedBoundStatus === 'bound' && !item.isBoundOrg) return false;
        if (selectedBoundStatus === 'unbound' && item.isBoundOrg) return false;
      }

      // 关注/状态筛选
      if (selectedFollowStatus !== 'all') {
        if (item.followStatus !== selectedFollowStatus) return false;
      }

      // 微信昵称、备注姓名或 OpenID 搜索
      if (searchUserText.trim()) {
        const q = searchUserText.trim().toLowerCase();
        const matchName = item.realName ? item.realName.toLowerCase().includes(q) : false;
        const matchNick = item.wechatNickname.toLowerCase().includes(q);
        const matchOpenId = item.openId.toLowerCase().includes(q);
        const matchMobile = item.mobile.includes(q);

        if (!matchName && !matchNick && !matchOpenId && !matchMobile) {
          return false;
        }
      }

      // 客户机构简称或全称搜索
      if (searchOrgText.trim()) {
        const q = searchOrgText.trim().toLowerCase();
        const matchOrgFull = item.orgName.toLowerCase().includes(q);
        const matchOrgShort = item.orgShortName.toLowerCase().includes(q);

        if (!matchOrgFull && !matchOrgShort) {
          return false;
        }
      }

      return true;
    });
  }, [userList, selectedMp, selectedStatUnit, selectedRealNameStatus, selectedBoundStatus, selectedFollowStatus, searchUserText, searchOrgText]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const handleResetFilters = () => {
    setSelectedMp('all');
    setSelectedStatUnit('all');
    setSelectedRealNameStatus('all');
    setSelectedBoundStatus('all');
    setSelectedFollowStatus('all');
    setSearchUserText('');
    setSearchOrgText('');
    setCurrentPage(1);
  };

  const handleStatCardClick = (type: 'followed' | 'bound' | 'unbound' | 'unfollowed' | 'locked' | 'real_named') => {
    if (type === 'followed') {
      if (selectedFollowStatus === 'followed' && selectedBoundStatus === 'all' && selectedRealNameStatus === 'all') {
        setSelectedFollowStatus('all');
      } else {
        setSelectedFollowStatus('followed');
        setSelectedBoundStatus('all');
        setSelectedRealNameStatus('all');
      }
    } else if (type === 'bound') {
      if (selectedBoundStatus === 'bound' && selectedFollowStatus === 'all' && selectedRealNameStatus === 'all') {
        setSelectedBoundStatus('all');
      } else {
        setSelectedBoundStatus('bound');
        setSelectedFollowStatus('all');
        setSelectedRealNameStatus('all');
      }
    } else if (type === 'unbound') {
      if (selectedBoundStatus === 'unbound' && selectedFollowStatus === 'all' && selectedRealNameStatus === 'all') {
        setSelectedBoundStatus('all');
      } else {
        setSelectedBoundStatus('unbound');
        setSelectedFollowStatus('all');
        setSelectedRealNameStatus('all');
      }
    } else if (type === 'unfollowed') {
      if (selectedFollowStatus === 'unfollowed' && selectedBoundStatus === 'all' && selectedRealNameStatus === 'all') {
        setSelectedFollowStatus('all');
      } else {
        setSelectedFollowStatus('unfollowed');
        setSelectedBoundStatus('all');
        setSelectedRealNameStatus('all');
      }
    } else if (type === 'locked') {
      if (selectedFollowStatus === 'locked' && selectedBoundStatus === 'all' && selectedRealNameStatus === 'all') {
        setSelectedFollowStatus('all');
      } else {
        setSelectedFollowStatus('locked');
        setSelectedBoundStatus('all');
        setSelectedRealNameStatus('all');
      }
    } else if (type === 'real_named') {
      if (selectedRealNameStatus === 'real_named' && selectedFollowStatus === 'all' && selectedBoundStatus === 'all') {
        setSelectedRealNameStatus('all');
      } else {
        setSelectedRealNameStatus('real_named');
        setSelectedFollowStatus('all');
        setSelectedBoundStatus('all');
      }
    }
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800" id="wechat_user_database_view">
      <div className="w-full flex flex-col gap-5">
        
        {/* Top Header Card: 严格遵循设计与样式规范 */}
        <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="wechat_user_header_bar">
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">应用数据管理 / 微信用户数据</span>
            </nav>

            {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                微信用户数据库
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
                复用页
              </span>
            </div>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-5 pb-5 flex flex-col gap-5">

        {/* 1. 数据概览: 全平台微信公众号用户核心统计（已关注/已激活/未激活/已取关/已锁定/已实名），单选互斥快捷筛选 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* 第一个：已关注用户数（不变） */}
          <div
            onClick={() => handleStatCardClick('followed')}
            title="点击单选筛选已关注用户（再次点击取消）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedFollowStatus === 'followed' && selectedBoundStatus === 'all' && selectedRealNameStatus === 'all'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-white border-slate-200/80 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已关注用户数</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-700 tracking-tight">{stats.followedCount}</span>
                <span className="text-xs text-slate-400">人次</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-emerald-100 pointer-events-none select-none">
                去重人数: {stats.followedUniqueCount} 人
              </div>
            </div>
          </div>

          {/* 第二个：“已绑定用户数”文字改为“已激活用户数” */}
          <div
            onClick={() => handleStatCardClick('bound')}
            title="点击单选筛选已激活用户（再次点击取消）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedBoundStatus === 'bound' && selectedFollowStatus === 'all' && selectedRealNameStatus === 'all'
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/30'
                : 'bg-white border-slate-200/80 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已激活用户数</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-700 tracking-tight">{stats.boundCount}</span>
                <span className="text-xs text-slate-400">人次</span>
              </div>
              <div className="text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-blue-100 pointer-events-none select-none">
                去重人数: {stats.boundUniqueCount} 人
              </div>
            </div>
          </div>

          {/* 第三个：“未绑定用户数”文字改为“未激活用户数” */}
          <div
            onClick={() => handleStatCardClick('unbound')}
            title="点击单选筛选未激活用户（再次点击取消）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedBoundStatus === 'unbound' && selectedFollowStatus === 'all' && selectedRealNameStatus === 'all'
                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/30'
                : 'bg-white border-slate-200/80 hover:border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">未激活用户数</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-600 tracking-tight">{stats.unboundCount}</span>
                <span className="text-xs text-slate-400">人</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5">
                未关联任何 V8 机构
              </div>
            </div>
          </div>

          {/* 第四个：已取关用户数（不变） */}
          <div
            onClick={() => handleStatCardClick('unfollowed')}
            title="点击单选筛选已取关用户（再次点击取消）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedFollowStatus === 'unfollowed' && selectedBoundStatus === 'all' && selectedRealNameStatus === 'all'
                ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-500/30'
                : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已取关用户数</span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <UserMinus className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-600 tracking-tight">{stats.unfollowedCount}</span>
                <span className="text-xs text-slate-400">人次</span>
              </div>
              <div className="text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-slate-200 pointer-events-none select-none">
                去重人数: {stats.unfollowedUniqueCount} 人
              </div>
            </div>
          </div>

          {/* 第五个：增加“已锁定用户数” */}
          <div
            onClick={() => handleStatCardClick('locked')}
            title="点击单选筛选已锁定用户（再次点击取消）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedFollowStatus === 'locked' && selectedBoundStatus === 'all' && selectedRealNameStatus === 'all'
                ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/30'
                : 'bg-white border-slate-200/80 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已锁定用户数</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-rose-700 tracking-tight">{stats.lockedCount}</span>
                <span className="text-xs text-slate-400">人次</span>
              </div>
              <div className="text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-rose-100 pointer-events-none select-none">
                去重人数: {stats.lockedUniqueCount} 人
              </div>
            </div>
          </div>

          {/* 最后一个：已实名用户数（不变） */}
          <div
            onClick={() => handleStatCardClick('real_named')}
            title="点击单选筛选已实名用户（再次点击取消）"
            className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
              selectedRealNameStatus === 'real_named' && selectedFollowStatus === 'all' && selectedBoundStatus === 'all'
                ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/30'
                : 'bg-white border-slate-200/80 hover:border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">已实名用户数</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-700 tracking-tight">{stats.realNamedCount}</span>
                <span className="text-xs text-slate-400">人次</span>
              </div>
              <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-indigo-100 pointer-events-none select-none">
                去重人数: {stats.realNamedUniqueCount} 人
              </div>
            </div>
          </div>

        </div>

        {/* 2. 搜索筛选区域（分两行清晰排布） */}
        <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 flex flex-col gap-3">
          
          {/* 第一行：所属公众号、统计单元、微信昵称/姓名/OpenID、机构简称/全称 */}
          <div className="w-full flex items-center gap-3 flex-wrap xl:flex-nowrap">
            
            {/* (a) 所属公众号下拉菜单 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">所属公众号:</span>
              <select
                value={selectedMp}
                onChange={(e) => {
                  setSelectedMp(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">全部公众号 ({WECHAT_OFFICIAL_ACCOUNTS.length})</option>
                {WECHAT_OFFICIAL_ACCOUNTS.map(mp => (
                  <option key={mp.id} value={mp.name}>{mp.name}</option>
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
                className="w-44 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
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
            <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">昵称/姓名/OpenID:</span>
              <input
                type="text"
                value={searchUserText}
                onChange={(e) => {
                  setSearchUserText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="搜索微信昵称、姓名或 OpenID..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            {/* (d) 客户机构的简称或全称单行文本框 */}
            <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">机构简称/全称:</span>
              <input
                type="text"
                value={searchOrgText}
                onChange={(e) => {
                  setSearchOrgText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="搜索机构简称或全称..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          {/* 第二行：实名状态、绑定状态、关注状态（居左对齐），搜索与重置按钮（居右对齐） */}
          <div className="w-full flex items-center justify-between gap-3 flex-wrap">
            
            {/* 居左对齐三大下拉筛选 */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* (e) 实名状态下拉菜单 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">实名状态:</span>
                <select
                  value={selectedRealNameStatus}
                  onChange={(e) => {
                    setSelectedRealNameStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-32 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">全部实名状态</option>
                  <option value="real_named">已实名</option>
                  <option value="not_real_named">未实名</option>
                </select>
              </div>

              {/* (f) 绑定状态下拉菜单 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">绑定状态:</span>
                <select
                  value={selectedBoundStatus}
                  onChange={(e) => {
                    setSelectedBoundStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-32 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">全部绑定状态</option>
                  <option value="bound">已绑定机构</option>
                  <option value="unbound">未绑定机构</option>
                </select>
              </div>

              {/* (g) 关注状态下拉菜单 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-slate-600 whitespace-nowrap">关注状态:</span>
                <select
                  value={selectedFollowStatus}
                  onChange={(e) => {
                    setSelectedFollowStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-32 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">全部关注状态</option>
                  <option value="followed">已关注</option>
                  <option value="unfollowed">已取关</option>
                  <option value="locked">已锁定</option>
                </select>
              </div>
            </div>

            {/* 居右对齐：搜索与重置按钮 */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="px-4 py-1.5 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <Search className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重置</span>
              </button>
            </div>

          </div>
        </div>

        {/* 3. 成员列表展示:
            第一列：所属公众号
            第二列：所属机构（如果没有绑定机构，则显示“未绑定”）
            第三列：用户信息（如果没有手机号，则显示“未实名”；如果有手机号，则显示手机号并隐藏中间的 4 位）
        */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-black text-slate-900">微信公众号关注用户成员列表</h2>
            </div>
            <span className="text-xs text-slate-400">
              第 {currentPage} / {totalPages} 页
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200/80 font-bold">
                  {/* 第一列：所属公众号 */}
                  <th className="py-3 px-4 min-w-[180px]">所属公众号</th>

                  {/* 第二列：所属机构（如果没有绑定机构，则显示“未绑定”） */}
                  <th className="py-3 px-4 min-w-[200px]">所属机构</th>

                  {/* 第三列：用户信息（如果没有手机号，则显示“未实名”；如果有手机号，则显示手机号并隐藏中间的 4 位） */}
                  <th className="py-3 px-4 min-w-[240px]">用户信息</th>

                  {/* 关注时间 */}
                  <th className="py-3 px-4 w-[130px]">关注时间</th>

                  {/* 当前状态 */}
                  <th className="py-3 px-4 w-[110px] text-center">关注状态</th>

                  {/* 操作 */}
                  <th className="py-3 px-4 w-[100px] text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      没有找到符合条件的微信关注用户
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((user) => (
                    <tr key={user.id} className="hover:bg-emerald-50/20 transition-colors">
                      
                      {/* 第一列：所属公众号 */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMp(user.mpAccountName);
                              setCurrentPage(1);
                            }}
                            title={`点击筛选所属公众号：${user.mpAccountName}`}
                            className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left font-bold"
                          >
                            {user.mpAccountName}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">AppID: {user.mpAppId}</div>
                      </td>

                      {/* 第二列：所属机构（如果没有绑定机构，则显示“未绑定”） */}
                      <td className="py-3.5 px-4">
                        {user.isBoundOrg ? (
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchOrgText(user.orgShortName);
                                  setCurrentPage(1);
                                }}
                                title={`点击按此机构简称筛选：${user.orgShortName}`}
                                className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left"
                              >
                                {user.orgShortName}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBoundStatus('bound');
                                  setCurrentPage(1);
                                }}
                                title="点击筛选“已绑定机构”用户"
                                className="text-[10px] font-normal bg-blue-50 text-blue-700 px-1 py-0.2 rounded border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                              >
                                已绑定
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[240px] mt-0.5" title={user.orgName}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchOrgText(user.orgName);
                                  setCurrentPage(1);
                                }}
                                title={`点击按此机构全称筛选：${user.orgName}`}
                                className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left truncate max-w-full block"
                              >
                                {user.orgName}
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <Network className="w-2.5 h-2.5 text-slate-400" />
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStatUnit(user.statUnit);
                                  setCurrentPage(1);
                                }}
                                title={`点击筛选统计单元：${user.statUnit}`}
                                className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left"
                              >
                                {user.statUnit}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBoundStatus('unbound');
                                setCurrentPage(1);
                              }}
                              title="点击筛选“未绑定”机构用户"
                              className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-bold text-xs border border-slate-200 inline-block hover:bg-slate-200 cursor-pointer transition-colors"
                            >
                              未绑定
                            </button>
                          </div>
                        )}
                      </td>

                      {/* 第三列：用户信息（如果没有手机号，则显示“未实名”；如果有手机号，则显示手机号并隐藏中间的 4 位） */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                            {user.avatarText}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {user.isRealName ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchUserText(user.realName || '');
                                    setCurrentPage(1);
                                  }}
                                  title={`点击按姓名筛选：${user.realName}`}
                                  className="font-bold text-slate-900 hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left"
                                >
                                  {user.realName}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchUserText(user.wechatNickname);
                                    setCurrentPage(1);
                                  }}
                                  title={`点击按昵称筛选：${user.wechatNickname}`}
                                  className="font-bold text-slate-700 hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left"
                                >
                                  {user.wechatNickname}
                                </button>
                              )}
                              <span className="text-slate-400 text-[11px]">(@{user.wechatNickname})</span>
                            </div>

                            {/* 手机号与实名展示：没有手机号显示“未实名”，有手机号显示隐藏中间4位 */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {user.isRealName ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRealNameStatus('real_named');
                                    setCurrentPage(1);
                                  }}
                                  title="点击筛选“已实名”用户"
                                  className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 hover:bg-emerald-100 cursor-pointer transition-colors"
                                >
                                  <Smartphone className="w-3 h-3 text-emerald-600" />
                                  <span>{maskPhoneNumber(user.mobile)}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRealNameStatus('not_real_named');
                                    setCurrentPage(1);
                                  }}
                                  title="点击筛选“未实名”用户"
                                  className="flex items-center gap-1 text-[11px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 hover:bg-amber-100 cursor-pointer transition-colors"
                                >
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  <span>未实名</span>
                                </button>
                              )}
                            </div>

                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px] mt-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchUserText(user.openId);
                                  setCurrentPage(1);
                                }}
                                title={`点击按此 OpenID 筛选：${user.openId}`}
                                className="hover:text-emerald-700 hover:underline cursor-pointer transition-colors text-left font-mono"
                              >
                                ID: {user.openId}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 关注时间 */}
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{user.followTime}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          已关注 {user.followDays} 天
                        </div>
                      </td>

                      {/* 关注状态 */}
                      <td className="py-3.5 px-4 text-center">
                        {user.followStatus === 'followed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFollowStatus('followed');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“已关注”用户"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            已关注
                          </button>
                        )}
                        {user.followStatus === 'unfollowed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFollowStatus('unfollowed');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“已取关”用户"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            已取关
                          </button>
                        )}
                        {user.followStatus === 'locked' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFollowStatus('locked');
                              setCurrentPage(1);
                            }}
                            title="点击筛选“已锁定”用户"
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            已锁定
                          </button>
                        )}
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setDetailUser(user)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
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
                          ? 'bg-emerald-600 text-white shadow-2xs'
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

        {/* User Detail Modal */}
        {detailUser && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Top Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${detailUser.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                    {detailUser.avatarText}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      {detailUser.wechatNickname}
                      {detailUser.isRealName ? (
                        <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                          已实名: {detailUser.realName}
                        </span>
                      ) : (
                        <span className="text-xs bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.2 rounded-full font-bold">
                          未实名
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      所属公众号: {detailUser.mpAccountName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailUser(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Info */}
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium">绑定手机号:</span>
                    <p className="font-mono font-bold text-slate-800 text-xs mt-0.5">
                      {detailUser.isRealName ? detailUser.mobile : '未绑定手机号 (未实名)'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">脱敏手机展示:</span>
                    <p className="font-mono font-bold text-emerald-700 text-xs mt-0.5">
                      {maskPhoneNumber(detailUser.mobile)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">所属机构:</span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">{detailUser.orgName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">首次关注时间:</span>
                    <p className="font-mono text-slate-700 text-xs mt-0.5">{detailUser.followTime} (已关注 {detailUser.followDays} 天)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">微信 OpenID:</span>
                    <div className="flex items-center justify-between gap-1 font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="truncate">{detailUser.openId}</span>
                      <button
                        onClick={() => handleCopy(detailUser.openId, 'openId')}
                        className="text-emerald-600 hover:text-emerald-800 shrink-0 cursor-pointer"
                        title="复制 OpenID"
                      >
                        {copiedKey === 'openId' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">微信 UnionID:</span>
                    <div className="flex items-center justify-between gap-1 font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                      <span className="truncate">{detailUser.unionId}</span>
                      <button
                        onClick={() => handleCopy(detailUser.unionId, 'unionId')}
                        className="text-emerald-600 hover:text-emerald-800 shrink-0 cursor-pointer"
                        title="复制 UnionID"
                      >
                        {copiedKey === 'unionId' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium">性别 / 地区:</span>
                    <p className="font-bold text-slate-700 text-xs mt-0.5">{detailUser.sex} · {detailUser.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">当前状态:</span>
                    <p className="font-bold text-slate-700 text-xs mt-0.5">
                      {detailUser.followStatus === 'followed' ? '已关注' : detailUser.followStatus === 'unfollowed' ? '已取关' : '已锁定'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setDetailUser(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
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
