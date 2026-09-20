/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Boxes,
  Users,
  Activity,
  Zap,
  TrendingUp,
  Server,
  Layers,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  BarChart3,
  PieChart as PieIcon,
  Globe,
  Database,
  Building2,
  Sparkles,
  Award,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  SlidersHorizontal,
  Flame,
  Radio,
  ExternalLink,
  Laptop,
  Check,
  Compass,
  FileCheck,
  Network
} from 'lucide-react';
import { INITIAL_APPS } from './AppManagement';
import { INITIAL_CUSTOMER_ORGS } from '../data/mockCustomerOrgs';
import { IntegratedApp } from '../types';

// Extended application statistics interface
interface EnhancedAppStats extends IntegratedApp {
  totalUsers: number;
  activeUsersToday: number;
  officialUsers: number;
  trialUsers: number;
  qps: number;
  avgLatencyMs: number;
  successRate: string;
  userGrowthRate: string;
  monthlyApiTrend: number[]; // 12 months
  regionDistribution: { name: string; count: number; percent: number }[];
  orgTypeDistribution: { type: string; count: number }[];
  licenseExpiringSoonCount: number;
  peakHour: string;
  errorCount24h: number;
}

export const AppDashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'year'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'license' | 'traffic' | 'regions'>('overview');
  
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userScaleFilter, setUserScaleFilter] = useState<'all' | 'large' | 'medium' | 'small'>('all'); // 人数多/中/少
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'formal_heavy' | 'trial_heavy'>('all');
  const [trafficFilter, setTrafficFilter] = useState<'all' | 'high_qps' | 'high_calls'>('all');
  const [sortBy, setSortBy] = useState<'users_desc' | 'users_asc' | 'calls_desc' | 'orgs_desc' | 'health_desc'>('users_desc');

  const [selectedAppDetail, setSelectedAppDetail] = useState<EnhancedAppStats | null>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Animation on mount
  useEffect(() => {
    let animationFrameId: number;
    const duration = 800;
    const startTime = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      setAnimProgress(ease);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute rich real-like data for all 16 applications
  const enhancedApps: EnhancedAppStats[] = useMemo(() => {
    const regionPresets = [
      [
        { name: '陕西省', count: 48, percent: 38 },
        { name: '四川省', count: 35, percent: 27 },
        { name: '重庆市', count: 18, percent: 14 },
        { name: '西藏区', count: 15, percent: 12 },
        { name: '其他区域', count: 12, percent: 9 }
      ],
      [
        { name: '四川省', count: 52, percent: 41 },
        { name: '陕西省', count: 38, percent: 30 },
        { name: '重庆市', count: 20, percent: 16 },
        { name: '西藏区', count: 10, percent: 8 },
        { name: '其他区域', count: 6, percent: 5 }
      ],
      [
        { name: '陕西省', count: 65, percent: 45 },
        { name: '四川省', count: 42, percent: 29 },
        { name: '西藏区', count: 22, percent: 15 },
        { name: '重庆市', count: 16, percent: 11 }
      ]
    ];

    return INITIAL_APPS.map((app, index) => {
      const totalUsers = app.activeAccounts || Math.floor((app.officialOrgCount * 45) + (app.trialOrgCount * 12));
      const officialUsers = Math.floor(totalUsers * (app.officialOrgCount / (app.officialOrgCount + app.trialOrgCount + 0.01)));
      const trialUsers = Math.max(0, totalUsers - officialUsers);
      const activeUsersToday = Math.floor(totalUsers * (0.62 + ((index % 5) * 0.05)));
      
      const qps = Math.floor((app.dailyCalls / 86400) * 8.5) + (index * 15);
      const avgLatencyMs = 8 + ((index * 3) % 18);
      const successRate = index === 1 ? '99.99%' : index === 4 ? '99.98%' : '100.00%';
      const userGrowthRate = `+${(8.5 + (index * 1.8) % 16).toFixed(1)}%`;
      
      const baseCall = Math.floor(app.dailyCalls / 10000);
      const monthlyApiTrend = [
        Math.floor(baseCall * 0.55),
        Math.floor(baseCall * 0.48),
        Math.floor(baseCall * 0.68),
        Math.floor(baseCall * 0.75),
        Math.floor(baseCall * 0.82),
        Math.floor(baseCall * 0.90),
        Math.floor(baseCall * 0.95),
        Math.floor(baseCall * 1.02),
        Math.floor(baseCall * 1.08),
        Math.floor(baseCall * 1.15),
        Math.floor(baseCall * 1.22),
        Math.floor(baseCall * 1.30)
      ];

      return {
        ...app,
        totalUsers,
        activeUsersToday,
        officialUsers,
        trialUsers,
        qps,
        avgLatencyMs,
        successRate,
        userGrowthRate,
        monthlyApiTrend,
        regionDistribution: regionPresets[index % regionPresets.length],
        orgTypeDistribution: [
          { type: '政府监管机构', count: Math.floor(app.officialOrgCount * 0.45) },
          { type: '国企与事业单位', count: Math.floor(app.officialOrgCount * 0.35) },
          { type: '政法与执法单位', count: Math.floor(app.officialOrgCount * 0.15) },
          { type: '重点高校与科研', count: Math.floor(app.officialOrgCount * 0.05) }
        ],
        licenseExpiringSoonCount: Math.floor((index * 2) % 5),
        peakHour: `${9 + (index % 3)}:00 - ${11 + (index % 3)}:00`,
        errorCount24h: index === 3 ? 12 : index === 5 ? 4 : 0
      };
    });
  }, []);

  // Aggregated Overall Platform Statistics
  const overallMetrics = useMemo(() => {
    const totalAppsCount = enhancedApps.length;
    const totalUsersAll = enhancedApps.reduce((acc, a) => acc + a.totalUsers, 0);
    const totalActiveUsersToday = enhancedApps.reduce((acc, a) => acc + a.activeUsersToday, 0);
    const totalOfficialOrgs = enhancedApps.reduce((acc, a) => acc + a.officialOrgCount, 0);
    const totalTrialOrgs = enhancedApps.reduce((acc, a) => acc + a.trialOrgCount, 0);
    const totalDailyCalls = enhancedApps.reduce((acc, a) => acc + a.dailyCalls, 0);
    const totalFormalUsers = enhancedApps.reduce((acc, a) => acc + a.officialUsers, 0);
    const totalTrialUsers = enhancedApps.reduce((acc, a) => acc + a.trialUsers, 0);
    const avgHealthScore = (enhancedApps.reduce((acc, a) => acc + a.healthScore, 0) / totalAppsCount).toFixed(1);

    // Grouping by User Scale: >5000 (人多), 3000-5000 (中等), <3000 (小型/初建)
    const largeUserApps = enhancedApps.filter(a => a.totalUsers >= 5000);
    const mediumUserApps = enhancedApps.filter(a => a.totalUsers >= 3000 && a.totalUsers < 5000);
    const smallUserApps = enhancedApps.filter(a => a.totalUsers < 3000);

    // Grouping by category
    const categoryCounts: Record<string, number> = {};
    enhancedApps.forEach(a => {
      categoryCounts[a.appCategory] = (categoryCounts[a.appCategory] || 0) + 1;
    });

    return {
      totalAppsCount,
      totalUsersAll,
      totalActiveUsersToday,
      totalOfficialOrgs,
      totalTrialOrgs,
      totalDailyCalls,
      totalFormalUsers,
      totalTrialUsers,
      formalRatio: ((totalOfficialOrgs / (totalOfficialOrgs + totalTrialOrgs)) * 100).toFixed(1),
      trialRatio: ((totalTrialOrgs / (totalOfficialOrgs + totalTrialOrgs)) * 100).toFixed(1),
      avgHealthScore,
      largeUserAppsCount: largeUserApps.length,
      mediumUserAppsCount: mediumUserApps.length,
      smallUserAppsCount: smallUserApps.length,
      categoryCounts
    };
  }, [enhancedApps]);

  // Filtered & Sorted Apps list
  const filteredApps = useMemo(() => {
    return enhancedApps.filter(app => {
      // Search text
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          app.appName.toLowerCase().includes(query) ||
          app.appShortName.toLowerCase().includes(query) ||
          app.appCode.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && app.appCategory !== selectedCategory) {
        return false;
      }

      // User Scale filter (人多人少)
      if (userScaleFilter === 'large' && app.totalUsers < 5000) return false;
      if (userScaleFilter === 'medium' && (app.totalUsers < 3000 || app.totalUsers >= 5000)) return false;
      if (userScaleFilter === 'small' && app.totalUsers >= 3000) return false;

      // License status filter (试用还是正式)
      if (licenseFilter === 'formal_heavy' && app.officialOrgCount < app.trialOrgCount * 4) return false;
      if (licenseFilter === 'trial_heavy' && app.trialOrgCount <= 12) return false;

      // Traffic filter (访问情况)
      if (trafficFilter === 'high_qps' && app.qps < 400) return false;
      if (trafficFilter === 'high_calls' && app.dailyCalls < 3000000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'users_desc') return b.totalUsers - a.totalUsers;
      if (sortBy === 'users_asc') return a.totalUsers - b.totalUsers;
      if (sortBy === 'calls_desc') return b.dailyCalls - a.dailyCalls;
      if (sortBy === 'orgs_desc') return (b.officialOrgCount + b.trialOrgCount) - (a.officialOrgCount + a.trialOrgCount);
      if (sortBy === 'health_desc') return b.healthScore - a.healthScore;
      return 0;
    });
  }, [enhancedApps, searchQuery, selectedCategory, userScaleFilter, licenseFilter, trafficFilter, sortBy]);

  // Monthly Aggregate Trends for Top Chart (万次)
  const monthlyCallsTrend = [320, 280, 390, 430, 490, 560, 610, 650, 690, 740, 790, 850];
  const monthlyUsersTrend = [42, 45, 52, 58, 64, 71, 76, 82, 88, 93, 98, 105]; // 千人

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] p-5 text-slate-800 selection:bg-blue-100 selection:text-blue-900 relative" id="app_comprehensive_dashboard">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        
        {/* ========================================================================= */}
        {/* 1. Header & Quick View Controls */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e376b] to-blue-700 text-white flex items-center justify-center shadow-md shrink-0">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">首页看板(不做)</h1>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  全网 16 接入系统同频运行中
                </span>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-md border border-blue-100">
                  多维全景汇聚
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                全域汇集各接入应用的【人数规模】、【用户分布】、【正式/试用授权】、【接口吞吐与访问情况】等关键维度的实时决策看板
              </p>
            </div>
          </div>

          {/* Dimension Switch Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'bg-white text-[#1e376b] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>综合全景</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'users'
                    ? 'bg-white text-[#1e376b] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>人数与规模</span>
              </button>
              <button
                onClick={() => setActiveTab('license')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'license'
                    ? 'bg-white text-[#1e376b] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>试用 / 正式状态</span>
              </button>
              <button
                onClick={() => setActiveTab('traffic')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'traffic'
                    ? 'bg-white text-[#1e376b] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>访问与吞吐</span>
              </button>
              <button
                onClick={() => setActiveTab('regions')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'regions'
                    ? 'bg-white text-[#1e376b] shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>地域用户分布</span>
              </button>
            </div>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none hover:border-slate-300 focus:border-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="2026">2026 年度统计</option>
              <option value="2025">2025 年度统计</option>
              <option value="2024">2024 年度统计</option>
            </select>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. Top Metric Cards (Core Dimensions Highlights) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: 接入应用总规模 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">接入应用总数</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{overallMetrics.totalAppsCount}</span>
                <span className="text-xs font-bold text-slate-400">款应用系统</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">业务中台: <strong className="text-slate-800">{overallMetrics.categoryCounts['业务中台'] || 7}</strong></span>
                <span className="text-slate-500">企业应用: <strong className="text-slate-800">{overallMetrics.categoryCounts['企业应用'] || 6}</strong></span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, 100 * animProgress)}%` }}></div>
            </div>
          </div>

          {/* Card 2: 用户总规模与活跃（人数多/少） */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">全网在册总人数</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-900 tracking-tight">{overallMetrics.totalUsersAll.toLocaleString()}</span>
                <span className="text-xs font-bold text-slate-400">人</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-bold flex items-center">
                  <ArrowUpRight className="w-3 h-3" /> 今日在席 {overallMetrics.totalActiveUsersToday.toLocaleString()}
                </span>
                <span className="text-slate-400">68% 在线率</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, 85 * animProgress)}%` }}></div>
            </div>
          </div>

          {/* Card 3: 试用 vs 正式客户机构 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">授权机构（正式 / 试用）</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{overallMetrics.totalOfficialOrgs}</span>
                <span className="text-xs font-bold text-emerald-600">正式</span>
                <span className="text-slate-300">/</span>
                <span className="text-lg font-bold text-amber-600">{overallMetrics.totalTrialOrgs}</span>
                <span className="text-xs font-bold text-amber-600">试用</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                <span>正式占比: <strong className="text-emerald-700">{overallMetrics.formalRatio}%</strong></span>
                <span>试用转化中: <strong className="text-amber-700">{overallMetrics.trialRatio}%</strong></span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${overallMetrics.formalRatio}%` }}></div>
              <div className="bg-amber-400 h-full" style={{ width: `${overallMetrics.trialRatio}%` }}></div>
            </div>
          </div>

          {/* Card 4: 今日访问吞吐与API调用 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">今日全网调用总量</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">{(overallMetrics.totalDailyCalls / 10000).toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-400">万次 / 日</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-blue-600 font-bold">99.98% 成功率</span>
                <span className="text-slate-400">平均延时 12ms</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, 92 * animProgress)}%` }}></div>
            </div>
          </div>

          {/* Card 5: 综合系统健康度与SLA */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold text-slate-600">应用综合健康度</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-teal-700 tracking-tight">{overallMetrics.avgHealthScore}</span>
                <span className="text-xs font-bold text-teal-600">/ 100 分</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-600 font-bold">16 链路全通畅</span>
                <span className="text-slate-400">0 阻断告警</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.min(100, 99 * animProgress)}%` }}></div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. Multi-Dimension Charts Grid (人数分布、试用/正式对比、访问趋势、地域分布) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Dimension 1: 应用人数排行与梯队分析 (人多 / 人少) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">维度 A: 应用人数规模与梯队</h3>
                    <p className="text-[11px] text-slate-400">应用人数多 vs 人数少梯队分布</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  规模洞察
                </span>
              </div>

              {/* 3 Tiers of User Scale */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div 
                  onClick={() => setUserScaleFilter(userScaleFilter === 'large' ? 'all' : 'large')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    userScaleFilter === 'large' ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-600">大型应用 (&gt;5000人)</div>
                  <div className="text-lg font-black text-indigo-700 mt-1">{overallMetrics.largeUserAppsCount} <span className="text-xs font-normal">款</span></div>
                  <div className="text-[10px] text-slate-400">如: 全网搜、点点密信</div>
                </div>
                <div 
                  onClick={() => setUserScaleFilter(userScaleFilter === 'medium' ? 'all' : 'medium')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    userScaleFilter === 'medium' ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-600">中型应用 (3k-5k人)</div>
                  <div className="text-lg font-black text-blue-700 mt-1">{overallMetrics.mediumUserAppsCount} <span className="text-xs font-normal">款</span></div>
                  <div className="text-[10px] text-slate-400">如: 极速舆情、正管用</div>
                </div>
                <div 
                  onClick={() => setUserScaleFilter(userScaleFilter === 'small' ? 'all' : 'small')}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    userScaleFilter === 'small' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-600">轻型/新兴 (&lt;3000人)</div>
                  <div className="text-lg font-black text-emerald-700 mt-1">{overallMetrics.smallUserAppsCount} <span className="text-xs font-normal">款</span></div>
                  <div className="text-[10px] text-slate-400">如: 百战演练、全球眼</div>
                </div>
              </div>

              {/* Top 5 Apps with Highest Users Bar list */}
              <div className="mt-4 flex flex-col gap-2.5 text-xs">
                <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>用户人数 Top 5 应用</span>
                  <span className="text-[11px] text-slate-400 font-normal">点击右侧列表可联动过滤</span>
                </div>
                {enhancedApps.slice().sort((a,b) => b.totalUsers - a.totalUsers).slice(0, 5).map((app, idx) => (
                  <div key={app.id} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-800 truncate flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center shrink-0">{idx+1}</span>
                        {app.appShortName}
                      </span>
                      <span className="font-mono font-bold text-indigo-900">{app.totalUsers.toLocaleString()} 人 ({app.userGrowthRate})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(app.totalUsers / 13000) * 100 * animProgress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>人均日使用时长: <strong>2.4 小时</strong></span>
              <span className="text-indigo-600 font-bold">在册账户总利用率 82.4%</span>
            </div>
          </div>

          {/* Dimension 2: 授权模式维度 (试用 vs 正式应用分布) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">维度 B: 试用与正式授权状态</h3>
                    <p className="text-[11px] text-slate-400">客户机构授权结构与版本转化</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  商业转化
                </span>
              </div>

              {/* Visual Split */}
              <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {overallMetrics.formalRatio}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">正式商业版机构</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">{overallMetrics.totalOfficialOrgs} 家客户 · 持续履约中</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-300 mx-2"></div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                    {overallMetrics.trialRatio}%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-950">试用评测版机构</div>
                    <div className="text-[10px] text-amber-700 font-semibold">{overallMetrics.totalTrialOrgs} 家客户 · 预计本季转化</div>
                  </div>
                </div>
              </div>

              {/* Application Level Official vs Trial Breakdown */}
              <div className="mt-4 flex flex-col gap-2.5 text-xs">
                <div className="text-xs font-bold text-slate-700 mb-0.5">高商业价值与转化先锋应用</div>
                
                {enhancedApps.slice(0, 4).map(app => {
                  const total = app.officialOrgCount + app.trialOrgCount;
                  const formalPercent = Math.round((app.officialOrgCount / total) * 100);
                  const trialPercent = 100 - formalPercent;
                  return (
                    <div key={app.id} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-slate-800">{app.appShortName}</span>
                        <span className="font-mono text-slate-600">
                          <strong className="text-emerald-700">{app.officialOrgCount} 正式</strong> / <strong className="text-amber-600">{app.trialOrgCount} 试用</strong>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full flex overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${formalPercent}%` }}></div>
                        <div className="bg-amber-400 h-full" style={{ width: `${trialPercent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>试用到期预警 (&lt;30天): <strong className="text-amber-600">8 家</strong></span>
              <span className="text-emerald-700 font-bold">试用转正式率: 78.5%</span>
            </div>
          </div>

          {/* Dimension 3: 用户地域分布与大区覆盖 (用户分布) */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">维度 C: 全网用户地域分布</h3>
                    <p className="text-[11px] text-slate-400">大区、省份与统筹单元覆盖分布</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                  地域下沉
                </span>
              </div>

              {/* Major Region Progress */}
              <div className="mt-4 flex flex-col gap-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      陕西大区 (西安/榆林/延安/渭南/咸阳/汉中)
                    </span>
                    <span className="font-mono font-bold text-slate-900">38.5% (28,500 人)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${38.5 * animProgress}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                      四川大区 (成都/绵阳/南充/宜宾/达州/凉山)
                    </span>
                    <span className="font-mono font-bold text-slate-900">31.2% (23,100 人)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${31.2 * animProgress}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                      重庆与三峡库区 (两江/万州/涪陵)
                    </span>
                    <span className="font-mono font-bold text-slate-900">16.8% (12,400 人)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${16.8 * animProgress}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      川藏与西部拓展区 (拉萨/林芝/昌都/阿里)
                    </span>
                    <span className="font-mono font-bold text-slate-900">13.5% (10,000 人)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${13.5 * animProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>覆盖地级市与州盟: <strong>36 个</strong></span>
              <span className="text-teal-700 font-bold">边疆及重点哨点全通达</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. Traffic & Access Dynamics Trend Chart (访问情况、峰值走势) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>维度 D: 2026 年度全应用访问流量与用户活跃走势</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">月度趋势</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">柱状图代表各月全网 API 访问总量 (万次)；折线趋势代表在席活跃用户量 (千人)</p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-[#1e376b]"></span>
                <span>API 访问量 (万次)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
                <span>在席活跃用户 (千人)</span>
              </div>
              <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[11px] font-mono font-bold">
                峰值: 11月 790万次
              </div>
            </div>
          </div>

          {/* Interactive Chart Visualizer */}
          <div className="h-60 mt-6 flex items-end justify-between gap-2 sm:gap-4 px-3 relative">
            {/* Horizontal Dashed Guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
              <div className="border-b border-dashed border-slate-400 w-full"></div>
              <div className="border-b border-dashed border-slate-400 w-full"></div>
              <div className="border-b border-dashed border-slate-400 w-full"></div>
              <div className="border-b border-dashed border-slate-400 w-full"></div>
            </div>

            {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'].map((month, idx) => {
              const callVal = monthlyCallsTrend[idx];
              const userVal = monthlyUsersTrend[idx];
              const barHeight = (callVal / 900) * 190 * animProgress;
              const userHeight = (userVal / 120) * 190 * animProgress;
              const isHovered = hoveredMonth === idx;

              return (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer z-10"
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {/* Floating Info Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 bg-slate-900 text-white text-[11px] font-mono py-1.5 px-3 rounded-lg shadow-xl z-30 pointer-events-none text-center whitespace-nowrap animate-in fade-in duration-150">
                      <div className="font-bold text-slate-200">{month} 运行指标</div>
                      <div className="text-blue-400">调用: {callVal} 万次</div>
                      <div className="text-emerald-400">活跃: {userVal} 千人</div>
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="flex items-end gap-1 sm:gap-1.5 w-full justify-center">
                    <div
                      style={{ height: `${barHeight}px` }}
                      className={`w-3 sm:w-5 rounded-t-sm transition-all duration-300 ${
                        isHovered ? 'bg-blue-600' : 'bg-[#1e376b]'
                      }`}
                    ></div>
                    <div
                      style={{ height: `${userHeight}px` }}
                      className={`w-2.5 sm:w-4 rounded-t-sm transition-all duration-300 ${
                        isHovered ? 'bg-emerald-400' : 'bg-emerald-500'
                      }`}
                    ></div>
                  </div>

                  <span className={`text-[10px] sm:text-xs mt-2 font-medium ${isHovered ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>
                    {month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>访问高峰时段: <strong>09:30 - 11:30</strong> 及 <strong>14:30 - 17:00</strong></span>
            <span className="font-mono text-slate-600">全网实时并发中枢 QPS 吞吐承载能力: <strong>10,000 req/s</strong></span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. Detailed Multi-Dimensional Application Explorer (All 16 Apps) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          
          {/* Header & Comprehensive Filter Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#1e376b]" />
                  <span>全量应用多维度明细总表 ({filteredApps.length} / 16 款)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">支持按人数规模、试用/正式授权、分类及吞吐指标多维筛选与一键穿透</p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索应用名称/编码/责任人..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Dimensional Filters Group */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
              
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-bold">分类:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">全部分类</option>
                  <option value="业务中台">业务中台</option>
                  <option value="企业应用">企业应用</option>
                  <option value="基础服务">基础服务</option>
                </select>
              </div>

              {/* User Scale Filter (人数多/少) */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-bold">人数规模:</span>
                <select
                  value={userScaleFilter}
                  onChange={(e) => setUserScaleFilter(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">全部规模 (全部人数)</option>
                  <option value="large">大型应用 (&gt;5000人)</option>
                  <option value="medium">中型应用 (3000-5000人)</option>
                  <option value="small">轻量/新兴 (&lt;3000人)</option>
                </select>
              </div>

              {/* License Status Filter (试用还是正式) */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-bold">授权状态:</span>
                <select
                  value={licenseFilter}
                  onChange={(e) => setLicenseFilter(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">全部模式</option>
                  <option value="formal_heavy">正式版机构为主</option>
                  <option value="trial_heavy">试用评测版居多</option>
                </select>
              </div>

              {/* Traffic Filter (访问情况) */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <span className="text-slate-500 font-bold">访问吞吐:</span>
                <select
                  value={trafficFilter}
                  onChange={(e) => setTrafficFilter(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="all">全部访问量级</option>
                  <option value="high_qps">高频并发 (QPS &gt; 400)</option>
                  <option value="high_calls">高日调用 (&gt;300万次/日)</option>
                </select>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80 ml-auto">
                <span className="text-slate-500 font-bold">排序:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="users_desc">用户人数 (从多到少)</option>
                  <option value="users_asc">用户人数 (从少到多)</option>
                  <option value="calls_desc">日调用量 (从高到低)</option>
                  <option value="orgs_desc">机构总数 (从多到少)</option>
                  <option value="health_desc">健康度评分 (最高)</option>
                </select>
              </div>

              {/* Reset filter button */}
              {(selectedCategory !== 'all' || userScaleFilter !== 'all' || licenseFilter !== 'all' || trafficFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setUserScaleFilter('all');
                    setLicenseFilter('all');
                    setTrafficFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer underline ml-2"
                >
                  清空筛选
                </button>
              )}

            </div>
          </div>

          {/* Table of Applications */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[#1e376b] font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4 w-12 text-center">序号</th>
                  <th className="py-3.5 px-4 min-w-[220px]">应用系统名称 / 编码</th>
                  <th className="py-3.5 px-4 w-28">分类 / 级别</th>
                  <th className="py-3.5 px-4 w-36 text-right">
                    <span className="cursor-pointer flex items-center justify-end gap-1 hover:text-blue-700">
                      用户人数 (规模)
                    </span>
                  </th>
                  <th className="py-3.5 px-4 min-w-[170px]">
                    客户机构 (正式 / 试用)
                  </th>
                  <th className="py-3.5 px-4 min-w-[140px]">用户主要分布区</th>
                  <th className="py-3.5 px-4 w-32 text-right">访问情况 (日调用/QPS)</th>
                  <th className="py-3.5 px-4 w-24 text-center">状态 / 健康度</th>
                  <th className="py-3.5 px-4 w-24 text-center">多维详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app, index) => {
                  const isLarge = app.totalUsers >= 5000;
                  const isSmall = app.totalUsers < 3000;

                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAppDetail(app)}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-bold">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.iconBg || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}>
                            {app.appShortName.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{app.appName}</span>
                              {isLarge && (
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-indigo-200">
                                  人多万人级
                                </span>
                              )}
                              {isSmall && (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                                  轻量敏捷
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                              <span>{app.appCode}</span>
                              <span>·</span>
                              <span>协议: {app.protocol}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                          {app.appCategory}
                        </span>
                      </td>

                      {/* Dimension: 人数多/人少 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-black text-slate-900 text-sm">
                          {app.totalUsers.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">人</span>
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          日活: {app.activeUsersToday.toLocaleString()} ({app.userGrowthRate})
                        </div>
                      </td>

                      {/* Dimension: 试用还是正式 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {app.officialOrgCount} 正式
                          </span>
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {app.trialOrgCount} 试用
                          </span>
                        </div>
                        <div className="w-28 bg-slate-100 h-1.5 rounded-full flex mt-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full" 
                            style={{ width: `${(app.officialOrgCount / (app.officialOrgCount + app.trialOrgCount)) * 100}%` }}
                          ></div>
                          <div 
                            className="bg-amber-400 h-full" 
                            style={{ width: `${(app.trialOrgCount / (app.officialOrgCount + app.trialOrgCount)) * 100}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Dimension: 用户地域分布 */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium">
                          {app.regionDistribution[0].name} ({app.regionDistribution[0].percent}%)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {app.regionDistribution[1].name}、{app.regionDistribution[2].name}
                        </div>
                      </td>

                      {/* Dimension: 访问情况 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-slate-800">
                          {(app.dailyCalls / 10000).toFixed(1)} 万次
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          QPS: <strong className="text-blue-700">{app.qps}</strong> · {app.avgLatencyMs}ms
                        </div>
                      </td>

                      {/* Health */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {app.healthScore} 分
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppDetail(app);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#1e376b] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          多维画像
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredApps.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Boxes className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold">没有找到符合当前多维筛选条件的应用系统</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setUserScaleFilter('all');
                  setLicenseFilter('all');
                  setTrafficFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-3 py-1 text-xs bg-blue-600 text-white font-bold rounded-lg cursor-pointer hover:bg-blue-700"
              >
                重置所有筛选
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. Multi-Dimensional App Detail Drawer / Modal */}
      {/* ========================================================================= */}
      {selectedAppDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedAppDetail.iconBg || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center font-bold text-sm shadow-md`}>
                  {selectedAppDetail.appShortName.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-black text-slate-900">{selectedAppDetail.appName}</h2>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {selectedAppDetail.appCode}
                    </span>
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {selectedAppDetail.appCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedAppDetail.description}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: 4 Main Dimensions Deep Dive */}
            <div className="p-6 flex flex-col gap-5 text-xs">
              
              {/* 4 Cards of this specific app */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                  <div className="text-slate-500 font-bold">在册人数 (规模)</div>
                  <div className="text-xl font-black text-indigo-900 mt-1">{selectedAppDetail.totalUsers.toLocaleString()} 人</div>
                  <div className="text-[10px] text-indigo-700 mt-0.5">日活 {selectedAppDetail.activeUsersToday.toLocaleString()} ({selectedAppDetail.userGrowthRate})</div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="text-slate-500 font-bold">正式 / 试用机构</div>
                  <div className="text-xl font-black text-emerald-900 mt-1">
                    {selectedAppDetail.officialOrgCount} <span className="text-xs font-normal">正</span> / {selectedAppDetail.trialOrgCount} <span className="text-xs font-normal">试</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">到期预警 {selectedAppDetail.licenseExpiringSoonCount} 家</div>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl">
                  <div className="text-slate-500 font-bold">访问吞吐 (日调用)</div>
                  <div className="text-xl font-black text-amber-900 mt-1">{(selectedAppDetail.dailyCalls / 10000).toFixed(1)} 万次</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">实时 QPS: {selectedAppDetail.qps} ({selectedAppDetail.avgLatencyMs}ms)</div>
                </div>

                <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl">
                  <div className="text-slate-500 font-bold">接口健康度与 SLA</div>
                  <div className="text-xl font-black text-teal-900 mt-1">{selectedAppDetail.healthScore} 分</div>
                  <div className="text-[10px] text-teal-700 mt-0.5">成功率 {selectedAppDetail.successRate}</div>
                </div>
              </div>

              {/* Dimension Details: Region distribution + User Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* User Region Breakdown */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>该应用用户地域分布细分</span>
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {selectedAppDetail.regionDistribution.map(r => (
                      <div key={r.name} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-slate-700">{r.name}</span>
                          <span className="font-mono text-slate-900 font-bold">{r.count} 家机构 ({r.percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${r.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organization Types */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>客户机构类型构成</span>
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {selectedAppDetail.orgTypeDistribution.map(t => (
                      <div key={t.type} className="flex justify-between items-center p-2 bg-white rounded-lg border border-slate-200/80">
                        <span className="font-semibold text-slate-700">{t.type}</span>
                        <span className="font-mono font-bold text-emerald-700">{t.count} 家在用</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Operation Details */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-slate-400">责任团队: </span>
                  <strong className="text-slate-800">{selectedAppDetail.ownerDept} ({selectedAppDetail.ownerName})</strong>
                </div>
                <div>
                  <span className="text-slate-400">访问高峰时段: </span>
                  <strong className="text-slate-800">{selectedAppDetail.peakHour}</strong>
                </div>
                <div>
                  <span className="text-slate-400">数据同步方式: </span>
                  <strong className="text-slate-800">{selectedAppDetail.syncInterval}</strong>
                </div>
                <div>
                  <span className="text-slate-400">接入时间: </span>
                  <strong className="text-slate-800 font-mono">{selectedAppDetail.integratedAt}</strong>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button
                onClick={() => setSelectedAppDetail(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  alert(`已导出 ${selectedAppDetail.appName} 的全维画像监测报表`);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1e376b] hover:bg-[#15274d] rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                导出该应用分析报表
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
