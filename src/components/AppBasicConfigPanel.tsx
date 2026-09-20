/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  FileText,
  MessageSquare,
  Send,
  Edit2,
  X,
  Check,
  Lock,
  Copy,
  Globe,
  ExternalLink,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  UploadCloud,
  Upload,
  Trash2,
  Layers,
  Cpu,
  ShieldCheck,
  BadgeCheck,
  User,
  Info,
  Eye,
  EyeOff,
  QrCode,
  ChevronRight
} from 'lucide-react';
import { IntegratedApp } from '../types';

export interface AppBasicConfigForm {
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
}

export interface AppBasicConfigPanelProps {
  appForm: AppBasicConfigForm;
  onUpdateAppForm?: (updated: AppBasicConfigForm) => void;
  currentStatus?: 'published' | 'unpublished' | 'disabled';
  onUpdateAppStatus?: (status: 'published' | 'unpublished' | 'disabled') => void;
  showToast?: (text: string, type?: 'success' | 'warning' | 'info') => void;
  initialSubTab?: 'basic_info' | 'wechat_official' | 'app_publish';
}

export const AppBasicConfigPanel: React.FC<AppBasicConfigPanelProps> = ({
  appForm,
  onUpdateAppForm,
  currentStatus: propStatus,
  onUpdateAppStatus,
  showToast: propShowToast,
  initialSubTab = 'basic_info'
}) => {
  // 内部 toast 兜底
  const [internalToast, setInternalToast] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    if (propShowToast) {
      propShowToast(text, type);
    } else {
      setInternalToast({ text, type });
      setTimeout(() => setInternalToast(null), 3000);
    }
  };

  // 当前应用状态
  const [currentStatus, setCurrentStatus] = useState<'published' | 'unpublished' | 'disabled'>(
    propStatus ||
      (appForm.status === 'published' || appForm.status === 'active'
        ? 'published'
        : appForm.status === 'disabled'
        ? 'disabled'
        : 'unpublished')
  );

  // 子菜单状态
  const [appConfigSubTab, setAppConfigSubTab] = useState<'basic_info' | 'wechat_official' | 'app_publish'>(initialSubTab);

  // 基础信息编辑状态
  const [currentAppForm, setCurrentAppForm] = useState<AppBasicConfigForm>(appForm);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [basicInfoForm, setBasicInfoForm] = useState<AppBasicConfigForm>(appForm);
  const [basicInfoErrors, setBasicInfoErrors] = useState<Record<string, string>>({});

  // 图标上传引用与状态
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);

  // 微信公众号独立推送配置状态
  const [isWechatMpEnabled, setIsWechatMpEnabled] = useState(
    Boolean(appForm.extWechatAppId || appForm.extWechatMpName)
  );
  const [wechatMpForm, setWechatMpForm] = useState({
    mpName: appForm.extWechatMpName || '',
    appId: appForm.extWechatAppId || '',
    appSecret: appForm.extWechatAppSecret || '',
    token: appForm.extWechatToken || '',
    encodingAesKey: appForm.extWechatEncodingAesKey || '',
    unactivatedWelcomeMsg: '',
    firstActivationMsg: '',
    activatedWelcomeMsg: '',
    qrCodeUrl: appForm.extWechatQrCode || '',
    qrCodeName: appForm.extWechatQrCodeName || ''
  });
  const [wechatMpErrors, setWechatMpErrors] = useState<Record<string, string>>({});
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const qrCodeInputRef = useRef<HTMLInputElement | null>(null);
  const [isDraggingQr, setIsDraggingQr] = useState(false);

  // 复制反馈
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  // 处理图标文件选择或拖拽
  const handleIconFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIconUploadError(null);

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isImageMime = file.type.startsWith('image/') || file.type === 'image/svg+xml';

    if (!validExtensions.includes(ext) && !isImageMime) {
      setIconUploadError('仅支持 JPG、JPEG、GIF、PNG、SVG 格式的图片文件');
      showToast('仅支持 JPG、JPEG、GIF、PNG、SVG 格式的图片文件', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setIconUploadError('图标文件大小不能超过 5MB');
      showToast('图标文件大小不能超过 5MB', 'warning');
      return;
    }

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

  // 处理公众号二维码
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
    const updated = {
      ...currentAppForm,
      extWechatMpName: wechatMpForm.mpName.trim(),
      extWechatAppId: wechatMpForm.appId.trim(),
      extWechatAppSecret: wechatMpForm.appSecret.trim(),
      extWechatToken: wechatMpForm.token.trim(),
      extWechatEncodingAesKey: wechatMpForm.encodingAesKey.trim(),
      extWechatQrCode: wechatMpForm.qrCodeUrl,
      extWechatQrCodeName: wechatMpForm.qrCodeName
    };
    setCurrentAppForm(updated);
    onUpdateAppForm?.(updated);
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

  // 基本信息保存处理
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
      appCode: currentAppForm.appCode,
      homeUrl: basicInfoForm.homeUrl.trim(),
      adminUrl: basicInfoForm.adminUrl ? basicInfoForm.adminUrl.trim() : '',
      productManager: basicInfoForm.productManager.trim(),
      appLevel: isPublished ? currentAppForm.appLevel : (basicInfoForm.appLevel || 'product'),
      roleType: isPublished ? currentAppForm.roleType : (basicInfoForm.roleType || 'with_role')
    };
    setCurrentAppForm(updated);
    setIsEditingBasicInfo(false);
    onUpdateAppForm?.(updated);
    showToast('基本信息总览已通过规范校验并成功保存！', 'success');
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Toast 提示 */}
      {internalToast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2 ${
            internalToast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : internalToast.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            {internalToast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            {internalToast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600" />}
            {internalToast.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
            <span>{internalToast.text}</span>
          </div>
        </div>
      )}

      {/* 统一大框体内结构：包含左侧子菜单 + 右侧对应子内容 */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col md:flex-row flex-1 min-h-[620px] overflow-hidden" id="app_basic_config_unified_card">
        
        {/* 左侧菜单栏 (严格遵循截图样式：纯白卡片、精致内边距、左侧深蓝竖条指示高亮、去除右箭头与小圆点) */}
        <div className="w-full md:w-52 lg:w-56 bg-white md:border-r border-b md:border-b-0 border-slate-200/80 shrink-0 flex flex-col">
          <nav className="flex-1 divide-y divide-slate-100" id="nav_app_config_submenu">
            {/* (a) 基本信息 */}
            <button
              type="button"
              onClick={() => setAppConfigSubTab('basic_info')}
              id="submenu_basic_info"
              className={`w-full px-5 py-4 flex items-center text-left transition-all cursor-pointer select-none text-[13px] ${
                appConfigSubTab === 'basic_info'
                  ? 'bg-white text-[#1e376b] font-bold border-l-4 border-[#1e376b]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50/70 border-l-4 border-transparent font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`w-4 h-4 shrink-0 ${appConfigSubTab === 'basic_info' ? 'text-[#1e376b]' : 'text-slate-500'}`} />
                <span>基本信息</span>
              </div>
            </button>

            {/* (b) 公众号设置 */}
            <button
              type="button"
              onClick={() => setAppConfigSubTab('wechat_official')}
              id="submenu_wechat_official"
              className={`w-full px-5 py-4 flex items-center text-left transition-all cursor-pointer select-none text-[13px] ${
                appConfigSubTab === 'wechat_official'
                  ? 'bg-white text-[#1e376b] font-bold border-l-4 border-[#1e376b]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50/70 border-l-4 border-transparent font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className={`w-4 h-4 shrink-0 ${appConfigSubTab === 'wechat_official' ? 'text-[#1e376b]' : 'text-slate-500'}`} />
                <span>公众号设置</span>
              </div>
            </button>

            {/* (c) 应用发布 */}
            <button
              type="button"
              onClick={() => setAppConfigSubTab('app_publish')}
              id="submenu_app_publish"
              className={`w-full px-5 py-4 flex items-center text-left transition-all cursor-pointer select-none text-[13px] ${
                appConfigSubTab === 'app_publish'
                  ? 'bg-white text-[#1e376b] font-bold border-l-4 border-[#1e376b]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50/70 border-l-4 border-transparent font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Send className={`w-4 h-4 shrink-0 ${appConfigSubTab === 'app_publish' ? 'text-[#1e376b]' : 'text-slate-500'}`} />
                <span>应用发布</span>
              </div>
            </button>
          </nav>
        </div>

        {/* 右侧配置内容区 */}
        <div className="flex-1 min-w-0 p-6 sm:p-7 flex flex-col gap-6">

          {/* ---------------- (a) 基本信息 ---------------- */}
          {appConfigSubTab === 'basic_info' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>基本信息总览</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isEditingBasicInfo
                      ? '您正在编辑基本信息，修改完成后请点击右侧「保存」按钮：'
                      : '以下为已创建入库的应用基础档案信息，采用单行条目形式呈现核对：'}
                  </p>
                </div>
            
                {/* 右侧操作按钮 */}
                {!isEditingBasicInfo ? (
                  <button
                    type="button"
                    onClick={() => {
                      setBasicInfoForm({ ...currentAppForm });
                      setBasicInfoErrors({});
                      setIsEditingBasicInfo(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                    id="btn_edit_basic_info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>编辑</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingBasicInfo(false);
                        setBasicInfoForm({ ...currentAppForm });
                        setBasicInfoErrors({});
                        setIconUploadError(null);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      id="btn_cancel_basic_info"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>取消</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBasicInfo}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      id="btn_save_basic_info"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>保存</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 一行显示一个的属性清单 - 横线分割形式 */}
              <div className="divide-y divide-slate-200/80">

                {/* 条目 1: 应用唯一 ID (全局标识) */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>应用唯一 ID (全局标识)</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black text-slate-900 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 tracking-wider">
                            {currentAppForm.appCode || '未填写'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentAppForm.appCode, 'appCode')}
                          className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          {copiedField === 'appCode' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'appCode' ? '已复制' : '复制ID'}</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 tracking-wider flex items-center gap-1.5 cursor-not-allowed">
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          {currentAppForm.appCode}
                        </span>
                        <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          应用创建后唯一 ID 锁定不可修改
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(currentAppForm.appCode, 'appCode')}
                          className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          {copiedField === 'appCode' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'appCode' ? '已复制' : '复制ID'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目 2: 应用简称 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>应用简称 (1~6个字)</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {currentAppForm.appShortName || '未填写'}
                      </span>
                    ) : (
                      <div className="flex-1 max-w-sm">
                        <input
                          type="text"
                          maxLength={6}
                          value={basicInfoForm.appShortName || ''}
                          onChange={(e) => {
                            setBasicInfoForm(p => ({ ...p, appShortName: e.target.value }));
                            if (basicInfoErrors.appShortName) {
                              setBasicInfoErrors(p => ({ ...p, appShortName: '' }));
                            }
                          }}
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                            basicInfoErrors.appShortName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                          }`}
                          placeholder="请输入1~6字应用简称"
                        />
                        {basicInfoErrors.appShortName && (
                          <p className="text-[11px] text-rose-500 mt-1">{basicInfoErrors.appShortName}</p>
                        )}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400">用于系统导航与图标底部徽标（1~6字）</span>
                  </div>
                </div>

                {/* 条目 3: 应用全称 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>应用全称</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <span className="text-xs font-black text-slate-900">
                        {currentAppForm.appName || '未填写'}
                      </span>
                    ) : (
                      <div className="flex-1 max-w-md">
                        <input
                          type="text"
                          value={basicInfoForm.appName || ''}
                          onChange={(e) => {
                            setBasicInfoForm(p => ({ ...p, appName: e.target.value }));
                            if (basicInfoErrors.appName) {
                              setBasicInfoErrors(p => ({ ...p, appName: '' }));
                            }
                          }}
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                            basicInfoErrors.appName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                          }`}
                          placeholder="请输入应用全称"
                        />
                        {basicInfoErrors.appName && (
                          <p className="text-[11px] text-rose-500 mt-1">{basicInfoErrors.appName}</p>
                        )}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400">对外展示与单点登录授权全名</span>
                  </div>
                </div>

                {/* 条目 4: 应用简介 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2 pt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>应用简介</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {!isEditingBasicInfo ? (
                      <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        {currentAppForm.description?.trim() || '暂无应用简介'}
                      </p>
                    ) : (
                      <div className="flex-1 max-w-xl">
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={basicInfoForm.description || ''}
                          onChange={(e) => {
                            setBasicInfoForm(p => ({ ...p, description: e.target.value }));
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed resize-none"
                          placeholder="请输入应用业务定位与简要描述"
                        />
                        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                          <span>提示：展示在应用介绍或详情中，直接平铺显示文字</span>
                          <span>{(basicInfoForm.description || '').length} / 200 字</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目 5: V8客户入口网址 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>V8客户入口网址</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          {currentAppForm.homeUrl ? (
                            <a
                              href={currentAppForm.homeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono font-bold text-blue-700 hover:underline flex items-center gap-1"
                            >
                              <span>{currentAppForm.homeUrl}</span>
                              <ExternalLink className="w-3 h-3 text-blue-400" />
                            </a>
                          ) : (
                            <span className="text-xs font-mono font-bold text-slate-400 italic">未配置</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {currentAppForm.homeUrl && (
                            <button
                              onClick={() => handleCopy(currentAppForm.homeUrl, 'homeUrl')}
                              className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              {copiedField === 'homeUrl' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'homeUrl' ? '已复制' : '复制网址'}</span>
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 max-w-md">
                        <input
                          type="text"
                          value={basicInfoForm.homeUrl || ''}
                          onChange={(e) => {
                            setBasicInfoForm(p => ({ ...p, homeUrl: e.target.value }));
                            if (basicInfoErrors.homeUrl) {
                              setBasicInfoErrors(p => ({ ...p, homeUrl: '' }));
                            }
                          }}
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                            basicInfoErrors.homeUrl ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                          }`}
                          placeholder="https://app.example.com"
                        />
                        {basicInfoErrors.homeUrl && (
                          <p className="text-[11px] text-rose-500 mt-1">{basicInfoErrors.homeUrl}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目 6: MT管理端入口网址 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>MT管理端入口网址</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          {currentAppForm.adminUrl ? (
                            <a
                              href={currentAppForm.adminUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-mono font-bold text-indigo-700 hover:underline flex items-center gap-1"
                            >
                              <span>{currentAppForm.adminUrl}</span>
                              <ExternalLink className="w-3 h-3 text-indigo-400" />
                            </a>
                          ) : (
                            <span className="text-xs font-mono text-slate-400 italic">未配置MT管理端地址</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {currentAppForm.adminUrl && (
                            <button
                              onClick={() => handleCopy(currentAppForm.adminUrl || '', 'adminUrl')}
                              className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              {copiedField === 'adminUrl' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === 'adminUrl' ? '已复制' : '复制网址'}</span>
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 max-w-md">
                        <input
                          type="text"
                          value={basicInfoForm.adminUrl || ''}
                          onChange={(e) => {
                            setBasicInfoForm(p => ({ ...p, adminUrl: e.target.value }));
                          }}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="例如：https://app.example.com/admin"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">MT管理后台独立控制台地址（支持编辑维护）</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目: 应用图标修改 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2 pt-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>应用图标修改</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {!isEditingBasicInfo ? (
                      <div className="flex items-center gap-3.5 flex-wrap">
                        {currentAppForm.appIcon ? (
                          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                            <img
                              src={currentAppForm.appIcon}
                              alt={currentAppForm.appShortName || '应用图标'}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e376b] to-blue-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                            {currentAppForm.appShortName?.substring(0, 3) || 'APP'}
                          </div>
                        )}

                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              {currentAppForm.appIconName || (currentAppForm.appIcon ? '已配置图标文件' : '系统默认图标')}
                            </span>
                            {currentAppForm.appIcon ? (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                图标已就绪
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded">
                                默认生成徽标
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {currentAppForm.appIcon
                              ? '已成功上传自定义图标，在系统导航与应用卡片中展示'
                              : '未上传自定义文件时，系统将使用应用简称自动生成默认色块图标'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-w-xl">
                        <input
                          ref={iconInputRef}
                          type="file"
                          id="edit_app_icon_input"
                          accept=".jpg,.jpeg,.gif,.png,.svg,image/jpeg,image/png,image/gif,image/svg+xml"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleIconFiles(e.target.files);
                            }
                          }}
                        />

                        {!basicInfoForm.appIcon ? (
                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingIcon(true);
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              setIsDraggingIcon(false);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingIcon(false);
                              handleIconFiles(e.dataTransfer.files);
                            }}
                            onClick={() => iconInputRef.current?.click()}
                            className={`w-full p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3.5 select-none ${
                              isDraggingIcon
                                ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                                : 'border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/20'
                            }`}
                            id="edit_app_icon_dropzone"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                                <UploadCloud className="w-5 h-5 stroke-[2]" />
                              </div>
                              <div className="flex flex-col gap-0.5 text-center sm:text-left">
                                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                                  <span>点击上传图标</span>
                                  <span className="text-slate-400 font-normal">或拖拽文件至此处</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  支持 JPG、JPEG、GIF、PNG、SVG 格式，小于 5MB
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                iconInputRef.current?.click();
                              }}
                              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              <span>选择本地文件</span>
                            </button>
                          </div>
                        ) : (
                          <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center relative overflow-hidden shrink-0 shadow-2xs">
                                <img
                                  src={basicInfoForm.appIcon}
                                  alt="应用图标预览"
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              </div>

                              <div className="flex flex-col gap-0.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                                    {basicInfoForm.appIconName || '已上传图标文件'}
                                  </span>
                                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] rounded flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    新图标已就绪
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  点击保存后将更新应用图标档案
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => iconInputRef.current?.click()}
                                className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                title="更换新图标"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>更换</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveIcon}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                                title="移除图标"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {iconUploadError && (
                          <p className="text-[11px] text-rose-500 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{iconUploadError}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目 7: 应用级别分类 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>应用级别分类</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <>
                        {currentAppForm.appLevel === 'product' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded border border-purple-200 flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-purple-700" />
                              产品级应用
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded border border-sky-200 flex items-center gap-1.5">
                              <Cpu className="w-3.5 h-3.5 text-sky-700" />
                              功能级应用
                            </span>
                          </div>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {currentAppForm.appLevel === 'product' ? '面向终端用户完整业务工作台' : '为各系统提供通用支撑服务'}
                        </span>
                      </>
                    ) : currentStatus === 'published' ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        {basicInfoForm.appLevel === 'product' ? (
                          <span className="px-3 py-1.5 bg-purple-50/90 text-purple-700 border border-purple-300 rounded-lg text-xs font-bold flex items-center gap-1.5 opacity-90 cursor-not-allowed">
                            <Layers className="w-3.5 h-3.5 text-purple-600" />
                            <span>产品级应用</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-sky-50/90 text-sky-700 border border-sky-300 rounded-lg text-xs font-bold flex items-center gap-1.5 opacity-90 cursor-not-allowed">
                            <Cpu className="w-3.5 h-3.5 text-sky-600" />
                            <span>功能级应用</span>
                          </span>
                        )}
                        <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          应用发布中状态下不可修改级别分类
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            let updatedCode = basicInfoForm.appCode || '';
                            if (updatedCode.startsWith('V8-M-')) {
                              updatedCode = 'V8-P-' + updatedCode.substring(5);
                            }
                            setBasicInfoForm(p => ({ ...p, appLevel: 'product', appCode: updatedCode }));
                            if (basicInfoErrors.appCode) setBasicInfoErrors(p => ({ ...p, appCode: '' }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                            basicInfoForm.appLevel === 'product'
                              ? 'bg-purple-50 text-purple-700 border-purple-300 ring-2 ring-purple-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5 text-purple-600" />
                          <span>产品级应用</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            let updatedCode = basicInfoForm.appCode || '';
                            if (updatedCode.startsWith('V8-P-')) {
                              updatedCode = 'V8-M-' + updatedCode.substring(5);
                            }
                            setBasicInfoForm(p => ({ ...p, appLevel: 'feature', appCode: updatedCode }));
                            if (basicInfoErrors.appCode) setBasicInfoErrors(p => ({ ...p, appCode: '' }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                            basicInfoForm.appLevel === 'feature'
                              ? 'bg-sky-50 text-sky-700 border-sky-300 ring-2 ring-sky-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5 text-sky-600" />
                          <span>功能级应用</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目 8: 角色类型模式 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>角色类型模式</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <>
                        {currentAppForm.roleType === 'with_role' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-indigo-800 bg-indigo-100/80 px-2.5 py-1 rounded border border-indigo-200 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                              有角色应用
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1.5">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-700" />
                              无角色应用
                            </span>
                          </div>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {currentAppForm.roleType === 'with_role' ? '支持配置默认角色与权限字典' : '开通后用户无需角色即可使用'}
                        </span>
                      </>
                    ) : currentStatus === 'published' ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        {basicInfoForm.roleType === 'with_role' ? (
                          <span className="px-3 py-1.5 bg-indigo-50/90 text-indigo-700 border border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5 opacity-90 cursor-not-allowed">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>有角色应用</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-emerald-50/90 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 opacity-90 cursor-not-allowed">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>无角色应用</span>
                          </span>
                        )}
                        <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          应用发布中状态下不可修改角色模式
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setBasicInfoForm(p => ({ ...p, roleType: 'with_role' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                            basicInfoForm.roleType === 'with_role'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-2 ring-indigo-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>有角色应用</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setBasicInfoForm(p => ({ ...p, roleType: 'no_role' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-all ${
                            basicInfoForm.roleType === 'no_role'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>无角色应用</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 条目 9: 所属产品经理 */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="w-48 text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>所属产品经理</span>
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-3 flex-wrap">
                    {!isEditingBasicInfo ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1 rounded border border-slate-200 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-teal-600" />
                          {currentAppForm.productManager || '未指定'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex-1 max-w-sm">
                        <input
                          type="text"
                          value={basicInfoForm.productManager || ''}
                          onChange={(e) => {
                            setBasicInfoForm(p => ({ ...p, productManager: e.target.value }));
                            if (basicInfoErrors.productManager) {
                              setBasicInfoErrors(p => ({ ...p, productManager: '' }));
                            }
                          }}
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                            basicInfoErrors.productManager ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                          }`}
                          placeholder="请输入所属产品经理姓名"
                        />
                        {basicInfoErrors.productManager && (
                          <p className="text-[11px] text-rose-500 mt-1">{basicInfoErrors.productManager}</p>
                        )}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400">负责业务规划、功能演进与版本验收</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ---------------- (b) 公众号设置 ---------------- */}
          {appConfigSubTab === 'wechat_official' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* 头部标题与独立公众号推送开关及操作按钮 */}
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>公众号设置</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      微信公众号服务号接入、网页授权登录及消息模板通知设置
                    </p>
                  </div>

                  {/* 右侧：是否启用独立公众号数据推送开关 */}
                  <div className="flex items-center justify-end gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs self-start sm:self-auto shrink-0 sm:ml-auto">
                    <span className="text-xs font-bold text-slate-700 select-none">
                      是否启用独立的公众号进行数据推送？
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isWechatMpEnabled}
                      onClick={() => {
                        const nextState = !isWechatMpEnabled;
                        setIsWechatMpEnabled(nextState);
                        if (nextState) {
                          showToast('已开启独立公众号数据推送配置', 'info');
                        } else {
                          setWechatMpErrors({});
                          showToast('已关闭独立公众号配置，恢复使用平台默认推送通道', 'info');
                        }
                      }}
                      className={`relative inline-flex h-6 w-14 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-200 ease-in-out select-none focus:outline-hidden ${
                        isWechatMpEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                      id="switch_wechat_mp_enabled"
                    >
                      <span
                        className={`absolute text-[10px] font-bold tracking-tight transition-opacity duration-200 ${
                          isWechatMpEnabled ? 'left-2 text-white' : 'right-2 text-slate-600'
                        }`}
                      >
                        {isWechatMpEnabled ? '启用' : '关闭'}
                      </span>
                      <span
                        className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          isWechatMpEnabled ? 'translate-x-8.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 第二行：另起一行且居右对齐的“重置”和“保存”按钮（开启状态下显示） */}
                {isWechatMpEnabled && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleResetWechatMp}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      id="btn_reset_wechat_mp_top"
                    >
                      <span>重置</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveWechatMp}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      id="btn_save_wechat_mp"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>保存</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 状态1: 未启用独立公众号推送 */}
              {!isWechatMpEnabled && (
                <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50/70 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shadow-2xs">
                    <MessageSquare className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <h4 className="text-sm font-bold text-slate-800">当前未启用独立公众号推送</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      系统默认将采用 V8 平台公共服务号通道下发各类业务待办通知与指令流转提醒。如需使用该应用专属的微信公众号（服务号）独立推送，请开启上方开关。
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsWechatMpEnabled(true);
                      showToast('已开启独立公众号数据推送配置', 'info');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    id="btn_enable_wechat_mp_center"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>开启独立公众号推送</span>
                  </button>
                </div>
              )}

              {/* 状态2: 已启用独立公众号推送 -> 录入配置表单 */}
              {isWechatMpEnabled && (
                <div className="flex flex-col gap-5 animate-in fade-in duration-200">
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-medium">
                      已启用独立公众号推送配置。请录入并在微信公众平台（mp.weixin.qq.com）配置以下参数，带 <span className="text-rose-600 font-bold">*</span> 为必填字段。
                    </div>
                  </div>

                  {/* 表单字段列表 */}
                  <div className="grid grid-cols-1 gap-5 bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
                    {/* 1. 微信公众号名称 */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_mp_name">
                        <span>1. 微信公众号名称</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        id="wechat_mp_name"
                        type="text"
                        value={wechatMpForm.mpName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWechatMpForm(prev => ({ ...prev, mpName: val }));
                          if (val.trim()) {
                            setWechatMpErrors(prev => ({ ...prev, mpName: '' }));
                          }
                        }}
                        placeholder="请输入微信公众号名称（例如：点点速报、正管用平台）"
                        className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs outline-none transition-colors ${
                          wechatMpErrors.mpName
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900'
                            : 'border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800'
                        }`}
                      />
                      {wechatMpErrors.mpName ? (
                        <p className="text-[11px] text-rose-500">{wechatMpErrors.mpName}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">微信公众平台认证的服务号全称或展示名称</p>
                      )}
                    </div>

                    {/* 2. AppID */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_app_id">
                        <span>2. AppID</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        id="wechat_app_id"
                        type="text"
                        value={wechatMpForm.appId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWechatMpForm(prev => ({ ...prev, appId: val }));
                          if (val.trim()) {
                            setWechatMpErrors(prev => ({ ...prev, appId: '' }));
                          }
                        }}
                        placeholder="请输入微信公众号开发者 ID (AppID，例如：wx8888888888888888)"
                        className={`w-full px-3.5 py-2.5 font-mono bg-slate-50 border rounded-xl text-xs outline-none transition-colors ${
                          wechatMpErrors.appId
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900'
                            : 'border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800'
                        }`}
                      />
                      {wechatMpErrors.appId ? (
                        <p className="text-[11px] text-rose-500">{wechatMpErrors.appId}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">微信公众平台「设置与开发」-「基本配置」中的开发者ID</p>
                      )}
                    </div>

                    {/* 3. AppSecret */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_app_secret">
                        <span>3. AppSecret</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="wechat_app_secret"
                          type={isSecretVisible ? 'text' : 'password'}
                          value={wechatMpForm.appSecret}
                          onChange={(e) => {
                            const val = e.target.value;
                            setWechatMpForm(prev => ({ ...prev, appSecret: val }));
                            if (val.trim()) {
                              setWechatMpErrors(prev => ({ ...prev, appSecret: '' }));
                            }
                          }}
                          placeholder="请输入微信公众号开发者密码 (AppSecret)"
                          className={`w-full px-3.5 py-2.5 pr-10 font-mono bg-slate-50 border rounded-xl text-xs outline-none transition-colors ${
                            wechatMpErrors.appSecret
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900'
                              : 'border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setIsSecretVisible(!isSecretVisible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                          title={isSecretVisible ? '隐藏明文' : '显示明文'}
                        >
                          {isSecretVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {wechatMpErrors.appSecret ? (
                        <p className="text-[11px] text-rose-500">{wechatMpErrors.appSecret}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">用于调用微信各服务端 API 接口获取 AccessToken 的机密密钥</p>
                      )}
                    </div>

                    {/* 4. Token */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_token">
                        <span>4. Token</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        id="wechat_token"
                        type="text"
                        value={wechatMpForm.token}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWechatMpForm(prev => ({ ...prev, token: val }));
                          if (val.trim()) {
                            setWechatMpErrors(prev => ({ ...prev, token: '' }));
                          }
                        }}
                        placeholder="请输入用于微信服务器通信验证的自定义 Token 令牌（3-32个字符）"
                        className={`w-full px-3.5 py-2.5 font-mono bg-slate-50 border rounded-xl text-xs outline-none transition-colors ${
                          wechatMpErrors.token
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900'
                            : 'border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800'
                        }`}
                      />
                      {wechatMpErrors.token ? (
                        <p className="text-[11px] text-rose-500">{wechatMpErrors.token}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">微信公众平台服务器配置中填写的 Token</p>
                      )}
                    </div>

                    {/* 5. EncodingAESKey */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_aes_key">
                        <span>5. EncodingAESKey</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        id="wechat_aes_key"
                        type="text"
                        value={wechatMpForm.encodingAesKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWechatMpForm(prev => ({ ...prev, encodingAesKey: val }));
                          if (val.trim()) {
                            setWechatMpErrors(prev => ({ ...prev, encodingAesKey: '' }));
                          }
                        }}
                        placeholder="请输入消息加解密密钥 (EncodingAESKey，由43位字符组成)"
                        className={`w-full px-3.5 py-2.5 font-mono bg-slate-50 border rounded-xl text-xs outline-none transition-colors ${
                          wechatMpErrors.encodingAesKey
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20 text-rose-900'
                            : 'border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-800'
                        }`}
                      />
                      {wechatMpErrors.encodingAesKey ? (
                        <p className="text-[11px] text-rose-500">{wechatMpErrors.encodingAesKey}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">用于安全模式下微信消息加解密的 43 位密钥</p>
                      )}
                    </div>

                    {/* 6. 未激活 V8 新用户关注欢迎消息 */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_unactivated_welcome_msg">
                          <span>6. 未激活 V8 新用户关注欢迎消息</span>
                          <span className="text-slate-400 text-[11px] font-normal">（选填）</span>
                        </label>
                      </div>
                      <textarea
                        id="wechat_unactivated_welcome_msg"
                        rows={3}
                        value={wechatMpForm.unactivatedWelcomeMsg}
                        onChange={(e) => setWechatMpForm(prev => ({ ...prev, unactivatedWelcomeMsg: e.target.value }))}
                        placeholder="请输入未激活 V8 新用户关注该公众号以后的欢迎消息内容"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs outline-none transition-colors resize-y leading-relaxed text-slate-800"
                      />
                      <p className="text-[11px] text-slate-400">
                        尚未在平台激活账号的新用户关注该公众号时接收到的欢迎文案与指引
                      </p>
                    </div>

                    {/* 7. 首次激活 V8 用户消息内容 */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_first_activation_msg">
                          <span>7. 首次激活 V8 用户消息内容</span>
                          <span className="text-slate-400 text-[11px] font-normal">（选填）</span>
                        </label>
                      </div>
                      <textarea
                        id="wechat_first_activation_msg"
                        rows={3}
                        value={wechatMpForm.firstActivationMsg}
                        onChange={(e) => setWechatMpForm(prev => ({ ...prev, firstActivationMsg: e.target.value }))}
                        placeholder="请输入首次激活 V8 用户以后的消息内容"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs outline-none transition-colors resize-y leading-relaxed text-slate-800"
                      />
                      <p className="text-[11px] text-slate-500 font-medium">
                        指的是通过该应用生成的V8用户邀请码激活后的内容
                      </p>
                    </div>

                    {/* 8. 已激活 V8 用户关注欢迎消息 */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5" htmlFor="wechat_activated_welcome_msg">
                          <span>8. 已激活 V8 用户关注欢迎消息</span>
                          <span className="text-slate-400 text-[11px] font-normal">（选填）</span>
                        </label>
                      </div>
                      <textarea
                        id="wechat_activated_welcome_msg"
                        rows={3}
                        value={wechatMpForm.activatedWelcomeMsg}
                        onChange={(e) => setWechatMpForm(prev => ({ ...prev, activatedWelcomeMsg: e.target.value }))}
                        placeholder="请输入已激活 V8 用户关注该公众号后的欢迎消息内容"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-xs outline-none transition-colors resize-y leading-relaxed text-slate-800"
                      />
                      <p className="text-[11px] text-slate-400">
                        已在平台激活绑定 V8 账号的用户关注该公众号时下发的欢迎及快捷使用提示
                      </p>
                    </div>

                    {/* 9. 公众号关注二维码 */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span>9. 公众号关注二维码</span>
                          <span className="text-slate-400 text-[11px] font-normal">（选填）</span>
                        </label>
                        {wechatMpForm.qrCodeUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveQrCode}
                            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>删除二维码</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        上传公众号关注二维码图片后，系统将在通知弹窗与移动端引导用户扫码关注该公众号
                      </p>

                      <input
                        ref={qrCodeInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) => handleQrFiles(e.target.files)}
                      />

                      {wechatMpForm.qrCodeUrl ? (
                        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="relative group w-24 h-24 bg-white rounded-lg border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                            <img
                              src={wechatMpForm.qrCodeUrl}
                              alt="公众号二维码"
                              className="w-full h-full object-contain rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800">
                                {wechatMpForm.qrCodeName || '已上传二维码图片'}
                              </span>
                              <span className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>已生效</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => qrCodeInputRef.current?.click()}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Upload className="w-3.5 h-3.5 text-blue-600" />
                                <span>更换图片</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveQrCode}
                                className="px-3 py-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>删除</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingQr(true);
                          }}
                          onDragLeave={() => setIsDraggingQr(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingQr(false);
                            handleQrFiles(e.dataTransfer.files);
                          }}
                          onClick={() => qrCodeInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2.5 transition-all cursor-pointer ${
                            isDraggingQr
                              ? 'border-emerald-500 bg-emerald-50/50'
                              : 'border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                            <QrCode className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-slate-700">
                              点击上传公众号关注二维码，或将图片拖拽至此处
                            </span>
                            <span className="text-[11px] text-slate-400">
                              支持 JPG、PNG、SVG、GIF 格式，文件不超过 5MB
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------- (c) 应用发布 ---------------- */}
          {appConfigSubTab === 'app_publish' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* 页面头部 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span>应用发布</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    该应用发布与停止的配置
                  </p>
                </div>

                {/* 当前状态徽标 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">当前状态:</span>
                  {currentStatus === 'published' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>已发布 (正常对外服务)</span>
                    </span>
                  )}
                  {currentStatus === 'unpublished' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>未发布 (仅内部编辑)</span>
                    </span>
                  )}
                  {currentStatus === 'disabled' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold shadow-2xs">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>已停用 (暂停所有访问)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 主区域内容说明 */}
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl leading-relaxed">
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  当您编辑好该应用以后，请点击发布。应用发布后，V8系统前端即可正常访问该系统。如果未发布，其他的应用系统或程序将不会显示该系统。
                </p>
              </div>

              {/* 状态操作按钮组 */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="text-xs font-bold text-slate-700">切换应用状态：</div>
                <div className="flex items-center gap-3.5 flex-wrap">
                  {/* 1. 已发布 */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStatus('published');
                      onUpdateAppStatus?.('published');
                      showToast('应用状态已成功切换为「已发布」！', 'success');
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      currentStatus === 'published'
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-2 shadow-md font-black'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300'
                    }`}
                    id="btn_page_status_published"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${currentStatus === 'published' ? 'text-white' : 'text-emerald-600'}`} />
                    <span>已发布</span>
                  </button>

                  {/* 2. 未发布 */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStatus('unpublished');
                      onUpdateAppStatus?.('unpublished');
                      showToast('应用状态已成功切换为「未发布」！', 'info');
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      currentStatus === 'unpublished'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 shadow-md font-black'
                        : 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300'
                    }`}
                    id="btn_page_status_unpublished"
                  >
                    <Clock className={`w-4 h-4 ${currentStatus === 'unpublished' ? 'text-white' : 'text-blue-600'}`} />
                    <span>未发布</span>
                  </button>

                  {/* 3. 停用 */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStatus('disabled');
                      onUpdateAppStatus?.('disabled');
                      showToast('应用状态已成功切换为「已停用」！', 'warning');
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                      currentStatus === 'disabled'
                        ? 'bg-rose-700 text-white ring-2 ring-rose-400 ring-offset-2 shadow-md font-black'
                        : 'bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300'
                    }`}
                    id="btn_page_status_disabled"
                  >
                    <AlertCircle className={`w-4 h-4 ${currentStatus === 'disabled' ? 'text-white' : 'text-rose-600'}`} />
                    <span>停用</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
