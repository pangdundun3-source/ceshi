/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserLoginLog {
  id: string;
  loginTime: string;
  ip: string;
  location: string;
  device: string;
  clientType: string;
  status: 'success' | 'fail';
  failReason?: string;
}

export interface UserOperationLog {
  id: string;
  operationTime: string;
  action: string;
  module: string;
  operator: string;
  ip: string;
  details: string;
}

export interface UserAppIdentityRecord {
  appId: string;
  appCode: string;
  appName: string;
  appShortName: string;
  appStatus: 'active' | 'disabled' | 'unpublished' | 'published';
  // 用户在该应用中的开通状态：启用、未关注、已取消关注、锁定
  status: 'active' | 'unfollowed' | 'canceled_follow' | 'locked';
  // 所在应用角色
  roleName: string;
  roleCode: string;
  // 邀请人是谁（激活时填写的姓名）
  inviterName: string;
  inviterRole?: string;
  inviterType?: 'MT' | 'V8'; // MT: 系统管理员邀请，V8: 前端用户邀请
  // 激活时间
  activatedAt: string;
}

export interface InviterProfile {
  id: string;
  name: string;
  inviterType: 'MT' | 'V8'; // MT: 系统管理员，V8: 前端用户
  avatarBg: string;
  title: string;
  employeeNo: string;
  dept: string;
  org: string;
  phone: string;
  email: string;
  wechatId: string;
  totalInvited: number;
  lastActive: string;
  firstInviteDate: string;
  status: 'active' | 'leave';
}

export interface AppRolePermissionGroup {
  groupName: string;
  groupCode: string;
  permissions: {
    name: string;
    code: string;
    description: string;
    granted: boolean;
  }[];
}

export interface AppRolePermissionDetail {
  roleCode: string;
  roleName: string;
  description: string;
  groups: AppRolePermissionGroup[];
}

export interface AppAccountUserRecord {
  id: string;
  avatarBg: string;
  avatarText: string;
  wechatNickname: string;
  realName: string;
  mobile: string; // 手机号（为空代表未实名）
  openId: string;
  unionId: string;
  // 机构信息
  orgShortName: string;
  orgFullName: string;
  statUnit: string;
  creditCode: string;
  firstAddedTime: string;
  provinceCityDistrict: string;
  orgLevel: string;
  statUnitPath: string;
  custCategory: string;
  salesPerson: string;
  // 用户状态与首次激活
  status: 'normal' | 'unsubscribed' | 'locked' | 'deleted';
  firstActivateDate: string; // 首次激活日期 (YYYY-MM-DD)
  activeDays: number; // 已激活天数
  // 管理员专属备注与日志
  userRemark?: string; // 仅 MT 管理员可见
  loginLogs?: UserLoginLog[];
  operationLogs?: UserOperationLog[];
  // 各应用身份列表
  appIdentities?: UserAppIdentityRecord[];
}

// 统计单元候选名单
export const APP_STAT_UNITS = [
  '康奈总部',
  '川藏区域',
  '东北区域',
  '四川区域',
  '陕西区域',
  '陕西一区',
  '陕西二区',
  '宁甘区域',
  '甘肃区域',
  '新疆区域',
  '海南区域',
  '广东区域',
];

// 销售经理库
export const SALES_MANAGERS = ['夏小花', '原婕', '徐德宏', '周主管', '李强', '张经理', '王经理', '陈主管'];

