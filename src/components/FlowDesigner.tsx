import React, { useRef, useState } from 'react';
import { Plus } from 'lucide-react';

type FlowNodeKind =
  | 'start'
  | 'end'
  | 'fill'
  | 'dispatch'
  | 'receive'
  | 'execute'
  | 'audit'
  | 'countersign'
  | 'orsign'
  | 'branch'
  | 'transfer'
  | 'assist'
  | 'cc'
  | 'stage'
  | 'archive';

type NodeCategory = 'system' | 'manual';

interface FlowNode {
  id: string;
  kind: FlowNodeKind;
  name: string;
  code: string;
  category: NodeCategory;
  description: string;
  handlerSource: string;
  templateView: string;
  actions: string[];
}

interface FlowDraft {
  title: string;
  nodes: FlowNode[];
  selectedId: string;
  seq: number;
}

const STORAGE_KEY = 'v8_flow_config_draft';

const PALETTE: { kind: FlowNodeKind; label: string }[] = [
  { kind: 'start', label: '开始节点' },
  { kind: 'end', label: '结束节点' },
  { kind: 'fill', label: '填写节点' },
  { kind: 'dispatch', label: '下发节点' },
  { kind: 'receive', label: '接收节点' },
  { kind: 'execute', label: '执行节点' },
  { kind: 'audit', label: '审核节点' },
  { kind: 'countersign', label: '会签节点' },
  { kind: 'orsign', label: '或签节点' },
  { kind: 'branch', label: '条件分支' },
  { kind: 'transfer', label: '转办节点' },
  { kind: 'assist', label: '协办节点' },
  { kind: 'cc', label: '抄送节点' },
  { kind: 'stage', label: '阶段节点' },
  { kind: 'archive', label: '归档节点' },
];

const KIND_LABEL: Record<FlowNodeKind, string> = Object.fromEntries(
  PALETTE.map((item) => [item.kind, item.label]),
) as Record<FlowNodeKind, string>;

const HANDLER_OPTIONS = [
  '系统自动',
  '发起人本人',
  '指定角色: 审核管理员',
  '指定角色: 业务管理员',
  '指定人员',
  '上一节点处理人',
  '部门负责人',
];

const VIEW_OPTIONS = ['发起视图', '审核视图', '执行视图', '归档视图'];

const DEFAULT_ACTIONS: Partial<Record<FlowNodeKind, string[]>> = {
  fill: ['暂存', '提交'],
  audit: ['暂存', '提交', '退回'],
  countersign: ['同意', '驳回'],
  orsign: ['同意', '驳回'],
  dispatch: ['下发', '撤回'],
  receive: ['签收', '退回'],
  execute: ['暂存', '提交'],
  transfer: ['转办'],
  assist: ['协办完成'],
  cc: ['已阅'],
  archive: ['归档'],
  branch: ['条件判断'],
  stage: ['进入下一阶段'],
};

const SYSTEM_KINDS = new Set<FlowNodeKind>(['start', 'end']);

const isFlowKind = (value: string): value is FlowNodeKind => value in KIND_LABEL;

const makeNode = (
  kind: FlowNodeKind,
  seq: number,
  overrides: Partial<FlowNode> = {},
): FlowNode => {
  const category: NodeCategory = SYSTEM_KINDS.has(kind) ? 'system' : 'manual';
  const defaults: Record<FlowNodeKind, Partial<FlowNode>> = {
    start: { name: '开始', description: '流程开始', handlerSource: '系统自动' },
    end: { name: '结束', description: '流程结束', handlerSource: '系统自动' },
    fill: { name: '用户填写', description: '发起人填写表单', handlerSource: '发起人本人' },
    dispatch: { name: '任务下发', description: '向下级下发任务', handlerSource: '指定角色: 业务管理员' },
    receive: { name: '任务接收', description: '接收并签收任务', handlerSource: '指定人员' },
    execute: { name: '任务执行', description: '执行业务办理', handlerSource: '上一节点处理人' },
    audit: { name: '管理员审核', description: '完成管理员审核', handlerSource: '指定角色: 审核管理员' },
    countersign: { name: '会签审批', description: '多人会签通过', handlerSource: '指定角色: 审核管理员' },
    orsign: { name: '或签审批', description: '任一人审批即可', handlerSource: '指定角色: 审核管理员' },
    branch: { name: '条件分支', description: '按条件分流', handlerSource: '系统自动' },
    transfer: { name: '转办', description: '转交给他人办理', handlerSource: '指定人员' },
    assist: { name: '协办', description: '协助办理', handlerSource: '指定人员' },
    cc: { name: '抄送', description: '抄送知会', handlerSource: '指定人员' },
    stage: { name: '阶段节点', description: '进入下一业务阶段', handlerSource: '系统自动' },
    archive: { name: '办结归档', description: '办结并归档', handlerSource: '系统自动' },
  };

  return {
    id: `${kind}_${seq}_${Math.random().toString(36).slice(2, 6)}`,
    kind,
    name: defaults[kind].name || KIND_LABEL[kind],
    code: `node_${seq}`,
    category,
    description: defaults[kind].description || '',
    handlerSource: defaults[kind].handlerSource || (category === 'system' ? '系统自动' : '指定人员'),
    templateView: kind === 'audit' || kind === 'countersign' || kind === 'orsign' ? '审核视图' : '发起视图',
    actions: DEFAULT_ACTIONS[kind] ?? [],
    ...overrides,
  };
};

