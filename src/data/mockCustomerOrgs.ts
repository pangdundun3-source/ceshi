/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProvisionRecordItem {
  id: string;
  recordTime: string; // e.g. 2025-01-01 09:30
  type: '首次开通' | '版本升级' | '期限续费' | '开通试用' | '转正式版' | '功能变更';
  productId: string;
  productName: string;
  productVersion: string; // e.g. V2.0.0-Release
  licenseType: '正式版' | '试用版';
  validPeriod: string; // e.g. 2025-01-01 至 2027-12-31
  operator: string;
  remark?: string;
  status: '生效中' | '已到期' | '已升级';
}

export interface CustomerOrgSysSettings {
  customSystemTitle?: string;
  maxConcurrentSessions?: number;
  accountQuota?: number;
  storageQuotaGb?: number;
  sessionTimeoutMinutes?: number;
  isolationPolicy?: '租户独立分库' | '独立专区VPC' | '多租户逻辑隔离';
  enableIpWhitelist?: boolean;
  ipWhitelist?: string;
  enableMfa?: boolean;
  enableDataDesensitization?: boolean;
  enableMaintenanceNotice?: boolean;
  alertContactPhone?: string;
  alertContactEmail?: string;
}

export interface CustomerOrgExtUserConfig {
  idSource: '企业微信' | '钉钉' | '飞书' | '自建CAS/OAuth' | 'OIDC/LDAP';
  corpId: string;
  appSecret: string;
  callbackUrl: string;
  scope: string;
  accountMappingField: '手机号' | '工号' | '邮箱' | '外部UnionID';
  syncFrequency: '每小时' | '每4小时' | '每日凌晨' | '仅手动同步';
  defaultRole: string;
  allowGuestApply: boolean;
  dataScope: '仅本部门' | '全机构跨部门协同';
  lastTestedAt?: string;
  testStatus?: 'connected' | 'error' | 'untested';
  latencyMs?: number;
}

export interface CustomerOrgItem {
  id: string;
  orgName: string; // (a) 客户全称
  orgShortName?: string; // 客户简称
  orgCode: string; // (c) 客户唯一 ID
  creditCode: string; // (b) 统一社会代码
  region: string; // (d) 客户所在地区（省、市、县）
  customerCategory: '一类客户' | '二类客户' | '三类客户'; // (e) 客户所属分类
  customerLevel: '省级' | '地市级' | '区县级' | '三类客户'; // (f) 客户级别
  version: '正式版' | '试用版';
  productVersion?: string; // 软件版本号，如 V2.0.0-Release
  status: 'active' | 'expired' | 'disabled' | 'trash';
  isEnabled?: boolean;
  startDate: string;
  expireDate: string;
  statUnit: string; // 统计单元（来源于组织架构树）
  salesPerson: string; // 销售姓名
  salesPhone?: string;
  accountUsed?: number;
  accountLimit?: number;
  contactPerson?: string;
  contactPhone?: string;
  remark?: string; // 备注说明
  productId?: string; // 开通的产品（对应产品管理里的产品）
  productName?: string;
  productCode?: string;
  provisionRecords?: ProvisionRecordItem[]; // 开通流水记录
  sysSettings?: CustomerOrgSysSettings;
  extUserConfig?: CustomerOrgExtUserConfig;
}

export const PRODUCT_VERSIONS_MAP: Record<string, Array<{ version: string; tag: string; desc: string }>> = {
  'prod-tq': [
    { version: 'V2.0.0-Release', tag: '推荐稳定版', desc: '全功能多端协同指挥中心发布版' },
    { version: 'V2.0', tag: '标准版', desc: '特情处置与研判协同基准版本' },
    { version: 'V2.0.0-Intranet', tag: '专网版', desc: '物理专网高隔离应急专享版' },
    { version: 'V1.9.2', tag: '历史维护版', desc: '兼容旧版协议的长期支持版本' },
  ],
  'prod-ddsb': [
    { version: 'V1.8', tag: '推荐稳定版', desc: '鉴谣速报与快速处置协同系统生产版' },
    { version: 'V1.8.0-Beta', tag: '特性测试版', desc: '包含全渠道自动化线索聚合特性' },
    { version: 'V1.5.0', tag: '基础版', desc: '轻量化线索流转标准版' },
  ],
  'prod-zlsp': [
    { version: 'V3.2.0-Release', tag: '推荐稳定版', desc: '全网态势感知与智能网评引导体系企业版' },
    { version: 'V3.2', tag: '标准版', desc: '多端协同分析与快速研判基准版' },
    { version: 'V3.0.0', tag: '经典版', desc: '态势感知基础分析版本' },
  ]
};

// 统计单元选项清单（严格根据用户组织架构图节点构建）
export const STATISTICAL_UNITS = [
  '全部统计单元',
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
  '广东区域'
] as const;

