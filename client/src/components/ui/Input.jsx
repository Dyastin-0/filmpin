import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

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

export const SearchInput = ({ onChange, type, value, id, placeholder, required }) => {
	return (
		<input
		id={id}
		type={type}
		required={required}
		placeholder={placeholder}
		className={`bg-primary-highlight text-primary-highlight-foreground placeholder-primary-highlight-foreground rounded-full text-sm outline-none
			transition-all duration-300
			focus:bg-transparent focus:text-primary-foreground focus:placeholder-primary-foreground focus:shadow-[var(--highlight)_0_0_0_2px]
			hover:bg-transparent hover:text-primary-foreground hover:placeholder-primary-foreground hover:shadow-[var(--highlight)_0_0_0_2px]
			pl-2 pr-2 pt-1 pb-1`}
		/>
	);
}

export default Input;