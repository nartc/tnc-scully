---
title: Type-safe MatCellDef
description: In this blog post, we will explore how we could provide strong-types for Template Variable in the MatCellDef
date: '2021-03-19'
published: true
slug: 'typed-mat-cell-def'
tags: ['Angular', 'TypeScript']
---

[Angular Material](https://material.angular.io/) is probably the most popular UI Components Library in the [Angular](https://angular.io) ecosystem. Amongst the components that **Angular Material** provides, `MatTable` is one of the most used ones. It looks good, is feature-packed, and works with different types of `dataSource`.

### The Problem
Despite being a well-crafted component, `MatTable` runs into the same limitation as any other UI Library which is _`ng-template` does not have strong-typed for its template variable_. I am talking about this syntax here, which is pretty familiar with you if you're using `MatTable`

```html
<ng-template let-someVar></ng-template>
<!--someVar does not have any type information-->
```

To be able to provide top of the line customizations to its consumers, `MatTable` does have to leverage the **Dynamic Template** system of **Angular**. Here's a usage example of `MatTable`

```html
<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

  <!--- Note that these columns can be defined in any order.
        The actual rendered columns are set as a property on the row definition" -->

  <!-- Position Column -->
  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef> No. </th>
    <td mat-cell *matCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <!-- Name Column -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef> Name </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="weight">
    <th mat-header-cell *matHeaderCellDef> Weight </th>
    <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="symbol">
    <th mat-header-cell *matHeaderCellDef> Symbol </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

> The above snippet is extracted straight from [MatTable Documentations](https://material.angular.io/components/table/overview)

These `<td mat-cell *matCellDef="let element"></td>` are horrible. It brings the Developer Experience down greatly because `element` has no type information whatsoever. Additionally, this is also one of the features that have been asked multiple times on **Angular** repository
- [https://github.com/angular/components/issues/22290](https://github.com/angular/components/issues/22290)
- [https://github.com/angular/components/issues/16273](https://github.com/angular/components/issues/16273)
- [https://github.com/angular/angular/issues/28731](https://github.com/angular/angular/issues/28731)

While the **Angular** team does _want_ to provide this enhancement, the technical limitation seems to stem from how the **Angular Compiler** works, so it is a little low-level and will pose a great challenge for either the team, or the community to contribute.

So, as developers, what can we do in this case? Well, there is a workaround that you can leverage to improve your team's DX if you're using **Angular Material**, specifically `MatTable`, in your applications. That is the power called `Directive`.

### The Solution

Before we get to the actual solution, we need to analyze what we know and what we need to do first:
- `dataSource` is the piece of data that is going to provide the type for `element`
- `matCellDef` cannot infer the type of its parent's input. There is no way for `matCellDef` to be like "Ok, for this template variable, I actually want to use the type of this Input from my parent".
- `matCellDef` is the selector of `MatCellDef` directive and is a **Structural Directive**, which means there is some _syntactic-sugar_  that we can leverage.

The above are the things that we can analyze from the consumers' usage of `MatTable`. Besides these points, there is one more thing that we need to know. In **Angular** low-level area (Compiler, Language Service etc...), there are a couple of **static** flags that we can use to accommodate the **Language Service** like `ngAcceptInputType`, or `ngTemplateContextGuard`. The latter is the one we will leverage.

With those in mind, let's get started with creating a **Custom Directive** that effectively monkey-patches the `MatCellDef`

###### **type-safe-mat-cell-def.directive.ts**
```ts
import { CdkCellDef } from '@angular/cdk/table';
import { Directive, Input } from '@angular/core';
import { MatCellDef, MatTableDataSource } from "@angular/material/table";
import { Observable } from 'rxjs';

@Directive({
  selector: '[matCellDef]', // same selector as MatCellDef
  providers: [{ provide: CdkCellDef, useExisting: TypeSafeMatCellDef }],
})
export class TypeSafeMatCellDef<T> extends MatCellDef {
  // leveraging syntactic-sugar syntax when we use *matCellDef  
  @Input() matCellDefDataSource: T[] | Observable<T[]> | MatTableDataSource<T>;

  // ngTemplateContextGuard flag to help with the Language Service
  static ngTemplateContextGuard<T>(
    dir: TypeSafeMatCellDef<T>,
    ctx: unknown,
  ): ctx is { $implicit: T; index: number } {
    return true;
  }
}
```

Let's walk over each piece in this **Directive**

#### The Setup

- We make `TypeSafeMatCellDef` to accept a type parameter `<T>`.
- `selector: '[matCellDef]'` We use the same `selector` as `MatCellDef`. This is our _monkey-patch_
- `{ provide: CdkCellDef, useExisting: TypeSafeMatCellDef }` Under the hood, `MatTable` is leveraging **Angular CDK Table** and is providing `MatCellDef` for `CdkCellDef` token. Here, we provide our own `TypeSafeMatCellDef` for that same token so `MatTable` continues to work as expected.
- `extends MatCellDef` We want our **Directive** to inherit the behavior of `MatCellDef`

#### The Patch

- `@Input() matCellDefDataSource: T[] | Observable<T[]> | MatTableDataSource<T>;` Although we do make our **Directive** to accept a type parameter `<T>`, we will never actually provide the type for the **Directive** directly since the instantiation of directives (or most building blocks in **Angular**) is **Angular** responsibility. This `Input` acts purely as a way for us to pass in the type information. Another thing to note here is that the name of the `@Input()`, we leverage another hidden-feature of **Angular**.
  - If we name the Inputs of a **Structure Directive** prefixed with the selector, we can use the short-hand syntax when we use this **Directive**
  ```ts
  <div *ngFor="let item of list;trackBy: trackByFn"></div>
  ```
  - `trackBy` here is actually `@Input() ngForOfTrackBy`
- `ngTemplateContextGuard` is a [TypeScript Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards). Here, we essentially say "ctx is of this type. Trust me TypeScript"

All that is left to do is to declare our `TypeSafeMatCellDef` directive.

![before](https://i.imgur.com/oIzkuT2.png)
_Before: `element` is of type `any`_

![after](https://i.imgur.com/1ga8tiV.png)
_After: `element` is of type `PeriodicElement` which is the type of our `dataSource`_

You can check out the **Stackblitz** below. However, it is hard to see the difference because of **Stackblitz**. You can try accessing an arbitrary property on `element` like `element.fooBar`, and you'll see that the **Compiler** will fail to compile because `fooBar is not a property of PeriodicElement`.
<iframe src="https://stackblitz.com/edit/angular-material-typesafe-matcelldef?ctl=1&embed=1&file=src/app/table-basic-example.html
"></iframe>

### Conclusion

Strongly-typed data is essential for a good and healthy Developer Experience. This has been proven by the risen popularity of **TypeScript** over the past couple of years. Although this solution works pretty well with not much custom code, I'm still looking forward to a more official solution from the **Angular Team**, and I am sure I'm not alone. Have fun and good luck 👋

Special thanks to [@beeman_nl](https://twitter.com/beeman_nl?s=20) and [@jefiozie](https://twitter.com/jefiozie) for proof-reading this blog post.
