import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Clock, BookOpen, BarChart3, Calendar as CalendarIcon, Settings as SettingsIcon, Trophy, Library as LibraryIcon, Music, GraduationCap, CheckSquare, Layers, LayoutDashboard } from 'lucide-react';
import { Subject, Session, Book, Manga, EnemResult, FuvestResult, TabType, ColorMode, BackgroundMode, TaskGroup, TaskItem, SidebarLayout, CustomExamTemplate, CustomExamResult } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

import CustomStyles from './CustomStyles';
import PomodoroTimer from './PomodoroTimer';
import SubjectManager from './SubjectManager';
import Library from './Library';
import MangaTracker from './MangaTracker';
import ExamTracker from './ExamTracker';
import TaskManager from './TaskManager';
import Achievements from './Achievements';
import Statistics from './Statistics';
import Calendar from './Calendar';
import Settings from './Settings';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  // --- Main State ---
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [pomodoroAnimKey, setPomodoroAnimKey] = useState<number>(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(120);
  const [primaryColor, setPrimaryColor] = useState<string>('#ffffff');
  const [containerBgColor, setContainerBgColor] = useState<string>('');
  const [colorMode, setColorMode] = useState<ColorMode>('vibrant');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('solid');
  const [volume, setVolume] = useState<number>(0.5);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [sidebarLayout, setSidebarLayout] = useState<SidebarLayout>('icons');
  const [libraryBooks, setLibraryBooks] = useState<Book[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [enemResults, setEnemResults] = useState<EnemResult[]>([]);
  const [fuvestResults, setFuvestResults] = useState<FuvestResult[]>([]);
  const [customExamTemplates, setCustomExamTemplates] = useState<CustomExamTemplate[]>([]);
  const [customExamResults, setCustomExamResults] = useState<CustomExamResult[]>([]);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  
  // --- Music Player State ---
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState<boolean>(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState<boolean>(false);
  const [showFirstTimePrompt, setShowFirstTimePrompt] = useState<boolean>(false);
  const [showMusicConfig, setShowMusicConfig] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(50);
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const playerContainerIdRef = useRef<string>('youtube-player-' + Date.now());

  // --- Pomodoro State ---
  const [studyTime, setStudyTime] = useState<number | ''>(25);
  const [breakTime, setBreakTime] = useState<number | ''>(5);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionsResolved, setQuestionsResolved] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [correctQuestions, setCorrectQuestions] = useState(0);

  const intervalRef = useRef<number | null>(null);

  // Helper para obter data/hora local em formato ISO (corrige problema de timezone UTC)
  const getLocalISOString = () => {
    const now = new Date();
    return new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
  };

  // --- Cleanup ---
  useEffect(() => {
    // Criar elemento do player na inicialização
    const playerId = playerContainerIdRef.current;
    let playerElement = document.getElementById(playerId);
    if (!playerElement) {
      playerElement = document.createElement('div');
      playerElement.id = playerId;
      playerElement.style.display = 'none';
      document.body.appendChild(playerElement);
    }

  

  return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
      // Remover elemento do player
      const element = document.getElementById(playerId);
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, []);

  // --- Initialization ---
  const loadData = useCallback(() => {
    const loadedSubjects = storageService.getSubjects();
    const loadedSessions = storageService.getSessions();
    const loadedGoal = storageService.getDailyGoal();
    const loadedColor = storageService.getPrimaryColor();
    const loadedContainerBgColor = storageService.getContainerBgColor();
    const loadedColorMode = storageService.getColorMode();
    const loadedBackgroundMode = storageService.getBackgroundMode();
    const loadedVolume = storageService.getVolume();
    const loadedNotifications = storageService.getNotificationsEnabled();
    const loadedBooks = storageService.getBooks();
    const loadedMusicUrl = storageService.getMusicUrl();
    const loadedMusicVolume = storageService.getMusicVolume();
    const loadedMangas = storageService.getMangas();
    const loadedEnemResults = storageService.getEnemResults();
    const loadedFuvestResults = storageService.getFuvestResults();
    const loadedCustomExamTemplates = storageService.load('customExamTemplates', []) || [];
    const loadedCustomExamResults = storageService.load('customExamResults', []) || [];
    const loadedTaskGroups = storageService.getTaskGroups();
    const loadedSidebarLayout = storageService.getSidebarLayout();
    
    // Ensure compatibility with old data structure if needed
    const processedSubjects = loadedSubjects.map(s => {
       const withAreas = !s.areas ? { ...s, areas: [] } : s;
       const withFolders = !withAreas.folders ? { ...withAreas, folders: [] } : withAreas;
       // Assign default depth=3 to legacy subjects that don't have it
       const withDepth = withFolders.depth === undefined ? { ...withFolders, depth: 3 as const } : withFolders;
       return withDepth;
    });

    setSubjects(processedSubjects);
    setSessions(loadedSessions);
    setDailyGoal(loadedGoal);
    setPrimaryColor(loadedColor);
    setContainerBgColor(loadedContainerBgColor);
    setColorMode(loadedColorMode);
    setBackgroundMode(loadedBackgroundMode);
    setVolume(loadedVolume);
    setNotificationsEnabled(loadedNotifications);
    setLibraryBooks(loadedBooks);
    setMusicUrl(loadedMusicUrl);
    setMusicVolume(loadedMusicVolume);
    setMangas(loadedMangas);
    setEnemResults(loadedEnemResults);
    setFuvestResults(loadedFuvestResults);
    setCustomExamTemplates(loadedCustomExamTemplates);
    setCustomExamResults(loadedCustomExamResults);
    setTaskGroups(loadedTaskGroups);
    setSidebarLayout(loadedSidebarLayout);
    
    soundService.setVolume(loadedVolume);

    // Carregar música salva se existir
    if (loadedMusicUrl) {
      // Se tem música salva e ainda não mostrou o popup nesta sessão, mostra
      if (!storageService.hasShownAutoPlayPrompt()) {
        setShowMusicPrompt(true);
      }
    } else {
      // Se não tem música salva e ainda não mostrou o popup, pergunta se quer adicionar
      if (!storageService.hasShownAutoPlayPrompt()) {
        setShowFirstTimePrompt(true);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
    
    // Load YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      
      (window as any).onYouTubeIframeAPIReady = () => {
        console.log('YouTube API Ready');
      };
    }
  }, [loadData]);

  // --- Persistence ---
  const handleSaveSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    storageService.saveSubjects(newSubjects);
  }, []);

  const handleSaveSessions = useCallback((newSessions: Session[]) => {
    console.log('💾 handleSaveSessions chamado com:', newSessions[newSessions.length - 1]);
    setSessions(newSessions);
    storageService.saveSessions(newSessions);
  }, []);
  
  const handleSaveGoal = useCallback((minutes: number) => {
    setDailyGoal(minutes);
    storageService.saveDailyGoal(minutes);
  }, []);
  
  const handleContainerBgColorChange = useCallback((color: string) => {
    setContainerBgColor(color);
    storageService.saveContainerBgColor(color);
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setPrimaryColor(color);
    storageService.savePrimaryColor(color);
  }, []);

  const handleColorModeChange = useCallback((mode: ColorMode) => {
    setColorMode(mode);
    storageService.saveColorMode(mode);
  }, []);

  const handleBackgroundModeChange = useCallback((mode: BackgroundMode) => {
    setBackgroundMode(mode);
    storageService.saveBackgroundMode(mode);
  }, []);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
    storageService.saveVolume(vol);
    soundService.setVolume(vol);
    if (vol > 0) soundService.playStart(); 
  }, []);

  const handleNotificationsChange = useCallback((enabled: boolean) => {
    setNotificationsEnabled(enabled);
    storageService.saveNotificationsEnabled(enabled);
  }, []);

  const handleSidebarLayoutChange = useCallback((layout: SidebarLayout) => {
    setSidebarLayout(layout);
    storageService.saveSidebarLayout(layout);
  }, []);

  const handleAddBook = useCallback((book: Book) => {
    const newBooks = [book, ...libraryBooks];
    setLibraryBooks(newBooks);
    storageService.saveBooks(newBooks);
  }, [libraryBooks]);

  const handleRemoveBook = useCallback((id: string) => {
    const newBooks = libraryBooks.filter(b => b.id !== id);
    setLibraryBooks(newBooks);
    storageService.saveBooks(newBooks);
  }, [libraryBooks]);

  const handleToggleBookStatus = useCallback((id: string) => {
    const newBooks = libraryBooks.map(book => 
      book.id === id ? { ...book, completed: !book.completed } : book
    );
    setLibraryBooks(newBooks);
    storageService.saveBooks(newBooks);
  }, [libraryBooks]);

  const handleAddManga = useCallback((manga: Manga) => {
    const newMangas = [manga, ...mangas];
    setMangas(newMangas);
    storageService.saveMangas(newMangas);
  }, [mangas]);

  const handleUpdateManga = useCallback((id: string, updates: Partial<Manga>) => {
    const newMangas = mangas.map(manga =>
      manga.id === id ? { ...manga, ...updates } : manga
    );
    setMangas(newMangas);
    storageService.saveMangas(newMangas);
  }, [mangas]);

  const handleRemoveManga = useCallback((id: string) => {
    const newMangas = mangas.filter(m => m.id !== id);
    setMangas(newMangas);
    storageService.saveMangas(newMangas);
  }, [mangas]);

  // --- Exam Results Management ---
  const handleAddEnemResult = useCallback((result: EnemResult) => {
    const newResults = [result, ...enemResults];
    setEnemResults(newResults);
    storageService.saveEnemResults(newResults);
  }, [enemResults]);

  const handleRemoveEnemResult = useCallback((id: string) => {
    const newResults = enemResults.filter(r => r.id !== id);
    setEnemResults(newResults);
    storageService.saveEnemResults(newResults);
  }, [enemResults]);

  const handleAddFuvestResult = useCallback((result: FuvestResult) => {
    const newResults = [result, ...fuvestResults];
    setFuvestResults(newResults);
    storageService.saveFuvestResults(newResults);
  }, [fuvestResults]);

  const handleRemoveFuvestResult = useCallback((id: string) => {
    const newResults = fuvestResults.filter(r => r.id !== id);
    setFuvestResults(newResults);
    storageService.saveFuvestResults(newResults);
  }, [fuvestResults]);

  // --- Custom Exam Templates Management ---
  const handleAddCustomExamTemplate = useCallback((template: CustomExamTemplate) => {
    const newTemplates = [template, ...customExamTemplates];
    setCustomExamTemplates(newTemplates);
    storageService.save('customExamTemplates', newTemplates);
  }, [customExamTemplates]);

  const handleRemoveCustomExamTemplate = useCallback((id: string) => {
    const newTemplates = customExamTemplates.filter(t => t.id !== id);
    setCustomExamTemplates(newTemplates);
    storageService.save('customExamTemplates', newTemplates);
    // Remove associated results
    const newResults = customExamResults.filter(r => r.templateId !== id);
    setCustomExamResults(newResults);
    storageService.save('customExamResults', newResults);
  }, [customExamTemplates, customExamResults]);

  const handleAddCustomExamResult = useCallback((result: CustomExamResult) => {
    const newResults = [result, ...customExamResults];
    setCustomExamResults(newResults);
    storageService.save('customExamResults', newResults);
  }, [customExamResults]);

  const handleRemoveCustomExamResult = useCallback((id: string) => {
    const newResults = customExamResults.filter(r => r.id !== id);
    setCustomExamResults(newResults);
    storageService.save('customExamResults', newResults);
  }, [customExamResults]);

  // --- Task Groups Management ---
  const handleAddTaskGroup = useCallback((name: string, color: string) => {
    const newGroup: TaskGroup = {
      id: Date.now().toString(),
      name,
      color,
      tasks: [],
      createdAt: new Date().toISOString()
    };
    const newGroups = [...taskGroups, newGroup];
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  const handleRemoveTaskGroup = useCallback((groupId: string) => {
    const newGroups = taskGroups.filter(g => g.id !== groupId);
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  const handleUpdateTaskGroupName = useCallback((groupId: string, newName: string) => {
    const newGroups = taskGroups.map(g =>
      g.id === groupId ? { ...g, name: newName } : g
    );
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  const handleAddTask = useCallback((groupId: string, title: string) => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    const newGroups = taskGroups.map(g =>
      g.id === groupId ? { ...g, tasks: [...g.tasks, newTask] } : g
    );
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  const handleToggleTask = useCallback((groupId: string, taskId: string) => {
    const newGroups = taskGroups.map(g =>
      g.id === groupId
        ? {
            ...g,
            tasks: g.tasks.map(t =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            )
          }
        : g
    );
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  const handleRemoveTask = useCallback((groupId: string, taskId: string) => {
    const newGroups = taskGroups.map(g =>
      g.id === groupId
        ? { ...g, tasks: g.tasks.filter(t => t.id !== taskId) }
        : g
    );
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  const handleUpdateTaskTitle = useCallback((groupId: string, taskId: string, newTitle: string) => {
    const newGroups = taskGroups.map(g =>
      g.id === groupId
        ? {
            ...g,
            tasks: g.tasks.map(t =>
              t.id === taskId ? { ...t, title: newTitle } : t
            )
          }
        : g
    );
    setTaskGroups(newGroups);
    storageService.saveTaskGroups(newGroups);
  }, [taskGroups]);

  // --- Streak Logic ---
  const streak = useMemo(() => {
    const getLocalYMD = (date: Date) => {
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().split('T')[0];
    };

    const uniqueSessionDates = new Set(
      sessions.map(s => getLocalYMD(new Date(s.date)))
    );

    let count = 0;
    const today = new Date();
    const todayStr = getLocalYMD(today);

    let currentDate = today;
    
    if (uniqueSessionDates.has(todayStr)) {
      count = 1;
    } 
    
    currentDate.setDate(currentDate.getDate() - 1);
    
    while (true) {
      const dateStr = getLocalYMD(currentDate);
      
      if (uniqueSessionDates.has(dateStr)) {
        count++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return count;
  }, [sessions]);

  // --- Timer Logic ---
  const finishSession = useCallback((overrideQuestions?: number, overrideCorrect?: number, overrideDuration?: number, sessionType?: 'teoria' | 'questao') => {
    const currentStudyTime = Number(studyTime) || 25;
    
    // Se overrideDuration foi fornecido, usa ele; senão calcula o tempo decorrido
    let durationInMinutes: number;
    if (overrideDuration !== undefined) {
      durationInMinutes = overrideDuration;
    } else {
      // Calcula tempo decorrido: tempo total - tempo restante
      const timeElapsedInSeconds = (currentStudyTime * 60) - timeLeft;
      durationInMinutes = Math.ceil(timeElapsedInSeconds / 60); // Arredonda para cima
    }

    const finalQuestions = overrideQuestions !== undefined ? overrideQuestions : questionsResolved;
    const finalCorrect = overrideCorrect !== undefined ? overrideCorrect : correctQuestions;

    const newSession: Session = {
      id: Date.now(),
      subject: selectedSubject || 'Estudo Livre', // Use default if empty
      duration: durationInMinutes,
      questions: finalQuestions,
      correctQuestions: finalCorrect,
      date: getLocalISOString(),
      completed: true,
      sessionType: sessionType || 'questao'
    };

    console.log('💾 Salvando sessão:', newSession);
    console.log('⏱️ Tempo decorrido:', durationInMinutes, 'minutos');

    const newSessions = [...sessions, newSession];
    handleSaveSessions(newSessions);

    setIsRunning(false);
    setTimeLeft(currentStudyTime * 60);
    setQuestionsResolved(0);
    setCorrectQuestions(0);
    
    soundService.playAlarm();
    
    if (notificationsEnabled && Notification.permission === 'granted') {
      new Notification('Sessão Concluída!', {
        body: `Você estudou ${selectedSubject || 'Estudo Livre'} por ${durationInMinutes} minutos!`,
        icon: '/favicon.ico'
      });
    }
  }, [selectedSubject, studyTime, timeLeft, questionsResolved, correctQuestions, sessions, handleSaveSessions, notificationsEnabled]);

  const handleStart = useCallback(() => {
    // Removed requirement for selectedSubject
    if (notificationsEnabled && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setIsRunning(true);
    soundService.playStart();
  }, [notificationsEnabled]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    soundService.playPause();
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    const currentStudyTime = Number(studyTime) || 25;
    setTimeLeft(currentStudyTime * 60);
    soundService.playStop();
  }, [studyTime]);

  const handleTimerComplete = useCallback(() => {
    if (!isBreak) {
      // Não finaliza a sessão imediatamente - o modal de questões será mostrado
      // e finishSession será chamado após o usuário preencher as questões
      setIsRunning(false);
      soundService.playAlarm();
    } else {
      setIsBreak(false);
      const currentStudyTime = Number(studyTime) || 25;
      setTimeLeft(currentStudyTime * 60);
      setIsRunning(false);
      soundService.playAlarm();
    }
  }, [isBreak, studyTime]);

  const completeSessionAndStartBreak = useCallback((questions?: number, correct?: number, duration?: number, sessionType?: 'teoria' | 'questao') => {
    finishSession(questions, correct, duration, sessionType);
    setIsBreak(true);
    const currentBreakTime = Number(breakTime) || 5;
    setTimeLeft(currentBreakTime * 60);
    setIsRunning(true);
  }, [finishSession, breakTime]);

  const timerStartRef = useRef<{ startedAt: number; startTimeLeft: number } | null>(null);
  const handleTimerCompleteRef = useRef(handleTimerComplete);
  useEffect(() => { handleTimerCompleteRef.current = handleTimerComplete; }, [handleTimerComplete]);

  useEffect(() => {
    if (!isRunning) {
      timerStartRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      handleTimerComplete();
      return;
    }

    // Anchor to real clock so interval drift doesn't slow the timer
    timerStartRef.current = { startedAt: Date.now(), startTimeLeft: timeLeft };

    intervalRef.current = window.setInterval(() => {
      if (!timerStartRef.current) return;
      const elapsed = Math.floor((Date.now() - timerStartRef.current.startedAt) / 1000);
      const next = timerStartRef.current.startTimeLeft - elapsed;
      if (next <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setTimeLeft(0);
        handleTimerCompleteRef.current();
      } else {
        setTimeLeft(next);
      }
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, handleTimerComplete]);

  // --- Subject Management Logic (UPDATED HIERARCHY) ---
  const SUBJECT_COLORS = [
    '#ef4444', '#f97316', '#facc15', '#84cc16', '#10b981', '#06b6d4', 
    '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#14b8a6', '#6366f1', 
    '#ec4899', '#0ea5e9', '#a855f7', 
  ];

  const MONOCHROME_COLORS = [
    '#ffffff', '#fafafa', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', 
  ];

  const addSubject = (name: string, color: string, depth?: import('../types').SubjectDepth) => {
    const resolvedDepth = depth ?? 1;
    const now = Date.now();

    // Pre-build the internal structure based on depth so the subject is
    // immediately navigable without requiring the user to manually create
    // a folder or area first.
    //
    // depth=1: Capítulo → Tarefa
    //   one implicit folder (id=now+1) with one implicit area (id=now+2), chapters added by user
    // depth=2: Área → Capítulo → Tarefa
    //   one implicit folder (id=now+1), areas added by user
    // depth=3: Pasta → Área → Capítulo → Tarefa
    //   folders added by user (full manual flow)

    let folders: import('../types').SubjectFolder[] = [];

    if (resolvedDepth === 1) {
      folders = [{
        id: now + 1,
        name: '__implicit__',
        areas: [{
          id: now + 2,
          name: '__implicit__',
          chapters: []
        }]
      }];
    } else if (resolvedDepth === 2) {
      folders = [{
        id: now + 1,
        name: '__implicit__',
        areas: []
      }];
    }
    // depth=3: starts empty, user creates folders manually

    const newSubject: Subject = {
      id: now,
      name,
      color: color,
      depth: resolvedDepth,
      folders,
      areas: []
    };
    handleSaveSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (id: number) => {
    handleSaveSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubjectColor = (id: number, color: string) => {
    handleSaveSubjects(subjects.map(s => s.id === id ? { ...s, color } : s));
  };

  // ── Helper: update areas inside a specific folder ──────────────────────
  // All CRUD functions now accept (subjectId, folderId, areaId?, chapterId?, taskId?)
  // matching the signature SubjectManager passes via onAddArea / onDeleteArea etc.

  const updateSubjectFolderAreas = (
    subjectId: number,
    folderId: number,
    updateFn: (areas: import('../types').SubjectArea[]) => import('../types').SubjectArea[]
  ) => {
    return subjects.map(subject => {
      if (subject.id !== subjectId) return subject;
      return {
        ...subject,
        folders: subject.folders.map(folder => {
          if (folder.id !== folderId) return folder;
          return { ...folder, areas: updateFn(folder.areas) };
        })
      };
    });
  };

  const addArea = (subjectId: number, folderId: number, name: string) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas => [
      ...areas,
      { id: Date.now(), name, chapters: [] }
    ]));
  };

  const deleteArea = (subjectId: number, folderId: number, areaId: number) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.filter(a => a.id !== areaId)
    ));
  };

  const updateAreaName = (subjectId: number, folderId: number, areaId: number, newName: string) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(a => a.id === areaId ? { ...a, name: newName } : a)
    ));
  };

  const addChapter = (subjectId: number, folderId: number, areaId: number, name: string) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? { ...area, chapters: [...area.chapters, { id: Date.now(), name, tasks: [] }] }
        : area
      )
    ));
  };

  const deleteChapter = (subjectId: number, folderId: number, areaId: number, chapterId: number) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? { ...area, chapters: area.chapters.filter(c => c.id !== chapterId) }
        : area
      )
    ));
  };

  const updateChapterName = (subjectId: number, folderId: number, areaId: number, chapterId: number, newName: string) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? { ...area, chapters: area.chapters.map(c => c.id === chapterId ? { ...c, name: newName } : c) }
        : area
      )
    ));
  };

  const addTask = (subjectId: number, folderId: number, areaId: number, chapterId: number, name: string) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? {
            ...area,
            chapters: area.chapters.map(chapter => chapter.id === chapterId
              ? { ...chapter, tasks: [...chapter.tasks, { id: Date.now(), name, completed: false }] }
              : chapter
            )
          }
        : area
      )
    ));
  };

  const deleteTask = (subjectId: number, folderId: number, areaId: number, chapterId: number, taskId: number) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? {
            ...area,
            chapters: area.chapters.map(chapter => chapter.id === chapterId
              ? { ...chapter, tasks: chapter.tasks.filter(t => t.id !== taskId) }
              : chapter
            )
          }
        : area
      )
    ));
  };

  const toggleTask = (subjectId: number, folderId: number, areaId: number, chapterId: number, taskId: number) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? {
            ...area,
            chapters: area.chapters.map(chapter => chapter.id === chapterId
              ? { ...chapter, tasks: chapter.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
              : chapter
            )
          }
        : area
      )
    ));
  };

  const updateTaskName = (subjectId: number, folderId: number, areaId: number, chapterId: number, taskId: number, newName: string) => {
    handleSaveSubjects(updateSubjectFolderAreas(subjectId, folderId, areas =>
      areas.map(area => area.id === areaId
        ? {
            ...area,
            chapters: area.chapters.map(chapter => chapter.id === chapterId
              ? { ...chapter, tasks: chapter.tasks.map(t => t.id === taskId ? { ...t, name: newName } : t) }
              : chapter
            )
          }
        : area
      )
    ));
  };

  // Folder management (depth=3 only)
  const addFolder = (subjectId: number, name: string) => {
    handleSaveSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, folders: [...subject.folders, { id: Date.now(), name, areas: [] }] }
        : subject
    ));
  };

  const deleteFolder = (subjectId: number, folderId: number) => {
    handleSaveSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, folders: subject.folders.filter(f => f.id !== folderId) }
        : subject
    ));
  };

  const updateFolderName = (subjectId: number, folderId: number, newName: string) => {
    handleSaveSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, folders: subject.folders.map(f => f.id === folderId ? { ...f, name: newName } : f) }
        : subject
    ));
  };

    // --- Music Player Functions ---
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const destroyCurrentPlayer = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.stopVideo();
        playerRef.current.destroy();
      } catch (e) {
        console.error('Error destroying player:', e);
      }
      playerRef.current = null;
    }
    
    const oldElement = document.getElementById(playerContainerIdRef.current);
    if (oldElement && oldElement.parentNode) {
      oldElement.parentNode.removeChild(oldElement);
    }
    
    playerContainerIdRef.current = 'youtube-player-' + Date.now();
    const newElement = document.createElement('div');
    newElement.id = playerContainerIdRef.current;
    newElement.style.display = 'none';
    document.body.appendChild(newElement);
    
    setPlayerReady(false);
    setIsPlaying(false);
  }, []);

  const handleMusicUrlSubmit = useCallback((url: string) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      alert('URL do YouTube inválida.');
      return;
    }
    
    destroyCurrentPlayer();
    setMusicUrl(videoId);
    storageService.saveMusicUrl(videoId); // Salvar no localStorage
    storageService.resetAutoPlayPrompt(); // Reset para mostrar popup na próxima vez
    setShowMusicConfig(false);
    
    const initPlayer = () => {
      if (!(window as any).YT || !(window as any).YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }
      
      try {
        playerRef.current = new (window as any).YT.Player(playerContainerIdRef.current, {
          height: '0',
          width: '0',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            controls: 0,
          },
          events: {
            onReady: (event: any) => {
              setPlayerReady(true);
              event.target.setVolume(musicVolume);
              event.target.playVideo();
              setIsPlaying(true);
            },
            onStateChange: (event: any) => {
              if (event.data === (window as any).YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
            },
            onError: (event: any) => {
              console.error('YouTube Player Error:', event.data);
              alert('Erro ao carregar o vídeo. Tente outro URL.');
              destroyCurrentPlayer();
              setMusicUrl('');
            }
          }
        });
      } catch (e) {
        console.error('Error creating player:', e);
      }
    };
    
    initPlayer();
    soundService.playSave();
  }, [musicVolume, destroyCurrentPlayer]);

  const handleMusicVolumeChange = (newVolume: number) => {
    setMusicVolume(newVolume);
    storageService.saveMusicVolume(newVolume); // Salvar no localStorage
    if (playerRef.current && playerReady) {
      try {
        playerRef.current.setVolume(newVolume);
      } catch (e) {}
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current || !playerReady) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      soundService.playClick();
    } catch (e) {}
  };

  const stopMusic = useCallback(() => {
    destroyCurrentPlayer();
    setMusicUrl('');
    storageService.saveMusicUrl(''); // Limpar do localStorage
    storageService.resetAutoPlayPrompt(); // Reset prompt
    soundService.playClick();
  }, [destroyCurrentPlayer]);

  return (
    <div className={`app ${sidebarLayout === 'gaete' ? 'app-gaete' : ''} ${sidebarLayout === 'bottom' ? 'app-bottom' : ''}`}>
      <CustomStyles primaryColor={primaryColor} backgroundMode={backgroundMode} containerBgColor={containerBgColor} />

      {/* First Time Music Prompt Modal */}
      {showFirstTimePrompt && (
        <div className="music-prompt-overlay">
          <div className="music-prompt-modal">
            <h3>🎵 Adicionar música de fundo?</h3>
            <p>Você pode configurar uma música do YouTube para tocar enquanto estuda. Deseja adicionar uma agora?</p>
            <div className="music-prompt-buttons">
              <button 
                onClick={() => { 
                  setShowFirstTimePrompt(false);
                  storageService.setAutoPlayPromptShown();
                  setShowMusicConfig(true);
                  setShowMusicPlayer(true);
                  soundService.playClick();
                }} 
                className="btn-primary"
              >
                ✓ Sim, adicionar
              </button>
              <button 
                onClick={() => { 
                  setShowFirstTimePrompt(false); 
                  storageService.setAutoPlayPromptShown();
                  soundService.playClick();
                }} 
                className="btn-secondary"
              >
                ✗ Agora não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music Autoplay Prompt Modal */}
      {showMusicPrompt && musicUrl && (
        <div className="music-prompt-overlay">
          <div className="music-prompt-modal">
            <h3>🎵 Tocar música de fundo?</h3>
            <p>Você tem uma música padrão configurada. Deseja tocá-la agora?</p>
            <div className="music-prompt-buttons">
              <button 
                onClick={() => { 
                  soundService.playClick();
                  setShowMusicPrompt(false);
                  storageService.setAutoPlayPromptShown();
                  
                  // Garantir que o elemento do player existe
                  let playerElement = document.getElementById(playerContainerIdRef.current);
                  if (!playerElement) {
                    playerElement = document.createElement('div');
                    playerElement.id = playerContainerIdRef.current;
                    playerElement.style.display = 'none';
                    document.body.appendChild(playerElement);
                  }
                  
                  const initPlayer = () => {
                    if (!(window as any).YT || !(window as any).YT.Player) {
                      setTimeout(initPlayer, 100);
                      return;
                    }
                    
                    try {
                      playerRef.current = new (window as any).YT.Player(playerContainerIdRef.current, {
                        height: '0',
                        width: '0',
                        videoId: musicUrl,
                        playerVars: {
                          autoplay: 1,
                          loop: 1,
                          playlist: musicUrl,
                          controls: 0,
                        },
                        events: {
                          onReady: (event: any) => {
                            console.log('Player ready via autoplay');
                            setPlayerReady(true);
                            event.target.setVolume(musicVolume);
                            event.target.playVideo();
                            setIsPlaying(true);
                            setShowMusicPlayer(true);
                          },
                          onStateChange: (event: any) => {
                            if (event.data === (window as any).YT.PlayerState.PLAYING) {
                              setIsPlaying(true);
                            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                              setIsPlaying(false);
                            }
                          },
                          onError: (event: any) => {
                            console.error('YouTube Player Error:', event.data);
                            setPlayerReady(false);
                            setIsPlaying(false);
                          }
                        }
                      });
                    } catch (e) {
                      console.error('Error creating player:', e);
                    }
                  };
                  
                  // Pequeno delay para garantir que tudo está pronto
                  setTimeout(initPlayer, 500);
                }} 
                className="btn-primary"
              >
                ✓ Sim, tocar
              </button>
              <button 
                onClick={() => { 
                  setShowMusicPrompt(false); 
                  storageService.setAutoPlayPromptShown();
                  soundService.playCancel();
                }} 
                className="btn-secondary"
              >
                ✗ Não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music Player Panel */}
      {showMusicPlayer && (
        <div className="music-player-panel">
          <div className="music-player-header" style={{ justifyContent: 'space-between' }}>
             <button 
               onClick={() => { soundService.playClick(); setShowMusicConfig(!showMusicConfig); }} 
               className="close-btn" 
               style={{ fontSize: '1rem', width: 'auto', padding: '0 0.5rem' }}
               title="Configurar URL"
             >
               {showMusicConfig ? <ArrowLeft size={18} /> : <SettingsIcon size={18} />}
             </button>
            <button onClick={() => { soundService.playClick(); setShowMusicPlayer(false); }} className="close-btn">×</button>
          </div>
          
          <div className="music-player-content">
            {showMusicConfig ? (
              <>
                <p className="music-text" style={{ marginBottom: '0.5rem' }}>Link do YouTube:</p>
                <input
                  type="text"
                  placeholder="Cole o link aqui"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleMusicUrlSubmit((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="music-url-input"
                  style={{ marginBottom: '0.5rem' }}
                />
                <button 
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) {
                      soundService.playClick();
                      handleMusicUrlSubmit(input.value);
                    }
                  }}
                  className="btn-primary btn-small"
                  style={{ width: '100%' }}
                >
                  Carregar
                </button>
              </>
            ) : (
               <>
                 {musicUrl ? (
                    <div className="music-controls">
                      <div className="music-status">
                        <span className="music-text">
                          {isPlaying ? 'Tocando' : 'Pausado'}
                        </span>
                      </div>
                      
                      <div className="volume-control">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={musicVolume}
                          onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
                          className="volume-slider"
                        />
                        <span className="volume-value">{musicVolume}%</span>
                      </div>

                      <div className="music-buttons">
                        <button onClick={togglePlayPause} className="btn-control" disabled={!playerReady}>
                          {isPlaying ? 'Pausar' : 'Tocar'}
                        </button>
                        <button onClick={stopMusic} className="btn-control btn-stop">
                          Parar
                        </button>
                      </div>
                    </div>
                 ) : (
                   <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                     <p className="music-text" style={{ marginBottom: '1rem' }}>Nenhuma música carregada</p>
                     <button 
                       onClick={() => { soundService.playClick(); setShowMusicConfig(true); }}
                       className="btn-secondary btn-small"
                     >
                       Adicionar URL
                     </button>
                   </div>
                 )}
               </>
            )}
          </div>
        </div>
      )}

      {/* Logo fixo canto superior esquerdo — só no layout bottom */}
      {sidebarLayout === 'bottom' && (
        <div className="bottom-fixed-logo">
          <span className="sidebar-logo-g">G</span>
          <span className="sidebar-logo-rest">AETE</span>
        </div>
      )}

      <div className={`tabs ${sidebarLayout === 'gaete' ? 'tabs-gaete' : ''} ${sidebarLayout === 'bottom' ? 'tabs-bottom' : ''}`}>
        {/* GAETE Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-g">G</span>
          {(sidebarLayout === 'gaete' || sidebarLayout === 'bottom') && <span className="sidebar-logo-rest">AETE</span>}
        </div>

        {/* Nav Items */}
        <div className="sidebar-nav">
          {[
            { id: 'dashboard', icon: LayoutDashboard, title: 'Dashboard' },
            { id: 'pomodoro', icon: Clock, title: 'Foco' },
            { id: 'subjects', icon: BookOpen, title: 'Matérias' },
            { id: 'tasks', icon: CheckSquare, title: 'Tarefas' },
            { id: 'library', icon: LibraryIcon, title: 'Biblioteca' },
            { id: 'manga', icon: Layers, title: 'Mangás' },
            { id: 'exams', icon: GraduationCap, title: 'Provas' },
            { id: 'achievements', icon: Trophy, title: 'Conquistas' },
            { id: 'stats', icon: BarChart3, title: 'Estatísticas' },
            { id: 'calendar', icon: CalendarIcon, title: 'Calendário' },
            { id: 'settings', icon: SettingsIcon, title: 'Configurações' }
          ].map(t => (
            <button 
              key={t.id}
              className={`tab ${activeTab === t.id ? 'active' : ''}`} 
              onClick={() => {
                setActiveTab(t.id as TabType);
                soundService.playNavTab();
                if (t.id === 'pomodoro') setPomodoroAnimKey(k => k + 1);
                const el = contentRef.current;
                if (el) {
                  el.classList.remove('tab-entering');
                  void el.offsetWidth; // force reflow
                  el.classList.add('tab-entering');
                }
              }}
              title={sidebarLayout === 'bottom' ? undefined : t.title}
            >
              <t.icon size={20} />
              {(sidebarLayout === 'gaete' || sidebarLayout === 'bottom') && <span className="tab-label">{t.title}</span>}
            </button>
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="sidebar-bottom">
          <button
            className={`tab sidebar-music-btn ${showMusicPlayer ? 'active' : ''}`}
            onClick={() => { soundService.playClick(); setShowMusicPlayer(!showMusicPlayer); }}
            title={sidebarLayout === 'bottom' ? undefined : "Music Player"}
          >
            <Music size={22} />
            {(sidebarLayout === 'gaete' || sidebarLayout === 'bottom') && <span className="tab-label">Música</span>}
          </button>
        </div>
      </div>

      <div className="content tab-entering" ref={contentRef}>
        {activeTab === 'pomodoro' && (
          <div className="pomodoro-panel">
            <PomodoroTimer
              isBreak={isBreak}
              isRunning={isRunning}
              timeLeft={timeLeft}
              studyTime={studyTime}
              breakTime={breakTime}
              questionsResolved={questionsResolved}
              correctQuestions={correctQuestions}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
              onStudyTimeChange={(val) => {
                setStudyTime(val);
                if (!isRunning) setTimeLeft((Number(val) || 1) * 60);
              }}
              onBreakTimeChange={setBreakTime}
              onStudyTimeBlur={() => {
                if (studyTime === '' || Number(studyTime) < 1) {
                  setStudyTime(1);
                  if (!isRunning) setTimeLeft(60);
                }
              }}
              onBreakTimeBlur={() => {
                if (breakTime === '' || Number(breakTime) < 1) {
                  setBreakTime(1);
                }
              }}
              onQuestionsResolvedChange={setQuestionsResolved}
              onCorrectQuestionsChange={(val) => setCorrectQuestions(Math.min(val, questionsResolved))}
              notificationsEnabled={notificationsEnabled}
              subjects={subjects}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              onSessionComplete={completeSessionAndStartBreak}
              animationKey={pomodoroAnimKey}
            />
          </div>
        )}

        {activeTab !== 'pomodoro' && (
          <div className="tab-panel">
            {activeTab === 'dashboard' && (
              <Dashboard
                sessions={sessions}
                subjects={subjects}
                streak={streak}
                dailyGoal={dailyGoal}
                primaryColor={primaryColor}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectManager
                subjects={subjects}
                onAddSubject={addSubject}
                onDeleteSubject={deleteSubject}
                onUpdateSubjectColor={updateSubjectColor}
                onAddFolder={addFolder}
                onDeleteFolder={deleteFolder}
                onUpdateFolderName={updateFolderName}
                onAddArea={addArea}
                onDeleteArea={deleteArea}
                onUpdateAreaName={updateAreaName}
                onAddChapter={addChapter}
                onDeleteChapter={deleteChapter}
                onUpdateChapterName={updateChapterName}
                onAddTask={addTask}
                onDeleteTask={deleteTask}
                onUpdateTaskName={updateTaskName}
                onToggleTask={toggleTask}
              />
            )}

            {activeTab === 'library' && (
              <Library
                myBooks={libraryBooks}
                onAddBook={handleAddBook}
                onRemoveBook={handleRemoveBook}
                onToggleStatus={handleToggleBookStatus}
              />
            )}

            {activeTab === 'manga' && (
              <MangaTracker
                mangas={mangas}
                onAddManga={handleAddManga}
                onUpdateManga={handleUpdateManga}
                onRemoveManga={handleRemoveManga}
              />
            )}

            {activeTab === 'exams' && (
              <ExamTracker
                enemResults={enemResults}
                fuvestResults={fuvestResults}
                onAddEnemResult={handleAddEnemResult}
                onAddFuvestResult={handleAddFuvestResult}
                onRemoveEnemResult={handleRemoveEnemResult}
                onRemoveFuvestResult={handleRemoveFuvestResult}
                customExamTemplates={customExamTemplates}
                customExamResults={customExamResults}
                onAddCustomExamTemplate={handleAddCustomExamTemplate}
                onRemoveCustomExamTemplate={handleRemoveCustomExamTemplate}
                onAddCustomExamResult={handleAddCustomExamResult}
                onRemoveCustomExamResult={handleRemoveCustomExamResult}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskManager
                taskGroups={taskGroups}
                onAddGroup={handleAddTaskGroup}
                onRemoveGroup={handleRemoveTaskGroup}
                onUpdateGroupName={handleUpdateTaskGroupName}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onRemoveTask={handleRemoveTask}
                onUpdateTaskTitle={handleUpdateTaskTitle}
              />
            )}

            {activeTab === 'achievements' && (
              <Achievements 
                sessions={sessions} 
                subjects={subjects} 
                streak={streak} 
              />
            )}

            {activeTab === 'stats' && (
              <Statistics sessions={sessions} subjects={subjects} />
            )}

            {activeTab === 'calendar' && (
              <Calendar 
                sessions={sessions} 
                dailyGoal={dailyGoal}
                onUpdateGoal={handleSaveGoal}
              />
            )}

            {activeTab === 'settings' && (
              <Settings 
                onDataImported={loadData} 
                primaryColor={primaryColor} 
                onColorChange={handleColorChange}
                containerBgColor={containerBgColor}
                onContainerBgColorChange={handleContainerBgColorChange}
                colorMode={colorMode}
                onColorModeChange={handleColorModeChange}
                backgroundMode={backgroundMode}
                onBackgroundModeChange={handleBackgroundModeChange}
                volume={volume}
                onVolumeChange={handleVolumeChange}
                notificationsEnabled={notificationsEnabled}
                onNotificationsChange={handleNotificationsChange}
                sidebarLayout={sidebarLayout}
                onSidebarLayoutChange={handleSidebarLayoutChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;