// 初始客户机构数据集（涵盖 65 家机构，覆盖陕西与川藏大区各个统计单元）
export const INITIAL_CUSTOMER_ORGS: CustomerOrgItem[] = [
  {
    id: 'cust-01',
    orgName: '西安高新大数据资产运营有限公司',
    orgShortName: '西安高新数资',
    orgCode: 'CUST-SN-XA-001',
    creditCode: '91610131MA6U9821XA',
    region: '陕西省 · 西安市 · 雁塔区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-01',
    expireDate: '2027-12-31',
    statUnit: '康奈总部',
    salesPerson: '夏小花',
    accountUsed: 86,
    accountLimit: 120,
    contactPerson: '郑主任',
    contactPhone: '138****6688'
  },
  {
    id: 'cust-02',
    orgName: '西安曲江数字文旅产业集团有限公司',
    orgShortName: '曲江数旅',
    orgCode: 'CUST-SN-XA-002',
    creditCode: '91610133MA7A09232B',
    region: '陕西省 · 西安市 · 雁塔区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-15',
    expireDate: '2028-03-14',
    statUnit: '川藏区域',
    salesPerson: '原婕',
    accountUsed: 142,
    accountLimit: 200,
    contactPerson: '林总监',
    contactPhone: '139****1234'
  },
  {
    id: 'cust-03',
    orgName: '渭南市产业创新与现代农业物联网发展中心',
    orgShortName: '渭南农物联',
    orgCode: 'CUST-SN-WN-003',
    creditCode: '91610500MA6Y78311C',
    region: '陕西省 · 渭南市 · 临渭区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-06-01',
    expireDate: '2026-05-31',
    statUnit: '东北区域',
    salesPerson: '徐德宏',
    accountUsed: 45,
    accountLimit: 60,
    contactPerson: '王工',
    contactPhone: '137****9922'
  },
  {
    id: 'cust-04',
    orgName: '西安经开区智能车联网与智算创新中心',
    orgShortName: '西安经开智联',
    orgCode: 'CUST-SN-XA-004',
    creditCode: '91610112MA2849183K',
    region: '陕西省 · 西安市 · 未央区',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '试用版',
    status: 'expired',
    startDate: '2025-11-01',
    expireDate: '2026-02-01',
    statUnit: '四川区域',
    salesPerson: '徐德宏',
    accountUsed: 12,
    accountLimit: 20,
    contactPerson: '陈经理',
    contactPhone: '186****5566'
  },
  {
    id: 'cust-05',
    orgName: '铜川市数字新材料与产业赋能有限公司',
    orgShortName: '铜川数材',
    orgCode: 'CUST-SN-TC-005',
    creditCode: '91610200MA2773641B',
    region: '陕西省 · 铜川市 · 耀州区',
    customerCategory: '三类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'disabled',
    startDate: '2024-08-01',
    expireDate: '2025-08-01',
    statUnit: '陕西区域',
    salesPerson: '周主管',
    accountUsed: 0,
    accountLimit: 50,
    contactPerson: '周主管',
    contactPhone: '150****8899'
  },
  {
    id: 'cust-06',
    orgName: '延安市圣地红网感知与融媒运营中心',
    orgShortName: '延安红网',
    orgCode: 'CUST-SN-YA-006',
    creditCode: '91610600MA2B88274L',
    region: '陕西省 · 延安市 · 宝塔区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-01',
    expireDate: '2027-01-31',
    statUnit: '陕西一区',
    salesPerson: '李强',
    accountUsed: 110,
    accountLimit: 150,
    contactPerson: '孙部',
    contactPhone: '135****8821'
  },
  {
    id: 'cust-07',
    orgName: '安康市秦巴生态环境数字监测研究所',
    orgShortName: '安康秦巴生态',
    orgCode: 'CUST-SN-AK-007',
    creditCode: '91610900MA1H88219C',
    region: '陕西省 · 安康市 · 汉滨区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-10',
    expireDate: '2028-04-09',
    statUnit: '陕西二区',
    salesPerson: '张伟',
    accountUsed: 78,
    accountLimit: 100,
    contactPerson: '范经理',
    contactPhone: '136****5599'
  },
  {
    id: 'cust-08',
    orgName: '商洛市商山秦岭康养物联产业发展有限公司',
    orgShortName: '商洛康养物联',
    orgCode: 'CUST-SN-SL-008',
    creditCode: '91611000MA59K9281X',
    region: '陕西省 · 商洛市 · 商州区',
    customerCategory: '三类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-15',
    expireDate: '2027-01-14',
    statUnit: '宁甘区域',
    salesPerson: '张伟',
    accountUsed: 52,
    accountLimit: 80,
    contactPerson: '温总监',
    contactPhone: '189****3322'
  },
  {
    id: 'cust-09',
    orgName: '咸阳市现代装备制造与工业互联服务平台',
    orgShortName: '咸阳工互联',
    orgCode: 'CUST-SN-XY-009',
    creditCode: '91610400MA5FB7294D',
    region: '陕西省 · 咸阳市 · 秦都区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '试用版',
    status: 'expired',
    startDate: '2025-08-01',
    expireDate: '2025-11-01',
    statUnit: '甘肃区域',
    salesPerson: '刘洋',
    accountUsed: 18,
    accountLimit: 30,
    contactPerson: '何经理',
    contactPhone: '137****1188'
  },
  {
    id: 'cust-10',
    orgName: '汉中市天汉汉水数智水务运营中心',
    orgShortName: '汉中数智水务',
    orgCode: 'CUST-SN-HZ-010',
    creditCode: '91610700MA61M8823E',
    region: '陕西省 · 汉中市 · 汉台区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-01',
    expireDate: '2026-02-28',
    statUnit: '新疆区域',
    salesPerson: '刘洋',
    accountUsed: 65,
    accountLimit: 100,
    contactPerson: '严主任',
    contactPhone: '153****4455'
  },
  {
    id: 'cust-11',
    orgName: '宝鸡市钛产业集群工业大脑运营有限公司',
    orgShortName: '宝鸡钛业智脑',
    orgCode: 'CUST-SN-BJ-011',
    creditCode: '91610300MA5U98312F',
    region: '陕西省 · 宝鸡市 · 渭滨区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-05-01',
    expireDate: '2027-04-30',
    statUnit: '海南区域',
    salesPerson: '刘洋',
    accountUsed: 89,
    accountLimit: 120,
    contactPerson: '蒋秘书长',
    contactPhone: '180****7766'
  },
  {
    id: 'cust-12',
    orgName: '陕西省榆林能源化工数字化调度服务中心',
    orgShortName: '榆林能化调度',
    orgCode: 'CUST-SN-YL-012',
    creditCode: '91610800MA4K09218G',
    region: '陕西省 · 榆林市 · 榆阳区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-01',
    expireDate: '2027-03-31',
    statUnit: '广东区域',
    salesPerson: '赵天成',
    accountUsed: 135,
    accountLimit: 180,
    contactPerson: '程主任',
    contactPhone: '133****6677'
  },
  {
    id: 'cust-13',
    orgName: '绵阳市中国科技城激光产业创新发展平台',
    orgShortName: '绵阳科城激光',
    orgCode: 'CUST-SC-MY-013',
    creditCode: '91510700MA63N8274H',
    region: '四川省 · 绵阳市 · 涪城区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-20',
    expireDate: '2026-12-31',
    statUnit: '康奈总部',
    salesPerson: '陈敏',
    accountUsed: 42,
    accountLimit: 50,
    contactPerson: '白工',
    contactPhone: '138****0011'
  },
  {
    id: 'cust-14',
    orgName: '德阳市重型装备数字化制造创新中心',
    orgShortName: '德阳重装创新',
    orgCode: 'CUST-SC-DY-014',
    creditCode: '91510600MA4T77329J',
    region: '四川省 · 德阳市 · 旌阳区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-15',
    expireDate: '2027-02-14',
    statUnit: '川藏区域',
    salesPerson: '陈敏',
    accountUsed: 98,
    accountLimit: 120,
    contactPerson: '丁部长',
    contactPhone: '139****2233'
  },
  {
    id: 'cust-15',
    orgName: '巴中市光雾山绿色生态感知与林业数字化中心',
    orgShortName: '巴中林业感知',
    orgCode: 'CUST-SC-BZ-015',
    creditCode: '91511900MA7G88231K',
    region: '四川省 · 巴中市 · 巴州区',
    customerCategory: '三类客户',
    customerLevel: '区县级',
    version: '试用版',
    status: 'expired',
    startDate: '2025-09-01',
    expireDate: '2025-12-01',
    statUnit: '东北区域',
    salesPerson: '陈敏',
    accountUsed: 8,
    accountLimit: 20,
    contactPerson: '毛经理',
    contactPhone: '188****7788'
  },
  {
    id: 'cust-16',
    orgName: '广元市川北绿色铝产业基地物联网运营中心',
    orgShortName: '广元绿铝智联',
    orgCode: 'CUST-SC-GY-016',
    creditCode: '91510800MA66L9921M',
    region: '四川省 · 广元市 · 利州区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-05-10',
    expireDate: '2028-05-09',
    statUnit: '四川区域',
    salesPerson: '陈敏',
    accountUsed: 62,
    accountLimit: 80,
    contactPerson: '罗总',
    contactPhone: '185****9900'
  },
  {
    id: 'cust-17',
    orgName: '眉山市东坡智慧农业与竹产业科技研究院',
    orgShortName: '眉山东坡智农',
    orgCode: 'CUST-SC-MS-017',
    creditCode: '91511400MA68P7712N',
    region: '四川省 · 眉山市 · 东坡区',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-01',
    expireDate: '2027-02-28',
    statUnit: '陕西区域',
    salesPerson: '李晓波',
    accountUsed: 54,
    accountLimit: 80,
    contactPerson: '苏院长',
    contactPhone: '159****6655'
  },
  {
    id: 'cust-18',
    orgName: '乐山市峨眉山智慧景区与文旅数字化运营管理中心',
    orgShortName: '乐山峨眉智旅',
    orgCode: 'CUST-SC-LS-018',
    creditCode: '91511100MA65Q9812P',
    region: '四川省 · 乐山市 · 市中区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-10',
    expireDate: '2027-01-09',
    statUnit: '陕西一区',
    salesPerson: '李晓波',
    accountUsed: 128,
    accountLimit: 150,
    contactPerson: '段主任',
    contactPhone: '136****8811'
  },
  {
    id: 'cust-19',
    orgName: '宜宾市长江生态首城与动力电池产业大脑服务中心',
    orgShortName: '宜宾动力电池大脑',
    orgCode: 'CUST-SC-YB-019',
    creditCode: '91511500MA6AP2198R',
    region: '四川省 · 宜宾市 · 翠屏区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-15',
    expireDate: '2027-04-14',
    statUnit: '陕西二区',
    salesPerson: '王海涛',
    accountUsed: 115,
    accountLimit: 160,
    contactPerson: '谢总监',
    contactPhone: '138****3399'
  },
  {
    id: 'cust-20',
    orgName: '泸州市中国白酒金三角产业数字化交易中心',
    orgShortName: '泸州酒城数交',
    orgCode: 'CUST-SC-LZ-020',
    creditCode: '91510500MA6BT8845S',
    region: '四川省 · 泸州市 · 江阳区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-20',
    expireDate: '2027-02-19',
    statUnit: '宁甘区域',
    salesPerson: '王海涛',
    accountUsed: 88,
    accountLimit: 100,
    contactPerson: '古经理',
    contactPhone: '137****5522'
  },
  {
    id: 'cust-21',
    orgName: '南充市临江新区智能装备与先进制造中心',
    orgShortName: '南充临江智造',
    orgCode: 'CUST-SC-NC-021',
    creditCode: '91511300MA6CW9932T',
    region: '四川省 · 南充市 · 顺庆区',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-06-01',
    expireDate: '2026-11-30',
    statUnit: '甘肃区域',
    salesPerson: '郭峰',
    accountUsed: 46,
    accountLimit: 70,
    contactPerson: '常处长',
    contactPhone: '186****4411'
  },
  {
    id: 'cust-22',
    orgName: '达州市川东北能源化工与天然气综合调度中心',
    orgShortName: '达州气化调度',
    orgCode: 'CUST-SC-DZ-022',
    creditCode: '91511700MA6DX8812U',
    region: '四川省 · 达州市 · 通川区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-05',
    expireDate: '2028-01-04',
    statUnit: '新疆区域',
    salesPerson: '郭峰',
    accountUsed: 75,
    accountLimit: 90,
    contactPerson: '符总',
    contactPhone: '139****7722'
  },
  {
    id: 'cust-23',
    orgName: '成都市天府软件园数字孪生创新应用联合实验室',
    orgShortName: '成都天府软园',
    orgCode: 'CUST-SC-CD-023',
    creditCode: '91510100MA61M8823E',
    region: '四川省 · 成都市 · 武侯区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-01',
    expireDate: '2027-02-28',
    statUnit: '海南区域',
    salesPerson: '肖建军',
    accountUsed: 195,
    accountLimit: 250,
    contactPerson: '严主任',
    contactPhone: '153****4455'
  },
  {
    id: 'cust-24',
    orgName: '甘孜藏族自治州数字藏区与高原清洁能源监控平台',
    orgShortName: '甘孜清洁能源',
    orgCode: 'CUST-SC-GZ-024',
    creditCode: '91513300MA6EY7731V',
    region: '四川省 · 甘孜藏族自治州 · 康定市',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    version: '试用版',
    status: 'active',
    startDate: '2025-07-01',
    expireDate: '2026-07-01',
    statUnit: '广东区域',
    salesPerson: '肖建军',
    accountUsed: 30,
    accountLimit: 50,
    contactPerson: '扎西主任',
    contactPhone: '189****9988'
  },
  {
    id: 'cust-25',
    orgName: '西安电子科技大学智慧校园物联网协同中心',
    orgShortName: '西电智校物联',
    orgCode: 'CUST-SN-XA-025',
    creditCode: '91610100123488921A',
    region: '陕西省 · 西安市 · 长安区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-05-15',
    expireDate: '2028-05-14',
    statUnit: '康奈总部',
    salesPerson: '夏小花',
    accountUsed: 110,
    accountLimit: 150,
    contactPerson: '陆教授',
    contactPhone: '135****4477'
  },
  {
    id: 'cust-26',
    orgName: '陕西法士特汽车传动智能网联调度平台',
    orgShortName: '法士特车联',
    orgCode: 'CUST-SN-XA-026',
    creditCode: '91610000220588123B',
    region: '陕西省 · 西安市 · 莲湖区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-10',
    expireDate: '2027-02-09',
    statUnit: '川藏区域',
    salesPerson: '原婕',
    accountUsed: 165,
    accountLimit: 200,
    contactPerson: '马部长',
    contactPhone: '138****9966'
  },
  {
    id: 'cust-27',
    orgName: '陕西鼓风机集团工业能源数字运维运营公司',
    orgShortName: '陕鼓能源数维',
    orgCode: 'CUST-SN-XA-027',
    creditCode: '91610113MA6FZ9934C',
    region: '陕西省 · 西安市 · 临潼区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-20',
    expireDate: '2027-01-19',
    statUnit: '东北区域',
    salesPerson: '徐德宏',
    accountUsed: 88,
    accountLimit: 120,
    contactPerson: '贾经理',
    contactPhone: '137****1133'
  },
  {
    id: 'cust-28',
    orgName: '华阴市西岳华山数字索道与智慧客流安全监测站',
    orgShortName: '华山智慧客流',
    orgCode: 'CUST-SN-WN-028',
    creditCode: '91610582MA6GA7712D',
    region: '陕西省 · 渭南市 · 华阴市',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-01',
    expireDate: '2026-03-31',
    statUnit: '四川区域',
    salesPerson: '徐德宏',
    accountUsed: 35,
    accountLimit: 60,
    contactPerson: '孟主管',
    contactPhone: '180****5544'
  },
  {
    id: 'cust-29',
    orgName: '铜川照金红色旅游与文创物联科技发展中心',
    orgShortName: '照金红旅物联',
    orgCode: 'CUST-SN-TC-029',
    creditCode: '91610202MA6HB8821E',
    region: '陕西省 · 铜川市 · 耀州区',
    customerCategory: '三类客户',
    customerLevel: '区县级',
    version: '试用版',
    status: 'trash',
    startDate: '2024-06-01',
    expireDate: '2024-09-01',
    statUnit: '陕西区域',
    salesPerson: '周主管',
    accountUsed: 0,
    accountLimit: 15,
    contactPerson: '秦工',
    contactPhone: '158****2211'
  },
  {
    id: 'cust-30',
    orgName: '延川县梁家河数字乡村与现代特色农产电商平台',
    orgShortName: '梁家河数农',
    orgCode: 'CUST-SN-YA-030',
    creditCode: '91610622MA6JC9912F',
    region: '陕西省 · 延安市 · 延川县',
    customerCategory: '三类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-10',
    expireDate: '2027-03-09',
    statUnit: '陕西一区',
    salesPerson: '李强',
    accountUsed: 40,
    accountLimit: 50,
    contactPerson: '郝书记',
    contactPhone: '136****7733'
  },
  {
    id: 'cust-31',
    orgName: '旬阳市太极城智慧水务与防汛预警中心',
    orgShortName: '旬阳智慧水务',
    orgCode: 'CUST-SN-AK-031',
    creditCode: '91610981MA6KD8834G',
    region: '陕西省 · 安康市 · 旬阳市',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-05-01',
    expireDate: '2026-10-31',
    statUnit: '陕西二区',
    salesPerson: '张伟',
    accountUsed: 28,
    accountLimit: 40,
    contactPerson: '田工',
    contactPhone: '187****8899'
  },
  {
    id: 'cust-32',
    orgName: '洛南县环亚数字钼产业集群监测管理中心',
    orgShortName: '洛南钼业智控',
    orgCode: 'CUST-SN-SL-032',
    creditCode: '91611021MA6LE7745H',
    region: '陕西省 · 商洛市 · 洛南县',
    customerCategory: '三类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'disabled',
    startDate: '2024-09-15',
    expireDate: '2025-09-14',
    statUnit: '宁甘区域',
    salesPerson: '张伟',
    accountUsed: 0,
    accountLimit: 30,
    contactPerson: '吴经理',
    contactPhone: '151****2200'
  },
  {
    id: 'cust-33',
    orgName: '咸阳彩虹显示器件智能制造运维管理平台',
    orgShortName: '彩虹光电智维',
    orgCode: 'CUST-SN-XY-033',
    creditCode: '91610400MA6MF8891J',
    region: '陕西省 · 咸阳市 · 秦都区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-18',
    expireDate: '2028-02-17',
    statUnit: '甘肃区域',
    salesPerson: '刘洋',
    accountUsed: 130,
    accountLimit: 160,
    contactPerson: '顾总',
    contactPhone: '139****1122'
  },
  {
    id: 'cust-34',
    orgName: '陕西中烟汉中卷烟厂工业互联网物联监控中心',
    orgShortName: '汉中卷烟智造',
    orgCode: 'CUST-SN-HZ-034',
    creditCode: '91610700MA6NG9912K',
    region: '陕西省 · 汉中市 · 汉台区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-20',
    expireDate: '2027-04-19',
    statUnit: '新疆区域',
    salesPerson: '刘洋',
    accountUsed: 72,
    accountLimit: 100,
    contactPerson: '韩部长',
    contactPhone: '138****6633'
  },
  {
    id: 'cust-35',
    orgName: '宝鸡石油机械有限责任公司钻采装备智控中心',
    orgShortName: '宝石机械智控',
    orgCode: 'CUST-SN-BJ-035',
    creditCode: '91610300MA6PH8832L',
    region: '陕西省 · 宝鸡市 · 金台区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-12',
    expireDate: '2027-01-11',
    statUnit: '海南区域',
    salesPerson: '刘洋',
    accountUsed: 150,
    accountLimit: 180,
    contactPerson: '薛总工',
    contactPhone: '135****9944'
  },
  {
    id: 'cust-36',
    orgName: '神木市能源综合利用及现代智慧矿山调度中心',
    orgShortName: '神木智慧矿山',
    orgCode: 'CUST-SN-YL-036',
    creditCode: '91610881MA6QJ7712M',
    region: '陕西省 · 榆林市 · 神木市',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-01',
    expireDate: '2028-02-28',
    statUnit: '广东区域',
    salesPerson: '赵天成',
    accountUsed: 180,
    accountLimit: 220,
    contactPerson: '高矿长',
    contactPhone: '139****8855'
  },
  {
    id: 'cust-37',
    orgName: '长虹电子控股集团智慧家庭物联网云平台',
    orgShortName: '长虹智家物联',
    orgCode: 'CUST-SC-MY-037',
    creditCode: '91510700MA6RK8834N',
    region: '四川省 · 绵阳市 · 高新区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-18',
    expireDate: '2027-01-17',
    statUnit: '康奈总部',
    salesPerson: '陈敏',
    accountUsed: 210,
    accountLimit: 300,
    contactPerson: '卢总监',
    contactPhone: '137****3311'
  },
  {
    id: 'cust-38',
    orgName: '东方汽轮机数字化研发协同与重型燃机监测中心',
    orgShortName: '东汽数协同',
    orgCode: 'CUST-SC-DY-038',
    creditCode: '91510600MA6SL9921P',
    region: '四川省 · 德阳市 · 旌阳区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-01',
    expireDate: '2027-01-31',
    statUnit: '川藏区域',
    salesPerson: '陈敏',
    accountUsed: 140,
    accountLimit: 180,
    contactPerson: '谭主任',
    contactPhone: '136****5588'
  },
  {
    id: 'cust-39',
    orgName: '南江县黄羊现代农业全产业链溯源大数据中心',
    orgShortName: '南江黄羊溯源',
    orgCode: 'CUST-SC-BZ-039',
    creditCode: '91511922MA6TM7745Q',
    region: '四川省 · 巴中市 · 南江县',
    customerCategory: '三类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-10',
    expireDate: '2026-09-30',
    statUnit: '东北区域',
    salesPerson: '陈敏',
    accountUsed: 25,
    accountLimit: 40,
    contactPerson: '岳站长',
    contactPhone: '181****6622'
  },
  {
    id: 'cust-40',
    orgName: '苍溪县红心猕猴桃国家现代农业产业园数字中心',
    orgShortName: '苍溪猕猴桃智农',
    orgCode: 'CUST-SC-GY-040',
    creditCode: '91510824MA6UN8812R',
    region: '四川省 · 广元市 · 苍溪县',
    customerCategory: '三类客户',
    customerLevel: '区县级',
    version: '试用版',
    status: 'expired',
    startDate: '2025-08-15',
    expireDate: '2025-11-15',
    statUnit: '四川区域',
    salesPerson: '陈敏',
    accountUsed: 15,
    accountLimit: 30,
    contactPerson: '彭农艺师',
    contactPhone: '152****7799'
  },
  {
    id: 'cust-41',
    orgName: '雅安市川西大数据产业园超级算力运营中心',
    orgShortName: '雅安川西算力',
    orgCode: 'CUST-SC-YA-041',
    creditCode: '91511800MA6VP9934S',
    region: '四川省 · 雅安市 · 雨城区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-01',
    expireDate: '2028-02-28',
    statUnit: '陕西区域',
    salesPerson: '李晓波',
    accountUsed: 175,
    accountLimit: 220,
    contactPerson: '熊总',
    contactPhone: '139****4400'
  },
  {
    id: 'cust-42',
    orgName: '五粮液集团智慧酿造与全球供应链中台服务中心',
    orgShortName: '五粮液智酿中台',
    orgCode: 'CUST-SC-YB-042',
    creditCode: '91511500MA6WQ8821T',
    region: '四川省 · 宜宾市 · 翠屏区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-01',
    expireDate: '2029-12-31',
    statUnit: '陕西一区',
    salesPerson: '王海涛',
    accountUsed: 280,
    accountLimit: 350,
    contactPerson: '唐总监',
    contactPhone: '138****8800'
  },
  {
    id: 'cust-43',
    orgName: '四川自贡恐龙文化科技旅游产业投资集团',
    orgShortName: '自贡文旅投',
    orgCode: 'CUST-SC-ZG-043',
    creditCode: '91510300MA6XR7712U',
    region: '四川省 · 自贡市 · 自流井区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-05-20',
    expireDate: '2027-05-19',
    statUnit: '陕西二区',
    salesPerson: '王海涛',
    accountUsed: 65,
    accountLimit: 80,
    contactPerson: '范部长',
    contactPhone: '136****9922'
  },
  {
    id: 'cust-44',
    orgName: '遂宁市锂电新能源产业协同创新服务中心',
    orgShortName: '遂宁锂电创新',
    orgCode: 'CUST-SC-SN-044',
    creditCode: '91510900MA6YS9934V',
    region: '四川省 · 遂宁市 · 船山区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    version: '正式版',
    status: 'active',
    startDate: '2025-02-15',
    expireDate: '2027-02-14',
    statUnit: '宁甘区域',
    salesPerson: '郭峰',
    accountUsed: 82,
    accountLimit: 100,
    contactPerson: '蒋经理',
    contactPhone: '137****4466'
  },
  {
    id: 'cust-45',
    orgName: '攀枝花市钒钛高新技术产业化基地物联平台',
    orgShortName: '攀枝花钒钛智联',
    orgCode: 'CUST-SC-PZH-045',
    creditCode: '91510400MA6ZT8812W',
    region: '四川省 · 攀枝花市 · 东区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-04-01',
    expireDate: '2028-03-31',
    statUnit: '甘肃区域',
    salesPerson: '郭峰',
    accountUsed: 112,
    accountLimit: 150,
    contactPerson: '毛处长',
    contactPhone: '135****6611'
  },
  {
    id: 'cust-46',
    orgName: '成都飞机工业数字化航天协同智造创新平台',
    orgShortName: '成飞数协同',
    orgCode: 'CUST-SC-CD-046',
    creditCode: '91510105201988234X',
    region: '四川省 · 成都市 · 青羊区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-01',
    expireDate: '2028-12-31',
    statUnit: '新疆区域',
    salesPerson: '肖建军',
    accountUsed: 260,
    accountLimit: 300,
    contactPerson: '任总工',
    contactPhone: '139****1100'
  },
  {
    id: 'cust-47',
    orgName: '康定市折多山高寒气象与地质灾害预警监测中心',
    orgShortName: '康定折多山预警',
    orgCode: 'CUST-SC-KD-047',
    creditCode: '91513301MA7A18912Y',
    region: '四川省 · 甘孜藏族自治州 · 康定市',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-06-10',
    expireDate: '2027-06-09',
    statUnit: '海南区域',
    salesPerson: '肖建军',
    accountUsed: 38,
    accountLimit: 50,
    contactPerson: '桑吉站长',
    contactPhone: '189****3311'
  },
  {
    id: 'cust-48',
    orgName: '西安交大一附院智慧医疗与临床科研数据中台',
    orgShortName: '西交大一院医数',
    orgCode: 'CUST-SN-XA-048',
    creditCode: '91610100MA7B29834Z',
    region: '陕西省 · 西安市 · 雁塔区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-03-01',
    expireDate: '2028-02-28',
    statUnit: '广东区域',
    salesPerson: '夏小花',
    accountUsed: 190,
    accountLimit: 220,
    contactPerson: '刘处长',
    contactPhone: '138****7711'
  },
  {
    id: 'cust-49',
    orgName: '陕煤集团智能化矿井综合管控一体化平台',
    orgShortName: '陕煤智控中心',
    orgCode: 'CUST-SN-XA-049',
    creditCode: '91610000762588123A',
    region: '陕西省 · 西安市 · 高新区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    version: '正式版',
    status: 'active',
    startDate: '2025-01-15',
    expireDate: '2029-01-14',
    statUnit: '康奈总部',
    salesPerson: '原婕',
    accountUsed: 310,
    accountLimit: 400,
    contactPerson: '钱总',
    contactPhone: '139****6622'
  },
  {
    id: 'cust-50',
    orgName: '蒲城县国家授时中心时间科学与授时物联馆',
    orgShortName: '蒲城授时智联',
    orgCode: 'CUST-SN-WN-050',
    creditCode: '91610526MA7C37712B',
    region: '陕西省 · 渭南市 · 蒲城县',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    version: '正式版',
    status: 'active',
    startDate: '2025-05-01',
    expireDate: '2026-04-30',
    statUnit: '川藏区域',
    salesPerson: '徐德宏',
    accountUsed: 32,
    accountLimit: 50,
    contactPerson: '石工',
    contactPhone: '137****8866'
  }
];

