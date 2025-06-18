// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 라우팅 전에 항상 실행됨
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  // ✅ 로그인 안 한 사용자 처리
  if (!token) {
    // /mypage 또는 /admin 접근 시 로그인 페이지로 이동
    if (req.nextUrl.pathname.startsWith('/mypage') || req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // 그 외 경로는 그냥 통과
    return NextResponse.next()
  }

  // ✅ 로그인 했을 때 → 관리자 검증
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')

  try {
    // JWT 디코딩 (Base64)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )

    if (isAdminPath && payload.role !== 'admin') {
      // 일반 사용자가 /admin 접근 시 차단
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    // 토큰이 이상하면 로그인 페이지로
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
// matcher: 이 미들웨어가 적용될 경로 지정
export const config = {
    matcher: ['/mypage/:path*', '/admin/:path*', '/api/me',],
  }
  