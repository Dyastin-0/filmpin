const Frame = ({ youtubeKey, title }) => {
	return (
		<div className='flex flex-col items-end w-[800px] max-h-full max-w-full bg-primary rounded-md aspect-video'>
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