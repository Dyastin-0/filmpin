import { useEffect, useState } from 'react';
import Selector from '../components/ui/Selector';
import TvShow from '../components/TvShow';
import Pagination from '../components/ui/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingDiscover } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import Accordion from '../components/ui/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { tvShowGenres } from '../models/genres';
import useAxios from '../hooks/useAxios';
import { fetchDiscovery } from '../helpers/api';
import useSWR from 'swr';

const DiscoverTvShowSlug = () => {
  const { api, isAxiosReady } = useAxios();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  const genresString = selectedGenres.length > 0 ? selectedGenres.join('_').toLowerCase() : '';
  const sortBy = 'vote_count';

  const { data, isLoading, isError
  } = useSWR(
    isAxiosReady ? `/discover/tvshows?genres=${genresString}&sort_by=${sortBy}&page=${currentPage}` : null,
    () => fetchDiscovery(api, 'tvshows', genresString, sortBy, currentPage), {
    onSuccess: () => {
      setLoading(false);
    }
  }
  );

  useEffect(() => {
    document.title = 'Discover TV shows';
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [selectedGenres, currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page);
    navigate(`/discover/tvshows?genres=${genresString}&sort_by=${sortBy}&page=${page}`, { replace: true });
  };

  useEffect(() => {
    setCurrentPage(1);
    navigate(`/discover/tvshows?genres=${genresString}&sort_by=${sortBy}&page=1`, { replace: true });
  }, [selectedGenres]);

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
      <div className='flex justify-start items-center w-full gap-2'>
        <h1 className='text-primary-foreground text-sm text-start font-semibold'>
          Discover TV shows
        </h1>
      </div>
      <Accordion title={<div className='gap-2'><FontAwesomeIcon icon={faFilter} /> Filter </div>}>
        <Selector items={tvShowGenres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
      </Accordion>
      {isLoading ? (
        selectedGenres && <LoadingDiscover />
      ) : isError ? (
        <p>Error loading TV shows</p>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <div className='flex flex-wrap justify-center gap-3 w-full h-full'>
            {data?.results?.map((show, index) => (
              <TvShow key={index} info={show} />
            ))}
          </div>
          {data?.total_pages > 1 &&
            <Pagination currentPage={currentPage} totalPages={data.total_pages > 500 ? 500 : data.total_pages} onPageChange={onPageChange} />
          }
        </div>
      )}
    </div>
  );
};

export default DiscoverTvShowSlug;
