"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minifyHtmlPlugin = exports.MinifyHtml = void 0;
const html_minifier_terser_1 = require("html-minifier-terser");
const scully_1 = require("@scullyio/scully");
exports.MinifyHtml = 'minifyHtml';
const defaultMinifyOptions = {
    caseSensitive: true,
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    // don't remove attribute quotes, not all social media platforms can parse this over-optimization
    removeAttributeQuotes: false,
    // don't remove optional tags, like the head, not all social media platforms can parse this over-optimization
    removeOptionalTags: false,
    // scully specific HTML comments
    // this will always be added in the final minifyOptions config
    ignoreCustomComments: [/scullyContent-(begin|end)/],
    // scully specific data injection
    // this will always be added in the final minifyOptions config
    ignoreCustomFragments: [/\/\*\* ___SCULLY_STATE_(START|END)___ \*\//],
};
const minifyHtmlPlugin = (html) => {
    let localMinifyOptions = defaultMinifyOptions;
    const customMinifyOptions = scully_1.getMyConfig(exports.minifyHtmlPlugin);
    if (customMinifyOptions && customMinifyOptions.minifyOptions) {
        localMinifyOptions = {
            ...defaultMinifyOptions,
            ...customMinifyOptions.minifyOptions,
            ignoreCustomComments: [
                ...defaultMinifyOptions.ignoreCustomComments,
                ...(customMinifyOptions.minifyOptions.ignoreCustomComments
                    ? customMinifyOptions.minifyOptions.ignoreCustomComments
                    : []),
            ],
            ignoreCustomFragments: [
                ...defaultMinifyOptions.ignoreCustomFragments,
                ...(customMinifyOptions.minifyOptions.ignoreCustomFragments
                    ? customMinifyOptions.minifyOptions.ignoreCustomFragments
                    : []),
            ],
        };
    }
    return Promise.resolve(html_minifier_terser_1.minify(html, localMinifyOptions));
};
exports.minifyHtmlPlugin = minifyHtmlPlugin;
scully_1.registerPlugin('postProcessByHtml', exports.MinifyHtml, exports.minifyHtmlPlugin);
//# sourceMappingURL=custom-minify-html-plugin.js.map