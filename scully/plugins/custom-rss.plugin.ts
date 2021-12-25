import { readAndParseJson } from '@angular/cli/utilities/json-file';
import { HandledRoute, log, logError, registerPlugin, yellow } from '@scullyio/scully';
import { Feed, Item as FeedItem } from 'feed';
import { writeFileSync } from 'fs';
import { join } from 'path';

const rssConfigJson = readAndParseJson(join(__dirname, '../../rss.config.json'));
const blogPostRouteSlug = rssConfigJson.blogPostRouteSlug || '/blog';
const filename = rssConfigJson.filename || 'feed';
const feed = new Feed(rssConfigJson);

rssConfigJson.categories.forEach((cat) => {
  feed.addCategory(cat);
});

async function customRssPlugin(routes: HandledRoute[]) {
  // console.log(routes);
  log('Started @notiz/scully-plugin-rss (custom)');

  const blogPosts = routes.filter(
    (r) => r && r.data && r.data.published && r.route.includes(blogPostRouteSlug),
  );

  if (rssConfigJson.newestPostsFirst) {
    blogPosts.sort((a, b) => (a.data.publishedAt > b.data.publishedAt ? -1 : 1));
  } else {
    blogPosts.sort((a, b) => (a.data.publishedAt > b.data.publishedAt ? 1 : -1));
  }

  log(
    `Generating RSS Feed for ${yellow(blogPosts.length)} published blog ${
      blogPosts.length === 1 ? 'post' : 'posts'
    }`,
  );

  blogPosts.forEach((r) => {
    feed.addItem(createFeedItemFromRoute(r));
  });

  try {
    writeFileSync(join(rssConfigJson.outDir || '', `${filename}.xml`), feed.rss2());
    log(`✅ Created ${yellow(rssConfigJson.outDir + `/${filename}.xml`)}`);
    writeFileSync(join(rssConfigJson.outDir || '', `${filename}.atom`), feed.atom1());
    log(`✅ Created ${yellow(rssConfigJson.outDir + `/${filename}.atom`)}`);
    writeFileSync(join(rssConfigJson.outDir || '', `${filename}.json`), feed.json1());
    log(`✅ Created ${yellow(rssConfigJson.outDir + `/${filename}.json`)}`);
  } catch (error) {
    logError('❌ Failed to create RSS feed. Error:', error);
    log(error.stack);
    throw error;
  }

  log('Finished @notiz/scully-plugin-rss (custom...)');
}

function createFeedItemFromRoute(route: HandledRoute): FeedItem {
  let item: FeedItem;
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
  } catch (err) {
    logError(`Error during feed item creation ${route.data.route}`, err);
  }
}

registerPlugin('routeDiscoveryDone', 'customRssPlugin', customRssPlugin);
