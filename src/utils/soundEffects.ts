// Lightweight Web Audio API synthesizer for gentle Frutiger Aero / glossy game UI sound effects,
// peaceful ambient background music loop, and optional browser dialogue narration.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let musicEnabled = true;
let musicTimer: number | null = null;
let musicStep = 0;
let lastHoverTimestamp = 0;
let gestureListenerAttached = false;

if (typeof window !== 'undefined') {
  try {
    const saved = window.localStorage.getItem('ddw_sound_enabled');
    if (saved === 'false') {
      soundEnabled = false;
    }
  } catch {
    // Ignore storage errors
  }
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('ddw_sound_enabled', String(enabled));
    } catch {
      // Ignore storage errors
    }
  }
}

function getContext(forceForMusic = false): AudioContext | null {
  if ((!soundEnabled && !forceForMusic) || typeof window === 'undefined') {
    return null;
  }
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) {
    return null;
  }
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function unlockAudioOnFirstGesture(): void {
  if (typeof window === 'undefined' || gestureListenerAttached) return;
  gestureListenerAttached = true;

  const unlock = () => {
    const ctx = getContext(true);
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (musicEnabled) {
      startMusicLoop();
    }
  };

  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock, { passive: true });
}

function playTone(
  freq: number,
  duration: number,
  options: {
    type?: OscillatorType;
    gain?: number;
    delay?: number;
    slideToFreq?: number;
    allowWhenMuted?: boolean;
  } = {}
): void {
  const { type = 'sine', gain = 0.08, delay = 0, slideToFreq, allowWhenMuted = false } = options;
  const ctx = getContext(allowWhenMuted);
  if (!ctx || ctx.state !== 'running') {
    return;
  }

  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideToFreq) {
    osc.frequency.exponentialRampToValueAtTime(slideToFreq, start + duration);
  }

  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(amp);
  amp.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + duration + 0.03);
}

/** Soft glossy water-bubble tick on card hover */
export function playHoverTick(): void {
  const now = Date.now();
  if (now - lastHoverTimestamp < 120) return;
  lastHoverTimestamp = now;
  const ctx = getContext();
  if (!ctx || ctx.state !== 'running') return;
  playTone(740, 0.075, { type: 'sine', gain: 0.035, slideToFreq: 980 });
}

/** Cheerful ascending Frutiger Aero chime when entering a portal */
export function playPortalOpen(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(523.25, 0.14, { type: 'triangle', gain: 0.08, delay: 0 });
    playTone(659.25, 0.16, { type: 'sine', gain: 0.08, delay: 0.065 });
    playTone(783.99, 0.24, { type: 'sine', gain: 0.07, delay: 0.13 });
  }).catch(() => {});
}

/** Gentle bubble pop when returning to portals or closing panels */
export function playBackClick(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(580, 0.11, { type: 'sine', gain: 0.065, slideToFreq: 390 });
  }).catch(() => {});
}

/** Bright sparkling chord on successful login or achievement */
export function playLoginSuccess(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(523.25, 0.18, { type: 'triangle', gain: 0.075, delay: 0 });
    playTone(659.25, 0.18, { type: 'sine', gain: 0.075, delay: 0.08 });
    playTone(783.99, 0.22, { type: 'sine', gain: 0.075, delay: 0.16 });
    playTone(1046.5, 0.38, { type: 'sine', gain: 0.085, delay: 0.24 });
  }).catch(() => {});
}

/** Gentle child-friendly two-note alert on validation/login error or off-path click */
export function playErrorTone(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(349.23, 0.14, { type: 'triangle', gain: 0.07, delay: 0 });
    playTone(277.18, 0.22, { type: 'triangle', gain: 0.065, delay: 0.11 });
  }).catch(() => {});
}

/** Playful friendly chirp when Detective Pusheen speaks */
export function playMascotChirp(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(620, 0.1, { type: 'sine', gain: 0.065, delay: 0, slideToFreq: 860 });
    playTone(780, 0.14, { type: 'sine', gain: 0.06, delay: 0.11, slideToFreq: 1020 });
  }).catch(() => {});
}

/** Gentle soft step pop for walking / selecting customisation items */
export function playSoftSelect(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(660, 0.08, { type: 'sine', gain: 0.05, slideToFreq: 760 });
  }).catch(() => {});
}

/** Gentle three-tap wooden door knock sound for Screen 05 Aina's bedroom */
export function playDoorKnock(): void {
  const ctx = getContext();
  if (!ctx) return;
  ctx.resume().then(() => {
    playTone(190, 0.09, { type: 'triangle', gain: 0.14, delay: 0, slideToFreq: 120 });
    playTone(200, 0.09, { type: 'triangle', gain: 0.14, delay: 0.18, slideToFreq: 125 });
    playTone(195, 0.1, { type: 'triangle', gain: 0.15, delay: 0.36, slideToFreq: 120 });
  }).catch(() => {});
}

/** Dynamic background music moods: peaceful town, tense mystery, celebration */
export type MusicMood = 'peaceful' | 'tense' | 'celebration';

let currentMusicMood: MusicMood = 'peaceful';

