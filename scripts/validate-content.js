/**
 * scripts/validate-content.js
 * 检查占位符、未替换变量、敏感空字段与数据完整性
 */
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git'].includes(file)) {
        results = results.concat(getAllHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getAllHtmlFiles(rootDir);
let errors = [];

console.log(`🔍 正在扫描 ${htmlFiles.length} 个 HTML 文件中的未替换变量与占位符...`);

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');

  // 1. 检查未替换的模板语法 {{xxx}}
  const varMatches = content.match(/\{\{([^{}]+)\}\}/g);
  if (varMatches) {
    errors.push(`文件 ${relPath} 包含未替换变量: ${varMatches.join(', ')}`);
  }

  // 2. 检查草稿/空白占位文本
  const dummyMatches = content.match(/\b(TODO|FIXME|待补充|Lorem ipsum)\b/gi);
  if (dummyMatches) {
    errors.push(`文件 ${relPath} 包含开发占位文本: ${dummyMatches.join(', ')}`);
  }
});

// 3. 检查 robots.txt
if (!fs.existsSync(path.join(rootDir, 'robots.txt'))) {
  errors.push('缺少 robots.txt 文件');
} else {
  const robots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
  if (!robots.includes('Sitemap: https://jichangtop.cc/sitemap.xml')) {
    errors.push('robots.txt 未正确声明 https://jichangtop.cc/sitemap.xml');
  }
}

// 4. 检查 sitemap.xml
if (!fs.existsSync(path.join(rootDir, 'sitemap.xml'))) {
  errors.push('缺少 sitemap.xml 文件');
} else {
  const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  if (!sitemap.includes('https://jichangtop.cc/')) {
    errors.push('sitemap.xml 缺少正式域名 URL');
  }
}

// 5. 检查 IndexNow 验证文件
const key = 'c87dfa49b21e42a98e82a392812d4a7c';
const keyFile = path.join(rootDir, `${key}.txt`);
if (!fs.existsSync(keyFile)) {
  errors.push(`缺少 IndexNow 验证文件 ${key}.txt`);
} else {
  const val = fs.readFileSync(keyFile, 'utf8').trim();
  if (val !== key) {
    errors.push(`IndexNow 验证文件 ${key}.txt 内容与 Key 不符`);
  }
}

// 6. 检查数据库 JSON
const dbPath = path.join(rootDir, 'data', 'airports.json');
if (!fs.existsSync(dbPath)) {
  errors.push('缺少 data/airports.json 数据库文件');
} else {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length < 5) {
      errors.push('data/airports.json 机场数据量少于 5 家');
    }
  } catch (e) {
    errors.push(`data/airports.json 解析 JSON 失败: ${e.message}`);
  }
}

if (errors.length > 0) {
  console.error('\n❌ 内容完整性校验失败，发现以下问题：');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('✅ 内容完整性验证通过：无占位符变量、无开发占位、数据库与Bing必要配置文件完整！');
}
