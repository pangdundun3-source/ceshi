import React, { useMemo, useState } from 'react';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Power,
  Play,
  ArrowLeft,
  FileCode,
  GitBranch,
  X,
} from 'lucide-react';
import { TemplateDesigner } from './TemplateDesigner';
import { FlowDesigner } from './FlowDesigner';
import { FlowSimulateModal } from './FlowSimulateModal';

export type BizAssetKind = 'template' | 'flow';

interface BizAsset {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  updatedAt: string;
}

const TEMPLATE_SEED: BizAsset[] = [
  {
    id: 'tpl_1',
    name: '专项材料上报模板',
    description: '请按要求填写专项材料，并上传相关佐证文件。',
    version: 'V2.1',
    enabled: true,
    updatedAt: '2026-09-20 14:20',
  },
  {
    id: 'tpl_2',
    name: '隐患排查清单模板',
    description: '用于下级单位按周期上报隐患排查结果与整改情况。',
    version: 'V1.3',
    enabled: true,
    updatedAt: '2026-09-18 09:40',
  },
  {
    id: 'tpl_3',
    name: '应急演练反馈模板',
    description: '演练结束后收集参与单位反馈与问题清单。',
    version: 'V1.0',
    enabled: false,
    updatedAt: '2026-09-12 16:05',
  },
];

const FLOW_SEED: BizAsset[] = [
  {
    id: 'flow_1',
    name: '单向上报审核流程',
    description: '流程引用模板视图，不重复创建字段；覆盖发起、审核与归档闭环。',
    version: 'V3.0',
    enabled: true,
    updatedAt: '2026-09-21 11:10',
  },
  {
    id: 'flow_2',
    name: '多级会签下发流程',
    description: '支持下发、签收、会签与退回，适配跨层级协同办理。',
    version: 'V2.4',
    enabled: true,
    updatedAt: '2026-09-19 15:32',
  },
  {
    id: 'flow_3',
    name: '快速抄送知会流程',
    description: '轻量级抄送流转，适用于知会型任务与信息同步。',
    version: 'V1.2',
    enabled: false,
    updatedAt: '2026-09-10 08:55',
  },
];

interface ProductBizAssetPanelProps {
  kind: BizAssetKind;
}

type ViewMode = 'list' | 'edit';

