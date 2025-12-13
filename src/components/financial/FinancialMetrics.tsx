/**
 * 파일명: FinancialMetrics.tsx
 * 
 * 파일 용도:
 * 재무 핵심 지표 표시 컴포넌트 (공통화)
 * - LTV, LTV/CAC, 손익분기점 등 표시
 * - 수익성 경고
 * 
 * 사용처:
 * - FinancialSimulation (wizard), PreviewFinancialForm (calculator)
 */

import React from 'react';
import { DollarSign, TrendingUp, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface FinancialMetricsData {
  revenue: number;
  ltv: number;
  ltvCacRatio: number;
  breakEvenPoint: number;
}

interface FinancialMetricsProps {
  /** 지표 데이터 */
  metrics: FinancialMetricsData;
  /** 다크 모드 (기본값: true) */
  darkMode?: boolean;
  /** 추가 클래스 */
  className?: string;
}

/**
 * FinancialMetrics 컴포넌트
 * 
 * 역할:
 * - 핵심 재무 지표 카드 표시
 * - LTV/CAC 경고 표시
 */
export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({
  metrics,
  darkMode = true,
  className,
}) => {
  const ltvCacWarning = metrics.ltvCacRatio < 3;

  if (darkMode) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-neon-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">핵심 지표</h3>
          </div>
          <Badge variant={ltvCacWarning ? 'warning' : 'success'}>
            {ltvCacWarning ? (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                개선 필요
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                건강한 지표
              </>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<DollarSign className="w-4 h-4" />}
            label="월 매출"
            value={formatCurrency(metrics.revenue)}
            color="cyan"
            darkMode
          />
          <MetricCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="LTV"
            value={formatCurrency(metrics.ltv)}
            color="neon"
            darkMode
          />
          <MetricCard
            icon={<Target className="w-4 h-4" />}
            label="LTV/CAC"
            value={`${metrics.ltvCacRatio.toFixed(1)}x`}
            color={ltvCacWarning ? 'red' : 'neon'}
            darkMode
          />
          <MetricCard
            icon={<Target className="w-4 h-4" />}
            label="손익분기점"
            value={`${formatNumber(metrics.breakEvenPoint)}명`}
            color="violet"
            darkMode
          />
        </div>

        {ltvCacWarning && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-400 mb-1">수익성 경고</div>
              <p className="text-sm text-slate-400">
                LTV/CAC 비율이 3 미만입니다. 고객 획득 비용을 낮추거나 고객 생애가치를 높이는 전략이 필요합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 라이트 모드 (wizard용)
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">핵심 지표</h3>
        <Badge variant={ltvCacWarning ? 'warning' : 'success'}>
          {ltvCacWarning ? (
            <>
              <AlertCircle className="w-3 h-3 mr-1" />
              개선 필요
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 mr-1" />
              건강한 지표
            </>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={<DollarSign className="w-4 h-4" />}
          label="월 매출"
          value={formatCurrency(metrics.revenue)}
          color="blue"
        />
        <MetricCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="LTV"
          value={formatCurrency(metrics.ltv)}
          color="green"
        />
        <MetricCard
          icon={<Target className="w-4 h-4" />}
          label="LTV/CAC"
          value={`${metrics.ltvCacRatio.toFixed(1)}x`}
          color={ltvCacWarning ? 'red' : 'green'}
        />
        <MetricCard
          icon={<Target className="w-4 h-4" />}
          label="손익분기점"
          value={`${formatNumber(metrics.breakEvenPoint)}명`}
          color="purple"
        />
      </div>

      {ltvCacWarning && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900 mb-1">수익성 경고</div>
            <p className="text-sm text-red-700">
              LTV/CAC 비율이 3 미만입니다. 고객 획득 비용을 낮추거나 고객 생애가치를 높이는 전략이 필요합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// 내부 컴포넌트: 지표 카드
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'cyan' | 'neon' | 'violet' | 'red' | 'blue' | 'green' | 'purple';
  darkMode?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color, darkMode = false }) => {
  const darkColors = {
    cyan: 'text-cyan-400',
    neon: 'text-neon-400',
    violet: 'text-violet-400',
    red: 'text-red-400',
    blue: 'text-cyan-400',
    green: 'text-neon-400',
    purple: 'text-violet-400',
  };

  const lightColors = {
    cyan: 'bg-blue-50 text-blue-600',
    neon: 'bg-green-50 text-green-600',
    violet: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const lightTextColors = {
    cyan: 'text-blue-900',
    neon: 'text-green-900',
    violet: 'text-purple-900',
    red: 'text-red-900',
    blue: 'text-blue-900',
    green: 'text-green-900',
    purple: 'text-purple-900',
  };

  if (darkMode) {
    return (
      <div className="glass-card-hover p-4">
        <div className={cn('flex items-center gap-2 mb-2', darkColors[color])}>
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className={cn('text-2xl font-bold', color === 'red' ? 'text-red-400' : 'text-white')}>
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-lg p-4', lightColors[color])}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className={cn('text-2xl font-bold', lightTextColors[color])}>
        {value}
      </div>
    </div>
  );
};

export default FinancialMetrics;

