import {createRouter} from 'stencil-router-v2';
import {InternalRouterState} from 'stencil-router-v2/dist/types';
import {pluginDocs, plugin} from './utils';

export const Router = createRouter();

Router.onChange('url', (newValue: InternalRouterState['url'], _: InternalRouterState['url']) => {
  const flatDocs = Object.keys(pluginDocs()).map(key => pluginDocs()[key]).flat().find(el => el.path === newValue?.pathname);
  if (flatDocs) {
    document.title = flatDocs.title + ' - ' + plugin['name'] + ' ドキュメンテーション';
  } else {
    document.title = plugin['name'] + ' ドキュメンテーション';
  }
});
