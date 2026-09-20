import React from 'react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export type AppCreateWizardStep = 1 | 2 | 3 | 4;

interface AppCreateWizardHeaderProps {
  currentStep: AppCreateWizardStep;
  onBackToList: () => void;
  onGoStep?: (step: AppCreateWizardStep) => void;
}

const STEPS: Array<{ step: AppCreateWizardStep; label: string }> = [
  { step: 1, label: '填写基本信息' },
  { step: 2, label: '配调用模块搭页面' },
  { step: 3, label: '选接入端配模块' },
  { step: 4, label: '发布应用' },
];

export const AppCreateWizardHeader: React.FC<AppCreateWizardHeaderProps> = ({
  currentStep,
  onBackToList,
  onGoStep,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onBackToList}
          className="flex items-center gap-1.5 text-slate-600 hover:text-[#1e376b] px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group font-bold text-xs"
          id="btn_wizard_back_to_app_list"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>返回应用列表</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-black text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200/60">
          新增应用接入
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs flex-wrap">
        {STEPS.map((item, index) => {
          const done = currentStep > item.step;
          const active = currentStep === item.step;
          const clickable = Boolean(onGoStep && item.step < currentStep);
          return (
            <React.Fragment key={item.step}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
              <button
                type="button"
                onClick={() => clickable && onGoStep?.(item.step)}
                disabled={!clickable}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  active
                    ? 'bg-[#1e376b] text-white shadow-xs'
                    : done
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 border border-slate-200/60'
                } ${clickable ? 'hover:brightness-95' : ''}`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    active
                      ? 'bg-white text-[#1e376b]'
                      : done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? <Check className="w-3 h-3 stroke-[3]" /> : item.step}
                </span>
                <span>第 {item.step} 步：{item.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
