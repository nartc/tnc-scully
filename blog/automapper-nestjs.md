---
title: AutoMapper + NestJS
description: AutoMapper integration with NestJS is better than ever
date: '2021-03-14'
published: true
slug: 'automapper-nestjs'
tags: ['TypeScript', 'NestJS']
---

[AutoMapper TypeScript](https://automapperts.netlify.app) provides an official integration package with [NestJS](https://nestjs.com) as `@automapper/nestjs`

### Installation

`@automapper/nestjs` works best with `@automapper/classes` plugin as the OOP nature and decorators usage in **NestJS**. To get started, install the required packages

```bash
npm i @automapper/{core,classes,nestjs}
npm i -D @automapper/types
```

### Setup

Setting up `@automapper/nestjs` is similar to setting up any other **Module**. When it comes to **AutoMapper**, you usually want to set it up at the earliest possible time so that it can keep track of all the models in your application. With this in mind, the best place to setup **AutoMapper** is `app.module.ts`

###### **app.module.ts**
```ts
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'classMapper', pluginInitializer: classes }],
      singular: true,
    }),
  ],
})
export class AppModule {}
```

Then inject and use the `Mapper` in any `Injectable`.

###### **app.service.ts**
```ts
import { InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(@InjectMapper() private readonly mapper: Mapper) {}
    
    getFooDto(): FooDto {
        // we will learn a different way to create Mapping later
        this.mapper.createMap(Foo, FooDto);
        
        const foo = new Foo();
        return this.mapper.map(foo, FooDto, Foo);
    }
}
```

`AutomapperModule.forRoot()` accepts an `AutomapperModuleOptions` which has the following interface:

```ts
export interface AutomapperModuleOptions {
  /**
   * An array of CreateMapperOptions to create multiple mappers
   */
  options: CreateMapperOptions[];
  /**
   * Global ErrorHandler to pass to all mappers
   */
  globalErrorHandler?: ErrorHandler;
  /**
   * Global NamingConventions to pass to all mappers
   */
  globalNamingConventions?:
    | NamingConvention
    | {
        source: NamingConvention;
        destination: NamingConvention;
      };
  /**
   * Set to true if you want to use the default Mapper token for when only one mapper is setup with forRoot
   * @default false
   */
  singular?: boolean;
}
```

- `options`: an array of `CreateMapperOptions`. At least one **Mapper** is required.
- `globalErrorHandler`: an optional `ErrorHandler`. Since you can initialize multiple **Mappers**, a `globalErrorHandler` can be passed in if you wish to use the same `ErrorHandler` for all **Mappers**
- `globalNamingConventions`: an optional `NamingConvention` or `NamingConvention` object. Since you can initialize multiple **Mappers**, you can pass in `globalNamingConventions` if you wish to use the same `NamingConvention` on all **Mappers**.
- `singular`: a flag that allows `InjectMapper` to work with or without an argument. Default to `false`.

#### `singular` flag

As mentioned above, `singular` determines the behavior of `InjectMapper`. The main difference is as follows:

###### **without singular**
```ts
@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'blah', pluginInitializer: classes }],
    }),
  ],
})
export class AppModule {}

@Injectable()
export class Service {
  // have to pass in the name of the mapper to InjectMapper
  constructor(@InjectMapper('blah') private blahMapper: Mapper) {}
}
```

###### **with singular**
```ts
@Module({
  imports: [
    AutomapperModule.forRoot({
      options: [{ name: 'blah', pluginInitializer: classes }],
      singular: true,
    }),
  ],
})
export class AppModule {}

@Injectable()
export class Service {
  // do not have to pass in the name of the mapper to InjectMapper
  constructor(@InjectMapper() private blahMapper: Mapper) {}
}
```

### Create Mappings

There are a couple of approaches to create mappings for **AutoMapper** in a **NestJS** application.
- Call `createMap()` whenever you inject the `Mapper`. This is the most basic approach, but the mapping logic can be quite extensive and has the potential of polluting your `Injectable` code.
- Utilize `AppModule#onModuleInit` life-cycle event. Here, you can inject the `Mapper` and consolidate all the mappings in `AppModule`. This approach ensures your mapping logic stays in one place as well as separated from your `Injectable` code
- Utilize `AutomapperProfile` which is the recommended approach

### Profile

In **AutoMapper**, `Profile` is a concept of grouping highly related mapping configurations. For example:

```ts
mapper.createMap(User, UserDto);
mapper.createMap(User, UserInformationDto);
mapper.createMap(User, AuthUserDto);
```

The above mappings are highly-related as in they all have to do with the `User` entity. Hence, a `UserProfile` is recommended to house these 3 mappings.

Specifically in **NestJS** integration, a `Profile` is implemented as an `Injectable` that extends an abstract class `AutomapperProfile`.

###### **user.profile.ts**
```ts
import { InjectMapper, AutomapperProfile } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        // Pass 👇 the Mapper to the parent AutomapperProfile class
        super(mapper);
    }
    
    // 👇 implement mapProfile()
    // mapProfile() will be called automatically by AutomapperProfile abstract class
    mapProfile() {
        return mapper => {
            mapper.createMap(User, UserDto);
            mapper.createMap(User, UserInformationDto);
            mapper.createMap(User, AuthUserDto);
        }
    }
}
```

Then provide `UserProfile` in `UserModule`

> Usually in **NestJS**, you would have **feature** module like `UserModule`, `OrderModule` etc... as a Separation of Concern approach. Associating a `xxProfile` with an appropriate `xxModule` makes sense.

###### **user.module.ts**
```ts
@Module({
    controllers: [UserController],
    providers: [UserProfile, UserService]
})
export class UserModule {}
```

Our `UserProfile` is just an `Injectable`, so you can inject other services in the `Profile` to build your mapping logic, if needed.

### Other features

Some other features that make `@automapper/nestjs` a great integration, and **AutoMapper** implementation, with **NestJS** are `MapInterceptor` and `MapPipe`.

#### `MapInterceptor`

In cases where you do not care about annotating the correct return type for a **Controller#method** and want your **Service** to be a little cleaner, you can utilize the `MapInterceptor` to execute the mapping.

###### **user.controller.ts**
```ts
import { MapInterceptor } from '@automapper/nestjs';

export class UserController {
    @Get('me')
    @UseInterceptors(MapInterceptor(UserDto, User))
    me() {
    // userService.getMe() returns a User here and does not have mapping logic in it.
        return this.userService.getMe();
    }
}
```

`MapInterceptor` has the following signature:

```ts
MapInterceptor(destinationModelType, sourceModelType, {
  isArray?: boolean;
  mapperName?: string;
} & MapOptions)
```

> See [MapOptions](https://automapperts.netlify.app/docs/misc/callbacks)

#### `MapPipe`

When you want to transform the incoming request body before it gets to the route handler, you can utilize `MapPipe` to achieve this behavior

###### **user.controller.ts**
```ts
@Post('/from-body')
postFromBody(@Body(MapPipe(UserDto, User)) user: UserDto) {
    // from the request perspective, user coming in as an User object but will be mapped to UserDto with MapPipe
    return user;
}
```

`MapPipe` only works with `@Body` or `@Query`.

###### **user.controller.ts**
```ts
@Get('/from-query')
getFromQuery(@Query(MapPipe(UserDto, User)) user: UserDto) {
    // from the request perspective, user coming in as an User object but will be mapped to UserDto with MapPipe
    return user;
}
```

`MapPipe` has the same signature as `MapInterceptor`.

> Note that when you send a request with Body or Query, the data is serialized. Data-type like Date will come in the request handler as string. Hence, please be cautious of the mapping configuration when you use MapPipe

To learn more about **AutoMapper**, visit the [documentations site](https://automapperts.netlify.app), and the [Github repo ](https://github.com/nartc/mapper). Feel free to reach out to me on social media for any questions 👋
