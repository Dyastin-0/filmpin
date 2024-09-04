import { useState } from 'react';
import { SearchInput } from './ui/Input';
import useAxios from '../hooks/useAxios';
import { Backdrop } from './Backdrop';
import { useToast } from './hooks/useToast';

const SelectBackdrop = () => {
	const api = useAxios();
	const [query, setQuery] = useState('');
	const [backdrops, setBackdrops] = useState(null);
	const [loading, setLoading] = useState(false);
	const { toastError } = useToast();

	const handleSearch = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await api.get(`/movies/search?query=${query}&page=1`);
			setBackdrops(response.data.results.map(data => ({ backdrop_path: data.backdrop_path, title: data.title })));
		} catch (error) {
			console.error('Failed to search.', error);
			toastError('Failed to search.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='flex flex-col w-[800px] h-[400px] max-w-full p-4 gap-4 bg-primary rounded-md overflow-hidden' >
			<SearchInput
				onSubmit={handleSearch}
				onChange={(e) => setQuery(e.target.value)}
				placeholder='Search for your favorite movie or TV show'
			/>
			<div className='h-full flex flex-col items-center gap-4 overflow-y-auto
				scrollbar scrollbar-thumb-primary-highlight scrollbar-track-transparent'
			>
				{backdrops ?
					backdrops.map((backdrop, index) =>
						backdrop.backdrop_path && (
							<Backdrop key={index} title={backdrop.title} backdrop_path={backdrop.backdrop_path} />
						)
					) :
					<div className='flex justify-center items-center w-full h-full'>
						<p className='text-xs text-center'>
							{!loading ?
								'Search for your favorite movie or TV show to set as your profile backdrop.'
								: 'Searching...'
							}
						</p>
					</div>
				}
			</div>
		</div>
	)
}

export default SelectBackdrop