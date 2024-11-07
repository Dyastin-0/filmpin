import React, { useState } from "react";
import { motion } from "framer-motion";

const Input = React.forwardRef(
  (
    {
      onChange,
      type,
      value,
      id,
      placeholder,
      required,
      className,
      autoComplete,
    },
    ref
  ) => {
    const [focus, setFocus] = useState(false);

    return (
      <div className="relative flex flex-col justify-center h-[60px]">
        <motion.label
          initial={{
            y: 0,
            x: 5,
            fontSize: "0.75rem",
          }}
          animate={
            value || focus
              ? {
                  y: -25,
                  x: 0,
                  fontSize: "0.65rem",
                  color: "var(--highlight)",
                }
              : {
                  y: 0,
                  x: 5,
                  fontSize: "0.75rem",
                  color: "var(--text-primary)",
                }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`absolute font-semibold`}
          htmlFor={id}
        >
          {placeholder}
        </motion.label>
        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          autoComplete={autoComplete}
          className={`bg-transparent rounded-md p-2 outline-none text-primary-foreground
				transition-all duration-300
				focus:shadow-[var(--accent-secondary)_0_2px_0_0]
				${
          value
            ? "shadow-[var(--highlight)_2px_2px_0_0px]"
            : "shadow-[var(--accent-secondary)_0px_2px_0_0]"
        } ${className}`}
          value={value}
          onChange={(e) => onChange(e)}
        />
      </div>
    );
  }
);

export default Input;
