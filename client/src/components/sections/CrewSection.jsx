import Accordion from '../ui/Accordion';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { swiperConfigNormal } from '../../configs/swiperConfig';
import { Swiper, SwiperSlide } from 'swiper/react';
import Crew from '../Crew';

const CrewSection = ({ title, crews }) => {
	const crewSwiperRef = useRef(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

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
		<Accordion title={title}>
			<section className='w-full bg-transparent overflow-hidden gap-4'>
				<div className='flex justify-center items-center gap-2 mb-4'>
					<button
						className={`text-primary-highlight text-sm ${isBeginning ? 'opacity-50' : ''}`}
						onClick={() => slidePrev(crewSwiperRef)}
						disabled={isBeginning}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<button
						className={`text-primary-highlight text-sm ${isEnd ? 'opacity-50' : ''}`}
						onClick={() => slideNext(crewSwiperRef)}
						disabled={isEnd}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
				</div>
				<Swiper
					{...swiperConfigNormal}
					ref={crewSwiperRef}
					onReachBeginning={(swiper) => swiper.activeIndex && setIsBeginning(true)}
					onReachEnd={(swiper) => swiper.activeIndex &&  setIsEnd(true)}
					onFromEdge={() => {
						setIsBeginning(false);
						setIsEnd(false);
					}}
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
