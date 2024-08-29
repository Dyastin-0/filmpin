import { useState, useRef, useEffect } from 'react';
import Button from './Button';

export const Dropdown = ({ name, className, children }) => {
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
		<div className="relative flex items-center justify-end z-50" ref={dropdownRef}>
			<Button
				text={name}
				onClick={toggle}
				onBlur={handleBlur}
			/>
			<ul
				className={`absolute flex flex-col top-full mt-2 right-0 z-50
					text-primary-foreground text-xs bg-accent
					w-fit max-h-[200px] overflow-auto
					opacity-0 transform -translate-y-1/2 scale-y-0
					p-2 pb-1 gap-1 shadow-md rounded-md
					transition-all duration-300
					${className}
					${isOpen ? 'translate-y-0 scale-y-100 opacity-100' : ''}`}
				onBlur={handleBlur}
			>
				{children}
			</ul>
		</div>
	);
};

export const DropdownItem = ({ onClick, children, asChild }) => {
	return asChild ? (
		children
	) : (
		<button
			className="text-right text-nowrap text-primary-foreground text-xs outline-none pb-1"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{children}
		</button>
	);
};
