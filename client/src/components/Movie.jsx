import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { MovieDummy, ImageDummy } from './loaders/MovieLoaders';

const fetchDetails = async (token, id) => {
	try {
		const response = await axios.get(`/movies/details/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": 'application/json'
			}
		});

		return response.data;
	} catch (error) {
		console.error(`Failed to fetch details for ${id}` ,error);
		return null;
	}
}

const Movie = ({info}) => {
	const navigate = useNavigate();
	const { token } = useAuth();
	const [details, setDetails] = useState({});
	const [imageLoaded, setImageLoaded] = useState(false);

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
		if (token) {
			fetchDetails(token, info.id).then(details => setDetails(details));
		}
	}, [token, info.id]);

	const handleClick = () => {
		navigate(`/movies/${details.id}_${details.title}`, { state: {movie: details} });
	}

	return (	
		details ? <motion.div className='flex flex-col rounded-lg drop-shadow-sm gap-1 p-4 w-[200px] h-[370px]
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
			onClick={handleClick}
		>
			{
				imageLoaded ? 
				<img
					className='rounded-md w-[200px] h-[250px] object-cover self-center'
					src={`https://image.tmdb.org/t/p/w500/${details.poster_path}`}
					alt={`${info.original_title} poster`}
				/> : 
				<ImageDummy />
			}
			<h4 className='text-md font-semibold'> {details.original_title} </h4>
			<h4 className='text-sm'> {details.release_date?.split('-')[0]} </h4>
			<h4 className='text-xs'> { `${details.runtime} minutes` } </h4>
			<div className='absolute bottom-4 right-4'>
				<CircularProgress 
					size='40px' 
					color='var(--highlight)' 
					value={details.vote_average} 
					max={10}
				>
					<CircularProgressLabel>{details.vote_average?.toFixed(1)}</CircularProgressLabel>
				</CircularProgress>
			</div>
		</motion.div> : <MovieDummy />
	)
}

export default Movie;
