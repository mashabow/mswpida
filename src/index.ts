import { rest } from 'msw';
import { LowerHttpMethod } from 'aspida';
import { ApiStructure, AspidaApi, MockApi } from './type.js';

const $methods = [
  '$get',
  '$post',
  '$put',
  '$delete',
  '$head',
  '$patch',
  '$options',
] satisfies `$${LowerHttpMethod}`[];

function createMockFromApiStructure<T extends ApiStructure>(
  apiStructure: T,
): MockApi<T> {
  const keys = Object.keys(apiStructure) as (keyof T)[];

  return keys.reduce((acc, key) => {
    if (key === '$path') {
      return { ...acc, $path: apiStructure.$path };
    }

    if (apiStructure[key] instanceof Function) {
      // メソッド or パスパラメータ
      // TODO: メソッドのモックを作る or パスパラメータ以下のモックを再帰的に作る
      return acc;
    }

    // サブパスのモックを再帰的に作る
    return { ...acc, [key]: createMockFromApiStructure(apiStructure[key]) };
  }, {} as MockApi<T>);
}

export function createMock<T extends ApiStructure>(
  api: AspidaApi<T>,
  baseURL?: string,
): MockApi<T> {
  const apiStructure = api({
    baseURL,
    // @ts-expect-error 使わないので適当な関数を渡しておく
    fetch: () => 'dummy',
  });

  return createMockFromApiStructure(apiStructure);
}
