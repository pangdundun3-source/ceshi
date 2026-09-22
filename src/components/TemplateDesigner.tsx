import React, { useEffect, useRef, useState } from 'react';

type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'person'
  | 'org'
  | 'image'
  | 'file'
  | 'subtable'
  | 'extension'
  | 'group'
  | 'columns'
  | 'tabs'
  | 'note'
  | 'upload'
  | 'divider';

interface DesignerTab {
  id: string;
  label: string;
  children: DesignerNode[];
}

interface DesignerNode {
  id: string;
  type: FieldType;
  label: string;
  code: string;
  placeholder: string;
  required: boolean;
  queryable: boolean;
  exportable: boolean;
  sensitive: boolean;
  minLength: number;
  maxLength: number;
  format: string;
  text: string;
  children?: DesignerNode[];
  columns?: DesignerNode[][];
  tabs?: DesignerTab[];
  activeTab?: number;
}

interface BootState {
  title: string;
  description: string;
  nodes: DesignerNode[];
  selectedId: string;
  seq: number;
}

const STORAGE_KEY = 'v8_template_config_draft';

const BASIC_FIELDS: { type: FieldType; label: string }[] = [
  { type: 'text', label: '单行文本' },
  { type: 'textarea', label: '多行文本' },
  { type: 'number', label: '数字' },
  { type: 'date', label: '日期' },
  { type: 'person', label: '人员选择' },
  { type: 'org', label: '组织选择' },
  { type: 'image', label: '图片' },
  { type: 'file', label: '文件附件' },
  { type: 'subtable', label: '子表' },
  { type: 'extension', label: '扩展组件' },
];

const LAYOUT_FIELDS: { type: FieldType; label: string }[] = [
  { type: 'group', label: '分组' },
  { type: 'columns', label: '分栏' },
  { type: 'tabs', label: '标签页' },
  { type: 'note', label: '说明文字' },
  { type: 'upload', label: '材料上传区' },
  { type: 'divider', label: '分割线' },
];

const TYPE_LABEL: Record<FieldType, string> = {
  text: '单行文本',
  textarea: '多行文本',
  number: '数字',
  date: '日期',
  person: '人员选择',
  org: '组织选择',
  image: '图片',
  file: '文件附件',
  subtable: '子表',
  extension: '扩展组件',
  group: '分组',
  columns: '分栏',
  tabs: '标签页',
  note: '说明文字',
  upload: '材料上传区',
  divider: '分割线',
};

const FORMATS: Partial<Record<FieldType, string[]>> = {
  text: ['普通文本', '手机号', '邮箱', '身份证号', '统一社会信用代码'],
  textarea: ['普通文本', '手机号', '邮箱', '身份证号', '统一社会信用代码'],
  number: ['整数', '小数', '金额', '百分比'],
  date: ['日期', '日期时间'],
};

const ROOT_LAYOUT = new Set<FieldType>(['group', 'columns', 'tabs']);

const leaf = (
  partial: Pick<DesignerNode, 'id' | 'type' | 'label' | 'code'> & Partial<DesignerNode>,
): DesignerNode => ({
  placeholder: '',
  required: false,
  queryable: false,
  exportable: true,
  sensitive: false,
  minLength: 0,
  maxLength: 100,
  format: '普通文本',
  text: '',
  ...partial,
});

const seedBoot = (): BootState => ({
  title: '专项材料上报',
  description: '请按要求填写专项材料，并上传相关佐证文件。',
  selectedId: 'fld_name',
  seq: 9,
  nodes: [
    {
      ...leaf({ id: 'group_basic', type: 'group', label: '基本信息', code: 'group_1' }),
      children: [
        leaf({
          id: 'fld_name',
          type: 'text',
          label: '事项名称',
          code: 'field_4',
          placeholder: '请输入事项名称',
          required: true,
          minLength: 2,
          maxLength: 100,
          format: '普通文本',
        }),
        leaf({
          id: 'fld_org',
          type: 'org',
          label: '填报单位',
          code: 'field_5',
          placeholder: '请选择填报单位',
          required: true,
        }),
        leaf({
          id: 'fld_person',
          type: 'person',
          label: '联系人',
          code: 'field_6',
          placeholder: '请选择联系人',
          required: true,
        }),
        leaf({
          id: 'fld_desc',
          type: 'textarea',
          label: '材料说明',
          code: 'field_7',
          placeholder: '请输入材料说明',
          maxLength: 500,
        }),
        leaf({
          id: 'fld_file',
          type: 'file',
          label: '附件材料',
          code: 'field_8',
          placeholder: '请上传附件材料',
          required: true,
        }),
      ],
    },
  ],
});

