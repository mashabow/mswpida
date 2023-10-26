/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** Multiple status values can be provided with comma separated strings */
  get: {
    query?: {
      /** Status values that need to be considered for filter */
      status?: 'available' | 'pending' | 'sold' | undefined
    } | undefined

    status: 200
    /** successful operation */
    resBody: Types.Pet[]
  }
}
