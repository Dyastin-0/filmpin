import  Button  from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAxios from '../hooks/useAxios';

const Discover = () => {
	const api = useAxios();
	const navigate = useNavigate();
	const [movies, setMovies] = useState([]);
	const [shows, setShows] = useState([]);
	const [imageIndex, setImageIndex] = useState(0);
	const [isMovieHovered, setIsMovieHovered] = useState(false);

	const getMostVoted = async (category) => {
		try {
			const response = await api.get(`/${category}/discover?genres=[]&sort_by=vote_count&page=1`);
			return response.data;
		} catch (error) {
			console.error('Failed to get top movies.', error);
		}
	}

	useEffect(() => {
		getMostVoted('tvshows').then((response) => {
			setShows(response.results);
		})
		getMostVoted('movies').then((response) => {
			setMovies(response.results);
		})
	}, []);

	useEffect(() => {
		if ((isMovieHovered ? movies : shows)?.length > 0) {
			const intervalId = setInterval(() => {
				setImageIndex((prevIndex) => (prevIndex + 1) % (isMovieHovered ? movies.length : shows.length));
			}, 3000);

			return () => clearInterval(intervalId);
		}
	}, [movies, shows, isMovieHovered]);

	const backdrop = isMovieHovered ?
		movies[imageIndex]?.backdrop_path
		: shows[imageIndex]?.backdrop_path;

	return (
<div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
			<h1 className='text-primary-foreground text-md font-bold'> Discover movies and TV shows </h1>
			<div className='relative flex h-full w-full justify-center rounded-lg bg-accent gap-4'>
				<AnimatePresence>
					<motion.img
						key={backdrop}
						src={`https://image.tmdb.org/t/p/original/${backdrop}`}
						className='absolute w-full h-full z-10 rounded-lg object-cover'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 1 }}
					/>
				</AnimatePresence>
				<div className='flex rounded-md p-2 gap-2 z-20 bg-accent self-center'>
					<Button
						text='TV Shows'
						className={`text-xl ${isMovieHovered ? 'bg-accent text-primary-foreground' : 'bg-primary-highlight text-primary-highlight-foreground'}`}
						onClick={() => navigate('/discover/tvshows')}
						onMouseEnter={() => setIsMovieHovered(false)}
					/>
					<Button
						text='Movies'
						className={`text-xl ${isMovieHovered ? 'bg-primary-highlight text-primary-highlight-foreground' : 'bg-accent text-primary-foreground'}`}
						onClick={() => navigate('/discover/movies')}
						onMouseEnter={() => setIsMovieHovered(true)}
					/>
				</div>
			</div>
		</div>
	)
}

export default Discover;