const loadInitial = (): BootState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBoot();
    const data = JSON.parse(raw) as BootState;
    if (!data || !Array.isArray(data.nodes) || !data.title) return seedBoot();
    return data;
  } catch {
    return seedBoot();
  }
};

const isFieldType = (value: string): value is FieldType => value in TYPE_LABEL;

const updateById = (
  nodes: DesignerNode[],
  id: string,
  updater: (node: DesignerNode) => DesignerNode,
): DesignerNode[] =>
  nodes.map((node) => {
    if (node.id === id) return updater(node);
    return {
      ...node,
      children: node.children ? updateById(node.children, id, updater) : node.children,
      columns: node.columns?.map((col) => updateById(col, id, updater)),
      tabs: node.tabs?.map((tab) => ({ ...tab, children: updateById(tab.children, id, updater) })),
    };
  });

const findById = (nodes: DesignerNode[], id: string): DesignerNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = [
      ...(node.children ?? []),
      ...(node.columns?.flat() ?? []),
      ...(node.tabs?.flatMap((tab) => tab.children) ?? []),
    ];
    const hit = findById(nested, id);
    if (hit) return hit;
  }
  return null;
};

const removeById = (nodes: DesignerNode[], id: string): DesignerNode[] =>
  nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeById(node.children, id) : node.children,
      columns: node.columns?.map((col) => removeById(col, id)),
      tabs: node.tabs?.map((tab) => ({ ...tab, children: removeById(tab.children, id) })),
    }));

const locate = (
  nodes: DesignerNode[],
  id: string,
  container = 'root',
): { container: string; index: number } | null => {
  const index = nodes.findIndex((node) => node.id === id);
  if (index >= 0) return { container, index };
  for (const node of nodes) {
    if (node.children) {
      const hit = locate(node.children, id, `group:${node.id}`);
      if (hit) return hit;
    }
    if (node.columns) {
      for (let colIndex = 0; colIndex < node.columns.length; colIndex += 1) {
        const hit = locate(node.columns[colIndex], id, `col:${node.id}:${colIndex}`);
        if (hit) return hit;
      }
    }
    if (node.tabs) {
      for (const tab of node.tabs) {
        const hit = locate(tab.children, id, `tab:${node.id}:${tab.id}`);
        if (hit) return hit;
      }
    }
  }
  return null;
};

const updateList = (
  nodes: DesignerNode[],
  container: string,
  updater: (list: DesignerNode[]) => DesignerNode[],
): DesignerNode[] => {
  if (container === 'root') return updater(nodes);
  return nodes.map((node) => {
    if (container === `group:${node.id}`) {
      return { ...node, children: updater(node.children ?? []) };
    }
    if (node.columns && container.startsWith(`col:${node.id}:`)) {
      const index = Number(container.slice(`col:${node.id}:`.length));
      return {
        ...node,
        columns: node.columns.map((col, colIndex) => (colIndex === index ? updater(col) : col)),
      };
    }
    if (node.tabs && container.startsWith(`tab:${node.id}:`)) {
      const tabId = container.slice(`tab:${node.id}:`.length);
      return {
        ...node,
        tabs: node.tabs.map((tab) => (tab.id === tabId ? { ...tab, children: updater(tab.children) } : tab)),
      };
    }
    return {
      ...node,
      children: node.children ? updateList(node.children, container, updater) : node.children,
      columns: node.columns?.map((col) => updateList(col, container, updater)),
      tabs: node.tabs?.map((tab) => ({ ...tab, children: updateList(tab.children, container, updater) })),
    };
  });
};

