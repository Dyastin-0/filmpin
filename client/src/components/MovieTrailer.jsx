import { motion } from 'framer-motion';

import { useModal } from '../hooks/useModal';

const Frame = ({id, title}) => {
	return (
		<div className='w-full max-w-[100%] lg:max-w-[70%] m-4 aspect-video'>
			<iframe
				className='w-full h-full rounded-lg'
				src={`https://youtube.com/embed/${id}`}
				title={title}
				allowFullScreen
			></iframe>
		</div>
	);
}

const MovieTrailer = ({id, title}) => {
	const { setModal, setOpen } = useModal();

	const handleClick = () => {
		setModal(
			<Frame id={id} title={title} />
		);
		setOpen(true);
	}

	return (
		<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-3 w-[370px] h-fit
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
			onClick={handleClick}
		>
		<img
			loading='lazy'
			className='w-[370px] object-cover rounded-md'
			src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
			alt={`${title} trailer thumbnail`}
		/>
		</motion.div>
	)
}

export default MovieTrailer;