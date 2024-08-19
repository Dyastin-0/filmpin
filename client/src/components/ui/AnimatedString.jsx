import React from 'react';
import { motion } from 'framer-motion';

const AnimatedString = ({ text }) => {
  if (!text) return;

  const words = text.split(' ');

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='flex flex-wrap gap-1 text-xs text-primary-foreground'>
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1, duration: 1, ease: 'easeInOut' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedString;