const readList = (nodes: DesignerNode[], container: string): DesignerNode[] | null => {
  if (container === 'root') return nodes;
  let found: DesignerNode[] | null = null;
  const visit = (list: DesignerNode[]) => {
    for (const node of list) {
      if (found) return;
      if (container === `group:${node.id}`) found = node.children ?? [];
      if (node.columns && container.startsWith(`col:${node.id}:`)) {
        const index = Number(container.slice(`col:${node.id}:`.length));
        found = node.columns[index] ?? [];
      }
      if (node.tabs && container.startsWith(`tab:${node.id}:`)) {
        const tabId = container.slice(`tab:${node.id}:`.length);
        found = node.tabs.find((tab) => tab.id === tabId)?.children ?? [];
      }
      if (found) return;
      if (node.children) visit(node.children);
      node.columns?.forEach((col) => visit(col));
      node.tabs?.forEach((tab) => visit(tab.children));
    }
  };
  visit(nodes);
  return found;
};

const insertInto = (nodes: DesignerNode[], container: string, index: number, item: DesignerNode) =>
  updateList(nodes, container, (list) => {
    const next = [...list];
    next.splice(index, 0, item);
    return next;
  });

const showsPermission = (type: FieldType) =>
  !['group', 'columns', 'tabs', 'divider', 'note'].includes(type);

const showsPlaceholder = (type: FieldType) =>
  !['group', 'columns', 'tabs', 'divider', 'note'].includes(type);

const showsCode = (type: FieldType) => !['group', 'columns', 'tabs', 'divider', 'note'].includes(type);

const Toggle = ({
  on,
  label,
  onChange,
}: {
  on: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-slate-600">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-5 w-10 rounded-full transition-colors ${on ? 'bg-blue-500' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? 'left-5' : 'left-0.5'}`}
      />
    </button>
  </div>
);

const FieldFace = ({ node, selected }: { node: DesignerNode; selected: boolean }) => {
  const tall =
    node.type === 'textarea' || node.type === 'file' || node.type === 'image' || node.type === 'upload';
  return (
    <div
      className={`rounded-md transition-colors ${selected ? 'bg-blue-50/35 p-1 ring-2 ring-blue-500 ring-offset-1' : 'p-0.5'}`}
    >
      <div className="mb-1.5 text-sm text-slate-700">
        {node.label}
        {node.required && <span className="ml-0.5 text-rose-500">*</span>}
      </div>
      <div
        className={`flex items-center rounded-md border bg-white px-3 text-xs text-slate-400 ${
          tall ? 'min-h-[72px] items-start py-3' : 'h-10'
        } ${selected ? 'border-blue-400' : 'border-slate-200 hover:border-blue-200'}`}
      >
        <span className="ml-auto shrink-0">{TYPE_LABEL[node.type]}</span>
      </div>
    </div>
  );
};

function PreviewNodes({ nodes }: { nodes: DesignerNode[] }) {
  return (
    <div className="flex flex-col gap-3">
      {nodes.map((node) => (
        <div key={node.id}>
          <PreviewNode node={node} />
        </div>
      ))}
    </div>
  );
}

const PreviewControl = ({ node }: { node: DesignerNode }) => {
  const common = 'w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none';
  if (node.type === 'textarea') {
    return <textarea readOnly placeholder={node.placeholder} className={`${common} min-h-20 py-2`} />;
  }
  if (node.type === 'number') {
    return <input readOnly placeholder={node.placeholder || '请输入数字'} className={`${common} h-9`} />;
  }
  if (node.type === 'date') {
    return <input readOnly placeholder={node.placeholder || '请选择日期'} className={`${common} h-9`} />;
  }
  if (node.type === 'person' || node.type === 'org') {
    return <input readOnly placeholder={node.placeholder || '请选择'} className={`${common} h-9`} />;
  }
  if (node.type === 'image' || node.type === 'file' || node.type === 'upload') {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center text-xs text-slate-400">
        {node.placeholder || '点击或拖拽文件到此处'}
      </div>
    );
  }
  if (node.type === 'subtable') {
    return (
      <div className="overflow-hidden rounded-md border border-slate-200 text-xs text-slate-500">
        <div className="grid grid-cols-2 bg-slate-50 px-3 py-2 font-medium text-slate-600">
          <span>子项名称</span>
          <span>内容</span>
        </div>
        <div className="grid grid-cols-2 px-3 py-3 text-slate-400">
          <span>待填写</span>
          <span>待填写</span>
        </div>
      </div>
    );
  }
  if (node.type === 'extension') {
    return (
      <div className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-400">
        扩展组件
      </div>
    );
  }
  return <input readOnly placeholder={node.placeholder || '请输入'} className={`${common} h-9`} />;
};

