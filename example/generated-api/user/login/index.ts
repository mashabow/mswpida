/* eslint-disable */
export type Methods = {
  get: {
    query?: {
      /** The user name for login */
      username?: string | undefined
      /** The password for login in clear text */
      password?: string | undefined
    } | undefined

    status: 200
    /** successful operation */
    resBody: string

    resHeaders: {
      /** calls per hour allowed by the user */
      'X-Rate-Limit': number
      /** date in UTC when token expires */
      'X-Expires-After': string
    }
  }
}
