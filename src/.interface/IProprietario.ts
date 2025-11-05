export interface IProprietario {
  email: string
  telefone: string
  nome: string
  cpf: string
  password: string
}
export type IProprietarioLogin = Pick<IProprietario, 'email' | 'password'>