function PreviewNode({ node }: { node: DesignerNode }) {
  if (node.type === 'group') {
    return (
      <section className="rounded-md border border-blue-200 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="h-3.5 w-1 rounded-sm bg-blue-500" />
          {node.label}
        </div>
        <PreviewNodes nodes={node.children ?? []} />
      </section>
    );
  }
  if (node.type === 'columns') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {(node.columns ?? []).map((col, index) => (
          <div key={index}>
            <PreviewNodes nodes={col} />
          </div>
        ))}
      </div>
    );
  }
  if (node.type === 'tabs') {
    const tabs = node.tabs ?? [];
    const current = tabs[node.activeTab ?? 0] ?? tabs[0];
    return (
      <div>
        <div className="mb-3 flex gap-2 border-b border-slate-200">
          {tabs.map((tab) => (
            <span
              key={tab.id}
              className={`px-2 pb-2 text-sm ${tab.id === current?.id ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-slate-400'}`}
            >
              {tab.label}
            </span>
          ))}
        </div>
        <PreviewNodes nodes={current?.children ?? []} />
      </div>
    );
  }
  if (node.type === 'note') {
    return <p className="text-sm leading-relaxed text-slate-500">{node.text || node.label}</p>;
  }
  if (node.type === 'divider') {
    return <div className="border-t border-slate-200" />;
  }
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-slate-700">
        {node.label}
        {node.required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      <PreviewControl node={node} />
    </label>
  );
};

