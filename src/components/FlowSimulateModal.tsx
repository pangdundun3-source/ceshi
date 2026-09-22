import React, { useEffect, useMemo, useState } from 'react';
import { X, Play, CheckCircle2, Clock3 } from 'lucide-react';

interface FlowSimulateModalProps {
  flowName: string;
  flowDescription?: string;
  onClose: () => void;
}

type NodeKind = 'start' | 'fill' | 'audit' | 'branch' | 'end' | 'return';

interface SimNode {
  id: string;
  name: string;
  subtitle: string;
  kind: NodeKind;
  view: '发起视图' | '审核视图' | '归档视图' | '系统视图';
}

interface TrackItem {
  id: string;
  nodeId: string;
  name: string;
  detail: string;
  status: 'done' | 'current' | 'pending';
  duration?: string;
}

const PATH_NODES: SimNode[] = [
  { id: 'n_start', name: '开始', subtitle: '开始节点', kind: 'start', view: '系统视图' },
  { id: 'n_fill', name: '填写上报', subtitle: '发起人本人', kind: 'fill', view: '发起视图' },
  { id: 'n_audit', name: '管理员审核', subtitle: '指定角色：审核管理员', kind: 'audit', view: '审核视图' },
  { id: 'n_branch', name: '是否通过', subtitle: '条件分支', kind: 'branch', view: '系统视图' },
  { id: 'n_end', name: '办结', subtitle: '结束节点', kind: 'end', view: '归档视图' },
  { id: 'n_return', name: '退回修改', subtitle: '发起人本人', kind: 'return', view: '发起视图' },
];

const INITIAL_TRACK: TrackItem[] = [
  { id: 't1', nodeId: 'n_start', name: '开始', detail: '系统自动 · 09:12', status: 'done' },
  {
    id: 't2',
    nodeId: 'n_fill',
    name: '填写上报',
    detail: '发起人本人 提交 · 09:18',
    status: 'done',
    duration: '6 分钟',
  },
  {
    id: 't3',
    nodeId: 'n_audit',
    name: '管理员审核 (当前)',
    detail: '等待处理',
    status: 'current',
  },
];

