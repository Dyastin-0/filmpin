import { useModal } from "./hooks/useModal"
import { Image } from "./ui/Image";

const UserBackdrop = ({ backdropPath, username }) => {
	const { setModal, setOpen } = useModal();

	const handleViewBackdrop = () => {
		setModal(
			<Image imageURL={`https://image.tmdb.org/t/p/original/${backdropPath}`} name={username} />
		);
		setOpen(true);
	}

	return (
		<div className='w-full h-full'>
			<img
				loading='lazy'
				className='w-full h-full object-cover rounded-md
				transition-all duration-300 hover:cursor-pointer hover:opacity-70'
				src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
				alt={`${username} backdrop`}
				onClick={handleViewBackdrop}
			/>
		</div>
	)
}

export default UserBackdrop