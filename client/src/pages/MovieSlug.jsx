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
import useSWR from 'swr';
import { Helmet } from 'react-helmet';

const MovieSlug = () => {
	const [searchParams] = useSearchParams();
	const { api, isAxiosReady } = useAxios();
	const { setModal, setOpen } = useModal();
	const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

	const id = searchParams.get('id').split('_')[0];

	const { data: details, isLoading: isDetailsLoading
	} = useSWR(isAxiosReady ? `/movies/details?movie_id=${id}` : null,
		() => fetchMovie(api, id)
	);

	const genres = details?.genres.map(genre => genre.name.toLowerCase()).join('_');

	const { data: similarMovies, isLoading: isDiscoverLoading
	} = useSWR(
		isAxiosReady && details ? `/movies/discover?genres=${genres}&sort_by=vote_count&page=1` : null,
		() => fetchDiscovery(api, 'movies', genres)
	);

	const { data: videos, isLoading: isVideosLoading
	} = useSWR(
		isAxiosReady ? `/movies/videos?movie_id=${id}` : null,
		() => fetchVideos(api, 'movies', 'movie_id', id), {
			onSuccess: (data) => setTrailerYoutubeKey(data.find((video) => video.type === 'Trailer').key)
		}
	);

	const { data: credits, isLoading: isCreditsLoading
	} = useSWR(
		isAxiosReady ? `/movies/credits?movie_id=${id}` : null,
		() => fetchCredits(api, 'movies', id)
	);

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}, [details]);

	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			<Helmet>
				<title>{details?.title}</title>
			</Helmet>
			{!details ? (
				<MovieSlugLoader />
			) : (
				<>
					<div className="relative w-full h-[400px] rounded-md overflow-hidden">
						<div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
						<img
							loading="lazy"
							className="w-full h-full object-cover rounded-md"
							src={`https://image.tmdb.org/t/p/original/${details.backdrop_path}`}
							alt={`${details.title} backdrop`}
						/>
					</div>
					<motion.div
						initial={{ y: -120 }}
						className="flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4"
					>
						<div className="flex flex-col w-fit self-center gap-3">
							<img
								loading="lazy"
								className="rounded-lg min-w-[168px] h-[250px] self-center"
								src={`https://image.tmdb.org/t/p/w200/${details.poster_path}`}
								alt={`${details.title} poster`}
							/>
							<Button
								text={
									<p className="text-md font-semibold">
										<FontAwesomeIcon size="lg" icon={faPlay} /> Watch trailer
									</p>
								}
								onClick={() => {
									setModal(<Frame youtubeKey={trailerYoutubeKey} title={details.title} />);
									setOpen(true);
								}}
							/>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<p className="text-primary-foreground text-xs">{details.tagline}</p>
							<h1 className="text-primary-foreground text-4xl font-semibold">{details?.title}</h1>
							<p className="text-primary-foreground text-sm">{details.overview}</p>
							<h4 className="text-primary-foreground text-xs">{details.release_date.split('-')[0]}</h4>
							<div className="flex gap-1">
								{details.genres.map((genre, index) => (
									<Link
										key={index}
										to={`/discover/movies?genres=${genre.name.toLowerCase()}&sort_by=vote_count&page=1`}
										className="underline outline-none underline-offset-2 text-primary-highlight text-xs"
									>
										{`${index === details?.genres.length - 1 ? genre.name : `${genre.name},`}`}
									</Link>
								))}
							</div>
							<p className="text-primary-foreground text-xs">
								{`${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`}
							</p>
							<Button
								text="Add to list"
								icon={<FontAwesomeIcon icon={faPlus} />}
								className="w-fit"
								onClick={() => {
									setModal(<AddToList selected={details} type="Movies" />);
									setOpen(true);
								}}
							/>
						</div>
					</motion.div>
				</>
			)}
			<motion.div
				initial={{ marginTop: -120 }}
				className="flex flex-col rounded-lg gap-4 p-4 w-[calc(100%-2rem)] overflow-hidden"
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
			<div className="flex flex-col rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]">
				{similarMovies ? (
					<MovieSection
						title="Recommendations"
						movies={similarMovies.results.filter(similarMovie => similarMovie.title !== details.title)}
					/>
				) : (
					<LoadingMovieSection title="Recommendations" />
				)}
			</div>
			<div className="flex flex-col rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]">
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
