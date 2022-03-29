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
    locales: ['default', 'eng', 'jpn', 'spa'],
    defaultLocale: 'default',
    //localeDetection: false,
  },
  trailingSlash: true,
}