export const ORG_PRODUCT_CYCLE = ['prod-tq', 'prod-ddsb', 'prod-zlsp'] as const;

const PRODUCT_NAME_MAP: Record<string, string> = {
  'prod-tq': '特情',
  'prod-ddsb': '点点速豹',
  'prod-zlsp': '知了速评'
};

const PRODUCT_DEFAULT_VER_MAP: Record<string, string> = {
  'prod-tq': 'V2.0.0-Release',
  'prod-ddsb': 'V1.8',
  'prod-zlsp': 'V3.2.0-Release'
};

export const withOrgProductBindings = (orgs: CustomerOrgItem[]): CustomerOrgItem[] =>
  orgs.map((org, index) => {
    const productId = org.productId || ORG_PRODUCT_CYCLE[index % ORG_PRODUCT_CYCLE.length];
    const productVersion = org.productVersion || PRODUCT_DEFAULT_VER_MAP[productId] || 'V1.0';
    const productName = org.productName || PRODUCT_NAME_MAP[productId] || '业务系统';
    return {
      ...org,
      productId,
      productName,
      productVersion,
      provisionRecords: org.provisionRecords || [
        {
          id: `pr-${org.id}-01`,
          recordTime: `${org.startDate} 09:30`,
          type: '首次开通',
          productId,
          productName,
          productVersion,
          licenseType: org.version,
          validPeriod: `${org.startDate} 至 ${org.expireDate}`,
          operator: org.salesPerson || '系统管理员',
          remark: org.remark || (org.version === '正式版' ? '商业合同签约正式交付开通' : '售前试用接入'),
          status: '生效中'
        }
      ]
    };
  });

