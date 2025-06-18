import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/lib/db'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import bcrypt from 'bcrypt'  // 추가

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 요청 방식입니다.' })
  }

  const { userid, password } = req.body

  try {
    const [rows] = await db.query('SELECT * FROM gusers WHERE userid = ?', [userid])
    const user = (rows as any[])[0]

    if (!user) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 틀렸습니다.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)  // 해시 비교

    if (!isMatch) {
      return res.status(401).json({ error: '비밀번호가 틀렸습니다.' })
    }

    // 포인터 +10 증가
    await db.query('UPDATE gusers SET pointer = pointer + 10 WHERE id = ?', [user.id])

    // 로그인 기록 저장
    await db.query('INSERT INTO logins (user_id) VALUES (?)', [user.id])

    // JWT 생성
    const token = jwt.sign(
      {
        id: user.id,
        userid: user.userid,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 쿠키에 저장
    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 0.1 ,
    })

    res.setHeader('Set-Cookie', cookie)
    res.status(200).json({ message: '로그인 성공' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '서버 오류가 발생했습니다.' })
  }
}

export default handler
