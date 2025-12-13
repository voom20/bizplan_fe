/**
 * 파일명: DiffView.tsx
 * 
 * 파일 용도:
 * 두 버전의 문서를 비교하여 변경사항을 표시하는 컴포넌트
 * - 추가/삭제/수정된 내용 하이라이트
 * - 나란히 보기 (Side-by-side) 또는 인라인 보기
 * - 섹션별 비교
 * 
 * 디자인: 다크 모드 + 코드 비교 스타일
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  GitCompare,
  ArrowLeftRight,
  Columns,
  AlignJustify
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { DocumentVersion } from '@/pages/business-plan/VersionListItem';
import { cn } from '@/common/utils';

/** 비교할 섹션 데이터 */
interface SectionContent {
  id: string;
  title: string;
  content: string;
}

/** 비교 결과 라인 */
interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  oldContent?: string;
  newContent?: string;
  content?: string;
}

/** Diff 결과 타입 (모든 속성을 포함) */
type DiffResult = DiffLine;

interface DiffViewProps {
  /** 이전 버전 */
  oldVersion: DocumentVersion;
  /** 새 버전 */
  newVersion: DocumentVersion;
  /** 이전 버전 섹션들 */
  oldSections: SectionContent[];
  /** 새 버전 섹션들 */
  newSections: SectionContent[];
  /** 닫기 핸들러 */
  onClose: () => void;
}

/**
 * 간단한 Diff 알고리즘
 * - 라인 단위로 비교
 * - 추가/삭제/변경 없음 표시
 */
const computeLineDiff = (oldText: string, newText: string): DiffLine[] => {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result: DiffLine[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === undefined) {
      result.push({ type: 'added', newContent: newLine });
    } else if (newLine === undefined) {
      result.push({ type: 'removed', oldContent: oldLine });
    } else if (oldLine === newLine) {
      result.push({ type: 'unchanged', content: oldLine });
    } else {
      result.push({ type: 'modified', oldContent: oldLine, newContent: newLine });
    }
  }

  return result;
};

/**
 * DiffView 컴포넌트
 * 
 * 역할:
 * - 두 버전의 문서 비교
 * - 변경사항 하이라이트
 * - 보기 모드 전환
 */
export const DiffView: React.FC<DiffViewProps> = ({
  oldVersion,
  newVersion,
  oldSections,
  newSections,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'inline' | 'side-by-side'>('inline');
  const [selectedSection, setSelectedSection] = useState<string | null>(
    newSections[0]?.id || null
  );

  // 선택된 섹션의 비교 결과
  const diffResult: DiffResult[] = useMemo(() => {
    if (!selectedSection) return [];

    const oldSection = oldSections.find(s => s.id === selectedSection);
    const newSection = newSections.find(s => s.id === selectedSection);

    if (!oldSection && newSection) {
      // 새로 추가된 섹션
      return newSection.content.split('\n').map(line => ({
        type: 'added' as const,
        newContent: line,
        oldContent: undefined,
        content: undefined,
      }));
    }

    if (oldSection && !newSection) {
      // 삭제된 섹션
      return oldSection.content.split('\n').map(line => ({
        type: 'removed' as const,
        oldContent: line,
        newContent: undefined,
        content: undefined,
      }));
    }

    if (oldSection && newSection) {
      return computeLineDiff(oldSection.content, newSection.content);
    }

    return [];
  }, [selectedSection, oldSections, newSections]);

  // 변경 통계
  const stats = useMemo(() => {
    const added = diffResult.filter(d => d.type === 'added').length;
    const removed = diffResult.filter(d => d.type === 'removed').length;
    const modified = diffResult.filter(d => d.type === 'modified').length;
    return { added, removed, modified };
  }, [diffResult]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/95 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">버전 비교</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Badge variant="slate">v{oldVersion.version}</Badge>
              <ArrowLeftRight className="w-4 h-4" />
              <Badge variant="neon">v{newVersion.version}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 변경 통계 */}
          <div className="flex items-center gap-3 text-sm mr-4">
            <span className="flex items-center gap-1 text-green-400">
              <Plus className="w-4 h-4" />
              {stats.added}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <Minus className="w-4 h-4" />
              {stats.removed}
            </span>
          </div>

          {/* 보기 모드 토글 */}
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setViewMode('inline')}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors',
                viewMode === 'inline' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <AlignJustify className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={cn(
                'px-3 py-1.5 text-sm transition-colors',
                viewMode === 'side-by-side' 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 섹션 목록 사이드바 */}
        <div className="w-64 border-r border-white/10 overflow-y-auto">
          <div className="p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">섹션</p>
            <div className="space-y-1">
              {newSections.map(section => {
                const oldSection = oldSections.find(s => s.id === section.id);
                const isNew = !oldSection;
                const isModified = oldSection && oldSection.content !== section.content;

                return (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      selectedSection === section.id 
                        ? 'bg-white/10 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{section.title}</span>
                      {isNew && (
                        <Badge variant="success" className="text-xs px-1.5 py-0">New</Badge>
                      )}
                      {isModified && (
                        <Badge variant="warning" className="text-xs px-1.5 py-0">수정</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Diff 내용 */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'inline' ? (
            // 인라인 모드
            <div className="p-6 font-mono text-sm">
              {diffResult.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    'px-4 py-1 border-l-2',
                    line.type === 'added' && 'bg-green-500/10 border-green-500 text-green-300',
                    line.type === 'removed' && 'bg-red-500/10 border-red-500 text-red-300',
                    line.type === 'modified' && 'bg-amber-500/10 border-amber-500',
                    line.type === 'unchanged' && 'border-transparent text-slate-400'
                  )}
                >
                  <span className="inline-block w-6 text-slate-600 select-none">
                    {line.type === 'added' && '+'}
                    {line.type === 'removed' && '-'}
                    {line.type === 'modified' && '~'}
                  </span>
                  {line.type === 'modified' ? (
                    <span>
                      <span className="line-through text-red-400/60 mr-2">{line.oldContent}</span>
                      <span className="text-green-400">{line.newContent}</span>
                    </span>
                  ) : (
                    <span>{line.content || line.newContent || line.oldContent}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 나란히 보기 모드
            <div className="flex h-full">
              {/* 이전 버전 */}
              <div className="flex-1 border-r border-white/10 overflow-y-auto">
                <div className="sticky top-0 px-4 py-2 bg-slate-800/90 backdrop-blur-sm border-b border-white/10">
                  <p className="text-sm text-slate-400">v{oldVersion.version} (이전)</p>
                </div>
                <div className="p-4 font-mono text-sm">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={cn(
                        'px-3 py-1',
                        (line.type === 'removed' || line.type === 'modified') && 'bg-red-500/10 text-red-300'
                      )}
                    >
                      {line.oldContent || line.content || ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* 새 버전 */}
              <div className="flex-1 overflow-y-auto">
                <div className="sticky top-0 px-4 py-2 bg-slate-800/90 backdrop-blur-sm border-b border-white/10">
                  <p className="text-sm text-slate-400">v{newVersion.version} (현재)</p>
                </div>
                <div className="p-4 font-mono text-sm">
                  {diffResult.map((line, index) => (
                    <div
                      key={index}
                      className={cn(
                        'px-3 py-1',
                        (line.type === 'added' || line.type === 'modified') && 'bg-green-500/10 text-green-300'
                      )}
                    >
                      {line.newContent || line.content || ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiffView;

