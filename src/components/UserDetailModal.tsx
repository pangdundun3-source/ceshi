/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Building2,
  FileText,
  ShieldCheck,
  LogIn,
  Activity,
  X,
  Lock,
  Edit3,
  Smartphone,
  Laptop,
  Globe
} from 'lucide-react';
import {
  AppAccountUserRecord,
  maskMobile
} from '../data/mockAppAccounts';
import { IntegratedApp } from '../types';
import { UserAppIdentitiesTableView } from './UserAppIdentitiesTableView';

export interface UserDetailModalProps {
  user: AppAccountUserRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser?: (updatedUser: AppAccountUserRecord) => void;
  allUsers?: AppAccountUserRecord[];
  currentApp?: IntegratedApp;
  defaultTab?: 'basic' | 'appIdentities' | 'loginLogs' | 'operationLogs';
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
  allUsers = [],
  currentApp,
  defaultTab = 'basic'
}) => {
  const [detailModalTab, setDetailModalTab] = useState<'basic' | 'appIdentities' | 'loginLogs' | 'operationLogs'>(defaultTab);
  const [isEditingRemark, setIsEditingRemark] = useState(false);
  const [editRemarkValue, setEditRemarkValue] = useState('');

  useEffect(() => {
    if (user) {
      setDetailModalTab(defaultTab);
      setIsEditingRemark(false);
      setEditRemarkValue(user.userRemark || '');
    }
  }, [user, defaultTab, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveRemark = () => {
    if (!user) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `OP-${Date.now()}`,
      operationTime: nowStr,
      action: '修改用户备注',
      module: '基本资料/管理员备注',
      operator: 'MT管理员',
      ip: '127.0.0.1 (内网管理端)',
      details: `管理员更新了用户专属备注为: "${editRemarkValue.trim() || '（已清空）'}"`
    };

    const updated: AppAccountUserRecord = {
      ...user,
      userRemark: editRemarkValue.trim() || undefined,
      operationLogs: [newLog, ...(user.operationLogs || [])]
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setIsEditingRemark(false);
  };

  const handleUpdateFromAppIdentities = (updatedUsers: AppAccountUserRecord[]) => {
    const updated = updatedUsers.find(u => u.id === user.id);
    if (updated && onUpdateUser) {
      onUpdateUser(updated);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-[1000px] overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        id="standard_user_detail_modal_1000px"
      >
        {/* 1. 弹窗头部：用户身份与核心标识 */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${user.avatarBg || 'bg-[#1e376b]'} text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0`}>
              {user.avatarText || (user.realName || user.wechatNickname || '用').substring(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {user.realName || user.wechatNickname}
                </h3>
                {user.realName && user.wechatNickname !== user.realName && (
                  <span className="text-xs text-slate-500 font-normal">
                    (微信号: {user.wechatNickname})
                  </span>
                )}
                {user.status === 'normal' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    正常状态
                  </span>
                )}
                {user.status === 'unsubscribed' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    已取消关注
                  </span>
                )}
                {user.status === 'locked' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    已锁定
                  </span>
                )}
                {user.status === 'deleted' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    已删除
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>用户V8唯一ID: <span className="font-mono font-medium text-slate-700">{user.id}</span></span>
                <span>•</span>
                <span>所属机构: <span className="text-slate-700 font-medium">{user.orgShortName}</span></span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 弹窗 Tab 导航条 */}
        <div className="flex items-center gap-1 px-6 pt-2 bg-slate-50/80 border-b border-slate-200 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setDetailModalTab('basic')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              detailModalTab === 'basic'
                ? 'border-[#1e376b] text-[#1e376b] bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>基本资料与机构</span>
          </button>
          <button
            type="button"
            onClick={() => setDetailModalTab('appIdentities')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              detailModalTab === 'appIdentities'
                ? 'border-[#1e376b] text-[#1e376b] bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>各应用身份</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              detailModalTab === 'appIdentities' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {user.appIdentities?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDetailModalTab('loginLogs')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              detailModalTab === 'loginLogs'
                ? 'border-[#1e376b] text-[#1e376b] bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>登录日志</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              detailModalTab === 'loginLogs' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {user.loginLogs?.length || 0}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setDetailModalTab('operationLogs')}
            className={`px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              detailModalTab === 'operationLogs'
                ? 'border-[#1e376b] text-[#1e376b] bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>操作日志</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              detailModalTab === 'operationLogs' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {user.operationLogs?.length || 0}
            </span>
          </button>
        </div>

        {/* 3. 弹窗主体内容区 */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: 基本资料与机构 */}
          {detailModalTab === 'basic' && (
            <>
              {/* 1. 基本身份信息 */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>用户基本身份</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">微信昵称：</span>
                    <span className="font-bold text-slate-800">{user.wechatNickname}</span>
                  </div>

                  {/* 真实姓名 */}
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">真实姓名：</span>
                    <span className="font-bold text-slate-800">
                      {user.realName ? user.realName : <span className="text-slate-400 font-normal">未实名</span>}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">绑定手机号：</span>
                    <span className="font-mono font-medium text-slate-800">
                      {user.mobile ? maskMobile(user.mobile) : <span className="text-slate-400 font-normal">未绑定</span>}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">首次激活日期：</span>
                    <span className="font-mono font-medium text-slate-800">
                      {user.firstActivateDate} (已激活 {user.activeDays} 天)
                    </span>
                  </div>

                  <div className="flex items-center md:col-span-2">
                    <span className="text-slate-400 w-24 shrink-0">微信 OpenID：</span>
                    <span className="font-mono text-slate-700 select-all">{user.openId}</span>
                  </div>

                  <div className="flex items-center md:col-span-2">
                    <span className="text-slate-400 w-24 shrink-0">全局 UnionID：</span>
                    <span className="font-mono text-slate-700 select-all">{user.unionId}</span>
                  </div>
                </div>
              </div>

              {/* 2. 所属机构信息 */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>所属客户机构</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
                  <div className="md:col-span-2 flex items-start">
                    <span className="text-slate-400 w-24 shrink-0">机构全称：</span>
                    <span className="font-bold text-slate-900">{user.orgFullName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">机构简称：</span>
                    <span className="font-bold text-slate-800">{user.orgShortName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">统一信用代码：</span>
                    <span className="font-mono text-slate-700">{user.creditCode}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">所在省市区：</span>
                    <span className="text-slate-800">{user.provinceCityDistrict}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">机构级别：</span>
                    <span className="font-semibold text-amber-700">{user.orgLevel}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">所属统计单元：</span>
                    <span className="text-slate-800">{user.statUnit} ({user.statUnitPath})</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-400 w-24 shrink-0">客户经理：</span>
                    <span className="font-bold text-blue-700">{user.salesPerson}</span>
                  </div>
                </div>
              </div>

              {/* 3. 用户备注 (仅 MT 管理员可见) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>用户备注</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                      <Lock className="w-3 h-3 text-amber-600" />
                      仅 MT 管理员可见 (前端用户不可见)
                    </span>
                  </h4>
                  {!isEditingRemark && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditRemarkValue(user.userRemark || '');
                        setIsEditingRemark(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{user.userRemark ? '修改备注' : '添加备注'}</span>
                    </button>
                  )}
                </div>

                {isEditingRemark ? (
                  <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/90 space-y-2.5">
                    <textarea
                      value={editRemarkValue}
                      onChange={(e) => setEditRemarkValue(e.target.value)}
                      placeholder="请输入用户专属管理员备注（仅 MT 管理员可见，前端用户不可见）..."
                      rows={3}
                      className="w-full text-xs text-slate-800 bg-white border border-amber-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-amber-700">
                        💡 提示：此备注信息仅在 MT 后台管理端显示，供运维与客户经理参考。
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingRemark(false)}
                          className="px-3 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-medium cursor-pointer"
                        >
                          取消
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveRemark}
                          className="px-3.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          保存备注
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 text-xs text-slate-700 leading-relaxed min-h-[44px] flex items-center">
                    {user.userRemark ? (
                      <p className="text-slate-800 font-medium">{user.userRemark}</p>
                    ) : (
                      <span className="text-slate-400 italic">暂无管理员备注信息，点击右上角“添加备注”进行记录。</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: 各应用身份 (完全共享 UserAppIdentitiesTableView) */}
          {detailModalTab === 'appIdentities' && (
            <UserAppIdentitiesTableView
              user={user}
              allUsers={allUsers}
              onUpdateUsers={handleUpdateFromAppIdentities}
              currentApp={currentApp}
              isStandalonePage={false}
            />
          )}

          {/* TAB 3: 登录日志 */}
          {detailModalTab === 'loginLogs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>近端登录历史记录 (共 {user.loginLogs?.length || 0} 条)</span>
                </h4>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3">登录时间与IP</th>
                      <th className="py-2.5 px-3">客户端环境与终端设备</th>
                      <th className="py-2.5 px-3">关联业务模块</th>
                      <th className="py-2.5 px-3">登录状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(!user.loginLogs || user.loginLogs.length === 0) ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">暂无登录日志记录</td>
                      </tr>
                    ) : (
                      user.loginLogs.map((log, index) => (
                        <tr key={log.id || index} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{index + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-mono text-slate-800 font-medium">{log.loginTime}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{log.ip}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="text-slate-800 font-medium flex items-center gap-1.5">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              <span>{log.clientType}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              {log.device.includes('iPhone') || log.device.includes('Android') || log.device.includes('Phone') ? (
                                <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
                              ) : (
                                <Laptop className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                              <span>{log.device}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-slate-600">{log.location}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            {log.status === 'success' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                登录成功
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200" title={log.failReason}>
                                失败 ({log.failReason || '密码错误'})
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: 操作日志 */}
          {detailModalTab === 'operationLogs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>管理与业务操作日志 (共 {user.operationLogs?.length || 0} 条)</span>
                </h4>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-4 w-1/4">操作时间 / IP 地址</th>
                      <th className="py-2.5 px-4 w-1/4">操作人 / 业务板块</th>
                      <th className="py-2.5 px-4 w-2/4">操作行为 / 详细说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(!user.operationLogs || user.operationLogs.length === 0) ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400">暂无操作日志记录</td>
                      </tr>
                    ) : (
                      user.operationLogs.map((op, index) => (
                        <tr key={op.id || index} className="hover:bg-slate-50/70">
                          {/* 第一列：操作时间和 IP 地址（操作时间在上面） */}
                          <td className="py-3 px-4 align-top">
                            <div className="font-mono text-slate-800 font-bold text-xs">{op.operationTime}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{op.ip}</span>
                            </div>
                          </td>

                          {/* 第二列：操作人和业务板块（操作人在上面） */}
                          <td className="py-3 px-4 align-top">
                            <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              <span>{op.operator}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 font-medium">
                              {op.module}
                            </div>
                          </td>

                          {/* 第三列：操作行为和详细说明（操作行为放上面，详细说明放下面） */}
                          <td className="py-3 px-4 align-top">
                            <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                                行为
                              </span>
                              <span>{op.action}</span>
                            </div>
                            <div className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                              {op.details}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 4. 弹窗底部操作栏 */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>系统状态: 正常运行</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#1e376b] hover:bg-[#15274d] text-white rounded-lg text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
