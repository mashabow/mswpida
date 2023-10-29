/* eslint-disable */
export type Pet = NewPet & {
  id: number
}

export type NewPet = {
  name: string
  tag?: string | undefined
}

export type Error = {
  code: number
  message: string
}
