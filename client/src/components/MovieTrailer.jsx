import { motion } from 'framer-motion';
import { useModal } from './hooks/useModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { TrailerImageDummy } from './loaders/TrailerLoaders';

const getVideos = async (id, token) => {
	try {
		const videos = await axios.get(`/movies/videos/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": 'application/json'
			}
		});
		return videos.data;
	} catch (error) {
		console.error(`Failed to get videos for movie with id '${id}'`, error);
	}
}

const Frame = ({youtubeKey, title}) => {
	return (
		<div className='w-full max-w-[100%] lg:max-w-[70%] m-4 aspect-video'>
			<iframe
				className='w-full h-full rounded-lg'
				src={`https://youtube.com/embed/${youtubeKey}`}
				title={title}
				allowFullScreen
			></iframe>
		</div>
	);
}

const MovieTrailer = ({id, title}) => {
	const { token } = useAuth();
	const { setModal, setOpen } = useModal();
	const [ trailerYoutubeKey, setTrailerYoutubeKey ] = useState(null);
	const [videos, setVideos] = useState(null);
	const [imageLoaded, setImageLoaded] = useState(false);

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
		token && token && getVideos(id, token).then(videos => setVideos(videos.results));
	}, [id, token]);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type == 'Trailer')?.key);
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
				<img
					loading='lazy'
					className='aspect-video object-cover rounded-md'
					src={`https://img.youtube.com/vi/${trailerYoutubeKey}/hqdefault.jpg`}
					alt={`${title} trailer thumbnail`}
				/> :
				<TrailerImageDummy />
		}
		</motion.div>
	)
}

export default MovieTrailer;