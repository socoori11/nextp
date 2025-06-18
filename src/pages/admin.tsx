import React, { useEffect, useState } from 'react';
import styles from '@/styles/Admin.module.scss';
import dynamic from 'next/dynamic';
import Link from 'next/link';


import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = dynamic(() => import('@/com/LoginChart'), { ssr: false });

type AdminInfo = {
  id: number;
  name: string;
  birth: string;
  gender: string;
  address: string;
  phone: string;
};

type VipUser = {
  userid: string;
  name: string;
  phone: string;
  pointer: number;
};

const Admin = () => {
  const [stats, setStats] = useState<any>(null);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [admin1, setAdmin1] = useState<AdminInfo | null>(null);
  const [message, setMessage] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [chartData, setChartData] = useState<{ date: string, count: number }[]>([]);

  useEffect(() => {
    // 전체 통계 + VIP 명단
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        console.log('📦 받은 stats:', data);
        console.log('🔥 VIP 리스트:', data.vipList);
        setStats(data);
      });

    // 1주일 접속자 수
    fetch('/api/admin/weeklylogin')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((item: any) => {
          const d = new Date(item.date);
          const mmdd = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return { date: mmdd, count: item.count };
        });
        console.log('📊 차트데이터:', formatted);
        setChartData(formatted);
      });

    // 관리자 본인 정보
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        console.log('👤 관리자 응답:', data);
        if (data?.role === 'admin') {
          setAdmin(data)
        };
      });
      // 관리자 정보 2
      fetch('/api/info')
      .then(res => res.json())
      .then(data => {
        console.log('관리자 info 응답:', data); 
        if (data?.role === 'admin') {
           setAdmin1(data);
           setAdmin(data);
        }
      });
  }, []);

  const fchange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!admin) return;
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleUpdate = async () => {
    if (!admin) return;
    const res = await fetch('/api/admin/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin),
    });
    const data = await res.json();
    setMessage(res.ok ? '수정 완료' : data.error || '오류 발생');
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  return (
    <div className={styles.admin}>
      <h1>관리자 대시보드</h1>
      <div className={styles.outbox}>
        <div className={styles.leftbox}>
          <h2>■ 회원관리 정보 ■</h2>
          {stats && (
            <>
              <ul>
                <li>전체 회원 수: {stats.total} 명</li>
                <li>20대 이상 남자 회원 수: {stats.male20} 명</li>
                <li>20대 이상 여자 회원 수: {stats.female20} 명</li>
                <li>일반 회원 : {stats.normal} 명</li>
                <li>오늘 접속자 : {stats.todaylogins} 명</li>
              </ul>

              <h2>VIP 회원 명단</h2>
              <ul>
                {stats.vipList?.map((vip: VipUser, i: number) => (
                  <li key={i}>
                    {i + 1}위 - {vip.userid} / {vip.name} / {vip.phone} / 점수:{vip.pointer}점
                  </li>
                ))}
              </ul>
            </>
          )}

          <div>
            <h2>📈 최근 1주일 접속자 수</h2>
            <LineChart data={chartData} />
          </div>
        </div>

        <div className={styles.rightbox}>
          {admin && (
            <>
              <h2> 관리자 정보 수정</h2>
              <button className={styles.editbtn} onClick={toggleEdit}>
                {showEdit ? '숨기기' : '수정하기'}
              </button>

              <div className={`${styles.form} ${showEdit ? styles.open : ''}`}>
    <label>
      이 &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;름&nbsp; : &nbsp;
      <input
        type="text"
        name="name"
        value={admin.name || ''}
        onChange={fchange}
      />
    </label>

    <label>
      생년월일 &nbsp; : &nbsp;
      <input
        type="date"
        name="birth"
        value={admin.birth ? admin.birth.substring(0, 10) : ''}
        onChange={fchange}
      />
    </label>

    <label>
      성  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;별 &nbsp; : &nbsp;
      <select name="gender" value={admin.gender || ''} onChange={fchange}>
        <option value="M">남자</option>
        <option value="F">여자</option>
      </select>
    </label>

    <label>
      주 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;소 &nbsp;: &nbsp;
      <input
        type="text"
        name="address"
        value={admin.address || ''}
        onChange={fchange}
      />
    </label>

    <label>
      연 &nbsp;락 &nbsp;처 &nbsp;: &nbsp;
      <input
        type="text"
        name="phone"
        placeholder='하이폰을 포함하여 입력하세요'
        value={admin.phone || ''}
        onChange={fchange}
      />
    </label>

    <div>
      <button onClick={handleUpdate}>저장</button>
      <button
        type="button"
        onClick={() => {
          setAdmin({ ...admin1! });
          setShowEdit(false);
        }}
      >
        취소
      </button>
    </div>


    {message && <p>{message}</p>}
  </div>
            </>
          )}
        </div>

      </div>
      <div className={styles.msgLink}>
            <Link href="/message">📨 쪽지함 바로가기</Link>
        </div>
    </div>
  );
};

export default Admin;
