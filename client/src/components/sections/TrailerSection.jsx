import { SwiperSlide, Swiper } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";
import MovieTrailer from "../../components/MovieTrailer";
import { LoadingTrailerSection } from "../loaders/TrailerLoaders";

export const TrailerSection = ({ title, movies }) => {
  if (!movies) {
    return <LoadingTrailerSection title="Trailers from popular movies" />;
  }

  return (
    <section className="w-full h-fit bg-transparent overflow-hidden gap-4">
      <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
        {title}
      </h1>
      <Swiper {...swiperConfig}>
        {movies?.map((movie, index) => (
          <SwiperSlide className="max-h-fit" key={index}>
            <MovieTrailer id={movie.id} title={movie.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
