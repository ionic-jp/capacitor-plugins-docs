import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
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
      baseUrl: 'https://myapp.local/',
      prerenderConfig: './prerender.config.ts',
      serviceWorker: null,
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/prerender',
    },
  ],
};
