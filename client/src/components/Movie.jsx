import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { ImageDummy, TitleDummy, YearDummy, GenresDummy } from './loaders/MovieLoaders';
import useAxios from '../hooks/useAxios';
import { fetchMovie } from '../helpers/api';

const Movie = ({ info }) => {
	const navigate = useNavigate();
	const api = useAxios();
	const [details, setDetails] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const getMovieDetails = async () => {
			try {
				setIsLoading(true);
				const data = await fetchMovie(api, info.id);
				setDetails(data);
			} catch (error) {
				setIsError(true);
				console.error('Error fetching movie details:', error);
			} finally {
				setIsLoading(false);
			}
		};

		getMovieDetails();
	}, [api, info.id]);

	const handleImageLoad = () => {
		const img = new Image();
		img.src = `https://image.tmdb.org/t/p/w500/${details?.poster_path}`;
		img.onload = () => setImageLoaded(true);
	};

	if (details && !imageLoaded) {
		handleImageLoad();
	}

	const handleClick = () => {
		if (details) {
			navigate(`/movies?id=${details.id}_${details.title}`);
		}
	};

	return (
		<div
			className='flex flex-col rounded-lg drop-shadow-sm gap-1 p-4 w-[200px] h-[370px]
        text-primary-foreground border border-secondary-accent
        hover:scale-95 hover:cursor-pointer duration-300'
			onClick={handleClick}
		>
			{imageLoaded ? (
				<img
					loading='lazy'
					className='rounded-md w-[200px] h-[250px] object-cover self-center'
					src={`https://image.tmdb.org/t/p/w200/${details?.poster_path}`}
					alt={`${info.title} poster`}
				/>
			) : (
				<ImageDummy />
			)}
			{isLoading ? (
				<>
					<TitleDummy />
					<YearDummy />
					<GenresDummy />
				</>
			) : isError ? (
				<p>Error loading details</p>
			) : (
				<>
					<h4 className='text-sm font-semibold line-clamp-2 text-ellipsis'>
						{details?.title}
					</h4>
					<h4 className='text-xs'>{details?.release_date?.split('-')[0]}</h4>
					<h4 className='text-xs'>
						{`${Math.floor(details?.runtime / 60)}h ${details?.runtime % 60}m`}
					</h4>
				</>
			)}
			{details && (
				<div className='absolute bottom-4 right-4'>
					<CircularProgress
						size='40px'
						color='var(--highlight)'
						trackColor='var(--bg-primary)'
						value={details.vote_average}
						max={10}
					>
						<CircularProgressLabel>{details.vote_average?.toFixed(1)}</CircularProgressLabel>
					</CircularProgress>
				</div>
			)}
		</div>
	);
};

export default Movie;
