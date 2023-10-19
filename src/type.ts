import type {
  AspidaClient,
  AspidaParams,
  AspidaResponse,
  LowerHttpMethod,
} from 'aspida';
import { ResponseResolver, RestHandler, RestRequest } from 'msw';

export type $LowerHttpMethod = `$${LowerHttpMethod}`;

// api

type PathParamFunction =
  | ((param: string) => ApiStructure)
  | ((param: number) => ApiStructure);

type MethodFetch = (option: Required<AspidaParams>) => Promise<AspidaResponse>;
type $MethodFetch = (
  option: Required<AspidaParams>,
) => Promise<AspidaResponse['body']>;

export type Endpoint = Partial<Record<LowerHttpMethod, MethodFetch>> &
  Partial<Record<$LowerHttpMethod, $MethodFetch>> & {
    $path: () => string;
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

type MockMethod<T extends ApiStructure> = Extract<keyof T, $LowerHttpMethod>;

type HandlerCreator<T> = // TODO: T[K] からリクエストの型を抽出して、RestRequest の型パラメータ RequestBody に渡す
  // RestRequest<RequestBody extends DefaultBodyType = DefaultBodyType, RequestParams extends PathParams = PathParams>
  // TODO: T[K] からレスポンスの型を抽出して、ResponseResolver の型パラメータ BodyType に渡す
  // ResponseResolver<RequestType = MockedRequest, ContextType = typeof defaultContext, BodyType extends DefaultBodyType = any>
  (resolver: ResponseResolver<RestRequest>) => RestHandler;

type MockEndpoint<T extends ApiStructure> = {
  [K in MockMethod<T>]: HandlerCreator<T[K]>;
} & { $path: () => string };

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
