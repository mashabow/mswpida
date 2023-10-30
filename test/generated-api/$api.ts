import type { AspidaClient, BasicHeaders } from 'aspida';
import { dataToURLString } from 'aspida';
import type { Methods as Methods_1agtfh0 } from './pets';
import type { Methods as Methods_15l7d74 } from './pets/_id@number';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'http://petstore.swagger.io/api' : baseURL).replace(/\/$/, '');
  const PATH0 = '/pets';
  const GET = 'GET';
  const POST = 'POST';
  const DELETE = 'DELETE';

  return {
    pets: {
      _id: (val1: number) => {
        const prefix1 = `${PATH0}/${val1}`;

        return {
          /**
           * Returns a user based on a single ID, if the user does not have access to the pet
           * @returns pet response
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_15l7d74['get']['resBody'], BasicHeaders, Methods_15l7d74['get']['status']>(prefix, prefix1, GET, option).json(),
          /**
           * Returns a user based on a single ID, if the user does not have access to the pet
           * @returns pet response
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_15l7d74['get']['resBody'], BasicHeaders, Methods_15l7d74['get']['status']>(prefix, prefix1, GET, option).json().then(r => r.body),
          /**
           * deletes a single pet based on the ID supplied
           */
          delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_15l7d74['delete']['status']>(prefix, prefix1, DELETE, option).send(),
          /**
           * deletes a single pet based on the ID supplied
           */
          $delete: (option?: { config?: T | undefined } | undefined) =>
            fetch<void, BasicHeaders, Methods_15l7d74['delete']['status']>(prefix, prefix1, DELETE, option).send().then(r => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      /**
       * Returns all pets from the system that the user has access to
       * Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.
       *
       * Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
       * @returns pet response
       */
      get: (option?: { query?: Methods_1agtfh0['get']['query'] | undefined, config?: T | undefined } | undefined) =>
        fetch<Methods_1agtfh0['get']['resBody'], BasicHeaders, Methods_1agtfh0['get']['status']>(prefix, PATH0, GET, option).json(),
      /**
       * Returns all pets from the system that the user has access to
       * Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.
       *
       * Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
       * @returns pet response
       */
      $get: (option?: { query?: Methods_1agtfh0['get']['query'] | undefined, config?: T | undefined } | undefined) =>
        fetch<Methods_1agtfh0['get']['resBody'], BasicHeaders, Methods_1agtfh0['get']['status']>(prefix, PATH0, GET, option).json().then(r => r.body),
      /**
       * Creates a new pet in the store. Duplicates are allowed
       * @param option.body - Pet to add to the store
       * @returns pet response
       */
      post: (option: { body: Methods_1agtfh0['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1agtfh0['post']['resBody'], BasicHeaders, Methods_1agtfh0['post']['status']>(prefix, PATH0, POST, option).json(),
      /**
       * Creates a new pet in the store. Duplicates are allowed
       * @param option.body - Pet to add to the store
       * @returns pet response
       */
      $post: (option: { body: Methods_1agtfh0['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1agtfh0['post']['resBody'], BasicHeaders, Methods_1agtfh0['post']['status']>(prefix, PATH0, POST, option).json().then(r => r.body),
      $path: (option?: { method?: 'get' | undefined; query: Methods_1agtfh0['get']['query'] } | undefined) =>
        `${prefix}${PATH0}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
