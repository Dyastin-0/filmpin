import { useEffect, useState } from 'react';
import { TrailerImageDummy, TrailerTitleDummy } from './loaders/TrailerLoaders';
import useAxios from '../hooks/useAxios';
import Clip from './Clip';
import { fetchVideos } from '../helpers/api';

const MovieTrailer = ({ id, title }) => {
	const api = useAxios();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const [imageLoaded, setImageLoaded] = useState(false);


	const getVideos = async (api, target, queryParam, id) => {
		try {
			const videos = await api.get(`/${target}/videos?${queryParam}=${id}`);
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
		fetchVideos(api, 'movies', 'movie_id', id).then(videos => setVideos(videos));
	}, []);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type === 'Trailer')?.key);
	}, [videos]);

	return (
		<div>
			{
				imageLoaded ?
					<Clip title={title} trailerKey={trailerYoutubeKey} />
					: <div className='flex flex-col items-center gap-1 justify-center'>
						<TrailerImageDummy />
						<TrailerTitleDummy />
					</div>
			}
		</div>
	)
}

export default MovieTrailer;
