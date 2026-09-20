/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Workflow,
  Send,
  Play,
  RotateCw,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCode,
  Layers,
  ArrowRight,
  Terminal,
  Server,
  Zap,
  Check,
  Copy,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';

interface InstructionItem {
  id: string;
  traceId: string;
  cmdType: string;
  cmdName: string;
  sourceNode: string;
  targetNode: string;
  channel: string;
  latency: number;
  timestamp: string;
  status: 'SUCCESS' | 'PROCESSING' | 'RETRY' | 'FAILED';
  payload: Record<string, any>;
  response: Record<string, any>;
}

const INITIAL_INSTRUCTIONS: InstructionItem[] = [
  {
    id: 'INS-20260912-001',
    traceId: 'TRC-MT-88492019',
    cmdType: 'CMD_ORG_SYNC_PUSH',
    cmdName: '机构组织数据增量同步',
    sourceNode: 'V8应用集成管理中心',
    targetNode: '客户私有化CRM中台',
    channel: 'MT_GRPC_DIRECT',
    latency: 12,
    timestamp: '2026-09-12 16:32:18',
    status: 'SUCCESS',
    payload: {
      action: 'SYNC_ORG_DELTA',
      orgCode: 'ORG_GZ_BANK_01',
      syncMode: 'INCREMENTAL',
      nodeCount: 14,
      version: 'v8.4.2'
    },
    response: {
      code: 200,
      message: 'OK',
      processedAt: '2026-09-12 16:32:18.012',
      syncedRows: 14
    }
  },
  {
    id: 'INS-20260912-002',
    traceId: 'TRC-MT-88492020',
    cmdType: 'CMD_AUTH_MATRIX_TRANSFER',
    cmdName: '权限策略矩阵全局广播',
    sourceNode: '统一权限管控中心',
    targetNode: '各业务系统API网关',
    channel: 'MT_MQ_BROKER',
    latency: 18,
    timestamp: '2026-09-12 16:30:05',
    status: 'SUCCESS',
    payload: {
      action: 'BROADCAST_PERM_MATRIX',
      scope: 'GLOBAL',
      rolesImpacted: ['ADMIN', 'AUDITOR', 'OPERATOR'],
      effectiveInstant: true
    },
    response: {
      code: 200,
      message: 'Broadcasting completed',
      nodeAcknowledgements: 8
    }
  },
  {
    id: 'INS-20260912-003',
    traceId: 'TRC-MT-88492021',
    cmdType: 'CMD_TOKEN_REFRESH_BROADCAST',
    cmdName: '外部用户会话凭证刷新',
    sourceNode: '外部用户认证中心',
    targetNode: '微信小程序/H5终端集群',
    channel: 'MT_DIRECT_TCP',
    latency: 8,
    timestamp: '2026-09-12 16:28:44',
    status: 'SUCCESS',
    payload: {
      action: 'REFRESH_TOKEN_CACHE',
      tokenFamily: 'EXT_USR_JWT_2026',
      ttlSeconds: 7200
    },
    response: {
      code: 200,
      message: 'Token cache updated'
    }
  },
  {
    id: 'INS-20260912-004',
    traceId: 'TRC-MT-88492022',
    cmdType: 'CMD_CMS_CONTENT_DISPATCH',
    cmdName: 'CMS全局内容下发流转',
    sourceNode: '全局CMS管理系统',
    targetNode: '边缘CDN分发节点',
    channel: 'MT_GRPC_DIRECT',
    latency: 24,
    timestamp: '2026-09-12 16:25:12',
    status: 'SUCCESS',
    payload: {
      action: 'DISPATCH_ARTICLE',
      articleId: 'ART-99081',
      targetCategories: ['FINANCE_POLICY', 'SYSTEM_ANNOUNCE'],
      priority: 1
    },
    response: {
      code: 200,
      message: 'Edge nodes warmed up'
    }
  },
  {
    id: 'INS-20260912-005',
    traceId: 'TRC-MT-88492023',
    cmdType: 'CMD_NOTIFY_EVENT_PIPELINE',
    cmdName: '业务审计事件流转归档',
    sourceNode: '指令流转MT引擎',
    targetNode: '安全审计合规库',
    channel: 'MT_MQ_BROKER',
    latency: 45,
    timestamp: '2026-09-12 16:21:50',
    status: 'PROCESSING',
    payload: {
      action: 'AUDIT_LOG_STREAM',
      eventLevel: 'HIGH_SECURITY',
      digest: 'SHA256-a9f82d11'
    },
    response: {
      code: 102,
      message: 'Queued in buffer ring'
    }
  }
];

