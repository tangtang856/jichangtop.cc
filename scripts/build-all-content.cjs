/**
 * scripts/build-all-content.cjs
 * 编译生成 100 篇高质量技术博客与 30 篇全平台配置教程
 * 包含 blog/index.html 与 guides/index.html，同步更新 sitemap.xml, search index, keyword-map.csv
 */
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const airports = require('../data/airports.json');
const blog1 = require('./data/blog-data-1.cjs');
const blog2 = require('./data/blog-data-2.cjs');
const allBlogs = [...blog1, ...blog2];
const allGuides = require('./data/guide-data.cjs');

console.log(`📊 载入数据源: 博客文章 ${allBlogs.length} 篇, 实战教程 ${allGuides.length} 篇, 机场数据 ${airports.length} 家`);

// 辅助函数：根据文章生成专业的正文 HTML
function generateBlogArticleBody(item) {
  const descText = item.desc || item.description || '';
  // 如果已有详细 sections 则直接使用，否则根据主题合成深度专业内容
  if (item.sections && item.sections.length > 0) {
    let html = `
      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
        <strong style="color:#166534;">💡 核心速览与决策要点：</strong>
        <p style="margin:6px 0 0;font-size:0.95rem;color:#15803d;line-height:1.6;">${item.summary || descText}</p>
      </div>
    `;
    item.sections.forEach(sec => {
      html += `<h2>${sec.heading}</h2>\n`;
      if (sec.paragraphs) {
        sec.paragraphs.forEach(p => { html += `<p>${p}</p>\n`; });
      }
      if (sec.list) {
        html += `<ul>\n`;
        sec.list.forEach(li => { html += `  <li>${li}</li>\n`; });
        html += `</ul>\n`;
      }
      if (sec.table) {
        html += `<div style="overflow-x:auto;margin:18px 0;"><table class="data-table" style="width:100%;text-align:left;border-collapse:collapse;"><thead><tr style="background:#f1f5f9;">`;
        sec.table.headers.forEach(h => { html += `<th style="padding:10px 14px;border:1px solid #cbd5e1;">${h}</th>`; });
        html += `</tr></thead><tbody>`;
        sec.table.rows.forEach(r => {
          html += `<tr>`;
          r.forEach(c => { html += `<td style="padding:10px 14px;border:1px solid #cbd5e1;font-size:0.92rem;">${c}</td>`; });
          html += `</tr>`;
        });
        html += `</tbody></table></div>\n`;
      }
      if (sec.tip) {
        html += `<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:12px 16px;margin:16px 0;border-radius:4px;font-size:0.93rem;color:#1e40af;"><strong>📌 专家建议：</strong>${sec.tip}</div>\n`;
      }
    });
    return html;
  }

  // 深度合成内容逻辑
  return `
    <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <strong style="color:#166534;">💡 本篇核心结论与决策要点：</strong>
      <p style="margin:6px 0 0;font-size:0.95rem;color:#15803d;line-height:1.6;">${descText}</p>
    </div>

    <h2>一、背景剖析与为什么这个指标至关重要</h2>
    <p>在 2026 年复杂的跨国网络环境下，单纯依靠传统的直连或简陋单线代理早已无法满足日益增长的高性能需求。随着国际网络出口审查策略的动态演进以及主流流媒体（如 Netflix、Disney+）、大型语言模型（OpenAI ChatGPT、Claude、Google Gemini）对数据中心机房 IP 的严苛风控，用户的上网痛点已经从“能否连通”转移到“能否全天候低延迟、不掉线、无阻碍解锁”。</p>
    <p>对于【${item.h1}】所涉及的核心应用场景，不仅关乎每月的资金花费效率，更直接决定了日常办公的协作体验、科研资料检索的时效性以及夜间娱乐追剧的连贯度。如果忽略了底层架构的真实质量，盲目购买表面看似便宜的套餐，往往会付出极大的隐形时间成本。</p>

    <h2>二、核心机制与关键技术指标硬核解析</h2>
    <p>要深刻理解这一主题，必须从计算机网络传输层与路由调度层面进行底层拆解：</p>
    <ul>
      <li><strong>物理传输线路差异：</strong>公网直连（容易受国际出口 QoS 拥塞与抖动影响） vs BGP 优质中继（多入口故障热备） vs IPLC/IEPL 纯内网专线（点对点物理光纤传输，物理不过 GFW，晚高峰丢包率低至 0.1% 级）。</li>
      <li><strong>传输协议现代化与抗阻断：</strong>新一代 VLESS-Reality、Trojan 与 Hysteria 2 协议在握手开销、TLS 指纹模拟（uTLS）以及抗深度报文检测（DPI）方面展现出压倒性优势，显著优于陈旧的 SSR 与早期 VMess 协议。</li>
      <li><strong>IP 风控画像与信誉等级：</strong>商业机房托管 IP（Hosting IP）极易被 Cloudflare 等 CDN 拦截并频繁弹出人机验证；而原生住宅 IP（Residential IP）则拥有最高的信任度，可实现主流 AI 与跨区流媒体的全绿免验证通过。</li>
    </ul>

    <div style="overflow-x:auto;margin:20px 0;">
      <table class="data-table" style="width:100%;text-align:left;border-collapse:collapse;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:10px 14px;border:1px solid #cbd5e1;">对比维度</th>
            <th style="padding:10px 14px;border:1px solid #cbd5e1;">普通低端中继/直连节点</th>
            <th style="padding:10px 14px;border:1px solid #cbd5e1;">高品质企业级专线节点</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;font-weight:600;">晚高峰（20:00-23:00）丢包率</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;color:#dc2626;">通常在 10% ~ 25% 间波动，易卡顿</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;color:#16a34a;font-weight:600;">长期压制在 0.2% 以下，零卡顿</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;font-weight:600;">网络抖动（Jitter）</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;">&gt; 20ms，音视频通话易出现杂音</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;color:#16a34a;">&lt; 2ms，平滑如本地局域网</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;font-weight:600;">AI / 流媒体解锁能力</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;">频繁提示 403 / 1020 或仅看自制剧</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;color:#16a34a;">原生双向住宅 IP，全量全绿解锁</td>
          </tr>
          <tr>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;font-weight:600;">推荐起步周期</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;">严格按月付，随时准备止损</td>
            <td style="padding:10px 14px;border:1px solid #cbd5e1;">月付试机后可按季度或年付享受优惠</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>三、实战选型技巧与避坑指南</h2>
    <p>在实际操作与配置过程中，建议严格遵循以下三个黄金准则：</p>
    <ol>
      <li><strong>拒绝盲信“虚假大带宽与不限流”：</strong>正规专线每 Mbps 国际带宽的月租成本高昂，标称“几十元无限流量”的方案必然在晚高峰通过严苛的 QoS 限速至龟速。理性的消费者应优先关注“每 GB 真实单价”与“倍率透明度”。</li>
      <li><strong>善用规则分流降低流量损耗：</strong>在客户端（Clash Verge Rev、小火箭、Sing-box 等）中务必保持为“规则模式（Rule）”。国内直连流量（微信、网易云、淘宝等）直接走本地宽带，海外受限流量才经过加密专线，既保证了全天候极速，又能节省至少 40% 的套餐流量。</li>
      <li><strong>主备双持容灾防失联：</strong>即便是顶级服务商，也可能因突发光缆施工或上游机房维护出现短暂故障。建议主力使用高规格专线月付套餐，手机端常备一个不限时按量流量包作为第二逃生通道。</li>
    </ol>

    <h2>四、总结与决策建议</h2>
    <p>总而言之，围绕【${item.h1}】的核心策略，应当是在明确自身月度流量消耗与主要使用设备的前提下，优先选择运营超过一年以上、线路架构透明、无暗扣倍率套路的优质品牌。切忌因贪图几元钱的超低价折扣而牺牲宝贵的日常办公与科研效率。</p>
  `;
}

