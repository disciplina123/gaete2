import { Subject, Session, ColorMode, BackgroundMode, Book, Manga, EnemResult, FuvestResult, TaskGroup, SidebarLayout } from '../types';

const STORAGE_KEYS = {
  SUBJECTS: 'study-subjects',
  SESSIONS: 'study-sessions',
  DAILY_GOAL: 'study-daily-goal',
  PRIMARY_COLOR: 'study-primary-color',
  COLOR_MODE: 'study-color-mode',
  BACKGROUND_MODE: 'study-background-mode',
  VOLUME: 'study-volume',
  NOTIFICATIONS: 'study-notifications-enabled',
  LIBRARY: 'study-library-books',
  MUSIC_URL: 'study-music-url',
  MUSIC_VOLUME: 'study-music-volume',
  MUSIC_AUTO_PLAY_PROMPT_SHOWN: 'study-music-autoplay-prompt-shown',
  MANGAS: 'study-mangas',
  ENEM_RESULTS: 'study-enem-results',
  FUVEST_RESULTS: 'study-fuvest-results',
  CUSTOM_EXAM_TEMPLATES: 'study-custom-exam-templates',
  CUSTOM_EXAM_RESULTS: 'study-custom-exam-results',
  TASK_GROUPS: 'study-task-groups',
  ORIGINAL_COLORS: 'study-original-colors',
  SIDEBAR_LAYOUT: 'study-sidebar-layout',
  CONTAINER_BG_COLOR: 'study-container-bg-color',
};

