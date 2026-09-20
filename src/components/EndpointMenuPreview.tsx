import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  LayoutList,
  Eye,
  Maximize2,
  X,
  Server,
  Monitor,
  MessageCircle,
  Smartphone,
  ChevronRight,
  ChevronDown,
  Search,
  Bell,
  User,
  ExternalLink,
  Check,
  Filter,
  Plus,
  ArrowRight,
  RefreshCw,
  Folder,
  FileCode,
  Sliders,
  Settings,
  ShieldCheck,
  Send,
  FileSpreadsheet,
  CheckSquare,
  Users,
  Database,
  Activity,
  History,
  KeyRound,
  FileText
} from 'lucide-react';
import { SysMenuItem } from './MenuManage';
import { AccessEndpoint, BusinessProduct } from '../data/appPlatform';
import { getUnifiedModuleByKey } from '../data/unifiedCallModules';

interface EndpointMenuPreviewProps {
  endpoint: AccessEndpoint;
  product: BusinessProduct;
  menus: SysMenuItem[];
  onGoToConfig: () => void;
  onOpenFullPreview: () => void;
}

// Icon mapper for menu rendering
const getMenuIcon = (iconName?: string) => {
  switch (iconName) {
    case 'FileCode': return FileCode;
    case 'FileSpreadsheet': return FileSpreadsheet;
    case 'Send': return Send;
    case 'CheckSquare': return CheckSquare;
    case 'Database': return Database;
    case 'Users': return Users;
    case 'ShieldCheck': return ShieldCheck;
    case 'Activity': return Activity;
    case 'History': return History;
    case 'KeyRound': return KeyRound;
    case 'Sliders': return Sliders;
    case 'Settings': return Settings;
    case 'Folder': return Folder;
    default: return FileText;
  }
};

/**
 * Endpoint Card Inline Preview Component
 */
