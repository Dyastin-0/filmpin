import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { ImageDummy, TitleDummy, YearDummy, GenresDummy } from './loaders/MovieLoaders';

const Episode = ({ info, showId, title, backdropPath, seasonNumber }) => {
	const navigate = useNavigate();
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = `https://image.tmdb.org/t/p/w500/${info.still_path}`;
		img.onload = () => {
			setImageLoaded(true);
		};
	}, []);

	const handleClick = () => {
		navigate(`/tvshows/${showId}/${seasonNumber}/episode?id=${showId}_${info.name}&season_number=${seasonNumber}&title=${title}&episode_number=${info.episode_number}&backdrop_path=${backdropPath}`,
			{
				state: {
					details: info
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
						src={`https://image.tmdb.org/t/p/w500/${info.still_path}`}
						alt={`${title} ${info.name} poster`}
					/> :
					<ImageDummy />
			}
			{
				info ?
					<>
						<h4 className='text-sm font-semibold line-clamp-2 text-ellipsis'> {info.name} </h4>
						<h4 className='text-xs'> {info.air_date?.split('-')[0]} </h4>
						<h4 className='text-xs'> {`${Math.floor(info?.runtime / 60)}h ${info?.runtime % 60}m`} </h4>
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
					value={info.vote_average}
					max={10}
				>
					<CircularProgressLabel>{info.vote_average?.toFixed(1)}</CircularProgressLabel>
				</CircularProgress>
			</div>
		</motion.div>
	)
}

export default Episode;