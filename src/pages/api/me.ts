// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: '토큰 없음' })

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: number }
    const [rows] = await db.query('SELECT id, userid, role FROM gusers WHERE id = ?', [decoded.id])
    const user = (rows as any[])[0]
    if (!user) return res.status(404).json({ error: '사용자 없음' })

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(401).json({ error: '유효하지 않은 토큰' })
  }
}

export default handler
