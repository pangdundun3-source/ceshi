/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UnifiedAppCustomerOrgsView } from './UnifiedAppCustomerOrgsView';
import { CustomerOrgItem } from '../data/mockCustomerOrgs';
import { IntegratedApp } from '../types';

export interface MTCustomerOrgListViewProps {
  currentApp?: IntegratedApp;
  appsList?: IntegratedApp[];
  sharedCustomerOrgs?: CustomerOrgItem[];
  onSharedCustomerOrgsChange?: (orgs: CustomerOrgItem[]) => void;
}

/**
 * 模拟指令流转MT -> 客户机构列表
 * 独立顶部：
 * - 面包屑导航：MT 指令流转中心 / 客户机构管理 / 客户机构列表
 * - 页面标题：客户机构列表
 * - 页面描述：所有已开通指令流转中心应用的客户机构的清单
 * 共用主内容：
 * - 直接引用“各应用统一调用组件”下的“客户机构”页面代码，完全共用底层数据、交互与组件实现。
 */
export const MTCustomerOrgListView: React.FC<MTCustomerOrgListViewProps> = ({
  currentApp,
  appsList,
  sharedCustomerOrgs,
  onSharedCustomerOrgsChange
}) => {
  return (
    <UnifiedAppCustomerOrgsView
      currentApp={currentApp}
      appsList={appsList}
      sharedCustomerOrgs={sharedCustomerOrgs}
      onSharedCustomerOrgsChange={onSharedCustomerOrgsChange}
      breadcrumbs={['MT 指令流转中心', '客户机构管理', '客户机构列表']}
      pageTitle="客户机构列表"
      pageSubtitle="所有已开通指令流转中心应用的客户机构的清单"
      pageSubtitlePosition="below"
      rightPromptBadge="模拟其他MT系统直接调用"
    />
  );
};