const seedDraft = (): FlowDraft => ({
  title: '单向上报审核流程',
  selectedId: 'node_audit_seed',
  seq: 6,
  nodes: [
    makeNode('start', 1, { id: 'node_start_seed', code: 'node_1', name: '开始' }),
    makeNode('fill', 2, { id: 'node_fill_seed', code: 'node_2', name: '用户填写' }),
    makeNode('audit', 4, {
      id: 'node_audit_seed',
      code: 'node_4',
      name: '管理员审核',
      description: '完成管理员审核',
      handlerSource: '指定角色: 审核管理员',
      templateView: '审核视图',
    }),
    makeNode('archive', 5, { id: 'node_archive_seed', code: 'node_5', name: '办结归档' }),
    makeNode('end', 6, { id: 'node_end_seed', code: 'node_6', name: '结束' }),
  ],
});

const loadDraft = (): FlowDraft => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDraft();
    const data = JSON.parse(raw) as FlowDraft;
    if (!data || !Array.isArray(data.nodes) || !data.title) return seedDraft();
    return data;
  } catch {
    return seedDraft();
  }
};

const borderColor = (node: FlowNode, selected: boolean) => {
  if (selected) return 'border-2 border-blue-500 shadow-sm';
  if (node.kind === 'fill') return 'border border-slate-200 border-l-[3px] border-l-orange-400';
  if (node.category === 'system' || node.kind === 'archive' || node.handlerSource === '系统自动') {
    return 'border border-slate-200 border-l-[3px] border-l-emerald-500';
  }
  return 'border border-slate-200 border-l-[3px] border-l-blue-500';
};

