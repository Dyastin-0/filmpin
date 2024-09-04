import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [open, setOpen] = useState(false);

  const value = {
    setModal,
    setOpen,
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className='fixed inset-0 flex justify-center items-center bg-black z-40 bg-opacity-30'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                className='flex justify-center items-center w-fit max-w-[calc(100%-4rem)] h-fit'
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {modal}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </ModalContext.Provider>
  );
}
