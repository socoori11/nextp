//npm install swiper framer-motion


import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from '@/styles/Main.module.scss';

const videos = [
  { src: '/move/car2.mp4', text: '새로운 세상을 향해' },
  { src: '/move/car3.mp4', text: '기술의 진보를 경험하다' },
  { src: '/move/car5.mp4', text: '내일을 바꾸는 움직임' },
];

const Main = () => {
  return (
    <div className={styles.main}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className={styles.swiper}
      >
        {videos.map((item, idx) => (
          <SwiperSlide key={idx} className={styles.slide}>
            <video
              className={styles.video}
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
            />
            <motion.div
              className={styles.text}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: '0%', opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              key={item.text} // 슬라이드마다 새로 애니메이션 적용
            >
              {item.text}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Main;
