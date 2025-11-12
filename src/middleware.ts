import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rotas que NÃO precisam de autenticação
const publicRoutes = ['/', '/login', '/register']

// Função auxiliar para verificar se a rota é pública
const isPublicRoute = (path: string) => {
  return publicRoutes.includes(path)
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (isPublicRoute(path)) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    console.log('Sem token, redirecionando para login')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  if (!token.profileComplete && path !== '/dashBoard/complete-profile') {
    return NextResponse.redirect(new URL('/dashBoard/complete-profile', request.url))
  }

  if (token.profileComplete && path === '/dashBoard/complete-profile') {
    return NextResponse.redirect(new URL('/dashBoard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
