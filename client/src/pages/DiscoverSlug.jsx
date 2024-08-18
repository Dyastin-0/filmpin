import { useState } from 'react';
import Selector from '../components/ui/Selector';
import Button from '../components/ui/Button';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 
  'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 
  'War', 'Western'
];

const getDiscovery = async (token, genres, sortBy) => {
  try {
    const response = await axios.get(`/movies/discovery/${genres}/${sortBy}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Failed to get discovery.', error);
  }
}

const DiscoverSlug = () => {
  const { token } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleCreate = async () => {
    const genres = selectedGenres.join('_');
    const sortBy = 'popularity';
    getDiscovery(token, genres, sortBy);
  }

  return (
    <div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
      <div className='flex justify-start items-center w-full gap-2'>
				<h1 className='text-primary-foreground text-sm text-start font-semibold'>
					Create your discoveries
				</h1>
				<Button onClick={handleCreate} text='Create' className='shadow-sm bg-accent pb-1 pt-1' />
			</div>
      <Selector items={genres} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
			<div>
				<h1 className='w-full text-primary-foreground text-sm text-start font-semibold'>
					What we found for you
				</h1>
			</div>
    </div>
  );
};

export default DiscoverSlug;
