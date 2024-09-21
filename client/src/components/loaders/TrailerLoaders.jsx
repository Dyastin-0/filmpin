import { blinkVariants } from "../../configs/motionConfig";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { swiperConfig } from "../../configs/swiperConfig";

export const TrailerImageDummy = () => (
  <motion.div
    className="w-full aspect-video rounded-md bg-secondary"
    variants={blinkVariants}
    animate="blink"
  ></motion.div>
);
export const TrailerTitleDummy = () => (
  <motion.div
    className="w-1/2 h-4 rounded-md bg-secondary"
    variants={blinkVariants}
    animate="blink"
  ></motion.div>
);

export const TrailerDummy = () => (
  <motion.div
    className="flex flex-col items-center rounded-md drop-shadow-sm gap-1 p-3 w-[270px] h-fit
		text-primary-foreground border border-secondary-accent
		hover:scale-95 hover:cursor-pointer duration-300"
  >
    <TrailerImageDummy />
    <TrailerTitleDummy />
  </motion.div>
);

export const LoadingTrailerSection = ({ title }) => (
  <section className="w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4">
    <h1 className="text-primary-foreground pb-4 text-sm font-semibold">
      {title}
    </h1>
    <Swiper {...swiperConfig}>
      {Array(10)
        .fill(null)
        .map((_, index) => (
          <SwiperSlide key={index}>
            <TrailerDummy />
          </SwiperSlide>
        ))}
    </Swiper>
  </section>
);
