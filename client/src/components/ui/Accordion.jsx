import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='w-fit text-primary-foreground rounded-md'>
      <Button
				text={title}
        onClick={toggleAccordion}
      />
        
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className='overflow-hidden'
      >
        <div className='px-4 py-2'>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Accordion;
