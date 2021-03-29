---
title: Deploy your Scully application with Netlify
description: So easy that a blog description is overrated!
date: '2021-03-28'
published: true
slug: 'deploy-scully-netlify'
tags: ['Scully', 'Angular', 'Netlify']
---

In this blog post, I will introduce to you how to deploy your [Scully](https://scully.io) powered [Angular](https://angular.io) application to [Netlify](https://netlify.com).

## Prerequisite

In order to follow this blog post, the following is needed:

- A [Github](https://github.com) account
- A [**Netlify**](https://app.netlify.com/signup) account
- **AngularCLI** installed*

> *: this can be skipped if you prefer to use `npx` instead.

## What is Scully?

**Scully** is a Static Site Generation solution for **Angular** developers who embrace the [JAMstack](https://jamstack.org/). Upon invocation, **Scully** will attempt to scan your **Angular** application (via the build `ng build` artifacts), and create an `index.html` for every route you have configured in your application. By generating these `index.html` filled with content, your **Angular** application will be extremely fast, SEO-friendly, and will still function as an **Angular** application that you know and love.

Another big advantage of **Scully** is that they have a growing ecosystem with extensible and easy-to-use plugins that enable you to manipulate the generation process so that you can customize the output as you see fit.

In this blog post, we will skip setting up a **Scully** application step to focus on **Netlify**. To learn more, please read my [Getting started with Scully](https://nartc.me/blog/getting-started-scully) then come back here to continue.

## Preparations

### Github
Assuming you have your **Scully** application ready, the next step is to set up a **Github** repository. Go ahead and create a new repository by visiting your **Github** account or go to [https://repo.new](https://repo.new).

Once you have the repository ready, let's get started

- `cd /path/to/your/scully-app`
- (optional) Change your default branch to `main`
- `git remote add origin <your_git_repo_url>`
- `git push -u origin main`

#### (Optional) Change default branch to `main`

Make sure your current default branch (`master`) is up-to-date and is clean (has no current changes)

- `git checkout -b main`
- `git branch -d master`

### Build script

Next, we will set up our build script that will execute a production build for our **Angular** application and run **Scully** afterwards. Open up `package.json` and add the following script to `scripts`:

```text
"scripts": {
    ...,
    "build:prod": "ng build --prod && scully --prod --scanRoutes",
    ...,
}
```

You can call `"build:prod"` whatever you want. As mentioned above, this script will execute:
- `ng build --prod`: **Angular** production build
- `scully --prod --scanRoutes`: **Scully** production build. We also use `--scanRoutes` flag to force **Scully** to re-scan all routes.

Now, we are ready to deploy to **Netlify**.

## What is Netlify?

**Netlify** is "an intuitive Git-based workflow and powerful serverless platform to build, deploy, and collaborate on web apps". Developers can connect their **Github** (or other Source Control solutions) repositories to **Netlify** and configure an Automatic Deploy pipeline (CI/CD). In summary, you push new changes to your repository then **Netlify** takes over, the end result is your site deployed on the World Wide Web.

## Setup Netlify

1. Have your **Netlify** account ready and login to [Netlify](https://netlify.com).
2. On the Dashboard, click on **New site from Git**

![new_site_from_git](/assets/static/images/scully-netlify/new-site-from-git.png)
_Getting started_

3. Next, select your Git provider. We will use **Github** here

![select_git](/assets/static/images/scully-netlify/select-git.png)
_Selecting Git providers_

4. **Netlify** will start the Authorization flow to authorize itself with your Git provider. In the case of **Github**, **Netlify** will then ask to be configured with your **Github** account. Do so however you like, just make sure that the repository in which contains your **Scully** application is made available to **Netlify**

![configure_netlify](/assets/static/images/scully-netlify/configure-netlify-access.png)
_Configure Netlify App on Github_

5. Click **Save** then select the repository you want to continue with **Netlify**

![select_repo](/assets/static/images/scully-netlify/select-repo.png)
_Select repository_

6. On the next screen, let's fill in the inputs as the screenshot

![configure_deploy](/assets/static/images/scully-netlify/configure-deploy.png)
_Configure deploy settings_

7. As soon as you're ready, hit **Deploy**, and you'll be redirected back to the Dashboard. Here, **Netlify** will start building your site based on the configuration earlier. When it's finished, you can start visiting your site via the domain that **Netlify** provides

![site_dashboard](/assets/static/images/scully-netlify/site-dashboard.png)
_Site dashboard_

You can change your site name by clicking on **Site Settings**, then **Change site name**

![change_site_name](/assets/static/images/scully-netlify/change-site-name.png)
_Change your site name_

Since this is a free domain, the site name needs to be unique across **Netlify** so pick something unique for yourself. After you save, your domain will now become `https://<your_site_name>.netlify.app`.

![updated_site_name](/assets/static/images/scully-netlify/updated-site-name.png)
_Updated site name on the dashboard_

That's it. Every time you push changes to your repository, **Netlify** will pick that up and build a new version based on the new changes.

## Summary

By the end of this blog post, you've already had a **Scully** application configured for writing blog posts via **Markdown** files. In addition, you've also set up a CI/CD pipeline to deploy new changes to the World Wide Web automatically with **Netlify**. Happy blogging!

## Resources

- [Demo Repository](https://github.com/nartc/scully-netlify-demo)
- [Netlify](https://netlify.com)
- [Scully](https://scully.io)
- ["Getting started with Scully" blog post](https://nartc.me/blog/getting-started-scully)

Special thanks to [@jefiozie](https://twitter.com/jefiozie) and [@tuantrungvo](https://twitter.com/tuantrungvo) for proof-reading this blog post.
