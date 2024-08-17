import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperGridConfig } from '../configs/swiperConfig';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';

const getPage = async (token, query, page) => {
	try {
		const response = await axios.get(`/movies/search/${query}/page=${page}`,{
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error('Failed to get query.', error);
	}
}

const SearchResult = () => {
	const { token } = useAuth();
	const { query } = useParams();

	const [currentQuery, setCurrentQuery] = useState(null);
	const [totalPages, setTotalPages] = useState(null);
	const [currentPage, setCurrentPage] = useState(null);
	const [results, setResults] = useState(null);

	useEffect(() => {
		if (token && query !== currentPage) {
			setCurrentQuery(query);
			const get = async () => {
				await getPage(token, query, 1).then(response => {
					setCurrentPage(response.page);
					setTotalPages(response.total_pages);
					setResults( [response.results]);
				});
			}
			get();
		}
		if (token) {
			setCurrentQuery(query);
			const get = async () => {
				await getPage(token, query, 1).then(response => {
					setCurrentPage(response.page);
					setTotalPages(response.total_pages);
					setResults(prevResults => prevResults ? [...prevResults, response.results] : [response.results]);
				});
			}
			get();
		}
	}, [token, query]);

	useEffect(() => {
		console.log(results);
	}, [results]);

	const next = async () => {
		if (currentPage === totalPages) return;
		const nextPage = currentPage + 1;
		if (nextPage >= results.length) {
			setCurrentPage(nextPage);
		}
	}

	return (
		<div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
    	<section className='w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
				<h1 className='text-primary-foreground pb-4 text-sm font-semibold'>Search results </h1>
				<Swiper {...swiperGridConfig}>
					<SwiperSlide>
						<div className='flex flex-wrap gap-3 justify-center w-full h-full'>
							{results && results[currentPage - 1].map((movie, index) => (
								<Movie key={index} info={movie} />
							))}
						</div>
					</SwiperSlide>
				</Swiper>
			</section>
		</div>
	)
}

export default SearchResult