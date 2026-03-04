export interface IProprietario {
  email: string
  phone: string
  name: string
  cpf: string
  password: string
  image?: string
  id: number
  profileComplete: boolean
}
export type IProprietarioLogin = Pick<IProprietario, 'email' | 'password'>

export type IProprietarioCreate = Omit<IProprietario, 'id' | 'profileComplete' | 'image'>

export type IProprietarioCompleteProfile = Pick<IProprietario, 'cpf' | 'phone'>
