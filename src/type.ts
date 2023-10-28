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
  | ((param: string) => ApiInstance)
  | ((param: number) => ApiInstance);

type NonEndpoint = {
  [K in string]: ApiInstance | PathParamFunction;
};

export type ApiInstance = Endpoint | NonEndpoint | (Endpoint & NonEndpoint);

export type AspidaApi<TApiInstance extends ApiInstance = ApiInstance> = ({
  baseURL,
  fetch,
}: AspidaClient<unknown>) => TApiInstance;

// mock

type MockMethod<TApiInstance extends ApiInstance> = Extract<
  keyof TApiInstance,
  $LowerHttpMethod
>;

type RequestBodyOf<T$MethodFetch extends $MethodFetch> =
  Parameters<T$MethodFetch>[0]['body'];
type ResponseBodyOf<T$MethodFetch extends $MethodFetch> = Awaited<
  ReturnType<T$MethodFetch>
>;

type HandlerCreator<
  T$MethodFetch extends $MethodFetch,
  TPathParamName extends string,
> = (
  resolver: ResponseResolver<
    RestRequest<
      RequestBodyOf<T$MethodFetch>,
      // aspida 的にはパスパラメータの値は string | number だが、
      // msw の req.params では常に string になる
      Record<TPathParamName, string>
    >,
    RestContext,
    ResponseBodyOf<T$MethodFetch>
  >,
) => RestHandler;

type MockEndpoint<
  TApiInstance extends ApiInstance,
  TPathParamName extends string,
> = {
  [K in MockMethod<TApiInstance>]: TApiInstance[K] extends $MethodFetch
    ? HandlerCreator<TApiInstance[K], TPathParamName>
    : never;
} & { $path: () => string };

type MockPathParam<
  TPathParamFunction extends PathParamFunction,
  TPathParamName extends string,
> = MockApi<ReturnType<TPathParamFunction>, TPathParamName>;

type MockNonEndpointKey<TApiInstance extends ApiInstance> = Exclude<
  keyof TApiInstance,
  keyof Endpoint | number | symbol
>;

type ExtractPathParamName<TPathParamFunctionName extends string> =
  TPathParamFunctionName extends `_${infer TPathParamName}`
    ? TPathParamName
    : never;

type MockNonEndpoint<
  TApiInstance extends ApiInstance,
  TPathParamName extends string,
> = {
  [K in MockNonEndpointKey<TApiInstance>]: TApiInstance[K] extends ApiInstance
    ? MockApi<TApiInstance[K], TPathParamName>
    : TApiInstance[K] extends PathParamFunction
    ? MockPathParam<TApiInstance[K], TPathParamName | ExtractPathParamName<K>>
    : never;
};

export type MockApi<
  TApiInstance extends ApiInstance,
  TPathParamName extends string,
> = MockNonEndpoint<TApiInstance, TPathParamName> &
  MockEndpoint<TApiInstance, TPathParamName>;
