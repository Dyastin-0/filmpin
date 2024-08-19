import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from '../components/Movie';
import { SwiperSlide, Swiper } from 'swiper/react';
import { swiperConfig } from '../configs/swiperConfig';
import MovieTrailer from '../components/MovieTrailer';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { LoadingTrailerSection } from '../components/loaders/TrailerLoaders';

const fetchMovies = async (token, category) => {
  try {
    const response = await axios.get(`/movies/list/${category}/page=1`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data.results;
  } catch (error) {
    console.error('Failed to fetch top rated movies', error);
    return [];
  }
};

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
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  const [loadingTopMovies, setLoadingTopMovies] = useState(true);
  const [loadingPopularMovies, setLoadingPopularMovies] = useState(true);
  const [loadingUpcomingMovies, setLoadingUpcomingMovies] = useState(true);
  const [loadingNowPlayingMovies, setLoadingNowPlayingMovies] = useState(true);

  useEffect(() => {
    document.title = 'Home';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTopMovies(true);
      setLoadingPopularMovies(true);
      setLoadingUpcomingMovies(true);
      setLoadingNowPlayingMovies(true);

      const fetchedTopMovies = await fetchMovies(token, 'top_rated');
      setTopMovies(fetchedTopMovies);
      setLoadingTopMovies(false);

      const fetchedPopularMovies = await fetchMovies(token, 'popular');
      setPopularMovies(fetchedPopularMovies);
      setLoadingPopularMovies(false);

      const fetchedUpcomingMovies = await fetchMovies(token, 'upcoming');
      setUpcomingMovies(fetchedUpcomingMovies);
      setLoadingUpcomingMovies(false);

      const fetchedNowPlayingMovies = await fetchMovies(token, 'now_playing');
      setNowPlayingMovies(fetchedNowPlayingMovies);
      setLoadingNowPlayingMovies(false);
    };

    fetchData();
  }, [token]);

  return (
  <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full'>
        {loadingUpcomingMovies ? <LoadingTrailerSection title='Latest trailers' /> : <TrailerSection title='Latest trailers' movies={upcomingMovies} />}
        {loadingNowPlayingMovies ? <LoadingMovieSection title='Now playing' /> : <MovieSection title='Now playing' movies={nowPlayingMovies} />}
        {loadingTopMovies ? <LoadingMovieSection title='Top rated' /> : <MovieSection title='Top rated' movies={topMovies} />}
        {loadingPopularMovies ? <LoadingMovieSection title='Popular' /> : <MovieSection title='Popular' movies={popularMovies} />}
        {loadingUpcomingMovies ? <LoadingMovieSection title='Upcoming' /> : <MovieSection title='Upcoming' movies={upcomingMovies} />}
    </div>
  );
};

export default Home;
