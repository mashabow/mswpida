/* eslint-disable no-console */
import { setupWorker } from 'msw';
import api from './generated-api/$api';
import { createTypedRest } from '../src';

const typedRest = createTypedRest(api, { baseURL: 'https://example.com' });

const handlers = [
  typedRest.pets.$post((req, res, ctx) => {
    const newPet = req.body;
    console.log(newPet.name);
    return res(ctx.status(201), ctx.json({ ...newPet, id: 123 }));
  }),
  typedRest.pets._id.$delete(async (req, res, ctx) => {
    console.log(req.params.id);
    return res(ctx.status(204));
  }),
];

const worker = setupWorker(...handlers);
await worker.start();
