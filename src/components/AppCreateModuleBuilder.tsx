import React from 'react';
import { ArrowLeft, Check, ChevronRight, Layers } from 'lucide-react';
import {
  UNIFIED_CALL_MODULES,
  UnifiedCallModule,
  UnifiedKernel,
} from '../data/unifiedCallModules';
import { AppCreateWizardHeader } from './AppCreateWizardHeader';

const KERNEL_STYLE: Record<UnifiedKernel, { badge: string; dot: string }> = {
  业务核: { badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  组织核: { badge: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
  开通核: { badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
};

interface AppCreateModuleBuilderProps {
  selectedKeys: string[];
  onChange: (keys: string[]) => void;
  mode?: 'wizard' | 'detail';
  appName?: string;
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onBackToList?: () => void;
  onGoStep?: (step: 1 | 2 | 3 | 4) => void;
}

export const AppCreateModuleBuilder: React.FC<AppCreateModuleBuilderProps> = ({
  selectedKeys,
  onChange,
  mode = 'wizard',
  appName,
  onBack,
  onNext,
  onSave,
  onBackToList,
  onGoStep,
}) => {
  const toggle = (mod: UnifiedCallModule) => {
    const key = mod.menu as string;
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((item) => item !== key));
    } else {
      onChange([...selectedKeys, key]);
    }
  };

  const kernels: UnifiedKernel[] = ['业务核', '组织核', '开通核'];

  const list = (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-900">调用模块</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            勾选后将作为本应用的页面模块。已选 {selectedKeys.length} / {UNIFIED_CALL_MODULES.length} 个
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(UNIFIED_CALL_MODULES.map((item) => item.menu as string))}
            className="px-2.5 py-1 text-[11px] font-bold text-[#1e376b] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            全选
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            清空
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {kernels.map((kernel) => {
          const group = UNIFIED_CALL_MODULES.filter((item) => item.kernel === kernel);
          const style = KERNEL_STYLE[kernel];
          return (
            <div key={kernel}>
              {group.map((mod) => {
                const key = mod.menu as string;
                const selected = selectedKeys.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggle(mod)}
                    id={`module_pick_${key}`}
                    className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      selected ? 'bg-blue-50/70' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-[#1e376b] border-[#1e376b] text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{mod.title}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${style.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {mod.kernel}
                        </span>
                      </span>
                      <span className="block text-xs text-slate-500 mt-0.5">{mod.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (mode === 'detail') {
    return (
      <div className="flex flex-col gap-4">
        {list}
        {onSave && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              id="btn_save_page_modules"
              className="px-5 py-2.5 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg cursor-pointer font-bold text-xs shadow-sm"
            >
              保存页面模块
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800">
      <div className="w-full flex flex-col gap-5">
        <AppCreateWizardHeader currentStep={2} onBackToList={onBackToList || (() => {})} onGoStep={onGoStep} />

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e376b] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900">为「{appName || '新应用'}」搭建页面</h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              从统一调用组件中勾选本应用需要的页面模块。后续仍可在应用详情里二次增删。
            </p>
          </div>
        </div>

        {list}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一步：基本信息</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={selectedKeys.length === 0}
            id="btn_wizard_to_clients"
            className="px-6 py-2.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          >
            <span>下一步：配置接入端</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
