import { createContext, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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
    open
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "");
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        <div>
          {open && (
            <div
              className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-black z-40 bg-opacity-30"
              onClick={() => setOpen(false)}
            >
              <div
                className="flex justify-center items-center overflow-hidden rounded-md w-fit max-w-[calc(100%-6rem)] h-fit max-h-[calc(100%-6rem)]"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="default_rounded"
                  onClick={() => setOpen(false)}
                  icon={<FontAwesomeIcon icon={faX} />}
                  className="fixed top-4 right-4 text-[.75rem]"
                />
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
