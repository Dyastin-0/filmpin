import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const Movie = ({info}) => {
	const { token } = useAuth();

	const [details, setDetails] = useState({});
	
	useEffect(() => {
		const getDetails = async () => {
			try {
				const response = await axios.get(`/movies/details/${info.id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": 'application/json'
					}
				});
				console.log(response.data);
				setDetails(response.data);
			} catch (error) {
				console.error(error);
			}	
		}
		getDetails();
	}, []);
		
	return (	
		<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-2 w-[200px] h-[350px]
			text-primary-foreground bg-secondary
			transition-transform
			hover:scale-95 hover:cursor-pointer mouse-in
			'>
			<img className='rounded-md w-[200px] h-[250px] object-cover self-center' src={`https://image.tmdb.org/t/p/w200/${details.poster_path}`} alt={`${details.original_title} poster`} />
			<h4 className='text-md font-semibold'> {details.original_title} </h4>
			<h4 className='text-sm' >{details.release_date?.split('-')[0]}</h4>
			<h4 className='text-xs'>{ `${details.runtime} minutes` }</h4>
		</motion.div>
	)
}

export default Movie