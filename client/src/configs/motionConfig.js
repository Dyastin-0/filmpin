export const blinkVariants = {
  blink: {
    backgroundColor: ["var(--bg-primary)", "var(--bg-secondary)"],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

export const blinkOpacity = {
  blink: {
    opacity: [0.5, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};
