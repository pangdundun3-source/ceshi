/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Calendar, HardDrive, ShieldCheck, UserCheck, Terminal, ArrowDownAZ } from 'lucide-react';
import { OperationLog } from '../types';

interface EntityLogsProps {
  logs: OperationLog[];
  onClearLogs?: () => void;
}

export const EntityLogs: React.FC<EntityLogsProps> = ({ logs, onClearLogs }) => {
  // Filters matching Image 3 layout
  const [operatorInput, setOperatorInput] = useState('');
  const [typeDropdown, setTypeDropdown] = useState('all');
  const [timeRange, setTimeRange] = useState('');

  // Submitted search params
  const [searchParams, setSearchParams] = useState({
    operator: '',
    type: 'all'
  });

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const handleSearch = () => {
    setSearchParams({
      operator: operatorInput,
      type: typeDropdown
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setOperatorInput('');
    setTypeDropdown('all');
    setTimeRange('');
    setSearchParams({
      operator: '',
      type: 'all'
    });
    setCurrentPage(1);
  };

  // Filter logs logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchOperator = log.operator.toLowerCase().includes(searchParams.operator.toLowerCase()) ||
                            log.operatorPinyin.toLowerCase().includes(searchParams.operator.toLowerCase());
      
      const matchType = searchParams.type === 'all' || log.operationType === searchParams.type;
      
      return matchOperator && matchType;
    });
  }, [logs, searchParams]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIdx, startIdx + pageSize);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;

  return (
    <div className="p-6 max-w-[1600px] w-full mx-auto flex flex-col gap-6" id="entity_logs_viewport">
      
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">主体维护</h1>
          <p className="text-xs text-slate-400 mt-1">记录并审计系统核心组件更迭、数据注入以及角色行为日志轨迹</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">当前累计存储日志: <strong className="text-slate-600">{logs.length}</strong> 条</span>
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="text-[10px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded px-2.5 py-1 transition-all cursor-pointer font-semibold"
            >
              清空历史日志
            </button>
          )}
        </div>
      </div>

      {/* Filters card matching Image 3 */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* 操作人 input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">操作人</label>
          <input
            type="text"
            value={operatorInput}
            onChange={e => setOperatorInput(e.target.value)}
            placeholder="请输入操作人（如：张三 / Zhangsan）"
            className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-lg py-2 px-3 outline-none text-slate-700 bg-slate-50/50"
            id="log_filter_operator"
          />
        </div>

        {/* 操作类型 select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">操作类型</label>
          <select
            value={typeDropdown}
            onChange={e => setTypeDropdown(e.target.value)}
            className="w-full text-xs border border-slate-200 focus:border-blue-500 rounded-lg py-2 px-3 outline-none text-slate-700 bg-slate-50/50"
            id="log_filter_type"
          >
            <option value="all">请选择操作类型</option>
            <option value="新建产品">新建产品</option>
            <option value="修改产品">修改产品</option>
            <option value="删除产品">删除产品</option>
            <option value="核心调试">核心调试</option>
            <option value="修改合同">修改合同</option>
            <option value="审核合同">审核合同</option>
          </select>
        </div>

        {/* 操作时间 range */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">操作时间</label>
          <div className="relative">
            <input
              type="text"
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              placeholder="开始时间 - 结束时间"
              className="w-full text-xs border border-slate-200 rounded-lg py-2 pl-3 pr-8 outline-none text-slate-600 font-mono bg-slate-50/50"
              id="log_filter_time"
            />
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>
        </div>

        {/* Search actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            id="log_btn_search"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={handleReset}
            className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            id="log_btn_reset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>重置</span>
          </button>
        </div>

      </div>

      {/* Operation Logs Table Card matching Image 3 style */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[80px]">序号</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[120px]">操作类型</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[150px]">操作人</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[120px]">部门</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500">内容</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[140px]">IP</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[100px]">结果</th>
                <th className="py-3.5 px-5 text-xs font-semibold text-slate-500 w-[180px]">操作时间</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log, index) => {
                  const sequentialNum = logs.length - ((currentPage - 1) * pageSize + index);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Sequential Row Id */}
                      <td className="py-3.5 px-5 text-slate-400 text-xs font-semibold">
                        {sequentialNum}
                      </td>

                      {/* Operation Type */}
                      <td className="py-3.5 px-5">
                        <span className={`inline-block text-[11px] px-2 py-0.5 rounded font-sans font-medium ${
                          log.operationType.includes('新建') ? 'bg-sky-50 text-sky-700' :
                          log.operationType.includes('修改') ? 'bg-amber-50 text-amber-700' :
                          log.operationType.includes('删除') ? 'bg-rose-50 text-rose-700' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {log.operationType}
                        </span>
                      </td>

                      {/* Operator */}
                      <td className="py-3.5 px-5 font-sans">
                        <span className="text-slate-800 font-medium">{log.operator}</span>
                        <span className="text-slate-400 ml-1.5 text-[11px] font-normal">({log.operatorPinyin})</span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-5 text-slate-600 font-sans">
                        {log.department}
                      </td>

                      {/* Content details */}
                      <td className="py-3.5 px-5 text-slate-700 font-sans tracking-tight max-w-[400px] truncate" title={log.content}>
                        {log.content}
                      </td>

                      {/* IP address */}
                      <td className="py-3.5 px-5 text-slate-500 font-semibold font-mono">
                        {log.ip}
                      </td>

                      {/* Log Results */}
                      <td className="py-3.5 px-5 font-sans">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {log.result}
                        </span>
                      </td>

                      {/* Created Time */}
                      <td className="py-3.5 px-5 text-slate-400 font-mono">
                        {log.createdAt}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 font-sans">
                    暂未检索到操作审核日志记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dense Pagination Footer */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>共计 <strong className="text-slate-700 font-bold">{filteredLogs.length}</strong> 条日志</span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1 px-2 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              首页
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1 px-2 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              上一页
            </button>

            <span className="text-[11px] text-slate-400 mx-1">页码: {currentPage} / {totalPages}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1 px-2 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              下一页
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1 px-2 border border-slate-200 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              末页
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
