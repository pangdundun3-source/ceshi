/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Eye,
  Filter,
  RotateCcw,
  Briefcase
} from 'lucide-react';

export interface CustomerRecord {
  id: string;
  custCode: string;
  custName: string;
  creditCode: string;
  industry: string;
  custLevel: string;
  legalPerson: string;
  contactPerson: string;
  contactPhone: string;
  region: string;
  annualBudget: string;
  status: 'active' | 'potential' | 'churned';
  createdAt: string;
}

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-01',
    custCode: 'CUST-2026-001',
    custName: '上海电气智能装备制造集团有限公司',
    creditCode: '91310000132204567X',
    industry: '高端装备制造',
    custLevel: '战略钻石客户 (KA)',
    legalPerson: '陈建国',
    contactPerson: '王晓光 (CTO)',
    contactPhone: '13812345678',
    region: '华东大区 · 上海',
    annualBudget: '￥12,500,000',
    status: 'active',
    createdAt: '2026-01-15'
  },
  {
    id: 'cust-02',
    custCode: 'CUST-2026-002',
    custName: '国家电网华东能源电力互联科技有限公司',
    creditCode: '91310115717865432Y',
    industry: '新能源与电力',
    custLevel: '白金重点客户',
    legalPerson: '李明诚',
    contactPerson: '赵志刚 (信息部主管)',
    contactPhone: '13987654321',
    region: '华东大区 · 南京',
    annualBudget: '￥8,800,000',
    status: 'active',
    createdAt: '2026-02-01'
  },
  {
    id: 'cust-03',
    custCode: 'CUST-2026-003',
    custName: '苏州工业园区微电子集成电路有限公司',
    creditCode: '91320500745231980A',
    industry: '半导体集成电路',
    custLevel: '战略钻石客户 (KA)',
    legalPerson: '林晓峰',
    contactPerson: '孙美玲 (采购总监)',
    contactPhone: '13700112233',
    region: '华东大区 · 苏州',
    annualBudget: '￥15,000,000',
    status: 'active',
    createdAt: '2026-02-18'
  },
  {
    id: 'cust-04',
    custCode: 'CUST-2026-004',
    custName: '四川能投智慧水务防御工程技术集团',
    creditCode: '91510100689012345B',
    industry: '智慧水务与环保',
    custLevel: '黄金核心客户',
    legalPerson: '张远航',
    contactPerson: '刘建平 (总工程师)',
    contactPhone: '13611223344',
    region: '西南大区 · 成都',
    annualBudget: '￥6,200,000',
    status: 'active',
    createdAt: '2026-03-01'
  },
  {
    id: 'cust-05',
    custCode: 'CUST-2026-005',
    custName: '重庆长安新能源车联网安全技术研究院',
    creditCode: '91500000789456123C',
    industry: '智能网联汽车',
    custLevel: '白金重点客户',
    legalPerson: '何志强',
    contactPerson: '周伟 (车联网总监)',
    contactPhone: '13599887766',
    region: '西南大区 · 重庆',
    annualBudget: '￥9,500,000',
    status: 'active',
    createdAt: '2026-03-05'
  }
];

