import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../components/hooks/useModal';
import Frame from '../components/Frame';
import { TvShowSection } from '../components/sections/tvShowSection';
import { LoadingMovieSection } from '../components/loaders/MovieLoaders';
import { MovieSlugLoader } from '../components/loaders/MovieSlugLoader';
import useAxios from '../hooks/useAxios';
import SeasonSection from '../components/sections/SeasonSection';
import AddToList from '../components/AddToList';
import { fetchDiscovery, fetchShow, fetchTvShowVideos } from '../helpers/api';
import { ClipSection } from '../components/sections/ClipSection';
import useSWR from 'swr';
import { Helmet } from 'react-helmet';

const TvShowSlug = () => {
  const [searchParams] = useSearchParams();
  const { api, isAxiosReady } = useAxios();
  const { setModal, setOpen } = useModal();
  const [trailerYoutubeKey, setTrailerYoutubeKey] = useState(null);

  const id = searchParams.get('id');

  const { data: details, isLoading: isShowLoading
  } = useSWR(
    isAxiosReady ? `/tvshows?show_id=${id}` : null,
    () => fetchShow(api, id)
  );

  const { data: similarShows, isLoading: isSimilarShowsLoading
  } = useSWR(
    isAxiosReady && details ? `/discover/tvshows?` : null,
    () => fetchDiscovery(api, 'tvshows', details.genres.map((genre) => genre?.name).join('_').toLowerCase(), 'vote_count', 1)
  )

  const { data: videos
  } = useSWR(
    isAxiosReady && details ? `/tvshows/videos?show_id=${id}` : null,
    () => fetchTvShowVideos(api, id)
  );

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}, [details]);

return (
  <div className="flex flex-col items-center bg-primary rounded-lg gap-4 p-4 h-full w-full">
    <Helmet>
      <title>{details?.name}</title>
    </Helmet>
    {isShowLoading ? (
      <MovieSlugLoader />
    ) : (
      details && (
        <>
          <div className="relative w-full h-[400px] rounded-md overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-primary"></div>
            <img
              loading='lazy'
              className='w-full h-full object-cover'
              src={`https://image.tmdb.org/t/p/original/${details.backdrop_path}`}
              alt={`${details.title} backdrop`}
            />
          </div>
          <motion.div
            initial={{ y: -120 }}
            className='flex md:flex-row flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'
          >
            <div className='flex flex-col w-fit self-center gap-3'>
              <img
                loading='lazy'
                className='rounded-lg min-w-[168px] h-[250px] self-center'
                src={`https://image.tmdb.org/t/p/w200/${details.poster_path}`}
                alt={`${details.title} poster`}
              />
              <Button
                text={
                  <p className='text-md font-semibold'>
                    Watch trailer <FontAwesomeIcon size='lg' icon={faPlay} />
                  </p>
                }
                onClick={() => {
                  setModal(<Frame youtubeKey={trailerYoutubeKey} title={details.name} />);
                  setOpen(true);
                }}
              />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <p className='text-primary-foreground text-xs'>{details.tagline}</p>
              <h1 className='text-primary-foreground text-4xl font-semibold'> {details.name} </h1>
              <p className='text-primary-foreground text-sm'> {details.overview} </p>
              <h4 className='text-primary-foreground text-xs'>
                {`${details.first_air_date?.split('-')[0]}-${details.last_air_date?.split('-')[0]}`}
              </h4>
              <div className='flex gap-1'>
                {details.genres.map((genre, index) => (
                  <Link
                    key={index}
                    to={`/discover/tvshows?genres=${genre?.name.toLowerCase()}&sort_by=vote_count&page=1`}
                    className='underline outline-none underline-offset-2 text-primary-highlight text-xs'
                  >
                    {`${index === details.genres.length - 1 ? genre?.name : `${genre?.name},`}`}
                  </Link>
                ))}
              </div>
              <p className='text-primary-foreground text-xs'>
                {`${details.number_of_seasons} seasons, ${details.number_of_episodes} episodes`}
              </p>
              <Button text='Add to list' icon={<FontAwesomeIcon icon={faPlus} />} className='w-fit'
                onClick={() => {
                  setModal(<AddToList selected={details} type='TV Shows' />);
                  setOpen(true);
                }
                } />
            </div>
          </motion.div>
        </>
      )
    )}
    <motion.div className='flex flex-col rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]' initial={{ marginTop: -120 }}>
      {isShowLoading ? <LoadingMovieSection title='Seasons' /> : <SeasonSection seasons={details?.seasons} title={details?.name} showId={details?.id} backdropPath={details?.backdrop_path} />}
    </motion.div>
    <motion.div className='flex flex-col rounded-lg gap-4 p-4 items-center w-[calc(100%-2rem)]'>
      {isSimilarShowsLoading ? (
        <LoadingMovieSection title='Recommendations' />
      ) : (
        <TvShowSection title='Recommendations' shows={similarShows?.results.filter((similarShow) => similarShow?.name !== details?.name)} />
      )}
    </motion.div>
    {videos?.length > 0 &&
      <div className='flex flex-col p-4 rounded-md max-w-full w-[calc(100%-2rem)] gap-4'>
        <ClipSection keys={videos.map((video) => ({
          name: video.name,
          value: video.key
        }))} title='Videos' />
      </div>
    }
  </div>
);
};

export default TvShowSlug;
