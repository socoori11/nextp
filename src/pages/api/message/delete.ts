// /pages/api/message/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: '허용되지 않은 요청입니다.' })
  }

  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' })
  }

  const { messageId } = req.body
  if (!messageId) {
    return res.status(400).json({ error: '쪽지 ID가 필요합니다.' })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!)
    const userId = (decoded as any).id

    // 본인이 받은 쪽지인지 확인
    const [rows] = await db.query(
      'SELECT * FROM messages WHERE id = ? AND receiver_id = ?',
      [messageId, userId]
    )
    const message = (rows as any[])[0]

    if (!message) {
      return res.status(403).json({ error: '삭제 권한이 없습니다.' })
    }

    await db.query('DELETE FROM messages WHERE id = ?', [messageId])

    return res.status(200).json({ message: '쪽지가 삭제되었습니다.' })
  } catch (err) {
    console.error('쪽지 삭제 오류:', err)
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}

export default handler