export const ProductBizAssetPanel: React.FC<ProductBizAssetPanelProps> = ({ kind }) => {
  const [assets, setAssets] = useState<BizAsset[]>(kind === 'template' ? TEMPLATE_SEED : FLOW_SEED);
  const [view, setView] = useState<ViewMode>('list');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [simulateId, setSimulateId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');

  const label = kind === 'template' ? '模板' : '流程';
  const Icon = kind === 'template' ? FileCode : GitBranch;
  const active = useMemo(() => assets.find((item) => item.id === activeId) ?? null, [assets, activeId]);
  const preview = useMemo(() => assets.find((item) => item.id === previewId) ?? null, [assets, previewId]);
  const simulate = useMemo(() => assets.find((item) => item.id === simulateId) ?? null, [assets, simulateId]);

  const openCreate = () => {
    setCreating(true);
    setDraftName('');
    setDraftDesc('');
  };

  const saveCreate = () => {
    if (!draftName.trim()) return;
    const item: BizAsset = {
      id: `${kind}_${Date.now()}`,
      name: draftName.trim(),
      description: draftDesc.trim() || `新建${label}，可继续完善配置。`,
      version: kind === 'template' ? 'V1.0' : 'V1.0',
      enabled: true,
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    };
    setAssets((prev) => [item, ...prev]);
    setCreating(false);
    setActiveId(item.id);
    setView('edit');
  };

  const toggleEnabled = (id: string) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
  };

  const removeAsset = (id: string) => {
    const target = assets.find((item) => item.id === id);
    if (!target) return;
    if (!window.confirm(`确定删除${label}「${target.name}」吗？此操作不可恢复。`)) return;
    setAssets((prev) => prev.filter((item) => item.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setView('list');
    }
  };

  if (view === 'edit' && active) {
    return (
      <div className="flex flex-col gap-3" id={`product_${kind}_editor`}>
        <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">
              编辑{label} · {active.name}
              <span className="ml-2 text-xs font-normal text-slate-400">{active.version}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{active.description}</p>
          </div>
          <button
            type="button"
            onClick={() => setView('list')}
            className="shrink-0 h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回列表
          </button>
        </div>
        {kind === 'template' ? <TemplateDesigner /> : <FlowDesigner />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" id={`product_${kind}_list`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{label}列表</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {kind === 'template'
              ? '管理上报/下发表单模板，支持预览、编辑、启禁与删除'
              : '管理业务流转流程，支持预览、编辑、模拟、启禁与删除'}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="h-9 px-3 rounded-lg bg-[#1e376b] hover:bg-[#14264c] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          新增{label}
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-xl border border-dashed border-blue-300 bg-blue-50/30 p-4 shadow-sm">
          <div className="text-xs font-bold text-slate-800 mb-3">新增{label}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">{label}名称</span>
              <input
                autoFocus
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                placeholder={`请输入${label}名称`}
                className="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">{label}描述</span>
              <input
                value={draftDesc}
                onChange={(event) => setDraftDesc(event.target.value)}
                placeholder={`请输入${label}描述（可选）`}
                className="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="h-8 px-3 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-white"
            >
              取消
            </button>
            <button
              type="button"
              onClick={saveCreate}
              className="h-8 px-3 rounded-lg bg-[#1e376b] text-white text-xs font-bold hover:bg-[#14264c]"
            >
              创建并编辑
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {assets.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-3 ${
              item.enabled ? 'border-slate-200' : 'border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-[#1e376b] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                      item.enabled
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {item.enabled ? '已启用' : '已停用'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">更新于 {item.updatedAt}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewId(item.id)}
                className="h-8 px-2.5 rounded-md border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                预览
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveId(item.id);
                  setView('edit');
                }}
                className="h-8 px-2.5 rounded-md border border-blue-200 bg-blue-50 text-[11px] text-[#1e376b] hover:bg-blue-100 inline-flex items-center gap-1 font-bold"
              >
                <Pencil className="w-3.5 h-3.5" />
                编辑
              </button>
              {kind === 'flow' && (
                <button
                  type="button"
                  onClick={() => setSimulateId(item.id)}
                  className="h-8 px-2.5 rounded-md border border-amber-200 bg-amber-50 text-[11px] text-amber-700 hover:bg-amber-100 inline-flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  模拟
                </button>
              )}
              <button
                type="button"
                onClick={() => toggleEnabled(item.id)}
                className="h-8 px-2.5 rounded-md border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
              >
                <Power className="w-3.5 h-3.5" />
                {item.enabled ? '停用' : '启用'}
              </button>
              <button
                type="button"
                onClick={() => removeAsset(item.id)}
                className="h-8 px-2.5 rounded-md border border-rose-200 text-[11px] text-rose-600 hover:bg-rose-50 inline-flex items-center gap-1 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {assets.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 py-16 text-center text-xs text-slate-400">
          暂无{label}，点击右上角「新增{label}」开始创建
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-6" onClick={() => setPreviewId(null)}>
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  预览{label} · {preview.name}
                </div>
                <p className="text-xs text-slate-500 mt-1">{preview.version}</p>
              </div>
              <button type="button" onClick={() => setPreviewId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <p className="text-slate-600 leading-relaxed">{preview.description}</p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
                {kind === 'template' ? '表单预览占位（按模板字段渲染）' : '流程预览占位（按节点链路渲染）'}
              </div>
              <div className="text-[11px] text-slate-400">更新于 {preview.updatedAt}</div>
            </div>
          </div>
        </div>
      )}

      {simulate && (
        <FlowSimulateModal
          flowName={simulate.name}
          flowDescription={simulate.description}
          onClose={() => setSimulateId(null)}
        />
      )}
    </div>
  );
};
