import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/Mypage.module.scss'

type UserInfo = {
  id: number
  userid: string
  name: string
  birth: string
  gender: string
  address: string
  phone: string
}

const Mypage = () => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loginCount, setLoginCount] = useState(0)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isVip, setIsVip] = useState(false)

  useEffect(() => {
    fetch('/api/mypage/info')
      .then((res) => res.json())
      .then((data) => setUser(data))

    fetch('/api/mypage/logincount')
      .then((res) => res.json())
      .then((data) => setLoginCount(data.count))

    fetch('/api/mypage/is-vip')
      .then((res) => res.json())
      .then((data) => setIsVip(data.isVip))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleUpdate = async () => {
    const res = await fetch('/api/mypage/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, password }),
    })
    const data = await res.json()
    setMessage(data.message)
    setPassword('')
  }

  const handleDelete = async () => {
    if (confirm('정말 탈퇴하시겠습니까?')) {
      const res = await fetch('/api/mypage/delete', { method: 'POST' })
      const data = await res.json()
      setMessage(data.message)
      if (res.ok) {
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    } else {
      alert('탈퇴 취소')
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className={styles.myoutbox}>
    <div className={styles.mypage}>
      <h2>마이페이지</h2>
      {isVip && <div className={styles.vipTag}>💎 VIP 회원입니다</div>}
      <p>총 로그인 횟수: {loginCount}회</p>

      <label>아이디: <input value={user.userid} disabled /> &nbsp;&nbsp;아이디는 수정할 수 없습니다</label>
      <label>비밀번호: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <label>이름: <input name="name" value={user.name} onChange={handleChange} /></label>
      <label>생년월일: <input name="birth" value={user.birth.slice(0, 10)} onChange={handleChange} /></label>
      <label>성별: <input name="gender" value={user.gender} onChange={handleChange} /></label>
      <label>주소: <input name="address" value={user.address} onChange={handleChange} /></label>
      <label>연락처: <input name="phone" value={user.phone} onChange={handleChange} /></label>

      <button onClick={handleUpdate}>정보 수정</button>
      <button onClick={handleDelete}>회원 탈퇴</button>

      <div className={styles.links}>
        <Link href="/message">📨 쪽지함 바로가기</Link>
      </div>

      {message && <p>{message}</p>}
    </div>
    </div>
  )
}

export default Mypage
