import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Button from "../ui/Button";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, color) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, color }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed flex flex-col bottom-4 gap-3 left-4 z-50">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              color={toast.color}
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const { addToast } = useContext(ToastContext);

  const toastSuccess = (message) => addToast(message, "text-success");
  const toastError = (message) => addToast(message, "text-error");
  const toastInfo = (message) => addToast(message, "text-primary-foreground");

  return { toastSuccess, toastError, toastInfo };
};

const Toast = ({ message, onClose, id, color = "text-primary-foreground" }) => {
  return (
    <motion.div
      key={id}
      initial={{
        y: 5,
      }}
      animate={{
        y: 0,
      }}
      exit={{
        x: -999,
      }}
      className={`flex justify-center items-center gap-2 bg-primary text-xs ${color} font-semibold rounded-md p-2 shadow-md relative`}
    >
      {message}
      <Button
        variant="default_rounded"
        onClick={onClose}
        text={<FontAwesomeIcon icon={faX} />}
      />
    </motion.div>
  );
};
