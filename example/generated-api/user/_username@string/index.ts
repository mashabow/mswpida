/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  get: {
    status: 200
    /** successful operation */
    resBody: Types.User
  }

  /** This can only be done by the logged in user. */
  put: {
    reqFormat: URLSearchParams
    /** Update an existent user in the store */
    reqBody: Types.User
  }

  /** This can only be done by the logged in user. */
  delete: {
  }
}
