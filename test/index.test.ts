import { describe, expect, test } from 'vitest';
import { RestHandler } from 'msw';
import { createTypedRest } from '../src';
import { Api } from '../src/type';
import petStoreApi from './generated-api/$api';

describe('createTypedRest', () => {
  describe('API の構造に沿った `typedRest` が作成される', () => {
    test('openapi2aspida で生成した Pet Store API から、Pet Store API 用の `typedRest` が作成される', () => {
      const typedRest = createTypedRest(petStoreApi);
      expect(typedRest).toMatchInlineSnapshot(`
        {
          "pets": {
            "$get": [Function],
            "$path": [Function],
            "$post": [Function],
            "_id": {
              "$delete": [Function],
              "$get": [Function],
              "$path": [Function],
            },
          },
        }
      `);
    });

    test('空の API からは空の `typedRest` が作成される', () => {
      const emptyApi = (() => ({})) satisfies Api;
      const typedRest = createTypedRest(emptyApi);
      expect(typedRest).toEqual({});
    });
  });

  describe('エンドポイントのパスを `.$path()` で取得できる', () => {
    const defaultBaseURL = 'http://petstore.swagger.io/api'; // Pet Store API のデフォルトの base URL
    const customBaseURL = 'https://custom-base-url.example.com/v1';

    test('パスパラメータを含まない場合は、具体的なパスをそのまま返す', () => {
      const typedRest = createTypedRest(petStoreApi);
      expect(typedRest.pets.$path()).toEqual(`${defaultBaseURL}/pets`);
    });

    test('パスパラメータ部分は `:foo` 形式で表現される', () => {
      const typedRest = createTypedRest(petStoreApi);
      expect(typedRest.pets._id.$path()).toEqual(`${defaultBaseURL}/pets/:id`);
    });

    test('`createTypedRest` で `baseURL` オプションを指定した場合、それがベース URL として使われる', () => {
      const typedRest = createTypedRest(petStoreApi, {
        baseURL: customBaseURL,
      });
      expect(typedRest.pets._id.$path()).toEqual(`${customBaseURL}/pets/:id`);
    });
  });

  test('エンドポイントの request handler を $get() などで作成できる', () => {
    const api = (({ baseURL: _baseURL }) => ({
      items: {
        _itemId: (itemId: string) => ({
          $get: () => Promise.resolve({ foo: 'bar' }),
          $path: () => `${_baseURL}/items/${itemId}`,
          variants: {
            $get: () => Promise.resolve({ foo: 'bar' }),
            $path: () => `${_baseURL}/items/${itemId}/variants`,
            _variantId: (variantId: number) => ({
              $get: () => Promise.resolve({ foo: 'bar' }),
              $path: () => `${_baseURL}/items/${itemId}/variants/${variantId}`,
            }),
          },
        }),
      },
    })) satisfies Api;
    const typedRest = createTypedRest(api);
    const handler = typedRest.items._itemId.variants._variantId.$get(
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json({ foo: 'baz' })),
    );

    expect(handler).toBeInstanceOf(RestHandler);
  });

  test('`req.params` にパスパラメータの型がつく', () => {
    const api = (({ baseURL: _baseURL }) => ({
      items: {
        _itemId: (itemId: string) => ({
          $get: () => Promise.resolve({ foo: 'bar' }),
          $path: () => `${_baseURL}/items/${itemId}`,
          variants: {
            $get: () => Promise.resolve({ foo: 'bar' }),
            $path: () => `${_baseURL}/items/${itemId}/variants`,
            _variantId: (variantId: number) => ({
              $get: () => Promise.resolve({ foo: 'bar' }),
              $path: () => `${_baseURL}/items/${itemId}/variants/${variantId}`,
            }),
          },
        }),
      },
    })) satisfies Api;
    const typedRest = createTypedRest(api);
    const handler = typedRest.items._itemId.variants._variantId.$get(
      (req, res, ctx) => {
        const itemId = req.params.itemId satisfies string;
        const variantId = req.params.variantId satisfies string;
        return res(
          ctx.status(200),
          ctx.json({ foo: 'baz', itemId, variantId }),
        );
      },
    );

    expect(handler).toBeInstanceOf(RestHandler);
  });
});
