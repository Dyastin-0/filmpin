import { blinkVariants } from '../../configs/motionConfig';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig } from '../../configs/swiperConfig';

export const TrailerImageDummy = () => <motion.div className='w-full aspect-video rounded-md bg-secondary' variants={blinkVariants} animate='blink'></motion.div>;

export const TrailerDummy = () => (
	<motion.div className='flex flex-col rounded-md drop-shadow-sm gap-1 p-3 w-[270px] h-fit
		text-primary-foreground bg-accent
		hover:scale-95 hover:cursor-pointer duration-300'
	>
		<TrailerImageDummy />
	</motion.div>
);

export const LoadingTrailerSection = ({ title }) => (
  <section className='w-full m-4 bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-lg font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {Array(10).fill(null).map((_, index) => (
        <SwiperSlide key={index}>
          <TrailerDummy />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);