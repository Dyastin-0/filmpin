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

const Home = () => {
  const api = useAxios();
  const { setLoading } = useLoading();

  const fetchMovies = async (category) => {
    const response = await api.get(`/movies/list?category=${category}&page=1`);
    return response.data.results;
  };

  const fetchTvShows = async (category) => {
    const response = await api.get(`/tvshows/list?category=${category}&page=1`);
    return response.data.results;
  };

  const {
    data: topMovies = [],
    isLoading: isLoadingTopMovies,
  } = useQuery({
    queryKey: ['movies', 'top_rated'],
    queryFn: () => fetchMovies('top_rated'),
  });

  const {
    data: popularMovies = [],
    isLoading: isLoadingPopularMovies,
  } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => fetchMovies('popular'),
  });

  const {
    data: upcomingMovies = [],
    isLoading: isLoadingUpcomingMovies,
  } = useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => fetchMovies('upcoming'),
  });

  const {
    data: nowPlayingMovies = [],
    isLoading: isLoadingNowPlayingMovies,
  } = useQuery({
    queryKey: ['movies', 'now_playing'],
    queryFn: () => fetchMovies('now_playing'),
  });

  const {
    data: topTvShows = [],
    isLoading: isLoadingTopTvShows,
  } = useQuery({
    queryKey: ['tvshows', 'top_rated'],
    queryFn: () => fetchTvShows('top_rated'),
  });

  const isLoading =
    isLoadingTopMovies ||
    isLoadingPopularMovies ||
    isLoadingUpcomingMovies ||
    isLoadingNowPlayingMovies ||
    isLoadingTopTvShows;

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

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

      {isLoading ? (
        <>
          <LoadingTrailerSection title="Latest trailers" />
          <LoadingMovieSection title="Now playing" />
          <LoadingMovieSection title="Top rated" />
          <LoadingMovieSection title="Popular" />
          <LoadingMovieSection title="Upcoming" />
          <LoadingMovieSection title="Top rated TV shows" />
        </>
      ) : (
        <>
          <TrailerSection title="Latest trailers" movies={upcomingMovies} />
          <MovieSection title="Now playing" movies={nowPlayingMovies} />
          <MovieSection title="Top rated" movies={topMovies} />
          <MovieSection title="Popular" movies={popularMovies} />
          <MovieSection title="Upcoming" movies={upcomingMovies} />
          <TvShowSection title="Top rated TV shows" shows={topTvShows} />
        </>
      )}
    </div>
  );
};

export default Home;
