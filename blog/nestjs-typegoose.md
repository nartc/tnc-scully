---
title: NestJS + Typegoose
description: A workflow that leverages the power of TypeScript and Typegoose to clue NestJS and MongoDB together
publishedAt: 2020-07-22
updatedAt: 2020-07-22
published: true
slug: 'nestjs-typegoose'
tags: ['NestJS']
authors: ['Chau Tran']
---

### Update 08/24/2021:

This blog post was written when `mongoose` did not have its own type definitions and had to rely on `@types/mongoose`. In later versions of Mongoose, it provides its own type definitions which makes `@types/mongoose` obsolete, as well as makes some typings in this blog post not working anymore in `BaseRepository`. Here's a [Github Gist](https://gist.github.com/nartc/bbee6424eb7dc379ba7915c0db583a2e) for `BaseRepository` with the updated typings.

---

Today, I am going to share with you a workflow/technique that I’ve been using when I work with **NestJS** and
**MongoDB**. This workflow leverages the power of **TypeScript** and an npm package called [Typegoose](https://typegoose.github.io/typegoose/). This blog will be a quick one so let’s jump in.

> I assume you’re already familiar with **NestJS** and **MongoDB** (**Mongoose** ODM to be exact)

Start off by initializing a new **NestJS** application with `@nestjs/cli`

```bash
nest new your_nest_application_name
cd your_nest_application_name
```

Next, let's install the dependencies we're going to need:

```bash
npm i mongoose @typegoose/typegoose nestjs-typegoose mongoose-autopopulate mongoose-lean-virtuals
npm i -D @types/mongoose
```

We are going to utilize `nestjs-typegoose` instead of `@nestjs/mongoose`. `mongoose-autopopulate` and `mongoose-lean-virtuals` are two mongoose plugins
that we are also going to utilize.

Let's start wiring up our **Mongo Connection** using `nestjs-typegoose` first:

###### **app.module.ts**

```ts
@Module({
  imports: [TypegooseModule.forRoot('mongodb://localhost:27017/nestjs-typegoose')],
})
export class AppModule {}
```

Run `npm start` now and you'll see the following:

```bash
[Nest] 10198   - 07/22/2020, 11:59:18 AM   [NestFactory] Starting Nest application...
[Nest] 10198   - 07/22/2020, 11:59:18 AM   [InstanceLoader] AppModule dependencies initialized +41ms
[Nest] 10198   - 07/22/2020, 11:59:18 AM   [InstanceLoader] TypegooseModule dependencies initialized +1ms
[Nest] 10198   - 07/22/2020, 11:59:18 AM   [InstanceLoader] TypegooseCoreModule dependencies initialized +14ms
[Nest] 10198   - 07/22/2020, 11:59:18 AM   [NestApplication] Nest application successfully started +6ms
```

> If you have any warnings/errors, please make sure to check `mongoose` documentations.

Next, let's create some files:

```bash
mkdir shared
touch shared/base.model.ts
touch shared/base.repository.ts
mkdir shared/decorators
touch shared/decorators/use-mongoose-plugins.decorator.ts
```

We will fill these files one by one and we will explore what's going on in each file. First, let's take care of `use-mongoose-plugins.decorator.ts`

###### **use-mongoose-plugins.decorator.ts**

```ts
import { applyDecorators } from '@nestjs/common';
import { plugin } from '@typegoose/typegoose';
import * as autoPopulate from 'mongoose-autopopulate';
import * as leanVirtuals from 'mongoose-lean-virtuals';

export const useMongoosePlugin = () => applyDecorators(plugin(autoPopulate), plugin(leanVirtuals));
```

Very straightforward here. Typegoose provides `@plugin()` decorator to apply a mongoose plugin to a schema, just like `schema.plugin(pluginName)`.
We have two plugins: `autopopulate` and `lean-virtuals`. `autopopulate` will automatically populate **Reference Property** on the schema whereas
`lean-virtuals` will help us getting the `id` getter (which is a **virtual**) when we use `lean()` option.

> Learn more about these mongoose concept at: [Mongoose Documentations](https://mongoosejs.com/docs/)

However, we do not want to keep repeating `@plugin() @plugin()` on a schema, so we create a custom decorator `useMongoosePlugin()` with the help of
`applyDecorators()` from `nestjs/common`

With that out of the way, let's take care of `base.model.ts` next

###### **base.model.ts**

```ts
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
    },
  },
})
export abstract class BaseModel {
  @prop()
  createdAt: Date; // provided by schemaOptions.timestamps
  @prop()
  updatedAt: Date; // provided by schemaOptions.timestamps
  id: string; // _id getter as string
}
```

Another simple file. `BaseModel` will just help us encapsulate some of the properties that mongoose adds to the record automatically when mongoose saves it like the timestamps.
We also expose the `id` getter on `BaseModel` so we have access to it on our sub models. `@modelOptions()` is a decorator provided by Typegoose to set some extra options
on a model as well as the `schemaOptions`. Here, we set `timestamps` to `true` and turn `virtuals` and `getter` on for `toJSON`. `allowMixed` is what I usually have turned on
but it totally depends on your Schemas.

> Read more about Mixed: [Mongoose - Mixed](https://mongoosejs.com/docs/schematypes.html#mixed)

Last but not least, `base.repository.ts` is up

###### **base.repository.ts**

```ts
import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import {
  CreateQuery,
  DocumentQuery,
  FilterQuery,
  Query,
  QueryFindOneAndUpdateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { MongoError } from 'mongodb';
import { BaseModel } from './base.model';

type QueryList<T extends BaseModel> = DocumentQuery<Array<DocumentType<T>>, DocumentType<T>>;
type QueryItem<T extends BaseModel> = DocumentQuery<DocumentType<T>, DocumentType<T>>;

interface QueryOptions {
  lean?: boolean;
  autopopulate?: boolean;
}

export type ModelType<TModel extends BaseModel> = ReturnModelType<AnyParamConstructor<TModel>>;

export abstract class BaseRepository<TModel extends BaseModel> {
  protected model: ModelType<TModel>;

  protected constructor(model: ModelType<TModel>) {
    this.model = model;
  }

  private static get defaultOptions(): QueryOptions {
    return { lean: true, autopopulate: true };
  }

  private static getQueryOptions(options?: QueryOptions) {
    const mergedOptions = {
      ...BaseRepository.defaultOptions,
      ...(options || {}),
    };
    const option = mergedOptions.lean ? { virtuals: true } : null;

    if (option && mergedOptions.autopopulate) {
      option['autopopulate'] = true;
    }

    return { lean: option, autopopulate: mergedOptions.autopopulate };
  }

  protected static throwMongoError(err: MongoError): void {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  createModel(doc?: Partial<TModel>): TModel {
    return new this.model(doc);
  }

  findAll(options?: QueryOptions): QueryList<TModel> {
    return this.model.find().setOptions(BaseRepository.getQueryOptions(options));
  }

  findOne(options?: QueryOptions): QueryItem<TModel> {
    return this.model.findOne().setOptions(BaseRepository.getQueryOptions(options));
  }

  findById(id: string, options?: QueryOptions): QueryItem<TModel> {
    return this.model
      .findById(Types.ObjectId(id))
      .setOptions(BaseRepository.getQueryOptions(options));
  }

  async create(item: CreateQuery<TModel>): Promise<DocumentType<TModel>> {
    try {
      return await this.model.create(item);
    } catch (e) {
      BaseRepository.throwMongoError(e);
    }
  }

  deleteOne(options?: QueryOptions): QueryItem<TModel> {
    return this.model.findOneAndDelete().setOptions(BaseRepository.getQueryOptions(options));
  }

  deleteById(id: string, options?: QueryOptions): QueryItem<TModel> {
    return this.model
      .findByIdAndDelete(Types.ObjectId(id))
      .setOptions(BaseRepository.getQueryOptions(options));
  }

  update(item: TModel, options?: QueryOptions): QueryItem<TModel> {
    return this.model
      .findByIdAndUpdate(Types.ObjectId(item.id), { $set: item } as any, {
        omitUndefined: true,
        new: true,
      })
      .setOptions(BaseRepository.getQueryOptions(options));
  }

  updateById(
    id: string,
    updateQuery: UpdateQuery<DocumentType<TModel>>,
    updateOptions: QueryFindOneAndUpdateOptions & { multi?: boolean } = {},
    options?: QueryOptions,
  ): QueryItem<TModel> {
    return this.updateByFilter(
      { _id: Types.ObjectId(id) as any },
      updateQuery,
      updateOptions,
      options,
    );
  }

  updateByFilter(
    filter: FilterQuery<DocumentType<TModel>> = {},
    updateQuery: UpdateQuery<DocumentType<TModel>>,
    updateOptions: QueryFindOneAndUpdateOptions = {},
    options?: QueryOptions,
  ): QueryItem<TModel> {
    return this.model
      .findOneAndUpdate(filter, updateQuery, {
        ...Object.assign({ omitUndefined: true }, updateOptions),
        new: true,
      })
      .setOptions(BaseRepository.getQueryOptions(options));
  }

  count(filter: FilterQuery<DocumentType<TModel>> = {}): Query<number> {
    return this.model.count(filter);
  }

  async countAsync(filter: FilterQuery<DocumentType<TModel>> = {}): Promise<number> {
    try {
      return await this.count(filter);
    } catch (e) {
      BaseRepository.throwMongoError(e);
    }
  }

  async exists(filter: FilterQuery<DocumentType<TModel>> = {}): Promise<boolean> {
    try {
      return await this.model.exists(filter);
    } catch (e) {
      BaseRepository.throwMongoError(e);
    }
  }
}
```

Whew, that's a lot of code. Let's go through each portion:

- Some type-aliases to help with the typings: `QueryItem`, `QueryList`
- QueryOptions: an interface that is used to allow passing in `lean` and `autopopulate` options. Remember the plugins? These options contribute directly to how
  the plugins will work
- ModelType: a type alias of `ReturnModelType<AnyParamConstructor<TModel>>`. This is what Typegoose returns the Mongoose model as.
- `<TModel extends BaseModel>`: A little TypeScript conditional check to prevent passing `any` type to `BaseRepository`. We need the consumers to pass
  a sub-class of `BaseModel`.
- `protected model: ModelType<TModel>`: This is our model field on `BaseRepository` which is the direct contract to MongoDB. We make it `protected` so it can only be
  accessed from sub-classes and it cannot be modified. From the sub-classes, we are going to inject the correct Model then pass down to the `BaseRepository` via `super()`
- defaultOptions: This is the default `queryOptions` which is set to `{ lean: true, autopopulate: true }`. So by default, both plugins will be turned on for each query.
- getQueryOptions: This is a method that will merge the `options` that the consumers pass in when they consume the "Query Builder" methods with the `defaultOptions`
- The rest is a plethora of methods that wrap around the Model and have appropriate return type. Most of these methods will return `mongoose.Query` which is **chainable**
  and can be executed later (after chain everything needed) by `exec()` method.

> You can absolutely abstract more methods if you want.

In a real application, I would also add `BaseService` that would expose a `protected repository: BaseRepository`. The reason is when you work with a NestJS application,
you'll probably have **Feature Modules**. Each feature will probably cover a specific **Domain Model** (**Entity**) in your application. In most cases, you will need to
have access to a different **Entity** from some other **Entity**. What you would want to do is to expose the Services instead of the Models or the Repositories as
those have direct contracts with the Database. But for the purpose of this blog, I'll skip `BaseService`

Now that we have our Bases, let's create a **Feature Module**

```bash
nest generate module product
nest generate service product --no-spec
nest generate controller product --no-spec

touch src/product/product.model.ts
```

Rename `product.service.ts` and `ProductService` to `product.repository.ts` and `ProductRepository`. Then, open `product.model.ts`

###### **product.model.ts**

```ts
import { prop } from '@typegoose/typegoose';
import { BaseModel } from '../shared/base.model';
import { useMongoosePlugin } from '../shared/decorators/use-mongoose-plugins.decorator';

@useMongoosePlugin()
export class Product extends BaseModel {
  @prop()
  name: string;
  @prop()
  description: string;
  @prop()
  price: number;
}
```

Our `Product` model will extend `BaseModel` and will have the plugins applied by decorating with `@useMongoosePlugin()`. Next up is `product.module.ts`

###### **product.module.ts**

```ts
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Product } from './product.model';
import { ProductRepository } from './product.repository';
import { ProductController } from './product.controller';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  providers: [ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
```

The only thing that we do here is to provide `Product` model to our Mongo Connection using `TypegooseModule.forFeature()`. This is equivalent to calling `mongoose.model()`
Moving on, `product.repository.ts` is next:

###### **product.repository.ts**

```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { BaseRepository, ModelType } from '../shared/base.repository';
import { Product } from './product.model';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(@InjectModel(Product) private readonly productModel: ModelType<Product>) {
    super(productModel);
  }
}
```

We have our `ProductRepository` to extend `BaseRepository` and pass in `Product` as a type parameter to `BaseRepository`. This will ensure all methods to have the proper
return types. `@InjectModel(Product)` here will give the `Product` model instance that we did provide in `ProductModule`. And that's it, we can now start using `ProductRepository`.
So, open up `product.controller.ts`:

###### **product.controller.ts**

```ts
import { Controller, Get } from '@nestjs/common';
import { Product } from './product.model';
import { ProductRepository } from './product.repository';

@Controller('product')
export class ProductController {
  constructor(private readonly productRepository: ProductRepository) {}

  @Get()
  async get(): Promise<Product[]> {
    return await this.productRepository.findAll().exec();
  }
}
```

Inject `ProductRepository` and we can now use all the Mongoose methods that we wrapped in `BaseRepository`. Again, note that if this is a real application, you'd be injecting `ProductService`
instead. Even though this is a really minimal example but I hope it shows you how to utilize TypeScript and Typegoose to abstract some base to speed up your development processes.
Moreover, you can even have a `BaseController` that will have a `protected baseService` that will cover your basic CRUD functionalities. That’s it for me today, guys. Have fun and good luck 🍀
