/**
 * scripts/check-links.js
 * 遍历 dist 编译目录全站 HTML 文件，严格校验内部链接有效性与死链检测（杜绝 404）
 */
import fs from 'fs';
import path from 'path';

const rootDir = fs.existsSync(path.join(process.cwd(), 'dist')) ? path.join(process.cwd(), 'dist') : process.cwd();

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

console.log(`🔗 开始遍历 ${htmlFiles.length} 个 HTML 页面，校验站内链接与资源有效性...`);

htmlFiles.forEach(htmlFile => {
  const fileDir = path.dirname(htmlFile);
  const relFilePath = path.relative(rootDir, htmlFile).replace(/\\/g, '/');
  const content = fs.readFileSync(htmlFile, 'utf8');

  // 先剥离 script 标签内的 JS 代码字符串，防止误将模板字面量当成实际链接
  const contentWithoutScripts = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 1. 检查 a 标签
  const aMatches = contentWithoutScripts.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of aMatches) {
    const rawHref = match[1].trim();
    if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) continue;
    checkedLinksCount++;

    // 外部链接放行
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      continue;
    }

    // 检查页内锚点
    if (rawHref.startsWith('#')) {
      const anchor = rawHref.substring(1);
      if (anchor && !content.includes(`id="${anchor}"`) && !content.includes(`name="${anchor}"`)) {
        errors.push(`[锚点缺失] 文件 ${relFilePath} 中的锚点 "#${anchor}" 在当前页面中未找到对应 id`);
      }
      continue;
    }

    // 区分根相对路径 vs 相对路径
    const [pathPart, anchorPart] = rawHref.split('#');
    let targetPath;
    if (pathPart.startsWith('/')) {
      const cleanPath = pathPart.replace(/^\//, '');
      if (!cleanPath || cleanPath === '') {
        targetPath = path.join(rootDir, 'index.html');
      } else {
        targetPath = path.join(rootDir, cleanPath);
        if (!fs.existsSync(targetPath) && fs.existsSync(targetPath + '.html')) {
          targetPath = targetPath + '.html';
        } else if (!fs.existsSync(targetPath) && fs.existsSync(path.join(targetPath, 'index.html'))) {
          targetPath = path.join(targetPath, 'index.html');
        }
      }
    } else {
      targetPath = path.resolve(fileDir, pathPart);
    }

    if (!fs.existsSync(targetPath)) {
      errors.push(`[失效链接 404] 文件 ${relFilePath} 中的链接 "${rawHref}" 指向的目标文件不存在: ${path.relative(rootDir, targetPath)}`);
    } else if (anchorPart && targetPath.endsWith('.html')) {
      const targetContent = fs.readFileSync(targetPath, 'utf8');
      if (!targetContent.includes(`id="${anchorPart}"`) && !targetContent.includes(`name="${anchorPart}"`)) {
        errors.push(`[跨页锚点缺失] 文件 ${relFilePath} 链接 "${rawHref}" 的锚点 "#${anchorPart}" 在目标文件中未找到`);
      }
    }
  }

  // 2. 检查 link 标签 (CSS, icon 等)
  const linkMatches = content.matchAll(/<link\s+[^>]*href=["']([^"']*)["']/gi);
  for (const match of linkMatches) {
    const rawHref = match[1].trim();
    if (!rawHref || rawHref.startsWith('http://') || rawHref.startsWith('https://')) continue;

    let targetPath;
    if (rawHref.startsWith('/')) {
      targetPath = path.join(rootDir, rawHref.replace(/^\//, ''));
    } else {
      targetPath = path.resolve(fileDir, rawHref);
    }

    if (!fs.existsSync(targetPath)) {
      errors.push(`[资源缺失 404] 文件 ${relFilePath} 的 link 资源不存在: "${rawHref}"`);
    }
  }

  // 3. 检查 script 标签
  const scriptMatches = content.matchAll(/<script\s+[^>]*src=["']([^"']*)["']/gi);
  for (const match of scriptMatches) {
    const src = match[1].trim();
    if (!src || src.startsWith('http://') || src.startsWith('https://')) continue;

    let targetPath;
    if (src.startsWith('/')) {
      targetPath = path.join(rootDir, src.replace(/^\//, ''));
    } else {
      targetPath = path.resolve(fileDir, src);
    }

    if (!fs.existsSync(targetPath)) {
      errors.push(`[脚本缺失 404] 文件 ${relFilePath} 的 script 脚本不存在: "${src}"`);
    }
  }
});

console.log(`📊 共检查了 ${checkedLinksCount} 处站内/站外跳转与资源引用`);

if (errors.length > 0) {
  console.error(`\n❌ 链接检查未通过，共发现 ${errors.length} 处问题：`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
} else {
  console.log('✅ 链接检查全部通过：0 处断链，0 处 404，全站内链与静态资源均真实存在！');
}
