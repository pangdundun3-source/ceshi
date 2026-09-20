/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserPlus,
  Send,
  SlidersHorizontal,
  FileText,
  MessageSquare,
  QrCode,
  Link2,
  Key,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit2,
  PowerOff,
  RotateCcw,
  Check,
  X,
  Info,
  ChevronRight,
  Sparkles,
  Smartphone,
  CreditCard,
  Image as ImageIcon,
  ShieldCheck,
  Building,
  Heart,
  Calendar,
  Layers,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Search
} from 'lucide-react';
import { ExternalUserAppConfigItem } from './ExternalUserAppConfig';

// 字段类型定义
export type ExtFieldType =
  | 'text'
  | 'textarea'
  | 'phone'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'image'
  | 'id_card_photos'
  | 'bank_card_group';

// 激活字段项数据结构
export interface ExtActivationFieldItem {
  id: string;
  fieldKey: string;
  fieldName: string;
  fieldType: ExtFieldType;
  placeholder: string;
  isVisible: boolean;        // 是否显示 (开关)
  isRequired: boolean;       // 是否必填
  isDeactivated: boolean;    // 停用机制：字段不能删除，但是可以停用
  isBuiltin: boolean;        // 是否系统内置字段
  group: 'basic' | 'social' | 'bank' | 'custom';
  options?: string[];        // 单选/下拉候选值
  isSmsVerifyEnabled?: boolean; // 手机号专属：启用短信校验
  subFields?: {              // 复合字段（如银行卡信息组）
    id: string;
    subKey: string;
    subName: string;
    placeholder: string;
    isRequired: boolean;
  }[];
  description?: string;
}

// 邀请配置总数据结构
export interface ExtInvitationConfigData {
  // 1. 邀请方式
  inviteMethods: ('code' | 'qrcode' | 'link')[]; // 生成激活码邀请 / 生成二维码邀请 / 生成邀请链接邀请
  allowBatchInvite: boolean;                     // 是否允许批量邀请

  // 2. 激活字段
  fields: ExtActivationFieldItem[];

  // 3. 推送信息
  newSubscriberWelcomeText: string;  // 新用户（非 V8 用户）关注公众号以后的欢迎内容
  activationSuccessPushText: string; // 用户成功激活外部账号以后推送的内容
}

