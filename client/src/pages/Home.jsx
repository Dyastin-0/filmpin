import { useEffect, useState } from 'react';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { LoadingTrailerSection } from '../components/loaders/TrailerLoaders';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSection } from '../components/sections/MovieSection';
import { TrailerSection } from '../components/sections/TrailerSection';
import { TvShowSection } from '../components/sections/tvShowSection';
import useAxios from '../hooks/useAxios';

const Home = () => {
  const api = useAxios();
  const { setLoading } = useLoading();
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topTvShows, setTopTvShow] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async (category) => {
    try {
      const response = await api.get(`/movies/list?category=${category}&page=1`);
      return response.data.results;
    } catch (error) {
      console.error(`Failed to fetch ${category} movies`, error);
      return [];
    }
  };

  const fetchTvShows = async (category) => {
    try {
      const response = await api.get(`/tvshows/discover?genres=[]&sort_by=vote_count&page=1`);
      return response.data.results;
    } catch (error) {
      console.error(`Failed to fetch ${category} movies`, error);
      return [];
    }
  };

  useEffect(() => {
    document.title = 'Home';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoading(true);

      try {
        const [fetchedTopMovies, fetchedPopularMovies, fetchedUpcomingMovies, fetchedNowPlayingMovies, fetchedTopTvShows] = await Promise.all([
          fetchMovies('top_rated'),
          fetchMovies('popular'),
          fetchMovies('upcoming'),
          fetchMovies('now_playing'),
          fetchTvShows('popular')
        ]);

        setTopMovies(fetchedTopMovies);
        setPopularMovies(fetchedPopularMovies);
        setUpcomingMovies(fetchedUpcomingMovies);
        setNowPlayingMovies(fetchedNowPlayingMovies);
        setTopTvShow(fetchedTopTvShows);

      } catch (error) {
        console.error('Failed to fetch movies', error);
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full'>
      {isLoading ? (
        <>
          <LoadingTrailerSection title='Latest trailers' />
          <LoadingMovieSection title='Now playing' />
          <LoadingMovieSection title='Top rated' />
          <LoadingMovieSection title='Popular' />
          <LoadingMovieSection title='Upcoming' />
          <LoadingMovieSection title='Top rated TV shows' />
        </>
      ) : (
        <>
          <TrailerSection title='Latest trailers' movies={upcomingMovies} />
          <MovieSection title='Now playing' movies={nowPlayingMovies} />
          <MovieSection title='Top rated' movies={topMovies} />
          <MovieSection title='Popular' movies={popularMovies} />
          <MovieSection title='Upcoming' movies={upcomingMovies} />
          <TvShowSection title='Top rated TV shows' shows={topTvShows} />
        </>
      )}
    </div>
  );
};

export default Home;
