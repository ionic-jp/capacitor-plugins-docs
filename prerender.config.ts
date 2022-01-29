import { PrerenderConfig } from '@stencil/core';
import { plugin, docs } from './stencil.config';

export const config: PrerenderConfig = {
  afterHydrate(document, url) {
    const flatDocs = Object.keys(docs).map(key => docs[key]).flat().find(el => el.path === url.pathname);
    if (flatDocs) {
      document.title = flatDocs.title + ' - ' + plugin.name + ' Documentation';
    } else {
      document.title = plugin.name + ' Documentation';
    }
  },
  hydrateOptions() {
    return {
      hashAssets: undefined,
    }
  }
};
