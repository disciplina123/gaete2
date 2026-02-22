import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Trash2, ChevronDown, ChevronRight, Layers, Book, FolderPlus, FilePlus, ArrowLeft, Palette, Folder,
  Compass, Calculator, Zap, Landmark, Brain, Globe, PenLine, MessageSquare,
  Terminal, Music, Dumbbell, TrendingUp, Scale, Wrench,
  Leaf, BookOpen, Star, Award, Target
} from 'lucide-react';
import { Subject, SubjectDepth, ColorMode } from '../types';
import { soundService } from '../services/soundService';

const ICON_COLOR = 'rgba(255,255,255,0.75)';

const getSubjectIconComponent = (name: string): React.ReactNode => {
  const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const s = { color: ICON_COLOR };

  if (/geo(grafia)?/.test(n))                                              return <Compass size={24} style={s} />;
  if (/matematica|calculo|algebra|geometria|trigonometria|estatistica/.test(n)) return <Calculator size={24} style={s} />;
  if (/fisica/.test(n))                                                    return <Zap size={24} style={s} />;
  if (/quimica/.test(n))                                                   return <Target size={24} style={s} />;
  if (/biologia|botanica|zoologia|ecologia|anatomia/.test(n))              return <Leaf size={24} style={s} />;
  if (/historia/.test(n))                                                  return <Landmark size={24} style={s} />;
  if (/filosofia/.test(n))                                                 return <Brain size={24} style={s} />;
  if (/sociologia/.test(n))                                                return <Globe size={24} style={s} />;
  if (/portugues|redacao|literatura|linguistica/.test(n))                  return <PenLine size={24} style={s} />;
  if (/ingles|frances|espanhol|alemao|italiano|japones|mandarim|coreano|lingua/.test(n)) return <MessageSquare size={24} style={s} />;
  if (/programacao|computacao|informatica|algoritmo|codigo|software|hardware/.test(n))   return <Terminal size={24} style={s} />;
  if (/arte|desenho|pintura|escultura/.test(n))                            return <Star size={24} style={s} />;
  if (/musica|teoria musical/.test(n))                                     return <Music size={24} style={s} />;
  if (/educacao fisica|esporte/.test(n))                                   return <Dumbbell size={24} style={s} />;
  if (/economia|financas|contabilidade/.test(n))                           return <TrendingUp size={24} style={s} />;
  if (/direito|juridico/.test(n))                                          return <Scale size={24} style={s} />;
  if (/medicina|saude|enfermagem|farmacia|psicologia/.test(n))             return <Award size={24} style={s} />;
  if (/engenharia|arquitetura/.test(n))                                    return <Wrench size={24} style={s} />;
  if (/astronomia|astrofisica|religiao|teologia|politica/.test(n))         return <Globe size={24} style={s} />;
  if (/nutricao|agronomia|agricultura|veterinaria/.test(n))                return <Leaf size={24} style={s} />;

  return <BookOpen size={24} style={s} />;
};