export const FlowDesigner = () => {
  const [boot] = useState(loadDraft);
  const [title, setTitle] = useState(boot.title);
  const [nodes, setNodes] = useState<FlowNode[]>(boot.nodes);
  const [selectedId, setSelectedId] = useState(boot.selectedId);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const seqRef = useRef(boot.seq);
  const dragRef = useRef('');
  const saveTimer = useRef<number | null>(null);

  const selected = selectedId ? nodes.find((node) => node.id === selectedId) ?? null : null;

  const createNode = (kind: FlowNodeKind) => {
    const seq = seqRef.current;
    seqRef.current += 1;
    return makeNode(kind, seq);
  };

  const insertAt = (kind: FlowNodeKind, index: number) => {
    const item = createNode(kind);
    setNodes((prev) => {
      const next = [...prev];
      next.splice(index, 0, item);
      return next;
    });
    setSelectedId(item.id);
  };

  const moveNode = (id: string, toIndex: number) => {
    setNodes((prev) => {
      const from = prev.findIndex((node) => node.id === id);
      if (from < 0) return prev;
      let target = toIndex;
      if (from < target) target -= 1;
      if (from === target) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(Math.max(0, Math.min(target, next.length)), 0, item);
      return next;
    });
    setSelectedId(id);
  };

  const place = (raw: string, index: number) => {
    if (raw.startsWith('add:')) {
      const kind = raw.slice(4);
      if (!isFlowKind(kind)) return;
      insertAt(kind, index);
      return;
    }
    if (raw.startsWith('move:')) {
      moveNode(raw.slice(5), index);
    }
  };

  const addByClick = (kind: FlowNodeKind) => {
    const endIndex = nodes.findIndex((node) => node.kind === 'end');
    insertAt(kind, endIndex >= 0 ? endIndex : nodes.length);
  };

  const patchSelected = (patch: Partial<FlowNode>) => {
    if (!selectedId) return;
    setNodes((prev) => prev.map((node) => (node.id === selectedId ? { ...node, ...patch } : node)));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    const node = nodes.find((item) => item.id === selectedId);
    if (node && SYSTEM_KINDS.has(node.kind) && nodes.filter((item) => item.kind === node.kind).length <= 1) {
      return;
    }
    const next = nodes.filter((item) => item.id !== selectedId);
    setNodes(next);
    setSelectedId(next[Math.max(0, next.length - 2)]?.id ?? next[0]?.id ?? '');
  };

  const saveDraft = () => {
    const payload: FlowDraft = {
      title,
      nodes,
      selectedId,
      seq: seqRef.current,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSaved(true);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaved(false), 1600);
  };

  const bindDrop = (key: string, index: number) => ({
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (overKey !== key) setOverKey(key);
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      place(event.dataTransfer.getData('text/plain') || dragRef.current, index);
      setOverKey(null);
    },
  });

  return (
    <div id="flow_designer">
      <div className="grid min-h-[640px] h-[calc(100vh-380px)] max-h-[820px] grid-cols-[232px_minmax(0,1fr)_288px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between px-3 py-3">
            <span className="text-sm font-semibold text-slate-800">流程节点</span>
            <span className="text-[11px] text-slate-400">拖入画布</span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="mb-2 text-[11px] text-slate-400">通用节点</div>
            <div className="grid grid-cols-2 gap-2">
              {PALETTE.map((item) => (
                <button
                  key={item.kind}
                  id={`flow_palette_${item.kind}`}
                  type="button"
                  draggable
                  onClick={() => addByClick(item.kind)}
                  onDragStart={(event) => {
                    dragRef.current = `add:${item.kind}`;
                    event.dataTransfer.setData('text/plain', `add:${item.kind}`);
                    event.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="h-8 cursor-grab rounded-md border border-slate-200 bg-white text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 active:cursor-grabbing"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="m-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
            流程节点只负责谁办理、怎么流转；表单字段由模板引擎统一维护。
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-col bg-[#eef3f8] p-4">
          <div className="mb-3 flex items-center justify-between">
            <input
              id="flow_canvas_title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="bg-transparent text-xs text-slate-500 outline-none"
            />
            <span className="text-xs text-slate-400">纵向流程画布</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-[420px] flex-col items-center pb-6">
              <div
                className={`mb-3 w-full rounded-md border border-dashed py-3 text-center text-xs ${
                  overKey === 'top-drop' ? 'border-blue-400 bg-blue-50 text-blue-500' : 'border-slate-300 text-slate-400'
                }`}
                {...bindDrop('top-drop', 0)}
              >
                拖拽节点到这里加入流程
              </div>

              {nodes.map((node, index) => {
                const selectedNode = node.id === selectedId;
                return (
                  <React.Fragment key={node.id}>
                    <div
                      data-node-id={node.id}
                      draggable
                      onDragStart={(event) => {
                        dragRef.current = `move:${node.id}`;
                        event.dataTransfer.setData('text/plain', `move:${node.id}`);
                        event.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={() => setSelectedId(node.id)}
                      className={`w-full cursor-pointer rounded-md bg-white px-4 py-3 shadow-sm transition-shadow ${borderColor(node, selectedNode)} ${
                        selectedNode ? '' : 'hover:shadow-md'
                      }`}
                      {...bindDrop(`node:${node.id}`, index)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{node.name}</div>
                          <div className="mt-1 text-xs text-slate-400">
                            {node.category === 'system' ? '系统节点' : '人工节点'}
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500">{node.handlerSource}</div>
                      </div>
                    </div>

                    {index < nodes.length - 1 && (
                      <div className="relative my-1 flex h-10 w-full flex-col items-center justify-center">
                        <div className="absolute inset-y-0 w-px bg-slate-300" />
                        <button
                          type="button"
                          title="在此处插入节点"
                          onClick={(event) => {
                            event.stopPropagation();
                            const kind = 'audit';
                            insertAt(kind, index + 1);
                          }}
                          onDragOver={(event) => {
                            event.preventDefault();
                            setOverKey(`gap:${index}`);
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            place(event.dataTransfer.getData('text/plain') || dragRef.current, index + 1);
                            setOverKey(null);
                          }}
                          className={`relative z-[1] flex h-6 w-6 items-center justify-center rounded-full border bg-white text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 ${
                            overKey === `gap:${index}` ? 'border-blue-400 text-blue-600' : 'border-slate-300'
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="flex h-full flex-col border-l border-slate-200 bg-white">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">节点配置</span>
              {selected && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  已选中
                </span>
              )}
            </div>

            {!selected && <p className="mt-6 text-sm text-slate-400">点击画布中的节点即可在这里调整配置。</p>}

            {selected && (
              <div className="mt-3">
                <input
                  id="flow_prop_name"
                  value={selected.name}
                  onChange={(event) => patchSelected({ name: event.target.value })}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                />
                <div className="mt-0.5 text-xs text-slate-400">{KIND_LABEL[selected.kind]}</div>

                <label className="mt-3 flex items-center justify-between gap-3 py-2">
                  <span className="shrink-0 text-sm text-slate-500">节点编码</span>
                  <input
                    id="flow_prop_code"
                    value={selected.code}
                    onChange={(event) => patchSelected({ code: event.target.value })}
                    className="h-8 w-[148px] rounded-md border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:border-blue-400"
                  />
                </label>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">节点类型</span>
                  <span className="text-sm text-slate-800">
                    {selected.category === 'system' ? '系统节点' : '人工节点'}
                  </span>
                </div>

                <label className="flex items-center justify-between gap-3 py-2">
                  <span className="shrink-0 text-sm text-slate-500">节点说明</span>
                  <input
                    id="flow_prop_desc"
                    value={selected.description}
                    onChange={(event) => patchSelected({ description: event.target.value })}
                    className="h-8 w-[148px] rounded-md border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:border-blue-400"
                  />
                </label>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="mb-1 text-sm font-semibold text-slate-800">处理人规则</div>
                  <label className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-500">处理人来源</span>
                    <select
                      id="flow_prop_handler"
                      value={selected.handlerSource}
                      onChange={(event) => patchSelected({ handlerSource: event.target.value })}
                      className="h-8 max-w-[160px] bg-transparent pr-1 text-right text-sm text-slate-800 outline-none"
                    >
                      {HANDLER_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="mb-2 text-sm font-semibold text-slate-800">模板视图绑定</div>
                  <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
                    <div className="mb-1 font-medium text-slate-700">已引用模板版本</div>
                    <div>模板：专项材料上报模板</div>
                    <div>版本：V2.1 · 视图：{selected.templateView}</div>
                    <div className="mt-1 text-slate-500">
                      字段权限：
                      {selected.kind === 'audit' || selected.kind === 'countersign' || selected.kind === 'orsign'
                        ? '只读，可编辑审核意见'
                        : selected.kind === 'fill'
                          ? '可编辑'
                          : '只读'}
                    </div>
                  </div>
                  <label className="mt-2 flex items-center justify-between py-2">
                    <span className="text-sm text-slate-500">绑定视图</span>
                    <select
                      id="flow_prop_view"
                      value={selected.templateView}
                      onChange={(event) => patchSelected({ templateView: event.target.value })}
                      className="h-8 bg-transparent pr-1 text-sm text-slate-800 outline-none"
                    >
                      {VIEW_OPTIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {selected.actions.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3">
                    <div className="mb-2 text-sm font-semibold text-slate-800">节点动作</div>
                    <div className="flex flex-wrap gap-2">
                      {selected.actions.map((action) => (
                        <button
                          key={action}
                          type="button"
                          className="h-8 rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-600"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={removeSelected}
                  className="mt-6 text-xs text-slate-400 hover:text-red-500"
                >
                  从画布移除
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 p-4">
            <button
              id="btn_flow_save"
              type="button"
              onClick={saveDraft}
              className="h-10 w-full rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              {saved ? '已保存' : '保存流程草稿'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
