import type { AspidaClient, LowerHttpMethod } from 'aspida';
import { ResponseResolver, RestHandler, RestRequest } from 'msw';

// api

type PathParamFunction =
  | ((param: string) => ApiStructure)
  | ((param: number) => ApiStructure);

export type Endpoint = { $path: () => string } & {
  [K in LowerHttpMethod | `$${LowerHttpMethod}`]?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    option?: any,
  ) => Promise<unknown>;
};

type NonEndpoint = {
  [K in string]: ApiStructure | PathParamFunction;
};

export type ApiStructure = Endpoint | NonEndpoint | (Endpoint & NonEndpoint);

export type AspidaApi<T extends ApiStructure = ApiStructure> = ({
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

type HandlerCreator<T> = // TODO: T[K] からリクエストの型を抽出して、RestRequest の型パラメータ RequestBody に渡す
  // RestRequest<RequestBody extends DefaultBodyType = DefaultBodyType, RequestParams extends PathParams = PathParams>
  // TODO: T[K] からレスポンスの型を抽出して、ResponseResolver の型パラメータ BodyType に渡す
  // ResponseResolver<RequestType = MockedRequest, ContextType = typeof defaultContext, BodyType extends DefaultBodyType = any>
  (resolver: ResponseResolver<RestRequest>) => RestHandler;

type MockEndpoint<T extends ApiStructure> = {
  [K in MockEndpointKey<T>]: K extends '$path'
    ? () => string
    : HandlerCreator<T[K]>;
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
