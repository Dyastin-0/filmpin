import { blinkOpacity, blinkVariants } from '../../configs/motionConfig';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig, swiperGridConfig } from '../../configs/swiperConfig';
import { CircularProgress } from '@chakra-ui/react';

export const ImageDummy = () => <motion.div className='rounded-md w-full h-[250px] bg-secondary' variants={blinkVariants} animate='blink' />;
export const TitleDummy = () => <motion.div className='rounded-md w-full h-[20px] bg-secondary' variants={blinkVariants} animate='blink' />;
export const YearDummy = () => <motion.div className='rounded-md w-1/2 h-[15px] bg-secondary' variants={blinkVariants} animate='blink' />;
export const GenresDummy = () => <motion.div className='rounded-md w-1/3 h-[10px] bg-secondary' variants={blinkVariants} animate='blink' />;
export const RatingDummy = () => {
  return (
    <motion.div variants={blinkOpacity} animate='blink' className='absolute bottom-4 right-4'>
      <CircularProgress 
        size='40px'
        ringColor={'var(--bg-primary)'}
      >
      </CircularProgress>
    </motion.div>
  );
}

export const MovieDummy = () => {
	return (
    <motion.div className='flex flex-col rounded-lg drop-shadow-sm gap-1 p-4 w-[200px] h-[370px]
    text-primary-foreground bg-accent
    hover:scale-95 hover:cursor-pointer duration-300'>
 			<ImageDummy />
      <TitleDummy />
      <YearDummy />
      <GenresDummy />
      <RatingDummy />
		</motion.div>
	);
}

export const LoadingMovieSection = ({ title }) => (
  <section className='w-full ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
    <h1 className='text-primary-foreground pb-4 text-sm font-semibold'>{title}</h1>
    <Swiper {...swiperConfig}>
      {Array(10).fill(null).map((_, index) => (
        <SwiperSlide key={index}>
          <MovieDummy />
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export const LoadingSearchResult = ({ title }) => (
  <div className="flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full">
    <h1 className="text-primary-foreground pb-4 text-sm w-full font-semibold">{title}</h1>
    <section className="w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4">
        <div className="flex flex-wrap gap-3 justify-center w-full h-full">
          {Array(20).fill(null).map((_, index) => (
            <MovieDummy key={index} />
          ))}
        </div>
    </section>
  </div>
);

export const LoadingDiscover = ({ title }) => {
  <div className='flex flex-col items-center gap-4'>
    <h1 className='w-full text-primary-foreground text-sm text-start font-semibold'>
      {title}
    </h1>
    <section className='relative w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
        <div className='flex flex-wrap justify-center gap-3 w-full h-full'>
          {Array(20).fill(null).map((_, index) => (
            <MovieDummy key={index} />
          ))}
        </div>
    </section>
  </div>
}