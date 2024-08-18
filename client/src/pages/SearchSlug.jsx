import { useParams } from 'react-router-dom';
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
	const { token } = useAuth();
	const { query } = useParams();

	const [currentQuery, setCurrentQuery] = useState(null);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [results, setResults] = useState({});

	useEffect(() => {
		if ((query !== currentQuery || currentQuery === null) && token) {
			const getNewQuery = async () => {
				const response = await getPage(token, query, 1);
				setCurrentPage(response.page);
				setTotalPages(response.total_pages);
				setResults({ [response.page]: response.results });
				setCurrentQuery(query);
			};
			getNewQuery();
		}
	}, [token, query, currentQuery]);

	const onPageChange = async (page) => {
		if (!results[page]) {
			const response = await getPage(token, query, page);
			setResults((prevResults) => ({
				...prevResults,
				[page]: response.results,
			}));
		}
		setCurrentPage(page);
	};

	useEffect(() => {
		window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
	}, [currentPage]);

	return (
		results[currentPage] ? 
		<div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
			<h1 className='text-primary-foreground text-sm text-start w-full font-semibold'>Results</h1>
			<section className='relative w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
					<div className='flex flex-wrap justify-center gap-3 w-full h-full'>
						{results[currentPage] && results[currentPage].map((movie, index) => (
							<Movie key={index} info={movie} />
						))}
					</div>
			</section>
			{totalPages > 1 && (
				<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
			)}
		</div> :
		<LoadingSearchResult title='Results' />
	);
};

export default SearchResult;
