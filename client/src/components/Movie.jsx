import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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

	useEffect(() => {
		fetchDetails(token, info.id).then(details => setDetails(details))
	}, []);

	const handleClick = () => {
		navigate(`/movies/${info.original_title.toLowerCase().replace(' ', '_')}`, { state: {movie: details} });
	}

	return (	
		<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-4 w-[200px] h-[370px]
			text-primary-foreground bg-accent
			hover:scale-95 hover:cursor-pointer duration-300'
			onClick={handleClick}
		>
			<img
				loading='lazy'
				className='rounded-md w-[200px] h-[250px] object-cover self-center'
				src={`https://image.tmdb.org/t/p/w200/${details.poster_path}`}
				alt={`${info.original_title} poster`}
			/>
			<h4 className='text-md font-semibold'> {details.original_title} </h4>
			<h4 className='text-sm' > {details.release_date?.split('-')[0]} </h4>
			<h4 className='text-xs'> { `${details.runtime} minutes` } </h4>
		</motion.div>
	)
}

const blinkVariants = {
  blink: {
    backgroundColor: ['var(--bg-primary)', 'var(--bg-secondary)'],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'reverse',
    }
  }
};

export const MovieDummy = () => {
	return (
    <motion.div className='flex flex-col rounded-md drop-shadow-sm gap-2 p-4 w-[200px] h-[370px]
      text-primary-foreground bg-accent
      hover:scale-95 hover:cursor-pointer duration-300'>
 			<motion.div className='rounded-md w-full h-[250px] bg-secondary' variants={blinkVariants} animate='blink' />
      <motion.div className='rounded-md w-full h-[20px] bg-secondary' variants={blinkVariants} animate='blink' />
      <motion.div className='rounded-md w-1/2 h-[15px] bg-secondary' variants={blinkVariants} animate='blink' />
      <motion.div className='rounded-md w-1/3 h-[10px] bg-secondary' variants={blinkVariants} animate='blink' />
		</motion.div>
	);
}

export default Movie;