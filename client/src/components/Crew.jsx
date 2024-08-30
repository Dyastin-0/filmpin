const Crew = ({ info, className }) => {
	return (
		<div className={`flex gap-2 justify-center items-center w-fit ${className}`}>
			{info.profile_path ?
				<img
					className='rounded-full w-[40px] h-[40px] object-cover'
					loading='lazy'
					src={`https://image.tmdb.org/t/p/w92/${info.profile_path}`}
					alt={`${info.name} profile`}
				/> : <div className='w-[40px] h-[40px] rounded-full bg-secondary'> </div>
			}
			<div>
				<h1 className='text-primary-highlight text-xs font-semibold'>{info.name}</h1>
				<h1 className='text-secondary-foreground text-xs font-semibold line-clamp-1 text-ellipsis'>{info.job}</h1>
			</div>
		</div>
	)
}

export default Crew;