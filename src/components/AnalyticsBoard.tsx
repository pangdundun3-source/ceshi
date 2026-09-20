import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  KeyRound,
  ShieldCheck,
  Activity,
  Layers,
  Cpu,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface AnalyticsBoardProps {
  appName?: string;
  appCode?: string;
  customerCount?: number;
}

// 模拟近 30 天每日活跃数据 (DAU 与 活跃机构数)
const DAILY_ACTIVE_TREND_DATA = [
  { date: '08-11', dau: 1120, orgs: 48, apiCalls: 284000, alerts: 142 },
  { date: '08-12', dau: 1240, orgs: 51, apiCalls: 312000, alerts: 168 },
  { date: '08-13', dau: 1180, orgs: 49, apiCalls: 295000, alerts: 135 },
  { date: '08-14', dau: 1310, orgs: 53, apiCalls: 338000, alerts: 182 },
  { date: '08-15', dau: 1420, orgs: 56, apiCalls: 362000, alerts: 210 },
  { date: '08-16', dau: 760, orgs: 28, apiCalls: 189000, alerts: 88 }, // 周末
  { date: '08-17', dau: 810, orgs: 30, apiCalls: 198000, alerts: 94 }, // 周末
  { date: '08-18', dau: 1380, orgs: 54, apiCalls: 345000, alerts: 178 },
  { date: '08-19', dau: 1450, orgs: 57, apiCalls: 371000, alerts: 195 },
  { date: '08-20', dau: 1490, orgs: 58, apiCalls: 382000, alerts: 224 },
  { date: '08-21', dau: 1430, orgs: 56, apiCalls: 364000, alerts: 190 },
  { date: '08-22', dau: 1520, orgs: 59, apiCalls: 391000, alerts: 236 },
  { date: '08-23', dau: 790, orgs: 29, apiCalls: 194000, alerts: 92 },
  { date: '08-24', dau: 840, orgs: 31, apiCalls: 206000, alerts: 101 },
  { date: '08-25', dau: 1410, orgs: 55, apiCalls: 358000, alerts: 184 },
  { date: '08-26', dau: 1480, orgs: 57, apiCalls: 376000, alerts: 202 },
  { date: '08-27', dau: 1530, orgs: 60, apiCalls: 395000, alerts: 218 },
  { date: '08-28', dau: 1560, orgs: 61, apiCalls: 402000, alerts: 245 },
  { date: '08-29', dau: 1590, orgs: 62, apiCalls: 418000, alerts: 260 },
  { date: '08-30', dau: 820, orgs: 32, apiCalls: 210000, alerts: 98 },
  { date: '08-31', dau: 860, orgs: 33, apiCalls: 224000, alerts: 108 },
  { date: '09-01', dau: 1470, orgs: 58, apiCalls: 380000, alerts: 192 },
  { date: '09-02', dau: 1540, orgs: 60, apiCalls: 398000, alerts: 226 },
  { date: '09-03', dau: 1580, orgs: 61, apiCalls: 412000, alerts: 238 },
  { date: '09-04', dau: 1610, orgs: 63, apiCalls: 425000, alerts: 254 },
  { date: '09-05', dau: 1640, orgs: 64, apiCalls: 436000, alerts: 271 },
  { date: '09-06', dau: 890, orgs: 34, apiCalls: 232000, alerts: 112 },
  { date: '09-07', dau: 920, orgs: 35, apiCalls: 241000, alerts: 118 },
  { date: '09-08', dau: 1620, orgs: 63, apiCalls: 429000, alerts: 265 },
  { date: '09-09', dau: 1680, orgs: 65, apiCalls: 448000, alerts: 289 }
];

// 客户版本分布数据（正式客户 vs 试用客户）
const CUSTOMER_VERSION_DISTRIBUTION = [
  { 
    name: '正式签约客户', 
    value: 52, 
    color: '#3B82F6', 
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    desc: '已签署商业合同并开通全功能授权',
    avgAccounts: '32 账号/家'
  },
  { 
    name: '试用体验客户', 
    value: 13, 
    color: '#F59E0B', 
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    desc: '处于15~30天功能试用与PoC测试期',
    avgAccounts: '10 账号/家'
  }
];

