// /lib/middleware/withAuth.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'

// 미들웨어: 인증을 확인하고, 통과한 요청만 다음 처리로 넘김
const withAuth = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // 쿠키에서 토큰 꺼내기
    const token = req.cookies.token

    // 토큰이 없으면 로그인 안 한 상태
    if (!token) {
      return res.status(401).json({ error: '로그인이 필요합니다.' })
    }

    try {
      // 토큰 검증 (디코딩)
      const decoded = verify(token, process.env.JWT_SECRET!)

      // 사용자 정보를 req.user에 저장해서 다음 핸들러에서 사용할 수 있게 함
      ;(req as any).user = decoded

      // 다음 API 함수 실행 (인증된 사용자만 여기 도달)
      return handler(req, res)
    } catch (err) {
      // 토큰이 유효하지 않음
      console.error(err)
      return res.status(401).json({ error: '잘못된 토큰입니다.' })
    }
  }
}

export default withAuth
