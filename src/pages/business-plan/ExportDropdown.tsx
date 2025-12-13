/**
 * 파일명: ExportDropdown.tsx
 * 
 * 파일 용도:
 * 문서 내보내기 드롭다운 컴포넌트
 * - PDF/HTML/HWP 형식 선택
 * - 다운로드 진행 상태 표시
 * - 에러 처리
 * 
 * 디자인: 다크 모드 + 글래스모피즘 + 네온 액센트
 */

import React, { useState, useRef, useEffect } from 'react';
import { FileDown, ChevronDown, FileText, Code, File, Check, Loader2, AlertCircle } from 'lucide-react';
import { useExportDocument } from '@/hooks/useExportDocument';
import { ExportFormat } from '@/lib/downloadFile';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/Progress';

/** 내보내기 형식 정보 */
interface FormatOption {
  id: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

/** 지원하는 형식 목록 */
const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'pdf',
    label: 'PDF',
    description: '인쇄용 문서 형식',
    icon: <FileText className="w-5 h-5" />,
    available: true,
  },
  {
    id: 'html',
    label: 'HTML',
    description: '웹 페이지 형식',
    icon: <Code className="w-5 h-5" />,
    available: true,
  },
  {
    id: 'hwp',
    label: 'HWP',
    description: '한글 문서 (추후 지원)',
    icon: <File className="w-5 h-5" />,
    available: false,
  },
];

interface ExportDropdownProps {
  /** 버전 번호 (optional) */
  version?: number;
  /** 문서 내용 (optional, Mock용) */
  content?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 컴팩트 모드 */
  compact?: boolean;
}

/**
 * ExportDropdown 컴포넌트
 * 
 * 역할:
 * - 문서 내보내기 형식 선택
 * - 다운로드 진행 상태 표시
 * - 에러 메시지 표시
 * 
 * @param {ExportDropdownProps} props - 컴포넌트 속성
 * @returns {JSX.Element} 내보내기 드롭다운
 */
export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  version,
  content,
  className,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { exportDocument, isExporting, exportingFormat, progress } = useExportDocument();

  /**
   * 외부 클릭 시 드롭다운 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * ESC 키로 드롭다운 닫기
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  /**
   * 형식 선택 핸들러
   */
  const handleFormatSelect = async (format: ExportFormat) => {
    setIsOpen(false);
    await exportDocument(format, { version, content });
  };

  /**
   * 토글 버튼 클릭 핸들러
   */
  const handleToggle = () => {
    if (!isExporting) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      ref={dropdownRef} 
      className={cn('relative inline-block', className)}
    >
      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isExporting}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300',
          'bg-gradient-to-r from-neon-500 to-neon-600',
          'text-slate-900 shadow-neon',
          'hover:from-neon-400 hover:to-neon-500',
          'focus:outline-none focus:ring-2 focus:ring-neon-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          compact && 'px-3 py-2 text-sm'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {isExporting ? (
          <>
            <Loader2 className={cn('animate-spin', compact ? 'w-4 h-4' : 'w-5 h-5')} />
            <span>{compact ? '내보내기...' : '내보내는 중...'}</span>
          </>
        ) : (
          <>
            <FileDown className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
            <span>{compact ? '내보내기' : '문서 내보내기'}</span>
            <ChevronDown className={cn(
              'transition-transform duration-200',
              compact ? 'w-4 h-4' : 'w-5 h-5',
              isOpen && 'rotate-180'
            )} />
          </>
        )}
      </button>

      {/* 진행률 표시 */}
      {isExporting && progress > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <Progress value={progress} max={100} color="neon" className="h-1.5" />
        </div>
      )}

      {/* 드롭다운 메뉴 */}
      {isOpen && !isExporting && (
        <div 
          className={cn(
            'absolute top-full right-0 mt-2 w-64 z-50',
            'glass-card p-2',
            'animate-fade-in-up'
          )}
          role="listbox"
          aria-label="내보내기 형식 선택"
        >
          <div className="text-xs text-slate-500 px-3 py-2 mb-1">
            형식 선택
          </div>
          
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleFormatSelect(option.id)}
              disabled={!option.available || isExporting}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200',
                option.available
                  ? 'hover:bg-white/10 text-white cursor-pointer'
                  : 'text-slate-500 cursor-not-allowed opacity-60',
                exportingFormat === option.id && 'bg-neon-500/20'
              )}
              role="option"
              aria-selected={exportingFormat === option.id}
              aria-disabled={!option.available}
            >
              {/* 아이콘 */}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                option.available 
                  ? option.id === 'pdf' 
                    ? 'bg-red-500/20 text-red-400'
                    : option.id === 'html'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-slate-500/20 text-slate-400'
                  : 'bg-slate-500/10 text-slate-500'
              )}>
                {option.icon}
              </div>

              {/* 텍스트 */}
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {option.label}
                  {!option.available && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-400">
                      준비중
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {option.description}
                </div>
              </div>

              {/* 선택 표시 */}
              {exportingFormat === option.id && (
                <Check className="w-5 h-5 text-neon-400" />
              )}
            </button>
          ))}

          {/* 안내 메시지 */}
          <div className="mt-2 px-3 py-2 text-xs text-slate-500 border-t border-white/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                다운로드된 파일은 브라우저 다운로드 폴더에 저장됩니다.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;