// 核心功能与接口调用热度 TOP 6
const TOP_FEATURES = [
  { name: '实时监测方案抓取', calls: '142,500 次/日', share: 31.8, growth: '+14.2%', color: 'bg-blue-500' },
  { name: '全网热榜热搜即时扫描', calls: '89,200 次/日', share: 19.9, growth: '+9.8%', color: 'bg-indigo-500' },
  { name: '智能舆情报告自动生成', calls: '45,800 次/日', share: 10.2, growth: '+22.5%', color: 'bg-emerald-500' },
  { name: '敏感词命中与告警推送', calls: '38,900 次/日', share: 8.7, growth: '+18.1%', color: 'bg-amber-500' },
  { name: '话题汇总与事件溯源', calls: '32,450 次/日', share: 7.2, growth: '+6.4%', color: 'bg-purple-500' },
  { name: '标签分类与数仓检索', calls: '28,600 次/日', share: 6.4, growth: '+4.3%', color: 'bg-sky-500' }
];

// 24小时分时段访问热度曲线
const HOURLY_TRAFFIC_DATA = [
  { hour: '00:00', pv: 420, qps: 12 },
  { hour: '02:00', pv: 180, qps: 6 },
  { hour: '04:00', pv: 120, qps: 4 },
  { hour: '06:00', pv: 360, qps: 11 },
  { hour: '08:00', pv: 1890, qps: 58 },
  { hour: '10:00', pv: 3450, qps: 116 }, // 早高峰
  { hour: '12:00', pv: 2100, qps: 64 },
  { hour: '14:00', pv: 3280, qps: 108 },
  { hour: '16:00', pv: 3680, qps: 128 }, // 下午高峰
  { hour: '18:00', pv: 2450, qps: 76 },
  { hour: '20:00', pv: 2890, qps: 92 }, // 晚间复盘
  { hour: '22:00', pv: 1650, qps: 45 }
];