INITIAL_CUSTOMER_ORGS.forEach((org, index) => {
  if (!org.productId) {
    org.productId = ORG_PRODUCT_CYCLE[index % ORG_PRODUCT_CYCLE.length];
  }
  if (!org.productVersion) {
    org.productVersion = PRODUCT_DEFAULT_VER_MAP[org.productId] || 'V1.0';
  }
  if (!org.productName) {
    org.productName = PRODUCT_NAME_MAP[org.productId] || '业务系统';
  }
});

// 核心客户全量主库（供全局与各应用检索开通使用）
export const MASTER_ENTERPRISE_CUSTOMERS: Array<Omit<CustomerOrgItem, 'version' | 'status' | 'startDate' | 'expireDate'> & {
  version?: '正式版' | '试用版';
  status?: 'active' | 'expired' | 'disabled' | 'trash';
  startDate?: string;
  expireDate?: string;
}> = [
  ...INITIAL_CUSTOMER_ORGS,
  // 以下为尚未开通「指令流转」应用的待开通机构储备库
  {
    id: 'master-cust-51',
    orgName: '陕西省自然资源卫星应用技术协同创新中心',
    orgShortName: '陕自然卫星中心',
    orgCode: 'CUST-SN-XA-051',
    creditCode: '91610100MA6T12345A',
    region: '陕西省 · 西安市 · 雁塔区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    statUnit: '东北区域',
    salesPerson: '夏小花',
    contactPerson: '韩处长',
    contactPhone: '13911223344'
  },
  {
    id: 'master-cust-52',
    orgName: '西安市智慧城管与综合行政执法指挥调度平台',
    orgShortName: '西安智慧城管',
    orgCode: 'CUST-SN-XA-052',
    creditCode: '91610113MA7K98765B',
    region: '陕西省 · 西安市 · 雁塔区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    statUnit: '四川区域',
    salesPerson: '原婕',
    contactPerson: '程大队长',
    contactPhone: '13866554433'
  },
  {
    id: 'master-cust-53',
    orgName: '渭南市临渭区数字化农业产业链赋能示范园区',
    orgShortName: '渭南临渭农链',
    orgCode: 'CUST-SN-WN-053',
    creditCode: '91610502MA6W54321C',
    region: '陕西省 · 渭南市 · 临渭区',
    customerCategory: '二类客户',
    customerLevel: '区县级',
    statUnit: '陕西区域',
    salesPerson: '徐德宏',
    contactPerson: '赵主任',
    contactPhone: '13799887766'
  },
  {
    id: 'master-cust-54',
    orgName: '宝鸡市工业互联网与高端机床智造创新联合体',
    orgShortName: '宝鸡智造联合体',
    orgCode: 'CUST-SN-BJ-054',
    creditCode: '91610300MA2811223D',
    region: '陕西省 · 宝鸡市 · 金台区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    statUnit: '陕西一区',
    salesPerson: '郭主管',
    contactPerson: '李总工',
    contactPhone: '13612345678'
  },
  {
    id: 'master-cust-55',
    orgName: '汉中市生态环境遥感监测与秦岭水源涵养智库',
    orgShortName: '汉中秦岭水保',
    orgCode: 'CUST-SN-HZ-055',
    creditCode: '91610700MA7C44556E',
    region: '陕西省 · 汉中市 · 汉台区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    statUnit: '陕西二区',
    salesPerson: '马经理',
    contactPerson: '孙科长',
    contactPhone: '18998765432'
  },
  {
    id: 'master-cust-56',
    orgName: '延安市红色文旅沉浸式数智体验中心',
    orgShortName: '延安红旅数智',
    orgCode: 'CUST-SN-YA-056',
    creditCode: '91610600MA6U77889F',
    region: '陕西省 · 延安市 · 宝塔区',
    customerCategory: '一类客户',
    customerLevel: '地市级',
    statUnit: '宁甘区域',
    salesPerson: '张经理',
    contactPerson: '刘部长',
    contactPhone: '13555443322'
  },
  {
    id: 'master-cust-57',
    orgName: '绵阳科技城激光核聚变与先进材料研发中枢',
    orgShortName: '绵阳激光研发中心',
    orgCode: 'CUST-SC-MY-057',
    creditCode: '91510700MA7G99881G',
    region: '四川省 · 绵阳市 · 涪城区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    statUnit: '甘肃区域',
    salesPerson: '王主管',
    contactPerson: '陈研究员',
    contactPhone: '13888776655'
  },
  {
    id: 'master-cust-58',
    orgName: '成都市天府新区智能算力与信创产业协同创新基地',
    orgShortName: '天府算力创新基地',
    orgCode: 'CUST-SC-CD-058',
    creditCode: '91510100MA6H33221H',
    region: '四川省 · 成都市 · 双流区',
    customerCategory: '一类客户',
    customerLevel: '省级',
    statUnit: '新疆区域',
    salesPerson: '肖建军',
    contactPerson: '何总监',
    contactPhone: '13966551122'
  },
  {
    id: 'master-cust-59',
    orgName: '德阳市重型装备制造工业互联物联网络调度中心',
    orgShortName: '德阳重装互联',
    orgCode: 'CUST-SC-DY-059',
    creditCode: '91510600MA7D22119I',
    region: '四川省 · 德阳市 · 旌阳区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    statUnit: '海南区域',
    salesPerson: '王主管',
    contactPerson: '万主管',
    contactPhone: '13677889900'
  },
  {
    id: 'master-cust-60',
    orgName: '安康市富硒绿色农产品防伪溯源与数字交易中心',
    orgShortName: '安康富硒溯源',
    orgCode: 'CUST-SN-AK-060',
    creditCode: '91610900MA6R88990J',
    region: '陕西省 · 安康市 · 汉滨区',
    customerCategory: '二类客户',
    customerLevel: '地市级',
    statUnit: '广东区域',
    salesPerson: '马经理',
    contactPerson: '邓经理',
    contactPhone: '18612344321'
  }
];

