/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

// NOTE: This is ESM (export default) because next-sitemap's CLI loads config via import.
const config = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: 'public',
  exclude: ['/admin/*', '/status', '/api/*'],
  // Add hreflang alternates for en/it. Adjust if you add more locales.
  transform: async (cfg, path) => {
    const isHome = path === '/';
    // Remove leading locale for alternates
    const pathNoLocale = path.replace(/^\/(en|it)(?=\/|$)/, '');
    return {
      loc: path,
      changefreq: 'weekly',
      priority: isHome ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: `${cfg.siteUrl}/en${pathNoLocale}`, hreflang: 'en' },
        { href: `${cfg.siteUrl}/it${pathNoLocale}`, hreflang: 'it' },
        { href: cfg.siteUrl, hreflang: 'x-default' }
      ],
    };
  },
};

export default config;
