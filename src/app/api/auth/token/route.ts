import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token?.accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    return NextResponse.json({ accessToken: token.accessToken })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar token' }, { status: 500 })
  }
}
