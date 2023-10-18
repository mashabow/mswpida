import { rest } from 'msw';
import { ApiStructure, AspidaApi, MockApi } from './type.js';

function createMockFromApiStructure<T extends ApiStructure>(
  apiStructure: T,
): MockApi<T> {
  // TODO
  return apiStructure;
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
