import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Frame from './Frame';
import { useModal } from './hooks/useModal';
import { useSearchParams } from 'react-router-dom';

const Clip = ({ title, trailerKey }) => {
	const { setModal, setOpen } = useModal();
	const [searchParams, setSearchParams] = useSearchParams();
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const isOpen = searchParams.get(`${title}_open`) === 'true';
		if (isOpen) {
			setModal(<Frame youtubeKey={trailerKey} title={title} onClose={handleClose} />);
			setOpen(true);
			setIsActive(true);
		} else if (isActive) {
			handleClose();
		}
	}, [searchParams, title, trailerKey, isActive]);

	const handleClose = () => {
		searchParams.delete(`${title}_open`);
		setSearchParams(searchParams);
		setOpen(false);
		setIsActive(false);
	};

	const handleClick = () => {
		if (!isActive) {
			searchParams.set(`${title}_open`, 'true');
			setSearchParams(searchParams);
		}
	};

	return (
		<div className='h-fit max-w-[270px] hover:cursor-pointer group' onClick={handleClick}>
			<div className='relative'>
				<img
					loading='lazy'
					className='aspect-video object-cover rounded-md w-[270px] h-fit'
					src={`https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`}
					alt={`${title} trailer thumbnail`}
				/>
				<div className='absolute inset-0 flex justify-center items-center bg-transparent rounded-md transition-colors duration-300 group-hover:bg-[#0000004D]'>
					<FontAwesomeIcon icon={faPlay} className='text-accent text-2xl' />
				</div>
			</div>
			<h1 className='text-center text-primary-foreground mt-2 text-xs line-clamp-1 font-semibold'>{title}</h1>
		</div>
	);
};

export default Clip;
