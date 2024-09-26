const variants = {
  default: "p-2 text-primary-foreground font-semibold bg-secondary rounded-md",
  default_rounded:
    "p-2 text-primary-foreground font-semibold bg-secondary rounded-full",
  link: "text-primary-foreground font-bold transition-all duration-300 hover:cursor-pointer hover:text-primary-highlight focus:shadow-[var(--highlight)_0_2px_0_0] pb-1",
  ghost: "text-primary-foreground font-semibold rounded-md shadow-sm p-2",
};

const Button = ({
  text,
  type,
  onClick,
  onBlur,
  variant = "default",
  className = "",
  onMouseEnter,
  onFocus,
  disabled,
  icon,
}) => {
  return (
    <button
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      className={`flex h-fit items-center gap-1 justify-center text-xs outline-none transition-all duration-300 focus:shadow-[var(--accent-secondary)_0_0_0_2px] hover:shadow-[var(--accent-secondary)_0_0_0_2px] ${variants[variant]} ${className}`}
      type={type}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      {text} {icon}
    </button>
  );
};

export default Button;
