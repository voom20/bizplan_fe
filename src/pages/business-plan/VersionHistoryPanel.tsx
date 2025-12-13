/**
 * 파일명: VersionHistoryPanel.tsx
 * 
 * 파일 용도:
 * 문서 버전 히스토리를 표시하는 사이드바 패널 컴포넌트
 * - 버전 목록 표시
 * - 버전 선택/비교 기능
 * - 새 버전 생성 버튼
 * 
 * 호출 구조:
 * VersionHistoryPanel (이 컴포넌트)
 *   ├─> VersionListItem - 개별 버전 항목
 *   └─> 버전 비교 모드 UI
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 사이드바 슬라이드
 */

import React, { useState, useCallback } from 'react';
import { 
  History, 
  X, 
  GitCompare, 
  Plus,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui';
import { VersionListItem, DocumentVersion } from '@/pages/business-plan/VersionListItem';
import { cn } from '@/lib/utils';

interface VersionHistoryPanelProps {
  /** 패널 열림 상태 */
  isOpen: boolean;
  /** 패널 닫기 핸들러 */
  onClose: () => void;
  /** 버전 목록 */
  versions: DocumentVersion[];
  /** 현재 선택된 버전 */
  selectedVersion: DocumentVersion | null;
  /** 버전 선택 핸들러 */
  onVersionSelect: (version: DocumentVersion) => void;
  /** 새 버전 생성 핸들러 */
  onCreateNewVersion?: () => void;
  /** 버전 비교 핸들러 */
  onCompareVersions?: (v1: DocumentVersion, v2: DocumentVersion) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * VersionHistoryPanel 컴포넌트
 * 
 * 역할:
 * - 문서 버전 히스토리 사이드바
 * - 버전 선택 및 비교 기능
 * - 새 버전 생성 트리거
 */
export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  isOpen,
  onClose,
  versions,
  selectedVersion,
  onVersionSelect,
  onCreateNewVersion,
  onCompareVersions,
  isLoading = false,
}) => {
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<DocumentVersion[]>([]);

  // 현재 버전 (최신 버전)
  const currentVersion = versions.length > 0 
    ? versions.reduce((latest, v) => v.version > latest.version ? v : latest, versions[0])
    : null;

  /**
   * 버전 선택 핸들러
   */
  const handleVersionSelect = useCallback((version: DocumentVersion) => {
    if (isCompareMode) {
      // 비교 모드: 최대 2개 선택
      setCompareVersions(prev => {
        if (prev.find(v => v.id === version.id)) {
          // 이미 선택된 경우 제거
          return prev.filter(v => v.id !== version.id);
        }
        if (prev.length >= 2) {
          // 2개 초과 시 가장 오래된 것 제거
          return [...prev.slice(1), version];
        }
        return [...prev, version];
      });
    } else {
      onVersionSelect(version);
    }
  }, [isCompareMode, onVersionSelect]);

  /**
   * 비교 모드 토글
   */
  const handleToggleCompareMode = () => {
    setIsCompareMode(!isCompareMode);
    setCompareVersions([]);
  };

  /**
   * 비교 실행
   */
  const handleCompare = () => {
    if (compareVersions.length === 2 && onCompareVersions) {
      onCompareVersions(compareVersions[0], compareVersions[1]);
    }
  };

  /**
   * 버전이 비교 선택되었는지 확인
   */
  const isVersionSelectedForCompare = (version: DocumentVersion) => {
    return compareVersions.some(v => v.id === version.id);
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 패널 */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 z-50',
          'bg-slate-900/95 backdrop-blur-xl border-l border-white/10',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">버전 히스토리</h2>
              <p className="text-xs text-slate-500">{versions.length}개 버전</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="패널 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 액션 버튼 */}
        <div className="px-4 py-3 border-b border-white/5 flex gap-2">
          {onCreateNewVersion && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateNewVersion}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-1" />
              새 버전
            </Button>
          )}
          {onCompareVersions && (
            <Button
              variant={isCompareMode ? 'neon' : 'outline'}
              size="sm"
              onClick={handleToggleCompareMode}
              className={cn(
                'flex-1',
                isCompareMode && 'bg-violet-500 hover:bg-violet-600'
              )}
            >
              <GitCompare className="w-4 h-4 mr-1" />
              비교
            </Button>
          )}
        </div>

        {/* 비교 모드 안내 */}
        {isCompareMode && (
          <div className="px-4 py-3 bg-violet-500/10 border-b border-violet-500/20">
            <p className="text-sm text-violet-300 mb-2">
              비교할 버전 2개를 선택하세요
            </p>
            <div className="flex items-center gap-2">
              <div className={cn(
                'flex-1 h-8 rounded-lg border-2 border-dashed flex items-center justify-center text-xs',
                compareVersions[0] 
                  ? 'border-violet-400 bg-violet-500/20 text-violet-300' 
                  : 'border-slate-600 text-slate-500'
              )}>
                {compareVersions[0] ? `v${compareVersions[0].version}` : '버전 1'}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <div className={cn(
                'flex-1 h-8 rounded-lg border-2 border-dashed flex items-center justify-center text-xs',
                compareVersions[1] 
                  ? 'border-violet-400 bg-violet-500/20 text-violet-300' 
                  : 'border-slate-600 text-slate-500'
              )}>
                {compareVersions[1] ? `v${compareVersions[1].version}` : '버전 2'}
              </div>
            </div>
            {compareVersions.length === 2 && (
              <Button
                size="sm"
                onClick={handleCompare}
                className="w-full mt-2 bg-violet-500 hover:bg-violet-600"
              >
                비교하기
              </Button>
            )}
          </div>
        )}

        {/* 버전 목록 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">버전 기록이 없습니다</p>
              <p className="text-sm text-slate-500 mt-1">
                사업계획서를 생성하면 버전이 기록됩니다
              </p>
            </div>
          ) : (
            <div>
              {versions
                .sort((a, b) => b.version - a.version) // 최신순 정렬
                .map((version, index, arr) => (
                  <div
                    key={version.id}
                    className={cn(
                      isCompareMode && isVersionSelectedForCompare(version) && 'bg-violet-500/10'
                    )}
                  >
                    <VersionListItem
                      versionData={version}
                      isSelected={isCompareMode 
                        ? isVersionSelectedForCompare(version)
                        : selectedVersion?.id === version.id
                      }
                      isCurrent={currentVersion?.id === version.id}
                      onSelect={handleVersionSelect}
                      isFirst={index === 0}
                      isLast={index === arr.length - 1}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="px-4 py-3 border-t border-white/10 text-center">
          <p className="text-xs text-slate-500">
            버전은 자동으로 저장됩니다
          </p>
        </div>
      </div>
    </>
  );
};

export default VersionHistoryPanel;

