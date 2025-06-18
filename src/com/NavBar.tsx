import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '@/styles/NavBar.module.scss'
import { useRouter } from 'next/router'

type UserInfo = {
  id: number
  userid: string
  role: string
}

const NavBar = () => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const router = useRouter()

  const checkLogin = async () => {
    try {
      const res = await fetch('/api/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    }
  }

  const logout = async () => {
    await fetch('/api/logout')
    setUser(null)
    router.push('/')
  }

  useEffect(() => {
    checkLogin()

    const routerChange = () => {
      checkLogin()
    }
    router.events.on('routeChangeComplete', routerChange)

    return () => {
      router.events.off('routeChangeComplete', routerChange)
    }
  }, [router.pathname])

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href='/'>NEXT_LOGO</Link>
      </div>
      <ul className={styles.menu}>
        <li><Link href="/">홈으로</Link></li>
        <li><Link href="/about">회사소개</Link></li>
        <li><Link href="/map">찾아오시는길</Link></li>

        {!user ? (
          <>
            <li><Link href="/login">로그인</Link></li>
            <li><Link href="/signup">회원가입</Link></li>
          </>
        ) : (
          <>
            {user.role === 'admin' ? (
              <li><Link href="/admin">관리자 페이지</Link></li>
            ) : (
              <li><Link href="/mypage">마이페이지</Link></li>
            )}
            <li><button className={styles.logoutbtn} onClick={logout}>로그아웃</button></li>
          </>
        )}
      </ul>
    </div>
  )
}

export default NavBar
