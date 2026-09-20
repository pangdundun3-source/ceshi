/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Database,
  FolderTree,
  Folder,
  FolderOpen,
  FolderPlus,
  GitBranch,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Save,
  Download,
  Upload,
  History,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  FileCode,
  Tag,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Clock,
  Mail,
  Globe,
  Hash,
  ListFilter,
  Eye,
  Layers,
  Boxes,
  HelpCircle,
  FileUp,
  MoreVertical,
  Cpu,
  Code2,
  Braces,
  Terminal,
  AlertTriangle,
  ShieldAlert,
  GitMerge,
  Users
} from 'lucide-react';
import {
  DictItemType,
  DictCategoryNode,
  DictConfigItem,
  DictEnumOption,
  DictValidateRule,
  DictAuditLog,
  DictVersionRecord
} from '../types/dict';
import {
  ROOT_CATEGORY_ID,
  GLOBAL_ROOT_ID,
  JSYQ_ROOT_CATEGORY_ID,
  QQY_ROOT_CATEGORY_ID,
  INITIAL_DICT_CATEGORIES,
  INITIAL_GLOBAL_DICT_CATEGORIES,
  INITIAL_DICT_ITEMS,
  INITIAL_DICT_AUDIT_LOGS
} from '../data/dictData';

// 类型名称与图标映射字典
export const DICT_TYPE_INFO: Record<DictItemType, { label: string; group: string; color: string; desc: string }> = {
  string: { label: '单行文本 (string)', group: '基础文本', color: 'bg-blue-50 text-blue-700 border-blue-200', desc: '单行输入框，适合名称、简述' },
  textarea: { label: '多行文本 (textarea)', group: '基础文本', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', desc: '大文本框，适合长文本、模板' },
  richText: { label: '富文本 (richText)', group: '基础文本', color: 'bg-purple-50 text-purple-700 border-purple-200', desc: '图文富文本，适合通知公告、排版' },
  radio: { label: '单选 (radio)', group: '选项枚举', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: '单选按钮组，枚举选项选一' },
  select: { label: '下拉单选 (select)', group: '选项枚举', color: 'bg-orange-50 text-orange-700 border-orange-200', desc: '下拉选择框，单选枚举值' },
  checkbox: { label: '多选 (checkbox)', group: '选项枚举', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: '复选框列表，支持多项勾选' },
  'select-multiple': { label: '下拉多选 (select-multiple)', group: '选项枚举', color: 'bg-teal-50 text-teal-700 border-teal-200', desc: '下拉多选标签组件' },
  int: { label: '整数 (int)', group: '数值类型', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', desc: '纯整数，适合数量、时限、阈值' },
  decimal: { label: '小数 (decimal)', group: '数值类型', color: 'bg-sky-50 text-sky-700 border-sky-200', desc: '浮点数，适合置信度、比例、金额' },
  boolean: { label: '布尔开关 (boolean)', group: '开关控制', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: '开关组件，功能启用或停用' },
  image: { label: '图片地址 (image)', group: '媒体链接', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: '图片URL与预览上传' },
  file: { label: '文件地址 (file)', group: '媒体链接', color: 'bg-pink-50 text-pink-700 border-pink-200', desc: '文档附件URL与下载' },
  url: { label: '网址 (url)', group: '媒体链接', color: 'bg-violet-50 text-violet-700 border-violet-200', desc: 'http/https网址并自动校验' },
  email: { label: '邮箱 (email)', group: '媒体链接', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', desc: '电子邮箱并自动格式校验' },
  date: { label: '日期 (date)', group: '时间日期', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'yyyy-MM-dd 日期选择' },
  datetime: { label: '日期时间 (datetime)', group: '时间日期', color: 'bg-orange-50 text-orange-700 border-orange-200', desc: 'yyyy-MM-dd HH:mm:ss' }
};

// 根据组件类型生成对应的校验规则默认模板
export const getDefaultValidateRuleForType = (type: DictItemType): Record<string, any> => {
  switch (type) {
    case 'string':
      return { maxLength: 100, minLength: 1 };
    case 'textarea':
      return { maxLength: 500, minLength: 0 };
    case 'richText':
      return { maxLength: 5000 };
    case 'int':
      return { min: 0, max: 999999 };
    case 'decimal':
      return { min: 0.0, max: 100.0 };
    case 'boolean':
      return { required: true };
    case 'radio':
    case 'select':
      return { required: true };
    case 'checkbox':
    case 'select-multiple':
      return { min: 1, max: 10 };
    case 'image':
      return { fileAccept: '.jpg,.jpeg,.png,.svg,.webp', maxFileSizeMb: 5 };
    case 'file':
      return { fileAccept: '.pdf,.doc,.docx,.xls,.xlsx,.zip', maxFileSizeMb: 20 };
    case 'url':
      return { pattern: '^https?:\\/\\/.+$', regexMsg: '请输入以 http:// 或 https:// 开头的合法网址' };
    case 'email':
      return { pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$', regexMsg: '请输入正确的邮箱格式' };
    case 'date':
      return { pattern: '^\\d{4}-\\d{2}-\\d{2}$', regexMsg: '日期格式须为 yyyy-MM-dd' };
    case 'datetime':
      return { pattern: '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$', regexMsg: '时间格式须为 yyyy-MM-dd HH:mm:ss' };
    default:
      return { maxLength: 100 };
  }
};

// 根据组件类型生成说明提示
export const getValidateRulePlaceholderForType = (type: DictItemType): string => {
  const rule = getDefaultValidateRuleForType(type);
  return JSON.stringify(rule, null, 2);
};

// 辅助函数：获取分类及其所有子孙分类的 ID 列表
const getAllDescendantCategoryIds = (catId: string, allCats: DictCategoryNode[]): string[] => {
  const result: string[] = [catId];
  const queue = [catId];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = allCats.filter(c => c.parentId === currentId);
    for (const child of children) {
      result.push(child.id);
      queue.push(child.id);
    }
  }
  return result;
};

interface DataDictManageProps {
  appName?: string;
  appShortName?: string;
  appCode?: string;
  onShowToast?: (text: string, type: 'success' | 'info' | 'warning') => void;
  showPathDisplay?: boolean;
  isGlobalDictPage?: boolean;
}

export const DataDictManage: React.FC<DataDictManageProps> = ({
  appName = '正管用-网络生态综合治理平台',
  appShortName,
  appCode = 'V8-P-01',
  onShowToast,
  showPathDisplay = true,
  isGlobalDictPage = false
}) => {
  // 计算单应用模式下的目标根节点
  const appRootNode = useMemo(() => {
    if (isGlobalDictPage) {
      return INITIAL_GLOBAL_DICT_CATEGORIES.find(c => c.id === GLOBAL_ROOT_ID) || INITIAL_GLOBAL_DICT_CATEGORIES[0];
    }
    const match = INITIAL_GLOBAL_DICT_CATEGORIES.find(c =>
      c.parentId === GLOBAL_ROOT_ID && (
        (appCode && c.categoryCode.toLowerCase() === appCode.toLowerCase()) ||
        (appShortName && c.categoryName.includes(appShortName)) ||
        (appName && (c.categoryName.includes(appName) || appName.includes(c.categoryName)))
      )
    );
    if (match) return match;
    return (
      INITIAL_GLOBAL_DICT_CATEGORIES.find(c => c.id === ROOT_CATEGORY_ID) || {
        id: `cat_root_${(appCode || 'app').toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        parentId: '0',
        categoryCode: appCode || 'V8-P-01',
        categoryName: appShortName ? `${appShortName}-${appName.replace(/^[^-]+-\s*/, '')}` : appName,
        sort: 1,
        status: 'active' as const,
        remark: `${appName} 数据字典根节点`,
        isSystem: true
      }
    );
  }, [isGlobalDictPage, appCode, appShortName, appName]);

  // 根节点ID
  const currentRootId = isGlobalDictPage ? GLOBAL_ROOT_ID : appRootNode.id;

  // 核心数据状态：根据是否全局视图加载对应数据
  const [categories, setCategories] = useState<DictCategoryNode[]>(() => {
    if (isGlobalDictPage) {
      return INITIAL_GLOBAL_DICT_CATEGORIES;
    }
    const targetId = appRootNode.id;
    const descendantIds = new Set(getAllDescendantCategoryIds(targetId, INITIAL_GLOBAL_DICT_CATEGORIES));
    const list = INITIAL_GLOBAL_DICT_CATEGORIES
      .filter(c => c.id === targetId || descendantIds.has(c.id))
      .map(c => {
        if (c.id === targetId) {
          return { ...c, parentId: '0' };
        }
        return c;
      });
    return list.length > 0 ? list : [{ ...appRootNode, parentId: '0' }];
  });

  const [items, setItems] = useState<DictConfigItem[]>(INITIAL_DICT_ITEMS);
  const [auditLogs, setAuditLogs] = useState<DictAuditLog[]>(INITIAL_DICT_AUDIT_LOGS);

  // 版本快照与回滚历史记录状态（所有日志不可删除）
  const [versionRecords, setVersionRecords] = useState<DictVersionRecord[]>(() => [
    {
      id: 'ver_03',
      version: 'V1.3.2',
      saveDate: '2026-09-09 16:45:20',
      effectiveDate: '2026-09-09',
      operator: 'Mr.luoxiao (系统架构师)',
      summary: '升级 AI 研判与政务监控核心调度参数，同步更新 Redis 全局热点缓存',
      categoriesCount: categories.length,
      itemsCount: INITIAL_DICT_ITEMS.length,
      snapshot: {
        appCode,
        appName,
        categories: JSON.parse(JSON.stringify(categories)),
        items: JSON.parse(JSON.stringify(INITIAL_DICT_ITEMS)),
        exportedAt: '2026-09-09 16:45:20',
        version: 'V1.3.2',
      }
    },
    {
      id: 'ver_02',
      version: 'V1.3.1',
      saveDate: '2026-09-08 14:30:15',
      effectiveDate: '2026-09-08',
      operator: '张华 (标准合规部)',
      summary: '完善系统基础信息、UI 主题色调与安全防泄密暗水印字典配置',
      categoriesCount: categories.length,
      itemsCount: INITIAL_DICT_ITEMS.length - 2 > 0 ? INITIAL_DICT_ITEMS.length - 2 : INITIAL_DICT_ITEMS.length,
      snapshot: {
        appCode,
        appName,
        categories: JSON.parse(JSON.stringify(categories)),
        items: JSON.parse(JSON.stringify(INITIAL_DICT_ITEMS)),
        exportedAt: '2026-09-08 14:30:15',
        version: 'V1.3.1',
      }
    },
    {
      id: 'ver_01',
      version: 'V1.3.0',
      saveDate: '2026-09-05 10:15:00',
      effectiveDate: '2026-09-05',
      operator: 'admin_super (超级管理员)',
      summary: '初始版本全量发布：建立多层级应用注册表树形节点与系统基础参数字典',
      categoriesCount: categories.length,
      itemsCount: INITIAL_DICT_ITEMS.length - 5 > 0 ? INITIAL_DICT_ITEMS.length - 5 : INITIAL_DICT_ITEMS.length,
      snapshot: {
        appCode,
        appName,
        categories: JSON.parse(JSON.stringify(categories)),
        items: JSON.parse(JSON.stringify(INITIAL_DICT_ITEMS)),
        exportedAt: '2026-09-05 10:15:00',
        version: 'V1.3.0',
      }
    }
  ]);

  // 查看版本 JSON 快照与回滚确认弹窗状态
  const [selectedVersionForJson, setSelectedVersionForJson] = useState<DictVersionRecord | null>(null);
  const [versionToRollback, setVersionToRollback] = useState<DictVersionRecord | null>(null);

  // 选中分类与树展开状态
  const [selectedCatId, setSelectedCatId] = useState<string>(() => {
    if (isGlobalDictPage) return 'cat_system_ui';
    const firstChild = categories.find(c => c.parentId === currentRootId || c.parentId === '0' && c.id !== currentRootId);
    return firstChild ? firstChild.id : currentRootId;
  });

  const [expandedCatIds, setExpandedCatIds] = useState<string[]>(() => {
    if (isGlobalDictPage) {
      return [
        GLOBAL_ROOT_ID,
        ROOT_CATEGORY_ID,
        JSYQ_ROOT_CATEGORY_ID,
        QQY_ROOT_CATEGORY_ID,
        'cat_system_base',
        'cat_ai_govern',
        'cat_monitor_sentiment',
        'cat_dispatch_workflow',
        'cat_jsyq_crawler',
        'cat_jsyq_alert',
        'cat_qqy_multilang',
        'cat_qqy_threat'
      ];
    }
    return [
      currentRootId,
      'cat_system_base',
      'cat_ai_govern',
      'cat_monitor_sentiment',
      'cat_dispatch_workflow',
      'cat_jsyq_crawler',
      'cat_jsyq_alert',
      'cat_qqy_multilang',
      'cat_qqy_threat'
    ];
  });

  // 树过滤与项目搜索
  const [treeSearchQuery, setTreeSearchQuery] = useState('');
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [systemFilter, setSystemFilter] = useState<'ALL' | 'system' | 'custom'>('ALL');

  // 复制反馈
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 待保存草稿 / 变更追踪
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 获取分类的程序读取完整路径
  const getCategoryFullCodePath = (catId: string): string => {
    const rootPrefix = isGlobalDictPage ? 'V8-Reg/register-tree' : `${appCode}/register-tree`;
    const cat = categories.find(c => c.id === catId);
    if (!cat || cat.id === currentRootId) return rootPrefix;

    const parts: string[] = [];
    let curr: DictCategoryNode | undefined = cat;
    const visited = new Set<string>();
    while (curr && curr.id !== currentRootId && curr.parentId !== '0' && !visited.has(curr.id)) {
      visited.add(curr.id);
      const codeParts = curr.categoryCode.split('.');
      parts.unshift(...codeParts);
      curr = categories.find(c => c.id === curr?.parentId);
    }

    // 过滤连续重复的路径片段
    const uniqueParts: string[] = [];
    for (const part of parts) {
      if (uniqueParts.length === 0 || uniqueParts[uniqueParts.length - 1] !== part) {
        uniqueParts.push(part);
      }
    }

    return `${rootPrefix}/${uniqueParts.join('/')}`;
  };

  // 获取配置项的程序读取完整路径
  const getItemFullPath = (catId: string, itemKey: string): string => {
    const catPath = getCategoryFullCodePath(catId);
    return `${catPath}/${itemKey}`;
  };

  // 模态弹窗控制
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DictCategoryNode | null>(null);
  const [parentCatForNew, setParentCatForNew] = useState<string>(currentRootId);

  // 鼠标右键上下文菜单状态
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: DictCategoryNode | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    node: null
  });

  // 全局监听：点击空白处、滚动或按ESC键时自动关闭右键菜单
  useEffect(() => {
    const handleCloseMenu = () => {
      setContextMenu(prev => (prev.visible ? { ...prev, visible: false } : prev));
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseMenu();
      }
    };

    window.addEventListener('click', handleCloseMenu);
    window.addEventListener('scroll', handleCloseMenu, true);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleCloseMenu);
      window.removeEventListener('scroll', handleCloseMenu, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DictConfigItem | null>(null);

  // 删除确认弹窗状态
  const [categoryToDelete, setCategoryToDelete] = useState<DictCategoryNode | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DictConfigItem | null>(null);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // JSON 代码片段浮窗状态 (支持节点全量与单项配置)
  const [jsonSnippetModal, setJsonSnippetModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    type: 'node' | 'item';
    dataMode: 'full' | 'key_value';
    fullJsonStr: string;
    kvJsonStr: string;
    path: string;
    itemCount?: number;
    targetName: string;
  } | null>(null);

  // 分类表单临时状态
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    categoryCode: '',
    parentId: currentRootId,
    remark: '',
    sort: 1
  });

  // 字典项表单临时状态
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState<{
    itemKey: string;
    itemLabel: string;
    itemType: DictItemType;
    itemValue: any;
    defaultValue: any;
    enumOptionsStr: string;
    validateRuleStr: string;
    isRequired: boolean;
    isSystem: boolean;
    preventDelete: boolean;
    sort: number;
    remark: string;
  }>({
    itemKey: '',
    itemLabel: '',
    itemType: 'string',
    itemValue: '',
    defaultValue: '',
    enumOptionsStr: '[\n  {"label": "选项1", "value": "opt1"},\n  {"label": "选项2", "value": "opt2"}\n]',
    validateRuleStr: '{\n  "maxLength": 100\n}',
    isRequired: true,
    isSystem: false,
    preventDelete: false,
    sort: 1,
    remark: ''
  });

  const notify = (msg: string, type: 'success' | 'info' | 'warning' = 'info') => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    notify(`已复制：${text}`, 'success');
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // 展开/收起指定树节点
  const toggleExpand = (catId: string) => {
    setExpandedCatIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  // 全部展开 / 全部收起
  const handleExpandAll = () => {
    setExpandedCatIds(categories.map(c => c.id));
  };
  const handleCollapseAll = () => {
    setExpandedCatIds([currentRootId]);
  };

  // 计算树形层级结构
  const categoryTree = useMemo(() => {
    const buildSubTree = (pId: string): DictCategoryNode[] => {
      return categories
        .filter(c => c.parentId === pId)
        .sort((a, b) => a.sort - b.sort)
        .map(node => ({
          ...node,
          children: buildSubTree(node.id)
        }));
    };

    if (isGlobalDictPage) {
      const rootNode = categories.find(c => c.id === GLOBAL_ROOT_ID) || {
        id: GLOBAL_ROOT_ID,
        parentId: '0',
        categoryCode: 'V8-Reg',
        categoryName: '全局数据字典',
        sort: 1,
        status: 'active',
        remark: '已注册应用全局数据字典目录与参数配置中心',
        isSystem: true
      };

      return [{
        ...rootNode,
        children: buildSubTree(rootNode.id)
      }];
    }

    const rootNode = categories.find(c => c.id === currentRootId || c.parentId === '0') || appRootNode;

    return [{
      ...rootNode,
      children: buildSubTree(rootNode.id)
    }];
  }, [categories, appRootNode, currentRootId, isGlobalDictPage]);

  // 当前选中的分类
  const currentCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCatId) || categories[0];
  }, [categories, selectedCatId]);

  // 当前分类的面包屑路径
  const categoryBreadcrumbs = useMemo(() => {
    const list: DictCategoryNode[] = [];
    let curr: DictCategoryNode | undefined = currentCategory;
    const visited = new Set<string>();
    while (curr && !visited.has(curr.id)) {
      visited.add(curr.id);
      list.unshift(curr);
      if (curr.parentId === '0' || curr.id === currentRootId) break;
      curr = categories.find(c => c.id === curr?.parentId);
    }
    return list;
  }, [currentCategory, categories, currentRootId]);

  // 当前分类及其子分类的所有 ID 集合
  const activeCategorySubIds = useMemo(() => {
    return new Set(getAllDescendantCategoryIds(selectedCatId, categories));
  }, [selectedCatId, categories]);

  // 当前分类下的所有字典项（含过滤与递归子项支持）
  const currentItems = useMemo(() => {
    return items.filter(item => {
      const matchCat = activeCategorySubIds.has(item.categoryId);
      
      const query = itemSearchQuery.trim().toLowerCase();
      const matchQuery = !query || 
        item.itemKey.toLowerCase().includes(query) ||
        item.itemLabel.toLowerCase().includes(query) ||
        item.remark.toLowerCase().includes(query);

      const matchType = selectedTypeFilter === 'ALL' || item.itemType === selectedTypeFilter;
      const matchSystem = systemFilter === 'ALL' || (systemFilter === 'system' ? item.isSystem : !item.isSystem);

      return matchCat && matchQuery && matchType && matchSystem;
    }).sort((a, b) => a.sort - b.sort);
  }, [items, activeCategorySubIds, itemSearchQuery, selectedTypeFilter, systemFilter]);

  // 更新某一个配置项的值 (实时编辑)
  const handleUpdateItemValue = (itemId: string, newValue: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const oldVal = item.itemValue;
        // 记录审计日志
        const newLog: DictAuditLog = {
          id: `log_${Date.now()}`,
          itemId: item.id,
          itemKey: item.itemKey,
          itemLabel: item.itemLabel,
          operator: '当前操作管理员 (Admin)',
          timestamp: new Date().toLocaleString(),
          action: 'update_value',
          oldValue: oldVal,
          newValue: newValue,
          detail: `修改「${item.itemLabel}」参数配置值`
        };
        setAuditLogs(l => [newLog, ...l]);
        setHasUnsavedChanges(true);

        return {
          ...item,
          itemValue: newValue,
          updatedAt: new Date().toLocaleString()
        };
      }
      return item;
    }));
  };

  // 重置单项为默认值
  const handleResetItemDefault = (itemId: string) => {
    const target = items.find(i => i.id === itemId);
    if (!target) return;
    handleUpdateItemValue(itemId, target.defaultValue);
    notify(`已将「${target.itemLabel}」重置为系统默认值`, 'info');
  };

  // 点击页面顶部「保存并刷新缓存」时，弹出研发人员警示框
  const handleSaveAndPublishCache = () => {
    setIsConflictModalOpen(true);
  };

  // 确认执行保存并发布到 Redis 缓存，记录不可删除的全量版本快照
  const handleExecuteSaveAndPublishCache = () => {
    setIsConflictModalOpen(false);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const fullTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const dateStr = `${year}-${month}-${day}`;
    
    // 生成递增版本号，如 V1.3.3
    const nextVersionNum = `V1.3.${versionRecords.length + 1}`;

    const newVersionRecord: DictVersionRecord = {
      id: `ver_${Date.now()}`,
      version: nextVersionNum,
      saveDate: fullTimestamp,
      effectiveDate: dateStr,
      operator: 'Mr.luoxiao (系统架构师)',
      summary: `手动触发保存并刷新缓存（包含 ${categories.length} 个分类节点，${items.length} 个配置项）`,
      categoriesCount: categories.length,
      itemsCount: items.length,
      snapshot: {
        appCode,
        appName,
        categories: JSON.parse(JSON.stringify(categories)),
        items: JSON.parse(JSON.stringify(items)),
        exportedAt: fullTimestamp,
        version: nextVersionNum,
      }
    };

    // 严格遵循规则：所有日志不可删除，保存时追加到顶部
    setVersionRecords(prev => [newVersionRecord, ...prev]);
    setHasUnsavedChanges(false);
    notify(`✓ 全量数据字典已成功持久化并生成版本 ${nextVersionNum}，同步刷新 Redis 缓存 (TTL: 86400s)`, 'success');
  };

  // 执行全量配置版本回滚
  const handleConfirmRollback = () => {
    if (!versionToRollback) return;
    const targetSnap = versionToRollback.snapshot;
    
    // 1. 全量恢复左侧分类菜单树与右侧全部配置项
    const restoredCategories: DictCategoryNode[] = JSON.parse(JSON.stringify(targetSnap.categories));
    const restoredItems: DictConfigItem[] = JSON.parse(JSON.stringify(targetSnap.items));

    setCategories(restoredCategories);
    setItems(restoredItems);

    // 2. 校验选中分类是否依然存在，不存在则重置为首个可用分类
    if (!restoredCategories.some(c => c.id === selectedCatId)) {
      const firstAvailable = restoredCategories.find(c => c.parentId === currentRootId || c.parentId === '0') || restoredCategories[0];
      if (firstAvailable) {
        setSelectedCatId(firstAvailable.id);
      }
    }

    // 3. 记录回滚产生的新快照日志（不可删除）
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const fullTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const dateStr = `${year}-${month}-${day}`;
    const rollbackVersionNum = `V1.3.${versionRecords.length + 2}`;

    const rollbackLogRecord: DictVersionRecord = {
      id: `ver_rb_${Date.now()}`,
      version: rollbackVersionNum,
      saveDate: fullTimestamp,
      effectiveDate: dateStr,
      operator: 'Mr.luoxiao (执行回滚)',
      summary: `【版本回滚】从历史版本 ${versionToRollback.version} (${versionToRollback.saveDate}) 全量恢复`,
      categoriesCount: restoredCategories.length,
      itemsCount: restoredItems.length,
      snapshot: {
        appCode,
        appName,
        categories: restoredCategories,
        items: restoredItems,
        exportedAt: fullTimestamp,
        version: rollbackVersionNum,
      }
    };

    setVersionRecords(prev => [rollbackLogRecord, ...prev]);
    setHasUnsavedChanges(false);
    const rolledBackVersionName = versionToRollback.version;
    setVersionToRollback(null);
    setIsLogModalOpen(false);

    notify(`✓ 已成功将应用数据字典全量回滚至版本【${rolledBackVersionName}】！`, 'success');
  };

  // 打开新增分类弹窗
  const handleOpenAddCategory = (pId: string = ROOT_CATEGORY_ID) => {
    setParentCatForNew(pId);
    setCategoryForm({
      categoryName: '',
      categoryCode: '',
      parentId: pId,
      remark: '',
      sort: categories.filter(c => c.parentId === pId).length + 1
    });
    setEditingCategory(null);
    setIsAddCategoryModalOpen(true);
  };

  // 打开编辑分类弹窗
  const handleOpenEditCategory = (cat: DictCategoryNode) => {
    setEditingCategory(cat);
    setCategoryForm({
      categoryName: cat.categoryName,
      categoryCode: cat.categoryCode,
      parentId: cat.parentId,
      remark: cat.remark,
      sort: cat.sort
    });
    setIsAddCategoryModalOpen(true);
  };

  // 保存分类
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.categoryName.trim() || !categoryForm.categoryCode.trim()) {
      notify('请完整填写分类名称与编码', 'warning');
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(c => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            categoryName: categoryForm.categoryName.trim(),
            categoryCode: categoryForm.categoryCode.trim().toLowerCase(),
            remark: categoryForm.remark.trim(),
            sort: Number(categoryForm.sort) || 1
          };
        }
        return c;
      }));
      notify(`已更新字典分类「${categoryForm.categoryName}」`, 'success');
    } else {
      const newCat: DictCategoryNode = {
        id: `cat_custom_${Date.now()}`,
        parentId: parentCatForNew,
        categoryName: categoryForm.categoryName.trim(),
        categoryCode: categoryForm.categoryCode.trim().toLowerCase(),
        remark: categoryForm.remark.trim(),
        sort: Number(categoryForm.sort) || 1,
        status: 'active',
        isSystem: false
      };
      setCategories(prev => [...prev, newCat]);
      setExpandedCatIds(prev => [...prev, parentCatForNew]);
      setSelectedCatId(newCat.id);
      notify(`已成功新增字典分类「${newCat.categoryName}」`, 'success');
    }

    setIsAddCategoryModalOpen(false);
  };

  // 请求删除分类（触发检查与弹窗确认）
  const handleRequestDeleteCategory = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    if (cat.id === currentRootId || cat.id === GLOBAL_ROOT_ID || cat.id === ROOT_CATEGORY_ID || cat.id === JSYQ_ROOT_CATEGORY_ID || cat.id === QQY_ROOT_CATEGORY_ID || cat.isSystem) {
      notify('系统级顶级目录与核心应用分类不允许删除！', 'warning');
      return;
    }
    // 检查是否有子分类
    if (categories.some(c => c.parentId === catId)) {
      notify(`分类「${cat.categoryName}」下包含子分类，请先删除或移动子分类！`, 'warning');
      return;
    }
    // 核心规则：该分类下不能有任何配置。只要有一个配置就不准删除
    const catItems = items.filter(i => i.categoryId === catId);
    if (catItems.length > 0) {
      notify(`该分类下存在 ${catItems.length} 个配置项，分类下不能有任何配置才允许删除！请先删除或迁移所有配置项。`, 'warning');
      return;
    }
    // 校验通过，弹出确认框
    setCategoryToDelete(cat);
  };

  // 确认执行删除分类
  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const catId = categoryToDelete.id;
    const catName = categoryToDelete.categoryName;
    setCategories(prev => prev.filter(c => c.id !== catId));
    if (selectedCatId === catId) {
      setSelectedCatId(currentRootId);
    }
    setCategoryToDelete(null);
    notify(`已成功删除字典分类「${catName}」`, 'info');
  };

  // 打开分类鼠标右键上下文菜单
  const handleNodeContextMenu = (e: React.MouseEvent, node: DictCategoryNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedCatId(node.id);

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const menuWidth = 230;
    const menuHeight = 260;

    const x = mouseX + menuWidth > window.innerWidth ? Math.max(10, mouseX - menuWidth) : mouseX;
    const y = mouseY + menuHeight > window.innerHeight ? Math.max(10, mouseY - menuHeight) : mouseY;

    setContextMenu({
      visible: true,
      x,
      y,
      node
    });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // 右键菜单操作：新增下级分类 (下行节点)
  const handleAddChildFromContext = (node: DictCategoryNode) => {
    closeContextMenu();
    handleOpenAddCategory(node.id);
  };

  // 右键菜单操作：新增同级分类
  const handleAddSiblingFromContext = (node: DictCategoryNode) => {
    closeContextMenu();
    if (node.id === currentRootId || node.id === GLOBAL_ROOT_ID) {
      notify('顶级根目录不支持添加同级分类！', 'warning');
      return;
    }
    const parentId = node.parentId === '0' ? currentRootId : node.parentId;
    handleOpenAddCategory(parentId);
  };

  // 右键菜单操作：编辑分类
  const handleEditFromContext = (node: DictCategoryNode) => {
    closeContextMenu();
    if (node.id === currentRootId || node.id === GLOBAL_ROOT_ID) {
      notify('顶级根分类受系统保护，不可直接编辑！', 'warning');
      return;
    }
    handleOpenEditCategory(node);
  };

  // 右键菜单操作：删除分类
  const handleDeleteFromContext = (node: DictCategoryNode) => {
    closeContextMenu();
    handleRequestDeleteCategory(node.id);
  };

  // 右键菜单操作：复制路径
  const handleCopyPathFromContext = (node: DictCategoryNode) => {
    closeContextMenu();
    const path = getCategoryFullCodePath(node.id);
    handleCopy(path, 'cm_' + node.id);
  };

  // 打开新增配置项弹窗
  const handleOpenAddItem = () => {
    setEditingItem(null);
    const defaultType: DictItemType = 'string';
    const defaultValidate = getDefaultValidateRuleForType(defaultType);
    setItemForm({
      itemKey: '',
      itemLabel: '',
      itemType: defaultType,
      itemValue: '',
      defaultValue: '',
      enumOptionsStr: '[\n  {"label": "选项一", "value": "opt_1"},\n  {"label": "选项二", "value": "opt_2"}\n]',
      validateRuleStr: JSON.stringify(defaultValidate, null, 2),
      isRequired: true,
      isSystem: false,
      preventDelete: false,
      sort: currentItems.length + 1,
      remark: ''
    });
    setIsAddItemModalOpen(true);
  };

  // 打开编辑配置项定义弹窗
  const handleOpenEditItemDefinition = (item: DictConfigItem) => {
    setEditingItem(item);
    const ruleStr = item.validateRule && Object.keys(item.validateRule).length > 0
      ? JSON.stringify(item.validateRule, null, 2)
      : JSON.stringify(getDefaultValidateRuleForType(item.itemType), null, 2);

    setItemForm({
      itemKey: item.itemKey,
      itemLabel: item.itemLabel,
      itemType: item.itemType,
      itemValue: item.itemValue,
      defaultValue: item.defaultValue,
      enumOptionsStr: item.enumOptions ? JSON.stringify(item.enumOptions, null, 2) : '[\n  {"label": "选项一", "value": "opt_1"},\n  {"label": "选项二", "value": "opt_2"}\n]',
      validateRuleStr: ruleStr,
      isRequired: item.isRequired,
      isSystem: item.isSystem,
      preventDelete: !!item.preventDelete,
      sort: item.sort,
      remark: item.remark
    });
    setIsAddItemModalOpen(true);
  };

  // 保存配置项
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = itemForm.itemKey.trim().toLowerCase();
    const cleanLabel = itemForm.itemLabel.trim();
    const targetCatId = editingItem ? editingItem.categoryId : (selectedCatId === ROOT_CATEGORY_ID ? 'cat_system_ui' : selectedCatId);

    if (!cleanKey || !cleanLabel) {
      notify('配置项 KEY 与显示名称必填', 'warning');
      return;
    }

    // KEY 只能为英文、数字、下划线
    const keyRegex = /^[a-z0-9_]+$/;
    if (!keyRegex.test(cleanKey)) {
      notify('配置项 KEY 必须为纯英文小写、数字或下划线 (例如 sys_title 或 system_name)', 'warning');
      return;
    }

    // 同级分类下 KEY 唯一性校验
    const isDuplicateKey = items.some(item =>
      item.categoryId === targetCatId &&
      item.itemKey.toLowerCase() === cleanKey &&
      (!editingItem || item.id !== editingItem.id)
    );

    if (isDuplicateKey) {
      notify(`同级分类下已存在相同的程序读取 KEY「${cleanKey}」，请使用唯一的 KEY 名称！`, 'warning');
      return;
    }

    let parsedEnumOptions: DictEnumOption[] | undefined = undefined;
    if (['radio', 'select', 'checkbox', 'select-multiple'].includes(itemForm.itemType)) {
      try {
        parsedEnumOptions = JSON.parse(itemForm.enumOptionsStr);
        if (!Array.isArray(parsedEnumOptions)) {
          notify('枚举配置必须为 JSON 数组格式，例如 [{"label":"选项1","value":"opt1"}]', 'warning');
          return;
        }
      } catch (err) {
        notify('枚举配置 JSON 格式不合法，请检查语法（例如缺少引号或逗号）', 'warning');
        return;
      }
    }

    let parsedValidateRule: DictValidateRule | undefined = undefined;
    if (itemForm.validateRuleStr.trim()) {
      try {
        parsedValidateRule = JSON.parse(itemForm.validateRuleStr);
        if (typeof parsedValidateRule !== 'object' || parsedValidateRule === null || Array.isArray(parsedValidateRule)) {
          notify('校验规则必须为标准 JSON 对象格式，例如 {"maxLength": 100}', 'warning');
          return;
        }
      } catch (err) {
        notify('校验规则 JSON 格式不合法，请检查语法（例如键名必须包含双引号）', 'warning');
        return;
      }
    }

    if (editingItem) {
      setItems(prev => prev.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            itemKey: cleanKey,
            itemLabel: cleanLabel,
            itemType: itemForm.itemType,
            defaultValue: itemForm.defaultValue,
            enumOptions: parsedEnumOptions,
            validateRule: parsedValidateRule,
            isRequired: itemForm.isRequired,
            preventDelete: itemForm.preventDelete,
            sort: Number(itemForm.sort) || 1,
            remark: itemForm.remark.trim(),
            updatedAt: new Date().toLocaleString(),
            updatedBy: '系统管理员'
          };
        }
        return item;
      }));
      notify(`已更新配置项「${cleanLabel}」定义`, 'success');
    } else {
      const newItem: DictConfigItem = {
        id: `item_custom_${Date.now()}`,
        categoryId: targetCatId,
        itemKey: cleanKey,
        itemLabel: cleanLabel,
        itemType: itemForm.itemType,
        itemValue: itemForm.itemValue || itemForm.defaultValue || '',
        defaultValue: itemForm.defaultValue || '',
        enumOptions: parsedEnumOptions,
        validateRule: parsedValidateRule,
        isRequired: itemForm.isRequired,
        isSystem: false,
        preventDelete: itemForm.preventDelete,
        sort: Number(itemForm.sort) || 1,
        remark: itemForm.remark.trim(),
        updatedAt: new Date().toLocaleString(),
        updatedBy: '系统管理员'
      };
      setItems(prev => [...prev, newItem]);
      notify(`已成功新建配置项「${newItem.itemLabel}」`, 'success');
    }

    setIsAddItemModalOpen(false);
  };

  // 请求删除配置项（检查禁止删除与弹窗风险确认）
  const handleRequestDeleteItem = (item: DictConfigItem) => {
    if (item.preventDelete) {
      notify(`配置项「${item.itemLabel}」已开启「禁止删除」保护，无法删除！如需删除请先在编辑页面取消勾选。`, 'warning');
      return;
    }
    setItemToDelete(item);
  };

  // 确认执行删除配置项
  const handleConfirmDeleteItem = () => {
    if (!itemToDelete) return;
    const itemId = itemToDelete.id;
    const itemLabel = itemToDelete.itemLabel;
    setItems(prev => prev.filter(i => i.id !== itemId));
    setItemToDelete(null);
    notify(`已删除配置项「${itemLabel}」`, 'info');
  };

  // 导出 JSON
  const handleExportJson = () => {
    const exportData = {
      platform: appName,
      appCode: appCode,
      exportTime: new Date().toISOString(),
      categories: categories,
      items: items
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    setImportJsonText(jsonStr);
    setIsExportModalOpen(true);
  };

  // 导入 JSON
  const handleDoImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.categories && Array.isArray(parsed.categories) && parsed.items && Array.isArray(parsed.items)) {
        setCategories(parsed.categories);
        setItems(parsed.items);
        setIsImportModalOpen(false);
        notify('✓ 字典分类与配置项已成功全量导入并重建！', 'success');
      } else {
        notify('导入数据缺失 categories 或 items 结构', 'warning');
      }
    } catch (e) {
      notify('JSON 解析失败，请检查语法格式', 'warning');
    }
  };

  // 打开最上面节点的 JSON 代码片段浮窗 (该节点下所有配置的 1、值和名称)
  const handleOpenNodeJsonModal = (category: DictCategoryNode, catItems: DictConfigItem[]) => {
    const fullPath = getCategoryFullCodePath(category.id);

    // 构建该节点下所有配置的完整对象结构（包含名称、KEY、值、类型、说明与校验规则）
    const fullDataObject = {
      _registry_type: 'CATEGORY_NODE_SPECS',
      categoryName: category.categoryName,
      categoryCode: category.categoryCode,
      categoryPath: fullPath,
      totalConfigs: catItems.length,
      remark: category.remark || '暂无说明',
      configs: catItems.map((item, idx) => ({
        index: idx + 1,
        itemKey: item.itemKey,
        itemName: item.itemLabel,
        itemValue: item.itemValue,
        itemType: item.itemType,
        defaultValue: item.defaultValue,
        isRequired: item.isRequired,
        fullPath: getItemFullPath(item.categoryId, item.itemKey),
        remark: item.remark || '',
        validateRule: item.validateRule || null
      })),
      keyValueMap: catItems.reduce((acc, curr) => {
        acc[curr.itemKey] = curr.itemValue;
        return acc;
      }, {} as Record<string, any>)
    };

    // 纯键值映射
    const kvDataObject = catItems.reduce((acc, curr) => {
      acc[curr.itemKey] = curr.itemValue;
      return acc;
    }, {} as Record<string, any>);

    setJsonSnippetModal({
      isOpen: true,
      title: `节点配置 JSON — ${category.categoryName}`,
      subtitle: `节点路径: ${fullPath} (共 ${catItems.length} 项参数)`,
      type: 'node',
      dataMode: 'full',
      fullJsonStr: JSON.stringify(fullDataObject, null, 2),
      kvJsonStr: JSON.stringify(kvDataObject, null, 2),
      path: fullPath,
      itemCount: catItems.length,
      targetName: category.categoryName
    });
  };

  // 打开每一个单项配置的 JSON 代码片段浮窗
  const handleOpenItemJsonModal = (item: DictConfigItem) => {
    const fullPath = getItemFullPath(item.categoryId, item.itemKey);

    // 单项配置的结构化 JSON
    const itemDataObject = {
      _registry_type: 'CONFIG_ITEM_SPEC',
      itemKey: item.itemKey,
      itemName: item.itemLabel,
      itemValue: item.itemValue,
      itemType: item.itemType,
      defaultValue: item.defaultValue,
      isRequired: item.isRequired,
      fullPath: fullPath,
      remark: item.remark || '',
      validateRule: item.validateRule || null,
      enumOptions: item.enumOptions && item.enumOptions.length > 0 ? item.enumOptions : undefined,
      isSystem: item.isSystem,
      preventDelete: item.preventDelete,
      updatedAt: item.updatedAt,
      updatedBy: item.updatedBy
    };

    const kvDataObject = {
      [item.itemKey]: item.itemValue
    };

    setJsonSnippetModal({
      isOpen: true,
      title: `配置项 JSON — ${item.itemLabel}`,
      subtitle: `KEY: ${item.itemKey} | 类型: ${item.itemType}`,
      type: 'item',
      dataMode: 'full',
      fullJsonStr: JSON.stringify(itemDataObject, null, 2),
      kvJsonStr: JSON.stringify(kvDataObject, null, 2),
      path: fullPath,
      itemCount: 1,
      targetName: item.itemLabel
    });
  };

  // 渲染单条配置项的可视化控件
  const renderItemControl = (item: DictConfigItem) => {
    switch (item.itemType) {
      case 'string':
        return (
          <div className="flex flex-col gap-1 w-full max-w-lg">
            <input
              type="text"
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              maxLength={item.validateRule?.maxLength}
              placeholder="请输入文本..."
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-800 transition-colors"
            />
            {item.validateRule?.maxLength && (
              <div className="text-[10px] text-slate-400 text-right">
                {(item.itemValue || '').length} / {item.validateRule.maxLength} 字符
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="w-full max-w-xl">
            <textarea
              rows={3}
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              placeholder="请输入多行文本..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 text-slate-800 font-medium resize-y"
            />
          </div>
        );

      case 'richText':
        return (
          <div className="w-full max-w-2xl border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
            {/* 模拟富文本编辑工具栏 */}
            <div className="p-2 bg-slate-100/90 border-b border-slate-200 flex items-center gap-1 flex-wrap text-[11px] text-slate-600">
              <span className="font-bold px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">B 粗体</span>
              <span className="italic px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">I 斜体</span>
              <span className="underline px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">U 下划线</span>
              <span className="border-l border-slate-300 h-3 mx-1" />
              <span className="px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">有序列表</span>
              <span className="px-2 py-0.5 rounded hover:bg-slate-200 cursor-pointer">超链接</span>
              <span className="border-l border-slate-300 h-3 mx-1" />
              <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                富文本模式
              </span>
            </div>
            <textarea
              rows={4}
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              placeholder="请输入富文本 HTML 或段落内容..."
              className="w-full p-3 text-xs bg-white focus:outline-none text-slate-800 font-mono"
            />
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleUpdateItemValue(item.id, !item.itemValue)}
              className={`relative inline-flex items-center h-6 rounded-full px-1.5 transition-all cursor-pointer select-none text-[11px] font-bold shadow-2xs border ${
                item.itemValue
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 w-[74px] justify-between'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300 w-[74px] justify-between'
              }`}
            >
              {item.itemValue ? (
                <>
                  <span className="pl-1 text-[10px]">已开启</span>
                  <span className="w-3.5 h-3.5 bg-white rounded-full shadow-xs shrink-0" />
                </>
              ) : (
                <>
                  <span className="w-3.5 h-3.5 bg-white rounded-full shadow-xs shrink-0" />
                  <span className="pr-1 text-[10px]">已关闭</span>
                </>
              )}
            </button>
            <span className="text-xs text-slate-500 font-medium">
              {item.itemValue ? '功能状态：生效运行中' : '功能状态：已停用熔断'}
            </span>
          </div>
        );

      case 'radio':
        return (
          <div className="flex items-center gap-3 flex-wrap">
            {item.enumOptions?.map((opt) => {
              const isSelected = item.itemValue === opt.value;
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={() => handleUpdateItemValue(item.id, opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-400'}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        );

      case 'select':
        return (
          <div className="w-full max-w-sm">
            <select
              value={item.itemValue ?? ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-800 cursor-pointer"
            >
              {item.enumOptions?.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'checkbox': {
        const selectedArr: any[] = Array.isArray(item.itemValue) ? item.itemValue : [];
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {item.enumOptions?.map((opt) => {
              const isChecked = selectedArr.includes(opt.value);
              const toggleCheck = () => {
                const next = isChecked
                  ? selectedArr.filter(v => v !== opt.value)
                  : [...selectedArr, opt.value];
                handleUpdateItemValue(item.id, next);
              };
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={toggleCheck}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        );
      }

      case 'select-multiple': {
        const selectedArr: any[] = Array.isArray(item.itemValue) ? item.itemValue : [];
        return (
          <div className="w-full max-w-md flex flex-col gap-2">
            <div className="flex items-center gap-1.5 flex-wrap p-1.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[38px]">
              {selectedArr.length === 0 ? (
                <span className="text-xs text-slate-400 pl-1.5">未勾选任何标签...</span>
              ) : (
                selectedArr.map(val => {
                  const label = item.enumOptions?.find(o => o.value === val)?.label || val;
                  return (
                    <span
                      key={String(val)}
                      className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-xs font-bold"
                    >
                      <span>{label}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-rose-600"
                        onClick={() => handleUpdateItemValue(item.id, selectedArr.filter(v => v !== val))}
                      />
                    </span>
                  );
                })
              )}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">快速添加：</span>
              {item.enumOptions?.filter(o => !selectedArr.includes(o.value)).map(opt => (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={() => handleUpdateItemValue(item.id, [...selectedArr, opt.value])}
                  className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-600 hover:border-teal-400 hover:text-teal-700 font-bold cursor-pointer"
                >
                  + {opt.label}
                </button>
              ))}
            </div>
          </div>
        );
      }

      case 'int':
        return (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <input
              type="number"
              step={1}
              min={item.validateRule?.min}
              max={item.validateRule?.max}
              value={item.itemValue ?? 0}
              onChange={(e) => handleUpdateItemValue(item.id, parseInt(e.target.value, 10) || 0)}
              className="w-32 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono font-bold text-slate-800"
            />
            {item.validateRule && (
              <span className="text-[11px] text-slate-400">
                限制范围: [{item.validateRule.min ?? 0} ~ {item.validateRule.max ?? '无上限'}]
              </span>
            )}
          </div>
        );

      case 'decimal':
        return (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <input
              type="number"
              step={0.01}
              min={item.validateRule?.min}
              max={item.validateRule?.max}
              value={item.itemValue ?? 0.0}
              onChange={(e) => handleUpdateItemValue(item.id, parseFloat(e.target.value) || 0.0)}
              className="w-32 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono font-bold text-slate-800"
            />
            {item.validateRule && (
              <span className="text-[11px] text-slate-400">
                范围: [{item.validateRule.min} ~ {item.validateRule.max}]
              </span>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="flex items-center gap-3.5 w-full max-w-lg">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {item.itemValue ? (
                <img
                  src={item.itemValue}
                  alt={item.itemLabel}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="text"
                value={item.itemValue || ''}
                onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
                placeholder="https://..."
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">支持输入网络图片URL或对象存储链接</span>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center gap-3 w-full max-w-lg">
            <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              placeholder="https://static.../template.docx"
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white font-mono"
            />
          </div>
        );

      case 'url':
        return (
          <div className="flex items-center gap-2 w-full max-w-lg">
            <input
              type="url"
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              placeholder="https://api.gov.cn/..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono font-medium"
            />
            {item.itemValue && (
              <a
                href={item.itemValue}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200"
                title="测试新窗口打开"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="flex items-center gap-2 w-full max-w-md">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="email"
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              placeholder="admin@zhengguanyong.cn"
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono font-medium"
            />
          </div>
        );

      case 'date':
        return (
          <div className="flex items-center gap-2 w-full max-w-xs">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white font-mono font-bold"
            />
          </div>
        );

      case 'datetime':
        return (
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={item.itemValue || ''}
              onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
              placeholder="yyyy-MM-dd HH:mm:ss"
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white font-mono font-bold"
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={item.itemValue || ''}
            onChange={(e) => handleUpdateItemValue(item.id, e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          />
        );
    }
  };

  // 递归渲染左侧树节点组件
  const renderTreeNode = (node: DictCategoryNode, depth: number = 0) => {
    const isExpanded = expandedCatIds.includes(node.id);
    const isSelected = selectedCatId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isRoot = node.id === currentRootId;
    const isAppNode = isGlobalDictPage && node.parentId === GLOBAL_ROOT_ID;
    
    // 计算当前节点及其所有子节点下的配置项总数
    const descendantIds = new Set(getAllDescendantCategoryIds(node.id, categories));
    const nodeItemCount = items.filter(i => descendantIds.has(i.categoryId)).length;

    // 过滤树搜索
    if (treeSearchQuery.trim()) {
      const q = treeSearchQuery.trim().toLowerCase();
      const nodeMatch = node.categoryName.toLowerCase().includes(q) || node.categoryCode.toLowerCase().includes(q);
      const childMatch = node.children?.some(c => c.categoryName.toLowerCase().includes(q) || c.categoryCode.toLowerCase().includes(q));
      if (!nodeMatch && !childMatch) return null;
    }

    return (
      <div key={node.id} className="flex flex-col">
        <div
          onClick={() => setSelectedCatId(node.id)}
          onContextMenu={(e) => handleNodeContextMenu(e, node)}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`group flex items-center justify-between py-2 pr-2 rounded-lg cursor-pointer transition-all border ${
            isSelected
              ? isRoot
                ? 'bg-[#1e376b] text-white border-[#1e376b] shadow-xs'
                : 'bg-blue-50 text-blue-950 border-blue-200/90 font-bold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100 border-transparent'
          }`}
          title={`${node.categoryName} (${node.categoryCode}) - 右键或点击右侧菜单可展开操作`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className={`p-0.5 rounded transition-colors cursor-pointer shrink-0 ${
                  isSelected && isRoot ? 'text-blue-200 hover:bg-blue-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <span className="w-3.5 shrink-0" />
            )}

            {isRoot ? (
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
            ) : isAppNode ? (
              <Boxes className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-indigo-600'}`} />
            ) : hasChildren ? (
              isExpanded ? (
                <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-amber-600'}`} />
              ) : (
                <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-amber-500'}`} />
              )
            ) : (
              <Tag className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
            )}

            <span className={`text-xs truncate flex-1 min-w-0 ${isRoot ? 'font-black tracking-tight text-[13px]' : isAppNode ? 'font-black text-slate-800' : 'font-medium'}`}>
              {node.categoryName}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {nodeItemCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isSelected && isRoot ? 'bg-blue-800 text-blue-100' : isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}>
                {nodeItemCount}
              </span>
            )}

            {/* 更多操作/右键菜单触发按钮 */}
            <button
              type="button"
              onClick={(e) => handleNodeContextMenu(e, node)}
              className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                isSelected && isRoot
                  ? 'hover:bg-blue-800 text-blue-200'
                  : 'hover:bg-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title="右键或点击展开菜单 (新增下行节点/新增同级/编辑/删除)"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-0.5 mt-0.5">
            {node.children?.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col flex-1 h-full min-h-[750px] overflow-hidden">
      
      {/* 1. 顶部全局功能工具条 */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50/60 flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>应用数据字典配置</span>
              </h2>
              {hasUnsavedChanges && (
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  ● 存在未发布草稿
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              采用树形层级（类似 Windows 注册表）管理平台所有全局参数，支持 16 种核心前端可视化组件渲染。
            </p>
          </div>

          {/* 顶部右侧高频动作按钮 */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="查看版本历史记录与全量回滚"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>版本回滚</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="导出 JSON 备份"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出配置</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAndPublishCache}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="提交变更并实时刷新 Redis 缓存"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存并刷新缓存</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 主体左右分栏布局 */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* ===================== 左侧：树形层级目录导航 ===================== */}
        <div className="w-full md:w-72 lg:w-80 border-r border-slate-200/90 flex flex-col bg-slate-50/40 shrink-0">
          
          {/* 左侧树顶部操作栏 */}
          <div className="p-3 border-b border-slate-200/90 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                <span>字典分类目录 (Categories)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleExpandAll}
                  className="text-[10px] text-slate-500 hover:text-blue-600 px-1 py-0.5 font-bold cursor-pointer"
                  title="全部展开"
                >
                  展开
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={handleCollapseAll}
                  className="text-[10px] text-slate-500 hover:text-blue-600 px-1 py-0.5 font-bold cursor-pointer"
                  title="全部折叠"
                >
                  折叠
                </button>
              </div>
            </div>

            {/* 快速搜索框与新增主分类按钮 */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索分类名称/编码..."
                  value={treeSearchQuery}
                  onChange={(e) => setTreeSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddCategory(currentRootId)}
                className="p-1.5 bg-[#1e376b] text-white rounded-lg hover:bg-blue-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
                title="在根节点下新建一级分类"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 树形列表容器 */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
            {categoryTree.map(root => renderTreeNode(root, 0))}
          </div>

          {/* 左侧底部说明信息 */}
          <div className="p-2.5 border-t border-slate-200/80 bg-white/90 text-[11px] text-slate-500 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span>已注册分类：{categories.length} 个</span>
              <span className="text-blue-600 font-bold font-mono">3级层级规范</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5 border-t border-slate-100">
              <Info className="w-3 h-3 text-blue-500 shrink-0" />
              <span>鼠标右键点击节点，可弹出管理菜单</span>
            </div>
          </div>
        </div>

        {/* ===================== 右侧：当前分类详情与配置项列表 ===================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          
          {/* 右侧顶部面包屑与分类元数据卡片 */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col gap-3 bg-white">
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* 面包屑导航路径 */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                {categoryBreadcrumbs.map((crumb, idx) => {
                  const isLast = idx === categoryBreadcrumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.id}>
                      <span
                        onClick={() => setSelectedCatId(crumb.id)}
                        className={`cursor-pointer hover:underline ${
                          isLast ? 'font-black text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {crumb.categoryName}
                      </span>
                      {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* 右侧动作：为当前分类新建配置项 */}
              <button
                type="button"
                onClick={handleOpenAddItem}
                className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                id="btn_add_dict_item"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建配置项 (dict_item)</span>
              </button>
            </div>

            {/* 当前分类属性卡片 */}
            <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <code className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {getCategoryFullCodePath(currentCategory.id)}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy(getCategoryFullCodePath(currentCategory.id), 'cat_code')}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                    title="复制路径"
                  >
                    {copiedKey === 'cat_code' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenNodeJsonModal(currentCategory, currentItems)}
                    className="p-1 px-2 text-slate-700 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-800 rounded-md transition-all cursor-pointer flex items-center gap-1 shadow-2xs text-[11px] font-mono font-bold"
                    title="查看该节点下所有配置的 JSON 代码片段"
                    id="btn_view_node_json"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>JSON</span>
                  </button>
                </div>

                <span className="text-xs text-slate-500">
                  说明：{currentCategory.remark || '暂无备注说明'}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-600">
                本节点下共有 <span className="text-blue-700 font-black">{currentItems.length}</span> 项参数
              </div>
            </div>

            {/* 搜索与过滤工具栏 */}
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="按配置KEY (item_key)、中文名称或说明快速检索..."
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">全部字段类型 (16种)</option>
                {Object.entries(DICT_TYPE_INFO).map(([type, info]) => (
                  <option key={type} value={type}>
                    {info.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 右侧配置项可视化渲染列表 */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            {currentItems.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Sliders className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">当前分类下暂无匹配的配置项</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    您可以点击右上角「新建配置项」，为此分类注册全新的业务参数或环境变量。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddItem}
                  className="px-4 py-2 bg-[#1e376b] text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shadow-xs"
                >
                  + 新增第一条配置项
                </button>
              </div>
            ) : (
              currentItems.map((item, idx) => {
                const typeInfo = DICT_TYPE_INFO[item.itemType] || DICT_TYPE_INFO.string;
                const fullItemPath = getItemFullPath(item.categoryId, item.itemKey);

                // 根据组件类型渲染语义化图标与颜色
                const renderTypeTagIcon = (type: string) => {
                  switch (type) {
                    case 'string':
                    case 'textarea':
                      return <FileText className="w-3.5 h-3.5 text-blue-600" />;
                    case 'rich_text':
                      return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
                    case 'select_single':
                    case 'select_multi':
                      return <ListFilter className="w-3.5 h-3.5 text-indigo-600" />;
                    case 'number':
                      return <Hash className="w-3.5 h-3.5 text-amber-600" />;
                    case 'boolean':
                      return <ToggleRight className="w-3.5 h-3.5 text-emerald-600" />;
                    case 'image_upload':
                      return <ImageIcon className="w-3.5 h-3.5 text-pink-600" />;
                    case 'file_upload':
                      return <FileUp className="w-3.5 h-3.5 text-sky-600" />;
                    case 'json':
                      return <FileCode className="w-3.5 h-3.5 text-orange-600" />;
                    case 'color':
                      return <Sliders className="w-3.5 h-3.5 text-rose-600" />;
                    case 'date':
                    case 'time':
                      return <Calendar className="w-3.5 h-3.5 text-teal-600" />;
                    case 'password':
                      return <Lock className="w-3.5 h-3.5 text-red-600" />;
                    case 'url':
                      return <Globe className="w-3.5 h-3.5 text-cyan-600" />;
                    case 'email':
                      return <Mail className="w-3.5 h-3.5 text-violet-600" />;
                    default:
                      return <Tag className="w-3.5 h-3.5 text-blue-600" />;
                  }
                };

                const typeColorStyle = (() => {
                  switch (item.itemType) {
                    case 'string':
                    case 'textarea':
                      return 'bg-blue-50/95 text-blue-700 border-blue-200/90';
                    case 'rich_text':
                      return 'bg-purple-50/95 text-purple-700 border-purple-200/90';
                    case 'select_single':
                    case 'select_multi':
                      return 'bg-indigo-50/95 text-indigo-700 border-indigo-200/90';
                    case 'number':
                      return 'bg-amber-50/95 text-amber-700 border-amber-200/90';
                    case 'boolean':
                      return 'bg-emerald-50/95 text-emerald-700 border-emerald-200/90';
                    case 'image_upload':
                      return 'bg-pink-50/95 text-pink-700 border-pink-200/90';
                    case 'file_upload':
                      return 'bg-sky-50/95 text-sky-700 border-sky-200/90';
                    case 'json':
                      return 'bg-orange-50/95 text-orange-700 border-orange-200/90';
                    case 'color':
                      return 'bg-rose-50/95 text-rose-700 border-rose-200/90';
                    case 'date':
                    case 'time':
                      return 'bg-teal-50/95 text-teal-700 border-teal-200/90';
                    case 'password':
                      return 'bg-red-50/95 text-red-700 border-red-200/90';
                    case 'url':
                      return 'bg-cyan-50/95 text-cyan-700 border-cyan-200/90';
                    case 'email':
                      return 'bg-violet-50/95 text-violet-700 border-violet-200/90';
                    default:
                      return 'bg-blue-50/95 text-blue-700 border-blue-200/90';
                  }
                })();

                return (
                  <div
                    key={item.id}
                    id={`dict_item_card_${item.id}`}
                    className="relative p-4 sm:p-5 pt-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300/80 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3 overflow-hidden"
                  >
                    {/* (1) 右上角结构区：顶部贴边为渲染组件类型标签，下方紧随编辑与删除按钮，形成一体化右侧操作列并与标签适当间距分开 */}
                    <div className="absolute top-0 right-0 z-10 flex flex-col items-end">
                      {/* 类型标签 */}
                      <span
                        className={`inline-flex items-center gap-1.5 border-l border-b px-2.5 py-1 rounded-bl-lg text-[11px] font-bold shadow-2xs ${typeColorStyle}`}
                        title={`渲染组件类型: ${typeInfo.label} (${item.itemType})`}
                      >
                        {renderTypeTagIcon(item.itemType)}
                        <span>{typeInfo.label.split(' ')[0]}</span>
                      </span>

                      {/* 位于标签正下方的“编辑”和“删除”操作按钮组 (上下稍微分开) */}
                      <div className="flex items-center gap-1.5 pr-3.5 pt-2">
                        {/* 编辑按钮 */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditItemDefinition(item)}
                          className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="编辑配置项定义与参数规范"
                        >
                          <Edit2 className="w-3 h-3 text-blue-600" />
                          <span>编辑</span>
                        </button>

                        {/* 删除按钮 */}
                        {item.preventDelete ? (
                          <button
                            type="button"
                            disabled
                            className="px-2 py-0.5 bg-slate-100 text-slate-400 border border-slate-200 rounded text-[11px] font-bold cursor-not-allowed flex items-center gap-1 shadow-2xs"
                            title="已启用「禁止删除」保护，如需删除请先在编辑页面取消勾选"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>删除</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRequestDeleteItem(item)}
                            className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="删除此配置项 (高风险操作)"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>删除</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* (2) Item Card Header: 序号 + 参数名称 + 必填星号 + 备注说明 */}
                    <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-slate-100 pb-2 pr-36 sm:pr-40 min-h-[36px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-400 shrink-0">
                          #{idx + 1}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1 shrink-0">
                          <span>{item.itemLabel}</span>
                          {item.isRequired && <span className="text-rose-500 font-bold">*</span>}
                        </h4>
                        {item.remark && (
                          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline-block truncate max-w-sm" title={item.remark}>
                            — {item.remark}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Body: 可视化组件输入区域 (值展示与编辑) */}
                    <div className="py-1">
                      {renderItemControl(item)}
                    </div>

                    {/* (3) Item Card Footer: 放置在每个区块最下面的配置 key 路径 */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100/90 text-xs">
                      {/* 单起一行居左对齐的程序读取完整路径 */}
                      <div className="flex items-center gap-1.5 self-start bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-md px-2 py-0.5 transition-colors">
                        <code className="font-mono text-xs font-bold text-blue-700">
                          {fullItemPath}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(fullItemPath, item.id)}
                          className="p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                          title="复制完整路径"
                        >
                          {copiedKey === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenItemJsonModal(item)}
                          className="p-0.5 px-1.5 text-slate-700 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 hover:border-slate-800 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold shadow-2xs ml-0.5"
                          title="查看该配置项的 JSON 代码片段"
                        >
                          <FileCode className="w-3 h-3 text-blue-600" />
                          <span>JSON</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ======================= 鼠标右键上下文菜单 (Context Menu) ======================= */}
      {contextMenu.visible && contextMenu.node && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-1.5 min-w-[210px] text-xs animate-in fade-in zoom-in-95 duration-100 divide-y divide-slate-100 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 节点标题提示 */}
          <div className="px-3 py-1.5 bg-slate-50/80 mb-1">
            <p className="font-bold text-slate-800 truncate text-[11px] flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{contextMenu.node.categoryName}</span>
            </p>
            <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
              {contextMenu.node.categoryCode}
            </p>
          </div>

          {/* 新增节点组 */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => handleAddChildFromContext(contextMenu.node!)}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-blue-600" />
              <span>新增下级分类 (下行节点)</span>
            </button>

            {contextMenu.node.id !== currentRootId && contextMenu.node.id !== GLOBAL_ROOT_ID ? (
              <button
                type="button"
                onClick={() => handleAddSiblingFromContext(contextMenu.node!)}
                className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-emerald-600" />
                <span>新增同级分类</span>
              </button>
            ) : (
              <div
                className="w-full px-3 py-1.5 text-left text-slate-400 font-medium flex items-center gap-2 cursor-not-allowed opacity-60"
                title="顶级根节点不支持添加同级"
              >
                <GitBranch className="w-4 h-4 text-slate-400" />
                <span>新增同级分类 (顶级禁用)</span>
              </div>
            )}
          </div>

          {/* 编辑与基础操作 */}
          <div className="py-1">
            {contextMenu.node.id !== currentRootId && contextMenu.node.id !== GLOBAL_ROOT_ID ? (
              <button
                type="button"
                onClick={() => handleEditFromContext(contextMenu.node!)}
                className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-amber-600" />
                <span>编辑分类信息</span>
              </button>
            ) : (
              <div
                className="w-full px-3 py-1.5 text-left text-slate-400 font-medium flex items-center gap-2 cursor-not-allowed opacity-60"
                title="根目录不可直接编辑"
              >
                <Edit2 className="w-4 h-4 text-slate-400" />
                <span>编辑分类信息 (根节点锁定)</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleCopyPathFromContext(contextMenu.node!)}
              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-500" />
              <span>复制程序读取路径</span>
            </button>
          </div>

          {/* 危险区：删除分类 */}
          <div className="py-1">
            {contextMenu.node.id === currentRootId ||
            contextMenu.node.id === GLOBAL_ROOT_ID ||
            contextMenu.node.id === ROOT_CATEGORY_ID ||
            contextMenu.node.id === JSYQ_ROOT_CATEGORY_ID ||
            contextMenu.node.id === QQY_ROOT_CATEGORY_ID ||
            contextMenu.node.isSystem ? (
              <div
                className="w-full px-3 py-1.5 text-left text-slate-400 font-medium flex items-center gap-2 cursor-not-allowed opacity-60"
                title="系统核心目录不允许删除"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>删除分类 (系统保护中)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleDeleteFromContext(contextMenu.node!)}
                className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>删除该分类</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================= Modal 1: 新增/编辑分类 ======================= */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-[#1e376b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-300" />
                <h3 className="text-sm font-black">
                  {editingCategory ? '编辑字典分类 (dict_category)' : '新增字典分类 (dict_category)'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="p-1 rounded text-white/80 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-5 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">分类显示名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：界面全局配置、视频AI识别标签"
                  value={categoryForm.categoryName}
                  onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">分类唯一编码 (category_code) *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：system.ui、video.ai.recognize"
                  value={categoryForm.categoryCode}
                  onChange={(e) => setCategoryForm({ ...categoryForm, categoryCode: e.target.value.toLowerCase() })}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-400">建议使用英文小写加点分格式</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">父级分类</label>
                  <select
                    value={categoryForm.parentId}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.categoryName} ({c.categoryCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">显示排序号</label>
                  <input
                    type="number"
                    value={categoryForm.sort}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sort: parseInt(e.target.value, 10) || 1 })}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">业务用途说明</label>
                <textarea
                  rows={2}
                  placeholder="说明该分类归属的系统模块与业务范围..."
                  value={categoryForm.remark}
                  onChange={(e) => setCategoryForm({ ...categoryForm, remark: e.target.value })}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs"
                >
                  确认保存分类
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= Modal 2: 新增/编辑配置项定义 ======================= */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-[#1e376b] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-300" />
                <h3 className="text-sm font-black">
                  {editingItem ? `编辑配置项定义: ${editingItem.itemLabel}` : '新建配置项 (dict_item)'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="p-1 rounded text-white/80 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 flex-1 overflow-y-auto flex flex-col gap-4 text-xs">
              
              {/* 1. 中文显示名称 与 程序读取的 Key (同一行两列) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">中文显示名称 (item_label) *</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：平台系统全称、预警置信度"
                    value={itemForm.itemLabel}
                    onChange={(e) => setItemForm({ ...itemForm, itemLabel: e.target.value })}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700">程序读取的 Key (item_key) *</label>
                    <span className="text-[10px] text-blue-600 font-bold">同级分类下唯一</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="例如：system_name、alert_threshold"
                    value={itemForm.itemKey}
                    onChange={(e) => setItemForm({ ...itemForm, itemKey: e.target.value.toLowerCase() })}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-mono font-bold text-blue-900"
                  />
                  <span className="text-[10px] text-slate-400">仅允许英文小写与下划线</span>
                </div>
              </div>

              {/* 2. 完整路径：位于“中文显示名称”和“程序读取的 Key”的下一行，只读，联动变化，带复制按钮 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span>完整路径</span>
                    <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">只读</span>
                  </label>
                  <span className="text-[10px] text-slate-400">随程序读取 Key 实时同步变化</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-lg font-mono text-xs font-bold text-blue-800 select-all flex items-center justify-between">
                    <span>
                      {getItemFullPath(
                        editingItem ? editingItem.categoryId : (selectedCatId === ROOT_CATEGORY_ID ? 'cat_system_ui' : selectedCatId),
                        itemForm.itemKey || '<item_key>'
                      )}
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(
                      getItemFullPath(
                        editingItem ? editingItem.categoryId : (selectedCatId === ROOT_CATEGORY_ID ? 'cat_system_ui' : selectedCatId),
                        itemForm.itemKey
                      ),
                      'modal_full_path'
                    )}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
                    title="复制完整路径"
                  >
                    {copiedKey === 'modal_full_path' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>复制路径</span>
                  </button>
                </div>
              </div>

              {/* 3. 渲染组件类型 (item_type) - 新建时显示16种组件供选择，编辑时仅展示当前选中的组件类型 */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span>渲染组件类型 (item_type) *</span>
                  </label>
                  {!editingItem && (
                    <span className="text-blue-600 font-normal text-[11px]">决定前端渲染何种可视化组件（点击联动切换推荐规则）</span>
                  )}
                </div>

                {editingItem ? (
                  /* 编辑模式：仅展示当前配置项的组件类型 */
                  <div className="flex items-center">
                    <div className="p-2.5 px-3.5 rounded-lg border border-blue-600 bg-blue-50/90 text-blue-950 ring-1 ring-blue-500 shadow-2xs flex items-center gap-2.5 select-none">
                      <span className="font-black text-xs text-blue-900">
                        {DICT_TYPE_INFO[itemForm.itemType]?.label || itemForm.itemType}
                      </span>
                      <span className="text-[11px] font-mono text-blue-700 font-bold bg-blue-100/90 px-2 py-0.5 rounded border border-blue-200">
                        {itemForm.itemType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1 ml-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>已固化不可修改</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* 新增模式：展示全部16种组件类型供选择 */
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(DICT_TYPE_INFO).map(([type, info]) => {
                      const isSelected = itemForm.itemType === type;
                      return (
                        <button
                          type="button"
                          key={type}
                          onClick={() => {
                            const newType = type as DictItemType;
                            const newRuleTemplate = getDefaultValidateRuleForType(newType);
                            setItemForm({
                              ...itemForm,
                              itemType: newType,
                              validateRuleStr: JSON.stringify(newRuleTemplate, null, 2)
                            });
                          }}
                          className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-950 ring-1 ring-blue-500 font-bold'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="font-bold text-[11px] truncate">{info.label.split(' ')[0]}</span>
                          <span className="text-[10px] font-mono text-slate-400">{type}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 如果是选择类，显示枚举配置编辑 */}
              {['radio', 'select', 'checkbox', 'select-multiple'].includes(itemForm.itemType) && (
                <div className="flex flex-col gap-1 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-950">枚举选项配置 (enum_options JSON)</label>
                    <span className="text-[10px] text-amber-700">格式：[&#123;"label":"名称","value":"值"&#125;]</span>
                  </div>
                  <textarea
                    rows={4}
                    value={itemForm.enumOptionsStr}
                    onChange={(e) => setItemForm({ ...itemForm, enumOptionsStr: e.target.value })}
                    className="p-2 text-xs bg-white border border-amber-300 rounded-lg font-mono text-slate-800"
                  />
                </div>
              )}

              {/* 4. 校验规则 (validate_rule JSON) - 放置在「渲染组件类型」与「系统默认值」之间，并随类型智能联动 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span>校验规则 (validate_rule JSON)</span>
                    <span className="text-[10px] font-normal text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                      当前适配：{DICT_TYPE_INFO[itemForm.itemType]?.label.split(' ')[0] || itemForm.itemType}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const template = getDefaultValidateRuleForType(itemForm.itemType);
                      setItemForm({
                        ...itemForm,
                        validateRuleStr: JSON.stringify(template, null, 2)
                      });
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer"
                  >
                    重置为该类型推荐规则
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={itemForm.validateRuleStr}
                  onChange={(e) => setItemForm({ ...itemForm, validateRuleStr: e.target.value })}
                  placeholder={getValidateRulePlaceholderForType(itemForm.itemType)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:bg-white focus:border-blue-500 text-slate-800"
                />
              </div>

              {/* 5. 默认值与排序 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">系统默认值 (defaultValue)</label>
                  <input
                    type="text"
                    value={typeof itemForm.defaultValue === 'object' ? JSON.stringify(itemForm.defaultValue) : itemForm.defaultValue}
                    onChange={(e) => setItemForm({ ...itemForm, defaultValue: e.target.value })}
                    placeholder="默认配置初始值..."
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">显示排序号 (sort)</label>
                  <input
                    type="number"
                    value={itemForm.sort}
                    onChange={(e) => setItemForm({ ...itemForm, sort: parseInt(e.target.value, 10) || 1 })}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              {/* 6. 业务用途说明 (单行文本框) */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">业务用途说明 (remark)</label>
                <input
                  type="text"
                  value={itemForm.remark}
                  onChange={(e) => setItemForm({ ...itemForm, remark: e.target.value })}
                  placeholder="输入此配置项的业务用途与前后端读取规范..."
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              {/* 7. 必填标记 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_is_req"
                    checked={itemForm.isRequired}
                    onChange={(e) => setItemForm({ ...itemForm, isRequired: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="chk_is_req" className="font-bold text-slate-700 cursor-pointer">
                    标记为必填项 (is_required)
                  </label>
                </div>
                <span className="text-[11px] text-slate-400">平台全局参数统一管理</span>
              </div>

              {/* 8. 禁止删除保护标记 */}
              <div className="flex items-center justify-between p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk_prevent_del"
                    checked={itemForm.preventDelete}
                    onChange={(e) => setItemForm({ ...itemForm, preventDelete: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 cursor-pointer focus:ring-amber-500"
                  />
                  <label htmlFor="chk_prevent_del" className="font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>禁止删除 (prevent_delete)</span>
                  </label>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">勾选后该配置项删除按钮变灰禁用，防止误删造成系统崩溃</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1e376b] hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  确认保存配置项
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= Modal 3: 版本回滚与配置快照历史 ======================= */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 px-5 bg-[#1e376b] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-indigo-300" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight">应用数据字典版本历史与配置回滚</h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-900/80 text-blue-200 border border-blue-400/40">
                      共 {versionRecords.length} 次保存记录
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 规则说明横幅：不可删除保障 */}
            <div className="px-5 py-2.5 bg-blue-50/80 border-b border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 shrink-0">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>版本留存与回滚规则：</strong>每一次点击「保存并刷新缓存」时系统均会自动记录全量配置快照（包含左侧层级菜单和右侧全部配置项）。
                <strong className="text-blue-950">所有的版本日志不能删除</strong>，以防止误操作或误删除，保障系统配置随时可精准追溯与回滚。
              </div>
            </div>

            {/* 版本列表区域 */}
            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/60">
              {versionRecords.map((record, idx) => (
                <div
                  key={record.id}
                  className={`p-4 bg-white rounded-xl border transition-all shadow-2xs flex flex-col gap-3 ${
                    idx === 0 ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* 首行：版本号、保存日期、使用日期、操作人、动作按钮 */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-black px-2.5 py-1 rounded-md bg-[#1e376b] text-white shadow-2xs">
                        {record.version}
                      </span>

                      {idx === 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/80 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>当前运行版本</span>
                        </span>
                      )}

                      <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>保存日期：<strong>{record.saveDate}</strong></span>
                      </span>

                      <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>使用日期：<strong>{record.effectiveDate}</strong></span>
                      </span>
                    </div>

                    {/* 操作按钮：JSON 查看与回滚 */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedVersionForJson(record)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 shadow-2xs"
                        title="查看当时保存的该版本全量 JSON 内容"
                      >
                        <Code2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVersionToRollback(record)}
                        className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        title="恢复整个应用数据字典为此版本的配置（包含左侧菜单与右侧配置项）"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                        <span>回滚</span>
                      </button>
                    </div>
                  </div>

                  {/* 次行：操作人与节点统计 */}
                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 px-3 py-2 rounded-lg border border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-bold">当时执行保存操作人：</span>
                      <span className="font-mono text-slate-800 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                        {record.operator}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>包含分类目录: <strong className="text-slate-700">{record.categoriesCount}</strong> 个节点</span>
                      <span>•</span>
                      <span>包含配置项: <strong className="text-slate-700">{record.itemsCount}</strong> 项参数</span>
                    </div>
                  </div>

                  {/* 变更说明与备注 */}
                  <div className="text-xs text-slate-600 flex items-start gap-1 leading-relaxed">
                    <span className="text-slate-400 font-medium shrink-0">变更摘要：</span>
                    <span className="text-slate-700">{record.summary}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                提示：每次点击页面顶部的「保存并刷新缓存」将立即新增一条永久不可删除的完整版本记录
              </span>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 3.1: 回滚高风险确认弹窗 ======================= */}
      {versionToRollback && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 px-5 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-black">版本回滚风险提示</h3>
              </div>
              <button
                type="button"
                onClick={() => setVersionToRollback(null)}
                className="p-1 rounded text-white/80 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* 核心风险告警横幅（满足用户明确要求的文本） */}
              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <div className="font-black text-sm text-rose-800 tracking-tight">
                    回滚操作慎用，可能会对系统造成破坏
                  </div>
                  <p className="text-xs text-rose-900/80 leading-relaxed">
                    回滚操作将把当前整个页面的应用数据字典配置（包括左侧分类菜单树与右侧全部配置项），从该版本快照 JSON 中<strong>全部恢复</strong>为当时保存时的配置，并覆盖现有未保存的变更。
                  </p>
                </div>
              </div>

              {/* 待回滚目标版本信息 */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-800 pb-1.5 border-b border-slate-200/80 flex items-center justify-between">
                  <span>准备恢复的目标版本：</span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#1e376b] text-white font-bold">
                    {versionToRollback.version}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono text-[11px]">
                  <div>保存日期：<span className="text-slate-900 font-bold">{versionToRollback.saveDate}</span></div>
                  <div>使用日期：<span className="text-slate-900 font-bold">{versionToRollback.effectiveDate}</span></div>
                  <div>保存操作人：<span className="text-slate-900 font-bold">{versionToRollback.operator}</span></div>
                  <div>恢复规模：<span className="text-slate-900 font-bold">{versionToRollback.categoriesCount} 目录 / {versionToRollback.itemsCount} 项参数</span></div>
                </div>
                <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
                  说明：{versionToRollback.summary}
                </div>
              </div>
            </div>

            <div className="p-4 px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setVersionToRollback(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRollback}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>确认回滚并恢复配置</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 3.2: 单版本快照 JSON 查看器 ======================= */}
      {selectedVersionForJson && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-[#0b1120] rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 px-5 bg-[#131b2e] border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-2">
                    <span>版本 {selectedVersionForJson.version} 数据字典全量 JSON 快照</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                      {selectedVersionForJson.categoriesCount} 目录 / {selectedVersionForJson.itemsCount} 项参数
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    保存时间：{selectedVersionForJson.saveDate} • 操作人：{selectedVersionForJson.operator}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVersionForJson(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 复制与下载工具栏 */}
            <div className="px-5 py-2.5 bg-[#090d16] border-b border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                {selectedVersionForJson.summary}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedVersionForJson.snapshot, null, 2));
                    notify(`✓ 版本 ${selectedVersionForJson.version} 全量 JSON 快照已复制到剪贴板`, 'success');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制代码</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const content = JSON.stringify(selectedVersionForJson.snapshot, null, 2);
                    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `dict-snapshot-${selectedVersionForJson.version}-${Date.now()}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    notify(`已下载版本 ${selectedVersionForJson.version} 的 JSON 备份文件`, 'success');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 .json</span>
                </button>
              </div>
            </div>

            {/* JSON 展示代码区域 */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#090d16] text-slate-200 font-mono text-xs select-text">
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed font-mono">
                {JSON.stringify(selectedVersionForJson.snapshot, null, 2)}
              </pre>
            </div>

            <div className="p-3 px-5 bg-[#131b2e] border-t border-slate-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedVersionForJson(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 4: 导出 JSON ======================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-[#1e376b] text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>导出字典全量 JSON 备份</span>
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded text-white/80 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <p className="text-xs text-slate-500">
                可复制以下 JSON 用于测试环境→生产环境同步，或本地归档备份：
              </p>
              <textarea
                rows={12}
                readOnly
                value={importJsonText}
                className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none select-all"
              />
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(importJsonText);
                  notify('已复制全量 JSON 到剪贴板', 'success');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>一键复制 JSON</span>
              </button>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 5: 导入 JSON ======================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-[#1e376b] text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>导入字典配置 JSON (覆盖同步)</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded text-white/80 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <p className="text-xs text-slate-500">
                请将符合规范的平台字典 JSON 粘贴至下方文本框中：
              </p>
              <textarea
                rows={10}
                placeholder='{\n  "categories": [...],\n  "items": [...]\n}'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 font-mono text-xs rounded-xl focus:outline-none focus:bg-white"
              />
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold"
              >
                取消
              </button>
              <button
                onClick={handleDoImportJson}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>解析并导入</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 6: 删除分类确认弹窗 ======================= */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-rose-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-200" />
                <span>确认删除字典分类</span>
              </h3>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="p-1 rounded text-white/80 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-900 text-sm mb-1">
                    确定要删除分类「{categoryToDelete.categoryName}」吗？
                  </p>
                  <p className="text-slate-500 mb-2">
                    编码：<span className="font-mono font-semibold text-slate-700">{categoryToDelete.categoryCode}</span>
                  </p>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                    <span className="text-emerald-700 font-bold">✓ 系统已检查：</span>当前分类下配置项数量为 0，且无下级子分类，符合删除前提。
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除分类</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 7: 删除配置项风险确认弹窗 ======================= */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-4 bg-rose-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-300 animate-pulse" />
                <span>高风险操作确认：删除字典配置项</span>
              </h3>
              <button
                onClick={() => setItemToDelete(null)}
                className="p-1 rounded text-white/80 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">
                    您正在尝试删除配置项「{itemToDelete.itemLabel}」
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded border border-rose-100 w-fit">
                    <span>KEY:</span>
                    <span>{itemToDelete.itemKey}</span>
                  </div>
                </div>
              </div>

              {/* 风险提示框 */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <Shield className="w-4 h-4 text-rose-700" />
                  <span>重要风险警告：</span>
                </div>
                <p>
                  删除配置项很有可能导致前端页面渲染异常或后端接口因缺少必要参数而引发系统崩溃！
                </p>
                <p className="text-rose-700 text-[11px]">
                  系统强烈建议保留关键配置。若确认此配置不再被任何代码读取或依赖，请在谨慎核对后再执行删除。
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex justify-between items-center">
                <span>当前配置值:</span>
                <span className="font-mono font-bold text-slate-800 truncate max-w-[200px]">
                  {JSON.stringify(itemToDelete.itemValue)}
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                放弃删除
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteItem}
                className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>我已知晓风险，确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 8: JSON 代码片段浮窗 (黑色背景代码编辑器) ======================= */}
      {jsonSnippetModal && jsonSnippetModal.isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setJsonSnippetModal(null)}
        >
          <div 
            className="bg-[#0f172a] text-slate-100 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 浮窗顶部 Header */}
            <div className="p-4 px-5 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-xs">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                      <span>{jsonSnippetModal.title}</span>
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
                      {jsonSnippetModal.type === 'node' ? `节点全量 (${jsonSnippetModal.itemCount} 项)` : '单项参数'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {jsonSnippetModal.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setJsonSnippetModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="关闭浮窗 (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 代码控制与模式切换工具栏 */}
            <div className="px-4 py-2.5 bg-[#131b2e] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                {/* 视图模式切换 */}
                <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setJsonSnippetModal({ ...jsonSnippetModal, dataMode: 'full' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      jsonSnippetModal.dataMode === 'full'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    完整结构 (定义与值)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsonSnippetModal({ ...jsonSnippetModal, dataMode: 'key_value' })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      jsonSnippetModal.dataMode === 'key_value'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    纯键值对 (Key-Value)
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate max-w-xs">{jsonSnippetModal.path}</span>
                </div>
              </div>

              {/* 动作按钮：复制与下载 */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const content = jsonSnippetModal.dataMode === 'full' ? jsonSnippetModal.fullJsonStr : jsonSnippetModal.kvJsonStr;
                    navigator.clipboard.writeText(content);
                    notify('✓ JSON 代码片段已成功复制到剪贴板', 'success');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>复制代码</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const content = jsonSnippetModal.dataMode === 'full' ? jsonSnippetModal.fullJsonStr : jsonSnippetModal.kvJsonStr;
                    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${jsonSnippetModal.type === 'node' ? 'node-config' : 'item-config'}-${Date.now()}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    notify('已下载 JSON 配置文件', 'success');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载 .json</span>
                </button>
              </div>
            </div>

            {/* 黑色背景代码展示区域 */}
            <div className="flex-1 overflow-y-auto bg-[#090d16] p-3 text-slate-200 font-mono text-xs select-text">
              {(() => {
                const currentText = jsonSnippetModal.dataMode === 'full' ? jsonSnippetModal.fullJsonStr : jsonSnippetModal.kvJsonStr;
                const lines = currentText.split('\n');
                return (
                  <div className="leading-relaxed py-1">
                    {lines.map((line, idx) => {
                      // 高亮 JSON 标记
                      const coloredLine = line.replace(
                        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                        (match) => {
                          if (/^"/.test(match)) {
                            if (/:$/.test(match)) {
                              // Key (蓝/青色)
                              return `<span class="text-sky-300 font-bold">${match}</span>`;
                            } else {
                              // String (绿色)
                              return `<span class="text-emerald-300">${match}</span>`;
                            }
                          } else if (/true|false/.test(match)) {
                            // Boolean (紫色)
                            return `<span class="text-purple-400 font-bold">${match}</span>`;
                          } else if (/null/.test(match)) {
                            // Null (灰色斜体)
                            return `<span class="text-slate-500 italic">${match}</span>`;
                          } else {
                            // Number (黄色/琥珀色)
                            return `<span class="text-amber-300 font-mono font-bold">${match}</span>`;
                          }
                        }
                      );

                      return (
                        <div key={idx} className="flex hover:bg-white/[0.04] px-2 py-0.5 rounded transition-colors group">
                          <span className="w-10 select-none text-right pr-4 text-slate-600 group-hover:text-slate-500 font-mono text-[11px] shrink-0">
                            {idx + 1}
                          </span>
                          <span
                            className="text-slate-200 whitespace-pre flex-1"
                            dangerouslySetInnerHTML={{ __html: coloredLine }}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* 浮窗底部 Footer */}
            <div className="p-3.5 px-5 bg-[#0b1120] border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>该 JSON 数据已格式化，可直接用于接口调用、前端渲染或配置下发</span>
              </div>
              <button
                type="button"
                onClick={() => setJsonSnippetModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Modal 8: 研发人员警示框（并发保存与数据冲突防范提示） ======================= */}
      {isConflictModalOpen && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-amber-300/80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 border border-white/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight">研发架构警示：并发保存与配置冲突防范</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-900/80 text-amber-200 border border-amber-400/40">
                      开发前待定项
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-100 mt-0.5">
                    数据字典全量持久化 & Redis 缓存刷新协同机制预案
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConflictModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-800 text-xs">
              
              {/* 核心提示主横幅 */}
              <div className="p-4 bg-amber-50/90 border-2 border-amber-300/90 rounded-xl flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-slate-800 leading-relaxed">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    【研发与产品协同重要提示】
                  </span>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    当用户触发保存按钮行为后，因为我们需要记录此时此刻应用数据字典配置的情况，为了防止其他研发人员或产品经理同时操作该区域的数据字典，导致双方发生数据冲突，这个地方需要有一个解决方案，开发前必须定清楚。
                  </p>
                </div>
              </div>

              {/* 解决方案建议选型列表 */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-black text-slate-900 px-0.5">
                  <span className="flex items-center gap-1.5">
                    <GitMerge className="w-4 h-4 text-blue-600" />
                    <span>可选架构技术方案参考 (待开发团队评估确认)：</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  
                  {/* 方案 1 */}
                  <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">1</span>
                        <span>方案一：乐观锁版本校验与差异合并 (CAS / Optimistic Lock)</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        推荐指数 ★★★★★
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6.5 leading-relaxed">
                      拉取配置时返回数据版本序列号（<code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.2 rounded text-[10px]">version_seq</code> / <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.2 rounded text-[10px]">etag</code>）。提交时若服务端版本已发生递增，则拒绝覆盖并弹出可视化「差异比对面板 (Diff & Merge)」，允许操作人对比合并后重新提交。
                    </p>
                  </div>

                  {/* 方案 2 */}
                  <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center">2</span>
                        <span>方案二：分布式协同排他编辑锁 (Redis Mutex Lock)</span>
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        推荐指数 ★★★★☆
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6.5 leading-relaxed">
                      当任一研发或产品进入该应用的数据字典编辑状态时，自动获取 Redis 分布式排他锁并保持 30 秒心跳续租；其他用户打开页面时进入“只读协同查看”模式，明确显示「正在由 [张三] 编辑中」，支持排队或申请抢占编辑权。
                    </p>
                  </div>

                  {/* 方案 3 */}
                  <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">3</span>
                        <span>方案三：细粒度分类分片原子提交 (Sub-Tree Partitioning)</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        推荐指数 ★★★☆☆
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 pl-6.5 leading-relaxed">
                      将整树全量快照保存降级为按一级分类或独立字典项进行原子化变更提交，大幅度缩小并发冲突面。
                    </p>
                  </div>

                </div>
              </div>

              {/* 底部状态说明 */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>当前原型已内置全量快照与回滚留痕能力，点击下方按钮将继续生成当前版本快照并刷新缓存。</span>
                </span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsConflictModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                暂不保存，返回检查
              </button>
              <button
                type="button"
                onClick={handleExecuteSaveAndPublishCache}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>已知晓并发机制，确认执行本次保存并刷新</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
