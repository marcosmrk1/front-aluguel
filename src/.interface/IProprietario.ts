export interface IProprietario {
  email: string
  phone: string
  name: string
  cpf: string
  password: string
}
export type IProprietarioLogin = Pick<IProprietario, 'email' | 'password'>

export type IProprietarioCompleteProfile = Pick<IProprietario, 'cpf' | 'phone'>
