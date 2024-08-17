import React from 'react'

const variants = {
	default: 'p-2 rounded-md outline-none transition-all duration-300 focus:bg-primary-highlight focus:text-primary-highlight-foreground focus:text-secondary-foreground hover:bg-primary-highlight hover:text-primary-highlight-foreground',
	link: 'text-sm text-primary-foreground font-semibold transition-all duration-300 hover:cursor-pointer hover:text-primary-highlight outline-none focus:shadow-[var(--highlight)_0_2px_0_0] pb-1'
}

const Button = ({text, type, onClick, variant = 'default', className}) => {
	return (
		<button
			className={`${variants[variant]} ${className}`}
			type={type}
			onClick={onClick}
		>{ text }</button>
	)
}

export default Button;