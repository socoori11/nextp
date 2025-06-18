import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import db from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: '토큰 없음' });

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: number };
    const [rows] = await db.query('SELECT * FROM gusers WHERE id = ?', [decoded.id]);
    const user = (rows as any[])[0];
    if (!user || user.role !== 'admin') return res.status(403).json({ error: '관리자만 접근 가능' });

    res.status(200).json(user);
  } catch (err) {
    console.error('토큰 오류:', err);
    res.status(401).json({ error: '유효하지 않은 토큰' });
  }
};

export default handler;
