import React from 'react'

const variants = {
	default: 'p-2 rounded-md transition-all duration-300 focus:bg-primary-highlight focus:text-primary-highlight-foreground focus:text-secondary-foreground hover:bg-primary-highlight hover:text-primary-highlight-foreground',
	link: 'text-primary-foreground font-semibold transition-all duration-300 hover:cursor-pointer hover:text-primary-highlight focus:shadow-[var(--highlight)_0_2px_0_0] pb-1',
	ghost: 'text-primary-foreground bg-accent rounded-md shadow-sm p-2 focus:shadow-[var(--highlight)_0_2px_0_0] pb-1 transition-all duration-300'
}

const Button = ({text, type, onClick, variant = 'default', className}) => {
	return (
		<button
			className={`text-xs outline-none ${variants[variant]} ${className}`}
			type={type}
			onClick={onClick}
		>{ text }</button>
	)
}

export default Button;