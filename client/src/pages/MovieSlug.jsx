import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { MovieSection } from '../components/sections/MovieSection';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import useAxios from '../hooks/useAxios';
import Cast from '../components/Cast';
import Crew from '../components/Crew';
import CastSection from '../components/sections/CastSection';
import CrewSection from '../components/sections/CrewSection';
import { ClipSection } from '../components/sections/ClipSection';

const MovieSlug = () => {
	const [searchParams] = useSearchParams();
	const api = useAxios();
	const { setLoading } = useLoading();
	const [movie, setMovie] = useState(null);
	const location = useLocation();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const [casts, setCasts] = useState(null);
	const [crews, setCrews] = useState(null);
	const writers = crews?.filter(crew => crew.job === 'Writer');
	const [similarMovies, setSimilarMovies] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const id = searchParams.get('id');

	const getVideos = async (id) => {
		try {
			const videos = await api.get(`/movies/videos?movie_id=${id}`);
			return videos.data;
		} catch (error) {
			console.error(`Failed to get videos for movie with id '${id}'`, error);
		}
	}

	const getCredits = async (id) => {
		try {
			const credits = await api.get(`/movies/credits?movie_id=${id}`);
			return credits.data;
		} catch (error) {
			console.error(`Failed to get credits for ${id}`, error);
		}
	}

	const fetchMovie = async (id) => {
		try {
			const response = await api.get(`/movies/details?movie_id=${id}`);
			return response.data;
		} catch (error) {
			console.error(`Failed to fetch details for ${id}`, error);
			return null;
		}
	}

	const getDiscovery = async (genres, sortBy, page) => {
		try {
			const response = await api.get(`/movies/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`);
			return response.data;
		} catch (error) {
			console.error('Failed to get discovery.', error);
		}
	};

	useEffect(() => {
		if (movie) {
			if (movie) document.title = movie.title;
			setIsLoading(true);
			setLoading(true);
			const genres = movie.genres.map(genre => genre.name).join('_').toLowerCase();
			getDiscovery(genres, 'vote_count', 1).then(response => {
				setSimilarMovies(response.results);
				setIsLoading(false);
				setLoading(false);
			});
			getCredits(movie.id).then(credits => {
				setCasts(credits.cast);
				setCrews(credits.crew);
			});
		}
	}, [movie]);

	useEffect(() => {
		if (id) {
			id && getVideos(id).then(videos => setVideos(videos.results));
			const stateMovie = location.state?.details;
			console.log(stateMovie)
			if (!stateMovie) {
				fetchMovie(id.split('_')[0]).then(movie => setMovie(movie));
			} else {
				setMovie(stateMovie);
			}
		}
	}, [id]);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type == 'Trailer')?.key);
	}, [videos]);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, [movie]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{movie ?
				<>
					<div className='w-full h-[300px] rounded-lg overflow-hidden'>
						<img
							loading='lazy'
							className='w-full h-full object-cover'
							src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
							alt={`${movie?.title} backdrop`}
						/>
					</div>
					<motion.div
						initial={{ y: -120 }}
						className='flex md:flex-row flex-col bg-accent p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4 shadow-sm'
					>
						<div className='flex flex-col w-fit self-center gap-3'>
							<img
								loading='lazy'
								className='rounded-lg min-w-[168px] h-[250px] self-center'
								src={`https://image.tmdb.org/t/p/w200/${movie?.poster_path}`}
								alt={`${movie?.title} poster`}
							/>
							<Button
								text={<p className='text-md font-semibold'> <FontAwesomeIcon size='lg' icon={faPlay} /> Watch trailer </p>}
								onClick={() => {
									setModal(
										<Frame youtubeKey={trailerYoutubeKey} title={movie.title} />
									);
									setOpen(true);
								}}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<p className='text-primary-foreground text-xs'>{movie?.tagline}</p>
							<h1 className='text-primary-foreground text-4xl font-semibold'> {movie?.title} </h1>
							<p className='text-primary-foreground text-sm'> {movie?.overview} </p>
							<h4 className='text-primary-foreground text-xs'> {movie?.release_date.split('-')[0]} </h4>
							<div className='flex gap-1'>
								{
									movie?.genres.map((genre, index) => (
										<Link
											key={index}
											to={`/discover/movies?genres=${genre.name.toLowerCase()}&sort_by=vote_count&page=1`}
											className='underline outline-none underline-offset-2 text-primary-highlight text-xs'
										>
											{`${index === movie?.genres.length - 1 ? genre.name : `${genre.name},`}`}
										</Link>
									)
									)
								}
							</div>
							<p className='text-primary-foreground text-xs'> {`${Math.floor(movie?.runtime / 60)}h ${movie?.runtime % 60}m`} </p>
						</div>
					</motion.div>
				</> :
				<MovieSlugLoader />
			}
			<motion.div
				initial={{ marginTop: -120 }}
				className='flex flex-col bg-accent rounded-lg gap-4 p-4 w-[calc(100%-2rem)] overflow-hidden'
			>
				<h1 className='text-primary-foreground text-sm font-semibold'> Credits </h1>
				<h1 className='text-primary-foreground text-xs font-semibold'> Director </h1>
				{crews &&
					crews.map((crew, index) => crew.job === 'Director' && <Crew info={crew} key={index} />)
				}
				{writers && writers.length > 0 && (
					<>
						<h1 className='text-primary-foreground text-xs font-semibold'> Writer </h1>
						<div className='flex flex-wrap gap-4'>
							{writers.map((writer, index) => (
								<Crew info={writer} key={index} />
							))}
						</div>
					</>
				)}
				<h1 className='text-primary-foreground text-xs font-semibold'> Popular cast </h1>
				{casts &&
					<div className='flex flex-wrap gap-4'>
						<Cast info={casts[0]} />
					</div>
				}
				<CastSection title='Full cast' casts={casts} />
				<CrewSection title='Full crew' crews={crews} />
			</motion.div>
			<div className='flex flex-col bg-accent rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]'>
				{similarMovies ?
					<MovieSection title='Recommendations' movies={similarMovies?.filter(similarMovie => similarMovie.title !== movie.title)} />
					: <LoadingMovieSection title='Recommendations' />
				}
			</div>
			<div className='flex flex-col bg-accent rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]'>
				<ClipSection keys={videos?.map((video) => {
					return { name: video.name, value: video.key }
				})}
					title='Videos'
				/>
			</div>
		</div>
	)
}

export default MovieSlug;
