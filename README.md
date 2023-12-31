# mswpida [![npm version](https://img.shields.io/npm/v/mswpida.svg)](https://www.npmjs.com/package/mswpida)

A wrapper to use MSW in a type-safe manner for aspida users.

- Simple.
- Type safe.
- Aspida-like interface.

[English](./README.md) / [日本語](./README.ja.md)

## Installation

```console
npm install mswpida --save-dev
```

## Usage

```ts
import { createTypedRest } from 'mswpida';
import api from './awesome/store/$api';

// 1. Create `typedRest` from the `api` function generated by aspida.
const typedRest = createTypedRest(api);

// 2. Write MSW's request handler using `typedRest`.
const handlers = [
  typedRest.products._productId.images.$post((req, res, ctx) => {
    console.log(`Add an image to product ${req.params.productId}`); // Path parameter is typed ✅
    console.log(`Image description: ${req.body.description}`); // Request body is typed ✅
    return res(
      ctx.status(201),
      ctx.json({ id: 123, ...req.body }), // Response body is also typed ✅
    );
  }),
  // ...
];

// 3. Subsequent usage is the same as the regular MSW usage.
import { setupWorker } from 'msw'; // or `setupServer`

await setupWorker(...handlers).start();
```

### `createTypedRest(api, options?)`

Creates a `typedRest` object based on the `api` function generated by aspida. This `typedRest` is a wrapper to write MSW's [request handler](https://v1.mswjs.io/docs/basics/request-handler).

#### Options

- `baseURL` (optional): Specifies the base URL for the API. Works the same as aspida's `baseURL` option.

```ts
createTypedRest(api, { baseURL: 'https://staging.example.com' });
```

### `typedRest`

An object for writing MSW's [request handler](https://v1.mswjs.io/docs/basics/request-handler). Essentially, it is a thin wrapper for MSW's [`rest`](https://v1.mswjs.io/docs/api/rest). The usage is almost identical to [`rest`](https://v1.mswjs.io/docs/api/rest), but paths and methods are expressed in an aspida-like format.

```ts
const handler = typedRest.products._productId.images.$post((req, res, ctx) => ...);

// This is equivalent to:
const handler = rest.post('https://example.com/products/:productId/images', (req, res, ctx) => ...);
```

#### Path

Paths are expressed as properties. While path parameters are expressed with function calls like `._productId('abc123')` in aspida, note that in `typedRest`, they are simply expressed as properties like `._productId`.

Use `.$path()` to get the path of that endpoint as a string.

```ts
const path = typedRest.products._productId.images.$path();
// -> 'https://example.com/products/:productId/images'
```

#### Method

Expressed as the `$`-prefixed HTTP method function, like `.$get(resolver)` or `.$post(resolver)`. The argument is MSW's [response resolver](https://v1.mswjs.io/docs/basics/response-resolver). The following three are typed from aspida's `api`, so no type annotations are required:

- Path parameters `req.params`
  - As per MSW's behavior, the type of value is always `string`.
- Request body `req.body`
  - Note that for `await req.json()`, [the type is always `any`](https://github.com/mswjs/msw/issues/1318#issuecomment-1205149710).
- Response body `res(ctx.json())`

```ts
const handler = typedRest.products._productId.images.$post((req, res, ctx) => {
  console.log(`Add an image to product ${req.params.productId}`); // Path parameter is typed ✅
  console.log(`Image description: ${req.body.description}`); // Request body is typed ✅
  return res(
    ctx.status(201),
    ctx.json({ id: 123, ...req.body }), // Response body is also typed ✅
  );
});
```

## FAQ

### Is it compatible with MSW 2.x?

Not yet, but [it's planned](https://github.com/mashabow/mswpida/issues/13).

### How can I return an error response without getting a type error?

By using method with a type parameter like `.$get<T>()` or `.$post<T>()`, you can return `T` as the response body without getting a type error.

```ts
type ErrorResponseBody = { errorCode: string };

const handler = typedRest.products._productId.images.$post<ErrorResponseBody>(
  (req, res, ctx) => {
    if (req.params.productId === 'bad_id') {
      return res(ctx.status(404), ctx.json({ errorCode: 'product_not_found' }));
    }
    return res(ctx.status(201), ctx.json({ id: 123, ...req.body }));
  },
);
```

## License

MIT
