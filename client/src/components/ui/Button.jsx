const variants = {
	default: 'p-2 text-primary-foreground font-semibold bg-secondary rounded-md transition-all duration-300 focus:shadow-[var(--accent-secondary)_0_0_0_2px] hover:shadow-[var(--accent-secondary)_0_0_0_2px]',
	default_rounded: 'p-2 text-primary-foreground font-semibold bg-secondary rounded-full transition-all duration-300 focus:shadow-[var(--accent-secondary)_0_0_0_2px] hover:shadow-[var(--accent-secondary)_0_0_0_2px]',
	link: 'text-primary-foreground font-bold transition-all duration-300 hover:cursor-pointer hover:text-primary-highlight focus:shadow-[var(--highlight)_0_2px_0_0] pb-1',
	ghost: 'text-primary-foreground bg-accent rounded-md shadow-sm p-2 focus:shadow-[var(--highlight)_0_0_0_2px] transition-all duration-300'
}

const Button = ({
	text,
	type,
	onClick,
	onBlur,
	variant = 'default',
	className = '',
	onMouseEnter,
	onFocus,
	disabled,
	icon
}) => {
	return (
		<button
			disabled={disabled}
			onMouseEnter={onMouseEnter}
			className={`transition-all duration-300 flex h-fit items-center gap-1 justify-center text-xs outline-none ${variants[variant]} ${className}`}
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
