---
title: How to generate Generics DTOs with nestjs/swagger
description: nestjs/swagger provides consumers with enough tools to generate proper OpenAPI specs for Generics. Although, it is not straight-forward, yet it is possible.
date: '2020-07-14'
published: true
slug: 'nestjs-swagger-generics'
tags: ['NestJS']
---

One of the most requested/asked question in [NestJS Discord Server](https://discord.gg/5SKeMhX) for `nestjs/swagger` is probably `"How can I provide the proper specification for Generics DTOs?"`.

A little of context, here's an example of such `DTO`:

```ts
export class PaginatedDto<TData> {
  total: number;
  limit: number;
  offset: number;
  results: TData[];
}
```

Now, to provide `SwaggerUI` a response type, we'd do the following:

###### **user.controller.ts**

```ts
@Controller('users')
export class UserController {
  @Get()
  @ApiOkResponse({ type: UserDto, isArray: true })
  async get(): Promise<UserDto[]> {}
}
```

For the above `get()` endpoint, `ApiOkResponse` will be able to extract information of `UserDto` class properties to generate the correct **OpenAPI Schema Definition** as the endpoint's response. Now, let's imagine instead of `UserDto`, you'd have `PaginatedDto<UserDto>`. In turns, `ApiOkResponse` **will not** be able to extract anything from `<UserDto>`. The way `nestjs/swagger` works is based on **TypeScript** reflection capabilities, and most of us probably know that **TypeScript** reflection **does not** work on **Generics**.
<br><br>
Fortunately for us, `nestjs/swagger` does provide tools for consumers to be able to make our own **OpenAPI Schema Definition** by writing **Raw Definition**. Let's start by decorating the non-generics properties in `PaginatedDto`:

###### **paginated.dto.ts**

```ts
export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  offset: number;
  results: TData[];
}
```

We skip `results` because we will be providing the **Raw Definition** for it later. Now, let's assume our `UserDto` looks like the following:

###### **user.dto.ts**

```ts
export class UserDto {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
}
```

Finally, let's go back to our `UserController`

###### **user.controller.ts**

```ts
@Controller('users')
@ApiExtraModels(PaginatedDto, UserDto)
export class UserController {
  @Get()
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(UserDto) },
            },
          },
        },
      ],
    },
  })
  async get(): Promise<PaginatedDto<UserDto>> {}
}
```

A couple of things happen here:

- `ApiExtraModels` is the way we provide `PaginatedDto` and `UserDto` for `nestjs/swagger` to generate and construct the **OpenAPI Schema** for both of those because those will not be **scanned** by `nestjs/swagger`. If you have a place where you can use `ApiExtraModels` on, do so for `PaginatedDto` because you only need to provide it once. For `UserDto`, more than likely you'd have another endpoint that uses `UserDto` so it would be **scanned** by `nestjs/swagger` already.
- `getSchemaPath()` returns the **OpenAPI Schema** path from within the **OpenAPI Spec File** that `ApiExtraModels` helps `nestjs/swagger` generates.
- `allOf` is a concept that **OpenAPI 3** has to cover **Inheritance** use-cases.
  <br><br>
  In this case, we tell **SwaggerUI** that this response will have **allOf** `PaginatedDto` and the `results` property will be of type `array` and each item will be of type `UserDto`. If you run the **SwaggerUI** now, you'd see the generated `swagger.json` for this specific endpoint like the following:

```json
responses": {
  "200": {
    "description": "",
    "content": {
      "application/json": {
        "schema": {
          "allOf": [
            {
              "$ref": "#/components/schemas/PaginatedDto"
            },
            {
              "properties": {
                "results": {
                  "$ref": "#/components/schemas/UserDto"
                }
              }
            }
          ]
        }
      }
    }
}
```

Now that we know it works, we can create a custom decorator for `PaginatedDto` as follow:

###### **api-paginated-dto.ts**

```ts
export const ApiPaginatedDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
```

now we can use it on our endpoint:

```ts
  @Get()
  @ApiPaginatedDto(UserDto)
  async get(): Promise<PaginatedDto<UserDto>> {}
```

and everything will still work as expected.
<br><br>
You can modify `ApiPaginatedDto` as you see fit, maybe make it more generics to handle non-array `results` or maybe different property name than `results`. Knowing the capabilities of `nestjs/swagger` APIs, you can totally go wild with it and make sure your **OpenAPI Spec** is correct and covered.
