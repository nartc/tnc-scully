"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotionDomRouter = exports.NotionDom = void 0;
const client_1 = require("@notionhq/client");
const scully_1 = require("@scullyio/scully");
const injectHtml_1 = require("@scullyio/scully/src/lib/renderPlugins/content-render-utils/injectHtml");
const blocks_to_html_1 = require("./blocks-to-html");
const page_properties_to_frontmatter_1 = require("./page-properties-to-frontmatter");
const utils_1 = require("./utils");
exports.NotionDom = 'notionDom';
exports.NotionDomRouter = 'notionDomRouter';
let notion;
try {
    notion = new client_1.Client({
        auth: process.env.NOTION_API_KEY || 'secret_pr32BMgP2NEVuuANe7f9Sr0cwKiOJ0UcIkz8PKP4MOn',
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
        return injectHtml_1.injectHtml(dom, blocks_to_html_1.blocksToHtml(blocks.results), route);
    }
    catch (e) {
        scully_1.log(scully_1.red(`Something went wrong. ${e}`));
        return Promise.resolve(dom);
    }
}
scully_1.registerPlugin('router', exports.NotionDomRouter, notionDomRouterPlugin);
scully_1.registerPlugin('postProcessByDom', exports.NotionDom, notionDomPlugin);
//# sourceMappingURL=notion-plugin.js.map