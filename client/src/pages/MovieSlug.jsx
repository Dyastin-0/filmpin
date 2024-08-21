import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import AnimatedString from '../components/ui/AnimatedString';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import { Frame, getVideos } from '../components/MovieTrailer';
import { getDiscovery } from './DiscoverSlug';
import { MovieSection } from './Home';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';

const fetchMovie = async (token, id) => {
	try {
		const response = await axios.get(`/movies/details/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": 'application/json'
			}
		});

		return response.data;
	} catch (error) {
		console.error(`Failed to fetch details for ${id}`, error);
		return null;
	}
}

const MovieSlug = () => {
	const [searchParams] = useSearchParams();
	const { token } = useAuth();
	const { setLoading } = useLoading();
	const [movie, setMovie] = useState(null);
	const location = useLocation();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [videos, setVideos] = useState(null);
	const [similarMovies, setSimilarMovies] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const id = searchParams.get('id');

	useEffect(() => {
		if (movie) {
			setIsLoading(true);
			setLoading(true);
			const genres = movie.genres.map(genre => genre.name).join('_').toLowerCase();
			getDiscovery(token, genres, 'vote_count', 1).then(response => {
				setSimilarMovies(response.results);
				setIsLoading(false);
				setLoading(false);
			});
		}
	}, [movie]);

	useEffect(() => {
		if (token && id) {
			const stateMovie = location.state?.movie;
			if (!stateMovie) {
				fetchMovie(token, id.split('_')[0]).then(movie => setMovie(movie));
			} else {
				setMovie(stateMovie);
			}
		}
	}, [token, id]);

	useEffect(() => {
		if (movie) document.title = movie.title;
	}, [movie]);

	useEffect(() => {
		token && token && getVideos(id, token).then(videos => setVideos(videos.results));
	}, [id, token]);

	useEffect(() => {
		videos && setTrailerYoutubeKey(videos.find(video => video.type == 'Trailer')?.key);
	}, [videos]);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, [movie]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{ !isLoading ?
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
						className='flex md:flex-row flex-col bg-accent p-4 rounded-md max-w-full w-[90%] gap-4 shadow-sm'
					>
						<div className='flex flex-col gap-3'>
							<img
								loading='lazy'
								className='rounded-lg min-w-[168px] h-[250px] self-center'
								src={`https://image.tmdb.org/t/p/w200/${movie?.poster_path}`}
								alt={`${movie?.title} poster`}
							/>
							<Button
								text={<p className='text-md font-semibold'>Watch trailer <FontAwesomeIcon size='lg' icon={faPlay} /></p>}
								onClick={() => {
									setModal(
										<Frame youtubeKey={trailerYoutubeKey} title={movie.title} />
									);
									setOpen(true);
								}}
							/>
						</div>
						<div className='flex flex-col gap-2 w-full'>
							<AnimatedString text={movie?.tagline} />
							<h1 className='text-primary-foreground text-4xl font-semibold'> {movie?.title} </h1>
							<p className='text-primary-foreground text-md'> {movie?.overview} </p>
							<h4 className='text-primary-foreground text-xs'> {movie?.release_date.split('-')[0]} </h4>
							<div className='flex gap-1'>
								{
									movie?.genres.map((genre, index) => (
										<Link
											key={index}
											to={`/movies/discover?genres=${genre.name.toLowerCase()}&sort_by=vote_count&page=1`}
											className='underline underline-offset-2 text-primary-highlight text-xs'
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
				className='flex flex-col bg-accent rounded-lg gap-4 p-4 items-center w-[90%]'
			>
				{similarMovies ?
					<MovieSection title='Recommendations' movies={similarMovies?.filter(similarMovie => similarMovie.title !== movie.title)} />
					: <LoadingMovieSection title='Recommendations' />
				}
			</motion.div>
		</div>
	)
}

export default MovieSlug;