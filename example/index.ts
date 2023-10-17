import api from './generated-api/$api.js';
import { createMock } from '../src/index.js';

const mock = createMock(api, 'https://example.com');

mock.pet._petId().$post();
mock.user.createWithList.$post();
