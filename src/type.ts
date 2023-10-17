import type { LowerHttpMethod } from 'aspida';

// api

type PathParamFunction =
  | ((param: string) => ApiStructure)
  | ((param: number) => ApiStructure);

type Endpoint = { $path: () => string } & {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  [K in LowerHttpMethod | `$${LowerHttpMethod}`]?: () => Promise<unknown>;
};

type NonEndpoint = {
  [K in string]: ApiStructure | PathParamFunction;
};

type ApiStructure = Endpoint | NonEndpoint | (Endpoint & NonEndpoint);

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

type MockApi<T extends ApiStructure> = MockNonEndpoint<T> & MockEndpoint<T>;
