import { motion } from 'framer-motion';

const MovieTrailer = ({id, title}) => {
	
	return (
		<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-4 w-[370px] h-fit
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
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