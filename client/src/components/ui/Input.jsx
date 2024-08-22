import React, { useState } from 'react';
import { motion } from 'framer-motion';
 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Input = React.forwardRef(({ onChange, type, value, id, placeholder, required, className }, ref) => {
	const [focus, setFocus] = useState(false);

	return (
    <div className='relative flex flex-col justify-center h-[60px]'>
			<motion.label
				initial={{
					y: 0,
					x: 5,
					fontSize: '0.75rem'
				}}
				animate={
					value || focus ?
					{
						y: -25,
						x: 0,
						fontSize: '0.65rem',
						color: 'var(--highlight)'
					} :
					{
						y: 0,
						x: 5,
						fontSize: '0.75rem',
						color: 'var(--text-primary)'
					}
				}
				transition={{duration: 0.3, ease: 'easeInOut'}}
				className={`absolute font-semibold`}
				htmlFor={id}>{placeholder}
			</motion.label>
			<input
				ref={ref}
				id={id}
				type={type}
				required={required}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				className={`bg-transparent rounded-md p-2 outline-none text-primary-foreground
				transition-all duration-300
				focus:shadow-[var(--highlight)_0_2px_0_0]
				${value ? 'shadow-[var(--highlight)_2px_2px_0_0px]' : 'shadow-[var(--highlight)_0px_2px_0_0]'} ${className}`}
				value={value}
				onChange={(e) => onChange(e)}
			/>
		</div>
  );
});

export const SearchInput = ({ onChange, type, value, id, placeholder, required, onSubmit }) => {
	const [focus, setFocus] = useState(false);
	return (
		<form className={`flex gap-2 text-primary-foreground bg-accent pt-1 pb-1 pl-3 pr-3 rounded-full
			transition-all duration-300
			${focus ? 'shadow-[0_0_0_2px] shadow-primary-highlight' : 'shadow-sm'}`}
			onSubmit={onSubmit}>
			<input
				value={value}
				id={id}
				type={type}
				onChange={onChange}
				required={required}
				placeholder={placeholder}
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				className={`bg-transparent text-primary-foreground placeholder-primary-foreground rounded-md text-xs outline-none
					w-full`}
			/>
			<button type='submit' onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className='outline-none'>
				<FontAwesomeIcon
					className={`transition-all duration-300 ease-in-out hover:scale-110 hover:text-primary-highlight
					${focus ? 'text-primary-highlight scale-110' : ''}`} icon={faSearch} />
			</button>
		</form>
	);
}

export default Input;