interface SubjectManagerProps {
  subjects: Subject[];
  colorMode?: ColorMode;
  onAddSubject: (name: string, color: string, depth: SubjectDepth) => void;
  onDeleteSubject: (id: number) => void;
  onUpdateSubjectColor?: (id: number, color: string) => void;
  onAddFolder?: (subjectId: number, name: string) => void;
  onDeleteFolder?: (subjectId: number, folderId: number) => void;
  onUpdateFolderName?: (subjectId: number, folderId: number, name: string) => void;
  onAddArea: (subjectId: number, folderId: number | any, name: string) => void;
  onDeleteArea: (subjectId: number, folderId: number | any, areaId?: number) => void;
  onUpdateAreaName: (subjectId: number, folderId: number | any, areaId?: number | any, name?: string) => void;
  onAddChapter: (subjectId: number, folderId: number | any, areaId?: number | any, name?: string) => void;
  onDeleteChapter: (subjectId: number, folderId: number | any, areaId?: number | any, chapterId?: number) => void;
  onUpdateChapterName: (subjectId: number, folderId: number | any, areaId?: number | any, chapterId?: number | any, name?: string) => void;
  onAddTask: (subjectId: number, folderId: number | any, areaId?: number | any, chapterId?: number | any, name?: string) => void;
  onDeleteTask: (subjectId: number, folderId: number | any, areaId?: number | any, chapterId?: number | any, taskId?: number) => void;
  onUpdateTaskName: (subjectId: number, folderId: number | any, areaId?: number | any, chapterId?: number | any, taskId?: number | any, name?: string) => void;
  onToggleTask: (subjectId: number, folderId: number | any, areaId?: number | any, chapterId?: number | any, taskId?: number) => void;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects, colorMode = 'vibrant',
  onAddSubject, onDeleteSubject, onUpdateSubjectColor,
  onAddFolder, onDeleteFolder, onUpdateFolderName,
  onAddArea, onDeleteArea, onUpdateAreaName,
  onAddChapter, onDeleteChapter, onUpdateChapterName,
  onAddTask, onDeleteTask, onUpdateTaskName, onToggleTask,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorMode === 'monochrome' ? '#ffffff' : '#3b82f6');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedDepth, setSelectedDepth] = useState<SubjectDepth>(1);

  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const [editingFolder, setEditingFolder] = useState<number | null>(null);
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editingSubjectColor, setEditingSubjectColor] = useState<number | null>(null);
  const [tempColor, setTempColor] = useState('');

  const VIBRANT_COLORS = [
    '#ff2d55','#ff6b00','#ffcc00','#34c759','#00c7be','#007aff',
    '#5856d6','#af52de','#ff375f','#ff9f0a','#30d158','#64d2ff',
    '#bf5af2','#ff453a','#ffd60a','#32ade6'
  ];
  const MONOCHROME_COLORS = [
    '#ffffff','#e5e5ea','#c7c7cc','#aeaeb2','#8e8e93','#636366',
    '#48484a','#3a3a3c','#2c2c2e','#1c1c1e','#ff6b6b','#feca57',
    '#48dbfb','#ff9ff3','#54a0ff','#5f27cd'
  ];
  const AVAILABLE_COLORS = colorMode === 'monochrome' ? MONOCHROME_COLORS : VIBRANT_COLORS;

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const subjectDepth: SubjectDepth = (selectedSubject?.depth ?? 3) as SubjectDepth;
  const selectedFolder = selectedSubject?.folders?.find(f => f.id === selectedFolderId);

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    soundService.playAdd();
    onAddSubject(newSubjectName, selectedColor, selectedDepth);
    setNewSubjectName('');
    setSelectedColor(colorMode === 'monochrome' ? '#ffffff' : '#3b82f6');
    setSelectedDepth(1);
    setShowCreateModal(false);
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim() || !selectedSubjectId) return;
    soundService.playAdd();
    onAddFolder?.(selectedSubjectId, newFolderName);
    setNewFolderName('');
    setShowCreateFolderModal(false);
  };

  const toggleArea = (areaId: number) => {
    soundService.playClick();
    const key = `${selectedSubjectId}-${selectedFolderId}-${areaId}`;
    setExpandedAreas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChapter = (areaId: number, chapterId: number) => {
    soundService.playClick();
    const key = `${selectedSubjectId}-${selectedFolderId}-${areaId}-${chapterId}`;
    setExpandedChapters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ── VIEW 1: Subjects Grid ────────────────────────────────────────────────
  if (!selectedSubjectId) {
    return (
      <div className="subjects-container">
        <div className="subjects-grid-header">
          <h2 className="subjects-grid-title">Minhas Matérias</h2>
          <button onClick={() => { soundService.playAdd(); setShowCreateModal(true); }} className="btn-primary">
            <Plus size={20} /> Nova Matéria
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3>Nenhuma matéria criada ainda</h3>
            <p>Crie sua primeira matéria para começar a organizar seus estudos</p>
            <button onClick={() => { soundService.playAdd(); setShowCreateModal(true); }} className="btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={20} /> Criar Primeira Matéria
            </button>
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map(subject => (
              <div key={subject.id} className="subject-app-card"
                style={{ borderColor: subject.color, background: `linear-gradient(135deg, ${subject.color}15 0%, ${subject.color}05 100%)`, cursor: 'pointer' }}
                onClick={() => {
                  soundService.playClick();
                  setSelectedSubjectId(subject.id);
                  // depth 1: skip all levels, show chapters directly (handled in views below)
                  // depth 2: skip folders, show areas directly (handled in views below)
                  // depth 3: normal flow
                }}>
                <div className="subject-app-header">
                  <div className="subject-app-icon"
                    style={{ backgroundColor: `${subject.color}30`, boxShadow: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => { e.stopPropagation(); soundService.playClick(); setEditingSubjectColor(subject.id); setTempColor(subject.color); }}
                    title="Clique para mudar a cor">
                    {getSubjectIconComponent(subject.name)}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm(`Excluir "${subject.name}"?`)) { soundService.playDelete(); onDeleteSubject(subject.id); } }}
                    className="subject-app-delete" title="Excluir matéria">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="subject-app-body">
                  <h3 className="subject-app-name">{subject.name}</h3>

                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && createPortal(
          <div className="modal-overlay" onClick={() => { soundService.playCancel(); setShowCreateModal(false); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Nova Matéria</h2>
                <button className="modal-close" onClick={() => { soundService.playCancel(); setShowCreateModal(false); }}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-section-title">Nome da Matéria</label>
                  <input type="text" className="modal-input" placeholder="Ex: Matemática, Física..." value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()} autoFocus />
                </div>

                {/* 50/50 layout: cores em cima | hierarquia embaixo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>

                  {/* Cor */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label className="modal-section-title">Cor</label>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vibrantes</div>
                      <div className="color-picker-grid">
                        {VIBRANT_COLORS.map(c => (
                          <button key={c} className={`color-option ${selectedColor === c ? 'selected' : ''}`}
                            style={{ backgroundColor: c }} onClick={() => { soundService.playClick(); setSelectedColor(c); }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Neutras</div>
                      <div className="color-picker-grid">
                        {MONOCHROME_COLORS.map(c => (
                          <button key={c} className={`color-option ${selectedColor === c ? 'selected' : ''}`}
                            style={{ backgroundColor: c, border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => { soundService.playClick(); setSelectedColor(c); }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divisor horizontal */}
                  <div style={{ height: '1px', background: 'var(--border)', width: '100%' }} />

                  {/* Hierarquia */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label className="modal-section-title">Escolha como seu conteúdo vai ser organizado</label>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                      {([
                        {
                          value: 1 as SubjectDepth,
                          label: 'Capítulo → Tarefa',
                          examples: [
                            { text: 'Biologia',        indent: 0 },
                            { text: 'Célula',          indent: 1 },
                            { text: 'Estudar mitose',  indent: 2 },
                          ],
                        },
                        {
                          value: 2 as SubjectDepth,
                          label: 'Área → Capítulo → Tarefa',
                          examples: [
                            { text: 'Matemática',      indent: 0 },
                            { text: 'Álgebra',         indent: 1 },
                            { text: 'Equações',        indent: 2 },
                            { text: 'Resolver lista',  indent: 3 },
                          ],
                        },
                        {
                          value: 3 as SubjectDepth,
                          label: 'Pasta → Área → Capítulo → Tarefa',
                          examples: [
                            { text: 'Direito',         indent: 0 },
                            { text: 'Civil',           indent: 1 },
                            { text: 'Contratos',       indent: 2 },
                            { text: 'Nulidades',       indent: 3 },
                            { text: 'Fazer resumo',    indent: 4 },
                          ],
                        },
                      ] as { value: SubjectDepth; label: string; examples: { text: string; indent: number }[] }[]).map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { soundService.playClick(); setSelectedDepth(opt.value); }}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
                            padding: '18px 16px', borderRadius: '12px', cursor: 'pointer', width: '100%',
                            border: selectedDepth === opt.value ? '2px solid var(--primary-color)' : '2px solid var(--border)',
                            background: selectedDepth === opt.value ? 'var(--primary-color)15' : 'var(--bg-input)',
                            color: 'var(--text-primary)', textAlign: 'left',
                            transition: 'all 0.18s ease',
                            flex: 1,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                              border: selectedDepth === opt.value ? '2px solid var(--primary-color)' : '2px solid var(--text-muted)',
                              background: selectedDepth === opt.value ? 'var(--primary-color)' : 'transparent',
                              transition: 'all 0.18s ease',
                            }} />
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{opt.label}</span>
                          </div>
                          <div style={{
                            fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 2,
                            fontFamily: 'monospace', paddingLeft: '28px',
                          }}>
                            {opt.examples.map((item, i) => (
                              <div key={i} style={{ paddingLeft: `${item.indent * 18}px` }}>
                                {item.text}
                              </div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => { soundService.playCancel(); setShowCreateModal(false); }}>Cancelar</button>
                <button className="btn-primary" onClick={() => { soundService.playSave(); handleAddSubject(); }} disabled={!newSubjectName.trim()}>
                  <Plus size={18} /> Criar Matéria
                </button>
              </div>
            </div>
          </div>
        , document.body)}

        {editingSubjectColor !== null && createPortal(
          <div className="modal-overlay" onClick={() => { soundService.playCancel(); setEditingSubjectColor(null); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Alterar Cor da Matéria</h2>
                <button className="modal-close" onClick={() => { soundService.playCancel(); setEditingSubjectColor(null); }}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Cores Vibrantes</label>
                  <div className="color-picker-grid">
                    {VIBRANT_COLORS.map(c => <button key={c} className={`color-option ${tempColor===c?'selected':''}`} style={{backgroundColor:c}} onClick={()=>{ soundService.playClick(); setTempColor(c); }} />)}
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="modal-label">Cores Neutras</label>
                  <div className="color-picker-grid">
                    {MONOCHROME_COLORS.map(c => <button key={c} className={`color-option ${tempColor===c?'selected':''}`} style={{backgroundColor:c,border:'1px solid rgba(255,255,255,0.2)'}} onClick={()=>{ soundService.playClick(); setTempColor(c); }} />)}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => { soundService.playCancel(); setEditingSubjectColor(null); }}>Cancelar</button>
                <button className="btn-primary" onClick={() => { onUpdateSubjectColor?.(editingSubjectColor, tempColor); setEditingSubjectColor(null); soundService.playClick(); }}>
                  <Palette size={18} /> Aplicar Cor
                </button>
              </div>
            </div>
          </div>
        , document.body)}
      </div>
    );
  }

  // ── VIEW 2: Folders inside Subject (depth=3 only) ───────────────────────
  // For depth=1 or depth=2, auto-navigate to the pre-built implicit folder
  if (selectedSubjectId && !selectedFolderId) {
    if (subjectDepth === 1 || subjectDepth === 2) {
      if (selectedFolderId === null) {
        const implicitId = selectedSubject?.folders?.[0]?.id ?? 0;
        setTimeout(() => setSelectedFolderId(implicitId), 0);
        return <div />;
      }
    }
  }
  if (!selectedFolderId) {
    if (!selectedSubject) return <div>Matéria não encontrada</div>;
    return (
      <div className="subjects-container subject-detail-view">
        <div className="subject-detail-header">
          <button onClick={() => { soundService.playClick(); setSelectedSubjectId(null); }} className="btn-back">
            <ArrowLeft size={20} /> Voltar
          </button>
          <div className="subject-detail-info">
            <div className="subject-detail-marker" style={{ backgroundColor: selectedSubject.color, boxShadow: "none" }} />
            <h2 className="subject-detail-name">{selectedSubject.name}</h2>
          </div>
          <button onClick={() => { soundService.playAdd(); setShowCreateFolderModal(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FolderPlus size={18} /> Nova Pasta
          </button>
        </div>

        <div className="subject-detail-content">
          {(!selectedSubject.folders || selectedSubject.folders.length === 0) ? (
            <div className="empty-state">
              <div className="empty-state-icon">📁</div>
              <h3>Nenhuma pasta ainda</h3>
              <p>Crie pastas para organizar as áreas desta matéria</p>

            </div>
          ) : (
            <div className="subjects-grid">
              {selectedSubject.folders.map(folder => {
                return (
                  <div key={folder.id} className="subject-app-card"
                    style={{ borderColor: selectedSubject.color, background: `linear-gradient(135deg, ${selectedSubject.color}12 0%, ${selectedSubject.color}04 100%)`, cursor: 'pointer' }}
                    onClick={() => { soundService.playClick(); setSelectedFolderId(folder.id); }}>
                    <div className="subject-app-header">
                      <div className="subject-app-icon" style={{ backgroundColor: `${selectedSubject.color}25`, boxShadow: 'none', display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <Folder size={24} style={{ color: 'rgba(255,255,255,0.75)' }} />
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); if (confirm(`Excluir a pasta "${folder.name}"?`)) { soundService.playDelete(); onDeleteFolder?.(selectedSubject.id, folder.id); } }}
                        className="subject-app-delete" title="Excluir pasta">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="subject-app-body">
                      {editingFolder === folder.id ? (
                        <input type="text" defaultValue={folder.name} className="modern-edit-input"
                          style={{ fontSize: '1.1rem', fontWeight: 600, width: '100%' }}
                          autoFocus onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => { setEditingFolder(null); if (e.target.value.trim()) onUpdateFolderName?.(selectedSubject.id, folder.id, e.target.value); }}
                          onKeyPress={(e) => { if (e.key==='Enter') { setEditingFolder(null); const v=(e.target as HTMLInputElement).value.trim(); if(v) onUpdateFolderName?.(selectedSubject.id,folder.id,v); } }}
                        />
                      ) : (
                        <h3 className="subject-app-name" onDoubleClick={(e) => { e.stopPropagation(); setEditingFolder(folder.id); }}>
                          {folder.name}
                        </h3>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showCreateFolderModal && createPortal(
          <div className="modal-overlay" onClick={() => { soundService.playCancel(); setShowCreateFolderModal(false); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Nova Pasta</h2>
                <button className="modal-close" onClick={() => { soundService.playCancel(); setShowCreateFolderModal(false); }}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="modal-label">Nome da Pasta</label>
                  <input type="text" className="modal-input" placeholder="Ex: Aritmética, Álgebra, Geometria..."
                    value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()} autoFocus />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => { soundService.playCancel(); setShowCreateFolderModal(false); }}>Cancelar</button>
                <button className="btn-primary" onClick={() => { soundService.playSave(); handleAddFolder(); }} disabled={!newFolderName.trim()}>
                  <FolderPlus size={18} /> Criar Pasta
                </button>
              </div>
            </div>
          </div>
        , document.body)}
      </div>
    );
  }

  // ── VIEW 3: Areas + Chapters inside Folder (adapts to depth) ───────────
  if (!selectedSubject) return <div>Matéria não encontrada</div>;

  // depth<3 uses the pre-built implicit folder (first folder in the array)
  // depth=3 uses the real selected folder
  const implicitFolder = subjectDepth < 3 ? selectedSubject.folders?.[0] : null;
  const isSentinelFolder = selectedFolderId === 0 || (subjectDepth < 3 && implicitFolder != null && selectedFolderId === implicitFolder.id);
  if (!isSentinelFolder && !selectedFolder) return <div>Pasta não encontrada</div>;

  // Real folder ID to use in all operations
  const activeFolderId = isSentinelFolder
    ? (implicitFolder?.id ?? selectedSubject.folders?.[0]?.id ?? 0)
    : selectedFolder!.id;

  const effectiveAreas = isSentinelFolder
    ? (implicitFolder?.areas ?? selectedSubject.folders?.[0]?.areas ?? selectedSubject.areas ?? [])
    : (selectedFolder?.areas ?? []);

  // Labels per depth
  const areaLabel    = subjectDepth === 1 ? null : 'Área';
  const showAreaLevel   = subjectDepth >= 2;
  const showFolderLevel = subjectDepth >= 3;

  // Back button logic
  const handleBack = () => {
    soundService.playClick();
    if (isSentinelFolder) {
      setSelectedFolderId(null);
      setSelectedSubjectId(null);
    } else {
      setSelectedFolderId(null);
    }
  };

  // Add area handler
  const handleAddArea = () => {
    soundService.playAdd();
    onAddArea(selectedSubject.id, activeFolderId, 'Nova Área');
  };

  return (
    <div className="subjects-container subject-detail-view">
      <div className="subject-detail-header">
        <button onClick={() => { soundService.playCancel(); handleBack(); }} className="btn-back">
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="subject-detail-info">
          <div className="subject-detail-marker" style={{ backgroundColor: selectedSubject.color, boxShadow: "none" }} />
          <h2 className="subject-detail-name">
            {showFolderLevel && selectedFolder ? (
              <><span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9em' }}>{selectedSubject.name} /</span>{' '}{selectedFolder.name}</>
            ) : (
              selectedSubject.name
            )}
          </h2>
        </div>
        {showAreaLevel && (
          <button onClick={() => { soundService.playAdd(); handleAddArea(); }} className="btn-primary">
            <FolderPlus size={18} /> Nova {areaLabel}
          </button>
        )}
        {!showAreaLevel && (
          <button onClick={() => {
            soundService.playAdd();
            const fId = activeFolderId;
            const aId = effectiveAreas[0]?.id ?? 0;
            onAddChapter(selectedSubject.id, fId, aId, 'Novo Capítulo');
          }} className="btn-primary">
            <FolderPlus size={18} /> Novo Capítulo
          </button>
        )}
      </div>

      <div className="subject-detail-content">
        <div className="tree-level-1-grid">
          {(() => {
            const fId = activeFolderId;
            const areas = effectiveAreas;

            // depth=1: show chapters directly (one implicit area)
            if (subjectDepth === 1) {
              const implicitArea = areas[0];
              const chapters = implicitArea?.chapters ?? [];
              return (
                <div style={{ width: '100%' }}>
                  {chapters.length === 0 && <div className="empty-branch">Nenhum capítulo criado ainda.</div>}
                  {chapters.map(chapter => {
                    const chapterKey = `${selectedSubject.id}-${fId}-0-${chapter.id}`;
                    const isChapterExpanded = expandedChapters[chapterKey];
                    return (
                      <div key={chapter.id} className="chapter-block" style={{ marginBottom: '0.5rem' }}>
                        <div className="chapter-header-modern">
                          <div onClick={() => { soundService.playClick(); toggleChapter(0, chapter.id); }} style={{cursor:'pointer',marginRight:'6px',color:'var(--text-muted)',display:'flex',alignItems:'center'}}>
                            {isChapterExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                          </div>
                          <div className="chapter-title-modern">
                            <Book size={14} style={{ opacity:0.7 }}/>
                            {editingChapter === chapterKey ? (
                              <input type="text" defaultValue={chapter.name} autoFocus className="modern-edit-input"
                                onBlur={(e)=>{setEditingChapter(null);if(e.target.value.trim()) onUpdateChapterName(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,e.target.value);}}
                                onKeyPress={(e)=>{if(e.key==='Enter'){setEditingChapter(null);const v=(e.target as HTMLInputElement).value.trim();if(v) onUpdateChapterName(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,v);}}}/>
                            ) : <span onClick={()=>{ soundService.playFocus(); setEditingChapter(chapterKey); }}>{chapter.name}</span>}
                          </div>
                          <div className="modern-actions" style={{opacity:0.6}}>
                            <button onClick={(e)=>{e.stopPropagation();soundService.playAdd();if(!isChapterExpanded) toggleChapter(0,chapter.id);onAddTask(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,'Nova Tarefa');}}
                              className="modern-action-btn" title="Adicionar Tarefa" style={{width:'24px',height:'24px',border:'none'}}><FilePlus size={14}/></button>
                            <button onClick={()=>{soundService.playDelete();onDeleteChapter(selectedSubject.id,fId,implicitArea?.id??0,chapter.id);}}
                              className="modern-action-btn delete" style={{width:'24px',height:'24px',border:'none'}}><Trash2 size={14}/></button>
                          </div>
                        </div>
                        {isChapterExpanded && (
                          <div className="tree-level-3">
                            {chapter.tasks.length > 0 ? chapter.tasks.map(task => {
                              const taskKey = `${chapterKey}-${task.id}`;
                              return (
                                <div key={task.id} className="task-modern">
                                  <input type="checkbox" className="task-checkbox-modern" checked={task.completed}
                                    onChange={()=>{soundService.playToggle();onToggleTask(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,task.id);}}/>
                                  {editingTask === taskKey ? (
                                    <input type="text" defaultValue={task.name} autoFocus className="modern-edit-input"
                                      onBlur={(e)=>{setEditingTask(null);if(e.target.value.trim()) onUpdateTaskName(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,task.id,e.target.value);}}
                                      onKeyPress={(e)=>{if(e.key==='Enter'){setEditingTask(null);const v=(e.target as HTMLInputElement).value.trim();if(v) onUpdateTaskName(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,task.id,v);}}}/>
                                  ) : <span className={`task-label-modern ${task.completed?'completed':''}`} onClick={()=>setEditingTask(taskKey)}>{task.name}</span>}
                                  <button onClick={()=>{soundService.playDelete();onDeleteTask(selectedSubject.id,fId,implicitArea?.id??0,chapter.id,task.id);}}
                                    className="modern-action-btn delete" style={{width:'20px',height:'20px',background:'transparent',opacity:0.5}}><Trash2 size={12}/></button>
                                </div>
                              );
                            }) : <div className="empty-branch">Sem tarefas...</div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            // depth=2 or depth=3: show areas
            return areas.length > 0 ? areas.map(area => {
            const areaKey = `${selectedSubject.id}-${fId}-${area.id}`;
            const isAreaExpanded = expandedAreas[areaKey];

            return (
              <div key={area.id} className={`area-block-card ${isAreaExpanded ? 'expanded' : ''}`}>
                <div className="area-header-modern">
                  <div onClick={() => { soundService.playClick(); toggleArea(area.id); }} style={{ cursor:'pointer',marginRight:'8px',color:'var(--text-muted)',display:'flex',alignItems:'center' }}>
                    {isAreaExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  <div className="area-title-modern">
                    <Layers size={14} style={{ color: selectedSubject.color }} />
                    {editingArea === areaKey ? (
                      <input type="text" defaultValue={area.name} autoFocus className="modern-edit-input"
                        onBlur={(e) => { setEditingArea(null); if(e.target.value.trim()) onUpdateAreaName(selectedSubject.id, fId, area.id, e.target.value); }}
                        onKeyPress={(e) => { if(e.key==='Enter'){setEditingArea(null);const v=(e.target as HTMLInputElement).value.trim();if(v) onUpdateAreaName(selectedSubject.id,fId,area.id,v);}}} />
                    ) : (
                      <span onClick={() => { soundService.playFocus(); setEditingArea(areaKey); }}>{area.name}</span>
                    )}
                  </div>
                  <div className="modern-actions" style={{ opacity:1 }}>
                    <button onClick={(e)=>{e.stopPropagation();soundService.playAdd();if(!isAreaExpanded) toggleArea(area.id);onAddChapter(selectedSubject.id,fId,area.id,"Novo Capítulo");}}
                      className="modern-action-btn" title="Adicionar Capítulo" style={{width:'28px',height:'28px'}}>
                      <Plus size={14} />
                    </button>
                    <button onClick={()=>{soundService.playDelete();onDeleteArea(selectedSubject.id,fId,area.id);}}
                      className="modern-action-btn delete" style={{width:'28px',height:'28px'}}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {isAreaExpanded && (
                  <div className="tree-level-2">
                    {area.chapters && area.chapters.length > 0 ? area.chapters.map(chapter => {
                      const chapterKey = `${selectedSubject.id}-${fId}-${area.id}-${chapter.id}`;
                      const isChapterExpanded = expandedChapters[chapterKey];

                      return (
                        <div key={chapter.id} className="chapter-block">
                          <div className="chapter-header-modern">
                            <div onClick={()=>{ soundService.playClick(); toggleChapter(area.id,chapter.id); }} style={{cursor:'pointer',marginRight:'6px',color:'var(--text-muted)',display:'flex',alignItems:'center'}}>
                              {isChapterExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>
                            <div className="chapter-title-modern">
                              <Book size={14} style={{ opacity:0.7 }} />
                              {editingChapter === chapterKey ? (
                                <input type="text" defaultValue={chapter.name} autoFocus className="modern-edit-input"
                                  onBlur={(e)=>{setEditingChapter(null);if(e.target.value.trim()) onUpdateChapterName(selectedSubject.id,fId,area.id,chapter.id,e.target.value);}}
                                  onKeyPress={(e)=>{if(e.key==='Enter'){setEditingChapter(null);const v=(e.target as HTMLInputElement).value.trim();if(v) onUpdateChapterName(selectedSubject.id,fId,area.id,chapter.id,v);}}} />
                              ) : (
                                <span onClick={()=>{ soundService.playFocus(); setEditingChapter(chapterKey); }}>{chapter.name}</span>
                              )}
                            </div>
                            <div className="modern-actions" style={{ opacity:0.6 }}>
                              <button onClick={(e)=>{e.stopPropagation();soundService.playAdd();if(!isChapterExpanded) toggleChapter(area.id,chapter.id);onAddTask(selectedSubject.id,fId,area.id,chapter.id,"Nova Tarefa");}}
                                className="modern-action-btn" title="Adicionar Tarefa" style={{width:'24px',height:'24px',border:'none'}}>
                                <FilePlus size={14} />
                              </button>
                              <button onClick={()=>{soundService.playDelete();onDeleteChapter(selectedSubject.id,fId,area.id,chapter.id);}}
                                className="modern-action-btn delete" style={{width:'24px',height:'24px',border:'none'}}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {isChapterExpanded && (
                            <div className="tree-level-3">
                              {chapter.tasks.length > 0 ? chapter.tasks.map(task => {
                                const taskKey = `${chapterKey}-${task.id}`;
                                return (
                                  <div key={task.id} className="task-modern">
                                    <input type="checkbox" className="task-checkbox-modern" checked={task.completed}
                                      onChange={()=>{soundService.playToggle();onToggleTask(selectedSubject.id,fId,area.id,chapter.id,task.id);}} />
                                    {editingTask === taskKey ? (
                                      <input type="text" defaultValue={task.name} autoFocus className="modern-edit-input"
                                        onBlur={(e)=>{setEditingTask(null);if(e.target.value.trim()) onUpdateTaskName(selectedSubject.id,fId,area.id,chapter.id,task.id,e.target.value);}}
                                        onKeyPress={(e)=>{if(e.key==='Enter'){setEditingTask(null);const v=(e.target as HTMLInputElement).value.trim();if(v) onUpdateTaskName(selectedSubject.id,fId,area.id,chapter.id,task.id,v);}}} />
                                    ) : (
                                      <span className={`task-label-modern ${task.completed ? 'completed' : ''}`} onClick={()=>{ soundService.playFocus(); setEditingTask(taskKey); }}>
                                        {task.name}
                                      </span>
                                    )}
                                    <button onClick={()=>{soundService.playDelete();onDeleteTask(selectedSubject.id,fId,area.id,chapter.id,task.id);}}
                                      className="modern-action-btn delete" style={{width:'20px',height:'20px',background:'transparent',opacity:0.5}}>
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                );
                              }) : <div className="empty-branch">Sem tarefas...</div>}
                            </div>
                          )}
                        </div>
                      );
                    }) : <div className="empty-branch">Sem capítulos...</div>}
                  </div>
                )}
              </div>
            );
          }) : (
            <div className="empty-branch" style={{ paddingLeft:'0' }}>
              Nenhuma área criada. Clique em "Nova {areaLabel ?? 'Área'}" para começar.
            </div>
          );
          })()} {/* end IIFE */}
        </div>
      </div>
    </div>
  );
};

export default SubjectManager;
