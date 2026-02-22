import { ReactNode } from 'react';

export type ColorMode = 'vibrant' | 'monochrome';
export type BackgroundMode = 'solid' | 'soft' | 'ocean' | 'sunset' | 'snow' | 'space' | 'forest' | 'mosaic';
export type TabType = 'dashboard' | 'pomodoro' | 'subjects' | 'stats' | 'calendar' | 'achievements' | 'library' | 'manga' | 'exams' | 'tasks' | 'settings';
export type SidebarLayout = 'icons' | 'gaete' | 'bottom';

export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export interface Chapter {
  id: number;
  name: string;
  tasks: Task[];
}

export interface SubjectArea {
  id: number;
  name: string;
  chapters: Chapter[];
}

export interface SubjectFolder {
  id: number;
  name: string;
  areas: SubjectArea[];
}

// depth = quantos níveis intermediários antes de Capítulo → Tarefa
// 1 = Capítulo → Tarefa  (sem pasta nem área)
// 2 = Área → Capítulo → Tarefa
// 3 = Pasta → Área → Capítulo → Tarefa  (padrão completo)
export type SubjectDepth = 1 | 2 | 3;

export interface Subject {
  id: number;
  name: string;
  color: string;
  depth?: SubjectDepth;   // undefined = legacy (trata como 3)
  folders: SubjectFolder[];
  // legacy – kept for migration only
  areas?: SubjectArea[];
}

export interface Session {
  id: number;
  subject: string;
  duration: number;
  questions: number;
  correctQuestions: number;
  date: string;
  completed: boolean;
  sessionType?: 'teoria' | 'questao';
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  addedAt: string;
  completed: boolean;
}

export interface Manga {
  id: string;
  title: string;
  currentChapter: number;
  totalChapters?: number;
  addedAt: string;
  completed: boolean;
  coverUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  isUnlocked: boolean;
}

export interface EnemResult {
  id: string;
  year: number;
  linguagens: number; // 0-45
  cienciasHumanas: number; // 0-45
  cienciasNatureza: number; // 0-45
  matematica: number; // 0-45
  redacao?: number; // 0-1000
  addedAt: string;
}

export interface FuvestResult {
  id: string;
  year: number;
  fase1: number; // 0-90
  fase2Dia1?: number; // 0-10 (10 questões)
  fase2Dia2?: number; // 0-12 (12 questões)
  addedAt: string;
}

export interface CustomExamSection {
  id: string;
  name: string;
  maxQuestions: number;
}

export interface CustomExamTemplate {
  id: string;
  name: string;
  sections: CustomExamSection[];
  createdAt: string;
}

export interface CustomExamResultSection {
  sectionId: string;
  sectionName: string;
  correct: number;
  maxQuestions: number;
}

export interface CustomExamResult {
  id: string;
  templateId: string;
  templateName: string;
  year: number;
  sections: CustomExamResultSection[];
  addedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskGroup {
  id: string;
  name: string;
  color: string;
  tasks: TaskItem[];
  createdAt: string;
}