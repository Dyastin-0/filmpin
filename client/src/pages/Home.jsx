import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { fetchCategory } from '../helpers/api';
import { blinkVariants } from '../configs/motionConfig';

const Home = () => {
  const api = useAxios();
  const { setLoading } = useLoading();

  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);

  const [isLoadingTopMovies, setIsLoadingTopMovies] = useState(true);
  const [isLoadingPopularMovies, setIsLoadingPopularMovies] = useState(true);
  const [isLoadingUpcomingMovies, setIsLoadingUpcomingMovies] = useState(true);
  const [isLoadingNowPlayingMovies, setIsLoadingNowPlayingMovies] = useState(true);
  const [isLoadingTopTvShows, setIsLoadingTopTvShows] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTopMovies(true);
      setIsLoadingPopularMovies(true);
      setIsLoadingUpcomingMovies(true);
      setIsLoadingNowPlayingMovies(true);
      setIsLoadingTopTvShows(true);

      try {
        const [topMoviesData, popularMoviesData, upcomingMoviesData, nowPlayingMoviesData, topTvShowsData] = await Promise.all([
          fetchCategory(api, 'movies', 'top_rated'),
          fetchCategory(api, 'movies', 'popular'),
          fetchCategory(api, 'movies', 'upcoming'),
          fetchCategory(api, 'movies', 'now_playing'),
          fetchCategory(api, 'tvshows', 'top_rated'),
        ]);

        setTopMovies(topMoviesData);
        setPopularMovies(popularMoviesData);
        setUpcomingMovies(upcomingMoviesData);
        setNowPlayingMovies(nowPlayingMoviesData);
        setTopTvShows(topTvShowsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingTopMovies(false);
        setIsLoadingPopularMovies(false);
        setIsLoadingUpcomingMovies(false);
        setIsLoadingNowPlayingMovies(false);
        setIsLoadingTopTvShows(false);
      }
    };

    fetchData();
  }, [api]);

  useEffect(() => {
    setLoading(
      isLoadingNowPlayingMovies ||
      isLoadingPopularMovies ||
      isLoadingTopMovies ||
      isLoadingTopTvShows ||
      isLoadingUpcomingMovies
    );
  }, [isLoadingNowPlayingMovies, isLoadingPopularMovies, isLoadingTopMovies, isLoadingTopTvShows, isLoadingUpcomingMovies, setLoading]);

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full">
      {!isLoadingTopMovies ? (
        <section className="w-full h-[400px] rounded-md ml-4 mr-4 mb-4 bg-transparent overflow-hidden">
          <Swiper {...swiperAutoPlayConfig}>
            {topMovies.map((movie, index) => (
              <SwiperSlide key={index}>
                <SliderMovie movie={movie} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ) : (
        <motion.div className='w-full h-[400px] rounded-md overflow-hidden' variants={blinkVariants} animate='blink'></motion.div>
      )}
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
