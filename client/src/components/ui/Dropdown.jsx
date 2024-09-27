import { useState, useRef } from "react";
import Button from "./Button";
import { motion } from "framer-motion";

export const Dropdown = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleBlur = (event) => {
    if (!dropdownRef.current.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative flex items-center z-50" ref={dropdownRef}>
      <Button
        variant="default_rounded"
        text={name}
        onClick={toggle}
        onBlur={handleBlur}
      />
      <motion.div
        initial={{ scaleY: 0, opacity: 0, y: -50 }}
        animate={
          isOpen
            ? { scaleY: 1, opacity: 1, y: 0 }
            : { scaleY: 0, opacity: 0, y: -50 }
        }
        transition={0}
        onFocus={() => setIsOpen(true)}
        className={`absolute flex flex-col items-end top-full mt-2 right-0 z-50
					text-primary-foreground text-xs bg-accent
					w-fit max-h-[200px] overflow-auto
					p-2 gap-2 shadow-md rounded-md`}
        onBlur={handleBlur}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const DropdownItem = ({ onClick, children, setOpen, asChild }) => {
  return asChild ? (
    children
  ) : (
    <button
      className="text-right w-full text-nowrap text-primary-foreground text-xs outline-none p-1.5 rounded-md
			transition-all duration-300
			hover:bg-secondary hover:cursor-pointer focus:bg-primary"
      onFocus={setOpen}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
};
