"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPluginOptions = exports.NotionDomRouter = exports.NotionDom = void 0;
const client_1 = require("@notionhq/client");
const scully_1 = require("@scullyio/scully");
const injectHtml_1 = require("@scullyio/scully/src/lib/renderPlugins/content-render-utils/injectHtml");
const blocks_to_html_1 = require("./blocks-to-html");
const page_properties_to_frontmatter_1 = require("./page-properties-to-frontmatter");
const utils_1 = require("./utils");
exports.NotionDom = 'notionDom';
exports.NotionDomRouter = 'notionDomRouter';
const defaultTransformersFactory = (pluginOptions) => ({
    file: (file) => `<img src='${file.url}' alt='${file.url}'>`,
    externalFile: (externalFile) => `<img src='${externalFile.url}' alt='${externalFile.url}'>`,
    imageCaption: (richTexts) => `<em>${blocks_to_html_1.parseRichTexts(richTexts, pluginOptions)}</em>`,
    link: (original, text) => `<a href='${text.link.url}' rel='noopener noreferrer' target='_blank'>${original}</a>`,
});
exports.defaultPluginOptions = {
    parsers: {
        unorderedListWrapper: (listItemsHtml) => `<ul>${listItemsHtml}</ul>`,
        orderedListWrapper: (listItemsHtml) => `<ol>${listItemsHtml}</ol>`,
        embed: blocks_to_html_1.parseEmbedded,
        image: (image) => blocks_to_html_1.parseImage(image, defaultTransformersFactory(exports.defaultPluginOptions)),
        heading1: (richTexts) => `<h1>${blocks_to_html_1.parseRichTexts(richTexts, exports.defaultPluginOptions)}</h1>`,
        heading2: (richTexts) => `<h2>${blocks_to_html_1.parseRichTexts(richTexts, exports.defaultPluginOptions)}</h2>`,
        heading3: (richTexts) => `<h3>${blocks_to_html_1.parseRichTexts(richTexts, exports.defaultPluginOptions)}</h3>`,
        paragraph: (richTexts) => `<p>${blocks_to_html_1.parseRichTexts(richTexts, exports.defaultPluginOptions)}</p>`,
        listItem: (list) => blocks_to_html_1.parseList(list, exports.defaultPluginOptions),
    },
    annotate: {
        bold: (original) => `<strong>${original}</strong>`,
        code: (original) => `<code>${original}</code>`,
        italic: (original) => `<em>${original}</em>`,
        underline: (original) => `<span style='text-decoration: underline'>${original}</span>`,
        strikethrough: (original) => `<span style='text-decoration: line-through'>${original}</span>`,
    },
    transformers: defaultTransformersFactory(this),
};
let notion;
try {
    notion = new client_1.Client({
        auth: process.env.NOTION_API_KEY,
    });
}
catch (e) {
    utils_1.stringifyLog(e);
    throw new Error(`Something went wrong. ${e}`);
}
function assertNotionClient() {
    if (!notion) {
        throw new Error('Unable to initialize Notion Client');
    }
}
async function notionDomRouterPlugin(route, config) {
    assertNotionClient();
    const mergedConfig = {
        ...{ slugKey: 'slug', basePath: '/blog', titleSuffix: '' },
        ...(config || {}),
    };
    if (!mergedConfig.databaseId) {
        throw new Error(`Please specify your Notion databaseId that contains your blog posts`);
    }
    // TODO: cache;
    try {
        const blogPosts = await notion.databases.query({ database_id: mergedConfig.databaseId });
        return Promise.resolve(blogPosts.results.map((blogPostResult) => {
            const frontmatter = page_properties_to_frontmatter_1.pagePropertiesToFrontmatter(blogPostResult.properties);
            return {
                type: mergedConfig.type,
                route: `${mergedConfig.basePath}/${frontmatter[mergedConfig.slugKey]}`,
                title: mergedConfig.titleSuffix
                    ? `${frontmatter.title} | ${mergedConfig.titleSuffix}`
                    : frontmatter.title,
                data: {
                    ...frontmatter,
                    id: blogPostResult.id,
                    notionUrl: blogPostResult.url,
                    cover: blogPostResult.cover,
                },
            };
        }));
    }
    catch (e) {
        scully_1.log(scully_1.red(`Something went wrong. ${e}`));
        return Promise.resolve([]);
    }
}
async function notionDomPlugin(dom, route) {
    assertNotionClient();
    const blogId = route.data['id'];
    // TODO: Cache
    if (!blogId) {
        scully_1.log(scully_1.yellow(`Cannot find blog id. Skipping ${route.route}`));
        return Promise.resolve(dom);
    }
    try {
        const blocks = await notion.blocks.children.list({ block_id: blogId });
        if (!blocks || !blocks.results.length) {
            scully_1.log(scully_1.yellow(`Blog does not have any blocks. Skipping ${route.route}`));
            return Promise.resolve(dom);
        }
        const pluginOptions = {
            ...exports.defaultPluginOptions,
            ...(scully_1.getPluginConfig(exports.NotionDom, 'postProcessByDom') || {}),
        };
        return injectHtml_1.injectHtml(dom, blocks_to_html_1.blocksToHtml(blocks.results, pluginOptions), route);
    }
    catch (e) {
        scully_1.log(scully_1.red(`Something went wrong. ${e}`));
        return Promise.resolve(dom);
    }
}
scully_1.registerPlugin('router', exports.NotionDomRouter, notionDomRouterPlugin);
scully_1.registerPlugin('postProcessByDom', exports.NotionDom, notionDomPlugin);
//# sourceMappingURL=notion-plugin.js.map