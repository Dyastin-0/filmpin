import { useState, useRef } from 'react';
import Button from './Button';
import { motion } from 'framer-motion';

export const Dropdown = ({ name, children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggle = () => {
		setIsOpen((prev) => !prev);
	};

	const handleBlur = (event) => {
		if (!dropdownRef.current.contains(event.relatedTarget)) {
			setIsOpen(false);
		}
	};

	return (
		<div className='relative flex items-center justify-end z-50' ref={dropdownRef}>
			<button
				className='flex justify-center items-center text-center outline-none rounded-full focus:shadow-[var(--highlight)_0_0_0_2px] p-1'
				onClick={toggle}
				onBlur={handleBlur}
			>
				{name}
			</button>
			<motion.ul
				initial={{ scaleY: 0, opacity: 0, y: -50 }}
				animate={isOpen ? { scaleY: 1, opacity: 1, y: 0 } : { scaleY: 0, opacity: 0, y: -50 }}
				transition={0}
				className={`absolute flex flex-col items-end top-full mt-2 right-0 z-50
					text-primary-foreground text-xs bg-accent
					w-fit max-h-[200px] overflow-auto
					p-2 pb-1 gap-1 shadow-md rounded-md`}
				onBlur={handleBlur}
			>
				{children}
			</motion.ul>
		</div>
	);
};

export const DropdownItem = ({ onClick, children, asChild }) => {
	return asChild ? (
		children
	) : (
		<button
			className='text-right text-nowrap text-primary-foreground text-xs outline-none p-1.5 w-fit rounded-md
			transition-all duration-300
			hover:bg-primary'
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{children}
		</button>
	);
};
