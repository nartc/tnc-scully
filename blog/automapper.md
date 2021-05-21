---
title: (re)Introduce to AutoMapper TypeScript
description: I have just cut an official release for v1.0.0 of AutoMapper TypeScript and here's everything you, if interested, need to know.
publishedAt: 2021-01-16
updatedAt: 2021-01-16
published: true
slug: 'automapper-typescript-1'
tags: ['TypeScript']
authors: ['Chau Tran']
---

### Preface

More than a year ago, I published a [blog post](https://nartc.netlify.app/blogs/introduction-to-automapper-typescript/) to introduce my **AutoMapper TypeScript** library: [@nartc/automapper](https://www.npmjs.com/package/@nartc/automapper).

Since then, `@nartc/automapper` has been doing pretty well (<span>![npm](https://img.shields.io/npm/dw/@nartc/automapper?style=flat-square)</span>). I am extremely **proud** of that.

However, the work done in the library was tailored specific for some projects at where I work at the time. The growing adoption from the community has also raised the number of issues the library has. To be quite honest, I've been _fixing_ the issues with patches after patches. All I'm trying to say is the library was poorly written. At one point, I couldn't understand what I wrote.

Ultimately, that was the signal for me to re-architect `@nartc/automapper` to accommodate the growing usages, and to welcome contributors. The result of this is `@automapper/*`, which can be found on [Github](https://github.com/nartc/mapper)

### Difference from `@nartc/automapper`

`@automapper` is written with **Separation of Concerns** in mind. It is a collection of packages that is grouped in a [monorepo](https://github.com/nartc/mapper). The available packages are as follows:

- `core`: Core package that handles **Mapping Configuration** and **Mapping Operation**. It also provides utilities to write custom plugins. **Separation of Concerns** is achieved through the internal **Plugin** system of `@automapper`
- `classes`: An official plugin to work with TS/ES6 Classes. This is exactly like how `@nartc/automapper` currently works today with a slight boost in performance and usability.
- `pojos`: An official plugin to work with Plain Objects + `Interface` (or `Type Alias`). This also supports for plain **JavaScript**.
- `nestjs`: An official wrapper for [NestJS](https://nestjs.com).
- `types`: This provides all common type-definitions for `core` and other `packages`.

The monorepo approach allows me to separate the logic of `@nartc/automapper` into `core` and the official **plugins**. It is easier to support new features, or to address issues independently for each part of the library. **Plugin** system also allows for extensibility of `@automapper`, and this is precisely how I can support for Plain Objects with `pojos`.

> If you are a current user of `@nartc/automapper`, please check out the [Migration Guide](https://automapperts.netlify.app/docs/migrations)

### Technologies

In `@nartc/automapper`, the library is just a plain **TypeScript** project that is published to [npm](https://npmjs.com). `@automapper` is a little more *bleeding edge*.

#### Nx DevTools

With a monorepo approach in mind, I turn to [Nx](https://nx.dev) right away. **Nx** provides all the tools I need to create my library in a manageable, and modern way. All **building**, **testing** ([jest](https://jestjs.io/)), and **linting** ([eslint](https://eslint.org/)) tools are *out-of-the-box* and work wonderfully.

#### Semantic Versioning

With multiple packages in a monorepo, I need a versioning system that can help me confidently deliver updates to the consumers. The answer is [SemVer](https://semver.org/). **Semantic Versioning** allows me to ship fixes and new features with appropriate version numbers. `@automapper` consumers can take a look at a release and will be able to tell how the changes affect their projects.

#### Conventional Commit

**Semantic Versioning** isn't enough. I also need a commit system that conveys clear intentions of the changes made to the library. [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) is what I rely on for this.

#### ReleaseIt!

With **Semantic Versioning** and **Conventional Commit**, I can utilize some tool to automate the process of document the changes between versions. My answer for this is [release-it](https://github.com/release-it/release-it). **ReleaseIt** looks at **conventional commits** to generate a **CHANGELOG**, and bumb the correct **semantic version**. In addition, **ReleaseIt** can also automate publishing to **NPM** but I choose to control this process manually.

### Getting started

Please check out the following documentations/sections to learn more:
- [core README](https://github.com/nartc/mapper/blob/main/packages/core/README.md)
- [classes README](https://github.com/nartc/mapper/blob/main/packages/classes/README.md)
- [pojos README](https://github.com/nartc/mapper/blob/main/packages/pojos/README.md)
- [nestjs README](https://github.com/nartc/mapper/blob/main/packages/nestjs/README.md)

Also check out the [full documentations](https://automapperts.netlify.app)

### Performance benchmark

> DISCLAIMER: The benchmark approach that I used is very naive and simple. I'd appreciate any feedback/suggestion on how to be more accurate on benchmarking this.

For benchmarking, I put `@automapper` with a couple of alternatives: [morphism](https://github.com/nobrainr/morphism), [class-transformer](https://github.com/typestack/class-transformer), and the current [@nartc/automapper](https://www.npmjs.com/package/@nartc/automapper).

The required models and transformations are as follows:

```ts
export class Bio {
    job: string;
    age: number;
    birthday: Date;
}

export class User {
    firstName: string;
    lastName: string;
    bio: Bio;
}

export class BioVm {
    job: string;
    isAdult: boolean;
    birthday: string;
}

export class UserVm {
    first: string;
    last: string;
    full: string;
    bio: BioVm;
}
```

> `class` is irrelevant here. The actual models are important.

- For `Bio` to `BioVm`
  - `job` stays the same
  - `age` will become `isAdult` with a condition check: `age > 18`
  - `birthday` will change from type `Date` to type `string` with: `birthday.toDateString()`

- For `User` to `UserVm`
  - `firstName` will become `first`
  - `lastName` will become `last`
  - `full` will be mapped from `firstName + lastName`
  - `bio` will be mapped from `Bio` to `BioVm`


#### Mapping Configuration

**Mapping Configuration** for each library is as follows:

```ts
// `@automapper/classes` (same for `@automapper/pojos`, and `@nartc/automapper`)
classMapper.createMap(Bio, BioVm)
    .forMember(d => d.isAdult, mapFrom(s => s.age > 18))
    .forMember(d => d.birthday, mapFrom(s => s.birthday.toDateString()));
classMapper.createMap(User, UserVm)
    .forMember(d => d.first, mapFrom(s => s.firstName))
    .forMember(d => d.last, mapFrom(s => s.lastName))
    .forMember(d => d.full, mapFrom(s => s.firstName + ' ' + s.lastName));
```

```ts
// `class-transfomer` uses Decorators for mapping configuration
export class TransformBioVm {
    @Expose()
    job: string;
    @Expose()
    @Transform(({ obj }) => obj.age > 18, {toClassOnly: true})
    isAdult: boolean;
    @Expose()
    @Transform(({ value }) => value.toDateString())
    birthday: string;
}

export class TransformUserVm {
    @Expose({name: 'firstName'})
    first: string;
    @Expose({name: 'lastName'})
    last: string;

    @Expose()
    @Transform(({ obj }) => obj.firstName + ' ' + obj.lastName, {toClassOnly: true})
    full: string;

    @Expose()
    @Type(() => TransformBioVm)
    bio: TransformBioVm;
}
```

```ts
// `morphism` expects a Schema
morphism({
  first: 'firstName',
  last: 'lastName',
  full: ({firstName, lastName}: any) => firstName + ' ' + lastName,
  bio: {
    job: 'bio.job',
    isAdult: ({bio}: any) => bio.age > 18,
    birthday: ({bio}: any) => bio.birthday.toDateString()
    }
  })
```

#### Result

The above mapping configuration is executed for 10000 items for each library. The following result is taken by the average time (in `ms`) over 20 iterations.

| library               | description                                              | time        |
| --------------------- | -------------------------------------------------------- | ----------- |
| `@nartc/automapper`   | -                                                        | 83.4028ms   |
| `morphism`            | -                                                        | 115.6094ms  |
| `morphism`            | with `mapper` approach                                   | 111.4560ms  |
| `class-transformer`   | -                                                        | 109.3750ms  |
| `class-transformer`   | with `iterative` approach instead of passing in an array | 113.9456ms  |
| `@automapper/classes` | -                                                        | 79.1730ms   |
| `@automapper/pojos`   | -                                                        | 81.8340ms   |

> Latest version of `class-transformer` has improved the performance tremendously 🔥. This benchmark result has been 
> updated to reflect that. Before, `class-transformer` is in the 1000s ms for the same operations.

### Conclusion

I hope this blog post piques your interests to learn more about `@automapper`, and **AutoMapper TypeScript** in general. Please visit [`@automapper` documentations](https://automapperts.netlify.app) to check out even more information on the library, and everything that leads to its creation. Thank you all for reading!
