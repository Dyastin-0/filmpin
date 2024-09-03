
const UserBackdrop = ({ backdropPath, username }) => {
	return (
		<div className='w-full h-full'>
			<img
				loading='lazy'
				className='w-full h-full object-cover rounded-md'
				src={`https://image.tmdb.org/t/p/original/${backdropPath}`}
				alt={`${username} backdrop`}
			/>
		</div>
	)
}

export default UserBackdrop