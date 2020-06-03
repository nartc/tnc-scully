"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scully_plugin_http404_1 = require("@gammastream/scully-plugin-http404");
var scully_1 = require("@scullyio/scully");
var scully_plugin_disable_angular_1 = require("scully-plugin-disable-angular");
var scully_plugin_minify_html_1 = require("scully-plugin-minify-html");
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
scully_1.setPluginConfig(scully_plugin_disable_angular_1.DisableAngular, 'render', {
    removeState: true,
});
exports.config = {
    projectRoot: './src',
    projectName: 'tnc-scully',
    outDir: './dist/static',
    defaultPostRenderers: [scully_plugin_http404_1.getHttp404Plugin(), 'seoHrefOptimise', scully_plugin_disable_angular_1.DisableAngular],
    routes: {
        '/blog/:slug': {
            type: scully_1.RouteTypes.contentFolder,
            slug: {
                folder: './blog',
            },
            postRenderers: [scully_plugin_minify_html_1.MinifyHtml, scully_plugin_disable_angular_1.DisableAngular],
        },
    },
};
