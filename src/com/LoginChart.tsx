import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList
} from 'recharts'

const LoginChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="80%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip /> 
        <Line
          type="monotone"
          dataKey="count"
          stroke="#8884d8"
          strokeWidth={3}
        >
          {/* 이 부분이 숫자를 항상 보여줌 */}
          <LabelList dataKey="count" position="top" />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LoginChart
