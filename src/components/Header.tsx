/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, ShieldCheck, LogOut, AppWindow, Sparkles, Bell } from 'lucide-react';
import { SystemMode } from '../types';

interface HeaderProps {
  systemMode: SystemMode;
  setSystemMode: (mode: SystemMode) => void;
  userName?: string;
  departmentName?: string;
  onToggleSystemsMenu: () => void;
  isSystemsMenuOpen: boolean;
  onOpenProfile: () => void;
  unreadCount: number;
  notifications: Array<{ id: number; title: string; time: string; content: string; read: boolean; }>;
  onMarkAllRead: () => void;
  onMarkAsRead: (id: number) => void;
  onOpenMessageCenter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemMode,
  setSystemMode,
  userName = '张华',
  departmentName = '标准合规部',
  onToggleSystemsMenu,
  isSystemsMenuOpen,
  onOpenProfile,
  unreadCount,
  notifications,
  onMarkAllRead,
  onMarkAsRead,
  onOpenMessageCenter
}) => {

  return (
    <header className="h-[64px] bg-[#D5EBFE] border-b border-slate-200/80 flex items-center justify-between px-6 select-none sticky top-0 z-30 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
      {/* Left branding logo and title */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2" id="system_logo_wrapper">
          {/* High-Fidelity Konne Corporate Logo matching the brand image */}
          <div className="flex items-center gap-1.5 py-1 select-none">
            {/* KN Emblem Icon (Geometric gradient folds) */}
            <div className="flex items-center">
              <svg width="23" height="19" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 select-none">
                <defs>
                  <linearGradient id="knMainGrad" x1="0" y1="0" x2="32" y2="26" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1e6fff" />
                    <stop offset="100%" stopColor="#1049c3" />
                  </linearGradient>
                  <linearGradient id="knAccentGrad" x1="0" y1="26" x2="32" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00b4ff" />
                    <stop offset="100%" stopColor="#006cff" />
                  </linearGradient>
                </defs>
                {/* Thick Left leg of K */}
                <rect x="1" y="1" width="5.5" height="24" rx="1.5" fill="url(#knMainGrad)" />
                {/* Middle connector & upper diagonal branch of K */}
                <path d="M6.5 13 L15 4 H21 L11.5 14.5 L22.5 25 H16.5 L6.5 13 Z" fill="url(#knMainGrad)" />
                {/* Overlapping diagonal fold (representing N diagonal fold) */}
                <path d="M18.5 4 L28 25 H22.5 L14.5 7.5" fill="url(#knAccentGrad)" />
                {/* Rightmost vertical stem of N */}
                <rect x="25.5" y="4" width="5.5" height="21" rx="1.5" fill="url(#knMainGrad)" />
              </svg>
            </div>

            {/* Vertical Divider */}
            <div className="w-[1px] h-3.5 bg-slate-300"></div>

            {/* Logo Text Labels with crisp typography */}
            <div className="flex flex-col select-none justify-center">
              <span className="text-[10px] font-bold tracking-wider text-[#0052D9] font-sans leading-none">康奈网络</span>
              <span className="text-[7.5px] font-black tracking-wide text-[#0052D9]/90 font-sans leading-none mt-0.5">Konne.cn</span>
            </div>

            {/* MT Badge - Rounded capsule styled with italics as in the image */}
            <div className="bg-[#0066FF] hover:bg-blue-600 transition-all font-sans text-white text-[7px] font-extrabold italic tracking-wider px-1 py-0.5 rounded-sm shadow-sm border border-blue-400/20 select-none ml-1 flex items-center justify-center h-3.5">
              MT
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-[1px] h-4 bg-slate-200"></div>

        {/* System Hamburger and App Title with auto selector */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className={`p-1.5 rounded-lg border transition-all cursor-default flex items-center justify-center ${isSystemsMenuOpen ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'border-transparent text-slate-600'}`}
            id="header_toggle"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 font-display">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-500/50 animate-pulse"></span>
              <span>V8应用集成管理中心</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right User Info and State */}
      <div className="flex items-center gap-4">
        
        {/* Personal Message Icon */}
        <div className="relative" id="personal_notifications_wrapper">
          <button
            type="button"
            onClick={onOpenMessageCenter}
            className="relative p-2 rounded-xl border border-transparent text-slate-600 hover:bg-white/50 hover:border-slate-300/40 transition-all cursor-pointer h-9 w-9 flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Info card (disabled click action) */}
        <div 
          className="flex items-center gap-3 pl-2.5 py-1 px-2.5 rounded-xl border border-transparent cursor-default transition-all"
          id="header_user_module"
        >
          <div className="text-right">
            <div className="text-xs font-bold text-[#1E293B] flex items-center justify-end gap-1 select-none">
              <span>{userName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 select-none">{departmentName}</div>
          </div>
          
          {/* Avatar frame */}
          <div className="relative shrink-0 select-none" id="avatar_frame">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                alt="user avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#D5EBFE] rounded-full"></div>
          </div>
        </div>

        {/* Logout (disabled click action) */}
        <button 
          id="exit_button"
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-default shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
          <span>退出</span>
        </button>
      </div>
    </header>
  );
};
