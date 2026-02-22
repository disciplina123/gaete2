import React, { useRef } from 'react';
import { Palette, VolumeX, Volume2, Bell, Download, Upload, Trash2, Database, Settings as SettingsIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { ColorMode, BackgroundMode, SidebarLayout } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface SettingsProps {
  onDataImported: () => void;
  primaryColor: string;
  onColorChange: (color: string) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  backgroundMode: BackgroundMode;
  onBackgroundModeChange: (mode: BackgroundMode) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  notificationsEnabled: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  sidebarLayout: SidebarLayout;
  onSidebarLayoutChange: (layout: SidebarLayout) => void;
  containerBgColor: string;
  onContainerBgColorChange: (color: string) => void;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  backgroundMode: BackgroundMode;
  containerBgColor: string;
  // visual preview colors
  previewBg: string;
  previewSidebar: string;
  previewAccent: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Escuro intenso com branco puro',
    primaryColor: '#ffffff',
    backgroundMode: 'solid',
    containerBgColor: '#09090b',
    previewBg: '#09090b',
    previewSidebar: '#111113',
    previewAccent: '#ffffff',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Gradiente animado roxo/azul',
    primaryColor: '#a78bfa',
    backgroundMode: 'aurora',
    containerBgColor: '#1a1035',
    previewBg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    previewSidebar: '#1a1035',
    previewAccent: '#a78bfa',
  },
  {
    id: 'ocean',
    name: 'Oceano',
    description: 'Profundo e sereno em azul',
    primaryColor: '#38bdf8',
    backgroundMode: 'ocean',
    containerBgColor: '#071e33',
    previewBg: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    previewSidebar: '#071e33',
    previewAccent: '#38bdf8',
  },
  {
    id: 'forest',
    name: 'Floresta',
    description: 'Verde natural e orgânico',
    primaryColor: '#4ade80',
    backgroundMode: 'forest',
    containerBgColor: '#071a07',
    previewBg: 'linear-gradient(135deg, #0a1f0a, #0d2b0d)',
    previewSidebar: '#071a07',
    previewAccent: '#4ade80',
  },
  {
    id: 'sunset',
    name: 'Entardecer',
    description: 'Roxo quente com toque rosa',
    primaryColor: '#f472b6',
    backgroundMode: 'sunset',
    containerBgColor: '#1c0b2e',
    previewBg: 'linear-gradient(135deg, #2b1055, #7597de)',
    previewSidebar: '#1c0b2e',
    previewAccent: '#f472b6',
  },
  {
    id: 'space',
    name: 'Espaço',
    description: 'Cosmos sideral com âmbar',
    primaryColor: '#fbbf24',
    backgroundMode: 'space',
    containerBgColor: '#080b18',
    previewBg: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
    previewSidebar: '#080b18',
    previewAccent: '#fbbf24',
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Elegante em tons rosados',
    primaryColor: '#fb7185',
    backgroundMode: 'soft',
    containerBgColor: '#1a0d14',
    previewBg: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    previewSidebar: '#1a0d14',
    previewAccent: '#fb7185',
  },
  {
    id: 'snow',
    name: 'Neve',
    description: 'Frio e cristalino em azul claro',
    primaryColor: '#93c5fd',
    backgroundMode: 'snow',
    containerBgColor: '#080e20',
    previewBg: 'linear-gradient(to bottom, #0a0e27, #1a1a2e)',
    previewSidebar: '#080e20',
    previewAccent: '#93c5fd',
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    description: 'Verde-teal vibrante e neon',
    primaryColor: '#2dd4bf',
    backgroundMode: 'solid',
    containerBgColor: '#030f0e',
    previewBg: '#050e0e',
    previewSidebar: '#030f0e',
    previewAccent: '#2dd4bf',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    description: 'Vermelho intenso e dramático',
    primaryColor: '#f87171',
    backgroundMode: 'solid',
    containerBgColor: '#130404',
    previewBg: '#0d0303',
    previewSidebar: '#130404',
    previewAccent: '#f87171',
  },
  {
    id: 'mosaic',
    name: 'Mosaico',
    description: 'Geométrico com laranja',
    primaryColor: '#fb923c',
    backgroundMode: 'mosaic',
    containerBgColor: '#160a03',
    previewBg: '#09090b',
    previewSidebar: '#160a03',
    previewAccent: '#fb923c',
  },
  {
    id: 'light',
    name: 'Claro',
    description: 'Modo claro minimalista',
    primaryColor: '#6366f1',
    backgroundMode: 'soft',
    containerBgColor: '#dde0f5',
    previewBg: 'linear-gradient(135deg, #f0f0f8, #e8e8f5)',
    previewSidebar: '#d8d8ee',
    previewAccent: '#6366f1',
  },
];

