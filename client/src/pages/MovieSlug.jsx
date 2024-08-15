import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import AnimatedString from '../components/ui/AnimatedString';
import axios from 'axios';

const MovieSlug = () => {
	const [movie, setMovie] = useState();
  const location = useLocation();
  const { title } = useParams();

  useEffect(() => {
		document.title = title;
		const movie = location.state.movie;
		if (!movie) {
			const getMovie = async () => {
				const movieTitle = title.replace('/_/g', ' ').replace('/\b\w/g', char => char.toUpperCase());
				const response = await axios.get(`/movies/search/${movieTitle}`);
			}
			getMovie();
		} else {
			setMovie(movie);
		}
	}, []);

	return (
		movie !== null ? 
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			<div className='w-full h-[400px] rounded-lg overflow-hidden'>
				<img
					loading='lazy'
					className='w-full h-full object-cover'
					src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
					alt={`${movie.title} backdrop`} 
				/>
			</div>
			<AnimatedString text={movie.tagline} />
			<div className='flex max-w-full w-[900px] gap-4'>
				<img
					loading='lazy'
					className='rounded-lg h-[300px]'
					src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
					alt={`${movie.original_title} poster`}
				/>
				<div className='flex flex-col gap-2 w-full'>
					<h1 className='text-primary-foreground text-4xl font-semibold'> {movie.original_title} </h1>
					<p className='text-primary-foreground texy-md'> {movie.overview} </p>
					<h4 className='text-primary-foreground text-xs'> {movie?.release_date.split('-')[0]} </h4>
					<div className='flex gap-1'>
						{
							movie.genres.map((genre, index) => (
									<p className='text-primary-foreground text-xs' key={index}>{`${index === movie.genres.length - 1 ? genre.name : `${genre.name},` }`}</p>
								)
							)
						}
					</div>
					<p className='text-primary-foreground text-xs'> {`${movie.runtime} minutes`} </p>
				</div>
			</div>
		</div> : <p className='text-primary-foreground text-lg'> not found </p>
	)
}

export default MovieSlug;