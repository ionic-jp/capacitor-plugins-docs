import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://stenciljs.com/docs/config

const pluginAlias = process.argv.find(c => c.includes('--plugin'))?.split('=')[1] ?? 'stripe';
export const docs = require(`./src/docs/${pluginAlias}/docs.json`);
// @ts-ignore
export const plugin = Object.assign(require(`./src/docs/packages.json`)[pluginAlias], {
  alias: pluginAlias
});

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  env: {
    docs,
    plugin,
  },
  plugins: [
    sass()
  ],
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  },
  outputTargets: [
    {
      type: 'www',
      baseUrl: `https://ja.${pluginAlias}.capacitorjs.jp/`,
      prerenderConfig: './prerender.config.ts',
      serviceWorker: null,
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/prerender',
    },
  ],
};
