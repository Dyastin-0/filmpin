import { Swiper, SwiperSlide } from 'swiper/react';
import { swiperConfig } from '../../configs/swiperConfig';
import Episode from '../Episode';

const EpisodeSection = ({ episodes, showId, title, backdropPath, seasonNumber }) => {
	return (
		<section className='w-full ml-4 mr-4 mb-4 bg-transparent overflow-hidden gap-4'>
			<h1 className='text-primary-foreground pb-4 text-sm font-semibold'>Episodes</h1>
			<Swiper {...swiperConfig}>
				{episodes && episodes.map((episode, index) => (
					<SwiperSlide key={index}>
						<Episode info={episode} title={title} backdropPath={backdropPath} showId={showId} seasonNumber={seasonNumber} />
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	)
}



export default EpisodeSection;