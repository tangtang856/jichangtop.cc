/**
 * 2026 中文机场博客 · Bing SEO 专业建站系统 - 核心原生 JavaScript
 * 零外部依赖 | 秒开极速加载 | 适配 file:// 协议与标准相对路径
 */

(function () {
  'use strict';

  // 1. 判断当前页面相对根目录的前缀 (./ 或 ../)
  function getPathPrefix() {
    // 检查是否有在子目录的标记，或者根据当前 script 的 src 相对深度推断
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].getAttribute('src');
      if (src && src.includes('main.js')) {
        if (src.startsWith('../')) {
          return '../';
        }
        return './';
      }
    }
    return './';
  }

  const prefix = getPathPrefix();

  // 2. 移动端菜单切换
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (menuToggle && mobileMenu && mobileOverlay) {
    function toggleMenu(open) {
      if (open) {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('active');
      toggleMenu(!isOpen);
    });

    mobileOverlay.addEventListener('click', function () {
      toggleMenu(false);
    });
  }

  // 3. 全局搜索数据库与交互
  const SEARCH_INDEX = [
    // 首页与专题
    { title: "2026优质机场推荐与节点选择指南", path: "index.html", desc: "主页综合落地页，涵盖IEPL专线、性价比中继与Hysteria2协议评测。" },
    { title: "平价实用梯子推荐 (低预算专题)", path: "recommend/budget.html", desc: "专为学生党与轻度上网设计的月付10元左右便宜高性价比机场推荐。" },
    { title: "高端专线机场推荐 (全IEPL专线)", path: "recommend/premium.html", desc: "全IEPL内网企业级专线，晚高峰零卡顿超低延迟，远程协同首选。" },
    { title: "新手入门机场推荐 (傻瓜一键导入)", path: "recommend/beginner.html", desc: "开箱即用免折腾，支持Clash、小火箭一键订阅导入与详细指引。" },
    { title: "稳定抗封锁VPN推荐 (防失联专题)", path: "recommend/stable.html", desc: "敏感时期防失联，多线路冗余容灾与企业级IPLC/IEPL保障。" },
    { title: "ChatGPT与Claude专用机场推荐", path: "recommend/ai.html", desc: "纯净原生住宅IP池，防止ChatGPT拒绝访问或Claude被封号。" },
    { title: "4K流媒体解锁机场推荐 (Netflix/YouTube)", path: "recommend/streaming.html", desc: "超大带宽流媒体全解锁，支持Netflix、Disney+、动画疯秒开。" },

    // 排行榜
    { title: "2026综合实力VPN机场排行榜", path: "ranking/overall.html", desc: "晚高峰延迟、单GB成本测算与稳定性多维度全景榜单。" },
    { title: "2026高性价比机场排行榜", path: "ranking/value.html", desc: "真实单GB资费精准折算，拒绝倍率套路与年付跑路风险。" },
    { title: "便宜低预算机场排行榜", path: "ranking/budget.html", desc: "月付10元内轻度上网与学生党精选榜单。" },
    { title: "最稳定抗封锁机场排行榜", path: "ranking/stable.html", desc: "敏感时期防失联，晚高峰低丢包率硬核稳定性测评排行。" },

    // 对比工具
    { title: "机场在线横向对比工具", path: "compare/index.html", desc: "自由勾选2至4家机场，全维度PK价格、线路、协议与解锁能力。" },

    // 机场评测
    { title: "微风网络 Breezenet 深度评测与资费解析", path: "airport/breezenet.html", desc: "主打超高性价比的IEPL/IPLC专线节点品牌，起步仅需¥8/月即可享受200GB超大可用流量，全线..." },
    { title: "暮光网络 深度评测与资费解析", path: "airport/muguang.html", desc: "专注稳定专线网络架构的中高端节点品牌，全节点120GB起步，采用高规格VLESS与Trojan双加密..." },
    { title: "飞猫云 深度评测与资费解析", path: "airport/feimaoyun.html", desc: "老牌优质双线冗余机场，融合IEPL/IPLC内网骨干与多入口BGP优质中转，年付折算仅需¥7/月即可..." },
    { title: "无忧 深度评测与资费解析", path: "airport/wuyou.html", desc: "以真实独享IPLC内网专线为核心的无忧加速品牌，月付19元起享100GB纯专线不过墙流量，全面支持S..." },
    { title: "灵猫 深度评测与资费解析", path: "airport/lingmao.html", desc: "老牌高口碑IPLC纯专线机场，起步25元/月提供150GB专线流量，全节点配备原生住宅IP与大带宽端..." },
    { title: "闪跃 FlashLeap 深度评测与资费解析", path: "airport/flashleap.html", desc: "专注于超低延迟与电竞级连通性的IPLC纯专线品牌，部署千兆专线出口并集成Hysteria2激进防封协..." },
    { title: "萤火虫（Firefly） 深度评测与资费解析", path: "airport/firefly.html", desc: "主打亲民平价的优质优化线路机场，年付折算仅需¥8/月，起步门槛亲切，节点涵盖VLESS与Trojan..." },
    { title: "跨界 深度评测与资费解析", path: "airport/kuajiecloud.html", desc: "采用全专线网络架构的中高端服务商，起步20元/月提供120GB纯专线流量，全节点覆盖港日新美欧核心区..." },
    { title: "隐形人 深度评测与资费解析", path: "airport/yinxingren.html", desc: "主打极致隐私与隐匿穿透的高端IEPL纯专线机场，起步24元/月配备144GB企业级专线流量，全节点无..." },
    { title: "飞V 深度评测与资费解析", path: "airport/feiv.html", desc: "以颠覆性 ¥4.9/月超低起步价引发关注的高性价比机场，拥有100GB可用配额，同时提供罕见的¥29..." },
    { title: "梯子云 LadderCloud 深度评测与资费解析", path: "airport/laddercloud.html", desc: "老牌稳健的高速中转与专线混合调度服务商，月付25元起享125GB高速中转，旗舰套餐可达500GB海量..." },
    { title: "浪网 WaveNet 深度评测与资费解析", path: "airport/wavenet.html", desc: "主打自研深度优化客户端与专线融合架构的创新机场品牌，月付30元起享150GB专属优化流量，配备VLE..." },
    { title: "灵动云 深度评测与资费解析", path: "airport/lingdongcloud.html", desc: "配置透明无套路的平衡型中转优化服务商，起步20元/月提供100GB可用流量，主力采用Trojan安全..." },
    { title: "全球云 深度评测与资费解析", path: "airport/quanqiuyun.html", desc: "深度优化中转网络架构的性价比老牌，月付20元起提供120GB中转流量，支持VLESS与Trojan双..." },


    // 教程中心
    { title: "Windows客户端机场节点配置完整教程", path: "guides/windows.html", desc: "Clash Verge Rev与v2rayN电脑端详细安装与一键导入配置教程。" },
    { title: "Android手机机场客户端配置图文教程", path: "guides/android.html", desc: "Clash Meta与v2rayNG安卓客户端下载、订阅与分应用代理教程。" },
    { title: "iOS苹果手机小火箭与Loon配置教程", path: "guides/ios.html", desc: "Shadowrocket小火箭外区购买安装与扫码导入节点保姆级指引。" },
    { title: "macOS苹果电脑机场客户端配置教程", path: "guides/macos.html", desc: "Mac电脑安装Clash Verge与系统代理分流规则设置指南。" },

    // 博客文章
    { title: "机场节点深度解析：直连/中继/专线如何选", path: "blog/airport-nodes-selection-guide.html", desc: "BGP、IPLC、IEPL线路原理深度拆解与运营商适配技巧。" },
    { title: "如何挑选机场防止踩坑跑路？避坑7大准则", path: "blog/avoid-scam-airports.html", desc: "识别跑路机场的典型征兆，避免年付一次性被骗血汗钱。" },
    { title: "传统VPN与现代机场代理全景对比", path: "blog/vpn-vs-airport-proxy.html", desc: "协议特征、分流原理、抗封锁能力与真实速度全方位科普。" },
    { title: "机场晚高峰卡顿慢？5步定位原因与调优实操", path: "blog/evening-peak-lag-fix.html", desc: "本地DNS排查、节点更换与客户端配置优化的实用指引。" },
    { title: "为什么千万不要使用免费梯子和免费VPN？", path: "blog/free-vpn-risks.html", desc: "揭露免费节点背后的广告劫持、账号泄露与钓鱼抓包隐患。" },
    { title: "机场订阅链接使用全指南：导入与排错", path: "blog/how-to-use-subscription.html", desc: "订阅更新失败、节点超时不可用的排查与解决办法。" },

    // 术语百科
    { title: "什么是IPLC和IEPL专线？原理与优势科普", path: "glossary/iepl-iplc.html", desc: "点对点内网光纤物理过境，为什么晚高峰完全不卡顿？" },
    { title: "Shadowsocks协议详解：专线机场主力协议", path: "glossary/shadowsocks.html", desc: "轻量高效、低CPU占用与AEAD现代加密算法的工程应用。" },
    { title: "VLESS与Hysteria2协议深度对比与抗封锁解析", path: "glossary/vless-hysteria2.html", desc: "基于UDP的双边流控协议与Reality隐蔽伪装的最新技术探讨。" },
    { title: "GFW防火长城运作机制科普：DPI与封锁原理", path: "glossary/gfw.html", desc: "DNS污染、SNI阻断与TCP重置包是如何精准识别代理协议的？" },
    { title: "机场节点倍率详解：警惕高倍率扣费陷阱", path: "glossary/node-multiplier.html", desc: "倍率到底怎么算？如何识破虚假大流量的文字游戏。" }
  ];

  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchBtn && searchModal && searchInput && searchResults) {
    function openSearch() {
      searchModal.classList.add('active');
      searchInput.value = '';
      renderSearchResults('');
      setTimeout(function () {
        searchInput.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    searchBtn.addEventListener('click', openSearch);

    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    function renderSearchResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        searchResults.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;font-size:0.9rem;">输入关键词搜索文章、教程、排行榜与机场测评...</div>';
        return;
      }

      const matched = SEARCH_INDEX.filter(function (item) {
        return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      });

      if (matched.length === 0) {
        searchResults.innerHTML = '<div style="padding:24px;text-align:center;color:#64748b;font-size:0.9rem;">未找到相关页面，请尝试其他关键词（如：专线、Clash、价格）</div>';
        return;
      }

      let html = '';
      matched.forEach(function (item) {
        const link = prefix + item.path;
        html += '<a href="' + link + '" class="search-item">' +
          '<div class="search-item-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="search-item-desc">' + escapeHtml(item.desc) + '</div>' +
          '</a>';
      });
      searchResults.innerHTML = html;
    }

    searchInput.addEventListener('input', function (e) {
      renderSearchResults(e.target.value);
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 4. 机场在线横向对比系统
  const compareApp = document.getElementById('compareToolApp');
  if (compareApp && window.AIRPORT_DATA && Array.isArray(window.AIRPORT_DATA)) {
    initCompareTool(compareApp, window.AIRPORT_DATA, prefix);
  }

  function initCompareTool(container, airports, pathPrefix) {
    // 默认选中前三家机场
    let selectedIds = ['breezenet', 'feimaoyun', 'yinxingren'];

    function render() {
      let html = '<div class="compare-selector-bar">';
      html += '<span style="font-size:0.9rem;font-weight:700;color:#0f172a;margin-right:4px;">候选品牌 (勾选2-4家)：</span>';

      airports.forEach(function (ap) {
        const isSelected = selectedIds.includes(ap.id);
        const activeClass = isSelected ? 'selected' : '';
        html += '<button type="button" class="compare-chip ' + activeClass + '" data-id="' + ap.id + '">';
        html += (isSelected ? '✓ ' : '+ ') + escapeHtml(ap.name);
        html += '</button>';
      });
      html += '</div>';

      if (selectedIds.length < 2) {
        html += '<div style="padding:30px;text-align:center;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1;color:#64748b;">';
        html += '请至少勾选 2 家机场进行参数 PK（目前已选 ' + selectedIds.length + ' 家）';
        html += '</div>';
        container.innerHTML = html;
        bindEvents();
        return;
      }

      const activeAirports = airports.filter(function (a) {
        return selectedIds.includes(a.id);
      });

      html += '<div class="table-responsive">';
      html += '<table class="compare-table">';
      html += '<thead><tr>';
      html += '<th style="width:130px;text-align:left;">对比维度</th>';
      activeAirports.forEach(function (a) {
        html += '<th>';
        html += '<div style="font-size:1.05rem;font-weight:800;margin-bottom:4px;">' + escapeHtml(a.name) + '</div>';
        html += '<button type="button" class="remove-chip-btn" data-remove="' + a.id + '" style="background:none;border:none;color:#ef4444;font-size:0.75rem;cursor:pointer;">✕ 移除对比</button>';
        html += '</th>';
      });
      html += '</tr></thead>';

      html += '<tbody>';

      // 实测状态
      html += '<tr><th>核验状态</th>';
      activeAirports.forEach(function (a) {
        const badgeClass = a.testStatus === 'tested' ? 'status-tested' : 'status-official';
        const badgeText = a.testStatus === 'tested' ? '✓ 编辑部实测' : '● 官方公开资费';
        html += '<td><span class="badge-status ' + badgeClass + '">' + badgeText + '</span></td>';
      });
      html += '</tr>';

      // 起步价格
      html += '<tr><th>起步门槛</th>';
      activeAirports.forEach(function (a) {
        const primaryPlan = a.plans[0];
        html += '<td><strong style="color:#2563eb;font-size:1.1rem;">¥' + a.startingPrice + '</strong> <span style="font-size:0.8rem;color:#64748b;">(' + primaryPlan.billingCycle + ')</span></td>';
      });
      html += '</tr>';

      // 起步流量
      html += '<tr><th>起始套餐流量</th>';
      activeAirports.forEach(function (a) {
        const primaryPlan = a.plans[0];
        html += '<td><strong>' + primaryPlan.trafficGB + ' GB</strong></td>';
      });
      html += '</tr>';

      // 单GB成本测算
      html += '<tr><th>单GB成本折算</th>';
      activeAirports.forEach(function (a) {
        const primaryPlan = a.plans[0];
        html += '<td><span style="background:#eff6ff;color:#1d4ed8;padding:3px 8px;border-radius:4px;font-weight:700;">¥' + primaryPlan.unitPricePerGB + ' / GB</span></td>';
      });
      html += '</tr>';

      // 过境线路类型
      html += '<tr><th>主力线路类型</th>';
      activeAirports.forEach(function (a) {
        const primaryPlan = a.plans[0];
        html += '<td><strong>' + escapeHtml(primaryPlan.lineType) + '</strong></td>';
      });
      html += '</tr>';

      // 支持协议
      html += '<tr><th>支持网络协议</th>';
      activeAirports.forEach(function (a) {
        html += '<td>' + a.protocols.map(escapeHtml).join(' / ') + '</td>';
      });
      html += '</tr>';

      // 覆盖地区
      html += '<tr><th>节点覆盖范围</th>';
      activeAirports.forEach(function (a) {
        html += '<td style="font-size:0.82rem;color:#475569;">' + a.regions.slice(0, 6).map(escapeHtml).join('、') + (a.regions.length > 6 ? ' 等' : '') + '</td>';
      });
      html += '</tr>';

      // 同时在线设备限制
      html += '<tr><th>在线设备限制</th>';
      activeAirports.forEach(function (a) {
        html += '<td>' + escapeHtml(a.deviceLimit || '未说明') + '</td>';
      });
      html += '</tr>';

      // AI 工具支持
      html += '<tr><th>AI 服务支持</th>';
      activeAirports.forEach(function (a) {
        html += '<td style="font-size:0.84rem;">' + (a.aiSupport ? a.aiSupport.slice(0, 3).map(escapeHtml).join(', ') : '未实测') + '</td>';
      });
      html += '</tr>';

      // 4K 流媒体支持
      html += '<tr><th>流媒体解锁</th>';
      activeAirports.forEach(function (a) {
        html += '<td style="font-size:0.84rem;">' + (a.streamingSupport ? a.streamingSupport.slice(0, 3).map(escapeHtml).join(', ') : '未实测') + '</td>';
      });
      html += '</tr>';

      // 核心亮点
      html += '<tr><th>核心优势</th>';
      activeAirports.forEach(function (a) {
        html += '<td style="text-align:left;font-size:0.82rem;line-height:1.5;color:#334155;">';
        a.advantages.slice(0, 2).forEach(function (adv) {
          html += '<div style="margin-bottom:4px;">✓ ' + escapeHtml(adv) + '</div>';
        });
        html += '</td>';
      });
      html += '</tr>';

      // 注意事项
      html += '<tr><th>注意要点</th>';
      activeAirports.forEach(function (a) {
        html += '<td style="text-align:left;font-size:0.82rem;line-height:1.5;color:#64748b;">';
        a.disadvantages.slice(0, 2).forEach(function (dis) {
          html += '<div style="margin-bottom:4px;">✕ ' + escapeHtml(dis) + '</div>';
        });
        html += '</td>';
      });
      html += '</tr>';

      // 适合人群
      html += '<tr><th>适合人群</th>';
      activeAirports.forEach(function (a) {
        html += '<td style="font-size:0.82rem;color:#475569;">' + a.suitableFor.map(escapeHtml).join('；') + '</td>';
      });
      html += '</tr>';

      // 详情入口与测评
      html += '<tr><th>详情与评测</th>';
      activeAirports.forEach(function (a) {
        const reviewUrl = pathPrefix + 'airport/' + a.slug + '.html';
        html += '<td>';
        html += '<a href="' + reviewUrl + '" class="btn btn-primary btn-sm" style="width:100%;">深度测评报告</a>';
        html += '</td>';
      });
      html += '</tr>';

      html += '</tbody></table></div>';
      container.innerHTML = html;
      bindEvents();
    }

    function bindEvents() {
      const chips = container.querySelectorAll('.compare-chip');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          const id = chip.getAttribute('data-id');
          if (selectedIds.includes(id)) {
            selectedIds = selectedIds.filter(function (x) { return x !== id; });
          } else {
            if (selectedIds.length >= 4) {
              alert('最多同时支持横向对比 4 家机场服务商，请先移除一家再添加！');
              return;
            }
            selectedIds.push(id);
          }
          render();
        });
      });

      const removeBtns = container.querySelectorAll('.remove-chip-btn');
      removeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const id = btn.getAttribute('data-remove');
          selectedIds = selectedIds.filter(function (x) { return x !== id; });
          render();
        });
      });
    }

    render();
  }
})();
