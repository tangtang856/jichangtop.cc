/**
 * scripts/apply-brand-tdk.cjs
 * 为全站全部 14 个品牌注入最专业、高转化、高权重的 TDK 与 H1
 * 严格包含：品牌名如何？套餐价格、流量额度、节点线路架构与晚高峰测速信息
 */
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// 14 个品牌的超精细专业 TDK 配置表
const brandTdkConfig = {
  breezenet: {
    name: '微风网络 Breezenet',
    airportTitle: '微风网络Breezenet如何？2026最新套餐价格/流量额度/专线节点晚高峰测速评测 | 机场Top',
    airportDesc: '微风网络Breezenet怎么样？值得买吗？2026最新深度评测报告。真实解析月付¥8起享200GB超大流量套餐价格明细、IEPL/IPLC专线物理过境晚高峰测速数据、VLESS协议低延迟表现、4K流媒体与ChatGPT解锁情况及专属优惠码【weifeng90】。',
    airportKw: '微风网络, 微风网络Breezenet, 微风网络如何, 微风网络怎么样, 微风网络套餐价格, 微风网络流量, 微风网络节点, 微风网络测速, 微风网络优惠码, 微风网络官网, 机场推荐',
    airportH1: '微风网络Breezenet如何？2026最新套餐价格/流量额度/专线节点晚高峰测速评测',

    reviewTitle: '微风网络Breezenet真实测评：2026套餐价格、流量每GB单价与节点晚高峰测速报告 | 机场Top',
    reviewDesc: '客观实测微风网络Breezenet。深度拆解¥8月付起步价格、200GB大流量配额、IEPL/IPLC专线晚高峰丢包抖动实测数据、单GB每分成本测算与购买避坑指南。',
    reviewKw: '微风网络真实测评, 微风网络Breezenet怎么样, 微风网络如何, 微风网络套餐价格, 微风网络流量, 微风网络节点测速, 微风网络优惠码, 性价比机场推荐',
    reviewH1: '微风网络Breezenet真实测评：2026套餐价格、流量每GB单价与节点晚高峰测速报告'
  },
  muguang: {
    name: '暮光网络',
    airportTitle: '暮光网络如何？2026最新套餐价格/流量配置/专线节点晚高峰测速评测 | 机场Top',
    airportDesc: '暮光网络怎么样？值得买吗？2026官方套餐资费与专线节点架构深度评测。全节点120GB起步仅需¥20/月，实测VLESS与Trojan双加密协议晚高峰丢包抖动数据、4K超清流媒体与Cursor/ChatGPT支持度及优缺点剖析。',
    airportKw: '暮光网络, 暮光网络如何, 暮光网络怎么样, 暮光网络套餐价格, 暮光网络流量, 暮光网络专线节点, 暮光网络测速, 暮光网络官网, 稳定机场推荐, 梯子推荐',
    airportH1: '暮光网络如何？2026最新套餐价格/流量配置/专线节点晚高峰测速评测',

    reviewTitle: '暮光网络真实测评：2026套餐价格、流量额度与专线节点晚高峰低抖动测速报告 | 机场Top',
    reviewDesc: '暮光网络好不好用？2026实机评测报告。客观呈现¥20月付专线套餐价格明细、120GB可用流量配额、网络晚高峰低丢包测速及高并发商务办公体验。',
    reviewKw: '暮光网络真实测评, 暮光网络怎么样, 暮光网络如何, 暮光网络套餐价格, 暮光网络流量, 暮光网络节点测速, 稳定机场, 梯子推荐',
    reviewH1: '暮光网络真实测评：2026套餐价格、流量额度与专线节点晚高峰低抖动测速报告'
  },
  feimaoyun: {
    name: '飞猫云',
    airportTitle: '飞猫云如何？2026最新套餐价格/流量额度/双线专线节点测速评测 | 机场Top',
    airportDesc: '飞猫云怎么样？好用吗？2026最新套餐价格与流量折算评测。年付折算约¥7/月即享150GB流量，IEPL/IPLC专线与BGP优质中转智能容灾测速表现、Shadowsocks/VLESS双协议适配及专属优惠码【flycat888】折扣领取。',
    airportKw: '飞猫云, 飞猫云如何, 飞猫云怎么样, 飞猫云套餐价格, 飞猫云流量, 飞猫云节点测速, 飞猫云优惠码, 飞猫云官网, 学生党机场, 性价比机场推荐',
    airportH1: '飞猫云如何？2026最新套餐价格/流量额度/双线专线节点测速评测',

    reviewTitle: '飞猫云真实测评：2026套餐价格、年付每GB单价与节点晚高峰测速报告 | 机场Top',
    reviewDesc: '飞猫云深度评测与真实使用反馈。客观解析¥7折合月付资费、150GB套餐流量、双线智能调度测速表现、4K视频秒开与日常避坑细节。',
    reviewKw: '飞猫云真实测评, 飞猫云怎么样, 飞猫云如何, 飞猫云套餐价格, 飞猫云流量, 飞猫云节点测速, 飞猫云优惠码, 梯子推荐',
    reviewH1: '飞猫云真实测评：2026套餐价格、年付每GB单价与节点晚高峰测速报告'
  },
  wuyou: {
    name: '无忧',
    airportTitle: '无忧机场如何？2026最新套餐价格/流量配置/真实IPLC专线节点测速评测 | 机场Top',
    airportDesc: '无忧机场（无忧链接）怎么样？2026深度评测与客观选购指南。起步月付¥19享100GB真实IPLC物理内网专线流量，全天候零拥塞测速、Shadowsocks与V2Ray协议多端配置及专属优惠码【wuyou666】详解。',
    airportKw: '无忧, 无忧机场, 无忧链接, 无忧如何, 无忧怎么样, 无忧套餐价格, 无忧流量, 无忧节点测速, 无忧优惠码, IPLC专线机场, 梯子推荐',
    airportH1: '无忧机场如何？2026最新套餐价格/流量配置/真实IPLC专线节点测速评测',

    reviewTitle: '无忧机场真实测评：2026套餐价格、月度流量与IPLC专线节点测速报告 | 机场Top',
    reviewDesc: '无忧链接稳定吗？2026客观测评拆解。真实核算月付¥19元资费、100GB纯专线不过墙流量、晚高峰抗干扰测速与主流客户端傻瓜导入教程。',
    reviewKw: '无忧机场真实测评, 无忧怎么样, 无忧如何, 无忧套餐价格, 无忧流量, 无忧IPLC测速, 无忧优惠码, 机场推荐',
    reviewH1: '无忧机场真实测评：2026套餐价格、月度流量与IPLC专线节点测速报告'
  },
  lingmao: {
    name: '灵猫',
    airportTitle: '灵猫机场如何？2026最新套餐价格/流量额度/IPLC纯专线节点测速评测 | 机场Top',
    airportDesc: '灵猫机场怎么样？高口碑专线梯子深度评测。月付¥25提供150GB纯血IPLC专线流量，原生独享住宅IP晚高峰测速表现、全节点1.0倍率无暗扣、ChatGPT与Netflix全绿解锁及适合人群剖析。',
    airportKw: '灵猫, 灵猫机场, 灵猫如何, 灵猫怎么样, 灵猫套餐价格, 灵猫流量, 灵猫节点测速, 灵猫IPLC专线, 原生住宅IP, 机场推荐',
    airportH1: '灵猫机场如何？2026最新套餐价格/流量额度/IPLC纯专线节点测速评测',

    reviewTitle: '灵猫机场真实测评：2026套餐价格、原生IP流量与晚高峰专线测速报告 | 机场Top',
    reviewDesc: '灵猫纯专线机场实机测速报告。深度拆解¥25月付起步价格、150GB专线流量、原生住宅IP流媒体解锁率、零丢包测速表现与防封号指南。',
    reviewKw: '灵猫真实测评, 灵猫机场怎么样, 灵猫如何, 灵猫套餐价格, 灵猫流量, 灵猫节点测速, 梯子推荐',
    reviewH1: '灵猫机场真实测评：2026套餐价格、原生IP流量与晚高峰专线测速报告'
  },
  flashleap: {
    name: '闪跃 FlashLeap',
    airportTitle: '闪跃FlashLeap如何？2026最新套餐价格/流量配置/千兆专线节点测速评测 | 机场Top',
    airportDesc: '闪跃FlashLeap怎么样？电竞级极速梯子评测。月付¥24起享150GB纯专线流量，千兆带宽大端口与Hysteria2激进协议测速表现、外服网游低延迟联机实测及专属优惠码【shanyue】领取。',
    airportKw: '闪跃, 闪跃FlashLeap, 闪跃如何, 闪跃怎么样, 闪跃套餐价格, 闪跃流量, 闪跃节点测速, 闪跃优惠码, 游戏加速机场, 梯子推荐',
    airportH1: '闪跃FlashLeap如何？2026最新套餐价格/流量配置/千兆专线节点测速评测',

    reviewTitle: '闪跃FlashLeap真实测评：2026套餐价格、千兆专线流量与网游低延迟测速报告 | 机场Top',
    reviewDesc: '闪跃FlashLeap网游与4K视频实测。详细核算月付¥24元价格、150GB大带宽流量、Hysteria2协议爆发吞吐测速与电竞联机延迟表现。',
    reviewKw: '闪跃真实测评, 闪跃FlashLeap怎么样, 闪跃如何, 闪跃套餐价格, 闪跃流量, 闪跃节点测速, 闪跃优惠码, 机场推荐',
    reviewH1: '闪跃FlashLeap真实测评：2026套餐价格、千兆专线流量与网游低延迟测速报告'
  },
  firefly: {
    name: '萤火虫（Firefly）',
    airportTitle: '萤火虫Firefly如何？2026最新套餐价格/流量额度/优化线路节点测速评测 | 机场Top',
    airportDesc: '萤火虫Firefly机场怎么样？新手平价翻墙梯子深度测评。年付折算约¥8/月享60GB起步流量，月付¥16享160GB，VLESS协议开箱即用测速数据、多客户端适配及专属优惠码【firefly】使用教程。',
    airportKw: '萤火虫机场, 萤火虫Firefly, 萤火虫如何, 萤火虫怎么样, 萤火虫套餐价格, 萤火虫流量, 萤火虫节点测速, 萤火虫优惠码, 平价梯子, 机场推荐',
    airportH1: '萤火虫Firefly如何？2026最新套餐价格/流量额度/优化线路节点测速评测',

    reviewTitle: '萤火虫Firefly真实测评：2026套餐价格、平价流量配额与节点测速报告 | 机场Top',
    reviewDesc: '萤火虫Firefly适合新手吗？2026客观评测。剖析折合¥8月付低门槛、60GB轻量流量方案、晚高峰日常网页与视频流畅测速体验及避坑提醒。',
    reviewKw: '萤火虫真实测评, 萤火虫怎么样, 萤火虫如何, 萤火虫套餐价格, 萤火虫流量, 萤火虫节点测速, 萤火虫优惠码, 梯子推荐',
    reviewH1: '萤火虫Firefly真实测评：2026套餐价格、平价流量配额与节点测速报告'
  },
  kuajiecloud: {
    name: '跨界',
    airportTitle: '跨界机场如何？2026最新套餐价格/流量配置/全专线节点晚高峰测速评测 | 机场Top',
    airportDesc: '跨界云机场怎么样？全专线跨国商务网络评测。起步月付¥20配备120GB专线流量，全天候晚高峰丢包率0.2%以下低抖动实测、Zoom/Teams会议零卡顿及专属优惠码【kuajie88】。',
    airportKw: '跨界, 跨界机场, 跨界云, 跨界如何, 跨界怎么样, 跨界套餐价格, 跨界流量, 跨界节点测速, 跨界优惠码, 专线机场, 商务梯子推荐',
    airportH1: '跨界机场如何？2026最新套餐价格/流量配置/全专线节点晚高峰测速评测',

    reviewTitle: '跨界机场真实测评：2026套餐价格、全专线流量与跨国会议低丢包测速报告 | 机场Top',
    reviewDesc: '跨界机场深度实测。客观呈现¥20月付专线价格明细、120GB月度可用流量、全天候晚高峰丢包率与抖动测速数据、外贸与科研适配分析。',
    reviewKw: '跨界真实测评, 跨界机场怎么样, 跨界如何, 跨界套餐价格, 跨界流量, 跨界节点测速, 跨界优惠码, 机场推荐',
    reviewH1: '跨界机场真实测评：2026套餐价格、全专线流量与跨国会议低丢包测速报告'
  },
  yinxingren: {
    name: '隐形人',
    airportTitle: '隐形人机场如何？2026最新套餐价格/流量额度/IEPL纯专线节点测速评测 | 机场Top',
    airportDesc: '隐形人机场怎么样？高隐匿度品质专线评测。月付¥24起享144GB企业级IEPL纯专线流量，全节点无日志记录抗审查测速数据、千兆大带宽无卡顿、原生AI大模型解锁及优惠码【yxr888】。',
    airportKw: '隐形人, 隐形人机场, 隐形人如何, 隐形人怎么样, 隐形人套餐价格, 隐形人流量, 隐形人节点测速, 隐形人优惠码, IEPL专线, 梯子推荐',
    airportH1: '隐形人机场如何？2026最新套餐价格/流量额度/IEPL纯专线节点测速评测',

    reviewTitle: '隐形人机场真实测评：2026套餐价格、IEPL专线流量与晚高峰抗阻断测速报告 | 机场Top',
    reviewDesc: '隐形人IEPL纯专线深度测评。客观拆解¥24月付资费单价、144GB专线流量配额、晚高峰平滑度测速跑分、隐私安全防封策略与选购建议。',
    reviewKw: '隐形人真实测评, 隐形人怎么样, 隐形人如何, 隐形人套餐价格, 隐形人流量, 隐形人节点测速, 隐形人优惠码, 机场推荐',
    reviewH1: '隐形人机场真实测评：2026套餐价格、IEPL专线流量与晚高峰抗阻断测速报告'
  },
  feiv: {
    name: '飞V',
    airportTitle: '飞V机场如何？2026最新套餐价格/流量额度/低门槛节点测速评测 | 机场Top',
    airportDesc: '飞V机场怎么样？极低预算与不限时备用梯子评测。突破性¥4.9/月起步享100GB流量，更有¥29享200GB永久不过期不限时套餐，晚高峰实测速度、网页浏览流畅度与Shadowsocks/VLESS协议支持详解。',
    airportKw: '飞V, 飞V机场, 飞V如何, 飞V怎么样, 飞V套餐价格, 飞V流量, 飞V节点测速, 飞V不限时, 最便宜梯子, 机场推荐',
    airportH1: '飞V机场如何？2026最新套餐价格/流量额度/低门槛节点测速评测',

    reviewTitle: '飞V机场真实测评：2026套餐价格、单GB成本与低价节点测速报告 | 机场Top',
    reviewDesc: '飞V机场真实使用测评。¥4.9超低月付价格到底能不能用？100GB月流量测速体验、¥29不限时备用套餐性价比分析与避坑指南。',
    reviewKw: '飞V真实测评, 飞V机场怎么样, 飞V如何, 飞V套餐价格, 飞V流量, 飞V节点测速, 飞V不限时, 梯子推荐',
    reviewH1: '飞V机场真实测评：2026套餐价格、单GB成本与低价节点测速报告'
  },
  laddercloud: {
    name: '梯子云 LadderCloud',
    airportTitle: '梯子云LadderCloud如何？2026最新套餐价格/流量配置/专线中转节点测速评测 | 机场Top',
    airportDesc: '梯子云LadderCloud怎么样？老牌服务商客观测评。月付¥25起享125GB高速中转与海量专线，支持最高500GB套餐，实测晚高峰多线容灾稳定性、Shadowsocks/Trojan协议速度与全平台导入指南。',
    airportKw: '梯子云, 梯子云LadderCloud, 梯子云如何, 梯子云怎么样, 梯子云套餐价格, 梯子云流量, 梯子云节点测速, 梯子云官网, 老牌机场, 梯子推荐',
    airportH1: '梯子云LadderCloud如何？2026最新套餐价格/流量配置/专线中转节点测速评测',

    reviewTitle: '梯子云LadderCloud真实测评：2026套餐价格、海量流量与多节点测速报告 | 机场Top',
    reviewDesc: '梯子云LadderCloud老牌机场评测。客观分析¥25月付起步价格表、125GB起步流量、专线备份容灾测速表现与多设备稳定性实测。',
    reviewKw: '梯子云真实测评, 梯子云LadderCloud怎么样, 梯子云如何, 梯子云套餐价格, 梯子云流量, 梯子云节点测速, 机场推荐',
    reviewH1: '梯子云LadderCloud真实测评：2026套餐价格、海量流量与多节点测速报告'
  },
  wavenet: {
    name: '浪网 WaveNet',
    airportTitle: '浪网WaveNet如何？2026最新套餐价格/流量额度/自研客户端节点测速评测 | 机场Top',
    airportDesc: '浪网WaveNet怎么样？值得买吗？2026自研客户端专线机场评测。月付¥30起享150GB优化流量，专属定制App一键无脑连接开箱即用，实测VLESS先进协议高并发稳定性、家庭多设备共享与晚高峰速度。',
    airportKw: '浪网, 浪网WaveNet, 浪网如何, 浪网怎么样, 浪网套餐价格, 浪网流量, 浪网节点测速, 浪网客户端, 专线梯子, 机场推荐',
    airportH1: '浪网WaveNet如何？2026最新套餐价格/流量额度/自研客户端节点测速评测',

    reviewTitle: '浪网WaveNet真实测评：2026套餐价格、优化专线流量与自研App测速报告 | 机场Top',
    reviewDesc: '浪网WaveNet自研客户端好用吗？2026深度评测。实操体验月付¥30套餐价格明细、150GB专线流量、多端App开箱即连测速与高并发连接质量。',
    reviewKw: '浪网真实测评, 浪网WaveNet怎么样, 浪网如何, 浪网套餐价格, 浪网流量, 浪网节点测速, 梯子推荐',
    reviewH1: '浪网WaveNet真实测评：2026套餐价格、优化专线流量与自研App测速报告'
  },
  lingdongcloud: {
    name: '灵动云',
    airportTitle: '灵动云如何？2026最新套餐价格/流量配置/Trojan防封节点测速评测 | 机场Top',
    airportDesc: '灵动云怎么样？踏实老牌代理客观评测。起步月付¥20提供100GB均衡可用配额，主力采用Trojan安全加密协议实测抗干扰性能、节点无虚标暗扣倍率、亚太及美西节点连通率与适合人群剖析。',
    airportKw: '灵动云, 灵动云如何, 灵动云怎么样, 灵动云套餐价格, 灵动云流量, 灵动云节点测速, 灵动云Trojan, 稳定机场, 梯子推荐',
    airportH1: '灵动云如何？2026最新套餐价格/流量配置/Trojan防封节点测速评测',

    reviewTitle: '灵动云真实测评：2026套餐价格、均衡流量与节点测速报告 | 机场Top',
    reviewDesc: '灵动云值得买吗？2026客观测评报告。梳理¥20起步月费、100GB均衡套餐容量、Trojan协议特征伪装抗封测速与无套路倍率核算。',
    reviewKw: '灵动云真实测评, 灵动云怎么样, 灵动云如何, 灵动云套餐价格, 灵动云流量, 灵动云节点测速, 机场推荐',
    reviewH1: '灵动云真实测评：2026套餐价格、均衡流量与节点测速报告'
  },
  quanqiuyun: {
    name: '全球云',
    airportTitle: '全球云如何？2026最新套餐价格/流量额度/中转优化节点测速评测 | 机场Top',
    airportDesc: '全球云怎么样？性价比老牌深度评测。月付¥20起享120GB经典中转优化流量，VLESS与Trojan双主流协议晚高峰测速吞吐、4K超清与TikTok支持、专属优惠码【tt88】折扣领取。',
    airportKw: '全球云, 全球云如何, 全球云怎么样, 全球云套餐价格, 全球云流量, 全球云节点测速, 全球云优惠码, 全球云官网, 性价比梯子, 机场推荐',
    airportH1: '全球云如何？2026最新套餐价格/流量额度/中转优化节点测速评测',

    reviewTitle: '全球云真实测评：2026套餐价格、双主流协议流量与晚高峰测速报告 | 机场Top',
    reviewDesc: '全球云性价比怎么样？2026深度使用报告。真实核算¥20月费资费单价、120GB起步中转流量、晚高峰4K流媒体测速与优惠券实操指引。',
    reviewKw: '全球云真实测评, 全球云怎么样, 全球云如何, 全球云套餐价格, 全球云流量, 全球云节点测速, 全球云优惠码, 梯子推荐',
    reviewH1: '全球云真实测评：2026套餐价格、双主流协议流量与晚高峰测速报告'
  }
};

