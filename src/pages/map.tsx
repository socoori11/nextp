import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import styles from '@/styles/Map.module.scss'

declare global {
  interface Window {
    kakao: any
  }
}

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [originAddress, setOriginAddress] = useState('안산 중앙역')
  const [isMapReady, setIsMapReady] = useState(false)

  // ✅ 추가: 기존 요소를 저장할 ref
  const originMarkerRef = useRef<any>(null)
  const originOverlayRef = useRef<any>(null)
  const polylineRef = useRef<any>(null)

  // ✅ 추가: 예상 소요 시간 상태 (초 단위로 저장)
  const [duration, setDuration] = useState<number | null>(null)

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setIsMapReady(true))
    } else {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
      script.onload = () => {
        window.kakao.maps.load(() => setIsMapReady(true))
      }
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.316, 126.838),
      level: 2,
    })
    mapInstance.current = map

    map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.TRAFFIC)

    loadKakaoMap(originAddress)
  }, [isMapReady])

  const loadKakaoMap = async (address: string) => {
    if (!mapInstance.current) return
    const map = mapInstance.current

    try {
      // ✅ 이전 마커, 오버레이, 경로 제거
      originMarkerRef.current?.setMap(null)
      originOverlayRef.current?.setMap(null)
      polylineRef.current?.setMap(null)

      // 출발지 좌표 요청
      const originRes = await axios.get('/api/kakao/geocode', {
        params: { address },
      })
      const origin = originRes.data.documents[0]
      const originLatLng = new window.kakao.maps.LatLng(origin.y, origin.x)

      // 출발지 마커 및 오버레이 생성
      const originMarker = new window.kakao.maps.Marker({
        map,
        position: originLatLng,
      })
      const originOverlay = new window.kakao.maps.CustomOverlay({
        map,
        position: originLatLng,
        content: `<div style="padding:8px 10px; background:darkgreen; color:white; border-radius:4px; border:1px solid gray;">출발지: ${address}</div>`,
        yAnchor: 1,
        xAnchor: -0.1,
      })

      originMarkerRef.current = originMarker
      originOverlayRef.current = originOverlay

      // 도착지
      const destRes = await axios.get('/api/kakao/geocode', {
        params: { address: '안산 코스모 프라자' },
      })
      const destination = destRes.data.documents[0]
      const destLatLng = new window.kakao.maps.LatLng(destination.y, destination.x)

      const destMarker = new window.kakao.maps.Marker({
        position: destLatLng,
      })
      destMarker.setMap(map)

      const destOverlay = new window.kakao.maps.CustomOverlay({
      
        position: destLatLng,
        content: `<div style="padding:8px 10px; background:gold; color:#333; border-radius:4px; border:1px solid gray;">도착지: 라인컴퓨터아트학원</div>`,
        yAnchor: 1,
      })
      destOverlay.setMap(map)

      const bounds = new window.kakao.maps.LatLngBounds()
      bounds.extend(originLatLng)
      bounds.extend(destLatLng)
      map.setBounds(bounds)

      // 경로 API 요청
      const directionsRes = await axios.get('/api/kakao/directions', {
        params: {
          origin: `${origin.x},${origin.y}`,
          destination: `${destination.x},${destination.y}`,
        },
      })

      // ✅ 추가: duration 추출 (초 단위)
      const summary = directionsRes.data.routes[0]?.summary
      if (summary && typeof summary.duration === 'number') {
        setDuration(summary.duration) // ✅ 상태로 저장
      } else {
        setDuration(null) // 혹시 몰라 초기화
      }

      const roads = directionsRes.data.routes[0]?.sections[0]?.roads
      const path: any[] = []

      if (roads) {
        roads.forEach((road: any) => {
          const vertexes = road.vertexes
          for (let i = 0; i < vertexes.length; i += 2) {
            path.push(new window.kakao.maps.LatLng(vertexes[i + 1], vertexes[i]))
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
        polylineRef.current = polyline
      }
    } catch (err) {
      console.error('지도 또는 길찾기 오류:', err)
      setDuration(null) // 오류 시 초기화
    }
  }

  return (
    <div className={styles.mapContainer}>
      <h1 className={styles.title}>찾아오시는길</h1>

      <div className={styles.inputBox}>
        <input
          type="text"
          value={originAddress}
          onChange={(e) => setOriginAddress(e.target.value)}
          placeholder="출발지를 입력하세요"
        />
        <button onClick={() => loadKakaoMap(originAddress)}>길찾기</button>
      </div>

      {/* ✅ 메시지 표시 영역 */}
      <p className={styles.msgcon}>
        출발지를 입력하세요. 실시간 교통상황과 안내도가 지원됩니다.<br />
        {duration !== null && (
          <span>예상 소요 시간: {Math.ceil(duration / 60)}분</span>
        )}
      </p>

      <div className={styles.mapBox} ref={mapRef} />
    </div>
  )
}

export default MapPage
