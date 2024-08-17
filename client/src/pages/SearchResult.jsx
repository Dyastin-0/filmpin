import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperGridConfig } from '../configs/swiperConfig';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const SearchResult = () => {
	const { token } = useAuth();
	const { query } = useParams();

	console.log(query);

	useEffect(() => {
		const get = async () => {
			try {
				const response = await axios.get(`/movies/search/${query}/page=2`,{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});
				console.log(response);
			} catch (error) {
				console.error('Failed to get query.', error);
			}
		}
		token && get();	
	}, [token]);

	return (
<div className='flex flex-col bg-primary rounded-lg gap-4 p-4 items-center h-full w-full'>
    	<section className='w-full h-fit ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
				<h1 className='text-primary-foreground pb-4 text-sm font-semibold'>Search results </h1>
				<Swiper {...swiperGridConfig}>
				{/* {test.map((row, rowIndex) => (
							<SwiperSlide key={rowIndex}>
								<div className='flex flex-wrap gap-3 justify-center w-full h-full'>
									{row.map((item, itemIndex) => (
										<MovieDummy key={itemIndex} />
									))}
								</div>
							</SwiperSlide>
						))} */}
				</Swiper>
			</section>
		</div>
	)
}

export default SearchResult