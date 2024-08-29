import Accordion from '../ui/Accordion';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState, useEffect } from 'react';
import { swiperConfigNormal } from '../../configs/swiperConfig';
import Cast from '../Cast';
import { Swiper, SwiperSlide } from 'swiper/react';

const CastSection = ({ title, casts }) => {
	const castSwiperRef = useRef(null);
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
				<div className='flex justify-center items-center mb-4 gap-2'>
					<button
						className={`text-primary-highlight text-sm ${isBeginning ? 'opacity-50' : ''}`}
						onClick={() => slidePrev(castSwiperRef)}
						disabled={isBeginning}
					>
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<button
						className={`text-primary-highlight text-sm ${isEnd ? 'opacity-50' : ''}`}
						onClick={() => slideNext(castSwiperRef)}
						disabled={isEnd}
					>
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
				</div>
				<Swiper
					{...swiperConfigNormal}
					ref={castSwiperRef}
					onReachBeginning={(swiper) => swiper.activeIndex && setIsBeginning(true)}
					onReachEnd={(swiper) => swiper.activeIndex &&  setIsEnd(true)}
					onFromEdge={() => {
						setIsBeginning(false);
						setIsEnd(false);
					}}
				>
					{casts && casts.map((cast, index) => (
						<SwiperSlide key={index}>
							<Cast info={cast} className='w-fit' />
						</SwiperSlide>
					))}
				</Swiper>
			</section>
		</Accordion>
	)
}

export default CastSection;
