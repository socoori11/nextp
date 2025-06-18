import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/lib/db'
import bcrypt from 'bcrypt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end()

  const { userid, email, password, name, phone, birth, gender, address } = req.body

  try {
    const [exist] = await db.query('SELECT * FROM gusers WHERE userid = ?', [userid])
    if ((exist as any[]).length > 0) {
      return res.status(400).json({ error: '이미 존재하는 아이디입니다.' })
    }

    const hash = await bcrypt.hash(password, 10)

    await db.query(
      `INSERT INTO gusers (userid, email, password, name, phone, birth, gender, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userid, email, hash, name, phone, birth, gender, address]
    )

    res.status(200).json({ message: '가입 성공' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류' })
  }
}

export default handler
