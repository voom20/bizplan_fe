/**
 * 파일명: useExportDocument.ts
 * 
 * 파일 용도:
 * 문서 내보내기 기능을 위한 Custom Hook
 * - PDF/HTML 형식 내보내기
 * - 다운로드 상태 관리
 * - 에러 처리
 * 
 * 사용법:
 * const { exportDocument, isExporting, error } = useExportDocument();
 * await exportDocument('pdf', projectName);
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/components/feedback/Toast';
import { useProjectStore } from '@/stores/useProjectStore';
import { 
  ExportFormat, 
  downloadBlob, 
  generateExportFilename, 
  createMockDocument 
} from '@/common/downloadFile';

/** 내보내기 상태 */
interface ExportState {
  /** 내보내기 진행 중 여부 */
  isExporting: boolean;
  /** 현재 내보내기 중인 형식 */
  exportingFormat: ExportFormat | null;
  /** 에러 메시지 */
  error: string | null;
  /** 진행률 (0-100) */
  progress: number;
}

/** 내보내기 옵션 */
interface ExportOptions {
  /** 버전 번호 */
  version?: number;
  /** 문서 내용 (Mock용) */
  content?: string;
}

/** Hook 반환 타입 */
interface UseExportDocumentReturn extends ExportState {
  /** 문서 내보내기 함수 */
  exportDocument: (format: ExportFormat, options?: ExportOptions) => Promise<void>;
  /** 에러 초기화 */
  clearError: () => void;
}

/** API 사용 플래그 (false = Mock 사용) */
const USE_REAL_API = false;

/**
 * useExportDocument Hook
 * 
 * 역할:
 * - 문서 내보내기 로직 캡슐화
 * - 다운로드 상태 관리
 * - 에러 처리 및 사용자 피드백
 * 
 * @returns {UseExportDocumentReturn} 내보내기 상태 및 함수
 */
export const useExportDocument = (): UseExportDocumentReturn => {
  const toast = useToast();
  const { currentProject } = useProjectStore();
  
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    exportingFormat: null,
    error: null,
    progress: 0,
  });

  /**
   * 에러 초기화
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * 문서 내보내기
   * 
   * @param {ExportFormat} format - 내보내기 형식 (pdf, html, hwp)
   * @param {ExportOptions} options - 내보내기 옵션
   */
  const exportDocument = useCallback(async (
    format: ExportFormat,
    options: ExportOptions = {}
  ) => {
    // HWP는 아직 미지원
    if (format === 'hwp') {
      toast.info('HWP 형식은 추후 지원 예정입니다.\nPDF 또는 HTML 형식을 이용해주세요.');
      return;
    }

    const projectName = currentProject?.name || '사업계획서';
    const { version, content } = options;

    try {
      // 상태 업데이트: 내보내기 시작
      setState({
        isExporting: true,
        exportingFormat: format,
        error: null,
        progress: 0,
      });

      let blob: Blob;

      if (USE_REAL_API) {
        // 실제 API 호출
        // TODO: 백엔드 API 구현 시 활성화
        // const response = await api.get(`/projects/${currentProject?.id}/export`, {
        //   params: { format, version },
        //   responseType: 'blob',
        //   onDownloadProgress: (progressEvent) => {
        //     const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        //     setState(prev => ({ ...prev, progress }));
        //   },
        // });
        // blob = response.data;
        throw new Error('API not implemented');
      } else {
        // Mock: 진행 상태 시뮬레이션
        setState(prev => ({ ...prev, progress: 30 }));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setState(prev => ({ ...prev, progress: 60 }));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock 문서 생성
        const mockContent = content || generateMockContent(projectName);
        blob = createMockDocument(format, mockContent);
        
        setState(prev => ({ ...prev, progress: 100 }));
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 파일명 생성 및 다운로드
      const filename = generateExportFilename(projectName, format, version);
      downloadBlob(blob, filename);

      // 성공 토스트
      toast.success(`${format.toUpperCase()} 파일이 다운로드되었습니다.`, '내보내기 완료');

      // 상태 초기화
      setState({
        isExporting: false,
        exportingFormat: null,
        error: null,
        progress: 0,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '내보내기에 실패했습니다.';
      
      setState({
        isExporting: false,
        exportingFormat: null,
        error: errorMessage,
        progress: 0,
      });

      toast.error(errorMessage, '내보내기 실패');
    }
  }, [currentProject, toast]);

  return {
    ...state,
    exportDocument,
    clearError,
  };
};

/**
 * Mock 문서 내용 생성
 * 
 * @param {string} projectName - 프로젝트명
 * @returns {string} HTML 형식의 문서 내용
 */
const generateMockContent = (projectName: string): string => {
  return `
    <h1>${projectName} 사업계획서</h1>
    
    <div class="section">
      <h2>1. 사업 개요</h2>
      <p>본 사업은 혁신적인 기술을 활용하여 고객에게 새로운 가치를 제공하는 것을 목표로 합니다.</p>
    </div>
    
    <div class="section">
      <h2>2. 시장 분석</h2>
      <p>대상 시장의 규모는 연간 100억원 이상으로 추정되며, 연평균 15% 성장이 예상됩니다.</p>
    </div>
    
    <div class="section">
      <h2>3. 사업 전략</h2>
      <p>차별화된 서비스와 고객 중심의 접근 방식으로 시장 점유율을 확대할 계획입니다.</p>
    </div>
    
    <div class="section">
      <h2>4. 재무 계획</h2>
      <p>초기 투자금 5천만원으로 시작하여 3년 내 손익분기점 달성을 목표로 합니다.</p>
    </div>
    
    <div class="section">
      <h2>5. 팀 구성</h2>
      <p>경험 있는 전문가들로 구성된 팀이 사업의 성공을 이끌어갈 것입니다.</p>
    </div>
  `;
};

export default useExportDocument;

