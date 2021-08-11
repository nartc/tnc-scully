"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var scully_1 = require("@scullyio/scully");
var scully_plugin_http404_1 = require("@gammastream/scully-plugin-http404");
var scully_plugin_time_to_read_1 = require("scully-plugin-time-to-read");
var custom_minify_html_plugin_1 = require("./scully/plugins/custom-minify-html-plugin");
require("@notiz/scully-plugin-rss");
require("@notiz/scully-plugin-lazy-images");
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
scully_1.setPluginConfig(scully_plugin_time_to_read_1.timeToRead, {
    path: '/blog',
});
exports.config = {
    projectRoot: './src',
    projectName: 'tnc-scully',
    outDir: './dist/static',
    defaultPostRenderers: [custom_minify_html_plugin_1.MinifyHtml, scully_plugin_http404_1.getHttp404Plugin(), 'seoHrefOptimise', 'lazyImages'],
    routes: {
        '/blog/:slug': {
            type: scully_1.RouteTypes.contentFolder,
            slug: {
                folder: './blog',
            },
        },
    },
};
