import React from 'react';
import { BackgroundMode } from '../types';

interface CustomStylesProps {
  primaryColor: string;
  backgroundMode: BackgroundMode;
  containerBgColor?: string;
}

const CustomStyles: React.FC<CustomStylesProps> = ({ primaryColor, backgroundMode, containerBgColor }) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const { r, g, b } = hexToRgb(primaryColor);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const btnTextColor = brightness > 128 ? '#09090b' : '#ffffff';

  const { r: cr, g: cg, b: cb } = containerBgColor ? hexToRgb(containerBgColor) : { r: 9, g: 9, b: 11 };

  // Detecta se o containerBgColor é claro (tema light)
  const containerBrightness = (cr * 299 + cg * 587 + cb * 114) / 1000;
  const isLight = containerBrightness > 140;

  // No modo claro: fundo notavelmente mais escuro (tom acinzentado) para contrastar com cards brancos
  // No modo escuro: fundo escuro, cards levemente mais claros
  const bgApp   = containerBgColor
    ? isLight
      ? `rgb(${Math.max(0,cr-36)}, ${Math.max(0,cg-36)}, ${Math.max(0,cb-28)})`          // cinza claro distinto
      : `rgb(${Math.max(0,cr-4)}, ${Math.max(0,cg-4)}, ${Math.max(0,cb-4)})`
    : '#09090b';

  const bgCard  = containerBgColor
    ? isLight
      ? `rgba(255, 255, 255, 0.96)`                                                        // cards bem brancos para máximo contraste
      : `rgba(${Math.min(255,cr+12)}, ${Math.min(255,cg+12)}, ${Math.min(255,cb+12)}, 0.75)`
    : 'rgba(24, 24, 27, 0.7)';

  const bgInput = containerBgColor
    ? isLight
      ? `rgba(0, 0, 0, 0.05)`                                                              // sobreposição escura sutil
      : `rgba(${Math.max(0,cr-2)}, ${Math.max(0,cg-2)}, ${Math.max(0,cb-2)}, 0.65)`
    : 'rgba(9, 9, 11, 0.6)';

  let backgroundCss = '';

  switch (backgroundMode) {
    case 'grid':
      backgroundCss = `
        background-color: ${bgApp};
        background-image: 
          linear-gradient(${isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.03)'} 1px, transparent 1px);
        background-size: 30px 30px;
        background-position: center top;
      `;
      break;
    case 'dots':
      backgroundCss = `
        background-color: ${bgApp};
        background-image: radial-gradient(${isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'} 1px, transparent 1px);
        background-size: 20px 20px;
      `;
      break;
    case 'aurora':
      backgroundCss = `
        background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a1a1a);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
      `;
      break;
    case 'ocean':
      backgroundCss = `
        background: linear-gradient(270deg, #0f2027, #203a43, #2c5364);
        background-size: 600% 600%;
        animation: gradientBG 25s ease infinite;
      `;
      break;
    case 'sunset':
      backgroundCss = `
        background: linear-gradient(135deg, #2b1055, #7597de, #2b1055);
        background-size: 400% 400%;
        animation: gradientBG 20s ease infinite;
      `;
      break;
    case 'snow':
      backgroundCss = `
        background: linear-gradient(to bottom, #0a0e27 0%, #1a1a2e 100%);
        position: relative;
      `;
      break;
    case 'space':
      backgroundCss = `
        background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        position: relative;
      `;
      break;
    case 'forest':
      backgroundCss = `
        background: linear-gradient(to bottom, #0a1f0a 0%, #050a05 100%);
        position: relative;
      `;
      break;
    case 'mosaic':
      backgroundCss = isLight ? `
        background-color: ${bgApp};
        background-image: 
          linear-gradient(30deg, rgba(0,0,0,0.05) 12%, transparent 12.5%, transparent 87%, rgba(0,0,0,0.05) 87.5%, rgba(0,0,0,0.05)),
          linear-gradient(150deg, rgba(0,0,0,0.05) 12%, transparent 12.5%, transparent 87%, rgba(0,0,0,0.05) 87.5%, rgba(0,0,0,0.05)),
          linear-gradient(30deg, rgba(0,0,0,0.05) 12%, transparent 12.5%, transparent 87%, rgba(0,0,0,0.05) 87.5%, rgba(0,0,0,0.05)),
          linear-gradient(150deg, rgba(0,0,0,0.05) 12%, transparent 12.5%, transparent 87%, rgba(0,0,0,0.05) 87.5%, rgba(0,0,0,0.05)),
          linear-gradient(60deg, rgba(0,0,0,0.07) 25%, transparent 25.5%, transparent 75%, rgba(0,0,0,0.07) 75%, rgba(0,0,0,0.07)),
          linear-gradient(60deg, rgba(0,0,0,0.07) 25%, transparent 25.5%, transparent 75%, rgba(0,0,0,0.07) 75%, rgba(0,0,0,0.07));
        background-size: 80px 140px;
        background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
      ` : `
        background-color: ${bgApp};
        background-image: 
          linear-gradient(30deg, rgba(255, 255, 255, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.02) 87.5%, rgba(255, 255, 255, 0.02)),
          linear-gradient(150deg, rgba(255, 255, 255, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.02) 87.5%, rgba(255, 255, 255, 0.02)),
          linear-gradient(30deg, rgba(255, 255, 255, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.02) 87.5%, rgba(255, 255, 255, 0.02)),
          linear-gradient(150deg, rgba(255, 255, 255, 0.02) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.02) 87.5%, rgba(255, 255, 255, 0.02)),
          linear-gradient(60deg, rgba(255, 255, 255, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03)),
          linear-gradient(60deg, rgba(255, 255, 255, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(255, 255, 255, 0.03) 75%, rgba(255, 255, 255, 0.03));
        background-size: 80px 140px;
        background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
      `;
      break;
    case 'soft':
      backgroundCss = `
        background: linear-gradient(135deg, ${bgApp} 0%, rgba(${cr+8},${cg+8},${cb+24},1) 50%, rgba(${cr+4},${cg+4},${cb+36},1) 100%);
        position: relative;
      `;
      break;
    case 'solid':
      backgroundCss = `
        background-color: ${bgApp};
      `;
      break;
    case 'default':
    default:
      backgroundCss = isLight ? `
        background: radial-gradient(circle at top center, rgba(${Math.min(255,cr+10)},${Math.min(255,cg+10)},${Math.min(255,cb+16)},1) 0%, ${bgApp} 60%);
      ` : `
        background: radial-gradient(circle at top center, rgba(${cr+30},${cg+30},${cb+30},1) 0%, ${bgApp} 60%, #000000 100%);
      `;
      break;
  }

  const textMain        = isLight ? '#18181b' : '#f4f4f5';
  const textMuted       = isLight ? '#52525b' : '#a1a1aa';
  const borderSubtle    = isLight ? 'rgba(0,0,0,0.2)'  : 'rgba(255,255,255,0.1)';
  const borderHighlight = isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.5)';

  const lightOverrides = isLight ? [
    '/* ── LIGHT MODE OVERRIDES ── */',

    // Globais
    'body { color: #18181b; }',

    // Containers principais
    '.tab-panel { background: rgba(255,255,255,0.88) !important; border-color: rgba(0,0,0,0.1) !important; box-shadow: 0 4px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9) !important; }',
    '.tab-panel::before { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent) !important; }',
    '.pomodoro-panel { background: rgba(255,255,255,0.88) !important; border-color: rgba(0,0,0,0.1) !important; box-shadow: 0 8px 40px rgba(0,0,0,0.12) !important; }',

    // Cards internos que ficam transparentes dentro do tab-panel
    '.tab-panel .timer-card, .pomodoro-panel .timer-card, .tab-panel .settings-card, .tab-panel .stats-card, .tab-panel .calendar-card, .tab-panel .calendar-details, .tab-panel .config-card, .tab-panel .achievements-card, .tab-panel .library-card, .tab-panel .manga-card, .tab-panel .exam-form { background: rgba(0,0,0,0.055) !important; border: 1px solid rgba(0,0,0,0.12) !important; }',

    // Sidebar
    '.tabs { border-right-color: rgba(0,0,0,0.1) !important; }',
    '.tab { color: rgba(0,0,0,0.38) !important; }',
    '.tab:hover { color: rgba(0,0,0,0.8) !important; background: rgba(0,0,0,0.06) !important; filter: none !important; transform: scale(1.05) !important; }',
    '.tab.active { color: var(--primary-color) !important; background: rgba(0,0,0,0.05) !important; filter: drop-shadow(0 0 6px var(--primary-glow)) !important; }',
    '.tab::after { background: rgba(240,240,248,0.98) !important; color: #18181b !important; border-color: rgba(0,0,0,0.1) !important; }',
    '.sidebar-logo-g { text-shadow: none !important; }',
    '.sidebar-logo-rest { color: #18181b !important; }',
    '.tabs-gaete { border-right-color: rgba(0,0,0,0.1) !important; box-shadow: 4px 0 20px rgba(0,0,0,0.08) !important; }',
    '.tabs-gaete .tab .tab-label { color: rgba(0,0,0,0.5) !important; text-shadow: none !important; }',
    '.tabs-gaete .tab.active .tab-label { color: var(--primary-color) !important; text-shadow: none !important; }',
    '.tabs-gaete .tab:hover { border-left-color: var(--primary-color) !important; background: rgba(0,0,0,0.05) !important; }',
    '.tabs-gaete .sidebar-logo { border-bottom-color: rgba(0,0,0,0.08) !important; }',
    '.tabs-bottom { border-color: rgba(0,0,0,0.12) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important; }',
    '.tabs-bottom .tab:hover { color: rgba(0,0,0,0.8) !important; background: rgba(0,0,0,0.06) !important; }',
    '.tab svg, .tabs-bottom .tab svg, .tabs-gaete .tab svg { background: rgba(255,255,255,0.75) !important; border: 1px solid rgba(0,0,0,0.14) !important; border-radius: 10px !important; padding: 3px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important; }',
    '.tab:hover svg, .tabs-bottom .tab:hover svg, .tabs-gaete .tab:hover svg { background: rgba(255,255,255,0.92) !important; border-color: rgba(0,0,0,0.2) !important; }',
    '.tab.active svg, .tabs-bottom .tab.active svg, .tabs-gaete .tab.active svg { background: rgba(255,255,255,0.97) !important; border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px var(--primary-glow-subtle), 0 2px 8px rgba(0,0,0,0.14) !important; }',

    // Painel principal
    '.tab-panel { border-color: rgba(0,0,0,0.14) !important; box-shadow: 0 4px 24px rgba(0,0,0,0.1) !important; }',
    '.tab-panel::before { background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent) !important; }',

    // Settings
    '.cfg-section-label { color: #52525b !important; border-bottom-color: rgba(0,0,0,0.1) !important; }',
    '.cfg-card { border-color: rgba(0,0,0,0.15) !important; }',
    '.cfg-card:hover { border-color: rgba(0,0,0,0.28) !important; background: rgba(0,0,0,0.04) !important; }',
    '.cfg-card-title { color: #18181b !important; }',
    '.cfg-card-desc { color: #52525b !important; }',
    '.cfg-color-hex { color: #18181b !important; }',
    '.cfg-btn-ghost { color: #52525b !important; border-color: rgba(0,0,0,0.15) !important; }',
    '.cfg-btn-ghost:hover { color: #18181b !important; border-color: rgba(0,0,0,0.3) !important; background: rgba(0,0,0,0.04) !important; }',
    '.cfg-btn-primary { color: var(--btn-text) !important; }',
    '.cfg-btn-secondary { color: #18181b !important; border-color: rgba(0,0,0,0.15) !important; background: rgba(0,0,0,0.05) !important; }',
    '.cfg-bg-option { border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.03) !important; }',
    '.cfg-bg-option:hover { background: rgba(0,0,0,0.06) !important; border-color: rgba(0,0,0,0.2) !important; }',
    '.cfg-bg-name { color: #18181b !important; }',
    '.cfg-bg-desc, .cfg-layout-desc, .cfg-themes-hint, .cfg-theme-desc { color: #52525b !important; }',
    '.cfg-layout-card { border-color: rgba(0,0,0,0.1) !important; background: rgba(255,255,255,0.6) !important; }',
    '.cfg-layout-card:hover { background: rgba(0,0,0,0.03) !important; border-color: rgba(0,0,0,0.18) !important; }',
    '.cfg-layout-name, .cfg-theme-name { color: #18181b !important; }',
    '.cfg-theme-card { border-color: rgba(0,0,0,0.1) !important; background: rgba(255,255,255,0.6) !important; }',
    '.cfg-theme-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.1) !important; }',
    '.cfg-toggle { border-color: rgba(0,0,0,0.15) !important; color: #18181b !important; }',
    '.cfg-toggle:hover { border-color: rgba(0,0,0,0.25) !important; color: #18181b !important; }',
    '.cfg-volume-row { color: #18181b !important; }',
    '.cfg-volume-pct { color: #18181b !important; }',
    '.cfg-card-danger { border-color: rgba(239,68,68,0.3) !important; }',
    '.cfg-danger-title { color: #ef4444 !important; }',
    '.cfg-layout-check { color: var(--primary-color) !important; }',
    '.cfg-prev-dot { background: rgba(0,0,0,0.3) !important; }',
    '.cfg-prev-bar { background: rgba(0,0,0,0.15) !important; }',
    '.cfg-preview-sidebar, .cfg-preview-sidebar-wide { background: rgba(0,0,0,0.08) !important; }',
    '.cfg-preview-content { background: rgba(0,0,0,0.04) !important; }',
    '.cfg-preview-bottombar { background: rgba(0,0,0,0.08) !important; }',

    // Dashboard
    '.db-wrap { color: #18181b !important; }',
    '.db-objective-card { background: rgba(255,255,255,0.82) !important; border-color: rgba(0,0,0,0.08) !important; }',
    '.db-objective-title { color: #18181b !important; }',
    '.db-objective-desc { color: #4a4a5a !important; }',
    '.db-objective-label { color: rgba(0,0,0,0.38) !important; }',
    '.db-edit-btn { color: rgba(0,0,0,0.3) !important; }',
    '.db-edit-btn:hover { color: rgba(0,0,0,0.7) !important; }',
    '.db-pill { border-color: rgba(0,0,0,0.12) !important; color: rgba(0,0,0,0.5) !important; }',
    '.db-progress-track { background: rgba(0,0,0,0.08) !important; }',
    '.db-progress-label { color: rgba(0,0,0,0.35) !important; }',
    '.db-onboard-card { background: rgba(255,255,255,0.95) !important; border-color: rgba(0,0,0,0.08) !important; }',
    '.db-onboard-title { color: #18181b !important; }',
    '.db-onboard-sub { color: #52525b !important; }',
    '.db-onboard-textarea, .db-onboard-input, .db-date-select { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.12) !important; color: #18181b !important; }',
    '.db-date-select option { background: #eeeef8 !important; color: #18181b !important; }',
    '.db-onboard-btn-ghost { color: rgba(0,0,0,0.45) !important; border-color: rgba(0,0,0,0.15) !important; background: transparent !important; }',
    '.db-onboard-btn-ghost:hover { color: #18181b !important; border-color: rgba(0,0,0,0.35) !important; }',
    '.db-score-big { color: var(--primary-color) !important; }',
    '.db-score-unit { color: rgba(0,0,0,0.4) !important; }',
    '.db-score-ticks { color: rgba(0,0,0,0.3) !important; }',
    '.db-dot { background: rgba(0,0,0,0.15) !important; }',
    '.db-dot-active { background: var(--primary-color) !important; }',
    '.db-section-title { color: rgba(0,0,0,0.35) !important; }',
    '.db-subject-name { color: rgba(0,0,0,0.6) !important; }',
    '.db-subject-hours { color: rgba(0,0,0,0.35) !important; }',
    '.db-subject-bar-wrap { background: rgba(0,0,0,0.08) !important; }',
    '.db-today-left { color: rgba(0,0,0,0.45) !important; }',
    '.db-today-frac { color: rgba(0,0,0,0.6) !important; }',
    '.db-today-sep { color: rgba(0,0,0,0.25) !important; }',
    '.db-today-track { background: rgba(0,0,0,0.08) !important; }',
    '.db-stat-val { color: #18181b !important; }',
    '.db-stat-lbl { color: rgba(0,0,0,0.35) !important; }',
    '.db-stat-icon { background: rgba(0,0,0,0.05) !important; border-color: rgba(0,0,0,0.08) !important; }',
    '.db-today-card { background: rgba(0,0,0,0.06) !important; border-color: rgba(0,0,0,0.12) !important; }',
    '.db-stat-card { background: rgba(0,0,0,0.06) !important; border-color: rgba(0,0,0,0.12) !important; }',
    '.db-stat-card:hover { background: rgba(0,0,0,0.1) !important; border-color: rgba(0,0,0,0.18) !important; }',
    '.db-subjects-section { background: rgba(0,0,0,0.05) !important; border-color: rgba(0,0,0,0.12) !important; }',

    // Pomodoro / timer
    '.time-text { color: #18181b !important; }',
    '.session-type-btn { color: rgba(0,0,0,0.45) !important; border-color: rgba(0,0,0,0.12) !important; background: rgba(0,0,0,0.04) !important; }',
    '.session-type-btn:hover { color: #18181b !important; border-color: rgba(0,0,0,0.25) !important; }',
    '.btn-secondary { color: #18181b !important; border-color: rgba(0,0,0,0.15) !important; background: rgba(0,0,0,0.05) !important; }',
    '.btn-back { color: rgba(0,0,0,0.5) !important; border-color: rgba(0,0,0,0.12) !important; background: rgba(0,0,0,0.04) !important; }',
    '.btn-back:hover { color: #18181b !important; }',
    '.input-time { color: #18181b !important; border-bottom-color: rgba(0,0,0,0.2) !important; }',
    '.streak-count { color: #18181b !important; }',

    // Matérias
    '.subject-name { color: #18181b !important; }',
    '.subject-name-input { color: #18181b !important; border-bottom-color: var(--primary-color) !important; }',
    '.modern-action-btn { color: rgba(0,0,0,0.4) !important; border-color: rgba(0,0,0,0.1) !important; }',
    '.modern-action-btn:hover { color: #18181b !important; background: rgba(0,0,0,0.05) !important; }',
    '.subject-app-delete { color: rgba(0,0,0,0.3) !important; }',
    '.chapter-title-modern { color: rgba(0,0,0,0.6) !important; }',
    '.chapter-title-modern:hover { color: #18181b !important; }',
    '.task-label-modern { color: rgba(0,0,0,0.55) !important; }',
    '.task-label-modern:hover { color: #18181b !important; }',

    // Estatísticas
    '.stats-period-btn { color: rgba(0,0,0,0.5) !important; border-color: rgba(0,0,0,0.12) !important; background: rgba(0,0,0,0.04) !important; }',
    '.stats-period-btn:hover { color: #18181b !important; }',
    '.stats-kpi-val { color: #18181b !important; }',
    '.stats-legend-val { color: #18181b !important; }',
    '.stat-bar-num em { color: #18181b !important; }',
    '.stat-subject, .stat-subject-compact { color: #18181b !important; }',
    '.stat-row span:last-child, .stat-row-compact span:last-child { color: #18181b !important; }',

    // Calendário
    '.month-title, .month-title-compact { color: #18181b !important; }',
    '.nav-btn, .nav-btn-compact { color: rgba(0,0,0,0.5) !important; border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.04) !important; }',
    '.nav-btn:hover, .nav-btn-compact:hover { color: #18181b !important; background: rgba(0,0,0,0.08) !important; }',
    '.calendar-day.selected .day-number, .calendar-day:hover .day-number { color: #fff !important; }',
    '.goal-config input, .goal-config-compact input { color: #18181b !important; }',
    '.details-header h3 { color: #18181b !important; }',

    // Task manager
    '.tm-card-header { color: #18181b !important; }',
    '.tm-group-name { color: #18181b !important; }',
    '.tm-task-label { color: rgba(0,0,0,0.7) !important; }',
    '.tm-task-input { color: #18181b !important; border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.04) !important; }',
    '.tm-task-input::placeholder { color: rgba(0,0,0,0.25) !important; }',
    '.tm-task-btn { color: rgba(0,0,0,0.3) !important; }',
    '.tm-task-btn:hover { color: #18181b !important; background: rgba(0,0,0,0.06) !important; }',
    '.tm-checkbox { border-color: rgba(0,0,0,0.2) !important; }',
    '.tm-no-tasks { color: rgba(0,0,0,0.25) !important; }',
    '.tm-card-body { border-top-color: rgba(0,0,0,0.06) !important; }',

    // Música
    '.music-panel { border-color: rgba(0,0,0,0.1) !important; }',
    '.music-text { color: #52525b !important; }',

    // Biblioteca / manga / conquistas
    '.title-text { color: #18181b !important; }',
    '.title-label { color: var(--primary-color) !important; }',
    '.close-btn { color: rgba(0,0,0,0.4) !important; }',
    '.close-btn:hover { color: #18181b !important; background: rgba(0,0,0,0.06) !important; }',
  ].join('\n') : '';

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;600;700&display=swap');
      
      :root {
        --bg-app: ${bgApp};
        --bg-card: ${bgCard};
        --bg-input: ${bgInput};
        
        --primary-color: ${primaryColor};
        --container-bg: ${containerBgColor
          ? isLight
            ? 'rgba(255,255,255,0.92)'
            : containerBgColor + 'b8'
          : 'rgba(10, 10, 18, 0.72)'};
        --container-bg-solid: ${containerBgColor
          ? isLight
            ? 'rgba(255,255,255,0.98)'
            : containerBgColor
          : 'rgba(24, 24, 27, 0.8)'};
        --primary-glow: rgba(${r}, ${g}, ${b}, 0.25);
        --primary-glow-subtle: rgba(${r}, ${g}, ${b}, 0.1);
        
        --border-subtle: ${borderSubtle};
        --border-highlight: ${borderHighlight};
        
        --text-main: ${textMain};
        --text-muted: ${textMuted};
        --success: #10b981;
        --warning: #f59e0b;
        
        --btn-text: ${btnTextColor};
      }

      ${lightOverrides}

      
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html {
        font-size: 80%;
      }

      body {
        font-family: 'Rajdhani', sans-serif;
        background: var(--bg-app);
        color: var(--text-main);
      }

      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes starsAnimation {
        from { background-position: 0 0, 40px 60px, 130px 270px; }
        to { background-position: 550px 550px, 390px 410px, 380px 520px; }
      }

      @keyframes snowfall {
        0% {
          transform: translateY(-10vh) translateX(0);
          opacity: 1;
        }
        100% {
          transform: translateY(110vh) translateX(100px);
          opacity: 0.8;
        }
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }

      .app {
        min-height: 100vh;
        width: 100%;
        ${backgroundCss}
        transition: background 0.5s ease;
        position: relative;
        overflow: hidden;
      }

      /* Snow effect */
      ${backgroundMode === 'snow' ? `
        .app::before,
        .app::after {
          content: '';
          position: fixed;
          top: -10vh;
          left: 0;
          width: 100%;
          height: 120vh;
          pointer-events: none;
          z-index: 1;
        }

        .app::before {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 130px 80px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(1px 1px at 160px 120px, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 190px 20px, rgba(255, 255, 255, 0.75), transparent);
          background-size: 200px 200px;
          background-position: 0 0;
          animation: snowfall 10s linear infinite;
        }

        .app::after {
          background-image: 
            radial-gradient(1px 1px at 50px 50px, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(2px 2px at 100px 100px, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 150px 150px, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(2px 2px at 70px 180px, rgba(255, 255, 255, 0.8), transparent);
          background-size: 250px 250px;
          background-position: 50px 50px;
          animation: snowfall 15s linear infinite;
          animation-delay: -5s;
        }
      ` : ''}

      /* Space effect with twinkling stars */
      ${backgroundMode === 'space' ? `
        .app::before,
        .app::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .app::before {
          background-image: 
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 40% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(2px 2px at 15% 90%, white, transparent),
            radial-gradient(1px 1px at 75% 40%, white, transparent);
          background-size: 200% 200%;
          animation: twinkle 3s ease-in-out infinite;
        }

        .app::after {
          background-image: 
            radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 60% 35%, rgba(255, 255, 255, 0.7), transparent),
            radial-gradient(2px 2px at 25% 55%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 85% 75%, rgba(255, 255, 255, 0.6), transparent),
            radial-gradient(1px 1px at 45% 90%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
          animation-delay: -2s;
        }
      ` : ''}

      /* Forest silhouette */
      ${backgroundMode === 'forest' ? `
        .app::before {
          content: '';
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30vh;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }

        .app::after {
          content: '';
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 25vh;
          background-image: 
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 300' preserveAspectRatio='none'%3E%3Cpath d='M0,300 L0,240 Q50,200 100,240 Q150,280 200,220 Q250,160 300,200 Q350,240 400,190 Q450,140 500,180 Q550,220 600,170 Q650,120 700,190 Q750,260 800,200 Q850,140 900,210 Q950,280 1000,230 L1000,300 Z' fill='%23051005' opacity='0.9'/%3E%3Cpath d='M0,300 L0,260 Q80,230 160,270 Q240,310 320,250 Q400,190 480,240 Q560,290 640,220 Q720,150 800,230 Q880,310 960,260 Q1000,240 1000,260 L1000,300 Z' fill='%23082008' opacity='0.7'/%3E%3C/svg%3E");
          background-size: cover;
          background-position: bottom;
          background-repeat: no-repeat;
          pointer-events: none;
          z-index: 1;
        }
      ` : ''}

      .app > * {
        position: relative;
        z-index: 2;
      }

      .header {
        background: var(--container-bg-solid);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-highlight);
        padding: 1.5rem;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 50;
      }

      .header-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .header h1 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3rem;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 6px;
        text-shadow: 0 0 30px var(--primary-glow);
      }
      
      .badges-container {
        position: absolute;
        right: 0;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .streak-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid rgba(245, 158, 11, 0.4); 
        padding: 0.5rem 1.2rem;
        border-radius: 50px;
        box-shadow: 0 0 15px rgba(245, 158, 11, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        transition: all 0.3s ease;
      }

      .streak-badge:hover {
        transform: scale(1.02);
        background: rgba(20, 10, 10, 0.8);
        border-color: var(--warning);
        box-shadow: 0 0 25px rgba(245, 158, 11, 0.2);
      }

      .streak-count {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2rem;
        color: #fff;
        line-height: 0.9;
      }

      .streak-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--warning);
        font-weight: 700;
        letter-spacing: 2px;
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

      .fire-icon {
        color: var(--warning);
        filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
        animation: pulse-fire 2.5s infinite ease-in-out;
      }
      
      .title-badge {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(10, 10, 10, 0.6);
        border: 1px solid var(--primary-color); 
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 0 15px var(--primary-glow-subtle);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        transition: all 0.3s ease;
      }
      
      .title-badge:hover {
        transform: scale(1.02);
        background: rgba(20, 10, 10, 0.8);
        box-shadow: 0 0 25px var(--primary-glow);
      }
      
      .title-text {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        color: #fff;
        letter-spacing: 1px;
        white-space: nowrap;
      }
      
      .title-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--primary-color);
        font-weight: 700;
        letter-spacing: 2px;
        display: flex;
        flex-direction: column;
        line-height: 1.1;
        text-align: right;
      }
      
      .trophy-icon {
        color: var(--primary-color);
        filter: drop-shadow(0 0 5px var(--primary-glow));
      }

      @keyframes pulse-fire {
        0% { filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.3)); transform: scale(1); opacity: 0.9; }
        50% { filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.6)); transform: scale(1.1); opacity: 1; }
        100% { filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.3)); transform: scale(1); opacity: 0.9; }
      }

      .tabs {
        position: fixed;
        left: 0;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 0;
        z-index: 100;
        background: var(--container-bg);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-right: 1px solid rgba(255,255,255,0.07);
        border-radius: 0;
        width: 82px;
        transition:
          width 0.45s cubic-bezier(0.4,0,0.2,1),
          height 0.45s cubic-bezier(0.4,0,0.2,1),
          top 0.45s cubic-bezier(0.4,0,0.2,1),
          bottom 0.45s cubic-bezier(0.4,0,0.2,1),
          left 0.45s cubic-bezier(0.4,0,0.2,1),
          right 0.45s cubic-bezier(0.4,0,0.2,1),
          transform 0.45s cubic-bezier(0.4,0,0.2,1),
          border-radius 0.45s cubic-bezier(0.4,0,0.2,1),
          background-color 0.45s cubic-bezier(0.4,0,0.2,1),
          box-shadow 0.45s cubic-bezier(0.4,0,0.2,1),
          padding 0.45s cubic-bezier(0.4,0,0.2,1);
      }

      .sidebar-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.35rem 0;
        border-bottom: none;
        gap: 0;
        overflow: hidden;
        flex-shrink: 0;
        transition: opacity 0.45s cubic-bezier(0.4,0,0.2,1), transform 0.45s cubic-bezier(0.4,0,0.2,1), padding 0.45s cubic-bezier(0.4,0,0.2,1);
      }

      .sidebar-logo-g {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 800;
        font-size: 1.8rem;
        letter-spacing: 0;
        color: var(--primary-color);
        line-height: 1;
        text-shadow: 0 0 18px var(--primary-glow-subtle);
      }

      .sidebar-logo-rest {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 800;
        font-size: 1.8rem;
        letter-spacing: 2px;
        color: #fff;
        line-height: 1;
        opacity: 0.9;
      }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        padding: 0.5rem 0.5rem;
        flex: 1;
      }

      .sidebar-bottom {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        padding: 0.5rem 0.5rem 0.75rem;
        border-top: none;
        flex-shrink: 0;
      }

      .tab {
        background: transparent;
        border: none;
        padding: 0.75rem;
        color: rgba(255,255,255,0.35);
        cursor: pointer;
        transition:
          color 0.3s cubic-bezier(0.4,0,0.2,1),
          filter 0.3s cubic-bezier(0.4,0,0.2,1),
          background-color 0.3s cubic-bezier(0.4,0,0.2,1),
          transform 0.3s cubic-bezier(0.4,0,0.2,1),
          box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),
          width 0.45s cubic-bezier(0.4,0,0.2,1),
          height 0.45s cubic-bezier(0.4,0,0.2,1),
          min-width 0.45s cubic-bezier(0.4,0,0.2,1),
          padding 0.45s cubic-bezier(0.4,0,0.2,1),
          border-radius 0.45s cubic-bezier(0.4,0,0.2,1);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        width: 54px;
        height: 54px;
        position: relative;
      }

      .tab:hover {
        color: rgba(255,255,255,0.95);
        filter: drop-shadow(0 0 6px rgba(255,255,255,0.4));
        background: rgba(255,255,255,0.06);
        transform: scale(1.08);
      }

      .tab.active {
        color: var(--primary-color);
        filter: drop-shadow(0 0 8px var(--primary-glow-subtle));
        background: var(--bg-card);
        transform: scale(1.0);
      }

      .tab::after {
        content: attr(title);
        position: absolute;
        left: 100%;
        margin-left: 12px;
        background: rgba(0, 0, 0, 0.95);
        color: #fff;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.4,0,0.2,1);
        transform: translateX(-4px);
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        letter-spacing: 1px;
        border: 1px solid var(--border-subtle);
      }

      .tab:hover::after {
        opacity: 1;
        transform: translateX(0);
      }

      @keyframes tabFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      .content {
        padding: 2rem 6rem 2rem 130px;
        max-width: 1400px;
        margin: 0 auto;
        transition: padding 0.45s cubic-bezier(0.4,0,0.2,1);
      }

      .tab-panel {
        background: var(--container-bg);
        backdrop-filter: blur(24px) saturate(1.3);
        -webkit-backdrop-filter: blur(24px) saturate(1.3);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 18px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.06);
        padding: 2.5rem 2.5rem;
        min-height: calc(100vh - 4rem);
        position: relative;
        overflow: hidden;
      }

      .tab-panel:has(.subjects-container) {
        height: calc(100vh - 4rem);
        min-height: unset;
        display: flex;
        flex-direction: column;
        overflow: visible;
      }

      .tab-panel::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        pointer-events: none;
      }

      /* Inside tab-panel / pomodoro-panel: internal cards become lighter/transparent to avoid double layering */
      .tab-panel .timer-card,
      .pomodoro-panel .timer-card,
      .tab-panel .settings-card,
      .tab-panel .stats-card,
      .tab-panel .calendar-card,
      .tab-panel .calendar-details,
      .tab-panel .config-card,
      .tab-panel .achievements-card,
      .tab-panel .library-card,
      .tab-panel .manga-card,
      .tab-panel .exam-form {
        background: var(--bg-card) !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .content.tab-entering {
        animation: tabFadeIn 0.3s cubic-bezier(0.4,0,0.2,1) both;
      }

      .content-pomodoro {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding-top: 0;
        padding-bottom: 0;
      }

      .pomodoro-panel {
        background: var(--container-bg);
        backdrop-filter: blur(24px) saturate(1.3);
        -webkit-backdrop-filter: blur(24px) saturate(1.3);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 18px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.06);
        padding: 2rem 2.5rem 2.5rem;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: fit-content;
        z-index: 1;
      }

      .pomodoro-panel::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        pointer-events: none;
      }

      /* Override fixed positioning when inside panel */
      .pomodoro-panel .pomodoro-container {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        transform: none !important;
        z-index: auto !important;
      }

      .pomodoro-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.7rem;
        max-width: 1000px;
        width: 100%;
        z-index: 1;
      }

      @keyframes pomodoroFadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }



      /* ── BOTTOM BAR LAYOUT ───────────────────────────────────── */
      .tabs-bottom {
        position: fixed !important;
        bottom: 1rem !important;
        left: 50% !important;
        right: auto !important;
        top: auto !important;
        transform: translateX(-50%) !important;
        width: auto !important;
        height: 50px !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 0 !important;
        padding: 0 0.5rem !important;
        background: var(--container-bg) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border: 1px solid var(--border-subtle) !important;
        border-radius: 9999px !important;
        z-index: 200 !important;
        overflow: hidden !important;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important;
        transition:
          width 0.45s cubic-bezier(0.4,0,0.2,1),
          height 0.45s cubic-bezier(0.4,0,0.2,1),
          top 0.45s cubic-bezier(0.4,0,0.2,1),
          bottom 0.45s cubic-bezier(0.4,0,0.2,1),
          border-radius 0.45s cubic-bezier(0.4,0,0.2,1),
          background 0.45s cubic-bezier(0.4,0,0.2,1),
          box-shadow 0.45s cubic-bezier(0.4,0,0.2,1),
          opacity 0.45s cubic-bezier(0.4,0,0.2,1) !important;
      }

      /* Esconde o sidebar-logo original dentro da pill */
      .tabs-bottom .sidebar-logo {
        display: none !important;
      }

      /* Logo fixo independente no canto superior esquerdo */
      .bottom-fixed-logo {
        position: fixed;
        top: 1.1rem;
        left: 1.35rem;
        display: flex;
        align-items: center;
        gap: 0;
        pointer-events: none;
        z-index: 201;
        animation: logoFadeIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
      }

      @keyframes logoFadeIn {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      .bottom-fixed-logo .sidebar-logo-g {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 800;
        font-size: 1.75rem;
        letter-spacing: 0;
        color: var(--primary-color);
        line-height: 1;
        text-shadow: 0 0 18px var(--primary-glow-subtle);
      }

      .bottom-fixed-logo .sidebar-logo-rest {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 800;
        font-size: 1.75rem;
        letter-spacing: 2px;
        color: #fff;
        line-height: 1;
        opacity: 0.9;
      }

      /* sidebar-nav em linha dentro da pill */
      .tabs-bottom .sidebar-nav {
        display: flex !important;
        flex-direction: row !important;
        flex: 0 0 auto !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 0 !important;
        align-items: center !important;
        min-width: 0 !important;
      }

      .tabs-bottom .sidebar-bottom {
        display: flex !important;
        flex-direction: row !important;
        flex: 0 0 auto !important;
        padding: 0 !important;
        gap: 0 !important;
        align-items: center !important;
        border-top: none !important;
      }

      .tabs-bottom .tab {
        flex: 0 0 auto !important;
        width: auto !important;
        height: 50px !important;
        min-width: 40px !important;
        max-width: none !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        padding: 6px 8px !important;
        border-radius: 9999px !important;
        border: none !important;
        border-top: none !important;
        position: relative;
      }

      .tabs-bottom .tab svg {
        width: 20px !important;
        height: 20px !important;
        transition: width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1) !important;
      }

      .tabs-bottom .tab .tab-label {
        display: none !important;
      }

      .tabs-bottom .tab,
      .tabs-bottom .tab *,
      .tabs-bottom .tab svg {
        filter: none !important;
        -webkit-filter: none !important;
      }

      .tabs-bottom .tab:hover {
        color: rgba(255,255,255,0.85) !important;
        filter: none !important;
        background: rgba(255,255,255,0.07) !important;
        transform: translateY(-2px) scale(1.06) !important;
      }

      .tabs-bottom .tab:hover *,
      .tabs-bottom .tab:hover svg {
        filter: none !important;
      }

      .tabs-bottom .tab.active {
        color: var(--primary-color) !important;
        filter: none !important;
        background: rgba(255,255,255,0.08) !important;
        transform: none !important;
      }

      .tabs-bottom .tab.active *,
      .tabs-bottom .tab.active svg {
        filter: none !important;
      }

      .app-bottom .content {
        padding-left: 2.5rem !important;
        padding-bottom: 80px !important;
      }

      .app-bottom .tab-panel {
      }

      /* Sem tooltip na versão rodapé */
      .tabs-bottom .tab::after {
        display: none !important;
      }

      /* Separador visual entre nav e botão de música */
      .tabs-bottom .sidebar-bottom::before {
        content: '' !important;
        display: block !important;
        width: 1px !important;
        height: 24px !important;
        background: var(--border-subtle) !important;
        margin: 0 4px !important;
      }

      /* ── SETTINGS REDESIGN (cfg-*) ───────────────────────────── */
      .cfg-root {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 1rem 3rem;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        animation: fadeIn 0.3s ease;
      }

      .cfg-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .cfg-section-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--text-muted);
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .cfg-cards-row {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
      }

      .cfg-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        padding: 1.4rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        transition: border-color 0.2s;
      }

      .cfg-card:hover {
        border-color: rgba(255,255,255,0.15);
      }

      .cfg-card-wide {
        grid-column: span 2;
      }

      @media (max-width: 640px) {
        .cfg-card-wide { grid-column: span 1; }
      }

      .cfg-card-danger {
        border-color: rgba(239,68,68,0.2);
      }

      .cfg-card-danger:hover {
        border-color: rgba(239,68,68,0.4);
      }

      .cfg-card-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.2rem;
        letter-spacing: 1px;
        color: #fff;
      }

      .cfg-danger-title {
        color: #ef4444;
      }

      .cfg-card-desc {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.4;
        margin-bottom: 0.4rem;
      }

      /* Color picker */
      .cfg-color-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.25rem;
      }

      .cfg-color-swatch {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        border: 2px solid rgba(255,255,255,0.15);
        cursor: pointer;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.2s;
        flex-shrink: 0;
      }

      .cfg-color-swatch:hover {
        border-color: rgba(255,255,255,0.4);
      }

      .cfg-color-swatch input[type="color"] {
        width: 56px;
        height: 56px;
        border: none;
        padding: 0;
        margin: -8px;
        cursor: pointer;
        background: none;
      }

      .cfg-color-hex {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        letter-spacing: 1px;
        color: #fff;
        flex: 1;
      }

      .cfg-btn-ghost {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
        padding: 0.35rem 0.85rem;
        border-radius: 7px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .cfg-btn-ghost:hover {
        border-color: rgba(255,255,255,0.3);
        color: #fff;
      }

      /* Background grid */
      .cfg-bg-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        margin-top: 0.25rem;
      }

      @media (max-width: 500px) {
        .cfg-bg-grid { grid-template-columns: repeat(2, 1fr); }
      }

      .cfg-bg-option {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 9px;
        padding: 0.6rem 0.5rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        transition: all 0.15s;
      }

      .cfg-bg-option:hover {
        background: rgba(255,255,255,0.07);
        border-color: rgba(255,255,255,0.2);
      }

      .cfg-bg-active {
        background: rgba(255,255,255,0.08) !important;
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 10px var(--primary-glow-subtle);
      }

      .cfg-bg-name {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: 0.3px;
      }

      .cfg-bg-desc {
        font-size: 0.7rem;
        color: var(--text-muted);
      }

      /* Layout picker */
      .cfg-layouts-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }

      @media (max-width: 580px) {
        .cfg-layouts-row { grid-template-columns: 1fr; }
      }

      .cfg-layout-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        padding: 1.2rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        position: relative;
        transition: all 0.2s;
        text-align: left;
      }

      .cfg-layout-card:hover {
        border-color: rgba(255,255,255,0.2);
        background: var(--bg-card);
      }

      .cfg-layout-active {
        border-color: var(--primary-color) !important;
        background: var(--bg-card) !important;
        box-shadow: 0 0 16px var(--primary-glow-subtle);
      }

      .cfg-layout-preview {
        width: 100%;
        height: 68px;
        border-radius: 8px;
        background: rgba(0,0,0,0.35);
        overflow: hidden;
        display: flex;
      }

      .cfg-preview-sidebar {
        width: 18px;
        background: rgba(255,255,255,0.06);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 6px 0;
        flex-shrink: 0;
      }

      .cfg-preview-sidebar-wide {
        width: 38px;
        padding: 6px 5px;
        align-items: flex-start;
      }

      .cfg-preview-content {
        flex: 1;
        background: rgba(255,255,255,0.02);
      }

      .cfg-preview-content-full {
        width: 100%;
        flex: 1;
      }

      .cfg-prev-dot {
        width: 8px;
        height: 8px;
        border-radius: 3px;
        background: rgba(255,255,255,0.25);
        flex-shrink: 0;
      }

      .cfg-prev-row {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
      }

      .cfg-prev-bar {
        height: 5px;
        border-radius: 3px;
        background: rgba(255,255,255,0.15);
        flex: 1;
      }

      .cfg-preview-bottombar {
        height: 18px;
        width: 100%;
        background: rgba(255,255,255,0.06);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding: 0 4px;
        flex-shrink: 0;
      }

      .cfg-preview-bottom {
        flex-direction: column !important;
      }

      .cfg-prev-bottom-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
      }

      .cfg-prev-bar-short {
        width: 14px;
        flex: none;
        height: 3px;
      }

      .cfg-layout-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .cfg-layout-name {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.1rem;
        letter-spacing: 1px;
        color: #fff;
      }

      .cfg-layout-desc {
        font-size: 0.78rem;
        color: var(--text-muted);
      }

      .cfg-layout-check {
        position: absolute;
        top: 10px;
        right: 12px;
        color: var(--primary-color);
        font-size: 0.85rem;
        font-weight: 700;
      }

      /* ── THEME PRESETS ── */
      .cfg-themes-hint {
        font-size: 0.82rem;
        color: var(--text-muted);
        margin: -0.4rem 0 0.2rem;
        line-height: 1.4;
      }

      .cfg-themes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
        gap: 0.75rem;
      }

      @media (max-width: 500px) {
        .cfg-themes-grid { grid-template-columns: repeat(2, 1fr); }
      }

      .cfg-theme-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 14px;
        padding: 0;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0;
        overflow: hidden;
        position: relative;
        transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
        text-align: left;
      }

      .cfg-theme-card:hover {
        border-color: rgba(255,255,255,0.2);
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      }

      .cfg-theme-active {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 18px var(--primary-glow-subtle) !important;
        transform: translateY(-3px) !important;
      }

      .cfg-theme-preview {
        width: 100%;
        height: 72px;
        position: relative;
        overflow: hidden;
        display: flex;
      }

      .cfg-theme-preview-bg {
        position: absolute;
        inset: 0;
      }

      .cfg-theme-preview-sidebar {
        width: 22px;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 6px 0;
        flex-shrink: 0;
        border-right: 1px solid rgba(255,255,255,0.06);
      }

      .cfg-theme-prev-dot {
        width: 8px;
        height: 8px;
        border-radius: 3px;
        flex-shrink: 0;
        transition: background 0.2s;
      }

      .cfg-theme-preview-accent-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        z-index: 2;
        opacity: 0.8;
      }

      .cfg-theme-check {
        position: absolute;
        top: 7px;
        right: 8px;
        z-index: 3;
        color: #fff;
        background: rgba(0,0,0,0.5);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(4px);
      }

      .cfg-theme-info {
        padding: 0.65rem 0.75rem 0.55rem;
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
      }

      .cfg-theme-name {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1rem;
        letter-spacing: 1.5px;
        color: #fff;
        transition: color 0.2s;
        line-height: 1;
      }

      .cfg-theme-desc {
        font-size: 0.7rem;
        color: rgba(255,255,255,0.35);
        line-height: 1.3;
        font-family: 'Rajdhani', sans-serif;
      }

      .cfg-theme-dot {
        position: absolute;
        bottom: 0.65rem;
        right: 0.75rem;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      /* Volume */
      .cfg-volume-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.25rem;
      }

      .cfg-slider {
        flex: 1;
        height: 4px;
        appearance: none;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        accent-color: var(--primary-color);
      }

      .cfg-volume-pct {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text-muted);
        min-width: 36px;
        text-align: right;
      }

      /* Toggle */
      .cfg-toggle {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text-muted);
        font-size: 0.9rem;
        font-weight: 600;
        margin-top: 0.25rem;
        text-align: left;
      }

      .cfg-toggle:hover {
        border-color: rgba(255,255,255,0.2);
        color: #fff;
      }

      .cfg-toggle-on {
        border-color: var(--primary-color);
        color: #fff;
      }

      .cfg-toggle-track {
        width: 36px;
        height: 20px;
        border-radius: 10px;
        background: rgba(255,255,255,0.1);
        position: relative;
        transition: background 0.2s;
        flex-shrink: 0;
      }

      .cfg-toggle-on .cfg-toggle-track {
        background: var(--primary-color);
      }

      .cfg-toggle-thumb {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
        transition: transform 0.2s, background 0.2s;
      }

      .cfg-toggle-on .cfg-toggle-thumb {
        transform: translateX(16px);
        background: #fff;
      }

      /* Data buttons */
      .cfg-data-btns {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
        margin-top: 0.25rem;
      }

      .cfg-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--primary-color);
        color: var(--btn-text-color, #000);
        border: none;
        border-radius: 8px;
        padding: 0.6rem 1.1rem;
        font-size: 0.88rem;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.15s;
        font-family: 'Rajdhani', sans-serif;
        letter-spacing: 0.5px;
      }

      .cfg-btn-primary:hover {
        opacity: 0.85;
        transform: translateY(-1px);
      }

      .cfg-btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: transparent;
        color: #fff;
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 0.6rem 1.1rem;
        font-size: 0.88rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Rajdhani', sans-serif;
        letter-spacing: 0.5px;
      }

      .cfg-btn-secondary:hover {
        border-color: rgba(255,255,255,0.3);
        background: var(--bg-card);
      }

      .cfg-btn-danger {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: rgba(239,68,68,0.12);
        color: #ef4444;
        border: 1px solid rgba(239,68,68,0.3);
        border-radius: 8px;
        padding: 0.6rem 1.1rem;
        font-size: 0.88rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Rajdhani', sans-serif;
        letter-spacing: 0.5px;
        margin-top: 0.25rem;
      }

      .cfg-btn-danger:hover {
        background: #ef4444;
        color: #fff;
        border-color: #ef4444;
      }
      /* ─────────────────────────────────────────────────────────── */

      /* ── GAETE SIDEBAR LAYOUT ────────────────────────────────── */
      .tabs-gaete {
        width: 210px;
        top: 0;
        transform: none;
        border-radius: 0 16px 16px 0;
        background: var(--container-bg);
        backdrop-filter: blur(24px) saturate(1.6);
        border-right: 1px solid rgba(255,255,255,0.1);
        box-shadow: 6px 0 40px rgba(0,0,0,0.55), inset -1px 0 0 rgba(255,255,255,0.04);
        align-items: center;
        overflow: hidden;
      }

      .tabs-gaete .sidebar-logo {
        justify-content: center;
        padding: 1.5rem 1rem 1.2rem;
        width: 100%;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        flex-shrink: 0;
      }

      .tabs-gaete .sidebar-nav {
        align-items: stretch;
        padding: 0.75rem 0.75rem;
        gap: 2px;
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
      }

      .tabs-gaete .sidebar-bottom {
        align-items: stretch;
        padding: 0 0.75rem 1rem;
        gap: 2px;
        width: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        border-top: 1px solid rgba(255,255,255,0.06);
        padding-top: 0.75rem;
      }

      .tabs-gaete .tab {
        width: 100%;
        flex: 1;
        height: auto;
        min-height: 0;
        padding: 0 0.9rem 0 0.85rem;
        justify-content: flex-start;
        gap: 0.75rem;
        border-radius: 10px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 1.3rem;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        position: relative;
        border-left: 3px solid transparent;
        transition: all 0.18s ease;
      }

      .tabs-gaete .sidebar-bottom .tab {
        flex: 0 0 auto;
        padding: 0.55rem 0.9rem 0.55rem 0.85rem;
        min-height: 38px;
      }

      .tabs-gaete .tab .tab-label {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        font-size: 1.3rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        flex: 1;
        text-align: left;
        opacity: 0.65;
        transition: opacity 0.18s ease;
      }

      .tabs-gaete .tab::after {
        display: none;
      }

      .tabs-gaete .tab:hover {
        transform: none;
        background: rgba(255,255,255,0.06);
        border-left-color: var(--primary-color);
        opacity: 0.85;
      }

      .tabs-gaete .tab:hover .tab-label {
        opacity: 0.9;
      }

      .tabs-gaete .tab.active {
        transform: none;
        background: var(--primary-glow-subtle);
        border-left-color: var(--primary-color);
        box-shadow: inset 0 0 20px var(--primary-glow-subtle), 2px 0 12px rgba(0,0,0,0.2);
      }

      .tabs-gaete .tab.active .tab-label {
        opacity: 1;
        color: var(--primary-color);
        text-shadow: 0 0 16px var(--primary-glow);
      }

      .tab-label {
        display: none;
      }

      /* Gaete Settings UI */
      .gaete-layout-picker {
        display: flex;
        gap: 1rem;
        margin-top: 0.75rem;
      }

      .gaete-option {
        flex: 1;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        position: relative;
      }

      .gaete-option:hover {
        border-color: rgba(255,255,255,0.25);
        background: var(--bg-card);
      }

      .gaete-option.gaete-selected {
        border-color: var(--primary-color);
        background: rgba(255,255,255,0.06);
        box-shadow: 0 0 16px var(--primary-glow-subtle);
      }

      .gaete-preview {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        background: rgba(0,0,0,0.3);
        border-radius: 8px;
        padding: 8px 6px;
        min-height: 80px;
        justify-content: center;
      }

      .gaete-preview-icons {
        align-items: center;
      }

      .gaete-icon-dot {
        width: 18px;
        height: 18px;
        border-radius: 5px;
        background: rgba(255,255,255,0.18);
        flex-shrink: 0;
      }

      .gaete-preview-full .gaete-row-item {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
      }

      .gaete-text-bar {
        height: 8px;
        border-radius: 4px;
        background: rgba(255,255,255,0.15);
        flex: 1;
      }

      .gaete-label {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 1px;
        color: var(--text-muted);
        text-transform: uppercase;
      }

      .gaete-selected .gaete-label {
        color: var(--primary-color);
      }

      .gaete-check {
        position: absolute;
        top: 6px;
        right: 8px;
        color: var(--primary-color);
        font-size: 0.8rem;
        font-weight: 700;
      }

      .gaete-selected .gaete-icon-dot {
        background: var(--primary-color);
        opacity: 0.6;
      }

      .gaete-selected .gaete-text-bar {
        background: rgba(255,255,255,0.25);
      }

      .app-gaete .content {
        padding-left: 240px;
        padding-right: 4rem;
      }

      .app-gaete .tab-panel {
      }
      /* ─────────────────────────────────────────────────────────── */

      /* MUSIC PLAYER STYLES */
      .music-toggle-btn {
        display: none;
      }

      .music-player-panel {
        position: fixed;
        bottom: 4.5rem;
        left: 78px;
        width: 280px;
        background: rgba(24, 24, 27, 0.95);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1rem;
        z-index: 999;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.25s ease;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .music-player-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: 1rem;
      }

      .music-player-header h4 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.3rem;
        letter-spacing: 2px;
        color: #fff;
        margin: 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 1.8rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s ease;
        line-height: 1;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .music-player-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .music-url-input {
        background: rgba(9, 9, 11, 0.5);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        padding: 0.65rem;
        color: #fff;
        font-size: 0.85rem;
        font-family: 'Rajdhani', sans-serif;
        transition: all 0.2s ease;
      }

      .music-url-input:focus {
        outline: none;
        border-color: var(--primary-color);
        background: rgba(9, 9, 11, 0.7);
        box-shadow: 0 0 10px var(--primary-glow-subtle);
      }

      .music-url-input::placeholder {
        color: var(--text-muted);
        font-size: 0.8rem;
      }

      .btn-small {
        padding: 0.6rem 1.2rem;
        font-size: 0.95rem;
        min-width: auto;
      }

      .music-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.75rem;
        padding: 0.75rem;
        background: rgba(9, 9, 11, 0.4);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
      }

      .music-status {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 0;
      }

      .music-indicator {
        font-size: 1.5rem;
      }

      .music-text {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .music-buttons {
        display: flex;
        gap: 0.75rem;
      }

      .volume-control {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
      }

      .volume-control svg {
        color: var(--text-muted);
        flex-shrink: 0;
      }

      .volume-slider {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
        appearance: none;
      }

      .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .volume-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 0 8px var(--primary-glow-subtle);
      }

      .volume-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        background: var(--primary-color);
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .volume-slider::-moz-range-thumb:hover {
        transform: scale(1.2);
        box-shadow: 0 0 8px var(--primary-glow-subtle);
      }

      .volume-value {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.85rem;
        color: var(--text-muted);
        min-width: 40px;
        text-align: right;
      }

      .btn-control {
        flex: 1;
        padding: 0.6rem 1rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-control:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--primary-color);
        transform: translateY(-1px);
      }

      .btn-control:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .btn-stop {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
      }

      .btn-stop:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.6);
      }

      .youtube-player-container {
        border-radius: 8px;
        overflow: hidden;
        margin-top: 0.5rem;
        border: 1px solid var(--border-subtle);
      }

      /* MUSIC PROMPT MODAL */
      .music-prompt-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .music-prompt-modal {
        background: rgba(24, 24, 27, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--border-highlight);
        border-radius: 20px;
        padding: 2.5rem;
        max-width: 450px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        animation: scaleIn 0.3s ease;
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .music-prompt-modal h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        letter-spacing: 2px;
        color: #fff;
        margin-bottom: 1rem;
      }

      .music-prompt-modal p {
        color: var(--text-muted);
        margin-bottom: 2rem;
        line-height: 1.6;
        font-size: 1rem;
      }

      .music-prompt-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }

      .music-prompt-buttons button {
        flex: 1;
        max-width: 180px;
      }

      /* COMMON CARD STYLES */
      .timer-card, .settings-card, .add-subject-card, .subject-card, .stats-card, .calendar-card, .calendar-details, .config-card, .achievements-card, .library-card {
        background: linear-gradient(145deg, rgba(14,14,20,0.95) 0%, rgba(10,10,15,0.98) 100%);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
        padding: 1.5rem;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);
        position: relative;
        overflow: hidden;
      }

      .timer-card::after, .settings-card::after, .stats-card::after, .calendar-card::after, .config-card::after, .achievements-card::after, .library-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        pointer-events: none;
      }

      .timer-card::before, .settings-card::before, .config-card::before, .achievements-card::before, .library-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        opacity: 0.55;
        pointer-events: none;
      }

      /* POMODORO - CENTRO MINIMALISTA - AUMENTADO E CENTRALIZADO */

      /* TIMER FLUTUANTE - SEM CARD - MAIOR */
      .timer-floating {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem 1.5rem;
      }

      /* Desktop: Side-by-side layout for Focus mode */
      @media (min-width: 768px) {
        .pomodoro-container.split-view {
          display: grid;
          grid-template-columns: 1fr 1fr; /* EQUAL WIDTH */
          align-items: stretch; /* Both cards same height */
          gap: 1.5rem;
          max-width: 800px; /* Allow width to expand for side-by-side */
        }
        
        .pomodoro-container.single-view {
          display: flex;
          justify-content: center;
          max-width: 500px; /* Limit width when centered */
        }

        .secondary-card {
          margin-top: 0 !important; /* Reset inherited margin */
          height: 100%; /* Match height */
          border-top: 1px solid var(--border-subtle) !important; /* Reset specific style */
          background: var(--bg-card) !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }

      .timer-card {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.1rem 1.2rem;
      }

      .timer-header h2 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.5rem;
        letter-spacing: 4px;
        color: #fff;
        text-align: center;
        margin-bottom: 1.5rem;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
      }

      .timer-circle {
        position: relative;
        width: 272px;
        height: 272px;
        margin: 0.85rem auto;
      }

      .timer-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
      }

      .timer-bg {
        fill: none;
        stroke: rgba(255,255,255,0.05);
        stroke-width: 5; /* Slightly thinner */
      }

      .timer-progress {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 5; /* Slightly thinner */
        stroke-linecap: round;
        transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
        filter: drop-shadow(0 0 5px var(--primary-glow));
      }

      .timer-display {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .time-text {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 4.25rem;
        color: #fff;
        letter-spacing: 4px;
        line-height: 1;
        text-shadow: 0 0 20px rgba(0,0,0,0.5);
      }

      .subject-display {
        font-size: 1.1rem; /* Reduced from 1.5rem */
        color: var(--primary-color);
        margin-top: 0.2rem;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        opacity: 0.9;
      }

      /* MINIMALIST CONFIG INPUTS - MAIORES */
      .time-config-row {
        display: flex;
        justify-content: center;
        gap: 2.55rem;
        width: 100%;
        margin-top: 1.7rem;
        margin-bottom: 0.85rem;
        padding-top: 1.275rem;
        border-top: 1px solid rgba(255,255,255,0.05);
      }

      .mini-config-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .mini-label {
        font-size: 0.85rem;
        text-transform: uppercase;
        color: var(--text-muted);
        letter-spacing: 1.5px;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      .mini-input {
        background: transparent;
        border: none;
        border-bottom: 2px solid var(--border-subtle);
        color: #fff;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.53rem;
        text-align: center;
        width: 68px;
        padding: 0.25rem;
        transition: all 0.2s;
      }

      .mini-input:focus {
        outline: none;
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      
      .mini-input:disabled {
        opacity: 0.5;
        border-bottom-style: dashed;
      }

      .timer-controls {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
        margin-top: 1.7rem;
        width: 100%;
      }

      .btn-stop-subtle {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.45rem 1.4rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.45);
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1rem;
        letter-spacing: 2px;
        cursor: pointer;
        transition: color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
        text-transform: uppercase;
        opacity: 0.7;
      }

      .btn-stop-subtle:hover {
        color: rgba(255, 255, 255, 0.9);
        border-color: rgba(255, 255, 255, 0.7);
        opacity: 1;
      }
      
      /* Buttons - Tamanho aumentado */
      .btn-primary, .btn-secondary, .btn-danger {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 1rem 2rem;
        border: 1px solid;
        border-radius: 10px;
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.4rem;
        letter-spacing: 2px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-transform: uppercase;
      }

      .btn-primary {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: var(--btn-text); 
        box-shadow: 0 4px 15px var(--primary-glow);
        font-weight: 700;
        min-width: 150px;
      }

      .btn-primary:hover {
        filter: brightness(1.2);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px var(--primary-glow);
      }

      .btn-secondary {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.1);
        color: #fff;
      }

      .btn-secondary:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-2px);
      }

      .btn-danger {
        background: transparent;
        border-color: rgba(239, 68, 68, 0.4);
        color: #ef4444;
      }

      .btn-danger:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #fff;
        border-color: #ef4444;
      }

      /* SUBJECTS - REDESIGN MINIMALISTA TREE VIEW */
      .subjects-container {
        animation: fadeIn 0.4s ease;
        width: 100%;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
      }

      .subjects-grid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-shrink: 0;
      }

      .subjects-grid-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        letter-spacing: 2px;
        color: var(--text-main);
      }

      .subjects-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: calc((100% - 2 * 0.85rem) / 3);
        gap: 0.85rem;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 4px 4px 4px 4px;
        margin: -4px -4px -4px -4px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.15) transparent;
        align-content: start;
      }

      /* Inside detail view, grid should not stretch with fixed row heights */
      .subject-detail-view .subjects-grid {
        grid-auto-rows: auto;
        flex: unset;
        overflow-y: visible;
        overflow-x: visible;
        max-height: none;
      }

      /* ── SUBJECT DETAIL VIEW ─────────────────────────────────── */
      .subject-detail-view {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
      }

      .subject-detail-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.75rem;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        flex-shrink: 0;
      }

      .subject-detail-info {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        flex: 1;
      }

      .subject-detail-marker {
        width: 5px;
        height: 28px;
        border-radius: 3px;
        flex-shrink: 0;
      }

      .subject-detail-name {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2rem;
        letter-spacing: 2px;
        color: #fff;
        margin: 0;
        text-shadow: 0 2px 8px rgba(0,0,0,0.4);
      }

      .btn-back {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.12);
        background: var(--bg-card);
        color: rgba(255,255,255,0.7);
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .btn-back:hover {
        background: rgba(255,255,255,0.1);
        border-color: rgba(255,255,255,0.25);
        color: #fff;
      }

      .subject-detail-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .subjects-grid::-webkit-scrollbar {
        width: 4px;
      }

      .subjects-grid::-webkit-scrollbar-track {
        background: transparent;
      }

      .subjects-grid::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.15);
        border-radius: 4px;
      }

      .subject-app-card {
        border: 2px solid transparent;
        border-radius: 14px;
        padding: 1rem 1.1rem;
        transition: all 0.25s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        position: relative;
        overflow: hidden;
        height: 100%;
        justify-content: space-between;
        box-sizing: border-box;
      }

      .subject-app-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
        filter: brightness(1.1);
      }

      .subject-app-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .subject-app-icon {
        width: 70px;
        height: 70px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        transition: transform 0.2s;
      }

      .subject-app-card:hover .subject-app-icon {
        transform: scale(1.08);
      }

      .subject-app-delete {
        background: var(--bg-card);
        border: 1px solid transparent;
        color: rgba(255,255,255,0.3);
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        opacity: 0;
      }

      .subject-app-card:hover .subject-app-delete {
        opacity: 1;
      }

      .subject-app-delete:hover {
        background: rgba(239, 68, 68, 0.15);
        border-color: rgba(239, 68, 68, 0.4);
        color: #ef4444;
      }

      .subject-app-body {
        flex: 1;
      }

      .subject-app-name {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: 1px;
        color: #fff;
        margin: 0;
        text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        text-transform: uppercase;
      }

      .add-subject-wrapper {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 50px;
        padding: 0.75rem 0.75rem 0.75rem 2rem;
        margin-bottom: 2.5rem;
        display: flex;
        align-items: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      }
      
      .add-subject-wrapper:focus-within {
        border-color: var(--primary-color);
        box-shadow: 0 4px 25px var(--primary-glow-subtle);
        background: rgba(20, 20, 23, 0.9);
      }

      .add-subject-input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.35rem;
        outline: none;
      }
      
      .add-subject-input::placeholder {
        color: var(--text-muted);
      }
      
      .add-subject-btn {
        background: var(--primary-color);
        color: var(--btn-text);
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .add-subject-btn:hover {
        transform: scale(1.1);
      }

      .subjects-tree {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
      }

      .subject-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 14px;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .subject-card:hover {
        background: var(--bg-card);
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .subject-header-modern {
        display: flex;
        align-items: center;
        padding: 1.75rem 2rem;
        cursor: pointer;
        user-select: none;
      }
      
      .subject-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      
      .subject-marker {
        width: 6px;
        height: 32px;
        border-radius: 3px;
      }
      
      .subject-name {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.5rem;
        color: #fff;
        letter-spacing: 2px;
        font-weight: 700;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      }
      
      .modern-actions {
        display: flex;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      .subject-header-modern:hover .modern-actions {
        opacity: 1;
      }
      
      .modern-action-btn {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: var(--bg-card);
        border: 1px solid transparent;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .modern-action-btn:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
      }
      
      .modern-action-btn.delete:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
      
      .subject-content {
        padding-bottom: 1rem;
      }
      
      /* Tree Hierarchy Lines */
      .tree-level-1 {
        margin-left: 2.5rem;
        padding-left: 2rem;
        border-left: none;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .tree-level-1-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        max-width: 100%;
        width: 100%;
        gap: 1rem;
        padding: 0.5rem;
        align-items: start;
        box-sizing: border-box;
      }
      
      @media (max-width: 600px) {
        .tree-level-1-grid {
          grid-template-columns: 1fr;
        }
      }

      .area-block {
        position: relative;
      }

      .area-block-card {
        position: relative;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0.7rem 0.9rem;
        transition:
          background-color 0.25s ease,
          border-color 0.25s ease,
          transform 0.25s ease,
          box-shadow 0.25s ease,
          padding 0.3s ease;
      }

      .area-block-card.expanded {
        padding: 1.1rem;
      }

      .area-block-card:hover {
        background: var(--bg-card);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      /* ── Collapsible wrapper (grid-rows trick) ── */
      .collapse-wrapper {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.32s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.28s ease;
        opacity: 0;
      }

      .collapse-wrapper.collapse-open {
        grid-template-rows: 1fr;
        opacity: 1;
      }

      .collapse-inner {
        overflow: hidden;
        min-height: 0;
      }

      /* Chevron rotation */
      .chevron-icon {
        transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        color: var(--text-muted);
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .chevron-icon.open {
        transform: rotate(90deg);
      }
      
      .area-header-modern {
        display: flex;
        align-items: center;
        padding: 0.2rem 0;
        margin-bottom: 0;
        min-height: 50px;
        cursor: pointer;
        user-select: none;
      }
      
      .area-title-modern {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        font-size: 1.35rem;
        color: var(--text-main);
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex: 1;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        line-height: 1.2;
      }
      
      .tree-level-2 {
        margin-left: 0.5rem;
        padding-left: 0.75rem;
        border-left: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 0.5rem;
      }
      
      .chapter-block {
        position: relative;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 0.6rem 0.85rem;
        transition:
          background-color 0.2s ease,
          border-color 0.2s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .chapter-block:hover {
        background: var(--bg-card);
        border-color: rgba(255, 255, 255, 0.18);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
      }

      /* depth=1: chapters rendered at top level */
      .tree-level-1-grid > div > .chapter-block {
        background: var(--bg-card);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 0.7rem 0.9rem;
        transition:
          background-color 0.2s ease,
          border-color 0.2s ease,
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .tree-level-1-grid > div > .chapter-block:hover {
        background: var(--bg-card);
        border-color: rgba(255, 255, 255, 0.22);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }

      .tree-level-1-grid > div > .chapter-block .chapter-title-modern {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text-main);
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      }
      
      .chapter-header-modern {
        display: flex;
        align-items: center;
        padding: 0.2rem 0;
        min-height: 40px;
        cursor: pointer;
        user-select: none;
      }

      .chapter-title-modern {
        color: var(--text-muted);
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        transition: color 0.2s;
      }
      
      .chapter-title-modern:hover {
        color: #fff;
      }
      
      .tree-level-3 {
        margin-left: 0.5rem;
        padding-left: 0.75rem;
        border-left: none;
        padding-top: 0.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      
      .task-modern {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0;
        position: relative;
      }
      
      .task-checkbox-modern {
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid var(--text-muted);
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      
      .task-checkbox-modern:checked {
        background: var(--primary-color);
        border-color: var(--primary-color);
      }
      
      .task-checkbox-modern:checked::after {
        content: '✓';
        position: absolute;
        color: #000;
        font-size: 11px;
        left: 2px;
        top: -2px;
        font-weight: bold;
      }
      
      .task-label-modern {
        color: var(--text-muted);
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.2s;
        flex: 1;
      }
      
      .task-label-modern:hover {
        color: #fff;
      }
      
      .task-label-modern.completed {
        text-decoration: line-through;
        opacity: 0.5;
      }
      
      /* Input resets for modern edit */
      .modern-edit-input {
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--primary-color);
        color: #fff;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        text-transform: inherit;
        width: 100%;
        padding: 0;
        outline: none;
      }
      
      .expand-icon {
        transition: transform 0.2s;
        color: var(--text-muted);
      }
      
      .empty-branch {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-style: italic;
        opacity: 0.5;
        padding: 0.2rem 0;
      }


      /* STATS */
      /* ── STATISTICS REDESIGN ─────────────────────────────── */
      .stats-root {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .stats-period-row {
        display: flex;
        gap: 0.35rem;
        flex-wrap: wrap;
      }

      .stats-period-btn {
        padding: 0.3rem 0.9rem;
        border-radius: 999px;
        border: 1px solid var(--border-subtle);
        background: transparent;
        color: var(--text-muted);
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .stats-period-btn:hover {
        border-color: var(--primary-color);
        color: #fff;
      }

      .stats-period-btn.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: #fff;
        box-shadow: 0 0 12px var(--primary-glow-subtle);
      }

      .stats-kpi-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.6rem;
      }

      .stats-kpi {
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px;
        padding: 0.75rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        position: relative;
        overflow: hidden;
      }

      .stats-kpi::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--primary-color), transparent);
        opacity: 0.6;
      }

      .stats-kpi-val {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        color: #fff;
        letter-spacing: 1px;
        line-height: 1;
      }

      .stats-kpi-label {
        font-size: 0.72rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
      }

      .stats-charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1.6fr;
        gap: 0.75rem;
        align-items: start;
      }

      .stats-chart-card {
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 14px;
        padding: 1rem 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .stats-chart-card--wide {
        grid-column: span 1;
      }

      .stats-chart-title {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 2px;
        color: var(--text-muted);
        margin: 0;
        text-transform: uppercase;
      }

      .stats-donut-wrap {
        display: flex;
        justify-content: center;
        padding: 0.25rem 0;
      }

      .stats-legend {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .stats-legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.85rem;
      }

      .stats-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .stats-legend-name {
        flex: 1;
        color: var(--text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .stats-legend-val {
        color: #fff;
        font-weight: 700;
        white-space: nowrap;
      }

      .stats-empty-note {
        font-size: 0.8rem;
        color: var(--text-muted);
        margin: 0;
        font-family: 'Rajdhani', sans-serif;
      }

      .stats-bars {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .stat-bar-row {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .stat-bar-meta {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .stat-bar-name {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.88rem;
        font-weight: 700;
      }

      .stat-bar-num {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      .stat-bar-num em {
        font-style: normal;
        color: #fff;
      }

      .stat-bar-track {
        height: 6px;
        background: rgba(255,255,255,0.06);
        border-radius: 999px;
        overflow: visible;
      }

      .stat-bar-bg {
        height: 100%;
        background: rgba(255,255,255,0.1);
        border-radius: 999px;
        overflow: hidden;
        transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
      }

      .stat-bar-fill {
        height: 100%;
        border-radius: 999px;
        transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
      }

      /* ── SESSION TYPE SWITCH (Pomodoro) ──────────────── */
      .session-type-switch {
        display: flex;
        gap: 0;
        background: rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.18);
        border-radius: 10px;
        padding: 3px;
        width: fit-content;
        margin: 0 auto;
        box-shadow: inset 0 2px 6px rgba(0,0,0,0.3);
      }

      .session-type-btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.45rem 1.1rem;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: rgba(255,255,255,0.75);
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .session-type-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .session-type-btn.active {
        background: rgba(255,255,255,0.15);
        color: #ffffff;
        border: 1.5px solid rgba(255,255,255,0.6);
        box-shadow: 0 2px 10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
        text-shadow: 0 1px 3px rgba(0,0,0,0.6);
      }

      .session-type-icon {
        font-size: 0.9rem;
      }

            /* CALENDAR */
      .calendar-container {
        display: grid;
        gap: 2rem;
      }
      
      .goal-config {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        background: rgba(0,0,0,0.2);
        padding: 1.2rem;
        border-radius: 12px;
        border: 1px solid var(--border-subtle);
        width: fit-content;
      }
      
      .goal-config label {
        color: var(--primary-color);
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: 1px;
      }
      
      .goal-config input {
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        width: 90px;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
        text-align: center;
      }
      
      .goal-config input:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      
      .goal-info {
        font-size: 0.95rem;
        color: var(--text-muted);
      }

      .calendar-header-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .month-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.2rem;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 3px;
      }

      .nav-btn {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .nav-btn:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: rgba(255, 255, 255, 0.1);
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.75rem;
      }

      .calendar-day-header {
        text-align: center;
        color: var(--text-muted);
        font-weight: 700;
        padding: 0.5rem;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 1px;
      }

      .calendar-day {
        aspect-ratio: 1;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
      }

      .calendar-day:hover {
        border-color: rgba(255,255,255,0.18);
        background: var(--bg-card);
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      }
      
      .calendar-day.goal-met {
        border-color: rgba(16, 185, 129, 0.5); /* Green */
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.1) inset;
      }
      
      .calendar-day.goal-met .day-total-mini {
        color: var(--success);
      }
      
      .calendar-day.goal-warning {
        border-color: rgba(245, 158, 11, 0.5); /* Orange/Amber */
        border-style: solid;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent);
      }
      
      .calendar-day.goal-warning .day-total-mini {
        color: var(--warning);
      }

      .calendar-day.empty {
        background: transparent;
        border: none;
        cursor: default;
        box-shadow: none;
      }

      .calendar-day.selected {
        border-color: var(--primary-color);
        box-shadow: 0 0 20px var(--primary-glow);
        background: var(--bg-card);
      }
      
      .calendar-day.selected.goal-met {
        border-color: var(--success);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
      }
      
      .calendar-day.selected.goal-warning {
        border-color: var(--warning);
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
      }

      .calendar-day.has-data:not(.goal-met):not(.goal-warning) {
        background: var(--bg-card);
      }

      .day-number {
        position: absolute;
        top: 8px;
        left: 10px;
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 600;
      }
      
      .calendar-day.selected .day-number, .calendar-day:hover .day-number {
        color: #fff;
      }

      .day-indicator {
        margin-top: 0;
        display: flex;
        justify-content: center;
        gap: 3px;
        margin-bottom: 4px;
      }

      .dot {
        width: 6px;
        height: 6px;
        background-color: var(--primary-color);
        border-radius: 50%;
        box-shadow: 0 0 5px var(--primary-glow-subtle);
      }
      
      .calendar-day.goal-met .dot {
        background-color: var(--success);
        box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
      }
      
      .calendar-day.goal-warning .dot {
        background-color: var(--warning);
        box-shadow: 0 0 5px rgba(245, 158, 11, 0.5);
      }

      .day-total-mini {
        margin-top: auto;
        margin-bottom: auto;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 400; /* Lighter weight for cleaner look */
        color: var(--primary-color);
        font-family: 'Bebas Neue', sans-serif;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }

      .details-header {
        border-bottom: 1px solid var(--border-subtle);
        padding-bottom: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .details-header h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        color: #fff;
        letter-spacing: 1px;
      }

      .details-header span {
        color: var(--primary-color);
        font-size: 1.4rem;
        margin-left: 0.5rem;
      }
      
      .goal-status-box {
        margin-top: 1.5rem;
        background: rgba(0,0,0,0.2);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-subtle);
      }
      
      .goal-status-text {
        font-weight: 600;
        margin-bottom: 0.75rem;
        display: block;
        letter-spacing: 0.5px;
      }
      
      .goal-progress-bar {
        height: 10px;
        background: var(--bg-card);
        border-radius: 5px;
        overflow: hidden;
      }
      
      .goal-progress-fill {
        height: 100%;
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px rgba(0,0,0,0.2) inset;
      }

      /* ============================================ */
      /* EDITOR DE SESSÕES NO CALENDÁRIO */
      /* ============================================ */
      
      .btn-edit-sessions {
        background: var(--primary-color);
        border: none;
        color: var(--btn-text-color);
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 0 10px var(--primary-glow);
      }

      .btn-edit-sessions:hover {
        transform: scale(1.1);
        box-shadow: 0 0 15px var(--primary-glow);
      }

      .session-editor-modal {
        max-width: 800px;
        width: 90%;
      }

      .quick-actions-section {
        background: rgba(255, 255, 255, 0.02);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-subtle);
      }

      .session-edit-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: all 0.2s;
      }

      .session-edit-card:hover {
        background: var(--bg-card);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .session-edit-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
      }

      .session-edit-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
      }

      .session-stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-label {
        font-size: 0.85rem;
        color: var(--text-muted);
      }

      .stat-value {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-main);
      }

      .session-edit-actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }

      .btn-action-small {
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.07);
        color: var(--text-main);
        padding: 0.5rem 0.75rem;
        border-radius: 10px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .btn-action-small:hover {
        background: var(--primary-color);
        color: var(--btn-text-color);
        border-color: var(--primary-color);
        transform: translateY(-2px);
      }

      .btn-danger-small {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 0.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-danger-small:hover {
        background: #ef4444;
        color: white;
        border-color: #ef4444;
        transform: scale(1.1);
      }

      .day-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.25rem;
        margin-top: 1.5rem;
      }

      .stat-box {
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 1.2rem;
        transition: transform 0.2s;
      }
      
      .stat-box:hover {
        transform: translateY(-2px);
        background: var(--bg-card);
      }

      .stat-subject {
        color: #fff;
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        display: block;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .stat-subject-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .stat-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.95rem;
        margin-bottom: 0.4rem;
        color: var(--text-muted);
      }
      
      .stat-row span:last-child {
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
      }

      /* CALENDAR COMPACT HORIZONTAL LAYOUT */
      .calendar-container-horizontal {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 1.5rem;
        height: calc(100vh - 180px);
      }

      .calendar-left-section {
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1rem;
        overflow-y: auto;
      }

      .calendar-right-section {
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 1.5rem;
        overflow-y: auto;
      }

      .goal-config-compact {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        background: rgba(0,0,0,0.3);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
      }

      .goal-config-compact label {
        color: var(--primary-color);
        font-weight: 700;
        font-size: 0.85rem;
      }

      .goal-config-compact input {
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        color: #fff;
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        width: 70px;
        font-size: 0.95rem;
        text-align: center;
      }

      .calendar-header-nav-compact {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid var(--border-subtle);
      }

      .month-title-compact {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .nav-btn-compact {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: #fff;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .nav-btn-compact:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      .calendar-grid-compact {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.4rem;
      }

      .calendar-day-header-compact {
        text-align: center;
        color: var(--text-muted);
        font-weight: 600;
        padding: 0.3rem;
        font-size: 0.75rem;
        letter-spacing: 0.5px;
      }

      .details-header-compact {
        margin-bottom: 1.5rem;
      }

      .day-stats-grid-compact {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .stat-box-compact {
        background: rgba(255,255,255,0.02);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 0.75rem;
      }

      .stat-subject-compact {
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
        display: block;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        padding-bottom: 0.4rem;
      }

      .stat-row-compact {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
        color: var(--text-muted);
      }

      .stat-row-compact span:last-child {
        color: #fff;
        font-weight: 600;
      }
      
      /* LIBRARY STYLES */
      /* ═══════════════════════════════════════
         BIBLIOTECA — EDITORIAL LUXURY REDESIGN
         ═══════════════════════════════════════ */

      @keyframes libResultIn {
        from { opacity: 0; transform: translateY(14px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes libShelfSlide {
        from { opacity: 0; transform: translateX(-12px); }
        to   { opacity: 1; transform: translateX(0); }
      }

      @keyframes libBookIn {
        from { opacity: 0; transform: translateY(20px) rotateX(8deg); }
        to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
      }

      /* Container principal */
      .library-container {
        display: flex;
        flex-direction: column;
        gap: 0;
        height: 100%;
      }

      /* Cards da biblioteca — redesign total */
      .library-card {
        background: linear-gradient(145deg, rgba(14,14,18,0.95) 0%, rgba(10,10,14,0.98) 100%) !important;
        border: 1px solid rgba(255,255,255,0.07) !important;
        border-radius: 18px !important;
        padding: 1.6rem 1.8rem !important;
        position: relative;
        overflow: hidden;
      }

      .library-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), rgba(255,255,255,0.55), rgba(255,255,255,0.25), transparent);
        border-radius: 18px 18px 0 0;
      }

      .library-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        pointer-events: none;
      }

      /* Header da biblioteca */
      .library-card .stats-header,
      .manga-card .stats-header {
        border-bottom: 1px solid rgba(255,255,255,0.06) !important;
        padding-bottom: 1rem !important;
        margin-bottom: 1.4rem !important;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .library-card .stats-header svg,
      .manga-card .stats-header svg {
        color: rgba(255,255,255,0.45);
        flex-shrink: 0;
      }

      .library-card .stats-header h2,
      .library-card .stats-header h3,
      .manga-card .stats-header h2,
      .manga-card .stats-header h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 3px;
        color: rgba(255,255,255,0.9);
        margin: 0;
      }

      /* ── SEARCH CONTAINER ── */
      .library-search-container {
        margin-bottom: 0;
      }

      .search-box {
        display: flex;
        gap: 0;
        align-items: stretch;
        background: rgba(0,0,0,0.4);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        overflow: hidden;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
        margin-bottom: 0;
      }

      .search-box:focus-within {
        border-color: var(--primary-color);
      }

      .search-box input {
        flex: 1;
        background: transparent;
        border: none;
        padding: 0.8rem 1.2rem;
        color: rgba(255,255,255,0.88);
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 0.95rem;
        letter-spacing: 0.3px;
        font-style: italic;
      }

      .search-box input::placeholder {
        color: rgba(255,255,255,0.10);
        font-style: italic;
      }

      .search-box input:focus {
        outline: none;
      }

      .search-box .btn-primary {
        border-radius: 0;
        padding: 0.8rem 1.4rem;
        font-size: 0.82rem;
        font-family: 'Bebas Neue', sans-serif;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.05) 100%) !important;
        color: rgba(255,255,255,0.55) !important;
        border: none !important;
        border-left: 1px solid rgba(255,255,255,0.08) !important;
        transition: background 0.2s ease, color 0.2s ease;
      }

      .search-box .btn-primary:hover {
        background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.07) 100%) !important;
        color: var(--primary-color) !important;
        transform: none;
      }

      /* Resultado de busca */
      .book-result {
        display: flex;
        gap: 1.2rem;
        background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%);
        border: 1px solid rgba(255,255,255,0.08);
        padding: 1.1rem 1.3rem;
        border-radius: 12px;
        margin-top: 1rem;
        align-items: center;
        animation: libResultIn 0.32s cubic-bezier(0.22,1,0.36,1) both;
        position: relative;
        overflow: hidden;
      }

      .book-result::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, var(--primary-color), var(--primary-color));
        border-radius: 3px 0 0 3px;
      }

      .book-result img {
        width: 52px;
        height: 76px;
        object-fit: cover;
        border-radius: 4px 8px 8px 4px;
        box-shadow: -3px 3px 12px rgba(0,0,0,0.6), 2px 0 6px rgba(255,255,255,0.07);
        flex-shrink: 0;
      }

      .book-result-info {
        flex: 1;
        min-width: 0;
      }

      .book-result-info h3 {
        color: rgba(255,255,255,0.92);
        font-size: 1rem;
        font-family: 'Georgia', serif;
        font-weight: 700;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.2px;
      }

      .book-result-info p {
        color: rgba(255,255,255,0.25);
        margin-bottom: 0.7rem;
        font-size: 0.82rem;
        font-style: italic;
        font-family: 'Georgia', serif;
      }

      .book-result-info .btn-secondary {
        background: transparent !important;
        border: 1px solid rgba(255,255,255,0.12) !important;
        color: rgba(255,255,255,0.5) !important;
        font-family: 'Bebas Neue', sans-serif !important;
        letter-spacing: 1.5px !important;
        font-size: 0.78rem !important;
        padding: 0.35rem 0.85rem !important;
        border-radius: 6px !important;
        transition: all 0.2s ease !important;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }

      .book-result-info .btn-secondary:hover {
        background: rgba(255,255,255,0.06) !important;
        border-color: rgba(255,255,255,0.28) !important;
        color: var(--primary-color) !important;
      }
      
      /* ── SHELF / GRID ── */
      .library-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1.8rem 1.4rem;
        margin-top: 0.5rem;
        padding: 0.5rem 0.25rem 1rem;
        perspective: 800px;
      }

      /* ── BOOK CARD — prateleira editorial ── */
      .book-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        text-align: center;
        cursor: default;
        animation: libBookIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        animation-delay: calc(var(--i, 0) * 0.05s);
      }

      .book-card::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 10%;
        right: 10%;
        height: 8px;
        background: rgba(0,0,0,0.35);
        filter: blur(6px);
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .book-card:hover::after {
        bottom: -14px;
        left: 5%;
        right: 5%;
        opacity: 0.5;
      }

      /* Capa do livro com efeito 3D */
      .book-cover {
        width: 100%;
        max-width: 110px;
        height: 155px;
        object-fit: cover;
        border-radius: 2px 8px 8px 2px;
        margin-bottom: 0.75rem;
        box-shadow:
          -4px 0 0 0 rgba(0,0,0,0.5),
          -5px 2px 0 0 rgba(0,0,0,0.3),
          0 8px 24px rgba(0,0,0,0.6),
          2px 0 8px rgba(255,255,255,0.04);
        transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
        transform-origin: left center;
        display: block;
      }

      .book-card:hover .book-cover {
        transform: scale(1.06) rotate(-1deg) translateX(3px);
        box-shadow:
          -6px 0 0 0 rgba(0,0,0,0.55),
          -7px 3px 0 0 rgba(0,0,0,0.3),
          0 16px 36px rgba(0,0,0,0.7),
          4px 0 16px rgba(255,255,255,0.07);
      }

      .book-card.completed .book-cover {
        box-shadow:
          -4px 0 0 0 rgba(0,0,0,0.5),
          -5px 2px 0 0 rgba(0,0,0,0.3),
          0 8px 24px rgba(0,0,0,0.5),
          0 0 0 2px rgba(255,255,255,0.14),
          2px 0 12px rgba(255,255,255,0.08);
      }

      /* Badge "lido" */
      .book-card.completed::before {
        content: '✓';
        position: absolute;
        top: 6px;
        right: 4px;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-color));
        color: #0a0a14;
        font-size: 11px;
        font-weight: 900;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
        box-shadow: 0 2px 8px rgba(255,255,255,0.14);
        line-height: 20px;
        text-align: center;
      }

      .book-title {
        color: rgba(255,255,255,0.85);
        font-size: 0.78rem;
        font-family: 'Georgia', serif;
        font-weight: 700;
        line-height: 1.3;
        margin-bottom: 0.2rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        letter-spacing: 0.1px;
        width: 100%;
      }

      .book-author {
        color: rgba(255,255,255,0.18);
        font-size: 0.72rem;
        font-style: italic;
        font-family: 'Georgia', serif;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        width: 100%;
      }

      /* Botões de ação */
      .book-remove-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(10,10,15,0.85);
        color: rgba(239,68,68,0.7);
        border: 1px solid rgba(239,68,68,0.2);
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s, color 0.2s;
        z-index: 10;
      }

      .book-status-btn {
        position: absolute;
        top: 4px;
        left: 4px;
        background: rgba(10,10,15,0.85);
        color: rgba(255,255,255,0.18);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s;
        z-index: 10;
      }

      .book-status-btn.completed {
        color: var(--primary-color);
        border-color: rgba(255,255,255,0.18);
        background: rgba(10,10,15,0.9);
        opacity: 1;
      }

      .book-card:hover .book-remove-btn,
      .book-card:hover .book-status-btn {
        opacity: 1;
      }

      .book-remove-btn:hover {
        background: rgba(239,68,68,0.2);
        color: #ef4444;
        border-color: rgba(239,68,68,0.5);
      }

      .book-status-btn:hover {
        background: rgba(255,255,255,0.07);
        color: var(--primary-color);
        transform: scale(1.15);
      }

      /* ═══════════════════════════════════════════════════
         DASHBOARD
         ═══════════════════════════════════════════════════ */

      @keyframes dbFadeUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes dbStagger {
        from { opacity: 0; transform: translateX(-10px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes dbGlowOrb {
        0%, 100% { opacity: 0.25; }
        50%       { opacity: 0.5; }
      }

      .db-wrap {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        opacity: 0;
        transition: opacity 0.4s ease;
        max-width: 1100px;
        margin: 0 auto;
        width: 100%;
      }
      .db-wrap.db-visible { opacity: 1; }

      /* ── ONBOARDING ── */
      .db-onboard-wrap {
        display: flex; align-items: center; justify-content: center;
        min-height: calc(100vh - 8rem);
        opacity: 0; transition: opacity 0.5s ease;
      }
      .db-onboard-wrap.db-visible { opacity: 1; }

      .db-onboard-card {
        background: linear-gradient(145deg, rgba(14,14,20,0.97) 0%, rgba(10,10,16,0.99) 100%);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 24px;
        padding: 3rem 3.5rem;
        max-width: 500px; width: 100%;
        position: relative; overflow: hidden;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      }

      .db-onboard-glow {
        position: absolute; top: -60px; left: 50%;
        transform: translateX(-50%);
        width: 260px; height: 260px;
        background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
        opacity: 0.07;
        animation: dbGlowOrb 3s ease-in-out infinite;
        pointer-events: none;
      }

      .db-onboard-step {
        display: flex; flex-direction: column; align-items: center; gap: 1.1rem;
        animation: dbFadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both;
      }

      .db-onboard-icon {
        width: 68px; height: 68px; border-radius: 18px;
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.07);
        display: flex; align-items: center; justify-content: center;
        color: var(--primary-color);
      }

      .db-onboard-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.9rem; letter-spacing: 2px;
        color: #fff; text-align: center; margin: 0;
      }

      .db-onboard-sub {
        color: rgba(255,255,255,0.38); text-align: center;
        font-size: 0.88rem; line-height: 1.5; margin: 0;
      }

      .db-onboard-textarea {
        width: 100%; background: rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
        padding: 0.85rem 1rem; color: rgba(255,255,255,0.88);
        font-family: 'Rajdhani', sans-serif; font-size: 1rem;
        resize: none; box-sizing: border-box; line-height: 1.5;
        transition: border-color 0.2s;
      }
      .db-onboard-textarea:focus { outline: none; border-color: var(--primary-color); }

      .db-onboard-input {
        width: 100%; background: rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
        padding: 0.75rem 1rem; color: rgba(255,255,255,0.88);
        font-family: 'Rajdhani', sans-serif; font-size: 1rem;
        box-sizing: border-box; transition: border-color 0.2s;
      }
      .db-onboard-input:focus { outline: none; border-color: var(--primary-color); }

      .db-onboard-row { width: 100%; }

      .db-score-row {
        width: 100%; display: flex; flex-direction: column; gap: 0.6rem;
      }
      .db-score-display {
        display: flex; align-items: baseline; gap: 0.4rem;
        justify-content: center;
      }
      .db-score-big {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3rem; color: var(--primary-color); line-height: 1;
      }
      .db-score-unit {
        font-size: 0.85rem; color: rgba(255,255,255,0.35);
        font-family: 'Rajdhani', sans-serif;
      }
      .db-score-range {
        width: 100%; accent-color: var(--primary-color); cursor: pointer;
      }
      .db-score-ticks {
        display: flex; justify-content: space-between;
        font-size: 0.72rem; color: rgba(255,255,255,0.25);
        font-family: 'Rajdhani', sans-serif;
      }

      .db-date-selects { display: flex; gap: 0.6rem; width: 100%; }
      .db-date-select {
        flex: 1; background: rgba(0,0,0,0.35);
        border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
        padding: 0.75rem 0.6rem; color: rgba(255,255,255,0.88);
        font-family: 'Rajdhani', sans-serif; font-size: 1rem;
        cursor: pointer; appearance: none; text-align: center;
        transition: border-color 0.2s;
      }
      .db-date-select:focus { outline: none; border-color: var(--primary-color); }
      .db-date-select option { background: #0e0e14; color: rgba(255,255,255,0.88); }

      .db-onboard-btn {
        display: flex; align-items: center; gap: 0.5rem;
        background: var(--primary-color); color: #000;
        border: none; border-radius: 12px;
        padding: 0.75rem 2rem;
        font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 1.5px;
        cursor: pointer; transition: opacity 0.2s, transform 0.2s;
        margin-top: 0.4rem;
      }
      .db-onboard-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.03); }
      .db-onboard-btn:disabled { opacity: 0.25; cursor: not-allowed; }

      .db-onboard-btn-ghost {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.4); border-radius: 10px;
        padding: 0.6rem 1.2rem;
        font-family: 'Rajdhani', sans-serif; font-size: 0.9rem;
        cursor: pointer; transition: all 0.2s;
      }
      .db-onboard-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

      .db-onboard-nav {
        width: 100%; display: flex; justify-content: space-between;
        align-items: center; margin-top: 0.3rem;
      }

      .db-onboard-dots {
        display: flex; gap: 0.4rem; justify-content: center; margin-top: 1.5rem;
      }
      .db-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: rgba(255,255,255,0.14); transition: all 0.2s;
      }
      .db-dot-active { background: var(--primary-color); width: 20px; border-radius: 3px; }

      /* ── OBJECTIVE HERO CARD ── */
      .db-objective-card {
        background: linear-gradient(145deg, rgba(14,14,20,0.97) 0%, rgba(10,10,16,0.99) 100%);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 24px;
        padding: 3.5rem 3.5rem 2.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        position: relative; overflow: hidden;
        animation: dbFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        box-shadow: 0 12px 60px rgba(0,0,0,0.55);
        text-align: center;
      }
      .db-objective-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        opacity: 0.55;
      }
      .db-objective-bg {
        position: absolute; inset: 0; pointer-events: none;
      }

      .db-objective-body {
        display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
        width: 100%; position: relative;
      }

      .db-objective-left { flex: 1; min-width: 0; position: relative; }

      .db-objective-label {
        display: inline-flex; align-items: center; gap: 0.4rem;
        font-family: 'Rajdhani', sans-serif; font-size: 0.78rem;
        text-transform: uppercase; letter-spacing: 2px;
        color: rgba(255,255,255,0.3); margin-bottom: 0.4rem;
        justify-content: center;
      }

      .db-edit-btn {
        background: transparent; border: none;
        color: rgba(255,255,255,0.2); cursor: pointer;
        padding: 0.1rem; border-radius: 4px;
        display: flex; align-items: center;
        transition: color 0.2s;
      }
      .db-edit-btn:hover { color: rgba(255,255,255,0.6); }

      .db-objective-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 4rem; letter-spacing: 4px;
        color: #fff; margin: 0 0 0.3rem; line-height: 1;
      }

      .db-objective-desc {
        color: rgba(255,255,255,0.45); font-size: 1rem;
        margin: 0 0 0.9rem; line-height: 1.6;
        max-width: 640px;
      }

      .db-objective-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }

      .db-pill {
        display: inline-flex; align-items: center; gap: 0.4rem;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px; padding: 0.35rem 1rem;
        font-size: 0.82rem; font-family: 'Rajdhani', sans-serif;
        color: rgba(255,255,255,0.5); letter-spacing: 0.5px;
        transition: all 0.2s;
      }

      /* ── PROGRESS BAR ── */
      .db-progress-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        margin-top: 0.5rem;
      }
      .db-progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .db-progress-label {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 1.8px;
        color: rgba(255,255,255,0.28);
      }
      .db-progress-pct {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        letter-spacing: 2px;
        line-height: 1;
      }
      .db-progress-track {
        width: 100%;
        height: 12px;
        background: var(--bg-card);
        border-radius: 6px;
        overflow: hidden;
      }
      .db-progress-fill {
        height: 100%;
        border-radius: 6px;
        transition: width 0.9s cubic-bezier(0.22,1,0.36,1);
        min-width: 6px;
      }

      /* ── META DO DIA ── */
      .db-today-card {
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;
        padding: 1.1rem 1.3rem;
        display: flex; flex-direction: column; gap: 0.7rem;
        animation: dbFadeUp 0.4s 0.08s cubic-bezier(0.22,1,0.36,1) both;
      }
      .db-today-header { display: flex; align-items: center; justify-content: space-between; }
      .db-today-left {
        display: flex; align-items: center; gap: 0.5rem;
        color: rgba(255,255,255,0.45); font-family: 'Rajdhani', sans-serif;
        font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.5px;
      }
      .db-today-frac {
        font-family: 'Bebas Neue', sans-serif; font-size: 1.15rem;
        color: rgba(255,255,255,0.6); letter-spacing: 1px;
      }
      .db-today-sep { color: rgba(255,255,255,0.25); }
      .db-today-track {
        height: 6px; background: var(--bg-card);
        border-radius: 3px; overflow: hidden;
      }
      .db-today-fill {
        height: 100%; border-radius: 3px;
        transition: width 0.9s cubic-bezier(0.22,1,0.36,1); min-width: 4px;
      }
      .db-today-done {
        display: flex; align-items: center; gap: 0.4rem;
        font-size: 0.8rem; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.3px;
      }

      /* ── STAT CARDS ── */
      .db-stats-grid {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem;
      }
      .db-stat-card {
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;
        padding: 1rem 1.1rem; display: flex; align-items: center; gap: 0.8rem;
        animation: dbStagger 0.4s calc(var(--i, 0) * 0.06s + 0.12s) cubic-bezier(0.22,1,0.36,1) both;
        transition: background 0.2s, border-color 0.2s, transform 0.2s;
      }
      .db-stat-card:hover {
        background: var(--bg-card);
        border-color: rgba(255,255,255,0.1); transform: translateY(-2px);
      }
      .db-stat-icon {
        width: 36px; height: 36px; border-radius: 10px;
        background: var(--bg-card); border: 1px solid var(--border-subtle);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .db-stat-body { display: flex; flex-direction: column; gap: 0.05rem; min-width: 0; }
      .db-stat-val {
        font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem;
        color: #fff; line-height: 1; letter-spacing: 1px;
      }
      .db-stat-lbl {
        font-size: 0.7rem; color: rgba(255,255,255,0.3);
        text-transform: uppercase; letter-spacing: 0.5px;
        font-family: 'Rajdhani', sans-serif;
      }

      /* ── MATÉRIAS ── */
      .db-subjects-section {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06); border-radius: 16px;
        padding: 1.2rem 1.4rem; display: flex; flex-direction: column; gap: 0.9rem;
        animation: dbFadeUp 0.4s 0.25s cubic-bezier(0.22,1,0.36,1) both;
      }
      .db-section-title {
        display: flex; align-items: center; gap: 0.5rem;
        font-family: 'Rajdhani', sans-serif; font-size: 0.75rem;
        text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.28);
      }
      .db-subjects-list { display: flex; flex-direction: column; gap: 0.6rem; }
      .db-subject-row {
        display: flex; align-items: center; gap: 0.7rem;
        animation: dbStagger 0.32s calc(var(--i, 0) * 0.04s) cubic-bezier(0.22,1,0.36,1) both;
      }
      .db-subject-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .db-subject-name {
        font-size: 0.86rem; color: rgba(255,255,255,0.6);
        font-family: 'Rajdhani', sans-serif;
        min-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .db-subject-hours {
        font-family: 'Bebas Neue', sans-serif; font-size: 0.88rem;
        color: rgba(255,255,255,0.35); letter-spacing: 0.5px;
        flex-shrink: 0; width: 36px; text-align: right;
      }
      .db-subject-bar-wrap {
        flex: 1; height: 4px; background: var(--bg-card);
        border-radius: 2px; overflow: hidden;
      }
      .db-subject-bar {
        height: 100%; border-radius: 2px;
        transition: width 0.9s cubic-bezier(0.22,1,0.36,1); min-width: 3px;
      }

      @media (max-width: 680px) {
        .db-objective-title { font-size: 2.6rem; }
        .db-onboard-card { padding: 2rem 1.5rem; }
      }

      
      /* TOOLS (FERRAMENTAS) STYLES */
      .tool-card-neutral {
        border-color: var(--border-subtle) !important;
        background: var(--bg-card) !important;
      }

      .tool-card-neutral:hover {
        border-color: rgba(255, 255, 255, 0.25) !important;
      }

      .tool-card-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        text-align: center;
        width: 100%;
      }

      .tool-card-inner .subject-app-name {
        margin-bottom: 0;
      }

      .tools-container {
        max-width: 1600px;
        margin: 0 auto;
      }

      .tools-header {
        margin-bottom: 3rem;
      }

      .tools-header-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 16px;
      }

      .tools-header-content h1 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.5rem;
        letter-spacing: 2px;
        color: #fff;
        margin: 0;
      }

      .tools-header-content p {
        color: var(--text-muted);
        font-size: 1rem;
        margin: 0.3rem 0 0 0;
      }

      .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .tool-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 12px;
        padding: 2rem;
        cursor: pointer;
        transition: all 0.3s;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .tool-card:hover:not(.disabled) {
        transform: translateY(-5px);
        border-color: var(--primary-color);
        background: var(--bg-card);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      .tool-card.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tool-icon-wrapper {
        width: 70px;
        height: 70px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid;
        transition: all 0.3s;
      }

      .tool-card:hover:not(.disabled) .tool-icon-wrapper {
        transform: scale(1.1);
      }

      .tool-info h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 1px;
        color: #fff;
        margin: 0 0 0.5rem 0;
      }

      .tool-info p {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin: 0;
        line-height: 1.4;
      }

      .tool-badge {
        display: inline-block;
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-muted);
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .tools-footer {
        text-align: center;
        padding: 2rem;
        color: var(--text-muted);
        font-size: 0.95rem;
      }

      .tools-app-view {
        animation: fadeIn 0.3s ease;
      }

      .tools-back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
        padding: 0.8rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 2rem;
        transition: all 0.2s;
      }

      .tools-back-btn:hover {
        background: var(--bg-card);
        border-color: var(--primary-color);
        color: #fff;
        transform: translateX(-5px);
      }

      .tool-coming-soon {
        text-align: center;
        padding: 5rem 2rem;
        color: var(--text-muted);
        font-size: 1.2rem;
        background: var(--bg-card);
        border: 1px dashed var(--border-subtle);
        border-radius: 12px;
      }

      /* MANGA TRACKER STYLES */
      .manga-tracker-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      .manga-card {
        background: linear-gradient(145deg, rgba(14,14,20,0.95) 0%, rgba(10,10,15,0.98) 100%);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 18px;
        padding: 1.4rem 1.6rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 8px 40px rgba(0,0,0,0.4);
      }

      .manga-card::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
        opacity: 0.55;
        pointer-events: none;
      }

      .manga-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
        pointer-events: none;
      }

      .manga-list-card {
        margin-top: 1rem;
      }

      /* library-card overrides handled in BIBLIOTECA block above */

      .manga-list-header {
        border: none;
        padding-bottom: 0;
        margin-bottom: 0.75rem;
      }

      .manga-add-section {
        margin-top: 0.75rem;
      }

      .manga-input-group {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .manga-input-title {
        flex: 1;
        min-width: 180px;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        padding: 0.55rem 0.85rem;
        border-radius: 8px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
      }

      .manga-input-title:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .manga-input-chapter {
        width: 80px;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        padding: 0.55rem 0.5rem;
        border-radius: 8px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
        text-align: center;
      }

      .manga-input-chapter:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .manga-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
      }

      .manga-item {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        min-height: 150px;
        gap: 1rem;
        transition: all 0.2s;
      }

      .manga-item:hover {
        background: var(--bg-card);
        border-color: var(--primary-color);
        transform: translateY(-2px);
      }

      .manga-item.completed {
        opacity: 0.6;
        border-color: var(--success);
      }

      .manga-item.completed .manga-title {
        text-decoration: line-through;
        color: var(--text-muted);
      }

      .manga-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .manga-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #fff;
        transition: color 0.2s;
      }

      .manga-chapter-display {
        font-size: 0.95rem;
        color: var(--text-muted);
      }

      .manga-chapter-display strong {
        color: var(--primary-color);
        font-size: 1.1rem;
      }

      .manga-controls {
        display: flex;
        gap: 0.65rem;
        align-items: center;
        justify-content: flex-end;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .manga-chapter-btn {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .manga-chapter-btn:hover:not(:disabled) {
        background: var(--primary-color);
        border-color: var(--primary-color);
        transform: scale(1.1);
      }

      .manga-chapter-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .manga-action-btn {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
      }

      .manga-action-btn:hover {
        transform: scale(1.1);
      }

      .manga-action-btn.edit:hover {
        background: #3b82f6;
        border-color: #3b82f6;
      }

      .manga-action-btn.delete:hover {
        background: #ef4444;
        border-color: #ef4444;
      }

      .manga-action-btn.save:hover {
        background: var(--success);
        border-color: var(--success);
      }

      .manga-action-btn.cancel:hover {
        background: #6b7280;
        border-color: #6b7280;
      }

      .manga-edit-mode {
        display: flex;
        gap: 0.75rem;
        width: 100%;
        align-items: center;
        flex-wrap: wrap;
      }

      .manga-edit-input {
        flex: 1;
        background: var(--bg-input);
        border: 1px solid var(--primary-color);
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
      }

      .manga-edit-input:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--primary-glow);
      }

      .manga-edit-chapter {
        width: 80px;
        background: var(--bg-input);
        border: 1px solid var(--primary-color);
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
        text-align: center;
      }

      .manga-edit-chapter:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--primary-glow);
      }

      @media (max-width: 768px) {
        .manga-card {
          padding: 1.25rem;
        }

        .manga-input-title {
          min-width: 100%;
        }

        .manga-input-chapter,
        .manga-input-group .btn-primary {
          width: 100%;
        }

        .manga-list {
          grid-template-columns: 1fr;
        }
      }
      
      /* Exam Tracker Styles */
      .exam-tracker-container {
        max-width: 1400px;
        margin: 0 auto;
      }

      .exam-tracker-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .exam-tracker-header svg {
        color: var(--primary-color);
        flex-shrink: 0;
        width: 20px;
        height: 20px;
      }

      .exam-tracker-header h2 {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
        letter-spacing: 0.5px;
      }

      .exam-tracker-header p {
        color: var(--text-muted);
        margin: 0;
        font-size: 0.8rem;
      }

      .exam-tabs {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 1rem;
      }

      .exam-tab {
        flex: 1;
        padding: 0.5rem 0.75rem;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        color: var(--text-muted);
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        letter-spacing: 0.5px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .exam-tab:hover {
        background: var(--bg-card);
        border-color: var(--primary-color);
      }

      .exam-tab.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: #fff;
        box-shadow: 0 2px 10px var(--primary-glow-subtle);
      }

      .exam-add-button {
        width: 100%;
        padding: 0.6rem 1rem;
        background: transparent;
        border: 1px dashed var(--border-subtle);
        border-radius: 8px;
        color: var(--primary-color);
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 0.75rem;
      }

      .exam-add-button:hover {
        background: var(--bg-card);
        border-color: var(--primary-color);
      }

      .exam-form {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 1.25rem;
        margin-bottom: 2rem;
      }

      .exam-form h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.8rem;
        color: #fff;
        margin-bottom: 1.5rem;
        letter-spacing: 1px;
      }

      .exam-form-group {
        margin-bottom: 1.5rem;
      }

      .exam-form-group label {
        display: block;
        font-weight: 600;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .exam-form-group input {
        width: 100%;
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        padding: 0.9rem 1rem;
        border-radius: 8px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        transition: all 0.2s;
      }

      .exam-form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px var(--primary-glow);
      }

      .exam-form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .exam-form-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      .exam-btn-cancel,
      .exam-btn-save {
        padding: 0.9rem 2rem;
        border-radius: 8px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        font-size: 1.05rem;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .exam-btn-cancel {
        background: var(--bg-card);
        color: var(--text-secondary);
        border: 1px solid var(--border-subtle);
      }

      .exam-btn-cancel:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--text-muted);
      }

      .exam-btn-save {
        background: var(--primary-color);
        color: ${btnTextColor};
        box-shadow: 0 2px 10px var(--primary-glow);
      }

      .exam-btn-save:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px var(--primary-glow);
      }

      .exam-results-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.6rem;
      }

      @media (max-width: 1100px) {
        .exam-results-list {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 650px) {
        .exam-results-list {
          grid-template-columns: 1fr;
        }
      }

      .exam-result-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        transition: all 0.2s;
      }

      .exam-result-card:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      }

      .exam-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .exam-result-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .exam-result-title svg {
        color: var(--primary-color);
        width: 16px;
        height: 16px;
      }

      .exam-result-title h4 {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: #fff;
        margin: 0;
        letter-spacing: 0.5px;
      }

      .exam-delete-btn {
        background: transparent;
        border: none;
        color: rgba(239, 68, 68, 0.5);
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .exam-delete-btn:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
      }

      .exam-result-stats {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.4rem;
        margin-bottom: 0.5rem;
        overflow-x: auto;
      }

      .exam-stat-item {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        padding: 0.3rem 0.6rem;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        gap: 0.4rem;
      }

      .exam-stat-label {
        font-size: 0.78rem;
        color: var(--text-muted);
        font-weight: 600;
        white-space: nowrap;
      }

      .exam-stat-value {
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.95rem;
        font-weight: 700;
        color: #fff;
        white-space: nowrap;
      }

      .exam-percentage {
        font-size: 0.78rem;
        color: var(--primary-color);
        font-weight: 700;
        white-space: nowrap;
      }

      .exam-result-total {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.35rem 0.6rem;
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 6px;
      }

      .exam-total-score {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        color: #fff;
      }

      .exam-total-score svg {
        color: var(--primary-color);
        width: 14px;
        height: 14px;
        flex-shrink: 0;
      }

      .exam-redacao {
        margin-left: auto;
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
      }

      .exam-empty-state {
        text-align: center;
        padding: 3rem 2rem;
        color: var(--text-muted);
      }

      .exam-empty-state svg {
        color: var(--primary-color);
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      .exam-empty-state p {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.3rem;
        color: #fff;
        margin-bottom: 0.4rem;
        letter-spacing: 1px;
      }

      .exam-empty-state small {
        font-size: 0.9rem;
        color: var(--text-muted);
      }
      /* Custom Exam Styles */
      .custom-exam-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .custom-exam-toolbar {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .custom-exam-dropdown-wrapper {
        position: relative;
        flex: 1;
        min-width: 180px;
      }

      .custom-exam-dropdown-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 0.65rem 1rem;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95rem;
        gap: 0.5rem;
      }

      .custom-exam-dropdown-btn:hover {
        background: rgba(255,255,255,0.09);
        border-color: rgba(255,255,255,0.2);
      }

      .custom-exam-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        background: rgba(18,18,28,0.97);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        overflow: hidden;
        z-index: 100;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }

      .custom-exam-dropdown-empty {
        padding: 0.9rem 1rem;
        color: var(--text-muted);
        font-size: 0.9rem;
        text-align: center;
      }

      .custom-exam-dropdown-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.7rem 1rem;
        cursor: pointer;
        transition: background 0.15s ease;
        font-size: 0.95rem;
        gap: 0.5rem;
      }

      .custom-exam-dropdown-item:hover {
        background: rgba(255,255,255,0.07);
      }

      .custom-exam-dropdown-item.active {
        background: rgba(255,255,255,0.1);
        color: var(--primary-color);
      }

      .custom-exam-dropdown-delete {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 3px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        opacity: 0.6;
        transition: all 0.15s;
        flex-shrink: 0;
      }

      .custom-exam-dropdown-delete:hover {
        color: #ff6b6b;
        opacity: 1;
        background: rgba(255,100,100,0.1);
      }

      .custom-exam-new-model-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255,255,255,0.06);
        border: 1px solid var(--border-subtle);
        border-radius: 10px;
        padding: 0.65rem 1rem;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        white-space: nowrap;
        transition: all 0.2s ease;
      }

      .custom-exam-new-model-btn:hover {
        background: rgba(255,255,255,0.1);
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      /* Modal */
      .custom-exam-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(6px);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }

      .custom-exam-modal {
        background: rgba(18,18,30,0.98);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        padding: 1.75rem;
        width: 100%;
        max-width: 520px;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      }

      .custom-exam-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }

      .custom-exam-modal-header h3 {
        font-family: 'Rajdhani', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
      }

      .custom-exam-modal-close {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        display: flex;
        transition: color 0.2s;
      }

      .custom-exam-modal-close:hover {
        color: var(--text-primary);
      }

      .custom-exam-sections-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 1.25rem 0 0.75rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .custom-exam-add-section-btn {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        background: transparent;
        border: 1px solid var(--border-subtle);
        border-radius: 7px;
        padding: 0.3rem 0.65rem;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 0.82rem;
        font-weight: 600;
        transition: all 0.2s;
      }

      .custom-exam-add-section-btn:hover {
        background: rgba(255,255,255,0.06);
      }

      .custom-exam-sections-list {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .custom-exam-section-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .custom-exam-section-row input[type=text] {
        flex: 2;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 0.55rem 0.75rem;
        color: var(--text-primary);
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
      }

      .custom-exam-section-row input[type=number] {
        flex: 1;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        padding: 0.55rem 0.75rem;
        color: var(--text-primary);
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s;
        min-width: 0;
      }

      .custom-exam-section-row input:focus {
        border-color: var(--primary-color);
      }

      .custom-exam-remove-section-btn {
        background: transparent;
        border: 1px solid var(--border-subtle);
        border-radius: 7px;
        color: var(--text-muted);
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        transition: all 0.15s;
        flex-shrink: 0;
      }

      .custom-exam-remove-section-btn:hover {
        color: #ff6b6b;
        border-color: #ff6b6b;
        background: rgba(255,100,100,0.08);
      }

      @media (max-width: 768px) {
        .exam-form-grid {
          grid-template-columns: 1fr;
        }

        .exam-result-stats {
          grid-template-columns: 1fr;
        }
      }
      
      /* Settings Styles */
      .settings-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .config-section h3 {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 1rem;
        letter-spacing: 1px;
      }
      
      .config-desc {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
      }
      
      .file-input-wrapper {
        position: relative;
        display: inline-block;
      }
      
      .hidden-input {
        display: none;
      }
      
      .action-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      /* Color Picker Input */
      .color-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      
      input[type="color"] {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        background: none;
        border: 0;
        cursor: pointer;
        width: 50px;
        height: 50px;
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
      }
      
      input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      
      input[type="color"]::-webkit-color-swatch {
        border: 2px solid var(--border-subtle);
        border-radius: 8px;
      }
      
      /* Radio Group Styles */
      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        margin-bottom: 1.5rem;
      }
      
      .radio-option {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        cursor: pointer;
        padding: 0.8rem;
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--border-subtle);
        border-radius: 8px;
        transition: all 0.2s;
      }
      
      .radio-option:hover {
        background: var(--bg-card);
        border-color: rgba(255,255,255,0.2);
      }
      
      .radio-option.selected {
        background: rgba(255,255,255,0.08);
        border-color: var(--primary-color);
        box-shadow: 0 0 10px var(--primary-glow-subtle);
      }
      
      .radio-circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      
      .radio-option.selected .radio-circle {
        border-color: var(--primary-color);
      }
      
      .radio-inner {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--primary-color);
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s;
      }
      
      .radio-option.selected .radio-inner {
        opacity: 1;
        transform: scale(1);
      }
      
      .radio-label {
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
      }
      
      /* ACHIEVEMENTS GRID */
      .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }
      
      .achievement-card {
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 1.5rem;
        display: flex;
        gap: 1.2rem;
        align-items: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .achievement-card::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
        pointer-events: none;
      }

      .achievement-card.unlocked {
        background: rgba(255,255,255,0.035);
        border-color: rgba(255,255,255,0.1);
      }

      .achievement-card.unlocked:hover {
        transform: translateY(-3px);
        border-color: rgba(255,255,255,0.18);
        box-shadow: 0 8px 28px rgba(0,0,0,0.4);
        background: var(--bg-card);
      }

      .achievement-card.locked {
        opacity: 0.4;
        filter: grayscale(1);
      }

      .achievement-icon-box {
        width: 60px;
        height: 60px;
        border-radius: 14px;
        background: rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid rgba(255,255,255,0.06);
        transition: all 0.3s ease;
      }

      .achievement-card.unlocked .achievement-icon-box {
        background: rgba(255,255,255,0.06);
        border-color: var(--primary-color);
        box-shadow: 0 0 16px var(--primary-glow-subtle);
      }
      
      .achievement-content {
        flex: 1;
      }
      
      .achievement-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.4rem;
        color: #fff;
        letter-spacing: 1px;
        margin-bottom: 0.2rem;
      }
      
      .achievement-desc {
        color: var(--text-muted);
        font-size: 0.9rem;
        line-height: 1.4;
      }
      
      .achievement-status {
        position: absolute;
        top: 10px;
        right: 10px;
      }
      
      .progress-section {
        margin-bottom: 2rem;
        text-align: center;
        padding: 2rem;
        background: rgba(255,255,255,0.025);
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.07);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      }
      
      .next-rank-info {
        color: var(--text-muted);
        margin-bottom: 1rem;
        font-size: 1rem;
      }
      
      .next-rank-title {
        color: var(--primary-color);
        font-weight: 700;
        text-transform: uppercase;
      }

      @media (max-width: 1024px) {
        .stats-charts-row {
          grid-template-columns: 1fr 1fr;
        }
        .stats-chart-card--wide {
          grid-column: 1 / -1;
        }
        .badges-container {
           position: relative;
           width: 100%;
           justify-content: center;
           margin-top: 1rem;
        }
      }

      @media (max-width: 768px) {
        .tabs {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          top: auto;
          transform: none;
          flex-direction: row;
          justify-content: space-around;
          padding: 0.75rem 0.5rem;
          border-radius: 0;
          border-right: none;
          border-top: 1px solid var(--border-subtle);
          background: rgba(9, 9, 11, 0.95);
        }
        
        .tab {
          width: auto;
          height: auto;
          padding: 0.4rem 0.5rem;
        }

        .tab::after {
          display: none;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: row;
          flex: 1;
          padding: 0;
          gap: 0;
          align-items: stretch;
          min-width: 0;
        }

        .sidebar-bottom {
          display: flex;
          flex-direction: row;
          border-top: none;
          padding: 0;
          gap: 0;
          align-items: stretch;
        }

        .sidebar-logo {
          display: none;
        }

        .content {
          padding: 2rem 1rem 6rem 1rem;
        }

        .tab-panel {
          padding: 1.25rem 1rem;
          border-radius: 14px;
        }

        .music-player-panel {
          top: auto;
          bottom: 4.5rem;
          left: 1rem;
          right: 1rem;
          width: auto;
          max-width: calc(100% - 2rem);
        }

        .music-prompt-modal {
          margin: 1rem;
          padding: 2rem;
        }

        .music-prompt-buttons {
          flex-direction: column;
        }

        .music-prompt-buttons button {
          max-width: 100%;
        }

        .pomodoro-container {
          width: 90%;
          min-height: unset;
        }

        .pomodoro-panel {
          padding: 1.5rem 1.25rem 2rem;
          margin: 1rem auto;
          width: calc(100% - 2rem);
        }
        
        .timer-circle {
          width: 260px;
          height: 260px;
        }
        
        .time-text {
          font-size: 4rem;
        }

        .timer-header h2 {
          font-size: 2rem;
        }

        .btn-primary, .btn-secondary, .btn-danger {
          font-size: 1.2rem;
          padding: 0.85rem 1.75rem;
          min-width: 130px;
        }
        
        .calendar-grid {
           gap: 0.5rem;
        }
        
        .day-number {
           font-size: 0.8rem;
           top: 4px;
           left: 6px;
        }
        
        .day-total-mini {
           font-size: 1rem;
        }
        
        .time-config-row {
           flex-direction: row;
           gap: 2rem;
        }
        
        .secondary-grid {
          grid-template-columns: 1fr;
        }
        
        /* Mobile adjust for tree */
        .tree-level-1 {
           margin-left: 1rem;
        }
        .add-subject-wrapper {
           padding: 0.5rem 0.5rem 0.5rem 1rem;
        }
      }

      /* Modal Styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.64);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1rem;
        animation: fadeIn 0.38s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .modal-overlay.modal-closing {
        animation: fadeOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to   { opacity: 0; }
      }

      .modal-content {
        background: #111113;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 14px;
        max-width: 700px;
        width: 100%;
        max-height: 95vh;
        overflow-y: auto;
        box-shadow: 0 32px 60px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.06);
        animation: slideUp 0.42s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .modal-content.modal-content-closing {
        animation: slideDown 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
      }

      @keyframes slideUp {
        from {
          transform: translateY(28px) scale(0.97);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        to {
          transform: translateY(20px) scale(0.97);
          opacity: 0;
        }
      }

      .modal-header {
        padding: 1.1rem 1.5rem 1rem;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-header h2 {
        font-size: 1.7rem;
        font-weight: 900;
        color: var(--primary-color);
        margin: 0;
        letter-spacing: -0.5px;
        text-shadow: 0 0 32px var(--primary-glow-subtle), 0 2px 8px rgba(0,0,0,0.4);
      }

      .modal-close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: all 0.2s;
      }

      .modal-close:hover {
        background: var(--bg-input);
        color: var(--text-primary);
      }

      .modal-body {
        padding: 1.1rem 1.5rem;
      }

      .modal-footer {
        padding: 0.85rem 1.5rem;
        border-top: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        flex-wrap: nowrap;
      }

      .modal-footer .btn-primary,
      .modal-footer .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
      }

      /* Subject Selection Grid */
      .subject-selection-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
      }

      .subject-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.25rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 600;
        font-size: 0.9rem;
        text-align: center;
      }

      .subject-option:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .subject-option span:first-child {
        font-size: 2rem;
      }

      /* Questions Input */
      .questions-input-group {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .question-input-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }

      .modal-label {
        display: block;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.75;
      }

      .color-picker-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .color-option {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.15s ease;
        padding: 0;
        flex-shrink: 0;
      }

      .color-option:hover {
        transform: scale(1.15);
      }

      .color-option.selected {
        border-color: #fff;
        transform: scale(1.15);
        box-shadow: 0 0 0 2px rgba(255,255,255,0.4);
      }

      .color-option.selected::after {
        content: '✓';
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        text-shadow: 0 1px 3px rgba(0,0,0,0.6);
      }

      .modal-section-title {
        display: block;
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: 0.2px;
        margin-bottom: 0.4rem;
      }

      .modal-input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 0.6rem 1rem;
        font-size: 1rem;
        color: #f4f4f5;
        transition: all 0.2s;
        font-weight: 600;
      }

      .modal-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(${r}, ${g}, ${b}, 0.1);
      }

      .accuracy-display {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--bg-input);
        border-radius: 8px;
        text-align: center;
        font-size: 1rem;
        color: var(--text-secondary);
      }

      .accuracy-display strong {
        color: var(--primary);
        font-size: 1.5rem;
        display: block;
        margin-top: 0.25rem;
      }

      @media (max-width: 768px) {
        .stats-kpi-row {
          grid-template-columns: repeat(2, 1fr);
        }
        .stats-charts-row {
          grid-template-columns: 1fr;
        }
        .stats-chart-card--wide {
          grid-column: 1;
        }
        .session-type-switch {
          width: 100%;
          justify-content: center;
        }

        .subject-selection-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .subject-option {
          padding: 1rem 0.75rem;
          font-size: 0.85rem;
        }

        .subject-option span:first-child {
          font-size: 1.75rem;
        }
      }

      /* ================================================ */
      /* TASK MANAGER — redesign completo               */
      /* ================================================ */

      .tm-root {
        padding: 0 2rem 3rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      /* Header */
      .tm-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid var(--border-subtle);
        flex-shrink: 0;
      }

      .tm-header-left {
        display: flex;
        align-items: baseline;
        gap: 1rem;
      }

      .tm-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.2rem;
        letter-spacing: 2px;
        color: #fff;
        margin: 0;
      }

      .tm-global-badge {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      /* Empty state */
      .tm-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 5rem 2rem;
        gap: 0.5rem;
      }

      .tm-empty-icon {
        width: 72px;
        height: 72px;
        border-radius: 20px;
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.2);
        margin-bottom: 0.75rem;
      }

      .tm-empty-title {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.5rem;
        letter-spacing: 1px;
        color: rgba(255,255,255,0.4);
        margin: 0;
      }

      .tm-empty-sub {
        font-size: 0.85rem;
        color: rgba(255,255,255,0.2);
        margin: 0;
      }

      .tab-panel:has(.tm-root) {
        height: calc(100vh - 4rem);
        min-height: unset;
        display: flex;
        flex-direction: column;
        overflow: visible;
      }

      .tm-root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }

      /* Grid */
      .tm-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: calc((100% - 2 * 1rem) / 3);
        gap: 1rem;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 4px;
        margin: -4px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.15) transparent;
        align-content: start;
      }

      .tm-grid::-webkit-scrollbar { width: 4px; }
      .tm-grid::-webkit-scrollbar-track { background: transparent; }
      .tm-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }

      @media (max-width: 1100px) { .tm-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 680px)  { .tm-grid { grid-template-columns: 1fr; } }

      /* Card */
      .tm-card {
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        height: 100%;
        box-sizing: border-box;
      }

      .tm-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 40px rgba(0,0,0,0.35);
        border-color: rgba(255,255,255,0.13);
      }

      /* Faixa colorida no topo */
      .tm-card-stripe {
        height: 4px;
        width: 100%;
        flex-shrink: 0;
      }

      /* Header do card */
      .tm-card-header {
        padding: 0.65rem 1.1rem 0.6rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        position: relative;
      }

      .tm-card-title-row {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 0.25rem;
        text-align: center;
        position: relative;
      }

      .tm-card-name {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 1.45rem;
        letter-spacing: 2px;
        color: #fff;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
        width: 100%;
        text-shadow: 0 2px 12px rgba(0,0,0,0.3);
      }

      .tm-card-actions {
        display: flex;
        gap: 0.15rem;
        opacity: 0;
        transition: opacity 0.15s ease;
        flex-shrink: 0;
        position: absolute;
        top: 0;
        right: 0;
      }

      .tm-card:hover .tm-card-actions {
        opacity: 1;
      }

      .tm-icon-btn {
        width: 26px;
        height: 26px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: rgba(255,255,255,0.35);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.15s, color 0.15s;
      }

      .tm-icon-btn:hover {
        background: rgba(255,255,255,0.08);
        color: #fff;
      }

      .tm-icon-btn-danger:hover {
        background: rgba(239,68,68,0.15);
        color: #ef4444;
      }

      /* Barra de progresso */
      .tm-progress-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .tm-progress-track {
        flex: 1;
        height: 4px;
        background: rgba(255,255,255,0.07);
        border-radius: 2px;
        overflow: hidden;
      }

      .tm-progress-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.45s cubic-bezier(0.4,0,0.2,1);
      }

      .tm-progress-label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.3px;
        flex-shrink: 0;
        font-family: 'Rajdhani', sans-serif;
      }

      /* Chevron */
      .tm-chevron {
        color: rgba(255,255,255,0.2);
        transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), color 0.15s;
        align-self: flex-end;
        position: absolute;
        bottom: 0.9rem;
        right: 1.1rem;
      }

      .tm-chevron-open {
        transform: rotate(180deg);
        color: rgba(255,255,255,0.45);
      }

      @keyframes tmSlideUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Corpo expandido */
      .tm-card-body {
        border-top: 1px solid rgba(255,255,255,0.05);
        padding: 0.85rem 1.1rem 1.1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
        overflow-y: auto;
        min-height: 0;
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.12) transparent;
        animation: tmSlideUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      .tm-card-body::-webkit-scrollbar { width: 3px; }
      .tm-card-body::-webkit-scrollbar-track { background: transparent; }
      .tm-card-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }

      /* Input de nova tarefa */
      .tm-input-row {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
      }

      .tm-task-input {
        flex: 1;
        background: var(--bg-card);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 8px;
        padding: 0.55rem 0.8rem;
        color: var(--text-main);
        font-family: 'Rajdhani', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        transition: border-color 0.18s, background-color 0.18s;
        outline: none;
      }

      .tm-task-input::placeholder { color: rgba(255,255,255,0.18); }
      .tm-task-input:focus {
        border-color: rgba(255,255,255,0.22);
        background: rgba(255,255,255,0.06);
      }

      .tm-add-task-btn {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        border: none;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: opacity 0.15s, transform 0.15s;
        opacity: 0.85;
      }

      .tm-add-task-btn:hover:not(:disabled) { opacity: 1; transform: scale(1.08); }
      .tm-add-task-btn:disabled { opacity: 0.2; cursor: not-allowed; }

      /* Sem tarefas */
      .tm-no-tasks {
        text-align: center;
        padding: 1rem 0 0.5rem;
        color: rgba(255,255,255,0.15);
        font-size: 0.8rem;
        font-style: italic;
        margin: 0;
      }

      /* Lista de tarefas */
      .tm-tasks {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .tm-task {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.45rem 0.5rem;
        border-radius: 7px;
        transition: background-color 0.15s;
      }

      .tm-task:hover { background: var(--bg-card); }

      .tm-task-done .tm-task-label {
        text-decoration: line-through;
        color: rgba(255,255,255,0.22);
      }

      /* Checkbox */
      .tm-checkbox {
        width: 17px;
        height: 17px;
        border: 1.5px solid rgba(255,255,255,0.18);
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: border-color 0.15s, background-color 0.15s;
      }

      .tm-checkbox:hover { border-color: rgba(255,255,255,0.4); }

      /* Título da tarefa */
      .tm-task-label {
        flex: 1;
        font-size: 0.88rem;
        font-weight: 600;
        color: rgba(255,255,255,0.85);
        user-select: none;
        line-height: 1.3;
        cursor: default;
      }

      /* Ações da tarefa */
      .tm-task-actions {
        display: flex;
        gap: 0.1rem;
        opacity: 0;
        transition: opacity 0.15s;
      }

      .tm-task:hover .tm-task-actions { opacity: 1; }

      .tm-task-btn {
        width: 22px;
        height: 22px;
        border-radius: 4px;
        border: none;
        background: transparent;
        color: rgba(255,255,255,0.25);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.15s, color 0.15s;
      }

      .tm-task-btn:hover { background: rgba(255,255,255,0.07); color: #fff; }
      .tm-task-btn-danger:hover { background: rgba(239,68,68,0.12); color: #ef4444; }

      /* Edição inline */
      .tm-name-input,
      .tm-task-edit {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 5px;
        padding: 0.15rem 0.45rem;
        color: var(--text-main);
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        letter-spacing: inherit;
        width: 100%;
        outline: none;
      }

      .tm-name-input:focus, .tm-task-edit:focus {
        border-color: rgba(255,255,255,0.35);
      }

      /* Color picker no modal */
      .tm-color-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.6rem;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
      }

      .tm-color-dot {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
      }

      .tm-color-dot:hover { transform: scale(1.12); }
      .tm-color-dot.selected {
        border-color: #fff;
        box-shadow: 0 0 0 3px rgba(255,255,255,0.12);
        transform: scale(1.08);
      }

      /* Preview de cor no modal */
      .tm-color-preview {
        border: 1px solid;
        border-radius: 10px;
        padding: 0.8rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.25rem;
        transition: border-color 0.2s, background-color 0.2s;
      }

      .tm-color-preview-stripe {
        width: 4px;
        height: 28px;
        border-radius: 2px;
        flex-shrink: 0;
        transition: background-color 0.2s;
      }

      /* Legacy classes (mantidas para compatibilidade) */
      .task-manager-container { padding: 0 2rem 3rem; max-width: 1400px; margin: 0 auto; }
      .task-groups-list { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; align-items: start; }
      .empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); }
      .empty-state h3 { margin: 1rem 0 0.5rem; color: var(--text-main); font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 1px; }
    `}</style>
  );
};

export default CustomStyles;
