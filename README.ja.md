# mswpida

MSW を型安全に使うための、aspida ユーザー向けのラッパー

- Simple.
- Type safe.
- Aspida-like interface.

## インストール

```console
npm install mswpida --save-dev
```

## 使い方

```ts
import { createTypedRest } from 'mswpida';
import api from './awesome/store/$api';

// 1. aspida で生成した `api` 関数から `typedRest` を作る
const typedRest = createTypedRest(api);

// 2. `typedRest` を使って MSW の request handler を書く
const handlers = [
  typedRest.products._productId.images.$post((req, res, ctx) => {
    console.log(`Add an image to product ${req.params.productId}`); // パスパラメータに型がついている ✅
    const newImage = req.body; // リクエストボディに型がついている ✅
    return res(
      ctx.status(201),
      ctx.json({ id: 123, ...newImage }), // レスポンスボディにも型がついている ✅
    );
  }),
  // ...
];

// 3. 以降は通常の MSW の使い方と同様
import { setupWorker } from 'msw'; // or `setupServer`

await setupWorker(...handlers).start();
```

### `createTypedRest(api, options?)`

aspida で生成した `api` 関数を元にして、`typedRest` というオブジェクトを作成します。この `typedRest` は、MSW の [request handler](https://v1.mswjs.io/docs/basics/request-handler) を書くためのラッパーです。

#### オプション

- `baseURL` (optional): API のベース URL を指定します。aspida の `baseURL` オプションと同様です。

```ts
createTypedRest(api, { baseURL: 'https://staging.example.com' });
```

### `typedRest`

MSW の [request handler](https://v1.mswjs.io/docs/basics/request-handler) を書くためのオブジェクトで、実態としては MSW の [`rest`](https://v1.mswjs.io/docs/api/rest) の薄いラッパーです。[`rest`](https://v1.mswjs.io/docs/api/rest) とほぼ同じ使い方ですが、パスやメソッドは aspida のような形式で表現します。

```ts
const handler = typedRest.products._productId.images.$post((req, res, ctx) => ...);

// これは以下と同等
const handler = rest.post('https://example.com/products/:productId/images', (req, res, ctx) => ...);
```

#### パス

プロパティでパスを表現します。パスパラメータ部分は、aspida においては `._productId('abc123')` のような関数呼び出しで表現されますが、`typedRest` では単なるプロパティ `._productId` で表現することに注意してください。

`.$path()` を使うと、そのエンドポイントのパスを文字列として取得できます。

```ts
const path = typedRest.products._productId.images.$path();
// -> 'https://example.com/products/:productId/images'
```

#### メソッド

`.$get(resolver)` や `.$post(resolver)` など、HTTP メソッドに `$` を付けた関数で表現します。引数は MSW の [response resolver](https://v1.mswjs.io/docs/basics/response-resolver) ですが、aspida の `api` から導出した具体的な型が以下の3つについているため、型注釈を書く必要はありません。

- パスパラメータ `req.params`
  - MSW の仕様上、値の型は常に `string` になります。
- リクエストボディ `req.body`
  - ただし `await req.json()` の方には型はつかず、常に `any` になります（[参考](https://github.com/mswjs/msw/issues/1318#issuecomment-1205149710)）。
- レスポンスボディ `res(ctx.json())`

```ts
const handler = typedRest.products._productId.images.$post((req, res, ctx) => {
  console.log(`Add an image to product ${req.params.productId}`); // パスパラメータに型がついている ✅
  const newImage = req.body; // リクエストボディに型がついている ✅
  return res(
    ctx.status(201),
    ctx.json({ id: 123, ...newImage }), // レスポンスボディにも型がついている ✅
  );
});
```

## ライセンス

MIT
