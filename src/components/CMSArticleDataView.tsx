/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Send,
  RotateCcw,
  Trash2,
  Search,
  RotateCw,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  AppWindow,
  Layers,
  Sparkles,
  Inbox,
  Filter,
  CheckCircle2,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import {
  ArticleItem,
  INITIAL_ARTICLES,
  CMS_APP_OPTIONS,
  CMS_STAT_UNITS
} from '../data/mockArticles';

export const CMSArticleDataView: React.FC = () => {
  // 基础文章数据集
  const [articles] = useState<ArticleItem[]>(INITIAL_ARTICLES);

  // 筛选器表单受控状态（仅在点击“搜索”或“重置”时提交应用到查询参数）
  const [filterApp, setFilterApp] = useState<string>('全部应用');
  const [filterStatUnit, setFilterStatUnit] = useState<string>('全部统计单元');
  const [filterOrgKeyword, setFilterOrgKeyword] = useState<string>('');
  const [filterCategoryKeyword, setFilterCategoryKeyword] = useState<string>('');
  const [filterArticleKeyword, setFilterArticleKeyword] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('全部状态');

  // 当前已提交生效的查询参数
  const [appliedFilters, setAppliedFilters] = useState({
    app: '全部应用',
    statUnit: '全部统计单元',
    orgKeyword: '',
    categoryKeyword: '',
    articleKeyword: '',
    status: '全部状态'
  });

  // 分页状态 (每页固定 50 条)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  // 1. 核心统计指标计算 (基于全系统内文章总数与状态划分)
  const stats = useMemo(() => {
    const totalCount = articles.length;
    const publishingCount = articles.filter(a => a.status === 'publishing').length;
    const revokedCount = articles.filter(a => a.status === 'revoked').length;
    const deletedCount = articles.filter(a => a.status === 'deleted').length;

    return {
      totalCount,
      publishingCount,
      revokedCount,
      deletedCount
    };
  }, [articles]);

  // 2. 根据已提交生效的筛选条件过滤文章列表
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // (1) 来源应用
      if (appliedFilters.app !== '全部应用' && article.appShortName !== appliedFilters.app) {
        return false;
      }

      // (2) 统计单元
      if (appliedFilters.statUnit !== '全部统计单元' && article.statUnit !== appliedFilters.statUnit) {
        return false;
      }

      // (3) 机构简称/全称
      if (appliedFilters.orgKeyword.trim()) {
        const kw = appliedFilters.orgKeyword.trim().toLowerCase();
        const matchOrg = article.orgShortName.toLowerCase().includes(kw);
        if (!matchOrg) return false;
      }

      // (4) 文章分类名称
      if (appliedFilters.categoryKeyword.trim()) {
        const kw = appliedFilters.categoryKeyword.trim().toLowerCase();
        const matchCat = article.categoryName.toLowerCase().includes(kw);
        if (!matchCat) return false;
      }

      // (5) 文章检索（标题、内容）
      if (appliedFilters.articleKeyword.trim()) {
        const kw = appliedFilters.articleKeyword.trim().toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(kw);
        const matchContent = (article.contentSnippet || '').toLowerCase().includes(kw);
        if (!matchTitle && !matchContent) return false;
      }

      // (6) 文章状态
      if (appliedFilters.status !== '全部状态') {
        const statusMap: Record<string, ArticleItem['status']> = {
          '发布中': 'publishing',
          '已撤回': 'revoked',
          '已删除': 'deleted'
        };
        const mappedStatus = statusMap[appliedFilters.status];
        if (mappedStatus && article.status !== mappedStatus) {
          return false;
        }
      }

      return true;
    });
  }, [articles, appliedFilters]);

  // 3. 分页切片计算
  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPagedList = useMemo(() => {
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, startIndex, endIndex]);

  // 处理点击【搜索】
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedFilters({
      app: filterApp,
      statUnit: filterStatUnit,
      orgKeyword: filterOrgKeyword,
      categoryKeyword: filterCategoryKeyword,
      articleKeyword: filterArticleKeyword,
      status: filterStatus
    });
    setCurrentPage(1);
  };

  // 处理点击【重置】
  const handleReset = () => {
    setFilterApp('全部应用');
    setFilterStatUnit('全部统计单元');
    setFilterOrgKeyword('');
    setFilterCategoryKeyword('');
    setFilterArticleKeyword('');
    setFilterStatus('全部状态');

    setAppliedFilters({
      app: '全部应用',
      statUnit: '全部统计单元',
      orgKeyword: '',
      categoryKeyword: '',
      articleKeyword: '',
      status: '全部状态'
    });
    setCurrentPage(1);
  };

  // 辅助渲染应用图标徽标颜色
  const getAppBadgeStyle = (app: string) => {
    switch (app) {
      case '谛听预警':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '数解舆情':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '看讯':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case '点点密信':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '点点速报':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '点点速评':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case '舆情先知':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case '微小宝':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case '指令流转':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // 辅助渲染状态胶囊标签
  const renderStatusBadge = (status: ArticleItem['status']) => {
    switch (status) {
      case 'publishing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            发布中
          </span>
        );
      case 'revoked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            已撤回
          </span>
        );
      case 'deleted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            已删除
          </span>
        );
    }
  };

  // 翻页页码数组计算 (限制显示范围)
  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        range.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        range.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
      }
    }
    return range;
  }, [totalPages, safeCurrentPage]);

  return (
    <div className="w-full flex flex-col gap-5 text-slate-800" id="cms_article_data_view">
      
      {/* ========================================================================= */}
      {/* 区块一：页面顶部标题 & 面包屑规范 */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="cms_article_header_bar">
        <div className="flex flex-col">
          {/* 二、面包屑导航（Breadcrumb） */}
          <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
            <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-slate-600 font-medium">全局CMS管理系统 / 文章数据查看</span>
          </nav>

          {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
              文章数据查看
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
              复用页
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden md:block">
          集中汇聚全平台各应用及客户机构的文章内容流与生命周期台账
        </div>
      </div>

      {/* 内部主体内容区域 (保持舒适内边距) */}
      <div className="px-6 pb-6 flex flex-col gap-5">

      {/* ========================================================================= */}
      {/* 区块二：核心统计指标卡片区 (Top KPI Cards) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 卡片 1 (原规范对应卡片2): 文章总数 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">文章总数</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                {stats.totalCount}
              </span>
              <span className="text-xs text-slate-500 font-bold">篇</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">机构用户发布的文章总数</span>
          </div>
        </div>

        {/* 卡片 2 (原规范对应卡片3): 发布中 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">发布中</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-700 tracking-tight font-mono">
                {stats.publishingCount}
              </span>
              <span className="text-xs text-emerald-600 font-bold">篇</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">正在发布的文章总数</span>
          </div>
        </div>

        {/* 卡片 3 (原规范对应卡片4): 已撤回 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">已撤回</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-700 tracking-tight font-mono">
                {stats.revokedCount}
              </span>
              <span className="text-xs text-amber-600 font-bold">篇</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">已撤回的文章总数</span>
          </div>
        </div>

        {/* 卡片 4 (原规范对应卡片5): 已删除 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">已删除</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-rose-700 tracking-tight font-mono">
                {stats.deletedCount}
              </span>
              <span className="text-xs text-rose-600 font-bold">篇</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">已删除的文章总数</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 区块三：筛选与检索 (Filter Bar) */}
      {/* ========================================================================= */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-4">
        
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 text-xs">
          
          {/* (1) 来源应用 下拉选择框 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">来源应用</label>
            <select
              value={filterApp}
              onChange={(e) => setFilterApp(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer font-medium"
            >
              {CMS_APP_OPTIONS.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>
          </div>

          {/* (2) 统计单元 下拉选择框 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">统计单元</label>
            <select
              value={filterStatUnit}
              onChange={(e) => setFilterStatUnit(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer font-medium"
            >
              {CMS_STAT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* (3) 机构简称/全称单行输入框 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">机构简称/全称</label>
            <input
              type="text"
              value={filterOrgKeyword}
              onChange={(e) => setFilterOrgKeyword(e.target.value)}
              placeholder="机构简称、全称、统一社会信用代码..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          {/* (4) 文章分类名称 单行输入框 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">文章分类名称</label>
            <input
              type="text"
              value={filterCategoryKeyword}
              onChange={(e) => setFilterCategoryKeyword(e.target.value)}
              placeholder="分类名称..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          {/* (5) 文章检索 单行输入框 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">文章检索</label>
            <input
              type="text"
              value={filterArticleKeyword}
              onChange={(e) => setFilterArticleKeyword(e.target.value)}
              placeholder="文章标题、内容..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          {/* (6) 文章状态 下拉选择框 */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-700">文章状态</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer font-medium"
            >
              <option value="全部状态">全部状态</option>
              <option value="发布中">发布中</option>
              <option value="已撤回">已撤回</option>
              <option value="已删除">已删除</option>
            </select>
          </div>

          {/* (7) & (8) 操作按钮组 */}
          <div className="sm:col-span-2 md:col-span-3 xl:col-span-6 flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
            
            {/* 匹配结果提示徽标 */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">
                匹配到 <strong className="text-emerald-700 font-bold font-mono">{filteredArticles.length}</strong> 篇文章数据
              </span>

              {appliedFilters.app !== '全部应用' && (
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold">
                  应用: {appliedFilters.app}
                </span>
              )}

              {appliedFilters.statUnit !== '全部统计单元' && (
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold">
                  单元: {appliedFilters.statUnit}
                </span>
              )}

              {appliedFilters.orgKeyword && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold">
                  已选机构: {appliedFilters.orgKeyword}
                </span>
              )}

              {appliedFilters.categoryKeyword && (
                <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-bold">
                  分类: {appliedFilters.categoryKeyword}
                </span>
              )}

              {appliedFilters.status !== '全部状态' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold">
                  状态: {appliedFilters.status}
                </span>
              )}
            </div>

            {/* 搜索与重置按钮 */}
            <div className="flex items-center gap-2.5">
              {/* (8) 重置按钮 */}
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                <span>重置</span>
              </button>

              {/* (7) 搜索按钮 */}
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
              >
                <Search className="w-3.5 h-3.5 text-white" />
                <span>搜索</span>
              </button>
            </div>

          </div>

        </form>

      </div>

      {/* ========================================================================= */}
      {/* 区块四：文章列表区 (Main List) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold tracking-tight">
                <th className="py-3 px-4 w-24 text-center font-mono">文章唯一ID</th>
                <th className="py-3 px-4 w-32 text-center">来源应用</th>
                <th className="py-3 px-4 w-52">客户机构</th>
                <th className="py-3 px-4 w-32 text-center">文章分类</th>
                <th className="py-3 px-6 text-left">文章标题</th>
                <th className="py-3 px-4 w-28 text-center">文章状态</th>
                <th className="py-3 px-4 w-36 text-center">发布时间</th>
                <th className="py-3 px-4 w-44">发布人</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPagedList.length > 0 ? (
                currentPagedList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* 列 1：文章唯一ID：显示为正唯一ID数字，例如：2384 */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                      {item.id}
                    </td>

                    {/* 列 2：来源应用：显示应用简称，样式为应用图标+胶囊标签 */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getAppBadgeStyle(item.appShortName)}`}>
                        <AppWindow className="w-3.5 h-3.5 opacity-80" />
                        <span>{item.appShortName}</span>
                      </span>
                    </td>

                    {/* 列 3：客户机构：显示客户机构简称。下方副文本展示所属大区与负责人（格式：所属大区 - 负责人姓名） */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 leading-snug">
                        {item.orgShortName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {item.statUnit} - {item.salesPerson}
                      </div>
                    </td>

                    {/* 列 4：文章分类：显示文章分类名称，居中对齐 */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200/80 text-[11px]">
                        {item.categoryName}
                      </span>
                    </td>

                    {/* 列 5：文章标题：显示文章标题。左对齐 */}
                    <td className="py-3 px-6 text-left font-medium text-slate-900 leading-relaxed max-w-md">
                      <div className="line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer" title={item.title}>
                        {item.title}
                      </div>
                    </td>

                    {/* 列 6：文章状态：显示文章状态文字。居中对齐 */}
                    <td className="py-3 px-4 text-center">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* 列 7：发布时间：显示文章发布时间，第一行写日期，第二行写时间，居中对齐 */}
                    <td className="py-3 px-4 text-center">
                      <div className="font-mono font-bold text-slate-700 leading-tight">
                        {item.publishDate}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                        {item.publishTime}
                      </div>
                    </td>

                    {/* 列 8：发布人：显示发布人微信头像、微信昵称（加粗显示），备注姓名，例如王小虎 */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.authorAvatar}
                          alt={item.authorWechatNick}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">
                            {item.authorWechatNick}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.authorRealName}
                          </span>
                        </div>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                /* 当筛选无匹配数据时，居中展示层级图表与文案「未找到符合条件的文章数据」 */
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                        <Inbox className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        未找到符合条件的文章数据
                      </span>
                      <p className="text-xs text-slate-400 max-w-sm">
                        请调整筛选条件、关键字或重置筛选后重新查询。
                      </p>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>重置所有筛选</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页栏信息 */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          
          {/* 左侧文本：「显示第 1 至 X 项，共 X 篇文章」 */}
          <div>
            显示第 <strong className="font-mono text-slate-800 font-bold">{totalItems === 0 ? 0 : startIndex + 1}</strong> 至 <strong className="font-mono text-slate-800 font-bold">{endIndex}</strong> 项，共 <strong className="font-mono text-slate-800 font-bold">{totalItems}</strong> 篇文章（每页固定 50 条）
          </div>

          {/* 右侧翻页控件 */}
          <div className="flex items-center gap-1.5">
            
            {/* 上一页 */}
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 transition-all ${
                safeCurrentPage <= 1
                  ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 cursor-pointer shadow-2xs active:scale-95'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            {/* 页码按钮 */}
            {paginationRange.map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 font-mono">
                    ...
                  </span>
                );
              }
              const pageNum = Number(page);
              const isActive = pageNum === safeCurrentPage;
              return (
                <button
                  key={`page-${pageNum}`}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-mono font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* 下一页 */}
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 transition-all ${
                safeCurrentPage >= totalPages
                  ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 cursor-pointer shadow-2xs active:scale-95'
              }`}
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

      </div>

      </div>

    </div>
  );
};
