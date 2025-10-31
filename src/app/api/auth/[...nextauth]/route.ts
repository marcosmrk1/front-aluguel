import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { send } from 'process'
interface ICrendecias {
  email: string
  password: string
}
declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
  }
  interface User {
    accessToken?: string
    refreshToken?: string
    exp?: number
  }
}
const refreshToken = async (refreshToken: string) => {
  try {
    const res = await fetch(`http://localhost:4000/auth/refresh-token`, {
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
        const res = await fetch('http://localhost:4000/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const user = await res.json()
        if (user?.accessToken) {
          return user
        }
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.exp = user.exp // garanta que exp está vindo do backend
      }
      // Se NÃO expirou, retorna o token atual
      if (token.exp && Date.now() < (token.exp as number) * 1000) {
        return token
      }
      // Se expirou, tenta renovar (se houver refreshToken)
      if (token.refreshToken) {
        const refreshed = await refreshToken(token.refreshToken as string)
        if (refreshed?.accessToken) {
          token.accessToken = refreshed.accessToken
          token.refreshToken = refreshed.refreshToken
          token.exp = refreshed.exp
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined

      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const payloadForBackend = {
          email: user.email,
          nome: user.name, // troque 'name' por 'nome'
          googleId: account.providerAccountId, // Use o ID real do Google!
        }
        console.log('Payload for backend:', payloadForBackend)
        await sendUserGoogleForBackend(payloadForBackend)
      }
      return true
    },
  },
})
const sendUserGoogleForBackend = async (profile: any) => {
  const res = await fetch('http://host.docker.internal:4000/auth/social', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile), // CERTO
  })

  const data = await res.json()
  console.log(data, res)
  if (!res.ok) throw new Error(data.message || 'Erro ao autenticar com Google')
  return data
}

export { handler as GET, handler as POST }
