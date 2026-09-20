import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Monitor,
  Smartphone,
  Server,
  MessageCircle,
} from 'lucide-react';
import {
  APP_CLIENTS,
  AppClientKey,
  AppClientModules,
  enabledClientKeys,
  pruneClientModules,
} from '../data/appClients';
import {
  UNIFIED_CALL_MODULES,
  UnifiedCallModule,
  UnifiedKernel,
} from '../data/unifiedCallModules';
import { AppCreateWizardHeader, AppCreateWizardStep } from './AppCreateWizardHeader';

const CLIENT_ICON: Record<AppClientKey, React.ElementType> = {
  v8_web: Monitor,
  v8_mobile: Smartphone,
  mt_admin: Server,
  wechat: MessageCircle,
};

const KERNEL_STYLE: Record<UnifiedKernel, { badge: string; dot: string }> = {
  业务核: { badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  组织核: { badge: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
  开通核: { badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
};

interface AppCreateClientModulesStepProps {
  appName?: string;
  availableModules: string[];
  clientConfigs: AppClientModules;
  onChange: (configs: AppClientModules) => void;
  mode?: 'wizard' | 'detail';
  onBack?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onBackToList?: () => void;
  onGoStep?: (step: AppCreateWizardStep) => void;
}

export const AppCreateClientModulesStep: React.FC<AppCreateClientModulesStepProps> = ({
  appName,
  availableModules,
  clientConfigs,
  onChange,
  mode = 'wizard',
  onBack,
  onNext,
  onSave,
  onBackToList,
  onGoStep,
}) => {
  const selectedClients = enabledClientKeys(clientConfigs);
  const [activeClient, setActiveClient] = useState<AppClientKey>(
    selectedClients[0] || 'v8_web'
  );

  const currentClient: AppClientKey = selectedClients.includes(activeClient)
    ? activeClient
    : selectedClients[0] || 'v8_web';

  const availableList = useMemo(
    () => UNIFIED_CALL_MODULES.filter((item) => availableModules.includes(item.menu as string)),
    [availableModules]
  );

  const currentModules = clientConfigs[currentClient] || [];
  const canProceed = selectedClients.length > 0
    && selectedClients.every((key) => (clientConfigs[key] || []).length > 0);

  const toggleClient = (key: AppClientKey) => {
    const next: AppClientModules = { ...clientConfigs };
    if (Array.isArray(next[key])) {
      delete next[key];
      const remain = enabledClientKeys(next);
      if (remain.length > 0) setActiveClient(remain[0]);
    } else {
      next[key] = [...availableModules];
      setActiveClient(key);
    }
    onChange(pruneClientModules(next, availableModules));
  };

  const toggleModule = (mod: UnifiedCallModule) => {
    if (!Array.isArray(clientConfigs[currentClient])) return;
    const key = mod.menu as string;
    const current = clientConfigs[currentClient] || [];
    const nextMods = current.includes(key)
      ? current.filter((item) => item !== key)
      : [...current, key];
    onChange({
      ...clientConfigs,
      [currentClient]: nextMods,
    });
  };

  const setClientModules = (keys: string[]) => {
    if (!Array.isArray(clientConfigs[currentClient])) return;
    onChange({
      ...clientConfigs,
      [currentClient]: keys.filter((item) => availableModules.includes(item)),
    });
  };

  const clientPicker = (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {APP_CLIENTS.map((client) => {
        const Icon = CLIENT_ICON[client.key];
        const selected = Array.isArray(clientConfigs[client.key]);
        const count = clientConfigs[client.key]?.length || 0;
        return (
          <button
            key={client.key}
            type="button"
            id={`client_pick_${client.key}`}
            onClick={() => toggleClient(client.key)}
            className={`text-left rounded-xl border px-4 py-3.5 transition-all cursor-pointer ${
              selected
                ? 'border-[#1e376b] bg-blue-50/70 shadow-[0_0_0_1px_rgba(30,55,107,0.12)]'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selected ? 'bg-[#1e376b] text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  selected
                    ? 'bg-[#1e376b] border-[#1e376b] text-white'
                    : 'border-slate-300 bg-white text-transparent'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <div className="mt-3 text-sm font-black text-slate-900">{client.name}</div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{client.description}</p>
            {selected ? (
              <div className="mt-2 text-[11px] font-bold text-[#1e376b]">已选 {count} 个模块</div>
            ) : (
              <div className="mt-2 text-[11px] text-slate-400">未接入</div>
            )}
          </button>
        );
      })}
    </div>
  );

  const modulePanel = selectedClients.length === 0 ? (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center text-xs text-slate-500">
      请先勾选至少一个接入端，再为该端勾选页面模块。
    </div>
  ) : (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden">
      <div className="px-3 pt-3 border-b border-slate-100 bg-slate-50/60 flex items-center gap-1 overflow-x-auto">
        {selectedClients.map((key) => {
          const client = APP_CLIENTS.find((item) => item.key === key);
          const active = currentClient === key;
          const count = clientConfigs[key]?.length || 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveClient(key)}
              className={`px-3 py-2 rounded-t-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-white text-[#1e376b] border border-slate-200 border-b-white -mb-px'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {client?.name}
              <span className={`ml-1.5 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          仅显示{mode === 'wizard' ? '第 2 步' : '本应用'}已搭建的模块。当前端已选 {currentModules.length} / {availableList.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setClientModules(availableModules)}
            className="px-2.5 py-1 text-[11px] font-bold text-[#1e376b] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            全选
          </button>
          <button
            type="button"
            onClick={() => setClientModules([])}
            className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            清空
          </button>
        </div>
      </div>

      {availableList.length === 0 ? (
        <div className="px-5 py-8 text-center text-xs text-slate-500">请先在上一步勾选页面模块。</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {availableList.map((mod) => {
            const key = mod.menu as string;
            const selected = currentModules.includes(key);
            const style = KERNEL_STYLE[mod.kernel];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleModule(mod)}
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
      )}
    </div>
  );

  if (mode === 'detail') {
    return (
      <div className="flex flex-col gap-4">
        {clientPicker}
        {modulePanel}
        {onSave && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={!canProceed}
              className="px-5 py-2.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer font-bold text-xs shadow-sm"
            >
              保存接入端配置
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800">
      <div className="w-full flex flex-col gap-5">
        <AppCreateWizardHeader currentStep={3} onBackToList={onBackToList || (() => {})} onGoStep={onGoStep} />

        <div className="bg-white rounded-xl border border-slate-200/90 p-5">
          <h1 className="text-base font-black text-slate-900">
            为「{appName || '新应用'}」选择接入端
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            先勾选要开放的端，再按端勾选该端可见的页面模块。各端模块必须来自第 2 步已搭建的模块。
          </p>
        </div>

        {clientPicker}
        {modulePanel}

        {!canProceed && selectedClients.length > 0 && (
          <p className="text-[11px] text-rose-500 font-bold">每个已选接入端至少勾选 1 个模块。</p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一步：调用模块</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            id="btn_wizard_to_publish"
            className="px-6 py-2.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer font-bold text-xs shadow-sm flex items-center justify-center gap-2"
          >
            <span>下一步：发布</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