// 机构候选名单及详实元数据
export const SAMPLE_ORGS_DATA = [
  {
    shortName: '静安融媒',
    fullName: '上海市静安区融媒体中心',
    statUnit: '康奈总部',
    creditCode: '12310106MB1928374X',
    firstAddedTime: '2023-04-12',
    provinceCityDistrict: '上海市-市辖区-静安区',
    orgLevel: '区县级机构',
    statUnitPath: '华东区域-上海区域-静安区域',
    custCategory: '一类客户',
    salesPerson: '张经理'
  },
  {
    shortName: '陕西大数据',
    fullName: '陕西省大数据发展管理局',
    statUnit: '陕西区域',
    creditCode: '11610000MB1839201A',
    firstAddedTime: '2022-08-19',
    provinceCityDistrict: '陕西省-西安市-雁塔区',
    orgLevel: '省级机构',
    statUnitPath: '西北区域-陕西区域-西安本部',
    custCategory: '一类客户',
    salesPerson: '夏小花'
  },
  {
    shortName: '苏州微电子',
    fullName: '苏州工业园区微电子集成电路有限公司',
    statUnit: '康奈总部',
    creditCode: '91320594MA1T89402X',
    firstAddedTime: '2023-11-05',
    provinceCityDistrict: '江苏省-苏州市-姑苏区',
    orgLevel: '地市级机构',
    statUnitPath: '华东区域-江苏区域-苏州园区',
    custCategory: '二类客户',
    salesPerson: '原婕'
  },
  {
    shortName: '北京数字政务',
    fullName: '北京市智慧城市数字政务运营中心',
    statUnit: '东北区域',
    creditCode: '11110000MB1662991P',
    firstAddedTime: '2021-12-01',
    provinceCityDistrict: '北京市-市辖区-海淀区',
    orgLevel: '省级机构',
    statUnitPath: '华北区域-北京区域-海淀政务',
    custCategory: '一类客户',
    salesPerson: '徐德宏'
  },
  {
    shortName: '前海金科',
    fullName: '深圳前海金融科技创新实验室',
    statUnit: '广东区域',
    creditCode: '91440300MA5EXY772L',
    firstAddedTime: '2024-01-10',
    provinceCityDistrict: '广东省-深圳市-南山区',
    orgLevel: '地市级机构',
    statUnitPath: '华南区域-广东区域-前海特区',
    custCategory: '一类客户',
    salesPerson: '周主管'
  },
  {
    shortName: '广州交规院',
    fullName: '广州市城市交通规划设计研究院',
    statUnit: '广东区域',
    creditCode: '91440101MA59K0112D',
    firstAddedTime: '2023-06-20',
    provinceCityDistrict: '广东省-广州市-天河区',
    orgLevel: '地市级机构',
    statUnitPath: '华南区域-广东区域-广州本部',
    custCategory: '二类客户',
    salesPerson: '李强'
  },
  {
    shortName: '天府软件园',
    fullName: '成都天府软件产业园发展有限公司',
    statUnit: '四川区域',
    creditCode: '91510100789211029K',
    firstAddedTime: '2022-05-18',
    provinceCityDistrict: '四川省-成都市-武侯区',
    orgLevel: '地市级机构',
    statUnitPath: '西南区域-四川区域-成都高新',
    custCategory: '一类客户',
    salesPerson: '王经理'
  },
  {
    shortName: '高新航测所',
    fullName: '西安高新区航空航天测控技术研究所',
    statUnit: '陕西一区',
    creditCode: '12610100MB1992019Q',
    firstAddedTime: '2023-09-08',
    provinceCityDistrict: '陕西省-西安市-高新区',
    orgLevel: '区县级机构',
    statUnitPath: '西北区域-陕西区域-高新分部',
    custCategory: '二类客户',
    salesPerson: '陈主管'
  },
  {
    shortName: '武汉数投',
    fullName: '武汉长江数字产业投资集团',
    statUnit: '川藏区域',
    creditCode: '91420100MA4KYY102M',
    firstAddedTime: '2024-03-12',
    provinceCityDistrict: '湖北省-武汉市-江岸区',
    orgLevel: '地市级机构',
    statUnitPath: '华中区域-湖北区域-长江中台',
    custCategory: '二类客户',
    salesPerson: '夏小花'
  },
  {
    shortName: '青岛海洋监测',
    fullName: '青岛市海洋生态环境监测科研中心',
    statUnit: '东北区域',
    creditCode: '12370200MB1509281W',
    firstAddedTime: '2022-10-15',
    provinceCityDistrict: '山东省-青岛市-市南区',
    orgLevel: '地市级机构',
    statUnitPath: '华北区域-山东区域-青岛海防',
    custCategory: '三类客户',
    salesPerson: '原婕'
  },
  {
    shortName: '江北新材料',
    fullName: '南京江北新区新材料产业技术研究院',
    statUnit: '陕西二区',
    creditCode: '91320191MA1YY8921B',
    firstAddedTime: '2023-07-28',
    provinceCityDistrict: '江苏省-南京市-浦口区',
    orgLevel: '区县级机构',
    statUnitPath: '华东区域-江苏区域-江北新区',
    custCategory: '三类机构',
    salesPerson: '徐德宏'
  },
  {
    shortName: '西湖文旅服务站',
    fullName: '杭州市西湖区文旅融媒体传播服务站',
    statUnit: '宁甘区域',
    creditCode: '12330106MB1029481E',
    firstAddedTime: '2024-02-14',
    provinceCityDistrict: '浙江省-杭州市-西湖区',
    orgLevel: '区县级机构',
    statUnitPath: '华东区域-浙江区域-西湖文旅',
    custCategory: '二类客户',
    salesPerson: '周主管'
  },
  {
    shortName: '海南自贸创新港',
    fullName: '海南自贸港数字经济创新产业园',
    statUnit: '海南区域',
    creditCode: '91460000MA5U01928K',
    firstAddedTime: '2023-12-01',
    provinceCityDistrict: '海南省-海口市-美兰区',
    orgLevel: '省级机构',
    statUnitPath: '华南区域-海南区域-海口自贸',
    custCategory: '一类客户',
    salesPerson: '李强'
  },
  {
    shortName: '兰州丝路数科',
    fullName: '甘肃丝路数智信息技术有限公司',
    statUnit: '甘肃区域',
    creditCode: '91620100MA7KYY881F',
    firstAddedTime: '2024-04-18',
    provinceCityDistrict: '甘肃省-兰州市-城关区',
    orgLevel: '地市级机构',
    statUnitPath: '西北区域-甘肃区域-丝路枢纽',
    custCategory: '三类客户',
    salesPerson: '张经理'
  },
  {
    shortName: '乌鲁木齐天山物联',
    fullName: '新疆天山数字物联网科技有限公司',
    statUnit: '新疆区域',
    creditCode: '91650100MA7GXX192T',
    firstAddedTime: '2023-05-30',
    provinceCityDistrict: '新疆维吾尔自治区-乌鲁木齐市-新市区',
    orgLevel: '地市级机构',
    statUnitPath: '西北区域-新疆区域-天山中台',
    custCategory: '三类客户',
    salesPerson: '王经理'
  },
];

