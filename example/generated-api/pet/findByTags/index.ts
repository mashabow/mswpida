/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing. */
  get: {
    query?: {
      /** Tags to filter by */
      tags?: string[] | undefined
    } | undefined

    status: 200
    /** successful operation */
    resBody: Types.Pet[]
  }
}
