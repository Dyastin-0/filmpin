import React from 'react'

const variants = {
	default: 'p-2 text-primary-highlight rounded-md transition-all duration-300 active:opacity-70 focus:bg-primary-highlight focus:text-primary-highlight-foreground hover:bg-primary-highlight hover:text-primary-highlight-foreground',
	link: 'text-primary-foreground font-semibold transition-all duration-300 hover:cursor-pointer hover:text-primary-highlight focus:shadow-[var(--highlight)_0_2px_0_0] pb-1',
	ghost: 'text-primary-foreground bg-accent rounded-md shadow-sm p-2 focus:shadow-[var(--highlight)_0_0_0_2px] transition-all duration-300'
}

const Button = ({ text, type, onClick, onBlur, variant = 'default', className, onMouseEnter, disabled, icon }) => {
	return (
		<button
			disabled={disabled}
			onMouseEnter={onMouseEnter}
			className={`transition-all duration-300 flex h-fit items-center gap-1 justify-center text-xs outline-none font-semibold ${variants[variant]} ${className}`}
			type={type}
			onClick={onClick}
			onBlur={onBlur}
		>{text} {icon} </button>
	)
}

export default Button;