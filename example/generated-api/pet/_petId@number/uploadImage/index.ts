/* eslint-disable */
import type { ReadStream } from 'fs'
import type * as Types from '../../../@types'

export type Methods = {
  post: {
    query?: {
      /** Additional Metadata */
      additionalMetadata?: string | undefined
    } | undefined

    status: 200
    /** successful operation */
    resBody: Types.ApiResponse
    reqBody: (File | ReadStream)
  }
}
