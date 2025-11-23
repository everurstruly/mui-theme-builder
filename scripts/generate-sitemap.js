import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

// Basic list of routes; extend or generate programmatically as needed
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/presets', changefreq: 'weekly', priority: 0.8 },
  { url: '/editor', changefreq: 'weekly', priority: 0.8 },
];

const hostname = process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://yourdomain.com';

(async () => {
  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream('./public/sitemap.xml');
  sitemap.pipe(writeStream);
  routes.forEach((r) => sitemap.write(r));
  sitemap.end();
  await streamToPromise(sitemap);
  console.log('sitemap.xml written to public/');
})();
