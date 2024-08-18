import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../components/Movie';
import { SwiperSlide, Swiper } from 'swiper/react';
import { swiperConfig } from '../configs/swiperConfig';
import MovieTrailer from '../components/MovieTrailer';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { LoadingTrailerSection } from '../components/loaders/TrailerLoaders';

const fetchMovies = async (token) => {
  try {
    const [topRatedResponse, popularResponse, upcomingResponse, nowPlayingResponse] = await Promise.all([
      axios.get('/movies/list/top_rated/page=1', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }),
      axios.get('/movies/list/popular/page=1', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }),
      axios.get('/movies/list/upcoming/page=1', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }),
      axios.get('/movies/list/now_playing/page=1', { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }),
    ]);
    return {
      topMovies: topRatedResponse.data.results,
      popularMovies: popularResponse.data.results,
      upcomingMovies: upcomingResponse.data.results,
      nowPlayingMovies: nowPlayingResponse.data.results,
    };
  } catch (error) {
    console.error('Failed to fetch movies', error);
    return { topMovies: [], popularMovies: [], upcomingMovies: [], nowPlayingMovies: [] };
  }
}

const MovieSection = ({ title, movies }) => (
  <section className='w-full ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-sm font-semibold'>{title}</h1>
    <Swiper {...swiperConfig} >
      {movies && movies.map((movie, index) => (
        <SwiperSlide key={index}>
          <Movie info={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const TrailerSection = ({title, movies}) => {
  return (
    <section className='w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
      <h1 className='text-primary-foreground pb-4 text-sm font-semibold'>{title}</h1>
      <Swiper {...swiperConfig} >
        {movies.map((movie, index) => (
          <SwiperSlide className='max-h-fit' key={index}>
            <MovieTrailer id={movie.id} title={movie.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
};

const Home = () => {
  const { token } = useAuth();
  const [moviesData, setMoviesData] = useState({ topMovies: [], popularMovies: [], upcomingMovies: [], nowPlayingMovies: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies(token).then(data => {
      setMoviesData(data);
      setLoading(false);
    });
  }, []);

  const { topMovies, popularMovies, upcomingMovies, nowPlayingMovies } = moviesData;

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full'>
      {loading ? (
        <>
          <LoadingTrailerSection title='Latest trailers' />
          <LoadingMovieSection title='Now playing' />
          <LoadingMovieSection title='Top rated' />
          <LoadingMovieSection title='Popular' />
          <LoadingMovieSection title='Upcoming' />
        </>
      ) : (
        <>
          <TrailerSection title='Latest trailers' movies={upcomingMovies} />
          <MovieSection title='Now playing' movies={nowPlayingMovies} />
          <MovieSection title='Top rated' movies={topMovies} />
          <MovieSection title='Popular' movies={popularMovies} />
          <MovieSection title='Upcoming' movies={upcomingMovies} />
        </>
      )}
    </div>
  );
};

export default Home;