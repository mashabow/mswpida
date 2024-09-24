import aspida from "@aspida/fetch";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import { HttpResponse } from "msw";
import { createTypedHttp } from "../src";
import type { Api } from "../src/type";
import petStoreApi from "./generated-api/$api";

describe("createTypedHttp", () => {
	describe("API の構造に沿った `typedHttp` が作成される", () => {
		test("openapi2aspida で生成した Pet Store API から、Pet Store API 用の `typedHttp` が作成される", () => {
			const typedHttp = createTypedHttp(petStoreApi);
			expect(typedHttp).toMatchInlineSnapshot(`
        {
          "pets": {
            "$get": [Function],
            "$path": [Function],
            "$post": [Function],
            "_id": {
              "$delete": [Function],
              "$get": [Function],
              "$path": [Function],
            },
          },
        }
      `);
		});

		test("空の API からは空の `typedHttp` が作成される", () => {
			const emptyApi = (() => ({})) satisfies Api;
			const typedHttp = createTypedHttp(emptyApi);
			expect(typedHttp).toEqual({});
		});
	});

	describe("作成された `typedHttp` が正しく動く", () => {
		const defaultBaseURL = "http://petstore.swagger.io/api"; // Pet Store API のデフォルトの base URL
		const customBaseURL = "https://custom-base-url.example.com/v1";

		describe("エンドポイントのパスを `.$path()` で取得できる", () => {
			test("パスパラメータを含まない場合は、具体的なパスをそのまま返す", () => {
				const typedHttp = createTypedHttp(petStoreApi);
				expect(typedHttp.pets.$path()).toEqual(`${defaultBaseURL}/pets`);
			});

			test("パスパラメータ部分は `:foo` 形式で表現される", () => {
				const typedHttp = createTypedHttp(petStoreApi);
				expect(typedHttp.pets._id.$path()).toEqual(
					`${defaultBaseURL}/pets/:id`,
				);
			});

			test("`createTypedHttp` で `baseURL` オプションを指定した場合、それがベース URL として使われる", () => {
				const typedHttp = createTypedHttp(petStoreApi, {
					baseURL: customBaseURL,
				});
				expect(typedHttp.pets._id.$path()).toEqual(`${customBaseURL}/pets/:id`);
			});
		});

		describe("request handler を `.$get()` などで作成できる", () => {
			const server = setupServer();
			beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
			afterEach(() => server.resetHandlers());
			afterAll(() => server.close());

			test("作成した request handler が正しく動く", async () => {
				const typedHttp = createTypedHttp(petStoreApi);
				server.use(
					typedHttp.pets._id.$get(({ params }) => {
						const petId = params.id;
						return HttpResponse.json({ id: Number(petId), name: "Foo" });
					}),
				);

				const client = petStoreApi(aspida(fetch));
				const resBody = await client.pets._id(123).$get();

				expect(resBody).toEqual({ id: 123, name: "Foo" });
			});

			test("aspida で指定された型以外のレスポンスボディを返したい場合は、型パラメータでそれを表現できる", async () => {
				const typedHttp = createTypedHttp(petStoreApi);
				type ErrorResponseBody = { errorCode: string };
				server.use(
					typedHttp.pets._id.$get<ErrorResponseBody>(({ params }) => {
						const petId = params.id;
						if (petId === "bad_id") {
							return HttpResponse.json(
								{ errorCode: "resource_not_found" },
								{ status: 404 },
							);
						}
						return HttpResponse.json({ id: Number(petId), name: "Foo" });
					}),
				);

				const client = petStoreApi(aspida(fetch));
				const resBody = await client.pets._id(123).$get();

				expect(resBody).toEqual({ id: 123, name: "Foo" });
			});

			test("`createTypedHttp` で `baseURL` オプションを指定した場合、それがベース URL として使われる", async () => {
				const typedHttp = createTypedHttp(petStoreApi, {
					baseURL: customBaseURL,
				});

				server.use(
					typedHttp.pets._id.$get(({ params }) => {
						const petId = params.id;
						return HttpResponse.json({ id: Number(petId), name: "Foo" });
					}),
				);

				const client = petStoreApi(aspida(fetch, { baseURL: customBaseURL }));
				const resBody = await client.pets._id(123).$get();
				expect(resBody).toEqual({ id: 123, name: "Foo" });
			});
		});

		// TODO: 型のテストを追加する
	});
});
