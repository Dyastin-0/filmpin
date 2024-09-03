import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { ImageDummy, TitleDummy, YearDummy, GenresDummy } from './loaders/MovieLoaders';

const fetchDetails = async (token, id) => {
	try {
		const response = await axios.get(`/tvshows/details?show_id=${id}`, {
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

const TvShow = ({ info }) => {
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
		navigate(`/tvshows?id=${details.id}_${details.name}`,
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
				details.name ?
					<>
						<h4 className='text-sm font-semibold line-clamp-2 text-ellipsis'> {details.name} </h4>
						<h4 className='text-xs'> {`${details.first_air_date?.split('-')[0]}-${details.last_air_date?.split('-')[0]}`} </h4>
						<h4 className='text-xs'> {`${details.number_of_seasons} seasons`} </h4>
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

export default TvShow;
