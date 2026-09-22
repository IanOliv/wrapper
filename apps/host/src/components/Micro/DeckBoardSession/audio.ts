type SfxName = 'card-play' | 'damage' | 'draw' | 'turn-end';

/**
 * A single lazily-created `AudioContext` synthesizing four short tones — no
 * audio assets ship with this component. Buffers are built once, on the first
 * sound played, since that first call is guaranteed to follow a user gesture.
 */
class DeckBoardAudio {
  private ac: AudioContext | null = null;
  private buffers: Partial<Record<SfxName, AudioBuffer>> = {};

  private ensure(): AudioContext | null {
    if (this.ac) return this.ac;

    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AC) return null;

    const ac = new AC();

    this.ac = ac;

    const buf = (ms: number, fn: (t: number, p: number) => number) => {
      const n = Math.round(ac.sampleRate * (ms / 1000));
      const b = ac.createBuffer(1, n, ac.sampleRate);
      const d = b.getChannelData(0);

      for (let i = 0; i < n; i++) d[i] = fn(i / ac.sampleRate, i / n);

      return b;
    };

    const tone = (f0: number, f1: number, ms: number, noise: boolean) =>
      buf(ms, (t, p) => {
        const f = f0 + (f1 - f0) * p;
        const env = Math.pow(1 - p, 2.2);
        const s = Math.sin(2 * Math.PI * f * t);

        return env * (noise ? 0.55 * s + 0.45 * (Math.random() * 2 - 1) : s) * 0.5;
      });

    this.buffers = {
      'card-play': tone(520, 300, 140, false),
      damage: tone(200, 120, 180, true),
      draw: tone(300, 720, 120, false),
      'turn-end': tone(250, 150, 260, false),
    };

    return ac;
  }

  /** Unlocks/creates the context on an explicit gesture (the sound toggle),
   *  so the first automatic sfx — e.g. the enemy turn's own "damage" tone —
   *  doesn't hit an autoplay block for lack of a direct user gesture. */
  warm() {
    this.ensure();
  }

  play(name: SfxName, volume: number) {
    const ac = this.ensure();
    const buffer = ac ? this.buffers[name] : undefined;

    if (!ac || !buffer) return;
    if (ac.state === 'suspended') ac.resume();

    const src = ac.createBufferSource();
    const gain = ac.createGain();

    src.buffer = buffer;
    gain.gain.value = volume;
    src.connect(gain).connect(ac.destination);
    src.start();
  }
}

export { DeckBoardAudio };
export type { SfxName };
