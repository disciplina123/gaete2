import React, { useState } from 'react';
import { Library as LibraryIcon, BookOpen, ArrowLeft, GraduationCap, CheckSquare } from 'lucide-react';
import { Book, Manga, EnemResult, FuvestResult, TaskGroup, CustomExamTemplate, CustomExamResult } from '../types';
import { soundService } from '../services/soundService';
import Library from './Library';
import MangaTracker from './MangaTracker';
import ExamTracker from './ExamTracker';
import TaskManager from './TaskManager';

interface ToolsProps {
  libraryBooks: Book[];
  onAddBook: (book: Book) => void;
  onRemoveBook: (id: string) => void;
  onToggleBookStatus: (id: string) => void;
  mangas: Manga[];
  onAddManga: (manga: Manga) => void;
  onUpdateManga: (id: string, updates: Partial<Manga>) => void;
  onRemoveManga: (id: string) => void;
  enemResults: EnemResult[];
  fuvestResults: FuvestResult[];
  onAddEnemResult: (result: EnemResult) => void;
  onAddFuvestResult: (result: FuvestResult) => void;
  onRemoveEnemResult: (id: string) => void;
  onRemoveFuvestResult: (id: string) => void;
  customExamTemplates: CustomExamTemplate[];
  customExamResults: CustomExamResult[];
  onAddCustomExamTemplate: (template: CustomExamTemplate) => void;
  onRemoveCustomExamTemplate: (id: string) => void;
  onAddCustomExamResult: (result: CustomExamResult) => void;
  onRemoveCustomExamResult: (id: string) => void;
  taskGroups: TaskGroup[];
  onAddTaskGroup: (name: string, color: string) => void;
  onRemoveTaskGroup: (groupId: string) => void;
  onUpdateTaskGroupName: (groupId: string, newName: string) => void;
  onAddTask: (groupId: string, title: string) => void;
  onToggleTask: (groupId: string, taskId: string) => void;
  onRemoveTask: (groupId: string, taskId: string) => void;
  onUpdateTaskTitle: (groupId: string, taskId: string, newTitle: string) => void;
}

type ToolType = 'home' | 'library' | 'manga' | 'exams' | 'tasks';

const Tools: React.FC<ToolsProps> = ({ 
  libraryBooks, 
  onAddBook, 
  onRemoveBook, 
  onToggleBookStatus,
  mangas,
  onAddManga,
  onUpdateManga,
  onRemoveManga,
  enemResults,
  fuvestResults,
  onAddEnemResult,
  onAddFuvestResult,
  onRemoveEnemResult,
  onRemoveFuvestResult,
  customExamTemplates,
  customExamResults,
  onAddCustomExamTemplate,
  onRemoveCustomExamTemplate,
  onAddCustomExamResult,
  onRemoveCustomExamResult,
  taskGroups,
  onAddTaskGroup,
  onRemoveTaskGroup,
  onUpdateTaskGroupName,
  onAddTask,
  onToggleTask,
  onRemoveTask,
  onUpdateTaskTitle
}) => {
  const [activeTool, setActiveTool] = useState<ToolType>('home');

  const tools = [
    {
      id: 'tasks' as ToolType,
      name: 'Gerenciador de Tarefas',
      description: 'Organize tarefas em grupos personalizados',
      icon: CheckSquare,
      color: '#06b6d4',
      available: true
    },
    {
      id: 'library' as ToolType,
      name: 'Biblioteca',
      description: 'Gerencie seus livros e leituras',
      icon: LibraryIcon,
      color: '#8b5cf6',
      available: true
    },
    {
      id: 'manga' as ToolType,
      name: 'Rastreador de Mangás',
      description: 'Acompanhe seus mangás e capítulos',
      icon: BookOpen,
      color: '#ec4899',
      available: true
    },
    {
      id: 'exams' as ToolType,
      name: 'Organizador de Provas',
      description: 'Registre resultados do ENEM e FUVEST',
      icon: GraduationCap,
      color: '#10b981',
      available: true
    }
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case 'tasks':
        return (
          <TaskManager
            taskGroups={taskGroups}
            onAddGroup={onAddTaskGroup}
            onRemoveGroup={onRemoveTaskGroup}
            onUpdateGroupName={onUpdateTaskGroupName}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onRemoveTask={onRemoveTask}
            onUpdateTaskTitle={onUpdateTaskTitle}
          />
        );
      case 'library':
        return (
          <Library
            myBooks={libraryBooks}
            onAddBook={onAddBook}
            onRemoveBook={onRemoveBook}
            onToggleStatus={onToggleBookStatus}
          />
        );
      case 'manga':
        return (
          <MangaTracker
            mangas={mangas}
            onAddManga={onAddManga}
            onUpdateManga={onUpdateManga}
            onRemoveManga={onRemoveManga}
          />
        );
      case 'exams':
        return (
          <ExamTracker
            enemResults={enemResults}
            fuvestResults={fuvestResults}
            onAddEnemResult={onAddEnemResult}
            onAddFuvestResult={onAddFuvestResult}
            onRemoveEnemResult={onRemoveEnemResult}
            onRemoveFuvestResult={onRemoveFuvestResult}
            customExamTemplates={customExamTemplates}
            customExamResults={customExamResults}
            onAddCustomExamTemplate={onAddCustomExamTemplate}
            onRemoveCustomExamTemplate={onRemoveCustomExamTemplate}
            onAddCustomExamResult={onAddCustomExamResult}
            onRemoveCustomExamResult={onRemoveCustomExamResult}
          />
        );
      default:
        return null;
    }
  };

  if (activeTool !== 'home') {
    return (
      <div className="subjects-container subject-detail-view">
        <div className="subject-detail-header">
          <button onClick={() => { soundService.playCancel(); setActiveTool('home'); }} className="btn-back">
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="subject-detail-info">
            <h2 className="subject-detail-name">
              {tools.find(t => t.id === activeTool)?.name ?? 'Ferramenta'}
            </h2>
          </div>
        </div>
        <div className="subject-detail-content">
          {renderToolContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="subjects-container">
      <div className="subjects-grid-header">
        <h2 className="subjects-grid-title">Ferramentas</h2>
      </div>

      <div className="subjects-grid">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="subject-app-card tool-card-neutral"
              style={{
                cursor: tool.available ? 'pointer' : 'not-allowed',
                opacity: tool.available ? 1 : 0.5,
              }}
              onClick={() => { if (tool.available) { soundService.playClick(); setActiveTool(tool.id); } }}
            >
              <div className="tool-card-inner">
                <div className="subject-app-icon" style={{ backgroundColor: 'rgba(255,255,255,0.08)', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={26} style={{ color: 'rgba(255,255,255,0.75)' }} />
                </div>
                <h3 className="subject-app-name">{tool.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4, textAlign: 'center' }}>
                  {tool.description}
                </p>
                {!tool.available && (
                  <span className="tool-badge">Em breve</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tools;
