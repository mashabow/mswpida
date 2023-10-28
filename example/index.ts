import api from './generated-api/$api';
import { createTypedRest } from '../src';

const typedRest = createTypedRest(api, { baseURL: 'https://example.com' });

typedRest.pet._petId.$post(async (req, res, ctx) =>
  res(ctx.status(201), ctx.json(await req.json())),
);

typedRest.user.createWithList.$post(async (req, res, ctx) =>
  res(ctx.status(201), ctx.json(await req.json())),
);
