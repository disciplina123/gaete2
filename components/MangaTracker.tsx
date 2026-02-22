import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Manga } from '../types';
import { soundService } from '../services/soundService';

interface MangaTrackerProps {
  mangas: Manga[];
  onAddManga: (manga: Manga) => void;
  onUpdateManga: (id: string, updates: Partial<Manga>) => void;
  onRemoveManga: (id: string) => void;
}

const MangaTracker: React.FC<MangaTrackerProps> = ({ 
  mangas, 
  onAddManga, 
  onUpdateManga, 
  onRemoveManga 
}) => {
  const [newMangaTitle, setNewMangaTitle] = useState('');
  const [newMangaChapter, setNewMangaChapter] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editChapter, setEditChapter] = useState('');

  const handleAddManga = () => {
    if (!newMangaTitle.trim()) return;
    
    const chapter = parseInt(newMangaChapter) || 0;
    
    const newManga: Manga = {
      id: Date.now().toString(),
      title: newMangaTitle.trim(),
      currentChapter: chapter,
      addedAt: new Date().toISOString(),
      completed: false
    };

    onAddManga(newManga);
    setNewMangaTitle('');
    setNewMangaChapter('');
  };

  const handleStartEdit = (manga: Manga) => {
    setEditingId(manga.id);
    setEditTitle(manga.title);
    setEditChapter(manga.currentChapter.toString());
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onUpdateManga(id, {
        title: editTitle.trim(),
        currentChapter: parseInt(editChapter) || 0
      });
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditChapter('');
  };

  const handleIncrementChapter = (manga: Manga) => {
    onUpdateManga(manga.id, {
      currentChapter: manga.currentChapter + 1
    });
  };

  const handleDecrementChapter = (manga: Manga) => {
    if (manga.currentChapter > 0) {
      onUpdateManga(manga.id, {
        currentChapter: manga.currentChapter - 1
      });
    }
  };

  const handleToggleComplete = (manga: Manga) => {
    onUpdateManga(manga.id, {
      completed: !manga.completed
    });
  };

  const sortedMangas = [...mangas].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  return (
    <div className="manga-tracker-container">
      <div className="manga-card">
        <div className="stats-header">
          <BookOpen size={22} />
          <h2>Mangás</h2>
        </div>

        <div className="manga-add-section">
          <div className="manga-input-group">
            <input
              type="text"
              placeholder="Nome do mangá..."
              value={newMangaTitle}
              onChange={(e) => setNewMangaTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddManga()}
              className="manga-input-title"
            />
            <input
              type="number"
              placeholder="Cap."
              value={newMangaChapter}
              onChange={(e) => setNewMangaChapter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddManga()}
              className="manga-input-chapter"
              min="0"
            />
            <button 
              onClick={() => { soundService.playAdd(); handleAddManga(); }} 
              className="btn-primary"
              disabled={!newMangaTitle.trim()}
            >
              <Plus size={18} />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      <div className="manga-card manga-list-card">
        <div className="stats-header manga-list-header" style={{ border: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
          <h3>Minha Lista ({mangas.length})</h3>
        </div>

        {mangas.length === 0 ? (
          <div className="empty-state">
            Nenhum mangá adicionado ainda. Comece adicionando um acima!
          </div>
        ) : (
          <div className="manga-list">
            {sortedMangas.map((manga) => (
              <div 
                key={manga.id} 
                className={`manga-item ${manga.completed ? 'completed' : ''}`}
              >
                {editingId === manga.id ? (
                  <div className="manga-edit-mode">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="manga-edit-input"
                      autoFocus
                    />
                    <input
                      type="number"
                      value={editChapter}
                      onChange={(e) => setEditChapter(e.target.value)}
                      className="manga-edit-chapter"
                      min="0"
                    />
                    <button 
                      onClick={() => { soundService.playSave(); handleSaveEdit(manga.id); }}
                      className="manga-action-btn save"
                      title="Salvar"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => { soundService.playCancel(); handleCancelEdit(); }}
                      className="manga-action-btn cancel"
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="manga-info">
                      <div 
                        className="manga-title"
                        onClick={() => { soundService.playToggle(); handleToggleComplete(manga); }}
                        style={{ cursor: 'pointer' }}
                        title={manga.completed ? "Marcar como não completo" : "Marcar como completo"}
                      >
                        {manga.title}
                      </div>
                      <div className="manga-chapter-display">
                        Capítulo: <strong>{manga.currentChapter}</strong>
                      </div>
                    </div>

                    <div className="manga-controls">
                      <button
                        onClick={() => { soundService.playClick(); handleDecrementChapter(manga); }}
                        className="manga-chapter-btn"
                        disabled={manga.currentChapter === 0}
                        title="Diminuir capítulo"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        onClick={() => { soundService.playClick(); handleIncrementChapter(manga); }}
                        className="manga-chapter-btn"
                        title="Aumentar capítulo"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        onClick={() => { soundService.playClick(); handleStartEdit(manga); }}
                        className="manga-action-btn edit"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => { soundService.playDelete(); onRemoveManga(manga.id); }}
                        className="manga-action-btn delete"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaTracker;
