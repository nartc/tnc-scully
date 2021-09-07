import { getHttp404Plugin } from '@gammastream/scully-plugin-http404';
import '@notiz/scully-plugin-lazy-images';
// import '@notiz/scully-plugin-rss';
import { ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { timeToRead, timeToReadOptions } from 'scully-plugin-time-to-read';
import { MinifyHtml } from './scully/plugins/custom-minify-html-plugin';
import { NotionDom, NotionDomRouter } from './scully/plugins/notion/notion-plugin';

setPluginConfig('md', { enableSyntaxHighlighting: true });

setPluginConfig(timeToRead, {
  path: '/blog',
} as timeToReadOptions);

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'tnc-scully',
  outDir: './dist/static',
  defaultPostRenderers: [MinifyHtml, getHttp404Plugin(), 'seoHrefOptimise', 'lazyImages'],
  routes: {
    '/blog/:slug': {
      // type: RouteTypes.contentFolder,
      // slug: {
      //   folder: './blog',
      // },
      type: NotionDomRouter,
      postRenderers: [NotionDom],
      databaseId: '52b3f140bcfc40d5b101536799b059b4',
    },
  },
};
