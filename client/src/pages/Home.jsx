import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../components/Movie';
import { SwiperSlide, Swiper } from 'swiper/react';
import { swiperConfig } from '../configs/swiperConfig';
import MovieTrailer from '../components/MovieTrailer';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { LoadingTrailerSection } from '../components/loaders/TrailerLoaders';
import { useLoading } from '../components/hooks/useLoading';

const fetchMovies = async (token, category) => {
  try {
    const response = await axios.get(`/movies/list/${category}/page=1`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data.results;
  } catch (error) {
    console.error(`Failed to fetch ${category} movies`, error);
    return [];
  }
};

export const MovieSection = ({ title, movies }) => (
  <section className='w-full ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-sm font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {movies.map((movie, index) => (
        <SwiperSlide key={index}>
          <Movie info={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const TrailerSection = ({ title, movies }) => (
  <section className='w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-sm font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {movies.map((movie, index) => (
        <SwiperSlide className='max-h-fit' key={index}>
          <MovieTrailer id={movie.id} title={movie.title} />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const Home = () => {
  const { token } = useAuth();
  const { setLoading } = useLoading();
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = 'Home';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoading(true);

      try {
        const [fetchedTopMovies, fetchedPopularMovies, fetchedUpcomingMovies, fetchedNowPlayingMovies] = await Promise.all([
          fetchMovies(token, 'top_rated'),
          fetchMovies(token, 'popular'),
          fetchMovies(token, 'upcoming'),
          fetchMovies(token, 'now_playing'),
        ]);

        setTopMovies(fetchedTopMovies);
        setPopularMovies(fetchedPopularMovies);
        setUpcomingMovies(fetchedUpcomingMovies);
        setNowPlayingMovies(fetchedNowPlayingMovies);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full'>
      {isLoading ? (
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
