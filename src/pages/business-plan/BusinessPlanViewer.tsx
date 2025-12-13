/**
 * 파일명: BusinessPlanViewer.tsx
 * 
 * 파일 용도:
 * AI 생성 사업계획서 뷰어 페이지
 * - 마법사 완료 후 사업계획서를 AI로 생성하고 표시
 * - 섹션별 재생성 기능
 * - PDF/HTML 내보내기 기능
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 반응형
 */

import React, { useState, useCallback } from 'react';
import { Button, Spinner, Badge } from '@/components';
import { VersionHistoryPanel } from '@/pages/business-plan/VersionHistoryPanel';
import { DiffView } from '@/pages/business-plan/DiffView';
import { SectionRegenerateButton } from '@/pages/business-plan/SectionRegenerateButton';
import { DocumentVersion } from '@/pages/business-plan/VersionListItem';
import { mockBusinessPlan } from '@/types/mockData';
import ReactMarkdown from 'react-markdown';
import { Sparkles, FileText, Calendar, Clock, History, ArrowLeft, FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * BusinessPlanViewer 컴포넌트
 * 반응형 + 다크모드 지원
 */
export const BusinessPlanViewer: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [sections, setSections] = useState(mockBusinessPlan);
  const [currentVersion, setCurrentVersion] = useState(1);
  
  // 버전 히스토리 상태
  const [isVersionPanelOpen, setIsVersionPanelOpen] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  
  // 버전 비교 상태
  const [compareVersions, setCompareVersions] = useState<{
    old: DocumentVersion;
    new: DocumentVersion;
  } | null>(null);

  /**
   * AI 사업계획서 생성 시뮬레이션
   */
  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      
      const firstVersion: DocumentVersion = {
        id: 'v1',
        version: 1,
        createdAt: new Date().toISOString(),
        status: 'COMPLETED',
        summary: 'AI 사업계획서 최초 생성',
        changedSections: sections.length,
      };
      setVersions([firstVersion]);
      setSelectedVersion(firstVersion);
      setCurrentVersion(1);
    }, 3000);
  };

  /**
   * 특정 섹션 재생성
   */
  const handleRegenerate = useCallback(async (sectionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          content: section.content + '\n\n[AI가 새로운 내용을 생성했습니다]',
        };
      }
      return section;
    }));
    
    const newVersionNumber = currentVersion + 1;
    const sectionName = sections.find(s => s.id === sectionId)?.title || '섹션';
    const newVersion: DocumentVersion = {
      id: `v${newVersionNumber}`,
      version: newVersionNumber,
      createdAt: new Date().toISOString(),
      status: 'COMPLETED',
      summary: `${sectionName} 섹션 재생성`,
      changedSections: 1,
    };
    
    setVersions(prev => [...prev, newVersion]);
    setSelectedVersion(newVersion);
    setCurrentVersion(newVersionNumber);
  }, [currentVersion, sections]);

  /**
   * 버전 선택 핸들러
   */
  const handleVersionSelect = useCallback((version: DocumentVersion) => {
    setSelectedVersion(version);
  }, []);

  /**
   * 새 버전 생성 핸들러
   */
  const handleCreateNewVersion = useCallback(() => {
    const newVersionNumber = currentVersion + 1;
    const newVersion: DocumentVersion = {
      id: `v${newVersionNumber}`,
      version: newVersionNumber,
      createdAt: new Date().toISOString(),
      status: 'DRAFT',
      summary: '수동 버전 생성',
    };
    
    setVersions(prev => [...prev, newVersion]);
    setSelectedVersion(newVersion);
    setCurrentVersion(newVersionNumber);
  }, [currentVersion]);

  /**
   * 버전 비교 핸들러
   */
  const handleCompareVersions = useCallback((v1: DocumentVersion, v2: DocumentVersion) => {
    const [oldVer, newVer] = v1.version < v2.version ? [v1, v2] : [v2, v1];
    setCompareVersions({ old: oldVer, new: newVer });
  }, []);

  // 생성 대기/진행 화면
  if (!isGenerated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* 배경 효과 */}
        <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="fixed top-0 left-0 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl lg:max-w-3xl mx-auto">
          {/* 뒤로가기 링크 */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-white transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로 돌아가기</span>
          </Link>

          <div className="glass-card p-6 sm:p-8 lg:p-12 text-center">
            {!isGenerating ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-neon-500 to-cyan-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-neon-lg">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-900" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  AI 사업계획서 생성
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-400 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
                  지금까지 입력하신 내용을 바탕으로 전문가 수준의 사업계획서를 생성합니다.
                  생성된 계획서는 수정 가능하며, PDF/HTML 형식으로 다운로드할 수 있습니다.
                </p>
                <Button onClick={handleGenerate} size="lg" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  AI 사업계획서 생성하기
                </Button>
              </>
            ) : (
              <>
                <Spinner size="lg" className="mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  AI가 사업계획서를 작성 중입니다...
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8">
                  입력하신 정보를 분석하여 최적의 사업계획서를 작성하고 있습니다.
                </p>
                <div className="max-w-sm sm:max-w-md mx-auto">
                  <div className="bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-neon-400 to-neon-500 rounded-full animate-pulse" style={{ width: '66%' }} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 생성 완료 화면
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* 배경 효과 */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-neon-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
        {/* 뒤로가기 링크 */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-white transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>

        {/* Header */}
        <div className="glass-card p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Badge variant="success" className="mb-2 sm:mb-3">
                <Sparkles className="w-3 h-3 mr-1" />
                AI 생성 완료
              </Badge>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                사업계획서
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {new Date().toLocaleDateString('ko-KR')}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  버전 {currentVersion}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {sections.length}개 섹션
                </span>
              </div>
            </div>
            
            {/* 버전 히스토리 및 내보내기 - 버튼 크기 통일 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => setIsVersionPanelOpen(true)}
                className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base"
              >
                <History className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">버전 </span>{versions.length}
              </Button>
              <Button
                className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-neon-500 to-neon-600 text-slate-900"
              >
                <FileDown className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">문서 </span>내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="glass-card overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                  {section.title}
                </h2>
                <SectionRegenerateButton
                  sectionId={section.id}
                  sectionName={section.title}
                  onRegenerate={handleRegenerate}
                />
              </div>
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              돌아가기
            </Button>
            <Button
              onClick={() => {}}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-neon-500 to-neon-600 text-slate-900"
            >
              <FileDown className="w-5 h-5 mr-2" />
              내보내기
            </Button>
          </div>
        </div>

        {/* 버전 히스토리 패널 */}
        <VersionHistoryPanel
          isOpen={isVersionPanelOpen}
          onClose={() => setIsVersionPanelOpen(false)}
          versions={versions}
          selectedVersion={selectedVersion}
          onVersionSelect={handleVersionSelect}
          onCreateNewVersion={handleCreateNewVersion}
          onCompareVersions={handleCompareVersions}
        />

        {/* 버전 비교 뷰 */}
        {compareVersions && (
          <DiffView
            oldVersion={compareVersions.old}
            newVersion={compareVersions.new}
            oldSections={sections.map(s => ({ id: s.id, title: s.title, content: s.content }))}
            newSections={sections.map(s => ({ id: s.id, title: s.title, content: s.content }))}
            onClose={() => setCompareVersions(null)}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessPlanViewer;
