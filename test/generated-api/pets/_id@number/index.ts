/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** Returns a user based on a single ID, if the user does not have access to the pet */
  get: {
    status: 200
    /** pet response */
    resBody: Types.Pet
  }

  /** deletes a single pet based on the ID supplied */
  delete: {
    status: 204
  }
}
