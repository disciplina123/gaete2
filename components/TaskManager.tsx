import React, { useState } from 'react';
import { Plus, X, Check, Trash2, Edit2, FolderPlus, Folder, ChevronDown } from 'lucide-react';
import { TaskGroup, TaskItem } from '../types';
import { soundService } from '../services/soundService';

interface TaskManagerProps {
  taskGroups: TaskGroup[];
  onAddGroup: (name: string, color: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onUpdateGroupName: (groupId: string, newName: string) => void;
  onAddTask: (groupId: string, title: string) => void;
  onToggleTask: (groupId: string, taskId: string) => void;
  onRemoveTask: (groupId: string, taskId: string) => void;
  onUpdateTaskTitle: (groupId: string, taskId: string, newTitle: string) => void;
}

const COLORS = [
  '#ff2d55', '#ff6b00', '#ffcc00', '#34c759', '#00c7be',
  '#007aff', '#5856d6', '#af52de', '#ff375f', '#ff9f0a',
  '#30d158', '#64d2ff', '#bf5af2', '#32ade6', '#ffd60a', '#ff453a',
];

const TaskManager: React.FC<TaskManagerProps> = ({
  taskGroups, onAddGroup, onRemoveGroup, onUpdateGroupName,
  onAddTask, onToggleTask, onRemoveTask, onUpdateTaskTitle,
}) => {
  const [showGroupModal, setShowGroupModal]     = useState(false);
  const [newGroupName, setNewGroupName]         = useState('');
  const [selectedColor, setSelectedColor]       = useState('#3b82f6');
  const [expandedGroups, setExpandedGroups]     = useState<Set<string>>(new Set());
  const [editingGroupId, setEditingGroupId]     = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [editingTaskId, setEditingTaskId]       = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [newTaskTitles, setNewTaskTitles]       = useState<Record<string, string>>({});

  const toggleGroup = (id: string) => {
    const next = new Set(expandedGroups);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedGroups(next);
    soundService.playToggle();
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    onAddGroup(newGroupName.trim(), selectedColor);
    setNewGroupName(''); setSelectedColor('#3b82f6'); setShowGroupModal(false);
    soundService.playAdd();
  };

  const handleAddTask = (groupId: string) => {
    const title = newTaskTitles[groupId]?.trim();
    if (!title) return;
    onAddTask(groupId, title);
    setNewTaskTitles({ ...newTaskTitles, [groupId]: '' });
    soundService.playAdd();
  };

  const saveGroupName = () => {
    if (editingGroupId && editingGroupName.trim()) {
      onUpdateGroupName(editingGroupId, editingGroupName.trim());
      setEditingGroupId(null); setEditingGroupName('');
      soundService.playSave();
    }
  };

  const saveTaskTitle = (groupId: string) => {
    if (editingTaskId && editingTaskTitle.trim()) {
      onUpdateTaskTitle(groupId, editingTaskId, editingTaskTitle.trim());
      setEditingTaskId(null); setEditingTaskTitle('');
      soundService.playSave();
    }
  };

  const getProgress = (g: TaskGroup) => {
    if (!g.tasks.length) return 0;
    return Math.round((g.tasks.filter(t => t.completed).length / g.tasks.length) * 100);
  };

  const totalTasks     = taskGroups.reduce((s, g) => s + g.tasks.length, 0);
  const completedTasks = taskGroups.reduce((s, g) => s + g.tasks.filter(t => t.completed).length, 0);

  return (
    <div className="tm-root">

      {/* Header */}
      <div className="tm-header">
        <div className="tm-header-left">
          <h2 className="tm-title">Tarefas</h2>
          {totalTasks > 0 && (
            <span className="tm-global-badge">
              {completedTasks}/{totalTasks} concluídas
            </span>
          )}
        </div>
        <button className="btn-primary"
          onClick={() => { setShowGroupModal(true); soundService.playClick(); }}>
          <FolderPlus size={18} /> Novo Grupo
        </button>
      </div>

      {/* Empty state */}
      {taskGroups.length === 0 ? (
        <div className="tm-empty">
          <div className="tm-empty-icon"><Folder size={40} /></div>
          <p className="tm-empty-title">Nenhum grupo ainda</p>
          <p className="tm-empty-sub">Crie um grupo para começar a organizar suas tarefas</p>
        </div>
      ) : (
        <div className="tm-grid">
          {taskGroups.map(group => {
            const isOpen   = expandedGroups.has(group.id);
            const progress = getProgress(group);
            const done     = group.tasks.filter(t => t.completed).length;

            return (
              <div key={group.id} className="tm-card">

                {/* Faixa colorida no topo */}
                <div className="tm-card-stripe" style={{ background: group.color }} />

                {/* Header */}
                <div className="tm-card-header" onClick={() => { soundService.playClick(); toggleGroup(group.id); }}>
                  <div className="tm-card-title-row">
                    {editingGroupId === group.id ? (
                      <input className="tm-name-input" autoFocus
                        value={editingGroupName}
                        onChange={e => setEditingGroupName(e.target.value)}
                        onBlur={saveGroupName}
                        onKeyDown={e => e.key === 'Enter' && saveGroupName()}
                        onClick={e => e.stopPropagation()} />
                    ) : (
                      <h3 className="tm-card-name">{group.name}</h3>
                    )}
                    <div className="tm-card-actions" onClick={e => e.stopPropagation()}>
                      <button className="tm-icon-btn" title="Renomear"
                        onClick={() => { setEditingGroupId(group.id); setEditingGroupName(group.name); soundService.playClick(); }}>
                        <Edit2 size={14} />
                      </button>
                      <button className="tm-icon-btn tm-icon-btn-danger" title="Excluir"
                        onClick={() => { if (confirm(`Excluir "${group.name}"?`)) { onRemoveGroup(group.id); soundService.playDelete(); } }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="tm-progress-row">
                    <div className="tm-progress-track">
                      <div className="tm-progress-fill"
                        style={{ width: `${progress}%`, background: group.color }} />
                    </div>
                    <span className="tm-progress-label" style={{ color: group.color }}>
                      {done}/{group.tasks.length}
                    </span>
                  </div>

                  <ChevronDown size={15} className={`tm-chevron${isOpen ? ' tm-chevron-open' : ''}`} />
                </div>

                {/* Corpo expandido */}
                {isOpen && (
                  <div className="tm-card-body">
                    <div className="tm-input-row">
                      <input className="tm-task-input"
                        placeholder="Adicionar tarefa..."
                        value={newTaskTitles[group.id] || ''}
                        onChange={e => setNewTaskTitles({ ...newTaskTitles, [group.id]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleAddTask(group.id)} />
                      <button className="tm-add-task-btn"
                        style={{ background: group.color }}
                        disabled={!newTaskTitles[group.id]?.trim()}
                        onClick={() => handleAddTask(group.id)}>
                        <Plus size={16} />
                      </button>
                    </div>

                    {group.tasks.length === 0 ? (
                      <p className="tm-no-tasks">Nenhuma tarefa ainda</p>
                    ) : (
                      <div className="tm-tasks">
                        {group.tasks.map(task => (
                          <div key={task.id} className={`tm-task${task.completed ? ' tm-task-done' : ''}`}>
                            <div className="tm-checkbox"
                              style={task.completed ? { background: group.color, borderColor: group.color } : {}}
                              onClick={() => { onToggleTask(group.id, task.id); soundService.playToggle(); }}>
                              {task.completed && <Check size={11} strokeWidth={3} color="#fff" />}
                            </div>

                            {editingTaskId === task.id ? (
                              <input className="tm-task-edit" autoFocus
                                value={editingTaskTitle}
                                onChange={e => setEditingTaskTitle(e.target.value)}
                                onBlur={() => saveTaskTitle(group.id)}
                                onKeyDown={e => e.key === 'Enter' && saveTaskTitle(group.id)} />
                            ) : (
                              <span className="tm-task-label"
                                onDoubleClick={() => { setEditingTaskId(task.id); setEditingTaskTitle(task.title); }}>
                                {task.title}
                              </span>
                            )}

                            <div className="tm-task-actions">
                              <button className="tm-task-btn"
                                onClick={() => { setEditingTaskId(task.id); setEditingTaskTitle(task.title); soundService.playClick(); }}>
                                <Edit2 size={12} />
                              </button>
                              <button className="tm-task-btn tm-task-btn-danger"
                                onClick={() => { onRemoveTask(group.id, task.id); soundService.playDelete(); }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal novo grupo */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => { soundService.playCancel(); setShowGroupModal(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Grupo</h2>
              <button className="modal-close" onClick={() => { soundService.playCancel(); setShowGroupModal(false); }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="modal-label">Nome do Grupo</label>
                <input className="modal-input" autoFocus
                  placeholder="Ex: Faculdade, Projetos..."
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddGroup()} />
              </div>
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="modal-label">Cor</label>
                <div className="tm-color-grid">
                  {COLORS.map(c => (
                    <button key={c} className={`tm-color-dot${selectedColor === c ? ' selected' : ''}`}
                      style={{ background: c }}
                      onClick={() => { setSelectedColor(c); soundService.playClick(); }} />
                  ))}
                </div>
                <div className="tm-color-preview" style={{ borderColor: selectedColor, background: `${selectedColor}15` }}>
                  <div className="tm-color-preview-stripe" style={{ background: selectedColor }} />
                  <span style={{ color: selectedColor, fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '1px' }}>
                    {newGroupName || 'Nome do grupo'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { soundService.playCancel(); setShowGroupModal(false); }}>Cancelar</button>
              <button className="btn-primary" onClick={() => { soundService.playSave(); handleAddGroup(); }} disabled={!newGroupName.trim()}>
                <Plus size={18} /> Criar Grupo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
