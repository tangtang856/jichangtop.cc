/**
 * scripts/check-links.js
 * 遍历全站 HTML 文件，严格校验标准相对路径与内部链接有效性（杜绝断链与根路径斜杠）
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
let checkedLinksCount = 0;

console.log(`🔗 开始遍历 ${htmlFiles.length} 个 HTML 页面，校验站内链接与严格相对路径规范...`);

htmlFiles.forEach(htmlFile => {
  const fileDir = path.dirname(htmlFile);
  const relFilePath = path.relative(rootDir, htmlFile).replace(/\\/g, '/');
  const content = fs.readFileSync(htmlFile, 'utf8');

  // 1. 检查 a 标签
  const aMatches = content.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of aMatches) {
    const href = match[1].trim();
    if (!href || href === '#' || href.startsWith('javascript:')) continue;
    checkedLinksCount++;

    // 检查是否违规使用了以 / 开头的根路径
    if (href.startsWith('/') && !href.startsWith('//')) {
      errors.push(`[根绝对路径违规] 文件 ${relFilePath} 中的链接使用了根路径: "${href}" (必须使用相对路径如 ./ 或 ../)`);
      continue;
    }

    // 外部链接放行
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    // 检查页内锚点
    if (href.startsWith('#')) {
      const anchor = href.substring(1);
      if (anchor && !content.includes(`id="${anchor}"`) && !content.includes(`name="${anchor}"`)) {
        errors.push(`[锚点缺失] 文件 ${relFilePath} 中的锚点 "#${anchor}" 在当前页面中未找到对应 id`);
      }
      continue;
    }

    // 解析相对链接与锚点
    const [pathPart, anchorPart] = href.split('#');
    const targetPath = path.resolve(fileDir, pathPart);

    if (!fs.existsSync(targetPath)) {
      errors.push(`[失效链接 404] 文件 ${relFilePath} 中的链接 "${href}" 指向的目标文件不存在: ${path.relative(rootDir, targetPath)}`);
    } else if (anchorPart && targetPath.endsWith('.html')) {
      const targetContent = fs.readFileSync(targetPath, 'utf8');
      if (!targetContent.includes(`id="${anchorPart}"`) && !targetContent.includes(`name="${anchorPart}"`)) {
        errors.push(`[跨页锚点缺失] 文件 ${relFilePath} 链接 "${href}" 的锚点 "#${anchorPart}" 在目标文件中未找到`);
      }
    }
  }

  // 2. 检查 link 标签 (CSS, canonical, icon 等)
  const linkMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of linkMatches) {
    const href = match[1].trim();
    if (!href || href.startsWith('http://') || href.startsWith('https://')) continue;

    if (href.startsWith('/') && !href.startsWith('//')) {
      errors.push(`[根绝对路径违规] 文件 ${relFilePath} 中的 link 标签使用了根路径: "${href}"`);
      continue;
    }

    const targetPath = path.resolve(fileDir, href);
    if (!fs.existsSync(targetPath)) {
      errors.push(`[资源缺失 404] 文件 ${relFilePath} 的 link 资源不存在: "${href}"`);
    }
  }

  // 3. 检查 script 标签
  const scriptMatches = content.matchAll(/<script\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of scriptMatches) {
    const src = match[1].trim();
    if (!src || src.startsWith('http://') || src.startsWith('https://')) continue;

    if (src.startsWith('/') && !src.startsWith('//')) {
      errors.push(`[根绝对路径违规] 文件 ${relFilePath} 中的 script 标签使用了根路径: "${src}"`);
      continue;
    }

    const targetPath = path.resolve(fileDir, src);
    if (!fs.existsSync(targetPath)) {
      errors.push(`[脚本缺失 404] 文件 ${relFilePath} 的 script 脚本不存在: "${src}"`);
    }
  }
});

console.log(`📊 共检查了 ${checkedLinksCount} 处站内/站外跳转与资源引用`);

if (errors.length > 0) {
  console.error(`\n❌ 链接与相对路径检查未通过，共发现 ${errors.length} 处问题：`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('✅ 链接检查全部通过：0 处断链，0 处 404，严格遵循标准相对路径（支持本地 file:// 双击与线上完美浏览）！');
}
