import { type RequestHandlerOptions, type ResponseResolver, http } from "msw";
import type { LowerHttpMethod } from "aspida";
import type {
	$LowerHttpMethod,
	ApiInstance,
	Api,
	Endpoint,
	TypedHttp,
} from "./type";

const METHODS = [
	"get",
	"post",
	"put",
	"delete",
	"head",
	"patch",
	"options",
] satisfies LowerHttpMethod[];
const $METHODS = [
	"$get",
	"$post",
	"$put",
	"$delete",
	"$head",
	"$patch",
	"$options",
] satisfies $LowerHttpMethod[];

function createTypedHttpFromApiInstance<
	TApiInstance extends ApiInstance,
	TPathParamName extends string,
>(apiInstance: TApiInstance): TypedHttp<TApiInstance, TPathParamName> {
	// @ts-expect-error TODO: 型エラー修正
	return Object.fromEntries(
		// @ts-expect-error TODO: 型エラー修正
		Object.entries(apiInstance)
			.map(([key, value]) => {
				if (value instanceof Function) {
					if (key === "$path") {
						return ["$path", value];
					}

					if ($METHODS.includes(key as $LowerHttpMethod)) {
						// そのメソッドのモック生成関数を返す
						const method = key.substring(1) as LowerHttpMethod;
						const path = (apiInstance as Endpoint).$path();
						return [
							key,
							(resolver: ResponseResolver, options?: RequestHandlerOptions) =>
								http[method](path, resolver, options),
						];
					}

					if (METHODS.includes(key as LowerHttpMethod)) {
						// `$` 無しのメソッドは、モックには用意しない
						return null;
					}

					if (key.startsWith("_")) {
						// 次の階層がパスパラメータ（e.g. `_foo`）の場合、パスを MSW の形式（`:foo`）に変換した上で、再帰的にモックを作る
						const paramName = key.substring(1);
						// @ts-expect-error TODO: 型エラー修正
						const childApiInstance = value(`:${paramName}`) as ApiInstance;
						return [key, createTypedHttpFromApiInstance(childApiInstance)];
					}

					return null; // ここには来ないはず
				}

				// サブパスのモックを再帰的に作る
				return [key, createTypedHttpFromApiInstance(value)];
			})
			.filter((entry) => entry !== null),
	);
}

export function createTypedHttp<TApiInstance extends ApiInstance>(
	api: Api<TApiInstance>,
	options?: { baseURL?: string },
): TypedHttp<TApiInstance, never> {
	const apiInstance = api({
		baseURL: options?.baseURL,
		// @ts-expect-error 使わないので適当な関数を渡しておく
		fetch: () => "dummy",
	});

	return createTypedHttpFromApiInstance(apiInstance);
}
