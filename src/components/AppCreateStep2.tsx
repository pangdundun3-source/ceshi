/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FileText,
  Building2,
  ShieldCheck,
  KeyRound,
  LayoutList,
  LayoutGrid,
  TrendingUp,
  Database,
  Search,
  Plus,
  Check,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  X,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Info,
  Sparkles,
  ExternalLink,
  Copy,
  RotateCcw,
  Filter,
  Shield,
  Users,
  Lock,
  Unlock,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FolderPlus,
  SlidersHorizontal,
  Sliders,
  Layers,
  Monitor,
  Cpu,
  BadgeCheck,
  Clock,
  Send,
  Phone,
  User,
  Globe,
  Settings,
  AlertTriangle,
  UploadCloud,
  Upload,
  MessageSquare,
  Image as ImageIcon,
  Eye,
  EyeOff,
  QrCode,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { IntegratedApp } from '../types';
import { validateAppCode } from './AppManagement';
import {
  CustomerOrgItem,
  INITIAL_CUSTOMER_ORGS,
  STATISTICAL_UNITS,
  MASTER_ENTERPRISE_CUSTOMERS
} from '../data/mockCustomerOrgs';
import { CustomerAppConfig } from './CustomerAppConfig';
import { CustomerOrgManage } from './CustomerOrgManage';
import { PermissionDictManage, PrimaryPermItem, SubPermItem, INITIAL_PRIMARY_PERMS } from './PermissionDictManage';
import { DefaultRoleManage, DefaultRoleItem, INITIAL_APP_DEFAULT_ROLES } from './DefaultRoleManage';
import { DataDictManage } from './DataDictManage';
import { MenuManage, SysMenuItem } from './MenuManage';
import { AnalyticsBoard } from './AnalyticsBoard';
import { ExternalUserAppConfig } from './ExternalUserAppConfig';
import { AppBasicConfigPanel, AppBasicConfigForm } from './AppBasicConfigPanel';
import { AppCreateModuleBuilder } from './AppCreateModuleBuilder';
import { AppCreateClientModulesStep } from './AppCreateClientModulesStep';
import { ALL_UNIFIED_MODULE_KEYS } from '../data/unifiedCallModules';
import { AppClientModules, ensureClientModules, pruneClientModules } from '../data/appClients';

export interface AppCreateStep2Props {
  appForm: {
    id?: string;
    appCode: string;
    appName: string;
    appShortName: string;
    appLevel: 'product' | 'feature';
    roleType: 'with_role' | 'no_role';
    homeUrl: string;
    adminUrl?: string;
    appIcon?: string;
    appIconName?: string;
    productManager?: string;
    appCategory?: string;
    protocol?: string;
    officialOrgCount?: number;
    trialOrgCount?: number;
    disabledOrgCount?: number;
    trashOrgCount?: number;
    redirectUri?: string;
    ownerDept?: string;
    ownerName?: string;
    qpsLimit?: number;
    description?: string;
    status?: 'published' | 'unpublished' | 'disabled' | 'active' | 'testing';
    enableExtUserSystem?: boolean;
    extWechatMpName?: string;
    extWechatAppId?: string;
    extWechatAppSecret?: string;
    extWechatToken?: string;
    extWechatEncodingAesKey?: string;
    extWechatQrCode?: string;
    extWechatQrCodeName?: string;
    pageModules?: string[];
    clientConfigs?: AppClientModules;
  };
  existingApps?: IntegratedApp[];
  initialTab?:
    | 'basic_info'
    | 'analytics_board'
    | 'customer_orgs'
    | 'default_roles'
    | 'permission_dict'
    | 'menu_manage'
    | 'data_dict'
    | 'ext_user_config'
    | 'page_modules'
    | 'client_modules'
    | 'app_publish';
  onBackToList: () => void;
  onUpdateAppStatus: (newStatus: 'published' | 'unpublished' | 'disabled') => void;
  onUpdateAppForm?: (updatedForm: AppCreateStep2Props['appForm']) => void;
  sharedMenus?: SysMenuItem[];
  onSharedMenusChange?: React.Dispatch<React.SetStateAction<SysMenuItem[]>>;
  sharedPrimaryPerms?: PrimaryPermItem[];
  onSharedPrimaryPermsChange?: (perms: PrimaryPermItem[]) => void;
  sharedDefaultRoles?: DefaultRoleItem[];
  onSharedDefaultRolesChange?: (roles: DefaultRoleItem[]) => void;
  sharedCustomerOrgs?: CustomerOrgItem[];
  onSharedCustomerOrgsChange?: (orgs: CustomerOrgItem[]) => void;
}

