import React, { useState } from 'react';
import { motion } from 'framer-motion';
 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Input = React.forwardRef(({ onChange, type, value, id, placeholder, required }, ref) => {
	const [focus, setFocus] = useState(false);

	return (
    <div className='relative flex flex-col justify-center h-[60px]'>
			<motion.label
				initial={{
					y: 0,
					x: 5
				}}
				animate={{
					y: focus || value ? -25 : 0,
					x: focus || value ? 0 : 5
				}}
				transition={{duration: 0.3, ease: 'easeInOut'}}
				className='absolute text-xs text-primary-foreground font-semibold'
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
				${value ? 'shadow-[var(--highlight)_2px_2px_0_0px]' : 'shadow-[var(--highlight)_0px_2px_0_0]'}`}
				value={value}
				onChange={(e) => onChange(e)}
			/>
		</div>
  );
});

export const SearchInput = ({ onChange, type, value, id, placeholder, required, onSubmit }) => {
	return (
		<form className='flex gap-2 shadow-sm text-primary-foreground bg-accent pt-1 pb-1 pl-2 pr-2 rounded-full' onSubmit={onSubmit}>
			<input
				value={value}
				id={id}
				type={type}
				onChange={onChange}
				required={required}
				placeholder={placeholder}
				className={`bg-transparent text-primary-foreground placeholder-primary-foreground rounded-md text-xs outline-none
					w-full`}
			/>
			<button type='submit'><FontAwesomeIcon className='transition-all duration-300 ease-in-out hover:scale-110 hover:text-primary-highlight' icon={faSearch} /></button>
		</form>
	);
}

export default Input;