export const EndpointMenuCardPreview: React.FC<EndpointMenuPreviewProps> = ({
  endpoint,
  product,
  menus,
  onGoToConfig,
  onOpenFullPreview,
}) => {
  const hasMenus = menus && menus.length > 0 && endpoint.modules.length > 0;

  if (!hasMenus) {
    return (
      <div className="mt-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 flex flex-col items-center justify-center text-center gap-2 transition-all">
        <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>未配置菜单，请前去配置</span>
        </div>
        <p className="text-[11px] text-amber-700/90 leading-tight">
          当前「{endpoint.name}」尚未配置任何业务菜单，终端用户访问将无法使用功能。
        </p>
        <button
          type="button"
          onClick={onGoToConfig}
          className="mt-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
        >
          <LayoutList className="w-3.5 h-3.5" />
          去配置端菜单
        </button>
      </div>
    );
  }

  // Organize top-level menus and submenus
  const topMenus = menus.filter((m) => m.parentId === '0' || !menus.some((p) => p.id === m.parentId));
  const activeMenuCount = menus.filter((m) => m.visible !== false).length;

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Eye className="w-3.5 h-3.5 text-[#1e376b]" />
          <span>菜单配置后预览</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-[#1e376b] font-bold">
            {activeMenuCount} 个生效菜单
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenFullPreview}
          className="text-[11px] font-bold text-[#1e376b] hover:text-[#14264c] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>全屏真实体验</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Mini Mockup Visual Frame */}
      {endpoint.kind === 'wechat' ? (
        // WeChat Mini-Program Mini Mock
        <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 text-[10px]">
            <span className="font-bold text-slate-800 truncate">📱 微信端 · {product.name}微门户</span>
            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">小程序</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {menus.slice(0, 6).map((m) => {
              const Icon = getMenuIcon(m.icon);
              return (
                <div
                  key={m.id}
                  className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-center border border-slate-100/80 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <Icon className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full">{m.menuName}</span>
                </div>
              );
            })}
          </div>
          {menus.length > 6 && (
            <div className="text-[10px] text-center text-slate-400 mt-1.5">
              及其他 {menus.length - 6} 个功能菜单...
            </div>
          )}
        </div>
      ) : (
        // PC Web / Admin Mini Mock
        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5 text-[10px]">
            <span className="font-bold text-slate-800 truncate">
              {endpoint.kind === 'admin_web' ? '🖥️ 管理端控制台' : '💻 用户端PC工作台'}
            </span>
            <span className="text-[9px] text-[#1e376b] font-mono bg-blue-50 px-1.5 py-0.2 rounded font-bold">
              实时同步
            </span>
          </div>
          <div className="flex gap-2">
            {/* Mini sidebar menu */}
            <div className="w-1/3 bg-slate-50 rounded p-1 flex flex-col gap-1 border border-slate-100">
              {topMenus.slice(0, 4).map((m, idx) => {
                const Icon = getMenuIcon(m.icon);
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-bold truncate ${
                      idx === 0 ? 'bg-[#1e376b] text-white' : 'text-slate-600'
                    }`}
                  >
                    <Icon className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{m.menuName}</span>
                  </div>
                );
              })}
            </div>
            {/* Mini content view */}
            <div className="flex-1 bg-slate-50/50 rounded p-1.5 flex flex-col justify-between border border-dashed border-slate-200 text-[9px]">
              <div>
                <div className="font-bold text-slate-800">
                  {topMenus[0]?.menuName || '当前业务模块'}
                </div>
                <div className="text-slate-400 text-[8px] mt-0.5 truncate">
                  路由: {topMenus[0]?.routePath || '/workspace'}
                </div>
              </div>
              <div className="flex items-center justify-between text-[8px] text-slate-400 pt-1 border-t border-slate-100 mt-1">
                <span>用户界面 100% 保持一致</span>
                <span className="text-emerald-600 font-bold">已就绪</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom link to direct config */}
      <div className="flex items-center justify-between pt-1 text-[11px]">
        <span className="text-slate-400">已与当前端数据流实时绑定</span>
        <button
          type="button"
          onClick={onGoToConfig}
          className="text-[#1e376b] hover:text-[#14264c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>进入菜单设计</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

interface EndpointMenuPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoints: AccessEndpoint[];
  currentEndpointId: string;
  onChangeEndpoint: (epId: string) => void;
  product: BusinessProduct;
  getEndpointMenus: (ep: AccessEndpoint) => SysMenuItem[];
  onGoToMenuConfig: (epId: string) => void;
}

/**
 * 1:1 High Fidelity Interactive Multi-Endpoint Sandbox Preview Modal
 */
export const EndpointMenuPreviewModal: React.FC<EndpointMenuPreviewModalProps> = ({
  isOpen,
  onClose,
  endpoints,
  currentEndpointId,
  onChangeEndpoint,
  product,
  getEndpointMenus,
  onGoToMenuConfig,
}) => {
  if (!isOpen) return null;

  const currentEp = endpoints.find((e) => e.id === currentEndpointId) || endpoints[0];
  const menus = currentEp ? getEndpointMenus(currentEp) : [];
  const hasMenus = menus && menus.length > 0 && currentEp?.modules?.length > 0;

  const [activeMenuId, setActiveMenuId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'home' | 'workbench' | 'messages' | 'mine'>('workbench');

  // Hierarchy
  const topMenus = useMemo(() => {
    if (!menus.length) return [];
    return menus.filter((m) => m.parentId === '0' || !menus.some((p) => p.id === m.parentId));
  }, [menus]);

  // Set default active menu
  React.useEffect(() => {
    if (topMenus.length > 0 && (!activeMenuId || !menus.some((m) => m.id === activeMenuId))) {
      // Pick first child or first top
      const firstTop = topMenus[0];
      const children = menus.filter((m) => m.parentId === firstTop.id);
      setActiveMenuId(children[0]?.id || firstTop.id);
    }
  }, [currentEp, menus, topMenus]);

  const activeMenu = menus.find((m) => m.id === activeMenuId) || topMenus[0] || null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] max-h-[900px] flex flex-col border border-slate-700 overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-4 flex-wrap shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-black text-white">
                访问端真实界面预览 · 保持1:1完全一致
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              产品: <strong className="text-slate-200">{product.name} ({product.code})</strong>
            </span>
          </div>

          {/* Endpoint Switcher Tabs: 管理端 | 用户端PC | 微信端 */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            {endpoints.map((ep) => {
              const isSelected = ep.id === currentEp?.id;
              const Icon = ep.kind === 'admin_web' ? Server : ep.kind === 'wechat' ? MessageCircle : Monitor;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => onChangeEndpoint(ep.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e376b] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{ep.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {ep.modules.length}模块
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (currentEp) onGoToMenuConfig(currentEp.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>去配置此端菜单</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sandbox Body */}
        <div className="flex-1 bg-slate-950 p-4 overflow-y-auto flex items-center justify-center min-h-0">
          {!hasMenus ? (
            /* Empty State: 提示未配置请前去配置 */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4 shadow-xl animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">「{currentEp?.name}」未配置菜单</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  当前访问端尚未挂载或配置任何业务菜单树。终端用户登录后将看到空白工作台，请前去进行菜单与模块绑定配置。
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (currentEp) onGoToMenuConfig(currentEp.id);
                }}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <LayoutList className="w-4 h-4" />
                立即前往配置菜单
              </button>
            </div>
          ) : currentEp.kind === 'wechat' ? (
            /* WECHAT MINI-PROGRAM PREVIEW (手机微信小程序壳) */
            <div className="w-[360px] h-[680px] bg-slate-100 rounded-[38px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col overflow-hidden relative text-slate-800">
              {/* iPhone Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30" />

              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-bold text-slate-900 shrink-0 select-none">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-slate-900 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-900 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* WeChat Header Bar with Capsule */}
              <div className="px-4 py-2 bg-white flex items-center justify-between border-b border-slate-200 shrink-0">
                <span className="text-xs font-black text-slate-900 truncate">
                  {product.name}移动微门户
                </span>
                {/* WeChat Capsule Button */}
                <div className="flex items-center gap-2 bg-slate-100/90 border border-slate-300/80 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700">
                  <span className="text-xs tracking-tighter">···</span>
                  <div className="w-px h-2.5 bg-slate-300" />
                  <span className="w-2 h-2 rounded-full border border-slate-600 inline-block" />
                </div>
              </div>

              {/* WeChat Main Content Scroll */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {/* User Welcome Card */}
                <div className="bg-gradient-to-r from-[#1e376b] to-blue-700 text-white p-3.5 rounded-2xl shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black">早安，特情移动研判席</div>
                    <div className="text-[10px] text-blue-200 mt-0.5">机构: {product.name}联动应急组</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    研
                  </div>
                </div>

                {/* Feature Menu Grid based on real configured menus */}
                <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs">
                  <div className="text-xs font-black text-slate-900 mb-2.5 flex items-center justify-between">
                    <span>业务功能导航</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      已挂载 {menus.length} 项
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {menus.map((m) => {
                      const Icon = getMenuIcon(m.icon);
                      const isSel = m.id === activeMenuId;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setActiveMenuId(m.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer ${
                            isSel ? 'bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1 ${
                            isSel ? 'bg-[#1e376b] text-white shadow-xs' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                            {m.menuName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active menu live card */}
                {activeMenu && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-col gap-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-black text-slate-900">{activeMenu.menuName}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{activeMenu.routePath}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      正在微信端运行模块「{activeMenu.menuName}」，终端用户可在小程序内直接流转指令与上报数据。
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>状态: 正常运行</span>
                      <span className="text-[#1e376b] font-bold">查看详情 →</span>
                    </div>
                  </div>
                )}
              </div>

              {/* WeChat Bottom TabBar */}
              <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shrink-0 text-slate-500">
                {[
                  { id: 'home', label: '首页', icon: Activity },
                  { id: 'workbench', label: '工作台', icon: LayoutList },
                  { id: 'messages', label: '消息', icon: Bell },
                  { id: 'mine', label: '我的', icon: User },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isAct = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                        isAct ? 'text-[#1e376b] font-black' : 'text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[9px]">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* PC WEB / ADMIN WEB PREVIEW (桌面端/管理端完整界面) */
            <div className="w-full h-full bg-[#F8FAFC] rounded-xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden text-slate-800">
              {/* PC Header Bar */}
              <div className={`px-5 py-2.5 flex items-center justify-between shrink-0 shadow-xs ${
                currentEp.kind === 'admin_web' ? 'bg-[#1e376b] text-white' : 'bg-white text-slate-900 border-b border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {product.code}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black">
                      {product.name} · {currentEp.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      currentEp.kind === 'admin_web' ? 'bg-blue-800/80 text-blue-200' : 'bg-blue-50 text-[#1e376b]'
                    }`}>
                      {currentEp.kind === 'admin_web' ? '管理控制台' : '业务工作台'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${
                    currentEp.kind === 'admin_web' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Search className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-[11px] opacity-70">全局搜索功能...</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs">
                      官
                    </div>
                    <span>超级管理员</span>
                  </div>
                </div>
              </div>

              {/* PC Body: Left Sidebar + Main Content */}
              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left Navigation Tree matching configured menus */}
                <div className={`w-56 flex flex-col shrink-0 overflow-y-auto p-3 border-r ${
                  currentEp.kind === 'admin_web'
                    ? 'bg-slate-900 text-slate-200 border-slate-800'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    功能导航菜单
                  </div>

                  <div className="flex flex-col gap-1">
                    {topMenus.map((top) => {
                      const Icon = getMenuIcon(top.icon);
                      const children = menus.filter((m) => m.parentId === top.id);
                      const hasKids = children.length > 0;
                      const isTopActive = top.id === activeMenuId || children.some((c) => c.id === activeMenuId);

                      return (
                        <div key={top.id} className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(children[0]?.id || top.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isTopActive
                                ? currentEp.kind === 'admin_web'
                                  ? 'bg-[#1e376b] text-white'
                                  : 'bg-blue-50 text-[#1e376b]'
                                : currentEp.kind === 'admin_web'
                                  ? 'hover:bg-slate-800 text-slate-300'
                                  : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{top.menuName}</span>
                            </div>
                            {hasKids && <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />}
                          </button>

                          {/* Submenus */}
                          {hasKids && (
                            <div className="ml-5 pl-2 border-l border-slate-700/50 flex flex-col gap-0.5 mt-0.5">
                              {children.map((child) => {
                                const ChildIcon = getMenuIcon(child.icon);
                                const isChildActive = child.id === activeMenuId;
                                return (
                                  <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => setActiveMenuId(child.id)}
                                    className={`w-full text-left px-2 py-1.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                                      isChildActive
                                        ? currentEp.kind === 'admin_web'
                                          ? 'bg-blue-600/30 text-sky-300 font-bold'
                                          : 'bg-blue-100/70 text-[#1e376b] font-bold'
                                        : currentEp.kind === 'admin_web'
                                          ? 'text-slate-400 hover:text-slate-200'
                                          : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                  >
                                    <ChildIcon className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{child.menuName}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Workspace Main Content */}
                <div className="flex-1 bg-white p-5 overflow-y-auto flex flex-col gap-4">
                  {/* Breadcrumb & Title */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                    <div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                        <span>{product.name}</span>
                        <span>/</span>
                        <span>{currentEp.name}</span>
                        <span>/</span>
                        <span className="text-[#1e376b] font-bold">{activeMenu?.menuName || '业务主页'}</span>
                      </div>
                      <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                        {activeMenu?.menuName || '当前业务功能'}
                        <span className="text-xs font-mono font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {activeMenu?.routePath || '/workspace'}
                        </span>
                      </h1>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        刷新数据
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        新建记录
                      </button>
                    </div>
                  </div>

                  {/* Realistic Mock Table & View */}
                  <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>数据列表 · 实时联动演示</span>
                      <span className="text-slate-400 text-[11px]">共 12 条记录</span>
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 text-[11px]">
                          <th className="py-2.5 px-4">编号</th>
                          <th className="py-2.5 px-4">业务名称</th>
                          <th className="py-2.5 px-4">所属模块</th>
                          <th className="py-2.5 px-4">处理状态</th>
                          <th className="py-2.5 px-4">更新时间</th>
                          <th className="py-2.5 px-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { id: 'REC-2026-001', name: '全网特情研判与指令下发', mod: activeMenu?.menuName || '特情响应', status: '处理中', time: '2026-09-20 10:24' },
                          { id: 'REC-2026-002', name: '重点态势监控数据回传', mod: activeMenu?.menuName || '态势监控', status: '已完成', time: '2026-09-20 09:40' },
                          { id: 'REC-2026-003', name: '跨部门紧急协同通知', mod: activeMenu?.menuName || '通知公告', status: '待审批', time: '2026-09-20 08:15' },
                        ].map((row) => (
                          <tr key={row.id} className="hover:bg-blue-50/30">
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{row.id}</td>
                            <td className="py-2.5 px-4 font-medium text-slate-900">{row.name}</td>
                            <td className="py-2.5 px-4 text-slate-600">{row.mod}</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">{row.time}</td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="text-[#1e376b] font-bold hover:underline cursor-pointer">
                                查看详情
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>预览界面与实际用户访问 100% 保持一致，支持实时切换「管理端」「用户端PC」「微信端」。</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            关闭预览
          </button>
        </div>
      </div>
    </div>
  );
};
