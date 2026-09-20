import React from 'react';
import { ArrowLeft, CheckCircle2, Layers, Monitor, Send } from 'lucide-react';
import { UNIFIED_CALL_MODULES } from '../data/unifiedCallModules';
import {
  AppClientModules,
  enabledClientKeys,
  getAppClientByKey,
} from '../data/appClients';
import { AppCreateWizardHeader, AppCreateWizardStep } from './AppCreateWizardHeader';

interface AppCreatePublishStepProps {
  appName: string;
  appCode: string;
  appShortName?: string;
  selectedKeys: string[];
  clientConfigs?: AppClientModules;
  onBack: () => void;
  onPublish: () => void;
  onBackToList: () => void;
  onGoStep?: (step: AppCreateWizardStep) => void;
}

export const AppCreatePublishStep: React.FC<AppCreatePublishStepProps> = ({
  appName,
  appCode,
  appShortName,
  selectedKeys,
  clientConfigs,
  onBack,
  onPublish,
  onBackToList,
  onGoStep,
}) => {
  const selectedModules = UNIFIED_CALL_MODULES.filter((item) =>
    selectedKeys.includes(item.menu as string)
  );
  const clients = enabledClientKeys(clientConfigs);

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800">
      <div className="w-full flex flex-col gap-5">
        <AppCreateWizardHeader currentStep={4} onBackToList={onBackToList} onGoStep={onGoStep} />

        <div className="bg-white rounded-xl border border-slate-200/90 p-6 flex flex-col gap-5">
          <div>
            <h1 className="text-base font-black text-slate-900">确认并发布应用</h1>
            <p className="text-xs text-slate-500 mt-1">
              发布后可在应用详情页继续二次编辑页面模块与各端配置。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] text-slate-400 font-medium">应用全称</div>
              <div className="text-sm font-bold text-slate-800 mt-1">{appName}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] text-slate-400 font-medium">应用编码</div>
              <div className="text-sm font-bold text-slate-800 mt-1 font-mono">{appCode}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] text-slate-400 font-medium">应用简称</div>
              <div className="text-sm font-bold text-slate-800 mt-1">{appShortName || '—'}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-[#1e376b]" />
              <span className="text-sm font-bold text-slate-900">已搭建页面模块（{selectedModules.length}）</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedModules.map((mod) => (
                <span
                  key={mod.menu}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {mod.title}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-[#1e376b]" />
              <span className="text-sm font-bold text-slate-900">接入端（{clients.length}）</span>
            </div>
            <div className="flex flex-col gap-2">
              {clients.length === 0 ? (
                <span className="text-xs text-slate-400">尚未选择接入端</span>
              ) : (
                clients.map((key) => {
                  const client = getAppClientByKey(key);
                  const mods = UNIFIED_CALL_MODULES.filter((item) =>
                    (clientConfigs?.[key] || []).includes(item.menu as string)
                  );
                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3"
                    >
                      <div className="text-xs font-black text-slate-800">
                        {client?.name || key}
                        <span className="ml-2 font-medium text-slate-500">{mods.length} 个模块</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {mods.map((mod) => (
                          <span
                            key={mod.menu}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-bold text-slate-600"
                          >
                            {mod.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一步：接入端</span>
          </button>
          <button
            type="button"
            onClick={onPublish}
            id="btn_wizard_publish_app"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>发布应用</span>
          </button>
        </div>
      </div>
    </div>
  );
};
