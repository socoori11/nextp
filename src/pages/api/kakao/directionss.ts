// ✅ /pages/api/kakao/directions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler2 = async (req: NextApiRequest, res: NextApiResponse) => {
  const { origin, destination } = req.query

  if (
    !origin ||
    !destination ||
    typeof origin !== 'string' ||
    typeof destination !== 'string'
  ) {
    return res.status(400).json({ error: 'origin과 destination이 필요합니다.' })
  }

  try {
    const kakaoRes = await axios.get('https://apis-navi.kakao.com/v1/directions', {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      params: {
        origin,
        destination,
        priority: 'DISTANCE', // ✅ 가장 가까운 도보 경로 우선
        car_fuel: 'GASOLINE', // 무관
        alternatives: false, // 한 개의 경로만 받음
      },
    })

    const data = kakaoRes.data

    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: '경로를 찾을 수 없습니다.' })
    }

    res.status(200).json(data)
  } catch (error: any) {
    console.error('길찾기 오류:', error.response?.data || error.message)
    res.status(500).json({ error: '길찾기 실패', detail: error.message })
  }
}

export default handler2
