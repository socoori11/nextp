// pages/about.tsx
import React, { useEffect, useState } from 'react'
import styles from '@/styles/About.module.scss'

const About = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={styles.aboutWrapper}>
      {/* 중앙 Welcome 텍스트 */}
      <div
        className={styles.heroSection}
        style={{
          opacity: scrollY < 100 ? 1 : 0,
          pointerEvents: scrollY < 100 ? 'auto' : 'none',
        }}
      >
        <h1 className={styles.heroText}>Welcome to About Page</h1>
        <div className={styles.scrollDown}>↓ Scroll down</div>
      </div>

      {/* 좌우 분할 콘텐츠 */}
      <div
        className={styles.contentSection}
        style={{ opacity: scrollY > 100 ? 1 : 0 }}
      >
        <div className={styles.leftArea}>
          {/* 이미지 2개 */}
          <div
            className={`${styles.card} ${styles.item0}`}
            style={{
              transform: scrollY > 150 ? 'translateY(0)' : 'translateY(50px)',
              opacity: scrollY > 150 ? 1 : 0,
              transitionDelay: `0s`,
            }}
          >
            <img src="/img/img2.png" alt="img2" />
          </div>
          <div
            className={`${styles.card} ${styles.item1}`}
            style={{
              transform: scrollY > 150 ? 'translateY(0)' : 'translateY(50px)',
              opacity: scrollY > 150 ? 1 : 0,
              transitionDelay: `0.4s`,
            }}
          >
            <img src="/img/img3.jpg" alt="img3" />
          </div>

          {/* 동영상 2개 */}
          <div
            className={`${styles.card} ${styles.item2}`}
            style={{
              transform: scrollY > 150 ? 'translateY(0)' : 'translateY(50px)',
              opacity: scrollY > 150 ? 1 : 0,
              transitionDelay: `0.8s`,
            }}
          >
            <video src="/move/car2.mp4" muted autoPlay loop playsInline />
          </div>
          <div
            className={`${styles.card} ${styles.item3}`}
            style={{
              transform: scrollY > 150 ? 'translateY(0)' : 'translateY(50px)',
              opacity: scrollY > 150 ? 1 : 0,
              transitionDelay: `1.2s`,
            }}
          >
            <video src="/move/car3.mp4" muted autoPlay loop playsInline />
          </div>
        </div>

        {/* 오른쪽 설명 */}
        <div className={styles.rightArea}>
          <p className={styles.description}>
            This section tells you more about the page. Images and videos appear
            one by one in a zigzag layout to give you a dynamic experience.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
