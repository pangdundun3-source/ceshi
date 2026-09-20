import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Boxes,
  Check,
  LayoutList,
  Library,
  Monitor,
  Plus,
  Send,
} from 'lucide-react';
import { SysMenuItem } from './MenuManage';
import { MenuManage } from './MenuManage';
import { UNIFIED_CALL_MODULES, getUnifiedModuleByKey } from '../data/unifiedCallModules';
import {
  AccessEndpoint,
  AppInstance,
  BusinessProduct,
  DomainRecord,
  ENDPOINT_KINDS,
  EndpointKind,
  buildPrivateModules,
  deployedModuleKeys,
  getEndpointKind,
  statusClass,
  statusLabel,
} from '../data/appPlatform';

export type ConsolePane =
  | 'basic'
  | 'endpoints'
  | 'components'
  | 'menus'
  | 'publish';

interface AppConsoleProps {
  product: BusinessProduct;
  instance: AppInstance;
  endpoints: AccessEndpoint[];
  domains: DomainRecord[];
  onBack: () => void;
  onChangeInstance: (instance: AppInstance) => void;
  onChangeEndpoints: (endpoints: AccessEndpoint[]) => void;
  onChangeDomains: (domains: DomainRecord[]) => void;
  sharedMenus?: SysMenuItem[];
  onSharedMenusChange?: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
}

const NAV: Array<{ id: ConsolePane; label: string; icon: React.ElementType }> = [
  { id: 'basic', label: '基本信息', icon: Boxes },
  { id: 'endpoints', label: '访问端管理', icon: Monitor },
  { id: 'components', label: '组件库管理', icon: Library },
  { id: 'menus', label: '菜单配置', icon: LayoutList },
  { id: 'publish', label: '版本发布', icon: Send },
];

