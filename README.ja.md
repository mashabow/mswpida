# mswpida

MSW を型安全に使うための、aspida ユーザー向けのラッパー

- Simple
- Type safe
- Aspida-like interface

[English](./README.md) / [日本語](./README.ja.md)

## インストール

```console
npm install mswpida --save-dev
```

## 使い方

```ts
// 1. aspida で生成した `api` 関数から `typedHttp` を作る

import { createTypedHttp } from 'mswpida';
import api from './awesome/store/$api';

const typedHttp = createTypedHttp(api);

// 2. `typedHttp` を使って MSW の request handler を書く

import { HttpResponse } from 'msw';

const handlers = [
  typedHttp.products._productId.images.$post(({ request, params }) => {
    console.log(`Add an image to product ${params.productId}`); // パスパラメータに型がついている ✅

    const reqBody = await request.json();
    console.log(`Image description: ${reqBody.description}`); // リクエストボディに型がついている ✅

    return HttpResponse.json(
      { id: 123, ...reqBody }, // レスポンスボディにも型がついている ✅
      { status: 201 },
    );
  }),
  // ...
];

// 3. 以降は通常の MSW の使い方と同様

import { setupWorker } from 'msw/browser';
// or
// import { setupServer } from 'msw/node';

await setupWorker(...handlers).start();
```

### `createTypedHttp(api, options?)`

aspida で生成した `api` 関数を元にして、`typedHttp` というオブジェクトを作成します。この `typedHttp` は、MSW の [request handler](https://mswjs.io/docs/concepts/request-handler) を書くためのラッパーです。

#### オプション

- `baseURL` (optional): API のベース URL を指定します。aspida の `baseURL` オプションと同様です。

```ts
createTypedHttp(api, { baseURL: 'https://staging.example.com' });
```

### `typedHttp`

MSW の [request handler](https://mswjs.io/docs/concepts/request-handler) を書くためのオブジェクトで、実態としては MSW の [`http`](https://mswjs.io/docs/api/http) の薄いラッパーです。使い方は `http` とほぼ同じですが、パスやメソッドは aspida のような形式で表現します。

```ts
const handler = typedHttp.products._productId.images.$post(({ request, params }) => ...);

// これは以下と同等
const handler = http.post('https://example.com/products/:productId/images', ({ request, params }) => ...);
```

#### パス

プロパティでパスを表現します。パスパラメータ部分は、aspida においては `._productId('abc123')` のような関数呼び出しで表現されますが、`typedRest` では単なるプロパティ `._productId` で表現することに注意してください。

`.$path()` を使うと、そのエンドポイントのパスを文字列として取得できます。

```ts
const path = typedHttp.products._productId.images.$path();
// -> 'https://example.com/products/:productId/images'
```

#### メソッド

`.$get(resolver)` や `.$post(resolver)` など、HTTP メソッドに `$` を付けた関数で表現します。引数は MSW の [response resolver](https://mswjs.io/docs/concepts/response-resolver) ですが、aspida の `api` から導出した具体的な型が以下の3つについているため、型注釈を書く必要はありません。

- パスパラメータ：[`params`](https://mswjs.io/docs/network-behavior/rest#reading-path-parameters)
  - MSW の仕様上、値の型は常に `string` になります。
- リクエストボディ：[`await request.json()`](https://mswjs.io/docs/network-behavior/rest#reading-request-body)
- レスポンスボディ：[`HttpResponse.json()`](https://mswjs.io/docs/api/http-response#httpresponsejsonbody-init) の第1引数

```ts
const handler = typedHttp.products._productId.images.$post(
  ({ request, params }) => {
    console.log(`Add an image to product ${params.productId}`); // パスパラメータに型がついている ✅

    const reqBody = await request.json();
    console.log(`Image description: ${reqBody.description}`); // リクエストボディに型がついている ✅

    return HttpResponse.json(
      { id: 123, ...reqBody }, // レスポンスボディにも型がついている ✅
      { status: 201 },
    );
  },
);
```

## FAQ

### エラーレスポンスなど、正常系以外のレスポンスボディを返そうとすると型エラーになります。

`.$get<T>()` や `.$post<T>()` のようにして、メソッドに型パラメータをつけると、レスポンスボディとして `T` を返しても型エラーにならなくなります。

```ts
type ErrorResponseBody = { errorCode: string };

const handler = typedHttp.products._productId.images.$post<ErrorResponseBody>(
  ({ request, params }) => {
    if (params.productId === 'bad_id') {
      return HttpResponse.json(
        { errorCode: 'product_not_found' },
        { status: 404 },
      );
    }
    const reqBody = await request.json();
    return HttpResponse.json({ id: 123, ...reqBody }, { status: 201 });
  },
);
```

### MSW v1 と一緒に使えますか？

mswpida v1 を使ってください。

## ライセンス

MIT
