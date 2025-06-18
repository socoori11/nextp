import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  // 쿠키에서 'token'을 삭제하여 로그아웃 처리
  res.setHeader('Set-Cookie', 
    'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None; Max-Age=0'
  )
  
  // 로그아웃 성공 메시지 반환
  res.status(200).json({ message: '로그아웃 완료' })
}

export default handler

