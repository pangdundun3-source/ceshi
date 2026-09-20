import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  FileText,
  Boxes,
  Check,
  LayoutGrid,
  LayoutList,
  Library,
  Monitor,
  Plus,
  Send,
  Copy,
  ExternalLink,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Power,
  ChevronDown,
  Globe,
  Layers,
  ArrowRight,
  Cpu,
  FolderTree,
  Link2,
  MonitorSmartphone,
  Server,
  Smartphone,
  Tablet,
  Network,
  MessageCircle,
  Palette,
  Calendar,
  Flame,
  Zap,
  MessageSquare,
  Shield,
  Radio,
  Bell,
  Upload,
  UploadCloud,
  Image as ImageIcon,
  QrCode,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SysMenuItem, INITIAL_DITING_MENUS, AvailableComponentOption } from './MenuManage';
import { MenuManage } from './MenuManage';
import { EndpointMenuCardPreview, EndpointMenuPreviewModal } from './EndpointMenuPreview';
import { UNIFIED_CALL_MODULES, getUnifiedModuleByKey } from '../data/unifiedCallModules';
import {
  syncEndpointMenus,
  getModuleMenuItemId,
  getModuleMenuMeta,
  getMountedModuleParentInfo,
} from '../utils/menuModuleLinkage';
import {
  AccessEndpoint,
  AppInstance,
  BusinessProduct,
  DomainRecord,
  ENDPOINT_KINDS,
  EndpointKind,
  THEME_COLOR_PRESETS,
  PRESET_AVATARS,
  ThemeColorOption,
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
  initialPane?: ConsolePane;
  onChangeProduct?: (product: BusinessProduct) => void;
  onChangeInstance: (instance: AppInstance) => void;
  onChangeEndpoints: (endpoints: AccessEndpoint[]) => void;
  onChangeDomains: (domains: DomainRecord[]) => void;
  sharedMenus?: SysMenuItem[];
  onSharedMenusChange?: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
}

const NAV: Array<{ id: ConsolePane; label: string; icon: React.ElementType }> = [
  { id: 'basic', label: '应用基本配置', icon: FileText },
  { id: 'endpoints', label: '访问端管理', icon: Monitor },
  { id: 'menus', label: '菜单配置', icon: LayoutList },
  { id: 'components', label: '组件库管理', icon: Library },
];

const epKindIconMap: Record<string, React.ElementType> = {
  admin_web: Server,
  user_web: Monitor,
  h5: Smartphone,
  pad: Tablet,
  intranet: Network,
  wechat: MessageCircle,
};

const epKindStyleMap: Record<string, string> = {
  admin_web: 'bg-purple-50 text-purple-700 border-purple-200',
  user_web: 'bg-blue-50 text-[#1e376b] border-blue-200',
  h5: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pad: 'bg-amber-50 text-amber-700 border-amber-200',
  intranet: 'bg-slate-100 text-slate-700 border-slate-300',
  wechat: 'bg-green-50 text-green-700 border-green-200',
};

