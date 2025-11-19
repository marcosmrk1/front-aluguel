import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    jwtValidade?: string // ✅ Data de validade do JWT do backend
    user: {
      email: string
      name: string
      profileComplete?: boolean
      id: number
    }
  }
  interface User {
    id: number
    accessToken?: string
    refreshToken?: string
    exp?: string // ✅ SEMPRE string ISO do backend
    profileComplete?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number
    profileComplete?: boolean
    accessToken?: string
    refreshToken?: string
    exp?: number // ✅ Internamente number (timestamp Unix)
  }
}

const URL_BACKEND = process.env.NEXT_PUBLIC_DEVELOP_ENV_ENDPOINT
  ? process.env.NEXT_PUBLIC_URL_DOCKER_WINDOWS_WITH_LINUX
  : process.env.NEXT_PUBLIC_API_URL

const refreshToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`${URL_BACKEND}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const response = await res.json()

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
      async authorize(
        credentials: Record<'email' | 'password', string> | undefined,
      ): Promise<any> {
        if (!credentials) return null

        const { email, password } = credentials
        const res = await fetch(`${URL_BACKEND}/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const response = await res.json()

        console.log('📥 Resposta do backend (Credentials):', response)

        if (response?.data?.accessToken) {
          return {
            id: response.data.user?.id || response.data.id,
            name: response.data.user?.name || response.data.name,
            email: response.data.user?.email || response.data.email,
            profileComplete:
              response.data.user?.profileComplete || response.data.profileComplete,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            exp: response.data.exp, // ✅ String ISO do backend
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
    maxAge: 60 * 60, // ✅ 1 hora (igual ao backend token_ttl: 3600)
    updateAge: 30 * 60, // ✅ Atualiza a cada 30 minutos
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = typeof user.id === 'number' ? user.id : parseInt(user.id as string)
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken

        token.exp = Math.floor(new Date(user.exp as string).getTime() / 1000)

        token.profileComplete = user.profileComplete
      }

      const nowInSeconds = Math.floor(Date.now() / 1000)

      if (token.exp && nowInSeconds >= (token.exp as number)) {
        console.warn('⚠️ Token expirado! Tentando renovar...', {
          exp: token.exp,
          now: nowInSeconds,
          diferenca: (token.exp as number) - nowInSeconds,
        })

        if (token.refreshToken) {
          const refreshed = await refreshToken(token.refreshToken as string)

          if (refreshed?.data?.accessToken) {
            token.accessToken = refreshed.data.accessToken
            token.refreshToken = refreshed.data.refreshToken

            // ✅ SEMPRE converte string ISO para timestamp Unix
            token.exp = Math.floor(
              new Date(refreshed.data.exp as string).getTime() / 1000,
            )

            console.log('✅ Token renovado com sucesso!')
            return token
          }
        }

        console.error('❌ Não foi possível renovar o token. Forçando logout...')
        return {
          ...token,
          accessToken: undefined,
          refreshToken: undefined,
          exp: undefined,
        }
      }

      return token
    },

    async session({ session, token }) {
      if (!token.accessToken) {
        console.warn('⚠️ Token inválido na session callback')
        return {} as any
      }

      session.user.id = token.id as number
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.user.profileComplete = token.profileComplete as boolean
      session.user.name = session.user.name || ''

      // ✅ Define jwtValidade com o exp do JWT do backend
      if (token.exp) {
        session.jwtValidade = new Date((token.exp as number) * 1000).toISOString()
      }

      return session
    },

    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const payloadForBackend = {
            email: user.email,
            name: user.name,
            googleId: user.id,
          }

          const backendResponse = await sendUserGoogleForBackend(payloadForBackend)

          user.id = backendResponse.data.user.id
          user.name = backendResponse.data.user.name
          user.email = backendResponse.data.user.email
          user.profileComplete = backendResponse.data.user.profileComplete
          user.accessToken = backendResponse.data.accessToken
          user.refreshToken = backendResponse.data.refreshToken
          user.exp = backendResponse.data.exp // ✅ String ISO do backend
        } catch (error) {
          console.error('❌ Erro ao autenticar com Google:', error)
          return false
        }
      }
      return true
    },
  },
})

const sendUserGoogleForBackend = async (profile: any) => {
  const res = await fetch(`${URL_BACKEND}/auth/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  const response = await res.json()

  if (!res.ok) {
    console.error('❌ Erro na API:', response)
    throw new Error(response.message || 'Erro ao autenticar com Google')
  }

  return response
}

export { handler as GET, handler as POST }
