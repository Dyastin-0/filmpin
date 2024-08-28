import Accordion from '../ui/Accordion';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import { swiperConfigNormal } from '../../configs/swiperConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import Crew from '../Crew';

const CrewSection = ({ title, crews }) => {
	const crewSwiperRef = useRef(null);
	const slideNext = (swiperRef) => {
		if (swiperRef.current) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const slidePrev = (swiperRef) => {
		if (swiperRef.current) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	return (
		<Accordion
			title={title}
		>
			<section className='w-full bg-transparent overflow-hidden gap-4'>
				<div className='flex gap-2 mb-4 w-fit'>
					<button
						className='text-primary-highlight text-sm'
						onClick={() => slidePrev(crewSwiperRef)}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<button
						className='text-primary-highlight text-sm'
						onClick={() => slideNext(crewSwiperRef)}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
				</div>
				<Swiper
					{...swiperConfigNormal}
					ref={crewSwiperRef}
				>
					{crews && crews.map((crew, index) => (
						<SwiperSlide key={index}>
							<Crew info={crew} className='w-fit' />
						</SwiperSlide>
					))}
				</Swiper>
			</section>
		</Accordion>
	)
}

export default CrewSection;