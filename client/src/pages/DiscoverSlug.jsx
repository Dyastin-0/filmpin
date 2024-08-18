import { useEffect, useState } from 'react';
import Selector from '../components/ui/Selector';
import {Dropdown, DropdownItem } from '../components/ui/Dropdown';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';
import Pagination from '../components/ui/Pagination';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingDiscover } from '../components/loaders/MovieLoaders';

const genres = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 
  'drama', 'family', 'fantasy', 'history', 'horror', 'music', 
  'mystery', 'romance', 'science fiction', 'tv movie', 'thriller', 
  'war', 'western'
];

const getDiscovery = async (token, genres, sortBy, page) => {
  try {
    const response = await axios.get(`/movies/discover/${genres}/${sortBy}/page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get discovery.', error);
  }
};

const DiscoverSlug = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { token } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedFilter, setSelectedFiler] = useState('Vote count');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState({});

  useEffect(() => {
    if (selectedGenres.length > 0) {
      handleCreate(currentPage);
    }
  }, [selectedGenres]);

  useEffect(() => {
    const genresFromParams = searchParams.get('genres')?.split('_') || [];
    const pageFromParams = parseInt(searchParams.get('page')) || 1;
    setSelectedGenres(genresFromParams);
    setCurrentPage(pageFromParams);
  }, [searchParams]);

  const handleCreate = async (page = 1) => {
    const genresString = selectedGenres.join('_').toLowerCase();
    const sortBy = 'vote_count';

    const response = await getDiscovery(token, genresString, sortBy, page);
    if (response) {
      setResults(prevResults => ({
        ...prevResults,
        [response.page]: response.results,
      }));
      setTotalPages(response.total_pages);
      setCurrentPage(response.page);
    }

    navigate(`/movies/discover?genres=${genresString}&sort_by=${sortBy}&page=${page}`);
  };

  const onPageChange = async (page) => {
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
      <Selector items={genres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
      { results[currentPage] ?
        <div className='flex flex-col items-center gap-4'>
          <h1 className='w-full text-primary-foreground text-sm text-start font-semibold'>
            Results
          </h1>
          <div className='flex flex-wrap justify-center gap-3 w-full h-full'>
            {results[currentPage].map((movie, index) => (
              <Movie key={index} info={movie} />
            ))}
          </div>
          { totalPages > 1 && 
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          }
        </div> :
        <LoadingDiscover title='Results' />
      }
    </div>
  );
};

export default DiscoverSlug;
