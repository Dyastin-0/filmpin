import { blinkVariants } from '../../configs/motionConfig';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig } from '../../configs/swiperConfig';

export const ImageDummy = () => <motion.div className='rounded-md w-full h-[250px] bg-secondary' variants={blinkVariants} animate='blink' />;

export const MovieDummy = () => {
	return (
    <motion.div className='flex flex-col rounded-md drop-shadow-sm gap-2 p-4 w-[200px] h-[370px]
      text-primary-foreground bg-accent
      hover:scale-95 hover:cursor-pointer duration-300'>
 			<ImageDummy />
      <motion.div className='rounded-md w-full h-[20px] bg-secondary' variants={blinkVariants} animate='blink' />
      <motion.div className='rounded-md w-1/2 h-[15px] bg-secondary' variants={blinkVariants} animate='blink' />
      <motion.div className='rounded-md w-1/3 h-[10px] bg-secondary' variants={blinkVariants} animate='blink' />
		</motion.div>
	);
}

export const LoadingMovieSection = ({ title }) => (
  <section className='w-full m-4 bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-lg font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {Array(10).fill(null).map((_, index) => (
        <SwiperSlide key={index}>
          <MovieDummy />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);