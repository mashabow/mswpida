/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** Place a new order in the store */
  post: {
    status: 200
    /** successful operation */
    resBody: Types.Order
    reqFormat: URLSearchParams
    reqBody: Types.Order
  }
}
