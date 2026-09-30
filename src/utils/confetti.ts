import confetti from 'canvas-confetti';

/**
 * Fires a neon green and cyberpunk confetti burst when a can is collected.
 */
export function fireCanCollectedConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#39FF14', '#00E676', '#10B981', '#FFFFFF', '#22C55E'],
    ticks: 200,
    gravity: 1.2,
    scalar: 0.9,
  });
}

/**
 * Fires a grand celebratory multi-cannon shower for major achievements or completing India vault.
 */
export function fireMilestoneConfetti() {
  const end = Date.now() + 1200;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#39FF14', '#FF9933', '#FFFFFF', '#138808', '#FBBF24'],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#39FF14', '#FF9933', '#FFFFFF', '#138808', '#60A5FA'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