export const FlowSimulateModal: React.FC<FlowSimulateModalProps> = ({
  flowName,
  flowDescription,
  onClose,
}) => {
  const [activeNodeId, setActiveNodeId] = useState('n_audit');
  const [currentNodeId, setCurrentNodeId] = useState('n_audit');
  const [track, setTrack] = useState<TrackItem[]>(INITIAL_TRACK);
  const [form, setForm] = useState({
    title: '2026年第一季度专项材料上报',
    org: '市网信办',
    person: '张华',
    date: '2026-09-22',
    materialType: '工作总结 / 佐证材料 / 统计报表',
    desc: '本季度已完成专项材料收集与核验，附件含汇总表与证明材料。',
  });
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('当前停留在「管理员审核」，可在中间表单执行通过或退回。');

  const activeNode = useMemo(
    () => PATH_NODES.find((node) => node.id === activeNodeId) ?? PATH_NODES[0],
    [activeNodeId],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const nowLabel = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const markDoneAndAdvance = (fromId: string, toId: string, detail: string, nextLabel?: string) => {
    const fromNode = PATH_NODES.find((node) => node.id === fromId);
    const toNode = PATH_NODES.find((node) => node.id === toId);
    if (!fromNode || !toNode) return;

    setTrack((prev) => {
      const cleaned = prev
        .filter((item) => item.status !== 'pending')
        .map((item) =>
          item.nodeId === fromId
            ? {
                ...item,
                name: fromNode.name,
                detail,
                status: 'done' as const,
                duration: item.duration || '1 分钟',
              }
            : item.nodeId === toId
              ? item
              : item,
        )
        .filter((item) => item.nodeId !== toId);

      return [
        ...cleaned,
        {
          id: `t_${Date.now()}`,
          nodeId: toId,
          name: nextLabel || `${toNode.name}${toId === 'n_end' ? '' : ' (当前)'}`,
          detail: toId === 'n_end' ? `系统自动 · ${nowLabel()}` : '等待处理',
          status: toId === 'n_end' ? ('done' as const) : ('current' as const),
        },
      ];
    });

    setCurrentNodeId(toId);
    setActiveNodeId(toId);
  };

  const handleSubmitFill = () => {
    if (currentNodeId !== 'n_fill' && currentNodeId !== 'n_return') return;
    setRunning(true);
    setTimeout(() => {
      markDoneAndAdvance(
        currentNodeId,
        'n_audit',
        `发起人本人 提交 · ${nowLabel()}`,
        '管理员审核 (当前)',
      );
      setMessage('已提交上报，流转至「管理员审核」。');
      setRunning(false);
    }, 350);
  };

  const handleAuditPass = () => {
    if (currentNodeId !== 'n_audit') return;
    setRunning(true);
    setTimeout(() => {
      markDoneAndAdvance('n_audit', 'n_branch', `审核管理员 通过 · ${nowLabel()}`);
      setTimeout(() => {
        markDoneAndAdvance('n_branch', 'n_end', `条件分支 通过 · ${nowLabel()}`, '办结');
        setMessage('审核通过，流程已办结。可关闭弹窗或重新模拟。');
        setRunning(false);
      }, 280);
    }, 280);
  };

  const handleAuditReject = () => {
    if (currentNodeId !== 'n_audit') return;
    setRunning(true);
    setTimeout(() => {
      markDoneAndAdvance('n_audit', 'n_branch', `审核管理员 退回 · ${nowLabel()}`);
      setTimeout(() => {
        markDoneAndAdvance('n_branch', 'n_return', `条件分支 退回 · ${nowLabel()}`, '退回修改 (当前)');
        setMessage('审核退回，已回到「退回修改」，可修改后再次提交。');
        setRunning(false);
      }, 280);
    }, 280);
  };

  const handleRestart = () => {
    setTrack(INITIAL_TRACK);
    setCurrentNodeId('n_audit');
    setActiveNodeId('n_audit');
    setMessage('已重置模拟轨迹，当前停留在「管理员审核」。');
  };

  const readOnlyForm = activeNode.kind === 'audit' || activeNode.kind === 'end' || activeNode.kind === 'start' || activeNode.kind === 'branch';
  const showFillActions = currentNodeId === 'n_fill' || currentNodeId === 'n_return';
  const showAuditActions = currentNodeId === 'n_audit';
  const finished = currentNodeId === 'n_end';

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-[1px] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      id="flow_simulate_modal_mask"
    >
      <div
        className="w-full max-w-[1180px] h-[min(860px,92vh)] bg-[#F7F9FC] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
        id="flow_simulate_modal"
      >
        {/* 顶栏 */}
        <div className="shrink-0 bg-white border-b border-slate-200 px-5 py-3.5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e376b] border border-blue-100 flex items-center justify-center">
                <Play className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">流程模拟运行 · {flowName}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {flowDescription || '左侧切换节点路径，中间查看模板视图，右侧跟踪模拟轨迹；不产生正式业务数据。'}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[#1e376b] bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5 inline-block">
              {message}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestart}
              className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              重新模拟
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 三栏主体 */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_240px]">
          {/* 左：流转路径 */}
          <aside className="bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1 h-3.5 rounded-sm bg-[#1e376b]" />
              <span className="text-xs font-bold text-slate-800">流转路径</span>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5">
              {PATH_NODES.map((node) => {
                const selected = node.id === activeNodeId;
                const isCurrent = node.id === currentNodeId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 border transition-colors ${
                      selected
                        ? 'bg-blue-50 border-blue-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${selected ? 'text-[#1e376b]' : 'text-slate-800'}`}>
                        {node.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e376b] text-white font-bold">当前</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{node.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* 中：模板视图 */}
          <section className="min-h-0 flex flex-col bg-[#EEF3F8]">
            <div className="px-4 py-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-slate-900">专项材料上报模板 · {activeNode.view}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  对应节点：{activeNode.name}
                  {readOnlyForm ? '（只读）' : '（可编辑）'}
                </div>
              </div>
              {finished && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  已办结
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mx-auto max-w-[680px] bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3.5">
                {(activeNode.kind === 'start' || activeNode.kind === 'branch' || activeNode.kind === 'end') && (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-xs text-slate-400">
                    {activeNode.kind === 'start' && '系统自动进入流程，无需人工填写。'}
                    {activeNode.kind === 'branch' && '条件分支根据审核结果自动路由到「办结」或「退回修改」。'}
                    {activeNode.kind === 'end' && '流程已结束，表单进入归档视图。'}
                  </div>
                )}

                {(activeNode.kind === 'fill' || activeNode.kind === 'audit' || activeNode.kind === 'return') && (
                  <>
                    <label className="block">
                      <span className="text-xs text-slate-600 mb-1 block">
                        事项名称 <span className="text-rose-500">*</span>
                      </span>
                      <input
                        value={form.title}
                        disabled={readOnlyForm}
                        onChange={(event) => setForm({ ...form, title: event.target.value })}
                        className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-xs text-slate-600 mb-1 block">填报单位</span>
                        <input
                          value={form.org}
                          disabled={readOnlyForm}
                          onChange={(event) => setForm({ ...form, org: event.target.value })}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs text-slate-600 mb-1 block">填报人</span>
                        <input
                          value={form.person}
                          disabled={readOnlyForm}
                          onChange={(event) => setForm({ ...form, person: event.target.value })}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-xs text-slate-600 mb-1 block">填报日期</span>
                        <input
                          value={form.date}
                          disabled={readOnlyForm}
                          onChange={(event) => setForm({ ...form, date: event.target.value })}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs text-slate-600 mb-1 block">材料类型</span>
                        <input
                          value={form.materialType}
                          disabled={readOnlyForm}
                          onChange={(event) => setForm({ ...form, materialType: event.target.value })}
                          className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-xs text-slate-600 mb-1 block">材料说明</span>
                      <textarea
                        value={form.desc}
                        disabled={readOnlyForm}
                        onChange={(event) => setForm({ ...form, desc: event.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:bg-slate-50 resize-none"
                      />
                    </label>

                    <div>
                      <span className="text-xs text-slate-600 mb-1 block">上报附件</span>
                      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-xs text-slate-400">
                        {readOnlyForm ? '已上传 2 个附件（模拟）' : '点击或拖拽文件到此处上传（模拟）'}
                      </div>
                    </div>

                    {activeNode.kind === 'audit' && (
                      <label className="block">
                        <span className="text-xs text-slate-600 mb-1 block">审核意见</span>
                        <textarea
                          rows={3}
                          placeholder="请输入审核意见（模拟）"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                          defaultValue="材料齐全，建议通过。"
                        />
                      </label>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 底部动作区（合并方案：路径联动 + 节点动作） */}
            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5" />
                模拟中不落库，可随时重新模拟
              </div>
              <div className="flex items-center gap-2">
                {showFillActions && (
                  <button
                    type="button"
                    disabled={running}
                    onClick={handleSubmitFill}
                    className="h-9 px-4 rounded-lg bg-[#1e376b] text-white text-xs font-bold hover:bg-[#14264c] disabled:opacity-60"
                  >
                    {running ? '提交中...' : '提交上报'}
                  </button>
                )}
                {showAuditActions && (
                  <>
                    <button
                      type="button"
                      disabled={running}
                      onClick={handleAuditReject}
                      className="h-9 px-4 rounded-lg border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 disabled:opacity-60"
                    >
                      退回修改
                    </button>
                    <button
                      type="button"
                      disabled={running}
                      onClick={handleAuditPass}
                      className="h-9 px-4 rounded-lg bg-[#1e376b] text-white text-xs font-bold hover:bg-[#14264c] disabled:opacity-60"
                    >
                      {running ? '处理中...' : '审核通过'}
                    </button>
                  </>
                )}
                {finished && (
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    再次模拟
                  </button>
                )}
                {!showFillActions && !showAuditActions && !finished && (
                  <span className="text-xs text-slate-400">请切换到当前节点执行操作</span>
                )}
              </div>
            </div>
          </section>

          {/* 右：模拟轨迹 */}
          <aside className="bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-1 h-3.5 rounded-sm bg-[#1e376b]" />
              <span className="text-xs font-bold text-slate-800">模拟轨迹</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="relative pl-4">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-blue-100" />
                <div className="flex flex-col gap-4">
                  {track.map((item) => {
                    const isCurrent = item.status === 'current';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNodeId(item.nodeId)}
                        className="relative text-left"
                      >
                        <span
                          className={`absolute -left-4 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                            isCurrent
                              ? 'bg-white border-[#1e376b]'
                              : item.status === 'done'
                                ? 'bg-[#1e376b] border-[#1e376b]'
                                : 'bg-white border-slate-300'
                          }`}
                        />
                        <div className={`pl-2 ${isCurrent ? 'text-[#1e376b]' : 'text-slate-800'}`}>
                          <div className="text-xs font-bold">{item.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.detail}</div>
                          {item.duration && (
                            <div className="text-[10px] text-slate-400 mt-0.5">耗时 {item.duration}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
