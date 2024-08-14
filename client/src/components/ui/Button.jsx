import React from 'react'

const Button = ({text, type, onClick}) => {
	return (
		<button
			className='p-2 rounded-md
			outline-none
			transition-all duration-300
			focus:bg-primary-highlight focus:text-secondary-foreground
			hover:bg-primary-highlight hover:text-secondary-foreground'
			type={type}
			onClick={onClick}
		>{ text }</button>
	)
}

export default Button;