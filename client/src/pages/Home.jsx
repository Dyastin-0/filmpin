import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react";
import axios from "axios";
import Movie from "../components/Movie";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const Home = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [movies, setMovies] = useState(null);

  const handleGetTopMovies = async () => {
    const response = await axios.get('/movies/list/top_rated/page=1', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": 'application/json'
      }
    });
    setMovies(response.data.results);
  }

  useEffect(() => {
    !user && navigate('/sign-in');
  }, [user]);

  useEffect(() => {
    user && handleGetTopMovies();
  }, []);

  return (
    <div className="flex flex-col bg-primary rounded-lg gap-1 p-4 justify-center items-center h-full w-full">
      <section className='container bg-transparent overflow-hidden'>
        <h1 className='text-primary-foreground text-lg font-semibold'> Top rated </h1>
        <Swiper
          speed={1000}
          loop={true}
          // spaceBetween={18}
          centeredSlides
          breakpointsBase="container"
          slidesPerGroup={5}

          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation
          modules={[Pagination, Navigation, Autoplay]}
        >
          {
            movies && movies.map((movie, index) => {
              return (
                <SwiperSlide key={index} >
                  <Movie info={movie} />
                </SwiperSlide>
              )
            })
          }
        </Swiper>
      </section>
    </div>
  )
}

export default Home