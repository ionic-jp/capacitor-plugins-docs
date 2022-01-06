import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://stenciljs.com/docs/config

const plugin = process.argv.find(c => c.includes('--plugins'))?.split('=') ?? 'stripe';
const docs = require(`./src/docs/${plugin}/docs.json`);

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  env: {
    docs,
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
      baseUrl: 'https://ja.stripe.capacitorjs.jp/',
      prerenderConfig: './prerender.config.ts',
      serviceWorker: null,
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/prerender',
    },
  ],
};
