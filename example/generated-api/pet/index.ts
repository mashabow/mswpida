/* eslint-disable */
import type * as Types from '../@types'

export type Methods = {
  /** Add a new pet to the store */
  post: {
    status: 200
    /** Successful operation */
    resBody: Types.Pet
    reqFormat: URLSearchParams
    /** Create a new pet in the store */
    reqBody: Types.Pet
  }

  /** Update an existing pet by Id */
  put: {
    status: 200
    /** Successful operation */
    resBody: Types.Pet
    reqFormat: URLSearchParams
    /** Update an existent pet in the store */
    reqBody: Types.Pet
  }
}
