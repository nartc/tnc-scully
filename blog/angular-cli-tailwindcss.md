---
title: TailwindCSS with Angular CLI
description: Angular 11.2 comes with built-in support for TailwindCSS
date: '2021-02-04'
published: true
slug: 'angular-cli-tailwindcss'
tags: ['Angular', 'Tailwind']
---

A recent [PR](https://github.com/angular/angular-cli/commit/73b409881f71a8235769a345356dcde3c568d0c3) that enables 
[TailwindCSS](https://tailwindcss.com) by default in [AngularCLI](https://cli.angular.io) projects. And this PR has been merged and released as a new feature in [v11.2.0-rc0](https://github.com/angular/angular-cli/releases/tag/v11.2.0-rc.0)

The PR adds code to detect if there is a `tailwind.config.js` in the project's root (or workspace's root if you're using workspace feature of Angular CLI). Let's explore this built-in feature.

## Initialize a new AngularCLI project

```bash
npx @angular/cli@next new test-tailwindcss-cli --minimal
```

We'll be using `next` version of the **Angular CLI** to generate this new project. I also use `--minimal` flag to 
speed up the generation process a bit by skipping initializing tests. Go ahead and pick whatever **CSS Flavor** you want, I go with **SCSS**.

## Install and initialize TailwindCSS

Change directory into the newly created Angular application.

```bash
npm i -DE tailwindcss
```

This will install `tailwindcss` to our `devDependencies`. Next, we will need a `tailwind.config.js`, and that is just a command away

```bash
npx tailwindcss init
```

At this point, our Angular application has been *TailwindCSS enabled*

## Purging unused CSS

If you're interested in **TailwindCSS**, you are probably aware that **TailwindCSS** adds a lot of CSS utilities classes. This means the CSS size is pretty big by default. Luckily, **TailwindCSS** does come with a purging mechanism that we would want to enable when we run a production build (`ng build --prod`). To do that, we'll install an additional library:

```bash
npm i -DE cross-env
```

Then, we'll add a new `script` to our `package.json`

```
...
"scripts": {
  ...
  "build:prod": "cross-env NODE_ENV=production ng build --prod"
  ...
}
...
```

> `cross-env` is optional. This is a nice solution to set the environment variable in a cross-platform way.

Next, we'll modify the `tailwind.config.js` to use `process.env.NODE_ENV` that we set with the new script

```js
module.exports = {
    purge: {
        enabled: process.env.NODE_ENV === 'production', // <-- add this line
        content: ['./src/**/*.{html,ts}'], // <-- add this line
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
```

## Conclusion

This addition to the **Angular CLI** is extremely helpful to get developers started with **TailwindCSS**.
