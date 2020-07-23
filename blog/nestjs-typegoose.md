---
title: NestJS + Typegoose
description: A workflow that leverages the power of TypeScript and Typegoose to clue NestJS and MongoDB together
date: '2020-07-22'
published: false
slug: 'nestjs-typegoose'
tags: ['NestJS']
---

Today, I am going to share with you a workflow/technique that I’ve been using when I work with **NestJS** and
**MongoDB**. This workflow leverages the power of **TypeScript** and an npm package called [Typegoose](https
://typegoose.github.io/typegoose/). This blog will be a quick one so let’s jump in.

> I’d assume you’re already familiar with **NestJS** and **MongoDB** (**Mongoose** ODM to be exact)

Start off by initializing a new **NestJS** application with `@nestjs/cli`

```shell script
nest new your_nest_application_name
cd your_nest_application_name
```
