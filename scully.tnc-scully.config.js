"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scully_plugin_http404_1 = require("@gammastream/scully-plugin-http404");
var scully_1 = require("@scullyio/scully");
var scully_plugin_minify_html_1 = require("scully-plugin-minify-html");
require("./plugins/about-post-render");
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
exports.config = {
    projectRoot: './src',
    projectName: 'tnc-scully',
    outDir: './dist/static',
    defaultPostRenderers: [scully_plugin_http404_1.getHttp404Plugin(), 'httpAbout'],
    routes: {
        '/blog/:slug': {
            type: 'contentFolder',
            slug: {
                folder: './blog',
            },
            postRenderers: [scully_plugin_minify_html_1.MinifyHtml],
        },
    },
};
