import type { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import db from '@/lib/db'
import bcrypt from 'bcrypt'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: '로그인이 필요합니다' })

  const decoded: any = verify(token, process.env.JWT_SECRET!)
  const { name, birth, gender, address, phone, password } = req.body
  const birthDate = birth?.slice(0, 10);

  try {
    if (password) {
      const hashed = await bcrypt.hash(password, 10)
      await db.query(
        `UPDATE gusers SET name = ?, birth = ?, gender = ?, address = ?, phone = ?, password = ? WHERE id = ?`,
        [name, birthDate, gender, address, phone, hashed, decoded.id]
      )
    } else {
      await db.query(
        `UPDATE gusers SET name = ?, birth = ?, gender = ?, address = ?, phone = ? WHERE id = ?`,
        [name, birthDate, gender, address, phone, decoded.id]
      )
    }

    res.status(200).json({ message: '정보가 성공적으로 수정되었습니다' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '서버 오류 발생' })
  }
}

export default handler
