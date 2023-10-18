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
    test('ルート', () => {
      const api = (({ baseURL: _baseURL }) => ({
        $get: () => Promise.resolve(''),
        $path: () => `${_baseURL}/`,
      })) satisfies AspidaApi;
      const mock = createMock(api, baseURL);
      expect(mock.$path()).toEqual(`${baseURL}/`);
    });
  });
});