// 默认初始化激活字段清单
export const DEFAULT_ACTIVATION_FIELDS: ExtActivationFieldItem[] = [
  // --- 基础预置字段 ---
  {
    id: 'f-01',
    fieldKey: 'real_name',
    fieldName: '真实姓名',
    fieldType: 'text',
    placeholder: '请输入您的真实姓名',
    isVisible: true,
    isRequired: true,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '单行文本框，用于实名身份标识'
  },
  {
    id: 'f-02',
    fieldKey: 'phone_number',
    fieldName: '手机号',
    fieldType: 'phone',
    placeholder: '请输入11位中国大陆手机号码',
    isVisible: true,
    isRequired: true,
    isDeactivated: false,
    isBuiltin: true,
    isSmsVerifyEnabled: true,
    group: 'basic',
    description: '单行文本框，支持短信验证码双向核验'
  },
  {
    id: 'f-03',
    fieldKey: 'work_unit',
    fieldName: '工作单位',
    fieldType: 'text',
    placeholder: '请输入所在企业、社会组织或机构全称',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '单行文本框，记录外部联系人所属组织'
  },
  {
    id: 'f-04',
    fieldKey: 'political_status',
    fieldName: '政治身份',
    fieldType: 'select',
    placeholder: '请选择政治面貌',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    options: ['群众', '无党派', '中共党员', '民主党派', '其他'],
    description: '下拉单选菜单，标准化政治身份字典'
  },
  {
    id: 'f-05',
    fieldKey: 'avatar_photo',
    fieldName: '上传个人照片',
    fieldType: 'image',
    placeholder: '请上传免冠证件照或近期免冠正面照片(支持JPG/PNG/WEBP)',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '图片文件上传组件，最大限制 5MB'
  },
  {
    id: 'f-06',
    fieldKey: 'id_card_photos',
    fieldName: '上传身份证正反面',
    fieldType: 'id_card_photos',
    placeholder: '请分别上传居民身份证人像面和国徽面清晰照片',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '双证件照片上传，支持 OCR 智能文字识别提取'
  },
  {
    id: 'f-07',
    fieldKey: 'marital_status',
    fieldName: '婚姻状况',
    fieldType: 'select',
    placeholder: '请选择婚姻状况',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    options: ['未婚', '已婚', '离异', '丧偶'],
    description: '单选下拉框'
  },
  {
    id: 'f-08',
    fieldKey: 'age',
    fieldName: '年龄',
    fieldType: 'number',
    placeholder: '请输入周岁年龄(1-120)',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '数字输入框，内置数值有效区间校验'
  },
  {
    id: 'f-09',
    fieldKey: 'gender',
    fieldName: '性别',
    fieldType: 'radio',
    placeholder: '请选择生理性别',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    options: ['男', '女'],
    description: '单选组件'
  },
  {
    id: 'f-10',
    fieldKey: 'id_card_no',
    fieldName: '身份证号',
    fieldType: 'text',
    placeholder: '请输入18位二代居民身份证号码',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '单行文本框，内置 18 位校验码算法验证'
  },
  {
    id: 'f-11',
    fieldKey: 'hobbies',
    fieldName: '兴趣爱好',
    fieldType: 'text',
    placeholder: '请输入兴趣特长，如：摄影、马拉松、阅读、登山等',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    description: '单行文本框/标签输入'
  },
  {
    id: 'f-12',
    fieldKey: 'job_level',
    fieldName: '职级',
    fieldType: 'select',
    placeholder: '请选择当前职级/职务层级',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'basic',
    options: ['基层员工', '业务骨干', '中层主管', '高级经理', '总监/总经理', '高管/合伙人', '其他'],
    description: '下拉菜单，职务职级划分'
  },

  // --- 默认初始化扩展与社交账号字段 (需求1) ---
  {
    id: 'f-13',
    fieldKey: 'family_info',
    fieldName: '家庭情况',
    fieldType: 'textarea',
    placeholder: '请输入常住地址、家庭成员基本情况或紧急联系备注等',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'social',
    description: '多行文本输入框，支持长文本描述'
  },
  {
    id: 'f-14',
    fieldKey: 'wechat_id',
    fieldName: '微信号',
    fieldType: 'text',
    placeholder: '请输入个人微信号(非手机号)',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'social',
    description: '单行文本框，个人微信通讯标识'
  },
  {
    id: 'f-15',
    fieldKey: 'qq_number',
    fieldName: 'QQ号',
    fieldType: 'text',
    placeholder: '请输入个人QQ号码',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'social',
    description: '单行文本框，腾讯QQ账号'
  },
  {
    id: 'f-16',
    fieldKey: 'douyin_id',
    fieldName: '抖音号',
    fieldType: 'text',
    placeholder: '请输入抖音号或抖音ID',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'social',
    description: '单行文本框，抖音社交平台标识'
  },
  {
    id: 'f-17',
    fieldKey: 'weibo_account',
    fieldName: '微博账号',
    fieldType: 'text',
    placeholder: '请输入微博昵称或微博个人主页链接',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'social',
    description: '单行文本框，新浪微博平台标识'
  },
  {
    id: 'f-18',
    fieldKey: 'bio_intro',
    fieldName: '个人简介',
    fieldType: 'textarea',
    placeholder: '请简述个人从业经历、擅长专业领域或自我介绍',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'social',
    description: '多行文本框，个人简介及专业特长'
  },

  // --- 默认个人银行卡信息组 (需求1 复合字段) ---
  {
    id: 'f-19',
    fieldKey: 'bank_card_group',
    fieldName: '个人银行卡信息',
    fieldType: 'bank_card_group',
    placeholder: '包含开户行账号、户名、银行名称三项结算信息',
    isVisible: true,
    isRequired: false,
    isDeactivated: false,
    isBuiltin: true,
    group: 'bank',
    description: '复合信息组，包含开户行账号、户名、银行名称',
    subFields: [
      {
        id: 'sub-01',
        subKey: 'bank_account_no',
        subName: '开户行账号',
        placeholder: '请输入个人收款银行借记卡卡号 (16-19位数字)',
        isRequired: true
      },
      {
        id: 'sub-02',
        subKey: 'bank_account_name',
        subName: '户名',
        placeholder: '请输入开户人真实姓名 (需与开户行证件一致)',
        isRequired: true
      },
      {
        id: 'sub-03',
        subKey: 'bank_name',
        subName: '银行名称',
        placeholder: '请输入开户银行全称或所属支行名称 (如：招商银行北京分行大望路支行)',
        isRequired: true
      }
    ]
  }
];

interface ExtDefaultInvitationConfigProps {
  appConfig: ExternalUserAppConfigItem;
  onSaveConfig?: (config: ExtInvitationConfigData) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
}

