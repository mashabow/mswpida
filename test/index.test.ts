import aspida from '@aspida/fetch';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { HttpResponse } from 'msw';
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

  describe('作成された `typedRest` が正しく動く', () => {
    const defaultBaseURL = 'http://petstore.swagger.io/api'; // Pet Store API のデフォルトの base URL
    const customBaseURL = 'https://custom-base-url.example.com/v1';

    describe('エンドポイントのパスを `.$path()` で取得できる', () => {
      test('パスパラメータを含まない場合は、具体的なパスをそのまま返す', () => {
        const typedRest = createTypedRest(petStoreApi);
        expect(typedRest.pets.$path()).toEqual(`${defaultBaseURL}/pets`);
      });

      test('パスパラメータ部分は `:foo` 形式で表現される', () => {
        const typedRest = createTypedRest(petStoreApi);
        expect(typedRest.pets._id.$path()).toEqual(
          `${defaultBaseURL}/pets/:id`,
        );
      });

      test('`createTypedRest` で `baseURL` オプションを指定した場合、それがベース URL として使われる', () => {
        const typedRest = createTypedRest(petStoreApi, {
          baseURL: customBaseURL,
        });
        expect(typedRest.pets._id.$path()).toEqual(`${customBaseURL}/pets/:id`);
      });
    });

    describe('request handler を `.$get()` などで作成できる', () => {
      const server = setupServer();
      beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
      afterEach(() => server.resetHandlers());
      afterAll(() => server.close());

      test('作成した request handler が正しく動く', async () => {
        const typedRest = createTypedRest(petStoreApi);
        server.use(
          typedRest.pets._id.$get(({ params }) => {
            const petId = params.id;
            return HttpResponse.json({ id: Number(petId), name: 'Foo' });
          }),
        );

        const client = petStoreApi(aspida(fetch));
        const resBody = await client.pets._id(123).$get();

        expect(resBody).toEqual({ id: 123, name: 'Foo' });
      });

      test('aspida で指定された型以外のレスポンスボディを返したい場合は、型パラメータでそれを表現できる', async () => {
        const typedRest = createTypedRest(petStoreApi);
        type ErrorResponseBody = { errorCode: string };
        server.use(
          typedRest.pets._id.$get<ErrorResponseBody>(({ params }) => {
            const petId = params.id;
            if (petId === 'bad_id') {
              return HttpResponse.json(
                { errorCode: 'resource_not_found' },
                { status: 404 },
              );
            }
            return HttpResponse.json({ id: Number(petId), name: 'Foo' });
          }),
        );

        const client = petStoreApi(aspida(fetch));
        const resBody = await client.pets._id(123).$get();

        expect(resBody).toEqual({ id: 123, name: 'Foo' });
      });

      test('`createTypedRest` で `baseURL` オプションを指定した場合、それがベース URL として使われる', async () => {
        const typedRest = createTypedRest(petStoreApi, {
          baseURL: customBaseURL,
        });

        server.use(
          typedRest.pets._id.$get(({ params }) => {
            const petId = params.id;
            return HttpResponse.json({ id: Number(petId), name: 'Foo' });
          }),
        );

        const client = petStoreApi(aspida(fetch, { baseURL: customBaseURL }));
        const resBody = await client.pets._id(123).$get();
        expect(resBody).toEqual({ id: 123, name: 'Foo' });
      });
    });

    // TODO: 型のテストを追加する
  });
});
