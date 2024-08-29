const Frame = ({ youtubeKey, title }) => {
	return (
		<div className='w-full max-w-[100%] lg:max-w-[70%] m-4 aspect-video'>
			<iframe
				className='w-full h-full rounded-lg'
				src={`https://youtube.com/embed/${youtubeKey}`}
				title={title}
				allowFullScreen
			/>
		</div>
	);
}

export default Frame;