export const CustomerDirectory: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('全部');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newCustomerForm, setNewCustomerForm] = useState({
    custName: '',
    creditCode: '',
    industry: '高端装备制造',
    custLevel: '战略钻石客户 (KA)',
    legalPerson: '',
    contactPerson: '',
    contactPhone: '',
    region: '华东大区 · 上海',
    annualBudget: '￥5,000,000'
  });

  const filtered = customers.filter(c => {
    const matchesSearch = c.custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.custCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.creditCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === '全部' || c.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.custName) return;

    const newCust: CustomerRecord = {
      id: `cust-${Date.now()}`,
      custCode: `CUST-2026-${String(customers.length + 1).padStart(3, '0')}`,
      custName: newCustomerForm.custName,
      creditCode: newCustomerForm.creditCode || '91310000XXXXXXXXXX',
      industry: newCustomerForm.industry,
      custLevel: newCustomerForm.custLevel,
      legalPerson: newCustomerForm.legalPerson || '未登记',
      contactPerson: newCustomerForm.contactPerson || '未登记',
      contactPhone: newCustomerForm.contactPhone || '13800000000',
      region: newCustomerForm.region,
      annualBudget: newCustomerForm.annualBudget,
      status: 'active',
      createdAt: '2026-03-08'
    };

    setCustomers([newCust, ...customers]);
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] text-slate-800" id="customer_directory_page">
      <div className="w-full flex flex-col gap-5">

        {/* Top Header Card: 严格遵循设计与样式规范 */}
        <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="customer_directory_header_bar">
          <div className="flex flex-col">
            {/* 二、面包屑导航（Breadcrumb） */}
            <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
              <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-slate-600 font-medium">客户管理 / 客户名录</span>
            </nav>

            {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
            <div className="flex items-center gap-2.5 mt-1">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
                客户名录
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
                复用页
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>新建企业客户</span>
            </button>
          </div>
        </div>

        {/* 页面内部主体区域 */}
        <div className="px-6 pb-6 flex flex-col gap-5">

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-700">行业分类:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none font-medium cursor-pointer"
            >
              <option value="全部">全部行业分类</option>
              <option value="高端装备制造">高端装备制造</option>
              <option value="新能源与电力">新能源与电力</option>
              <option value="半导体集成电路">半导体集成电路</option>
              <option value="智慧水务与环保">智慧水务与环保</option>
              <option value="智能网联汽车">智能网联汽车</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索客户名称、编码、统一信用代码..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-[#1e376b] font-bold border-b border-slate-200">
                  <th className="py-3.5 px-4 w-32">客户编号</th>
                  <th className="py-3.5 px-4 min-w-[220px]">企业客户名称 / 统一社会信用代码</th>
                  <th className="py-3.5 px-4 w-36">行业分类</th>
                  <th className="py-3.5 px-4 w-36">客户层级</th>
                  <th className="py-3.5 px-4 w-40">主要联系人 / 电话</th>
                  <th className="py-3.5 px-4 w-32">所属战区</th>
                  <th className="py-3.5 px-4 w-28 text-right">年度签约预算</th>
                  <th className="py-3.5 px-4 w-20 text-center">状态</th>
                  <th className="py-3.5 px-4 w-20 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {cust.custCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[13px] hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(cust)}>
                          {cust.custName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{cust.creditCode}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {cust.industry}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-50 text-amber-800 border border-amber-200/70 px-2 py-0.5 rounded text-[11px] font-bold">
                        {cust.custLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-[11px]">
                        <span className="font-semibold text-slate-800">{cust.contactPerson}</span>
                        <span className="font-mono text-slate-400">{cust.contactPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {cust.region}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-700">
                      {cust.annualBudget}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        已合作
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(cust)}
                        className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedCustomer(null)}></div>
          
          <div className="w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto relative animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
              <div>
                <h2 className="text-base font-black text-slate-900">{selectedCustomer.custName}</h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedCustomer.creditCode}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400">客户编号</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCustomer.custCode}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400">战略层级</span>
                  <span className="font-bold text-amber-700">{selectedCustomer.custLevel}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400">主要联系人</span>
                  <span className="font-bold text-slate-800">{selectedCustomer.contactPerson}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-400">联系电话</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCustomer.contactPhone}</span>
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 flex flex-col gap-2">
                <span className="font-bold text-slate-900">系统集成状态</span>
                <span className="text-blue-700 font-bold">已同步至 CRM销售系统 & ERP财务进销存</span>
                <span className="text-slate-500">
                  该客户名录在全域应用中保持统一唯一标识，历史合同签约金额累计 <strong>{selectedCustomer.annualBudget}</strong>。
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#1e376b] text-white rounded-lg text-xs font-bold hover:bg-[#14264c] cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)}></div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">新建企业客户档案</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">企业全称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 杭州海康威视数字技术股份有限公司"
                  value={newCustomerForm.custName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, custName: e.target.value })}
                  className="border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">统一社会信用代码</label>
                  <input
                    type="text"
                    placeholder="9133010073356888XX"
                    value={newCustomerForm.creditCode}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, creditCode: e.target.value })}
                    className="border border-slate-200 rounded-lg p-2 font-mono outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">行业分类</label>
                  <select
                    value={newCustomerForm.industry}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, industry: e.target.value })}
                    className="border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500"
                  >
                    <option value="高端装备制造">高端装备制造</option>
                    <option value="新能源与电力">新能源与电力</option>
                    <option value="半导体集成电路">半导体集成电路</option>
                    <option value="智慧水务与环保">智慧水务与环保</option>
                    <option value="智能网联汽车">智能网联汽车</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">联系人姓名</label>
                  <input
                    type="text"
                    placeholder="联系人姓名及职务"
                    value={newCustomerForm.contactPerson}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactPerson: e.target.value })}
                    className="border border-slate-200 rounded-lg p-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-700">联系电话</label>
                  <input
                    type="text"
                    placeholder="13800000000"
                    value={newCustomerForm.contactPhone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactPhone: e.target.value })}
                    className="border border-slate-200 rounded-lg p-2 font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer font-bold shadow-sm"
                >
                  保存客户
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
};