// 权限字典分组与权限项
interface PermGroupItem {
  id: string;
  groupCode: string;
  groupName: string;
  description: string;
}

interface PermItem {
  id: string;
  groupId: string;
  permCode: string; // 权限唯一 ID
  permName: string; // 权限名称
  description: string; // 权限介绍
  permType: 'menu' | 'button' | 'api' | 'data';
}

export const AppCreateStep2: React.FC<AppCreateStep2Props> = ({
  appForm,
  existingApps = [],
  initialTab,
  onBackToList,
  onUpdateAppStatus,
  onUpdateAppForm,
  sharedMenus,
  onSharedMenusChange,
  sharedPrimaryPerms,
  onSharedPrimaryPermsChange,
  sharedDefaultRoles,
  onSharedDefaultRolesChange,
  sharedCustomerOrgs,
  onSharedCustomerOrgsChange
}) => {
  // 当前应用表单数据（支持编辑与数据同步）
  const [currentAppForm, setCurrentAppForm] = useState({
    ...appForm,
    clientConfigs: ensureClientModules(
      appForm.clientConfigs,
      appForm.pageModules?.length ? appForm.pageModules : ALL_UNIFIED_MODULE_KEYS
    )
  });

  // 基础信息编辑状态
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [basicInfoForm, setBasicInfoForm] = useState(appForm);
  const [basicInfoErrors, setBasicInfoErrors] = useState<Record<string, string>>({});

  // 图标上传引用与状态
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);

  // 处理图标文件选择或拖拽
  const handleIconFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIconUploadError(null);

    // 格式检查
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isImageMime = file.type.startsWith('image/') || file.type === 'image/svg+xml';

    if (!validExtensions.includes(ext) && !isImageMime) {
      setIconUploadError('仅支持 JPG、JPEG、GIF、PNG、SVG 格式的图片文件');
      showToast('仅支持 JPG、JPEG、GIF、PNG、SVG 格式的图片文件', 'warning');
      return;
    }

    // 大小检查 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setIconUploadError('图标文件大小不能超过 5MB');
      showToast('图标文件大小不能超过 5MB', 'warning');
      return;
    }

    // 转换为 Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setBasicInfoForm(prev => ({
        ...prev,
        appIcon: base64Url,
        appIconName: file.name
      }));
      showToast(`图标「${file.name}」已成功载入，点击保存生效`, 'success');
    };
    reader.onerror = () => {
      setIconUploadError('文件读取失败，请重新选择');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setBasicInfoForm(prev => ({
      ...prev,
      appIcon: '',
      appIconName: ''
    }));
    if (iconInputRef.current) {
      iconInputRef.current.value = '';
    }
    showToast('已移除应用图标', 'info');
  };

  // 左侧导航目录折叠/收起状态
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // 当前应用状态：默认为未发布（unpublished）
  const [currentStatus, setCurrentStatus] = useState<'published' | 'unpublished' | 'disabled'>(
    appForm.status === 'published' || appForm.status === 'active'
      ? 'published'
      : appForm.status === 'disabled'
      ? 'disabled'
      : 'unpublished'
  );

  // 停用二次确认弹窗
  const [isDisableConfirmModalOpen, setIsDisableConfirmModalOpen] = useState(false);
  // 取消发布（改为未发布）二次确认弹窗
  const [isUnpublishConfirmModalOpen, setIsUnpublishConfirmModalOpen] = useState(false);
  // 有角色应用未配置角色/权限字典时的拦截提示弹窗
  const [isPublishBlockedModalOpen, setIsPublishBlockedModalOpen] = useState(false);
  // 操作反馈提示
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'warning' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 微信公众号独立推送配置状态 (默认关闭)
  const [isWechatMpEnabled, setIsWechatMpEnabled] = useState(false);
  const [wechatMpForm, setWechatMpForm] = useState({
    mpName: '',
    appId: '',
    appSecret: '',
    token: '',
    encodingAesKey: '',
    unactivatedWelcomeMsg: '',
    firstActivationMsg: '',
    activatedWelcomeMsg: '',
    qrCodeUrl: '',
    qrCodeName: ''
  });
  const [wechatMpErrors, setWechatMpErrors] = useState<Record<string, string>>({});
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const qrCodeInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingQr, setIsDraggingQr] = useState(false);

  // 处理公众号关注二维码上传
  const handleQrFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isImageMime = file.type.startsWith('image/') || file.type === 'image/svg+xml';

    if (!validExtensions.includes(ext) && !isImageMime) {
      showToast('仅支持 JPG、JPEG、GIF、PNG、SVG 格式的图片文件', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('二维码图片文件大小不能超过 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setWechatMpForm(prev => ({
        ...prev,
        qrCodeUrl: base64Url,
        qrCodeName: file.name
      }));
      showToast(`公众号关注二维码「${file.name}」上传成功`, 'success');
    };
    reader.onerror = () => {
      showToast('图片读取失败，请重新选择', 'warning');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveQrCode = () => {
    setWechatMpForm(prev => ({
      ...prev,
      qrCodeUrl: '',
      qrCodeName: ''
    }));
    if (qrCodeInputRef.current) {
      qrCodeInputRef.current.value = '';
    }
    showToast('已移除公众号关注二维码', 'info');
  };

  const handleSaveWechatMp = () => {
    if (!isWechatMpEnabled) {
      showToast('当前未开启独立公众号推送', 'info');
      return;
    }

    const errors: Record<string, string> = {};
    if (!wechatMpForm.mpName.trim()) {
      errors.mpName = '微信公众号名称不能为空';
    }
    if (!wechatMpForm.appId.trim()) {
      errors.appId = 'AppID 不能为空';
    }
    if (!wechatMpForm.appSecret.trim()) {
      errors.appSecret = 'AppSecret 不能为空';
    }
    if (!wechatMpForm.token.trim()) {
      errors.token = 'Token 不能为空';
    }
    if (!wechatMpForm.encodingAesKey.trim()) {
      errors.encodingAesKey = 'EncodingAESKey 不能为空';
    }

    if (Object.keys(errors).length > 0) {
      setWechatMpErrors(errors);
      showToast('请完整填写必填的公众号配置信息！', 'warning');
      return;
    }

    setWechatMpErrors({});
    showToast('微信公众号独立推送配置已成功保存！', 'success');
  };

  const handleResetWechatMp = () => {
    setWechatMpForm({
      mpName: '',
      appId: '',
      appSecret: '',
      token: '',
      encodingAesKey: '',
      unactivatedWelcomeMsg: '',
      firstActivationMsg: '',
      activatedWelcomeMsg: '',
      qrCodeUrl: '',
      qrCodeName: ''
    });
    setWechatMpErrors({});
    if (qrCodeInputRef.current) {
      qrCodeInputRef.current.value = '';
    }
    showToast('已重置公众号配置信息', 'info');
  };

  // 默认参数配置已移除

  // 基本信息保存处理（与新增应用阶段执行相同的严格校验规则）
  const handleSaveBasicInfo = () => {
    const errors: Record<string, string> = {};
    const shortName = basicInfoForm.appShortName?.trim() || '';

    // 1. 简称 1~6 字校验
    if (!shortName) {
      errors.appShortName = '请输入应用简称（1~6 个字）';
    } else if (shortName.length < 1 || shortName.length > 6) {
      errors.appShortName = '应用简称长度必须为 1~6 个字（例如：ERP、CRM、谛听预警）';
    }

    // 2. 全称校验
    if (!basicInfoForm.appName?.trim()) {
      errors.appName = '请输入应用全称';
    }

    // 3. 门户网址校验
    if (!basicInfoForm.homeUrl?.trim()) {
      errors.homeUrl = '请输入应用门户网页网址';
    }

    // 4. 所属产品经理校验
    if (!basicInfoForm.productManager?.trim()) {
      errors.productManager = '请输入或指定所属产品经理';
    }

    if (Object.keys(errors).length > 0) {
      setBasicInfoErrors(errors);
      showToast(errors.appShortName || errors.appName || errors.homeUrl || errors.productManager || '请按规则完善必填项信息', 'warning');
      return;
    }

    setBasicInfoErrors({});
    const isPublished = currentStatus === 'published';
    const updated = {
      ...currentAppForm,
      ...basicInfoForm,
      appName: basicInfoForm.appName.trim(),
      appShortName: shortName,
      appIcon: basicInfoForm.appIcon || '',
      appIconName: basicInfoForm.appIconName || '',
      description: basicInfoForm.description ? basicInfoForm.description.trim() : '',
      // 应用一旦创建，唯一 ID 保持不变
      appCode: currentAppForm.appCode,
      homeUrl: basicInfoForm.homeUrl.trim(),
      adminUrl: basicInfoForm.adminUrl ? basicInfoForm.adminUrl.trim() : '',
      productManager: basicInfoForm.productManager.trim(),
      // 发布中状态下不可修改应用级别与角色类型
      appLevel: isPublished ? currentAppForm.appLevel : (basicInfoForm.appLevel || 'product'),
      roleType: isPublished ? currentAppForm.roleType : (basicInfoForm.roleType || 'with_role')
    };
    setCurrentAppForm(updated);
    setIsEditingBasicInfo(false);
    onUpdateAppForm?.(updated);
    showToast('基本信息总览已通过规范校验并成功保存！', 'success');
  };

  // 左侧配置功能菜单状态
  const [activeTab, setActiveTab] = useState<
    | 'basic_info'
    | 'analytics_board'
    | 'customer_orgs'
    | 'default_roles'
    | 'permission_dict'
    | 'menu_manage'
    | 'data_dict'
    | 'ext_user_config'
    | 'page_modules'
    | 'client_modules'
    | 'app_publish'
  >(initialTab === 'app_publish' ? 'basic_info' : initialTab || 'basic_info');

  // 应用配置左侧子菜单状态：'basic_info' | 'wechat_official' | 'app_publish'
  const [appConfigSubTab, setAppConfigSubTab] = useState<
    'basic_info' | 'wechat_official' | 'app_publish'
  >(initialTab === 'app_publish' ? 'app_publish' : 'basic_info');

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'app_publish') {
        setActiveTab('basic_info');
        setAppConfigSubTab('app_publish');
      } else {
        setActiveTab(initialTab);
        if (initialTab === 'basic_info') {
          setAppConfigSubTab('basic_info');
        }
      }
    }
  }, [initialTab, appForm.id]);

  // 复制反馈
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // -------------------------------------------------------------
  // 2. 客户机构状态与数据 (支持全局与局部同步)
  // -------------------------------------------------------------
  const [customerOrgs, setCustomerOrgs] = useState<CustomerOrgItem[]>(() => {
    return (sharedCustomerOrgs || INITIAL_CUSTOMER_ORGS).map(c => ({
      ...c,
      isEnabled: c.isEnabled !== undefined ? c.isEnabled : c.status !== 'disabled'
    }));
  });

  // -------------------------------------------------------------
  // 3. 默认角色状态与模块权限分配数据
  // -------------------------------------------------------------
  const [defaultRoles, setDefaultRoles] = useState<DefaultRoleItem[]>(
    sharedDefaultRoles || INITIAL_APP_DEFAULT_ROLES
  );

  // -------------------------------------------------------------
  // 权限字典状态（层级主权限与嵌套子权限结构）
  // -------------------------------------------------------------
  const [primaryPerms, setPrimaryPerms] = useState<PrimaryPermItem[]>(INITIAL_PRIMARY_PERMS);

  // 计算距离到期天数与状态
  const getDaysUntilExpire = (expireDateStr: string) => {
    if (!expireDateStr) return { days: 0, isExpired: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expireDateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      days: diffDays,
      isExpired: diffDays < 0
    };
  };

  // 横向 Tab：详情页只保留基本配置 / 模块配置 / 接入端配置 / 菜单配置
  const menuConfig = React.useMemo(() => ([
    {
      id: 'basic_info' as const,
      label: '基本配置',
      subtext: '基本信息、公众号、参数与发布',
      icon: FileText,
      badge: ''
    },
    {
      id: 'page_modules' as const,
      label: '模块配置',
      subtext: '二次编辑调用模块与页面搭建',
      icon: Layers,
      badge: ''
    },
    {
      id: 'client_modules' as const,
      label: '接入端配置',
      subtext: '按端勾选该端可见的页面模块',
      icon: Monitor,
      badge: ''
    },
    {
      id: 'menu_manage' as const,
      label: '菜单配置',
      subtext: '导航层级与路由映射',
      icon: LayoutList,
      badge: ''
    }
  ]), []);

  // 如果当前选中的 tab 在配置列表中不存在（如切换角色类型或外部用户状态），自动回退到第一个
  useEffect(() => {
    if (!menuConfig.some(tab => tab.id === activeTab)) {
      setActiveTab('basic_info');
    }
  }, [menuConfig, activeTab]);

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800">
      <div className="w-full flex flex-col gap-5">

        {/* 1. 面包屑导航: 放到顶部介绍框的上面，不要背景了，直接写到页面上 (参考外部用户应用配置单应用配置页面样式) */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pl-1">
          <button
            type="button"
            onClick={onBackToList}
            id="btn_return_to_app_list_top"
            className="text-[#1e376b] hover:text-blue-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
            title="返回应用列表"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>返回应用列表</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-bold">
            {currentAppForm.appShortName || currentAppForm.appName || '应用详情配置'}
          </span>
        </div>

        {/* 2. 顶部全局应用标识与介绍栏 */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          
          {/* Top-Right Corner Border Tag: Role Type (沿着展示框边框的最右上角角标样式，与外层应用列表卡片一致) */}
          <div className="absolute top-0 right-0 z-10 pointer-events-none">
            {currentAppForm.roleType === 'with_role' ? (
              <span
                className="inline-flex items-center gap-1 bg-indigo-50/95 text-indigo-700 border-l border-b border-indigo-200/90 px-3 py-1 rounded-bl-lg text-xs font-bold shadow-2xs"
                title="有角色应用：支持分配多级角色及细粒度数据权限"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>有角色应用</span>
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 bg-emerald-50/95 text-emerald-700 border-l border-b border-emerald-200/90 px-3 py-1 rounded-bl-lg text-xs font-bold shadow-2xs"
                title="无角色应用：全员通用平权访问，无差异化角色控制"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>无角色应用</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3.5">
            {currentAppForm.appIcon ? (
              <div className="w-11 h-11 rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={currentAppForm.appIcon}
                  alt={currentAppForm.appShortName || '应用图标'}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1e376b] to-blue-700 flex items-center justify-center text-white shadow-md font-black text-sm tracking-tight shrink-0">
                {currentAppForm.appShortName?.substring(0, 3) || 'APP'}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-black text-slate-900 tracking-tight">
                  {currentAppForm.appName || '新建应用接入'}
                </h1>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded border border-slate-200">
                  {currentAppForm.appCode}
                </span>
                {currentAppForm.appLevel === 'product' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px] rounded">
                    <Layers className="w-3 h-3 text-purple-600" />
                    产品级应用
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px] rounded">
                    <Cpu className="w-3 h-3 text-sky-600" />
                    功能级应用
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 横向 Tab 标签行 (仿照“外部用户应用配置”单个应用配置页面的 Tab 样式) */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4 pt-2 rounded-xl shadow-xs overflow-x-auto">
          {menuConfig.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                id={`tab_step2_${tab.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#1e376b] text-[#1e376b] bg-blue-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#1e376b]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    tab.badgeClass
                      ? tab.badgeClass
                      : isActive
                        ? 'bg-[#1e376b] text-white'
                        : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* 4. 主体各模块详细内容区 */}
        <div className="w-full flex flex-col gap-5">

          {/* ---------------- 1. 应用配置 (包含左侧菜单 + 统一框体内右侧配置内容) ---------------- */}
          {activeTab === 'basic_info' && (
            <AppBasicConfigPanel
              appForm={currentAppForm}
              onUpdateAppForm={(updated) => {
                setCurrentAppForm(updated as any);
                onUpdateAppForm?.(updated as any);
              }}
              currentStatus={currentStatus}
              onUpdateAppStatus={(status) => {
                setCurrentStatus(status);
                onUpdateAppStatus?.(status);
              }}
              showToast={showToast}
              initialSubTab={appConfigSubTab}
            />
          )}

          {activeTab === 'page_modules' && (
            <AppCreateModuleBuilder
              mode="detail"
              appName={currentAppForm.appName}
              selectedKeys={currentAppForm.pageModules?.length ? currentAppForm.pageModules : ALL_UNIFIED_MODULE_KEYS}
              onChange={(keys) => {
                setCurrentAppForm(prev => {
                  const updated = {
                    ...prev,
                    pageModules: keys,
                    clientConfigs: pruneClientModules(prev.clientConfigs, keys)
                  };
                  onUpdateAppForm?.(updated);
                  return updated;
                });
              }}
              onSave={() => {
                showToast('页面模块已保存，后续可随时二次编辑', 'success');
              }}
            />
          )}

          {activeTab === 'client_modules' && (
            <AppCreateClientModulesStep
              mode="detail"
              appName={currentAppForm.appName}
              availableModules={currentAppForm.pageModules?.length ? currentAppForm.pageModules : ALL_UNIFIED_MODULE_KEYS}
              clientConfigs={currentAppForm.clientConfigs || {}}
              onChange={(configs) => {
                setCurrentAppForm(prev => {
                  const updated = { ...prev, clientConfigs: configs };
                  onUpdateAppForm?.(updated);
                  return updated;
                });
              }}
              onSave={() => {
                showToast('接入端配置已保存，后续可随时二次编辑', 'success');
              }}
            />
          )}

          {/* ---------------- 2. 客户机构页面 (已模块化并与统一调用组件-应用客户机构联动) ---------------- */}
          {activeTab === "customer_orgs" && (
            <CustomerOrgManage
              appName={currentAppForm.appName}
              appCode={currentAppForm.appCode}
              appShortName={currentAppForm.appShortName}
              roleType={currentAppForm.roleType}
              customerOrgs={sharedCustomerOrgs || customerOrgs}
              onChangeCustomerOrgs={(updated) => {
                setCustomerOrgs(updated);
                onSharedCustomerOrgsChange?.(updated);
              }}
              showToast={showToast}
            />
          )}

          {/* ---------------- 3. 权限字典页面 (全新层级树状结构，支持同级排序与统一展开/收起) ---------------- */}
            {activeTab === 'permission_dict' && (
              <PermissionDictManage
                appCode={appForm.appCode}
                primaryPerms={sharedPrimaryPerms || primaryPerms}
                onChangePrimaryPerms={(updated) => {
                  setPrimaryPerms(updated);
                  onSharedPrimaryPermsChange?.(updated);
                }}
                showToast={showToast}
              />
            )}

            {/* ---------------- 4. 默认角色页面 ---------------- */}
            {activeTab === 'default_roles' && (
              <DefaultRoleManage
                appCode={appForm.appCode}
                defaultRoles={sharedDefaultRoles || defaultRoles}
                onChangeDefaultRoles={(updatedRoles) => {
                  setDefaultRoles(updatedRoles);
                  onSharedDefaultRolesChange?.(updatedRoles);
                }}
                primaryPerms={sharedPrimaryPerms || primaryPerms}
                showToast={showToast}
              />
            )}

            {/* ---------------- 5. 菜单管理 ---------------- */}
            {activeTab === 'menu_manage' && (
              <MenuManage
                appName={currentAppForm.appName || '谛听预警系统'}
                appCode={currentAppForm.appCode || 'APP-DITING-01'}
                menus={sharedMenus}
                onMenusChange={onSharedMenusChange}
                onShowToast={(txt, tp) => showToast(txt, tp)}
              />
            )}

            {/* ---------------- 6. 分析看板 ---------------- */}
            {activeTab === 'analytics_board' && (
              <AnalyticsBoard
                appName={currentAppForm.appName || '谛听预警系统'}
                appCode={currentAppForm.appCode || 'APP-DITING-01'}
                roleType={currentAppForm.roleType || 'with_role'}
                customerCount={customerOrgs.length}
                onShowToast={(txt, tp) => showToast(txt, tp)}
              />
            )}

            {/* ---------------- 7. 数据字典 ---------------- */}
            {activeTab === 'data_dict' && (
              <DataDictManage
                appName={currentAppForm.appName || '正管用-网络生态综合治理平台'}
                appCode={currentAppForm.appCode || 'APP-ZGY-01'}
                onShowToast={(txt, tp) => showToast(txt, tp)}
              />
            )}

            {/* ---------------- 8. 外部用户体系配置 ---------------- */}
            {activeTab === 'ext_user_config' && (
              <div className="w-full flex flex-col">
                <ExternalUserAppConfig
                  initialEditingAppCode={currentAppForm.appCode}
                  hideBreadcrumb={true}
                />
              </div>
            )}

        </div>

      </div>

      {/* ============================================================= */}
      {/* 模态弹窗：停用二次确认弹窗 (所有应用设为停用时均必须二次确认) */}
      {/* ============================================================= */}
      {isDisableConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-950">应用停用二次确认</h3>
                  <p className="text-[11px] text-rose-700 font-medium">请谨慎操作重要生产环境配置</p>
                </div>
              </div>
              <button
                onClick={() => setIsDisableConfirmModalOpen(false)}
                className="p-1 rounded-lg text-rose-700 hover:bg-rose-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">
                您即将把应用「<span className="text-rose-600 font-black">{appForm.appName || appForm.appShortName}</span>」的状态修改为 <span className="text-rose-600 font-black">「停用」</span>。
              </p>
              <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1.5 text-[11px] text-rose-900">
                <p>• 停用后，所有已开通该应用的客户机构将<strong>无法登录或访问</strong>此应用；</p>
                <p>• 应用的 API 接口鉴权与单点登录（SSO）将<strong>立即暂停响应</strong>；</p>
                <p>• 您可以随时在控制台重新将其状态切换为「未发布」或「已发布」。</p>
              </div>
              <p className="text-slate-500 text-[11px]">
                确定要继续停用该应用吗？
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDisableConfirmModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStatus('disabled');
                  onUpdateAppStatus('disabled');
                  setIsDisableConfirmModalOpen(false);
                  showToast('应用已成功切换为「停用」状态', 'warning');
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                id="btn_confirm_disable_app"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>确认停用</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 模态弹窗：有角色应用未配置角色或权限字典时的拦截提示 */}
      {/* ============================================================= */}
      {isPublishBlockedModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-amber-50/90 border-b border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-950">无法切换为「已发布」状态</h3>
                  <p className="text-[11px] text-amber-800 font-medium">有角色应用发布前安全规则校验拦截</p>
                </div>
              </div>
              <button
                onClick={() => setIsPublishBlockedModalOpen(false)}
                className="p-1 rounded-lg text-amber-800 hover:bg-amber-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3 text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-slate-900">
                系统检测到当前应用为 <span className="text-indigo-600 font-black">「有角色应用」</span>：
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    1. 默认角色配置情况：
                  </span>
                  <span className={`font-bold ${defaultRoles.length > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {defaultRoles.length > 0 ? `已配置 (${defaultRoles.length}个)` : '未配置 (0个)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    2. 权限字典配置情况：
                  </span>
                  <span className={`font-bold ${primaryPerms.length > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {primaryPerms.length > 0 ? `已配置 (${primaryPerms.length}个主权限)` : '未配置 (0个)'}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-[11px]">
                按照平台安全管理规范：<strong>有角色应用</strong>必须至少配置一项<strong>默认角色</strong>与一项<strong>权限字典</strong>后方可对外发布提供鉴权服务。
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsPublishBlockedModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                知道了，暂不发布
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPublishBlockedModalOpen(false);
                  setActiveTab(defaultRoles.length === 0 ? 'default_roles' : 'permission_dict');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>前往配置{defaultRoles.length === 0 ? '默认角色' : '权限字典'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 模态弹窗：取消发布确认弹窗 (改为未发布状态提示) */}
      {/* ============================================================= */}
      {isUnpublishConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 bg-blue-50/90 border-b border-blue-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">取消发布提示</h3>
                  <p className="text-[11px] text-blue-700 font-medium">应用状态变更为未发布</p>
                </div>
              </div>
              <button
                onClick={() => setIsUnpublishConfirmModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-1.5 text-xs text-amber-900 font-medium">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>重要提示</span>
                </div>
                <p className="pl-5 text-amber-900 font-bold text-[13px] leading-normal">
                  改为未发布状态后，在其他的业务系统中将无法看到这个应用。
                </p>
              </div>
              <p className="text-slate-500 text-[11px]">
                确定要将应用「<strong className="text-slate-800">{currentAppForm.appName || currentAppForm.appShortName}</strong>」改为未发布状态吗？
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsUnpublishConfirmModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStatus('unpublished');
                  onUpdateAppStatus('unpublished');
                  setIsUnpublishConfirmModalOpen(false);
                  showToast('应用状态已设置为「未发布」', 'info');
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                id="btn_confirm_unpublish_app"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>确认改为未发布</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* Toast 提示浮窗 */}
      {/* ============================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
              : toastMessage.type === 'warning'
              ? 'bg-amber-600 text-white border-amber-500 shadow-amber-500/20'
              : 'bg-slate-800 text-white border-slate-700 shadow-slate-900/30'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : toastMessage.type === 'warning' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
};