// 姓名与微信昵称候选
export const SAMPLE_USERS = [
  { nick: '风清扬', name: '张海林', bg: 'bg-blue-600', mobile: '13811223344' },
  { nick: '山水清晖', name: '李晓晨', bg: 'bg-indigo-600', mobile: '13922334455' },
  { nick: '晨曦微光', name: '王敏', bg: 'bg-emerald-600', mobile: '13733445566' },
  { nick: '追风少年', name: '陈建国', bg: 'bg-teal-600', mobile: '13644556677' },
  { nick: '静水流深', name: '赵志刚', bg: 'bg-cyan-700', mobile: '' }, // 未实名测试
  { nick: '云卷云舒', name: '谢雨菲', bg: 'bg-purple-600', mobile: '13366778899' },
  { nick: '落霞秋水', name: '周子墨', bg: 'bg-amber-600', mobile: '15811223344' },
  { nick: '浩然正气', name: '刘海波', bg: 'bg-rose-600', mobile: '15922334455' },
  { nick: '天高云淡', name: '陈立伟', bg: 'bg-blue-700', mobile: '' }, // 未实名测试
  { nick: '乘风破浪', name: '吴东升', bg: 'bg-emerald-700', mobile: '18844556677' },
  { nick: '星河璀璨', name: '杨建林', bg: 'bg-indigo-700', mobile: '17755667788' },
  { nick: '凌云之志', name: '魏思源', bg: 'bg-teal-700', mobile: '17366778899' },
  { nick: '清风徐来', name: '冯德华', bg: 'bg-slate-700', mobile: '19911223344' },
  { nick: '明镜高悬', name: '徐志明', bg: 'bg-cyan-800', mobile: '' }, // 未实名测试
  { nick: '大浪淘沙', name: '郑雅琴', bg: 'bg-purple-700', mobile: '13133445566' },
  { nick: '一苇以航', name: '孙立强', bg: 'bg-blue-800', mobile: '13244556677' },
  { nick: '千帆竞发', name: '韩雪松', bg: 'bg-emerald-800', mobile: '15055667788' },
  { nick: '行稳致远', name: '黄嘉诚', bg: 'bg-indigo-800', mobile: '15166778899' },
  { nick: '登峰造极', name: '朱思雨', bg: 'bg-rose-700', mobile: '18011223344' },
  { nick: '沧海一粟', name: '何文俊', bg: 'bg-teal-800', mobile: '18122334455' },
];

// 格式化隐藏中间四位手机号，如 138****3344
export const maskMobile = (phone: string): string => {
  if (!phone || phone.length < 11) return phone;
  return `${phone.substring(0, 3)}****${phone.substring(7)}`;
};

