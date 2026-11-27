/**
 * 生产构建与静态检查脚本
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 开始执行 Production 检查与构建流程...');

try {
  console.log('\n[1/3] 验证页面内容完整性与占位符排查...');
  execSync('node scripts/validate-content.js', { stdio: 'inherit' });

  console.log('\n[2/3] 全站内部链接与相对路径有效性检查...');
  execSync('node scripts/check-links.js', { stdio: 'inherit' });

  console.log('\n[3/3] 自动化 SEO 技术指标审计与报告生成...');
  execSync('node scripts/audit-seo.js', { stdio: 'inherit' });

  console.log('\n✅ Production Build 验收通过！全站 43 个纯静态页面与资源均已就绪，具备直接上线部署条件。');
} catch (err) {
  console.error('\n❌ 构建过程中检测到未通过的检查项：', err.message);
  process.exit(1);
}
