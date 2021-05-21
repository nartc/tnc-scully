---
title: Internalize API Request Status with RxJS 
description: Utilizing RxJS operators, we can come up with a robust approach to handle API request states.
publishedAt: 2020-11-24
updatedAt: 2020-11-24
published: true
slug: 'internalize-request-status-rxjs'
tags: ['Angular', 'RxJS']
authors: ['Chau Tran']
---

Most of the times, front-end developers need to display a `loading` interface while an API request is `pending` (aka
 `loading`). Depending on the current project's **State Management** strategy that developers are using for their
  projects, there are different approaches to keep track of this `loading` state: a `loading` field on the Component
  , a `loading` state in the Store etc... What these approaches have in common is that the `loading` state is kept
   externally from the **API Request** itself.

Internalizing `loading` state into the **API Request** can allow for an incremental UI which means to display blocks of UI
 for a specific page incrementally as the **API Request** for that block is **completed**. With RxJS, this task is
  trivial, and type-safe.
  
<iframe src="https://stackblitz.com/edit/rxjs-to-api-response-operator?ctl=1&embed=1&file=index.ts&hideExplorer=1&view=preview"></iframe>

###### **to-api-response.ts**
```ts
/**
 * Arbitrary states of an API request
 */
export enum ApiResponseStatus {
  Loading = "loading",
  Success = "success",
  Failure = "failure"
}

export interface ApiResponse<TData> {
  data: TData;
  status: ApiResponseStatus;
  error: unknown;
}

/**
 * A transformation operation to transform Observable<TData> to Observable<ApiResponse<TData>>
 *
 * - startsWith() to kick-off an emission with the `initialValue` and the status of `loading`.
 * - map() to map the actual data from the API and switch status to `success`
 * - catchError() to handle error cases with errObsFactoryOrRethrow
 *   - Just rethrow the error without transforming: pass in true
 *
 *
 * \`\`\`ts
 * timer(5000).pipe(mapTo('response'), toApiResponse(''));
 * --> {status: 'loading', data: '', error: ''}
 * --> 5 seconds
 * --> {status: 'success', data: 'response', error: ''}
 * \`\`\`
 */
export function toApiResponse<TData>(
  initialValue: TData extends object ? Partial<TData> : TData,
  errObsFactoryOrRethrow?:
    | true
    | ((err: unknown) => unknown | Observable<unknown>)
): UnaryFunction<Observable<TData>, Observable<ApiResponse<TData>>> {
  return pipe(
    map<TData, ApiResponse<TData>>(data => ({
      status: ApiResponseStatus.Success,
      data,
      error: ""
    })),
    startWith({
      status: ApiResponseStatus.Loading,
      data: initialValue as TData,
      error: ""
    }),
    catchError(err => {
      const defaultFailureResponse = {
        status: ApiResponseStatus.Failure,
        data: initialValue as TData
      };

      if (errObsFactoryOrRethrow == null) {
        return of<ApiResponse<TData>>({
          ...defaultFailureResponse,
          error: err.message || err.error || err.toString()
        });
      }

      if (typeof errObsFactoryOrRethrow === "function") {
        const error = errObsFactoryOrRethrow(err);
        if (isObservable(error)) {
          return error.pipe(
            map<unknown, ApiResponse<TData>>(e => ({
              ...defaultFailureResponse,
              error: e
            }))
          );
        }

        return of<ApiResponse<TData>>({
          ...defaultFailureResponse,
          error
        });
      }

      return throwError(err);
    })
  );
}
```    
