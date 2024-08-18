import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';
import Pagination from '../components/ui/Pagination';
import { LoadingSearchResult } from '../components/loaders/MovieLoaders';

const getPage = async (token, query, page) => {
  try {
    const response = await axios.get(`/movies/search/${query}/page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get query.', error);
  }
};

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [currentQuery, setCurrentQuery] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState({});

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentQuery(query);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    if (currentQuery && token) {
      const fetchResults = async () => {
        const response = await getPage(token, currentQuery, currentPage);
        if (response) {
          setResults((prevResults) => ({
            ...prevResults,
            [response.page]: response.results,
          }));
          setTotalPages(response.total_pages);
        }
      };
      fetchResults();
    }
  }, [token, currentQuery, currentPage]);

  const onPageChange = async (page) => {
    if (!results[page]) {
      const response = await getPage(token, currentQuery, page);
      if (response) {
        setResults((prevResults) => ({
          ...prevResults,
          [page]: response.results,
        }));
      }
    }
    setCurrentPage(page);
    navigate(`/movies/search?query=${currentQuery}&page=${page}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentPage]);

  return  ( results[currentPage] ?
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
    </div> :
		<LoadingSearchResult title={'Results'} />
  )
};

export default SearchResult;