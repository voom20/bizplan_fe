/**
 * 파일명: PreviewFinancialForm.tsx
 * 
 * 파일 용도:
 * 독립형 재무 계산기 폼 컴포넌트
 * - 비로그인 사용자용 재무 입력 폼
 * - 실시간 계산 및 결과 표시
 * - 차트 시각화 (손익분기점, Unit Economics)
 * 
 * 호출 구조:
 * PreviewFinancialForm (이 컴포넌트)
 *   ├─> 입력 폼 (초기 자본, ARPU, CAC 등)
 *   ├─> 핵심 지표 카드 (LTV, LTV/CAC, 손익분기점)
 *   └─> Recharts 차트 (LineChart, BarChart)
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  CheckCircle2,
  Users,
  Percent,
  Calculator
} from 'lucide-react';
import { Input, Badge } from '@/components';
import { formatCurrency, formatNumber, debounce } from '@/common/utils';
import { cn } from '@/common/utils';

/** 재무 입력 데이터 타입 */
export interface FinancialInput {
  initialCapital: number;      // 초기 자본
  customers: number;           // 예상 고객 수
  pricePerCustomer: number;    // 객단가 (ARPU)
  cac: number;                 // 고객 획득 비용
  fixedCosts: number;          // 고정비
  variableCostRate: number;    // 변동비율 (%)
  churnRate: number;           // 이탈률 (%)
}

/** 계산된 지표 타입 */
interface FinancialMetrics {
  revenue: number;
  totalCosts: number;
  profit: number;
  ltv: number;
  ltvCacRatio: number;
  breakEvenPoint: number;
  breakEvenMonth: number;
}

/** 차트 데이터 타입 */
interface ChartDataPoint {
  month: number;
  revenue: number;
  costs: number;
  profit: number;
  cumulativeProfit: number;
}

interface PreviewFinancialFormProps {
  /** 입력값 변경 시 콜백 */
  onInputChange?: (input: FinancialInput) => void;
  /** 초기값 */
  initialValues?: Partial<FinancialInput>;
}

// 기본값
const DEFAULT_INPUT: FinancialInput = {
  initialCapital: 50000000,
  customers: 100,
  pricePerCustomer: 50000,
  cac: 30000,
  fixedCosts: 5000000,
  variableCostRate: 20,
  churnRate: 5,
};

/**
 * PreviewFinancialForm 컴포넌트
 * 
 * 역할:
 * - 독립형 재무 계산기
 * - 실시간 지표 계산
 * - 시각화 차트 제공
 */
