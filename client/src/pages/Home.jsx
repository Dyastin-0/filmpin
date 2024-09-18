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
  const [topTvShows, setTopTvShows] = useState([]);

  const [isLoadingTopMovies, setIsLoadingTopMovies] = useState(true);
  const [isLoadingPopularMovies, setIsLoadingPopularMovies] = useState(true);
  const [isLoadingTopTvShows, setIsLoadingTopTvShows] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingTopMovies(true);
      setIsLoadingPopularMovies(true);
      setIsLoadingTopTvShows(true);

      try {
        const [topMoviesData, popularMoviesData, topTvShowsData] = await Promise.all([
          fetchCategory(api, 'movies', 'top_rated'),
          fetchCategory(api, 'movies', 'popular'),
          fetchCategory(api, 'tvshows', 'top_rated'),
        ]);
        setTopMovies(topMoviesData);
        setPopularMovies(popularMoviesData);
        setTopTvShows(topTvShowsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingTopMovies(false);
        setIsLoadingPopularMovies(false);
        setIsLoadingTopTvShows(false);
      }
    };

    fetchData();
  }, [api]);

  useEffect(() => {
    setLoading(
      isLoadingPopularMovies ||
      isLoadingTopMovies
    );
  }, [isLoadingPopularMovies, isLoadingTopMovies, setLoading]);

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
      {!isLoadingPopularMovies ? <MovieSection title="Popular movies" movies={popularMovies} /> : <LoadingMovieSection title="Popular movies" />}
      {!isLoadingPopularMovies ? <TrailerSection title="Trailers from popular movies" movies={popularMovies} /> : <LoadingTrailerSection title="Trailers from popular movies" />}
      {!isLoadingTopMovies ? <MovieSection title="Top rated movies" movies={topMovies} /> : <LoadingMovieSection title="Top rated" />}
      {!isLoadingTopTvShows ? <TvShowSection title="Top rated TV shows" shows={topTvShows} /> : <LoadingMovieSection title="Top rated TV shows" />}
    </div>
  );
};

export default Home;
