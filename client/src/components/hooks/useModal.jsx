import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

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
              className='fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black z-40 bg-opacity-30'
              onClick={() => setOpen(false)}
            >
              <FontAwesomeIcon icon={faX}
                className='absolute top-4 right-4 text-xs rounded-full p-2 hover:cursor-pointer'
                onClick={() => setOpen(false)}
              />
              <div
                className='flex justify-center items-center w-fit max-w-[calc(100%-2rem)] h-full max-h-[calc(100%-2rem)]'
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
