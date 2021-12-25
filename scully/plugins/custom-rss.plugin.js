"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_file_1 = require("@angular/cli/utilities/json-file");
const scully_1 = require("@scullyio/scully");
const feed_1 = require("feed");
const fs_1 = require("fs");
const path_1 = require("path");
const rssConfigJson = (0, json_file_1.readAndParseJson)((0, path_1.join)(__dirname, '../../rss.config.json'));
const blogPostRouteSlug = rssConfigJson.blogPostRouteSlug || '/blog';
const filename = rssConfigJson.filename || 'feed';
const feed = new feed_1.Feed(rssConfigJson);
rssConfigJson.categories.forEach((cat) => {
    feed.addCategory(cat);
});
async function customRssPlugin(routes) {
    // console.log(routes);
    (0, scully_1.log)('Started @notiz/scully-plugin-rss (custom)');
    const blogPosts = routes.filter((r) => r && r.data && r.data.published && r.route.includes(blogPostRouteSlug));
    if (rssConfigJson.newestPostsFirst) {
        blogPosts.sort((a, b) => (a.data.publishedAt > b.data.publishedAt ? -1 : 1));
    }
    else {
        blogPosts.sort((a, b) => (a.data.publishedAt > b.data.publishedAt ? 1 : -1));
    }
    (0, scully_1.log)(`Generating RSS Feed for ${(0, scully_1.yellow)(blogPosts.length)} published blog ${blogPosts.length === 1 ? 'post' : 'posts'}`);
    blogPosts.forEach((r) => {
        feed.addItem(createFeedItemFromRoute(r));
    });
    try {
        (0, fs_1.writeFileSync)((0, path_1.join)(rssConfigJson.outDir || '', `${filename}.xml`), feed.rss2());
        (0, scully_1.log)(`✅ Created ${(0, scully_1.yellow)(rssConfigJson.outDir + `/${filename}.xml`)}`);
        (0, fs_1.writeFileSync)((0, path_1.join)(rssConfigJson.outDir || '', `${filename}.atom`), feed.atom1());
        (0, scully_1.log)(`✅ Created ${(0, scully_1.yellow)(rssConfigJson.outDir + `/${filename}.atom`)}`);
        (0, fs_1.writeFileSync)((0, path_1.join)(rssConfigJson.outDir || '', `${filename}.json`), feed.json1());
        (0, scully_1.log)(`✅ Created ${(0, scully_1.yellow)(rssConfigJson.outDir + `/${filename}.json`)}`);
    }
    catch (error) {
        (0, scully_1.logError)('❌ Failed to create RSS feed. Error:', error);
        (0, scully_1.log)(error.stack);
        throw error;
    }
    (0, scully_1.log)('Finished @notiz/scully-plugin-rss (custom...)');
}
function createFeedItemFromRoute(route) {
    let item;
    try {
        if (route.data.published) {
            item = {
                title: route.data.title,
                id: route.route,
                link: rssConfigJson.link + route.route,
                content: route.data.description,
                description: route.data.description,
                author: route.data.authors ? route.data.authors.map((a) => ({ name: a })) : null,
                contributor: route.data.authors
                    ? route.data.authors.map((a) => ({
                        name: a.toLowerCase().replace(' ', '-'),
                    }))
                    : [],
                date: route.data.updatedAt ? route.data.updatedAt : route.data.publishedAt,
                image: route.data.twitterBanner,
            };
        }
        return item;
    }
    catch (err) {
        (0, scully_1.logError)(`Error during feed item creation ${route.data.route}`, err);
    }
}
(0, scully_1.registerPlugin)('routeDiscoveryDone', 'customRssPlugin', customRssPlugin);
//# sourceMappingURL=custom-rss.plugin.js.map