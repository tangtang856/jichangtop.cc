/**
 * 机场数据库核心数据定义
 * 依据 Master Prompt Section VII 规范统一维护
 */

export interface Plan {
  name: string;
  price: number;
  billingCycle: '月付' | '季付' | '半年付' | '年付' | '不限时';
  trafficGB: number;
  unitPricePerGB: number; // 自动计算折算：price / trafficGB
  lineType: string;
  notes: string;
}

export interface Airport {
  id: string;
  name: string;
  slug: string;
  description: string;

  officialUrl?: string;
  affiliateUrl?: string;

  startingPrice?: number;
  currency?: string;

  plans: Plan[];

  protocols: string[];
  regions: string[];

  deviceLimit?: string;

  aiSupport?: string[];
  streamingSupport?: string[];

  advantages: string[];
  disadvantages: string[];

  suitableFor: string[];

  sources: string[];

  lastVerified?: string;

  testStatus: 'tested' | 'official-data' | 'unverified';
}

export const AIRPORTS: Airport[] = [
  {
    id: "flyingbird",
    name: "飞鸟云 FlyingBird",
    slug: "flyingbird",
    description: "2022年成立的老牌IEPL专线机场，主打全专线不过墙与主流AI/流媒体全解锁，晚高峰平稳抗丢包，适合注重品质与日常办公的用户。",
    officialUrl: "https://jichangtop.cc/go/flyingbird",
    affiliateUrl: "https://jichangtop.cc/go/flyingbird",
    startingPrice: 28,
    currency: "CNY",
    plans: [
      {
        name: "基础套餐",
        price: 28,
        billingCycle: "月付",
        trafficGB: 100,
        unitPricePerGB: 0.28,
        lineType: "IEPL专线",
        notes: "适合轻度办公与日常查阅资料"
      },
      {
        name: "进阶套餐",
        price: 56,
        billingCycle: "月付",
        trafficGB: 200,
        unitPricePerGB: 0.28,
        lineType: "IEPL专线",
        notes: "适合中度流媒体与AI高频用户"
      },
      {
        name: "旗舰大流量",
        price: 112,
        billingCycle: "月付",
        trafficGB: 500,
        unitPricePerGB: 0.224,
        lineType: "IEPL专线",
        notes: "适合4K重度视频与多设备共享"
      }
    ],
    protocols: ["Shadowsocks"],
    regions: ["香港", "日本", "台湾", "新加坡", "美国", "英国", "德国", "韩国"],
    deviceLimit: "不限设备数量",
    aiSupport: ["ChatGPT", "Claude", "Midjourney", "Google Gemini", "Perplexity"],
    streamingSupport: ["Netflix", "Disney+", "YouTube Premium", "HBO Max", "TikTok"],
    advantages: [
      "全IEPL内网专线过境，敏感时期稳定性好，延迟抖动低",
      "全节点解锁4K流媒体与主流AI大模型（ChatGPT/Claude原生支持）",
      "套餐流量按月重置，不限制同时在线设备数量",
      "提供傻瓜式一键导入订阅，支持Clash、Surge、小火箭全平台"
    ],
    disadvantages: [
      "暂无10元内极低预算套餐，起步门槛28元/月",
      "目前主要采用Shadowsocks协议，暂未开放Hysteria2等激进协议"
    ],
    suitableFor: [
      "追求全天候不掉线的职场办公与远程开发人群",
      "重度YouTube 4K与Netflix追剧流媒体爱好者",
      "高频调用ChatGPT、Claude与Midjourney的AI创作者"
    ],
    sources: [
      "飞鸟云官网公开资费标准与节点服务清单",
      "编辑部2026年3月实测晚高峰延迟与连通率"
    ],
    lastVerified: "2026-03",
    testStatus: "tested"
  },
  {
    id: "tagvpn",
    name: "TAG VPN",
    slug: "tagvpn",
    description: "老牌高端特化专线机场，以全球近100个国家/地区冷门节点覆盖著称，全IEPL内网专线加持，外贸海淘与跨区流媒体首选品牌。",
    officialUrl: "https://jichangtop.cc/go/tagvpn",
    affiliateUrl: "https://jichangtop.cc/go/tagvpn",
    startingPrice: 55,
    currency: "CNY",
    plans: [
      {
        name: "特惠季付",
        price: 166,
        billingCycle: "季付",
        trafficGB: 750,
        unitPricePerGB: 0.221,
        lineType: "华为腾讯IEPL专线",
        notes: "折合55.3元/月，每月250GB"
      },
      {
        name: "年付经典",
        price: 600,
        billingCycle: "年付",
        trafficGB: 3600,
        unitPricePerGB: 0.166,
        lineType: "华为腾讯IEPL专线",
        notes: "折合50元/月，每月300GB"
      },
      {
        name: "超级特选",
        price: 199,
        billingCycle: "月付",
        trafficGB: 1000,
        unitPricePerGB: 0.199,
        lineType: "华为腾讯IEPL专线",
        notes: "适合大流量跨国商务团队"
      }
    ],
    protocols: ["Shadowsocks"],
    regions: ["全球近100个国家/地区", "香港", "日本", "新加坡", "美国", "英国", "土耳其", "阿根廷", "印度", "越南", "南非", "冰岛"],
    deviceLimit: "10台设备同时在线",
    aiSupport: ["ChatGPT", "Claude", "Midjourney", "Gemini", "Perplexity"],
    streamingSupport: ["Netflix", "Disney+", "YouTube Premium", "Amazon Prime", "BBC iPlayer", "AbemaTV", "TVB"],
    advantages: [
      "冷门节点之王：覆盖全球近100个国家地区，外贸出海刚需",
      "华为/腾讯大带宽企业级IEPL专线，晚高峰稳定性极高",
      "丰富的全球原生住宅IP储备，完美支持低价区流媒体跨区与海淘",
      "运营超5年老牌团队，信誉口碑稳定，无跑路风险"
    ],
    disadvantages: [
      "单次起步需季付或年付，初次尝试门槛较高",
      "若仅需要常规港日美节点，性价比略逊于普通专线"
    ],
    suitableFor: [
      "跨境电商、外贸出海营销、海外社媒矩阵运营人员",
      "阿根廷/土耳其/埃及等低价区Steam、Spotify跨区玩家",
      "对小众国家原生IP有硬性需求的开发者与极客"
    ],
    sources: [
      "TAG VPN官网公开服务协议与全球节点列表",
      "编辑部各区域节点延迟探针与跨区解锁抽测"
    ],
    lastVerified: "2026-03",
    testStatus: "tested"
  },
  {
    id: "paopaodog",
    name: "泡泡狗 PaopaoDog",
    slug: "paopaodog",
    description: "老牌高性价比隧道中继机场，起步仅需12元/月，年付折算每GB低至0.049元，适合学生党与预算有限的轻度上网新手。",
    officialUrl: "https://jichangtop.cc/go/paopaodog",
    affiliateUrl: "https://jichangtop.cc/go/paopaodog",
    startingPrice: 12,
    currency: "CNY",
    plans: [
      {
        name: "基础月付",
        price: 12,
        billingCycle: "月付",
        trafficGB: 100,
        unitPricePerGB: 0.12,
        lineType: "隧道中继",
        notes: "学生党查资料超值入门"
      },
      {
        name: "进阶月付",
        price: 25,
        billingCycle: "月付",
        trafficGB: 250,
        unitPricePerGB: 0.1,
        lineType: "隧道中继+专线优化",
        notes: "适合中度上网与常用流媒体"
      },
      {
        name: "超值年付",
        price: 118,
        billingCycle: "年付",
        trafficGB: 2400,
        unitPricePerGB: 0.049,
        lineType: "隧道中继+专线优化",
        notes: "折合9.8元/月，每月200GB"
      }
    ],
    protocols: ["Shadowsocks", "VLESS"],
    regions: ["香港", "日本", "新加坡", "美国", "台湾"],
    deviceLimit: "5台设备同时在线",
    aiSupport: ["ChatGPT", "Claude", "Google Gemini"],
    streamingSupport: ["YouTube Premium", "Netflix (主流区)", "Disney+"],
    advantages: [
      "极致平民价格：月付12元起，学生党也能轻松承担",
      "超值年付每GB低至4.9分钱，大流量日常挥霍不心疼",
      "主流协议支持广泛，适配Clash、v2rayN等多端客户端",
      "后台面板简洁直观，提供详细的一键配置教程"
    ],
    disadvantages: [
      "特殊敏感时期个别普通中继节点可能发生偶发延迟增加",
      "冷门区域节点较少，主要围绕港日新美等亚太核心节点"
    ],
    suitableFor: [
      "预算有限的学生、轻度Google学术查阅者",
      "对价格极度敏感、寻找备用梯子的用户",
      "日常主要看YouTube 1080P/2K和网页浏览的普通用户"
    ],
    sources: [
      "泡泡狗用户控制台套餐资费公示",
      "编辑部2026年3月连通性与单价折算记录"
    ],
    lastVerified: "2026-03",
    testStatus: "official-data"
  },
  {
    id: "wgetcloud",
    name: "WgetCloud (原GACloud)",
    slug: "wgetcloud",
    description: "专为企业与高端外贸打造的顶级BGP内网专线机场，自主研发智能路由调度与SLA保障，晚高峰零断联，追求极致稳定的不二之选。",
    officialUrl: "https://jichangtop.cc/go/wgetcloud",
    affiliateUrl: "https://jichangtop.cc/go/wgetcloud",
    startingPrice: 49,
    currency: "CNY",
    plans: [
      {
        name: "基础专线",
        price: 49,
        billingCycle: "月付",
        trafficGB: 120,
        unitPricePerGB: 0.408,
        lineType: "多线BGP+全IEPL内网",
        notes: "企业外贸远程办公首选"
      },
      {
        name: "优质专线",
        price: 69,
        billingCycle: "月付",
        trafficGB: 200,
        unitPricePerGB: 0.345,
        lineType: "多线BGP+全IEPL内网",
        notes: "含精品冷门节点与极速通道"
      },
      {
        name: "商务旗舰",
        price: 129,
        billingCycle: "月付",
        trafficGB: 500,
        unitPricePerGB: 0.258,
        lineType: "双专线冗余灾备",
        notes: "企业级SLA保障与优先工单响应"
      }
    ],
    protocols: ["Shadowsocks", "Trojan", "VLESS"],
    regions: ["香港", "日本", "新加坡", "美国", "英国", "德国", "韩国"],
    deviceLimit: "不限设备数量",
    aiSupport: ["ChatGPT", "Claude Enterprise", "Midjourney", "Gemini Ultra", "Cursor"],
    streamingSupport: ["Netflix", "Disney+", "YouTube 4K", "Hulu", "DAZN", "TVer"],
    advantages: [
      "企业级BGP多入口+独享IEPL内网骨干，全天候零抖动零丢包",
      "自研智能路由调度系统，某节点故障可毫秒级无感热切",
      "原生独享IP池储备，杜绝因节点邻居滥用导致ChatGPT/Claude被封",
      "工单服务团队7x24小时响应，技术底蕴深厚"
    ],
    disadvantages: [
      "套餐定价相对较高，不适合单纯追求便宜的大流量下载用户",
      "严禁BT下载与网络扫描等滥用行为（违规将直接封禁）"
    ],
    suitableFor: [
      "跨国视频会议（Zoom/Teams）有严苛连通性要求的外企员工",
      "高净值金融交易、跨境电商主力店铺安全运营团队",
      "对网络卡顿极度敏感、要求一分钱一分货的高品质用户"
    ],
    sources: [
      "WgetCloud官网SLA服务等级协议与公开线路架构图",
      "编辑部全天候24小时ping丢包率与测速样本分析"
    ],
    lastVerified: "2026-03",
    testStatus: "tested"
  },
  {
    id: "kuromis",
    name: "黑猫云 Kuromis",
    slug: "kuromis",
    description: "新锐优质全IEPL专线机场，同时部署Hysteria2防封高速备用节点，节点全1.0倍率无暗坑，主打流媒体解锁与平价专线体验。",
    officialUrl: "https://jichangtop.cc/go/kuromis",
    affiliateUrl: "https://jichangtop.cc/go/kuromis",
    startingPrice: 20,
    currency: "CNY",
    plans: [
      {
        name: "迷你月付",
        price: 20,
        billingCycle: "月付",
        trafficGB: 100,
        unitPricePerGB: 0.2,
        lineType: "全IEPL内网专线",
        notes: "入门级专线超值方案"
      },
      {
        name: "标准月付",
        price: 35,
        billingCycle: "月付",
        trafficGB: 200,
        unitPricePerGB: 0.175,
        lineType: "全IEPL专线+Hy2备用",
        notes: "主力推荐，兼顾速度与稳定性"
      },
      {
        name: "尊享年付",
        price: 299,
        billingCycle: "年付",
        trafficGB: 3600,
        unitPricePerGB: 0.083,
        lineType: "全IEPL专线+Hy2备用",
        notes: "折合24.9元/月，每月300GB"
      }
    ],
    protocols: ["Shadowsocks", "Hysteria2"],
    regions: ["香港", "日本", "台湾", "新加坡", "美国", "加拿大", "韩国"],
    deviceLimit: "3台设备同时在线",
    aiSupport: ["ChatGPT", "Claude", "Midjourney", "Google Gemini"],
    streamingSupport: ["Netflix", "Disney+", "YouTube 4K", "Bahamut动画疯", "Bilibili港澳台"],
    advantages: [
      "全IEPL专线过境，辅以Hysteria2救砖节点，双重保障防失联",
      "全节点倍率严格保持1.0x，真实流量无暗扣套路",
      "日台流媒体深度解锁，支持巴哈姆特动画疯和台区B站番剧",
      "专线价格低至20元/月，年付每GB仅0.083元，性价比较高"
    ],
    disadvantages: [
      "同时在线设备数量限制为3台，多设备家庭或多合租用户不够用",
      "新兴品牌，知名度和运营年限相对老牌机场尚显年轻"
    ],
    suitableFor: [
      "想以较低预算享受纯IEPL专线低延迟体验的个人用户",
      "二次元爱好者、日台番剧流媒体追番群体",
      "校园网或弱网环境下需要Hysteria2协议破墙加速的用户"
    ],
    sources: [
      "黑猫云控制台套餐资费明细与官方公告",
      "编辑部2026年3月双协议实机连接测试"
    ],
    lastVerified: "2026-03",
    testStatus: "tested"
  }
];