// 终端设备分布
const DEVICE_DISTRIBUTION = [
  { name: 'PC Web 浏览器端', value: 68, icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: '移动端 APP', value: 18, icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: '政务企微/钉钉集成', value: 11, icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
  { name: 'OpenAPI 开放接口', value: 3, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' }
];

// TOP 10 活跃机构排行榜
const TOP_ACTIVE_ORGS = [
  { rank: 1, name: '成都市公安局网络安全保卫支队', statUnit: '四川区域', totalAccounts: 120, activeUsersToday: 98, apiCallsToday: 42800, health: '极高活跃', lastActive: '1分钟前' },
  { rank: 2, name: '四川省委网信办舆情应急指挥中心', statUnit: '四川区域', totalAccounts: 85, activeUsersToday: 74, apiCallsToday: 38900, health: '极高活跃', lastActive: '3分钟前' },
  { rank: 3, name: '重庆市融媒体监测研判中心', statUnit: '川藏区域', totalAccounts: 100, activeUsersToday: 82, apiCallsToday: 34200, health: '极高活跃', lastActive: '刚刚' },
  { rank: 4, name: '西安市公安局情报指挥中心', statUnit: '陕西一区', totalAccounts: 90, activeUsersToday: 68, apiCallsToday: 29800, health: '高活跃', lastActive: '5分钟前' },
  { rank: 5, name: '成都市高新区融媒体中心', statUnit: '四川区域', totalAccounts: 50, activeUsersToday: 44, apiCallsToday: 21500, health: '高活跃', lastActive: '8分钟前' },
  { rank: 6, name: '陕西省委政法委智能化综治平台', statUnit: '陕西区域', totalAccounts: 75, activeUsersToday: 59, apiCallsToday: 19600, health: '高活跃', lastActive: '12分钟前' },
  { rank: 7, name: '云南省公安厅大数据研判专班', statUnit: '川藏区域', totalAccounts: 60, activeUsersToday: 48, apiCallsToday: 18200, health: '高活跃', lastActive: '15分钟前' },
  { rank: 8, name: '贵州省应急管理厅舆情工作组', statUnit: '川藏区域', totalAccounts: 45, activeUsersToday: 36, apiCallsToday: 14700, health: '良好', lastActive: '22分钟前' },
  { rank: 9, name: '成都市双流区网信舆情中心', statUnit: '四川区域', totalAccounts: 40, activeUsersToday: 31, apiCallsToday: 12800, health: '良好', lastActive: '30分钟前' },
  { rank: 10, name: '德阳市公安局经侦与网安联合大队', statUnit: '四川区域', totalAccounts: 35, activeUsersToday: 28, apiCallsToday: 11400, health: '良好', lastActive: '45分钟前' }
];

export const AnalyticsBoard: React.FC<AnalyticsBoardProps> = ({
  appName = '谛听网络舆情预警系统',
  appCode = 'V8-P-DITING-ALERT-01',
  customerCount = 65
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeChartMetric, setActiveChartMetric] = useState<'dau' | 'orgs' | 'apiCalls'>('dau');

  // 根据时间范围截取数据
  const displayTrendData = React.useMemo(() => {
    if (timeRange === '7d') return DAILY_ACTIVE_TREND_DATA.slice(-7);
    if (timeRange === '30d') return DAILY_ACTIVE_TREND_DATA;
    // 90d 模拟生成
    return DAILY_ACTIVE_TREND_DATA;
  }, [timeRange]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 sm:p-8 flex flex-col gap-6 flex-1 self-stretch">
      {/* 顶部标题栏与时间范围选择器 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              应用分析看板 · 数字化使用监控
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              实时量化统计中
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            多维度监控【{appName}】（{appCode}）的客户开通覆盖、活跃用户趋势、权限角色结构与接口运行负载。
          </p>
        </div>

        {/* 右侧时间切换与刷新 */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              近 7 天
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              近 30 天
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                timeRange === '90d' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              近 90 天
            </button>
          </div>

          <button
            type="button"
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="刷新看板数据"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">刷新数据</span>
          </button>
        </div>
      </div>

      {/* ================= 1. 顶部 4 大核心数字化量化指标卡片 ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 卡片 1: 签约开通客户机构数 */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between gap-3 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>开通机构总数</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +5 家本月
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">{customerCount}</span>
              <span className="text-xs text-slate-500 font-bold">家机构</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
              <span>正式版: <strong className="text-slate-800">52</strong> 家</span>
              <span>•</span>
              <span>试用版: <strong className="text-slate-800">13</strong> 家</span>
            </div>
          </div>
        </div>

        {/* 卡片 2: 开通总用户数与今日活跃 */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between gap-3 hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>累计开通用户数</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +12.8% 环比
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">1,860</span>
              <span className="text-xs text-slate-500 font-bold">人</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
              <span>今日活跃 (DAU): <strong className="text-indigo-700 font-bold">1,680</strong> 人</span>
              <span className="text-[10px] px-1 bg-indigo-50 text-indigo-600 rounded">90.3% 活率</span>
            </div>
          </div>
        </div>

        {/* 卡片 3: 每日接口总调用与 QPS */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between gap-3 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>今日接口总调用量</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +18.4%
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">44.8</span>
              <span className="text-xs text-slate-500 font-bold">万次/日</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
              <span>峰值 QPS: <strong className="text-slate-800">128</strong> 次/秒</span>
              <span>•</span>
              <span>平均时延: <strong className="text-emerald-700">42ms</strong></span>
            </div>
          </div>
        </div>

        {/* 卡片 4: 预警触发与服务可用率 */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between gap-3 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>系统 SLA 与可用性</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              SLA 优良
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">99.98%</span>
              <span className="text-xs text-slate-500 font-bold">可用率</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
              <span>今日预警下发: <strong className="text-purple-700 font-bold">289</strong> 条</span>
              <span>•</span>
              <span>下发达标率: <strong className="text-slate-800">100%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. 核心图表区：每日活跃用户数(DAU) & 活跃机构数走势 (支持切换) ================= */}
      <div className="p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
              <span>活跃数据趋势分析（用户活跃 DAU / 机构活跃数 / 接口调用频次）</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              直观呈现工作日与周末的周期性规律，精准掌握机构端日常使用黏性。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveChartMetric('dau')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeChartMetric === 'dau'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              每日活跃用户 (DAU)
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('orgs')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeChartMetric === 'orgs'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              每日活跃机构数
            </button>
            <button
              type="button"
              onClick={() => setActiveChartMetric('apiCalls')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                activeChartMetric === 'apiCalls'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              接口调用量 (次/日)
            </button>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOrgs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorApiCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#FFFFFF', fontSize: '12px', padding: '8px 12px' }}
                itemStyle={{ color: '#FFFFFF' }}
              />
              {activeChartMetric === 'dau' && (
                <Area type="monotone" dataKey="dau" name="活跃用户数(人)" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDau)" />
              )}
              {activeChartMetric === 'orgs' && (
                <Area type="monotone" dataKey="orgs" name="活跃机构数(家)" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrgs)" />
              )}
              {activeChartMetric === 'apiCalls' && (
                <Area type="monotone" dataKey="apiCalls" name="接口调用量(次)" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApiCalls)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= 3. 维度对比：客户版本分布 (正式 vs 试用) + 核心功能热度 TOP 6 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 左侧：客户版本分布（正式客户 vs 试用客户） */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col justify-between gap-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>客户版本分布（正式签约 vs 试用体验 · 共 {customerCount} 家）</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                签约商业客户与试用测试客户的机构数量、占比及账号开通情况。
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-600 font-mono">
              正式转化率 80.0%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* 环形饼图 */}
            <div className="w-44 h-44 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CUSTOMER_VERSION_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {CUSTOMER_VERSION_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#FFFFFF', fontSize: '11px' }}
                    formatter={(value: any) => [`${value} 家机构`, '机构数量']}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* 饼图中心文案 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">总机构数</span>
                <span className="text-base font-black text-slate-900 font-mono leading-tight">{customerCount}</span>
              </div>
            </div>

            {/* 客户版本明细卡片列表 */}
            <div className="flex-1 w-full flex flex-col gap-2.5">
              {CUSTOMER_VERSION_DISTRIBUTION.map((item) => {
                const percentage = ((item.value / customerCount) * 100).toFixed(1);
                return (
                  <div 
                    key={item.name} 
                    className={`p-3 rounded-xl border ${item.borderColor} ${item.bgColor} flex flex-col gap-1 transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-bold text-slate-900 text-xs truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <strong className="text-slate-900 text-sm font-black">{item.value}</strong>
                        <span className="text-xs text-slate-500 font-bold">家 ({percentage}%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 mt-0.5">
                      <span className="text-slate-500 truncate">{item.desc}</span>
                      <span className="shrink-0 font-mono text-slate-700 font-bold ml-2">{item.avgAccounts}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧：核心功能与接口调用热度 TOP 6 */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col justify-between gap-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>核心功能模块调用热度排行 (TOP 6)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              各业务子系统的实时调用频次与负载占比。
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {TOP_FEATURES.map((item, idx) => (
              <div key={item.name} className="flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-slate-100 text-slate-600 font-mono font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-slate-600">{item.calls}</span>
                    <span className="font-mono font-bold text-emerald-600">{item.growth}</span>
                  </div>
                </div>
                {/* 进度条 */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.share * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= 4. 维度扩展：24小时分时段访问热力 + 终端设备分布 ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 左 2 栏：24小时访问时段分布 */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>24 小时访问高峰与负载分布（早间 10:00 & 下午 16:00 研判高峰）</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                每 2 小时采样一次访问 PV 与并发 QPS。
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">当日峰值: 128 QPS</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" tickLine={false} axisLine={{ stroke: '#E2E8F0' }} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#FFFFFF', fontSize: '11px' }}
                />
                <Bar dataKey="pv" name="访问量(PV)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 右 1 栏：终端设备生态占比 */}
        <div className="p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col justify-between gap-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <span>访问终端来源生态</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              各渠道终端的使用占比。
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {DEVICE_DISTRIBUTION.map((d) => {
              const IconComp = d.icon;
              return (
                <div key={d.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${d.bg} ${d.color} flex items-center justify-center shrink-0`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{d.name}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-slate-900">{d.value}%</span>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
            PC Web 浏览器仍为主要办公研判载体，移动与企微消息触达率增长迅速。
          </div>
        </div>

      </div>

      {/* ================= 5. TOP 10 活跃客户机构实时排行榜 ================= */}
      <div className="p-5 rounded-xl border border-slate-200/90 bg-white flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>签约客户机构活跃度排行榜 TOP 10</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              根据今日交互频次、活跃用户人数与接口负载综合评分排序。
            </p>
          </div>
          <span className="text-xs text-slate-500">共监测 65 家客户机构</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3 w-14 text-center">排名</th>
                <th className="py-2.5 px-3 min-w-[220px]">客户机构全称</th>
                <th className="py-2.5 px-3 w-40">所属统计单元</th>
                <th className="py-2.5 px-3 w-28 text-center">开通账号数</th>
                <th className="py-2.5 px-3 w-28 text-center">今日活跃人数</th>
                <th className="py-2.5 px-3 w-32 text-right">今日调用量</th>
                <th className="py-2.5 px-3 w-28 text-center">活跃等级</th>
                <th className="py-2.5 px-3 w-24 text-right">最后访问</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TOP_ACTIVE_ORGS.map((org) => (
                <tr key={org.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full font-mono text-[11px] font-black ${
                      org.rank === 1 ? 'bg-amber-100 text-amber-800' :
                      org.rank === 2 ? 'bg-slate-200 text-slate-700' :
                      org.rank === 3 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'text-slate-500'
                    }`}>
                      {org.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {org.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {org.statUnit}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {org.totalAccounts}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-indigo-600">
                    {org.activeUsersToday}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {org.apiCallsToday.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      org.health === '极高活跃' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      org.health === '高活跃' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {org.health}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-[11px] text-slate-400 font-mono">
                    {org.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
