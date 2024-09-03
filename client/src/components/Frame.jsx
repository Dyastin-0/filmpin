const Frame = ({ youtubeKey, title }) => {
	return (
		<div className='w-[800px] max-w-full aspect-video'>
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