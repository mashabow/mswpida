/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** Returns a single pet */
  get: {
    status: 200
    /** successful operation */
    resBody: Types.Pet
  }

  post: {
    query?: {
      /** Name of pet that needs to be updated */
      name?: string | undefined
      /** Status of pet that needs to be updated */
      status?: string | undefined
    } | undefined
  }

  delete: {
    reqHeaders?: {
      api_key?: string | undefined
    } | undefined
  }
}
