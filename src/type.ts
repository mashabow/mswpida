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

//
// aspida が生成する API クライアントの型
//

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

/** aspida で生成した `api()` 関数の戻り値の型 */
export type ApiInstance = Endpoint | NonEndpoint | (Endpoint & NonEndpoint);

/** aspida で生成した `api()` 関数の型 */
export type Api<TApiInstance extends ApiInstance = ApiInstance> = ({
  baseURL,
  fetch,
}: AspidaClient<unknown>) => TApiInstance;

//
// mswpida が生成する typedRest の型
//

type TypedRestMethod<TApiInstance extends ApiInstance> = Extract<
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

type EndpointTypedRest<
  TApiInstance extends ApiInstance,
  TPathParamName extends string,
> = {
  [K in TypedRestMethod<TApiInstance>]: TApiInstance[K] extends $MethodFetch
    ? HandlerCreator<TApiInstance[K], TPathParamName>
    : never;
} & { $path: () => string };

type NonEndpointTypedRestKey<TApiInstance extends ApiInstance> = Exclude<
  keyof TApiInstance,
  keyof Endpoint | number | symbol
>;

type ExtractPathParamName<TPathParamFunctionName extends string> =
  TPathParamFunctionName extends `_${infer TPathParamName}`
    ? TPathParamName
    : never;

type NonEndpointTypedRest<
  TApiInstance extends ApiInstance,
  TPathParamName extends string,
> = {
  [K in NonEndpointTypedRestKey<TApiInstance>]: TApiInstance[K] extends ApiInstance
    ? TypedRest<TApiInstance[K], TPathParamName>
    : TApiInstance[K] extends PathParamFunction
    ? TypedRest<
        ReturnType<TApiInstance[K]>,
        TPathParamName | ExtractPathParamName<K>
      >
    : never;
};

export type TypedRest<
  TApiInstance extends ApiInstance,
  TPathParamName extends string,
> = NonEndpointTypedRest<TApiInstance, TPathParamName> &
  EndpointTypedRest<TApiInstance, TPathParamName>;
