/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  KeyRound,
  Plus,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Upload,
  Send,
  FolderTree,
  ListCollapse,
  X,
  AlertCircle,
  Sparkles,
  FileText,
  Building2
} from 'lucide-react';
import {
  PrimaryPermItem,
  SubPermItem,
  INITIAL_PRIMARY_PERMS
} from './PermissionDictManage';

export interface CustomerPermissionDictManageProps {
  customerOrgName: string;
  customerOrgCode: string;
  appCode?: string;
  appName?: string;
  onShowToast?: (text: string, type?: 'success' | 'warning' | 'info') => void;
}

interface InlineEditState {
  id: string;
  type: 'primary' | 'sub';
  primaryId?: string; // 仅子权限需要父级 ID
  name: string;
  code: string;
  desc: string;
  isNew?: boolean; // 是否为新增行
}

export const CustomerPermissionDictManage: React.FC<CustomerPermissionDictManageProps> = ({
  customerOrgName,
  customerOrgCode,
  appCode = 'APP-DITING-01',
  appName = '谛听预警系统',
  onShowToast
}) => {
  // 独立复制系统默认权限字典作为当前客户机构的初始数据（完全独立副本，互不影响）
  const [primaryPerms, setPrimaryPerms] = useState<PrimaryPermItem[]>(() => {
    return JSON.parse(JSON.stringify(INITIAL_PRIMARY_PERMS));
  });

  // 展开/收起集合（默认全部展开）
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(INITIAL_PRIMARY_PERMS.map(p => p.id))
  );

  // 行内编辑/新增状态
  const [editingRow, setEditingRow] = useState<InlineEditState | null>(null);

  // 复制反馈
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    onShowToast?.(`已复制「${text}」到剪贴板`, 'success');
    setTimeout(() => setCopiedCode(null), 1600);
  };

  // 静态化发布状态
  const [isPublishing, setIsPublishing] = useState(false);

  // 查看文本 Modal 状态
  const [isTextViewModalOpen, setIsTextViewModalOpen] = useState(false);

  // 导入文件引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -------------------------------------------------------------
  // 生成层级纯文本格式权限列表
  // -------------------------------------------------------------
  const generatePermissionPlainText = () => {
    if (primaryPerms.length === 0) {
      return `【客户：${customerOrgName} - 暂无生效权限数据】\n当前尚未为该客户创建任何主权限和子权限。`;
    }

    const lines: string[] = [];
    lines.push(`================================================================`);
    lines.push(`【${customerOrgName}】生效权限字典清单 (共 ${primaryPerms.length} 个主权限，${primaryPerms.reduce((acc, p) => acc + p.subPermissions.length, 0)} 个子权限)`);
    lines.push(`所属应用：${appName} (${appCode})`);
    lines.push(`客户机构：${customerOrgName} (${customerOrgCode})`);
    lines.push(`================================================================\n`);

    primaryPerms.forEach((primary, pIdx) => {
      const pNum = pIdx + 1;
      const v8Status = primary.v8Display !== false ? '显示中' : '不显示';
      lines.push(`【主权限 ${pNum}】${primary.permName}`);
      lines.push(`  - 权限唯一 ID: ${primary.permCode}`);
      lines.push(`  - V8 端显示: ${v8Status}`);
      lines.push(`  - 权限说明: ${primary.description || '暂无描述'}`);

      if (primary.subPermissions.length === 0) {
        lines.push(`  └─ (暂无子权限)\n`);
      } else {
        lines.push(`  └─ 子权限 (${primary.subPermissions.length} 项):`);
        primary.subPermissions.forEach((sub, sIdx) => {
          const sNum = `${pNum}.${sIdx + 1}`;
          const subV8Status = sub.v8Display !== false ? '显示中' : '不显示';
          lines.push(`     [${sNum}] ${sub.subPermName}`);
          lines.push(`         唯一 ID: ${sub.subPermCode}`);
          lines.push(`         V8 显示: ${subV8Status}`);
          lines.push(`         说明: ${sub.description || '暂无描述'}`);
        });
        lines.push(''); // 空行分隔各主权限模块
      }
    });

    return lines.join('\n');
  };

  // -------------------------------------------------------------
  // 展开 / 收起 交互
  // -------------------------------------------------------------
  const handleExpandAll = () => {
    setExpandedIds(new Set(primaryPerms.map(p => p.id)));
    onShowToast?.('已全部展开当前客户所有主权限及其子权限', 'info');
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
    onShowToast?.('已全部收起当前客户所有主权限', 'info');
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // -------------------------------------------------------------
  // V8 端显示 开关切换
  // 联动规则：主权限关闭时，子权限不要同步关闭
  // -------------------------------------------------------------
  const toggleV8DisplayPrimary = (primaryId: string) => {
    const updated = primaryPerms.map(p => {
      if (p.id === primaryId) {
        const nextDisplay = p.v8Display === false ? true : false;
        return {
          ...p,
          v8Display: nextDisplay
        };
      }
      return p;
    });
    setPrimaryPerms(updated);
    onShowToast?.(`已更新客户「${customerOrgName}」主权限 V8 端显示状态`, 'info');
  };

  const toggleV8DisplaySub = (primaryId: string, subId: string) => {
    const updated = primaryPerms.map(p => {
      if (p.id === primaryId) {
        return {
          ...p,
          subPermissions: p.subPermissions.map(s => {
            if (s.id === subId) {
              const nextDisplay = s.v8Display === false ? true : false;
              return {
                ...s,
                v8Display: nextDisplay
              };
            }
            return s;
          })
        };
      }
      return p;
    });
    setPrimaryPerms(updated);
    onShowToast?.(`已更新客户「${customerOrgName}」子权限 V8 端显示状态`, 'info');
  };

  // -------------------------------------------------------------
  // 行内编辑与行内新增
  // -------------------------------------------------------------
  const startInlineEditPrimary = (p: PrimaryPermItem) => {
    if (editingRow?.isNew) {
      onShowToast?.('请先完成或取消当前新增的权限项', 'warning');
      return;
    }
    setEditingRow({
      id: p.id,
      type: 'primary',
      name: p.permName,
      code: p.permCode,
      desc: p.description,
      isNew: false
    });
  };

  const startInlineEditSub = (primaryId: string, s: SubPermItem) => {
    if (editingRow?.isNew) {
      onShowToast?.('请先完成或取消当前新增的权限项', 'warning');
      return;
    }
    setEditingRow({
      id: s.id,
      type: 'sub',
      primaryId,
      name: s.subPermName,
      code: s.subPermCode,
      desc: s.description,
      isNew: false
    });
  };

  // 1. 行内新增主权限：在数据集最后新增一行编辑状态的行，自动滚动定位
  const handleAddPrimaryInline = () => {
    if (editingRow?.isNew) {
      onShowToast?.('当前已有正在新增的行，请先添加或取消！', 'warning');
      return;
    }

    const tempId = `temp_primary_${Date.now()}`;
    const nextIndex = primaryPerms.length + 1;
    const defaultCode = `PERM:CUST_${customerOrgCode ? customerOrgCode.replace(/[^a-zA-Z0-9]/g, '_') : 'ORG'}_MOD_${String(nextIndex).padStart(2, '0')}`;

    const newPrimaryItem: PrimaryPermItem = {
      id: tempId,
      permName: '',
      permCode: defaultCode,
      description: '',
      v8Display: true,
      subPermissions: []
    };

    const newPerms = [...primaryPerms, newPrimaryItem];
    setPrimaryPerms(newPerms);
    setExpandedIds(prev => new Set([...prev, tempId]));

    setEditingRow({
      id: tempId,
      type: 'primary',
      name: '',
      code: defaultCode,
      desc: '',
      isNew: true
    });

    // 自动平滑滚动到表格底部新增行
    setTimeout(() => {
      const rowElem = document.getElementById(`row_primary_${tempId}`);
      if (rowElem) {
        rowElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // 2. 行内新增子权限：在当前主权限的子权限最后新增一行编辑状态的行，自动滚动定位
  const handleAddSubInline = (parent: PrimaryPermItem) => {
    if (editingRow?.isNew) {
      onShowToast?.('当前已有正在新增的行，请先添加或取消！', 'warning');
      return;
    }

    const tempSubId = `temp_sub_${Date.now()}`;
    const prefix = parent.permCode.toLowerCase().replace(/^perm:/, '').replace(/:/g, '_');
    const defaultCode = `${prefix || 'cust_perm'}:action_${parent.subPermissions.length + 1}`;

    const newSubItem: SubPermItem = {
      id: tempSubId,
      subPermName: '',
      subPermCode: defaultCode,
      description: '',
      v8Display: true
    };

    const updated = primaryPerms.map(p => {
      if (p.id === parent.id) {
        return {
          ...p,
          subPermissions: [...p.subPermissions, newSubItem]
        };
      }
      return p;
    });

    setPrimaryPerms(updated);
    setExpandedIds(prev => new Set([...prev, parent.id]));

    setEditingRow({
      id: tempSubId,
      type: 'sub',
      primaryId: parent.id,
      name: '',
      code: defaultCode,
      desc: '',
      isNew: true
    });

    // 自动平滑滚动到新增子权限行
    setTimeout(() => {
      const rowElem = document.getElementById(`row_sub_${tempSubId}`);
      if (rowElem) {
        rowElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCancelInlineEdit = () => {
    if (!editingRow) return;

    // 如果是正在新增的行，取消时将其从数据集中移除
    if (editingRow.isNew) {
      if (editingRow.type === 'primary') {
        setPrimaryPerms(primaryPerms.filter(p => p.id !== editingRow.id));
      } else if (editingRow.type === 'sub' && editingRow.primaryId) {
        setPrimaryPerms(
          primaryPerms.map(p => {
            if (p.id !== editingRow.primaryId) return p;
            return {
              ...p,
              subPermissions: p.subPermissions.filter(s => s.id !== editingRow.id)
            };
          })
        );
      }
      onShowToast?.('已取消新增', 'info');
    }

    setEditingRow(null);
  };

  const handleSaveInlineEdit = () => {
    if (!editingRow) return;

    if (!editingRow.name.trim()) {
      onShowToast?.('权限名称不能为空', 'warning');
      return;
    }
    if (!editingRow.code.trim()) {
      onShowToast?.('权限唯一 ID 不能为空', 'warning');
      return;
    }

    const isNewAction = editingRow.isNew;

    if (editingRow.type === 'primary') {
      const updated = primaryPerms.map(p => {
        if (p.id === editingRow.id) {
          return {
            ...p,
            id: isNewAction ? `cust_perm_${Date.now()}` : p.id,
            permName: editingRow.name.trim(),
            permCode: editingRow.code.trim(),
            description: editingRow.desc.trim() || '无详细描述'
          };
        }
        return p;
      });
      setPrimaryPerms(updated);
      onShowToast?.(isNewAction ? `为「${customerOrgName}」添加主权限成功！` : '主权限信息已保存！', 'success');
    } else if (editingRow.type === 'sub' && editingRow.primaryId) {
      const updated = primaryPerms.map(p => {
        if (p.id === editingRow.primaryId) {
          return {
            ...p,
            subPermissions: p.subPermissions.map(s => {
              if (s.id === editingRow.id) {
                return {
                  ...s,
                  id: isNewAction ? `cust_sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` : s.id,
                  subPermName: editingRow.name.trim(),
                  subPermCode: editingRow.code.trim(),
                  description: editingRow.desc.trim() || '无详细描述'
                };
              }
              return s;
            })
          };
        }
        return p;
      });
      setPrimaryPerms(updated);
      onShowToast?.(isNewAction ? `为「${customerOrgName}」添加子权限成功！` : '子权限信息已保存！', 'success');
    }

    setEditingRow(null);
  };

  // -------------------------------------------------------------
  // 主权限上下排序
  // -------------------------------------------------------------
  const handleMovePrimary = (index: number, direction: 'up' | 'down') => {
    if (editingRow?.isNew) {
      onShowToast?.('请先完成当前新增行操作', 'warning');
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= primaryPerms.length) return;

    const newArr = [...primaryPerms];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIndex, 0, moved);
    setPrimaryPerms(newArr);
    onShowToast?.(`主权限「${moved.permName}」已${direction === 'up' ? '上移' : '下移'}`, 'info');
  };

  // -------------------------------------------------------------
  // 子权限上下排序
  // -------------------------------------------------------------
  const handleMoveSub = (primaryId: string, subIndex: number, direction: 'up' | 'down') => {
    if (editingRow?.isNew) {
      onShowToast?.('请先完成当前新增行操作', 'warning');
      return;
    }
    const parent = primaryPerms.find(p => p.id === primaryId);
    if (!parent) return;

    const targetIndex = direction === 'up' ? subIndex - 1 : subIndex + 1;
    if (targetIndex < 0 || targetIndex >= parent.subPermissions.length) return;

    const newSubList = [...parent.subPermissions];
    const [moved] = newSubList.splice(subIndex, 1);
    newSubList.splice(targetIndex, 0, moved);

    const updated = primaryPerms.map(p => {
      if (p.id === primaryId) {
        return {
          ...p,
          subPermissions: newSubList
        };
      }
      return p;
    });

    setPrimaryPerms(updated);
    onShowToast?.(`子权限「${moved.subPermName}」已${direction === 'up' ? '上移' : '下移'}`, 'info');
  };

  // -------------------------------------------------------------
  // 模态弹窗：新建主权限 Modal
  // -------------------------------------------------------------
  const [isPrimaryModalOpen, setIsPrimaryModalOpen] = useState(false);
  const [primaryForm, setPrimaryForm] = useState({
    permName: '',
    permCode: '',
    description: ''
  });

  const handleOpenAddPrimaryModal = () => {
    const nextIndex = primaryPerms.length + 1;
    setPrimaryForm({
      permName: '',
      permCode: `PERM:CUST_${customerOrgCode ? customerOrgCode.replace(/[^a-zA-Z0-9]/g, '_') : 'ORG'}_MOD_${String(nextIndex).padStart(2, '0')}`,
      description: ''
    });
    setIsPrimaryModalOpen(true);
  };

  const handleSavePrimaryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryForm.permName.trim() || !primaryForm.permCode.trim()) {
      onShowToast?.('请填写完整的主权限名称与权限唯一 ID', 'warning');
      return;
    }

    const newPrimary: PrimaryPermItem = {
      id: `cust_perm_${Date.now()}`,
      permName: primaryForm.permName.trim(),
      permCode: primaryForm.permCode.trim(),
      description: primaryForm.description.trim() || '客户主权限业务功能模块说明',
      v8Display: true,
      subPermissions: []
    };

    setPrimaryPerms([...primaryPerms, newPrimary]);
    setExpandedIds(prev => new Set([...prev, newPrimary.id]));
    setIsPrimaryModalOpen(false);
    onShowToast?.(`成功为「${customerOrgName}」创建专属主权限！`, 'success');
  };

  // -------------------------------------------------------------
  // 模态弹窗：新建子权限 Modal
  // -------------------------------------------------------------
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [targetPrimaryForSub, setTargetPrimaryForSub] = useState<PrimaryPermItem | null>(null);
  const [subForm, setSubForm] = useState({
    subPermName: '',
    subPermCode: '',
    description: ''
  });

  const handleOpenAddSubModal = (parent: PrimaryPermItem) => {
    setTargetPrimaryForSub(parent);
    const prefix = parent.permCode.toLowerCase().replace(/^perm:/, '').replace(/:/g, '_');
    setSubForm({
      subPermName: '',
      subPermCode: `${prefix}:action_view`,
      description: ''
    });
    setIsSubModalOpen(true);
  };

  const handleSaveSubModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrimaryForSub || !subForm.subPermName.trim() || !subForm.subPermCode.trim()) {
      onShowToast?.('请填写完整的子权限名称与唯一 ID', 'warning');
      return;
    }

    const newSub: SubPermItem = {
      id: `cust_sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      subPermName: subForm.subPermName.trim(),
      subPermCode: subForm.subPermCode.trim(),
      description: subForm.description.trim() || '客户子权限细粒度功能说明',
      v8Display: true
    };

    const updated = primaryPerms.map(p => {
      if (p.id !== targetPrimaryForSub.id) return p;
      return {
        ...p,
        subPermissions: [...p.subPermissions, newSub]
      };
    });

    setPrimaryPerms(updated);
    setExpandedIds(prev => new Set([...prev, targetPrimaryForSub.id]));
    setIsSubModalOpen(false);
    onShowToast?.(`成功为「${customerOrgName}」添加子权限！`, 'success');
  };

  // -------------------------------------------------------------
  // 删除确认 Modal
  // -------------------------------------------------------------
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'primary' | 'sub';
    primaryId: string;
    subId?: string;
    title: string;
    content: string;
  } | null>(null);

  const handlePromptDeletePrimary = (p: PrimaryPermItem) => {
    setDeleteConfirm({
      type: 'primary',
      primaryId: p.id,
      title: `确认删除客户生效主权限「${p.permName}」？`,
      content: p.subPermissions.length > 0
        ? `该主权限下包含 ${p.subPermissions.length} 个嵌套子权限，删除主权限将同时删除其所有子权限，操作不可撤销。`
        : '删除后此主权限项将从当前客户生效权限字典中移除。'
    });
  };

  const handlePromptDeleteSub = (primaryId: string, sub: SubPermItem) => {
    setDeleteConfirm({
      type: 'sub',
      primaryId,
      subId: sub.id,
      title: `确认删除客户生效子权限「${sub.subPermName}」？`,
      content: `删除后，子权限标识「${sub.subPermCode}」将从当前客户权限字典中移除。`
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'primary') {
      setPrimaryPerms(primaryPerms.filter(p => p.id !== deleteConfirm.primaryId));
      onShowToast?.('专属主权限已删除', 'warning');
    } else if (deleteConfirm.type === 'sub' && deleteConfirm.subId) {
      setPrimaryPerms(
        primaryPerms.map(p => {
          if (p.id !== deleteConfirm.primaryId) return p;
          return {
            ...p,
            subPermissions: p.subPermissions.filter(s => s.id !== deleteConfirm.subId)
          };
        })
      );
      onShowToast?.('专属子权限已删除', 'warning');
    }
    setDeleteConfirm(null);
  };

  // -------------------------------------------------------------
  // 导出权限字典模板 (Excel / CSV)
  // -------------------------------------------------------------
  const handleExportTemplate = () => {
    try {
      const headers = ['主权限名称', '主权限ID', '主权限描述', '主权限V8端显示', '子权限名称', '子权限ID', '子权限描述', '子权限V8端显示'];
      const rows: string[][] = [];

      primaryPerms.forEach(p => {
        const pDisplayStr = p.v8Display !== false ? '显示' : '不显示';
        if (p.subPermissions.length === 0) {
          rows.push([
            `"${p.permName.replace(/"/g, '""')}"`,
            `"${p.permCode.replace(/"/g, '""')}"`,
            `"${p.description.replace(/"/g, '""')}"`,
            pDisplayStr,
            '',
            '',
            '',
            ''
          ]);
        } else {
          p.subPermissions.forEach(s => {
            const sDisplayStr = s.v8Display !== false ? '显示' : '不显示';
            rows.push([
              `"${p.permName.replace(/"/g, '""')}"`,
              `"${p.permCode.replace(/"/g, '""')}"`,
              `"${p.description.replace(/"/g, '""')}"`,
              pDisplayStr,
              `"${s.subPermName.replace(/"/g, '""')}"`,
              `"${s.subPermCode.replace(/"/g, '""')}"`,
              `"${s.description.replace(/"/g, '""')}"`,
              sDisplayStr
            ]);
          });
        }
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `客户权限字典_${customerOrgCode || 'ORG'}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onShowToast?.(`已成功导出「${customerOrgName}」权限字典表格！`, 'success');
    } catch {
      onShowToast?.('导出权限字典模板失败，请重试', 'warning');
    }
  };

  // -------------------------------------------------------------
  // 导入权限字典管理
  // -------------------------------------------------------------
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) {
          onShowToast?.('文件内容为空', 'warning');
          return;
        }

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          onShowToast?.('未检测到有效的权限数据行', 'warning');
          return;
        }

        // 解析 CSV 简易拆分
        const parsedMap = new Map<string, PrimaryPermItem>();

        // 跳过表头
        for (let i = 1; i < lines.length; i++) {
          const rawCols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          if (rawCols.length < 2) continue;

          const pName = rawCols[0] || `权限模块_${i}`;
          const pCode = rawCols[1] || `PERM:CUST_MOD_${i}`;
          const pDesc = rawCols[2] || '导入客户主权限';
          const pDisplay = rawCols[3] === '不显示' ? false : true;

          const sName = rawCols[4];
          const sCode = rawCols[5];
          const sDesc = rawCols[6] || '';
          const sDisplay = rawCols[7] === '不显示' ? false : true;

          if (!parsedMap.has(pCode)) {
            parsedMap.set(pCode, {
              id: `cust_perm_${Date.now()}_${i}`,
              permName: pName,
              permCode: pCode,
              description: pDesc,
              v8Display: pDisplay,
              subPermissions: []
            });
          }

          if (sName && sCode) {
            const pItem = parsedMap.get(pCode)!;
            pItem.subPermissions.push({
              id: `cust_sub_${Date.now()}_${i}_${pItem.subPermissions.length + 1}`,
              subPermName: sName,
              subPermCode: sCode,
              description: sDesc || '导入子权限',
              v8Display: sDisplay
            });
          }
        }

        const newPrimaryPerms = Array.from(parsedMap.values());
        if (newPrimaryPerms.length > 0) {
          setPrimaryPerms(newPrimaryPerms);
          setExpandedIds(new Set(newPrimaryPerms.map(p => p.id)));
          const totalSub = newPrimaryPerms.reduce((acc, p) => acc + p.subPermissions.length, 0);
          onShowToast?.(`成功为「${customerOrgName}」导入 ${newPrimaryPerms.length} 个主权限、${totalSub} 个子权限！`, 'success');
        } else {
          onShowToast?.('未能识别出符合格式的权限记录', 'warning');
        }
      } catch {
        onShowToast?.('导入失败，请检查文件格式是否正确', 'warning');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsText(file, 'utf-8');
  };

  // -------------------------------------------------------------
  // 静态化发布
  // -------------------------------------------------------------
  const handleStaticPublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      onShowToast?.(`✓ 客户「${customerOrgName}」权限字典已成功静态化发布！版本已同步至 V8 客户端与网关。`, 'success');
    }, 900);
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 sm:p-6 flex flex-col gap-5 flex-1 h-full"
      id="permission_dict_container"
    >
      {/* 顶部标题区 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                该客户生效的权限字典清单
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>{customerOrgName}</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            维护当前客户机构（{customerOrgName}）生效的主权限及子权限层级关系，支持在表格中直接编辑、独立配置 V8 端显示开关、模板导入导出与静态化发布。此处的更改仅对该客户生效，与默认权限字典模板完全独立。
          </p>
        </div>
      </div>

      {/* 顶部操作工具栏：左侧【新建主权限】/展开收起；右侧【查看文本】/【导出模板】/【导入模板】/【静态化发布】 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
        {/* 左侧操作区 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 新建主权限 (行内添加) */}
          <button
            type="button"
            onClick={handleAddPrimaryInline}
            disabled={editingRow?.isNew}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            id="btn_add_primary_perm"
            title={editingRow?.isNew ? '请先完成或取消当前新增的权限项' : '在权限表格末尾新增主权限行'}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新建主权限</span>
          </button>

          {/* 全部展开 / 全部收起 辅助工具 */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-md transition-all cursor-pointer flex items-center gap-1"
              id="btn_expand_all_perms"
              title="全部展开所有主权限及其子权限"
            >
              <FolderTree className="w-3.5 h-3.5 text-blue-600" />
              <span>全部展开</span>
            </button>
            <span className="w-px h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-md transition-all cursor-pointer flex items-center gap-1"
              id="btn_collapse_all_perms"
              title="全部收起所有主权限"
            >
              <ListCollapse className="w-3.5 h-3.5 text-slate-500" />
              <span>全部收起</span>
            </button>
          </div>
        </div>

        {/* 右侧操作区：查看文本, 导出模板, 导入模板, 静态化发布 */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
          {/* 查看文本 */}
          <button
            type="button"
            onClick={() => setIsTextViewModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            id="btn_view_perm_text"
            title="以纯文本层级格式查看所有权限字典清单"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>查看文本</span>
          </button>

          {/* 导出模板 */}
          <button
            type="button"
            onClick={handleExportTemplate}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            id="btn_export_perm_dict_template"
            title="导出 Excel/CSV 权限字典表格"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>导出模板</span>
          </button>

          {/* 导入模板 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".csv,.txt"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            id="btn_import_perm_dict"
            title="导入本地 CSV 格式权限字典"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>导入模板</span>
          </button>

          {/* 静态化发布 */}
          <button
            type="button"
            onClick={handleStaticPublish}
            disabled={isPublishing}
            className="px-3.5 py-1.5 bg-[#1e376b] hover:bg-blue-900 active:bg-blue-950 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            id="btn_static_publish"
            title="静态化发布当前客户最新权限字典"
          >
            {isPublishing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>正在发布...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>静态化发布</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 权限字典表格结构 */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold select-none text-xs">
                <th className="py-3 px-4 min-w-[360px]">权限信息（名称 / 唯一 ID / 权限说明）</th>
                <th className="py-3 px-4 w-36 text-center">V8 端显示</th>
                <th className="py-3 px-4 w-44 text-center">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {primaryPerms.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-14 text-center text-slate-400">
                    <KeyRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold">暂无客户专属主权限记录</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">请点击上方“新建主权限”或“导入模板”创建</p>
                  </td>
                </tr>
              ) : (
                primaryPerms.map((primary, pIndex) => {
                  const isExpanded = expandedIds.has(primary.id);
                  const isEditingThisPrimary = editingRow?.type === 'primary' && editingRow?.id === primary.id;
                  const isFirst = pIndex === 0;
                  const isLast = pIndex === primaryPerms.length - 1;
                  const v8DisplayOn = primary.v8Display !== false;

                  const primaryBgStyle = isEditingThisPrimary 
                    ? { backgroundColor: '#FFFFFF' }
                    : { backgroundColor: '#F9FAFB' };

                  const subBgStyle = (isEditingSub: boolean) => isEditingSub
                    ? { backgroundColor: '#F9FAFB' }
                    : { backgroundColor: '#FFFFFF' };

                  const isNewPrimaryRow = isEditingThisPrimary && editingRow?.isNew;

                  return (
                    <React.Fragment key={primary.id}>
                      {/* 主权限行 */}
                      <tr 
                        id={`row_primary_${primary.id}`}
                        style={primaryBgStyle}
                        className={`border-t border-slate-300/80 transition-colors ${isNewPrimaryRow ? 'ring-2 ring-blue-500/50 ring-inset' : 'hover:brightness-[0.98]'}`}
                      >
                        {/* 左侧信息列 */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex flex-col gap-1.5 text-left">
                            {/* 编辑状态下的三行表单展示 */}
                            {isEditingThisPrimary ? (
                              <div className="flex flex-col gap-2.5 w-full max-w-xl py-1">
                                {isNewPrimaryRow && (
                                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50/90 border border-blue-200 px-2 py-0.5 rounded w-fit mb-0.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>新增客户主权限模块（未保存）</span>
                                  </div>
                                )}
                                {/* 第 1 行：权限名称 */}
                                <div className="flex items-center gap-2">
                                  <label className="w-18 shrink-0 text-right text-xs font-bold text-slate-700 select-none">
                                    权限名称:
                                  </label>
                                  <div className="flex-1">
                                    <input
                                      type="text"
                                      value={editingRow.name}
                                      onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value })}
                                      className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-left shadow-2xs"
                                      placeholder="请输入主权限名称，如：事件感知与全景态势监控"
                                      autoFocus
                                    />
                                  </div>
                                </div>

                                {/* 第 2 行：权限唯一 ID */}
                                <div className="flex items-center gap-2">
                                  <label className="w-18 shrink-0 text-right text-xs font-bold text-slate-700 select-none">
                                    唯一 ID:
                                  </label>
                                  <div className="flex-1">
                                    <input
                                      type="text"
                                      value={editingRow.code}
                                      onChange={(e) => setEditingRow({ ...editingRow, code: e.target.value })}
                                      className="w-full px-3 py-1.5 text-xs font-mono font-bold text-blue-900 bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-left shadow-2xs"
                                      placeholder="例如：PERM:SITUATION:MONITOR"
                                    />
                                  </div>
                                </div>

                                {/* 第 3 行：权限说明 */}
                                <div className="flex items-start gap-2">
                                  <label className="w-18 shrink-0 text-right text-xs font-bold text-slate-700 pt-1.5 select-none">
                                    权限说明:
                                  </label>
                                  <div className="flex-1">
                                    <textarea
                                      rows={3}
                                      value={editingRow.desc}
                                      onChange={(e) => setEditingRow({ ...editingRow, desc: e.target.value })}
                                      className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-none text-left leading-relaxed shadow-2xs"
                                      placeholder="请输入主权限涉及的功能范畴与调度职责说明..."
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* 第 1 行：主权限名称（左） + 权限唯一 ID（居右对齐） */}
                                <div className="flex items-center justify-between gap-3 w-full">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleExpand(primary.id)}
                                      className="p-1 -ml-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer shrink-0"
                                      title={isExpanded ? '收起子权限' : '展开子权限'}
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                      )}
                                    </button>
                                    <span className="font-mono text-xs font-bold text-slate-400 shrink-0">{pIndex + 1}.</span>
                                    <span className="font-black text-slate-900 text-xs tracking-tight">{primary.permName}</span>
                                  </div>

                                  {/* 权限唯一 ID 居右对齐 */}
                                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                    <code className="font-mono text-xs font-bold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/80 select-all">
                                      {primary.permCode}
                                    </code>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(primary.permCode)}
                                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                      title="复制唯一标识"
                                    >
                                      {copiedCode === primary.permCode ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* 说明：位于主权限名称下方，直接铺平居左对齐 */}
                                <div className="pl-6 text-xs text-slate-500 leading-relaxed text-left">
                                  {primary.description || <span className="text-slate-400 italic">暂无描述</span>}
                                </div>
                              </>
                            )}
                          </div>
                        </td>

                        {/* 第二列：V8 端显示 */}
                        <td className="py-3 px-4 text-center align-middle border-l border-slate-300/80">
                          <button
                            type="button"
                            onClick={() => toggleV8DisplayPrimary(primary.id)}
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs select-none min-w-[76px] h-7 ${
                              v8DisplayOn
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                            }`}
                            title={v8DisplayOn ? '当前处于【显示中】，点击切换为【不显示】' : '当前处于【不显示】，点击切换为【显示中】'}
                          >
                            <span>{v8DisplayOn ? '显示中' : '不显示'}</span>
                          </button>
                        </td>

                        {/* 第三列：操作 */}
                        <td className="py-3 px-4 text-center align-middle border-l border-slate-300/80">
                          {isEditingThisPrimary ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={handleSaveInlineEdit}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                                title={isNewPrimaryRow ? '添加新主权限' : '保存主权限修改'}
                              >
                                <Check className="w-4 h-4 stroke-[2.5]" />
                                <span>{isNewPrimaryRow ? '添加' : '保存'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelInlineEdit}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                                title="取消操作"
                              >
                                <X className="w-4 h-4 stroke-[2.5]" />
                                <span>取消</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              {/* 编辑按钮 */}
                              <button
                                type="button"
                                onClick={() => startInlineEditPrimary(primary)}
                                disabled={editingRow?.isNew}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                                title="编辑主权限信息"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* 行内添加子权限 */}
                              <button
                                type="button"
                                onClick={() => handleAddSubInline(primary)}
                                disabled={editingRow?.isNew}
                                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                                title="在当前主权限下新增子权限"
                              >
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                              </button>

                              {/* 排序上移 */}
                              <button
                                type="button"
                                onClick={() => handleMovePrimary(pIndex, 'up')}
                                disabled={isFirst || Boolean(editingRow?.isNew)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                                title="上移主权限"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>

                              {/* 排序下移 */}
                              <button
                                type="button"
                                onClick={() => handleMovePrimary(pIndex, 'down')}
                                disabled={isLast || Boolean(editingRow?.isNew)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                                title="下移主权限"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>

                              {/* 删除 */}
                              <button
                                type="button"
                                onClick={() => handlePromptDeletePrimary(primary)}
                                disabled={editingRow?.isNew}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
                                title="删除主权限"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* 子权限展开列表 */}
                      {isExpanded && primary.subPermissions.map((sub, sIndex) => {
                        const isEditingThisSub = editingRow?.type === 'sub' && editingRow?.id === sub.id;
                        const isSubFirst = sIndex === 0;
                        const isSubLast = sIndex === primary.subPermissions.length - 1;
                        const subV8DisplayOn = sub.v8Display !== false;
                        const isNewSubRow = isEditingThisSub && editingRow?.isNew;

                        return (
                          <tr
                            key={sub.id}
                            id={`row_sub_${sub.id}`}
                            style={subBgStyle(isEditingThisSub)}
                            className={`border-t border-slate-200/80 transition-colors ${isNewSubRow ? 'ring-2 ring-blue-500/50 ring-inset' : 'hover:brightness-[0.98]'}`}
                          >
                            {/* 左侧子权限信息列 */}
                            <td className="py-2.5 px-4 pl-12 align-top">
                              <div className="flex flex-col gap-1 text-left">
                                {isEditingThisSub ? (
                                  <div className="flex flex-col gap-2.5 w-full max-w-xl py-1">
                                    {isNewSubRow && (
                                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200 px-2 py-0.5 rounded w-fit mb-0.5">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>新增客户子权限（未保存）</span>
                                      </div>
                                    )}
                                    {/* 第 1 行：子权限名称 */}
                                    <div className="flex items-center gap-2">
                                      <label className="w-18 shrink-0 text-right text-xs font-bold text-slate-700 select-none">
                                        权限名称:
                                      </label>
                                      <div className="flex-1">
                                        <input
                                          type="text"
                                          value={editingRow.name}
                                          onChange={(e) => setEditingRow({ ...editingRow, name: e.target.value })}
                                          className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-left shadow-2xs"
                                          placeholder="子权限名称，如：态势大屏实时数据访问与刷新"
                                          autoFocus
                                        />
                                      </div>
                                    </div>

                                    {/* 第 2 行：子权限唯一 ID */}
                                    <div className="flex items-center gap-2">
                                      <label className="w-18 shrink-0 text-right text-xs font-bold text-slate-700 select-none">
                                        唯一 ID:
                                      </label>
                                      <div className="flex-1">
                                        <input
                                          type="text"
                                          value={editingRow.code}
                                          onChange={(e) => setEditingRow({ ...editingRow, code: e.target.value })}
                                          className="w-full px-3 py-1.5 text-xs font-mono font-bold text-blue-900 bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-left shadow-2xs"
                                          placeholder="例如：situation:screen:view"
                                        />
                                      </div>
                                    </div>

                                    {/* 第 3 行：子权限说明 */}
                                    <div className="flex items-start gap-2">
                                      <label className="w-18 shrink-0 text-right text-xs font-bold text-slate-700 pt-1.5 select-none">
                                        权限说明:
                                      </label>
                                      <div className="flex-1">
                                        <textarea
                                          rows={2}
                                          value={editingRow.desc}
                                          onChange={(e) => setEditingRow({ ...editingRow, desc: e.target.value })}
                                          className="w-full px-3 py-1.5 text-xs text-slate-700 bg-white border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400/30 resize-none text-left leading-relaxed shadow-2xs"
                                          placeholder="请输入该细粒度子权限的操作含义与权限范围..."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {/* 第 1 行：子权限名称（左） + 子权限唯一 ID（居右对齐） */}
                                    <div className="flex items-center justify-between gap-3 w-full">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-slate-300 font-mono font-bold select-none text-xs">└─</span>
                                        <span className="font-mono text-[11px] text-slate-400 font-bold shrink-0">{pIndex + 1}.{sIndex + 1}</span>
                                        <span className="font-bold text-slate-800 text-xs">{sub.subPermName}</span>
                                      </div>

                                      {/* 子权限唯一 ID 居右对齐 */}
                                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                        <code className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/90 select-all">
                                          {sub.subPermCode}
                                        </code>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(sub.subPermCode)}
                                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                                          title="复制标识"
                                        >
                                          {copiedCode === sub.subPermCode ? (
                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* 说明 */}
                                    <div className="pl-6 text-[11px] text-slate-500 leading-relaxed text-left">
                                      {sub.description || <span className="text-slate-400 italic">暂无说明</span>}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* 子权限 V8 端显示 */}
                            <td className="py-2.5 px-4 text-center align-middle border-l border-slate-200/80">
                              <button
                                type="button"
                                onClick={() => toggleV8DisplaySub(primary.id, sub.id)}
                                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs select-none min-w-[76px] h-7 ${
                                  subV8DisplayOn
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                                }`}
                                title={subV8DisplayOn ? '当前处于【显示中】，点击切换为【不显示】' : '当前处于【不显示】，点击切换为【显示中】'}
                              >
                                <span>{subV8DisplayOn ? '显示中' : '不显示'}</span>
                              </button>
                            </td>

                            {/* 子权限 操作栏 */}
                            <td className="py-2.5 px-4 text-center align-middle border-l border-slate-200/80">
                              {isEditingThisSub ? (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={handleSaveInlineEdit}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                                    title={isNewSubRow ? '添加子权限' : '保存子权限'}
                                  >
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                    <span>{isNewSubRow ? '添加' : '保存'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelInlineEdit}
                                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-700 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                                    title="取消修改"
                                  >
                                    <X className="w-4 h-4 stroke-[2.5]" />
                                    <span>取消</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* 编辑按钮 */}
                                  <button
                                    type="button"
                                    onClick={() => startInlineEditSub(primary.id, sub)}
                                    disabled={editingRow?.isNew}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed rounded cursor-pointer transition-colors"
                                    title="编辑子权限"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* 上移 */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSub(primary.id, sIndex, 'up')}
                                    disabled={isSubFirst || Boolean(editingRow?.isNew)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed rounded cursor-pointer transition-colors"
                                    title="上移子权限"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>

                                  {/* 下移 */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSub(primary.id, sIndex, 'down')}
                                    disabled={isSubLast || Boolean(editingRow?.isNew)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed rounded cursor-pointer transition-colors"
                                    title="下移子权限"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>

                                  {/* 删除 */}
                                  <button
                                    type="button"
                                    onClick={() => handlePromptDeleteSub(primary.id, sub)}
                                    disabled={editingRow?.isNew}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed rounded cursor-pointer transition-colors"
                                    title="删除子权限"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {/* 如果主权限已展开但暂无子权限 */}
                      {isExpanded && primary.subPermissions.length === 0 && (
                        <tr className="bg-slate-50/50 border-b border-slate-200/60">
                          <td colSpan={3} className="py-3 px-4 pl-10 text-xs text-slate-400 italic text-left">
                            该主权限下暂无子权限记录，可点击操作栏「+」添加子权限
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------
          新建主权限 Modal
      ------------------------------------------------------------- */}
      {isPrimaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-slate-900">为「{customerOrgName}」新建主权限</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrimaryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePrimaryModal} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  主权限名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={primaryForm.permName}
                  onChange={(e) => setPrimaryForm({ ...primaryForm, permName: e.target.value })}
                  placeholder="例如：事件感知与全景态势监控"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  主权限唯一 ID (Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={primaryForm.permCode}
                  onChange={(e) => setPrimaryForm({ ...primaryForm, permCode: e.target.value })}
                  placeholder="例如：PERM:SITUATION:MONITOR"
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 text-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  主权限功能说明
                </label>
                <textarea
                  rows={3}
                  value={primaryForm.description}
                  onChange={(e) => setPrimaryForm({ ...primaryForm, description: e.target.value })}
                  placeholder="请输入该主权限涉及的功能范畴与调度职责说明..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrimaryModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  确认创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          新建子权限 Modal
      ------------------------------------------------------------- */}
      {isSubModalOpen && targetPrimaryForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  为「{customerOrgName}」添加子权限
                </h3>
                <p className="text-[11px] text-blue-700 font-bold mt-0.5">
                  归属主权限：{targetPrimaryForSub.permName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubModal} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  子权限名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subForm.subPermName}
                  onChange={(e) => setSubForm({ ...subForm, subPermName: e.target.value })}
                  placeholder="例如：态势大屏实时数据访问与刷新"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  子权限唯一 ID (Code) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subForm.subPermCode}
                  onChange={(e) => setSubForm({ ...subForm, subPermCode: e.target.value })}
                  placeholder="例如：situation:screen:view"
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 text-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  子权限功能描述
                </label>
                <textarea
                  rows={3}
                  value={subForm.description}
                  onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                  placeholder="请输入该细粒度子权限的操作含义与权限范围..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          查看文本 Modal (多行文本框层级展示)
      ------------------------------------------------------------- */}
      {isTextViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal 头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">「{customerOrgName}」生效权限字典纯文本视图</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    按主权限与子权限层级格式输出，方便快速核对、批量复制与文档归档
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTextViewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal 内容区：多行文本框 */}
            <div className="p-6 overflow-y-auto flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">层级文本内容：</span>
                <span className="text-[11px]">共 {primaryPerms.length} 个主权限，{primaryPerms.reduce((acc, p) => acc + p.subPermissions.length, 0)} 个子权限</span>
              </div>
              <textarea
                readOnly
                rows={16}
                value={generatePermissionPlainText()}
                className="w-full p-4 font-mono text-xs leading-relaxed text-slate-800 bg-slate-50/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y select-all"
                placeholder="权限字典文本内容..."
              />
            </div>

            {/* Modal 底部按钮 */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                提示：可在多行文本框中直接全选复制，或点击右侧一键复制
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleCopy(generatePermissionPlainText());
                    onShowToast?.('已成功复制全部权限文本到剪贴板！', 'success');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === generatePermissionPlainText() ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>一键复制全部文本</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsTextViewModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          删除确认 Modal
      ------------------------------------------------------------- */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col p-6 gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900">{deleteConfirm.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{deleteConfirm.content}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
