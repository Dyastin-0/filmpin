import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Toggles accordion when the button is clicked
  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  // Open accordion when any child is focused
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Close accordion when focus is lost from all children
  const handleBlur = (e) => {
    if (!contentRef.current.contains(e.relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-fit max-w-full text-primary-foreground rounded-md">
      <button
        className="flex w-fit outline-none items-center text-primary-foreground text-xs font-semibold
        transition-colors duration-300 focus:text-primary-highlight hover:text-primary-highlight"
        onClick={toggleAccordion}
      >
        <div className="flex items-center gap-1 justify-between">
          {title}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </motion.div>
        </div>
      </button>

      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="overflow-hidden"
        transition={{ duration: 0.3 }}
        ref={contentRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={-1}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Accordion;