const PEACEFUL_PATTERN: Array<{ lead: number; bass?: number }> = [
  { lead: 523.25, bass: 261.63 }, // C5 + C4
  { lead: 659.25 },                 // E5
  { lead: 783.99 },                 // G5
  { lead: 659.25 },                 // E5
  { lead: 587.33, bass: 293.66 }, // D5 + D4
  { lead: 698.46 },                 // F5
  { lead: 880.0 },                  // A5
  { lead: 783.99 },                 // G5
  { lead: 659.25, bass: 220.0 },  // E5 + A3
  { lead: 783.99 },                 // G5
  { lead: 987.77 },                 // B5
  { lead: 783.99 },                 // G5
  { lead: 698.46, bass: 196.0 },  // F5 + G3
  { lead: 659.25 },                 // E5
  { lead: 587.33 },                 // D5
  { lead: 523.25 },                 // C5
];

// Minor / diminished chromatic suspense motif for tense detective moments
const TENSE_PATTERN: Array<{ lead: number; bass?: number }> = [
  { lead: 440.0, bass: 146.83 },  // A4 + D3
  { lead: 466.16 },                 // Bb4 (minor 2nd tension)
  { lead: 523.25, bass: 146.83 }, // C5 + D3
  { lead: 415.3 },                  // G#4 (diminished colour)
  { lead: 440.0, bass: 155.56 },  // A4 + Eb3
  { lead: 554.37 },                 // C#5
  { lead: 523.25, bass: 138.59 }, // C5 + C#3
  { lead: 392.0 },                  // G4
  { lead: 440.0, bass: 130.81 },  // A4 + C3
  { lead: 466.16 },                 // Bb4
  { lead: 587.33, bass: 146.83 }, // D5 + D3
  { lead: 554.37 },                 // C#5
  { lead: 523.25, bass: 123.47 }, // C5 + B2
  { lead: 466.16 },                 // Bb4
  { lead: 440.0, bass: 110.0 },   // A4 + A2
  { lead: 369.99 },                 // F#4
];

const CELEBRATION_PATTERN: Array<{ lead: number; bass?: number }> = [
  { lead: 523.25, bass: 261.63 }, // C5
  { lead: 659.25 },                 // E5
  { lead: 783.99, bass: 329.63 }, // G5
  { lead: 1046.5 },                 // C6
  { lead: 987.77, bass: 392.0 },  // B5
  { lead: 880.0 },                  // A5
  { lead: 783.99, bass: 349.23 }, // G5
  { lead: 880.0 },                  // A5
  { lead: 1046.5, bass: 261.63 }, // C6
  { lead: 783.99 },                 // G5
  { lead: 880.0, bass: 293.66 },  // A5
  { lead: 987.77 },                 // B5
  { lead: 1046.5, bass: 392.0 },  // C6
  { lead: 783.99 },                 // G5
  { lead: 659.25 },                 // E5
  { lead: 783.99 },                 // G5
];

function scheduleNextMusicBeat(): void {
  if (typeof window === 'undefined' || !musicEnabled) {
    musicTimer = null;
    return;
  }

  const tempoMs =
    currentMusicMood === 'tense'
      ? 355
      : currentMusicMood === 'celebration'
        ? 430
        : 520;

  musicTimer = window.setTimeout(() => {
    musicTimer = null;
    if (!musicEnabled) return;
    const currentCtx = getContext(true);
    if (currentCtx && currentCtx.state === 'running') {
      const pattern =
        currentMusicMood === 'tense'
          ? TENSE_PATTERN
          : currentMusicMood === 'celebration'
            ? CELEBRATION_PATTERN
            : PEACEFUL_PATTERN;
      const note = pattern[musicStep % pattern.length];
      musicStep += 1;

      if (currentMusicMood === 'tense') {
        playTone(note.lead, 0.28, {
          type: 'sawtooth',
          gain: 0.022,
          allowWhenMuted: true,
        });
        if (note.bass) {
          playTone(note.bass, 0.44, {
            type: 'triangle',
            gain: 0.052,
            allowWhenMuted: true,
          });
        }
      } else {
        playTone(note.lead, 0.45, {
          type: 'triangle',
          gain: currentMusicMood === 'celebration' ? 0.052 : 0.046,
          allowWhenMuted: true,
        });
        if (note.bass) {
          playTone(note.bass, 0.8, {
            type: 'sine',
            gain: 0.036,
            allowWhenMuted: true,
          });
        }
      }
    }
    scheduleNextMusicBeat();
  }, tempoMs);
}

function startMusicLoop(): void {
  if (typeof window === 'undefined' || !musicEnabled || musicTimer !== null) return;
  const ctx = getContext(true);
  if (!ctx) return;
  scheduleNextMusicBeat();
}

export function setMusicMood(mood: MusicMood): void {
  if (currentMusicMood === mood) return;
  currentMusicMood = mood;
  musicStep = 0;
  if (typeof window === 'undefined' || !musicEnabled) return;
  if (musicTimer !== null) {
    window.clearTimeout(musicTimer);
    musicTimer = null;
  }
  startMusicLoop();
}

export function getMusicMood(): MusicMood {
  return currentMusicMood;
}

export function setBackgroundMusicEnabled(enabled: boolean): void {
  musicEnabled = enabled;
  if (typeof window === 'undefined') return;

  if (!enabled) {
    if (musicTimer !== null) {
      window.clearTimeout(musicTimer);
      musicTimer = null;
    }
    return;
  }

  unlockAudioOnFirstGesture();
  const ctx = getContext(true);
  if (!ctx) return;
  ctx.resume().then(() => {
    startMusicLoop();
  }).catch(() => {});
  startMusicLoop();
}

/** Character speaking voice intentionally disabled for quiet, comfortable reading */
export function speakDialogueLine(_text: string, _enabled: boolean): void {
  stopNarration();
}

export function stopNarration(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore
  }
}
