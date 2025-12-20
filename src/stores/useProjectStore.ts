/**
 * 파일명: useProjectStore.ts
 * 
 * 파일 용도:
 * 프로젝트 정보 관리를 위한 Zustand Store
 * - 현재 작업 중인 프로젝트 정보 저장
 * - 프로젝트 생성, 수정, 삭제
 * - 프로젝트 목록 관리
 * - 자동 저장 상태 관리
 * 
 * API 연동:
 * - projectService를 통해 백엔드 API 호출
 * 
 * 사용하는 컴포넌트:
 * - ProjectCreate: 프로젝트 생성
 * - Layout: 프로젝트명 표시
 * - SaveIndicator: 저장 상태 표시
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SaveStatus } from '@/types';
import { projectService } from '@/service/projectService';
import type { ProjectDetailResponse } from '@/types';

// 프로젝트 타입 (백엔드 응답 기반)
export interface Project {
  id: string;
  name: string;
  templateId: string;
  description?: string;
  status?: string;
  currentStep?: number;
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// 템플릿 타입
export interface Template {
  code: string;
  name: string;
  description: string;
  category: string;
}

interface ProjectState {
  /** 프로젝트 목록 */
  projects: Project[];
  /** 현재 작업 중인 프로젝트 */
  currentProject: Project | null;
  /** 템플릿 목록 */
  templates: Template[];
  /** 저장 상태 ('idle' | 'saving' | 'saved' | 'error') */
  saveStatus: SaveStatus;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  
  /** 템플릿 목록 조회 */
  fetchTemplates: (category?: string) => Promise<void>;
  /** 프로젝트 목록 조회 */
  fetchProjects: () => Promise<void>;
  /** 프로젝트 상세 조회 */
  fetchProject: (projectId: string) => Promise<void>;
  /** 새 프로젝트 생성 */
  createProject: (name: string, templateId: string) => Promise<Project>;
  /** 프로젝트 정보 업데이트 (로컬) */
  updateProject: (updates: Partial<Project>) => void;
  /** 현재 프로젝트 설정 */
  setCurrentProject: (project: Project | null) => void;
  /** 저장 상태 설정 */
  setSaveStatus: (status: SaveStatus) => void;
  /** 프로젝트 초기화 */
  clearProject: () => void;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * 백엔드 응답을 프론트엔드 형식으로 변환
 */
const convertToProject = (response: ProjectDetailResponse): Project => ({
  id: response.id,
  name: response.name,
  templateId: response.templateId,
  description: response.description,
  currentStep: response.currentStep,
  isCompleted: response.isCompleted,
  createdAt: response.createdAt,
  updatedAt: response.updatedAt,
});

/**
 * useProjectStore
 * 
 * 역할:
 * - 프로젝트 생명주기 관리
 * - 프로젝트 메타데이터 저장
 * - 자동 저장 피드백 제공
 * - projectService를 통해 백엔드 API 연동
 */
export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      templates: [],
      saveStatus: 'idle',
      isLoading: false,
      error: null,

      /**
       * 템플릿 목록 조회
       * @param category - 템플릿 카테고리 (government, bank, investor)
       */
      fetchTemplates: async (category?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectService.getTemplates(category);
          set({ 
            templates: response.templates,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '템플릿 조회에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 프로젝트 목록 조회
       */
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectService.getProjects();
          const projects = response.data.map(convertToProject);
          set({ 
            projects,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '프로젝트 목록 조회에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 프로젝트 상세 조회
       * @param projectId - 프로젝트 ID
       */
      fetchProject: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectService.getProject(projectId);
          const project = convertToProject(response);
          set({ 
            currentProject: project,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '프로젝트 조회에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 새 프로젝트 생성
       * @param name - 프로젝트 이름
       * @param templateId - 템플릿 ID
       * @returns 생성된 프로젝트
       */
      createProject: async (name: string, templateId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await projectService.createProject({
            name,
            templateId,
          });
          const newProject = convertToProject(response);
          
          set((state) => ({ 
            currentProject: newProject,
            projects: [...state.projects, newProject],
            isLoading: false,
          }));
          
          return newProject;
        } catch (error) {
          const message = error instanceof Error ? error.message : '프로젝트 생성에 실패했습니다.';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * 프로젝트 정보 업데이트 (로컬 상태)
       * @param updates - 업데이트할 필드들
       */
      updateProject: (updates: Partial<Project>) => {
        set((state) => {
          if (!state.currentProject) return state;
          const updatedProject = {
            ...state.currentProject,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === updatedProject.id ? updatedProject : p
            ),
          };
        });
      },

      /**
       * 현재 프로젝트 설정
       * @param project - 설정할 프로젝트
       */
      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project });
      },

      /**
       * 저장 상태 설정
       * @param status - 저장 상태
       */
      setSaveStatus: (status: SaveStatus) => {
        set({ saveStatus: status });
      },

      /**
       * 프로젝트 초기화
       */
      clearProject: () => {
        set({ currentProject: null, saveStatus: 'idle' });
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        currentProject: state.currentProject,
      }),
      // hydration 후 templates가 undefined가 되지 않도록 merge
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<ProjectState>),
        // 항상 배열로 초기화
        templates: currentState.templates,
        projects: currentState.projects,
      }),
    }
  )
);

export default useProjectStore;
