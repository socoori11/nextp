// ✅ /pages/api/kakao/directions.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { origin, destination } = req.query

  if (
    !origin ||
    !destination ||
    typeof origin !== 'string' ||
    typeof destination !== 'string'
  ) {
    return res.status(400).json({ error: '출발지와 도착지를 정확히 입력하세요.' })
  }

  try {
    const kakaoRes = await axios.get('https://apis-navi.kakaomobility.com/v1/directions', {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      params: {
        origin,        // 예: "126.8388,37.3160"
        destination,   // 예: "126.8310,37.3161"
      },
    })

    res.status(200).json(kakaoRes.data)
  } catch (error: any) {
    console.error('Kakao 길찾기 오류:', error.response?.data || error.message)
    res.status(500).json({ error: '길찾기 요청 실패', details: error.message })
  }
}

export default handler