export const AppConsole: React.FC<AppConsoleProps> = ({
  product,
  instance,
  endpoints,
  domains,
  onBack,
  initialPane = 'basic',
  onChangeProduct,
  onChangeInstance,
  onChangeEndpoints,
  onChangeDomains,
  sharedMenus,
  onSharedMenusChange,
}) => {
  const [pane, setPane] = useState<ConsolePane>(initialPane === 'publish' ? 'basic' : initialPane);
  const [basicSubTab, setBasicSubTab] = useState<'basic_info' | 'wechat_official' | 'app_publish'>(
    initialPane === 'publish' ? 'app_publish' : 'basic_info'
  );

  useEffect(() => {
    if (pane === 'publish') {
      setPane('basic');
      setBasicSubTab('app_publish');
    }
  }, [pane]);
  const [wechatConfig, setWechatConfig] = useState({
    mpName: `${product.name}服务号`,
    appId: 'wx88e2f69a12c4819d',
    appSecret: '8a91f3b2049102ef76a819c9e8210341',
    token: 'wxb_platform_token_2026',
    encodingAesKey: 'kL39sJkd82mNsp91kLmz819kLms8271nSkld9182kLm',
    welcomeMsg: `欢迎关注【${product.name}】官方服务号！`,
    firstActivationMsg: `您好，您的专属邀请码已成功激活，欢迎进入【${product.name}】开展协同作业。`,
    activatedWelcomeMsg: `欢迎回到【${product.name}】，点击下方菜单可快速进入系统。`,
    qrCode: '',
  });
  const [isWechatSecretVisible, setIsWechatSecretVisible] = useState(false);
  const [activeEp, setActiveEp] = useState(endpoints[0]?.id || '');
  const [openingHosts, setOpeningHosts] = useState<Partial<Record<EndpointKind, string>>>({});
  const [domainHost, setDomainHost] = useState('');
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Pre-publish inspection confirm & success dialogs
  const [showPrePublishConfirmModal, setShowPrePublishConfirmModal] = useState(false);
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);

  // Basic Info Inline Edit mode
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [editBasicForm, setEditBasicForm] = useState({
    productName: product.name,
    productDescription: product.description,
    productThemeColor: product.themeColor || '#1e376b',
    productThemeColorName: product.themeColorName || '经典深蓝',
    productAvatar: product.avatar || 'Flame',
    productAvatarType: product.avatarType || 'icon',
    productIconBg: product.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900',
    productCreatedAt: product.createdAt || instance.createdAt || '2025-11-02',
    name: instance.name,
    deployMode: instance.deployMode,
    orgScope: instance.orgScope,
    isolation: instance.isolation,
  });

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);

  const processAvatarFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('请上传有效的图片格式文件 (JPG, PNG, SVG, WebP)', 'warning');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('LOGO图片不能超过 2MB', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        setEditBasicForm((prev) => ({
          ...prev,
          productAvatar: result,
          productAvatarType: 'image',
        }));
        showToast('产品LOGO已成功上传，已作为唯一LOGO展示', 'success');
      }
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

  // Endpoints delete modal
  const [endpointToDelete, setEndpointToDelete] = useState<AccessEndpoint | null>(null);

  // Endpoint Menu Sandbox Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewModalEpId, setPreviewModalEpId] = useState('');

  // Components search & filter
  const [compSearch, setCompSearch] = useState('');
  const [compFilterTab, setCompFilterTab] = useState<'all' | 'bound' | 'unbound' | 'platform' | 'private'>('all');
  const [compKernelFilter, setCompKernelFilter] = useState('all');
  const [compViewMode, setCompViewMode] = useState<'grid' | 'table'>('grid');
  const [compGroupByKernel] = useState(true);

  // Menus search
  const [menuSearch, setMenuSearch] = useState('');

  // Status dropdown toggle
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Private component modal form
  const [showAddPrivateModal, setShowAddPrivateModal] = useState(false);
  const [privateName, setPrivateName] = useState('');
  const [privateDesc, setPrivateDesc] = useState('');
  const [privateKernel, setPrivateKernel] = useState('业务核');
  const [privateVersion, setPrivateVersion] = useState('V1.0');

  const currentEp = endpoints.find((item) => item.id === activeEp) || endpoints[0];
  const currentDomain = domains.find((item) => item.id === currentEp?.domainId);
  const unusedKinds = ENDPOINT_KINDS.filter((kind) => !endpoints.some((item) => item.kind === kind.key));
  
  const privateModules = instance.privateModules?.length
    ? instance.privateModules
    : buildPrivateModules(product.modules, product.version);
    
  const deployedKeys = deployedModuleKeys({ ...instance, privateModules }, product.modules);
  const deployedCount = privateModules.filter((item) => item.status === 'deployed').length;
  
  const boundComponents = privateModules.filter((item) => item.status === 'deployed');
  const privateComponents = privateModules.filter((item) => item.source === 'private');

  // Single authoritative Unified Component List (Zero duplication between bound and pool)
  const unifiedComponentList = useMemo(() => {
    const list: Array<{
      key: string;
      name: string;
      description: string;
      kernel: string;
      source: 'platform' | 'private';
      version: string;
      isBound: boolean;
    }> = [];

    // 1. Platform product modules
    product.modules.forEach((key) => {
      const modDef = getUnifiedModuleByKey(key);
      const rec = privateModules.find((item) => item.moduleKey === key);
      const isBound = rec ? rec.status === 'deployed' : false;
      list.push({
        key,
        name: modDef?.title || key,
        description: modDef?.description || '产品标准公用模块',
        kernel: modDef?.kernel || '业务核',
        source: 'platform',
        version: rec?.version || product.version,
        isBound,
      });
    });

    // 2. Private custom modules for this instance
    privateModules
      .filter((m) => m.source === 'private')
      .forEach((m) => {
        list.push({
          key: m.moduleKey,
          name: m.name || m.moduleKey,
          description: m.description || '自定义私有化扩展组件',
          kernel: m.kernel || '业务核',
          source: 'private',
          version: m.version || 'V1.0',
          isBound: m.status === 'deployed',
        });
      });

    return list;
  }, [product.modules, product.version, privateModules]);

  const totalCompCount = unifiedComponentList.length;
  const boundCompCount = unifiedComponentList.filter((item) => item.isBound).length;
  const unboundCompCount = totalCompCount - boundCompCount;
  const platformCompCount = unifiedComponentList.filter((item) => item.source === 'platform').length;
  const privateCompCount = unifiedComponentList.filter((item) => item.source === 'private').length;

  const filteredComponents = useMemo(() => {
    return unifiedComponentList.filter((item) => {
      if (compFilterTab === 'bound' && !item.isBound) return false;
      if (compFilterTab === 'unbound' && item.isBound) return false;
      if (compFilterTab === 'platform' && item.source !== 'platform') return false;
      if (compFilterTab === 'private' && item.source !== 'private') return false;

      if (compKernelFilter !== 'all' && item.kernel !== compKernelFilter) return false;

      if (compSearch.trim()) {
        const q = compSearch.trim().toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.key.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.kernel.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [unifiedComponentList, compFilterTab, compKernelFilter, compSearch]);

  const groupedComponents = useMemo(() => {
    const map: { [groupName: string]: typeof filteredComponents } = {};
    filteredComponents.forEach((item) => {
      const g = item.source === 'private' ? '私有化定制扩展' : `${item.kernel || '标准'}能力库`;
      if (!map[g]) map[g] = [];
      map[g].push(item);
    });
    return map;
  }, [filteredComponents]);

  useEffect(() => {
    setDomainHost(currentDomain?.host || '');
  }, [currentEp?.id, currentDomain?.host]);

  // Copy helper
  const handleCopy = (text: string, label = '内容') => {
    navigator.clipboard.writeText(text);
    showToast(`${label}已复制到剪贴板`, 'success');
  };

  // Quick copy full instance summary
  const copyInstanceSummary = () => {
    const summary = `【实例名称】${instance.name}\n【产品】${product.name} (${product.code} ${product.version})\n【状态】${statusLabel[instance.status]}\n【部署】${instance.deployMode} (${instance.isolation})\n【机构范围】${instance.orgScope}\n【访问端】${endpoints.map(e => e.name).join('、')}`;
    handleCopy(summary, '实例完整信息');
  };

  // Save inline edit for Basic Info
  const saveBasicInfo = () => {
    if (!editBasicForm.productName.trim()) {
      showToast('产品名称不能为空', 'warning');
      return;
    }

    if (onChangeProduct) {
      onChangeProduct({
        ...product,
        name: editBasicForm.productName.trim(),
        description: editBasicForm.productDescription.trim(),
        themeColor: editBasicForm.productThemeColor,
        themeColorName: editBasicForm.productThemeColorName,
        avatar: editBasicForm.productAvatar,
        avatarType: editBasicForm.productAvatarType,
        iconBg: editBasicForm.productIconBg,
        createdAt: editBasicForm.productCreatedAt,
      });
    }

    setIsEditingBasic(false);
    showToast('产品基本信息已成功更新', 'success');
  };

  // Cancel inline edit
  const cancelBasicInfo = () => {
    setEditBasicForm({
      productName: product.name,
      productDescription: product.description,
      productThemeColor: product.themeColor || '#1e376b',
      productThemeColorName: product.themeColorName || '经典深蓝',
      productAvatar: product.avatar || 'Flame',
      productAvatarType: product.avatarType || 'icon',
      productIconBg: product.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900',
      productCreatedAt: product.createdAt || instance.createdAt || '2025-11-02',
      name: instance.name,
      deployMode: instance.deployMode,
      orgScope: instance.orgScope,
      isolation: instance.isolation,
    });
    setIsEditingBasic(false);
  };

  // Pre-Publish 4-Dimension Full Inspection
  const prePublishInspection = useMemo(() => {
    // 1. Basic Info Check
    const basicIssues: string[] = [];
    if (!instance.name || instance.name.trim().length < 2) {
      basicIssues.push('实例名称过短或未填写');
    }
    if (!instance.deployMode) {
      basicIssues.push('未指定实例部署模式');
    }
    if (!instance.isolation) {
      basicIssues.push('未指定数据隔离级别');
    }

    // 2. Endpoints & Domains Check
    const epIssues: string[] = [];
    if (endpoints.length === 0) {
      epIssues.push('尚未配置任何访问端，系统无法对外提供访问入口');
    }
    const unboundEndpoints = endpoints.filter((ep) => {
      const dom = domains.find((d) => d.id === ep.domainId);
      return !dom || !dom.host || dom.host.trim() === '';
    });
    if (unboundEndpoints.length > 0) {
      epIssues.push(`存在 ${unboundEndpoints.length} 个未绑定访问域名的终端（${unboundEndpoints.map((e) => e.name).join('、')}）`);
    }

    // 3. Components Library Check
    const compIssues: string[] = [];
    if (deployedCount === 0) {
      compIssues.push('尚未接入任何业务组件，系统目前处于空功能状态');
    }
    const epsWithoutModules = endpoints.filter((ep) => !ep.modules || ep.modules.length === 0);
    if (epsWithoutModules.length > 0 && deployedCount > 0) {
      compIssues.push(`访问端「${epsWithoutModules.map((e) => e.name).join('、')}」尚未分配挂载任何组件`);
    }

    // 4. Menu Configuration Check
    const menuIssues: string[] = [];
    let totalMenusAcrossEps = 0;
    const epsWithoutMenus: string[] = [];
    endpoints.forEach((ep) => {
      const epMenus = ep.customMenus || sharedMenus || [];
      totalMenusAcrossEps += epMenus.length;
      if (epMenus.length === 0) {
        epsWithoutMenus.push(ep.name);
      }
    });
    if (totalMenusAcrossEps === 0) {
      menuIssues.push('各访问端均未配置任何导航菜单，前端将无菜单入口');
    } else if (epsWithoutMenus.length > 0) {
      menuIssues.push(`访问端「${epsWithoutMenus.join('、')}」尚未配置菜单树`);
    }

    // 5. WeChat Official Account Check
    const wechatIssues: string[] = [];
    const hasMpName = Boolean(wechatConfig.mpName && wechatConfig.mpName.trim().length > 0);
    const hasAppId = Boolean(wechatConfig.appId && wechatConfig.appId.trim().startsWith('wx') && wechatConfig.appId.trim().length >= 8);
    const hasAppSecret = Boolean(wechatConfig.appSecret && wechatConfig.appSecret.trim().length >= 16);
    const hasToken = Boolean(wechatConfig.token && wechatConfig.token.trim().length > 0);

    if (!hasMpName) {
      wechatIssues.push('未配置公众号服务号名称');
    }
    if (!hasAppId) {
      wechatIssues.push('未配置有效的微信开发者 ID (AppID)');
    }
    if (!hasAppSecret) {
      wechatIssues.push('未配置微信开发者密钥 (AppSecret)');
    }
    if (!hasToken) {
      wechatIssues.push('未配置微信消息验证 Token');
    }

    const checks = [
      {
        id: 'basic' as const,
        name: '01 基础信息检查',
        status: basicIssues.length === 0 ? 'pass' : 'fail',
        issues: basicIssues,
        description: `实例名称「${instance.name}」· 部署模式「${instance.deployMode}」· 隔离「${instance.isolation}」`,
        actionLabel: '修改基础信息',
        targetPane: 'basic' as ConsolePane,
        icon: Boxes,
      },
      {
        id: 'endpoints' as const,
        name: '02 访问端与域名检查',
        status: epIssues.length === 0 ? 'pass' : (endpoints.length === 0 ? 'fail' : 'warning'),
        issues: epIssues,
        description: `已配置 ${endpoints.length} 个访问端，${endpoints.length - unboundEndpoints.length}/${endpoints.length} 个已成功绑定域名`,
        actionLabel: '前往访问端管理',
        targetPane: 'endpoints' as ConsolePane,
        icon: Monitor,
      },
      {
        id: 'components' as const,
        name: '03 组件库接入检查',
        status: compIssues.length === 0 ? 'pass' : 'warning',
        issues: compIssues,
        description: `已接入 ${deployedCount} 个能力组件（平台组件与私有定制）`,
        actionLabel: '前往组件库管理',
        targetPane: 'components' as ConsolePane,
        icon: Library,
      },
      {
        id: 'menus' as const,
        name: '04 菜单配置检查',
        status: menuIssues.length === 0 ? 'pass' : 'warning',
        issues: menuIssues,
        description: `各端已配置共 ${totalMenusAcrossEps} 个功能导航菜单`,
        actionLabel: '前往菜单配置',
        targetPane: 'menus' as ConsolePane,
        icon: LayoutList,
      },
      {
        id: 'wechat' as const,
        name: '05 公众号设置检查',
        status: (hasMpName && hasAppId && hasAppSecret && hasToken) ? 'pass' : 'warning',
        issues: wechatIssues,
        description: `服务号「${wechatConfig.mpName || '未命名'}」· AppID: ${wechatConfig.appId ? (wechatConfig.appId.slice(0, 6) + '***') : '未配置'} · Token: ${hasToken ? '已设置' : '未设置'}`,
        actionLabel: '前往公众号设置',
        targetPane: 'basic' as ConsolePane,
        icon: MessageSquare,
      },
    ];

    const passCount = checks.filter((c) => c.status === 'pass').length;
    const hasBlockingFail = checks.some((c) => c.status === 'fail');
    const allWarnings = checks.flatMap((c) => c.issues);

    return {
      checks,
      passCount,
      totalCount: checks.length,
      hasBlockingFail,
      allWarnings,
      isFullyReady: passCount === checks.length,
      totalMenusAcrossEps,
    };
  }, [instance, endpoints, domains, deployedCount, sharedMenus, wechatConfig]);

  // Switch status with validation
  const handleStatusChange = (newStatus: AppInstance['status']) => {
    // 只有正式发布的实例才可以开启运行
    if (newStatus === 'running' && instance.publishStatus !== 'published') {
      showToast('该实例尚未正式发布，无法直接启动运行！请在「应用发布」中完成5项检查并正式发布。', 'warning');
      setPane('basic');
      setBasicSubTab('app_publish');
      setShowStatusDropdown(false);
      return;
    }

    onChangeInstance({ ...instance, status: newStatus });
    if (newStatus === 'stopped') {
      if (onChangeProduct) {
        onChangeProduct({ ...product, status: 'disabled' });
      }
    }
    setShowStatusDropdown(false);
    showToast(`实例状态已切换为「${statusLabel[newStatus]}」`, 'success');
  };

  // Formal publish execution
  const executePublish = () => {
    const publishedVer = `${product.version || 'V1.0'}-Release`;
    const nowStr = new Date().toLocaleString('zh-CN', { hour12: false });

    onChangeInstance({
      ...instance,
      publishStatus: 'published',
      publishedVersion: publishedVer,
      lastPublishedAt: nowStr,
      status: 'running',
    });

    if (onChangeProduct) {
      onChangeProduct({
        ...product,
        publishStatus: 'published',
        publishedVersion: publishedVer,
        lastPublishedAt: nowStr,
        status: 'enabled',
      });
    }

    setShowPrePublishConfirmModal(false);
    setShowPublishSuccessModal(true);
    showToast('🎉 实例与业务产品正式发布成功！系统已自动同步生效「启用」状态。', 'success');
  };

  const handleFormalPublishClick = () => {
    if (prePublishInspection.hasBlockingFail) {
      showToast('存在阻断性未配置项（如基础信息或访问端缺失），无法发布！', 'warning');
      return;
    }

    if (prePublishInspection.allWarnings.length > 0) {
      setShowPrePublishConfirmModal(true);
      return;
    }

    executePublish();
  };

  const setComponentBound = (moduleKey: string, bound: boolean) => {
    const modObj = getUnifiedModuleByKey(moduleKey) || privateModules.find(p => p.moduleKey === moduleKey);
    const modTitle = modObj ? ('title' in modObj ? modObj.title : modObj.name || moduleKey) : moduleKey;

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
    showToast(`已${bound ? '成功绑定' : '取消绑定'}「${modTitle}」组件`, bound ? 'success' : 'info');
  };

  // Batch bind/unbind platform components
  const bindAllPlatformComponents = () => {
    const nextModules = privateModules.map(item => ({ ...item, status: 'deployed' as const }));
    // Also include any missing product modules
    product.modules.forEach(key => {
      if (!nextModules.some(m => m.moduleKey === key)) {
        nextModules.push({
          moduleKey: key,
          version: product.version,
          source: 'platform',
          status: 'deployed'
        });
      }
    });
    onChangeInstance({ ...instance, privateModules: nextModules });
    showToast('已一键绑定全部平台公用组件', 'success');
  };

  const unbindAllPlatformComponents = () => {
    const nextModules = privateModules.map(item => ({ ...item, status: 'undeployed' as const }));
    onChangeInstance({ ...instance, privateModules: nextModules });
    // Remove from all endpoints
    onChangeEndpoints(endpoints.map(ep => ({ ...ep, modules: [] })));
    showToast('已取消所有组件绑定', 'info');
  };

  const addPrivateComponent = () => {
    const name = privateName.trim();
    if (!name) {
      showToast('请输入私有化组件名称', 'warning');
      return;
    }
    const moduleKey = `private-${Date.now()}`;
    onChangeInstance({
      ...instance,
      privateModules: [
        ...privateModules,
        {
          moduleKey,
          source: 'private',
          name,
          description: privateDesc.trim() || '自定义私有化业务组件',
          kernel: privateKernel || '业务核',
          version: privateVersion.trim() || 'V1.0',
          status: 'deployed' // auto bind when added for better UX
        }
      ]
    });
    setPrivateName('');
    setPrivateDesc('');
    setPrivateKernel('业务核');
    setPrivateVersion('V1.0');
    setShowAddPrivateModal(false);
    showToast(`私有化组件「${name}」注册并绑定成功`, 'success');
  };

  const deletePrivateComponent = (moduleKey: string, name: string) => {
    const nextModules = privateModules.filter(m => m.moduleKey !== moduleKey);
    onChangeInstance({ ...instance, privateModules: nextModules });
    onChangeEndpoints(endpoints.map(ep => ({ ...ep, modules: ep.modules.filter(k => k !== moduleKey) })));
    showToast(`私有化组件「${name}」已删除`, 'info');
  };

  // Focus menu item in MenuManage
  const [focusMenuId, setFocusMenuId] = useState<string | null>(null);

  // Derive active menus for current endpoint, with real-time linkage of endpoint modules
  const currentEpMenus = useMemo(() => {
    if (!currentEp) return sharedMenus || INITIAL_DITING_MENUS;
    return syncEndpointMenus(
      currentEp.customMenus || sharedMenus,
      currentEp.modules || [],
      currentEp.id,
      privateModules
    );
  }, [currentEp, sharedMenus, privateModules]);

  // Helper to get real menus for any given endpoint
  const getEpMenus = (ep: AccessEndpoint): SysMenuItem[] => {
    if (ep.customMenus && ep.customMenus.length > 0) return ep.customMenus;
    if (ep.id === currentEp?.id && currentEpMenus.length > 0) return currentEpMenus;
    return syncEndpointMenus(sharedMenus, ep.modules || [], ep.id, privateModules);
  };

  // All available components that can be bound to menus
  const availableComponentOptions: AvailableComponentOption[] = useMemo(() => {
    const list: AvailableComponentOption[] = [];

    // Platform unified modules
    UNIFIED_CALL_MODULES.forEach((mod) => {
      const key = mod.menu as string;
      const kernelPrefix = mod.kernel === '业务核' ? 'alert' : mod.kernel === '组织核' ? 'org' : 'sys';
      const targetEps = endpoints.filter((ep) => {
        const inModules = ep.modules && ep.modules.includes(key);
        const inMenus = ep.customMenus?.some((m) => m.moduleKey === key);
        return inModules || inMenus;
      });

      list.push({
        key,
        title: mod.title,
        description: mod.description,
        kernel: mod.kernel,
        routePath: `/diting/${kernelPrefix}/${key.toLowerCase().replace(/_/g, '-')}`,
        icon: mod.kernel === '业务核' ? 'Activity' : mod.kernel === '组织核' ? 'Users' : 'Settings',
        displayedEndpoints: targetEps.map((ep) => ({
          id: ep.id,
          name: ep.name,
          kind: ep.kind,
        })),
      });
    });

    // Private modules
    privateModules.forEach((item) => {
      const targetEps = endpoints.filter((ep) => {
        const inModules = ep.modules && ep.modules.includes(item.moduleKey);
        const inMenus = ep.customMenus?.some((m) => m.moduleKey === item.moduleKey);
        return inModules || inMenus;
      });

      list.push({
        key: item.moduleKey,
        title: item.name || item.moduleKey,
        description: item.description || '私有化定制组件',
        kernel: item.kernel || '私有组件',
        routePath: `/diting/custom/${item.moduleKey}`,
        icon: 'Cpu',
        displayedEndpoints: targetEps.map((ep) => ({
          id: ep.id,
          name: ep.name,
          kind: ep.kind,
        })),
      });
    });

    return list;
  }, [endpoints, privateModules]);

  const availableParentMenus = useMemo(() => {
    return currentEpMenus.filter((m) => m.parentId === '0');
  }, [currentEpMenus]);

  const handleEndpointMenusChange: React.Dispatch<React.SetStateAction<SysMenuItem[]>> = (action) => {
    if (!currentEp) return;
    const nextMenus = typeof action === 'function' ? action(currentEpMenus) : action;

    // Synchronize bound module keys to current endpoint's modules list
    const linkedModuleKeys = Array.from(
      new Set(
        nextMenus
          .filter((m) => m.moduleKey)
          .map((m) => m.moduleKey as string)
      )
    );

    const next = endpoints.map((ep) =>
      ep.id === currentEp.id
        ? {
            ...ep,
            customMenus: nextMenus,
            modules: linkedModuleKeys.length > 0 ? linkedModuleKeys : ep.modules,
          }
        : ep
    );
    onChangeEndpoints(next);
    if (onSharedMenusChange) {
      onSharedMenusChange(nextMenus);
    }
  };

  const toggleEpModule = (moduleKey: string) => {
    if (!currentEp) return;
    const has = currentEp.modules.includes(moduleKey);
    const nextModules = has
      ? currentEp.modules.filter((key) => key !== moduleKey)
      : [...currentEp.modules, moduleKey];

    // 实时与当前端的菜单树联动：挂载或卸载该模块对应菜单
    const nextMenus = syncEndpointMenus(
      currentEp.customMenus || sharedMenus,
      nextModules,
      currentEp.id,
      privateModules
    );

    const next = endpoints.map((item) => {
      if (item.id !== currentEp.id) return item;
      return {
        ...item,
        modules: nextModules,
        customMenus: nextMenus,
      };
    });
    onChangeEndpoints(next);
    if (onSharedMenusChange) {
      onSharedMenusChange(nextMenus);
    }
    const meta = getModuleMenuMeta(moduleKey, privateModules);
    showToast(
      has
        ? `已从「${currentEp.name}」菜单卸载模块「${meta.name}」`
        : `已将模块「${meta.name}」实时挂载到「${currentEp.name}」菜单中，可直接在下方进行个性化配置`,
      has ? 'info' : 'success'
    );
  };

  // 跳转到下方菜单树中对该模块进行个性化深度配置
  const handleJumpToModuleMenu = (moduleKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentEp) return;

    let nextMenus = currentEp.customMenus || sharedMenus;
    if (!currentEp.modules.includes(moduleKey)) {
      const nextModules = [...currentEp.modules, moduleKey];
      nextMenus = syncEndpointMenus(
        nextMenus,
        nextModules,
        currentEp.id,
        privateModules
      );
      const next = endpoints.map((item) => {
        if (item.id !== currentEp.id) return item;
        return {
          ...item,
          modules: nextModules,
          customMenus: nextMenus,
        };
      });
      onChangeEndpoints(next);
      if (onSharedMenusChange) {
        onSharedMenusChange(nextMenus);
      }
    }

    const targetId = getModuleMenuItemId(currentEp.id, moduleKey);
    setFocusMenuId(targetId);

    setTimeout(() => {
      const container = document.getElementById('menu_management_container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    const meta = getModuleMenuMeta(moduleKey, privateModules);
    showToast(`已定位到「${meta.name}」菜单项，可在右侧表单进行个性化定制`, 'info');
  };

  // 快捷在模块行直接修改其挂载的父级菜单
  const handleChangeModuleParent = (moduleKey: string, newParentId: string, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (!currentEp) return;
    const targetId = getModuleMenuItemId(currentEp.id, moduleKey);
    const baseMenus = currentEp.customMenus || currentEpMenus;
    const nextMenus = baseMenus.map((m) => {
      if (m.id === targetId || m.moduleKey === moduleKey) {
        return { ...m, parentId: newParentId };
      }
      return m;
    });

    const next = endpoints.map((item) => {
      if (item.id !== currentEp.id) return item;
      return {
        ...item,
        customMenus: nextMenus,
      };
    });
    onChangeEndpoints(next);
    if (onSharedMenusChange) {
      onSharedMenusChange(nextMenus);
    }
    showToast('已调整该模块在菜单树中的挂载位置', 'success');
  };

  // Batch menu assignment for current endpoint
  const selectAllModulesForEp = () => {
    if (!currentEp) return;
    const allAvailable = [
      ...product.modules.filter((k) => deployedKeys.includes(k)),
      ...privateModules.filter((m) => m.source === 'private' && m.status === 'deployed').map((m) => m.moduleKey),
    ];
    const nextMenus = syncEndpointMenus(
      currentEp.customMenus || sharedMenus,
      allAvailable,
      currentEp.id,
      privateModules
    );
    onChangeEndpoints(
      endpoints.map((ep) =>
        ep.id === currentEp.id ? { ...ep, modules: allAvailable, customMenus: nextMenus } : ep
      )
    );
    if (onSharedMenusChange) {
      onSharedMenusChange(nextMenus);
    }
    showToast(`已为「${currentEp.name}」全选并实时挂载所有可用模块到菜单`, 'success');
  };

  const clearAllModulesForEp = () => {
    if (!currentEp) return;
    const nextMenus = syncEndpointMenus(
      currentEp.customMenus || sharedMenus,
      [],
      currentEp.id,
      privateModules
    );
    onChangeEndpoints(
      endpoints.map((ep) =>
        ep.id === currentEp.id ? { ...ep, modules: [], customMenus: nextMenus } : ep
      )
    );
    if (onSharedMenusChange) {
      onSharedMenusChange(nextMenus);
    }
    showToast(`已清空「${currentEp.name}」的模块，已从菜单实时卸载`, 'info');
  };

  const saveCurrentDomain = () => {
    const host = domainHost.trim();
    if (!currentEp || !host) {
      showToast('请输入有效的访问域名或IP地址', 'warning');
      return;
    }
    if (currentEp.domainId) {
      onChangeDomains(domains.map((item) => (
        item.id === currentEp.domainId
          ? { ...item, host, status: 'bound', endpointId: currentEp.id, instanceId: instance.id }
          : item
      )));
    } else {
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
    }
    showToast(`「${currentEp.name}」域名已成功保存并绑定！`, 'success');
  };

  const confirmOpenEndpoint = (kind: EndpointKind) => {
    const host = (openingHosts[kind] || '').trim();
    if (!host) {
      showToast('开通时必须输入访问域名', 'warning');
      return;
    }
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
    showToast(`成功开通并绑定「${def.name}」`, 'success');
  };

  const deleteEndpoint = (ep: AccessEndpoint) => {
    if (endpoints.length <= 1) {
      showToast('至少需要保留一个访问端，不可全部删除', 'warning');
      setEndpointToDelete(null);
      return;
    }
    onChangeEndpoints(endpoints.filter((item) => item.id !== ep.id));
    if (ep.domainId) {
      onChangeDomains(domains.filter((item) => item.id !== ep.domainId));
    }
    if (activeEp === ep.id) {
      const remaining = endpoints.filter((item) => item.id !== ep.id);
      setActiveEp(remaining[0]?.id || '');
    }
    setEndpointToDelete(null);
    showToast(`已成功注销访问端「${ep.name}」`, 'info');
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-hidden bg-[#F8FAFC] text-slate-800 flex flex-col relative">
      {/* Floating Toast Notification */}
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

      {/* Delete Endpoint Confirm Modal */}
      {endpointToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">确认注销访问端？</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              即将注销「{endpointToDelete.name}」并解除绑定的域名。注销后该端将不再对外提供业务访问。
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEndpointToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => deleteEndpoint(endpointToDelete)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Private Component Modal Dialog */}
      {showAddPrivateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#1e376b]" />
                  注册私有化定制组件
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">针对此业务实例的特殊客制化需求添加独立扩展，添加后将直接绑定生效。</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPrivateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3.5">
              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1">
                <span>组件名称 <span className="text-rose-500">*</span></span>
                <input
                  value={privateName}
                  onChange={(e) => setPrivateName(e.target.value)}
                  placeholder="例如：专网审计日志插件、国资监管上报模块"
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:border-[#1e376b] focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-700 flex flex-col gap-1">
                  <span>所属内核</span>
                  <select
                    value={privateKernel}
                    onChange={(e) => setPrivateKernel(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:border-[#1e376b] focus:outline-none cursor-pointer"
                  >
                    <option value="标准能力库">标准能力库</option>
                    <option value="业务核">业务核</option>
                    <option value="组织核">组织核</option>
                    <option value="开通核">开通核</option>
                  </select>
                </label>

                <label className="text-xs font-bold text-slate-700 flex flex-col gap-1">
                  <span>版本号</span>
                  <input
                    value={privateVersion}
                    onChange={(e) => setPrivateVersion(e.target.value)}
                    placeholder="V1.0"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:border-[#1e376b] focus:outline-none"
                  />
                </label>
              </div>

              <label className="text-xs font-bold text-slate-700 flex flex-col gap-1">
                <span>功能与业务说明</span>
                <textarea
                  value={privateDesc}
                  onChange={(e) => setPrivateDesc(e.target.value)}
                  rows={3}
                  placeholder="简要说明此私有组件的功能用途及适用场景..."
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:border-[#1e376b] focus:outline-none"
                />
              </label>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddPrivateModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={!privateName.trim()}
                onClick={addPrivateComponent}
                className="px-4 py-2 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                确认注册并绑定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Header Bar */}
      <div className="px-6 pt-4 pb-0 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              type="button" 
              onClick={onBack} 
              className="text-[#1e376b] hover:text-[#14264c] font-bold flex items-center gap-1.5 px-2 py-1 -ml-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              返回产品管理
            </button>
            <span>/</span>
            <span className="text-slate-600 font-medium">{product.name} ({product.code})</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{instance.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyInstanceSummary}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-[#1e376b] border border-slate-200 rounded-md hover:bg-slate-50 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="复制实例信息到剪贴板"
            >
              <Copy className="w-3 h-3" />
              复制信息
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap pb-3">
          <div className="flex items-center gap-3.5">
            {/* Product Avatar */}
            {product.avatarType === 'image' && product.avatar?.startsWith('data:') ? (
              <img
                src={product.avatar}
                alt={product.name}
                className="w-11 h-11 rounded-xl object-cover shadow-xs border border-slate-200 shrink-0"
              />
            ) : (
              <div 
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${product.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900'} text-white flex items-center justify-center font-black shadow-xs shrink-0`}
                style={product.themeColor ? { border: `2px solid ${product.themeColor}` } : undefined}
              >
                {(() => {
                  const map: Record<string, React.ElementType> = {
                    Flame, Zap, MessageSquare, Shield, Radio, Cpu, Bell, Globe, Layers, Sparkles
                  };
                  const Icon = map[product.avatar || 'Flame'] || Sparkles;
                  return <Icon className="w-5 h-5 text-white" />;
                })()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">{instance.name}</h1>
                {product.themeColor && (
                  <span 
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-2xs"
                    style={{ backgroundColor: product.themeColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {product.themeColorName || '主题色'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Status Dropdown / Action */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer transition-all hover:brightness-95 ${statusClass[instance.status]}`}
            >
              <span className={`w-2 h-2 rounded-full ${instance.status === 'running' ? 'bg-emerald-500 animate-pulse' : instance.status === 'stopped' ? 'bg-slate-400' : 'bg-amber-500'}`} />
              <span>{statusLabel[instance.status]}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  切换实例状态
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusChange('running')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between hover:bg-emerald-50 cursor-pointer ${
                    instance.status === 'running' ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>运行中 (Running)</span>
                  {instance.status === 'running' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('stopped')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    instance.status === 'stopped' ? 'text-slate-700 bg-slate-100' : 'text-slate-700'
                  }`}
                >
                  <span>已停用 (Stopped)</span>
                  {instance.status === 'stopped' && <Check className="w-3.5 h-3.5 text-slate-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('draft')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                    instance.status === 'draft' ? 'text-amber-700 bg-amber-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>草稿 (Draft)</span>
                  {instance.status === 'draft' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation with badges */}
        <nav
          className="flex items-center gap-1 mt-1 overflow-x-auto scrollbar-none border-t border-slate-100"
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
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap cursor-pointer border-b-2 transition-all ${
                  active
                    ? 'text-[#1e376b] border-[#1e376b] bg-blue-50/40'
                    : 'text-slate-500 border-transparent hover:text-[#1e376b] hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#1e376b]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
        <div className="w-full flex flex-col gap-4">

          {/* TAB 1: 应用基本配置 (Basic) */}
          {pane === 'basic' && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row flex-1 min-h-[620px] overflow-hidden" id="console_basic_config_unified_card">
              {/* 左侧菜单栏 (缩窄宽度适配文字：纯白卡片、适度内边距、左侧深蓝竖条高亮指示) */}
              <div className="w-full md:w-36 lg:w-36 bg-white md:border-r border-b md:border-b-0 border-slate-200/80 shrink-0 flex flex-col">
                <nav className="flex-1 divide-y divide-slate-100" id="nav_console_basic_submenu">
                  {/* (a) 基本信息 */}
                  <button
                    type="button"
                    onClick={() => setBasicSubTab('basic_info')}
                    id="console_submenu_basic_info"
                    className={`w-full px-3.5 py-3.5 flex items-center text-left transition-all cursor-pointer select-none text-xs ${
                      basicSubTab === 'basic_info'
                        ? 'bg-white text-[#1e376b] font-bold border-l-4 border-[#1e376b]'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50/70 border-l-4 border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className={`w-4 h-4 shrink-0 ${basicSubTab === 'basic_info' ? 'text-[#1e376b]' : 'text-slate-500'}`} />
                      <span className="whitespace-nowrap">基本信息</span>
                    </div>
                  </button>

                  {/* (b) 公众号设置 */}
                  <button
                    type="button"
                    onClick={() => setBasicSubTab('wechat_official')}
                    id="console_submenu_wechat_official"
                    className={`w-full px-3.5 py-3.5 flex items-center text-left transition-all cursor-pointer select-none text-xs ${
                      basicSubTab === 'wechat_official'
                        ? 'bg-white text-[#1e376b] font-bold border-l-4 border-[#1e376b]'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50/70 border-l-4 border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${basicSubTab === 'wechat_official' ? 'text-[#1e376b]' : 'text-slate-500'}`} />
                      <span className="whitespace-nowrap">公众号设置</span>
                    </div>
                  </button>

                  {/* (c) 应用发布 */}
                  <button
                    type="button"
                    onClick={() => setBasicSubTab('app_publish')}
                    id="console_submenu_app_publish"
                    className={`w-full px-3.5 py-3.5 flex items-center text-left transition-all cursor-pointer select-none text-xs ${
                      basicSubTab === 'app_publish'
                        ? 'bg-white text-[#1e376b] font-bold border-l-4 border-[#1e376b]'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50/70 border-l-4 border-transparent font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Send className={`w-4 h-4 shrink-0 ${basicSubTab === 'app_publish' ? 'text-[#1e376b]' : 'text-slate-500'}`} />
                      <span className="whitespace-nowrap">应用发布</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* 右侧主内容区 */}
              <div className="flex-1 min-w-0 p-6 flex flex-col gap-6 overflow-y-auto">
                {basicSubTab === 'basic_info' && (
                  <div className="flex flex-col gap-5">
                    {/* Product Core Profile Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e376b] flex items-center justify-center font-bold">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900">产品基本信息</h2>
                      <p className="text-xs text-slate-500 mt-0.5">展示与维护产品名称、描述、主题色及产品LOGO。</p>
                    </div>
                  </div>
                  {!isEditingBasic ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditBasicForm({
                          productName: product.name,
                          productDescription: product.description,
                          productThemeColor: product.themeColor || '#1e376b',
                          productThemeColorName: product.themeColorName || '经典深蓝',
                          productAvatar: product.avatar || 'Flame',
                          productAvatarType: product.avatarType || 'icon',
                          productIconBg: product.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900',
                          productCreatedAt: product.createdAt || instance.createdAt || '2025-11-02',
                          name: instance.name,
                          deployMode: instance.deployMode,
                          orgScope: instance.orgScope,
                          isolation: instance.isolation,
                        });
                        setIsEditingBasic(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-[#1e376b] hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      编辑基本信息
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={cancelBasicInfo}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={saveBasicInfo}
                        className="px-3.5 py-1.5 rounded-lg bg-[#1e376b] hover:bg-[#14264c] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        保存修改
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingBasic ? (
                  /* Read-only view prominently featuring the requested fields */
                  <div className="flex flex-col gap-6">
                    {/* Top Prominent Showcase Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-slate-50/80 via-blue-50/20 to-slate-50/80 p-4 rounded-xl border border-slate-100">
                      {/* Product LOGO & Name */}
                      <div className="flex items-center gap-3.5">
                        {product.avatarType === 'image' && product.avatar?.startsWith('data:') ? (
                          <img
                            src={product.avatar}
                            alt={product.name}
                            className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white shrink-0"
                          />
                        ) : (
                          <div 
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.iconBg || 'from-[#1e376b] via-blue-900 to-slate-900'} text-white flex items-center justify-center font-black shadow-sm shrink-0`}
                            style={product.themeColor ? { border: `2px solid ${product.themeColor}` } : undefined}
                          >
                            {(() => {
                              const map: Record<string, React.ElementType> = {
                                Flame, Zap, MessageSquare, Shield, Radio, Cpu, Bell, Globe, Layers, Sparkles
                              };
                              const Icon = map[product.avatar || 'Flame'] || Sparkles;
                              return <Icon className="w-7 h-7 text-white" />;
                            })()}
                          </div>
                        )}
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">产品LOGO与名称</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <h3 className="text-base font-black text-slate-900">{product.name}</h3>
                            <button
                              type="button"
                              onClick={() => handleCopy(product.name, '产品名称')}
                              className="text-slate-400 hover:text-[#1e376b] p-1 rounded hover:bg-white cursor-pointer"
                              title="复制产品名称"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono font-medium">编码: {product.code} · 版本: {product.version}</span>
                        </div>
                      </div>

                      {/* Product Theme Color */}
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200/70 shadow-2xs">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs shrink-0"
                          style={{ backgroundColor: product.themeColor || '#1e376b' }}
                        >
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-slate-400">产品主题色</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-slate-800">{product.themeColorName || '主题色彩'}</span>
                            <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {product.themeColor || '#1e376b'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Description Block */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-blue-600" />
                          产品描述
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(product.description, '产品描述')}
                          className="text-xs text-slate-400 hover:text-[#1e376b] font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          复制描述
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode View with Full Product & Instance Synchronization */
                  <div className="flex flex-col gap-5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
                      产品基本信息配置 (同步更新)
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {/* Product Name */}
                      <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                        产品名称 *
                        <input
                          value={editBasicForm.productName}
                          onChange={(e) => setEditBasicForm(prev => ({ ...prev, productName: e.target.value }))}
                          placeholder="例如：谛听·特情智评系统"
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:border-[#1e376b] focus:outline-none"
                        />
                      </label>
                    </div>

                    {/* Product Theme Color Selection */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-blue-600" />
                          产品主题色 *
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          当前选定：<strong className="text-slate-800">{editBasicForm.productThemeColorName}</strong> ({editBasicForm.productThemeColor})
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                        {THEME_COLOR_PRESETS.map((preset) => {
                          const presetColor = preset.color || preset.hex;
                          const isSelected = editBasicForm.productThemeColor === presetColor;
                          return (
                            <button
                              key={preset.id || preset.key}
                              type="button"
                              onClick={() => {
                                setEditBasicForm(prev => ({
                                  ...prev,
                                  productThemeColor: presetColor,
                                  productThemeColorName: preset.name,
                                  productIconBg: preset.iconBg || preset.bgGradient,
                                }));
                              }}
                              className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-[#1e376b] ring-2 ring-[#1e376b]/20 bg-blue-50/40 shadow-xs' 
                                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <div 
                                className="w-6 h-6 rounded-full shadow-xs flex items-center justify-center text-white"
                                style={{ backgroundColor: presetColor }}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">{preset.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">{presetColor}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Product LOGO - Only 1 LOGO supported for upload and display */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          产品LOGO *
                        </span>
                        <span className="text-xs text-slate-400">
                          仅支持上传展示 1 个产品LOGO (支持 JPG/PNG/SVG/WebP，不超过 2MB)
                        </span>
                      </div>

                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={handleAvatarFileUpload}
                      />

                      {editBasicForm.productAvatarType === 'image' && editBasicForm.productAvatar ? (
                        /* Single LOGO Displayed View */
                        <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={editBasicForm.productAvatar}
                              alt="Product LOGO"
                              className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-xs shrink-0 bg-white"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-800">当前产品LOGO</span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                  仅支持单LOGO展示
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
                              onClick={() => avatarInputRef.current?.click()}
                              className="px-3 py-1.5 border border-slate-300 hover:border-[#1e376b] text-slate-700 hover:text-[#1e376b] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-white hover:bg-blue-50/30 transition-colors shadow-2xs"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              更换LOGO
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditBasicForm(prev => ({
                                  ...prev,
                                  productAvatar: 'Flame',
                                  productAvatarType: 'icon',
                                }));
                                showToast('已恢复系统默认LOGO', 'info');
                              }}
                              className="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                            >
                              重置默认
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Single LOGO Upload Dropzone */
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingAvatar(true);
                          }}
                          onDragLeave={() => setIsDraggingAvatar(false)}
                          onDrop={handleAvatarDrop}
                          onClick={() => avatarInputRef.current?.click()}
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
                                仅支持上传展示 1 个产品LOGO，推荐正方形规格 (JPG / PNG / SVG / WebP，小于 2MB)
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#1e376b] shadow-2xs shrink-0 pointer-events-none"
                          >
                            选择图片上传
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Product Description */}
                    <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                      产品描述 *
                      <textarea
                        rows={3}
                        value={editBasicForm.productDescription}
                        onChange={(e) => setEditBasicForm(prev => ({ ...prev, productDescription: e.target.value }))}
                        placeholder="请输入产品的定位、核心功能及应用场景描述..."
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:border-[#1e376b] focus:outline-none leading-relaxed"
                      />
                    </label>
                  </div>
                )}
                    </div>
                  </div>
                )}

                {/* 2. 公众号设置 */}
                {basicSubTab === 'wechat_official' && (
                  <div className="flex flex-col gap-6 max-w-3xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>微信公众号（独立服务号）配置</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          配置各业务应用专属绑定的微信服务号参数，实现微信生态免密登录、消息模板推送与扫码关注激活。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('微信公众号设置已成功保存', 'success')}
                        className="px-4 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>保存配置</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                        公众号服务号名称 *
                        <input
                          value={wechatConfig.mpName}
                          onChange={(e) => setWechatConfig(prev => ({ ...prev, mpName: e.target.value }))}
                          placeholder="例如：特情感知服务号"
                          className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                        />
                      </label>
                      <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                        开发者 ID (AppID) *
                        <input
                          value={wechatConfig.appId}
                          onChange={(e) => setWechatConfig(prev => ({ ...prev, appId: e.target.value }))}
                          placeholder="例如：wx8888888888888888"
                          className="px-3.5 py-2.5 font-mono border border-slate-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                        />
                      </label>
                      <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                        开发者密码 (AppSecret) *
                        <div className="relative">
                          <input
                            type={isWechatSecretVisible ? 'text' : 'password'}
                            value={wechatConfig.appSecret}
                            onChange={(e) => setWechatConfig(prev => ({ ...prev, appSecret: e.target.value }))}
                            placeholder="请输入微信 AppSecret"
                            className="w-full px-3.5 py-2.5 pr-10 font-mono border border-slate-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setIsWechatSecretVisible(!isWechatSecretVisible)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          >
                            {isWechatSecretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </label>
                      <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                        令牌 (Token) *
                        <input
                          value={wechatConfig.token}
                          onChange={(e) => setWechatConfig(prev => ({ ...prev, token: e.target.value }))}
                          placeholder="例如：wxb_platform_token"
                          className="px-3.5 py-2.5 font-mono border border-slate-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                        />
                      </label>
                    </div>

                    <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                      消息加解密密钥 (EncodingAESKey)
                      <input
                        value={wechatConfig.encodingAesKey}
                        onChange={(e) => setWechatConfig(prev => ({ ...prev, encodingAesKey: e.target.value }))}
                        placeholder="请输入 43 位字符的消息加解密密钥"
                        className="px-3.5 py-2.5 font-mono border border-slate-200 rounded-xl text-xs font-medium focus:border-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
                      />
                    </label>
                  </div>
                )}

                {/* 3. 应用发布 */}
                {basicSubTab === 'app_publish' && (
                  <div className="flex flex-col gap-5 max-w-4xl">
                    {/* Header & Quick Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <Send className="w-4 h-4 text-[#1e376b]" />
                            <span>应用发布管理中心</span>
                          </h2>
                          {instance.publishStatus === 'published' ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              正式发布生效中
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              草稿待发布
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          系统根据「基础信息、访问端、组件库、菜单配置、公众号设置」5 项核心指标进行发布自检，正式发布后各端域名即可对外提供访问。
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleFormalPublishClick}
                          className="px-4.5 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs hover:shadow transition-all active:scale-[0.98]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{instance.publishStatus === 'published' ? '重新检查并更新发布' : '一键正式发布上线'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Inspection summary bar */}
                    <div className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      prePublishInspection.isFullyReady
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : prePublishInspection.hasBlockingFail
                          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                          : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}>
                      <div className="flex items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          prePublishInspection.isFullyReady
                            ? 'bg-emerald-100 text-emerald-700'
                            : prePublishInspection.hasBlockingFail
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}>
                          {prePublishInspection.isFullyReady ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <AlertCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-xs font-black">
                              发布自检就绪度: {prePublishInspection.passCount} / {prePublishInspection.totalCount} 项指标已通过
                            </span>
                            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                              prePublishInspection.isFullyReady
                                ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}>
                              {Math.round((prePublishInspection.passCount / prePublishInspection.totalCount) * 100)}% 就绪
                            </span>
                          </div>
                          <p className="text-[11px] opacity-80 leading-relaxed">
                            {prePublishInspection.isFullyReady
                              ? '各项服务与配置均已就绪，具备上线条件，点击上方或下方按钮可立即正式发布生效。'
                              : prePublishInspection.hasBlockingFail
                                ? '检测到基础配置存在阻断项，请先完善对应模块后再执行正式发布。'
                                : `存在 ${prePublishInspection.allWarnings.length} 项建议优化项（不影响直接发布上线），可按需完善。`}
                          </p>
                        </div>
                      </div>

                      {/* 5-segment mini progress indicator */}
                      <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                        {prePublishInspection.checks.map((c) => (
                          <div
                            key={c.id}
                            className={`w-5 h-2 rounded-full transition-colors ${
                              c.status === 'pass'
                                ? 'bg-emerald-500'
                                : c.status === 'warning'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                            }`}
                            title={`${c.name}: ${c.status === 'pass' ? '已通过' : c.status === 'warning' ? '建议完善' : '存在阻断'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 5 Core Inspection Cards Grid */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>发布前 5 项核心自检报告与快速跳转：</span>
                        </span>
                        <span className="text-[11px] text-slate-400">点击卡片内按钮可直接跳转至对应模块修改</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {/* Card 1: 基础信息 */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                          prePublishInspection.checks[0].status === 'pass'
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Boxes className="w-4 h-4 text-[#1e376b]" />
                                <h3 className="text-xs font-black text-slate-900">{prePublishInspection.checks[0].name}</h3>
                              </div>
                              {prePublishInspection.checks[0].status === 'pass' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> 已通过
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <X className="w-2.5 h-2.5" /> 待完善
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[11px]">实例名称:</span>
                                <span className="font-bold text-slate-800">{instance.name || '未命名'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[11px]">所属产品:</span>
                                <span className="font-medium text-slate-700 truncate max-w-[180px]">{product.name} ({product.code})</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[11px]">部署 / 隔离:</span>
                                <span className="font-medium text-slate-700">{instance.deployMode} · {instance.isolation}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setBasicSubTab('basic_info')}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                          >
                            <span>{prePublishInspection.checks[0].actionLabel}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>

                        {/* Card 2: 访问端与域名 */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                          prePublishInspection.checks[1].status === 'pass'
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-[#1e376b]" />
                                <h3 className="text-xs font-black text-slate-900">{prePublishInspection.checks[1].name}</h3>
                              </div>
                              {prePublishInspection.checks[1].status === 'pass' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> 已就绪 ({endpoints.length}端)
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle className="w-2.5 h-2.5" /> 存在待绑定端
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-100 max-h-32 overflow-y-auto">
                              {endpoints.map((ep) => {
                                const dom = domains.find((d) => d.id === ep.domainId);
                                const isBound = Boolean(dom && dom.host && dom.host.trim());
                                return (
                                  <div key={ep.id} className="flex items-center justify-between gap-2 border-b border-slate-100/60 pb-1 last:border-0 last:pb-0">
                                    <span className="font-bold text-slate-800 truncate">{ep.name}</span>
                                    {isBound ? (
                                      <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0 flex items-center gap-1">
                                        <Check className="w-2 h-2" /> {dom?.host}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                                        ⚠️ 未绑定域名
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPane('endpoints')}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                          >
                            <span>{prePublishInspection.checks[1].actionLabel}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>

                        {/* Card 3: 组件库接入 */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                          prePublishInspection.checks[2].status === 'pass'
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Library className="w-4 h-4 text-[#1e376b]" />
                                <h3 className="text-xs font-black text-slate-900">{prePublishInspection.checks[2].name}</h3>
                              </div>
                              {prePublishInspection.checks[2].status === 'pass' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> 已接入 {deployedCount} 个
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle className="w-2.5 h-2.5" /> 建议接入
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[11px]">组件库总数:</span>
                                <span className="font-bold text-slate-800">{totalCompCount} 个能力组件</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[11px]">已接入绑定:</span>
                                <span className="font-bold text-emerald-700">{boundCompCount} 个 (平台 {platformCompCount} / 私有 {privateCompCount})</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-[11px]">未接入备用:</span>
                                <span className="font-medium text-slate-500">{unboundCompCount} 个可按需接入</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPane('components')}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                          >
                            <span>{prePublishInspection.checks[2].actionLabel}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>

                        {/* Card 4: 菜单配置 */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                          prePublishInspection.checks[3].status === 'pass'
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <LayoutList className="w-4 h-4 text-[#1e376b]" />
                                <h3 className="text-xs font-black text-slate-900">{prePublishInspection.checks[3].name}</h3>
                              </div>
                              {prePublishInspection.checks[3].status === 'pass' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> 菜单已就绪 ({prePublishInspection.totalMenusAcrossEps}项)
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle className="w-2.5 h-2.5" /> 存在未配置端
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 flex flex-col gap-1 bg-white p-2.5 rounded-lg border border-slate-100 max-h-32 overflow-y-auto">
                              {endpoints.map((ep) => {
                                const epMenus = ep.customMenus || sharedMenus || [];
                                return (
                                  <div key={ep.id} className="flex items-center justify-between gap-2 border-b border-slate-100/60 pb-1 last:border-0 last:pb-0">
                                    <span className="font-bold text-slate-800 truncate">{ep.name}</span>
                                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                                      epMenus.length > 0 ? 'text-blue-700 bg-blue-50' : 'text-amber-700 bg-amber-50'
                                    }`}>
                                      {epMenus.length > 0 ? `${epMenus.length} 项菜单` : '⚠️ 未配置菜单'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setPane('menus')}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                          >
                            <span>{prePublishInspection.checks[3].actionLabel}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>

                        {/* Card 5: 公众号设置 (New!) */}
                        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all md:col-span-2 ${
                          prePublishInspection.checks[4].status === 'pass'
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#1e376b]" />
                                <h3 className="text-xs font-black text-slate-900">{prePublishInspection.checks[4].name}</h3>
                              </div>
                              {prePublishInspection.checks[4].status === 'pass' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-2.5 h-2.5" /> 已就绪
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertCircle className="w-2.5 h-2.5" /> 建议完善
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-100">
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-400 text-[10px]">服务号名称:</span>
                                <span className="font-bold text-slate-800 truncate">{wechatConfig.mpName || '未命名'}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-400 text-[10px]">开发者 AppID:</span>
                                <span className="font-mono text-slate-700 truncate">{wechatConfig.appId ? `${wechatConfig.appId.slice(0, 6)}***` : '未配置'}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-400 text-[10px]">接口验证 Token:</span>
                                <span className="font-medium text-emerald-700">{wechatConfig.token ? '已设置 Token' : '未设置'}</span>
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-slate-400 text-[10px]">生态协同能力:</span>
                                <span className="font-medium text-blue-700">微信免密扫码 / 消息通知</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setBasicSubTab('wechat_official')}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                          >
                            <span>{prePublishInspection.checks[4].actionLabel}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Warning Issues Checklist Prompt Bar */}
                    {prePublishInspection.allWarnings.length > 0 && (
                      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>发布前建议完善项 ({prePublishInspection.allWarnings.length} 项，不阻断正常上线):</span>
                        </div>
                        <ul className="text-xs text-amber-900/90 pl-6 list-disc space-y-1">
                          {prePublishInspection.allWarnings.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Streamlined Bottom Fast Action Bar */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>
                          {instance.publishStatus === 'published'
                            ? `已生效版本: ${instance.publishedVersion || product.version || 'V1.0-Release'} · 最近更新于 ${instance.lastPublishedAt || '今天'}`
                            : `5项自检已达标 ${prePublishInspection.passCount} 项 · 确认无误后点击右侧按钮即可正式上线`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={handleFormalPublishClick}
                          className="px-4.5 py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{instance.publishStatus === 'published' ? '重新检查并更新发布' : '一键正式发布上线'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 访问端管理 (Endpoints) */}
          {pane === 'endpoints' && (
            <div className="flex flex-col gap-4">
              <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-[#1e376b] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#1e376b] leading-relaxed">
                    <strong>终端与域名映射机制：</strong>用户通过不同域名访问系统时，网关自动匹配【访问端 → 对应实例 → 加载端专属菜单与权限】。点击各终端卡片即可配置专属域名。
                  </p>
                </div>
              </div>

              {/* Endpoints Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {endpoints.map((ep) => {
                  const kind = getEndpointKind(ep.kind);
                  const domain = domains.find((item) => item.id === ep.domainId);
                  const selected = currentEp?.id === ep.id;
                  const epMenus = getEpMenus(ep);
                  const hasMenus = epMenus && epMenus.length > 0 && ep.modules.length > 0;
                  const EpIcon = epKindIconMap[ep.kind] || Monitor;
                  
                  return (
                    <div
                      key={ep.id}
                      className={`rounded-xl border p-4.5 transition-all flex flex-col justify-between gap-3.5 shadow-2xs ${
                        selected 
                          ? 'border-[#1e376b] bg-blue-50/30 shadow-xs ring-2 ring-[#1e376b]/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        {/* Header: Icon + Title + Selected Badge + Kind */}
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveEp(ep.id)}
                            className="text-left cursor-pointer flex-1 flex items-center gap-2.5"
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                              ep.kind === 'admin_web'
                                ? 'bg-purple-100 text-purple-700'
                                : ep.kind === 'wechat'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-[#1e376b]'
                            }`}>
                              <EpIcon className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black text-slate-900">
                                  {ep.name}
                                </span>
                                {selected && (
                                  <span className="text-[10px] bg-[#1e376b] text-white px-1.5 py-0.2 rounded font-bold">
                                    当前选中
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {kind?.typeLabel || '业务端'} · 包含 {ep.modules.length} 个功能模块
                              </span>
                            </div>
                          </button>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            ep.kind === 'admin_web'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : ep.kind === 'wechat'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-[#1e376b] border-blue-200'
                          }`}>
                            {kind?.name || ep.name}
                          </span>
                        </div>

                        {/* Domain Binding Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-400 text-[11px]">绑定域名:</span>
                          <span className={`font-mono font-bold truncate max-w-[220px] text-right ${domain?.host ? 'text-slate-700' : 'text-amber-600 font-bold'}`}>
                            {domain?.host || '⚠️ 未配置域名'}
                          </span>
                        </div>
                      </div>

                      {/* Endpoint action buttons */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs mt-0.5">
                        <div className="flex items-center gap-2">
                          {/* Single Clean Entry for Preview Modal */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveEp(ep.id);
                              setPreviewModalEpId(ep.id);
                              setShowPreviewModal(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#1e376b] hover:bg-[#14264c] text-white font-bold flex items-center gap-1.5 cursor-pointer text-xs shadow-2xs transition-colors"
                            title="打开1:1真实用户端体验预览弹窗"
                          >
                            <MonitorSmartphone className="w-3.5 h-3.5 text-sky-300" />
                            <span>预览</span>
                          </button>

                          {/* Go to Menu Config */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveEp(ep.id);
                              setPane('menus');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer text-xs transition-colors"
                          >
                            <LayoutList className="w-3.5 h-3.5 text-slate-500" />
                            <span>配置菜单</span>
                          </button>

                          {domain?.host && (
                            <button
                              type="button"
                              onClick={() => handleCopy(`https://${domain.host}`, `${ep.name}访问地址`)}
                              className="px-2 py-1.5 rounded hover:bg-slate-100 text-slate-600 font-medium flex items-center gap-1 cursor-pointer text-xs"
                              title="复制完整访问URL"
                            >
                              <Copy className="w-3 h-3" />
                              复制地址
                            </button>
                          )}
                        </div>

                        {endpoints.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setEndpointToDelete(ep)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                            title="注销此端"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add new endpoints */}
                {unusedKinds.map((kind) => {
                  const host = openingHosts[kind.key] || '';
                  const defPrefix = kind.key === 'intranet' ? '10.10.10.20' : `${kind.key === 'admin_web' ? 'admin' : kind.key}.${product.code.toLowerCase()}.example.com`;

                  return (
                    <div
                      key={kind.key}
                      className="rounded-xl border border-dashed border-slate-300 bg-white p-4 flex flex-col justify-between gap-3 hover:border-slate-400 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5 text-[#1e376b]" />
                            开通{kind.name}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {kind.typeLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{kind.description}</p>
                        
                        <div className="mt-3 flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700">访问域名 *</span>
                            <button
                              type="button"
                              onClick={() => setOpeningHosts(prev => ({ ...prev, [kind.key]: defPrefix }))}
                              className="text-[10px] text-[#1e376b] hover:underline cursor-pointer"
                            >
                              填入推荐
                            </button>
                          </div>
                          <input
                            value={host}
                            onChange={(e) => setOpeningHosts((prev) => ({ ...prev, [kind.key]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && host.trim()) confirmOpenEndpoint(kind.key);
                            }}
                            placeholder={defPrefix}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono bg-white focus:border-[#1e376b] focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!host.trim()}
                        onClick={() => confirmOpenEndpoint(kind.key)}
                        className="w-full px-3 py-2 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        开通并绑定域名
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Active Endpoint Domain Editor Panel */}
              {currentEp && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                        配置「{currentEp.name}」域名
                        <span className="text-[11px] font-medium text-slate-400">({currentEp.kind})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">保存域名后，所有访问该域名的流量将直接导流至此端并读取本端可见菜单。</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                    <label className="text-xs font-bold text-slate-700 flex flex-col gap-1.5">
                      <span className="flex items-center justify-between">
                        <span>访问域名 / IP *</span>
                        <button
                          type="button"
                          onClick={() => {
                            const rec = `${currentEp.kind === 'admin_web' ? 'admin' : currentEp.kind === 'user_web' ? 'user' : currentEp.kind}.${product.code.toLowerCase()}.example.com`;
                            setDomainHost(rec);
                          }}
                          className="text-[11px] text-[#1e376b] hover:underline font-normal cursor-pointer"
                        >
                          填入推荐标准格式
                        </button>
                      </span>
                      <input
                        value={domainHost}
                        onChange={(e) => setDomainHost(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && domainHost.trim()) saveCurrentDomain();
                        }}
                        placeholder={currentEp.kind === 'intranet' ? '10.10.10.20' : 'admin.example.com'}
                        className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-mono font-bold bg-white focus:border-[#1e376b] focus:outline-none"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={!domainHost.trim()}
                      onClick={saveCurrentDomain}
                      className="h-[40px] px-5 bg-[#1e376b] hover:bg-[#14264c] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {currentEp.domainId ? '保存并更新域名' : '立即绑定域名'}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 flex-wrap">
                    <span>SSL 证书状态：<strong className="text-slate-700">{currentDomain?.ssl === 'normal' ? '✅ 正常生效' : currentDomain?.ssl === 'expiring' ? '⚠️ 即将到期' : '未开启 / 专网'}</strong></span>
                    <span>·</span>
                    <span>解析状态：<strong className="text-slate-700">{currentDomain?.status === 'bound' ? '✅ 已绑定生效' : '待绑定'}</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 组件库管理 (Components) */}
          {pane === 'components' && (
            <div className="flex flex-col gap-3.5">
              {/* Compact Unified Toolbar */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg self-start overflow-x-auto max-w-full">
                  {[
                    { id: 'all', label: '全部', count: totalCompCount },
                    { id: 'platform', label: '平台公用', count: platformCompCount },
                    { id: 'private', label: '私有定制', count: privateCompCount },
                  ].map((tab) => {
                    const active = compFilterTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCompFilterTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          active
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          active ? 'bg-blue-50 text-[#1e376b]' : 'bg-slate-200/70 text-slate-500'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPrivateModal(true)}
                    className="px-3 py-1.5 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    注册私有组件
                  </button>
                </div>
              </div>

              {/* Main Content Area: Card Grid View or Table View */}
              {filteredComponents.length > 0 ? (
                compViewMode === 'grid' ? (
                  /* ================= CARD GRID VIEW ================= */
                  <div className="flex flex-col gap-5">
                    {(compGroupByKernel ? Object.entries(groupedComponents) : [['全部能力组件', filteredComponents] as const]).map(
                      ([groupTitle, groupItems]) => {
                        const boundInGroup = groupItems.filter((i) => i.isBound).length;
                        return (
                          <div key={groupTitle} className="flex flex-col gap-3">
                            {compGroupByKernel && (
                              <div className="flex items-center justify-between px-1 border-b border-slate-200/80 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-4 bg-[#1e376b] rounded-full" />
                                  <h3 className="font-bold text-slate-900 text-xs">{groupTitle}</h3>
                                  <span className="text-[11px] text-slate-500">
                                    共 {groupItems.length} 个 · 已接入生效 {boundInGroup} 个
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-[#1e376b] bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                                  接入率 {Math.round((boundInGroup / groupItems.length) * 100)}%
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5">
                              {groupItems.map((item) => (
                                <div
                                  key={item.key}
                                  className={`rounded-lg border p-2.5 transition-all duration-150 flex flex-col justify-between relative overflow-hidden border-t-[3px] ${
                                    item.isBound
                                      ? 'border-blue-300/90 border-t-[#1e376b] bg-gradient-to-b from-blue-50/40 via-white to-white shadow-xs ring-1 ring-[#1e376b]/15'
                                      : 'border-slate-200 border-t-slate-300 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs opacity-75 hover:opacity-100'
                                  }`}
                                >
                                  {/* Header: Icon + Title + Version + Switch */}
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2 min-w-0">
                                        <div
                                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs ${
                                            item.isBound
                                              ? item.source === 'private'
                                                ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                                                : item.kernel === '组织核'
                                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                                : 'bg-gradient-to-br from-[#1e376b] to-blue-600 text-white'
                                              : 'bg-slate-200/90 text-slate-400'
                                          }`}
                                        >
                                          <Boxes className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1 flex-wrap">
                                            <span
                                              className={`text-xs truncate max-w-[120px] ${
                                                item.isBound ? 'font-bold text-slate-900' : 'font-medium text-slate-600'
                                              }`}
                                              title={item.name}
                                            >
                                              {item.name}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded shrink-0">
                                              {item.version}
                                            </span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                                            #{item.key}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Toggle Switch & Status Pill */}
                                      <div className="flex flex-col items-end gap-1 shrink-0">
                                        <button
                                          type="button"
                                          role="switch"
                                          aria-checked={item.isBound}
                                          onClick={() => setComponentBound(item.key, !item.isBound)}
                                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            item.isBound ? 'bg-[#1e376b]' : 'bg-slate-300'
                                          }`}
                                          title={item.isBound ? '点击解除绑定' : '点击接入此组件'}
                                        >
                                          <span
                                            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                              item.isBound ? 'translate-x-3.5' : 'translate-x-0.5'
                                            }`}
                                          />
                                        </button>
                                        {item.isBound ? (
                                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1e376b] bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200/90 shadow-2xs">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-[#1e376b] shrink-0" />
                                            已接入
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-slate-400 bg-slate-200/60 px-1.5 py-0.2 rounded-full border border-slate-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                            未接入
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <p
                                      className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed min-h-[30px]"
                                      title={item.description}
                                    >
                                      {item.description}
                                    </p>
                                  </div>

                                  {/* Footer: Tags & Delete */}
                                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <span
                                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                                          item.source === 'private'
                                            ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                            : item.isBound
                                            ? 'bg-blue-50 text-[#1e376b] border-blue-200/80'
                                            : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}
                                      >
                                        {item.source === 'private' ? '私有定制' : '平台公用'}
                                      </span>
                                      <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full font-medium">
                                        {item.kernel}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      {item.source === 'private' && (
                                        <button
                                          type="button"
                                          onClick={() => deletePrivateComponent(item.key, item.name)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                                          title="删除此私有化定制组件"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  /* ================= TABLE VIEW ================= */
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-bold">
                        <tr>
                          <th className="px-5 py-3">组件名称与功能说明</th>
                          <th className="px-4 py-3 w-28">组件来源</th>
                          <th className="px-4 py-3 w-24">所属内核</th>
                          <th className="px-4 py-3 w-20">版本</th>
                          <th className="px-4 py-3 w-52">支持的端</th>
                          <th className="px-4 py-3 w-32">接入状态</th>
                          <th className="px-5 py-3 text-right w-44">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredComponents.map((item) => (
                          <tr key={item.key} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">#{item.key}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 max-w-xl truncate" title={item.description}>
                                {item.description}
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  item.source === 'private'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                    : 'bg-blue-50 text-blue-700 border-blue-200/80'
                                }`}
                              >
                                {item.source === 'private' ? '私有定制' : '平台公用'}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-slate-600 font-medium text-xs">{item.kernel}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-mono text-slate-500 text-xs">{item.version}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              {(() => {
                                const displayedEps = item.isBound
                                  ? endpoints.filter((ep) => {
                                      const inModules = ep.modules && ep.modules.includes(item.key);
                                      const inMenus = ep.customMenus?.some((m) => m.moduleKey === item.key);
                                      return inModules || inMenus;
                                    })
                                  : [];

                                if (!item.isBound) {
                                  return <span className="text-[11px] text-slate-300">未接入</span>;
                                }

                                if (displayedEps.length === 0) {
                                  return (
                                    <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
                                      未分配端
                                    </span>
                                  );
                                }

                                return (
                                  <div className="flex items-center gap-1 flex-wrap max-w-xs">
                                    {endpoints.map((ep) => {
                                      const isSupported = ep.modules && ep.modules.includes(item.key);
                                      const inMenus = ep.customMenus?.some((m) => m.moduleKey === item.key);
                                      const activeOnEp = isSupported || inMenus;
                                      const EpIcon = epKindIconMap[ep.kind] || Monitor;
                                      return (
                                        <span
                                          key={ep.id}
                                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                            activeOnEp
                                              ? ep.kind === 'admin_web'
                                                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
                                                : ep.kind === 'wechat'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                                                : 'bg-blue-50 text-[#1e376b] border-blue-200 shadow-2xs'
                                              : 'bg-slate-50 text-slate-400 border-slate-200 line-through opacity-50'
                                          }`}
                                          title={activeOnEp ? `将在「${ep.name}」展示并生效` : `未在「${ep.name}」中启用`}
                                        >
                                          <EpIcon className="w-2.5 h-2.5 shrink-0" />
                                          <span>{ep.name}</span>
                                          {activeOnEp && <Check className="w-2.5 h-2.5 text-emerald-600 font-bold" />}
                                        </span>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="px-4 py-3.5">
                              {item.isBound ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  已绑定生效
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                  未接入
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="inline-flex items-center justify-end gap-1.5">
                                {item.isBound ? (
                                  <button
                                    type="button"
                                    onClick={() => setComponentBound(item.key, false)}
                                    className="px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                                  >
                                    解除绑定
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setComponentBound(item.key, true)}
                                    className="px-3 py-1 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
                                  >
                                    + 接入本实例
                                  </button>
                                )}

                                {item.source === 'private' && (
                                  <button
                                    type="button"
                                    onClick={() => deletePrivateComponent(item.key, item.name)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                    title="删除此私有化定制组件"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 py-12 px-4 text-center flex flex-col items-center justify-center gap-2 text-slate-400 text-xs shadow-xs">
                  <Library className="w-8 h-8 text-slate-300" />
                  <span className="font-medium text-slate-600">未找到符合条件的组件</span>
                  <span>可尝试切换筛选标签（全部 / 已绑定 / 未接入）、调整内核选项或清空搜索关键字</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 菜单配置 (Menus) - 上面顶端给一个端的导航切换，下面是菜单的管理 */}
          {pane === 'menus' && (
            <div className="flex flex-col gap-4">
              {/* 顶端：访问端导航切换 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#1e376b]/10 text-[#1e376b] flex items-center justify-center shrink-0">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900">访问端导航切换</h2>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
                          共 {endpoints.length} 个端
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentEp && (
                    <div className="flex items-center gap-2 text-xs shrink-0">
                      <span className="text-slate-400 text-[11px]">正在配置:</span>
                      <span className="font-bold text-[#1e376b] bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{currentEp.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({ENDPOINT_KINDS.find((k) => k.key === currentEp.kind)?.typeLabel || currentEp.kind})</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* 端标签导航条 */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-0.5">
                  {endpoints.map((ep) => {
                    const isSelected = currentEp?.id === ep.id;
                    const menuCount = isSelected ? currentEpMenus.length : (ep.customMenus?.length || 0);
                    return (
                      <button
                        key={ep.id}
                        type="button"
                        onClick={() => setActiveEp(ep.id)}
                        className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#1e376b] text-white border-[#1e376b] shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{ep.name}</span>
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {ENDPOINT_KINDS.find((k) => k.key === ep.kind)?.typeLabel || ep.kind}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {menuCount} 项菜单
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setPane('endpoints')}
                    className="shrink-0 px-3 py-2 text-xs font-bold text-slate-500 hover:text-[#1e376b] hover:bg-blue-50 border border-dashed border-slate-200 hover:border-blue-200 rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                    title="前往访问端管理新增或编辑端"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>管理访问端</span>
                  </button>
                </div>
              </div>

              {/* 下面：菜单管理组件 */}
              <MenuManage
                appName={instance.name}
                appCode={product.code}
                endpointName={currentEp?.name}
                endpointKind={currentEp?.kind}
                menus={currentEpMenus}
                onMenusChange={handleEndpointMenusChange}
                focusMenuId={focusMenuId}
                availableComponents={availableComponentOptions}
                onNavigateToComponents={() => setPane('components')}
              />
            </div>
          )}

          {/* TAB 5: Fallback for publish pane (auto navigated to basic -> app_publish) */}
          {pane === 'publish' && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1e376b]" />
              <p className="text-xs font-bold text-slate-700">正在进入应用发布管理...</p>
            </div>
          )}
        </div>
      </div>

      {/* Pre-Publish Confirm Modal with Warnings */}
      {showPrePublishConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-start gap-3 bg-amber-50/50">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900">发布前自检提示确认</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  系统检测到以下待完善事项，请确认是否继续执行正式发布：
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrePublishConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <ul className="text-xs text-slate-700 space-y-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {prePublishInspection.allWarnings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500">
                点击「确认正式发布上线」后，系统将正式对外生效，并将实例及对应产品自动切换为【启用】状态。
              </p>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPrePublishConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer"
              >
                返回完善
              </button>
              <button
                type="button"
                onClick={executePublish}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>确认正式发布上线</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Success Celebration Modal */}
      {showPublishSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-6 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">🎉 系统正式发布上线成功！</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                实例「<strong>{instance.name}</strong>」与产品「<strong>{product.name}</strong>」已正式发布生效，版本号 <strong className="font-mono text-emerald-700">{instance.publishedVersion}</strong>。
              </p>

              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex flex-col gap-1.5 text-left mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">产品启禁状态:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    已自动切换为【启用】
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">已就绪访问端:</span>
                  <span className="font-bold text-slate-800">{endpoints.length} 个终端</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">已接入组件:</span>
                  <span className="font-bold text-slate-800">{deployedCount} 个能力组件</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowPublishSuccessModal(false)}
                className="w-full py-2 bg-[#1e376b] hover:bg-[#14264c] text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                完成并关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1:1 Endpoint Menu Interactive Sandbox Preview Modal */}
      <EndpointMenuPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        endpoints={endpoints}
        currentEndpointId={previewModalEpId || currentEp?.id || endpoints[0]?.id || ''}
        onChangeEndpoint={(epId) => {
          setPreviewModalEpId(epId);
          setActiveEp(epId);
        }}
        product={product}
        getEndpointMenus={getEpMenus}
        onGoToMenuConfig={(epId) => {
          setActiveEp(epId);
          setPane('menus');
        }}
      />
    </div>
  );
};
