import React from 'react';

interface BreadcrumbItem {
  label: string;
}

interface PageHeaderProps {
  breadcrumb?: string[] | string;
  title: string;
  badge?: string;
  badgeColor?: 'orange' | 'blue' | 'emerald' | 'purple' | 'slate';
  actions?: React.ReactNode;
  id?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumb,
  title,
  badge = '复用页',
  badgeColor = 'orange',
  actions,
  id
}) => {
  // 解析面包屑：若为字符串，直接显示；若为数组，前段为前缀，末尾为当前路径
  let prefix = 'V8应用集成管理中心';
  let currentPath = '';

  if (Array.isArray(breadcrumb) && breadcrumb.length > 0) {
    if (breadcrumb.length === 1) {
      currentPath = breadcrumb[0];
    } else {
      prefix = breadcrumb.slice(0, breadcrumb.length - 1).join(' / ');
      currentPath = breadcrumb[breadcrumb.length - 1];
    }
  } else if (typeof breadcrumb === 'string') {
    currentPath = breadcrumb;
  }

  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'emerald':
        return 'bg-emerald-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'slate':
        return 'bg-slate-600 text-white';
      case 'orange':
      default:
        return 'bg-orange-500 text-white';
    }
  };

  return (
    <div
      className="w-full flex flex-row items-center justify-between bg-white px-6 pb-2 pt-4 border-b border-slate-200 m-0 select-none shrink-0"
      id={id || 'v8_page_header_bar'}
    >
      <div className="flex flex-col">
        {/* 面包屑导航 (Breadcrumb) */}
        <nav className="flex items-center gap-1.5 text-xs font-mono" aria-label="Breadcrumb">
          <span className="text-slate-400 font-normal">{prefix}</span>
          <span className="text-slate-400 font-normal">/</span>
          <span className="text-slate-600 font-medium">{currentPath}</span>
        </nav>

        {/* 页面主标题 (Title) 与 胶囊徽标 (Badge) */}
        <div className="flex items-center gap-2.5 mt-1">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight m-0 p-0">
            {title}
          </h1>
          {badge && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getBadgeStyle()} text-xs font-bold shadow-2xs select-none animate-in fade-in zoom-in-95 duration-150`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
};
