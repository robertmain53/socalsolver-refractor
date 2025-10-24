/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/status', '/api/*'],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: config.siteUrl.replace('https://', 'https://') + path.replace(/^\/en/, '/en'), hreflang: 'en' },
        { href: config.siteUrl.replace('https://', 'https://') + path.replace(/^\/it/, '/it'), hreflang: 'it' },
        { href: config.siteUrl, hreflang: 'x-default' }
      ]
    }
  }
}
