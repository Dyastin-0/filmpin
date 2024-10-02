import Season from "../Season";
import { Swiper, SwiperSlide } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";

const SeasonSection = ({ seasons, showId, title, backdropPath }) => {
  return (
    <section className="w-full bg-transparent overflow-hidden gap-4">
      <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
        Seasons
      </h1>
      <Swiper {...swiperConfig}>
        {seasons &&
          seasons.map((season, index) => (
            <SwiperSlide key={index}>
              <Season
                info={season}
                title={title}
                backdropPath={backdropPath}
                showId={showId}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};

export default SeasonSection;
