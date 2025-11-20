import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rotas que NÃO precisam de autenticação
const publicRoutes = ['/', '/login', '/register']

const isPublicRoute = (path: string) => {
  return publicRoutes.includes(path)
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // ✅ Permite acesso público
  if (isPublicRoute(path)) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    console.log('❌ Não autenticado → /login')
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (!token?.profileComplete && path !== '/complete-profile') {
    console.log('⚠️ Perfil incompleto → /complete-profile')
    const completeProfileUrl = new URL('/complete-profile', request.url)
    return NextResponse.redirect(completeProfileUrl)
  }

  if (token.profileComplete && path === '/complete-profile') {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
// Middleware para proteger rotas privadas e gerenciar redirecionamentos baseados no estado de autenticação do usuário
// Ele verifica se o usuário está autenticado e se o perfil está completo, redirecionando conforme necessário.
