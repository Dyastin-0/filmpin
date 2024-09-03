import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { ImageDummy, TitleDummy, YearDummy, GenresDummy } from './loaders/MovieLoaders';
import useAxios from '../hooks/useAxios';

const Movie = ({ info }) => {
	const navigate = useNavigate();
	const api = useAxios();
	const [details, setDetails] = useState({});
	const [imageLoaded, setImageLoaded] = useState(false);

	const fetchDetails = async (id) => {
		try {
			const response = await api.get(`/movies/details?movie_id=${id}`);
			return response.data;
		} catch (error) {
			console.error(`Failed to fetch details for ${id}`, error);
			return null;
		}
	}

	useEffect(() => {
		if (details) {
			const img = new Image();
			img.src = `https://image.tmdb.org/t/p/w500/${details.poster_path}`;
			img.onload = () => {
				setImageLoaded(true);
			};
		}
	}, [details]);

	useEffect(() => {
		fetchDetails(info.id).then(details => setDetails(details));
	}, []);

	const handleClick = () => {
		navigate(`/movies?id=${details.id}_${details.title}`,
			{
				state: {
					details: details
				}
			});
	}

	return (
		<motion.div className='flex flex-col rounded-lg drop-shadow-sm gap-1 p-4 w-[200px] h-[370px]
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
			onClick={handleClick}
		>
			{
				imageLoaded ?
					<img
						loading='lazy'
						className='rounded-md w-[200px] h-[250px] object-cover self-center'
						src={`https://image.tmdb.org/t/p/w200/${details.poster_path}`}
						alt={`${info.title} poster`}
					/> :
					<ImageDummy />
			}
			{
				details.title ?
					<>
						<h4 className='text-sm font-semibold line-clamp-2 text-ellipsis'> {details.title} </h4>
						<h4 className='text-xs'> {details.release_date?.split('-')[0]} </h4>
						<h4 className='text-xs'> {`${Math.floor(details?.runtime / 60)}h ${details?.runtime % 60}m`} </h4>
					</> :
					<>
						<TitleDummy />
						<YearDummy />
						<GenresDummy />
					</>
			}
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
		</motion.div>
	)
}

export default Movie;