export const ExtDefaultInvitationConfig: React.FC<ExtDefaultInvitationConfigProps> = ({
  appConfig,
  onSaveConfig,
  showToast = (_msg: string, _type?: 'success' | 'info' | 'error' | 'warning') => {}
}) => {
  // 左侧子菜单选中状态：'methods' (邀请方式) | 'fields' (激活字段) | 'push' (推送信息)
  const [subTab, setSubTab] = useState<'methods' | 'fields' | 'push'>('methods');

  // 邀请总配置状态
  const [config, setConfig] = useState<ExtInvitationConfigData>({
    inviteMethods: ['code', 'qrcode', 'link'],
    allowBatchInvite: true,
    fields: DEFAULT_ACTIVATION_FIELDS,
    newSubscriberWelcomeText:
      '欢迎您关注康奈网络【正管用平台】微信公众号，您点击下面的链接 www.baidu.com 进入激活页面，输入激活码, 激活账号',
    activationSuccessPushText:
      '祝贺您已成功加入xx市网信综合治理体系！您可以点击公众号下方的菜单进行操作，或登录网址:https://z.wxb.cn 进入 PC 端系统。'
  });

  // 激活字段列表过滤与搜索状态
  const [fieldSearchQuery, setFieldSearchQuery] = useState('');
  const [fieldGroupFilter, setFieldGroupFilter] = useState<'all' | 'basic' | 'social' | 'bank' | 'custom'>('all');
  const [showOnlyVisible, setShowOnlyVisible] = useState(false);

  // 动态添加自定义字段 Modal 状态
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newFieldForm, setNewFieldForm] = useState<{
    fieldName: string;
    fieldKey: string;
    fieldType: ExtFieldType;
    placeholder: string;
    isVisible: boolean;
    isRequired: boolean;
    optionsStr: string;
    description: string;
  }>({
    fieldName: '',
    fieldKey: '',
    fieldType: 'text',
    placeholder: '',
    isVisible: true,
    isRequired: false,
    optionsStr: '选项一\n选项二\n选项三',
    description: ''
  });

  // 编辑字段提示文字 Modal 状态
  const [editingFieldItem, setEditingFieldItem] = useState<ExtActivationFieldItem | null>(null);

  // 保存总配置
  const handleSave = () => {
    if (onSaveConfig) {
      onSaveConfig(config);
    }
    showToast(`【${appConfig.appShortName}】默认邀请配置已成功保存并同步应用！`, 'success');
  };

  // 切换邀请方式多选框
  const handleToggleMethod = (method: 'code' | 'qrcode' | 'link') => {
    setConfig(prev => {
      const exists = prev.inviteMethods.includes(method);
      if (exists) {
        if (prev.inviteMethods.length <= 1) {
          showToast('至少需要保留一种默认邀请方式！', 'warning');
          return prev;
        }
        return {
          ...prev,
          inviteMethods: prev.inviteMethods.filter(m => m !== method)
        };
      } else {
        return {
          ...prev,
          inviteMethods: [...prev.inviteMethods, method]
        };
      }
    });
  };

  // 切换字段是否显示开关
  const handleToggleFieldVisible = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => {
        if (f.id === fieldId) {
          if (f.isDeactivated) {
            showToast('该字段处于停用状态，请先启用字段后再设置显示！', 'warning');
            return f;
          }
          const nextVal = !f.isVisible;
          showToast(`已${nextVal ? '开启' : '关闭'}「${f.fieldName}」显示`, 'info');
          return { ...f, isVisible: nextVal };
        }
        return f;
      })
    }));
  };

  // 切换字段是否必填
  const handleToggleFieldRequired = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => {
        if (f.id === fieldId) {
          return { ...f, isRequired: !f.isRequired };
        }
        return f;
      })
    }));
  };

  // 切换手机号短信校验勾选
  const handleToggleSmsVerify = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => {
        if (f.id === fieldId) {
          const nextVal = !f.isSmsVerifyEnabled;
          showToast(`已${nextVal ? '启用' : '停用'}手机号短信校验功能`, 'info');
          return { ...f, isSmsVerifyEnabled: nextVal };
        }
        return f;
      })
    }));
  };

  // 停用 / 启用机制：字段不能删除，但是可以停用
  const handleToggleFieldDeactivation = (field: ExtActivationFieldItem) => {
    const willDeactivate = !field.isDeactivated;
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => {
        if (f.id === field.id) {
          return {
            ...f,
            isDeactivated: willDeactivate,
            isVisible: willDeactivate ? false : f.isVisible
          };
        }
        return f;
      })
    }));
    if (willDeactivate) {
      showToast(`已停用「${field.fieldName}」字段，外部邀请页面将不再渲染该选项`, 'warning');
    } else {
      showToast(`已恢复启用「${field.fieldName}」字段`, 'success');
    }
  };

  // 提交添加自定义字段
  const handleCreateCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldForm.fieldName.trim()) {
      showToast('请输入字段名称', 'warning');
      return;
    }
    const finalKey = newFieldForm.fieldKey.trim() || `custom_${Date.now().toString(36)}`;
    const parsedOptions = ['select', 'radio', 'checkbox'].includes(newFieldForm.fieldType)
      ? newFieldForm.optionsStr.split('\n').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: ExtActivationFieldItem = {
      id: `custom-f-${Date.now()}`,
      fieldKey: finalKey,
      fieldName: newFieldForm.fieldName.trim(),
      fieldType: newFieldForm.fieldType,
      placeholder: newFieldForm.placeholder.trim() || `请输入${newFieldForm.fieldName}`,
      isVisible: newFieldForm.isVisible,
      isRequired: newFieldForm.isRequired,
      isDeactivated: false,
      isBuiltin: false,
      group: 'custom',
      options: parsedOptions,
      description: newFieldForm.description.trim() || '自定义扩展激活参数'
    };

    setConfig(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));

    setIsAddFieldModalOpen(false);
    setNewFieldForm({
      fieldName: '',
      fieldKey: '',
      fieldType: 'text',
      placeholder: '',
      isVisible: true,
      isRequired: false,
      optionsStr: '选项一\n选项二\n选项三',
      description: ''
    });
    showToast(`已成功添加自定义字段「${newField.fieldName}」！`, 'success');
  };

  // 保存修改字段提示词与信息
  const handleSaveFieldEdit = () => {
    if (!editingFieldItem) return;
    setConfig(prev => ({
      ...prev,
      fields: prev.fields.map(f => f.id === editingFieldItem.id ? editingFieldItem : f)
    }));
    setEditingFieldItem(null);
    showToast('字段提示信息与参数配置已更新！', 'success');
  };

  // 重置字段为系统默认
  const handleResetToDefaultFields = () => {
    if (window.confirm('确定要将所有激活字段恢复为系统初始默认状态吗？自定义字段将保留。')) {
      const customOnes = config.fields.filter(f => !f.isBuiltin);
      setConfig(prev => ({
        ...prev,
        fields: [...DEFAULT_ACTIVATION_FIELDS, ...customOnes]
      }));
      showToast('激活字段已重置为初始默认配置！', 'info');
    }
  };

  // 过滤后的字段清单
  const filteredFields = config.fields.filter(field => {
    if (fieldGroupFilter !== 'all' && field.group !== fieldGroupFilter) {
      return false;
    }
    if (showOnlyVisible && !field.isVisible) {
      return false;
    }
    if (fieldSearchQuery.trim()) {
      const q = fieldSearchQuery.toLowerCase();
      return (
        field.fieldName.toLowerCase().includes(q) ||
        field.fieldKey.toLowerCase().includes(q) ||
        field.placeholder.toLowerCase().includes(q) ||
        (field.description && field.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <>
      <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row min-h-[560px] overflow-hidden" id="ext_default_invitation_config_container">
        {/* 左侧导航子菜单 (参考外部-基础配置样式，只有菜单名称，无底部备注) */}
      <div className="w-full md:w-52 lg:w-56 bg-slate-50/70 md:border-r border-b md:border-b-0 border-slate-200/80 shrink-0 flex flex-col">
        <nav className="flex-1 divide-y divide-slate-200/80" id="nav_ext_invitation_submenu">
          {/* 1. 邀请方式 */}
          <button
            type="button"
            onClick={() => setSubTab('methods')}
            id="submenu_invite_methods"
            className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer select-none text-xs font-bold ${
              subTab === 'methods'
                ? 'bg-white text-[#1e376b] font-black border-l-4 border-[#1e376b] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className={`w-4 h-4 ${subTab === 'methods' ? 'text-[#1e376b]' : 'text-slate-400'}`} />
              <span>邀请方式</span>
            </div>
            {subTab === 'methods' && (
              <ChevronRight className="w-3.5 h-3.5 text-[#1e376b]" />
            )}
          </button>

          {/* 2. 激活字段 */}
          <button
            type="button"
            onClick={() => setSubTab('fields')}
            id="submenu_activation_fields"
            className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer select-none text-xs font-bold ${
              subTab === 'fields'
                ? 'bg-white text-[#1e376b] font-black border-l-4 border-[#1e376b] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 ${subTab === 'fields' ? 'text-[#1e376b]' : 'text-slate-400'}`} />
              <span>激活字段</span>
            </div>
            {subTab === 'fields' && (
              <ChevronRight className="w-3.5 h-3.5 text-[#1e376b]" />
            )}
          </button>

          {/* 3. 推送信息 */}
          <button
            type="button"
            onClick={() => setSubTab('push')}
            id="submenu_push_notifications"
            className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-all cursor-pointer select-none text-xs font-bold ${
              subTab === 'push'
                ? 'bg-white text-[#1e376b] font-black border-l-4 border-[#1e376b] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className={`w-4 h-4 ${subTab === 'push' ? 'text-[#1e376b]' : 'text-slate-400'}`} />
              <span>推送信息</span>
            </div>
            {subTab === 'push' && (
              <ChevronRight className="w-3.5 h-3.5 text-[#1e376b]" />
            )}
          </button>
        </nav>
      </div>

      {/* 右侧主内容展示区 */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-white flex flex-col gap-5 w-full">

        {/* --------------------------- 子菜单 1: 邀请方式 --------------------------- */}
        {subTab === 'methods' && (
          <div className="flex flex-col gap-5 w-full animate-in fade-in duration-150">
            
            {/* 标题说明 */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#1e376b]" />
                  <span>邀请方式与批量规则配置</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  请勾选该应用默认允许开通机构使用的外部用户邀请模式与批量分发机制
                </p>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>保存邀请方式设置</span>
              </button>
            </div>

            {/* 表格式配置区（带表头与横线分割各区块） */}
            <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4 w-48 shrink-0">配置项目</th>
                    <th className="py-3 px-4">配置参数与选项</th>
                    <th className="py-3 px-4 w-1/3">规则说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {/* 第 1 项：支持的默认邀请方式 (多选) */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                        <span>支持的默认邀请方式</span>
                      </div>
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold inline-block mt-1.5">
                        多选组合
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-6 flex-wrap">
                          {/* 选项 1: 激活码 */}
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none font-bold text-slate-800 hover:text-[#1e376b]">
                            <input
                              type="checkbox"
                              checked={config.inviteMethods.includes('code')}
                              onChange={() => handleToggleMethod('code')}
                              className="w-4 h-4 text-[#1e376b] rounded border-slate-300 focus:ring-[#1e376b] cursor-pointer"
                            />
                            <span className="flex items-center gap-1.5 text-xs">
                              <Key className="w-3.5 h-3.5 text-purple-600" />
                              <span>生成激活码邀请</span>
                            </span>
                          </label>

                          {/* 选项 2: 二维码 */}
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none font-bold text-slate-800 hover:text-[#1e376b]">
                            <input
                              type="checkbox"
                              checked={config.inviteMethods.includes('qrcode')}
                              onChange={() => handleToggleMethod('qrcode')}
                              className="w-4 h-4 text-[#1e376b] rounded border-slate-300 focus:ring-[#1e376b] cursor-pointer"
                            />
                            <span className="flex items-center gap-1.5 text-xs">
                              <QrCode className="w-3.5 h-3.5 text-blue-600" />
                              <span>生成二维码邀请</span>
                            </span>
                          </label>

                          {/* 选项 3: 链接 */}
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none font-bold text-slate-800 hover:text-[#1e376b]">
                            <input
                              type="checkbox"
                              checked={config.inviteMethods.includes('link')}
                              onChange={() => handleToggleMethod('link')}
                              className="w-4 h-4 text-[#1e376b] rounded border-slate-300 focus:ring-[#1e376b] cursor-pointer"
                            />
                            <span className="flex items-center gap-1.5 text-xs">
                              <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>生成邀请链接邀请</span>
                            </span>
                          </label>
                        </div>

                        {/* 状态简要标签 */}
                        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-700">当前已选方式：</span>
                          {config.inviteMethods.includes('code') && (
                            <span className="px-2 py-0.5 bg-purple-100/70 text-purple-800 rounded font-mono text-[10px] font-bold">
                              激活码
                            </span>
                          )}
                          {config.inviteMethods.includes('qrcode') && (
                            <span className="px-2 py-0.5 bg-blue-100/70 text-blue-800 rounded font-mono text-[10px] font-bold">
                              动态二维码
                            </span>
                          )}
                          {config.inviteMethods.includes('link') && (
                            <span className="px-2 py-0.5 bg-emerald-100/70 text-emerald-800 rounded font-mono text-[10px] font-bold">
                              邀请长/短链接
                            </span>
                          )}
                          {config.inviteMethods.length === 0 && (
                            <span className="text-rose-600 font-bold">请至少勾选一种邀请途径</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs leading-relaxed align-top">
                      系统支持在开通机构中自动生成 8~12 位加密激活码、动态微信公众号关注二维码或 H5 入驻长短链接，联系人完成验证后绑定入驻。
                    </td>
                  </tr>

                  {/* 第 2 项：是否允许批量邀请 */}
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 align-top">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                        <span>是否允许批量邀请</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1.5 ${
                        config.allowBatchInvite
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {config.allowBatchInvite ? '已启用批量' : '已禁用批量'}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.allowBatchInvite}
                            onChange={(e) => {
                              const val = e.target.checked;
                              setConfig(prev => ({ ...prev, allowBatchInvite: val }));
                              showToast(`已${val ? '开启' : '关闭'}批量邀请支持`, 'info');
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e376b]"></div>
                        </label>
                        <span className="text-xs font-bold text-slate-800">
                          {config.allowBatchInvite ? '开启批量邀请生成' : '关闭批量邀请'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs leading-relaxed align-top">
                      如果启用批量邀请以后，客户可以批量生成邀请码，邀请用户激活账号。
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* --------------------------- 子菜单 2: 激活字段 --------------------------- */}
        {subTab === 'fields' && (
          <div className="flex flex-col gap-4 w-full animate-in fade-in duration-150">
              
              {/* 介绍说明主标题 */}
              <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>外部用户激活字段配置</span>
                      <span className="text-[10px] text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded font-bold">
                        共 {config.fields.length} 项字段，已显示 {config.fields.filter(f => f.isVisible && !f.isDeactivated).length} 项
                      </span>
                    </h3>
                    <p className="text-xs text-blue-950 font-medium mt-1 leading-relaxed">
                      请选择本应用在邀请外部联系人时默认需要填写的内容。
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleResetToDefaultFields}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="重置内置字段为系统初始状态"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>恢复默认字段</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddFieldModalOpen(true)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                    id="btn_add_custom_activation_field"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加自定义字段</span>
                  </button>
                </div>
              </div>

              {/* 检索、分类筛选与统计栏 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 mr-1">分类筛选：</span>
                  {[
                    { id: 'all', label: '全部字段' },
                    { id: 'basic', label: '基础身份与证件' },
                    { id: 'social', label: '社交与简介' },
                    { id: 'bank', label: '银行卡结算' },
                    { id: 'custom', label: '自定义扩展' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFieldGroupFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        fieldGroupFilter === tab.id
                          ? 'bg-[#1e376b] text-white shadow-2xs'
                          : 'bg-white hover:bg-slate-200/70 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索字段名称 / 提示词..."
                      value={fieldSearchQuery}
                      onChange={(e) => setFieldSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-500 w-44"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showOnlyVisible}
                      onChange={(e) => setShowOnlyVisible(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>仅看显示项</span>
                  </label>
                </div>
              </div>

              {/* 字段列表呈现 */}
              <div className="flex flex-col gap-2.5">
                {filteredFields.length === 0 ? (
                  <div className="p-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <span>未检索到匹配的激活字段</span>
                  </div>
                ) : (
                  filteredFields.map((field, idx) => {
                    const isDeact = field.isDeactivated;
                    return (
                      <div
                        key={field.id}
                        className={`rounded-xl border transition-all p-3.5 sm:p-4 flex flex-col gap-2.5 ${
                          isDeact
                            ? 'bg-slate-100/80 border-slate-200 opacity-60'
                            : field.isVisible
                            ? 'bg-white border-slate-200/90 shadow-2xs hover:border-blue-300'
                            : 'bg-slate-50/60 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* (a) 字段名称 (左侧显示选项是什么) */}
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <span className="text-[11px] font-mono text-slate-400 font-bold w-6 shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-black ${isDeact ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                  {field.fieldName}
                                </span>
                                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                                  {field.fieldKey}
                                </span>
                                {field.isBuiltin ? (
                                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                    内置
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                    自定义
                                  </span>
                                )}
                                {isDeact && (
                                  <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                    已停用
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {field.description || '基础属性参数'}
                              </span>
                            </div>
                          </div>

                          {/* (b) 提示文字 (右侧显示对应的提示文字) */}
                          <div className="flex-1 min-w-0 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] text-slate-400 shrink-0 font-bold">提示文字:</span>
                              <span className="text-xs text-slate-700 font-medium truncate" title={field.placeholder}>
                                {field.placeholder || <span className="text-slate-400 italic">未设置提示文字</span>}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditingFieldItem(field)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold shrink-0 cursor-pointer hover:underline flex items-center gap-0.5"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>修改提示</span>
                            </button>
                          </div>

                          {/* 专属附加参数 (如手机号短信校验) */}
                          {field.fieldKey === 'phone_number' && (
                            <label className="flex items-center gap-1.5 text-xs text-blue-900 bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-200 font-bold cursor-pointer select-none shrink-0">
                              <input
                                type="checkbox"
                                checked={field.isSmsVerifyEnabled || false}
                                onChange={() => handleToggleSmsVerify(field.id)}
                                className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                              />
                              <span>启用短信校验</span>
                            </label>
                          )}

                          {/* (c) 显示开关与必填开关 */}
                          <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                            
                            {/* 显示开关 */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-600">是否显示</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.isVisible && !field.isDeactivated}
                                  disabled={field.isDeactivated}
                                  onChange={() => handleToggleFieldVisible(field.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1e376b] peer-disabled:opacity-50"></div>
                              </label>
                            </div>

                            {/* 是否必填开关 */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-600">必填</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.isRequired}
                                  disabled={field.isDeactivated}
                                  onChange={() => handleToggleFieldRequired(field.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600 peer-disabled:opacity-50"></div>
                              </label>
                            </div>

                            {/* (d) 停用机制：字段不能删除，但是可以停用 */}
                            <button
                              type="button"
                              onClick={() => handleToggleFieldDeactivation(field)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                                isDeact
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              }`}
                              title={isDeact ? '恢复启用该字段' : '停用该字段（系统不删除，但不在激活页呈现）'}
                            >
                              <PowerOff className="w-3 h-3" />
                              <span>{isDeact ? '恢复启用' : '停用'}</span>
                            </button>

                          </div>

                        </div>

                        {/* 复合银行卡信息组下级子字段展开呈现 */}
                        {field.fieldType === 'bank_card_group' && field.subFields && (
                          <div className="mt-1 pl-8 pt-2 border-t border-slate-100 flex flex-col gap-2 bg-slate-50/50 p-2.5 rounded-lg">
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                              <span>银行卡结算子字段（共 3 项，默认协同收集）：</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {field.subFields.map(sub => (
                                <div key={sub.id} className="p-2 bg-white rounded border border-slate-200 flex flex-col gap-1 text-[11px]">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">{sub.subName}</span>
                                    <span className="text-[9px] font-mono text-slate-400">{sub.subKey}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 truncate" title={sub.placeholder}>
                                    提示：{sub.placeholder}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 下拉/单选选项呈现 */}
                        {field.options && field.options.length > 0 && (
                          <div className="pl-8 text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-600">候选选项:</span>
                            {field.options.map((opt, i) => (
                              <span key={i} className="bg-slate-100 px-1.5 py-0.2 rounded text-[10px] border border-slate-200">
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

              {/* 底部保存与统计 */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>修改后请点击右侧按钮保存，激活字段将实时写入各机构默认邀请表单。</span>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存激活字段配置</span>
                </button>
              </div>

            </div>
          )}

          {/* --------------------------- 子菜单 3: 推送信息 --------------------------- */}
          {subTab === 'push' && (
            <div className="flex flex-col gap-5 w-full animate-in fade-in duration-150">
              
              {/* 标题说明 */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#1e376b]" />
                    <span>推送信息与欢迎文案配置</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    配置非 V8 新用户关注公众号后的欢迎引导文案，以及用户成功完成外部账号激活后的推送通知内容
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>保存推送设置</span>
                </button>
              </div>

              {/* 表格式配置区（带表头与横线分割各区块） */}
              <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4 w-52 shrink-0">推送场景项目</th>
                      <th className="py-3 px-4">推送通知与引导文案内容</th>
                      <th className="py-3 px-4 w-72 shrink-0">触发与说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {/* 第 1 项：新用户（非 V8 用户）关注公众号以后的欢迎内容 */}
                    <tr className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 align-top">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                          <span>新用户关注欢迎内容</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block mt-1">
                          非 V8 用户关注触发
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1.5">
                          <textarea
                            rows={3}
                            value={config.newSubscriberWelcomeText}
                            onChange={(e) => setConfig({ ...config, newSubscriberWelcomeText: e.target.value })}
                            placeholder="请输入新用户关注公众号后的欢迎引导文本..."
                            className="w-full bg-slate-50/60 focus:bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1e376b] leading-relaxed font-sans shadow-2xs resize-y"
                            id="textarea_new_subscriber_welcome"
                          />
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>支持输入超链接与激活指引说明</span>
                            <span>{config.newSubscriberWelcomeText.length} 字</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs leading-relaxed align-top">
                        当未在系统中创建过 V8 账号的新用户关注公众号时，系统通过微信客服消息接口自动向其发送此欢迎与激活指引。
                      </td>
                    </tr>

                    {/* 第 2 项：用户成功激活外部账号以后推送的内容 */}
                    <tr className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 align-top">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                          <span>账号激活成功推送内容</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block mt-1">
                          外部账号实名绑定后
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1.5">
                          <textarea
                            rows={3}
                            value={config.activationSuccessPushText}
                            onChange={(e) => setConfig({ ...config, activationSuccessPushText: e.target.value })}
                            placeholder="请输入用户成功激活外部账号后推送的通知文本..."
                            className="w-full bg-slate-50/60 focus:bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1e376b] leading-relaxed font-sans shadow-2xs resize-y"
                            id="textarea_activation_success_push"
                          />
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>支持输入登录网址及微信公众号菜单操作提示</span>
                            <span>{config.activationSuccessPushText.length} 字</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs leading-relaxed align-top">
                        外部用户在移动端或 PC 端输入激活码并提交实名信息激活成功后，系统即时推送的入驻通知与系统使用指引。
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* Modal 1: 动态添加自定义字段模态框 */}
      {/* ========================================================================= */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 px-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Plus className="w-4.5 h-4.5" />
                <h3 className="text-sm font-black">添加自定义激活字段</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFieldModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomField} className="p-6 flex flex-col gap-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-800">
                    字段名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如：紧急联系人、从业年限"
                    value={newFieldForm.fieldName}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, fieldName: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-800">
                    字段唯一标识 (Key)
                  </label>
                  <input
                    type="text"
                    placeholder="如：emergency_contact"
                    value={newFieldForm.fieldKey}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, fieldKey: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-800">
                  字段类型 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newFieldForm.fieldType}
                  onChange={(e) => setNewFieldForm({ ...newFieldForm, fieldType: e.target.value as ExtFieldType })}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="text">单行文本框 (Text)</option>
                  <option value="textarea">多行文本框 (Textarea)</option>
                  <option value="number">数值输入框 (Number)</option>
                  <option value="select">下拉单选菜单 (Select)</option>
                  <option value="radio">单选框组 (Radio)</option>
                  <option value="checkbox">多选复选框组 (Checkbox)</option>
                  <option value="date">日期选择器 (Date)</option>
                  <option value="image">图片文件上传 (Image)</option>
                </select>
              </div>

              {['select', 'radio', 'checkbox'].includes(newFieldForm.fieldType) && (
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-800">
                    候选项列表 (每行一个选项)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="选项A&#10;选项B&#10;选项C"
                    value={newFieldForm.optionsStr}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, optionsStr: e.target.value })}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-800">默认提示文字 (Placeholder)</label>
                <input
                  type="text"
                  placeholder="如：请输入紧急联系人姓名与电话"
                  value={newFieldForm.placeholder}
                  onChange={(e) => setNewFieldForm({ ...newFieldForm, placeholder: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-800">字段说明备注</label>
                <input
                  type="text"
                  placeholder="该参数的业务用途说明"
                  value={newFieldForm.description}
                  onChange={(e) => setNewFieldForm({ ...newFieldForm, description: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newFieldForm.isVisible}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, isVisible: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-800">默认在邀请页面显示</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newFieldForm.isRequired}
                    onChange={(e) => setNewFieldForm({ ...newFieldForm, isRequired: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-800">设为必填项</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFieldModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  确认添加
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal 2: 修改字段提示文字与参数 */}
      {/* ========================================================================= */}
      {editingFieldItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 px-6 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-300" />
                <h3 className="text-sm font-black">修改「{editingFieldItem.fieldName}」提示文字</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingFieldItem(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">字段名称</label>
                <input
                  type="text"
                  disabled
                  value={editingFieldItem.fieldName}
                  className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-800">
                  提示文字 (Placeholder) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editingFieldItem.placeholder}
                  onChange={(e) => setEditingFieldItem({ ...editingFieldItem, placeholder: e.target.value })}
                  placeholder="请输入该字段在激活页面展示的提示说明..."
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFieldItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveFieldEdit}
                  className="px-5 py-2 bg-[#1e376b] hover:bg-[#15274d] text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
