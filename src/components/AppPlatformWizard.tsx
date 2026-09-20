import React, { useMemo, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Globe, 
  Server, 
  AlertCircle, 
  CheckCircle2, 
  Edit2, 
  Info,
  X,
  Palette,
  Calendar,
  Upload,
  UploadCloud,
  Image as ImageIcon,
  Flame,
  Zap,
  MessageSquare,
  Shield,
  Radio,
  Bell,
  Cpu,
  Boxes,
  Lock,
  Compass,
  Briefcase,
  Sliders,
  FolderTree,
  Activity,
  Layers as LayersIcon,
  Search,
  Maximize2,
  Minimize2,
  SkipForward,
  FastForward,
  ArrowRight,
  Monitor,
  Smartphone,
  Tablet,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { UNIFIED_CALL_MODULES, UnifiedKernel } from '../data/unifiedCallModules';
import {
  AccessEndpoint,
  AppInstance,
  BusinessProduct,
  DomainRecord,
  ENDPOINT_KINDS,
  EndpointKind,
  THEME_COLOR_PRESETS,
  PRESET_AVATARS,
  buildPrivateModules,
} from '../data/appPlatform';

// Avatar icons dictionary for dynamic rendering
const AVATAR_ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Zap,
  MessageSquare,
  Shield,
  Radio,
  Bell,
  Cpu,
  Boxes,
  Lock,
  Compass,
  Briefcase,
  Sliders,
  FolderTree,
  Activity,
  Layers: LayersIcon,
};

export type AppCreateWizardStep = 1 | 2 | 3 | 4;

const STEPS: Array<{ step: AppCreateWizardStep; label: string; optional?: boolean; desc: string }> = [
  { step: 1, label: '1. 基础信息配置', desc: '产品定义与LOGO' },
  { step: 2, label: '2. 产品组件库勾选', optional: true, desc: '可选 · 可跳过' },
  { step: 3, label: '3. 访问端配置', optional: true, desc: '可选 · 可跳过' },
  { step: 4, label: '4. 确认开通', desc: '概览核对与生效' },
];

interface AppPlatformWizardProps {
  onCancel: () => void;
  onFinish: (payload: {
    product: BusinessProduct;
    instance: AppInstance;
    endpoints: AccessEndpoint[];
    domains: DomainRecord[];
  }) => void;
  initialProduct?: BusinessProduct;
}