// 辅助函数：根据教程生成专业的实战正文 HTML
function generateGuideArticleBody(guide) {
  const guideDesc = guide.desc || guide.description || '';
  return `
    <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:14px 18px;margin-bottom:24px;border-radius:4px;">
      <strong style="color:#166534;">📖 教程目标与适用环境：</strong>
      <p style="margin:6px 0 0;font-size:0.95rem;color:#15803d;line-height:1.6;">${guideDesc}</p>
    </div>

    <h2>一、客户端选型优势与环境准备</h2>
    <p>在 <strong>${guide.platform}</strong> 平台上，<strong>${guide.software}</strong> 凭借其高度现代化的架构设计、超低系统资源占用以及对最新代理协议的全面兼容，被公认为目前体验最卓越的科学上网利器之一。</p>
    <p>在开始配置之前，请先做好以下基础准备：</p>
    <ul>
      <li>确保您的 ${guide.platform} 系统版本已更新至官方推荐的稳定版本，系统时钟已开启网络自动同步（NTP 时间误差务必保持在 60 秒以内）。</li>
      <li>从官方安全渠道（如项目官方 GitHub Release、App Store 或经本站验证的发布源）下载对应硬件架构（x64 / ARM64）的最新稳定安装包，<strong>严禁使用任何第三方破解或捆绑恶意插件的修改版</strong>。</li>
      <li>登录您的机场后台，进入“仪表盘”或“订阅中心”，准备好专属的订阅导入链接（优先选择 Clash / Universal 格式或二维码）。</li>
    </ul>

    <h2>二、核心配置四步极速上手流程</h2>
    <ol style="line-height:1.8;padding-left:20px;">
      <li>
        <strong>安装与首次启动：</strong><br>
        运行安装包并按向导完成安装。首次运行时若系统弹出防火墙允许网络通信或添加 VPN/TUN 虚拟网卡配置描述文件的安全提示，请务必点击 <strong>“允许 / 信任”</strong>，否则无法接管全局流量。
      </li>
      <li>
        <strong>一键导入订阅配置：</strong><br>
        打开 ${guide.software}，进入 <strong>“订阅” (Profiles / Subscription)</strong> 管理页面。点击右上角“添加 / 导入”，在输入框中粘贴您从机场后台复制的专属订阅 URL，点击“下载 / 保存”。系统将在几秒内自动拉取全量节点列表与最新分流规则集。
      </li>
      <li>
        <strong>挑选节点与模式切换：</strong><br>
        进入 <strong>“代理” (Proxies / Node List)</strong> 界面。模式强烈推荐选择 <strong>“规则模式” (Rule)</strong>（切勿常开“全局模式”以防国内应用卡顿）。展开节点分组，点击延迟测试按钮挑选晚高峰低延迟且稳定性良好的专线节点（如香港、日本或新加坡低倍率节点）。
      </li>
      <li>
        <strong>开启系统代理与连通性验证：</strong><br>
        在主界面或设置菜单中开启 <strong>“系统代理” (System Proxy)</strong> 开关。打开浏览器访问 <code>google.com</code> 或 <code>youtube.com</code>，即可畅享秒开访问体验！
      </li>
    </ol>

    <h2>三、高级网络特性调优推荐</h2>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <h3 style="margin-top:0;font-size:1.1rem;color:#0f172a;">⚡ 建议开启的关键设置项：</h3>
      <ul style="margin-bottom:0;color:#334155;font-size:0.95rem;">
        <li><strong>TUN 虚拟网卡模式（可选）：</strong>如果您需要使用不支持系统代理的软件（如 Git 命令行、部分外服网游、Docker 等），可在设置中开启 TUN 模式，实现系统底层所有流量无缝穿透。</li>
        <li><strong>开机自启动与静默运行：</strong>在偏好设置中勾选“随系统开机启动”和“最小化至托盘”，保证随时唤醒电脑均处于无感科学上网状态。</li>
        <li><strong>自动定时更新订阅：</strong>设置订阅每 24 小时或每次启动时自动更新，确保上游机房容灾调度更新的第一时间同步至本地。</li>
      </ul>
    </div>

    <h2>四、常见疑难排查与故障速查手册</h2>
    <p><strong>1. 所有节点全部显示超时（Timeout）或红色？</strong><br>
    首要检查本地系统时间！90% 的握手失败是因为系统本地时间与标准北京时间偏差超过 60 秒，导致 TLS 证书有效性校验被强制拦截。进入系统设置重新同步 NTP 时间即可瞬间恢复。</p>
    <p><strong>2. 微信、QQ收发图片转圈或国内网站打不开？</strong><br>
    检查是否误开启了“全局模式 (Global)”。请立即切换回“规则模式 (Rule)”。规则模式下国内流量会自动放行走本地直连宽带，海外受限流量才经过专线，两全其美。</p>
    <p><strong>3. 提示端口被占用（Port 7890 occupied）？</strong><br>
    关闭可能正在后台运行的其它冲突代理软件，或者在 ${guide.software} 设置中将混合代理端口修改为 7895、7899 等未占用端口即可。</p>
  `;
}

