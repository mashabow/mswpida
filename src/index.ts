import { ApiStructure, AspidaApi, MockApi } from './type.js';

export function createMock<T extends ApiStructure>(
  api: AspidaApi<T>,
): MockApi<T> {
  return 'TODO';
}