export const AppPlatformWizard: React.FC<AppPlatformWizardProps> = ({ 
  onCancel, 
  onFinish,
  initialProduct 
}) => {
  const [step, setStep] = useState<AppCreateWizardStep>(1);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Step 1 states: Product basic info & LOGO
  const [productName, setProductName] = useState(initialProduct?.name || '');
  const [productType, setProductType] = useState<BusinessProduct['type']>(initialProduct?.type || '业务应用');
  const [createdAt, setCreatedAt] = useState(initialProduct?.createdAt || new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [themeColor, setThemeColor] = useState(initialProduct?.themeColor || '#1e376b');
  const [themeColorName, setThemeColorName] = useState(initialProduct?.themeColorName || '经典深蓝');
  const [avatar, setAvatar] = useState(initialProduct?.avatar || 'Flame');
  const [avatarType, setAvatarType] = useState<'icon' | 'image'>(initialProduct?.avatarType || 'icon');
  const [iconBg, setIconBg] = useState(initialProduct?.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900');
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(
    initialProduct?.avatarType === 'image' ? initialProduct.avatar : null
  );
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);

  // Auto-generate code and slug from product name or initial product
  const generatedCode = useMemo(() => {
    if (initialProduct?.code) return initialProduct.code;
    const sanitized = productName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    return sanitized.length >= 2 ? sanitized.slice(0, 8) : `APP_${Date.now().toString(36).slice(-4).toUpperCase()}`;
  }, [initialProduct, productName]);

  const codeSlug = useMemo(() => {
    return (initialProduct?.code || 'app').toLowerCase();
  }, [initialProduct]);

  // Step 2 states: Modules selection & kernel filtering (Default to recommended core modules)
  const [modules, setModules] = useState<string[]>(
    initialProduct?.modules || UNIFIED_CALL_MODULES.filter(m => m.kernel === '业务核').map((item) => item.menu as string)
  );
  const [moduleFilterKernel, setModuleFilterKernel] = useState<string>('all');
  const [moduleSearchKeyword, setModuleSearchKeyword] = useState<string>('');

  // Step 3 states: Endpoints and domains
  const [selectedKinds, setSelectedKinds] = useState<EndpointKind[]>(['admin_web', 'user_web']);
  const [hosts, setHosts] = useState<Partial<Record<EndpointKind, string>>>({
    admin_web: '',
    user_web: '',
    h5: '',
    pad: '',
    intranet: '',
    wechat: '',
  });

  // Validation & feedback state
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleProductNameChange = (name: string) => {
    setProductName(name);
  };

  // Handle custom product LOGO upload & drag and drop
  const processAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('请上传有效的图片格式文件 (PNG, JPG, SVG, WebP 等)', 'warning');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('LOGO图片大小请小于 2MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomAvatarPreview(result);
      setAvatar(result);
      setAvatarType('image');
      showToast('产品LOGO上传成功，已作为唯一LOGO展示', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAvatarFile(file);
    }
    e.target.value = '';
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAvatar(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAvatarFile(file);
    }
  };

  const handleSelectThemeColor = (preset: typeof THEME_COLOR_PRESETS[number]) => {
    setThemeColor(preset.color || preset.hex);
    setThemeColorName(preset.name);
  };

  // Toggle endpoint selection
  const toggleKind = (kind: EndpointKind) => {
    setSelectedKinds((prev) => {
      if (prev.includes(kind)) {
        return prev.filter((item) => item !== kind);
      } else {
        if (!hosts[kind]) {
          const autoHost = kind === 'intranet' 
            ? '10.10.10.20' 
            : `${kind === 'admin_web' ? 'admin' : kind === 'user_web' ? 'user' : kind}.${codeSlug}.example.com`;
          setHosts((h) => ({ ...h, [kind]: autoHost }));
        }
        return [...prev, kind];
      }
    });
  };

  // Toggle module selection
  const toggleModule = (key: string) => {
    setModules((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  // Batch module selection
  const selectAllModules = () => {
    setModules(UNIFIED_CALL_MODULES.map((m) => m.menu as string));
    showToast('已全选所有可用功能模块', 'success');
  };

  const clearAllModules = () => {
    setModules([]);
    showToast('已清空模块勾选（可随时跳过）', 'info');
  };

  const selectCoreModules = () => {
    const coreKeys = UNIFIED_CALL_MODULES.filter(m => m.kernel === '业务核' || m.menu === 'unified_org_structure').map(m => m.menu as string);
    setModules(coreKeys);
    showToast('已应用核心推荐组件', 'success');
  };

  // Auto fill recommendation hosts in Step 3
  const fillRecommendedHosts = () => {
    const newHosts = { ...hosts };
    selectedKinds.forEach((kind) => {
      if (kind === 'intranet') {
        newHosts[kind] = '10.10.10.20';
      } else {
        const prefix = kind === 'admin_web' ? 'admin' : kind === 'user_web' ? 'user' : kind;
        newHosts[kind] = `${prefix}.${codeSlug}.example.com`;
      }
    });
    setHosts(newHosts);
    showToast('已为选中的访问端生成推荐域名', 'success');
  };

  // Validation
  const isStep1Valid = Boolean(productName.trim());

  // Step navigation rules
  const handleNext = () => {
    setAttemptedNext(true);
    if (step === 1) {
      if (!productName.trim()) {
        showToast('请填写产品名称', 'warning');
        return;
      }
      setAttemptedNext(false);
      setStep(2);
      return;
    }

    if (step === 2) {
      // Step 2 (Components) is optional, can proceed directly
      setAttemptedNext(false);
      setStep(3);
      return;
    }

    if (step === 3) {
      // Step 3 (Endpoints) is optional, but if endpoints selected without domain, auto fill
      if (selectedKinds.length > 0) {
        let missing = false;
        const newHosts = { ...hosts };
        selectedKinds.forEach((k) => {
          if (!newHosts[k]?.trim()) {
            missing = true;
            newHosts[k] = k === 'intranet' ? '10.10.10.20' : `${k === 'admin_web' ? 'admin' : k === 'user_web' ? 'user' : k}.${codeSlug}.example.com`;
          }
        });
        if (missing) {
          setHosts(newHosts);
          showToast('已自动补齐已选访问端的推荐域名', 'info');
        }
      }
      setAttemptedNext(false);
      setStep(4);
      return;
    }
  };

  // Skip step 2 (Product components)
  const handleSkipStep2 = () => {
    showToast('已跳过组件库勾选，后续可在产品详情页随时配置', 'info');
    setStep(3);
  };

  // Skip step 2 directly to confirmation
  const handleSkipToStep4FromStep2 = () => {
    showToast('已跳过后续步骤，后续可在产品详情页随时配置', 'info');
    setStep(4);
  };

  // Skip step 3 (Endpoints)
  const handleSkipStep3 = () => {
    showToast('已跳过访问端配置，后续可在产品详情页随时开通', 'info');
    setStep(4);
  };

  // Check whether form is dirty to protect accidental exit
  const isDirty = Boolean(productName || customAvatarPreview);

  const handleCancelClick = () => {
    if (isDirty) {
      setShowExitConfirm(true);
    } else {
      onCancel();
    }
  };

  const buildPayload = (status: AppInstance['status']) => {
    const productId = initialProduct?.id || `prod-${Date.now()}`;
    const instanceId = `ins-${Date.now()}`;
    const finalVersion = initialProduct?.version || 'V1.0';
    const finalCode = initialProduct?.code || generatedCode;
    const finalInstanceName = `${productName.trim() || '业务系统'}默认实例`;

    const product: BusinessProduct = initialProduct
      ? {
          ...initialProduct,
          name: productName.trim() || initialProduct.name,
          code: finalCode,
          type: productType,
          version: finalVersion,
          description: description.trim() || initialProduct.description,
          themeColor,
          themeColorName,
          avatar,
          avatarType,
          iconBg,
          createdAt: createdAt || initialProduct.createdAt,
          modules,
        }
      : {
          id: productId,
          name: productName.trim(),
          code: finalCode,
          type: productType,
          version: finalVersion,
          description: description.trim() || '无详细说明',
          themeColor,
          themeColorName,
          avatar,
          avatarType,
          iconBg,
          modules,
          createdAt: createdAt || new Date().toISOString().slice(0, 10),
        };

    const instance: AppInstance = {
      id: instanceId,
      productId,
      name: finalInstanceName,
      deployMode: 'SaaS',
      status,
      orgScope: '指定客户机构',
      isolation: '租户库隔离',
      createdAt: new Date().toISOString().slice(0, 10),
      privateModules: modules.length > 0 ? buildPrivateModules(modules, finalVersion) : [],
    };

    const stamp = Date.now();
    const validKinds = selectedKinds.filter((k) => (hosts[k] || '').trim().length > 0);
    const kindsToUse = validKinds.length > 0 ? validKinds : selectedKinds;

    const endpoints: AccessEndpoint[] = kindsToUse.map((kind, index) => {
      const def = ENDPOINT_KINDS.find((item) => item.key === kind)!;
      const domainId = `dom-${kind}-${stamp}-${index}`;
      const defaultHost = kind === 'intranet' ? '10.10.10.20' : `${kind === 'admin_web' ? 'admin' : kind === 'user_web' ? 'user' : kind}.${codeSlug}.example.com`;
      return {
        id: `ep-${kind}-${stamp}-${index}`,
        instanceId,
        name: def?.name || kind,
        kind,
        homePage: kind === 'admin_web' ? '管理首页' : '工作台',
        menuProfile: `${def?.name || kind}菜单`,
        permissionProfile: kind === 'admin_web' ? '管理员' : '业务用户',
        modules,
        domainId,
      };
    });

    const domainList: DomainRecord[] = endpoints.map((ep) => {
      const defaultHost = ep.kind === 'intranet' ? '10.10.10.20' : `${ep.kind === 'admin_web' ? 'admin' : ep.kind === 'user_web' ? 'user' : ep.kind}.${codeSlug}.example.com`;
      return {
        id: ep.domainId!,
        host: (hosts[ep.kind] || '').trim() || defaultHost,
        kind: ep.kind === 'intranet' ? 'intranet' : 'sub',
        ssl: ep.kind === 'intranet' ? 'none' : 'normal',
        status: 'bound',
        endpointId: ep.id,
        instanceId,
      };
    });

    return { product, instance, endpoints, domains: domainList };
  };

  // Filter modules in Step 2
  const filteredModules = useMemo(() => {
    return UNIFIED_CALL_MODULES.filter((m) => {
      const matchKernel = moduleFilterKernel === 'all' || m.kernel === moduleFilterKernel;
      const matchKeyword = !moduleSearchKeyword.trim() || 
        m.title.toLowerCase().includes(moduleSearchKeyword.toLowerCase()) || 
        m.description.toLowerCase().includes(moduleSearchKeyword.toLowerCase());
      return matchKernel && matchKeyword;
    });
  }, [moduleFilterKernel, moduleSearchKeyword]);

  // Count modules per kernel
  const kernelStats = useMemo(() => {
    const businessCount = modules.filter(k => UNIFIED_CALL_MODULES.find(m => m.menu === k)?.kernel === '业务核').length;
    const orgCount = modules.filter(k => UNIFIED_CALL_MODULES.find(m => m.menu === k)?.kernel === '组织核').length;
    const openCount = modules.filter(k => UNIFIED_CALL_MODULES.find(m => m.menu === k)?.kernel === '开通核').length;
    return { businessCount, orgCount, openCount };
  }, [modules]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Invisible file input for product LOGO upload */}
      <input
        ref={avatarFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileUpload}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-60 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 transition-all animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : toastMessage.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">确认退出开通向导？</h4>
                <p className="text-xs text-slate-500 mt-0.5">当前已填写的配置将不会被保存。</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
              >
                继续编辑
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  onCancel();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                放弃并退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Card Container */}
      <div
        className={`bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isMaximized ? 'fixed inset-3 z-50 h-[calc(100vh-24px)]' : 'max-w-5xl max-h-[92vh] h-full'
        }`}
      >
        {/* Modal Header */}
        <div className="bg-white px-5 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1e376b] text-white flex items-center justify-center shadow-2xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 truncate">
                  {initialProduct ? `开通业务系统 · ${initialProduct.name}` : '新增产品 / 开通业务系统'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1e376b] border border-blue-200/60 shrink-0">
                  向导式配置
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                三步配置基础、组件与访问端，后续均可在详情页随时灵活调整
              </p>
            </div>
          </div>

          {/* Stepper Tabs in Modal Header (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            {STEPS.map((item) => {
              const done = step > item.step;
              const active = step === item.step;
              const clickable = item.step === 1 || isStep1Valid;
              return (
                <button
                  key={item.step}
                  type="button"
                  disabled={!clickable}
                  onClick={() => {
                    if (clickable) {
                      setStep(item.step);
                    } else {
                      setAttemptedNext(true);
                      showToast('请先完善第一步「基础信息配置」', 'warning');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-white text-[#1e376b] shadow-xs'
                      : done
                      ? 'text-emerald-700 hover:bg-emerald-50 cursor-pointer'
                      : clickable
                      ? 'text-slate-600 hover:bg-slate-200/60 cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                  title={item.desc}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      active
                        ? 'bg-[#1e376b] text-white'
                        : done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {done ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : item.step}
                  </span>
                  <span>{item.label}</span>
                  {item.optional && (
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                      (可跳过)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Maximize & Close */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              title={isMaximized ? '还原窗口' : '最大化窗口'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer transition-colors"
              title="关闭弹窗"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Small Screen Stepper Bar */}
        <div className="md:hidden bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
          {STEPS.map((item) => {
            const done = step > item.step;
            const active = step === item.step;
            return (
              <div 
                key={item.step} 
                className={`flex items-center gap-1 text-[11px] font-bold whitespace-nowrap px-2 py-1 rounded ${
                  active ? 'text-[#1e376b] bg-white shadow-2xs' : done ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                <span>{item.step}.</span>
                <span>{item.label}</span>
                {item.optional && <span className="text-[10px] text-slate-400">(跳过)</span>}
              </div>
            );
          })}
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5">
          {/* ================= STEP 1: 基础信息配置 (必填) ================= */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5 shadow-2xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1e376b]" />
                    第一步：基础信息配置
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    配置产品基础名称、产品类型、产品LOGO与品牌主题色。
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  带 * 为必填项
                </span>
              </div>

              {/* 1.1 Product Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* 产品名称 */}
                <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5 sm:col-span-2">
                  <span className="flex items-center justify-between">
                    <span>产品名称 <span className="text-rose-500">*</span></span>
                    {attemptedNext && !productName.trim() && (
                      <span className="text-[11px] text-rose-500 font-normal">请填写产品名称</span>
                    )}
                  </span>
                  <input 
                    value={productName} 
                    onChange={(e) => handleProductNameChange(e.target.value)} 
                    placeholder="例如：信息通报系统、网络安全指挥系统" 
                    className={`px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${
                      attemptedNext && !productName.trim() 
                        ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:outline-none' 
                        : 'border-slate-200 focus:border-[#1e376b] focus:outline-none'
                    }`} 
                  />
                </label>

                {/* 产品类型 */}
                <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5 sm:col-span-1">
                  <span>产品类型</span>
                  <select 
                    value={productType} 
                    onChange={(e) => setProductType(e.target.value as BusinessProduct['type'])} 
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white focus:border-[#1e376b] focus:outline-none cursor-pointer"
                  >
                    <option value="业务应用">业务应用 (面向具体业务流程)</option>
                    <option value="基础服务">基础服务 (通用中台底座)</option>
                  </select>
                </label>

                {/* 创建日期 */}
                <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5 sm:col-span-1">
                  <span>创建日期</span>
                  <div className="relative">
                    <input 
                      type="date"
                      value={createdAt} 
                      onChange={(e) => setCreatedAt(e.target.value)} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium bg-white focus:border-[#1e376b] focus:outline-none cursor-pointer" 
                    />
                  </div>
                </label>
              </div>

              {/* 1.2 产品唯一LOGO与品牌主题色 */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>产品LOGO与品牌色</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.2 rounded-full border border-blue-200/80">
                      单LOGO唯一生效
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">支持 PNG/JPG/SVG/WebP 格式图片</span>
                </div>

                {customAvatarPreview || avatarType === 'image' ? (
                  /* Uploaded Image Active Display */
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={customAvatarPreview || avatar}
                        alt="产品LOGO"
                        className="w-14 h-14 rounded-xl object-contain bg-white border border-emerald-200 p-1.5 shadow-xs shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">当前产品LOGO</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            唯一展示生效
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          已上传独立产品LOGO图片，重新上传将直接覆盖替换当前LOGO。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => avatarFileRef.current?.click()}
                        className="px-3 py-1.5 border border-slate-300 hover:border-[#1e376b] text-slate-700 hover:text-[#1e376b] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-white hover:bg-blue-50/30 transition-colors shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        更换LOGO
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAvatar('Flame');
                          setAvatarType('icon');
                          setIconBg('from-[#1e376b] via-blue-900 to-slate-900');
                          setCustomAvatarPreview(null);
                          showToast('已恢复系统默认图标LOGO', 'info');
                        }}
                        className="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      >
                        恢复默认
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Single Product LOGO Upload Dropzone */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingAvatar(true);
                    }}
                    onDragLeave={() => setIsDraggingAvatar(false)}
                    onDrop={handleAvatarDrop}
                    onClick={() => avatarFileRef.current?.click()}
                    className={`p-4 border-2 border-dashed rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer transition-all ${
                      isDraggingAvatar
                        ? 'border-[#1e376b] bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-[#1e376b] bg-slate-50/50 hover:bg-blue-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#1e376b] flex items-center justify-center shrink-0 shadow-2xs">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>点击或拖拽上传产品LOGO</span>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            单LOGO唯一展示
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          推荐上传透明背景正方形 PNG / SVG / JPG / WebP，文件小于 2MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#1e376b] shadow-2xs shrink-0 pointer-events-none"
                    >
                      选择LOGO上传
                    </button>
                  </div>
                )}

                {/* Brand Theme Color & Fallback Icon Presets */}
                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-slate-500" />
                      品牌主题色
                    </span>
                    <span className="text-[11px] text-slate-400">用于产品头部背景、重点标签与品牌视觉</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {THEME_COLOR_PRESETS.map((preset) => {
                      const colorHex = preset.color || preset.hex;
                      const isSelected = themeColor.toLowerCase() === colorHex.toLowerCase();
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleSelectThemeColor(preset)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'border-slate-800 bg-slate-900 text-white shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: colorHex }}
                          />
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 1.3 产品描述 */}
              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">产品描述</span>
                  <span className="text-[11px] text-slate-400">选填 · 描述产品业务场景与核心功能</span>
                </div>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={2} 
                  placeholder="简要说明此产品的定位、核心解决的业务场景及服务受众..." 
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:border-[#1e376b] focus:outline-none resize-y min-h-[56px]" 
                />
              </div>
            </div>
          )}

          {/* ================= STEP 2: 产品组件库勾选 (可跳过) ================= */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5 shadow-2xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-[#1e376b]" />
                    第二步：产品组件库勾选
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      可选 · 可随时跳过
                    </span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSkipStep2}
                      className="text-xs text-[#1e376b] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>跳过此步 (进入访问端配置)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  选择「{productName || '此产品'}」需接入的业务核、组织核与开通核能力。也可直接跳过，后续在产品详情页随时配置。
                </p>
              </div>

              {/* Notice Banner: Can be skipped */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1e376b] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">可选步骤说明：</strong>
                    暂不确定所需组件？您可以直接跳过此步，产品将以纯净架构开通。开通后可前往「产品详情页 - 组件能力库」随时按需接入。
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleSkipStep2}
                    className="px-3 py-1.5 bg-white border border-blue-200 hover:border-blue-300 text-[#1e376b] text-xs font-bold rounded-lg shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <span>跳过此步</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipToStep4FromStep2}
                    className="px-3 py-1.5 bg-[#1e376b] hover:bg-[#14264c] text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <span>跳过后续，直接开通</span>
                    <FastForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2.1 Filter & Actions Bar */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span>勾选能力组件</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        modules.length > 0 ? 'bg-blue-50 text-[#1e376b] border border-blue-200/60' : 'bg-slate-100 text-slate-500'
                      }`}>
                        已选 {modules.length} / {UNIFIED_CALL_MODULES.length}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>业务核: <strong className="text-slate-700">{kernelStats.businessCount}</strong></span>
                      <span>·</span>
                      <span>组织核: <strong className="text-slate-700">{kernelStats.orgCount}</strong></span>
                      <span>·</span>
                      <span>开通核: <strong className="text-slate-700">{kernelStats.openCount}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={selectCoreModules}
                      className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      推荐核心
                    </button>
                    <button
                      type="button"
                      onClick={selectAllModules}
                      className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold cursor-pointer"
                    >
                      全选
                    </button>
                    <button
                      type="button"
                      onClick={clearAllModules}
                      className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium cursor-pointer"
                    >
                      清空
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1">
                    {(['all', '业务核', '组织核', '开通核'] as const).map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setModuleFilterKernel(k)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          moduleFilterKernel === k
                            ? 'bg-[#1e376b] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {k === 'all' ? '全部内核' : k}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      value={moduleSearchKeyword}
                      onChange={(e) => setModuleSearchKeyword(e.target.value)}
                      placeholder="搜索模块名称 / 说明..."
                      className="w-full pl-7 pr-7 py-1 border border-slate-200 rounded-md text-xs bg-white focus:border-[#1e376b] focus:outline-none"
                    />
                    {moduleSearchKeyword && (
                      <button
                        type="button"
                        onClick={() => setModuleSearchKeyword('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {filteredModules.map((mod) => {
                    const key = mod.menu as string;
                    const selected = modules.includes(key);
                    return (
                      <button 
                        key={key} 
                        type="button" 
                        onClick={() => toggleModule(key)} 
                        className={`text-left px-3 py-2 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          selected 
                            ? 'border-[#1e376b] bg-blue-50/70 shadow-2xs' 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 truncate">{mod.title}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              mod.kernel === '业务核' 
                                ? 'bg-blue-100/70 text-blue-800' 
                                : mod.kernel === '组织核'
                                ? 'bg-emerald-100/70 text-emerald-800'
                                : 'bg-amber-100/70 text-amber-800'
                            }`}>
                              {mod.kernel}
                            </span>
                          </div>
                          <span className="block text-slate-400 mt-0.5 leading-relaxed text-[11px] truncate">
                            {mod.description}
                          </span>
                        </div>
                        <span className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
                          selected ? 'bg-[#1e376b] border-[#1e376b] text-white' : 'border-slate-300 text-transparent'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: 访问端配置 (可跳过) ================= */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#1e376b]" />
                    第三步：访问端配置与域名绑定
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      可选 · 可随时跳过
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    为「{productName || '此产品'}」选定访问入口与域名。也可直接跳过，后续在产品详情页随时增设。
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fillRecommendedHosts}
                    className="px-3 py-1.5 rounded-lg border border-[#1e376b] bg-blue-50 text-[#1e376b] text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    一键生成推荐域名
                  </button>
                  <button
                    type="button"
                    onClick={handleSkipStep3}
                    className="text-xs text-[#1e376b] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>跳过此步 (去确认开通)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notice Banner: Can be skipped */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1e376b] flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">可选步骤说明：</strong>
                    暂未确定访问域名或终端架构？您可以直接跳过此步。开通后可前往「产品详情页 - 访问端管理」随时一键开通 Web PC 端、移动端或微信小程序端，并随时绑定域名。
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSkipStep3}
                  className="px-3 py-1.5 bg-[#1e376b] hover:bg-[#14264c] text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer flex items-center gap-1 shrink-0 self-end sm:self-auto transition-colors"
                >
                  <span>跳过此步，直接去开通</span>
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Endpoints Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ENDPOINT_KINDS.map((kind) => {
                  const selected = selectedKinds.includes(kind.key);
                  const placeholder = kind.key === 'intranet' 
                    ? '10.10.10.20' 
                    : `${kind.key === 'admin_web' ? 'admin' : kind.key === 'user_web' ? 'user' : kind.key}.${codeSlug}.example.com`;
                  const hostVal = hosts[kind.key] || '';

                  return (
                    <div 
                      key={kind.key} 
                      className={`rounded-xl border p-4 transition-all ${
                        selected 
                          ? 'border-[#1e376b] bg-blue-50/40 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <button 
                        type="button" 
                        onClick={() => toggleKind(kind.key)} 
                        className="w-full text-left cursor-pointer flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{kind.name}</span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {kind.typeLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{kind.description}</p>
                        </div>
                        <span className={`w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                          selected ? 'bg-[#1e376b] border-[#1e376b] text-white' : 'border-slate-300 text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </button>

                      {selected && (
                        <div className="mt-3 pt-3 border-t border-blue-100 flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                            <span>访问域名 / IP *</span>
                            <button
                              type="button"
                              onClick={() => {
                                setHosts(prev => ({
                                  ...prev,
                                  [kind.key]: kind.key === 'intranet' ? '10.10.10.20' : `${kind.key === 'admin_web' ? 'admin' : kind.key === 'user_web' ? 'user' : kind.key}.${codeSlug}.example.com`
                                }));
                              }}
                              className="text-[10px] text-[#1e376b] font-normal hover:underline cursor-pointer"
                            >
                              填入推荐
                            </button>
                          </label>
                          <input 
                            value={hostVal} 
                            onChange={(e) => setHosts((h) => ({ ...h, [kind.key]: e.target.value }))} 
                            placeholder={placeholder} 
                            className="px-2.5 py-1.5 border rounded-lg text-xs font-mono font-medium border-slate-200 focus:border-[#1e376b] focus:outline-none bg-white" 
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 4: 确认开通 ================= */}
          {step === 4 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5 shadow-2xs">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  第四步：确认配置概览并开通
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  核对产品基础定义、产品组件与访问端。确认后将立即创建并正式生效。已跳过的步骤后续均可在产品详情页随时按需补充。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 基础信息配置 Card */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">1. 基础信息配置</span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[11px] text-[#1e376b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> 修改
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-2xs overflow-hidden shrink-0 ${
                          avatarType === 'icon' ? `bg-gradient-to-br ${iconBg} text-white` : 'bg-white border border-slate-200 p-1'
                        }`}
                      >
                        {avatarType === 'image' ? (
                          <img
                            src={customAvatarPreview || avatar}
                            alt="产品LOGO"
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          (() => {
                            const IconComponent = AVATAR_ICON_MAP[avatar] || LayersIcon;
                            return <IconComponent className="w-6 h-6 text-white" />;
                          })()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-slate-900 truncate">
                          {productName || initialProduct?.name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                            {productType}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-bold rounded text-white"
                            style={{ backgroundColor: themeColor }}
                          >
                            {themeColorName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-2 bg-white/80 p-2 rounded-lg border border-slate-200/60">
                      {description || '无详细描述'}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>创建日期：{createdAt}</span>
                  </div>
                </div>

                {/* 2. 产品组件库 Card (Highlight if configured or skipped) */}
                <div className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                  modules.length > 0 ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/40 border-amber-200/80'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">2. 产品组件库</span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-[11px] text-[#1e376b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> {modules.length > 0 ? '调整' : '去勾选'}
                      </button>
                    </div>

                    {modules.length > 0 ? (
                      <>
                        <div className="text-sm font-black text-slate-900 mt-2.5 flex items-center gap-2">
                          <span>已接入 {modules.length} 个功能组件</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                          <span>业务核: <strong className="text-slate-700">{kernelStats.businessCount}</strong></span>
                          <span>·</span>
                          <span>组织核: <strong className="text-slate-700">{kernelStats.orgCount}</strong></span>
                          <span>·</span>
                          <span>开通核: <strong className="text-slate-700">{kernelStats.openCount}</strong></span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2.5 max-h-[100px] overflow-y-auto">
                          {modules.slice(0, 8).map((modKey) => {
                            const mod = UNIFIED_CALL_MODULES.find(m => m.menu === modKey);
                            return (
                              <span key={modKey} className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">
                                {mod?.title || modKey}
                              </span>
                            );
                          })}
                          {modules.length > 8 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-[#1e376b] rounded font-bold">
                              +{modules.length - 8} 更多
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="mt-2.5 flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full w-fit">
                          <Info className="w-3 h-3" />
                          已跳过组件勾选
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          当前暂未接入组件，将以纯净架构开通。开通后可前往「产品详情页 - 组件能力库」随时按需接入。
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`text-[11px] font-bold px-2 py-1 rounded ${
                    modules.length > 0 ? 'text-[#1e376b] bg-blue-100/60' : 'text-slate-600 bg-slate-100'
                  }`}>
                    {modules.length > 0 ? `已配置 ${modules.length} 个组件` : '稍后在详情页补充配置'}
                  </div>
                </div>

                {/* 3. 访问端配置 Card (Highlight if configured or skipped) */}
                <div className={`rounded-xl border p-4 flex flex-col justify-between gap-3 ${
                  selectedKinds.length > 0 ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/40 border-amber-200/80'
                }`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">3. 访问端配置</span>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="text-[11px] text-[#1e376b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" /> {selectedKinds.length > 0 ? '调整' : '去配置'}
                      </button>
                    </div>

                    {selectedKinds.length > 0 ? (
                      <>
                        <div className="text-sm font-black text-slate-900 mt-2.5">
                          开通 {selectedKinds.length} 个访问端
                        </div>
                        <div className="flex flex-col gap-1.5 mt-2 max-h-[120px] overflow-y-auto">
                          {selectedKinds.map((kind) => {
                            const def = ENDPOINT_KINDS.find((item) => item.key === kind);
                            return (
                              <div key={kind} className="text-[11px] flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-700">{def?.name}:</span>
                                <span className="font-mono text-slate-500 truncate max-w-[130px]">
                                  {hosts[kind] || (kind === 'intranet' ? '10.10.10.20' : `${kind}.${codeSlug}.example.com`)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="mt-2.5 flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full w-fit">
                          <Info className="w-3 h-3" />
                          已跳过访问端配置
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          当前暂未配置访问端与域名。开通后可前往「产品详情页 - 访问端管理」随时一键开通 Web 端、移动端或小程序。
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`text-[11px] font-bold px-2 py-1 rounded ${
                    selectedKinds.length > 0 ? 'text-emerald-700 bg-emerald-100/60' : 'text-slate-600 bg-slate-100'
                  }`}>
                    {selectedKinds.length > 0 ? '域名路由解析已就绪' : '稍后在详情页增设终端'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3 shadow-xs shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 font-mono">
              步骤 {step} / 4
            </span>
            <button
              type="button"
              onClick={() => (step === 1 ? handleCancelClick() : setStep((step - 1) as AppCreateWizardStep))}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {step === 1 ? '取消退出' : '上一步'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Step 2 specific actions: Skip options */}
            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={handleSkipStep2}
                  className="px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  跳过此步
                </button>
                <button
                  type="button"
                  onClick={handleSkipToStep4FromStep2}
                  className="px-3.5 py-2 border border-blue-200 text-[#1e376b] hover:bg-blue-50/50 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  跳过后续直接开通
                </button>
              </>
            )}

            {/* Step 3 specific action: Skip option */}
            {step === 3 && (
              <button
                type="button"
                onClick={handleSkipStep3}
                className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
                跳过此步，直接开通
              </button>
            )}

            {/* Next / Finish actions */}
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                {step === 1 ? '下一步：产品组件库勾选' : step === 2 ? '下一步：访问端配置' : '下一步：确认开通'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onFinish(buildPayload('draft'))}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer"
                >
                  保存为草稿
                </button>
                <button
                  type="button"
                  onClick={() => onFinish(buildPayload('running'))}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  正式开通并进入控制台
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