// 邀请人档案库
export const SYSTEM_INVITERS: Record<string, InviterProfile> = {
  '张伟': {
    id: 'INV-01',
    name: '张伟',
    inviterType: 'MT',
    avatarBg: 'bg-blue-600',
    title: '资深客户经理 / 架构顾问',
    employeeNo: 'EMP-20230819',
    dept: '华东客户管理与技术支持部',
    org: '康奈总部',
    phone: '13812345678',
    email: 'zhangwei@konne.cn',
    wechatId: 'wx_zw_manager',
    totalInvited: 142,
    lastActive: '5分钟前',
    firstInviteDate: '2024-01-15',
    status: 'active'
  },
  '夏小花': {
    id: 'INV-02',
    name: '夏小花',
    inviterType: 'MT',
    avatarBg: 'bg-rose-600',
    title: '区域运营总监 / 客户成功经理',
    employeeNo: 'EMP-20220311',
    dept: '西北区域市场与生态拓展部',
    org: '陕西区域中心',
    phone: '13988776655',
    email: 'xiaxiaohua@konne.cn',
    wechatId: 'wx_xxh_northwest',
    totalInvited: 218,
    lastActive: '12分钟前',
    firstInviteDate: '2023-08-10',
    status: 'active'
  },
  '原婕': {
    id: 'INV-03',
    name: '原婕',
    inviterType: 'MT',
    avatarBg: 'bg-purple-600',
    title: '高级业务顾问 / 重点客户经理',
    employeeNo: 'EMP-20231102',
    dept: '政企客户服务一部',
    org: '康奈总部',
    phone: '13766554433',
    email: 'yuanjie@konne.cn',
    wechatId: 'wx_yj_advisor',
    totalInvited: 96,
    lastActive: '30分钟前',
    firstInviteDate: '2024-03-01',
    status: 'active'
  },
  '徐德宏': {
    id: 'INV-04',
    name: '徐德宏',
    inviterType: 'MT',
    avatarBg: 'bg-emerald-600',
    title: '技术预警实施主管',
    employeeNo: 'EMP-20210915',
    dept: '华北技术支持与交付部',
    org: '北京区域中心',
    phone: '13655443322',
    email: 'xudehong@konne.cn',
    wechatId: 'wx_xdh_delivery',
    totalInvited: 165,
    lastActive: '1小时前',
    firstInviteDate: '2023-05-20',
    status: 'active'
  },
  '周主管': {
    id: 'INV-05',
    name: '周主管',
    inviterType: 'MT',
    avatarBg: 'bg-amber-600',
    title: '生态拓展部主管',
    employeeNo: 'EMP-20220618',
    dept: '华南大区渠道拓展中心',
    org: '广东区域中心',
    phone: '15899887766',
    email: 'zhouzg@konne.cn',
    wechatId: 'wx_zzg_south',
    totalInvited: 180,
    lastActive: '刚刚',
    firstInviteDate: '2023-11-12',
    status: 'active'
  },
  '李强': {
    id: 'INV-06',
    name: '李强',
    inviterType: 'MT',
    avatarBg: 'bg-teal-600',
    title: '网络生态综合治理实施经理',
    employeeNo: 'EMP-20230405',
    dept: '南区技术实施二组',
    org: '广东区域中心',
    phone: '15911223344',
    email: 'liqiang@konne.cn',
    wechatId: 'wx_lq_tech',
    totalInvited: 110,
    lastActive: '2小时前',
    firstInviteDate: '2024-02-18',
    status: 'active'
  },
  '王经理': {
    id: 'INV-07',
    name: '王经理',
    inviterType: 'MT',
    avatarBg: 'bg-indigo-600',
    title: '政务云与生态互联技术顾问',
    employeeNo: 'EMP-20220920',
    dept: '西南大区客户服务部',
    org: '四川区域中心',
    phone: '18822334455',
    email: 'wangjl@konne.cn',
    wechatId: 'wx_wjl_cloud',
    totalInvited: 135,
    lastActive: '3小时前',
    firstInviteDate: '2023-09-15',
    status: 'active'
  },
  '陈主管': {
    id: 'INV-08',
    name: '陈主管',
    inviterType: 'MT',
    avatarBg: 'bg-cyan-600',
    title: '行业解决方案专家',
    employeeNo: 'EMP-20211208',
    dept: '陕晋蒙技术交付中心',
    org: '陕西一区中心',
    phone: '17733445566',
    email: 'chenzg@konne.cn',
    wechatId: 'wx_czg_sol',
    totalInvited: 88,
    lastActive: '1天前',
    firstInviteDate: '2023-12-05',
    status: 'active'
  },
  '赵组长': {
    id: 'INV-09',
    name: '赵组长',
    inviterType: 'V8',
    avatarBg: 'bg-violet-600',
    title: '融媒运维组长 / 机构主管理员',
    employeeNo: 'ORG-USER-0012',
    dept: '信息技术部 / 协同工作组',
    org: '静安区融媒体中心',
    phone: '13511223388',
    email: 'zhao_lead@jingan.gov.cn',
    wechatId: 'wx_zhao_lead',
    totalInvited: 46,
    lastActive: '10分钟前',
    firstInviteDate: '2024-02-10',
    status: 'active'
  },
  '孙晓亮': {
    id: 'INV-10',
    name: '孙晓亮',
    inviterType: 'V8',
    avatarBg: 'bg-fuchsia-600',
    title: '大数据专员 / 前端应用协调人',
    employeeNo: 'ORG-USER-0089',
    dept: '数据管理中心',
    org: '陕西省大数据发展管理局',
    phone: '18677889900',
    email: 'sunxl@shaanxi.gov.cn',
    wechatId: 'wx_sun_data',
    totalInvited: 32,
    lastActive: '45分钟前',
    firstInviteDate: '2024-01-20',
    status: 'active'
  },
  '钱主管': {
    id: 'INV-11',
    name: '钱主管',
    inviterType: 'V8',
    avatarBg: 'bg-pink-600',
    title: '安全协同业务负责人',
    employeeNo: 'ORG-USER-0155',
    dept: '网络安全处',
    org: '海南省大数据管理局',
    phone: '13944556677',
    email: 'qianzg@hainan.gov.cn',
    wechatId: 'wx_qian_sec',
    totalInvited: 28,
    lastActive: '2小时前',
    firstInviteDate: '2024-03-05',
    status: 'active'
  }
};

