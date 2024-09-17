import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { MovieSection } from '../components/sections/MovieSection';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import Cast from '../components/Cast';
import Crew from '../components/Crew';
import CastSection from '../components/sections/CastSection';
import CrewSection from '../components/sections/CrewSection';
import { ClipSection } from '../components/sections/ClipSection';
import AddToList from '../components/AddToList';
import useAxios from '../hooks/useAxios';
import { fetchCredits, fetchDiscovery, fetchMovie, fetchVideos } from '../helpers/api';

const MovieSlug = () => {
	const [searchParams] = useSearchParams();
	const api = useAxios();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);
	const [movie, setMovie] = useState(null);
	const [videos, setVideos] = useState(null);
	const [credits, setCredits] = useState(null);
	const [similarMovies, setSimilarMovies] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);

	const id = searchParams.get('id').split('_')[0];

	useEffect(() => {
		const loadData = async () => {
			try {
				const movieData = await fetchMovie(api, id);
				setMovie(movieData);

				const videosData = await fetchVideos(api, 'movies', 'movie_id', id);
				setVideos(videosData);

				const creditsData = await fetchCredits(api, 'movies', id);
				setCredits(creditsData);

				const genres = movieData.genres.map(genre => genre.name.toLowerCase()).join('_');
				const similarMoviesData = await fetchDiscovery(api, 'movies', genres, 'vote_count', 1);
				setSimilarMovies(similarMoviesData);

				const trailer = videosData.find(video => video.type === 'Trailer');
				setTrailerYoutubeKey(trailer?.key);

			} catch (error) {
				setIsError(true);
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [id, api]);

	const handleAddToList = () => {
		setModal(<AddToList selected={movie} type="Movies" />);
		setOpen(true);
	};

	useEffect(() => {
		if (movie) {
			document.title = movie.title;
			window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
		}
	}, [movie]);

	if (isError) return <div>Error loading data.</div>;

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			{isLoading ? (
				<MovieSlugLoader />
			) : (
				<>
					<div className="w-full h-[300px] rounded-lg overflow-hidden">
						<img
							loading="lazy"
							className="w-full h-full object-cover"
							src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
							alt={`${movie?.title} backdrop`}
						/>
					</div>
					<motion.div
						initial={{ y: -120 }}
						className="flex md:flex-row flex-col bg-accent p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4 shadow-sm"
					>
						<div className="flex flex-col w-fit self-center gap-3">
							<img
								loading="lazy"
								className="rounded-lg min-w-[168px] h-[250px] self-center"
								src={`https://image.tmdb.org/t/p/w200/${movie?.poster_path}`}
								alt={`${movie?.title} poster`}
							/>
							<Button
								text={
									<p className="text-md font-semibold">
										<FontAwesomeIcon size="lg" icon={faPlay} /> Watch trailer
									</p>
								}
								onClick={() => {
									setModal(<Frame youtubeKey={trailerYoutubeKey} title={movie.title} />);
									setOpen(true);
								}}
							/>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<p className="text-primary-foreground text-xs">{movie?.tagline}</p>
							<h1 className="text-primary-foreground text-4xl font-semibold">{movie?.title}</h1>
							<p className="text-primary-foreground text-sm">{movie?.overview}</p>
							<h4 className="text-primary-foreground text-xs">{movie?.release_date.split('-')[0]}</h4>
							<div className="flex gap-1">
								{movie?.genres.map((genre, index) => (
									<Link
										key={index}
										to={`/discover/movies?genres=${genre.name.toLowerCase()}&sort_by=vote_count&page=1`}
										className="underline outline-none underline-offset-2 text-primary-highlight text-xs"
									>
										{`${index === movie?.genres.length - 1 ? genre.name : `${genre.name},`}`}
									</Link>
								))}
							</div>
							<p className="text-primary-foreground text-xs">
								{`${Math.floor(movie?.runtime / 60)}h ${movie?.runtime % 60}m`}
							</p>
							<Button
								text="Add to list"
								icon={<FontAwesomeIcon icon={faPlus} />}
								className="w-fit"
								onClick={handleAddToList}
							/>
						</div>
					</motion.div>
				</>
			)}
			<motion.div
				initial={{ marginTop: -120 }}
				className="flex flex-col bg-accent rounded-lg gap-4 p-4 w-[calc(100%-2rem)] overflow-hidden"
			>
				<h1 className="text-primary-foreground text-sm font-semibold">Credits</h1>
				<h1 className="text-primary-foreground text-xs font-semibold">Director</h1>
				{credits?.crew
					.filter(crew => crew.job === 'Director')
					.map((crew, index) => (
						<Crew info={crew} key={index} />
					))}
				{credits?.crew.filter(crew => crew.job === 'Writer').length > 0 && (
					<>
						<h1 className="text-primary-foreground text-xs font-semibold">Writer</h1>
						<div className="flex flex-wrap gap-4">
							{credits?.crew
								.filter(crew => crew.job === 'Writer')
								.map((writer, index) => (
									<Crew info={writer} key={index} />
								))}
						</div>
					</>
				)}
				<h1 className="text-primary-foreground text-xs font-semibold">Popular cast</h1>
				<div className="flex flex-wrap gap-4">
					{credits?.cast.slice(0, 1).map((cast, index) => (
						<Cast info={cast} key={index} />
					))}
				</div>
				<CastSection title="Full cast" casts={credits?.cast} />
				<CrewSection title="Full crew" crews={credits?.crew} />
			</motion.div>
			<div className="flex flex-col bg-accent rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]">
				{similarMovies ? (
					<MovieSection
						title="Recommendations"
						movies={similarMovies.results.filter(similarMovie => similarMovie.title !== movie?.title)}
					/>
				) : (
					<LoadingMovieSection title="Recommendations" />
				)}
			</div>
			<div className="flex flex-col bg-accent rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]">
				<ClipSection
					title={'Videos'}
					keys={videos?.map((video) => ({
						name: video.name,
						value: video.key
					}))}
				/>
			</div>
		</div>
	);
};

export default MovieSlug;
