import { generateSitemap } from 'next-sitemap';
generateSitemap().catch(e => { console.error(e); process.exit(1); });
