/**
 * 파일명: VersionListItem.tsx
 * 
 * 파일 용도:
 * 문서 버전 히스토리에서 개별 버전 항목을 표시하는 컴포넌트
 * - 버전 번호, 생성 일시, 상태 표시
 * - 현재 버전 표시 뱃지
 * - 버전 선택 기능
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 타임라인 스타일
 */

import React from 'react';
import { Check, Clock, FileText, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

/** 버전 상태 타입 */
export type VersionStatus = 'DRAFT' | 'COMPLETED' | 'GENERATING';

/** 버전 데이터 인터페이스 */
export interface DocumentVersion {
  /** 버전 ID */
  id: string;
  /** 버전 번호 */
  version: number;
  /** 생성 일시 */
  createdAt: string;
  /** 버전 상태 */
  status: VersionStatus;
  /** 변경 내용 요약 */
  summary?: string;
  /** 변경된 섹션 수 */
  changedSections?: number;
}

interface VersionListItemProps {
  /** 버전 데이터 */
  versionData: DocumentVersion;
  /** 현재 선택된 버전 여부 */
  isSelected: boolean;
  /** 최신 버전 여부 */
  isCurrent: boolean;
  /** 버전 선택 핸들러 */
  onSelect: (version: DocumentVersion) => void;
  /** 첫 번째 항목 여부 (타임라인 스타일용) */
  isFirst?: boolean;
  /** 마지막 항목 여부 (타임라인 스타일용) */
  isLast?: boolean;
}

/**
 * VersionListItem 컴포넌트
 * 
 * 역할:
 * - 버전 히스토리 목록에서 개별 버전 표시
 * - 타임라인 스타일로 연결된 형태
 * - 선택 및 현재 상태 표시
 */
export const VersionListItem: React.FC<VersionListItemProps> = ({
  versionData,
  isSelected,
  isCurrent,
  onSelect,
  isFirst = false,
  isLast = false,
}) => {
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 상대 시간 표시
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return formatDate(dateString);
  };

  // 상태별 색상
  const statusConfig = {
    DRAFT: { color: 'warning', label: '초안', icon: FileText },
    COMPLETED: { color: 'success', label: '완료', icon: Check },
    GENERATING: { color: 'cyan', label: '생성중', icon: Sparkles },
  } as const;

  const status = statusConfig[versionData.status];
  const StatusIcon = status.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(versionData)}
      className={cn(
        'w-full text-left relative pl-8 pr-4 py-3 transition-all duration-200',
        'hover:bg-white/5 focus:outline-none focus:bg-white/5',
        isSelected && 'bg-white/10',
        !isLast && 'border-b border-white/5'
      )}
      aria-label={`버전 ${versionData.version} 선택`}
      aria-current={isSelected ? 'true' : undefined}
    >
      {/* 타임라인 라인 */}
      <div
        className={cn(
          'absolute left-3 w-0.5 bg-white/10',
          isFirst ? 'top-6' : 'top-0',
          isLast ? 'bottom-1/2' : 'bottom-0'
        )}
      />

      {/* 타임라인 점 */}
      <div
        className={cn(
          'absolute left-1.5 top-4 w-4 h-4 rounded-full border-2 transition-all',
          isSelected
            ? 'bg-neon-500 border-neon-400 shadow-neon'
            : isCurrent
            ? 'bg-cyan-500 border-cyan-400'
            : 'bg-slate-700 border-slate-600'
        )}
      >
        {isSelected && (
          <div className="absolute inset-0 rounded-full bg-neon-400 animate-ping opacity-50" />
        )}
      </div>

      {/* 내용 */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* 버전 번호 및 뱃지 */}
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'font-semibold',
              isSelected ? 'text-neon-400' : 'text-white'
            )}>
              버전 {versionData.version}
            </span>
            {isCurrent && (
              <Badge variant="cyan" className="text-xs px-1.5 py-0">
                현재
              </Badge>
            )}
          </div>

          {/* 시간 */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Clock className="w-3 h-3" />
            <span>{getRelativeTime(versionData.createdAt)}</span>
          </div>

          {/* 요약 */}
          {versionData.summary && (
            <p className="text-xs text-slate-400 truncate mt-1">
              {versionData.summary}
            </p>
          )}

          {/* 변경된 섹션 수 */}
          {versionData.changedSections !== undefined && versionData.changedSections > 0 && (
            <p className="text-xs text-slate-500 mt-1">
              {versionData.changedSections}개 섹션 수정
            </p>
          )}
        </div>

        {/* 상태 아이콘 */}
        <div className={cn(
          'flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center',
          versionData.status === 'COMPLETED' && 'bg-green-500/20 text-green-400',
          versionData.status === 'DRAFT' && 'bg-amber-500/20 text-amber-400',
          versionData.status === 'GENERATING' && 'bg-cyan-500/20 text-cyan-400'
        )}>
          <StatusIcon className={cn(
            'w-3.5 h-3.5',
            versionData.status === 'GENERATING' && 'animate-pulse'
          )} />
        </div>
      </div>
    </button>
  );
};

export default VersionListItem;

