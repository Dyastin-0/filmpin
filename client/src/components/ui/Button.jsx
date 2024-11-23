import clsx from "clsx";

const variants = {
  default: "p-2 text-primary-foreground bg-secondary rounded-md",
  default_rounded: "p-2 text-primary-foreground bg-secondary rounded-full",
  danger:
    "p-2 font-semibold bg-secondary text-danger rounded-md hover:bg-danger hover:text-primary-foreground",
  link: "text-primary-foreground font-bold transition-all duration-300 hover:cursor-pointer hover:text-primary-highlight focus:shadow-[var(--highlight)_0_2px_0_0] pb-1",
  ghost: "text-primary-foreground rounded-md shadow-sm p-2",
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
      className={clsx(
        "flex h-fit items-center gap-1 justify-center text-xs outline-none transition-all duration-300 " +
          "focus:shadow-[var(--accent-secondary)_0_0_0_2px] active:shadow-[var(--highlight)_0_0_0_2px] hover:shadow-[var(--accent-secondary)_0_0_0_2px]",
        variants[variant],
        className
      )}
      type={type}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      {text}
      {icon && (
        <div className="flex items-center justify-center w-fit h-fit aspect-square">
          {icon}
        </div>
      )}
    </button>
  );
};

export default Button;
