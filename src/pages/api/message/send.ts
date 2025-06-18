import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.cookies.token
  if (!token) return res.status(401).json({ error: '로그인 필요' })

  const decoded = verify(token, process.env.JWT_SECRET!)
  const senderId = (decoded as any).id

  const { receiverUserid, content } = req.body

  if (!receiverUserid || !content) {
    return res.status(400).json({ error: '모든 값을 입력하세요' })
  }

  try {
    const [rows] = await db.query('SELECT id FROM gusers WHERE userid = ?', [receiverUserid])
    const receiver = (rows as any[])[0]

    if (!receiver) return res.status(404).json({ error: '수신자 ID가 존재하지 않습니다' })
    if (receiver.id === senderId) return res.status(400).json({ error: '자기 자신에게 보낼 수 없습니다' })

    await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiver.id, content]
    )

    return res.status(200).json({ message: '쪽지 전송 완료' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: '서버 오류' })
  }
}

export default handler
