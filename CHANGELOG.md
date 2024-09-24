# mswpida

## 2.0.1

### Patch Changes

- [#40](https://github.com/mashabow/mswpida/pull/40) [`618347d`](https://github.com/mashabow/mswpida/commit/618347de960b67553286cf8c8dabb0952a7bcff7) Thanks [@mashabow](https://github.com/mashabow)! - Migrate ESLint and Prettier to Biome

## 2.0.0

### Major Changes

- [#38](https://github.com/mashabow/mswpida/pull/38) [`f6e6da9`](https://github.com/mashabow/mswpida/commit/f6e6da9cdd9948e743ee7311aea8bfd7dc31af04) Thanks [@mashabow](https://github.com/mashabow)! - Now supports MSW v2 with aligned APIs, and has discontinued support for MSW v1.

## 1.0.1

### Patch Changes

- [#34](https://github.com/mashabow/mswpida/pull/34) [`13dae75`](https://github.com/mashabow/mswpida/commit/13dae75f754565f17e9760cf694046c93929d7df) Thanks [@mashabow](https://github.com/mashabow)! - Infer `req.body` as `undefined` for no request body APIs, rather than as `unknown`

## 1.0.0

### Major Changes

- [#32](https://github.com/mashabow/mswpida/pull/32) [`f35a123`](https://github.com/mashabow/mswpida/commit/f35a123b689d5c8b9a9572833ec9f42f25411fd5) Thanks [@mashabow](https://github.com/mashabow)! - First major release. No breaking changes from the previous version.

## 0.2.0

### Minor Changes

- [#27](https://github.com/mashabow/mswpida/pull/27) [`9eea7e4`](https://github.com/mashabow/mswpida/commit/9eea7e458876a045a07f18418b149af0241670ff) Thanks [@mashabow](https://github.com/mashabow)! - Now you can specify an alternative response body type with a type parameter, e.g. `.get<T>()`

## 0.1.0

- Rename the main function to `createTypedRest`
- Infer path parameter types
- Change path parameter notation from `._foo()` to `._foo`
- Add detailed README

## 0.0.2

- Add missing `main` property to `package.json`

## 0.0.1

- Initial release
