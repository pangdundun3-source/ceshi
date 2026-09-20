/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 16 种核心字段类型定义
export type DictItemType =
  | 'string'          // 单行文本
  | 'textarea'        // 多行文本
  | 'richText'        // 富文本
  | 'radio'           // 单选
  | 'select'          // 下拉单选
  | 'checkbox'        // 多选
  | 'select-multiple' // 下拉多选
  | 'int'             // 整数
  | 'decimal'         // 小数/浮点数
  | 'boolean'         // 布尔开关
  | 'image'           // 图片地址
  | 'file'            // 文件地址
  | 'url'             // 网址
  | 'email'           // 邮箱
  | 'date'            // 日期 yyyy-MM-dd
  | 'datetime';       // 日期时间 yyyy-MM-dd HH:mm:ss

// 枚举选项接口（单选/多选/下拉使用）
export interface DictEnumOption {
  label: string;
  value: string | number | boolean;
  color?: string;
  badge?: string;
}

// 校验规则接口
export interface DictValidateRule {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  regexMsg?: string;
  fileAccept?: string;
  maxFileSizeMb?: number;
}

// 表 1：dict_category 字典分类（树形层级目录，对应注册表文件夹）
export interface DictCategoryNode {
  id: string;
  parentId: string; // '0' 或 'root' 表示根节点
  categoryCode: string; // 分类编码，唯一英文小写点分标识，如 system.ui, video.ai.recognize
  categoryName: string; // 分类名称，如 界面全局配置、视频AI识别标签配置
  sort: number;
  status: 'active' | 'disabled';
  remark: string;
  isSystem: boolean; // 是否系统内置
  icon?: string;
  children?: DictCategoryNode[];
}

// 表 2：dict_item 字典配置项（对应注册表键值）
export interface DictConfigItem {
  id: string;
  categoryId: string; // 归属分类 ID
  itemKey: string; // 配置项 KEY（程序读取，英文小写+下划线）
  itemLabel: string; // 前端展示中文名称
  itemType: DictItemType; // 字段类型
  itemValue: any; // 当前配置值
  defaultValue: any; // 系统默认值
  enumOptions?: DictEnumOption[]; // 枚举选项（JSON）
  validateRule?: DictValidateRule; // 校验规则（JSON）
  sort: number;
  isRequired: boolean; // 是否必填
  isSystem: boolean; // 是否系统内置（系统内置仅允许修改值）
  preventDelete?: boolean; // 是否禁止删除（勾选后该配置项不可删除）
  remark: string; // 业务说明与用途提示
  updatedAt: string;
  updatedBy: string;
}

// 字典变更日志 / 版本历史
export interface DictAuditLog {
  id: string;
  itemId: string;
  itemKey: string;
  itemLabel: string;
  operator: string;
  timestamp: string;
  action: 'create' | 'update_value' | 'edit_definition' | 'delete' | 'reset';
  oldValue?: any;
  newValue?: any;
  detail: string;
}

// 字典全量版本快照与回滚记录
export interface DictVersionRecord {
  id: string;
  version: string;             // 版本号，如 "V1.3.2", "V1.3.1"
  saveDate: string;            // 保存日期与时间，如 "2026-09-10 09:15:30"
  effectiveDate: string;       // 使用日期 / 生效日期，如 "2026-09-10"
  operator: string;            // 当时执行保存的操作人，如 "admin_super (超级管理员)"
  summary: string;             // 变更说明 / 摘要
  categoriesCount: number;     // 分类目录节点数
  itemsCount: number;          // 配置项总数
  snapshot: {                  // 完整的应用数据字典配置快照 (包含左侧菜单分类树和右侧配置项)
    appCode: string;
    appName: string;
    categories: DictCategoryNode[];
    items: DictConfigItem[];
    exportedAt: string;
    version: string;
  };
}