export const storageService = {
  getSubjects: (): Subject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  },

  saveSubjects: (subjects: Subject[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects:', error);
    }
  },

  getSessions: (): Session[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  },

  saveSessions: (sessions: Session[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  },

  getDailyGoal: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      return data ? parseInt(data, 10) : 120; // Default 2 hours (120 mins)
    } catch (error) {
      return 120;
    }
  },

  saveDailyGoal: (minutes: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, minutes.toString());
    } catch (error) {
      console.error('Error saving daily goal:', error);
    }
  },

  getPrimaryColor: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#ffffff';
    } catch (error) {
      return '#ffffff';
    }
  },

  savePrimaryColor: (color: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, color);
    } catch (error) {
      console.error('Error saving primary color:', error);
    }
  },

  getColorMode: (): ColorMode => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.COLOR_MODE);
      return (mode === 'vibrant' || mode === 'monochrome') ? (mode as ColorMode) : 'vibrant';
    } catch (error) {
      return 'vibrant';
    }
  },

  saveColorMode: (mode: ColorMode): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLOR_MODE, mode);
    } catch (error) {
      console.error('Error saving color mode:', error);
    }
  },

  getBackgroundMode: (): BackgroundMode => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.BACKGROUND_MODE);
      if (['solid', 'soft', 'ocean', 'sunset', 'snow', 'space', 'forest', 'mosaic'].includes(mode as string)) {
        return mode as BackgroundMode;
      }
      return 'solid';
    } catch (error) {
      return 'solid';
    }
  },

  saveBackgroundMode: (mode: BackgroundMode): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_MODE, mode);
    } catch (error) {
      console.error('Error saving background mode:', error);
    }
  },

  getSidebarLayout: (): SidebarLayout => {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.SIDEBAR_LAYOUT);
      return (mode === 'icons' || mode === 'gaete' || mode === 'bottom') ? (mode as SidebarLayout) : 'icons';
    } catch (error) {
      return 'icons';
    }
  },

  saveSidebarLayout: (layout: SidebarLayout): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_LAYOUT, layout);
    } catch (error) {
      console.error('Error saving sidebar layout:', error);
    }
  },

  getContainerBgColor: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CONTAINER_BG_COLOR) || '';
    } catch (error) {
      return '';
    }
  },

  saveContainerBgColor: (color: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTAINER_BG_COLOR, color);
    } catch (error) {
      console.error('Error saving container bg color:', error);
    }
  },

  getTaskGroups: (): TaskGroup[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASK_GROUPS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading task groups:', error);
      return [];
    }
  },

  saveTaskGroups: (groups: TaskGroup[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASK_GROUPS, JSON.stringify(groups));
    } catch (error) {
      console.error('Error saving task groups:', error);
    }
  },

  getVolume: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOLUME);
      return data ? parseFloat(data) : 0.5; // Default 50%
    } catch (error) {
      return 0.5;
    }
  },

  saveVolume: (volume: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
    } catch (error) {
      console.error('Error saving volume:', error);
    }
  },

  getNotificationsEnabled: (): boolean => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data !== null ? JSON.parse(data) : true;
    } catch (error) {
      return true;
    }
  },

  saveNotificationsEnabled: (enabled: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(enabled));
    } catch (error) {
      console.error('Error saving notifications settings:', error);
    }
  },

  getBooks: (): Book[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    }
  },

  saveBooks: (books: Book[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(books));
    } catch (error) {
      console.error('Error saving books:', error);
    }
  },

  getMusicUrl: (): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MUSIC_URL) || '';
    } catch (error) {
      return '';
    }
  },

  saveMusicUrl: (url: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.MUSIC_URL, url);
    } catch (error) {
      console.error('Error saving music URL:', error);
    }
  },

  getMusicVolume: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME);
      return data ? parseInt(data, 10) : 50;
    } catch (error) {
      return 50;
    }
  },

  saveMusicVolume: (volume: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.MUSIC_VOLUME, volume.toString());
    } catch (error) {
      console.error('Error saving music volume:', error);
    }
  },

  resetAutoPlayPrompt: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.MUSIC_AUTO_PLAY_PROMPT_SHOWN);
    } catch (error) {
      console.error('Error resetting autoplay prompt:', error);
    }
  },

  hasShownAutoPlayPrompt: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.MUSIC_AUTO_PLAY_PROMPT_SHOWN) === 'true';
    } catch (error) {
      return false;
    }
  },

  setAutoPlayPromptShown: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.MUSIC_AUTO_PLAY_PROMPT_SHOWN, 'true');
    } catch (error) {
      console.error('Error setting autoplay prompt shown:', error);
    }
  },

  getMangas: (): Manga[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MANGAS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading mangas:', error);
      return [];
    }
  },

  saveMangas: (mangas: Manga[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.MANGAS, JSON.stringify(mangas));
    } catch (error) {
      console.error('Error saving mangas:', error);
    }
  },

  getEnemResults: (): EnemResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENEM_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading ENEM results:', error);
      return [];
    }
  },

  saveEnemResults: (results: EnemResult[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENEM_RESULTS, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving ENEM results:', error);
    }
  },

  getFuvestResults: (): FuvestResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FUVEST_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading FUVEST results:', error);
      return [];
    }
  },

  saveFuvestResults: (results: FuvestResult[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.FUVEST_RESULTS, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving FUVEST results:', error);
    }
  },

  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  createBackup: (): string => {
    const backup = {
      subjects: JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]'),
      sessions: JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]'),
      dailyGoal: localStorage.getItem(STORAGE_KEYS.DAILY_GOAL) || '120',
      primaryColor: localStorage.getItem(STORAGE_KEYS.PRIMARY_COLOR) || '#ffffff',
      colorMode: localStorage.getItem(STORAGE_KEYS.COLOR_MODE) || 'vibrant',
      backgroundMode: localStorage.getItem(STORAGE_KEYS.BACKGROUND_MODE) || 'default',
      subjectTheme: localStorage.getItem(STORAGE_KEYS.SUBJECT_THEME) || 'modern',
      volume: localStorage.getItem(STORAGE_KEYS.VOLUME) || '0.5',
      notificationsEnabled: localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || 'true',
      library: JSON.parse(localStorage.getItem(STORAGE_KEYS.LIBRARY) || '[]'),
      musicUrl: localStorage.getItem(STORAGE_KEYS.MUSIC_URL) || '',
      musicVolume: localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME) || '50',
      timestamp: new Date().toISOString(),
      version: 1
    };
    return JSON.stringify(backup, null, 2);
  },

  restoreBackup: (jsonString: string): boolean => {
    try {
      const backup = JSON.parse(jsonString);
      
      if (!Array.isArray(backup.subjects) || !Array.isArray(backup.sessions)) {
        console.error("Formato de backup inválido: 'subjects' ou 'sessions' não são listas.");
        return false;
      }

      if (backup.library && !Array.isArray(backup.library)) {
        console.error("Formato de backup inválido: 'library' não é uma lista.");
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(backup.subjects));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(backup.sessions));
      
      if (backup.dailyGoal) localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, backup.dailyGoal);
      if (backup.primaryColor) localStorage.setItem(STORAGE_KEYS.PRIMARY_COLOR, backup.primaryColor);
      if (backup.colorMode) localStorage.setItem(STORAGE_KEYS.COLOR_MODE, backup.colorMode);
      if (backup.backgroundMode) localStorage.setItem(STORAGE_KEYS.BACKGROUND_MODE, backup.backgroundMode);
      if (backup.subjectTheme) localStorage.setItem(STORAGE_KEYS.SUBJECT_THEME, backup.subjectTheme);
      if (backup.volume) localStorage.setItem(STORAGE_KEYS.VOLUME, backup.volume);
      if (backup.notificationsEnabled) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, backup.notificationsEnabled);
      if (backup.musicUrl) localStorage.setItem(STORAGE_KEYS.MUSIC_URL, backup.musicUrl);
      if (backup.musicVolume) localStorage.setItem(STORAGE_KEYS.MUSIC_VOLUME, backup.musicVolume);
      
      if (backup.library) {
        localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(backup.library));
      } else {
        localStorage.setItem(STORAGE_KEYS.LIBRARY, '[]');
      }
      
      return true;
    } catch (error) {
      console.error("Falha na restauração do backup:", error);
      return false;
    }
  },

  saveOriginalColors: (colors: Array<{ id: number; color: string }>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORIGINAL_COLORS, JSON.stringify(colors));
    } catch (error) {
      console.error('Error saving original colors:', error);
    }
  },

  getOriginalColors: (): Array<{ id: number; color: string }> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORIGINAL_COLORS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading original colors:', error);
      return [];
    }
  },

  save: (key: string, value: unknown): void => {
    try {
      localStorage.setItem('study-' + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving ' + key + ':', error);
    }
  },

  load: <T>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem('study-' + key);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.error('Error loading ' + key + ':', error);
      return fallback;
    }
  }
};
