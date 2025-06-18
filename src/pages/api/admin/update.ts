import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { name, phone, birth, gender, address } = req.body;
  const birthOnly = birth?.substring(0, 10); // MySQL DATE 형식 보정

  // if (!id) return res.status(400).json({ error: 'ID 없음' });

  try {

    await db.query(
      `UPDATE gusers SET name = ?, phone = ?, birth = ?, gender = ?, address = ?  WHERE name = 'admin'`,
      [name, phone, birthOnly, gender, address]
    );
    res.status(200).json({ message: '관리자 정보 수정 완료' });
  } catch (err) {
    console.error('❌ DB 오류:', err);
    res.status(500).json({ error: 'DB 오류' });
  }
};

export default handler;
