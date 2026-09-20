/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Building2, Wrench, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface CMSPlaceholderViewProps {
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
}

export const CMSPlaceholderView: React.FC<CMSPlaceholderViewProps> = ({
  title,
  subtitle,
  badge = 'CMS子系统',
  description
}) => {
  return (
    <div className="w-full flex flex-col gap-6 text-slate-800">
      {/* 头部：严格遵循设计与样式规范 */}
      <div className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0" id="cms_placeholder_header_bar">
        <div className="flex flex-col">
          {/* 二、面包屑导航（Breadcrumb） */}
          <nav className="flex items-center gap-1.5 text-xs font-mono select-none" aria-label="Breadcrumb">
            <span className="text-slate-400 font-normal">V8应用集成管理中心</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-slate-600 font-medium">全局CMS管理系统 / {title}</span>
          </nav>

          {/* 三、页面主标题（Title）与 四、“复用页”胶囊徽标标签（Badge） */}
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
              {title}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150">
              {badge || '复用页'}
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden md:block">
          {subtitle}
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-6">
        {/* 内容卡片区 */}
        <div className="bg-white rounded-xl border border-slate-200 p-12 min-h-[460px] shadow-2xs flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <Wrench className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h2 className="text-base font-bold text-slate-800">{title} 功能已就绪</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-xs text-slate-600 font-medium mt-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>全局CMS体系架构节点与权限模型已统一配置完成</span>
          </div>
        </div>
      </div>
    </div>
  );
};
