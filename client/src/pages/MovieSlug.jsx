import React from 'react'
import { useLocation, useParams } from 'react-router-dom';

const MovieSlug = () => {
  const location = useLocation();
  const { title } = useParams();
  
  const state = location.state || {};
  const movie = state.movie || null;

  console.log(movie);


	return (
		<div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
			<div className='w-full h-[400px] rounded-lg overflow-hidden'>
				<img
					className='w-full h-full object-cover'
					src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
					alt={`${movie.title} backdrop`} 
				/>
			</div>
			<p className='font-semibold text-xl w-full text-center text-primary-foreground'>
					{movie.tagline}
					</p>
			<div className='flex max-w-full w-[900px] gap-4'>
				<img
					className='rounded-lg h-[300px]'
					src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
					alt={`${movie.original_title} poster`}
				/>
				<div className='flex flex-col gap-4 w-full'>
					<h1 className='text-primary-foreground text-4xl font-semibold'> {movie.original_title} </h1>
					<p className='text-primary-foreground texy-md'> {movie.overview} </p>
					<h4 className='text-primary-foreground text-xs'> {movie?.release_date.split('-')[0]} </h4>
					<div className='flex gap-1'>
						{
							movie.genres.map((genre, index) => {
								return (
									<p className='text-primary-foreground text-xs' key={index}>{`${index === movie.genres.length - 1 ? genre.name : `${genre.name},` }`}</p>
								)
							})
						}
					</div>
					<p className='text-primary-foreground text-xs'> {`${movie.runtime} minutes`} </p>
				</div>
			</div>
		</div>
	)
}

export default MovieSlug;