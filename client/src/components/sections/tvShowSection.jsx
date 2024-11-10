import { SwiperSlide, Swiper } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";
import TvShow from "../TvShow";
import { LoadingMovieSection } from "../loaders/MovieLoaders";

export const TvShowSection = ({ title, shows }) => {
  if (!shows) {
    return <LoadingMovieSection title="Top rated TV shows" />;
  }

  return (
    <section className="w-full bg-transparent overflow-hidden gap-4">
      <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
        {title}
      </h1>
      <Swiper {...swiperConfig}>
        {shows?.map((show, index) => (
          <SwiperSlide key={index}>
            <TvShow info={show} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
