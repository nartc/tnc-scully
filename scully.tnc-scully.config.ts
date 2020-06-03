import { getHttp404Plugin } from '@gammastream/scully-plugin-http404';
import { RouteTypes, ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { MinifyHtml } from 'scully-plugin-minify-html';

setPluginConfig('md', { enableSyntaxHighlighting: true });

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'tnc-scully',
  outDir: './dist/static',
  defaultPostRenderers: [getHttp404Plugin(), 'seoHrefOptimise'],
  routes: {
    '/blog/:slug': {
      type: RouteTypes.contentFolder,
      slug: {
        folder: './blog',
      },
      postRenderers: [MinifyHtml],
    },
  },
};
