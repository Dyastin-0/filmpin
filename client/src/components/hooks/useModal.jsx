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
        <div>
          {open && (
            <div
              className='fixed inset-0 flex justify-center items-center bg-black z-40 bg-opacity-30'
              onClick={() => setOpen(false)}
            >
              <div
                className='flex justify-center items-center w-fit max-w-[calc(100%-4rem)] h-fit'
                onClick={(e) => e.stopPropagation()}
              >
                {modal}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
}
