import React, { useState } from 'react'
import styles from '@/styles/Login.module.scss'
import { useRouter } from 'next/router'

const Login = () => {
  const [userid, setUserid] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('로그인 성공! 홈으로 이동합니다.')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setMessage(data.error || '로그인 실패')
      }
    } catch (err) {
      console.error(err)
      setMessage('서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className={styles.loginWrap}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h2>로그인</h2>
        <label>
          아이디:
          <input
            type="text"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
          />
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">로그인</button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  )
}

export default Login
