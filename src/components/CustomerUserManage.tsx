import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  Shield,
  Phone,
  Building2,
  ChevronRight,
  Filter,
  Check,
  Crown,
  UserCheck,
  UserX,
  UserMinus,
  ShieldAlert,
  SlidersHorizontal,
  Lock,
  MoreHorizontal
} from 'lucide-react';

export interface OrgUserItem {
  id: string;
  avatarUrl: string;
  nickname: string; // 微信昵称
  nameRemark: string; // 姓名备注（带处室）
  orgNode: string; // 组织节点
  role: '主管' | '管理员' | '使用成员' | '普通成员';
  roleTagType: 'admin' | 'member';
  phone: string;
  status: 'active' | 'inactive' | 'unfollowed'; // '已激活已开通' | '未开通' | '未关注'
  isSuperAdmin?: boolean;
}

export interface CustomerUserManageProps {
  customerOrgName: string;
  customerOrgCode: string;
  appName: string;
}

export const CustomerUserManage: React.FC<CustomerUserManageProps> = ({
  customerOrgName,
  customerOrgCode,
  appName = '谛听预警系统'
}) => {
  // 3项状态分类过滤
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'unfollowed' | 'all'>('active');
  const [roleFilter, setRoleFilter] = useState<string>('全部角色');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  // 模拟微信绑定用户列表数据
  const [userList, setUserList] = useState<OrgUserItem[]>([
    {
      id: 'u_01',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      nickname: '小熊警长官',
      nameRemark: '罗科长（宣传处）',
      orgNode: '宣传处',
      role: '管理员',
      roleTagType: 'admin',
      phone: '138****3456',
      status: 'active'
    },
    {
      id: 'u_02',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      nickname: '.',
      nameRemark: '史乐乐（融媒中心）',
      orgNode: '融媒中心',
      role: '管理员',
      roleTagType: 'admin',
      phone: '186****8812',
      status: 'active'
    },
    {
      id: 'u_03',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      nickname: 'Shaw',
      nameRemark: '肖工（技术运维科）',
      orgNode: '技术运维科',
      role: '使用成员',
      roleTagType: 'member',
      phone: '139****6789',
      status: 'active'
    },
    {
      id: 'u_04',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      nickname: 'domo',
      nameRemark: '李涛（交警支队）',
      orgNode: '交警支队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '158****1122',
      status: 'active'
    },
    {
      id: 'u_05',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      nickname: 'THIS',
      nameRemark: '王敏（指挥中心）',
      orgNode: '指挥中心',
      role: '使用成员',
      roleTagType: 'member',
      phone: '137****3344',
      status: 'active'
    },
    {
      id: 'u_06',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      nickname: 'anan',
      nameRemark: '安警官（网安支队）',
      orgNode: '网安支队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '180****5566',
      status: 'active'
    },
    {
      id: 'u_07',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      nickname: '张主任',
      nameRemark: '张主任（办公室）',
      orgNode: '办公室',
      role: '使用成员',
      roleTagType: 'member',
      phone: '135****9988',
      status: 'active'
    },
    {
      id: 'u_08',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      nickname: '小林',
      nameRemark: '林清（政工室）',
      orgNode: '政工室',
      role: '使用成员',
      roleTagType: 'member',
      phone: '136****4411',
      status: 'active'
    },
    {
      id: 'u_09',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      nickname: '浩天',
      nameRemark: '赵浩天（刑侦支队）',
      orgNode: '刑侦支队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '188****7722',
      status: 'active'
    },
    {
      id: 'u_10',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      nickname: '晴天',
      nameRemark: '周晴（督察大队）',
      orgNode: '督察大队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '131****0099',
      status: 'active'
    },
    {
      id: 'u_11',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
      nickname: 'Lucy',
      nameRemark: '陈露（法制支队）',
      orgNode: '法制支队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '185****6633',
      status: 'active'
    },
    {
      id: 'u_12',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      nickname: 'Echo',
      nameRemark: '回峰（禁毒支队）',
      orgNode: '禁毒支队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '134****8877',
      status: 'inactive'
    },
    {
      id: 'u_13',
      avatarUrl: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=120&auto=format&fit=crop&q=80',
      nickname: '雷鸣',
      nameRemark: '雷鸣（治安支队）',
      orgNode: '治安支队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '177****5544',
      status: 'inactive'
    },
    {
      id: 'u_14',
      avatarUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=120&auto=format&fit=crop&q=80',
      nickname: '追风少年',
      nameRemark: '刘宇（巡特警大队）',
      orgNode: '巡特警大队',
      role: '使用成员',
      roleTagType: 'member',
      phone: '189****3321',
      status: 'inactive'
    },
    {
      id: 'u_15',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
      nickname: '星海',
      nameRemark: '徐海（情报中心）',
      orgNode: '情报中心',
      role: '使用成员',
      roleTagType: 'member',
      phone: '159****9900',
      status: 'unfollowed'
    },
    {
      id: 'u_16',
      avatarUrl: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=120&auto=format&fit=crop&q=80',
      nickname: '静静',
      nameRemark: '孙静（信访科）',
      orgNode: '信访科',
      role: '使用成员',
      roleTagType: 'member',
      phone: '132****7788',
      status: 'unfollowed'
    }
  ]);

  // 统计数据
  const counts = useMemo(() => {
    const active = userList.filter(u => u.status === 'active').length;
    const inactive = userList.filter(u => u.status === 'inactive').length;
    const unfollowed = userList.filter(u => u.status === 'unfollowed').length;
    return { active, inactive, unfollowed, total: userList.length };
  }, [userList]);

  // 筛选后的列表
  const filteredUsers = useMemo(() => {
    return userList.filter(u => {
      // 1. 状态卡片筛选
      if (statusFilter !== 'all' && u.status !== statusFilter) {
        return false;
      }
      // 2. 角色筛选
      if (roleFilter !== '全部角色') {
        if (roleFilter === '主管理员' || roleFilter === '管理员') {
          if (u.roleTagType !== 'admin') return false;
        } else if (u.role !== roleFilter) {
          return false;
        }
      }
      // 3. 关键词搜索
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchNick = u.nickname.toLowerCase().includes(q);
        const matchRemark = u.nameRemark.toLowerCase().includes(q);
        const matchPhone = u.phone.includes(q);
        const matchDept = u.orgNode.toLowerCase().includes(q);
        if (!matchNick && !matchRemark && !matchPhone && !matchDept) {
          return false;
        }
      }
      return true;
    });
  }, [userList, statusFilter, roleFilter, searchKeyword]);

  // 全选/反选
  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleRevealPhone = (id: string) => {
    setRevealedPhones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetSearch = () => {
    setRoleFilter('全部角色');
    setSearchKeyword('');
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200" id="customer_user_management_panel">
      {/* ========================================================
          1. 顶部 3 项统计卡片（与 V8 用户数据库统计卡片风格、尺寸、字体完全统一）
          - 第 1 项：已激活已开通 (已开通本系统使用权限的人员名单)
          - 第 2 项：未开通 (未开通系统使用权限的人员名单)
          - 第 3 项：未关注 (未关注公众号【康奈RMT】人员)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 卡片 1：已激活已开通 */}
        <div
          onClick={() => setStatusFilter(prev => prev === 'active' ? 'all' : 'active')}
          title="点击筛选“已激活已开通”用户（再次点击查看全部）"
          className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
            statusFilter === 'active'
              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/30'
              : 'bg-white border-slate-200/80 hover:border-emerald-200'
          }`}
          id="stat_card_active"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">已激活已开通</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-emerald-600 tracking-tight">
                {counts.active}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            已开通本系统使用权限的人员名单
          </p>
        </div>

        {/* 卡片 2：未开通 */}
        <div
          onClick={() => setStatusFilter(prev => prev === 'inactive' ? 'all' : 'inactive')}
          title="点击筛选“未开通”用户（再次点击查看全部）"
          className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
            statusFilter === 'inactive'
              ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/30'
              : 'bg-white border-slate-200/80 hover:border-amber-200'
          }`}
          id="stat_card_inactive"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">未开通</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-amber-600 tracking-tight">
                {counts.inactive}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            未开通系统使用权限的人员名单
          </p>
        </div>

        {/* 卡片 3：未关注 */}
        <div
          onClick={() => setStatusFilter(prev => prev === 'unfollowed' ? 'all' : 'unfollowed')}
          title="点击筛选“未关注”用户（再次点击查看全部）"
          className={`p-4 rounded-xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:shadow-md active:scale-[0.99] ${
            statusFilter === 'unfollowed'
              ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-500/30'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
          id="stat_card_unfollowed"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">未关注公众号</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
              <UserMinus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-700 tracking-tight">
                {counts.unfollowed}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-medium">人</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium leading-relaxed">
            尚未关注微信公众号【康奈RMT】，关注后方可授权
          </p>
        </div>
      </div>

      {/* ========================================================
          2. 人员列表主体区域（包含标题、过滤工具栏与表格）
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
        {/* 表格上方工具栏 */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900">
              {statusFilter === 'active'
                ? '已启用人员列表'
                : statusFilter === 'inactive'
                ? '未开通人员列表'
                : statusFilter === 'unfollowed'
                ? '未关注人员列表'
                : '全部人员列表'}
            </h3>
            <span className="text-xs text-slate-400 font-bold">
              (共 {filteredUsers.length} 人)
            </span>
            {statusFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className="ml-2 text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                查看全部人员
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* 角色筛选 */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 font-medium shrink-0">角色筛选:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer shadow-2xs"
              >
                <option value="全部角色">全部角色</option>
                <option value="主管理员">主管理员</option>
                <option value="使用成员">使用成员</option>
              </select>
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                placeholder="搜索姓名、昵称、手机号"
                className="w-48 sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 text-slate-800 placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            {/* 搜索按钮 */}
            <button
              type="button"
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>搜索</span>
            </button>

            {/* 重置按钮 */}
            <button
              type="button"
              onClick={handleResetSearch}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* 3. 成员数据表格（严格对齐设计图） */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-400 font-bold">
                <th className="py-3 px-3.5 w-12 text-center">序号</th>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 text-center w-16">微信头像</th>
                <th className="py-3 px-4">微信昵称</th>
                <th className="py-3 px-4">名称备注</th>
                <th className="py-3 px-4">组织节点</th>
                <th className="py-3 px-4">角色</th>
                <th className="py-3 px-4">电话</th>
                <th className="py-3 px-4 text-center">启用状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-300" />
                      <span>未找到符合条件的成员</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  const isRevealed = revealedPhones[user.id];
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-sky-50/30' : ''
                      }`}
                    >
                      {/* 序号 */}
                      <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* 多选框 */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* 微信头像 */}
                      <td className="py-3 px-3 text-center">
                        <div className="w-8 h-8 mx-auto rounded-full overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                          <img
                            src={user.avatarUrl}
                            alt={user.nickname}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* 微信昵称 */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {user.nickname}
                      </td>

                      {/* 名称备注 */}
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {user.nameRemark}
                      </td>

                      {/* 组织节点 */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{user.orgNode}</span>
                        </span>
                      </td>

                      {/* 角色 */}
                      <td className="py-3 px-4">
                        {user.roleTagType === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span>主管理员</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>使用成员</span>
                          </span>
                        )}
                      </td>

                      {/* 电话 */}
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {isRevealed
                              ? user.phone.replace('****', '8899')
                              : user.phone}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleRevealPhone(user.id)}
                            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title={isRevealed ? '隐藏完整号码' : '查看完整号码'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 启用状态 */}
                      <td className="py-3 px-4 text-center">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold shadow-2xs">
                            <span>已开启</span>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : user.status === 'inactive' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                            <span>未开通</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                            <span>未关注</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
