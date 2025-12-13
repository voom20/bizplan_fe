/**
 * 파일명: index.ts
 * 
 * 파일 용도:
 * version 컴포넌트 barrel export
 * 
 * 포함 컴포넌트:
 * - VersionHistoryPanel: 버전 히스토리 사이드바
 * - VersionListItem: 버전 목록 아이템
 * - DiffView: 버전 비교 뷰
 */

export { VersionHistoryPanel } from '../VersionHistoryPanel';
export { VersionListItem } from '../VersionListItem';
export type { DocumentVersion, VersionStatus } from '../VersionListItem';
export { DiffView } from '../DiffView';

