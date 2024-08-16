export const blinkVariants = {
  blink: {
    backgroundColor: ['var(--bg-primary)', 'var(--bg-secondary)'],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'reverse',
    }
  }
};