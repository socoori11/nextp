// /pages/api/admin/weekly-logins.ts
import { NextApiRequest, NextApiResponse } from 'next'
import db from '@/lib/db'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  
  const [rows] = await db.query(`
    SELECT
      DATE(login_time) as date,
      COUNT(*) as count
    FROM logins
    WHERE login_time >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(login_time)
    ORDER BY DATE(login_time)
  `)
  res.status(200).json(rows)
}

export default handler
