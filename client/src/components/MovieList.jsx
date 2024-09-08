import { useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { useNavigate } from 'react-router-dom';

const MovieList = ({ list }) => {
	const api = useAxios();
	const navigate = useNavigate();

	useEffect(() => {
		console.log(list)
	}, [list]);

	const handleClick = (listParam) => {
		navigate(`/list?list_id=${list._id}`, { state: { list: listParam } });
	}

	return (
		<div className='flex flex-col rounded-lg drop-shadow-sm gap-4 p-4 max-w-[200px] h-fit
			text-primary-foreground border border-secondary-accent
			hover:cursor-pointer'
			onClick={() => handleClick(list)}
		>
			<h1 className='text-xs text-center text-primary-foreground font-semibold'>{list?.name}</h1>
			{list.list.length >= 4 ?
				<div className='flex flex-wrap h-[240px] over rounded-md bg-black'>
					<img className='h-[120px] w-1/2' loading='lazy' src={`https://image.tmdb.org/t/p/w200/${list.list[0]?.poster_path}`} alt={``} />
					<img className='h-[120px] w-1/2' loading='lazy' src={`https://image.tmdb.org/t/p/w200/${list.list[0]?.poster_path}`} alt={``} />
					<img className='h-[120px] w-1/2' loading='lazy' src={`https://image.tmdb.org/t/p/w200/${list.list[0]?.poster_path}`} alt={``} />
					<img className='h-[120px] w-1/2' loading='lazy' src={`https://image.tmdb.org/t/p/w200/${list.list[0]?.poster_path}`} alt={``} />
				</div> :
				<img className='rounded-md' loading='lazy' src={`https://image.tmdb.org/t/p/w200/${list.list[0]?.poster_path}`} alt={``} />
			}
		</div>
	)
}

export default MovieList;