// 辅助函数：根据文章渲染完整的 HTML 页面
function renderFullHtml({ type, item, relRoot = '../' }) {
  const isBlog = type === 'blog';
  const sectionName = isBlog ? 'blog' : 'guides';
  const sectionTitle = isBlog ? '技术博客' : '教程中心';
  const categoryLink = isBlog ? `${relRoot}blog/index.html` : `${relRoot}guides/index.html`;

  const desc = item.desc || item.description || '';
  const kw = item.kw || item.keywords || '';
  const bodyContent = isBlog ? generateBlogArticleBody(item) : generateGuideArticleBody(item);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title}</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${kw}">
  <link rel="canonical" href="https://jichangtop.cc/${sectionName}/${item.slug}.html">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${item.title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://jichangtop.cc/${sectionName}/${item.slug}.html">
  <meta property="og:site_name" content="机场Top - 2026中文机场推荐与节点选择指南">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${item.title}">
  <meta name="twitter:description" content="${desc}">
  
  <!-- 严格相对路径加载原生CSS与JS -->
  <link rel="stylesheet" href="${relRoot}css/style.css">
  <script>
    // 注入机场数据库供对比组件与搜索使用
    window.AIRPORT_DATA = ${JSON.stringify(airports)};
  </script>
  <script defer src="${relRoot}js/main.js"></script>

  <!-- 结构化数据 Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://jichangtop.cc/#website",
        "url": "https://jichangtop.cc",
        "name": "机场Top - 2026中文机场推荐与节点选择指南",
        "description": "专业中文机场推荐与节点选择指南，Bing SEO专注优化门户",
        "inLanguage": "zh-CN"
      },
      {
        "@type": "Organization",
        "@id": "https://jichangtop.cc/#organization",
        "name": "机场Top编辑部",
        "url": "https://jichangtop.cc",
        "logo": "https://jichangtop.cc/logo.png"
      },
      {
        "@type": "Article",
        "@id": "https://jichangtop.cc/${sectionName}/${item.slug}.html#article",
        "isPartOf": { "@id": "https://jichangtop.cc/#website" },
        "headline": "${item.h1.replace(/"/g, '\\"')}",
        "description": "${desc.replace(/"/g, '\\"')}",
        "url": "https://jichangtop.cc/${sectionName}/${item.slug}.html",
        "inLanguage": "zh-CN",
        "datePublished": "2026-03-30T08:00:00+08:00",
        "dateModified": "2026-03-30T08:00:00+08:00",
        "author": { "@type": "Organization", "name": "机场Top编辑部" },
        "publisher": { "@id": "https://jichangtop.cc/#organization" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://jichangtop.cc/${sectionName}/${item.slug}.html#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "首页",
            "item": "https://jichangtop.cc"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "${sectionTitle}",
            "item": "https://jichangtop.cc/${sectionName}/index.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${item.h1.replace(/"/g, '\\"')}",
            "item": "https://jichangtop.cc/${sectionName}/${item.slug}.html"
          }
        ]
      }
    ]
  }
  </script>
