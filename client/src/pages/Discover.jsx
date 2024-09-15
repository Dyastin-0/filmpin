import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAxios from '../hooks/useAxios';
import { useLoading } from '../components/hooks/useLoading';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies, fetchShows } from '../helpers/api';

const Discover = () => {
	const api = useAxios();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [imageIndex, setImageIndex] = useState(0);
	const [isMovieHovered, setIsMovieHovered] = useState(true);

	const { data: movies = [], isLoading: isMoviesLoading } = useQuery({
		queryKey: ['movies', 'mostVoted'],
		queryFn: () => fetchMovies(api),
	});

	const { data: shows = [], isLoading: isShowsLoading } = useQuery({
		queryKey: ['shows', 'mostVoted'],
		queryFn: () => fetchShows(api),
	});

	useEffect(() => {
		document.title = 'Discover';
	}, []);

	useEffect(() => {
		const activeList = isMovieHovered ? movies : shows;
		if (activeList.length > 0) {
			const intervalId = setInterval(() => {
				setImageIndex((prevIndex) => (prevIndex + 1) % activeList.length);
			}, 3000);

			return () => clearInterval(intervalId);
		}
	}, [movies, shows, isMovieHovered]);

	useEffect(() => {
		setLoading(isMoviesLoading || isShowsLoading);
	}, [isMoviesLoading, isShowsLoading, setLoading]);

	const backdrop = isMovieHovered ? movies[imageIndex]?.backdrop_path : shows[imageIndex]?.backdrop_path;

	return (
		<div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
			<div className='relative flex h-full w-full justify-center rounded-lg bg-accent gap-4'>
				<AnimatePresence>
					{backdrop && (
						<motion.img
							key={backdrop}
							src={`https://image.tmdb.org/t/p/original/${backdrop}`}
							className='absolute w-full h-full z-10 rounded-lg object-cover'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 1 }}
						/>
					)}
				</AnimatePresence>
				<div className='flex rounded-md p-2 gap-2 z-20 bg-accent self-center'>
					<Button
						text='TV Shows'
						className={`text-xl ${!isMovieHovered ? 'hover:shadow-[var(--highlight)_0_0_0_2px] shadow-[var(--highlight)_0_0_0_2px]' : ''}`}
						onClick={() => navigate('/discover/tvshows')}
						onMouseEnter={() => setIsMovieHovered(false)}
					/>
					<Button
						text='Movies'
						className={`text-xl ${isMovieHovered ? 'hover:shadow-[var(--highlight)_0_0_0_2px] shadow-[var(--highlight)_0_0_0_2px]' : ''}`}
						onClick={() => navigate('/discover/movies')}
						onMouseEnter={() => setIsMovieHovered(true)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Discover;
