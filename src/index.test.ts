import { describe, expect, test } from 'vitest';
import { createMock } from './index.js';

describe('createMock', () => {
  const baseURL = 'https://base-url.example.com/v1';

  test('空の api からは空のモックを作る', () => {
    const mock = createMock(() => ({}), baseURL);
    expect(mock).toEqual({});
  });
});
