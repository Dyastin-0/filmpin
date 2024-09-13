import { useEffect, useState } from 'react';
import { useModal } from './hooks/useModal';
import { Image as Backdrop } from './ui/Image';
import { ListBackdropDummy } from './loaders/ListSlugLoader';

const UserBackdrop = ({ backdropPath, username }) => {
	const { setModal, setOpen } = useModal();
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = `https://image.tmdb.org/t/p/original/${backdropPath}`;
		img.onload = () => {
			setImageLoaded(true);
		};
	}, []);

	const handleViewBackdrop = () => {
		setModal(
			<Backdrop imageURL={`https://image.tmdb.org/t/p/original/${backdropPath}`} name={username} />
		);
		setOpen(true);
	}

	return (
		<div className='w-full h-full'>
			{imageLoaded ?
				<img
					loading='lazy'
					className='w-full h-full object-cover rounded-md
					transition-all duration-300 hover:cursor-pointer hover:opacity-70'
					src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
					alt={`${username} backdrop`}
					onClick={handleViewBackdrop}
				/> : <ListBackdropDummy />
			}
		</div>
	)
}

export default UserBackdrop