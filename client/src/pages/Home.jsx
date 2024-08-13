import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import Movie, { MovieDummy } from "../components/Movie";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation } from 'swiper/modules';

// Centralized Swiper Configuration
const swiperConfig = {
  speed: 1000,
  loop: true,
  spaceBetween: 18,
  centeredSlides: true,
  slidesPerView: 'auto',
  navigation: true,
  modules: [Navigation],
  className: 'swiper-slide',
};

const fetchMovies = async (token) => {
  try {
    const [topRatedResponse, popularResponse, upcomingResponse] = await Promise.all([
      axios.get('/movies/list/top_rated/page=1', { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'application/json' } }),
      axios.get('/movies/list/popular/page=1', { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'application/json' } }),
      axios.get('/movies/list/upcoming/page=1', { headers: { Authorization: `Bearer ${token}`, "Content-Type": 'application/json' } }),
    ]);
    return {
      topMovies: topRatedResponse.data.results,
      popularMovies: popularResponse.data.results,
      upcomingMovies: upcomingResponse.data.results,
    };
  } catch (error) {
    console.error('Failed to fetch movies', error);
    return { topMovies: [], popularMovies: [], upcomingMovies: [] };
  }
}

const SwiperSection = ({ title, movies }) => (
  <section className='container bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-lg font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {movies.map((movie, index) => (
        <SwiperSlide key={index}>
          <Movie info={movie} />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const LoadingSwiperSection = ({ title }) => (
  <section className='container bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-lg font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {Array(10).fill(null).map((_, index) => (
        <SwiperSlide key={index}>
          <MovieDummy />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const Home = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [moviesData, setMoviesData] = useState({ topMovies: [], popularMovies: [], upcomingMovies: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    } else {
      fetchMovies(token).then(data => {
        setMoviesData(data);
        setLoading(false);
      });
    }
  }, []);

  const { topMovies, popularMovies, upcomingMovies } = moviesData;

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full">
      {loading ? (
        <>
          <LoadingSwiperSection title='Top rated' />
          <LoadingSwiperSection title='Popular' />
          <LoadingSwiperSection title='Upcoming' />
        </>
      ) : (
        <>
          <SwiperSection title='Top rated' movies={topMovies} />
          <SwiperSection title='Popular' movies={popularMovies} />
          <SwiperSection title='Upcoming' movies={upcomingMovies} />
        </>
      )}
    </div>
  );
};

export default Home;