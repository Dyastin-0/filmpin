import { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, color) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, color }
    ]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className='fixed flex flex-col bottom-4 gap-3 right-4 z-50'>
				<AnimatePresence>
					{toasts.map(toast => (
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
  
  const toastSuccess = (message) => addToast(message, 'text-success');
  const toastError = (message) => addToast(message, 'text-error');
  const toastInfo = (message) => addToast(message);

  return { toastSuccess, toastError, toastInfo };
};

const Toast = ({ message, onClose, id, color = 'text-primary-foreground' }) => {
  return (
		<motion.div
			key={id}
			initial={{
				y: 5
			}}
			animate={{
				y: 0
			}}
			exit={{
				x: 999
			}}
			className={`flex justify-center items-center gap-2 bg-accent text-xs ${color} font-bold rounded-md p-2 shadow-md relative`}
		>
			{message}
			<Button
				onClick={onClose}
				variant='ghost'
				className='p-1'
				text={<FontAwesomeIcon className='text-primary-foreground text-xs' icon={faX} />}
			/>
		</motion.div>
  );
};
