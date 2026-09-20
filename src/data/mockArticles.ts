/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArticleItem {
  id: number; // 文章唯一ID，如 2384
  appShortName: string; // 来源应用简称
  appIconBg?: string;
  appCode?: string;
  orgShortName: string; // 客户机构简称
  statUnit: string; // 所属大区/统计单元
  salesPerson: string; // 负责人
  categoryName: string; // 文章分类
  title: string; // 文章标题
  contentSnippet?: string; // 文章摘要/内容片段用于检索
  status: 'publishing' | 'revoked' | 'deleted'; // 发布中 | 已撤回 | 已删除
  publishDate: string; // 日期 YYYY-MM-DD
  publishTime: string; // 时间 HH:mm:ss
  authorAvatar: string; // 微信头像
  authorWechatNick: string; // 微信昵称（加粗）
  authorRealName: string; // 备注姓名
}

// 预置可筛选的应用列表
export const CMS_APP_OPTIONS = [
  '全部应用',
  '谛听预警',
  '数解舆情',
  '看讯',
  '点点密信',
  '点点速报',
  '点点速评',
  '舆情先知',
  '微小宝',
  '指令流转'
];

// 预置统计单元列表（与全局统计单元完全统一）
export const CMS_STAT_UNITS = [
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
];

const MOCK_ORGS = [
  { shortName: '四川省网信办', statUnit: '四川区域', sales: '王强' },
  { shortName: '成都市公安局网安支队', statUnit: '四川区域', sales: '李明' },
  { shortName: '重庆市融媒体中心', statUnit: '川藏区域', sales: '张伟' },
  { shortName: '西安市公安局情指中心', statUnit: '陕西一区', sales: '夏小花' },
  { shortName: '陕西省政法委综治办', statUnit: '陕西区域', sales: '夏小花' },
  { shortName: '云南省公安厅专班', statUnit: '川藏区域', sales: '昆明李华' },
  { shortName: '贵州省应急管理厅', statUnit: '川藏区域', sales: '陈晨' },
  { shortName: '兰州市融媒体中心', statUnit: '甘肃区域', sales: '马天' },
  { shortName: '银川市委网信办', statUnit: '宁甘区域', sales: '刘海' },
  { shortName: '乌鲁木齐政法综治平台', statUnit: '新疆区域', sales: '阿不都' },
  { shortName: '沈阳市公安局大数据专班', statUnit: '东北区域', sales: '赵刚' },
  { shortName: '广州市高新网信监控组', statUnit: '广东区域', sales: '林海' },
  { shortName: '三亚市旅游应急指挥中心', statUnit: '海南区域', sales: '符浩' },
  { shortName: '康奈集团总部运营中心', statUnit: '康奈总部', sales: '张华' }
];

const MOCK_AUTHORS = [
  { nick: '风清扬_网安', name: '王小虎', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' },
  { nick: '蜀道舆情研判', name: '李晓明', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { nick: '长安雪夜行', name: '张建军', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80' },
  { nick: '山城融媒观察', name: '刘洋', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=80' },
  { nick: '应急先锋007', name: '陈志华', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80' },
  { nick: '数据指挥官', name: '孙敏', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  { nick: '西北巡检员', name: '赵大勇', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { nick: '天府小诸葛', name: '周婷婷', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
];

const MOCK_CATEGORIES = [
  '政策法规',
  '热点专题',
  '日常简报',
  '应急预警',
  '网络辟谣',
  '深度研判',
  '通报专刊',
  '知识库科普',
  '舆情周报',
  '专项督办'
];

const MOCK_TITLE_TEMPLATES = [
  '关于近期全网敏感涉稳舆情态势及处置防范建议的每日快报',
  '2026年第三季度网络意识形态安全风险自查与综合研判报告',
  '针对突发网络谣言事件的溯源分析及官方辟谣引导工作方案',
  '全网重点平台涉川涉陕民生热点话题监测与舆情走势分析',
  '公安网安支队关于打击网络黑客与非法数据爬取的通报专刊',
  '突发极端天气灾害应急响应及政务融媒信息传播效果评估',
  '智能网络舆情早班车：今日全网热搜与政务民生关注TOP10',
  '关于深化推进数字政府数据安全与跨部门协同保护的实施细则',
  '新媒体矩阵传播效能评估：政务微信及视频号互动指数榜单',
  '网络有害信息即时排查与敏感词预警处置闭环工作指引',
  '关于某地涉企纠纷网络炒作事件的舆情演变轨迹与复盘分析',
  '国家网信办网络空间清朗专项行动指导精神学习专刊',
  '重大项目建设网络舆论反响及风险隐患排查周报',
  '社会热点议题网络情感倾向度与关键KOL传播路径追踪',
  '关于做好节假日期间网络安全值班与舆情监测的紧急通知'
];

const APPS_FOR_GEN = [
  '谛听预警',
  '数解舆情',
  '看讯',
  '点点密信',
  '点点速报',
  '点点速评',
  '舆情先知',
  '微小宝',
  '指令流转'
];

export const generateMockArticles = (count: number = 186): ArticleItem[] => {
  const list: ArticleItem[] = [];
  const baseId = 2384;

  for (let i = 0; i < count; i++) {
    const id = baseId + i;
    const org = MOCK_ORGS[i % MOCK_ORGS.length];
    const author = MOCK_AUTHORS[i % MOCK_AUTHORS.length];
    const category = MOCK_CATEGORIES[i % MOCK_CATEGORIES.length];
    const app = APPS_FOR_GEN[i % APPS_FOR_GEN.length];
    const titleTemplate = MOCK_TITLE_TEMPLATES[i % MOCK_TITLE_TEMPLATES.length];
    const title = `【${category}】${titleTemplate}（第${i + 1}期）`;

    // 状态分配：约 70% 发布中，18% 已撤回，12% 已删除
    let status: ArticleItem['status'] = 'publishing';
    if (i % 7 === 2) {
      status = 'revoked';
    } else if (i % 9 === 4) {
      status = 'deleted';
    }

    // 日期生成 (2026-08 ~ 2026-09)
    const day = String((i % 28) + 1).padStart(2, '0');
    const month = i % 2 === 0 ? '09' : '08';
    const publishDate = `2026-${month}-${day}`;
    
    const hour = String(8 + (i % 14)).padStart(2, '0');
    const min = String((i * 7) % 60).padStart(2, '0');
    const sec = String((i * 13) % 60).padStart(2, '0');
    const publishTime = `${hour}:${min}:${sec}`;

    list.push({
      id,
      appShortName: app,
      orgShortName: org.shortName,
      statUnit: org.statUnit,
      salesPerson: org.sales,
      categoryName: category,
      title,
      contentSnippet: `本文阐述了${org.shortName}在${app}平台所发布的${category}核心要点及分析结论，包含详细处置指引与态势图表。`,
      status,
      publishDate,
      publishTime,
      authorAvatar: author.avatar,
      authorWechatNick: author.nick,
      authorRealName: author.name
    });
  }

  return list;
};

export const INITIAL_ARTICLES = generateMockArticles(186);
