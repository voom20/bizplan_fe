/**
 * 파일명: BusinessPlanViewer.tsx
 * 
 * 파일 용도:
 * AI 생성 사업계획서 뷰어 페이지
 * - 마법사 완료 후 사업계획서를 AI로 생성하고 표시
 * - 섹션별 재생성 기능
 * - PDF/HTML 내보내기 기능
 * 
 * 호출 구조:
 * BusinessPlanViewer (이 컴포넌트)
 *   ├─> handleGenerate() - AI 사업계획서 생성 (시뮬레이션)
 *   ├─> handleRegenerate(sectionId) - 특정 섹션 재생성
 *   └─> ExportDropdown - 파일 내보내기 (PDF/HTML)
 * 
 * 데이터 흐름:
 * 1. 초기 상태: 생성 대기 화면
 * 2. 생성 버튼 클릭 → 로딩 (3초 시뮬레이션)
 * 3. 생성 완료 → 섹션별 사업계획서 표시
 * 4. 각 섹션마다 "다시 쓰기" 버튼으로 재생성 가능
 * 5. ExportDropdown으로 PDF/HTML 내보내기 가능
 * 
 * Mock Data:
 * - mockBusinessPlan: 사업계획서 섹션 목록
 */

import React, { useState, useMemo } from 'react';
import { Button, Spinner, Badge } from '../components/ui';
import { ExportDropdown } from '../components/ExportDropdown';
import { mockBusinessPlan } from '../types/mockData';
import ReactMarkdown from 'react-markdown';
import { Sparkles, RefreshCw, FileText, Calendar, Clock } from 'lucide-react';

/**
 * BusinessPlanViewer 컴포넌트
 * 
 * 역할:
 * - AI가 생성한 사업계획서를 표시하고 관리
 * - 섹션별 내용 재생성 기능
 * - 문서 내보내기 (PDF, HTML)
 * 
 * 주요 기능:
 * 1. AI 사업계획서 생성 (시뮬레이션)
 * 2. 마크다운 형식의 계획서 렌더링
 * 3. 섹션별 AI 재생성
 * 4. PDF/HTML 형식으로 내보내기
 * 
 * 상태:
 * - isGenerating: 생성 중 여부
 * - isGenerated: 생성 완료 여부
 * - sections: 사업계획서 섹션 목록
 * - regeneratingSection: 재생성 중인 섹션 ID
 * 
 * @returns {JSX.Element} 사업계획서 뷰어 페이지
 */
export const BusinessPlanViewer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [sections, setSections] = useState(mockBusinessPlan);
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);
  const [version] = useState(1);

  /**
   * AI 사업계획서 생성 시뮬레이션
   * - 실제로는 API 호출이 필요
   * - 현재는 3초 딜레이 후 완료 처리
   */
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 3000);
  };

  /**
   * 특정 섹션 재생성
   * 
   * @param {string} sectionId - 재생성할 섹션의 ID
   */
  const handleRegenerate = (sectionId: string) => {
    setRegeneratingSection(sectionId);
    
    // Simulate regeneration
    setTimeout(() => {
      setSections(sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            content: section.content + '\n\n[AI가 새로운 내용을 생성했습니다]',
          };
        }
        return section;
      }));
      setRegeneratingSection(null);
    }, 2000);
  };

  /**
   * 내보내기용 HTML 콘텐츠 생성
   */
  const exportContent = useMemo(() => {
    return sections.map(section => `
      <div class="section">
        <h2>${section.title}</h2>
        <div>${section.content.replace(/\n/g, '<br/>')}</div>
      </div>
    `).join('\n');
  }, [sections]);

  // 생성 대기/진행 화면
  if (!isGenerated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          {!isGenerating ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-500 to-cyan-600 rounded-2xl mb-6 shadow-neon-lg">
                <Sparkles className="w-10 h-10 text-slate-900" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                AI 사업계획서 생성
              </h1>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                지금까지 입력하신 내용을 바탕으로 전문가 수준의 사업계획서를 생성합니다.
                생성된 계획서는 수정 가능하며, PDF/HTML 형식으로 다운로드할 수 있습니다.
              </p>
              <Button onClick={handleGenerate} size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                AI 사업계획서 생성하기
              </Button>
            </>
          ) : (
            <>
              <Spinner size="lg" className="mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                AI가 사업계획서를 작성 중입니다...
              </h2>
              <p className="text-slate-400">
                입력하신 정보를 분석하여 최적의 사업계획서를 작성하고 있습니다.
              </p>
              <div className="mt-8 max-w-md mx-auto">
                <div className="bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-neon-400 to-neon-500 rounded-full animate-pulse" style={{ width: '66%' }} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // 생성 완료 화면
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge variant="success" className="mb-3">
              <Sparkles className="w-3 h-3 mr-1" />
              AI 생성 완료
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-2">
              사업계획서
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('ko-KR')}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                버전 {version}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {sections.length}개 섹션
              </span>
            </div>
          </div>
          
          {/* 내보내기 드롭다운 */}
          <ExportDropdown 
            version={version} 
            content={exportContent}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="glass-card overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {section.title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRegenerate(section.id)}
                disabled={regeneratingSection === section.id}
                isLoading={regeneratingSection === section.id}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                다시 쓰기
              </Button>
            </div>
            <div className="px-6 py-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 flex justify-center gap-4 pb-8">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          돌아가기
        </Button>
        <ExportDropdown 
          version={version} 
          content={exportContent}
          compact
        />
      </div>
    </div>
  );
};

export default BusinessPlanViewer;
