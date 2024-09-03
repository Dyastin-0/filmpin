import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios"

export const Backdrop = ({ backdrop_path, title }) => {
	const api = useAxios();
	const { user, setUser } = useAuth();

	const handleSetBackdrop = async (backdrop_path) => {
		try {
			const response = await api.post(`/account/set-backdrop?user_id=${user.id}&backdrop_path=${backdrop_path}`);
			const backdrop = response.data.backdropPath;
			setUser(prev => ({
				...prev,
				backdropPath: backdrop
			}))
		} catch (error) {
			console.error('Failed to set backdrop.', error);
		}
	}

	return (
		<div className='flex flex-col gap-2 hover:scale-95 hover:cursor-pointer'
			onClick={() => handleSetBackdrop(backdrop_path)}
		>
			<img
				loading='lazy'
				className='w-[300px] h-[150px] object-cover rounded-md'
				src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
				alt={`${title} backdrop`}
			/>
			<h1 className='text-center text-primary-foreground text-xs font-semibold'>{title}</h1>
		</div>
	)
}
