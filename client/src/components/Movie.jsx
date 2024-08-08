const Movie = ({info}) => {
	console.log(info);
	return (
		<div className="flex flex-col p-3 ga-3 rounded-lg bg-white w-[300px] h-[500px]">
			<img className='rounded-md' src={`https://image.tmdb.org/t/p/w200/${info.poster_path}`} alt={`${info.original_title} poster`} />
			<h1> {info.original_title} </h1>
		</div>
	)
}

export default Movie