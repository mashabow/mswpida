/* eslint-disable */
import type * as Types from '../../../@types'

export type Methods = {
  /** For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions. */
  get: {
    status: 200
    /** successful operation */
    resBody: Types.Order
  }

  /** For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors */
  delete: {
  }
}
