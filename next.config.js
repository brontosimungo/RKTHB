/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.json$/,
      loader: '@next/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'public/data',
      },
    });
    return config;
  },
};

module.exports = nextConfig;
