class SoundService {
  private context: AudioContext | null = null;
  private volume: number = 0.5;

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  private playSoftTone(
    freq: number, 
    type: OscillatorType, 
    duration: number, 
    startTime: number = 0, 
    volMultiplier: number = 1.0,
    attackTime: number = 0.05
  ) {
    if (this.volume <= 0.01) return;

    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    const masterVol = this.volume * volMultiplier;

    gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(masterVol, ctx.currentTime + startTime + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration + 0.1);
  }

  playStart() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(523.25, 'sine', 0.4, now, 0.3, 0.01);      // C5
    this.playSoftTone(659.25, 'sine', 0.45, now + 0.05, 0.25, 0.01); // E5
  }

  playStop() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(523.25, 'sine', 0.4, now, 0.28, 0.01); // C5
    this.playSoftTone(392.00, 'sine', 0.45, now + 0.05, 0.25, 0.01); // G4
  }

  playAlarm() {
    if (this.volume <= 0.01) return;
    const now = 0;
    const duration = 3.0;
    const baseFreq = 523.25; // C5
    this.playSoftTone(baseFreq, 'sine', duration, now, 0.35, 0.02);
    this.playSoftTone(baseFreq * 2, 'sine', duration * 0.7, now, 0.15, 0.02);
    this.playSoftTone(baseFreq * 3, 'sine', duration * 0.5, now, 0.08, 0.01);
  }

  playNavTab() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(800, 'sine', 0.06, now, 0.28, 0.003);
  }

  playPause() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(440, 'sine', 0.25, now, 0.25, 0.01);
  }

  playAdd() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(659.25, 'sine', 0.2, now, 0.25, 0.008);
  }

  playDelete() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(392.00, 'sine', 0.2, now, 0.23, 0.008);
  }

  playToggle() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(1000, 'sine', 0.04, now, 0.25, 0.002);
  }

  playSave() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(783.99, 'sine', 0.3, now, 0.25, 0.01);
  }

  playCancel() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(349.23, 'sine', 0.2, now, 0.22, 0.008);
  }

  playClick() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(700, 'sine', 0.05, now, 0.25, 0.003);
  }

  playFocus() {
    if (this.volume <= 0.01) return;
    const now = 0;
    this.playSoftTone(1200, 'sine', 0.03, now, 0.15, 0.002);
  }
}

export const soundService = new SoundService();
