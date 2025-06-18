// /pages/api/message/inbox.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않은 요청입니다.' })
  }

  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!)
    const userId = (decoded as any).id

    const [rows] = await db.query(
      `
      SELECT 
        m.id, 
        m.content, 
        m.sent_at, 
        m.is_read,
        g.userid AS sender_userid, 
        g.name AS sender_name
      FROM messages m
      JOIN gusers g ON m.sender_id = g.id
      WHERE m.receiver_id = ?
      ORDER BY m.sent_at DESC
      `,
      [userId]
    )

    return res.status(200).json(rows)
  } catch (err) {
    console.error('받은 쪽지 조회 오류:', err)
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}

export default handler
