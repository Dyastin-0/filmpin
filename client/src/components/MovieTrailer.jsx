import { motion } from 'framer-motion';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { VisuallyHidden } from '@chakra-ui/react';

const MovieTrailer = ({id, title}) => {
	
	return (
		<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-3 w-[370px] h-fit
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
		>
			<Dialog>
				<DialogTrigger>
					<img
						loading='lazy'
						className='w-[370px] object-cover rounded-md'
						src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
						alt={`${title} trailer thumbnail`}
					/>
				</DialogTrigger>
				<DialogContent className='h-[80vh] min-w-[80vw] bg-accent'>
					<VisuallyHidden> <DialogTitle>{ title }</DialogTitle> </VisuallyHidden>
					<VisuallyHidden> <DialogDescription> {`${title} trailer`} </DialogDescription> </VisuallyHidden>
					<iframe
						className='rounded-md w-full h-full'
						src={`https://youtube.com/embed/${id}`}
					></iframe>
				</DialogContent>
			</Dialog>
		</motion.div>
	)
}

export default MovieTrailer;