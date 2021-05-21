---
title: Getting started with Scully
description: In this blog post, I will show you how to get started with Scully
publishedAt: 2020-06-02
updatedAt: 2020-06-02
published: true
slug: 'getting-started-scully'
tags: ['Scully', 'Angular', 'TypeScript']
authors: ['Chau Tran']
---

Allow me to start off by saying how good and _at home_ I feel to be able to write my blog posts using [Angular](https://angular.io){:target=\_blank rel=noreferrer} with the help of [Scully](https://scully.io){:target=\_blank rel=noreferrer}.
And I believe most people who are looking into Scully will try to find the same feeling working on their personal blogs. In this blog, we are going to
explore all the basic steps needed to get your personal blog up and running with Scully and Angular

### Prerequisite

To follow the steps in this blog post, please ensure you have the following:

- Node/NPM
- AngularCLI\*
- Basic knowledge of how Angular works

> AngularCLI isn't really needed because you can use `npx`

### Preparations

First, let's create a new Angular application

```bash
npx ng new ng-scully --minimal
```

Select **Yes** for Angular Routing and whatever you are comfortable with for Stylesheet (I use SCSS).

> `--minimal` flag tells AngularCLI to create a minimal Angular application without any files related to testings

Second, we will add Scully to our newly created Angular application. The easiest way is to use `ng add` schematics.

```bash
ng add @scullyio/init
```

Scully schematics will do the following:

- Add Scully dependencies to `package.json` and install them
- Import `ScullyLibModule` to `AppModule`
- Add `'zone.js/dist/task-tracking'` to `polyfills.ts`
- Add `scully.<project_name>.config.ts` to the root directory. This is Scully configuration file that we will utilize to configure Scully.

> `<project_name>` is `ng-scully` in this case

Your Angular application is now Scully ready.

### Adding the blog

This is straight out of Scully documentations. Run the following schematics to add a `BlogModule` to our application.

```bash
ng generate @scullyio/init:blog
```

The above schematics will create a default `BlogModule` along with `BlogRoutingModule` under `src/app/blog` directory. It also updates `scully.*.config.ts`
and `AppRoutingModule` to add a lazy-loaded `'blog'` route to our application. Last but not least, the schematics also creates a default blog post under `blog`
directory in the root directory.

If you do not like the default configuration, use the following schematics to customize the module name and blog directory. For the purpose of this blog post, we'll
stick with the default `BlogModule`.

```bash
ng generate @scullyio/init:markdown
```

### Adding the entry page

The entry page is the page when your users will land on right after they go to your website address. Scully documentations suggests to generate a `HomeModule`
which we will follow. Feel free to adjust the following command to your liking.

```bash
ng generate module home --route=home --module=app-routing
```

The above command will create a `HomeModule` and also update `AppRoutingModule` to add a lazy-loaded `/home` route. Go ahead and change `'home'` to `''` since
we need this to be our entry page.

###### **app-routing.module.ts**

```typescript
// before
const routes: Routes = [
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
];

// after
const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule) },
];
```

Also go to `app.component.ts` and clear everything in the template except for `<router-outlet></router-outlet>`.
Now let's try to render our list of blogs in `home.component.ts`. Scully provides `ScullyRoutesService` in order to query the routes that Scully has pre-rendered.

###### **home.component.ts**

```typescript
import { Component, OnInit } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <ul>
      <li *ngFor="let route of routes$ | async">
        <a [routerLink]="[route.route]">{{ route.title }}</a>
      </li>
    </ul>
  `,
})
export class HomeComponent {
  routes$ = this.scullyRoutesService.available$.pipe(
    map((routes) => routes.filter((route) => route.route.includes('/blog'))),
  );

  constructor(private readonly scullyRoutesService: ScullyRoutesService) {}
}
```

What happened here? First, I removed `styles: []` and `ngOnInit()` life-cycle since we're not using those as of this moment. Next, we inject
`ScullyRoutesService` and use `ScullyRoutesService.available$`. `available$` is an `Observable<HandledRoute[]>` which will return us all routes
that have been handled by Scully. This also includes the `/` home route. Thus, we use `map()` operator to filter out the `/` route. The result is
an `Observable` of all routes that have `/blog` in the `route` property.

For the template, we are just going to render a simple `ul` with the help of `ngFor` and `async` here. Now, the final step is to go to the `blog` directory
and open up the single Markdown file there.

> If you ran the `@scullyio/init:markdown` schematics instead of the default one, please use your specified route instead of `/blog`. Also, your blog directory might differ from `blog`

###### **\<date\>-blog.md**

```md
---
title: <date>-blog
description: blog description
<!-- change published to true -->
published: true
---

# <date>-blog
```

> `<date>` will be whatever date the day you read this blog post.

Now, we are ready to build and see Scully in actions. Scully will read the build output of `ng build` and figure out which routes need to be
pre-rendered based on `scully.*.config.ts` where right now, we only have `/blog/:slug` setup. This means that Scully will try to pre-render all
`/blog/:slug` routes based on the configuration and the content in `blog` directory. Let's open up the terminal and run the following commands.

```bash
ng build
```

This familiar command for Angular folks is needed as Scully needs the output of that command.

```bash
npm run scully
# or yarn scully
```

Scully will start reading the build output and pre-rendering routes that it sees. It also creates a `src/assets/scully-routes.json` which houses the
pre-rendered routes along with routes' metadata (+ frontmatter) if available. Scully's output will be under `dist/static` directory. Now, let's serve
Scully

```bash
npm run scully:serve
# or yarn scully:serve
```

Open your browser and go to `http://localhost:1668`. You will see your `HomeComponent` there with a single link. Click on the link will take you to
`BlogComponent` and your blog content (Markdown) will be rendered between the horizontal rules. Try `View Page Source` it and you'll see all of the
pre-rendered content there which means your `BlogComponent` is SEO friendly. Pretty cool 👌

### Development Experience

Even though Scully is COOL out of the box, it is still a new technology and is not without flaws. The biggest flaw in my opinon has to be **Development Experience**.
You probably already noticed the number of commands needed to be ran to have the development server up and running. Yeah, not really convenient 🙂.

Scully documentations does not have a recommended development flow. With that said, I have the following flow that I think work pretty well for now.

1. Open two terminal windows side by side.
2. On one terminal, we'll run `npm run build` when we change the component's code.
3. On the other terminal, we'll have `npm run scully -- --watch` running and keep it running. Changes to the blog content (Markdown)
   will trigger a re-run to `scully --watch`.

There's still a lot of switching back and forth terminal but the above flow has been helping me tremendously. In addition, you can always set up some kind of **File Watcher**
and run appropriate commands if you desire.

### Where to go from here

As of now, you have a working pre-rendered blog with Angular and Scully but it's pretty bland. You can:

- Style it up. Use any UI libraries you feel like it or just plain old CSS if you're comfortable with it.
- Give your blogs tags and setup a `TagComponent` to render a list of blogs based on the tag.
- Setup `@angular/pwa` to support offline mode.
- Learn how Scully plugin system works.

> I'll write about all of the above points in future blog(s)

and there are tons of other stuffs to add to your blog like Newsletter, Discussion section, Google Analytics etc.
Make sure to read [Scully documentations](https://scully.io){:target=\_blank rel=noreferrer}. Have fun and good luck building your personal blog 👋
