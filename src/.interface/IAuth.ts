import { IProprietario } from './IProprietario'

export type IAuthUser = Pick<
  IProprietario,
  'id' | 'email' | 'name' | 'image' | 'profileComplete'
>

export interface IAuthResponse {
  user: IAuthUser
  accessToken: string
  refreshToken: string
  exp: string
}

export interface IPayloadProfileGoogle extends Pick<IProprietario, 'email' | 'name'> {
  googleId: string
}

export type IRefreshToken = Omit<IAuthResponse, 'user'>
export enum ENUM_AUTH_ERROR {
  ERROR_REFRESH_TOKEN = 'ErrorRenovarToken',
}
