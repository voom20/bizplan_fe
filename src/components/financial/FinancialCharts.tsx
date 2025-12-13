/**
 * 파일명: FinancialCharts.tsx
 * 
 * 파일 용도:
 * 재무 차트 컴포넌트 모음 (공통화)
 * - 손익분기점 분석 차트
 * - Unit Economics 차트
 * 
 * 사용처:
 * - FinancialSimulation (wizard), PreviewFinancialForm (calculator)
 */

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { cn } from '../../lib/utils';

export interface ChartDataPoint {
  month: number;
  revenue: number;
  costs: number;
  profit: number;
}

interface BreakEvenChartProps {
  /** 차트 데이터 */
  data: ChartDataPoint[];
  /** 다크 모드 (기본값: true) */
  darkMode?: boolean;
  /** 높이 */
  height?: number;
  /** 추가 클래스 */
  className?: string;
}

/**
 * BreakEvenChart 컴포넌트
 * 
 * 역할:
 * - 12개월 손익분기점 분석 차트
 */
export const BreakEvenChart: React.FC<BreakEvenChartProps> = ({
  data,
  darkMode = true,
  height = 300,
  className,
}) => {
  const tooltipStyle = darkMode
    ? {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
      }
    : undefined;

  const axisColor = darkMode ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const gridColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

  return (
    <div className={cn(darkMode ? 'glass-card p-6' : '', className)}>
      <h3 className={cn(
        'text-lg font-semibold mb-6',
        darkMode ? 'text-white' : 'text-gray-900'
      )}>
        손익분기점 분석 (12개월)
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="month"
            stroke={axisColor}
            tick={{ fill: axisColor }}
            label={darkMode ? undefined : { value: '월', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            stroke={axisColor}
            tick={{ fill: axisColor }}
            label={darkMode ? undefined : { value: '금액 (백만원)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={darkMode ? { color: '#fff' } : undefined}
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `${label}개월차`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#22d3ee"
            name="매출"
            strokeWidth={2}
            dot={!darkMode}
          />
          <Line
            type="monotone"
            dataKey="costs"
            stroke="#f87171"
            name="비용"
            strokeWidth={2}
            dot={!darkMode}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#4ade80"
            name="이익"
            strokeWidth={2}
            dot={!darkMode}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface UnitEconomicsChartProps {
  /** LTV 값 */
  ltv: number;
  /** CAC 값 */
  cac: number;
  /** 다크 모드 (기본값: true) */
  darkMode?: boolean;
  /** 높이 */
  height?: number;
  /** 추가 클래스 */
  className?: string;
}

/**
 * UnitEconomicsChart 컴포넌트
 * 
 * 역할:
 * - LTV vs CAC 비교 차트
 */
export const UnitEconomicsChart: React.FC<UnitEconomicsChartProps> = ({
  ltv,
  cac,
  darkMode = true,
  height = 200,
  className,
}) => {
  const data = [
    { name: 'LTV', value: ltv, fill: '#4ade80' },
    { name: 'CAC', value: cac, fill: '#f87171' },
  ];

  const tooltipStyle = darkMode
    ? {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
      }
    : undefined;

  const axisColor = darkMode ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const gridColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

  return (
    <div className={cn(darkMode ? 'glass-card p-6' : '', className)}>
      <h3 className={cn(
        'text-lg font-semibold mb-6',
        darkMode ? 'text-white' : 'text-gray-900'
      )}>
        Unit Economics
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            stroke={axisColor}
            tick={{ fill: axisColor }}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            stroke={axisColor}
            tick={{ fill: axisColor }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className={cn(
        'text-sm mt-4 text-center',
        darkMode ? 'text-slate-500' : 'text-gray-600'
      )}>
        이상적인 비율: LTV ≥ 3 × CAC
      </p>
    </div>
  );
};

export default { BreakEvenChart, UnitEconomicsChart };

