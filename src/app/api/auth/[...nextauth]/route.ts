import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { IResponse } from '@/.interface/IResponse'
import {
  IAuthResponse,
  IAuthUser,
  IPayloadProfileGoogle,
  IRefreshToken,
  ENUM_AUTH_ERROR,
} from '@/.interface/IAuth'
import { IProprietarioLogin } from '@/.interface/IProprietario'
declare module 'next-auth' {
  interface Session {
    jwtValidade: string
    error: ENUM_AUTH_ERROR | undefined
    user: IAuthUser
  }
  interface User {
    id: number
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    profileComplete: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    profileComplete: boolean
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
  }
}

const URL_BACKEND = process.env.NEXT_PUBLIC_DEVELOP_ENV_ENDPOINT
  ? process.env.NEXT_PUBLIC_URL_DOCKER_WINDOWS_WITH_LINUX
  : process.env.NEXT_PUBLIC_API_URL

const refreshToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${URL_BACKEND}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const response: IResponse<IRefreshToken> = await res.json()
    if (!res.ok) throw new Error(response.message || 'Erro ao renovar token')

    return response
  } catch (error) {
    console.error('Erro ao renovar token', error)

    return null
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Digite seu email' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Digite sua senha',
        },
      },
      async authorize(credentials: IProprietarioLogin | undefined) {
        if (!credentials) return null

        const { email, password } = credentials
        const res = await fetch(`${URL_BACKEND}/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const response: IResponse<IAuthResponse> = await res.json()

        if (response?.data?.accessToken) {
          return {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            profileComplete: response.data.user.profileComplete,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            accessTokenExpires: Number(response.data.exp),
          }
        }
        return null
      },
    }),
    GoogleProvider({
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
    updateAge: 30 * 60,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // ✅ No login inicial
      if (user) {
        token.id = Number(user.id)
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        token.profileComplete = user.profileComplete
      }

      // ✅ Atualização de perfil completo
      if (trigger === 'update' && session?.profileComplete !== undefined) {
        token.profileComplete = session.profileComplete
      }

      // ✅ Verificar se tem exp válido
      if (!token.accessTokenExpires) {
        console.warn('⚠️ Token sem accessTokenExpires. Usuário deve relogar.')
        return token
      }

      const nowInSeconds = Math.floor(Date.now() / 1000)
      const timeUntilExpiry = token.accessTokenExpires - nowInSeconds

      if (timeUntilExpiry <= 300) {
        if (token.refreshToken) {
          const refreshed = await refreshToken(token.refreshToken)

          if (refreshed?.data?.accessToken) {
            token.accessToken = refreshed.data.accessToken
            token.refreshToken = refreshed.data.refreshToken
            token.accessTokenExpires = Number(refreshed.data.exp)
            return token
          }
          token.error = ENUM_AUTH_ERROR.ERROR_REFRESH_TOKEN
          return token
        }
      }

      return token
    },

    async session({ session, token }) {
      console.log('🟢 session callback - token:', token)

      if (!token.accessToken || !token.id) {
        return { ...session, user: {} as IAuthUser, jwtValidade: '' }
      }

      session.user.id = token.id
      session.user.email = token.email || ''
      session.user.name = token.name || ''
      session.user.profileComplete = token.profileComplete

      // ✅ ADICIONE ESTA LINHA: Passa o erro do token para a sessão
      session.error = token.error as ENUM_AUTH_ERROR | undefined

      // (Opcional) Se você precisar usar o accessToken no front para chamadas de API:
      // session.accessToken = token.accessToken

      if (token.accessTokenExpires) {
        session.jwtValidade = new Date(token.accessTokenExpires * 1000).toISOString()
      }

      return session
    },

    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const payloadForBackend: IPayloadProfileGoogle = {
            email: user.email ?? '',
            name: user.name ?? '',
            googleId: String(user.id ?? ''),
          }

          const backendResponse = await sendUserGoogleForBackend(payloadForBackend)

          user.id = backendResponse.data.user.id
          user.name = backendResponse.data.user.name
          user.email = backendResponse.data.user.email
          user.profileComplete = backendResponse.data.user.profileComplete
          user.accessToken = backendResponse.data.accessToken
          user.refreshToken = backendResponse.data.refreshToken
          user.accessTokenExpires = Number(backendResponse.data.exp)
        } catch (error) {
          console.error('❌ Erro ao autenticar com Google:', error)
          return false
        }
      }
      return true
    },
  },
})

const sendUserGoogleForBackend = async (profile: IPayloadProfileGoogle) => {
  const res = await fetch(`${URL_BACKEND}/auth/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  const response: IResponse<IAuthResponse> = await res.json()

  if (!res.ok) {
    console.error('❌ Erro na API:', response)
    throw new Error(response.message || 'Erro ao autenticar com Google')
  }

  return response
}

export { handler as GET, handler as POST }
