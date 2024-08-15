import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import AnimatedString from '../components/ui/AnimatedString';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const MovieSlug = () => {
	const { token } = useAuth();
	const [movie, setMovie] = useState();
  const location = useLocation();
  const { title } = useParams();

  useEffect(() => {
		const stateMovie = location.state?.movie;
		if (!stateMovie) {
			const getMovie = async () => {
				const movieTitle = title.replace(/_/g, '+');
				document.title = movieTitle;
				try {
					const response = await axios.get(`/movies/search/${movieTitle}`, { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'application/json' } });
					console.log(response);
				} catch (error) {
					console.error('Failed to fetch movie.', error);
				}
			}
			getMovie();
		} else {
			setMovie(stateMovie);
		}
	}, []);

	return (
		<p className='text-primary-foreground text-lg'> not found </p>
	)
}

export default MovieSlug;