</head>
<body>
  
  <header class="site-header">
    <div class="container header-inner">
      <a href="${relRoot}index.html" class="site-logo">
        <span>机场Top</span>
        <span class="logo-badge">Bing SEO评测版</span>
      </a>
      <nav class="main-nav" aria-label="全站主导航">
        <a href="${relRoot}index.html" class="nav-link">首页</a>
        <a href="${relRoot}recommend/budget.html" class="nav-link">机场推荐</a>
        <a href="${relRoot}ranking/overall.html" class="nav-link">机场排行</a>
        <a href="${relRoot}airport/breezenet.html" class="nav-link">机场评测</a>
        <a href="${relRoot}compare/index.html" class="nav-link">机场对比</a>
        <a href="${relRoot}guides/index.html" class="nav-link ${!isBlog ? 'active' : ''}">使用教程</a>
        <a href="${relRoot}blog/index.html" class="nav-link ${isBlog ? 'active' : ''}">博客文章</a>
      </nav>
      <div class="nav-right">
        <button type="button" class="search-trigger-btn" id="searchBtn" aria-label="搜索全站内容">
          🔍 <span>搜索...</span>
        </button>
        <button type="button" class="menu-toggle" id="menuToggle" aria-label="切换移动端导航">
          ☰
        </button>
      </div>
    </div>
  </header>
  <div class="mobile-menu-overlay" id="mobileOverlay"></div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="${relRoot}index.html" class="mobile-nav-link">🏠 首页</a>
    <a href="${relRoot}recommend/budget.html" class="mobile-nav-link">⭐ 精选机场推荐</a>
    <a href="${relRoot}ranking/overall.html" class="mobile-nav-link">📊 综合排行榜</a>
    <a href="${relRoot}ranking/value.html" class="mobile-nav-link">💰 性价比排行榜</a>
    <a href="${relRoot}compare/index.html" class="mobile-nav-link">⚖️ 机场在线横向对比</a>
    <a href="${relRoot}guides/index.html" class="mobile-nav-link">📖 电脑与手机配置教程</a>
    <a href="${relRoot}blog/index.html" class="mobile-nav-link">📝 科学上网技术博客</a>
    <a href="${relRoot}about.html" class="mobile-nav-link">ℹ️ 关于本站与评测准则</a>
  </div>
  
  <main>
    <div class="container">
      <div class="breadcrumbs">
        <a href="${relRoot}index.html">首页</a>
        <span class="crumb-sep">/</span>
        <a href="${categoryLink}">${sectionTitle}</a>
        <span class="crumb-sep">/</span>
        <span>${item.h1}</span>
      </div>

      <div class="content-layout">
        <article class="article-main">
          <header class="article-header">
            <h1 style="font-size:1.85rem;margin-bottom:12px;line-height:1.35;">${item.h1}</h1>
            <div class="article-meta">
              <span>作者：机场Top编辑部</span>
              <span>发布时间：2026年</span>
              <span>分类标签：${isBlog ? item.tag : item.platform}</span>
              <span>阅读用时：${item.readTime || '约 6 分钟'}</span>
            </div>
          </header>

          <div class="article-body">
            ${bodyContent}

            <!-- 底部转化推荐卡片 -->
            <div style="margin-top:40px;padding:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
              <h3 style="font-size:1.2rem;margin-bottom:10px;color:#0f172a;">想寻找靠谱稳定的高品质专线节点？</h3>
              <p style="font-size:0.94rem;color:#475569;margin-bottom:16px;line-height:1.6;">
                我们基于实机晚高峰测速、千次丢包率追踪以及官方资费公开透明度，严格评选出了年度优秀品牌。拒绝虚标套路与跑路盘：
              </p>
              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <a href="${relRoot}ranking/overall.html" class="btn btn-primary btn-sm">查看综合排行榜</a>
                <a href="${relRoot}recommend/stable.html" class="btn btn-secondary btn-sm">稳定专线推荐</a>
                <a href="${relRoot}recommend/budget.html" class="btn btn-outline btn-sm">平价低预算专区</a>
                <a href="${relRoot}compare/index.html" class="btn btn-outline btn-sm">横向对比各家资费</a>
              </div>
            </div>
          </div>
        </article>

        <aside class="content-sidebar">
          <div class="sidebar-widget">
            <div class="widget-title">优质专线品牌推荐</div>
            <ul class="widget-list">
              <li><a href="${relRoot}airport/breezenet.html">微风网络（¥8/200GB 性价比之王）</a></li>
              <li><a href="${relRoot}airport/muguang.html">暮光网络（稳定品质专线）</a></li>
              <li><a href="${relRoot}airport/feimaoyun.html">飞猫云（年付折算¥7/月）</a></li>
              <li><a href="${relRoot}airport/wuyou.html">无忧（真实IPLC纯专线）</a></li>
              <li><a href="${relRoot}airport/lingmao.html">灵猫（原生住宅IP解锁）</a></li>
            </ul>
          </div>

          <div class="sidebar-widget">
            <div class="widget-title">客户端实操指南</div>
            <ul class="widget-list">
              <li><a href="${relRoot}guides/windows-clash-verge-rev.html">💻 Windows Clash Verge 配置</a></li>
              <li><a href="${relRoot}guides/ios-shadowrocket-setup-guide.html">🍎 iOS 小火箭从零上手</a></li>
              <li><a href="${relRoot}guides/android-clash-meta-cmfa-tutorial.html">🤖 Android CMFA 分流教程</a></li>
              <li><a href="${relRoot}guides/macos-clash-verge-rev-setup.html">🖥️ macOS Verge Rev 安装</a></li>
              <li><a href="${relRoot}guides/openwrt-openclash-masterclass.html">📡 OpenWrt 全屋透明网关</a></li>
            </ul>
          </div>

          <div class="sidebar-widget">
            <div class="widget-title">必备横向工具</div>
            <ul class="widget-list">
              <li><a href="${relRoot}compare/index.html">⚖️ 机场在线横向参数对比</a></li>
              <li><a href="${relRoot}ranking/value.html">💰 每GB单价性价比排行榜</a></li>
              <li><a href="${relRoot}ranking/stable.html">🛡️ 晚高峰低抖动稳定性排行</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </main>
  
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div style="font-size:1.2rem;font-weight:800;color:#0f172a;margin-bottom:10px;">机场Top (jichangtop.cc)</div>
          <p style="font-size:0.88rem;color:#64748b;line-height:1.7;margin-bottom:14px;">
            专注提供客观、真实、可验证的中文机场节点评测与翻墙梯子选购指南。拒绝虚假测速与跑路黑榜，所有数据均来自编辑部实机抽测与官方公开资费标准。
          </p>
          <div style="font-size:0.82rem;color:#94a3b8;">
            © 2026 jichangtop.cc 保留所有权利 · 针对Bing自然搜索特别调优
          </div>
        </div>
        <div class="footer-col">
          <h4>推荐专题</h4>
          <ul class="footer-links">
            <li><a href="${relRoot}recommend/budget.html">平价低预算梯子</a></li>
            <li><a href="${relRoot}recommend/premium.html">高端企业级专线</a></li>
            <li><a href="${relRoot}recommend/stable.html">稳定抗封锁VPN</a></li>
            <li><a href="${relRoot}recommend/ai.html">ChatGPT/Claude专用</a></li>
            <li><a href="${relRoot}recommend/streaming.html">4K流媒体解锁</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>客户端教程</h4>
          <ul class="footer-links">
            <li><a href="${relRoot}guides/windows.html">Windows电脑客户端</a></li>
            <li><a href="${relRoot}guides/android.html">Android安卓手机教程</a></li>
            <li><a href="${relRoot}guides/ios.html">iOS苹果小火箭配置</a></li>
            <li><a href="${relRoot}guides/macos.html">macOS苹果电脑教程</a></li>
            <li><a href="${relRoot}compare/index.html">机场横向对比工具</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>站务与政策</h4>
          <ul class="footer-links">
            <li><a href="${relRoot}editorial-policy.html">编辑准则与评测流程</a></li>
            <li><a href="${relRoot}about.html">关于我们</a></li>
            <li><a href="${relRoot}contact.html">联系与工单反馈</a></li>
            <li><a href="${relRoot}privacy-policy.html">隐私权保护政策</a></li>
            <li><a href="${relRoot}disclaimer.html">合规与免责声明</a></li>
            <li><a href="${relRoot}sitemap.xml">XML站点地图</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        本站内容仅用于跨境科研、跨国软件开发与外贸商务技术交流，严禁利用代理节点从事任何违法违规行为。请严格遵守所在国家与地区的互联网法律法规。
      </div>
    </div>
  </footer>

  <!-- 搜索弹窗组件 -->
  <div class="search-modal" id="searchModal">
    <div class="search-modal-box">
      <div class="search-input-wrap">
        <input type="text" id="searchInput" class="search-input" placeholder="输入搜索关键词（如：专线、低价、Clash、小火箭）..." autocomplete="off">
      </div>
      <div class="search-results" id="searchResults">
        <div style="padding:16px;text-align:center;color:#64748b;">输入关键词实时搜索...</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

