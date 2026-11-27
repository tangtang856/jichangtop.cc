import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

console.log('🚀 Running Postbuild tasks...');

// 1. Ensure directory index.html aliases exist
function ensureIndexHtml(sourceFile, targetDir) {
  const src = path.join(distDir, sourceFile);
  const destDir = path.join(distDir, targetDir);
  const destFile = path.join(destDir, 'index.html');
  if (fs.existsSync(src)) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, destFile);
    console.log(`✅ Created alias: ${targetDir}/index.html`);
  }
}

ensureIndexHtml('compare.html', 'compare');
ensureIndexHtml('blog.html', 'blog');
ensureIndexHtml('guides.html', 'guides');

// 2. Ensure sitemap.xml exists (alias to sitemap-index.xml)
const sitemapIndex = path.join(distDir, 'sitemap-index.xml');
const sitemapDest = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapIndex)) {
  fs.copyFileSync(sitemapIndex, sitemapDest);
  console.log('✅ Created alias: sitemap.xml');
}

// 3. Build search-index.json
const searchIndex = [];

// Add Airports
try {
  const airportsFile = fs.readFileSync(path.join(rootDir, 'src/data/airports.ts'), 'utf-8');
  // Simple regex extraction or JSON parse of airports array
  const jsonMatch = airportsFile.match(/export const airports: Airport\[] = (\[[\s\S]*?\]);\s*$/);
  if (jsonMatch) {
    const list = JSON.parse(jsonMatch[1]);
    for (const a of list) {
      searchIndex.push({
        title: a.name + ' - 评测与资费',
        desc: a.description,
        kw: a.airportTdk ? a.airportTdk.kw : a.name,
        url: `/airport/${a.slug}.html`
      });
      searchIndex.push({
        title: a.name + ' - 晚高峰测速报告',
        desc: `实机测试 ${a.name} 晚高峰网络连通性、丢包率与4K解锁报告`,
        kw: a.reviewTdk ? a.reviewTdk.kw : a.name,
        url: `/review/${a.slug}.html`
      });
    }
  }
} catch (e) {
  console.warn('⚠️ Could not parse airports.ts for search index:', e.message);
}

// Add Blogs
const blogDir = path.join(rootDir, 'src/content/blog');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  for (const f of blogFiles) {
    const content = fs.readFileSync(path.join(blogDir, f), 'utf-8');
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const descMatch = content.match(/description:\s*"([^"]+)"/);
    const kwMatch = content.match(/keywords:\s*"([^"]+)"/);
    const slug = f.replace(/\.md$/, '');
    if (titleMatch && descMatch) {
      searchIndex.push({
        title: titleMatch[1],
        desc: descMatch[1],
        kw: kwMatch ? kwMatch[1] : '',
        url: `/blog/${slug}.html`
      });
    }
  }
}

// Add Guides
const guidesDir = path.join(rootDir, 'src/content/guides');
if (fs.existsSync(guidesDir)) {
  const guideFiles = fs.readdirSync(guidesDir).filter(f => f.endsWith('.md'));
  for (const f of guideFiles) {
    const content = fs.readFileSync(path.join(guidesDir, f), 'utf-8');
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const descMatch = content.match(/description:\s*"([^"]+)"/);
    const kwMatch = content.match(/keywords:\s*"([^"]+)"/);
    const slug = f.replace(/\.md$/, '');
    if (titleMatch && descMatch) {
      searchIndex.push({
        title: titleMatch[1],
        desc: descMatch[1],
        kw: kwMatch ? kwMatch[1] : '',
        url: `/guides/${slug}.html`
      });
    }
  }
}

// Write to public and dist
fs.writeFileSync(path.join(publicDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2), 'utf-8');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'search-index.json'), JSON.stringify(searchIndex, null, 2), 'utf-8');
}
console.log(`✅ Generated search-index.json with ${searchIndex.length} searchable entries.`);

// 4. Rewrite root-relative links (/...) in dist/**/*.html to relative paths (./ or ../) for file:// & Cloudflare compatibility
function getAllHtmlFiles(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(getAllHtmlFiles(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

if (fs.existsSync(distDir)) {
  const htmlFiles = getAllHtmlFiles(distDir);
  for (const filePath of htmlFiles) {
    const relPath = path.relative(distDir, filePath).replace(/\\/g, '/');
    const depth = relPath.split('/').length - 1;
    const prefix = depth === 0 ? '.' : Array(depth).fill('..').join('/');

    let html = fs.readFileSync(filePath, 'utf-8');

    // Inject __ROOT_PREFIX__ before </head>
    html = html.replace('</head>', `<script>window.__ROOT_PREFIX__="${prefix}";</script>\n</head>`);

    // Rewrite href="/" -> href="${prefix}/index.html"
    html = html.replace(/href=(["'])\/\1/g, `href=$1${prefix}/index.html$1`);

    // Rewrite href="/path..." and src="/path..." (skip // protocol-relative)
    html = html.replace(/(href|src)=(["'])\/(?!\/)([^"']*)\2/g, (match, attr, quote, rest) => {
      return `${attr}=${quote}${prefix}/${rest}${quote}`;
    });

    fs.writeFileSync(filePath, html, 'utf-8');
  }
  console.log(`✅ Converted root-relative paths to portable relative paths across ${htmlFiles.length} HTML files.`);
}

console.log('🎉 Postbuild complete!');
