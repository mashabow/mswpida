import type { AspidaClient, LowerHttpMethod } from 'aspida';

// api

type PathParamFunction =
  | ((param: string) => ApiStructure)
  | ((param: number) => ApiStructure);

type Endpoint = { $path: () => string } & {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [K in LowerHttpMethod | `$${LowerHttpMethod}`]?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option?: any,
  ) => Promise<unknown>;
};

type NonEndpoint = {
  [K in string]: ApiStructure | PathParamFunction;
};

export type ApiStructure = Endpoint | NonEndpoint | (Endpoint & NonEndpoint);

export type AspidaApi<T extends ApiStructure> = ({
  baseURL,
  fetch,
}: AspidaClient<unknown>) => T;

// mock

type MockPathParamFunction<T extends PathParamFunction> = () => MockApi<
  ReturnType<T>
>;

type MockEndpointKey<T extends ApiStructure> = Exclude<
  Extract<keyof T, keyof Endpoint>,
  LowerHttpMethod
>;

type MockEndpoint<T extends ApiStructure> = {
  [K in MockEndpointKey<T>]: K extends '$path'
    ? () => string
    : // TODO: T[K] からリクエストの型とレスポンスの型を抽出する
      () => string;
};

type MockNonEndpointKey<T extends ApiStructure> = Exclude<
  keyof T,
  keyof Endpoint
>;

type MockNonEndpoint<T extends ApiStructure> = {
  [K in MockNonEndpointKey<T>]: T[K] extends ApiStructure
    ? MockApi<T[K]>
    : T[K] extends PathParamFunction
    ? MockPathParamFunction<T[K]>
    : never;
};

export type MockApi<T extends ApiStructure> = MockNonEndpoint<T> &
  MockEndpoint<T>;
