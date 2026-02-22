import React, { useState, useEffect, useRef } from 'react';
import { Target, ChevronRight, Calendar, Star, CheckCircle2, Edit2 } from 'lucide-react';
import { Session, Subject } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface DashboardProps {
  sessions: Session[];
  subjects: Subject[];
  streak: number;
  dailyGoal: number;
  primaryColor: string;
}

interface GoalConfig {
  goalText: string;
  targetScore: number;
  examDate: string;
  examName: string;
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const STORAGE_KEY = 'dashboard-goal-config';

const LEVELS = [
  { min: 0,  label: 'Iniciante' },
  { min: 15, label: 'Aprendiz' },
  { min: 30, label: 'Dedicado' },
  { min: 50, label: 'Consistente' },
  { min: 70, label: 'Avançado' },
  { min: 88, label: 'Expert' },
];

function getLevel(pct: number) {
  return [...LEVELS].reverse().find(l => pct >= l.min) || LEVELS[0];
}

function calcProgress(totalHours: number, consistencyScore: number, avgAccuracy: number, daysUntilExam: number, targetScore: number): number {
  if (totalHours <= 0) return 0;
  const basePct = Math.log1p(totalHours) / Math.log1p(300) * 100;
  const consistencyBonus = consistencyScore * 20;
  const accuracyBonus = avgAccuracy * 15;
  const urgencyBoost = daysUntilExam < 60 && basePct < 40 ? 3 : 0;
  const targetFactor = 1 - (targetScore - 100) / (1000 - 100) * 0.35;
  return Math.min(97, Math.max(0, (basePct + consistencyBonus + accuracyBonus + urgencyBoost) * targetFactor));
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, subjects, streak, dailyGoal, primaryColor }) => {
  const [goalConfig, setGoalConfig] = useState<GoalConfig | null>(null);
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState({ goalText: '', targetScore: 700, examDate: '', examName: '' });
  const [dateDay, setDateDay] = useState('');
  const [dateMonth, setDateMonth] = useState('');
  const [dateYear, setDateYear] = useState('');
  const [progressAnim, setProgressAnim] = useState(0);
  const [visible, setVisible] = useState(false);
  const animRef = useRef<number>(0);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);
  const daysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
  const days = dateMonth && dateYear
    ? Array.from({ length: daysInMonth(Number(dateMonth), Number(dateYear)) }, (_, i) => i + 1)
    : Array.from({ length: 31 }, (_, i) => i + 1);
  const derivedExamDate = dateDay && dateMonth && dateYear
    ? `${dateYear}-${dateMonth.padStart(2,'0')}-${dateDay.padStart(2,'0')}`
    : '';

  useEffect(() => {
    const saved = storageService.load(STORAGE_KEY, null);
    if (saved) setGoalConfig(saved as GoalConfig);
    setTimeout(() => setVisible(true), 50);
  }, []);

  const metrics = React.useMemo(() => {
    const totalMinutes = sessions.reduce((s, x) => s + x.duration, 0);
    const totalHours = totalMinutes / 60;
    const totalQ = sessions.reduce((s, x) => s + (x.questions || 0), 0);
    const correctQ = sessions.reduce((s, x) => s + (x.correctQuestions || 0), 0);
    const avgAccuracy = totalQ > 0 ? correctQ / totalQ : 0;
    const now = new Date();
    const studiedDays = new Set(sessions.map(s => s.date.split('T')[0]));
    let consistencyDays = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      if (studiedDays.has(d.toISOString().split('T')[0])) consistencyDays++;
    }
    const consistencyScore = consistencyDays / 30;
    const daysUntilExam = goalConfig?.examDate
      ? Math.max(0, Math.ceil((new Date(goalConfig.examDate).getTime() - Date.now()) / 86400000))
      : 365;
    const progress = calcProgress(totalHours, consistencyScore, avgAccuracy, daysUntilExam, goalConfig?.targetScore ?? 700);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMinutes = sessions.filter(s => s.date.split('T')[0] === todayStr).reduce((a, b) => a + b.duration, 0);
    return { totalHours, avgAccuracy, consistencyScore, daysUntilExam, progress, todayMinutes };
  }, [sessions, goalConfig]);

  useEffect(() => {
    if (!goalConfig) return;
    const target = metrics.progress;
    let current = 0;
    const tick = () => {
      current += (target - current) * 0.055;
      setProgressAnim(current);
      if (Math.abs(current - target) > 0.25) animRef.current = requestAnimationFrame(tick);
      else setProgressAnim(target);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [metrics.progress, goalConfig]);

  const saveGoal = () => {
    if (!tempGoal.goalText.trim() || !derivedExamDate) return;
    const config = { ...tempGoal, examDate: derivedExamDate };
    storageService.save(STORAGE_KEY, config);
    setGoalConfig(config);
    setEditing(false);
    soundService.playAdd();
  };

  const startEdit = () => {
    if (!goalConfig) return;
    const [y, m, d] = goalConfig.examDate.split('-');
    setDateYear(y); setDateMonth(String(Number(m))); setDateDay(String(Number(d)));
    setTempGoal({ ...goalConfig });
    setStep(0);
    setEditing(true);
  };

  const daysLeft = goalConfig?.examDate
    ? Math.max(0, Math.ceil((new Date(goalConfig.examDate).getTime() - Date.now()) / 86400000))
    : null;
  const todayProgress = Math.min(100, (metrics.todayMinutes / (dailyGoal || 120)) * 100);
  const level = getLevel(progressAnim);

  // ── ONBOARDING ──
  if (!goalConfig || editing) {
    return (
      <div className={`db-onboard-wrap ${visible ? 'db-visible' : ''}`}>
        <div className="db-onboard-card">
          <div className="db-onboard-glow" />
          {step === 0 && (
            <div className="db-onboard-step">
              <div className="db-onboard-icon"><Target size={32} /></div>
              <h1 className="db-onboard-title">Qual é o seu objetivo?</h1>
              <p className="db-onboard-sub">Isso vai ser o centro de todo o seu dashboard.</p>
              <input className="db-onboard-input" placeholder="Nome da prova ou meta (ENEM, Concurso...)" value={tempGoal.examName} onChange={e => setTempGoal(p => ({ ...p, examName: e.target.value }))} />
              <textarea className="db-onboard-textarea" placeholder="Descreva seu objetivo... Ex: Passar em Medicina na USP com nota acima de 800" value={tempGoal.goalText} onChange={e => setTempGoal(p => ({ ...p, goalText: e.target.value }))} rows={3} />
              <button className="db-onboard-btn" disabled={!tempGoal.goalText.trim() || !tempGoal.examName.trim()} onClick={() => { soundService.playClick(); setStep(1); }}>
                Continuar <ChevronRight size={18} />
              </button>
              {editing && <button className="db-onboard-btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>}
            </div>
          )}
          {step === 1 && (
            <div className="db-onboard-step">
              <div className="db-onboard-icon"><Star size={32} /></div>
              <h1 className="db-onboard-title">Meta de pontuação</h1>
              <p className="db-onboard-sub">Usada para calibrar sua curva de progresso.</p>
              <div className="db-score-row">
                <div className="db-score-display">
                  <span className="db-score-big">{tempGoal.targetScore}</span>
                  <span className="db-score-unit">pontos</span>
                </div>
                <input type="range" min={100} max={1000} step={10} value={tempGoal.targetScore} onChange={e => setTempGoal(p => ({ ...p, targetScore: Number(e.target.value) }))} className="db-score-range" />
                <div className="db-score-ticks"><span>100</span><span>400</span><span>700</span><span>1000</span></div>
              </div>
              <div className="db-onboard-nav">
                <button className="db-onboard-btn-ghost" onClick={() => setStep(0)}>← Voltar</button>
                <button className="db-onboard-btn" onClick={() => { soundService.playClick(); setStep(2); }}>Continuar <ChevronRight size={18} /></button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="db-onboard-step">
              <div className="db-onboard-icon"><Calendar size={32} /></div>
              <h1 className="db-onboard-title">Quando é a prova?</h1>
              <p className="db-onboard-sub">A data determina a urgência e ritmo ideal.</p>
              <div className="db-date-selects">
                <select className="db-date-select" value={dateDay} onChange={e => setDateDay(e.target.value)}>
                  <option value="">Dia</option>
                  {days.map(d => <option key={d} value={String(d)}>{String(d).padStart(2,'0')}</option>)}
                </select>
                <select className="db-date-select" value={dateMonth} onChange={e => { setDateMonth(e.target.value); setDateDay(''); }}>
                  <option value="">Mês</option>
                  {MONTHS.map((m, i) => <option key={i+1} value={String(i+1)}>{m}</option>)}
                </select>
                <select className="db-date-select" value={dateYear} onChange={e => { setDateYear(e.target.value); setDateDay(''); }}>
                  <option value="">Ano</option>
                  {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
                </select>
              </div>
              <div className="db-onboard-nav">
                <button className="db-onboard-btn-ghost" onClick={() => setStep(1)}>← Voltar</button>
                <button className="db-onboard-btn" disabled={!derivedExamDate} onClick={saveGoal}>
                  <CheckCircle2 size={16} /> {editing ? 'Salvar' : 'Começar'}
                </button>
              </div>
            </div>
          )}
          <div className="db-onboard-dots">
            {[0,1,2].map(i => (
              <span key={i} className={`db-dot ${step === i ? 'db-dot-active' : ''}`} onClick={() => i < step && setStep(i)} style={{ cursor: i < step ? 'pointer' : 'default' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className={`db-wrap ${visible ? 'db-visible' : ''}`}>

      <div className="db-objective-card">
        <div className="db-objective-bg" style={{ background: `radial-gradient(ellipse at 50% 0%, ${primaryColor}16 0%, transparent 60%)` }} />

        <div className="db-objective-body">
          <div className="db-objective-label">
            <Target size={12} />
            <span>Objetivo Principal</span>
            <button className="db-edit-btn" onClick={startEdit} title="Editar"><Edit2 size={12} /></button>
          </div>
          <h1 className="db-objective-title">{goalConfig.examName}</h1>
          <p className="db-objective-desc">{goalConfig.goalText}</p>
          <div className="db-objective-pills">
            {daysLeft !== null && (
              <div className="db-pill" style={{ borderColor: daysLeft < 30 ? '#ef444460' : 'rgba(255,255,255,0.1)', color: daysLeft < 30 ? '#ef4444' : 'rgba(255,255,255,0.5)' }}>
                <Calendar size={11} />
                <span>{daysLeft > 0 ? `${daysLeft} dias restantes` : 'Hoje!'}</span>
              </div>
            )}
            <div className="db-pill">
              <Star size={11} />
              <span>Meta: {goalConfig.targetScore} pts</span>
            </div>
            <div className="db-pill" style={{ borderColor: `${primaryColor}60`, color: primaryColor }}>
              {level.label}
            </div>
          </div>
        </div>

        {/* Barra de progresso horizontal */}
        <div className="db-progress-section">
          <div className="db-progress-header">
            <span className="db-progress-label">Progresso</span>
            <span className="db-progress-pct" style={{ color: primaryColor }}>{Math.round(progressAnim)}%</span>
          </div>
          <div className="db-progress-track">
            <div
              className="db-progress-fill"
              style={{
                width: `${progressAnim}%`,
                background: `linear-gradient(90deg, ${primaryColor}bb, ${primaryColor})`,
                boxShadow: `0 0 16px ${primaryColor}55`
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
