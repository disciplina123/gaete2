import React, { useMemo, useState } from 'react';
import { Session, Subject } from '../types';
import { soundService } from '../services/soundService';

interface StatisticsProps {
  sessions: Session[];
  subjects: Subject[];
}

type TimePeriod = '1month' | '3months' | '6months' | '1year' | 'all';

const Statistics: React.FC<StatisticsProps> = ({ sessions, subjects }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');

  const getSubjectColor = (name: string) =>
    subjects.find(s => s.name === name)?.color || '#a1a1aa';

  const filterByPeriod = (ss: Session[], p: TimePeriod) => {
    if (p === 'all') return ss;
    const cutoff = new Date();
    if (p === '1month') cutoff.setMonth(cutoff.getMonth() - 1);
    if (p === '3months') cutoff.setMonth(cutoff.getMonth() - 3);
    if (p === '6months') cutoff.setMonth(cutoff.getMonth() - 6);
    if (p === '1year') cutoff.setFullYear(cutoff.getFullYear() - 1);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return ss.filter(s => s.date.split('T')[0] >= cutoffStr);
  };

  const filtered = useMemo(() => filterByPeriod(sessions, selectedPeriod), [sessions, selectedPeriod]);

  const timeBySubject = useMemo(() => {
    const r: Record<string, number> = {};
    filtered.forEach(s => { r[s.subject] = (r[s.subject] || 0) + s.duration; });
    return r;
  }, [filtered]);

  const theoryBySubject = useMemo(() => {
    const r: Record<string, number> = {};
    filtered.filter(s => s.sessionType === 'teoria').forEach(s => {
      r[s.subject] = (r[s.subject] || 0) + s.duration;
    });
    return r;
  }, [filtered]);

  const questionsBySubject = useMemo(() => {
    const r: Record<string, { total: number; correct: number }> = {};
    filtered.forEach(s => {
      if (!r[s.subject]) r[s.subject] = { total: 0, correct: 0 };
      r[s.subject].total += s.questions;
      r[s.subject].correct += s.correctQuestions;
    });
    return r;
  }, [filtered]);

  const fmtH = (m: number) => {
    const h = Math.floor(m / 60), mn = Math.floor(m % 60);
    return h > 0 ? `${h}h${mn > 0 ? ` ${mn}m` : ''}` : `${mn}m`;
  };

  const totalTime = Object.values(timeBySubject).reduce((a, b) => a + b, 0);
  const totalTheory = Object.values(theoryBySubject).reduce((a, b) => a + b, 0);
  const totalQuestions = Object.values(questionsBySubject).reduce((a, b) => a + b.total, 0);
  const totalCorrect = Object.values(questionsBySubject).reduce((a, b) => a + b.correct, 0);

  const PERIODS: { id: TimePeriod; label: string }[] = [
    { id: '1month', label: '1M' },
    { id: '3months', label: '3M' },
    { id: '6months', label: '6M' },
    { id: '1year', label: '1A' },
    { id: 'all', label: 'Tudo' },
  ];

  const Donut = ({
    data, total, label, value
  }: {
    data: Record<string, number>; total: number; label: string; value: string;
  }) => {
    const cx = 80, cy = 80, r = 64, ir = 46;
    let angle = -90;
    const segments = Object.entries(data).filter(([, v]) => v > 0);

    if (segments.length === 0) return (
      <svg viewBox="0 0 160 160" style={{ width: '100%', maxWidth: 160 }}>
        <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={ir} fill="rgba(10,10,18,0.7)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="Rajdhani,sans-serif" letterSpacing="1">SEM DADOS</text>
      </svg>
    );

    const paths = segments.map(([name, val]) => {
      const sweep = (val / total) * 360;
      const startRad = (angle * Math.PI) / 180;
      const endRad = ((angle + sweep) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const large = sweep > 180 ? 1 : 0;
      const color = getSubjectColor(name);
      const d = sweep >= 359.9
        ? `M ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx + r - 0.01} ${cy} Z`
        : `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${cx} ${cy} Z`;
      angle += sweep;
      return { d, color };
    });

    return (
      <svg viewBox="0 0 160 160" style={{ width: '100%', maxWidth: 160, filter: 'drop-shadow(0 2px 14px rgba(0,0,0,0.5))' }}>
        <circle cx={cx} cy={cy} r={r + 3} fill="rgba(255,255,255,0.015)" />
        {paths.map(({ d, color }, i) => (
          <path key={i} d={d} fill={color} opacity="0.9" />
        ))}
        <circle cx={cx} cy={cy} r={ir} fill="rgba(10,10,18,0.88)" />
        <circle cx={cx} cy={cy} r={ir} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="Rajdhani,sans-serif" letterSpacing="1.5">{label}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fill="#fff" fontSize="16" fontFamily="Rajdhani,sans-serif" fontWeight="700">{value}</text>
      </svg>
    );
  };

  const maxQ = Math.max(...Object.values(questionsBySubject).map(d => d.total), 1);

  return (
    <div className="stats-root">

      <div className="stats-period-row">
        {PERIODS.map(p => (
          <button
            key={p.id}
            className={`stats-period-btn ${selectedPeriod === p.id ? 'active' : ''}`}
            onClick={() => { soundService.playNavTab(); setSelectedPeriod(p.id); }}
          >{p.label}</button>
        ))}
      </div>

      <div className="stats-kpi-row">
        <div className="stats-kpi">
          <span className="stats-kpi-val">{fmtH(totalTime)}</span>
          <span className="stats-kpi-label">Tempo Total</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-val">{fmtH(totalTheory)}</span>
          <span className="stats-kpi-label">Teoria</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-val">{totalQuestions}</span>
          <span className="stats-kpi-label">Questões</span>
        </div>
        <div className="stats-kpi">
          <span className="stats-kpi-val">{totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(0) + '%' : '—'}</span>
          <span className="stats-kpi-label">Acertos</span>
        </div>
      </div>

      <div className="stats-charts-row">

        <div className="stats-chart-card">
          <p className="stats-chart-title">TEMPO POR MATÉRIA</p>
          <div className="stats-donut-wrap">
            <Donut data={timeBySubject} total={totalTime} label="TOTAL" value={fmtH(totalTime)} />
          </div>
          <div className="stats-legend">
            {Object.entries(timeBySubject).map(([name, val]) => (
              <div key={name} className="stats-legend-item">
                <span className="stats-legend-dot" style={{ background: getSubjectColor(name), boxShadow: `0 0 6px ${getSubjectColor(name)}66` }} />
                <span className="stats-legend-name">{name}</span>
                <span className="stats-legend-val">{fmtH(val)}</span>
              </div>
            ))}
            {Object.keys(timeBySubject).length === 0 && <p className="stats-empty-note">Nenhuma sessão ainda.</p>}
          </div>
        </div>

        <div className="stats-chart-card">
          <p className="stats-chart-title">TEORIA POR MATÉRIA</p>
          <div className="stats-donut-wrap">
            <Donut data={theoryBySubject} total={totalTheory} label="TEORIA" value={fmtH(totalTheory)} />
          </div>
          <div className="stats-legend">
            {Object.entries(theoryBySubject).map(([name, val]) => (
              <div key={name} className="stats-legend-item">
                <span className="stats-legend-dot" style={{ background: getSubjectColor(name), boxShadow: `0 0 6px ${getSubjectColor(name)}66` }} />
                <span className="stats-legend-name">{name}</span>
                <span className="stats-legend-val">{fmtH(val)}</span>
              </div>
            ))}
            {Object.keys(theoryBySubject).length === 0 && <p className="stats-empty-note">Marque sessões como "Teoria" no Pomodoro.</p>}
          </div>
        </div>

        <div className="stats-chart-card stats-chart-card--wide">
          <p className="stats-chart-title">QUESTÕES POR MATÉRIA</p>
          {Object.keys(questionsBySubject).length === 0 ? (
            <p className="stats-empty-note">Nenhuma questão registrada.</p>
          ) : (
            <div className="stats-bars">
              {Object.entries(questionsBySubject)
                .filter(([, d]) => d.total > 0)
                .sort((a, b) => b[1].total - a[1].total)
                .map(([name, data]) => {
                  const color = getSubjectColor(name);
                  const totalPct = (data.total / maxQ) * 100;
                  const correctPct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                  const acc = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(0) : '0';
                  return (
                    <div key={name} className="stat-bar-row">
                      <div className="stat-bar-meta">
                        <span className="stat-bar-name" style={{ color }}>{name}</span>
                        <span className="stat-bar-num">{data.correct}/{data.total} <em>{acc}%</em></span>
                      </div>
                      <div className="stat-bar-track">
                        <div className="stat-bar-bg" style={{ width: `${totalPct}%` }}>
                          <div className="stat-bar-fill" style={{ width: `${correctPct}%`, background: color, boxShadow: `0 0 8px ${color}55` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Statistics;
