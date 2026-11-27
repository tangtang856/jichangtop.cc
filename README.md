# jichangtop.cc - 2026 中文机场推荐与节点选择指南

> 本项目为专注于 **Bing 自然搜索流量优化** 的中文机场、梯子与科学上网节点资讯门户系统。采用纯原生 HTML + 原生 CSS + 纯原生 JS 架构，严格遵循标准相对路径规范，无重型外部框架负担，具备秒开级别的加载性能与完备的 SEO 技术体系。

## 🎯 核心项目参数

- **Bing 主攻关键词**：`机场推荐`、`机场节点`、`性价比机场`、`梯子推荐`、`vpn`、`vpn机场`、`vpn节点`、`vpn推荐`
- **正式发布域名**：`https://jichangtop.cc`
- **GitHub 远程仓库**：`https://github.com/tangtang856/jichangtop.cc`
- **全站静态页面数**：43 个完整独立页面
- **架构特色**：纯原生静态、严格相对路径（支持本地 `file://` 双击无损直读与线上完美跳转）、Schema.org 结构化数据、IndexNow 自动化推送

---

## 📂 页面体系架构

```text
/
├── index.html                           # 首页综合落地页（主关键词聚合）
├── recommend/                           # 专题推荐中心
│   ├── budget.html                      # 平价低预算专题
│   ├── premium.html                     # 高端专线专题
│   ├── beginner.html                    # 新手入门专题
│   ├── stable.html                      # 稳定抗封锁专题
│   ├── ai.html                          # ChatGPT / Claude 专用专题
│   └── streaming.html                   # 4K 流媒体解锁专题
├── ranking/                             # 结构化多维排行榜
│   ├── overall.html                     # 综合实力榜
│   ├── value.html                       # 性价比排行榜
│   ├── budget.html                      # 便宜低预算榜
│   └── stable.html                      # 最稳定抗封锁榜
├── compare/
│   └── index.html                       # 在线横向对比工具（2-4家自由PK）
├── airport/                             # 机场详细参数与套餐页
│   ├── flyingbird.html                  # 飞鸟云
│   ├── tagvpn.html                      # TAG VPN
│   ├── paopaodog.html                   # 泡泡狗
│   ├── wgetcloud.html                   # WgetCloud
│   └── kuromis.html                     # 黑猫云
├── review/                              # 独立深度评测报告
│   ├── flyingbird.html
│   ├── tagvpn.html
│   ├── paopaodog.html
│   ├── wgetcloud.html
│   └── kuromis.html
├── guides/                              # 跨平台客户端配置教程
│   ├── windows.html                     # Clash Verge / v2rayN
│   ├── android.html                     # Clash Meta / v2rayNG
│   ├── ios.html                         # Shadowrocket 小火箭 / Loon
│   └── macos.html                       # Clash Verge / Surge
├── blog/                                # 技术博客与避坑指引
│   ├── airport-nodes-selection-guide.html # 节点与线路选择深度解析
│   ├── avoid-scam-airports.html         # 挑选机场防跑路7大准则
│   ├── vpn-vs-airport-proxy.html        # 传统VPN与现代机场代理全景对比
│   ├── evening-peak-lag-fix.html        # 晚高峰卡顿排查与网络调优实操
│   ├── free-vpn-risks.html              # 免费梯子数据泄露与钓鱼风险曝光
│   └── how-to-use-subscription.html     # 机场订阅链接使用与排错全指南
├── glossary/                            # 专业术语百科
│   ├── iepl-iplc.html                   # IPLC 与 IEPL 专线原理
│   ├── shadowsocks.html                 # Shadowsocks 协议详解
│   ├── vless-hysteria2.html             # VLESS 与 Hysteria2 协议对比
│   ├── gfw.html                         # GFW 运作机制与封锁原理科普
│   └── node-multiplier.html             # 节点倍率暗扣防坑
├── about.html                           # 关于我们与评测实验室
├── contact.html                         # 联系方式与工单反馈
├── editorial-policy.html                # 编辑政策与测评标准
├── privacy-policy.html                  # 隐私政策（零日志承诺）
├── disclaimer.html                      # 合规与免责声明
├── 404.html                             # 404 引导页
├── robots.txt                           # 搜索引擎抓取声明
├── sitemap.xml                          # XML 站点地图
├── c87dfa49b21e42a98e82a392812d4a7c.txt # IndexNow 密钥验证文件
├── css/style.css                        # 原生纯 CSS 样式库
├── js/main.js                           # 原生无依赖交互（搜索、对比工具、响应式菜单）
└── data/                                # 统一数据源
    ├── airports.ts                      # TypeScript 接口与数据集
    └── airports.json                    # JSON 结构化数据
```

---

## 🛠️ 本地开发与质量检测指令

本项目为免构建纯静态站，直接双击任意 `.html` 文件即可在浏览器中预览。同时提供完善的自动化检测脚本：

```bash
# 1. 运行完整自动化测试套件 (内容校验 + 链接检查 + SEO审计)
npm run test

# 2. 仅执行链接与标准相对路径检查
npm run check-links

# 3. 仅执行内容未替换变量与完整性校验
npm run validate-content

# 4. 仅执行 Bing SEO 技术指标审计并输出报告
npm run audit

# 5. Bing IndexNow 核心页面提交 (支持 --all 全量提交, --url=... 单页提交, --dry-run 测试)
npm run indexnow
```

---

## ☁️ Cloudflare Pages 部署指引

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，进入 **Workers & Pages**。
2. 点击 **Create application** -> **Pages** -> **Connect to Git**。
3. 选择 GitHub 仓库 `tangtang856/jichangtop.cc`。
4. 部署参数配置：
   - **Framework preset**：`None`
   - **Build command**：`npm run build`（或留空）
   - **Build output directory**：`/`（项目根目录）
5. 点击 **Save and Deploy**，完成后绑定自定义域名 `jichangtop.cc`。
6. Cloudflare 将自动启用全球 Anycast CDN 与免费 SSL 证书，全站秒开。

---

## 🔎 Bing Webmaster Tools 配置指引

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters/)。
2. 添加站点 `https://jichangtop.cc` 并通过 DNS 或 HTML 文件方式验证所有权。
3. 进入 **Sitemaps** 菜单，提交地图链接：`https://jichangtop.cc/sitemap.xml`。
4. 进入 **IndexNow** 菜单，确认系统已识别根目录 Key 文件 `c87dfa49b21e42a98e82a392812d4a7c.txt`。
5. 每次有新增内容或重大更新时，运行 `npm run indexnow` 即刻向 Bing 发送抓取通知。
