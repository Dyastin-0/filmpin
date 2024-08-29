import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import useAxios from '../hooks/useAxios';
import EpisodeSection from '../components/sections/EpisodeSection';

const TvShowSeasonSlug = () => {
	const [searchParams] = useSearchParams();
	const api = useAxios();
	const { setLoading } = useLoading();
	const [details, setDetails] = useState(null);
	const [episodes, setEpisodes] = useState(null);
	const location = useLocation();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const id = searchParams.get('id').split('_')[0];
	const seasonNumber = searchParams.get('season_number');
	const title = searchParams.get('title');
	const backdrop_path = searchParams.get('backdrop_path');

	const getVideos = async (id, seasonNumber) => {
		try {
			const videos = await api.get(`/tvshows/season/videos?tvshow_id=${id}&tvshow_season=${seasonNumber}`);
			return videos.data;
		} catch (error) {
			console.error(`Failed to get videos for show with id '${id}'`, error);
		}
	}

	const getDetails = async (showId, seasonNumber) => {
		try {
			const response = await api.get(`/tvshows/season?tvshow_id=${showId}&season_number=${seasonNumber}`);
			return response.data;
		} catch (error) {
			console.error('Failed to get seasons', error);
		}
	}

	useEffect(() => {
		if (id) {
			const stateDetails = location.state?.details;
			if (!stateDetails) {
				setLoading(true);
				getDetails(id, seasonNumber).then(details => {
					setDetails(details);
					setIsLoading(false);
					setLoading(false);
				});
			} else {
				setDetails(stateDetails);
				setIsLoading(false);
				setLoading(false);
			}
			getVideos(id, seasonNumber).then(videos => setVideos(videos.results));
		}
	}, [id]);

	useEffect(() => {
		details && setEpisodes(details.episodes);
	}, [details]);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type == 'Trailer')?.key);
	}, [videos]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{!isLoading ?
				<>
					<div className='w-full h-[300px] rounded-lg overflow-hidden'>
						<img
							loading='lazy'
							className='w-full h-full object-cover'
							src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
							alt={`${details?.name} backdrop`}
						/>
					</div>
					<motion.div
						initial={{ y: -120 }}
						className='flex md:flex-row flex-col bg-accent p-4 rounded-md max-w-full w-[90%] gap-4 shadow-sm'
					>
						<div className='flex flex-col gap-3'>
							<img
								loading='lazy'
								className='rounded-lg min-w-[168px] h-[250px] self-center'
								src={`https://image.tmdb.org/t/p/w200/${details?.poster_path}`}
								alt={`${details?.name} poster`}
							/>
							<Button
								text={<p className='text-md font-semibold'>Watch trailer <FontAwesomeIcon size='lg' icon={faPlay} /></p>}
								onClick={() => {
									setModal(
										<Frame youtubeKey={trailerYoutubeKey} title={title} />
									);
									setOpen(true);
								}}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-primary-foreground text-xs'>{details?.tagline}</p>
							<h1 className='text-primary-foreground text-4xl font-semibold'> {title} </h1>
							<h1 className='text-primary-foreground text-md font-semibold'> {details?.name} </h1>
							<p className='text-primary-foreground text-md'> {details?.overview} </p>
							<h4 className='text-primary-foreground text-xs'> {`${details?.air_date?.split('-')[0]}`} </h4>
							<p className='text-primary-foreground text-xs'> {`${details?.episodes.length} episodes`} </p>
						</div>
					</motion.div>
				</> :
				<MovieSlugLoader />
			}
			<motion.div
				initial={{ marginTop: -120 }}
				className='flex md:flex-row flex-col bg-accent p-4 rounded-md max-w-full w-[90%] gap-4 shadow-sm'
			>
				{episodes ?
					<EpisodeSection
						episodes={episodes}
						seasonNumber={seasonNumber}
						showId={id}
						backdropPath={backdrop_path}
						title={title}
					/> : <LoadingMovieSection title='Episodes' />
				}
			</motion.div>
		</div>
	)
}

export default TvShowSeasonSlug;