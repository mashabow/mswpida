import api from './generated-api/$api';
import { createMock } from '../src';

const mock = createMock(api, 'https://example.com');

mock.pet._petId().$post();
mock.user.createWithList.$post();
