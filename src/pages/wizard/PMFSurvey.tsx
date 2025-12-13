/**
 * 파일명: PMFSurvey.tsx
 * 
 * 파일 용도:
 * Product-Market Fit 진단 설문조사 및 결과 분석 컴포넌트 (마법사 5단계)
 * - 10개 질문으로 PMF 수준 측정
 * - 점수 계산 및 등급 판정
 * - 리스크 분석 및 개선 제언
 * 
 * 디자인: 다크 모드 + 글래스모피즘
 */

import React, { useState } from 'react';
import { usePMFStore } from '@/stores/usePMFStore';
import { pmfQuestions } from '@/types/mockData';
import { Button, Badge, Progress } from '@/components';
import { CheckCircle2, AlertCircle, TrendingUp, Target, Sparkles } from 'lucide-react';
import { cn } from '@/common/utils';

/**
 * PMFSurvey 컴포넌트
 * 다크 모드 지원 PMF 진단 화면
 */
export const PMFSurvey: React.FC = () => {
  const { answers, report, updateAnswer, generateReport } = usePMFStore();
  const [showReport, setShowReport] = useState(false);

  /**
   * 답변 선택 핸들러
   */
  const handleAnswerChange = (questionId: string, value: number) => {
    updateAnswer(questionId, value);
  };

  /**
   * 진단 결과 생성 및 표시
   */
  const handleSubmit = () => {
    generateReport();
    setShowReport(true);
  };

  // 모든 질문에 답변했는지 확인
  const isAllAnswered = answers.length === pmfQuestions.length;

  // 결과 화면
  if (showReport && report) {
    return (
      <div className="space-y-6">
        {/* Score Display */}
        <div className="text-center py-6 sm:py-8">
          <div className="inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-neon-500 to-cyan-500 mb-4 shadow-neon-lg">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900">{report.score}</div>
              <div className="text-sm text-slate-700">점</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            {report.score >= 70 ? (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            ) : (
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            )}
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              PMF 진단 완료
            </h3>
          </div>
          <Badge
            variant={
              report.level === 'excellent' ? 'success' :
              report.level === 'high' ? 'cyan' :
              report.level === 'medium' ? 'warning' : 'danger'
            }
            className="text-sm sm:text-base px-3 sm:px-4 py-1"
          >
            {report.level === 'excellent' && 'Product-Market Fit 달성'}
            {report.level === 'high' && 'Product-Market Fit 근접'}
            {report.level === 'medium' && '개선 필요'}
            {report.level === 'low' && '재검토 필요'}
          </Badge>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto px-2">
            {report.score >= 85 && '축하합니다! 제품-시장 적합성(PMF)을 달성했습니다. 이제 성장에 집중하세요.'}
            {report.score >= 70 && report.score < 85 && 'PMF에 근접했습니다. 몇 가지 개선으로 더욱 강력한 비즈니스를 만들 수 있습니다.'}
            {report.score >= 50 && report.score < 70 && 'PMF 달성을 위해 몇 가지 핵심 영역의 개선이 필요합니다.'}
            {report.score < 50 && '비즈니스 모델과 제품에 대한 근본적인 재검토가 필요합니다.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">PMF 점수</span>
            <span className="text-sm font-bold text-white">{report.score}/100</span>
          </div>
          <Progress value={report.score} max={100} color="neon" />
        </div>

        {/* Risks */}
        {report.risks.length > 0 && (
          <div className="glass-card p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              핵심 리스크
            </h4>
            <div className="space-y-3">
              {report.risks.map((risk) => (
                <div key={risk.id} className="glass-card-hover p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <Badge
                      variant={
                        risk.severity === 'high' ? 'danger' :
                        risk.severity === 'medium' ? 'warning' : 'slate'
                      }
                      className="flex-shrink-0"
                    >
                      {risk.severity === 'high' && '높음'}
                      {risk.severity === 'medium' && '중간'}
                      {risk.severity === 'low' && '낮음'}
                    </Badge>
                    <div className="flex-1">
                      <h5 className="font-semibold text-white mb-1 text-sm sm:text-base">{risk.title}</h5>
                      <p className="text-xs sm:text-sm text-slate-400">{risk.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="glass-card p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            개선 제언
          </h4>
          <div className="space-y-3">
            {report.recommendations.map((rec) => (
              <div key={rec.id} className="glass-card-hover p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <Badge
                    variant={
                      rec.priority === 'high' ? 'cyan' :
                      rec.priority === 'medium' ? 'warning' : 'slate'
                    }
                    className="flex-shrink-0"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {rec.priority === 'high' && '높음'}
                    {rec.priority === 'medium' && '중간'}
                    {rec.priority === 'low' && '낮음'}
                  </Badge>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1 text-sm sm:text-base">{rec.title}</h5>
                    <p className="text-xs sm:text-sm text-slate-400">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowReport(false)}
          >
            다시 진단하기
          </Button>
        </div>
      </div>
    );
  }

  // 설문 화면
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          Product-Market Fit 진단
        </h3>
        <p className="text-sm sm:text-base text-slate-400">
          10개의 질문에 답변하여 현재 비즈니스의 PMF 수준을 확인하세요
        </p>
      </div>

      {/* 질문 목록 */}
      <div className="space-y-4">
        {pmfQuestions.map((question, index) => {
          const answer = answers.find((a) => a.questionId === question.id);

          return (
            <div key={question.id} className="glass-card p-4 sm:p-5">
              {/* 질문 */}
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neon-500/20 text-neon-400 text-xs sm:text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm sm:text-base text-white font-medium">
                  {question.question}
                </span>
              </div>

              {/* 옵션 버튼 */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerChange(question.id, option.value)}
                    className={cn(
                      'px-3 py-2 sm:py-2.5 rounded-lg border transition-all text-xs sm:text-sm font-medium',
                      answer?.value === option.value
                        ? 'border-neon-500 bg-neon-500/20 text-neon-400'
                        : 'border-white/10 hover:border-white/20 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          size="lg"
        >
          진단 결과 보기
        </Button>
      </div>

      {/* 진행 상태 */}
      {!isAllAnswered && (
        <p className="text-xs sm:text-sm text-slate-500 text-center">
          모든 질문에 답변해주세요 ({answers.length}/{pmfQuestions.length})
        </p>
      )}
    </div>
  );
};
