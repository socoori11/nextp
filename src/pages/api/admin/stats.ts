import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    // 전체 회원 수
    const [totalRows] = await db.query('SELECT COUNT(*) AS total FROM gusers');
    const total = totalRows[0].total;

    // 20세 이상 남자 회원 수
    const [male20Rows] = await db.query(`
      SELECT COUNT(*) AS male20 
      FROM gusers 
      WHERE gender = 'M' 
        AND TIMESTAMPDIFF(YEAR, STR_TO_DATE(birth, '%Y-%m-%d'), CURDATE()) >= 20
    `);
    const male20 = male20Rows[0].male20;

    // 20세 이상 여자 회원 수
    const [female20Rows] = await db.query(`
      SELECT COUNT(*) AS female20 
      FROM gusers 
      WHERE gender = 'F' 
        AND TIMESTAMPDIFF(YEAR, STR_TO_DATE(birth, '%Y-%m-%d'), CURDATE()) >= 20
    `);
    const female20 = female20Rows[0].female20;

    // 일반 등급 회원 수
    const [normalRows] = await db.query(`
      SELECT COUNT(*) AS normal 
      FROM gusers 
      WHERE role = 'user'
    `);
    const normal = normalRows[0].normal;

    // 오늘 로그인한 사용자 수 (중복 제거)
    const [loginRows] = await db.query(`
      SELECT COUNT(DISTINCT user_id) AS todaylogins 
      FROM logins 
      WHERE DATE(login_time) = CURDATE()
    `);
    const todaylogins = loginRows[0].todaylogins;

    interface VIPUser extends RowDataPacket {
      userid: string
      name: string
      phone: string
      pointer: number
    }

    // VIP 회원 명단 (Top 3)
    const [vipRows] = await db.query<VIPUser[]>(`
      SELECT userid, name, phone, pointer
      FROM gusers 
      ORDER BY pointer DESC 
      LIMIT 3
    `);
    const vipList = vipRows.map((row: any) => ({
      userid: row.userid,
      name: row.name,
      phone: row.phone,
      pointer: row.pointer,
    }));

    // 최종 응답
    res.status(200).json({
      total,
      male20,
      female20,
      normal,
      todaylogins,
      vipList,
    });
  } catch (err) {
    console.error('stats API 오류:', err);
    res.status(500).json({ error: '서버 오류' });
  }
};

export default handler;
