import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { send } from 'process'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
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
    exp?: number
    profileComplete?: boolean
    data?: {
      accessToken?: string
      refreshToken?: string
      exp?: number
      profileComplete?: boolean
      user?: {
        id: number
        profileComplete?: boolean
      }
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number
    profileComplete?: boolean
    accessToken?: string
    refreshToken?: string
    exp?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number
    profileComplete?: boolean
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
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erro ao renovar token')
    return data
  } catch (error) {
    console.error('Erro ao renovar token', error)
    return { error, refreshToken }
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

        const user = await res.json()
        if (user?.accessToken) {
          return {
            id: user.id,
            name: user.nome,
            email: user.email,
            profileComplete: user.profileComplete,
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
    maxAge: 2 * 24 * 60 * 60, // 2 dias
    updateAge: 24 * 60 * 60, // Atualiza apenas 1x por dia
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = typeof user.id === 'number' ? user.id : parseInt(user.id as string)
        token.accessToken = user.data?.accessToken || user.accessToken
        token.refreshToken = user.data?.refreshToken || user.refreshToken
        token.exp = user.data?.exp || user.exp
        token.profileComplete = user.data?.profileComplete || user.profileComplete

        // console.log('🔐 JWT callback - token atualizado:', token)
      }

      if (token.exp && Date.now() < (token.exp as number) * 1000) {
        return token
      }

      if (token.refreshToken) {
        const refreshed = await refreshToken(token.refreshToken as string)
        if (refreshed?.accessToken) {
          token.accessToken = refreshed.data.accessToken
          token.refreshToken = refreshed.data.refreshToken
          token.exp = refreshed.data.exp
        }
      }
      return token
    },
    async session({ session, token }) {
      // console.log('👤 Session callback - token:', token)

      session.user.id = token.id as number
      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined
      session.user.profileComplete = token.profileComplete as boolean

      // console.log('👤 Session callback - session atualizada:', session)

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

          // console.log('🔵 Enviando para backend:', payloadForBackend)

          const backendUser = await sendUserGoogleForBackend(payloadForBackend)
          console.log('✅ Resposta do backend:', backendUser.data)
          // ✅ IMPORTANTE: Salva os dados do backend no objeto user
          user.id = backendUser.data.user.id
          user.profileComplete = backendUser.data.user.profileComplete
          user.accessToken = backendUser.data.accessToken
          user.refreshToken = backendUser.data.refreshToken
          user.exp = backendUser.data.exp

          console.log('💾 User atualizado:', user)
        } catch (error) {
          console.error('❌ Erro ao autenticar com Google:', error)
          return false // Bloqueia o login se houver erro
        }
      }
      return true
    },
  },
})
const sendUserGoogleForBackend = async (profile: any) => {
  // console.log('📤 Enviando para:', `${URL_BACKEND}/auth/social`)

  const res = await fetch(`${URL_BACKEND}/auth/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('❌ Erro na API:', data)
    throw new Error(data.message || 'Erro ao autenticar com Google')
  }

  return data
}

export { handler as GET, handler as POST }
