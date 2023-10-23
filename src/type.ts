import type {
  AspidaClient,
  AspidaParams,
  AspidaResponse,
  LowerHttpMethod,
} from 'aspida';
import type {
  ResponseResolver,
  RestContext,
  RestHandler,
  RestRequest,
} from 'msw';

export type $LowerHttpMethod = `$${LowerHttpMethod}`;

// api

type MethodFetch = (
  option: Required<AspidaParams>,
) => Promise<AspidaResponse<unknown>>;
type $MethodFetch = (option: Required<AspidaParams>) => Promise<unknown>;

export type Endpoint = Partial<Record<LowerHttpMethod, MethodFetch>> &
  Partial<Record<$LowerHttpMethod, $MethodFetch>> & {
    $path: () => string;
  };

type PathParamFunction =
  | ((param: string) => ApiStructure)
  | ((param: number) => ApiStructure);

type NonEndpoint = {
  [K in string]: ApiStructure | PathParamFunction;
};

export type ApiStructure = Endpoint | NonEndpoint | (Endpoint & NonEndpoint);

export type AspidaApi<T extends ApiStructure = ApiStructure> = ({
  baseURL,
  fetch,
}: AspidaClient<unknown>) => T;

// mock

type MockMethod<T extends ApiStructure> = Extract<keyof T, $LowerHttpMethod>;

type RequestBodyOf<T extends $MethodFetch> = Parameters<T>[0]['body'];
type ResponseBodyOf<T extends $MethodFetch> = Awaited<ReturnType<T>>;

type HandlerCreator<T extends $MethodFetch> = (
  resolver: ResponseResolver<
    RestRequest<RequestBodyOf<T>>, // TODO: パスパラメータの型 RequestParams を定義する
    RestContext,
    ResponseBodyOf<T>
  >,
) => RestHandler;

type MockEndpoint<T extends ApiStructure> = {
  [K in MockMethod<T>]: T[K] extends $MethodFetch
    ? HandlerCreator<T[K]>
    : never;
} & { $path: () => string };

type MockPathParamFunction<T extends PathParamFunction> = () => MockApi<
  ReturnType<T>
>;

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