export const PreviewFinancialForm: React.FC<PreviewFinancialFormProps> = ({
  onInputChange,
  initialValues,
}) => {
  const [searchParams] = useSearchParams();
  
  // URL 파라미터에서 초기값 읽기
  const getInitialInput = (): FinancialInput => {
    const urlCustomers = searchParams.get('customers');
    const urlArpu = searchParams.get('arpu');
    const urlCac = searchParams.get('cac');
    const urlFixed = searchParams.get('fixed');
    
    return {
      ...DEFAULT_INPUT,
      ...initialValues,
      ...(urlCustomers && { customers: parseInt(urlCustomers) }),
      ...(urlArpu && { pricePerCustomer: parseInt(urlArpu) }),
      ...(urlCac && { cac: parseInt(urlCac) }),
      ...(urlFixed && { fixedCosts: parseInt(urlFixed) }),
    };
  };

  const [input, setInput] = useState<FinancialInput>(getInitialInput);

  // 입력 변경 시 부모에게 알림 (debounce 적용)
  const debouncedNotify = useMemo(
    () => debounce((data: FinancialInput) => {
      onInputChange?.(data);
    }, 300),
    [onInputChange]
  );

  useEffect(() => {
    debouncedNotify(input);
  }, [input, debouncedNotify]);

  /**
   * 입력 핸들러
   */
  const handleInputChange = useCallback((field: keyof FinancialInput, value: number) => {
    setInput(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * 재무 지표 계산
   */
  const metrics: FinancialMetrics = useMemo(() => {
    const { customers, pricePerCustomer, cac, fixedCosts, variableCostRate, churnRate } = input;
    
    // 월 매출
    const revenue = customers * pricePerCustomer;
    
    // 총 비용 (고정비 + 변동비 + 신규 고객 획득 비용)
    const variableCosts = revenue * (variableCostRate / 100);
    const acquisitionCosts = customers * cac * (churnRate / 100); // 이탈 고객 대체 비용
    const totalCosts = fixedCosts + variableCosts + acquisitionCosts;
    
    // 순이익
    const profit = revenue - totalCosts;
    
    // LTV 계산 (이탈률이 0이면 무한대 방지)
    const effectiveChurnRate = Math.max(churnRate, 1) / 100;
    const ltv = pricePerCustomer * (1 - variableCostRate / 100) / effectiveChurnRate;
    
    // LTV/CAC 비율
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    
    // 손익분기점 고객 수
    const contributionMargin = pricePerCustomer * (1 - variableCostRate / 100) - cac * (churnRate / 100);
    const breakEvenPoint = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    
    // 손익분기점 도달 월
    const monthlyProfit = profit;
    const breakEvenMonth = monthlyProfit > 0 
      ? Math.ceil(input.initialCapital > 0 ? 1 : fixedCosts / monthlyProfit)
      : 0;

    return {
      revenue,
      totalCosts,
      profit,
      ltv,
      ltvCacRatio,
      breakEvenPoint,
      breakEvenMonth,
    };
  }, [input]);

  /**
   * 12개월 차트 데이터 생성
   */
  const chartData: ChartDataPoint[] = useMemo(() => {
    const data: ChartDataPoint[] = [];
    let cumulativeProfit = -input.initialCapital; // 초기 투자금 반영
    
    for (let month = 1; month <= 12; month++) {
      // 고객 성장률 가정 (월 10% 성장)
      const growthRate = 1 + (0.1 * (month - 1));
      const monthlyCustomers = Math.floor(input.customers * growthRate);
      
      const revenue = monthlyCustomers * input.pricePerCustomer;
      const variableCosts = revenue * (input.variableCostRate / 100);
      const acquisitionCosts = monthlyCustomers * input.cac * (input.churnRate / 100);
      const costs = input.fixedCosts + variableCosts + acquisitionCosts;
      const profit = revenue - costs;
      
      cumulativeProfit += profit;
      
      data.push({
        month,
        revenue,
        costs,
        profit,
        cumulativeProfit,
      });
    }
    
    return data;
  }, [input]);

  // LTV/CAC 경고 여부
  const ltvCacWarning = metrics.ltvCacRatio < 3;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* 입력 섹션 - 반응형 */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">재무 가정 입력</h3>
            <p className="text-xs sm:text-sm text-slate-400">핵심 변수를 입력하면 자동으로 계산됩니다</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <DollarSign className="w-4 h-4 text-neon-400" />
              초기 자본 (원)
            </label>
            <Input
              type="number"
              value={input.initialCapital}
              onChange={(e) => handleInputChange('initialCapital', parseInt(e.target.value) || 0)}
              helperText="사업 시작 자본금"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Users className="w-4 h-4 text-cyan-400" />
              예상 고객 수
            </label>
            <Input
              type="number"
              value={input.customers}
              onChange={(e) => handleInputChange('customers', parseInt(e.target.value) || 0)}
              helperText="월간 예상 고객 수"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <DollarSign className="w-4 h-4 text-violet-400" />
              객단가 (원)
            </label>
            <Input
              type="number"
              value={input.pricePerCustomer}
              onChange={(e) => handleInputChange('pricePerCustomer', parseInt(e.target.value) || 0)}
              helperText="고객 1인당 월 평균 매출 (ARPU)"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Target className="w-4 h-4 text-amber-400" />
              CAC (원)
            </label>
            <Input
              type="number"
              value={input.cac}
              onChange={(e) => handleInputChange('cac', parseInt(e.target.value) || 0)}
              helperText="고객 획득 비용"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <DollarSign className="w-4 h-4 text-red-400" />
              고정비 (원)
            </label>
            <Input
              type="number"
              value={input.fixedCosts}
              onChange={(e) => handleInputChange('fixedCosts', parseInt(e.target.value) || 0)}
              helperText="월간 고정 비용"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Percent className="w-4 h-4 text-slate-400" />
              변동비율 / 이탈률 (%)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={input.variableCostRate}
                onChange={(e) => handleInputChange('variableCostRate', parseInt(e.target.value) || 0)}
                helperText="변동비"
              />
              <Input
                type="number"
                value={input.churnRate}
                onChange={(e) => handleInputChange('churnRate', parseInt(e.target.value) || 0)}
                helperText="이탈률"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 핵심 지표 - 반응형 */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neon-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-neon-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white">핵심 지표</h3>
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card-hover p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-400 mb-1 sm:mb-2">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">월 매출</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {formatCurrency(metrics.revenue)}
            </div>
          </div>

          <div className="glass-card-hover p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-neon-400 mb-1 sm:mb-2">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">LTV</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {formatCurrency(metrics.ltv)}
            </div>
          </div>

          <div className={cn(
            'glass-card-hover p-3 sm:p-4',
            ltvCacWarning && 'border-red-500/30'
          )}>
            <div className={cn(
              'flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2',
              ltvCacWarning ? 'text-red-400' : 'text-neon-400'
            )}>
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">LTV/CAC</span>
            </div>
            <div className={cn(
              'text-lg sm:text-xl lg:text-2xl font-bold',
              ltvCacWarning ? 'text-red-400' : 'text-white'
            )}>
              {metrics.ltvCacRatio.toFixed(1)}x
            </div>
          </div>

          <div className="glass-card-hover p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-violet-400 mb-1 sm:mb-2">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">손익분기점</span>
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {formatNumber(metrics.breakEvenPoint)}명
            </div>
          </div>
        </div>

        {/* LTV/CAC 경고 */}
        {ltvCacWarning && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-400 mb-1">수익성 경고</div>
              <p className="text-sm text-slate-400">
                LTV/CAC 비율이 3 미만입니다. 고객 획득 비용을 낮추거나 고객 생애가치를 높이는 전략이 필요합니다.
                건강한 비즈니스 모델은 일반적으로 3 이상의 비율을 유지합니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 손익분기점 차트 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">손익분기점 분석 (12개월)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
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
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="costs" 
              stroke="#f87171" 
              name="비용" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#4ade80" 
              name="이익" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Unit Economics 차트 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Unit Economics</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { name: 'LTV', value: metrics.ltv, fill: '#4ade80' },
            { name: 'CAC', value: input.cac, fill: '#f87171' },
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.5)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-slate-500 mt-4 text-center">
          이상적인 비율: LTV ≥ 3 × CAC
        </p>
      </div>
    </div>
  );
};

export default PreviewFinancialForm;

