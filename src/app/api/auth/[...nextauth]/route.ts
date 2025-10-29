import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
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
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined
      session.refreshToken = token.refreshToken as string | undefined
      return session
    },
  },
})

export { handler as GET, handler as POST }
