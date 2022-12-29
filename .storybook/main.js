const path = require('path');

module.exports = {
  webpackFinal: async (config) => {
    config.resolve.modules.push(path.resolve(__dirname, '../src'));
    return config;
  },
  stories: [
    "../docs/*.stories.mdx",
    "../docs/**/*.stories.mdx",
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    "@storybook/addon-storysource",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "./addon-tabs/register.tsx",
  ]
}
