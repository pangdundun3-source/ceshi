/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UnifiedAppAccountManageView } from './UnifiedAppAccountManageView';
import { AppAccountUserRecord } from '../data/mockAppAccounts';
import { IntegratedApp } from '../types';

export interface MTOpenUserListViewProps {
  currentApp?: IntegratedApp;
  appsList?: IntegratedApp[];
  sharedAppAccounts?: AppAccountUserRecord[];
  onSharedAppAccountsChange?: (accounts: AppAccountUserRecord[]) => void;
}

/**
 * 模拟指令流转MT -> 已开通用户账号列表
 * 1. 页面顶部：
 *    - 面包屑导航：MT 指令流转中心 / 客户机构管理 / 已开通用户账号列表
 *    - 页面标题：已开通用户账号列表
 *    - 介绍描述：本系统已开通的账号信息
 *    - 页面顶部右侧：模拟其他 MT 系统直接调用的提示框（橙色胶囊: 所属应用: 模拟其他MT系统直接调用）
 * 2. 页面主区域（下方内容）：
 *    - 直接引用二级菜单“应用账号管理”页面主区域的所有内容，完全共用数据与交互并保持双向联动。
 */
export const MTOpenUserListView: React.FC<MTOpenUserListViewProps> = ({
  currentApp,
  appsList,
  sharedAppAccounts,
  onSharedAppAccountsChange
}) => {
  return (
    <UnifiedAppAccountManageView
      currentApp={currentApp}
      appsList={appsList}
      sharedAppAccounts={sharedAppAccounts}
      onSharedAppAccountsChange={onSharedAppAccountsChange}
      breadcrumbs={['MT 指令流转中心', '客户机构管理', '已开通用户账号列表']}
      pageTitle="已开通用户账号列表"
      pageSubtitle="本系统已开通的账号信息"
      pageSubtitlePosition="below"
      rightPromptBadge="模拟其他MT系统直接调用"
    />
  );
};
