import { Client } from '@notionhq/client';
import {
  getPluginConfig,
  HandledRoute,
  log,
  red,
  registerPlugin,
  RouteConfig,
  yellow,
} from '@scullyio/scully';
import { injectHtml } from '@scullyio/scully/src/lib/renderPlugins/content-render-utils/injectHtml';
import { JSDOM } from 'jsdom';
import {
  blocksToHtml,
  parseEmbedded,
  parseImage,
  parseList,
  parseRichTexts,
} from './blocks-to-html';
import { NotionPluginOptions, NotionPluginTransformers } from './notion-plugin-options';
import { pagePropertiesToFrontmatter } from './page-properties-to-frontmatter';
import { stringifyLog } from './utils';

export const NotionDom = 'notionDom';
export const NotionDomRouter = 'notionDomRouter';

const defaultTransformersFactory: (pluginOptions: NotionPluginOptions) => NotionPluginTransformers =
  (pluginOptions) => ({
    file: (file) => `<img src='${file.url}' alt='${file.url}'>`,
    externalFile: (externalFile) => `<img src='${externalFile.url}' alt='${externalFile.url}'>`,
    imageCaption: (richTexts) => `<em>${parseRichTexts(richTexts, pluginOptions)}</em>`,
    link: (original, text) =>
      `<a href='${text.link.url}' rel='noopener noreferrer' target='_blank'>${original}</a>`,
  });

export const defaultPluginOptions: NotionPluginOptions = {
  parsers: {
    unorderedListWrapper: (listItemsHtml) => `<ul>${listItemsHtml}</ul>`,
    orderedListWrapper: (listItemsHtml) => `<ol>${listItemsHtml}</ol>`,
    embed: parseEmbedded,
    image: (image) => parseImage(image, defaultTransformersFactory(defaultPluginOptions)),
    heading1: (richTexts) => `<h1>${parseRichTexts(richTexts, defaultPluginOptions)}</h1>`,
    heading2: (richTexts) => `<h2>${parseRichTexts(richTexts, defaultPluginOptions)}</h2>`,
    heading3: (richTexts) => `<h3>${parseRichTexts(richTexts, defaultPluginOptions)}</h3>`,
    paragraph: (richTexts) => `<p>${parseRichTexts(richTexts, defaultPluginOptions)}</p>`,
    listItem: (list) => parseList(list, defaultPluginOptions),
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

let notion: Client;

try {
  notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });
} catch (e) {
  stringifyLog(e);
  throw new Error(`Something went wrong. ${e}`);
}

function assertNotionClient() {
  if (!notion) {
    throw new Error('Unable to initialize Notion Client');
  }
}

async function notionDomRouterPlugin(route: string, config: RouteConfig): Promise<HandledRoute[]> {
  assertNotionClient();

  const mergedConfig = {
    ...{ slugKey: 'slug', basePath: '/blog', titleSuffix: '' },
    ...(config || {}),
  } as RouteConfig;

  if (!mergedConfig.databaseId) {
    throw new Error(`Please specify your Notion databaseId that contains your blog posts`);
  }

  // TODO: cache;
  try {
    const blogPosts = await notion.databases.query({ database_id: mergedConfig.databaseId });
    return Promise.resolve(
      blogPosts.results.map((blogPostResult) => {
        const frontmatter = pagePropertiesToFrontmatter(blogPostResult.properties);
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
        } as HandledRoute;
      }),
    );
  } catch (e) {
    log(red(`Something went wrong. ${e}`));
    return Promise.resolve([]);
  }
}

async function notionDomPlugin(dom: JSDOM, route: HandledRoute): Promise<JSDOM> {
  assertNotionClient();
  const blogId = route.data['id'];

  // TODO: Cache
  if (!blogId) {
    log(yellow(`Cannot find blog id. Skipping ${route.route}`));
    return Promise.resolve(dom);
  }

  try {
    const blocks = await notion.blocks.children.list({ block_id: blogId });
    if (!blocks || !blocks.results.length) {
      log(yellow(`Blog does not have any blocks. Skipping ${route.route}`));
      return Promise.resolve(dom);
    }

    const pluginOptions: NotionPluginOptions = {
      ...defaultPluginOptions,
      ...(getPluginConfig(NotionDom, 'postProcessByDom') || {}),
    };

    return injectHtml(dom, blocksToHtml(blocks.results, pluginOptions), route);
  } catch (e) {
    log(red(`Something went wrong. ${e}`));
    return Promise.resolve(dom);
  }
}

registerPlugin('router', NotionDomRouter, notionDomRouterPlugin);
registerPlugin('postProcessByDom', NotionDom, notionDomPlugin);
