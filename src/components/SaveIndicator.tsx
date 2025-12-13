/**
 * 파일명: SaveIndicator.tsx
 * 
 * 파일 용도:
 * 자동 저장 상태 표시 컴포넌트
 * - 다크 테마 + 네온 스타일
 * - 저장 중, 저장 완료, 저장 실패 상태를 시각적으로 표시
 */

import React from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { Check, Cloud, CloudOff, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * SaveIndicator 컴포넌트
 * 자동 저장 상태를 시각적으로 표시
 */
export const SaveIndicator: React.FC = () => {
  const { saveStatus } = useProjectStore();

  // idle 상태일 때는 클라우드 동기화 완료 아이콘 표시
  if (saveStatus === 'idle') {
    return (
      <div className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
        'backdrop-blur-sm border border-white/10',
        'bg-slate-500/10 text-slate-400'
      )}>
        <Cloud className="h-4 w-4" />
        <span>클라우드 동기화됨</span>
      </div>
    );
  }

  // 상태별 표시 정보 매핑
  const indicators = {
    saving: {
      icon: Loader2,
      text: '저장 중...',
      className: 'text-slate-400',
      iconClass: 'animate-spin',
      bgClass: 'bg-slate-500/10',
    },
    saved: {
      icon: Check,
      text: '저장됨',
      className: 'text-neon-400',
      iconClass: '',
      bgClass: 'bg-neon-500/10',
    },
    error: {
      icon: CloudOff,
      text: '저장 실패',
      className: 'text-red-400',
      iconClass: '',
      bgClass: 'bg-red-500/10',
      subIcon: AlertCircle,
    },
  };

  const indicator = indicators[saveStatus];
  const Icon = indicator.icon;

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
      'backdrop-blur-sm border border-white/10',
      indicator.bgClass,
      indicator.className
    )}>
      <Icon className={cn('h-4 w-4', indicator.iconClass)} />
      <span>{indicator.text}</span>
    </div>
  );
};
