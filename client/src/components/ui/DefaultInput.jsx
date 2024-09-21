import { forwardRef } from "react";

const DefaultInput = forwardRef(
  (
    { value, onChange, placeholder, isDisabled = false, readOnly = false },
    ref
  ) => (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      readOnly={readOnly}
      className="outline-none rounded-md bg-secondary p-2 text-xs placeholder:text-secondary-foreground transition-all duration-300 focus:shadow-[0_0_0_2px] focus:shadow-secondary-accent"
      placeholder={placeholder}
    />
  )
);

export default DefaultInput;
