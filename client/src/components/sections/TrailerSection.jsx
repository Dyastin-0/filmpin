import { SwiperSlide, Swiper } from "swiper/react";
import { swiperConfigStart } from "../../configs/swiperConfig";
import MovieTrailer from "../../components/MovieTrailer";

export const TrailerSection = ({ title, movies }) => (
  <section className="w-full h-fit bg-transparent overflow-hidden gap-4">
    <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
      {title}
    </h1>
    <Swiper {...swiperConfigStart}>
      {movies?.map((movie, index) => (
        <SwiperSlide className="max-h-fit" key={index}>
          <MovieTrailer id={movie.id} title={movie.title} />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);
