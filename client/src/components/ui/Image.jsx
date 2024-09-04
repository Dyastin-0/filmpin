export const Image = ({ imageURL, name }) => {
	return (
		<div className='flex flex-col'>
			<img
				className='rounded-md h-[400px] object-contain'
				src={imageURL}
				alt={`${name} profile image`}
			/>
		</div>
	)
}
