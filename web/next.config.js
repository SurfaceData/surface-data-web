/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true
    };
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  compiler: {
    styledComponents: true
  },
  i18n: {
    locales: ['en', 'ja', 'es', 'pseudo'],
    defaultLocale: 'en',
  },
  trailingSlash: true,
  experimental: {
    outputStandalone: true,
  },
}
