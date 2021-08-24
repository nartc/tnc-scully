---
title: NgRx Slice
description: Introduction to ngrx-slice, a plugin that provides the same functionalities as Redux Toolkit createSlice to NgRx consumers
publishedAt: 2021-08-10
updatedAt: 2021-08-11
published: true
slug: 'ngrx-slice'
tags: ['Angular', 'NgRx']
authors: ['Chau Tran']
---

In this blog post, I want to introduce my latest open source project [`ngrx-slice`](https://github.com/nartc/ngrx-slice).

## TLDR

- `ngrx-slice` provides the same functionalities as Redux Toolkit `createSlice` provides
- The goal is to reduce NgRx boilerplate, at least for simple feature states.

Run the following command to install:

```bash
npm install ngrx-slice ngrx-immer immer
```

- Consult [documentations](https://ngrx-slice.netlify.app) for usage details.
- Github repo available at [ngrx-slice](https://github.com/nartc/ngrx-slice)

## What is `ngrx-slice`?

`ngrx-slice` is a [NgRx](https://ngrx.io) plugin that provides almost the same functionalities that [Redux Toolkit createSlice](https://redux-toolkit.js.org/api/createSlice) provides.

At this point, some of you might then ask "Hm... Chau, so what is `createSlice` then?" `createSlice` is dubbed, by [Mark Erikson](https://twitter.com/acemarke) aka the author, as the _modern_ way of implementing [Redux](https://redux.js.org/) in your JavaScript application, especially in [ReactJS](https://reactjs.org/). The idea is to group most, if not all, Redux related building blocks into a _single slice of the global state_. A _slice_ has multiple layers which _kind of_ represent multiple building blocks of a piece of State: Actions, Reducers, and Selectors.

Let's take a look at the following Counter example in vanilla Redux:

```js
// Actions
const increment = { type: 'increment' };
const decrement = { type: 'decrement' };

// reducers
const initialState = {
  value: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, value: state.value + 1 };
    case 'decrement':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// selectors
const selectValue = (state) => state.counter.value;
```

> Note that Actions, Reducers, and Selectors can be (and most of the time recommended) separated out into different files. So you might have: `counter/actions.js`, `counter/reducer.js`, and `counter/selectors.js`

Now let's look at the same example with `createSlice` API:

```ts
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value++;
    },
    decrement: (state) => {
      state.value--;
    },
  },
});

export default counterSlice.reducer;
export const { increment, decrement } = counterSlice.actions;

export const selectValue = (state) => state.counter.value;
```

> To learn more about this `createSlice` API, please refer to [Redux Toolkit createSlice](https://redux-toolkit.js.org/api/createSlice)

You can already notice the amount of code is much less in `createSlice` version with Actions being generated from the Reducers. Coupled with [Immer](https://immerjs.github.io/immer/) for simpler state updates, the boilerplate becomes manageable.

`ngrx-slice` embraces this same idea, but for NgRx

## Why?

The main goal of `ngrx-slice` is an attempt to reduce the amount of boilerplate of NgRx, at least for _simpler_ features. A by-product goal of `ngrx-slice` is to ease the learning curve to NgRx for React developers who now work with [Angular](https://angular.io) and NgRx.

Imagine having the ability to reduce the following code (Counter example with NgRx):

###### **counter.actions.ts**

```ts
export const increment = creaeteAction('[Counter] Increment');
export const decrement = createAction('[Counter] Decrement');
// putting in some effect just to make a point
export const multiplyBy = createAction('[Counter] Multiply By', prop<{ multiplier: number }>());
export const multiplyBySuccess = createAction(
  '[Counter] Multiply By Success',
  prop<{ value: number }>(),
);
```

###### **counter.reducer.ts**

```ts
export interface CounterState {
  value: number;
  incrementCount: number;
  decrementCount: number;
}

export const initialState: CounterState = {
  value: 0,
  incrementCount: 0,
  decrementCount: 0,
};

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => ({
    ...state,
    value: state.value + 1,
    incrementCount: state.incrementCount + 1,
  })),
  on(decrement, (state) => ({
    ...state,
    value: state.value - 1,
    decrementCount: state.decrementCount + 1,
  })),
  on(multiplyBySuccess, (state, { value }) => ({ ...state, value })),
);
```

###### **counter.selectors.ts**

```ts
export const selectCounter = createFeatureSelector<CounterState>('counter');
export const selectValue = createSelector(selectCounter, (state) => state.value);
export const selectIncrementCount = createSelector(
  selectorCounter,
  (state) => state.incrementCount,
);
export const selectDecrementCount = createSelector(
  selectorCounter,
  (state) => state.decrementCount,
);
```

The following effect is included for completeness. `ngrx-slice` does not affect how you write your Effects.

###### **counter.effect.ts**

```ts
@Injectable()
export class CounterEffects {
  constructor(private store: Store, private actions$: Actions) {}

  readonly multiplyBy = createEffect(() =>
    this.actions$.pipe(
      ofType(multiplyBy),
      concatLatestFrom(() => this.store.select(selectValue)),
      // switchMap to a mock side-effect (timer)
      switchMap(([{ multiplier }, currentValue]) =>
        // delay 1s to simulate async task
        timer(1000).pipe(map(() => multiplyBySuccess({ value: currentValue * multiplier }))),
      ),
    ),
  );
}
```

The above snippets are pretty _standard_ in NgRx world. Most of the time, you will have all of those files for each of your feature states. And to be honest, it does feel a bit overwhelming, especially for NgRx beginners. Let's explore how `ngrx-slice` can help with this.

## How?

#### Installation

Like most things JavaScript/TypeScript, we start with installing `ngrx-slice`

```bash
npm install ngrx-slice ngrx-immer immer
```

> `ngrx-slice` depends on `ngrx-immer` and `immer` to allow for simpler state updates, just like `createSlice`

#### Implementing the Slice

Instead of the 3 different files for Actions, Reducers, and Selectors, you'd have a Slice file.

###### **counter.slice.ts**

```ts
export interface CounterState {
  value: number;
  incrementCount: number;
  decrementCount: number;
}

export const initialState: CounterState = {
  value: 0,
  incrementCount: 0,
  decrementCount: 0,
};

export const {
  selectors: CounterSelectors,
  actions: CounterActions,
  ...CounterFeature
} = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
      state.incrementCount++;
    },
    decrement: (state) => {
      state.value--;
      state.decrementCount++;
    },
    multiplyBy: {
      trigger: noopReducer<CounterState, { multiplier: number }>(),
      success: (state, { value }: PayloadAction<{ value: number }>) => {
        state.value = value;
      },
    },
  },
});
```

> `createSlice`, `noopReducer()`, and `PayloadAction` are imported from `ngrx-slice`

That's all. Just like Redux Toolkit's `createSlice`, `ngrx-slice` accepts a `SliceOptions` object and returns the Reducer, generated Actions, and **in addition** the Selectors. For more detailed explanation, please check out [ngrx-slice Documentations](https://ngrx-slice.netlify.app)

#### Using the Slice

The return value of `createSlice` is an object with the shape `{ actions, selectors, name, reducer }`. With destructuring, `CounterFeature` here is actually an object of `{ name, reducer }`, which is compatible with `StoreModule.forFeature()`

###### **counter.module.ts**

```ts
@NgModule({
  imports: [
    /* ... */
    // before: StoreModule.forFeature({ name: 'counter', reducer: counterReducer })
    StoreModule.forFeature(CounterFeature),
    EffectsModule.forFeature([CounterEffect]),
    /* ... */
  ],
  declarations: [CounterComponent],
})
export class CounterModule {}
```

`CounterSelectors` and `CounterActions` are just namespacing the generated Actions and Selectors. With this, `counter.effect.ts` can be modified like so:

###### **counter.effect.ts**

```ts
@Injectable()
export class CounterEffects {
  constructor(private store: Store, private actions$: Actions) {}

  readonly multiplyBy = createEffect(() =>
    this.actions$.pipe(
      // using multiplyBy.trigger
      ofType(CounterActions.multiplyBy.trigger),
      concatLatestFrom(() => this.store.select(CounterSelectors.selectValue)),
      // switchMap to a mock side-effect (timer)
      switchMap(([{ multiplier }, currentValue]) =>
        // delay 1s to simulate async task
        timer(1000).pipe(
          // return multiplyBy.success action
          map(() => CounterActions.multiplyBy.success({ value: currentValue * multiplier })),
        ),
      ),
    ),
  );
}
```

You can see that for simple features like a Counter, all the logic are handled in a single `counter.slice.ts` and every building blocks are generated thanks to TypeScript.

## Miscellaneous

Of course, there will be cases where more complex features do not benefit as much from `ngrx-slice` but it does not mean you cannot use `ngrx-slice` for those. The returned `selectors` and `actions` are just abstractions using `createSelector` and `createAction` under the hood. Hence, you can use/compose those like normal NgRx Selectors.

Entity is something tricky when used with `ngrx-slice`. Supposedly, [ngrx/entity](https://ngrx.io/guide/entity) helps with providing utilities to _immutably_ update list data. With `ngrx-slice`, you can update your list/array _mutably_ with Immer. For example:

```ts
// adding a new item to a list

// immutable way
[...state.items, newItem];

// ngrx/entity
entity.addOne(newItem, state);

// ngrx-slice
state.items.push(newItem);
```

That is all. Go ahead and give `ngrx-slice` a try. Feel free to reach out to me on Twitter [@Nartc1410](https://twitter.com/Nartc1410) if you have any questions or just want to chat, I'd love to hear from you. If you run into any issues, please feel free to open an issue on [ngrx-slice Github](https://github.com/nartc/ngrx-slice). Thank you for reading.

## Special Mentions

- Marko Stanimirović ([@MarkoStDev](https://twitter.com/MarkoStDev)) for `ngrx-child-selectors` and his `createFeature` PR
- Tim Deschryver ([@tim_deschryver](https://twitter.com/tim_deschryver)) for `ngrx-immer`
- Mark Erikson ([@acemarke](https://twitter.com/acemarke)) for Redux Toolkit
