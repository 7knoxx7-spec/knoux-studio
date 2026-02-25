'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  type: 'photo' | 'video';
  data: unknown;
  thumbnail?: string;
  isPublic: boolean;
  shareId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;

  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  screen: 'welcome' | 'home' | 'photoEditor' | 'videoEditor' | 'settings' | 'help' | 'elysianCanvas';
  setScreen: (screen: AppState['screen']) => void;

  showSplash: boolean;
  showOnboarding: boolean;
  completeSplash: () => void;
  completeOnboarding: () => void;

  notifications: Notification[];
  showNotification: (type: Notification['type'], message: string, duration?: number) => void;
  hideNotification: (id: string) => void;

  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  userMode: 'beginner' | 'professional' | 'powerUser';
  setUserMode: (mode: 'beginner' | 'professional' | 'powerUser') => void;
  secureMode: boolean;
  toggleSecureMode: () => void;

  milestones: Record<string, number>;
  incrementMilestone: (key: string) => void;
  resetMilestones: () => void;

  initializeStore: () => void;
}

const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  if (typeof window === 'undefined') return;

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    return;
  }

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    return;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      projects: [],
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
        })),
      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      screen: 'welcome',
      setScreen: (screen) => set({ screen }),

      showSplash: true,
      showOnboarding: true,
      completeSplash: () => set({ showSplash: false }),
      completeOnboarding: () => set({ showOnboarding: false, screen: 'home' }),

      notifications: [],
      showNotification: (type, message, duration = 3000) => {
        const id = Date.now().toString();
        set((state) => ({
          notifications: [...state.notifications, { id, type, message, duration }],
        }));
        if (typeof window !== 'undefined') {
          window.setTimeout(() => {
            get().hideNotification(id);
          }, duration);
        }
      },
      hideNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      userMode: 'beginner',
      setUserMode: (mode) => set({ userMode: mode }),
      secureMode: false,
      toggleSecureMode: () => set((state) => ({ secureMode: !state.secureMode })),

      milestones: {},
      incrementMilestone: (key) =>
        set((state) => ({
          milestones: {
            ...state.milestones,
            [key]: (state.milestones[key] || 0) + 1,
          },
        })),
      resetMilestones: () => set({ milestones: {} }),

      initializeStore: () => {
        const { theme } = get();
        applyTheme(theme);
      },
    }),
    {
      name: 'knoux-art-storage',
      partialize: (state) => ({
        user: state.user,
        projects: state.projects,
        language: state.language,
        theme: state.theme,
        userMode: state.userMode,
        secureMode: state.secureMode,
        milestones: state.milestones,
        showOnboarding: state.showOnboarding,
      }),
    }
  )
);
