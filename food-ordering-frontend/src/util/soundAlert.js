// Sound Alert Synthesizer using Web Audio API
// Synthesizes a bright, pleasant bell chime without external audio files
export const playOrderChime = () => {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // Three-tone melodic bell chime: E5 -> G#5 -> B5 (Major triad harmonic chime)
        const notes = [
            { freq: 659.25, start: 0.0, duration: 0.25, volume: 0.25 },
            { freq: 830.61, start: 0.12, duration: 0.3, volume: 0.3 },
            { freq: 987.77, start: 0.24, duration: 0.65, volume: 0.35 }
        ];

        notes.forEach(({ freq, start, duration, volume }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

            gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
            gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + start);
            osc.stop(ctx.currentTime + start + duration);
        });
    } catch (e) {
        console.warn("Could not play order chime:", e);
    }
};
