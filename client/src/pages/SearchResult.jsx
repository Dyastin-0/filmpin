import { Swiper, SwiperSlide } from 'swiper/react'
import { swiperGridConfig } from '../configs/swiperConfig'
import { TrailerDummy } from '../components/loaders/TrailerLoaders'
import { MovieDummy } from '../components/loaders/MovieLoaders'

const SearchResult = () => {
	const test = [
		[1, 2, 3, 4, 6, 6],
		[1, 2, 3, 4, 5, 6],
		[1, 2, 3, 4, 5, 6],
		[1, 2, 3, 4, 5, 6],
		[1, 2, 3, 4, 5, 6],
		[1, 2, 3, 4, 5, 6],
		[1, 2, 3, 4, 5, 6],
	]
	return (
		<div className='flex flex-col bg-primary rounded-lg gap-4 p-4 justify-center items-center h-full w-full'>
		<section className='w-full m-4 bg-transparent overflow-hidden gap-4'>
			<h1 className='text-primary-foreground pb-4 text-lg font-semibold'>Test</h1>
			<Swiper {...swiperGridConfig}>
			{test.map((row, rowIndex) => (
            <SwiperSlide key={rowIndex}>
              <div className='flex flex-wrap gap-3 justify-center w-full h-full'>
                {row.map((item, itemIndex) => (
									<MovieDummy key={itemIndex} />
                ))}
              </div>
            </SwiperSlide>
          ))}
			</Swiper>
		</section>
		</div>
	)
}

export default SearchResult