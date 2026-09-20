import React, { useMemo, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
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
  Layers as LayersIcon
} from 'lucide-react';
import { AppCreateWizardHeader, AppCreateWizardStep } from './AppCreateWizardHeader';
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

const STEPS: Array<{ step: AppCreateWizardStep; label: string }> = [
  { step: 1, label: '定义产品' },
  { step: 2, label: '创建实例' },
  { step: 3, label: '配置访问端与域名' },
  { step: 4, label: '确认与发布' },
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
  const [step, setStep] = useState<AppCreateWizardStep>(initialProduct ? 2 : 1);
  
  // Step 1 states
  const [productName, setProductName] = useState(initialProduct?.name || '');
  const [productCode, setProductCode] = useState(initialProduct?.code || '');
  const [productType, setProductType] = useState<BusinessProduct['type']>(initialProduct?.type || '业务应用');
  const [version, setVersion] = useState(initialProduct?.version || 'V1.0');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [themeColor, setThemeColor] = useState(initialProduct?.themeColor || '#1e376b');
  const [themeColorName, setThemeColorName] = useState(initialProduct?.themeColorName || '经典深蓝');
  const [avatar, setAvatar] = useState(initialProduct?.avatar || 'Flame');
  const [avatarType, setAvatarType] = useState<'icon' | 'image'>(initialProduct?.avatarType || 'icon');
  const [iconBg, setIconBg] = useState(initialProduct?.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900');
  const [createdAt, setCreatedAt] = useState(initialProduct?.createdAt || new Date().toISOString().slice(0, 10));
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(
    initialProduct?.avatarType === 'image' ? initialProduct.avatar : null
  );
  const avatarFileRef = useRef<HTMLInputElement>(null);

  const [modules, setModules] = useState<string[]>(
    initialProduct?.modules || UNIFIED_CALL_MODULES.map((item) => item.menu as string)
  );
  const [moduleFilterKernel, setModuleFilterKernel] = useState<string>('all');

  // Step 2 states
  const [instanceName, setInstanceName] = useState(initialProduct ? `${initialProduct.name}系统-北京实例` : '');
  const [deployMode, setDeployMode] = useState<AppInstance['deployMode']>('SaaS');
  const [orgScope, setOrgScope] = useState('指定客户机构');

  // Step 3 states
  const [selectedKinds, setSelectedKinds] = useState<EndpointKind[]>(['admin_web', 'user_web']);
  const [hosts, setHosts] = useState<Partial<Record<EndpointKind, string>>>({
    admin_web: '',
    user_web: '',
    h5: '',
    pad: '',
    intranet: '',
    wechat: '',
  });

  // Validation & UI state
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handle custom avatar upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('请上传有效的图片格式文件 (PNG, JPG, SVG 等)', 'warning');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('图片大小请小于 2MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomAvatarPreview(result);
      setAvatar(result);
      setAvatarType('image');
      showToast('产品头像上传成功', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (preset: typeof PRESET_AVATARS[number]) => {
    setAvatar(preset.name);
    setAvatarType('icon');
    setIconBg(preset.bg);
    setCustomAvatarPreview(null);
  };

  const handleSelectThemeColor = (preset: typeof THEME_COLOR_PRESETS[number]) => {
    setThemeColor(preset.color);
    setThemeColorName(preset.name);
  };

  const codeSlug = productCode.trim().toLowerCase() || 'app';

  // Toggle endpoint
  const toggleKind = (kind: EndpointKind) => {
    setSelectedKinds((prev) => {
      if (prev.includes(kind)) {
        return prev.filter((item) => item !== kind);
      } else {
        // If opening and host is empty, provide smart default placeholder
        if (!hosts[kind]) {
          const autoHost = kind === 'intranet' ? '10.10.10.20' : `${kind === 'admin_web' ? 'admin' : kind === 'user_web' ? 'user' : kind}.${codeSlug}.example.com`;
          setHosts((h) => ({ ...h, [kind]: autoHost }));
        }
        return [...prev, kind];
      }
    });
  };

  // Toggle module
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
    showToast('已清空模块选择', 'info');
  };

  const selectCoreModules = () => {
    const coreKeys = UNIFIED_CALL_MODULES.filter(m => m.kernel === '业务核' || m.menu === 'unified_org_structure').map(m => m.menu as string);
    setModules(coreKeys);
    showToast('已应用核心推荐模块组合', 'success');
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

  // Check form validation
  const isStep1Valid = Boolean(productName.trim() && productCode.trim() && modules.length > 0);
  const isStep2Valid = Boolean(instanceName.trim());
  const isStep3Valid = selectedKinds.length > 0 && selectedKinds.every((kind) => (hosts[kind] || '').trim());

  const canNext = useMemo(() => {
    if (step === 1) return isStep1Valid;
    if (step === 2) return isStep2Valid;
    if (step === 3) return isStep3Valid;
    return true;
  }, [step, isStep1Valid, isStep2Valid, isStep3Valid]);

  const handleNext = () => {
    setAttemptedNext(true);
    if (!canNext) {
      if (step === 1) {
        if (!productName.trim()) showToast('请填写产品名称', 'warning');
        else if (!productCode.trim()) showToast('请填写产品编码', 'warning');
        else if (modules.length === 0) showToast('请至少选择1个产品模块', 'warning');
      } else if (step === 2) {
        if (!instanceName.trim()) showToast('请填写实例名称', 'warning');
      } else if (step === 3) {
        if (selectedKinds.length === 0) showToast('请至少勾选一个访问端', 'warning');
        else showToast('请补全已选访问端的域名或内网地址', 'warning');
      }
      return;
    }
    setAttemptedNext(false);
    setStep((prev) => (prev + 1) as AppCreateWizardStep);
  };

  // Check whether form is dirty to protect back action
  const isDirty = Boolean(productName || productCode || instanceName);

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
    const product: BusinessProduct = initialProduct
      ? {
          ...initialProduct,
          name: productName.trim() || initialProduct.name,
          code: productCode.trim().toUpperCase() || initialProduct.code,
          type: productType,
          version: version.trim() || initialProduct.version,
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
          code: productCode.trim().toUpperCase(),
          type: productType,
          version: version.trim() || 'V1.0',
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
      name: instanceName.trim(),
      deployMode,
      status,
      orgScope: orgScope.trim() || '指定客户机构',
      isolation: deployMode === '专网' ? '物理专网' : deployMode === '专有云' ? '独立专区' : '租户库隔离',
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

  // Filter modules in Step 1
  const filteredModules = useMemo(() => {
    if (moduleFilterKernel === 'all') return UNIFIED_CALL_MODULES;
    return UNIFIED_CALL_MODULES.filter((m) => m.kernel === moduleFilterKernel);
  }, [moduleFilterKernel]);

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] px-6 py-5 text-slate-800 relative">
      {/* Toast Notice */}
      {toastMessage && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-xs font-bold text-white transition-all animate-in fade-in duration-200 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-600'
            : toastMessage.type === 'warning'
              ? 'bg-amber-600'
              : 'bg-[#1e376b]'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-200" />}
          {toastMessage.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-200" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-200" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">确认退出开通向导？</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              当前正在配置的业务系统信息尚未保存，直接退出将丢失未保存的内容。
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                继续编辑
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                确定退出
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-4">
        <AppCreateWizardHeader
          currentStep={step}
          onBackToList={handleCancelClick}
          onGoStep={(targetStep) => {
            // Allow jumping directly to previous steps, or next if current is valid
            if (targetStep < step || canNext) {
              setStep(targetStep);
            } else {
              setAttemptedNext(true);
              showToast('请先完善当前步骤必填项', 'warning');
            }
          }}
          backLabel="返回产品管理"
          badge={initialProduct ? `为「${initialProduct.name}」开通新实例` : "开通一套业务系统"}
          steps={STEPS}
        />

        {/* STEP 1: 定义产品能力 */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1e376b]" />
                  第一步：定义产品能力
                </h1>
                <p className="text-xs text-slate-500 mt-1">这里只定义产品本身的通用能力和所支持的功能模块，不绑定具体客户与域名。</p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                必填项带 * 标识
              </span>
            </div>

            {/* Basic Info Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 产品名称 */}
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <span className="flex items-center justify-between">
                  <span>产品名称 <span className="text-rose-500">*</span></span>
                  {attemptedNext && !productName.trim() && (
                    <span className="text-[11px] text-rose-500 font-normal">请填写产品名称</span>
                  )}
                </span>
                <input 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  placeholder="例如：信息通报、应急指挥系统" 
                  className={`px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    attemptedNext && !productName.trim() 
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:outline-none' 
                      : 'border-slate-200 focus:border-[#1e376b] focus:outline-none'
                  }`} 
                />
              </label>

              {/* 产品编码 */}
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <span className="flex items-center justify-between">
                  <span>产品编码 <span className="text-rose-500">*</span></span>
                  {attemptedNext && !productCode.trim() && (
                    <span className="text-[11px] text-rose-500 font-normal">请填写产品编码</span>
                  )}
                </span>
                <div className="relative">
                  <input 
                    value={productCode} 
                    onChange={(e) => setProductCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''))} 
                    placeholder="例如：TB、ZGY、COMMAND" 
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono font-bold uppercase transition-colors ${
                      attemptedNext && !productCode.trim() 
                        ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:outline-none' 
                        : 'border-slate-200 focus:border-[#1e376b] focus:outline-none'
                    }`} 
                  />
                  {productCode && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                      大写字符
                    </span>
                  )}
                </div>
                {productCode && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    💡 自动建议标识: <span className="text-[#1e376b] font-semibold">{codeSlug}</span> · 用于默认域名生成
                  </span>
                )}
              </label>

              {/* 产品类型 */}
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <span>产品类型</span>
                <select 
                  value={productType} 
                  onChange={(e) => setProductType(e.target.value as BusinessProduct['type'])} 
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium bg-white focus:border-[#1e376b] focus:outline-none cursor-pointer"
                >
                  <option value="业务应用">业务应用（面向终端用户及机构）</option>
                  <option value="基础服务">基础服务（底层能力与数据中枢）</option>
                </select>
              </label>

              {/* 创建日期 */}
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>创建日期</span>
                </span>
                <input 
                  type="date"
                  value={createdAt} 
                  onChange={(e) => setCreatedAt(e.target.value)} 
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium bg-white focus:border-[#1e376b] focus:outline-none cursor-pointer" 
                />
              </label>
            </div>

            {/* 产品主题色 */}
            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span>产品主题色</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {themeColorName} <span className="font-mono text-slate-400 font-normal">({themeColor})</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {THEME_COLOR_PRESETS.map((preset) => {
                  const isSelected = themeColor.toLowerCase() === preset.color.toLowerCase();
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectThemeColor(preset)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#1e376b] bg-blue-50/60 ring-2 ring-[#1e376b]/20 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: preset.color }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{preset.color}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 产品头像 */}
            <div className="flex flex-col gap-2.5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>产品头像</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <span className="text-[11px] text-slate-400">可选择预设矢量图标或上传自定义图片 (小于 2MB)</span>
              </div>

              {/* Avatar Live Preview and Pickers */}
              <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0 ${
                      avatarType === 'icon' ? `bg-gradient-to-br ${iconBg}` : 'bg-white border border-slate-200'
                    }`}
                    style={avatarType === 'icon' ? { borderColor: themeColor } : undefined}
                  >
                    {avatarType === 'image' ? (
                      <img
                        src={customAvatarPreview || avatar}
                        alt="产品头像预览"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      (() => {
                        const IconComponent = AVATAR_ICON_MAP[avatar] || LayersIcon;
                        return <IconComponent className="w-7 h-7 text-white drop-shadow-xs" />;
                      })()
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <span>当前选中头像</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#1e376b]">
                        {avatarType === 'image' ? '自定义图片' : `预设图标: ${avatar}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">将展示在产品管理列表、应用工作台与控制台顶部看板</p>
                  </div>
                </div>

                {/* Upload custom image button */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    ref={avatarFileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleAvatarFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>上传自定义头像图片</span>
                  </button>
                  {avatarType === 'image' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar('Flame');
                        setAvatarType('icon');
                        setIconBg('from-orange-500 to-amber-600');
                        setCustomAvatarPreview(null);
                      }}
                      className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 cursor-pointer font-medium"
                    >
                      恢复默认
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Avatar Icons Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mt-1">
                {PRESET_AVATARS.map((preset) => {
                  const IconComp = AVATAR_ICON_MAP[preset.name] || LayersIcon;
                  const isSelected = avatarType === 'icon' && avatar === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1e376b] bg-blue-50/80 ring-2 ring-[#1e376b]/20 shadow-2xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${preset.bg} flex items-center justify-center text-white shadow-2xs`}
                      >
                        <IconComp className="w-4 h-4 drop-shadow-xs" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 产品描述 */}
            <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">产品描述</span>
                <span className="text-[11px] text-slate-400">选填 · 描述产品核心功能与业务解决场景</span>
              </div>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={2} 
                placeholder="简要说明此产品的业务定位、核心功能及解决的业务问题..." 
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:border-[#1e376b] focus:outline-none resize-y min-h-[72px]" 
              />
            </div>

            {/* Modules Selection with toolbar */}
            <div className="mt-1 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>产品模块池（实例与访问端可选用）<span className="text-rose-500">*</span></span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      modules.length > 0 ? 'bg-blue-50 text-[#1e376b] border border-blue-200/60' : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      已选 {modules.length} / {UNIFIED_CALL_MODULES.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">后续创建实例或分配访问端时，只能从这里勾选的模块中继承。</p>
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

              {/* Kernel Filter Tabs */}
              <div className="flex items-center gap-1">
                {(['all', '业务核', '组织核', '开通核'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setModuleFilterKernel(k)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      moduleFilterKernel === k
                        ? 'bg-[#1e376b] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {k === 'all' ? '全部' : k}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredModules.map((mod) => {
                  const key = mod.menu as string;
                  const selected = modules.includes(key);
                  return (
                    <button 
                      key={key} 
                      type="button" 
                      onClick={() => toggleModule(key)} 
                      className={`text-left px-3.5 py-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                        selected 
                          ? 'border-[#1e376b] bg-blue-50/70 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{mod.title}</span>
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {mod.kernel}
                          </span>
                        </div>
                        <span className="block text-slate-400 mt-0.5 leading-relaxed text-[11px] truncate">
                          {mod.description}
                        </span>
                      </div>
                      <span className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-colors ${
                        selected ? 'bg-[#1e376b] border-[#1e376b] text-white' : 'border-slate-300 text-transparent'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    </button>
                  );
                })}
              </div>
              {attemptedNext && modules.length === 0 && (
                <div className="text-xs text-rose-500 font-bold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  请至少勾选1个产品功能模块才能进入下一步
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: 创建实例 */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#1e376b]" />
                第二步：为「{productName || initialProduct?.name || '业务系统'}」创建实例
              </h1>
              <p className="text-xs text-slate-500 mt-1">同一产品可为不同客户或环境开立独立实例（例如全国总控版、北京市版、金融专网版），各自拥有独立配置。</p>
            </div>

            {/* Instance Name with quick auto-fill suggestions */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <span className="flex items-center justify-between">
                  <span>实例名称 <span className="text-rose-500">*</span></span>
                  {attemptedNext && !instanceName.trim() && (
                    <span className="text-[11px] text-rose-500 font-normal">请填写实例名称</span>
                  )}
                </span>
                <input 
                  value={instanceName} 
                  onChange={(e) => setInstanceName(e.target.value)} 
                  placeholder={`例如：北京市${productName || '业务'}系统`} 
                  className={`px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    attemptedNext && !instanceName.trim() 
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:outline-none' 
                      : 'border-slate-200 focus:border-[#1e376b] focus:outline-none'
                  }`} 
                />
              </label>

              {/* Quick suggestion chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">快捷填入建议:</span>
                {[
                  `北京市${productName || '信息'}系统`,
                  `全国总控${productName || '协同'}中心`,
                  `政法专网${productName || '业务'}系统`,
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setInstanceName(sug);
                      showToast(`已填入实例名称: ${sug}`, 'info');
                    }}
                    className="text-[11px] text-[#1e376b] bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200/60 cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Deploy Mode Cards */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700">部署与数据隔离方式</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    mode: 'SaaS' as const,
                    title: 'SaaS 多租户',
                    isolation: '租户库/Schema隔离',
                    desc: '公网环境，多客户共享计算资源，数据逻辑隔离，开通最快。',
                  },
                  {
                    mode: '专有云' as const,
                    title: '专有云托管',
                    isolation: '独立云专区',
                    desc: '客户独享独立 VPC 与数据库实例，支持定制扩展与专属域名。',
                  },
                  {
                    mode: '专网' as const,
                    title: '物理专网',
                    isolation: '物理硬件全隔离',
                    desc: '部署在客户隔离机房或政法内网，不通过公网域名访问。',
                  },
                ].map((item) => {
                  const active = deployMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setDeployMode(item.mode)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        active 
                          ? 'border-[#1e376b] bg-blue-50/70 ring-1 ring-[#1e376b]' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">{item.title}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            active ? 'border-[#1e376b] bg-[#1e376b] text-white' : 'border-slate-300'
                          }`}>
                            {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>
                        <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded mt-1">
                          {item.isolation}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Org Scope with quick presets */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                <span>机构服务范围</span>
                <input 
                  value={orgScope} 
                  onChange={(e) => setOrgScope(e.target.value)} 
                  placeholder="例如：指定客户机构、全国试点客户" 
                  className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-medium focus:border-[#1e376b] focus:outline-none" 
                />
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">快捷范围选项:</span>
                {['指定客户机构', '全国入驻客户', '北京市辖区机构', '公安政法专项机构'].map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setOrgScope(sc)}
                    className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer"
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 配置访问端与域名 */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#1e376b]" />
                  第三步：配置访问端并绑定域名
                </h1>
                <p className="text-xs text-slate-500 mt-1">域名直接绑定到具体的访问端。用户在浏览器打开域名后，系统自动解析：域名 → 访问端 → 实例 → 菜单。</p>
              </div>

              {/* Quick actions for step 3 */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillRecommendedHosts}
                  className="px-3 py-1.5 rounded-lg border border-[#1e376b] bg-blue-50 text-[#1e376b] text-xs font-bold hover:bg-blue-100 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  一键生成推荐域名
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {ENDPOINT_KINDS.map((kind) => {
                const selected = selectedKinds.includes(kind.key);
                const placeholder = kind.key === 'intranet' 
                  ? '10.10.10.20' 
                  : `${kind.key === 'admin_web' ? 'admin' : kind.key === 'user_web' ? 'user' : kind.key}.${codeSlug}.example.com`;
                const hostVal = hosts[kind.key] || '';
                const hasError = attemptedNext && selected && !hostVal.trim();

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
                      <div className="mt-3 pt-3 border-t border-blue-200/50 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">
                            访问域名 / 地址 <span className="text-rose-500">*</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setHosts((prev) => ({ ...prev, [kind.key]: placeholder }))}
                            className="text-[10px] text-[#1e376b] hover:underline cursor-pointer"
                          >
                            填入默认: {placeholder}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            value={hostVal}
                            onChange={(e) => setHosts((prev) => ({ ...prev, [kind.key]: e.target.value }))}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 border rounded-lg text-xs font-mono font-medium bg-white transition-colors ${
                              hasError 
                                ? 'border-rose-400 bg-rose-50/20 focus:outline-none' 
                                : 'border-slate-200 focus:border-[#1e376b] focus:outline-none'
                            }`}
                          />
                          {hostVal && (
                            <button
                              type="button"
                              onClick={() => setHosts((prev) => ({ ...prev, [kind.key]: '' }))}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        {hasError && (
                          <span className="text-[11px] text-rose-500 font-bold">请为此端填写域名</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: 确认并发布 */}
        {step === 4 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col gap-5">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                第四步：确认配置概览并开通
              </h1>
              <p className="text-xs text-slate-500 mt-1">请核对产品与实例拓扑信息。发布后将自动创建实例、开通指定访问端并生效域名路由。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Info Review Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">产品基本信息</span>
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
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-2xs overflow-hidden shrink-0 ${
                        avatarType === 'icon' ? `bg-gradient-to-br ${iconBg}` : 'bg-white border border-slate-200'
                      }`}
                    >
                      {avatarType === 'image' ? (
                        <img
                          src={customAvatarPreview || avatar}
                          alt="产品头像"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        (() => {
                          const IconComponent = AVATAR_ICON_MAP[avatar] || LayersIcon;
                          return <IconComponent className="w-5 h-5 text-white" />;
                        })()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 truncate">
                        {productName || initialProduct?.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[11px] text-slate-500 font-mono">
                          {productCode || initialProduct?.code} · {version}
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
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 bg-white/70 p-2 rounded-lg border border-slate-200/60">
                    {description || '无详细描述'}
                  </p>
                  <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>创建日期：{createdAt}</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#1e376b] font-bold bg-blue-100/60 px-2 py-1 rounded">
                  已配 {modules.length} 个功能模块
                </div>
              </div>

              {/* Instance Info Review Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">实例规格</span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[11px] text-[#1e376b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> 修改
                    </button>
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-2">{instanceName}</div>
                  <div className="text-xs text-slate-600 mt-1">部署: <span className="font-bold">{deployMode}</span></div>
                  <div className="text-xs text-slate-600 mt-0.5">机构: <span className="font-medium">{orgScope}</span></div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium bg-slate-200/60 px-2 py-1 rounded">
                  隔离: {deployMode === '专网' ? '物理专网' : deployMode === '专有云' ? '独立专区' : '租户库隔离'}
                </div>
              </div>

              {/* Endpoints Info Review Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">已配置访问端</span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-[11px] text-[#1e376b] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> 修改
                    </button>
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-2">开通 {selectedKinds.length} 个终端</div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    {selectedKinds.map((kind) => {
                      const def = ENDPOINT_KINDS.find((item) => item.key === kind);
                      return (
                        <div key={kind} className="text-[11px] flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-700">{def?.name}:</span>
                          <span className="font-mono text-slate-500 truncate max-w-[130px]">{hosts[kind]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-1 rounded">
                  域名自动绑定已就绪
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-xs">
          <button
            type="button"
            onClick={() => (step === 1 ? handleCancelClick() : setStep((step - 1) as AppCreateWizardStep))}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {step === 1 ? '取消退出' : '上一步'}
          </button>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
              >
                下一步
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onFinish(buildPayload('draft'))}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-bold text-xs cursor-pointer"
                >
                  保存为草稿
                </button>
                <button
                  type="button"
                  onClick={() => onFinish(buildPayload('running'))}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  正式发布并进入控制台
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