export const InstructionFlowMTView: React.FC = () => {
  const [instructions, setInstructions] = useState<InstructionItem[]>(INITIAL_INSTRUCTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInstruction, setSelectedInstruction] = useState<InstructionItem | null>(INITIAL_INSTRUCTIONS[0]);
  
  // 模拟下发表单状态
  const [cmdType, setCmdType] = useState('CMD_ORG_SYNC_PUSH');
  const [sourceNode, setSourceNode] = useState('V8应用集成管理中心');
  const [targetNode, setTargetNode] = useState('客户私有化CRM中台');
  const [channel, setChannel] = useState('MT_GRPC_DIRECT');
  const [customPayload, setCustomPayload] = useState(
    JSON.stringify(
      {
        action: 'MANUAL_SIMULATION_TRIGGER',
        environment: 'TEST_STAGE_01',
        mockParameters: {
          batchSize: 50,
          retryOnTimeout: true,
          securityLevel: 'V8_HIGH'
        }
      },
      null,
      2
    )
  );
  const [isSending, setIsSending] = useState(false);
  const [copiedTrace, setCopiedTrace] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 快捷载入模板
  const handlePresetChange = (type: string) => {
    setCmdType(type);
    if (type === 'CMD_ORG_SYNC_PUSH') {
      setSourceNode('V8应用集成管理中心');
      setTargetNode('客户私有化CRM中台');
      setChannel('MT_GRPC_DIRECT');
      setCustomPayload(JSON.stringify({ action: 'SYNC_ORG_DELTA', orgCode: 'ORG_GZ_BANK_01', syncMode: 'INCREMENTAL' }, null, 2));
    } else if (type === 'CMD_AUTH_MATRIX_TRANSFER') {
      setSourceNode('统一权限管控中心');
      setTargetNode('各业务系统API网关');
      setChannel('MT_MQ_BROKER');
      setCustomPayload(JSON.stringify({ action: 'BROADCAST_PERM_MATRIX', scope: 'GLOBAL', effectiveInstant: true }, null, 2));
    } else if (type === 'CMD_CMS_CONTENT_DISPATCH') {
      setSourceNode('全局CMS管理系统');
      setTargetNode('边缘CDN分发节点');
      setChannel('MT_GRPC_DIRECT');
      setCustomPayload(JSON.stringify({ action: 'DISPATCH_ARTICLE', articleId: `ART-${Math.floor(10000 + Math.random() * 90000)}`, priority: 1 }, null, 2));
    } else if (type === 'CMD_TOKEN_REFRESH_BROADCAST') {
      setSourceNode('外部用户认证中心');
      setTargetNode('微信小程序/H5终端集群');
      setChannel('MT_DIRECT_TCP');
      setCustomPayload(JSON.stringify({ action: 'REFRESH_TOKEN_CACHE', ttlSeconds: 7200 }, null, 2));
    }
  };

  // 模拟发送指令
  const handleSimulateDispatch = () => {
    setIsSending(true);
    let parsedPayload = {};
    try {
      parsedPayload = JSON.parse(customPayload);
    } catch {
      parsedPayload = { raw: customPayload };
    }

    setTimeout(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const randomTrace = `TRC-MT-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const randomId = `INS-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.floor(100 + Math.random() * 900)}`;
      const latency = Math.floor(6 + Math.random() * 18);

      const newInst: InstructionItem = {
        id: randomId,
        traceId: randomTrace,
        cmdType,
        cmdName:
          cmdType === 'CMD_ORG_SYNC_PUSH'
            ? '机构组织数据增量同步'
            : cmdType === 'CMD_AUTH_MATRIX_TRANSFER'
            ? '权限策略矩阵全局广播'
            : cmdType === 'CMD_CMS_CONTENT_DISPATCH'
            ? 'CMS全局内容下发流转'
            : '外部用户会话凭证刷新',
        sourceNode,
        targetNode,
        channel,
        latency,
        timestamp: timeStr,
        status: 'SUCCESS',
        payload: parsedPayload,
        response: {
          code: 200,
          message: 'MT Simulation Dispatched Successfully',
          handledAt: timeStr,
          traceId: randomTrace,
          nodeLatencyMs: latency
        }
      };

      setInstructions(prev => [newInst, ...prev]);
      setSelectedInstruction(newInst);
      setIsSending(false);
      setSuccessToast(`模拟指令已成功下发至通道 [${channel}]`);
      setTimeout(() => setSuccessToast(null), 3000);
    }, 600);
  };

  // 复制 TraceID
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrace(text);
    setTimeout(() => setCopiedTrace(null), 2000);
  };

  // 过滤指令列表
  const filteredInstructions = instructions.filter(item => {
    const matchSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.traceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cmdName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cmdType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetNode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="w-full flex flex-col gap-6 text-slate-800 pb-12">
      {/* 头部：面包屑导航与标题 */}
      <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-3 pt-4 border-b border-slate-200 m-0" id="instruction_flow_mt_header">
        <div className="flex flex-col">
          {/* 面包屑导航 */}
          <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
            <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-slate-600 font-medium">模拟指令流转MT菜单</span>
          </nav>

          {/* 页面主标题与标签 */}
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
              模拟指令流转MT菜单
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
              MT模拟流转引擎
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              流转通道正常
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInstructions(INITIAL_INSTRUCTIONS);
              setSuccessToast('流转监控日志已刷新');
              setTimeout(() => setSuccessToast(null), 2500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#1e376b] bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新状态</span>
          </button>
        </div>
      </div>

      {/* Toast 提示 */}
      {successToast && (
        <div className="mx-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 核心指标统计卡片 */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">今日流转指令总量</span>
            <span className="text-2xl font-black text-slate-900 mt-1">18,429 <span className="text-xs font-normal text-slate-400">条</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1">较昨日 +12.4%</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1e376b] flex items-center justify-center">
            <Workflow className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">MT通道流转成功率</span>
            <span className="text-2xl font-black text-emerald-600 mt-1">99.92%</span>
            <span className="text-[11px] text-slate-400 font-medium mt-1">异常自动重试触发 3 次</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">平均端到端延迟</span>
            <span className="text-2xl font-black text-slate-900 mt-1">14.6 <span className="text-xs font-normal text-slate-400">ms</span></span>
            <span className="text-[11px] text-emerald-600 font-medium mt-1">低于 50ms 警戒线</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">MT通道与节点数</span>
            <span className="text-2xl font-black text-[#1e376b] mt-1">8 / 8 <span className="text-xs font-normal text-slate-400">活跃</span></span>
            <span className="text-[11px] text-slate-400 font-medium mt-1">拓扑链路全部就绪</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Server className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 主工作区：左侧指令模拟下发器，右侧流转日志与报文详情 */}
      <div className="px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 左侧：模拟指令装配与下发控制台 (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1e376b]" />
                <h2 className="text-sm font-bold text-slate-900">MT指令模拟装配器</h2>
              </div>
              <span className="text-[11px] text-slate-400">实时参数构建</span>
            </div>

            {/* 常用模板预设 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">快速载入指令预设：</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetChange('CMD_ORG_SYNC_PUSH')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all cursor-pointer ${
                    cmdType === 'CMD_ORG_SYNC_PUSH'
                      ? 'bg-[#1e376b] text-white border-[#1e376b] font-medium shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  🏢 机构数据增量同步
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('CMD_AUTH_MATRIX_TRANSFER')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all cursor-pointer ${
                    cmdType === 'CMD_AUTH_MATRIX_TRANSFER'
                      ? 'bg-[#1e376b] text-white border-[#1e376b] font-medium shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  🛡️ 权限策略矩阵广播
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('CMD_CMS_CONTENT_DISPATCH')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all cursor-pointer ${
                    cmdType === 'CMD_CMS_CONTENT_DISPATCH'
                      ? 'bg-[#1e376b] text-white border-[#1e376b] font-medium shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  📰 CMS内容下发流转
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetChange('CMD_TOKEN_REFRESH_BROADCAST')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all cursor-pointer ${
                    cmdType === 'CMD_TOKEN_REFRESH_BROADCAST'
                      ? 'bg-[#1e376b] text-white border-[#1e376b] font-medium shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  🔑 外部用户令牌续期
                </button>
              </div>
            </div>

            {/* 表单配置字段 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">源发起节点 (Source)</label>
                <select
                  value={sourceNode}
                  onChange={e => setSourceNode(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-[#1e376b]"
                >
                  <option value="V8应用集成管理中心">V8应用集成管理中心</option>
                  <option value="统一权限管控中心">统一权限管控中心</option>
                  <option value="全局CMS管理系统">全局CMS管理系统</option>
                  <option value="外部用户认证中心">外部用户认证中心</option>
                  <option value="指令流转MT引擎">指令流转MT引擎</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">目标接收节点 (Target)</label>
                <select
                  value={targetNode}
                  onChange={e => setTargetNode(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-[#1e376b]"
                >
                  <option value="客户私有化CRM中台">客户私有化CRM中台</option>
                  <option value="各业务系统API网关">各业务系统API网关</option>
                  <option value="边缘CDN分发节点">边缘CDN分发节点</option>
                  <option value="微信小程序/H5终端集群">微信小程序/H5终端集群</option>
                  <option value="安全审计合规库">安全审计合规库</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">流转传输通道 (Channel)</label>
                <select
                  value={channel}
                  onChange={e => setChannel(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:border-[#1e376b]"
                >
                  <option value="MT_GRPC_DIRECT">MT_GRPC_DIRECT (高性能直接调用，低延迟)</option>
                  <option value="MT_MQ_BROKER">MT_MQ_BROKER (可靠消息队列流转，支持削峰)</option>
                  <option value="MT_DIRECT_TCP">MT_DIRECT_TCP (长连接流转通道，高吞吐)</option>
                </select>
              </div>
            </div>

            {/* Payload JSON 编辑器 */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>指令报文 Payload (JSON)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const obj = JSON.parse(customPayload);
                      setCustomPayload(JSON.stringify(obj, null, 2));
                    } catch {}
                  }}
                  className="text-[11px] text-[#1e376b] hover:underline cursor-pointer"
                >
                  格式化 JSON
                </button>
              </div>
              <textarea
                value={customPayload}
                onChange={e => setCustomPayload(e.target.value)}
                rows={7}
                className="w-full font-mono text-xs p-3 bg-slate-900 text-emerald-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="请输入有效 JSON 载荷..."
              />
            </div>

            {/* 下发模拟指令按钮 */}
            <button
              onClick={handleSimulateDispatch}
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1e376b] hover:bg-[#162952] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>指令流转封装与下发中...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>执行模拟指令流转下发</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 右侧：流转监控记录与报文详情 (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* 指令流转日志记录表 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#1e376b]" />
                <h2 className="text-sm font-bold text-slate-900">MT指令流转实时监控表</h2>
                <span className="text-xs text-slate-400 font-normal">({filteredInstructions.length} 条记录)</span>
              </div>

              {/* 搜索与筛选 */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="搜索指令/Trace/节点..."
                    className="pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1e376b] w-44"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
                >
                  <option value="ALL">全部状态</option>
                  <option value="SUCCESS">成功</option>
                  <option value="PROCESSING">处理中</option>
                </select>
              </div>
            </div>

            {/* 记录表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">指令ID / TraceID</th>
                    <th className="py-2.5 px-3">指令类型 / 名称</th>
                    <th className="py-2.5 px-3">流转拓扑 (源 → 目标)</th>
                    <th className="py-2.5 px-3">通道 / 耗时</th>
                    <th className="py-2.5 px-3">状态</th>
                    <th className="py-2.5 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredInstructions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        暂无匹配的模拟指令流转记录
                      </td>
                    </tr>
                  ) : (
                    filteredInstructions.map(item => {
                      const isSelected = selectedInstruction?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedInstruction(item)}
                          className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/80' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono">
                            <div className="font-bold text-slate-800">{item.id}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <span>{item.traceId}</span>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCopy(item.traceId);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                                title="复制TraceID"
                              >
                                {copiedTrace === item.traceId ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-800">{item.cmdName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{item.cmdType}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1 text-slate-700">
                              <span className="truncate max-w-[100px]">{item.sourceNode}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[100px] font-medium text-[#1e376b]">{item.targetNode}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{item.timestamp}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-mono text-slate-700 font-medium">{item.channel}</div>
                            <div className="text-[11px] text-emerald-600 font-semibold">{item.latency} ms</div>
                          </td>
                          <td className="py-2.5 px-3">
                            {item.status === 'SUCCESS' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                成功
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                                <Clock className="w-3 h-3 animate-spin" />
                                处理中
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedInstruction(item);
                              }}
                              className="text-xs text-[#1e376b] font-medium hover:underline flex items-center gap-0.5 ml-auto"
                            >
                              <span>详情</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 选中指令的详细报文与响应展示 */}
          {selectedInstruction && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col gap-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#1e376b]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    指令流转报文详情 · <span className="font-mono text-[#1e376b]">{selectedInstruction.id}</span>
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Trace ID:</span>
                  <span className="font-mono text-slate-700 font-semibold">{selectedInstruction.traceId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 请求报文 Payload */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>下发 Payload:</span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(selectedInstruction.payload, null, 2))}
                      className="text-[11px] text-[#1e376b] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>复制</span>
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] p-3 bg-slate-900 text-emerald-400 rounded-lg border border-slate-700 overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(selectedInstruction.payload, null, 2)}
                  </pre>
                </div>

                {/* 节点响应 Response */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>目标节点响应 (Ack / Response):</span>
                    <span className="text-[11px] text-emerald-600 font-mono font-bold">HTTP 200 / OK</span>
                  </div>
                  <pre className="font-mono text-[11px] p-3 bg-slate-900 text-blue-300 rounded-lg border border-slate-700 overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(selectedInstruction.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
