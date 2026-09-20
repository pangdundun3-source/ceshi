/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DataDictManage } from './DataDictManage';

interface AppDataDictionaryProps {
  isInnerApp?: boolean;
  appName?: string;
  appShortName?: string;
  appCode?: string;
}

export const AppDataDictionary: React.FC<AppDataDictionaryProps> = ({
  isInnerApp = false,
  appName = '正管用-网络生态综合治理平台',
  appShortName = '正管用',
  appCode = 'V8-P-01'
}) => {
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 text-slate-800 flex flex-col">
      <div className="w-full flex-1 flex flex-col">
        <DataDictManage
          appName={isInnerApp ? appName : '全局数据字典'}
          appShortName={isInnerApp ? appShortName : undefined}
          appCode={isInnerApp ? appCode : 'V8-Reg'}
          onShowToast={showToast}
          showPathDisplay={false}
          isGlobalDictPage={!isInnerApp}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-2.5 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
              : toastMessage.type === 'warning'
              ? 'bg-amber-600 text-white border-amber-500 shadow-amber-500/20'
              : 'bg-slate-800 text-white border-slate-700 shadow-slate-900/30'
          }`}>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
