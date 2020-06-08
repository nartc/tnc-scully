"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scully_plugin_http404_1 = require("@gammastream/scully-plugin-http404");
var scully_plugin_google_gtag_1 = require("@nartc/scully-plugin-google-gtag");
var scully_1 = require("@scullyio/scully");
var scully_plugin_minify_html_1 = require("scully-plugin-minify-html");
var GaPlugin = scully_plugin_google_gtag_1.getGaPlugin();
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
scully_1.setPluginConfig(GaPlugin, {
    dryRun: true,
    trackingIds: ['UA-154847070-1'],
});
exports.config = {
    projectRoot: './src',
    projectName: 'tnc-scully',
    outDir: './dist/static',
    defaultPostRenderers: [GaPlugin, scully_plugin_minify_html_1.MinifyHtml, scully_plugin_http404_1.getHttp404Plugin(), 'seoHrefOptimise'],
    routes: {
        '/blog/:slug': {
            type: scully_1.RouteTypes.contentFolder,
            slug: {
                folder: './blog',
            },
            postRenderers: [GaPlugin, scully_plugin_minify_html_1.MinifyHtml],
        },
    },
};
