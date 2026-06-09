import { writeFile } from 'node:fs/promises';
import { MOCK_POSTS } from '../src/mockPosts.js';

const siteUrl = 'https://md-shadab-azam-ansari.vercel.app';
const today = new Date().toISOString().slice(0, 10);
const pages = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/skills', priority: '0.8', changefreq: 'monthly' },
  { path: '/experience', priority: '0.8', changefreq: 'monthly' },
  { path: '/certifications', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/blog', priority: '0.9', changefreq: 'weekly' },
  { path: '/playground', priority: '0.6', changefreq: 'monthly' },
];

const entries = [
  ...pages.map((page) => ({ ...page, lastmod: today })),
  ...MOCK_POSTS.map((post) => ({
    path: `/blog/${post.$id}`,
    lastmod: post.date || today,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const urls = entries.map(({ path, lastmod, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
