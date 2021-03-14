import { RouteTypes, ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { getHttp404Plugin } from '@gammastream/scully-plugin-http404';
import { timeToRead, timeToReadOptions } from 'scully-plugin-time-to-read';
import { MinifyHtml } from './scully/plugins/custom-minify-html-plugin';

setPluginConfig('md', { enableSyntaxHighlighting: true });

setPluginConfig(timeToRead, {
  path: '/blog',
} as timeToReadOptions);

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'tnc-scully',
  outDir: './dist/static',
  defaultPostRenderers: [MinifyHtml, getHttp404Plugin(), 'seoHrefOptimise'],
  routes: {
    '/blog/:slug': {
      type: RouteTypes.contentFolder,
      slug: {
        folder: './blog',
      },
    },
  },
};
