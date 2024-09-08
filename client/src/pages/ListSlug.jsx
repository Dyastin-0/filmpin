import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';
import Button from '../components/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ListSlug = () => {
	const { token } = useAuth();
	const api = useAxios();
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const navigate = useNavigate();
	const [list, setList] = useState(null);
	const [listItem, setListItem] = useState(null);
	const [owner, setOwner] = useState(null);

	const getOwner = async (id) => {
		try {
			const response = await api.get(`/public/account?id=${id}`);
			return response.data.user;
		} catch (error) {
			console.log('Failed to fetch owner.', error);
		}
	}

	const getList = async (id) => {
		try {
			const response = await api.get(`/list/${id}`);
			return response.data;
		} catch (error) {
			console.error('Failed to fetch list', error);
		}
	}

	const getMovie = async (id) => {
		try {
			const response = await api.get(`/movies/details?movie_id=${id}`);
			console.log(response.data)
			return response.data;
		} catch (error) {
			console.error('Failed to fetch movie.', error);
		}
	}

	useEffect(() => {
		if (token) {
			const stateList = location.state?.list;
			if (stateList) {
				setList(stateList);
			} else {
				getList(searchParams.get('list_id')).then(response => {
					if (!response) navigate('/404');
					setList(response);
				});
			}
		}
	}, [token]);

	useEffect(() => {
		if (list) {
			Promise.all(list.list.map(item => getMovie(item.id)))
				.then(movies => {
					setListItem(movies);
				})
				.catch(error => console.error('Failed to fetch movies.', error));
		}
	}, [list]);

	useEffect(() => {
		if (list && token) {
			getOwner(list.owner)
				.then(response => setOwner(response));
		}
	}, [list, token]);

	return (
		<div className='relative flex flex-col items-center gap-4 w-full h-full bg-primary rounded-md'>
			<div className='relative flex justify-center p-4 items-center w-full max-h-[400px] rounded-md'>
				{list ?
					<img
						loading='lazy'
						className='w-full h-full object-cover rounded-md'
						src={`https://image.tmdb.org/t/p/original/${list.list[0].backdrop_path}`}
						alt={`${list.name} backdrop`}
					/> :
					<div></div>
				}
			</div>
			<motion.div
				initial={{ y: -120 }}
				className='flex flex-col gap-4 w-[calc(100%-4rem)] h-[200px] p-4 bg-accent rounded-md'
			>
				<div className='flex flex-col w-full'>
					<h1 className='text-sm text-primary-foreground font-semibold'>{list?.name}</h1>
					<h1 className='text-xs text-primary-foreground'>{list?.type}</h1>
					<div className='flex gap-1'>
						<h1 className='text-xs text-primary-foreground'>Created by</h1>
						<Link className='w-fit outline-none text-primary-foreground text-xs transition-colors duration-300 underline focus:text-primary-highlight'
							to={`/${owner?.username}`}
						>
							{owner?.username}
						</Link>
					</div>
				</div>
			</motion.div>
			<motion.div
				initial={{ marginTop: -120 }}
				className='relative flex flex-col gap-4 w-[calc(100%-4rem)] p-4 bg-accent rounded-md overflow-hidden'
			>
				<div className='flex justify-end w-full'>
					<Button text='Add a movie' icon={<FontAwesomeIcon icon={faPlus} />} />
				</div>
				{listItem && list?.type === 'movies' &&
					listItem.map((item, index) => <Movie key={index} info={item} />)
				}
			</motion.div>
		</div>
	)
}

export default ListSlug;