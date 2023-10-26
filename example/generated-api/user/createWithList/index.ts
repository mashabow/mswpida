/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** Creates list of users with given input array */
  post: {
    status: 200
    /** Successful operation */
    resBody: Types.User
    reqBody: Types.User[]
  }
}
