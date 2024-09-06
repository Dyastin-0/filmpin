import { useEffect, useState } from 'react';
import Selector from '../components/ui/Selector';
import Movie from '../components/Movie';
import Pagination from '../components/ui/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingDiscover } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import useAxios from '../hooks/useAxios';
import Accordion from '../components/ui/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { movieGenres } from '../models/genres';

const DiscoverMovieSlug = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAxios();
  const { setLoading } = useLoading();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(searchParams.get('page'));
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getDiscovery = async (genres, sortBy, page) => {
    try {
      const response = await api.get(`/movies/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get discovery.', error);
    }
  };

  useEffect(() => {
    document.title = 'Discover movies';
    handleCreate();
  }, []);

  useEffect(() => {
    if (selectedGenres?.length > 0) {
      setCurrentPage(1);
      setIsLoading(true);
      setLoading(true);
      handleCreate();
    }
  }, [selectedGenres]);

  useEffect(() => {
    const genresFromParams = searchParams.get('genres') !== '' ? searchParams.get('genres')?.split('_') : [];
    const pageFromParams = parseInt(searchParams.get('page')) || 1;

    if (JSON.stringify(selectedGenres) != JSON.stringify(genresFromParams)) {
      setSelectedGenres(genresFromParams);
    }

    setCurrentPage(pageFromParams);
  }, [searchParams]);


  const handleCreate = async (page = 1) => {
    const genresString = selectedGenres.join('_').toLowerCase();
    const sortBy = 'vote_count';

    getDiscovery(genresString, sortBy, page).then((response) => {
      setResults(prevResults => ({
        ...prevResults,
        [response.page]: response.results,
      }));
      setTotalPages(response.total_pages > 500 ? 500 : response.total_pages);
      setCurrentPage(page);
      setIsLoading(false);
      setLoading(false);
    });

    const URL = `/discover/movies?genres=${genresString}&sort_by=${sortBy}&page=${page}`;
    if (location.pathname !== URL) {
      navigate(URL, { replace: true });
    }
  };

  const onPageChange = async (page) => {
    setIsLoading(true);
    setLoading(true);
    setCurrentPage(page);
    handleCreate(page);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
      <div className='flex justify-start items-center w-full gap-2'>
        <h1 className='text-primary-foreground text-sm text-start font-semibold'>
          Discover movies
        </h1>
      </div>
      <Accordion title={<div className='gap-2'><FontAwesomeIcon icon={faFilter} /> Filter </div>}>
        <Selector items={movieGenres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
      </Accordion>
      {isLoading ?
        selectedGenres && <LoadingDiscover />
        :
        <div className='flex flex-col items-center gap-4'>
          <div className='flex flex-wrap justify-center gap-3 w-full h-full'>
            {results[currentPage].map((movie, index) => (
              <Movie key={index} info={movie} />
            ))}
          </div>
          {totalPages > 1 &&
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          }
        </div>
      }
    </div>
  );
};

export default DiscoverMovieSlug;
