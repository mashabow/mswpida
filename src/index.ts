import { rest } from 'msw';
import { LowerHttpMethod } from 'aspida';
import { ApiStructure, AspidaApi, MockApi } from './type.js';

const METHODS = [
  'get',
  'post',
  'put',
  'delete',
  'head',
  'patch',
  'options',
] satisfies LowerHttpMethod[];
const $METHODS = [
  '$get',
  '$post',
  '$put',
  '$delete',
  '$head',
  '$patch',
  '$options',
] satisfies `$${LowerHttpMethod}`[];

function isMethod(key: string): key is LowerHttpMethod | `$${LowerHttpMethod}` {
  return (
    METHODS.includes(key as LowerHttpMethod) ||
    $METHODS.includes(key as `$${LowerHttpMethod}`)
  );
}

function createMockFromApiStructure<T extends ApiStructure>(
  apiStructure: T,
): MockApi<T> {
  return Object.entries(apiStructure).reduce((acc, [key, value]) => {
    if (value instanceof Function) {
      if (key === '$path') {
        return { ...acc, $path: value };
      }

      if (isMethod(key)) {
        // TODO: メソッドのモックを作る
        return acc;
      }

      if (key.startsWith('_')) {
        // 次の階層がパスパラメータ（e.g. `_foo`）の場合、パスを MSW の形式（`:foo`）に変換した上で、再帰的にモックを作る
        const paramName = key.substring(1);
        const subApiStructure = value(`:${paramName}`) as ApiStructure;
        return {
          ...acc,
          [key]: () => createMockFromApiStructure(subApiStructure),
        };
      }

      return acc; // ここには来ないはず
    }

    // サブパスのモックを再帰的に作る
    return { ...acc, [key]: createMockFromApiStructure(value) };
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
