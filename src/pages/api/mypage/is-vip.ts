// pages/api/mypage/is-vip.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ isVip: false })

  const decoded: any = verify(token, process.env.JWT_SECRET!)
  const userId = decoded.id

  const [vipRows] = await db.query(
    'SELECT id FROM gusers ORDER BY pointer DESC LIMIT 3'
  )

  const vipIds = (vipRows as any[]).map((row) => row.id)

  res.status(200).json({ isVip: vipIds.includes(userId) })
}

export default handler
