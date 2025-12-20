/**
 * 파일명: ProjectCreate.tsx
 * 
 * 파일 용도:
 * 프로젝트 생성 페이지 - 애플리케이션의 진입점
 * - 사용자로부터 프로젝트명과 템플릿 선택을 받음
 * - 프로젝트 생성 후 마법사 단계로 이동
 * 
 * API 연동:
 * - projectService.getTemplates() 로 템플릿 목록 조회
 * - projectService.createProject() 로 프로젝트 생성
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/useProjectStore';
import { useWizardStore } from '@/stores/useWizardStore';
import { templates as fallbackTemplates } from '@/types/mockData';
import { 
  Rocket, 
  Sparkles, 
  TrendingUp, 
  Target, 
  ArrowRight,
  Check,
  Zap,
  BarChart3,
  FileText,
  Loader2
} from 'lucide-react';
import { cn } from '@/common/utils';

/**
 * ProjectCreate 컴포넌트
 * 신규 프로젝트 생성을 위한 초기 설정 페이지
 */
export const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { 
    templates, 
    fetchTemplates, 
    createProject, 
    isLoading: isCreating,
    error: storeError 
  } = useProjectStore();
  const { resetWizard, setProjectId } = useWizardStore();

  const [projectName, setProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  // 템플릿 목록을 API 또는 fallback에서 가져옴
  const displayTemplates = templates.length > 0 
    ? templates.map(t => ({
        id: t.code,
        name: t.name,
        description: t.description,
        icon: getTemplateIcon(t.code),
        features: getTemplateFeatures(t.category),
      }))
    : fallbackTemplates;

  /**
   * 템플릿 아이콘 반환
   */
  function getTemplateIcon(code: string): string {
    const icons: Record<string, string> = {
      'pre-startup': '🚀',
      'early-startup': '💼',
      'bank-loan': '🏦',
    };
    return icons[code] || '📄';
  }

  /**
   * 템플릿 특징 반환
   */
  function getTemplateFeatures(category: string): string[] {
    const features: Record<string, string[]> = {
      'government': ['정부지원 양식 호환', 'PMF 검증 전략', '상세 재무 분석', '투자 유치 준비'],
      'bank': ['담보/신용 분석', '상환 계획 수립', '리스크 관리', '보수적 재무 예측'],
      'investor': ['아이디어 검증 중심', 'MVP 구축 계획', '초기 시장 조사', '기본 재무 설계'],
    };
    return features[category] || features['government'];
  }

  /**
   * 컴포넌트 마운트 시 템플릿 목록 조회
   */
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        await fetchTemplates();
      } catch (err) {
        console.warn('Failed to fetch templates from API, using fallback:', err);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, [fetchTemplates]);

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }

    if (!selectedTemplate) {
      setError('템플릿을 선택해주세요.');
      return;
    }

    try {
      // API로 프로젝트 생성
      const project = await createProject(projectName, selectedTemplate);
      
      // 위저드 초기화 및 프로젝트 ID 설정
      resetWizard();
      setProjectId(project.id);
      
      navigate('/wizard/1');
    } catch {
      setError(storeError || '프로젝트 생성에 실패했습니다.');
    }
  };

  // 템플릿 아이콘 매핑
  const templateIcons: Record<string, React.ReactNode> = {
    'pre-startup': <Rocket className="w-8 h-8" />,
    'early-startup': <TrendingUp className="w-8 h-8" />,
    'bank-loan': <Target className="w-8 h-8" />,
  };

  // 템플릿 색상 매핑
  const templateColors: Record<string, { bg: string; border: string; glow: string }> = {
    'pre-startup': { 
      bg: 'from-neon-500/20 to-neon-600/10', 
      border: 'border-neon-500/30',
      glow: 'shadow-neon'
    },
    'early-startup': { 
      bg: 'from-cyan-500/20 to-cyan-600/10', 
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan'
    },
    'bank-loan': { 
      bg: 'from-violet-500/20 to-violet-600/10', 
      border: 'border-violet-500/30',
      glow: 'shadow-violet'
    },
  };

  return (
    <div className="min-h-screen relative">
      {/* 배경 효과 */}
      <div className="fixed inset-0 bg-grid opacity-50 pointer-events-none" />
      
      {/* 플로팅 오브 */}
      <div className="fixed floating-orb w-96 h-96 bg-neon-500/20 -top-48 -left-48" />
      <div className="fixed floating-orb w-80 h-80 bg-cyan-500/20 top-1/3 -right-40" style={{ animationDelay: '2s' }} />
      <div className="fixed floating-orb w-64 h-64 bg-violet-500/20 bottom-20 left-1/4" style={{ animationDelay: '4s' }} />

      {/* 메인 콘텐츠 - 전체 너비 활용 */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* 헤더 섹션 */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10 animate-fade-in">
            {/* 로고/아이콘 */}
            <div className="inline-flex items-center justify-center mb-4 sm:mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-500 blur-2xl opacity-40 animate-pulse-slow" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-neon-400 to-neon-600 flex items-center justify-center shadow-neon-lg">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-slate-900" />
                </div>
              </div>
            </div>

            {/* 타이틀 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4">
              <span className="text-white">AI로 완성하는</span>
              <br />
              <span className="text-gradient">사업계획서</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-2">
              복잡한 서류 작성은 이제 그만.
              <br className="hidden sm:block" />
              <span className="text-slate-300">5단계 마법사</span>로 전문가급 사업계획서를 완성하세요.
            </p>
          </div>

          {/* 폼 영역 */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
            
            {/* 프로젝트 이름 입력 - 반응형 패딩 */}
            <div className="glass-card p-4 sm:p-6 lg:p-8 animate-slide-up">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-neon-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-neon-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">프로젝트 이름</h2>
              </div>
              
              <input
                type="text"
                className="input-glass text-base sm:text-lg"
                placeholder="예: 혁신적인 AI 스타트업 사업계획"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* 템플릿 선택 - 반응형 패딩 */}
            <div className="glass-card p-4 sm:p-6 lg:p-8 animate-slide-up delay-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">템플릿 선택</h2>
              </div>

              {isLoadingTemplates ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-neon-400 animate-spin" />
                  <span className="ml-3 text-slate-400">템플릿 로딩 중...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                  {displayTemplates.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    const colors = templateColors[template.id] || templateColors['pre-startup'];
                    
                    return (
                      <button
                        key={template.id}
                        type="button"
                        className={cn(
                          'relative p-4 sm:p-5 lg:p-6 rounded-xl text-left transition-all duration-300',
                          'bg-gradient-to-br border',
                          colors.bg,
                          isSelected 
                            ? `${colors.border} ${colors.glow}` 
                            : 'border-white/10 hover:border-white/20',
                          isSelected && 'scale-[1.02]',
                          isHovered === template.id && !isSelected && 'scale-[1.01] shadow-lg',
                          'group'
                        )}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setError('');
                        }}
                        onMouseEnter={() => setIsHovered(template.id)}
                        onMouseLeave={() => setIsHovered(null)}
                      >
                        {/* 선택 체크마크 */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neon-500 flex items-center justify-center animate-scale-in">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" />
                          </div>
                        )}

                        {/* 아이콘 - 반응형 */}
                        <div className={cn(
                          'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center transition-all duration-300',
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                        )}>
                          {templateIcons[template.id] || <FileText className="w-8 h-8" />}
                        </div>

                        {/* 템플릿 정보 - 반응형 */}
                        <h3 className={cn(
                          'text-base sm:text-lg font-semibold mb-1 sm:mb-2 transition-colors',
                          isSelected ? 'text-white' : 'text-slate-200'
                        )}>
                          {template.name}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">
                          {template.description}
                        </p>

                        {/* 특징 목록 */}
                        <ul className="space-y-2">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-2 text-xs text-slate-500"
                            >
                              <span className={cn(
                                'mt-0.5 transition-colors',
                                isSelected ? 'text-neon-400' : 'text-slate-600'
                              )}>
                                ✦
                              </span>
                              <span className={isSelected ? 'text-slate-300' : ''}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="glass-card border-red-500/30 bg-red-500/10 p-4 animate-scale-in">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">!</span>
                  {error}
                </p>
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="flex justify-center pt-4 animate-slide-up delay-200">
              <button
                type="submit"
                disabled={isCreating}
                className="btn-neon group flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>프로젝트 생성 중...</span>
                  </>
                ) : (
                  <>
                    <span>사업계획서 작성 시작</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 기능 소개 섹션 */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-300">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: 'AI 자동 작성',
                description: '입력한 내용을 바탕으로 AI가 전문적인 사업계획서를 자동 생성합니다',
                color: 'neon'
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: '재무 시뮬레이션',
                description: '실시간 차트로 손익분기점과 수익성을 한눈에 확인하세요',
                color: 'cyan'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'PMF 진단',
                description: '제품-시장 적합성을 진단하고 성공 가능성을 높이세요',
                color: 'violet'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 text-center group hover:bg-white/10 transition-all duration-300"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-all duration-300',
                  feature.color === 'neon' && 'bg-neon-500/20 text-neon-400 group-hover:bg-neon-500/30',
                  feature.color === 'cyan' && 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30',
                  feature.color === 'violet' && 'bg-violet-500/20 text-violet-400 group-hover:bg-violet-500/30',
                )}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* 하단 배지 */}
          <div className="mt-16 flex justify-center gap-6 text-sm text-slate-500 animate-fade-in delay-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-500 animate-pulse" />
              30분 만에 완성
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              정부지원 양식 호환
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              자동 저장
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreate;
