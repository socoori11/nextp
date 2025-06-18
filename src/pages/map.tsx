import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import styles from '@/styles/Map.module.scss'

declare global {
  interface Window {
    kakao: any
  }
}

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadKakaoMap = async () => {
      if (!window.kakao || !window.kakao.maps) return

      const mapContainer = mapRef.current
      const map = new window.kakao.maps.Map(mapContainer, {
        center: new window.kakao.maps.LatLng(37.316, 126.838),
        level: 3,
      })

      try {
        // 출발지
        const originRes = await axios.get('/api/kakao/geocode', {
          params: { address: '안산 중앙역' },
        })
        const origin = originRes.data.documents[0]
        const originLatLng = new window.kakao.maps.LatLng(origin.y, origin.x)

        const originMarker = new window.kakao.maps.Marker({
          map,
          position: originLatLng,
        })

        const originContent = document.createElement('div')
        originContent.className = 'customoverlay'
        originContent.innerHTML = `
          <div style="
            position:relative;
            background:#fff;
            padding:20px 15px 10px;
            border:1px solid #333;
            border-radius:8px;
            color:#000;
            font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            z-index:10;
          ">
            <div style="
              position:absolute;
              top:5px;
              right:8px;
              cursor:pointer;
              font-weight:normal;
              color:red;
            " id="closeOrigin">X</div>
            <div style="margin-top:10px;">출발지: 안산 중앙역</div>
          </div>
        `

        const originOverlay = new window.kakao.maps.CustomOverlay({
          position: originLatLng,
          content: originContent,
          yAnchor: 0.9,
          xAnchor: -0.2,
        })

        originOverlay.setMap(map)

        originMarker.addListener('click', () => {
          originOverlay.setMap(map)
        })

        originContent.querySelector('#closeOrigin')?.addEventListener('click', () => {
          originOverlay.setMap(null)
        })

        // 도착지
        const destRes = await axios.get('/api/kakao/geocode', {
          params: { address: '안산 코스모 프라자' },
        })
        const destination = destRes.data.documents[0]
        const destLatLng = new window.kakao.maps.LatLng(destination.y, destination.x)

        const destMarker = new window.kakao.maps.Marker({
          map,
          position: destLatLng,
        })

        const destContent = document.createElement('div')
        destContent.className = 'customoverlay'
        destContent.innerHTML = `
          <div style="
            position:relative;
            background:#fff;
            padding:20px 15px 10px;
            border:1px solid #333;
            border-radius:8px;
            color:#000;
            font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            z-index:10;
          ">
            <div style="
              position:absolute;
              top:5px;
              right:8px;
              cursor:pointer;
              font-weight:normal;
              color:red;
            " id="closeDest">X</div>
            <div style="margin-top:10px;">도착지: 라인컴퓨터아트학원</div>
          </div>
        `

        const destOverlay = new window.kakao.maps.CustomOverlay({
          position: destLatLng,
          content: destContent,
          yAnchor: 0.9,
          xAnchor:-0.1,
        })

        destOverlay.setMap(map)

        destMarker.addListener('click', () => {
          destOverlay.setMap(map)
        })

        destContent.querySelector('#closeDest')?.addEventListener('click', () => {
          destOverlay.setMap(null)
        })

        // 지도 범위 설정
        const bounds = new window.kakao.maps.LatLngBounds()
        bounds.extend(originLatLng)
        bounds.extend(destLatLng)
        map.setBounds(bounds)

        // 길찾기 요청
        const directionsRes = await axios.get('/api/kakao/directions', {
          params: {
            origin: `${origin.x},${origin.y}`,
            destination: `${destination.x},${destination.y}`,
          },
        })

        const roads = directionsRes.data.routes[0]?.sections[0]?.roads
        const path: any[] = []

        if (roads && roads.length > 0) {
          roads.forEach((road: any) => {
            const vertexes = road.vertexes
            for (let i = 0; i < vertexes.length; i += 2) {
              const x = vertexes[i]
              const y = vertexes[i + 1]
              path.push(new window.kakao.maps.LatLng(y, x))
            }
          })

          const polyline = new window.kakao.maps.Polyline({
            path,
            strokeWeight: 5,
            strokeColor: '#FF5500',
            strokeOpacity: 0.8,
            strokeStyle: 'solid',
          })
          polyline.setMap(map)
        } else {
          console.warn('경로를 찾을 수 없습니다.')
        }
      } catch (err: any) {
        console.error('지도 또는 길찾기 오류:', err.message)
      }
    }

    // Kakao Map SDK 불러오기
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap()
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
      script.onload = () => {
        window.kakao.maps.load(loadKakaoMap)
      }
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div className={styles.mapContainer}>
      <h1 className={styles.title}>찾아오시는길</h1>
      <div className={styles.mapBox} ref={mapRef} />
    </div>
  )
}

export default MapPage
