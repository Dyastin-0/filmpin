import { useState } from 'react';
import Button from './Button';

export const Dropdown = ({ name, className, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="relative flex items-center justify-end z-50">
      <Button
				variant='ghost'
				text={name}
        onClick={toggle}
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
			>
				{children}
				</ul>
    </div>
  );
};

export const DropdownItem = ({onClick, children, asChild}) => {
	return (
		asChild ? children :
		<button
			className='text-right text-nowrap text-primary-foreground text-xs outline-none
			pb-1'
			onClick={onClick}>
			{children}
		</button>
	);
}
