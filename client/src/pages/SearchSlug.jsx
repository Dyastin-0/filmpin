import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Movie from '../components/Movie';
import Pagination from '../components/ui/Pagination';
import { LoadingSearchResult } from '../components/loaders/MovieLoaders';
import { useLoading } from '../components/hooks/useLoading';
import useAxios from '../hooks/useAxios';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAxios();
  const { setLoading } = useLoading();
  const [currentQuery, setCurrentQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState({});
  const [isLoading, setIsloading] = useState(true);

  const getPage = async (query, page) => {
    try {
      const response = await api.get(`/movies/search?query=${query}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get query.', error);
    }
  };

  useEffect(() => {
    document.title = 'Search';
  }, []);

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentQuery(query);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    if (currentQuery) {
      const fetchResults = async () => {
        setIsloading(true);
        setLoading(true);
        const response = await getPage(currentQuery, currentPage);
        if (response) {
          setResults((prevResults) => ({
            ...prevResults,
            [response.page]: response.results,
          }));
          setTotalPages(response.total_pages > 500 ? 500 : response.total_pages);
        }
        setIsloading(false);
        setLoading(false);
      };
      fetchResults();
    }
  }, [currentQuery, currentPage]);

  const onPageChange = async (page) => {
    setCurrentPage(page);
    if (!results[page]) {
      setIsloading(true);
      setLoading(true);
      const response = await getPage(currentQuery, page);
      if (response) {
        setResults((prevResults) => ({
          ...prevResults,
          [page]: response.results,
        }));
      }
      setIsloading(false);
      setLoading(false);
    }
    navigate(`/movies/search?query=${currentQuery}&page=${page}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentPage]);

  return isLoading ? (
    <LoadingSearchResult title={'Results'} />
  ) : (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
      <h1 className='text-primary-foreground text-sm text-start w-full font-semibold'>Results</h1>
      <section className='relative w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
        <div className='flex flex-wrap justify-center gap-3 w-full h-full'>
          {results[currentPage].map((movie, index) => (
            <Movie key={index} info={movie} />
          ))}
        </div>
      </section>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default SearchResult;
