import { Swiper, SwiperSlide } from "swiper/react";
import SliderMovie from "../SliderMovie";
import { swiperAutoPlayConfig } from "../../configs/swiperConfig";
import BackdropLoader from "../loaders/BackdropLoader";

const HomeSlider = ({ data }) => {
  if (!data) {
    return <BackdropLoader />;
  }

  return (
    <section className="w-full h-[400px] rounded-md ml-4 mr-4 bg-transparent overflow-hidden">
      <Swiper {...swiperAutoPlayConfig}>
        {data?.map((movie, index) => (
          <SwiperSlide key={index}>
            <SliderMovie movie={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeSlider;
