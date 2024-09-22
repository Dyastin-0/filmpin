import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-fit max-w-full text-primary-foreground rounded-md">
      <button
        className="flex w-fit outline-none items-center text-primary-foreground text-xs font-semibold
        transition-colors duration-300 focus:text-primary-highlight hover:text-primary-highlight"
        onClick={toggleAccordion}
        onFocus={() => setIsOpen(true)}
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
      >
        <div className="py-2">{children}</div>
      </motion.div>
    </div>
  );
};

export default Accordion;
