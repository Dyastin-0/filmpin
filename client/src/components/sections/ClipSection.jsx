import { SwiperSlide, Swiper } from 'swiper/react';
import { swiperConfig } from '../../configs/swiperConfig';
import { useModal } from '../hooks/useModal';
import Clip from '../Clip';
import Frame from '../Frame';

export const ClipSection = ({ title, keys }) => {
	const { setModal, setOpen } = useModal();

	const handleClick = (key) => {
		setModal(
			<Frame youtubeKey={key} />
		);
		setOpen(true);
	}

	return (
		<section className='w-full h-fit bg-transparent overflow-hidden gap-4'>
			<h1 className='text-primary-foreground pb-4 text-sm font-semibold'>{title}</h1>
			<Swiper {...swiperConfig}>
				{keys?.map((key, index) => (
					<SwiperSlide className='max-h-fit' key={index}>
						<Clip
							title={key.name}
							trailerKey={key.value}
							key={index}
							onClick={() => handleClick(key.value)}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</section>
	);
}