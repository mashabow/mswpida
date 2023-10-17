import { ApiStructure, AspidaApi, MockApi } from './type.js';
import { rest } from 'msw';

export function createMock<T extends ApiStructure>(
  api: AspidaApi<T>,
  baseURL?: string,
): MockApi<T> {
  // TODO: rest を使って mock を作る
  return 'TODO';
}
