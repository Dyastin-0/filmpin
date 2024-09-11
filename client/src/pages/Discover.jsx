import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useAxios from '../hooks/useAxios';
import { useLoading } from '../components/hooks/useLoading';

const Discover = () => {
	const api = useAxios();
	const { setLoading } = useLoading();
	const navigate = useNavigate();
	const [movies, setMovies] = useState([]);
	const [shows, setShows] = useState([]);
	const [imageIndex, setImageIndex] = useState(0);
	const [isMovieHovered, setIsMovieHovered] = useState(true);

	useEffect(() => {
		document.title = 'Discover';
		const fetchMostVoted = async () => {
			setLoading(true);
			try {
				const [moviesResponse, showsResponse] = await Promise.all([
					api.get('/movies/discover?genres=[]&sort_by=vote_count&page=1'),
					api.get('/tvshows/discover?genres=[]&sort_by=vote_count&page=1')
				]);
				setMovies(moviesResponse.data.results);
				setShows(showsResponse.data.results);
			} catch (error) {
				console.error('Failed to fetch top movies and shows.', error);
			} finally {
				setLoading(false);
			}
		};
		fetchMostVoted();
	}, [api, setLoading]);

	useEffect(() => {
		const activeList = isMovieHovered ? movies : shows;
		if (activeList.length > 0) {
			const intervalId = setInterval(() => {
				setImageIndex((prevIndex) => (prevIndex + 1) % activeList.length);
			}, 3000);

			return () => clearInterval(intervalId);
		}
	}, [movies, shows, isMovieHovered]);

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
