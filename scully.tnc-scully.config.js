"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scully_1 = require("@scullyio/scully");
scully_1.setPluginConfig('md', { enableSyntaxHighlighting: true });
exports.config = {
    projectRoot: './src',
    projectName: 'tnc-scully',
    outDir: './dist/static',
    routes: {
        '/blog/:slug': {
            type: 'contentFolder',
            slug: {
                folder: './blog',
            },
        },
    },
};
