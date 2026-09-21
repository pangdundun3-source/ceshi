/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppAccountUserRecord } from '../data/mockAppAccounts';
import { IntegratedApp } from '../types';
import { UserAppIdentitiesTableView } from './UserAppIdentitiesTableView';
import { INITIAL_APP_ACCOUNTS } from '../data/mockAppAccounts';
import { INITIAL_APPS } from './AppManagement';

export interface UnifiedUserAppIdentityDetailViewProps {
  currentApp?: IntegratedApp;
  appsList?: IntegratedApp[];
  sharedAppAccounts?: AppAccountUserRecord[];
  onSharedAppAccountsChange?: (accounts: AppAccountUserRecord[]) => void;
  breadcrumbs?: string[];
  pageTitle?: string;
  pageSubtitle?: string;
}

export const UnifiedUserAppIdentityDetailView: React.FC<UnifiedUserAppIdentityDetailViewProps> = ({
  currentApp,
  appsList = INITIAL_APPS,
  sharedAppAccounts,
  onSharedAppAccountsChange,
  breadcrumbs = ['统一组件库管理', '用户应用身份详情']
}) => {
  const accounts = sharedAppAccounts || INITIAL_APP_ACCOUNTS;

  return (
    <div className="h-full w-full overflow-y-auto" id="unified_user_app_identity_detail_view">
      <UserAppIdentitiesTableView
        allUsers={accounts}
        onUpdateUsers={onSharedAppAccountsChange}
        currentApp={currentApp}
        isStandalonePage={true}
        breadcrumbs={breadcrumbs}
      />
    </div>
  );
};
