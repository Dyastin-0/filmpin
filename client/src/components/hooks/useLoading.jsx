import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(null);

  const value = {
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: loading ? 85 : 50, opacity: loading ? 1 : 0 }}
        className="absolute self-center z-50"
      >
        <FontAwesomeIcon
          className={`text-primary-highlight text-[30px] animate-spin`}
          icon={faSpinner}
        />
      </motion.div>
    </LoadingContext.Provider>
  );
}