export const TemplateDesigner = () => {
  const [boot] = useState(loadInitial);
  const [title, setTitle] = useState(boot.title);
  const [description, setDescription] = useState(boot.description);
  const [nodes, setNodes] = useState<DesignerNode[]>(boot.nodes);
  const [selectedId, setSelectedId] = useState(boot.selectedId);
  const [overKey, setOverKey] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const seqRef = useRef(boot.seq);
  const dragRef = useRef('');
  const saveTimer = useRef<number | null>(null);

  const selected = selectedId ? findById(nodes, selectedId) : null;

  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [previewOpen]);

  const createNode = (type: FieldType): DesignerNode => {
    const seq = seqRef.current;
    seqRef.current += 1;
    const id = `${type}_${seq}_${Math.random().toString(36).slice(2, 6)}`;
    const base = leaf({
      id,
      type,
      label: type === 'group' ? '新分组' : TYPE_LABEL[type],
      code: `field_${seq}`,
      placeholder:
        type === 'text' || type === 'textarea'
          ? '请输入内容'
          : type === 'date'
            ? '请选择日期'
            : type === 'person'
              ? '请选择人员'
              : type === 'org'
                ? '请选择组织'
                : type === 'number'
                  ? '请输入数字'
                  : type === 'file' || type === 'image' || type === 'upload'
                    ? '请上传文件'
                    : '',
      format: type === 'number' ? '整数' : type === 'date' ? '日期' : '普通文本',
      maxLength: type === 'textarea' ? 500 : 100,
      text: type === 'note' ? '请在此填写说明文字。' : '',
    });
    if (type === 'group') return { ...base, children: [] };
    if (type === 'columns') return { ...base, columns: [[], []] };
    if (type === 'tabs') {
      return {
        ...base,
        activeTab: 0,
        tabs: [
          { id: `${id}_a`, label: '标签一', children: [] },
          { id: `${id}_b`, label: '标签二', children: [] },
        ],
      };
    }
    return base;
  };

  const appendTargetFor = (type: FieldType) => {
    if (ROOT_LAYOUT.has(type)) return { container: 'root', index: nodes.length };
    if (selected?.type === 'group') {
      return { container: `group:${selected.id}`, index: selected.children?.length ?? 0 };
    }
    if (selected?.type === 'columns') {
      return { container: `col:${selected.id}:0`, index: selected.columns?.[0]?.length ?? 0 };
    }
    if (selected?.type === 'tabs') {
      const tab = selected.tabs?.[selected.activeTab ?? 0];
      if (tab) return { container: `tab:${selected.id}:${tab.id}`, index: tab.children.length };
    }
    if (selectedId) {
      const loc = locate(nodes, selectedId);
      if (loc && loc.container !== 'root') {
        const list = readList(nodes, loc.container) ?? [];
        return { container: loc.container, index: list.length };
      }
    }
    const lastGroup = [...nodes].reverse().find((node) => node.type === 'group');
    if (lastGroup) return { container: `group:${lastGroup.id}`, index: lastGroup.children?.length ?? 0 };
    return { container: 'root', index: nodes.length };
  };

  const place = (raw: string, container: string, index: number) => {
    if (raw.startsWith('add:')) {
      const type = raw.slice(4);
      if (!isFieldType(type)) return;
      const item = createNode(type);
      setNodes((prev) => insertInto(prev, container, index, item));
      setSelectedId(item.id);
      return;
    }
    if (!raw.startsWith('move:')) return;
    const id = raw.slice(5);
    setNodes((prev) => {
      const moving = findById(prev, id);
      if (!moving) return prev;
      const intoSelf =
        container === `group:${id}` || container.startsWith(`col:${id}:`) || container.startsWith(`tab:${id}:`);
      const targetContainer = intoSelf ? 'root' : container;
      const loc = locate(prev, id);
      let nextIndex = intoSelf ? prev.length : index;
      if (loc && loc.container === targetContainer && loc.index < nextIndex) nextIndex -= 1;
      if (loc && loc.container === targetContainer && loc.index === nextIndex) return prev;
      return insertInto(removeById(prev, id), targetContainer, Math.max(0, nextIndex), moving);
    });
    setSelectedId(id);
  };

  const addByClick = (type: FieldType) => {
    const target = appendTargetFor(type);
    place(`add:${type}`, target.container, target.index);
  };

  const patchSelected = (patch: Partial<DesignerNode>) => {
    if (!selectedId) return;
    setNodes((prev) => updateById(prev, selectedId, (node) => ({ ...node, ...patch })));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    const loc = locate(nodes, selectedId);
    const list = loc ? readList(nodes, loc.container) ?? [] : [];
    const fallback = list.filter((node) => node.id !== selectedId)[0]?.id ?? 'group_basic';
    setNodes((prev) => removeById(prev, selectedId));
    setSelectedId(findById(removeById(nodes, selectedId), fallback) ? fallback : '');
  };

  const saveDraft = () => {
    const payload: BootState = {
      title,
      description,
      nodes,
      selectedId,
      seq: seqRef.current,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setSaved(true);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => setSaved(false), 1600);
  };

  const bindDrop = (key: string, container: string, index: number) => ({
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (overKey !== key) setOverKey(key);
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      place(event.dataTransfer.getData('text/plain') || dragRef.current, container, index);
      setOverKey(null);
    },
  });

  const renderNodes = (list: DesignerNode[], container: string): React.ReactNode =>
    list.map((node, index) => {
      const selectedNode = node.id === selectedId;
      const dragProps = {
        draggable: true,
        onDragStart: (event: React.DragEvent) => {
          dragRef.current = `move:${node.id}`;
          event.dataTransfer.setData('text/plain', `move:${node.id}`);
          event.dataTransfer.effectAllowed = 'move';
          event.stopPropagation();
        },
        onClick: (event: React.MouseEvent) => {
          event.stopPropagation();
          setSelectedId(node.id);
        },
      };

      if (node.type === 'group') {
        return (
          <section
            key={node.id}
            data-field-id={node.id}
            className={`rounded-md border p-3 ${selectedNode ? 'border-blue-300' : 'border-blue-200'} ${overKey === node.id ? 'bg-blue-50/40' : 'bg-white'}`}
            {...dragProps}
            {...bindDrop(node.id, `group:${node.id}`, node.children?.length ?? 0)}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="h-3.5 w-1 rounded-sm bg-blue-500" />
              {node.label}
            </div>
            <div className="flex flex-col gap-2.5">
              {renderNodes(node.children ?? [], `group:${node.id}`)}
              {(node.children?.length ?? 0) === 0 && (
                <div className="rounded-md border border-dashed border-slate-200 py-4 text-center text-xs text-slate-400">
                  拖入字段
                </div>
              )}
            </div>
          </section>
        );
      }

      if (node.type === 'columns') {
        return (
          <div
            key={node.id}
            data-field-id={node.id}
            className={`rounded-md p-1 ${selectedNode ? 'ring-2 ring-blue-400' : ''}`}
            {...dragProps}
          >
            <div className="grid grid-cols-2 gap-3">
              {(node.columns ?? []).map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={`min-h-[76px] rounded-md border border-dashed p-2 ${overKey === `col:${node.id}:${colIndex}` ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}
                  {...bindDrop(`col:${node.id}:${colIndex}`, `col:${node.id}:${colIndex}`, col.length)}
                >
                  <div className="flex flex-col gap-2">
                    {renderNodes(col, `col:${node.id}:${colIndex}`)}
                    {col.length === 0 && <div className="py-4 text-center text-xs text-slate-400">拖入字段</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (node.type === 'tabs') {
        const tabs = node.tabs ?? [];
        const active = tabs[node.activeTab ?? 0] ?? tabs[0];
        return (
          <div
            key={node.id}
            data-field-id={node.id}
            className={`rounded-md border bg-white p-3 ${selectedNode ? 'border-blue-500' : 'border-slate-200'}`}
            {...dragProps}
          >
            <div className="mb-3 flex gap-1 border-b border-slate-200">
              {tabs.map((tab, tabIndex) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedId(node.id);
                    setNodes((prev) => updateById(prev, node.id, (current) => ({ ...current, activeTab: tabIndex })));
                  }}
                  className={`px-3 pb-2 text-sm ${tab.id === active?.id ? 'border-b-2 border-blue-600 font-medium text-blue-600' : 'text-slate-500'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {active && (
              <div
                className={`flex min-h-[64px] flex-col gap-2 rounded-md ${overKey === `tab:${node.id}:${active.id}` ? 'bg-blue-50' : ''}`}
                {...bindDrop(`tab:${node.id}:${active.id}`, `tab:${node.id}:${active.id}`, active.children.length)}
              >
                {renderNodes(active.children, `tab:${node.id}:${active.id}`)}
                {active.children.length === 0 && (
                  <div className="py-4 text-center text-xs text-slate-400">拖入字段到当前标签</div>
                )}
              </div>
            )}
          </div>
        );
      }

      if (node.type === 'note') {
        return (
          <div
            key={node.id}
            data-field-id={node.id}
            className={`cursor-pointer rounded-md px-1 py-1 text-sm leading-relaxed text-slate-500 ${selectedNode ? 'ring-2 ring-blue-400' : ''}`}
            {...dragProps}
            {...bindDrop(`before:${node.id}`, container, index)}
          >
            {node.text || node.label}
          </div>
        );
      }

      if (node.type === 'divider') {
        return (
          <div
            key={node.id}
            data-field-id={node.id}
            className={`cursor-pointer py-1 ${selectedNode ? 'rounded ring-2 ring-blue-400' : ''}`}
            {...dragProps}
            {...bindDrop(`before:${node.id}`, container, index)}
          >
            <div className="border-t border-slate-300" />
          </div>
        );
      }

      if (node.type === 'upload') {
        return (
          <div
            key={node.id}
            data-field-id={node.id}
            className={`cursor-pointer rounded-md border border-dashed px-3 py-6 text-center ${selectedNode ? 'border-blue-500 bg-blue-50/40' : 'border-slate-300 bg-white'} ${overKey === `before:${node.id}` ? 'border-blue-400' : ''}`}
            {...dragProps}
            {...bindDrop(`before:${node.id}`, container, index)}
          >
            <div className="text-sm text-slate-600">
              {node.label}
              {node.required && <span className="ml-0.5 text-rose-500">*</span>}
            </div>
            <div className="mt-1 text-xs text-slate-400">{node.placeholder || '点击或拖拽文件到此处'}</div>
          </div>
        );
      }

      return (
        <div
          key={node.id}
          data-field-id={node.id}
          className="cursor-pointer"
          {...dragProps}
          {...bindDrop(`before:${node.id}`, container, index)}
        >
          <FieldFace node={node} selected={selectedNode} />
        </div>
      );
    });

  const formats = selected ? FORMATS[selected.type] : undefined;

  return (
    <div id="template_designer">
      <div className="grid min-h-[640px] h-[calc(100vh-380px)] max-h-[820px] grid-cols-[232px_minmax(0,1fr)_288px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <aside className="flex h-full flex-col border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between px-3 py-3">
            <span className="text-sm font-semibold text-slate-800">字段与组件</span>
            <span className="text-[11px] text-slate-400">拖入画布</span>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="mb-4">
              <div className="mb-2 text-[11px] text-slate-400">基础字段</div>
              <div className="grid grid-cols-2 gap-2">
                {BASIC_FIELDS.map((item) => (
                  <button
                    key={item.type}
                    id={`palette_${item.type}`}
                    type="button"
                    draggable
                    onClick={() => addByClick(item.type)}
                    onDragStart={(event) => {
                      dragRef.current = `add:${item.type}`;
                      event.dataTransfer.setData('text/plain', `add:${item.type}`);
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="h-8 cursor-grab rounded-md border border-slate-200 bg-white text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 active:cursor-grabbing"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] text-slate-400">布局组件</div>
              <div className="grid grid-cols-2 gap-2">
                {LAYOUT_FIELDS.map((item) => (
                  <button
                    key={item.type}
                    id={`palette_${item.type}`}
                    type="button"
                    draggable
                    onClick={() => addByClick(item.type)}
                    onDragStart={(event) => {
                      dragRef.current = `add:${item.type}`;
                      event.dataTransfer.setData('text/plain', `add:${item.type}`);
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    className="h-8 cursor-grab rounded-md border border-slate-200 bg-white text-xs text-slate-700 hover:border-blue-400 hover:text-blue-600 active:cursor-grabbing"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-col bg-[#eef3f8] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">页面画布 / 发起视图</span>
            <div className="flex items-center gap-2">
              <button
                id="btn_template_preview"
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50"
              >
                预览
              </button>
              <button
                id="btn_template_save"
                type="button"
                onClick={saveDraft}
                className="h-8 rounded-md bg-blue-600 px-3 text-sm text-white hover:bg-blue-700"
              >
                {saved ? '已保存' : '保存草稿'}
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[760px] rounded-lg border border-slate-200 bg-white px-6 py-5 shadow-sm">
              <input
                id="template_canvas_title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full bg-transparent text-base font-bold text-slate-900 outline-none"
              />
              <input
                id="template_canvas_desc"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 w-full bg-transparent text-xs text-slate-500 outline-none"
              />
              <div className="mt-4 flex flex-col gap-3">{renderNodes(nodes, 'root')}</div>
              <div
                className={`mt-4 rounded-md border border-dashed py-4 text-center text-xs ${overKey === 'root-drop' ? 'border-blue-400 bg-blue-50 text-blue-500' : 'border-slate-300 text-slate-400'}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (overKey !== 'root-drop') setOverKey('root-drop');
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const raw = event.dataTransfer.getData('text/plain') || dragRef.current;
                  if (raw.startsWith('add:')) {
                    const type = raw.slice(4);
                    if (isFieldType(type)) {
                      const target = ROOT_LAYOUT.has(type)
                        ? { container: 'root', index: nodes.length }
                        : appendTargetFor(type);
                      place(raw, target.container, target.index);
                    }
                  } else if (raw.startsWith('move:')) {
                    const target = appendTargetFor('text');
                    place(raw, target.container, target.index);
                  }
                  setOverKey(null);
                }}
              >
                拖拽字段或组件到这里继续添加
              </div>
            </div>
          </div>
        </section>

        <aside className="h-full overflow-y-auto border-l border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">字段属性</span>
            {selected && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                已选中
              </span>
            )}
          </div>

          {!selected && <p className="mt-6 text-sm text-slate-400">点击画布中的字段即可在这里调整属性。</p>}

          {selected && (
            <div className="mt-3">
              <input
                id="prop_label"
                value={selected.label}
                onChange={(event) => patchSelected({ label: event.target.value })}
                className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
              />

              <div className="mt-2 flex items-center justify-between py-2">
                <span className="text-sm text-slate-500">字段类型</span>
                <span className="text-sm text-slate-800">{TYPE_LABEL[selected.type]}</span>
              </div>

              {showsCode(selected.type) && (
                <label className="flex items-center justify-between gap-3 py-2">
                  <span className="shrink-0 text-sm text-slate-500">字段编码</span>
                  <input
                    id="prop_code"
                    value={selected.code}
                    onChange={(event) => patchSelected({ code: event.target.value })}
                    className="h-8 w-[148px] rounded-md border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:border-blue-400"
                  />
                </label>
              )}

              {showsPlaceholder(selected.type) && (
                <label className="flex items-center justify-between gap-3 py-2">
                  <span className="shrink-0 text-sm text-slate-500">提示文字</span>
                  <input
                    id="prop_placeholder"
                    value={selected.placeholder}
                    onChange={(event) => patchSelected({ placeholder: event.target.value })}
                    className="h-8 w-[148px] rounded-md border border-slate-200 px-2 text-sm text-slate-800 outline-none focus:border-blue-400"
                  />
                </label>
              )}

              {selected.type === 'note' && (
                <label className="mt-2 block">
                  <span className="mb-1.5 block text-sm text-slate-500">说明内容</span>
                  <textarea
                    id="prop_note"
                    value={selected.text}
                    onChange={(event) => patchSelected({ text: event.target.value })}
                    className="min-h-24 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-blue-400"
                  />
                </label>
              )}

              {selected.type === 'tabs' && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="mb-2 text-sm font-semibold text-slate-800">标签名称</div>
                  <div className="flex flex-col gap-2">
                    {(selected.tabs ?? []).map((tab, tabIndex) => (
                      <input
                        key={tab.id}
                        value={tab.label}
                        aria-label={`标签${tabIndex + 1}`}
                        onChange={(event) => {
                          const label = event.target.value;
                          patchSelected({
                            tabs: (selected.tabs ?? []).map((item) => (item.id === tab.id ? { ...item, label } : item)),
                          });
                        }}
                        className="h-8 rounded-md border border-slate-200 px-2 text-sm outline-none focus:border-blue-400"
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-2 text-xs text-blue-600"
                    onClick={() => {
                      const tabs = selected.tabs ?? [];
                      patchSelected({
                        tabs: [...tabs, { id: `tab_${Date.now()}`, label: `标签${tabs.length + 1}`, children: [] }],
                      });
                    }}
                  >
                    添加标签
                  </button>
                </div>
              )}

              {showsPermission(selected.type) && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="mb-1 text-sm font-semibold text-slate-800">校验与权限</div>
                  <Toggle label="是否必填" on={selected.required} onChange={(required) => patchSelected({ required })} />
                  <Toggle label="参与查询" on={selected.queryable} onChange={(queryable) => patchSelected({ queryable })} />
                  <Toggle label="允许导出" on={selected.exportable} onChange={(exportable) => patchSelected({ exportable })} />
                  <Toggle label="敏感字段" on={selected.sensitive} onChange={(sensitive) => patchSelected({ sensitive })} />
                </div>
              )}

              {(selected.type === 'text' || selected.type === 'textarea' || selected.type === 'number' || formats) && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="mb-1 text-sm font-semibold text-slate-800">校验规则</div>
                  {(selected.type === 'text' || selected.type === 'textarea' || selected.type === 'number') && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-500">长度限制</span>
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <input
                          id="prop_min"
                          value={selected.minLength}
                          onChange={(event) => patchSelected({ minLength: Number(event.target.value) || 0 })}
                          className="h-8 w-12 rounded-md border border-slate-200 text-center text-sm text-slate-800 outline-none focus:border-blue-400"
                        />
                        <span>-</span>
                        <input
                          id="prop_max"
                          value={selected.maxLength}
                          onChange={(event) => patchSelected({ maxLength: Number(event.target.value) || 0 })}
                          className="h-8 w-12 rounded-md border border-slate-200 text-center text-sm text-slate-800 outline-none focus:border-blue-400"
                        />
                      </span>
                    </div>
                  )}
                  {formats && (
                    <label className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-500">数据格式</span>
                      <select
                        id="prop_format"
                        value={selected.format}
                        onChange={(event) => patchSelected({ format: event.target.value })}
                        className="h-8 bg-transparent pr-1 text-sm text-slate-800 outline-none"
                      >
                        {formats.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              )}

              <button type="button" onClick={removeSelected} className="mt-6 text-xs text-slate-400 hover:text-red-500">
                从画布移除
              </button>
            </div>
          )}
        </aside>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            id="template_preview"
            className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{title || '未命名模板'}</h3>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="h-8 rounded-md border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
            <PreviewNodes nodes={nodes} />
          </div>
        </div>
      )}
    </div>
  );
};
