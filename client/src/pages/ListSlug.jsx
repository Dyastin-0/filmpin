import { useEffect, useState } from 'react';
import useAxios from '../hooks/useAxios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Movie from '../components/Movie';
import { io } from 'socket.io-client';
import listTypes from '../models/listTypes';
import { useToast } from '../components/hooks/useToast';
import TvShow from '../components/TvShow';
import { ListBackdropDummy, ListTitleDummy } from '../components/loaders/ListSlugLoader';
import { LoadingDiscover as ListLoder } from '../components/loaders/MovieLoaders';

const ListSlug = () => {
	const { token, user } = useAuth();
	const api = useAxios();
	const [searchParams] = useSearchParams();
	const { toastInfo } = useToast();
	const navigate = useNavigate();
	const [list, setList] = useState(null);
	const [listItem, setListItem] = useState(null);
	const [owner, setOwner] = useState(null);

	const getOwner = async (id) => {
		try {
			const response = await api.get(`/public/account?id=${id}`);
			return response.data.user;
		} catch (error) {
			console.error('Failed to fetch owner.', error);
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
			return response.data;
		} catch (error) {
			console.error('Failed to fetch movie.', error);
		}
	}

	const getShow = async (id) => {
		try {
			const response = await api.get(`/tvshows/details?show_id=${id}`);
			return response.data;
		} catch (error) {
			console.error('Failed to fetch movie.', error);
		}
	}

	useEffect(() => {
		if (token && user && list && owner) {
			const randomId = crypto.randomUUID();
			const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
				extraHeaders: {
					Authorization: `Bearer ${token}`
				},
				query: {
					owner: list.owner,
					accesor: user._id,
					randomId: randomId,
					targetStream: 'list',
				}
			});

			newSocket.on(`stream/list/${list.owner}/${user._id}/${randomId}`, (change) => {
				if (change.type === 'delete') {
					setListItem((prevList) => prevList.filter((list) => list._id !== change.list));
				} else {
					setListItem((prevList) => {
						const newList = change.list.find(ojectList => !prevList.some(prevObjectList => ojectList._id === prevObjectList._id));
						if (owner._id !== user._id)
							toastInfo(`${owner?.username} just added ${newList.title} to this list.`);
						return change.list;
					});
				}
			});
			return () => newSocket.disconnect();
		}
	}, [token, list, user, owner]);

	useEffect(() => {
		if (token) {
			getList(searchParams.get('list_id')).then(response => {
				if (!response) navigate('/404');
				setList(response);
			});
		}
	}, [token]);

	useEffect(() => {
		if (list) {
			Promise.all(list.list.map(item => listTypes[list.type] === 'Movies' ? getMovie(item.id) : getShow(item.id)))
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
		<div className='relative flex flex-col items-center p-4 gap-4 w-full h-full bg-primary rounded-md'>
			<div className='relative flex justify-center items-center w-full max-h-[400px] rounded-md'>
				{list ?
					<img
						loading='lazy'
						className='w-full h-full object-cover rounded-md'
						src={`https://image.tmdb.org/t/p/original/${list.list[0].backdrop_path}`}
						alt={`${list.name} backdrop`}
					/> :
					<ListBackdropDummy />
				}
			</div>
			<motion.div
				initial={{ y: -120 }}
				className='flex flex-col gap-4 w-[calc(100%-2rem)] p-4 bg-accent rounded-md'
			>
				{list ?
					<div className='flex flex-col gap-4 w-full'>
						<h1 className='text-sm text-primary-foreground font-semibold'>{list.name}</h1>
						<p className='text-xs text-primary-foreground'>{list.description}</p>
						<div className='flex gap-1'>
							<h1 className='text-xs text-primary-foreground'>{`List of ${listTypes[list.type]} created by`}</h1>
							<Link className='w-fit outline-none text-primary-foreground text-xs transition-colors duration-300 underline hover:text-primary-highlight focus:text-primary-highlight'
								to={`/${owner?.username}`}
							>
								{owner?.username}
							</Link>
						</div>
					</div> : <ListTitleDummy />
				}
			</motion.div>
			<motion.div
				initial={{ marginTop: -120 }}
				className='relative flex flex-col items-center gap-4 w-[calc(100%-2rem)] p-4 bg-accent rounded-md overflow-hidden'
			>
				{listItem ?
					<div className='flex flex-wrap justify-center gap-4'>
						{listTypes[list?.type] === 'Movies' ?
							listItem?.map((item, index) => <Movie key={index} info={item} />)
							: listItem?.map((item, index) => <TvShow key={index} info={item} />)
						}
					</div> :
					<ListLoder />
				}
			</motion.div>
		</div>
	)
}

export default ListSlug;