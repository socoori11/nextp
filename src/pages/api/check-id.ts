import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/lib/db'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userid } = req.query

  try {
    const [rows] = await db.query('SELECT * FROM gusers WHERE userid = ?', [userid])
    const exists = (rows as any[]).length > 0
    res.status(200).json({ exists })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'DB 오류' })
  }
}

export default handler
