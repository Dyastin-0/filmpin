import { useQueries } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSection } from '../components/sections/MovieSection';
import { TrailerSection } from '../components/sections/TrailerSection';
import { TvShowSection } from '../components/sections/tvShowSection';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { LoadingTrailerSection } from '../components/loaders/TrailerLoaders';
import useAxios from '../hooks/useAxios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperAutoPlayConfig } from '../configs/swiperConfig';
import SliderMovie from '../components/SliderMovie';
import { fetchCategory } from '../helpers/api';

const Home = () => {
  const api = useAxios();
  const { setLoading } = useLoading();

  const movieQueries = useQueries({
    queries: [
      { queryKey: ['movies', 'top_rated'], queryFn: () => fetchCategory(api, 'movies', 'top_rated') },
      { queryKey: ['movies', 'popular'], queryFn: () => fetchCategory(api, 'movies', 'popular') },
      { queryKey: ['movies', 'upcoming'], queryFn: () => fetchCategory(api, 'movies', 'upcoming') },
      { queryKey: ['movies', 'now_playing'], queryFn: () => fetchCategory(api, 'movies', 'now_playing') },
      { queryKey: ['tvshows', 'top_rated'], queryFn: () => fetchCategory(api, 'tvshows', 'top_rated') },
    ],
  });

  const [
    { data: topMovies = [], isLoading: isLoadingTopMovies },
    { data: popularMovies = [], isLoading: isLoadingPopularMovies },
    { data: upcomingMovies = [], isLoading: isLoadingUpcomingMovies },
    { data: nowPlayingMovies = [], isLoading: isLoadingNowPlayingMovies },
    { data: topTvShows = [], isLoading: isLoadingTopTvShows },
  ] = movieQueries;

  useEffect(() => {
    setLoading(
      isLoadingTopMovies ||
      isLoadingPopularMovies ||
      isLoadingUpcomingMovies ||
      isLoadingNowPlayingMovies ||
      isLoadingTopTvShows
    );
  }, [
    isLoadingTopMovies,
    isLoadingPopularMovies,
    isLoadingUpcomingMovies,
    isLoadingNowPlayingMovies,
    isLoadingTopTvShows,
    setLoading,
  ]);

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full">
      <section className="w-full h-[400px] rounded-md ml-4 mr-4 mb-4 bg-transparent overflow-hidden">
        <Swiper {...swiperAutoPlayConfig}>
          {topMovies.map((movie, index) => (
            <SwiperSlide key={index}>
              <SliderMovie movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {isLoadingUpcomingMovies ? <LoadingTrailerSection title="Latest trailers" /> : <TrailerSection title="Latest trailers" movies={upcomingMovies} />}
      {isLoadingNowPlayingMovies ? <LoadingMovieSection title="Now playing" /> : <MovieSection title="Now playing" movies={nowPlayingMovies} />}
      {isLoadingTopMovies ? <LoadingMovieSection title="Top rated" /> : <MovieSection title="Top rated" movies={topMovies} />}
      {isLoadingPopularMovies ? <LoadingMovieSection title="Popular" /> : <MovieSection title="Popular" movies={popularMovies} />}
      {isLoadingUpcomingMovies ? <LoadingMovieSection title="Upcoming" /> : <MovieSection title="Upcoming" movies={upcomingMovies} />}
      {isLoadingTopTvShows ? <LoadingMovieSection title="Top rated TV shows" /> : <TvShowSection title="Top rated TV shows" shows={topTvShows} />}
    </div>
  );
};

export default Home;
