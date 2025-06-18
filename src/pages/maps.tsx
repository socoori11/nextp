import React, { useEffect } from 'react'
import axios from 'axios'

const MapPage2 = () => {
  useEffect(() => {
    const loadKakaoMap = async () => {
      const script = document.createElement('script')
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`
      script.async = true
      document.head.appendChild(script)

      script.onload = async () => {
        window.kakao.maps.load(async () => {
          const container = document.getElementById('map')
          const options = {
            center: new window.kakao.maps.LatLng(37.316, 126.838),
            level: 3,
          }
          const map = new window.kakao.maps.Map(container, options)

          try {
            // ✅ 주소 검색 API 호출
            const [originRes, destRes] = await Promise.all([
              axios.get('/api/kakao/geocode', { params: { address: '안산 중앙역' } }),
              axios.get('/api/kakao/geocode', { params: { address: '안산 코스모 프라자' } }),
            ])

            const origin = originRes.data.documents[0]
            const destination = destRes.data.documents[0]

            const originPos = new window.kakao.maps.LatLng(origin.y, origin.x)
            const destPos = new window.kakao.maps.LatLng(destination.y, destination.x)

            // ✅ 마커 표시
            new window.kakao.maps.Marker({ map, position: originPos })
            new window.kakao.maps.Marker({ map, position: destPos })

            map.setCenter(originPos)

            // ✅ [수정] directions API 호출
            const directionsRes = await axios.get('/api/kakao/directionss', {
              params: {
                origin: `${origin.x},${origin.y}`,               // 🔸 위도, 경도 순서에 주의
                destination: `${destination.x},${destination.y}`, // 🔸 동일
              },
            })

            // ✅ [수정] vertexes 경로 데이터 파싱
            const route = directionsRes.data.routes[0]
            const vertexes = route.sections[0].vertexes             // 🔸 핵심 수정

            if (vertexes && vertexes.length > 0) {
              const path: any[] = []
              for (let i = 0; i < vertexes.length; i += 2) {
                const lng = vertexes[i]
                const lat = vertexes[i + 1]
                if (typeof lat === 'number' && typeof lng === 'number') {
                  path.push(new window.kakao.maps.LatLng(lat, lng))
                }
              }

              // ✅ [추가] 폴리라인 생성
              const polyline = new window.kakao.maps.Polyline({
                map,
                path,
                strokeWeight: 5,
                strokeColor: '#ff0000',
                strokeOpacity: 0.9,
                strokeStyle: 'solid',
              })
              polyline.setMap(map)
            } else {
              console.warn('vertexes 정보 없음') // 🔸 [추가] 에러 디버깅
            }
          } catch (err) {
            console.error('지도 오류:', err) // 🔸 [추가] 에러 로그
          }
        })
      }
    }

    loadKakaoMap()
  }, [])

  return <div id="map" style={{ width: '100%', height: '100vh' }} />
}

export default MapPage2
