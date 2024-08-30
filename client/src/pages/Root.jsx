import { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

const Root = () => {
  const [backdrops, setBackdrops] = useState(null);
  const [backdropIndex, setBackdropIndex] = useState(0);

  const getBackdrops = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/public/backdrops?category=tv&list=top_rated&page=1`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBackdrops().then((response) => {
      setBackdrops(response);
    });
  }, []);

  useEffect(() => {
    if (backdrops) {
      const intervalId = setInterval(() => {
        setBackdropIndex((prevIndex) => (prevIndex + 1) % backdrops.length);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [backdrops]);

  return (
    <div
      className='relative flex flex-col p-4 justify-center items-center h-full w-full text-primary bg-primary gap-4 rounded-lg overflow-hidden'
    >
      {backdrops && (
        <AnimatePresence>
          <motion.img
            key={backdrops[backdropIndex].backdrop_path}
            src={`https://image.tmdb.org/t/p/original${backdrops[backdropIndex].backdrop_path}`}
            className='absolute w-full h-full z-10 rounded-lg object-cover'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
          <div className='absolute w-full h-full z-20 rounded-lg bg-black opacity-50'></div>
        </AnimatePresence>
      )}
      <div className='flex justify-start flex-col'>
        <h1 className='text-4xl text-light font-bold z-20'> Explore endless movies & TV shows </h1>
        <h1 className='text-lg text-light font-semibold z-20'> Find your next watch using our intuitive UI, seamlessly. </h1>
      </div>
    </div>
  );
};

export default Root;
