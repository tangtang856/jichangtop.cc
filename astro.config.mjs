import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jichangtop.cc',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404')
    })
  ],
  output: 'static',
  build: {
    format: 'file'
  }
});
