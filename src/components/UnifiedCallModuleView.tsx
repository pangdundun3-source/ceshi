import React from 'react';
import { Boxes, Layers, Users, KeyRound } from 'lucide-react';
import { UnifiedCallModule, UnifiedKernel } from '../data/unifiedCallModules';
import { MenuItem } from '../types';
import { TemplateDesigner } from './TemplateDesigner';
import { FlowDesigner } from './FlowDesigner';

interface UnifiedCallModuleViewProps {
  module: UnifiedCallModule;
}

const kernelStyle: Record<UnifiedKernel, { badge: string; dot: string; panel: string }> = {
  业务核: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    panel: 'from-blue-50 to-white border-blue-100',
  },
  组织核: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
    panel: 'from-teal-50 to-white border-teal-100',
  },
  开通核: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    panel: 'from-orange-50 to-white border-orange-100',
  },
};

const kernelIcon: Record<UnifiedKernel, React.ReactNode> = {
  业务核: <Layers className="w-6 h-6" />,
  组织核: <Users className="w-6 h-6" />,
  开通核: <KeyRound className="w-6 h-6" />,
};

export const UnifiedCallModuleView: React.FC<UnifiedCallModuleViewProps> = ({ module }) => {
  const style = kernelStyle[module.kernel];
  const isTemplateConfig = module.menu === MenuItem.UnifiedTemplateConfig;
  const isFlowConfig = module.menu === MenuItem.UnifiedInstructionFlow;
  const hasDesigner = isTemplateConfig || isFlowConfig;

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id={`unified_call_module_${module.menu}`}
    >
      <div className="w-full flex flex-col gap-5">
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_call_module_header_bar"
        >
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">统一组件库管理</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">{module.title}</span>
            </nav>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                {module.title}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold select-none ${style.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {module.kernel}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4">
          <div className={`bg-gradient-to-br ${style.panel} rounded-xl border p-8 shadow-2xs flex flex-col gap-6 ${hasDesigner ? '' : 'min-h-[420px]'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#1e376b] flex items-center justify-center shadow-sm shrink-0">
                {kernelIcon[module.kernel]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[#1e376b]" />
                  <span className="text-sm font-bold text-slate-900">
                    {isTemplateConfig ? '模板设计器 · V2.1' : isFlowConfig ? '流程设计器 · V3.0' : '统一调用组件'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{module.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
                <div className="text-[11px] text-slate-400 font-medium">模块名称</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{module.title}</div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
                <div className="text-[11px] text-slate-400 font-medium">所属内核</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{module.kernel}</div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 px-4 py-3">
                <div className="text-[11px] text-slate-400 font-medium">调用方式</div>
                <div className="text-sm font-bold text-slate-800 mt-1">各应用统一接入</div>
              </div>
            </div>
          </div>
          {isTemplateConfig && <TemplateDesigner />}
          {isFlowConfig && <FlowDesigner />}
        </div>
      </div>
    </div>
  );
};