// 角色权限清单库 (仅查看)
export const SYSTEM_ROLE_PERMISSIONS: Record<string, AppRolePermissionDetail> = {
  'ROLE_ADMIN': {
    roleCode: 'ROLE_ADMIN',
    roleName: '超级管理员 (系统最高权)',
    description: '拥有该应用的全部业务模块访问、接口调度、数据导出与人员授权权限。',
    groups: [
      {
        groupName: '事件感知与全景态势监控',
        groupCode: 'PERM:SITUATION:MONITOR',
        permissions: [
          { name: '态势大屏实时数据访问与刷新', code: 'situation:screen:view', description: '允许实时查看态势感知大屏可视化图表、刷新态势监控指标与轮播大屏。', granted: true },
          { name: '安全态势综合预警雷达图', code: 'situation:radar:view', description: '支持查看实时多维威胁雷达分析与风险指数评估。', granted: true },
          { name: '全域事件态势热力分布地图', code: 'situation:heatmap:view', description: '查看全国及省市区县各级安全事件分布热力图谱。', granted: true }
        ]
      },
      {
        groupName: '业务研判与智能预警处置',
        groupCode: 'PERM:JUDGE:WARNING',
        permissions: [
          { name: '实时预警信息检索与筛选', code: 'warning:list:query', description: '支持按关键字、威胁等级、时间跨度检索全部实时预警事件。', granted: true },
          { name: '预警事件深度研判与研判报告导出', code: 'warning:judge:export', description: '对选定预警事件执行AI/人工多维协同研判并生成PDF/Word研判分析报告。', granted: true },
          { name: '协同督办指令下达与闭环流转', code: 'warning:order:dispatch', description: '向相关责任单位及值班人员下达督办流转指令，追踪处理结果闭环。', granted: true }
        ]
      },
      {
        groupName: '系统配置与审计授权管理',
        groupCode: 'PERM:SYSTEM:CONFIG',
        permissions: [
          { name: '应用全局参数与策略配置', code: 'system:config:manage', description: '管理阈值规则、预警级别划分、Webhook与API网关通道。', granted: true },
          { name: '用户角色权限分配与授权', code: 'system:role:assign', description: '为机构内部账号分配应用角色与操作权限。', granted: true },
          { name: '全量操作日志与安全审计查看', code: 'system:audit:log', description: '查看全量登录日志、指令流转日志及敏感操作追踪记录。', granted: true }
        ]
      }
    ]
  },
  'ROLE_BIZ_AUDITOR': {
    roleCode: 'ROLE_BIZ_AUDITOR',
    roleName: '业务研判与处置审核员',
    description: '负责核心业务研判审核、预警事件流转、督办指令下达与闭环处理。',
    groups: [
      {
        groupName: '事件感知与全景态势监控',
        groupCode: 'PERM:SITUATION:MONITOR',
        permissions: [
          { name: '态势大屏实时数据访问与刷新', code: 'situation:screen:view', description: '允许实时查看态势感知大屏可视化图表、刷新态势监控指标。', granted: true },
          { name: '全域事件态势热力分布地图', code: 'situation:heatmap:view', description: '查看全国及省市区县各级安全事件分布热力图谱。', granted: true }
        ]
      },
      {
        groupName: '业务研判与智能预警处置',
        groupCode: 'PERM:JUDGE:WARNING',
        permissions: [
          { name: '实时预警信息检索与筛选', code: 'warning:list:query', description: '支持按关键字、威胁等级检索实时预警事件。', granted: true },
          { name: '预警事件深度研判与研判报告导出', code: 'warning:judge:export', description: '对选定预警事件执行研判并生成报告。', granted: true },
          { name: '协同督办指令下达与闭环流转', code: 'warning:order:dispatch', description: '下达督办流转指令，追踪处理结果闭环。', granted: true }
        ]
      },
      {
        groupName: '系统配置与审计授权管理',
        groupCode: 'PERM:SYSTEM:CONFIG',
        permissions: [
          { name: '全量操作日志与安全审计查看', code: 'system:audit:log', description: '查看本人及相关业务的操作日志记录。', granted: true }
        ]
      }
    ]
  },
  'ROLE_DATA_ANALYST': {
    roleCode: 'ROLE_DATA_ANALYST',
    roleName: '数据分析与监控专员',
    description: '负责实时态势大屏查看、多维指标趋势分析以及业务报表查询导出。',
    groups: [
      {
        groupName: '事件感知与全景态势监控',
        groupCode: 'PERM:SITUATION:MONITOR',
        permissions: [
          { name: '态势大屏实时数据访问与刷新', code: 'situation:screen:view', description: '允许实时查看态势感知大屏可视化图表、刷新态势监控指标。', granted: true },
          { name: '安全态势综合预警雷达图', code: 'situation:radar:view', description: '支持查看实时多维威胁雷达分析。', granted: true },
          { name: '全域事件态势热力分布地图', code: 'situation:heatmap:view', description: '查看各级安全事件分布热力图谱。', granted: true }
        ]
      },
      {
        groupName: '业务研判与智能预警处置',
        groupCode: 'PERM:JUDGE:WARNING',
        permissions: [
          { name: '实时预警信息检索与筛选', code: 'warning:list:query', description: '支持按关键字检索实时预警事件。', granted: true },
          { name: '预警事件深度研判与研判报告导出', code: 'warning:judge:export', description: '导出数据分析图表与统计表格。', granted: true }
        ]
      }
    ]
  },
  'ROLE_OPERATOR': {
    roleCode: 'ROLE_OPERATOR',
    roleName: '运营指挥员',
    description: '负责日常预警跟进、指挥调度协调与即时消息触达。',
    groups: [
      {
        groupName: '事件感知与全景态势监控',
        groupCode: 'PERM:SITUATION:MONITOR',
        permissions: [
          { name: '态势大屏实时数据访问与刷新', code: 'situation:screen:view', description: '允许实时查看态势监控图表。', granted: true }
        ]
      },
      {
        groupName: '业务研判与智能预警处置',
        groupCode: 'PERM:JUDGE:WARNING',
        permissions: [
          { name: '实时预警信息检索与筛选', code: 'warning:list:query', description: '检索日常预警条目。', granted: true },
          { name: '协同督办指令下达与闭环流转', code: 'warning:order:dispatch', description: '下发日常流转通知与调度。', granted: true }
        ]
      }
    ]
  },
  'ROLE_READONLY_AUDIT': {
    roleCode: 'ROLE_READONLY_AUDIT',
    roleName: '只读审计与巡检员',
    description: '仅具备只读访问大屏与历史记录权限，无增删改及导出操作权限。',
    groups: [
      {
        groupName: '事件感知与全景态势监控',
        groupCode: 'PERM:SITUATION:MONITOR',
        permissions: [
          { name: '态势大屏实时数据访问与刷新', code: 'situation:screen:view', description: '允许只读查看态势大屏可视化图表。', granted: true }
        ]
      },
      {
        groupName: '业务研判与智能预警处置',
        groupCode: 'PERM:JUDGE:WARNING',
        permissions: [
          { name: '实时预警信息检索与筛选', code: 'warning:list:query', description: '只读检索预警列表。', granted: true }
        ]
      }
    ]
  }
};

