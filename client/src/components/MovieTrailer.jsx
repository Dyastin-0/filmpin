import { motion } from 'framer-motion';
import { useModal } from './hooks/useModal';
import { useEffect, useState } from 'react';
import { TrailerImageDummy } from './loaders/TrailerLoaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import useAxios from '../hooks/useAxios';

export const Frame = ({ youtubeKey, title }) => {
	return (
		<div className='w-full max-w-[100%] lg:max-w-[70%] m-4 aspect-video'>
			<iframe
				className='w-full h-full rounded-lg'
				src={`https://youtube.com/embed/${youtubeKey}`}
				title={title}
				allowFullScreen
			/>
		</div>
	);
}

const MovieTrailer = ({ id, title }) => {
	const api = useAxios();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	const getVideos = async (id) => {
		try {
			const videos = await api.get(`/movies/videos?movie_id=${id}`);
			return videos.data;
		} catch (error) {
			console.error(`Failed to get videos for movie with id '${id}'`, error);
		}
	}

	useEffect(() => {
		if (trailerYoutubeKey) {
			const img = new Image();
			img.src = `https://img.youtube.com/vi/${trailerYoutubeKey}/maxresdefault.jpg`;
			img.onload = () => {
				setImageLoaded(true);
			}
		}
	}, [trailerYoutubeKey]);

	useEffect(() => {
		getVideos(id).then(videos => setVideos(videos.results));
	}, []);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type === 'Trailer')?.key);
	}, [videos]);

	const handleClick = () => {
		setModal(
			<Frame youtubeKey={trailerYoutubeKey} title={title} />
		);
		setOpen(true);
	}

	return (
		<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-3 w-[270px] h-fit
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
			onClick={handleClick}
		>
			{
				imageLoaded ?
					<div className='relative group'>
						<img
							loading='lazy'
							className='aspect-video object-cover rounded-md w-full h-full'
							src={`https://img.youtube.com/vi/${trailerYoutubeKey}/hqdefault.jpg`}
							alt={`${title} trailer thumbnail`}
						/>
						<div className='absolute inset-0 flex justify-center items-center bg-transparent rounded-md transition-colors duration-300 group-hover:bg-[#0000004D]'>
							<FontAwesomeIcon icon={faPlay} className='text-accent text-2xl' />
						</div>
					</div>
					: <TrailerImageDummy />
			}
		</motion.div>
	)
}

export default MovieTrailer;