export const AppConsole: React.FC<AppConsoleProps> = ({
  product,
  instance,
  endpoints,
  domains,
  onBack,
  onChangeInstance,
  onChangeEndpoints,
  onChangeDomains,
  sharedMenus,
  onSharedMenusChange,
}) => {
  const [pane, setPane] = useState<ConsolePane>('basic');
  const [activeEp, setActiveEp] = useState(endpoints[0]?.id || '');
  const [openingHosts, setOpeningHosts] = useState<Partial<Record<EndpointKind, string>>>({});
  const [domainHost, setDomainHost] = useState('');
  const currentEp = endpoints.find((item) => item.id === activeEp) || endpoints[0];
  const currentDomain = domains.find((item) => item.id === currentEp?.domainId);
  const unusedKinds = ENDPOINT_KINDS.filter((kind) => !endpoints.some((item) => item.kind === kind.key));
  const privateModules = instance.privateModules?.length
    ? instance.privateModules
    : buildPrivateModules(product.modules, product.version);
  const deployedKeys = deployedModuleKeys({ ...instance, privateModules }, product.modules);
  const deployedCount = privateModules.filter((item) => item.status === 'deployed').length;
  const [privateName, setPrivateName] = useState('');
  const [privateDesc, setPrivateDesc] = useState('');
  const [privateVersion, setPrivateVersion] = useState('V1.0');
  const boundComponents = privateModules.filter((item) => item.status === 'deployed');
  const privateComponents = privateModules.filter((item) => item.source === 'private');

  useEffect(() => {
    setDomainHost(currentDomain?.host || '');
  }, [currentEp?.id, currentDomain?.host]);

  const setComponentBound = (moduleKey: string, bound: boolean) => {
    const exists = privateModules.some((item) => item.moduleKey === moduleKey);
    const nextModules = exists
      ? privateModules.map((item) =>
          item.moduleKey === moduleKey
            ? { ...item, status: bound ? 'deployed' as const : 'undeployed' as const }
            : item
        )
      : [
          ...privateModules,
          {
            moduleKey,
            version: product.version,
            source: 'platform' as const,
            status: bound ? 'deployed' as const : 'undeployed' as const
          }
        ];
    onChangeInstance({ ...instance, privateModules: nextModules });
    if (!bound) {
      onChangeEndpoints(endpoints.map((item) => ({
        ...item,
        modules: item.modules.filter((key) => key !== moduleKey),
      })));
    }
  };

  const addPrivateComponent = () => {
    const name = privateName.trim();
    if (!name) return;
    const moduleKey = `private-${Date.now()}`;
    onChangeInstance({
      ...instance,
      privateModules: [
        ...privateModules,
        {
          moduleKey,
          source: 'private',
          name,
          description: privateDesc.trim(),
          kernel: '业务核',
          version: privateVersion.trim() || 'V1.0',
          status: 'undeployed'
        }
      ]
    });
    setPrivateName('');
    setPrivateDesc('');
    setPrivateVersion('V1.0');
  };

  const toggleEpModule = (moduleKey: string) => {
    if (!currentEp) return;
    const next = endpoints.map((item) => {
      if (item.id !== currentEp.id) return item;
      const has = item.modules.includes(moduleKey);
      return {
        ...item,
        modules: has ? item.modules.filter((key) => key !== moduleKey) : [...item.modules, moduleKey],
      };
    });
    onChangeEndpoints(next);
  };

  const saveCurrentDomain = () => {
    const host = domainHost.trim();
    if (!currentEp || !host) return;
    if (currentEp.domainId) {
      onChangeDomains(domains.map((item) => (
        item.id === currentEp.domainId
          ? { ...item, host, status: 'bound', endpointId: currentEp.id, instanceId: instance.id }
          : item
      )));
      return;
    }
    const domainId = `dom-${currentEp.kind}-${Date.now()}`;
    onChangeDomains([
      ...domains,
      {
        id: domainId,
        host,
        kind: currentEp.kind === 'intranet' ? 'intranet' : 'sub',
        ssl: currentEp.kind === 'intranet' ? 'none' : 'normal',
        status: 'bound',
        endpointId: currentEp.id,
        instanceId: instance.id,
      },
    ]);
    onChangeEndpoints(endpoints.map((item) => (
      item.id === currentEp.id ? { ...item, domainId } : item
    )));
  };

  const confirmOpenEndpoint = (kind: EndpointKind) => {
    const host = (openingHosts[kind] || '').trim();
    if (!host) return;
    const def = getEndpointKind(kind);
    if (!def) return;
    const stamp = Date.now();
    const domainId = `dom-${kind}-${stamp}`;
    const endpointId = `ep-${kind}-${stamp}`;
    onChangeEndpoints([
      ...endpoints,
      {
        id: endpointId,
        instanceId: instance.id,
        name: def.name,
        kind,
        homePage: kind === 'admin_web' ? '管理首页' : '工作台',
        menuProfile: `${def.name}菜单`,
        permissionProfile: kind === 'admin_web' ? '管理员' : '业务用户',
        modules: deployedKeys,
        domainId,
      },
    ]);
    onChangeDomains([
      ...domains,
      {
        id: domainId,
        host,
        kind: kind === 'intranet' ? 'intranet' : 'sub',
        ssl: kind === 'intranet' ? 'none' : 'normal',
        status: 'bound',
        endpointId,
        instanceId: instance.id,
      },
    ]);
    setActiveEp(endpointId);
    setOpeningHosts((prev) => {
      const next = { ...prev };
      delete next[kind];
      return next;
    });
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-hidden bg-[#F8FAFC] text-slate-800 flex flex-col">
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <button type="button" onClick={onBack} className="text-[#1e376b] font-bold flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            返回
          </button>
          <span>/</span>
          <span>{product.name}</span>
          <span>/</span>
          <span className="text-slate-800 font-bold">{instance.name}</span>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">{instance.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              产品 {product.name} · {product.code} {product.version} · {instance.deployMode} · {instance.orgScope}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusClass[instance.status]}`}>
            {statusLabel[instance.status]}
          </span>
        </div>

        <nav
          className="flex items-center gap-1 mt-3 -mb-3 overflow-x-auto scrollbar-none"
          aria-label="实例配置导航"
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pane === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPane(item.id)}
                id={`console_nav_${item.id}`}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap cursor-pointer border-b-2 transition-colors ${
                  active
                    ? 'text-[#1e376b] border-[#1e376b]'
                    : 'text-slate-500 border-transparent hover:text-[#1e376b] hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#1e376b]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5">
          {pane === 'basic' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                ['产品名称', product.name],
                ['产品编码', product.code],
                ['产品类型', product.type],
                ['版本', product.version],
                ['实例名称', instance.name],
                ['部署方式', instance.deployMode],
                ['数据隔离', instance.isolation],
                ['机构范围', instance.orgScope],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-slate-100 pb-3">
                  <div className="text-[11px] text-slate-400 font-medium">{label}</div>
                  <div className="font-bold text-slate-800 mt-1">{value}</div>
                </div>
              ))}
              <div className="sm:col-span-2">
                <div className="text-[11px] text-slate-400 font-medium">产品能力说明</div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}

          {pane === 'endpoints' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  开通访问端时必须配置域名。用户打开域名后识别：域名 → 访问端 → 本实例 → 加载菜单与权限。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {endpoints.map((ep) => {
                  const kind = getEndpointKind(ep.kind);
                  const domain = domains.find((item) => item.id === ep.domainId);
                  const selected = currentEp?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setActiveEp(ep.id)}
                      className={`text-left rounded-xl border px-4 py-3.5 cursor-pointer ${
                        selected ? 'border-[#1e376b] bg-blue-50/70' : 'border-slate-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-slate-900">{ep.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{kind?.typeLabel}</span>
                      </div>
                      <p className={`text-[11px] mt-1 font-mono ${domain?.host ? 'text-slate-600' : 'text-amber-600 font-bold'}`}>
                        {domain?.host || '未配置域名'}
                      </p>
                    </button>
                  );
                })}

                {unusedKinds.map((kind) => {
                  const host = openingHosts[kind.key] || '';
                  return (
                    <div
                      key={kind.key}
                      className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-[#1e376b]" />
                          开通{kind.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{kind.typeLabel}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{kind.description}</p>
                      <label className="mt-3 text-[11px] font-bold text-slate-700 block">
                        访问域名 *
                        <input
                          value={host}
                          onChange={(e) => setOpeningHosts((prev) => ({ ...prev, [kind.key]: e.target.value }))}
                          placeholder={kind.key === 'intranet' ? '10.10.10.20' : `${kind.key === 'admin_web' ? 'admin' : kind.key}.example.com`}
                          className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono bg-white"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={!host.trim()}
                        onClick={() => confirmOpenEndpoint(kind.key)}
                        className="mt-2 w-full px-3 py-1.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        开通并绑定域名
                      </button>
                    </div>
                  );
                })}
              </div>

              {currentEp && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3">
                    <div>
                      <div className="text-sm font-black text-slate-900">配置「{currentEp.name}」</div>
                      <p className="text-xs text-slate-500 mt-0.5">绑定域名后，用户打开该地址即进入此访问端。可见菜单请到「菜单配置」按端勾选。</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-end">
                      <label className="text-[11px] font-bold text-slate-700 flex flex-col gap-1">
                        访问域名 *
                        <input
                          value={domainHost}
                          onChange={(e) => setDomainHost(e.target.value)}
                          placeholder={currentEp.kind === 'intranet' ? '10.10.10.20' : 'admin.example.com'}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-medium bg-white"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={!domainHost.trim()}
                        onClick={saveCurrentDomain}
                        className="h-[34px] px-3.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {currentEp.domainId ? '保存域名' : '绑定域名'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>SSL：{currentDomain?.ssl === 'normal' ? '正常' : currentDomain?.ssl === 'expiring' ? '即将到期' : currentDomain ? '无' : '绑定后生效'}</span>
                      <span>·</span>
                      <span>状态：{currentDomain?.status === 'bound' ? '已绑定' : currentDomain?.status === 'pending' ? '待生效' : '未配置'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {pane === 'components' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-sm font-black text-slate-900">已绑定组件</div>
                    <p className="text-xs text-slate-500 mt-0.5">含平台公用组件与已绑定的私有化组件。取消绑定后，「菜单配置」中不可再勾选。</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                    已绑定 {deployedCount}
                  </span>
                </div>
                {boundComponents.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="text-left font-bold px-5 py-2.5">组件</th>
                        <th className="text-left font-bold px-3 py-2.5">来源</th>
                        <th className="text-left font-bold px-3 py-2.5">所属内核</th>
                        <th className="text-left font-bold px-3 py-2.5">版本</th>
                        <th className="text-right font-bold px-5 py-2.5">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boundComponents.map((item) => {
                        const platform = getUnifiedModuleByKey(item.moduleKey);
                        const isPrivate = item.source === 'private';
                        return (
                          <tr key={item.moduleKey} className="border-t border-slate-100">
                            <td className="px-5 py-3">
                              <div className="font-bold text-slate-800">{isPrivate ? item.name : platform?.title || item.moduleKey}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{isPrivate ? item.description : platform?.description}</div>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${
                                isPrivate
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-sky-50 text-sky-700 border-sky-200'
                              }`}>
                                {isPrivate ? '私有化' : '平台公用'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-slate-600">{isPrivate ? (item.kernel || '—') : (platform?.kernel || '—')}</td>
                            <td className="px-3 py-3 font-mono text-slate-700">{item.version}</td>
                            <td className="px-5 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => setComponentBound(item.moduleKey, false)}
                                className="px-2.5 py-1 border border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-bold cursor-pointer"
                              >
                                取消绑定
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-5 py-8 text-xs text-slate-400 text-center">尚未绑定组件，请从下方平台公用组件或私有化组件中绑定</div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <div className="text-sm font-black text-slate-900">平台公用组件</div>
                  <p className="text-xs text-slate-500 mt-0.5">统一调用组件库。未绑定的可绑定到本实例。</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {UNIFIED_CALL_MODULES.filter((mod) => product.modules.includes(mod.menu as string)).map((mod) => {
                    const key = mod.menu as string;
                    const rec = privateModules.find((item) => item.moduleKey === key);
                    const bound = rec ? rec.status === 'deployed' : true;
                    return (
                      <div key={key} className="px-5 py-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800">{mod.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{mod.description} · {mod.kernel}</div>
                        </div>
                        {bound ? (
                          <button
                            type="button"
                            onClick={() => setComponentBound(key, false)}
                            className="px-2.5 py-1 border border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold cursor-pointer shrink-0"
                          >
                            取消绑定
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setComponentBound(key, true)}
                            className="px-2.5 py-1 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                          >
                            绑定
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <div className="text-sm font-black text-slate-900">私有化组件</div>
                  <p className="text-xs text-slate-500 mt-0.5">添加本实例专属组件，添加后可绑定到组件库。</p>
                </div>
                <div className="px-5 py-3.5 border-b border-slate-100 grid grid-cols-1 md:grid-cols-[1.2fr_1.6fr_0.6fr_auto] gap-2 items-end">
                  <label className="text-[11px] font-bold text-slate-700 flex flex-col gap-1">
                    组件名称 *
                    <input
                      value={privateName}
                      onChange={(e) => setPrivateName(e.target.value)}
                      placeholder="例如：专网审计插件"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                    />
                  </label>
                  <label className="text-[11px] font-bold text-slate-700 flex flex-col gap-1">
                    说明
                    <input
                      value={privateDesc}
                      onChange={(e) => setPrivateDesc(e.target.value)}
                      placeholder="这个组件做什么"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium"
                    />
                  </label>
                  <label className="text-[11px] font-bold text-slate-700 flex flex-col gap-1">
                    版本
                    <input
                      value={privateVersion}
                      onChange={(e) => setPrivateVersion(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={!privateName.trim()}
                    onClick={addPrivateComponent}
                    className="h-[34px] px-3.5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加
                  </button>
                </div>
                {privateComponents.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {privateComponents.map((item) => {
                      const bound = item.status === 'deployed';
                      return (
                        <div key={item.moduleKey} className="px-5 py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-800">{item.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{item.description || '未填写说明'} · {item.version}</div>
                          </div>
                          {bound ? (
                            <button
                              type="button"
                              onClick={() => setComponentBound(item.moduleKey, false)}
                              className="px-2.5 py-1 border border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold cursor-pointer shrink-0"
                            >
                              取消绑定
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setComponentBound(item.moduleKey, true)}
                              className="px-2.5 py-1 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                            >
                              绑定
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-6 text-xs text-slate-400 text-center">还没有私有化组件，填写上方信息后添加</div>
                )}
              </div>
            </div>
          )}

          {pane === 'menus' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <div className="text-sm font-black text-slate-900">按访问端配置可见模块</div>
                  <p className="text-xs text-slate-500 mt-0.5">先选端，再勾选该端菜单。仅已绑定到组件库的组件可勾选。</p>
                </div>
                {endpoints.length > 0 ? (
                  <>
                    <div className="px-5 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-slate-100">
                      {endpoints.map((ep) => {
                        const selected = currentEp?.id === ep.id;
                        const domain = domains.find((item) => item.id === ep.domainId);
                        return (
                          <button
                            key={ep.id}
                            type="button"
                            onClick={() => setActiveEp(ep.id)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                              selected
                                ? 'bg-[#1e376b] text-white border-[#1e376b]'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            {ep.name}
                            {domain?.host ? <span className={`ml-1.5 font-mono font-medium ${selected ? 'text-white/70' : 'text-slate-400'}`}>{domain.host}</span> : null}
                          </button>
                        );
                      })}
                    </div>
                    {currentEp && (
                      <div className="divide-y divide-slate-100">
                        {[
                          ...UNIFIED_CALL_MODULES.filter((mod) => {
                            const key = mod.menu as string;
                            return product.modules.includes(key) && deployedKeys.includes(key);
                          }).map((mod) => ({
                            key: mod.menu as string,
                            title: mod.title,
                            description: mod.description
                          })),
                          ...privateModules
                            .filter((item) => item.source === 'private' && item.status === 'deployed')
                            .map((item) => ({
                              key: item.moduleKey,
                              title: item.name || item.moduleKey,
                              description: item.description || '私有化组件'
                            }))
                        ].map((mod) => {
                          const selected = currentEp.modules.includes(mod.key);
                          return (
                            <button
                              key={mod.key}
                              type="button"
                              onClick={() => toggleEpModule(mod.key)}
                              className={`w-full text-left px-5 py-3 flex items-center gap-3 cursor-pointer ${selected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                            >
                              <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${selected ? 'bg-[#1e376b] border-[#1e376b] text-white' : 'border-slate-300 text-transparent'}`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                              <span className="text-sm font-bold text-slate-800">{mod.title}</span>
                              <span className="text-[11px] text-slate-400">{mod.description}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-5 py-8 text-xs text-slate-400 text-center">请先在「访问端管理」开通访问端并绑定域名</div>
                )}
              </div>
              <MenuManage
                appName={instance.name}
                appCode={product.code}
                menus={sharedMenus}
                onMenusChange={onSharedMenusChange}
              />
            </div>
          )}

          {pane === 'publish' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                发布后，已绑定域名开始按「域名 → 访问端 → 实例」识别并加载菜单。未发布时外网不展示该实例。
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChangeInstance({ ...instance, status: 'running' })}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  发布实例
                </button>
                <button
                  type="button"
                  onClick={() => onChangeInstance({ ...instance, status: 'stopped' })}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs cursor-pointer"
                >
                  停用
                </button>
              </div>
              <div className={`self-start px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusClass[instance.status]}`}>
                当前：{statusLabel[instance.status]}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};
