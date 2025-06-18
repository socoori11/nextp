// ✅ /pages/api/kakao/geocode.ts (장소명 검색 API 사용)
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: '주소가 필요합니다.' })
  }

  try {
    const kakaoRes = await axios.get(
      'https://dapi.kakao.com/v2/local/search/keyword.json',
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
        params: {
          query: address, // 지명, 장소명, 역명 포함 가능
        },
      }
    )

    if (!kakaoRes.data.documents || kakaoRes.data.documents.length === 0) {
      return res.status(404).json({ error: `장소를 찾을 수 없습니다: ${address}` })
    }

    res.status(200).json(kakaoRes.data)
  } catch (error: any) {
    console.error('Kakao 장소 검색 오류:', error.response?.data || error.message)
    res.status(500).json({ error: '카카오 장소 검색 실패', details: error.message })
  }
}

export default handler
