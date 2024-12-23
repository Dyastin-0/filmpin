import { SwiperSlide, Swiper } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";
import Clip from "../Clip";

export const ClipSection = ({ title, keys }) => {
  return (
    <section className="w-full h-fit bg-transparent overflow-hidden gap-4">
      <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
        {title}
      </h1>
      <Swiper {...swiperConfig}>
        {keys?.map((key, index) => (
          <SwiperSlide
            className="max-h-fit transition-all duration-300"
            key={index}
          >
            <Clip title={key.name} trailerKey={key.value} key={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