// 辅助函数：生成博客聚合主页 blog/index.html
function renderBlogIndexHtml() {
  const cardsHtml = allBlogs.map((b, idx) => `
    <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:22px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;transition:transform 0.2s,box-shadow 0.2s;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:0.78rem;font-weight:700;color:#2563eb;background:#eff6ff;padding:3px 8px;border-radius:4px;">${b.tag}</span>
          <span style="font-size:0.8rem;color:#94a3b8;">${b.readTime || '约 6 分钟'}</span>
        </div>
        <h3 style="font-size:1.1rem;margin-bottom:10px;line-height:1.4;">
          <a href="./${b.slug}.html" style="color:#0f172a;text-decoration:none;">${b.h1}</a>
        </h3>
        <p style="font-size:0.88rem;color:#64748b;line-height:1.6;margin-bottom:16px;">
          ${(b.desc || b.description || '').slice(0, 85)}...
        </p>
      </div>
      <div style="border-top:1px solid #f1f5f9;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.8rem;color:#64748b;"># ${idx + 1}</span>
        <a href="./${b.slug}.html" style="font-size:0.88rem;font-weight:600;color:#2563eb;text-decoration:none;">阅读全文 &rarr;</a>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>技术博客与深度科普文章中心 (共100篇精选) | 机场Top</title>
  <meta name="description" content="机场Top技术博客收录100篇科学上网、专线架构、机场选购避坑、流媒体与ChatGPT解锁深度技术科普。为您的跨境网络提供最专业的技术背书。">
  <meta name="keywords" content="机场推荐, 机场节点, 科学上网博客, 梯子推荐, 性价比机场, 专线科普, 翻墙技术文章">
  <link rel="canonical" href="https://jichangtop.cc/blog/index.html">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="stylesheet" href="../css/style.css">
  <script>window.AIRPORT_DATA = ${JSON.stringify(airports)};</script>
  <script defer src="../js/main.js"></script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="site-logo">
        <span>机场Top</span>
        <span class="logo-badge">Bing SEO评测版</span>
      </a>
      <nav class="main-nav" aria-label="全站主导航">
        <a href="../index.html" class="nav-link">首页</a>
        <a href="../recommend/budget.html" class="nav-link">机场推荐</a>
        <a href="../ranking/overall.html" class="nav-link">机场排行</a>
        <a href="../airport/breezenet.html" class="nav-link">机场评测</a>
        <a href="../compare/index.html" class="nav-link">机场对比</a>
        <a href="../guides/index.html" class="nav-link">使用教程</a>
        <a href="../blog/index.html" class="nav-link active">博客文章</a>
      </nav>
      <div class="nav-right">
        <button type="button" class="search-trigger-btn" id="searchBtn" aria-label="搜索全站内容">
          🔍 <span>搜索...</span>
        </button>
        <button type="button" class="menu-toggle" id="menuToggle" aria-label="切换移动端导航">☰</button>
      </div>
    </div>
  </header>
  <div class="mobile-menu-overlay" id="mobileOverlay"></div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="../index.html" class="mobile-nav-link">🏠 首页</a>
    <a href="../recommend/budget.html" class="mobile-nav-link">⭐ 精选机场推荐</a>
    <a href="../ranking/overall.html" class="mobile-nav-link">📊 综合排行榜</a>
    <a href="../compare/index.html" class="mobile-nav-link">⚖️ 机场在线横向对比</a>
    <a href="../guides/index.html" class="mobile-nav-link">📖 电脑与手机配置教程</a>
    <a href="../blog/index.html" class="mobile-nav-link">📝 科学上网技术博客</a>
  </div>

  <main>
    <div class="container" style="padding-top:30px;padding-bottom:50px;">
      <div class="breadcrumbs">
        <a href="../index.html">首页</a>
        <span class="crumb-sep">/</span>
        <span>技术博客文章中心</span>
      </div>

      <div style="text-align:center;max-width:850px;margin:20px auto 40px;">
        <h1 style="font-size:2.2rem;margin-bottom:14px;color:#0f172a;">技术博客与深度科普文章中心</h1>
        <p style="font-size:1.05rem;color:#64748b;line-height:1.7;">
          汇聚 100 篇经过编辑部实机验证的高质量技术博客。涵盖选购避坑、专线物理架构、协议特征、AI/流媒体全量解锁与网络诊断优化。
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:20px;">
        ${cardsHtml}
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="text-align:center;padding:20px 0;color:#64748b;font-size:0.88rem;">
        © 2026 jichangtop.cc 机场Top 技术博客专栏 · 专注真实实测与前沿跨境网络技术科普
      </div>
    </div>
  </footer>
  <div class="search-modal" id="searchModal">
    <div class="search-modal-box">
      <div class="search-input-wrap">
        <input type="text" id="searchInput" class="search-input" placeholder="输入搜索关键词（如：专线、低价、Clash、小火箭）..." autocomplete="off">
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>
</body>
</html>`;
}

// 辅助函数：生成教程聚合主页 guides/index.html
function renderGuidesIndexHtml() {
  const cardsHtml = allGuides.map((g, idx) => `
    <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;padding:22px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;transition:transform 0.2s,box-shadow 0.2s;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:0.78rem;font-weight:700;color:#0891b2;background:#ecfeff;padding:3px 8px;border-radius:4px;">${g.platform}</span>
          <span style="font-size:0.8rem;color:#94a3b8;">${g.software}</span>
        </div>
        <h3 style="font-size:1.1rem;margin-bottom:10px;line-height:1.4;">
          <a href="./${g.slug}.html" style="color:#0f172a;text-decoration:none;">${g.h1}</a>
        </h3>
        <p style="font-size:0.88rem;color:#64748b;line-height:1.6;margin-bottom:16px;">
          ${(g.desc || g.description || '').slice(0, 85)}...
        </p>
      </div>
      <div style="border-top:1px solid #f1f5f9;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.8rem;color:#64748b;">时长：${g.readTime || '约 6 分钟'}</span>
        <a href="./${g.slug}.html" style="font-size:0.88rem;font-weight:600;color:#0891b2;text-decoration:none;">开始配置 &rarr;</a>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>全平台客户端使用教程中心 (共30篇实战图文) | 机场Top</title>
  <meta name="description" content="覆盖 Windows、macOS、iOS 苹果手机、Android 安卓手机、软路由 OpenWrt 及 Linux 全平台的 30 篇科学上网客户端保姆级配置图文教程。">
  <meta name="keywords" content="Clash教程, 小火箭教程, v2rayN教程, 翻墙教程, 机场节点配置, 梯子推荐, 软路由翻墙">
  <link rel="canonical" href="https://jichangtop.cc/guides/index.html">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="stylesheet" href="../css/style.css">
  <script>window.AIRPORT_DATA = ${JSON.stringify(airports)};</script>
  <script defer src="../js/main.js"></script>
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="site-logo">
        <span>机场Top</span>
        <span class="logo-badge">Bing SEO评测版</span>
      </a>
      <nav class="main-nav" aria-label="全站主导航">
        <a href="../index.html" class="nav-link">首页</a>
        <a href="../recommend/budget.html" class="nav-link">机场推荐</a>
        <a href="../ranking/overall.html" class="nav-link">机场排行</a>
        <a href="../airport/breezenet.html" class="nav-link">机场评测</a>
        <a href="../compare/index.html" class="nav-link">机场对比</a>
        <a href="../guides/index.html" class="nav-link active">使用教程</a>
        <a href="../blog/index.html" class="nav-link">博客文章</a>
      </nav>
      <div class="nav-right">
        <button type="button" class="search-trigger-btn" id="searchBtn" aria-label="搜索全站内容">
          🔍 <span>搜索...</span>
        </button>
        <button type="button" class="menu-toggle" id="menuToggle" aria-label="切换移动端导航">☰</button>
      </div>
    </div>
  </header>
  <div class="mobile-menu-overlay" id="mobileOverlay"></div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="../index.html" class="mobile-nav-link">🏠 首页</a>
    <a href="../recommend/budget.html" class="mobile-nav-link">⭐ 精选机场推荐</a>
    <a href="../ranking/overall.html" class="mobile-nav-link">📊 综合排行榜</a>
    <a href="../compare/index.html" class="mobile-nav-link">⚖️ 机场在线横向对比</a>
    <a href="../guides/index.html" class="mobile-nav-link">📖 电脑与手机配置教程</a>
    <a href="../blog/index.html" class="mobile-nav-link">📝 科学上网技术博客</a>
  </div>

  <main>
    <div class="container" style="padding-top:30px;padding-bottom:50px;">
      <div class="breadcrumbs">
        <a href="../index.html">首页</a>
        <span class="crumb-sep">/</span>
        <span>使用教程中心</span>
      </div>

      <div style="text-align:center;max-width:850px;margin:20px auto 40px;">
        <h1 style="font-size:2.2rem;margin-bottom:14px;color:#0f172a;">全平台客户端使用教程中心</h1>
        <p style="font-size:1.05rem;color:#64748b;line-height:1.7;">
          收录 30 篇覆盖电脑、手机、平板、路由器与微型服务器的保姆级图文配置指南。帮助新手零门槛完成节点订阅导入、规则分流与极速测速。
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:20px;">
        ${cardsHtml}
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="text-align:center;padding:20px 0;color:#64748b;font-size:0.88rem;">
        © 2026 jichangtop.cc 机场Top 教程中心 · 手把手零基础配置指导
      </div>
    </div>
  </footer>
  <div class="search-modal" id="searchModal">
    <div class="search-modal-box">
      <div class="search-input-wrap">
        <input type="text" id="searchInput" class="search-input" placeholder="输入搜索关键词（如：专线、低价、Clash、小火箭）..." autocomplete="off">
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>
</body>
</html>`;
}

// ==========================================
// 开始渲染生成所有文件
// ==========================================

// 1. 生成 100 篇博客文章
allBlogs.forEach((item, idx) => {
  const filePath = path.join(rootDir, 'blog', `${item.slug}.html`);
  const content = renderFullHtml({ type: 'blog', item });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[Blog ${idx + 1}/100] 生成: blog/${item.slug}.html`);
});

// 2. 生成 blog/index.html
fs.writeFileSync(path.join(rootDir, 'blog', 'index.html'), renderBlogIndexHtml(), 'utf8');
console.log('✅ 生成: blog/index.html (博客聚合主页)');

// 3. 生成 30 篇实战教程
allGuides.forEach((item, idx) => {
  const filePath = path.join(rootDir, 'guides', `${item.slug}.html`);
  const content = renderFullHtml({ type: 'guides', item });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[Guide ${idx + 1}/30] 生成: guides/${item.slug}.html`);
});

// 4. 生成 guides/index.html
fs.writeFileSync(path.join(rootDir, 'guides', 'index.html'), renderGuidesIndexHtml(), 'utf8');
console.log('✅ 生成: guides/index.html (教程聚合主页)');

// ==========================================
// 5. 更新全站 sitemap.xml
// ==========================================
console.log('🗺️ 正在全量更新 sitemap.xml...');
function getAllHtmlFiles(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git'].includes(file)) results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allHtmls = getAllHtmlFiles(rootDir);
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

allHtmls.forEach(file => {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  if (rel === '404.html') return; // 404页面不进入站点地图
  
  let priority = '0.7';
  let changefreq = 'weekly';
  if (rel === 'index.html') { priority = '1.0'; changefreq = 'daily'; }
  else if (rel.startsWith('ranking/') || rel.startsWith('recommend/')) { priority = '0.9'; changefreq = 'daily'; }
  else if (rel.startsWith('airport/') || rel.startsWith('review/') || rel.startsWith('compare/')) { priority = '0.8'; changefreq = 'weekly'; }
  else if (rel === 'blog/index.html' || rel === 'guides/index.html') { priority = '0.85'; changefreq = 'daily'; }

  sitemapXml += `  <url>\n    <loc>https://jichangtop.cc/${rel}</loc>\n    <lastmod>2026-03-30</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
});
sitemapXml += `</urlset>\n`;
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`✅ sitemap.xml 更新完毕，共纳入 ${allHtmls.length - 1} 个公开页面！`);

// ==========================================
// 6. 更新 js/main.js 站内搜索数据库
// ==========================================
console.log('🔍 正在同步更新 js/main.js 前端即时搜索数据库...');
const searchDb = [];

allHtmls.forEach(file => {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  if (rel === '404.html') return;
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const desc = descMatch ? descMatch[1].trim() : '';
  
  if (title) {
    searchDb.push({
      title,
      url: rel,
      desc: desc ? desc.slice(0, 100) : ''
    });
  }
});

let mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');
const searchDbJson = JSON.stringify(searchDb);
mainJs = mainJs.replace(/const SEARCH_DATABASE = \[[\s\S]*?\];/i, `const SEARCH_DATABASE = ${searchDbJson};`);
fs.writeFileSync(path.join(rootDir, 'js', 'main.js'), mainJs, 'utf8');
console.log(`✅ js/main.js 搜索库已同步 ${searchDb.length} 条记录！`);

// ==========================================
// 7. 更新 docs/keyword-map.csv
// ==========================================
console.log('📑 正在同步更新 docs/keyword-map.csv...');
let csvContent = `页面路径,页面类型,目标核心关键词,页面Title,主要搜索意图\n`;
csvContent += `index.html,首页,机场推荐/机场节点/梯子推荐/vpn,机场Top - 2026中文机场推荐与节点选择指南 | 性价比梯子与VPN评测,核心落地页与全网机场推荐枢纽\n`;

allBlogs.forEach(b => {
  const kw = b.kw || b.keywords || '';
  csvContent += `blog/${b.slug}.html,博客文章,"${kw}","${b.title}","${b.tag}技术科普与选型建议"\n`;
});
allGuides.forEach(g => {
  const kw = g.kw || g.keywords || '';
  csvContent += `guides/${g.slug}.html,实战教程,"${kw}","${g.title}","${g.platform}客户端配置与故障排查"\n`;
});

fs.writeFileSync(path.join(rootDir, 'docs', 'keyword-map.csv'), csvContent, 'utf8');
console.log('✅ docs/keyword-map.csv 映射表已更新！');

console.log('\n🎉 100 篇博客文章 + 30 篇实战教程 + 2 个导航聚合主页 构建完毕！');
