import api from './generated-api/$api';
import { mswpida } from '../src';

const mock = mswpida(api, 'https://example.com');

mock.pet._petId().$post();
mock.user.createWithList.$post();