// 辅助函数：替换 HTML 头部 TDK 与文章区 H1
function updateHtmlTdkAndH1(filePath, { title, desc, kw, h1 }) {
  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. 替换 <title>
  content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // 2. 替换 description
  if (content.includes('name="description"')) {
    content = content.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']/i, `<meta name="description" content="${desc}">`);
  } else {
    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>\n  <meta name="description" content="${desc}">`);
  }

  // 3. 替换 keywords
  if (content.includes('name="keywords"')) {
    content = content.replace(/<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']/i, `<meta name="keywords" content="${kw}">`);
  } else {
    content = content.replace(/<meta\s+name=["']description["'][^>]*>/i, `$& \n  <meta name="keywords" content="${kw}">`);
  }

  // 4. 替换 og 与 twitter
  content = content.replace(/<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']/i, `<meta property="og:title" content="${title}">`);
  content = content.replace(/<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']/i, `<meta property="og:description" content="${desc}">`);
  content = content.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']/i, `<meta name="twitter:title" content="${title}">`);
  content = content.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']/i, `<meta name="twitter:description" content="${desc}">`);

  // 5. 替换文章内的唯一 <h1>
  content = content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, `<h1 class="article-title">${h1}</h1>`);

  // 6. 替换 Schema.org 中的 headline
  content = content.replace(/"headline":\s*"[^"]*"/i, `"headline": "${h1.replace(/"/g, '\\"')}"`);

  fs.writeFileSync(filePath, content, 'utf8');
}

