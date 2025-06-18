// pages/api/mypage/logincount.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: '로그인 필요' })

  const decoded: any = verify(token, process.env.JWT_SECRET!)
  const [rows] = await db.query('SELECT COUNT(*) as count FROM logins WHERE user_id = ?', [decoded.id])

  res.status(200).json(rows[0])
}

export default handler
