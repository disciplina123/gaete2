import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, TrendingUp, Calendar, Settings, ChevronDown, ChevronUp, X } from 'lucide-react';
import { EnemResult, FuvestResult, CustomExamTemplate, CustomExamResult, CustomExamSection } from '../types';
import { soundService } from '../services/soundService';

interface ExamTrackerProps {
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
}

type ExamTab = 'enem' | 'fuvest' | 'custom';

const ExamTracker: React.FC<ExamTrackerProps> = ({
  enemResults,
  fuvestResults,
  onAddEnemResult,
  onAddFuvestResult,
  onRemoveEnemResult,
  onRemoveFuvestResult,
  customExamTemplates = [],
  customExamResults = [],
  onAddCustomExamTemplate,
  onRemoveCustomExamTemplate,
  onAddCustomExamResult,
  onRemoveCustomExamResult,
}) => {
  const [activeExam, setActiveExam] = useState<ExamTab>('enem');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSections, setTemplateSections] = useState<{ name: string; max: string }[]>([{ name: '', max: '' }]);
  const [customResultYear, setCustomResultYear] = useState(new Date().getFullYear());
  const [customResultScores, setCustomResultScores] = useState<Record<string, string>>({});

  const [enemForm, setEnemForm] = useState({ year: new Date().getFullYear(), linguagens: 0, cienciasHumanas: 0, cienciasNatureza: 0, matematica: 0, redacao: 0 });
  const [fuvestForm, setFuvestForm] = useState({ year: new Date().getFullYear(), fase1: 0, fase2Dia1: 0, fase2Dia2: 0 });

  const handleAddEnem = () => {
    if (enemForm.linguagens > 45 || enemForm.cienciasHumanas > 45 || enemForm.cienciasNatureza > 45 || enemForm.matematica > 45) {
      alert('O número de acertos não pode ser maior que 45 em nenhuma área!'); return;
    }
    onAddEnemResult({ id: Date.now().toString(), year: enemForm.year, linguagens: enemForm.linguagens, cienciasHumanas: enemForm.cienciasHumanas, cienciasNatureza: enemForm.cienciasNatureza, matematica: enemForm.matematica, redacao: enemForm.redacao || undefined, addedAt: new Date().toISOString() });
    setEnemForm({ year: new Date().getFullYear(), linguagens: 0, cienciasHumanas: 0, cienciasNatureza: 0, matematica: 0, redacao: 0 });
    setShowAddForm(false);
  };

  const handleAddFuvest = () => {
    if (fuvestForm.fase1 > 90) { alert('Máximo 90 acertos na 1ª fase!'); return; }
    if (fuvestForm.fase2Dia1 > 10) { alert('Máximo 10 acertos no Dia 1 da 2ª fase!'); return; }
    if (fuvestForm.fase2Dia2 > 12) { alert('Máximo 12 acertos no Dia 2 da 2ª fase!'); return; }
    onAddFuvestResult({ id: Date.now().toString(), year: fuvestForm.year, fase1: fuvestForm.fase1, fase2Dia1: fuvestForm.fase2Dia1 || undefined, fase2Dia2: fuvestForm.fase2Dia2 || undefined, addedAt: new Date().toISOString() });
    setFuvestForm({ year: new Date().getFullYear(), fase1: 0, fase2Dia1: 0, fase2Dia2: 0 });
    setShowAddForm(false);
  };

  const handleCreateTemplate = () => {
    const valid = templateSections.filter(s => s.name.trim() && parseInt(s.max) > 0);
    if (!templateName.trim()) { alert('Dê um nome ao modelo!'); return; }
    if (valid.length === 0) { alert('Adicione pelo menos uma seção válida!'); return; }
    const sections: CustomExamSection[] = valid.map((s, i) => ({ id: `${Date.now()}_${i}`, name: s.name.trim(), maxQuestions: parseInt(s.max) }));
    const template: CustomExamTemplate = { id: Date.now().toString(), name: templateName.trim(), sections, createdAt: new Date().toISOString() };
    onAddCustomExamTemplate(template);
    soundService.playSave();
    setTemplateName(''); setTemplateSections([{ name: '', max: '' }]); setShowCreateTemplate(false); setSelectedTemplateId(template.id);
  };

  const handleAddCustomResult = () => {
    const template = customExamTemplates.find(t => t.id === selectedTemplateId);
    if (!template) return;
    for (const s of template.sections) {
      const v = parseInt(customResultScores[s.id] || '0');
      if (v > s.maxQuestions) { alert(`"${s.name}" não pode ter mais que ${s.maxQuestions} acertos!`); return; }
    }
    onAddCustomExamResult({ id: Date.now().toString(), templateId: template.id, templateName: template.name, year: customResultYear, sections: template.sections.map(s => ({ sectionId: s.id, sectionName: s.name, correct: parseInt(customResultScores[s.id] || '0'), maxQuestions: s.maxQuestions })), addedAt: new Date().toISOString() });
    soundService.playSave(); setCustomResultScores({}); setCustomResultYear(new Date().getFullYear()); setShowAddForm(false);
  };

  const calcEnemTotal = (r: EnemResult) => r.linguagens + r.cienciasHumanas + r.cienciasNatureza + r.matematica;
  const calcEnemPct = (r: EnemResult) => ((calcEnemTotal(r) / 180) * 100).toFixed(1);
  const calcFuvestPct = (n: number) => ((n / 90) * 100).toFixed(1);
  const calcFuvestMedia = (r: FuvestResult) => {
    if (!r.fase2Dia1 && !r.fase2Dia2) return null;
    const f1 = (r.fase1 / 90) * 100, fd1 = r.fase2Dia1 ? (r.fase2Dia1 / 10) * 100 : 0, fd2 = r.fase2Dia2 ? (r.fase2Dia2 / 12) * 100 : 0;
    if (!r.fase2Dia1 || !r.fase2Dia2) return ((f1 + (r.fase2Dia1 ? fd1 : fd2)) / 2).toFixed(1);
    return ((f1 + fd1 + fd2) / 3).toFixed(1);
  };
  const calcCustomTotal = (r: CustomExamResult) => {
    const c = r.sections.reduce((a, s) => a + s.correct, 0), t = r.sections.reduce((a, s) => a + s.maxQuestions, 0);
    return { c, t, pct: t > 0 ? ((c / t) * 100).toFixed(1) : '0.0' };
  };

  const selectedTemplate = customExamTemplates.find(t => t.id === selectedTemplateId);
  const resultsForTemplate = selectedTemplateId ? customExamResults.filter(r => r.templateId === selectedTemplateId) : [];

  const renderEnemForm = () => (
    <div className="exam-form">
      <h3>Adicionar Resultado do ENEM</h3>
      <div className="exam-form-group">
        <label>Ano da Prova</label>
        <input type="number" min="2000" max={new Date().getFullYear()} value={enemForm.year} onChange={(e) => setEnemForm({...enemForm, year: parseInt(e.target.value)})} />
      </div>
      <div className="exam-form-grid">
        {(['linguagens','cienciasHumanas','cienciasNatureza','matematica'] as const).map((key) => (
          <div className="exam-form-group" key={key}>
            <label>{key === 'linguagens' ? 'Linguagens' : key === 'cienciasHumanas' ? 'C. Humanas' : key === 'cienciasNatureza' ? 'C. Natureza' : 'Matemática'} (0-45)</label>
            <input type="number" min="0" max="45" value={enemForm[key]} onChange={(e) => setEnemForm({...enemForm, [key]: parseInt(e.target.value) || 0})} />
          </div>
        ))}
      </div>
      <div className="exam-form-group">
        <label>Redação (0-1000) — Opcional</label>
        <input type="number" min="0" max="1000" value={enemForm.redacao} onChange={(e) => setEnemForm({...enemForm, redacao: parseInt(e.target.value) || 0})} />
      </div>
      <div className="exam-form-buttons">
        <button className="exam-btn-cancel" onClick={() => { soundService.playCancel(); setShowAddForm(false); }}>Cancelar</button>
        <button className="exam-btn-save" onClick={() => { soundService.playSave(); handleAddEnem(); }}>Salvar Resultado</button>
      </div>
    </div>
  );

  const renderFuvestForm = () => (
    <div className="exam-form">
      <h3>Adicionar Resultado da FUVEST</h3>
      <div className="exam-form-group">
        <label>Ano da Prova</label>
        <input type="number" min="2000" max={new Date().getFullYear()} value={fuvestForm.year} onChange={(e) => setFuvestForm({...fuvestForm, year: parseInt(e.target.value)})} />
      </div>
      <div className="exam-form-group"><label>Acertos 1ª Fase (0-90)</label><input type="number" min="0" max="90" value={fuvestForm.fase1} onChange={(e) => setFuvestForm({...fuvestForm, fase1: parseInt(e.target.value) || 0})} /></div>
      <div className="exam-form-group"><label>2ª Fase - Dia 1 (0-10) — Opcional</label><input type="number" min="0" max="10" value={fuvestForm.fase2Dia1} onChange={(e) => setFuvestForm({...fuvestForm, fase2Dia1: parseInt(e.target.value) || 0})} /></div>
      <div className="exam-form-group"><label>2ª Fase - Dia 2 (0-12) — Opcional</label><input type="number" min="0" max="12" value={fuvestForm.fase2Dia2} onChange={(e) => setFuvestForm({...fuvestForm, fase2Dia2: parseInt(e.target.value) || 0})} /></div>
      <div className="exam-form-buttons">
        <button className="exam-btn-cancel" onClick={() => { soundService.playCancel(); setShowAddForm(false); }}>Cancelar</button>
        <button className="exam-btn-save" onClick={() => { soundService.playSave(); handleAddFuvest(); }}>Salvar Resultado</button>
      </div>
    </div>
  );

  const renderCustomResultForm = () => {
    if (!selectedTemplate) return null;
    return (
      <div className="exam-form">
        <h3>Adicionar Resultado — {selectedTemplate.name}</h3>
        <div className="exam-form-group">
          <label>Ano da Prova</label>
          <input type="number" min="2000" max={new Date().getFullYear() + 1} value={customResultYear} onChange={(e) => setCustomResultYear(parseInt(e.target.value))} />
        </div>
        <div className="exam-form-grid">
          {selectedTemplate.sections.map((section) => (
            <div className="exam-form-group" key={section.id}>
              <label>{section.name} (0-{section.maxQuestions})</label>
              <input type="number" min="0" max={section.maxQuestions} value={customResultScores[section.id] || ''} onChange={(e) => setCustomResultScores(prev => ({ ...prev, [section.id]: e.target.value }))} placeholder="0" />
            </div>
          ))}
        </div>
        <div className="exam-form-buttons">
          <button className="exam-btn-cancel" onClick={() => { soundService.playCancel(); setShowAddForm(false); }}>Cancelar</button>
          <button className="exam-btn-save" onClick={handleAddCustomResult}>Salvar Resultado</button>
        </div>
      </div>
    );
  };

  const renderEnemResults = () => (
    <div className="exam-results-list">
      {enemResults.length === 0 ? (
        <div className="exam-empty-state"><GraduationCap size={48} /><p>Nenhum resultado do ENEM registrado ainda</p><small>Adicione seus resultados para acompanhar sua evolução!</small></div>
      ) : enemResults.sort((a, b) => b.year - a.year).map((r) => (
        <div key={r.id} className="exam-result-card">
          <div className="exam-result-header">
            <div className="exam-result-title"><Calendar size={20} /><h4>ENEM {r.year}</h4></div>
            <button className="exam-delete-btn" onClick={() => { soundService.playDelete(); onRemoveEnemResult(r.id); }}><Trash2 size={18} /></button>
          </div>
          <div className="exam-result-stats">
            <div className="exam-stat-item"><span className="exam-stat-label">Linguagens</span><span className="exam-stat-value">{r.linguagens}/45</span></div>
            <div className="exam-stat-item"><span className="exam-stat-label">C. Humanas</span><span className="exam-stat-value">{r.cienciasHumanas}/45</span></div>
            <div className="exam-stat-item"><span className="exam-stat-label">C. Natureza</span><span className="exam-stat-value">{r.cienciasNatureza}/45</span></div>
            <div className="exam-stat-item"><span className="exam-stat-label">Matemática</span><span className="exam-stat-value">{r.matematica}/45</span></div>
          </div>
          <div className="exam-result-total">
            <div className="exam-total-score"><TrendingUp size={18} /><span>Total: {calcEnemTotal(r)}/180 acertos</span><span className="exam-percentage">({calcEnemPct(r)}%)</span></div>
            {r.redacao && <div className="exam-redacao"><span>Redação: {r.redacao}/1000</span></div>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderFuvestResults = () => (
    <div className="exam-results-list">
      {fuvestResults.length === 0 ? (
        <div className="exam-empty-state"><GraduationCap size={48} /><p>Nenhum resultado da FUVEST registrado ainda</p><small>Adicione seus resultados para acompanhar sua evolução!</small></div>
      ) : fuvestResults.sort((a, b) => b.year - a.year).map((r) => {
        const media = calcFuvestMedia(r);
        return (
          <div key={r.id} className="exam-result-card">
            <div className="exam-result-header">
              <div className="exam-result-title"><Calendar size={20} /><h4>FUVEST {r.year}</h4></div>
              <button className="exam-delete-btn" onClick={() => { soundService.playDelete(); onRemoveFuvestResult(r.id); }}><Trash2 size={18} /></button>
            </div>
            <div className="exam-result-stats">
              <div className="exam-stat-item"><span className="exam-stat-label">1ª Fase</span><span className="exam-stat-value">{r.fase1}/90 acertos</span><span className="exam-percentage">({calcFuvestPct(r.fase1)}%)</span></div>
              {r.fase2Dia1 && <div className="exam-stat-item"><span className="exam-stat-label">2ª Fase - Dia 1</span><span className="exam-stat-value">{r.fase2Dia1}/10</span><span className="exam-percentage">({((r.fase2Dia1 / 10) * 100).toFixed(1)}%)</span></div>}
              {r.fase2Dia2 && <div className="exam-stat-item"><span className="exam-stat-label">2ª Fase - Dia 2</span><span className="exam-stat-value">{r.fase2Dia2}/12</span><span className="exam-percentage">({((r.fase2Dia2 / 12) * 100).toFixed(1)}%)</span></div>}
            </div>
            {media && <div className="exam-result-total"><div className="exam-total-score"><TrendingUp size={18} /><span>Média das provas: {media}%</span></div></div>}
          </div>
        );
      })}
    </div>
  );

  const renderCustomTab = () => (
    <div className="custom-exam-container">
      <div className="custom-exam-toolbar">
        <div className="custom-exam-dropdown-wrapper">
          <button className="custom-exam-dropdown-btn" onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}>
            <span>{selectedTemplate ? selectedTemplate.name : 'Selecionar modelo...'}</span>
            {templateDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {templateDropdownOpen && (
            <div className="custom-exam-dropdown">
              {customExamTemplates.length === 0 && <div className="custom-exam-dropdown-empty">Nenhum modelo criado</div>}
              {customExamTemplates.map(t => (
                <div key={t.id} className={`custom-exam-dropdown-item ${selectedTemplateId === t.id ? 'active' : ''}`} onClick={() => { setSelectedTemplateId(t.id); setTemplateDropdownOpen(false); setShowAddForm(false); }}>
                  <span>{t.name}</span>
                  <button className="custom-exam-dropdown-delete" onClick={(e) => { e.stopPropagation(); soundService.playDelete(); onRemoveCustomExamTemplate(t.id); if (selectedTemplateId === t.id) setSelectedTemplateId(null); }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="custom-exam-new-model-btn" onClick={() => { setShowCreateTemplate(true); setTemplateDropdownOpen(false); }}>
          <Settings size={16} /> Novo modelo
        </button>
      </div>



      {!showAddForm && selectedTemplate && (
        <button className="exam-add-button" onClick={() => { soundService.playAdd(); setShowAddForm(true); setCustomResultScores({}); }}>
          <Plus size={20} /> Adicionar Resultado
        </button>
      )}

      {showAddForm ? renderCustomResultForm() : (
        <div className="exam-results-list">
          {!selectedTemplate ? (
            <div className="exam-empty-state"><GraduationCap size={48} /><p>Selecione ou crie um modelo de prova</p><small>Crie modelos personalizados com as seções que desejar!</small></div>
          ) : resultsForTemplate.length === 0 ? (
            <div className="exam-empty-state"><GraduationCap size={48} /><p>Nenhum resultado para "{selectedTemplate.name}"</p><small>Adicione seu primeiro resultado!</small></div>
          ) : resultsForTemplate.sort((a, b) => b.year - a.year).map((r) => {
            const { c, t, pct } = calcCustomTotal(r);
            return (
              <div key={r.id} className="exam-result-card">
                <div className="exam-result-header">
                  <div className="exam-result-title"><Calendar size={20} /><h4>{r.templateName} — {r.year}</h4></div>
                  <button className="exam-delete-btn" onClick={() => { soundService.playDelete(); onRemoveCustomExamResult(r.id); }}><Trash2 size={18} /></button>
                </div>
                <div className="exam-result-stats">
                  {r.sections.map((s) => (
                    <div className="exam-stat-item" key={s.sectionId}>
                      <span className="exam-stat-label">{s.sectionName}</span>
                      <span className="exam-stat-value">{s.correct}/{s.maxQuestions}</span>
                      <span className="exam-percentage">({((s.correct / s.maxQuestions) * 100).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
                <div className="exam-result-total">
                  <div className="exam-total-score"><TrendingUp size={18} /><span>Total: {c}/{t} acertos</span><span className="exam-percentage">({pct}%)</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="exam-tracker-container">
      <div className="exam-tracker-header">
        <GraduationCap size={32} />
        <div>
          <h2>Organizador de Provas</h2>
          <p>Acompanhe seus resultados no ENEM, FUVEST e provas personalizadas</p>
        </div>
      </div>

      <div className="exam-tabs">
        {(['enem', 'fuvest', 'custom'] as ExamTab[]).map((tab) => (
          <button key={tab} className={`exam-tab ${activeExam === tab ? 'active' : ''}`} onClick={() => { soundService.playNavTab(); setActiveExam(tab); setShowAddForm(false); }}>
            {tab === 'enem' ? 'ENEM' : tab === 'fuvest' ? 'FUVEST' : 'Personalizado'}
          </button>
        ))}
      </div>

      {activeExam !== 'custom' && !showAddForm && (
        <button className="exam-add-button" onClick={() => { soundService.playAdd(); setShowAddForm(true); }}>
          <Plus size={20} /> Adicionar Resultado
        </button>
      )}

      {activeExam === 'enem' && (showAddForm ? renderEnemForm() : renderEnemResults())}
      {activeExam === 'fuvest' && (showAddForm ? renderFuvestForm() : renderFuvestResults())}
      {activeExam === 'custom' && renderCustomTab()}

      {showCreateTemplate && (
        <div className="custom-exam-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { soundService.playCancel(); setShowCreateTemplate(false); } }}>
          <div className="custom-exam-modal">
            <div className="custom-exam-modal-header">
              <h3>Criar Modelo de Prova</h3>
              <button className="custom-exam-modal-close" onClick={() => { soundService.playCancel(); setShowCreateTemplate(false); }}><X size={20} /></button>
            </div>
            <div className="exam-form-group">
              <label>Nome do modelo</label>
              <input type="text" placeholder="Ex: Simulado FUVEST 2024..." value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            </div>
            <div className="custom-exam-sections-header">
              <span>Seções / Matérias</span>
              <button className="custom-exam-add-section-btn" onClick={() => setTemplateSections([...templateSections, { name: '', max: '' }])}><Plus size={14} /> Adicionar seção</button>
            </div>
            <div className="custom-exam-sections-list">
              {templateSections.map((section, idx) => (
                <div key={idx} className="custom-exam-section-row">
                  <input type="text" placeholder="Nome da seção" value={section.name} onChange={(e) => { const u = [...templateSections]; u[idx].name = e.target.value; setTemplateSections(u); }} />
                  <input type="number" placeholder="Nº questões" min="1" value={section.max} onChange={(e) => { const u = [...templateSections]; u[idx].max = e.target.value; setTemplateSections(u); }} />
                  {templateSections.length > 1 && (
                    <button className="custom-exam-remove-section-btn" onClick={() => setTemplateSections(templateSections.filter((_, i) => i !== idx))}><X size={14} /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="exam-form-buttons" style={{ marginTop: '1.25rem' }}>
              <button className="exam-btn-cancel" onClick={() => { soundService.playCancel(); setShowCreateTemplate(false); }}>Cancelar</button>
              <button className="exam-btn-save" onClick={handleCreateTemplate}>Criar Modelo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTracker;
