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
}
