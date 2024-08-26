import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import { Frame } from '../components/MovieTrailer';
import { TvShowSection } from '../components/sections/tvShowSection';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import useAxios from '../hooks/useAxios';

const TvShowSlug = () => {
	const [searchParams] = useSearchParams();
	const api = useAxios();
	const { setLoading } = useLoading();
	const [show, setShow] = useState(null);
	const location = useLocation();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const [similarShows, setSimilarShows] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const id = searchParams.get('id');

	const fetchShow = async (id) => {
		try {
			const response = await api.get(`/tvshows/details?show_id=${id}`);
			return response.data;
		} catch (error) {
			console.error(`Failed to fetch details for ${id}`, error);
			return null;
		}
	}

	const getVideos = async (id) => {
		try {
			const videos = await api.get(`/tvshows/videos?show_id=${id}`);
			return videos.data;
		} catch (error) {
			console.error(`Failed to get videos for show with id '${id}'`, error);
		}
	}

	const getDiscovery = async (genres, sortBy, page) => {
		try {
			const response = await api.get(`/tvshows/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`);
			return response.data;
		} catch (error) {
			console.error('Failed to get discovery.', error);
		}
	};

	const getSeasons = async (showId ,numberOfSeasons) => {
		try {
			const response = await api.get(`/tvshows/season?tvshow_id=${showId}&season_number=${numberOfSeasons}`);
			console.log(response.data);
			return response.data;
		} catch (error) {
			console.log('Failed to get seasons', error);
		}
	} 

	useEffect(() => {
		if (show) {
			setIsLoading(true);
			setLoading(true);
			const genres = show.genres.map(genre => genre.name).join('_').toLowerCase();
			getDiscovery(genres, 'vote_count', 1).then(response => {
				setSimilarShows(response.results);
				setIsLoading(false);
				setLoading(false);
			});
			getSeasons(show.id ,show.number_of_seasons);
		}
	}, [show]);

	useEffect(() => {
		if (id) {
			const stateShow = location.state?.show;
			if (!stateShow) {
				fetchShow(id.split('_')[0]).then(show => setShow(show));
			} else {
				setShow(stateShow);
			}
		}
	}, [id]);

	useEffect(() => {
		if (show) document.title = show.name; //state missing
	}, [show]);

	useEffect(() => {
		id && getVideos(id).then(videos => setVideos(videos.results));
	}, [id]);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type == 'Trailer')?.key);
	}, [videos]);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, [show]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{!isLoading ?
				<>
					<div className='w-full h-[300px] rounded-lg overflow-hidden'>
						<img
							loading='lazy'
							className='w-full h-full object-cover'
							src={`https://image.tmdb.org/t/p/original/${show?.backdrop_path}`}
							alt={`${show?.title} backdrop`}
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
								src={`https://image.tmdb.org/t/p/w200/${show?.poster_path}`}
								alt={`${show?.title} poster`}
							/>
							<Button
								text={<p className='text-md font-semibold'>Watch trailer <FontAwesomeIcon size='lg' icon={faPlay} /></p>}
								onClick={() => {
									setModal(
										<Frame youtubeKey={trailerYoutubeKey} title={show.title} />
									);
									setOpen(true);
								}}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-primary-foreground text-xs'>{show?.tagline}</p>
							<h1 className='text-primary-foreground text-4xl font-semibold'> {show?.name} </h1>
							<p className='text-primary-foreground text-md'> {show?.overview} </p>
							<h4 className='text-primary-foreground text-xs'> {`${show.first_air_date?.split('-')[0]}-${show.last_air_date?.split('-')[0]}`} </h4>
							<div className='flex gap-1'>
								{
									show?.genres.map((genre, index) => (
										<Link
											key={index}
											to={`/discover/tvshows?genres=${genre.name.toLowerCase()}&sort_by=vote_count&page=1`}
											className='underline outline-none underline-offset-2 text-primary-highlight text-xs'
										>
											{`${index === show?.genres.length - 1 ? genre.name : `${genre.name},`}`}
										</Link>
									)
									)
								}
							</div>
							<p className='text-primary-foreground text-xs'> {`${show.number_of_seasons} seasons, ${show.number_of_episodes} episodes`} </p>
						</div>
					</motion.div>
				</> :
				<MovieSlugLoader />
			}
			<motion.div
				initial={{ marginTop: -120 }}
				className='flex flex-col bg-accent rounded-lg gap-4 p-4 w-[90%]'
			>
				<h1 className='text-primary-foreground pb-4 text-start text-sm font-semibold'>Seasons</h1>

			</motion.div>
			<motion.div
				className='flex flex-col bg-accent rounded-lg gap-4 p-4 items-center w-[90%]'
			>
				{similarShows ?
					<TvShowSection title='Recommendations' shows={similarShows.filter(similarShow => similarShow.name !== show.name)} />
					: <LoadingMovieSection title='Recommendations' />
				}
			</motion.div>
		</div>
	)
}

export default TvShowSlug;