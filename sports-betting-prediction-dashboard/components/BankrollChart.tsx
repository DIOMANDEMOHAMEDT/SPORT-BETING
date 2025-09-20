
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BankrollDataPoint } from '../types';

interface BankrollChartProps {
  data: BankrollDataPoint[];
}

const BankrollChart: React.FC<BankrollChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
        />
        <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value} u`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: '#1f2937',
                borderColor: '#4b5563',
                borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#d1d5db' }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}}/>
        <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#34d399" 
            strokeWidth={2} 
            dot={false}
            name="Bankroll" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BankrollChart;
