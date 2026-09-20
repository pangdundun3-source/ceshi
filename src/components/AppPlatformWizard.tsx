import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { AppCreateWizardHeader, AppCreateWizardStep } from './AppCreateWizardHeader';
import { UNIFIED_CALL_MODULES } from '../data/unifiedCallModules';
import {
  AccessEndpoint,
  AppInstance,
  BusinessProduct,
  DomainRecord,
  ENDPOINT_KINDS,
  EndpointKind,
  buildPrivateModules,
} from '../data/appPlatform';

const STEPS: Array<{ step: AppCreateWizardStep; label: string }> = [
  { step: 1, label: '定义产品' },
  { step: 2, label: '创建实例' },
  { step: 3, label: '配置访问端与域名' },
  { step: 4, label: '发布' },
];

interface AppPlatformWizardProps {
  onCancel: () => void;
  onFinish: (payload: {
    product: BusinessProduct;
    instance: AppInstance;
    endpoints: AccessEndpoint[];
    domains: DomainRecord[];
  }) => void;
}

export const AppPlatformWizard: React.FC<AppPlatformWizardProps> = ({ onCancel, onFinish }) => {
  const [step, setStep] = useState<AppCreateWizardStep>(1);
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productType, setProductType] = useState<BusinessProduct['type']>('业务应用');
  const [version, setVersion] = useState('V1.0');
  const [description, setDescription] = useState('');
  const [modules, setModules] = useState<string[]>(UNIFIED_CALL_MODULES.map((item) => item.menu as string));
  const [instanceName, setInstanceName] = useState('');
  const [deployMode, setDeployMode] = useState<AppInstance['deployMode']>('SaaS');
  const [orgScope, setOrgScope] = useState('指定客户机构');
  const [selectedKinds, setSelectedKinds] = useState<EndpointKind[]>(['admin_web', 'user_web']);
  const [hosts, setHosts] = useState<Partial<Record<EndpointKind, string>>>({
    admin_web: '',
    user_web: '',
    h5: '',
    pad: '',
    intranet: '',
    wechat: '',
  });

  const codeSlug = productCode.trim().toLowerCase() || 'app';

  const toggleKind = (kind: EndpointKind) => {
    setSelectedKinds((prev) => (
      prev.includes(kind) ? prev.filter((item) => item !== kind) : [...prev, kind]
    ));
  };

  const toggleModule = (key: string) => {
    setModules((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(productName.trim() && productCode.trim() && modules.length);
    if (step === 2) return Boolean(instanceName.trim());
    if (step === 3) {
      return selectedKinds.length > 0 && selectedKinds.every((kind) => (hosts[kind] || '').trim());
    }
    return true;
  }, [step, productName, productCode, modules.length, instanceName, selectedKinds, hosts]);

  const buildPayload = (status: AppInstance['status']) => {
    const productId = `prod-${Date.now()}`;
    const instanceId = `ins-${Date.now()}`;
    const product: BusinessProduct = {
      id: productId,
      name: productName.trim(),
      code: productCode.trim().toUpperCase(),
      type: productType,
      version: version.trim() || 'V1.0',
      description: description.trim(),
      iconBg: 'from-sky-700 via-blue-800 to-slate-900',
      modules,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const instance: AppInstance = {
      id: instanceId,
      productId,
      name: instanceName.trim(),
      deployMode,
      status,
      orgScope: orgScope.trim() || '指定客户机构',
      isolation: deployMode === '专网' ? '物理专网' : '租户库隔离',
      createdAt: new Date().toISOString().slice(0, 10),
      privateModules: buildPrivateModules(modules, version.trim() || 'V1.0'),
    };
    const stamp = Date.now();
    const endpoints: AccessEndpoint[] = selectedKinds.map((kind, index) => {
      const def = ENDPOINT_KINDS.find((item) => item.key === kind)!;
      const domainId = `dom-${kind}-${stamp}-${index}`;
      return {
        id: `ep-${kind}-${stamp}-${index}`,
        instanceId,
        name: def.name,
        kind,
        homePage: kind === 'admin_web' ? '管理首页' : '工作台',
        menuProfile: `${def.name}菜单`,
        permissionProfile: kind === 'admin_web' ? '管理员' : '业务用户',
        modules,
        domainId,
      };
    });
    const domainList: DomainRecord[] = endpoints.map((ep) => ({
      id: ep.domainId!,
      host: (hosts[ep.kind] || '').trim(),
      kind: ep.kind === 'intranet' ? 'intranet' : 'sub',
      ssl: ep.kind === 'intranet' ? 'none' : 'normal',
      status: 'bound',
      endpointId: ep.id,
      instanceId,
    }));
    return { product, instance, endpoints, domains: domainList };
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800">
      <div className="w-full flex flex-col gap-5">
        <AppCreateWizardHeader
          currentStep={step}
          onBackToList={onCancel}
          onGoStep={setStep}
          backLabel="返回产品管理"
          badge="开通一套业务系统"
          steps={STEPS}
        />

        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
            <h1 className="text-base font-black text-slate-900">定义产品能力</h1>
            <p className="text-xs text-slate-500 -mt-2">这里只说明产品是什么，不绑定客户和域名。</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                产品名称 *
                <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="例如：信息通报" className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium" />
              </label>
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                产品编码 *
                <input value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="例如：TB" className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium uppercase" />
              </label>
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                产品类型
                <select value={productType} onChange={(e) => setProductType(e.target.value as BusinessProduct['type'])} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
                  <option value="业务应用">业务应用</option>
                  <option value="基础服务">基础服务</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                版本
                <input value={version} onChange={(e) => setVersion(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium" />
              </label>
            </div>
            <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
              产品说明
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="这个产品解决什么业务问题" className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium" />
            </label>
            <div>
              <div className="text-xs font-bold text-slate-800 mb-2">产品模块（后续实例/访问端只能从这里勾选）</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {UNIFIED_CALL_MODULES.map((mod) => {
                  const key = mod.menu as string;
                  const selected = modules.includes(key);
                  return (
                    <button key={key} type="button" onClick={() => toggleModule(key)} className={`text-left px-3 py-2.5 rounded-lg border text-xs cursor-pointer ${selected ? 'border-[#1e376b] bg-blue-50' : 'border-slate-200 bg-white'}`}>
                      <span className="font-bold text-slate-800">{mod.title}</span>
                      <span className="block text-slate-400 mt-0.5">{mod.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
            <h1 className="text-base font-black text-slate-900">为「{productName || '新产品'}」创建实例</h1>
            <p className="text-xs text-slate-500 -mt-2">同一产品可以给不同客户各开一个实例，例如全国版、北京市版、公安版。</p>
            <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
              实例名称 *
              <input value={instanceName} onChange={(e) => setInstanceName(e.target.value)} placeholder={`例如：北京市${productName || '信息通报'}系统`} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                部署方式
                <select value={deployMode} onChange={(e) => setDeployMode(e.target.value as AppInstance['deployMode'])} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm">
                  <option value="SaaS">SaaS</option>
                  <option value="专有云">专有云</option>
                  <option value="专网">专网</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                机构范围
                <input value={orgScope} onChange={(e) => setOrgScope(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium" />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
            <h1 className="text-base font-black text-slate-900">配置访问端并绑定域名</h1>
            <p className="text-xs text-slate-500 -mt-2">域名不直接挂在产品上，而是绑定到某个访问端。打开域名后识别：端 → 实例 → 菜单。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ENDPOINT_KINDS.map((kind) => {
                const selected = selectedKinds.includes(kind.key);
                const placeholder = kind.key === 'intranet' ? '10.10.10.20' : `${kind.key === 'admin_web' ? 'admin' : kind.key === 'user_web' ? 'user' : kind.key}.${codeSlug}.com`;
                return (
                  <div key={kind.key} className={`rounded-xl border p-4 ${selected ? 'border-[#1e376b] bg-blue-50/50' : 'border-slate-200'}`}>
                    <button type="button" onClick={() => toggleKind(kind.key)} className="w-full text-left cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">{kind.name}</span>
                        <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${selected ? 'bg-[#1e376b] border-[#1e376b] text-white' : 'border-slate-300 text-transparent'}`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{kind.description}</p>
                    </button>
                    {selected && (
                      <input
                        value={hosts[kind.key] || ''}
                        onChange={(e) => setHosts((prev) => ({ ...prev, [kind.key]: e.target.value }))}
                        placeholder={placeholder}
                        className="mt-3 w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
            <h1 className="text-base font-black text-slate-900">确认并发布实例</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-[11px] text-slate-400">产品</div>
                <div className="font-bold mt-1">{productName} / {productCode.toUpperCase()}</div>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-[11px] text-slate-400">实例</div>
                <div className="font-bold mt-1">{instanceName}</div>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                <div className="text-[11px] text-slate-400">部署</div>
                <div className="font-bold mt-1">{deployMode} · {orgScope}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {selectedKinds.map((kind) => {
                const def = ENDPOINT_KINDS.find((item) => item.key === kind);
                return (
                  <div key={kind} className="rounded-lg border border-slate-200 px-4 py-3 text-xs">
                    <span className="font-black text-slate-800">{def?.name}</span>
                    <span className="ml-2 font-mono text-slate-500">{hosts[kind]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => (step === 1 ? onCancel() : setStep((step - 1) as AppCreateWizardStep))}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {step === 1 ? '取消' : '上一步'}
          </button>
          {step < 4 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((step + 1) as AppCreateWizardStep)}
              className="px-6 py-2.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onFinish(buildPayload('running'))}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
            >
              发布并进入控制台
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
