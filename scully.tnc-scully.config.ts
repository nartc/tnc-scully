import { getGaPlugin, GoogleAnalyticsConfig } from '@nartc/scully-plugin-google-gtag';
import { RouteTypes, ScullyConfig, setPluginConfig } from '@scullyio/scully';
import { getHttp404Plugin } from '@gammastream/scully-plugin-http404';
import { MinifyHtml } from 'scully-plugin-minify-html';

const GaPlugin = getGaPlugin();

setPluginConfig('md', { enableSyntaxHighlighting: true });
setPluginConfig(GaPlugin, <GoogleAnalyticsConfig>{
  dryRun: true,
  trackingIds: ['UA-154847070-1'],
});

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'tnc-scully',
  outDir: './dist/static',
  defaultPostRenderers: [GaPlugin, MinifyHtml, getHttp404Plugin(), 'seoHrefOptimise'],
  routes: {
    '/blog/:slug': {
      type: RouteTypes.contentFolder,
      slug: {
        folder: './blog',
      },
      postRenderers: [GaPlugin, MinifyHtml],
    },
  },
};
