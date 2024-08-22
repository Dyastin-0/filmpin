import { useEffect, useState } from 'react';
import Selector from '../components/ui/Selector';
import Pagination from '../components/ui/Pagination';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { LoadingDiscover } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import TvShow from '../components/TvShow';
import useAxios from '../hooks/useAxios';

const genres = [
  'action and adventure', 'animation', 'comedy', 'crime',
  'documentary', 'drama', 'family', 'kids', 'mystery', 'news',
  'reality', 'sci-fi and fantasy', 'soap', 'talk',
  'war and politics', 'western'
];

const DiscoverTvShowSlug = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const api = useAxios();
  const { setLoading } = useLoading();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getDiscovery = async (genres, sortBy, page) => {
    try {
      const response = await api.get(`/tvshows/discover?genres=${genres}&sort_by=${sortBy}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get discovery.', error);
    }
  };

  useEffect(() => {
    document.title = 'Discover';
  }, []);

  useEffect(() => {
    const genresFromParams = searchParams.get('genres')?.split('_') || [];
    const pageFromParams = parseInt(searchParams.get('page')) || 1;

    if (JSON.stringify(selectedGenres) !== JSON.stringify(genresFromParams)) {
      setSelectedGenres(genresFromParams);
    }

    setCurrentPage(pageFromParams);
  }, [searchParams]);

  useEffect(() => {
    if (selectedGenres.length > 0) {
      setCurrentPage(1);
      setIsLoading(true);
      setLoading(true);
      handleCreate();
    }
  }, [selectedGenres]);

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

    const URL = `/discover/tvshows?genres=${genresString}&sort_by=${sortBy}&page=${page}`;
    if (location.pathname !== URL) {
      navigate(URL, { replace: true });
    }
  };

  const onPageChange = async (page) => {
    setIsLoading(true);
    setLoading(true);
    handleCreate(page);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
      <div className='flex justify-start items-center w-full gap-2'>
        <h1 className='text-primary-foreground text-sm text-start font-semibold'>
          Discover TV shows
        </h1>
      </div>
      <Selector items={genres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
      { isLoading ?
        selectedGenres.length > 0 && <LoadingDiscover title='Results' />
        :
        <div className='flex flex-col items-center gap-4'>
          <h1 className='w-full text-primary-foreground text-sm text-start font-semibold'>
            Results
          </h1>
          <div className='flex flex-wrap justify-center gap-3 w-full h-full'>
            {results[currentPage]?.map((show, index) => (
              <TvShow key={index} info={show} />
            ))}
          </div>
          { totalPages > 1 && 
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          }
        </div>
      }
    </div>
  );
};

export default DiscoverTvShowSlug;
