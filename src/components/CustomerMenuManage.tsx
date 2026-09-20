import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutList,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  Folder,
  FileJson,
  Globe,
  Settings,
  Activity,
  CheckSquare,
  Sliders,
  Flame,
  KeyRound,
  Users,
  ListTodo,
  FileCode,
  TrendingUp,
  Gauge,
  FileText,
  Database,
  Cpu,
  History,
  LayoutDashboard,
  Send,
  ShieldCheck,
  ShieldAlert,
  FileSpreadsheet,
  Check,
  Copy,
  AlertTriangle,
  Upload,
  Download,
  Image as ImageIcon,
  Code2,
  ExternalLink,
  Maximize2,
  X,
  Building2
} from 'lucide-react';
import {
  SysMenuItem,
  INITIAL_DITING_MENUS,
  AVAILABLE_ICONS,
  getMenuIconComponent,
  MenuAuditLog
} from './MenuManage';
import { INITIAL_PRIMARY_PERMS, PrimaryPermItem } from './PermissionDictManage';

export interface CustomerMenuManageProps {
  customerOrgName: string;
  customerOrgCode: string;
  appName?: string;
  appCode?: string;
  onShowToast?: (text: string, type: 'success' | 'warning' | 'info') => void;
}

export const CustomerMenuManage: React.FC<CustomerMenuManageProps> = ({
  customerOrgName,
  customerOrgCode,
  appName = '谛听预警系统',
  appCode = 'APP-DITING-01',
  onShowToast
}) => {
  // 独立复制系统默认菜单作为当前客户机构的专属菜单数据（完全独立副本，互不影响）
  const [menus, setMenus] = useState<SysMenuItem[]>(() => {
    return JSON.parse(JSON.stringify(INITIAL_DITING_MENUS));
  });
  const [selectedMenuId, setSelectedMenuId] = useState<string>('m_dt_home');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenuIds, setExpandedMenuIds] = useState<string[]>([
    'm_dt_scheme',
    'm_dt_topic',
    'm_dt_warehouse',
    'm_dt_tag',
    'm_dt_hot',
    'm_dt_report_lib',
    'm_dt_sys_config'
  ]);

  // 编辑表单工作副本
  const [editForm, setEditForm] = useState<SysMenuItem | null>(() => {
    return JSON.parse(JSON.stringify(INITIAL_DITING_MENUS[0]));
  });
  const [isFormDirty, setIsFormDirty] = useState(false);

  // 浮框弹窗：“添加菜单”
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [addMenuLevel, setAddMenuLevel] = useState<'primary' | 'secondary'>('primary');
  const [addMenuName, setAddMenuName] = useState('');
  const [addMenuCode, setAddMenuCode] = useState('');
  const [addMenuParentId, setAddMenuParentId] = useState<string>('m_dt_scheme');
  const [addMenuError, setAddMenuError] = useState<string>('');

  // 模态弹窗状态：操作日志、JSON 导入导出、永久删除确认
  const [isAuditLogsModalOpen, setIsAuditLogsModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 图标库选择器搜索
  const [iconSearchQuery, setIconSearchQuery] = useState('');

  // 上传文件 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 操作审计日志记录
  const [auditLogs, setAuditLogs] = useState<MenuAuditLog[]>([
    {
      id: 'log_cust_01',
      timestamp: '2026-09-09 14:15:20',
      operator: '系统管理员',
      menuName: '网格员上报事件',
      menuCode: 'DT_REPORT_GRID',
      field: '专属菜单名称',
      oldValue: '下沉线索上报',
      newValue: '网格员上报事件',
      ip: '10.128.4.12'
    },
    {
      id: 'log_cust_02',
      timestamp: '2026-09-09 11:32:04',
      operator: '系统管理员',
      menuName: '周期研判报告',
      menuCode: 'DT_ANA_PERIODIC',
      field: '前台显示状态',
      oldValue: '显示',
      newValue: '隐藏',
      ip: '10.128.4.12'
    }
  ]);

  // 判断菜单是否为继承自应用的“系统默认”菜单（非客户后来新添加的菜单）
  const isSystemDefaultMenu = (item: SysMenuItem) => {
    // 初始菜单模板中的菜单或非动态新建的即为系统默认
    return INITIAL_DITING_MENUS.some(m => m.id === item.id || m.menuCode === item.menuCode) || !item.id.startsWith('cust_menu_');
  };

  // 当前选中的菜单
  const currentSelectedMenu = useMemo(() => {
    return menus.find(m => m.id === selectedMenuId) || menus[0] || null;
  }, [menus, selectedMenuId]);

  // 当选择菜单切换时同步到编辑表单
  const handleSelectMenu = (item: SysMenuItem) => {
    setSelectedMenuId(item.id);
    setEditForm({
      ...item,
      boundPermCodes: item.boundPermCodes ? [...item.boundPermCodes] : []
    });
    setIsFormDirty(false);
  };

  // 复制文本
  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    onShowToast?.(`已复制「${text}」到剪贴板`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 展开/收起父级菜单
  const toggleExpand = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenuIds(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  // 快速切换单个菜单的“前台可见/不可见”
  // 规则：所有不可见（visible === false）的菜单排在最后，图标置灰、文字加删除线、不能进行上下移动
  const handleToggleVisible = (menuId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMenus(prev => {
      const target = prev.find(m => m.id === menuId);
      if (!target) return prev;
      const nextVisible = !target.visible;
      const updated = prev.map(m => (m.id === menuId ? { ...m, visible: nextVisible } : m));

      // 记录审计日志
      const newLog: MenuAuditLog = {
        id: 'log_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        operator: '系统管理员',
        menuName: target.menuName,
        menuCode: target.menuCode,
        field: '前台显示状态',
        oldValue: target.visible ? '前台显示' : '前台隐藏',
        newValue: nextVisible ? '前台显示' : '前台隐藏',
        ip: '10.128.4.12'
      };
      setAuditLogs(logs => [newLog, ...logs]);

      onShowToast?.(
        `客户「${customerOrgName}」专属菜单「${target.menuName}」已设为：${nextVisible ? '前台显示（可正常排序）' : '前台隐藏（已沉底置灰并加删除线）'}`,
        nextVisible ? 'success' : 'info'
      );
      return updated;
    });

    if (editForm && editForm.id === menuId) {
      setEditForm(prev => (prev ? { ...prev, visible: !prev.visible } : null));
    }
  };

  // ==========================================
  // 打开“添加菜单”浮框弹窗
  // ==========================================
  const handleOpenAddMenuModal = () => {
    setAddMenuLevel('primary');
    setAddMenuName('');
    setAddMenuError('');
    // 默认生成一个唯一的推荐编码
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setAddMenuCode(`CUST_${customerOrgCode ? customerOrgCode.replace(/[^a-zA-Z0-9]/g, '_') : 'ORG'}_MENU_${randomSuffix}`);
    // 默认父级菜单为第一个一级菜单
    const firstPrimary = menus.find(m => m.parentId === '0');
    if (firstPrimary) {
      setAddMenuParentId(firstPrimary.id);
    }
    setIsAddMenuModalOpen(true);
  };

  // 提交添加菜单弹窗 (按钮文案为“添加”)
  const handleConfirmAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = addMenuName.trim();
    if (!trimmedName) {
      setAddMenuError('菜单名称不能为空');
      return;
    }
    if (trimmedName.length > 10) {
      setAddMenuError('菜单名称最长不能超过 10 个汉字');
      return;
    }

    const trimmedCode = (addMenuCode.trim() || `MENU_${Date.now().toString().slice(-4)}`).toUpperCase();

    // 校验编码在整个应用内是否重复
    const isCodeDuplicate = menus.some(m => m.menuCode.toUpperCase() === trimmedCode);
    if (isCodeDuplicate) {
      setAddMenuError(`菜单编码「${trimmedCode}」在当前客户菜单中已存在，请更换`);
      return;
    }

    const newId = 'cust_menu_' + Date.now();
    const parentId = addMenuLevel === 'primary' ? '0' : addMenuParentId;

    // 计算排序号
    const siblings = menus.filter(m => m.parentId === parentId);
    const newSort = siblings.length + 1;

    // 默认前端路由
    let defaultRoute = '/custom/' + trimmedCode.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (addMenuLevel === 'secondary') {
      const parentMenu = menus.find(m => m.id === parentId);
      if (parentMenu) {
        defaultRoute = parentMenu.routePath.replace(/\/$/, '') + '/' + trimmedCode.toLowerCase().replace(/[^a-z0-9]/g, '_');
      }
    }

    const newMenuItem: SysMenuItem = {
      id: newId,
      parentId: parentId,
      menuCode: trimmedCode,
      menuName: trimmedName,
      hasIcon: true,
      iconType: 'library',
      icon: addMenuLevel === 'primary' ? 'Folder' : 'Activity',
      routePath: defaultRoute,
      target: 'frame',
      sort: newSort,
      visible: true,
      globalVisible: true,
      boundPermCodes: [],
      isNewPlaceholder: true
    };

    // 插入列表
    setMenus(prev => [...prev, newMenuItem]);
    // 选中新菜单
    setSelectedMenuId(newId);
    setEditForm({ ...newMenuItem });
    setIsFormDirty(true);

    // 如果添加的是二级菜单，自动展开父菜单
    if (parentId !== '0' && !expandedMenuIds.includes(parentId)) {
      setExpandedMenuIds(prev => [...prev, parentId]);
    }

    // 关闭弹窗
    setIsAddMenuModalOpen(false);
    onShowToast?.(`已成功为此客户添加专属菜单「${trimmedName}」，请在右侧完善配置后保存！`, 'success');
  };

  // 保存表单（保存菜单配置）
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    const trimmedName = editForm.menuName.trim();
    if (!trimmedName) {
      onShowToast?.('菜单名称不能为空', 'warning');
      return;
    }
    if (trimmedName.length > 10) {
      onShowToast?.('菜单名称最长不能超过 10 个汉字', 'warning');
      return;
    }

    const trimmedCode = editForm.menuCode.trim().toUpperCase();
    if (!trimmedCode) {
      onShowToast?.('菜单唯一编码不能为空', 'warning');
      return;
    }

    // 校验编码在当前应用内唯一（排除自己）
    const isCodeDuplicate = menus.some(m => m.id !== editForm.id && m.menuCode.toUpperCase() === trimmedCode);
    if (isCodeDuplicate) {
      onShowToast?.(`菜单编码「${trimmedCode}」在客户菜单中已存在，请更换！`, 'warning');
      return;
    }

    const prevItem = menus.find(m => m.id === editForm.id);
    const isNew = editForm.isNewPlaceholder;

    // 清除占位标识并固化
    const savedItem: SysMenuItem = {
      ...editForm,
      menuName: trimmedName,
      menuCode: trimmedCode,
      isNewPlaceholder: false
    };

    setMenus(prev => prev.map(m => (m.id === editForm.id ? savedItem : m)));
    setEditForm(savedItem);
    setIsFormDirty(false);

    // 记录审计日志
    setAuditLogs(logs => [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        operator: '系统管理员',
        menuName: savedItem.menuName,
        menuCode: savedItem.menuCode,
        field: isNew ? '新增专属菜单' : '配置变更',
        oldValue: isNew ? '无' : prevItem?.menuName || '',
        newValue: savedItem.menuName,
        ip: '10.128.4.12'
      },
      ...logs
    ]);

    onShowToast?.(`客户专属菜单「${savedItem.menuName}」配置已成功保存！`, 'success');
  };

  // 还原修改（仅在修改已有菜单时可用）
  const handleResetForm = () => {
    if (!currentSelectedMenu) return;
    setEditForm({
      ...currentSelectedMenu,
      boundPermCodes: currentSelectedMenu.boundPermCodes ? [...currentSelectedMenu.boundPermCodes] : []
    });
    setIsFormDirty(false);
    onShowToast?.('已还原为修改前的配置', 'info');
  };

  // 永久删除菜单
  const handleConfirmPermanentDelete = () => {
    if (!editForm) return;
    const targetId = editForm.id;
    const targetName = editForm.menuName;

    // 找到所有需要删除的菜单项（包含其子菜单）
    const toDeleteIds = new Set<string>([targetId]);
    menus.forEach(m => {
      if (m.parentId === targetId) {
        toDeleteIds.add(m.id);
      }
    });

    const nextMenus = menus.filter(m => !toDeleteIds.has(m.id));
    setMenus(nextMenus);
    setIsDeleteConfirmOpen(false);

    // 切换选中的菜单
    const remaining = nextMenus[0] || null;
    if (remaining) {
      setSelectedMenuId(remaining.id);
      setEditForm({ ...remaining });
    } else {
      setSelectedMenuId('');
      setEditForm(null);
    }
    setIsFormDirty(false);

    // 记录审计日志
    setAuditLogs(logs => [
      {
        id: 'log_' + Date.now(),
        timestamp: new Date().toLocaleString(),
        operator: '系统管理员',
        menuName: targetName,
        menuCode: editForm.menuCode,
        field: '永久删除专属菜单',
        oldValue: targetName,
        newValue: '已删除',
        ip: '10.128.4.12'
      },
      ...logs
    ]);

    onShowToast?.(`客户专属菜单「${targetName}」及其关联数据已永久删除`, 'info');
  };

  // 上移/下移排序 (仅前台可见菜单 visible === true 可排序)
  const handleMoveSort = (menuId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const target = menus.find(m => m.id === menuId);
    if (!target || !target.visible) return;

    // 找出同层级且同为可见的兄弟菜单
    const visibleSiblings = menus
      .filter(m => m.parentId === target.parentId && m.visible)
      .sort((a, b) => a.sort - b.sort);

    const index = visibleSiblings.findIndex(m => m.id === menuId);
    if (direction === 'up' && index > 0) {
      const prevSibling = visibleSiblings[index - 1];
      const targetSort = target.sort;
      const prevSort = prevSibling.sort;

      setMenus(prev =>
        prev.map(m => {
          if (m.id === target.id) return { ...m, sort: prevSort };
          if (m.id === prevSibling.id) return { ...m, sort: targetSort };
          return m;
        })
      );
      onShowToast?.(`「${target.menuName}」排序已上移`, 'success');
    } else if (direction === 'down' && index < visibleSiblings.length - 1) {
      const nextSibling = visibleSiblings[index + 1];
      const targetSort = target.sort;
      const nextSort = nextSibling.sort;

      setMenus(prev =>
        prev.map(m => {
          if (m.id === target.id) return { ...m, sort: nextSort };
          if (m.id === nextSibling.id) return { ...m, sort: targetSort };
          return m;
        })
      );
      onShowToast?.(`「${target.menuName}」排序已下移`, 'success');
    }
  };

  // 保存并发布
  const handleSaveAndPublish = () => {
    const hasUnsavedPlaceholder = menus.some(m => m.isNewPlaceholder);
    if (hasUnsavedPlaceholder) {
      onShowToast?.('检测到存在未保存的新建菜单占位，已自动统一固化并发布', 'info');
      setMenus(prev => prev.map(m => ({ ...m, isNewPlaceholder: false })));
    }
    onShowToast?.(`客户「${customerOrgName}」的专属菜单配置已成功保存并实时生效！`, 'success');
  };

  // 导出 JSON
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(menus, null, 2);
    setJsonText(jsonStr);
    setIsJsonModalOpen(true);
  };

  // 导入 JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].menuCode) {
        setMenus(parsed);
        setSelectedMenuId(parsed[0].id);
        setEditForm({ ...parsed[0] });
        setIsJsonModalOpen(false);
        onShowToast?.(`成功为「${customerOrgName}」导入 ${parsed.length} 个专属菜单配置项！`, 'success');
      } else {
        alert('导入失败：JSON 格式不符合规范');
      }
    } catch {
      alert('导入失败：JSON 解析错误，请检查语法');
    }
  };

  // 上传本地图标文件处理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast?.('请上传图片格式文件 (PNG, JPG, SVG)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (editForm && reader.result) {
        setEditForm({
          ...editForm,
          iconUploadUrl: reader.result as string
        });
        setIsFormDirty(true);
        onShowToast?.('图标上传成功', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // 排序与分组构建：
  // 规则：所有不可见（visible === false）的菜单排在同类最下方
  const sortMenuItems = (items: SysMenuItem[]) => {
    const visibleItems = items.filter(m => m.visible).sort((a, b) => a.sort - b.sort);
    const hiddenItems = items.filter(m => !m.visible).sort((a, b) => a.sort - b.sort);
    return [...visibleItems, ...hiddenItems];
  };

  // 顶级一级菜单列表
  const rootMenus = useMemo(() => {
    let list = menus.filter(m => m.parentId === '0');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(m => {
        const matchRoot = m.menuName.toLowerCase().includes(q) || m.menuCode.toLowerCase().includes(q);
        const hasMatchChild = menus.some(
          sub =>
            sub.parentId === m.id &&
            (sub.menuName.toLowerCase().includes(q) || sub.menuCode.toLowerCase().includes(q))
        );
        return matchRoot || hasMatchChild;
      });
    }
    return sortMenuItems(list);
  }, [menus, searchQuery]);

  // 二级子菜单列表
  const getSubMenus = (parentId: string) => {
    let list = menus.filter(m => m.parentId === parentId);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        m => m.menuName.toLowerCase().includes(q) || m.menuCode.toLowerCase().includes(q)
      );
    }
    return sortMenuItems(list);
  };

  // 权限绑定多选切换（支持勾选主权限与子权限）
  const handleTogglePermCode = (permCode: string) => {
    if (!editForm) return;
    const current = editForm.boundPermCodes || [];
    const next = current.includes(permCode)
      ? current.filter(c => c !== permCode)
      : [...current, permCode];

    setEditForm({ ...editForm, boundPermCodes: next });
    setIsFormDirty(true);
  };

  // 勾选某个主权限下的所有子权限
  const handleTogglePrimaryGroup = (primaryPerm: PrimaryPermItem) => {
    if (!editForm) return;
    const current = editForm.boundPermCodes || [];
    const groupCodes = [primaryPerm.permCode, ...primaryPerm.subPermissions.map(s => s.subPermCode)];
    const isAllSelected = groupCodes.every(c => current.includes(c));

    let next: string[];
    if (isAllSelected) {
      next = current.filter(c => !groupCodes.includes(c));
    } else {
      next = Array.from(new Set([...current, ...groupCodes]));
    }

    setEditForm({ ...editForm, boundPermCodes: next });
    setIsFormDirty(true);
  };

  // 全选/清空所有权限
  const handleSelectAllPerms = () => {
    if (!editForm) return;
    const allCodes: string[] = [];
    INITIAL_PRIMARY_PERMS.forEach(p => {
      allCodes.push(p.permCode);
      p.subPermissions.forEach(s => allCodes.push(s.subPermCode));
    });

    const isAll = (editForm.boundPermCodes || []).length >= allCodes.length;
    setEditForm({ ...editForm, boundPermCodes: isAll ? [] : allCodes });
    setIsFormDirty(true);
  };

  // 现有的一级菜单列表（用于二级菜单选择父级）
  const existingPrimaryMenus = useMemo(() => {
    return menus.filter(m => m.parentId === '0');
  }, [menus]);

  // 渲染菜单图标预览辅助组件
  const renderIconPreview = (item: SysMenuItem, className = 'w-4 h-4') => {
    if (!item.hasIcon) {
      return <span className="text-[10px] text-slate-300">无图标</span>;
    }
    if (item.iconType === 'upload' && item.iconUploadUrl) {
      return (
        <img
          src={item.iconUploadUrl}
          alt="icon"
          className={`${className} object-contain rounded`}
        />
      );
    }
    if (item.iconType === 'customClass' && item.iconCustomClass) {
      return (
        <span
          className={`${item.iconCustomClass} ${className} flex items-center justify-center text-xs text-blue-600`}
        />
      );
    }
    const IconComp = getMenuIconComponent(item.icon);
    return <IconComp className={className} />;
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col gap-6"
      id="menu_management_container"
    >
      {/* ---------------- 顶部标题栏（主标题，最右侧放置“导入”、“导出”、“保存并发布”按钮） ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
              <LayoutList className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  客户独有的菜单设置
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>{customerOrgName}</span>
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            您可以为当前客户机构（{customerOrgName}）单独配置前端显示的菜单及权限绑定，支持两级菜单设置。此处的更改只对该客户生效，不影响默认菜单模板。
          </p>
        </div>

        {/* 最右侧：导入、导出、保存并发布按钮 */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* 导入 */}
          <button
            type="button"
            onClick={() => {
              setJsonText('');
              setIsJsonModalOpen(true);
            }}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            title="导入菜单配置 JSON"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>导入</span>
          </button>

          {/* 导出 */}
          <button
            type="button"
            onClick={handleExportJson}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            title="导出菜单配置 JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>导出</span>
          </button>

          {/* 保存并发布 */}
          <button
            type="button"
            onClick={handleSaveAndPublish}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:shadow-md"
            title="保存当前客户所有菜单修改并下发到客户系统"
          >
            <Send className="w-3.5 h-3.5" />
            <span>保存并发布</span>
          </button>
        </div>
      </div>

      {/* ---------------- 左右合并工作区（以中间竖线分隔，无多余外框嵌套） ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch pt-1">
        {/* ===================== 左侧：菜单层级树组件 (5 列，无灰色背景框，右侧有竖线分隔，两边等高) ===================== */}
        <div className="lg:col-span-5 flex flex-col gap-3 lg:pr-6 lg:border-r lg:border-slate-200/90 pb-6 lg:pb-0 h-full">
          {/* 树顶部搜索与“添加菜单”按钮 */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索菜单名称或编码..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 点击添加菜单：弹出浮框选择添加一级还是二级菜单 */}
            <button
              type="button"
              onClick={handleOpenAddMenuModal}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 shrink-0 cursor-pointer shadow-xs transition-colors"
              title="添加一级或二级菜单"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加菜单</span>
            </button>
          </div>

          {/* 快捷展开/折叠 */}
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span>菜单层级结构（点击切换选中）</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allParentIds = rootMenus.map(m => m.id);
                  setExpandedMenuIds(expandedMenuIds.length > 0 ? [] : allParentIds);
                }}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {expandedMenuIds.length > 0 ? '全部折叠' : '全部展开'}
              </button>
            </div>
          </div>

          {/* 菜单树列表（无上下滚动条，随内容自然展开） */}
          <div className="flex flex-col gap-1.5 flex-1">
            {rootMenus.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2 bg-white rounded-xl border border-dashed border-slate-200">
                <Search className="w-6 h-6 text-slate-300" />
                <span>未找到匹配的菜单项</span>
              </div>
            ) : (
              rootMenus.map(root => {
                const isSelected = selectedMenuId === root.id;
                const isExpanded = expandedMenuIds.includes(root.id);
                const subItems = getSubMenus(root.id);
                const hasSubs = subItems.length > 0;

                // 判断在同级且可见菜单中的排序位置
                const visibleSiblings = rootMenus.filter(m => m.visible);
                const groupIdx = visibleSiblings.findIndex(m => m.id === root.id);
                const isFirstInVisibleGroup = groupIdx === 0;
                const isLastInVisibleGroup = groupIdx === visibleSiblings.length - 1;

                const isSystemRoot = isSystemDefaultMenu(root);

                return (
                  <div key={root.id} className="flex flex-col gap-1">
                    {/* 一级菜单项 */}
                    <div
                      onClick={() => handleSelectMenu(root)}
                      className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-300 shadow-xs ring-2 ring-blue-400/20'
                          : root.isNewPlaceholder
                          ? 'bg-amber-50/80 border-amber-300 border-dashed'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                      }`}
                      id={`menu_tree_node_${root.id}`}
                    >
                      {/* 左侧：折叠箭头 + 图标 + 菜单名称 */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* 展开/折叠箭头 */}
                        {hasSubs ? (
                          <button
                            type="button"
                            onClick={e => toggleExpand(root.id, e)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        ) : (
                          <span className="w-5 text-center text-slate-300 font-mono text-[10px] shrink-0">●</span>
                        )}

                        {/* 图标（前台不可见时置灰） */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                            !root.visible
                              ? 'bg-slate-100 text-slate-300 opacity-50 grayscale'
                              : isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                          }`}
                        >
                          {renderIconPreview(root, 'w-3.5 h-3.5')}
                        </div>

                        {/* 菜单名称（不可见时文字加横删除线） */}
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <span
                            className={`text-xs truncate ${
                              !root.visible
                                ? 'line-through text-slate-400 font-normal'
                                : isSelected
                                ? 'text-blue-950 font-black'
                                : 'text-slate-800 font-bold'
                            }`}
                          >
                            {root.menuName}
                          </span>
                          {root.isNewPlaceholder && (
                            <span className="text-[9px] text-amber-700 bg-amber-100/80 px-1 py-0.2 rounded font-bold shrink-0">
                              新添加
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 右侧操作与标识栏（全部右对齐）：[排序序号 #1] -> [系统默认] -> [小眼睛] -> [上下移动] */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-auto" onClick={e => e.stopPropagation()}>
                        {/* 1. 灰色排序序号（#数字，超小字号） */}
                        <span className="text-[10px] font-mono text-slate-400 font-medium px-0.5">
                          #{root.sort}
                        </span>

                        {/* 2. 浅色“系统默认”标签（继承自应用的菜单显示，字号尽可能小） */}
                        {isSystemRoot && (
                          <span className="text-[9px] leading-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/80 font-normal select-none">
                            系统默认
                          </span>
                        )}

                        {/* 3. 小眼睛图标（前台显隐开关） */}
                        <button
                          type="button"
                          onClick={e => handleToggleVisible(root.id, e)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            root.visible
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={root.visible ? '当前在前台显示，点击设为隐藏' : '当前在前台隐藏，点击设为显示'}
                        >
                          {root.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* 4. 上下排序按钮 (不可见时禁止上下移动) */}
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={!root.visible || isFirstInVisibleGroup}
                            onClick={e => handleMoveSort(root.id, 'up', e)}
                            className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                              !root.visible || isFirstInVisibleGroup
                                ? 'opacity-20 cursor-not-allowed text-slate-300'
                                : 'cursor-pointer'
                            }`}
                            title={!root.visible ? '不可见菜单不可排序' : '上移排序'}
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={!root.visible || isLastInVisibleGroup}
                            onClick={e => handleMoveSort(root.id, 'down', e)}
                            className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                              !root.visible || isLastInVisibleGroup
                                ? 'opacity-20 cursor-not-allowed text-slate-300'
                                : 'cursor-pointer'
                            }`}
                            title={!root.visible ? '不可见菜单不可排序' : '下移排序'}
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 二级子菜单列表 */}
                    {hasSubs && isExpanded && (
                      <div className="pl-6 flex flex-col gap-1 border-l-2 border-slate-200/80 ml-4 py-0.5">
                        {subItems.map(sub => {
                          const isSubSelected = selectedMenuId === sub.id;
                          const isSystemSub = isSystemDefaultMenu(sub);

                          const visibleSubs = subItems.filter(m => m.visible);
                          const subGroupIdx = visibleSubs.findIndex(m => m.id === sub.id);
                          const isFirstSub = subGroupIdx === 0;
                          const isLastSub = subGroupIdx === visibleSubs.length - 1;

                          return (
                            <div
                              key={sub.id}
                              onClick={() => handleSelectMenu(sub)}
                              className={`group p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${
                                isSubSelected
                                  ? 'bg-blue-50/90 border-blue-300 shadow-xs ring-2 ring-blue-400/20'
                                  : sub.isNewPlaceholder
                                  ? 'bg-amber-50/80 border-amber-300 border-dashed'
                                  : 'bg-white hover:bg-slate-50/80 border-slate-200/90'
                              }`}
                              id={`menu_tree_node_${sub.id}`}
                            >
                              {/* 左侧：图标 + 子菜单名称 */}
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${
                                    !sub.visible
                                      ? 'bg-slate-100 text-slate-300 opacity-50 grayscale'
                                      : isSubSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {renderIconPreview(sub, 'w-3 h-3')}
                                </div>
                                <div className="flex items-center gap-1.5 min-w-0 truncate">
                                  <span
                                    className={`text-xs truncate ${
                                      !sub.visible
                                        ? 'line-through text-slate-400 font-normal'
                                        : isSubSelected
                                        ? 'text-blue-950 font-black'
                                        : 'text-slate-700 font-bold'
                                    }`}
                                  >
                                    {sub.menuName}
                                  </span>
                                  {sub.isNewPlaceholder && (
                                    <span className="text-[9px] text-amber-700 bg-amber-100/80 px-1 rounded font-bold shrink-0">
                                      新添加
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* 右侧操作与标识栏（向右严格对齐）：[排序序号 #1] -> [系统默认] -> [小眼睛] -> [上下移动] */}
                              <div className="flex items-center gap-1.5 shrink-0 ml-auto" onClick={e => e.stopPropagation()}>
                                {/* 1. 灰色排序序号（#数字，超小字号） */}
                                <span className="text-[10px] font-mono text-slate-400 font-medium px-0.5">
                                  #{sub.sort}
                                </span>

                                {/* 2. 浅色“系统默认”标签（继承自应用的菜单显示，字号尽可能小） */}
                                {isSystemSub && (
                                  <span className="text-[9px] leading-tight px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/80 font-normal select-none">
                                    系统默认
                                  </span>
                                )}

                                {/* 3. 小眼睛图标 */}
                                <button
                                  type="button"
                                  onClick={e => handleToggleVisible(sub.id, e)}
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    sub.visible
                                      ? 'text-emerald-600 hover:bg-emerald-50'
                                      : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                                  }`}
                                  title={sub.visible ? '在前台显示' : '在前台隐藏'}
                                >
                                  {sub.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                </button>

                                {/* 4. 上下排序 (不可见时禁止上下移动) */}
                                <div className="flex flex-col">
                                  <button
                                    type="button"
                                    disabled={!sub.visible || isFirstSub}
                                    onClick={e => handleMoveSort(sub.id, 'up', e)}
                                    className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                                      !sub.visible || isFirstSub
                                        ? 'opacity-20 cursor-not-allowed text-slate-300'
                                        : 'cursor-pointer'
                                    }`}
                                  >
                                    <ChevronUp className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={!sub.visible || isLastSub}
                                    onClick={e => handleMoveSort(sub.id, 'down', e)}
                                    className={`p-0.5 text-slate-400 hover:text-blue-600 rounded transition-colors ${
                                      !sub.visible || isLastSub
                                        ? 'opacity-20 cursor-not-allowed text-slate-300'
                                        : 'cursor-pointer'
                                    }`}
                                  >
                                    <ChevronDown className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ===================== 右侧：编辑菜单面板 (7 列，无独立卡片框，与左侧合体协同，两边等高) ===================== */}
        <div className="lg:col-span-7 flex flex-col gap-4 lg:pl-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-200/80 h-full">
          {editForm ? (
            <form
              onSubmit={handleSaveForm}
              className="flex flex-col gap-5"
            >
              {/* 表单顶部标题 */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shrink-0">
                    {renderIconPreview(editForm, 'w-4 h-4')}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>编辑菜单：{editForm.menuName}</span>
                    </h4>
                  </div>
                </div>

                {editForm.isNewPlaceholder && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    待保存新菜单
                  </span>
                )}
              </div>

              {/* 表单字段列表 (一行一项单列布局) */}
              <div className="flex flex-col gap-4.5">
                {/* 1. 菜单名称 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>
                      菜单名称 <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      最多 10 个汉字 ({editForm.menuName.length}/10)
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={editForm.menuName}
                    onChange={e => {
                      setEditForm({ ...editForm, menuName: e.target.value });
                      setIsFormDirty(true);
                    }}
                    placeholder="请输入菜单名称（最多 10 个汉字）"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* 2. 菜单唯一编码 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>
                      菜单唯一编码 <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">应用内不可重复</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={editForm.menuCode}
                      onChange={e => {
                        setEditForm({ ...editForm, menuCode: e.target.value.toUpperCase() });
                        setIsFormDirty(true);
                      }}
                      placeholder="例如：DT_WARN_REALTIME"
                      className="w-full pl-3 pr-20 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-blue-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(editForm.menuCode, 'code')}
                      className="absolute right-2 px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedKey === 'code' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>复制</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. 父级菜单 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>
                      父级菜单 <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      选择「根目录」为一级菜单，选择其他一级主菜单则挂载为其二级子菜单
                    </span>
                  </label>

                  <select
                    value={editForm.parentId}
                    onChange={e => {
                      setEditForm({ ...editForm, parentId: e.target.value });
                      setIsFormDirty(true);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    <option value="0">根目录（一级主菜单）</option>
                    {existingPrimaryMenus
                      .filter(m => m.id !== editForm.id)
                      .map(parent => (
                        <option key={parent.id} value={parent.id}>
                          ├─ {parent.menuName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* 4. 菜单是否有图标 & 图标选择 */}
                <div className="flex flex-col gap-2.5 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>菜单是否有图标</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, hasIcon: true });
                          setIsFormDirty(true);
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          editForm.hasIcon
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        是
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, hasIcon: false });
                          setIsFormDirty(true);
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          !editForm.hasIcon
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        否
                      </button>
                    </div>
                  </div>

                  {/* 如果选择“是”，展开三个功能页签：使用图标库 / 上传图标 / 使用样式表 */}
                  {editForm.hasIcon && (
                    <div className="flex flex-col gap-3 pt-2 border-t border-slate-200/80">
                      {/* 三个页签切换 */}
                      <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({ ...editForm, iconType: 'library' });
                            setIsFormDirty(true);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editForm.iconType === 'library'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Folder className="w-3.5 h-3.5" />
                          <span>使用图标库</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({ ...editForm, iconType: 'upload' });
                            setIsFormDirty(true);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editForm.iconType === 'upload'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>上传图标</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({ ...editForm, iconType: 'customClass' });
                            setIsFormDirty(true);
                          }}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            editForm.iconType === 'customClass'
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>使用样式表</span>
                        </button>
                      </div>

                      {/* 页签 1: 使用图标库 */}
                      {editForm.iconType === 'library' && (
                        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-500">从内置图标库中选择：</span>
                            <input
                              type="text"
                              value={iconSearchQuery}
                              onChange={e => setIconSearchQuery(e.target.value)}
                              placeholder="搜索图标..."
                              className="px-2 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-blue-500 w-32"
                            />
                          </div>
                          <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-2 max-h-40 overflow-y-auto pr-1 pt-1">
                            {AVAILABLE_ICONS.filter(i =>
                              !iconSearchQuery ||
                              i.label.includes(iconSearchQuery) ||
                              i.name.toLowerCase().includes(iconSearchQuery.toLowerCase())
                            ).map(item => {
                              const isIconActive = editForm.icon === item.name;
                              const IconComponent = item.icon;
                              return (
                                <button
                                  key={item.name}
                                  type="button"
                                  onClick={() => {
                                    setEditForm({ ...editForm, icon: item.name });
                                    setIsFormDirty(true);
                                  }}
                                  title={item.label}
                                  className={`w-10 h-10 shrink-0 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                    isIconActive
                                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200 shadow-xs'
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  <IconComponent className="w-4 h-4" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 页签 2: 上传图标 */}
                      {editForm.iconType === 'upload' && (
                        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {editForm.iconUploadUrl ? (
                                <img
                                  src={editForm.iconUploadUrl}
                                  alt="Preview"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-slate-300" />
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition-colors"
                                >
                                  选择图片上传
                                </button>
                                {editForm.iconUploadUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditForm({ ...editForm, iconUploadUrl: '' });
                                      setIsFormDirty(true);
                                    }}
                                    className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg cursor-pointer"
                                  >
                                    移除
                                  </button>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">
                                支持 PNG、JPG、SVG 格式，建议尺寸 32x32px
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 页签 3: 使用样式表功能 */}
                      {editForm.iconType === 'customClass' && (
                        <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <label className="text-[11px] font-bold text-slate-600">
                            输入图标 Class 名称：
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editForm.iconCustomClass || ''}
                              onChange={e => {
                                setEditForm({ ...editForm, iconCustomClass: e.target.value });
                                setIsFormDirty(true);
                              }}
                              placeholder="例如：iconfont icon-warning-bell 或 fa fa-shield"
                              className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                            />
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              {editForm.iconCustomClass ? (
                                <span className={editForm.iconCustomClass} />
                              ) : (
                                <Code2 className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            适用于项目中已全局引入的 IconFont 或自定义 CSS 字体图标类
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. 前端路由地址 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>
                      前端路由地址 <span className="text-rose-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.routePath}
                    onChange={e => {
                      setEditForm({ ...editForm, routePath: e.target.value });
                      setIsFormDirty(true);
                    }}
                    placeholder="例如：/diting/warning/realtime"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-medium text-slate-900"
                  />
                </div>

                {/* 6. 打开方式 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">打开方式</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, target: 'frame' });
                        setIsFormDirty(true);
                      }}
                      className={`py-2 px-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editForm.target === 'frame'
                          ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>整个框架(_top)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, target: '_blank' });
                        setIsFormDirty(true);
                      }}
                      className={`py-2 px-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editForm.target === '_blank'
                          ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>新窗口(_blank)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, target: '_self' });
                        setIsFormDirty(true);
                      }}
                      className={`py-2 px-2.5 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editForm.target === '_self'
                          ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>本窗口(_self)</span>
                    </button>
                  </div>
                </div>

                {/* 7. 排序序号 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>排序序号</span>
                    <span className="text-[11px] text-slate-400 font-normal">数字越小越靠前</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.sort}
                    onChange={e => {
                      setEditForm({ ...editForm, sort: parseInt(e.target.value) || 1 });
                      setIsFormDirty(true);
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                {/* 8. 显示范围：全局可见 / 权限绑定二选一 */}
                <div className="flex flex-col gap-2.5 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800">显示范围</span>
                      <span className="text-[11px] text-slate-500">
                        {editForm.globalVisible
                          ? '当前为全局可见（所有用户均可直接访问此菜单）'
                          : '当前为权限控制（仅拥有勾选权限的用户才可见）'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, globalVisible: !editForm.globalVisible });
                        setIsFormDirty(true);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                        editForm.globalVisible
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{editForm.globalVisible ? '全局可见' : '开启全局可见'}</span>
                    </button>
                  </div>

                  {/* 若关闭全局可见，则展示应用权限绑定多选面板 */}
                  {!editForm.globalVisible && (
                    <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                            <span>请选择绑定的应用权限（支持多选）：</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal pl-4.5">
                            只有用户具备其中已选择的任意一个权限，才可见此菜单。
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSelectAllPerms}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer self-start mt-0.5"
                        >
                          全选/清空
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                        {INITIAL_PRIMARY_PERMS.map(primary => {
                          const isPrimarySelected = (editForm.boundPermCodes || []).includes(primary.permCode);
                          return (
                            <div
                              key={primary.id}
                              className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col gap-2"
                            >
                              {/* 主权限行 */}
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isPrimarySelected}
                                    onChange={() => handleTogglePermCode(primary.permCode)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                                  />
                                  <span className="text-xs font-bold text-slate-800">{primary.permName}</span>
                                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded">
                                    {primary.permCode}
                                  </span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleTogglePrimaryGroup(primary)}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 font-bold"
                                >
                                  全选此组
                                </button>
                              </div>

                              {/* 子权限网格 */}
                              {primary.subPermissions.length > 0 && (
                                <div className="pl-5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 border-t border-slate-100 pt-1.5">
                                  {primary.subPermissions.map(sub => {
                                    const isSubSelected = (editForm.boundPermCodes || []).includes(sub.subPermCode);
                                    return (
                                      <label
                                        key={sub.id}
                                        className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSubSelected}
                                          onChange={() => handleTogglePermCode(sub.subPermCode)}
                                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
                                        />
                                        <span className="truncate">{sub.subPermName}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 9. 前台显示状态（调整到“显示范围”下边） */}
                <div className="flex items-center justify-between p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">前台显示状态</span>
                    <span className="text-[11px] text-slate-500">
                      {editForm.visible
                        ? '正常在前台显示并参与排序'
                        : '在前台隐藏，在左侧沉底、图标置灰、文字加删除线且不可移动'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, visible: true });
                        setIsFormDirty(true);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        editForm.visible
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>可见</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, visible: false });
                        setIsFormDirty(true);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        !editForm.visible
                          ? 'bg-slate-600 text-white border-slate-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>不可见</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ---------------- 底部操作按钮区域（还原修改与永久删除居左对齐，保存居右） ---------------- */}
              <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
                {/* 左侧操作按钮组：还原修改 + 永久删除 */}
                <div className="flex items-center gap-2">
                  {/* 1. 还原修改（新建时不显示，修改已有菜单时显示） */}
                  {!editForm.isNewPlaceholder && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>还原修改</span>
                    </button>
                  )}

                  {/* 2. 永久删除（系统默认菜单禁止删除，仅自定义新增菜单可删除） */}
                  {isSystemDefaultMenu(editForm) ? (
                    <div
                      className="px-3 py-2 text-xs font-medium text-slate-400 bg-slate-100/80 border border-slate-200/80 rounded-lg flex items-center gap-1.5 cursor-not-allowed select-none"
                      title="系统默认菜单禁止删除，您可以通过修改前台显示状态设为隐藏"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-300" />
                      <span>系统默认菜单禁止删除</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>永久删除</span>
                    </button>
                  )}
                </div>

                {/* 右侧：保存菜单配置 */}
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>保存菜单配置</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 min-h-[360px]">
              <LayoutList className="w-8 h-8 text-slate-300" />
              <span>请在左侧选择或添加一个菜单进行编辑</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          浮框弹窗 1：点击“添加菜单”时弹出 (选择一级菜单还是二级菜单)
          ======================================================== */}
      {isAddMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">为「{customerOrgName}」添加专属菜单</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMenuModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddMenu} className="flex flex-col gap-4">
              {/* 选择添加层级 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">请选择菜单层级</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddMenuLevel('primary');
                      setAddMenuError('');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      addMenuLevel === 'primary'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>添加一级菜单</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddMenuLevel('secondary');
                      setAddMenuError('');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      addMenuLevel === 'secondary'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>添加二级菜单</span>
                  </button>
                </div>
              </div>

              {/* 如果选择二级菜单：通过下拉框单选已存在的一级菜单 */}
              {addMenuLevel === 'secondary' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    所属一级菜单 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addMenuParentId}
                    onChange={e => setAddMenuParentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  >
                    {existingPrimaryMenus.map(primary => (
                      <option key={primary.id} value={primary.id}>
                        {primary.menuName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 菜单名称 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    菜单名称 <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    最长不能超过 10 个汉字 ({addMenuName.length}/10)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={addMenuName}
                  onChange={e => {
                    setAddMenuName(e.target.value);
                    setAddMenuError('');
                  }}
                  placeholder={addMenuLevel === 'primary' ? '例如：专属大屏看板' : '例如：高危线索追溯'}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* 菜单唯一编码 (自动推荐可调整) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>菜单唯一编码</span>
                  <span className="text-[11px] text-slate-400 font-normal">系统推荐生成</span>
                </label>
                <input
                  type="text"
                  required
                  value={addMenuCode}
                  onChange={e => setAddMenuCode(e.target.value.toUpperCase())}
                  placeholder="例如：CUST_SMART_HALL"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold text-blue-900"
                />
              </div>

              {addMenuError && (
                <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  {addMenuError}
                </div>
              )}

              {/* 底部按钮：按钮叫“添加” */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMenuModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          浮框弹窗 2：永久删除二次确认
          ======================================================== */}
      {isDeleteConfirmOpen && editForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-rose-200 shadow-2xl max-w-md w-full p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-black text-slate-900">
                  确认永久删除菜单「{editForm.menuName}」？
                </h4>
                <p className="text-xs text-rose-700 leading-relaxed bg-rose-50 p-2.5 rounded-lg border border-rose-200/80 font-medium">
                  该菜单目前客户前台已经在使用了，如果永久删除，可能会引起客户系统功能缺失。
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  若删除一级菜单，其下挂载的所有二级子菜单也将一并被移除，此操作不可撤销。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认永久删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          浮框弹窗 3：JSON 导入/导出
          ======================================================== */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-black text-slate-900">「{customerOrgName}」专属菜单配置 JSON 导入 / 导出</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>支持复制以下配置代码备份，或粘贴新的 JSON 数据导入</span>
                <button
                  type="button"
                  onClick={() => handleCopy(jsonText, 'json')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  {copiedKey === 'json' ? '已复制成功' : '复制 JSON'}
                </button>
              </div>
              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                rows={12}
                className="w-full p-3 font-mono text-[11px] bg-slate-900 text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                应用并导入 JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          浮框弹窗 4：操作日志模态框
          ======================================================== */}
      {isAuditLogsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-black text-slate-900">客户菜单管理操作审计日志</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditLogsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <th className="p-2.5 font-bold">时间</th>
                    <th className="p-2.5 font-bold">操作人</th>
                    <th className="p-2.5 font-bold">菜单名称</th>
                    <th className="p-2.5 font-bold">操作类型/字段</th>
                    <th className="p-2.5 font-bold">旧值</th>
                    <th className="p-2.5 font-bold">新值</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                      <td className="p-2.5 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                      <td className="p-2.5 font-bold text-slate-800">{log.operator}</td>
                      <td className="p-2.5 font-bold text-blue-900">{log.menuName}</td>
                      <td className="p-2.5 text-slate-600">{log.field}</td>
                      <td className="p-2.5 text-slate-400 font-mono text-[11px]">{log.oldValue || '-'}</td>
                      <td className="p-2.5 text-emerald-700 font-mono text-[11px] font-bold">
                        {log.newValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAuditLogsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