const Settings: React.FC<SettingsProps> = ({ 
  onDataImported, 
  primaryColor, 
  onColorChange,
  colorMode: _colorMode,
  onColorModeChange: _onColorModeChange,
  backgroundMode,
  onBackgroundModeChange,
  volume,
  onVolumeChange,
  notificationsEnabled,
  onNotificationsChange,
  sidebarLayout,
  onSidebarLayoutChange,
  containerBgColor,
  onContainerBgColorChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyTheme = (theme: ThemePreset) => {
    soundService.playAdd();
    onColorChange(theme.primaryColor);
    onBackgroundModeChange(theme.backgroundMode);
    onContainerBgColorChange(theme.containerBgColor);
    storageService.savePrimaryColor(theme.primaryColor);
    storageService.saveBackgroundMode(theme.backgroundMode);
    storageService.saveContainerBgColor(theme.containerBgColor);
  };

  const isActiveTheme = (theme: ThemePreset) =>
    theme.primaryColor === primaryColor &&
    theme.backgroundMode === backgroundMode &&
    theme.containerBgColor === containerBgColor;

  const handleExport = () => {
    const data = storageService.createBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = storageService.restoreBackup(content);
        if (success) {
          alert('Dados restaurados com sucesso! A página será recarregada.');
          onDataImported();
          window.location.reload();
        } else {
          alert('Erro ao restaurar arquivo. Verifique se é um backup válido.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearData = () => {
    if (confirm('TEM CERTEZA? Isso apagará TODAS as suas matérias, sessões e estatísticas permanentemente. Esta ação não pode ser desfeita.')) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  const handleResetColor = () => onColorChange('#ffffff');
  const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      onNotificationsChange(permission === 'granted');
      if (permission !== 'granted') alert('Permissão de notificação negada pelo navegador.');
    } else {
      onNotificationsChange(!notificationsEnabled);
    }
  };

  const backgrounds = [
    { value: 'solid',   label: 'Sólido',      desc: 'Foco total' },
    { value: 'soft',    label: 'Suave',        desc: 'Conforto visual' },
    { value: 'ocean',   label: 'Oceano',       desc: 'Animado' },
    { value: 'sunset',  label: 'Entardecer',   desc: 'Animado' },
    { value: 'snow',    label: 'Neve',         desc: 'Animado' },
    { value: 'space',   label: 'Espaço',       desc: 'Sideral' },
    { value: 'forest',  label: 'Floresta',     desc: 'Natural' },
    { value: 'mosaic',  label: 'Mosaico',      desc: 'Geométrico' },
  ];

  const layouts = [
    {
      id: 'icons' as SidebarLayout,
      label: 'Ícones',
      desc: 'Barra lateral compacta',
      preview: (
        <div className="cfg-layout-preview cfg-preview-icons">
          <div className="cfg-preview-sidebar">
            {[0,1,2,3,4].map(i => <div key={i} className="cfg-prev-dot" />)}
          </div>
          <div className="cfg-preview-content" />
        </div>
      )
    },
    {
      id: 'gaete' as SidebarLayout,
      label: 'Gaete',
      desc: 'Barra lateral com texto',
      preview: (
        <div className="cfg-layout-preview cfg-preview-gaete">
          <div className="cfg-preview-sidebar cfg-preview-sidebar-wide">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="cfg-prev-row">
                <div className="cfg-prev-dot" />
                <div className="cfg-prev-bar" />
              </div>
            ))}
          </div>
          <div className="cfg-preview-content" />
        </div>
      )
    },
    {
      id: 'bottom' as SidebarLayout,
      label: 'Inferior',
      desc: 'Barra no rodapé',
      preview: (
        <div className="cfg-layout-preview cfg-preview-bottom">
          <div className="cfg-preview-content cfg-preview-content-full" />
          <div className="cfg-preview-bottombar">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="cfg-prev-bottom-item">
                <div className="cfg-prev-dot" />
                <div className="cfg-prev-bar cfg-prev-bar-short" />
              </div>
            ))}
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="cfg-root">

      {/* ── TEMAS PREDEFINIDOS ──────────────────────────────────── */}
      <section className="cfg-section">
        <div className="cfg-section-label">
          <Sparkles size={15} />
          Temas Predefinidos
        </div>
        <p className="cfg-themes-hint">Clique em um tema para aplicar cor principal, fundo e container de uma vez.</p>
        <div className="cfg-themes-grid">
          {THEME_PRESETS.map(theme => {
            const active = isActiveTheme(theme);
            return (
              <button
                key={theme.id}
                className={`cfg-theme-card ${active ? 'cfg-theme-active' : ''}`}
                onClick={() => applyTheme(theme)}
                title={theme.description}
              >
                {/* Visual preview */}
                <div className="cfg-theme-preview">
                  <div
                    className="cfg-theme-preview-bg"
                    style={{ background: theme.previewBg }}
                  />
                  <div
                    className="cfg-theme-preview-sidebar"
                    style={{ background: theme.previewSidebar }}
                  >
                    {[0,1,2,3].map(i => (
                      <div
                        key={i}
                        className="cfg-theme-prev-dot"
                        style={{ background: i === 1 ? theme.previewAccent : 'rgba(255,255,255,0.2)' }}
                      />
                    ))}
                  </div>
                  <div
                    className="cfg-theme-preview-accent-bar"
                    style={{ background: theme.previewAccent }}
                  />
                  {active && (
                    <div className="cfg-theme-check">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="cfg-theme-info">
                  <span className="cfg-theme-name" style={{ color: active ? theme.previewAccent : undefined }}>
                    {theme.name}
                  </span>
                  <span className="cfg-theme-desc">{theme.description}</span>
                </div>
                {/* Accent dot */}
                <div
                  className="cfg-theme-dot"
                  style={{ background: theme.previewAccent, boxShadow: `0 0 8px ${theme.previewAccent}55` }}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* ── APARÊNCIA ─────────────────────────────────────────────── */}
      <section className="cfg-section">
        <div className="cfg-section-label">
          <Palette size={15} />
          Aparência
        </div>

        <div className="cfg-cards-row">

          {/* Cor principal */}
          <div className="cfg-card">
            <div className="cfg-card-title">Cor Principal</div>
            <div className="cfg-card-desc">Define a cor de destaque do app</div>
            <div className="cfg-color-row">
              <label className="cfg-color-swatch" style={{ background: primaryColor }}>
                <input type="color" value={primaryColor} onChange={e => onColorChange(e.target.value)} />
              </label>
              <span className="cfg-color-hex">{primaryColor.toUpperCase()}</span>
              <button className="cfg-btn-ghost" onClick={() => { soundService.playClick(); handleResetColor(); }}>Resetar</button>
            </div>
          </div>

          {/* Plano de fundo */}
          <div className="cfg-card cfg-card-wide">
            <div className="cfg-card-title">Plano de Fundo</div>
            <div className="cfg-card-desc">Estilo visual do fundo da aplicação</div>
            <div className="cfg-bg-grid">
              {backgrounds.map(({ value, label, desc }) => (
                <button
                  key={value}
                  className={`cfg-bg-option ${backgroundMode === value ? 'cfg-bg-active' : ''}`}
                  onClick={() => { soundService.playClick(); onBackgroundModeChange(value as BackgroundMode); }}
                >
                  <span className="cfg-bg-name">{label}</span>
                  <span className="cfg-bg-desc">{desc}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── BARRA DE NAVEGAÇÃO ────────────────────────────────── */}
      <section className="cfg-section">
        <div className="cfg-section-label">
          <SettingsIcon size={15} />
          Barra de Navegação
        </div>

        <div className="cfg-layouts-row">
          {layouts.map(({ id, label, desc, preview }) => (
            <button
              key={id}
              className={`cfg-layout-card ${sidebarLayout === id ? 'cfg-layout-active' : ''}`}
              onClick={() => { soundService.playClick(); onSidebarLayoutChange(id); }}
            >
              {preview}
              <div className="cfg-layout-info">
                <span className="cfg-layout-name">{label}</span>
                <span className="cfg-layout-desc">{desc}</span>
              </div>
              {sidebarLayout === id && <div className="cfg-layout-check">✓</div>}
            </button>
          ))}
        </div>
      </section>

      {/* ── SOM & NOTIFICAÇÕES ────────────────────────────────── */}
      <section className="cfg-section">
        <div className="cfg-section-label">
          <Volume2 size={15} />
          Som &amp; Notificações
        </div>

        <div className="cfg-cards-row">

          <div className="cfg-card">
            <div className="cfg-card-title">Volume dos Efeitos</div>
            <div className="cfg-card-desc">Sons ao interagir com o app</div>
            <div className="cfg-volume-row">
              {volume === 0 ? <VolumeX size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <Volume2 size={16} style={{ color: 'var(--primary-color)', flexShrink: 0 }} />}
              <input
                type="range" min="0" max="1" step="0.1" value={volume}
                onChange={e => onVolumeChange(parseFloat(e.target.value))}
                className="cfg-slider"
                style={{ '--accent': primaryColor } as React.CSSProperties}
              />
              <span className="cfg-volume-pct">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="cfg-card">
            <div className="cfg-card-title">Notificações</div>
            <div className="cfg-card-desc">Alertas ao fim do temporizador</div>
            <button
              className={`cfg-toggle ${notificationsEnabled ? 'cfg-toggle-on' : ''}`}
              onClick={() => { soundService.playToggle(); requestNotificationPermission(); }}
            >
              <div className="cfg-toggle-track">
                <div className="cfg-toggle-thumb" />
              </div>
              <span>{notificationsEnabled ? 'Ativadas' : 'Desativadas'}</span>
              <Bell size={15} />
            </button>
          </div>

        </div>
      </section>

      {/* ── DADOS ─────────────────────────────────────────────── */}
      <section className="cfg-section">
        <div className="cfg-section-label">
          <Database size={15} />
          Dados
        </div>

        <div className="cfg-cards-row">

          <div className="cfg-card">
            <div className="cfg-card-title">Backup</div>
            <div className="cfg-card-desc">Exporte ou importe seus dados de estudo</div>
            <div className="cfg-data-btns">
              <button className="cfg-btn-primary" onClick={() => { soundService.playClick(); handleExport(); }}>
                <Download size={16} /> Exportar
              </button>
              <button className="cfg-btn-secondary" onClick={() => { soundService.playClick(); handleImportClick(); }}>
                <Upload size={16} /> Importar
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            </div>
          </div>

          <div className="cfg-card cfg-card-danger">
            <div className="cfg-card-title cfg-danger-title">Zona de Perigo</div>
            <div className="cfg-card-desc">Remove permanentemente todos os dados deste navegador</div>
            <button className="cfg-btn-danger" onClick={() => { soundService.playDelete(); handleClearData(); }}>
              <Trash2 size={16} /> Apagar Tudo
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Settings;
