/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerOrgItem, INITIAL_CUSTOMER_ORGS } from '../data/mockCustomerOrgs';
import { CustomerPermissionDictManage } from './CustomerPermissionDictManage';
import { KeyRound, Building2 } from 'lucide-react';

export const UnifiedOrgPermissionDictView: React.FC = () => {
  const [customerOrgs] = useState<CustomerOrgItem[]>(INITIAL_CUSTOMER_ORGS);
  const [selectedCustId, setSelectedCustId] = useState<string>(INITIAL_CUSTOMER_ORGS[0].id);

  const currentCustomer =
    customerOrgs.find((c) => c.id === selectedCustId) || customerOrgs[0];

  return (
    <div
      className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F4F7FB] text-slate-800"
      id="unified_org_permission_dict_page"
    >
      <div className="w-full flex flex-col gap-5">
        {/* 顶部面包屑与标题栏 */}
        <div
          className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0"
          id="unified_org_perm_header_bar"
        >
          <div className="flex flex-col">
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-400 font-normal">统一组件库管理</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">机构权限字典</span>
            </nav>

            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                机构权限字典
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#1e376b] text-white text-xs font-bold shadow-2xs select-none">
                统一组件
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">切换机构:</span>
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

        {/* 机构权限字典管理视图 */}
        <div className="px-5 pb-5">
          <CustomerPermissionDictManage
            customerOrgName={currentCustomer.orgShortName || currentCustomer.orgName}
            customerOrgCode={currentCustomer.orgCode}
            appCode="diting_warning_sys"
            appName="谛听预警系统"
          />
        </div>
      </div>
    </div>
  );
};
