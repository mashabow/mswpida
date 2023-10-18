import { describe, expect, test } from 'vitest';
import { createMock } from './index.js';
import { AspidaApi } from './type.js';

describe('createMock', () => {
  const baseURL = 'https://base-url.example.com/v1';

  test('空のAPI', () => {
    const api = (() => ({})) satisfies AspidaApi;
    const mock = createMock(api, baseURL);
    expect(mock).toEqual({});
  });

  describe('エンドポイントのパスを $path() で取得できる', () => {
    test('パスパラメータを含まない場合', () => {
      const api = (({ baseURL: _baseURL }) => ({
        $get: () => Promise.resolve(''),
        $path: () => `${_baseURL}/`,
        foo: {
          $get: () => Promise.resolve(''),
          $path: () => `${_baseURL}/foo`,
          bar: {
            $get: () => Promise.resolve(''),
            $path: () => `${_baseURL}/foo/bar`,
          },
        },
        hoge: {
          // hoge にはエンドポイントがない
          piyo: {
            $get: () => Promise.resolve(''),
            $path: () => `${_baseURL}/hoge/piyo`,
          },
        },
      })) satisfies AspidaApi;
      const mock = createMock(api, baseURL);

      expect(mock.$path()).toEqual(`${baseURL}/`);
      expect(mock.foo.$path()).toEqual(`${baseURL}/foo`);
      expect(mock.foo.bar.$path()).toEqual(`${baseURL}/foo/bar`);
      expect(mock.hoge.piyo.$path()).toEqual(`${baseURL}/hoge/piyo`);

      // hoge にはエンドポイントがないので、$path は存在しない
      expect(mock.hoge).not.toHaveProperty('$path');
    });

    test('パスパラメータを含む場合', () => {
      const api = (({ baseURL: _baseURL }) => ({
        items: {
          _itemId: (itemId: string) => ({
            $get: () => Promise.resolve(''),
            $path: () => `${_baseURL}/items/${itemId}`,
            variants: {
              $get: () => Promise.resolve(''),
              $path: () => `${_baseURL}/items/${itemId}/variants`,
              _variantId: (variantId: number) => ({
                $get: () => Promise.resolve(''),
                $path: () =>
                  `${_baseURL}/items/${itemId}/variants/${variantId}`,
              }),
            },
          }),
        },
      })) satisfies AspidaApi;
      const mock = createMock(api, baseURL);

      expect(mock.items._itemId().$path()).toEqual(`${baseURL}/items/:itemId`);
      expect(mock.items._itemId().variants.$path()).toEqual(
        `${baseURL}/items/:itemId/variants`,
      );
      expect(mock.items._itemId().variants._variantId().$path()).toEqual(
        `${baseURL}/items/:itemId/variants/:variantId`,
      );
    });
  });
});
