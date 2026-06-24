let audioCtx: AudioContext | null = null;
let alarmIntervalId: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a single sweet double-chime bell sound.
 */
export function playFocusCompleteChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First tone: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Second tone: A5 (880.00 Hz) played slightly offset
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.05);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.18, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + 1.5);
    osc2.stop(now + 2.0);
  } catch (err) {
    console.warn('Failed to synthesize focus complete chime:', err);
  }
}

/**
 * Starts a recurring alarm loop that rings every 2.5 seconds.
 */
export function startAlarmLoop() {
  if (alarmIntervalId) return;

  playFocusCompleteChime();
  alarmIntervalId = setInterval(() => {
    playFocusCompleteChime();
  }, 2500);
}

/**
 * Stops any active recurring alarm loop.
 */
export function stopAlarmLoop() {
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
}