// 遍历更新所有 14 个品牌的 airport 和 review 页面
console.log('🚀 正在为全部 14 个品牌注入高权威专业 TDK 与 H1...');
Object.keys(brandTdkConfig).forEach(slug => {
  const conf = brandTdkConfig[slug];

  // 更新 airport 专页
  const apPath = path.join(rootDir, 'airport', `${slug}.html`);
  updateHtmlTdkAndH1(apPath, {
    title: conf.airportTitle,
    desc: conf.airportDesc,
    kw: conf.airportKw,
    h1: conf.airportH1
  });
  console.log(`✅ 已更新 Airport 落地页 TDK & H1: airport/${slug}.html`);

  // 更新 review 评测专页
  const rvPath = path.join(rootDir, 'review', `${slug}.html`);
  updateHtmlTdkAndH1(rvPath, {
    title: conf.reviewTitle,
    desc: conf.reviewDesc,
    kw: conf.reviewKw,
    h1: conf.reviewH1
  });
  console.log(`✅ 已更新 Review 评测页 TDK & H1: review/${slug}.html`);
});

// 同步更新 docs/keyword-map.csv
console.log('\n📑 正在同步更新 docs/keyword-map.csv 中品牌的关键词映射...');
const csvPath = path.join(rootDir, 'docs', 'keyword-map.csv');
let csvContent = fs.readFileSync(csvPath, 'utf8');
Object.keys(brandTdkConfig).forEach(slug => {
  const conf = brandTdkConfig[slug];
  // 匹配并替换或追加
  const apLineRegex = new RegExp(`airport/${slug}\\.html,[^\\n]*`, 'g');
  const rvLineRegex = new RegExp(`review/${slug}\\.html,[^\\n]*`, 'g');
  const newApLine = `airport/${slug}.html,品牌资料库,"${conf.airportKw}","${conf.airportTitle}","品牌综合资料与节点资费评测"`;
  const newRvLine = `review/${slug}.html,深度评测,"${conf.reviewKw}","${conf.reviewTitle}","真实测速与单GB单价测评"`;

  if (csvContent.match(apLineRegex)) {
    csvContent = csvContent.replace(apLineRegex, newApLine);
  } else {
    csvContent += `\n${newApLine}`;
  }

  if (csvContent.match(rvLineRegex)) {
    csvContent = csvContent.replace(rvLineRegex, newRvLine);
  } else {
    csvContent += `\n${newRvLine}`;
  }
});
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log('✅ docs/keyword-map.csv 映射表已更新！');

// 同步更新 js/main.js 搜索索引
console.log('\n🔍 正在同步更新 js/main.js 站内搜索库中的品牌页面标题与摘要...');
const mainJsPath = path.join(rootDir, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');
const searchDbMatch = mainJs.match(/const SEARCH_DATABASE = (\[[\s\S]*?\]);/i);
if (searchDbMatch) {
  let searchDb = JSON.parse(searchDbMatch[1]);
  searchDb.forEach(item => {
    Object.keys(brandTdkConfig).forEach(slug => {
      const conf = brandTdkConfig[slug];
      if (item.url === `airport/${slug}.html`) {
        item.title = conf.airportTitle;
        item.desc = conf.airportDesc.slice(0, 100);
      } else if (item.url === `review/${slug}.html`) {
        item.title = conf.reviewTitle;
        item.desc = conf.reviewDesc.slice(0, 100);
      }
    });
  });
  mainJs = mainJs.replace(/const SEARCH_DATABASE = \[[\s\S]*?\];/i, `const SEARCH_DATABASE = ${JSON.stringify(searchDb)};`);
  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('✅ js/main.js 搜索库标题已同步！');
}

console.log('\n🎉 全部 14 个品牌共 28 个页面的专业 TDK 与 H1 升级完毕！');
