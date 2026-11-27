/**
 * scripts/indexnow.js
 * Bing / IndexNow 自动化提交模块
 * 支持：API Key 配置、Key 文件核验、单 URL 提交、批量提交、变更提交、指数退避重试与日志持久化
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  host: 'jichangtop.cc',
  key: 'c87dfa49b21e42a98e82a392812d4a7c',
  keyLocation: 'https://jichangtop.cc/c87dfa49b21e42a98e82a392812d4a7c.txt',
  endpoint: 'https://api.indexnow.org/indexnow',
  maxRetries: 3,
  retryDelayMs: 2000
};

const rootDir = process.cwd();
const logDir = path.join(rootDir, 'docs');
const logFile = path.join(logDir, 'indexnow.log');

function log(msg) {
  const time = new Date().toISOString();
  const line = `[${time}] ${msg}`;
  console.log(line);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(logFile, line + '\n', 'utf8');
}

// 1. 验证本地 Key 验证文件
function verifyKeyFile() {
  const localKeyFile = path.join(rootDir, `${CONFIG.key}.txt`);
  if (!fs.existsSync(localKeyFile)) {
    throw new Error(`本地缺失 IndexNow 验证文件: ${localKeyFile}`);
  }
  const content = fs.readFileSync(localKeyFile, 'utf8').trim();
  if (content !== CONFIG.key) {
    throw new Error(`验证文件内容与预期 Key 不符！文件内容: "${content}", 预期: "${CONFIG.key}"`);
  }
  log(`✓ 本地 Key 文件核验通过: ${CONFIG.key}.txt`);
}

// 2. 从 sitemap.xml 提取所有 URL
function getSitemapUrls() {
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('未找到 sitemap.xml 文件');
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [];
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  for (const match of matches) {
    urls.push(match[1].trim());
  }
  return urls;
}

// 3. 执行 HTTP POST 请求带重试
async function submitUrls(urlList, dryRun = false) {
  log(`准备向 Bing IndexNow 提交 ${urlList.length} 个 URL...`);

  const payload = {
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: CONFIG.keyLocation,
    urlList: urlList
  };

  if (dryRun) {
    log(`[DRY-RUN] 测试模式，不发送实际网络请求。Payload:\n${JSON.stringify(payload, null, 2)}`);
    return true;
  }

  let attempt = 0;
  while (attempt < CONFIG.maxRetries) {
    attempt++;
    try {
      log(`发送请求至 ${CONFIG.endpoint} (尝试 ${attempt}/${CONFIG.maxRetries})...`);

      const res = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      const status = res.status;
      const text = await res.text();

      log(`HTTP 响应码: ${status}, 返回内容: ${text || '(空)'}`);

      if (status === 200 || status === 202) {
        log(`🎉 IndexNow URL 提交成功！HTTP ${status}。注意：IndexNow 成功仅代表 Bing 接收了爬取提示，不代表已即时完成索引收录。`);
        return true;
      } else if (status === 400) {
        log(`❌ 400 Bad Request: 提交格式错误或 Key 无法解析`);
        return false;
      } else if (status === 403) {
        log(`❌ 403 Forbidden: Key 与域名不匹配或 KeyLocation 无法被 Bing 访问`);
        return false;
      } else if (status === 422) {
        log(`❌ 422 Unprocessable Entity: URL 与 Host 域名不属于同一站点`);
        return false;
      } else if (status === 429) {
        log(`⚠️ 429 Too Many Requests: 频次受限，等待重试...`);
      } else {
        log(`⚠️ 服务器返回异常状态 ${status}，准备重试...`);
      }
    } catch (err) {
      log(`❌ 网络请求异常: ${err.message}`);
    }

    if (attempt < CONFIG.maxRetries) {
      const wait = CONFIG.retryDelayMs * Math.pow(2, attempt - 1);
      log(`等待 ${wait}ms 后进行下一次重试...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }

  log(`❌ 提交失败：达到最大重试次数 (${CONFIG.maxRetries})`);
  return false;
}

// 4. CLI 主入口
async function main() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let singleUrl = null;
  let submitAll = false;

  args.forEach(arg => {
    if (arg === '--dry-run') dryRun = true;
    if (arg === '--all') submitAll = true;
    if (arg.startsWith('--url=')) singleUrl = arg.split('=')[1];
  });

  try {
    verifyKeyFile();

    let targetUrls = [];

    if (singleUrl) {
      if (!singleUrl.startsWith(`https://${CONFIG.host}/`)) {
        throw new Error(`提交的单 URL 必须以 https://${CONFIG.host}/ 开头，当前为: ${singleUrl}`);
      }
      targetUrls = [singleUrl];
      log(`指定单 URL 模式: ${singleUrl}`);
    } else if (submitAll) {
      targetUrls = getSitemapUrls();
      log(`指定全量提交模式: 共提取 ${targetUrls.length} 个站点地图 URL`);
    } else {
      // 默认模式：提交核心落地页与最新评测页面（避免无差别高频提交全站）
      targetUrls = [
        `https://${CONFIG.host}/index.html`,
        `https://${CONFIG.host}/recommend/budget.html`,
        `https://${CONFIG.host}/recommend/premium.html`,
        `https://${CONFIG.host}/ranking/overall.html`,
        `https://${CONFIG.host}/ranking/value.html`,
        `https://${CONFIG.host}/compare/index.html`
      ];
      log(`默认增量/核心提交模式: 提交 ${targetUrls.length} 个核心落地页（使用 --all 可全量提交，使用 --url=... 可提交单页）`);
    }

    await submitUrls(targetUrls, dryRun);
  } catch (e) {
    log(`❌ 执行失败: ${e.message}`);
    process.exit(1);
  }
}

main();