// 系统全量应用预设列表（用于生成各应用身份）
export const SYSTEM_APPS_DEFINITIONS = [
  { appId: 'app-01', appCode: 'V8-P-01', appName: '正管用 - 网络生态综合治理平台', appShortName: '正管用', appStatus: 'active' as const },
  { appId: 'app-02', appCode: 'V8-P-02', appName: '谛听预警 - 双智协同全媒体态势感知预警系统', appShortName: '谛听预警', appStatus: 'active' as const },
  { appId: 'app-03', appCode: 'V8-P-03', appName: '河图融媒体 - 双智协同全媒体传播分析系统', appShortName: '河图融媒体', appStatus: 'active' as const },
  { appId: 'app-04', appCode: 'V8-P-04', appName: '极速舆情 - 互联网舆情监测预警系统', appShortName: '极速舆情', appStatus: 'active' as const },
  { appId: 'app-05', appCode: 'V8-P-05', appName: '数解舆情 - 双智慧（R）全媒体平台信息监测预警系统', appShortName: '数解舆情', appStatus: 'active' as const },
  { appId: 'app-06', appCode: 'V8-P-06', appName: '牧网守正 - 属地网络内容生态治理系统', appShortName: '牧网守正', appStatus: 'active' as const },
  { appId: 'app-07', appCode: 'V8-P-07', appName: '全球眼 - 境外公开信息监测预警系统', appShortName: '全球眼', appStatus: 'active' as const },
  { appId: 'app-09', appCode: 'V8-P-09', appName: '点点密信 - 跨平台加密即时通讯系统', appShortName: '点点密信', appStatus: 'published' as const },
  { appId: 'app-11', appCode: 'V8-P-11', appName: '观澜热媒 - 互联网热榜监测分析系统', appShortName: '观澜热媒', appStatus: 'active' as const },
  { appId: 'app-13', appCode: 'V8-P-13', appName: '百战演练 - 社会治理虚拟仿真演练系统', appShortName: '百战演练', appStatus: 'active' as const },
  { appId: 'app-14', appCode: 'V8-M-14', appName: '全网搜 - 全媒体即时搜索引擎', appShortName: '全网搜', appStatus: 'active' as const },
  { appId: 'app-15', appCode: 'V8-M-15', appName: '消息中心 - 全域多渠道统一消息通知中枢', appShortName: '消息中心', appStatus: 'active' as const },
  { appId: 'app-16', appCode: 'V8-M-16', appName: '数据仓库 - 企业统一湖仓一体指标与数据中枢', appShortName: '数据仓库', appStatus: 'active' as const },
  { appId: 'app-17', appCode: 'V8-P-17', appName: '网络指令上传下达系统', appShortName: '指令流转', appStatus: 'active' as const },
  // 停用应用
  { appId: 'app-08', appCode: 'V8-P-08', appName: '看讯 - 互联网视频与直播监测分析系统', appShortName: '看讯', appStatus: 'unpublished' as const },
  { appId: 'app-10', appCode: 'V8-P-10', appName: '点点速报 - 清朗净网鉴谣速报系统', appShortName: '点点速报', appStatus: 'unpublished' as const },
  { appId: 'app-12', appCode: 'V8-P-12', appName: '点点速评 - 网络宣传指挥效果分析系统', appShortName: '点点速评', appStatus: 'disabled' as const }
];

