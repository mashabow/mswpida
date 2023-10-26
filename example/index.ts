import api from './generated-api/$api';
import { mswpida } from '../src';

const mock = mswpida(api, 'https://example.com');

mock.pet._petId.$post(async (req, res, ctx) =>
  res(ctx.status(201), ctx.json(await req.json())),
);

mock.user.createWithList.$post(async (req, res, ctx) =>
  res(ctx.status(201), ctx.json(await req.json())),
);
