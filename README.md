# 机场Top (jichangtop.cc)

> 2026专业中文机场推荐与梯子节点测评指南 · 现代化 Astro 4.x 静态极速版

## 🌟 项目架构设计与优势

本仓库已全面升级为 **Astro 4.x** 现代化组件化静态站点架构（SSG），彻底解决了传统静态多页面框架中模板代码严重重复、维护困难的痛点：

1. **零冗余组件化开发**：
   - 导航头 (`src/components/Header.astro`) 与页脚 (`src/components/Footer.astro`) 统一定义，一处修改全站生效。
   - 核心排行榜表格 (`src/components/RankingTable.astro`) 与推荐卡片 (`src/components/AirportCard.astro`) 完全组件化。
   - 统一基础布局 (`src/layouts/Layout.astro`) 与博文布局 (`src/layouts/ArticleLayout.astro`)，全站 TDK、Canonical、OpenGraph 与 Schema.org 结构化数据全自动注入。

2. **单一数据源权威管理**：
   - 所有 14 个精选机场品牌、代表套餐、每 GB 折算单价、传输线路、流媒体与 AI 解锁能力、优惠券码及独立专业 TDK 均由 `src/data/airports.ts` 单一数据源集中维护。
   - 通过 Astro 动态路由 `src/pages/airport/[slug].astro` 与 `src/pages/review/[slug].astro` 自动化编译生成，无任何手动维护成本。

3. **Markdown Content Collections (内容集合系统)**：
   - 收录 **106 篇** 原创科学上网技术博客（位于 `src/content/blog/`）。
   - 收录 **34 篇** 全平台客户端配置图文教程（位于 `src/content/guides/`）。
   - 采用 Zod 强类型 Schema 严格校验文章元数据（`title`, `description`, `keywords`, `tag`, `readTime`, `date`, `author`）。

4. **自动化 SEO 与质量工程**：
   - `npm run build`：执行 Astro 极速静态构建（构建时间小于 6 秒），生成 193+ 个纯静态 HTML 文件，并自动生成 IndexNow 密钥验证、站点地图（`sitemap-index.xml` & `sitemap.xml`）与站内搜索索引。
   - `npm test`：运行全套严格自动化测试套件（内容规范性、10,700+ 处全站内链校验、Bing SEO 技术审计 196 PASS 0 FAIL）。

---

## 🛠️ 本地开发与构建指南

### 安装依赖
```bash
npm install
```

### 启动本地实时热重载开发服务器
```bash
npm run dev
```

### 执行生产构建
```bash
npm run build
```
编译产物将输出至 `dist/` 目录。

### 执行全站 SEO 审计与死链测试
```bash
npm test
```

---

## 🚀 部署配置 (Cloudflare Pages)

- **Framework Preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js Version**: `20.x`
