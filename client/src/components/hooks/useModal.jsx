import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [open, setOpen] = useState(false);

  const value = {
    setModal,
    setOpen
  };

  useEffect(() => {
		open ? document.body.style.overflow = 'hidden' : document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {open && ReactDOM.createPortal(
        <div className='fixed inset-0 flex justify-center items-center bg-black z-50 bg-opacity-30'
				onClick={() => setOpen(false)}
				>
          {modal}
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
}
