import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { SysMenuItem } from './MenuManage';
import { AppPlatformWizard } from './AppPlatformWizard';
import { AppConsole } from './AppConsole';
import {
  INITIAL_DOMAINS,
  INITIAL_ENDPOINTS,
  INITIAL_INSTANCES,
  INITIAL_PRODUCTS,
} from '../data/appPlatform';

interface AppPlatformProps {
  sharedMenus?: SysMenuItem[];
  onSharedMenusChange?: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
}

export const AppPlatform: React.FC<AppPlatformProps> = ({
  sharedMenus,
  onSharedMenusChange,
}) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [instances, setInstances] = useState(INITIAL_INSTANCES);
  const [endpoints, setEndpoints] = useState(INITIAL_ENDPOINTS);
  const [domains, setDomains] = useState(INITIAL_DOMAINS);
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'list' | 'wizard' | 'console'>('list');
  const [consoleId, setConsoleId] = useState<string | null>(null);

  const consoleInstance = instances.find((item) => item.id === consoleId);
  const consoleProduct = products.find((item) => item.id === consoleInstance?.productId);

  const openConsole = (instanceId: string) => {
    setConsoleId(instanceId);
    setMode('console');
  };

  const filteredProducts = products.filter((item) =>
    `${item.name}${item.code}${item.description}`.includes(keyword)
  );

  if (mode === 'wizard') {
    return (
      <AppPlatformWizard
        onCancel={() => setMode('list')}
        onFinish={({ product, instance, endpoints: eps, domains: doms }) => {
          setProducts((prev) => [product, ...prev]);
          setInstances((prev) => [instance, ...prev]);
          setEndpoints((prev) => [...eps, ...prev]);
          setDomains((prev) => [...doms, ...prev]);
          setConsoleId(instance.id);
          setMode('console');
        }}
      />
    );
  }

  if (mode === 'console' && consoleInstance && consoleProduct) {
    const instanceEps = endpoints.filter((item) => item.instanceId === consoleInstance.id);
    return (
      <AppConsole
        product={consoleProduct}
        instance={consoleInstance}
        endpoints={instanceEps}
        domains={domains}
        sharedMenus={sharedMenus}
        onSharedMenusChange={onSharedMenusChange}
        onBack={() => {
          setMode('list');
          setConsoleId(null);
        }}
        onChangeInstance={(next) => setInstances((prev) => prev.map((item) => item.id === next.id ? next : item))}
        onChangeEndpoints={(next) => {
          const others = endpoints.filter((item) => item.instanceId !== consoleInstance.id);
          setEndpoints([...next, ...others]);
        }}
        onChangeDomains={setDomains}
      />
    );
  }

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] text-slate-800">
      <div className="bg-white px-6 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>V8应用集成管理中心</span>
            <span>/</span>
            <span className="text-slate-600 font-medium">应用管理 / 产品管理</span>
          </nav>
          <h1 className="text-lg font-black text-slate-900 mt-1">产品管理</h1>
        </div>
        <button
          type="button"
          id="btn_open_platform_wizard"
          onClick={() => setMode('wizard')}
          className="px-4 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          开通业务系统
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索名称 / 编码"
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredProducts.map((product) => {
            const ins = instances.filter((item) => item.productId === product.id);
            const preferred = [...ins].sort((a, b) => (
              endpoints.filter((ep) => ep.instanceId === b.id).length
              - endpoints.filter((ep) => ep.instanceId === a.id).length
            ))[0];
            return (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.iconBg} text-white flex items-center justify-center font-black text-xs`}>
                    {product.code}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{product.version}</span>
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{product.name}</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>{product.type}</span>
                  <span>{ins.length} 个实例</span>
                  <span>{product.modules.length} 个模块</span>
                </div>
                <button
                  type="button"
                  onClick={() => preferred && openConsole(preferred.id)}
                  className="mt-auto px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-[#1e376b] cursor-pointer hover:bg-slate-50"
                >
                  进入最近实例控制台
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
