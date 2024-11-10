import Movie from "../../components/Movie";
import { SwiperSlide, Swiper } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";
import { LoadingMovieSection } from "../loaders/MovieLoaders";

export const MovieSection = ({ title, movies }) => {
  if (!movies) {
    return <LoadingMovieSection title="Popular movies" />;
  }

  return (
    <section className="w-full bg-transparent overflow-hidden gap-4">
      <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
        {title}
      </h1>
      <Swiper {...swiperConfig}>
        {movies?.map((movie, index) => (
          <SwiperSlide key={index}>
            <Movie info={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
