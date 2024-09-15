import { useQuery } from '@tanstack/react-query';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { LoadingTrailerSection } from '../components/loaders/TrailerLoaders';
import { useLoading } from '../components/hooks/useLoading';
import { MovieSection } from '../components/sections/MovieSection';
import { TrailerSection } from '../components/sections/TrailerSection';
import { TvShowSection } from '../components/sections/tvShowSection';
import useAxios from '../hooks/useAxios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperAutoPlayConfig } from '../configs/swiperConfig';
import SliderMovie from '../components/SliderMovie';
import { useEffect } from 'react';
import { fetchCategory } from '../helpers/api';

const Home = () => {
  const api = useAxios();
  const { setLoading } = useLoading();

  const {
    data: topMovies = [],
    isLoading: isLoadingTopMovies,
  } = useQuery({
    queryKey: ['movies', 'top_rated'],
    queryFn: () => fetchCategory(api, 'movies', 'top_rated'),
  });

  const {
    data: popularMovies = [],
    isLoading: isLoadingPopularMovies,
  } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchCategory(api, 'movies', 'popular'),
  });

  const {
    data: upcomingMovies = [],
    isLoading: isLoadingUpcomingMovies,
  } = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => fetchCategory(api, 'movies', 'upcoming'),
  });

  const {
    data: nowPlayingMovies = [],
    isLoading: isLoadingNowPlayingMovies,
  } = useQuery({
    queryKey: ['movies', 'now_playing'],
    queryFn: () => fetchCategory(api, 'movies', 'now_playing'),
  });

  const {
    data: topTvShows = [],
    isLoading: isLoadingTopTvShows,
  } = useQuery({
    queryKey: ['tvshows', 'top_rated'],
    queryFn: () => fetchCategory(api, 'tvshows', 'top_rated'),
  });

  useEffect(() => {
    setLoading(isLoadingNowPlayingMovies || isLoadingPopularMovies || isLoadingTopMovies || isLoadingTopTvShows || isLoadingUpcomingMovies)
  }, [isLoadingNowPlayingMovies, isLoadingPopularMovies, isLoadingNowPlayingMovies, isLoadingTopMovies, isLoadingTopTvShows, isLoadingUpcomingMovies]);

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
      {!isLoadingUpcomingMovies ? <TrailerSection title="Latest trailers" movies={upcomingMovies} /> : <LoadingTrailerSection title="Latest trailers" />}
      {!isLoadingNowPlayingMovies ? <MovieSection title="Now playing" movies={nowPlayingMovies} /> : <LoadingMovieSection title="Now playing" />}
      {!isLoadingTopMovies ? <MovieSection title="Top rated" movies={topMovies} /> : <LoadingMovieSection title="Top rated" />}
      {!isLoadingPopularMovies ? <MovieSection title="Popular" movies={popularMovies} /> : <LoadingMovieSection title="Popular" />}
      {!isLoadingUpcomingMovies ? <MovieSection title="Upcoming" movies={upcomingMovies} /> : <LoadingMovieSection title="Upcoming" />}
      {!isLoadingTopTvShows ? <TvShowSection title="Top rated TV shows" shows={topTvShows} /> : <LoadingMovieSection title="Top rated TV shows" />}
    </div>
  );
};

export default Home;
