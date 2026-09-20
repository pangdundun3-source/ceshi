import React, { useState } from 'react';
import { Plus, Search, X, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert, Boxes, Monitor, Library, LayoutList, Send } from 'lucide-react';
import { SysMenuItem } from './MenuManage';
import { AppPlatformWizard } from './AppPlatformWizard';
import { AppConsole, ConsolePane } from './AppConsole';
import {
  INITIAL_DOMAINS,
  INITIAL_ENDPOINTS,
  INITIAL_INSTANCES,
  INITIAL_PRODUCTS,
  BusinessProduct,
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
  const [consoleInitialPane, setConsoleInitialPane] = useState<ConsolePane>('basic');
  const [wizardInitialProduct, setWizardInitialProduct] = useState<BusinessProduct | undefined>(undefined);
  const [unpublishedNoticeProduct, setUnpublishedNoticeProduct] = useState<BusinessProduct | null>(null);

  const consoleInstance = instances.find((item) => item.id === consoleId);
  const consoleProduct = products.find((item) => item.id === consoleInstance?.productId);

  const openConsole = (instanceId: string, initialPane: ConsolePane = 'basic') => {
    setConsoleId(instanceId);
    setConsoleInitialPane(initialPane);
    setMode('console');
  };

  const openWizardWithProduct = (product?: BusinessProduct) => {
    setWizardInitialProduct(product);
    setMode('wizard');
  };

  const toggleProductStatus = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const isCurrentlyEnabled = (targetProduct.status || 'enabled') === 'enabled';
    const isPublished = targetProduct.publishStatus === 'published';

    // 只有正式发布的系统才可以开启启用；未发布时禁止启用，并弹出发布检查提示
    if (!isCurrentlyEnabled && !isPublished) {
      setUnpublishedNoticeProduct(targetProduct);
      return;
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const nextStatus = isCurrentlyEnabled ? 'disabled' : 'enabled';
        return { ...p, status: nextStatus };
      })
    );
  };

  const filteredProducts = products.filter((item) =>
    `${item.name}${item.code}${item.description}`.toLowerCase().includes(keyword.toLowerCase().trim())
  );

  if (mode === 'wizard') {
    return (
      <AppPlatformWizard
        initialProduct={wizardInitialProduct}
        onCancel={() => {
          setMode('list');
          setWizardInitialProduct(undefined);
        }}
        onFinish={({ product, instance, endpoints: eps, domains: doms }) => {
          // If it was an existing product, don't duplicate product
          setProducts((prev) => {
            const exists = prev.some((p) => p.id === product.id);
            return exists ? prev : [product, ...prev];
          });
          setInstances((prev) => [instance, ...prev]);
          setEndpoints((prev) => [...eps, ...prev]);
          setDomains((prev) => [...doms, ...prev]);
          setConsoleId(instance.id);
          setConsoleInitialPane('publish');
          setWizardInitialProduct(undefined);
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
        initialPane={consoleInitialPane}
        onSharedMenusChange={onSharedMenusChange}
        onBack={() => {
          setMode('list');
          setConsoleId(null);
        }}
        onChangeProduct={(nextProd) => setProducts((prev) => prev.map((p) => p.id === nextProd.id ? nextProd : p))}
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
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] text-slate-800 relative">
      {/* Unpublished Product Notice Modal */}
      {unpublishedNoticeProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-start gap-3.5 bg-amber-50/50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>无法开启启用：系统尚未正式发布</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  产品「<strong>{unpublishedNoticeProduct.name}</strong>」当前处于未发布草稿状态。根据平台发布合规规范，<strong>只有正式发布上线的系统才可以启用</strong>。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUnpublishedNoticeProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>正式发布前必须通过以下 4 项核心检查：</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
                  <Boxes className="w-4 h-4 text-[#1e376b] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">01 基础信息检查</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">确认实例名称、所属产品、部署隔离模式完整有效</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
                  <Monitor className="w-4 h-4 text-[#1e376b] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">02 访问端检查</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">管理端、用户端PC、微信端等需开通并绑定有效访问域名</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
                  <Library className="w-4 h-4 text-[#1e376b] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">03 组件库接入检查</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">接入业务核心能力组件并完成终端挂载分配</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
                  <LayoutList className="w-4 h-4 text-[#1e376b] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">04 菜单配置检查</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">各端完成导航菜单树构建及组件路由绑定</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUnpublishedNoticeProduct(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer"
              >
                知道了
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetProd = unpublishedNoticeProduct;
                  setUnpublishedNoticeProduct(null);
                  const ins = instances.filter((item) => item.productId === targetProd.id);
                  const preferred = ins[0];
                  if (preferred) {
                    openConsole(preferred.id, 'publish');
                  } else {
                    openWizardWithProduct(targetProd);
                  }
                }}
                className="px-4 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>前往控制台自检并发布</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white px-6 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>V8应用集成管理中心</span>
            <span>/</span>
            <span className="text-slate-600 font-medium">应用管理 / 产品管理</span>
          </nav>
          <h1 className="text-lg font-black text-slate-900 mt-1">产品与实例管理</h1>
        </div>
        <button
          type="button"
          id="btn_open_platform_wizard"
          onClick={() => openWizardWithProduct(undefined)}
          className="px-4 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          开通业务系统
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Search & Filter Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索产品名称 / 编码 / 描述..."
              className="w-full pl-8 pr-8 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:border-[#1e376b] focus:outline-none transition-colors"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            共 {filteredProducts.length} 个产品体系
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const ins = instances.filter((item) => item.productId === product.id);
            const preferred = [...ins].sort((a, b) => (
              endpoints.filter((ep) => ep.instanceId === b.id).length
              - endpoints.filter((ep) => ep.instanceId === a.id).length
            ))[0];
            const isEnabled = (product.status || 'enabled') === 'enabled';
            const isPublished = product.publishStatus === 'published';

            return (
              <div
                key={product.id}
                className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-200 relative overflow-hidden ${
                  isEnabled
                    ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm'
                    : 'bg-slate-50/80 border-slate-200/90 shadow-2xs opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Card Header: Icon + Version + Publish Status + Status Switch */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 transition-all ${
                          isEnabled
                            ? `bg-gradient-to-br ${product.iconBg}`
                            : 'bg-slate-300 text-slate-500 grayscale'
                        }`}
                      >
                        {product.code}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-base font-black truncate ${isEnabled ? 'text-slate-900' : 'text-slate-600'}`}>
                            {product.name}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            isEnabled ? 'text-slate-600 bg-slate-100' : 'text-slate-400 bg-slate-200/60'
                          }`}>
                            {product.version}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-400">{product.type}</span>
                          <span className="text-slate-300 text-xs">·</span>
                          {isPublished ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              已发布
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                              <AlertCircle className="w-2.5 h-2.5" />
                              待发布
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enable/Disable Unified Status Toggle Button (Linked with Release Status) */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isEnabled}
                      onClick={(e) => toggleProductStatus(product.id, e)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs select-none shrink-0 ${
                        !isPublished
                          ? 'text-slate-500 bg-slate-100 border-slate-300 hover:bg-slate-200 hover:text-slate-700'
                          : isEnabled
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-300 hover:bg-emerald-100/90'
                            : 'text-amber-700 bg-amber-50 border-amber-300 hover:bg-amber-100/90'
                      }`}
                      title={
                        !isPublished
                          ? '当前为「未发布」状态，禁止直接启用。需先完成4项检查并正式发布。'
                          : isEnabled
                            ? '当前为「启用」状态，点击切换为禁用'
                            : '已发布，当前为「禁用」状态，点击切换为启用'
                      }
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          !isPublished
                            ? 'bg-slate-400'
                            : isEnabled
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-amber-500'
                        }`}
                      />
                      <span>
                        {!isPublished ? '禁用 (未发布)' : isEnabled ? '启用' : '已禁用'}
                      </span>
                      <span
                        className={`relative inline-flex h-4 w-7 shrink-0 rounded-full border border-transparent transition-colors duration-200 ease-in-out ${
                          isEnabled && isPublished ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5 ${
                            isEnabled && isPublished ? 'translate-x-3.5' : 'translate-x-0.5'
                          }`}
                        />
                      </span>
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap pt-1 border-t border-slate-100/80">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">{product.type}</span>
                    <span>·</span>
                    <span>包含 <strong>{product.modules.length}</strong> 个产品模块</span>
                    <span>·</span>
                    <span>已建 <strong>{ins.length}</strong> 个实例</span>
                  </div>
                </div>

                {/* Footer Action Buttons - 无论启用或禁用均可进入控制台进行预览与配置 */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (preferred) {
                        openConsole(preferred.id, 'basic');
                      } else {
                        openWizardWithProduct(product);
                      }
                    }}
                    className="w-full px-3 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors text-center shadow-xs flex items-center justify-center gap-1.5"
                    title="进入详情控制台：支持访问端预览、组件库管理与菜单配置"
                  >
                    <span>进入控制台配置与预览</span>
                    {!isEnabled && (
                      <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-normal">
                        {!isPublished ? '未发布' : '已停用'}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
