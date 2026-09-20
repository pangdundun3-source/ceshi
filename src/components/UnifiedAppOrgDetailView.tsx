/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerOrgItem, INITIAL_CUSTOMER_ORGS } from '../data/mockCustomerOrgs';
import { CustomerAppConfig } from './CustomerAppConfig';
import { AppInnerCustomerList } from './AppInnerCustomerList';
import { Building2, Sparkles } from 'lucide-react';

interface UnifiedAppOrgDetailViewProps {
  initialCustomerId?: string;
}

export const UnifiedAppOrgDetailView: React.FC<UnifiedAppOrgDetailViewProps> = ({
  initialCustomerId
}) => {
  const [customerOrgs, setCustomerOrgs] = useState<CustomerOrgItem[]>(INITIAL_CUSTOMER_ORGS);
  const [selectedCustId, setSelectedCustId] = useState<string>(
    initialCustomerId || INITIAL_CUSTOMER_ORGS[0].id
  );

  const currentCustomer =
    customerOrgs.find((c) => c.id === selectedCustId) || customerOrgs[0];

  const handleUpdateCustomer = (updated: CustomerOrgItem) => {
    setCustomerOrgs((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_app_org_detail_page"
    >
      <div className="w-full flex flex-col">
        {/* 顶部面包屑与机构切换栏 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_org_detail_header_bar"
        >
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">各应用统一调用组件</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">机构详情管理</span>
            </nav>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                机构详情与全局配置中心
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">当前选择机构:</span>
              <select
                value={selectedCustId}
                onChange={(e) => setSelectedCustId(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-bold rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {customerOrgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.orgShortName || org.orgName} ({org.orgCode})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 详情配置容器 */}
        <div className="p-4 sm:p-5">
          <CustomerAppConfig
            customer={currentCustomer}
            appName="谛听预警系统"
            appCode="diting_warning_sys"
            appShortName="谛听"
            roleType="with_role"
            onBack={() => {}}
            onUpdateCustomer={handleUpdateCustomer}
          />
        </div>
      </div>
    </div>
  );
};
