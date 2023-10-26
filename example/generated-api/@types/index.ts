/* eslint-disable */
export type Order = {
  id?: number | undefined
  petId?: number | undefined
  quantity?: number | undefined
  shipDate?: string | undefined
  /** Order Status */
  status?: 'placed' | 'approved' | 'delivered' | undefined
  complete?: boolean | undefined
}

export type Customer = {
  id?: number | undefined
  username?: string | undefined
  address?: Address[] | undefined
}

export type Address = {
  street?: string | undefined
  city?: string | undefined
  state?: string | undefined
  zip?: string | undefined
}

export type Category = {
  id?: number | undefined
  name?: string | undefined
}

export type User = {
  id?: number | undefined
  username?: string | undefined
  firstName?: string | undefined
  lastName?: string | undefined
  email?: string | undefined
  password?: string | undefined
  phone?: string | undefined
  /** User Status */
  userStatus?: number | undefined
}

export type Tag = {
  id?: number | undefined
  name?: string | undefined
}

export type Pet = {
  id?: number | undefined
  name: string
  category?: Category | undefined
  photoUrls: string[]
  tags?: Tag[] | undefined
  /** pet status in the store */
  status?: 'available' | 'pending' | 'sold' | undefined
}

export type ApiResponse = {
  code?: number | undefined
  type?: string | undefined
  message?: string | undefined
}

export type Pet = Pet

export type UserArray = User[]
