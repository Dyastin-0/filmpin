import { motion } from 'framer-motion';
import { useModal } from './hooks/useModal';
import { useEffect, useState } from 'react';
import { TrailerImageDummy } from './loaders/TrailerLoaders';
import useAxios from '../hooks/useAxios';
import Frame from './Frame';
import Clip from './Clip';

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
			hover:scale-95 duration-300'
		>
			{
				imageLoaded ?
					<Clip title={title} trailerKey={trailerYoutubeKey} onClick={handleClick} />
					: <TrailerImageDummy />
			}
		</motion.div>
	)
}

export default MovieTrailer;
