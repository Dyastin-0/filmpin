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
			<Button
				text={name}
				onClick={toggle}
				onBlur={handleBlur}
			/>
			<motion.ul
				initial={{ scaleY: 0, opacity: 0, y: -20 }}
				animate={isOpen ? { scaleY: 1, opacity: 1, y: 0 } : { scaleY: 0, opacity: 0, y: -20 }}
				transition={0}
				className={`absolute flex flex-col top-full mt-2 right-0 z-50
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
			className='text-nowrap text-primary-foreground text-xs outline-none pb-1'
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{children}
		</button>
	);
};
