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

export type AspidaApi<TApiStructure extends ApiStructure = ApiStructure> = ({
  baseURL,
  fetch,
}: AspidaClient<unknown>) => TApiStructure;

// mock

type MockMethod<TApiStructure extends ApiStructure> = Extract<
  keyof TApiStructure,
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
  TApiStructure extends ApiStructure,
  TPathParamName extends string,
> = {
  [K in MockMethod<TApiStructure>]: TApiStructure[K] extends $MethodFetch
    ? HandlerCreator<TApiStructure[K], TPathParamName>
    : never;
} & { $path: () => string };

type MockPathParam<
  TPathParamFunction extends PathParamFunction,
  TPathParamName extends string,
> = MockApi<ReturnType<TPathParamFunction>, TPathParamName>;

type MockNonEndpointKey<TApiStructure extends ApiStructure> = Exclude<
  keyof TApiStructure,
  keyof Endpoint | number | symbol
>;

type MockNonEndpoint<
  TApiStructure extends ApiStructure,
  TPathParamName extends string,
> = {
  [K in MockNonEndpointKey<TApiStructure>]: TApiStructure[K] extends ApiStructure
    ? MockApi<TApiStructure[K], TPathParamName>
    : TApiStructure[K] extends PathParamFunction
    ? MockPathParam<TApiStructure[K], TPathParamName | K> // TODO: _foo から foo に変換
    : never;
};

export type MockApi<
  TApiStructure extends ApiStructure,
  TPathParamName extends string,
> = MockNonEndpoint<TApiStructure, TPathParamName> &
  MockEndpoint<TApiStructure, TPathParamName>;