// 生成应用账号独立数据 (不与V8用户数据库联动)
export const generateMockAppAccounts = (): AppAccountUserRecord[] => {
  const list: AppAccountUserRecord[] = [];
  const statuses: ('normal' | 'unsubscribed' | 'locked' | 'deleted')[] = [
    'normal', 'normal', 'normal', 'normal', 'normal', 'unsubscribed', 'locked', 'deleted'
  ];

  const rolePool = [
    { code: 'ROLE_ADMIN', name: '超级管理员 (系统最高权)' },
    { code: 'ROLE_BIZ_AUDITOR', name: '业务研判与处置审核员' },
    { code: 'ROLE_DATA_ANALYST', name: '数据分析与监控专员' },
    { code: 'ROLE_OPERATOR', name: '运营指挥员' },
    { code: 'ROLE_READONLY_AUDIT', name: '只读审计与巡检员' }
  ];

  for (let i = 1; i <= 180; i++) {
    const userSeed = SAMPLE_USERS[(i - 1) % SAMPLE_USERS.length];
    const orgSeed = SAMPLE_ORGS_DATA[(i - 1) % SAMPLE_ORGS_DATA.length];
    const status = statuses[(i * 7 + 3) % statuses.length];

    const activeDays = Math.floor(Math.random() * 500) + 12;
    const activateDate = new Date(Date.now() - activeDays * 86400000);
    const dateStr = activateDate.toISOString().split('T')[0];

    const mockLoginLogs: UserLoginLog[] = [
      {
        id: `LOG-IN-${i}-1`,
        loginTime: new Date(Date.now() - (i % 5) * 3600000 - 1200000).toISOString().replace('T', ' ').substring(0, 19),
        ip: `117.136.${(i * 13) % 250 + 1}.${(i * 27) % 250 + 1}`,
        location: orgSeed.provinceCityDistrict.split('-')[0] + (orgSeed.provinceCityDistrict.split('-')[1] || ''),
        device: i % 2 === 0 ? 'iPhone 15 Pro (iOS 17.4)' : 'Huawei Mate 60 Pro (HarmonyOS 4.0)',
        clientType: i % 3 === 0 ? '微信内嵌浏览器' : 'MT移动工作台',
        status: 'success'
      },
      {
        id: `LOG-IN-${i}-2`,
        loginTime: new Date(Date.now() - (i % 3 + 1) * 86400000 - 14400000).toISOString().replace('T', ' ').substring(0, 19),
        ip: `183.214.${(i * 17) % 250 + 1}.${(i * 31) % 250 + 1}`,
        location: orgSeed.provinceCityDistrict.split('-')[0],
        device: 'Windows 11 (Chrome 122.0)',
        clientType: 'Web客户端',
        status: 'success'
      },
      {
        id: `LOG-IN-${i}-3`,
        loginTime: new Date(Date.now() - (i % 4 + 3) * 86400000 - 28800000).toISOString().replace('T', ' ').substring(0, 19),
        ip: `221.226.${(i * 19) % 250 + 1}.${(i * 41) % 250 + 1}`,
        location: orgSeed.provinceCityDistrict.split('-')[0],
        device: 'MacBook Pro (Safari 17.2)',
        clientType: 'Web客户端',
        status: i % 7 === 0 ? 'fail' : 'success',
        failReason: i % 7 === 0 ? '密码连续输错2次' : undefined
      }
    ];

    const mockOperationLogs: UserOperationLog[] = [
      {
        id: `OP-${i}-1`,
        operationTime: new Date(Date.now() - (i % 4) * 3600000 - 600000).toISOString().replace('T', ' ').substring(0, 19),
        action: '访问应用指令看板',
        module: '指令协同/MT看板',
        operator: userSeed.name || userSeed.nick,
        ip: `117.136.${(i * 13) % 250 + 1}.${(i * 27) % 250 + 1}`,
        details: '用户进入系统控制台并查看当日指令待办事项列表。'
      },
      {
        id: `OP-${i}-2`,
        operationTime: new Date(Date.now() - (i % 2 + 1) * 86400000 - 7200000).toISOString().replace('T', ' ').substring(0, 19),
        action: '导出机构数据明细',
        module: '数据中台/报表导出',
        operator: userSeed.name || userSeed.nick,
        ip: `183.214.${(i * 17) % 250 + 1}.${(i * 31) % 250 + 1}`,
        details: `导出【${orgSeed.shortName}】2026年Q1度应用指令交互统计表（XLSX格式）。`
      },
      {
        id: `OP-${i}-3`,
        operationTime: new Date(Date.now() - (i % 5 + 2) * 86400000 - 18000000).toISOString().replace('T', ' ').substring(0, 19),
        action: '更新个人偏好设置',
        module: '个人中心/安全配置',
        operator: userSeed.name || userSeed.nick,
        ip: `221.226.${(i * 19) % 250 + 1}.${(i * 41) % 250 + 1}`,
        details: '开启了微信模板消息自动推送通知服务。'
      }
    ];

    const defaultRemarks = [
      '客户核心对接人，已开通一级数据看板查询权限。',
      '财务对账指定联系人，每周一需同步对账清单。',
      '技术负责人，具备跨系统API指令调用授权。',
      '区域业务骨干，负责协调本地媒体下发指令。',
      ''
    ];

    const inviterKeys = Object.keys(SYSTEM_INVITERS);
    const assignedSales = orgSeed.salesPerson || SALES_MANAGERS[i % SALES_MANAGERS.length];

    // 为每个应用生成该用户的身份记录
    const userAppIdentities: UserAppIdentityRecord[] = SYSTEM_APPS_DEFINITIONS.map((app, appIdx) => {
      // 确定用户在此应用下的状态：启用、未关注、已取消关注、锁定
      let appUserStatus: 'active' | 'unfollowed' | 'canceled_follow' | 'locked' = 'active';
      const hash = (i * 17 + appIdx * 11) % 100;
      if (hash < 55) {
        appUserStatus = 'active'; // 启用
      } else if (hash < 75) {
        appUserStatus = 'unfollowed'; // 未关注
      } else if (hash < 90) {
        appUserStatus = 'canceled_follow'; // 已取消关注
      } else {
        appUserStatus = 'locked'; // 锁定
      }

      // 如果应用本身是已停用的，大部分用户保持正常启用历史或未关注
      const roleItem = rolePool[(i + appIdx) % rolePool.length];
      const inviterName = inviterKeys[(i + appIdx * 3) % inviterKeys.length] || assignedSales;
      const inviterObj = SYSTEM_INVITERS[inviterName];
      const roleSuffix = inviterObj ? ` (${inviterObj.dept.substring(0, 4)})` : ' (客户经理)';

      const daysOffset = Math.floor((activeDays * (17 - appIdx)) / 17);
      const appActDate = new Date(Date.now() - Math.max(1, daysOffset) * 86400000);
      const appActDateStr = `${appActDate.toISOString().split('T')[0]} ${String(9 + (appIdx % 9)).padStart(2, '0')}:${String((appIdx * 13) % 60).padStart(2, '0')}:00`;

      return {
        appId: app.appId,
        appCode: app.appCode,
        appName: app.appName,
        appShortName: app.appShortName,
        appStatus: app.appStatus,
        status: appUserStatus,
        roleName: roleItem.name,
        roleCode: roleItem.code,
        inviterName: `${inviterName}${roleSuffix}`,
        inviterRole: inviterObj?.title || '客户经理',
        inviterType: inviterObj?.inviterType || ((i + appIdx) % 3 === 0 ? 'V8' : 'MT'),
        activatedAt: appUserStatus === 'unfollowed' ? '-' : appActDateStr
      };
    });

    list.push({
      id: `ACC-${1090000 + i}`,
      avatarBg: userSeed.bg,
      avatarText: (userSeed.name || userSeed.nick).substring(0, 1),
      wechatNickname: userSeed.nick + (i > SAMPLE_USERS.length ? `_${Math.floor(i / SAMPLE_USERS.length)}` : ''),
      realName: userSeed.name,
      mobile: userSeed.mobile,
      openId: `oXapp_${Math.random().toString(36).substring(2, 10)}_${i}`,
      unionId: `u_appunion_${i.toString().padStart(6, '0')}`,
      orgShortName: orgSeed.shortName,
      orgFullName: orgSeed.fullName,
      statUnit: orgSeed.statUnit,
      creditCode: orgSeed.creditCode,
      firstAddedTime: orgSeed.firstAddedTime,
      provinceCityDistrict: orgSeed.provinceCityDistrict,
      orgLevel: orgSeed.orgLevel,
      statUnitPath: orgSeed.statUnitPath,
      custCategory: orgSeed.custCategory,
      salesPerson: assignedSales,
      status: status,
      firstActivateDate: dateStr,
      activeDays: activeDays,
      userRemark: defaultRemarks[i % defaultRemarks.length],
      loginLogs: mockLoginLogs,
      operationLogs: mockOperationLogs,
      appIdentities: userAppIdentities
    });
  }

  return list;
};

export const INITIAL_APP_ACCOUNTS: AppAccountUserRecord[] = generateMockAppAccounts();

